/**
 * QuantumGate Cloud Lab - Main Application Controller
 * Handles student authentication, navigation, state management,
 * interactive circuit builder, measurement visualizer, analytics,
 * and 25-question assessment lifecycle.
 */

(function () {
  'use strict';

  // Storage Keys
  const STORAGE_KEYS = {
    STUDENT_NAME: 'quantumgate_student_name',
    PROGRESS_MODULES: 'quantumgate_modules_completed',
    PROGRESS_GATES: 'quantumgate_gates_studied',
    LAB_EXPERIMENTS_COUNT: 'quantumgate_lab_experiments_count',
    CIRCUITS_EXECUTED_COUNT: 'quantumgate_circuits_executed_count',
    ASSESSMENT_ATTEMPTS: 'quantumgate_assessment_attempts',
    LAST_CIRCUIT: 'quantumgate_last_circuit'
  };

  class QuantumGateApp {
    constructor() {
      this.studentName = localStorage.getItem(STORAGE_KEYS.STUDENT_NAME) || '';
      this.currentView = 'dashboard';
      
      // Curriculum & Gates State
      this.completedModules = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS_MODULES) || '[]');
      this.studiedGates = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS_GATES) || '[]');
      this.labExperimentsCount = parseInt(localStorage.getItem(STORAGE_KEYS.LAB_EXPERIMENTS_COUNT) || '0', 10);
      this.circuitsExecutedCount = parseInt(localStorage.getItem(STORAGE_KEYS.CIRCUITS_EXECUTED_COUNT) || '0', 10);
      this.assessmentAttempts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS) || '[]');

      // Learning Academy Active Module
      this.activeModuleIndex = 0;

      // Quantum Gates Active Gate
      this.activeGateId = 'H';

      // Circuit Lab State
      this.numQubits = 2;
      this.numCols = 5;
      this.initialQubits = [0, 0, 0, 0]; // 0 or 1 for each qubit
      this.circuitGrid = this.createEmptyCircuitGrid(2, 5);
      this.selectedPaletteGate = null;
      this.pendingTwoQubitGate = null; // { type, col, controlQubit }
      this.engine = new QuantumCircuitEngine(this.numQubits);
      this.lastExecutionResult = null;
      this.selectedGateForInspection = null;

      // Measurement State
      this.activeShots = 1000;
      this.lastShotResults = null;

      // Assessment State
      this.quizQuestions = window.ASSESSMENT_QUESTIONS || [];
      this.currentQuizIndex = 0;
      this.userQuizAnswers = {}; // { questionId: selectedIndex }
      this.latestQuizResult = null;

      // Initialize
      this.init();
    }

    init() {
      // Set student name or prompt login
      if (!this.studentName) {
        this.showLoginModal();
      } else {
        this.updateStudentProfileUI();
      }

      // Initialize Views
      this.initLearningAcademy();
      this.initGatesCatalog();
      this.initCircuitLab();
      this.initMeasurementView();
      this.initAnalyticsView();
      this.initAssessment();

      // Load initial preset (Hadamard Superposition)
      this.loadCircuitPreset('hadamard-superposition', false);
      this.runCircuit(false);

      // Render Dashboard metrics
      this.updateOverallProgress();

      // Setup window resize / mobile nav closing
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
          const menu = document.getElementById('navMenu');
          if (menu) menu.classList.remove('open');
        }
      });
    }

    /* ------------------------------------------------------------------------
       STUDENT LOGIN & AUTH (PRD Section 2)
       ------------------------------------------------------------------------ */
    showLoginModal() {
      const modal = document.getElementById('loginModal');
      const input = document.getElementById('studentNameInput');
      if (modal) modal.classList.add('active');
      if (input) {
        input.value = this.studentName || '';
        setTimeout(() => input.focus(), 100);
      }
    }

    handleStudentLogin() {
      const input = document.getElementById('studentNameInput');
      const name = input ? input.value.trim() : '';
      if (!name) return;

      this.studentName = name;
      localStorage.setItem(STORAGE_KEYS.STUDENT_NAME, name);

      const modal = document.getElementById('loginModal');
      if (modal) modal.classList.remove('active');

      this.updateStudentProfileUI();
      this.showToast(`Welcome to QuantumGate Lab, ${name}! 👋`, 'success');
      this.updateOverallProgress();
    }

    promptChangeName() {
      const newName = prompt('Enter student name:', this.studentName);
      if (newName && newName.trim()) {
        this.studentName = newName.trim();
        localStorage.setItem(STORAGE_KEYS.STUDENT_NAME, this.studentName);
        this.updateStudentProfileUI();
        this.showToast(`Student name updated to ${this.studentName}`, 'info');
      }
    }

    updateStudentProfileUI() {
      const name = this.studentName || 'Student';
      const initial = name.charAt(0).toUpperCase();

      const elAvatar = document.getElementById('studentAvatar');
      const elHeaderName = document.getElementById('headerStudentName');
      const elWelcomeTitle = document.getElementById('dashboardWelcomeTitle');

      if (elAvatar) elAvatar.textContent = initial;
      if (elHeaderName) elHeaderName.textContent = name;
      if (elWelcomeTitle) elWelcomeTitle.textContent = `Welcome, ${name}! 👋`;
    }

    /* ------------------------------------------------------------------------
       NAVIGATION (PRD Section 16)
       ------------------------------------------------------------------------ */
    switchView(viewName) {
      this.currentView = viewName;

      // Update Nav links
      document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.view === viewName) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Update View sections
      document.querySelectorAll('.view-section').forEach(sec => {
        if (sec.id === `view-${viewName}`) {
          sec.classList.add('active');
        } else {
          sec.classList.remove('active');
        }
      });

      // Close mobile menu if open
      const menu = document.getElementById('navMenu');
      if (menu) menu.classList.remove('open');

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Specific view refreshes
      if (viewName === 'analytics') {
        this.renderAnalytics();
      } else if (viewName === 'measurement') {
        this.renderMeasurementView();
      } else if (viewName === 'lab') {
        this.renderCircuitCanvas();
      }
    }

    toggleMobileMenu() {
      const menu = document.getElementById('navMenu');
      if (menu) menu.classList.toggle('open');
    }

    showToast(message, type = 'info') {
      const container = document.getElementById('toastContainer');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `<span>${type === 'success' ? '✓' : 'ℹ'}</span> <span>${message}</span>`;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }

    /* ------------------------------------------------------------------------
       LEARNING ACADEMY (PRD Section 4)
       ------------------------------------------------------------------------ */
    initLearningAcademy() {
      this.renderLearningSidebar();
      this.renderActiveModule();
    }

    renderLearningSidebar() {
      const sidebar = document.getElementById('modulesSidebar');
      if (!sidebar) return;

      const modules = window.LEARNING_MODULES || [];
      sidebar.innerHTML = modules.map((mod, index) => {
        const isCompleted = this.completedModules.includes(mod.id);
        const isActive = index === this.activeModuleIndex;

        return `
          <button class="module-nav-item ${isActive ? 'active' : ''}" onclick="window.App.selectModule(${index})">
            <div class="mod-nav-left">
              <span class="mod-num-badge">${mod.number}</span>
              <div>
                <div class="mod-nav-title">${mod.title}</div>
                <div style="font-size:0.75rem; color:var(--text-dim);">${mod.duration}</div>
              </div>
            </div>
            <span class="mod-check-status ${isCompleted ? 'completed' : ''}">
              ${isCompleted ? '✓' : '○'}
            </span>
          </button>
        `;
      }).join('');
    }

    selectModule(index) {
      this.activeModuleIndex = index;
      this.renderLearningSidebar();
      this.renderActiveModule();
    }

    renderActiveModule() {
      const container = document.getElementById('moduleContentArea');
      if (!container) return;

      const modules = window.LEARNING_MODULES || [];
      const mod = modules[this.activeModuleIndex];
      if (!mod) return;

      const isCompleted = this.completedModules.includes(mod.id);
      const isFirst = this.activeModuleIndex === 0;
      const isLast = this.activeModuleIndex === modules.length - 1;

      container.innerHTML = `
        <div class="mod-header">
          <div class="mod-meta-tags">
            <span class="meta-tag topic">${mod.topicTag}</span>
            <span class="meta-tag duration">⏱ ${mod.duration}</span>
            <span class="meta-tag" style="background:rgba(255,255,255,0.06); color:var(--cyan);">Module ${mod.number} / 0${modules.length}</span>
          </div>
          <h2 class="mod-title">${mod.icon} ${mod.title}</h2>
          <p class="mod-summary">${mod.summary}</p>
        </div>

        <div class="mod-body">
          ${mod.contentHtml}
        </div>

        <!-- Interactive Checkpoint -->
        <div class="checkpoint-container">
          <div class="checkpoint-header">
            <span>⚡ Interactive Checkpoint</span>
          </div>
          <div class="checkpoint-question">${mod.checkpoint.question}</div>
          <div class="checkpoint-options" id="chkOptionsList">
            ${mod.checkpoint.options.map((opt, i) => `
              <label class="chk-opt-label" id="chkOpt_${i}">
                <input type="radio" name="chkRadio" value="${i}" style="accent-color:var(--cyan);" onchange="window.App.checkCheckpointAnswer(${i})" />
                <span>${opt}</span>
              </label>
            `).join('')}
          </div>
          <div id="chkFeedbackBox" class="checkpoint-feedback"></div>
        </div>

        <div class="module-action-bar">
          <button class="btn btn-secondary" onclick="window.App.selectModule(${this.activeModuleIndex - 1})" ${isFirst ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
            ← Previous Module
          </button>
          
          <button class="btn ${isCompleted ? 'btn-secondary' : 'btn-success'}" onclick="window.App.toggleModuleCompletion('${mod.id}')">
            ${isCompleted ? '✓ Completed (Click to Reset)' : 'Mark as Completed ✓'}
          </button>

          <button class="btn btn-primary" onclick="window.App.selectModule(${this.activeModuleIndex + 1})" ${isLast ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
            Next Module →
          </button>
        </div>
      `;
    }

    checkCheckpointAnswer(selectedIndex) {
      const modules = window.LEARNING_MODULES || [];
      const mod = modules[this.activeModuleIndex];
      if (!mod) return;

      const feedbackBox = document.getElementById('chkFeedbackBox');
      const isCorrect = selectedIndex === mod.checkpoint.correctIndex;

      // Update options styling
      mod.checkpoint.options.forEach((_, i) => {
        const el = document.getElementById(`chkOpt_${i}`);
        if (el) {
          el.classList.remove('correct', 'incorrect', 'selected');
          if (i === selectedIndex) {
            el.classList.add(isCorrect ? 'correct' : 'incorrect');
          }
          if (i === mod.checkpoint.correctIndex && !isCorrect) {
            el.classList.add('correct');
          }
        }
      });

      if (feedbackBox) {
        feedbackBox.className = `checkpoint-feedback ${isCorrect ? 'success' : 'error'}`;
        feedbackBox.innerHTML = `
          <strong>${isCorrect ? '🎉 Correct!' : '⚠️ Not quite.'}</strong>
          <div>${mod.checkpoint.explanation}</div>
        `;
      }
    }

    toggleModuleCompletion(moduleId) {
      const idx = this.completedModules.indexOf(moduleId);
      if (idx >= 0) {
        this.completedModules.splice(idx, 1);
        this.showToast('Module marked as uncompleted', 'info');
      } else {
        this.completedModules.push(moduleId);
        this.showToast('🎉 Module marked as completed!', 'success');
      }

      localStorage.setItem(STORAGE_KEYS.PROGRESS_MODULES, JSON.stringify(this.completedModules));
      this.renderLearningSidebar();
      this.renderActiveModule();
      this.updateOverallProgress();
    }

    /* ------------------------------------------------------------------------
       QUANTUM GATES CATALOG & SANDBOX (PRD Section 5)
       ------------------------------------------------------------------------ */
    initGatesCatalog() {
      this.renderGatesSelectorBar();
      this.renderActiveGate();
    }

    renderGatesSelectorBar() {
      const bar = document.getElementById('gatesSelectorBar');
      if (!bar) return;

      const gates = window.QUANTUM_GATES || [];
      bar.innerHTML = gates.map(gate => {
        const isActive = gate.id === this.activeGateId;
        const isStudied = this.studiedGates.includes(gate.id);
        return `
          <button class="gate-pill-btn ${isActive ? 'active' : ''}" onclick="window.App.selectGate('${gate.id}')">
            <span class="gate-token-badge" style="color:${gate.badgeColor};">${gate.symbol}</span>
            <span>${gate.name}</span>
            ${isStudied ? '<span style="color:var(--emerald); font-size:0.75rem;">✓</span>' : ''}
          </button>
        `;
      }).join('');
    }

    selectGate(gateId) {
      this.activeGateId = gateId;
      this.renderGatesSelectorBar();
      this.renderActiveGate();
    }

    renderActiveGate() {
      const detailsContainer = document.getElementById('gateDetailsCard');
      const sandboxContainer = document.getElementById('gateSandboxCard');
      const gates = window.QUANTUM_GATES || [];
      const gate = gates.find(g => g.id === this.activeGateId) || gates[0];
      if (!gate) return;

      const isStudied = this.studiedGates.includes(gate.id);

      // Render Details
      if (detailsContainer) {
        detailsContainer.innerHTML = `
          <div class="gate-main-header">
            <div class="gate-title-wrap">
              <div class="gate-symbol-badge-lg" style="background:rgba(255,255,255,0.06); border:1px solid ${gate.badgeColor}; color:${gate.badgeColor};">
                ${gate.symbol}
              </div>
              <div class="gate-heading-text">
                <h2>${gate.name}</h2>
                <div class="subtitle">${gate.subtitle}</div>
              </div>
            </div>
            <button class="btn ${isStudied ? 'btn-secondary' : 'btn-success'} btn-sm" onclick="window.App.toggleGateStudied('${gate.id}')">
              ${isStudied ? '✓ Studied' : 'Mark as Studied'}
            </button>
          </div>

          <div class="gate-section-title">Concept & Behavior</div>
          <p class="gate-explanation-text">${gate.simpleExplanation}</p>

          <div class="analogy-card">
            <div class="analogy-badge">Intuitive Analogy</div>
            <p style="margin:0; font-size:0.95rem; color:#fef3c7;">${gate.intuitiveAnalogy}</p>
          </div>

          <div class="gate-section-title" style="margin-top:1.5rem;">Unitary Matrix Representation</div>
          <div class="gate-math-block">
            <div style="font-family:var(--font-mono); font-size:0.9rem; color:var(--text-muted); margin-bottom:0.5rem; text-align:center;">
              ${gate.mathEquation}
            </div>
            <div class="matrix-render">
              <span>U = </span>
              <div class="matrix-grid" style="grid-template-columns: repeat(${gate.matrix[0].length}, 1fr);">
                ${gate.matrix.map(row => row.map(cell => `<div>${cell}</div>`).join('')).join('')}
              </div>
            </div>
          </div>

          <div class="gate-section-title">Input / Output Transformations</div>
          <table class="truth-table">
            <thead><tr><th>Input State</th><th>Output State</th><th>Transformation Description</th></tr></thead>
            <tbody>
              ${gate.inputOutput.map(io => `
                <tr>
                  <td><code>${io.input}</code></td>
                  <td><strong style="color:var(--cyan);">${io.output}</strong></td>
                  <td style="color:var(--text-muted); font-size:0.85rem;">${io.desc}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top:1.25rem; font-size:0.9rem; color:var(--text-muted);">
            <strong style="color:var(--purple);">Bloch Sphere Effect:</strong> ${gate.blochEffect}
          </div>

          <div style="margin-top:1.75rem; display:flex; gap:0.75rem; flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" onclick="window.App.tryGateInLab('${gate.id}')" title="Place this gate into the Quantum Lab simulator">
              🔬 Try in Quantum Lab ➔
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.App.switchView('learn')" title="Read theoretical module in Academy">
              📖 Read in Academy
            </button>
          </div>
        `;
      }

      // Render Sandbox "Try This Gate"
      if (sandboxContainer) {
        this.renderGateSandbox(gate);
      }
    }

    renderGateSandbox(gate) {
      const container = document.getElementById('gateSandboxCard');
      if (!container) return;

      const availStates = gate.interactiveDefaults.availableStates;
      const currentState = this.activeSandboxState || gate.interactiveDefaults.defaultState;
      this.activeSandboxState = currentState;

      container.innerHTML = `
        <div class="sandbox-header">
          <h3><span>🧪</span> Try This Gate</h3>
          <span class="sandbox-badge">Live Interactive Simulator</span>
        </div>
        <p style="font-size:0.92rem; color:var(--text-muted); margin-bottom:1.25rem;">
          Select an input state below to apply the <strong>${gate.name}</strong> and observe the transformed quantum state vector and probabilities in real time:
        </p>

        <div class="sandbox-control-group">
          <label>Select Input State:</label>
          <div class="state-selector-pills">
            ${availStates.map(st => `
              <button class="state-pill-btn ${st.val === currentState ? 'active' : ''}" onclick="window.App.setSandboxInputState('${gate.id}', '${st.val}')">
                ${st.label}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="sandbox-output-box" id="sandboxOutputArea">
          <!-- Populated by calculateGateSandboxOutput -->
        </div>
      `;

      this.calculateGateSandboxOutput(gate, currentState);
    }

    setSandboxInputState(gateId, stateVal) {
      this.activeSandboxState = stateVal;
      const gates = window.QUANTUM_GATES || [];
      const gate = gates.find(g => g.id === gateId);
      if (gate) {
        this.renderGateSandbox(gate);
      }
    }

    calculateGateSandboxOutput(gate, stateVal) {
      const outputArea = document.getElementById('sandboxOutputArea');
      if (!outputArea) return;

      // Single or 2-qubit simulation
      const isTwoQubit = gate.category === 'Two Qubits';
      const sim = new QuantumCircuitEngine(isTwoQubit ? 2 : 1);

      if (!isTwoQubit) {
        // Set single-qubit input
        if (stateVal === '0') {
          sim.resetState([0]);
        } else if (stateVal === '1') {
          sim.resetState([1]);
        } else if (stateVal === '+') {
          sim.resetState([0]);
          sim.applyH(0);
        }

        // Apply active gate
        switch (gate.id) {
          case 'X': sim.applyX(0); break;
          case 'Y': sim.applyY(0); break;
          case 'Z': sim.applyZ(0); break;
          case 'H': sim.applyH(0); break;
          case 'S': sim.applyS(0); break;
          case 'T': sim.applyT(0); break;
          default: break;
        }
      } else {
        // Two-qubit
        if (stateVal === '00') sim.resetState([0, 0]);
        else if (stateVal === '10') sim.resetState([1, 0]);
        else if (stateVal === '01') sim.resetState([0, 1]);
        else if (stateVal === '11') sim.resetState([1, 1]);
        else if (stateVal === 'bell') {
          sim.resetState([0, 0]);
          sim.applyH(0);
          sim.applyCNOT(0, 1);
        }

        if (stateVal !== 'bell') {
          if (gate.id === 'CNOT') sim.applyCNOT(0, 1);
          if (gate.id === 'SWAP') sim.applySWAP(0, 1);
        }
      }

      const probs = sim.getProbabilities();
      const bloch = sim.getQubitBlochCoordinates(0);

      // Build state vector string
      const nonZeroAmps = probs.filter(p => p.probability > 0.001);
      const stateStr = nonZeroAmps.map(p => {
        const ampStr = p.amplitude.toString(2);
        return `(${ampStr})${p.label}`;
      }).join(' + ') || '|0⟩';

      outputArea.innerHTML = `
        <div style="font-size:0.8rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:0.25rem;">Transformed State Vector:</div>
        <div class="state-vector-result">|ψ⟩ = ${stateStr}</div>

        <div style="font-size:0.8rem; text-transform:uppercase; color:var(--text-dim); margin-bottom:0.5rem;">Measurement Probabilities:</div>
        <div class="prob-bars-list">
          ${probs.map(p => `
            <div class="prob-bar-item">
              <span class="prob-state-lbl">${p.label}</span>
              <div class="prob-bar-track">
                <div class="prob-bar-fill" style="width: ${p.percentage}%;"></div>
              </div>
              <span class="prob-val-text">${p.percentage}%</span>
            </div>
          `).join('')}
        </div>

        ${!isTwoQubit ? `
          <div style="margin-top:1.25rem; padding-top:1rem; border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:0.82rem; color:var(--text-muted);">
            <span>Bloch Coordinates:</span>
            <span>x: <b style="color:var(--cyan);">${bloch.x.toFixed(2)}</b>, y: <b style="color:var(--cyan);">${bloch.y.toFixed(2)}</b>, z: <b style="color:var(--cyan);">${bloch.z.toFixed(2)}</b></span>
            <span>θ: <b style="color:var(--purple);">${bloch.thetaDeg}°</b>, φ: <b style="color:var(--purple);">${bloch.phiDeg}°</b></span>
          </div>
        ` : ''}
      `;
    }

    toggleGateStudied(gateId) {
      const idx = this.studiedGates.indexOf(gateId);
      if (idx >= 0) {
        this.studiedGates.splice(idx, 1);
        this.showToast('Gate marked as not studied', 'info');
      } else {
        this.studiedGates.push(gateId);
        this.showToast('Gate marked as studied! 🎓', 'success');
      }
      localStorage.setItem(STORAGE_KEYS.PROGRESS_GATES, JSON.stringify(this.studiedGates));
      this.renderGatesSelectorBar();
      this.renderActiveGate();
      this.updateOverallProgress();
    }

    /* ------------------------------------------------------------------------
       QUANTUM LAB (CIRCUIT SIMULATOR) - PRD Section 6 & 7
       ------------------------------------------------------------------------ */
    initCircuitLab() {
      this.renderCircuitCanvas();
      this.setupPaletteDragAndDrop();
      this.updateInspectorWithGate({
        type: 'H',
        id: 'H',
        role: 'single',
        explanation: 'Hadamard gate transforms basis state |0⟩ into equal superposition (|0⟩ + |1⟩)/√2.'
      });
    }

    setupPaletteDragAndDrop() {
      const tokens = document.querySelectorAll('.gate-token');
      tokens.forEach(token => {
        token.setAttribute('draggable', 'true');
        token.ondragstart = (e) => {
          const gateType = token.dataset.gate;
          if (e.dataTransfer) {
            e.dataTransfer.setData('text/plain', gateType);
            e.dataTransfer.effectAllowed = 'copy';
          }
          this.selectedPaletteGate = gateType;
          token.classList.add('selected-for-placement');
        };
        token.ondragend = () => {
          token.classList.remove('selected-for-placement');
        };
      });
    }

    handleSlotDrop(colIdx, qubitIdx, e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const gateType = (e && e.dataTransfer && e.dataTransfer.getData('text/plain')) || this.selectedPaletteGate;
      if (!gateType) return;
      this.selectedPaletteGate = gateType;
      this.handleSlotClick(colIdx, qubitIdx);
    }

    tryGateInLab(gateId) {
      this.numQubits = (gateId === 'CNOT' || gateId === 'SWAP') ? 2 : 2;
      this.circuitGrid = this.createEmptyCircuitGrid(this.numQubits, this.numCols);
      this.initialQubits = [0, 0, 0, 0];

      if (gateId === 'CNOT') {
        this.circuitGrid[0][0] = { type: 'H', id: 'H' };
        this.circuitGrid[1][0] = { type: 'CNOT', role: 'control', target: 1 };
        this.circuitGrid[1][1] = { type: 'CNOT', role: 'target', control: 0 };
        this.circuitGrid[2][0] = { type: 'MEASURE', id: 'MEASURE' };
        this.circuitGrid[2][1] = { type: 'MEASURE', id: 'MEASURE' };
      } else if (gateId === 'SWAP') {
        this.circuitGrid[0][0] = { type: 'X', id: 'X' };
        this.circuitGrid[1][0] = { type: 'SWAP', target: 1 };
        this.circuitGrid[1][1] = { type: 'SWAP', target: 0 };
      } else {
        this.circuitGrid[0][0] = { type: gateId, id: gateId };
        this.circuitGrid[1][0] = { type: 'MEASURE', id: 'MEASURE' };
      }

      this.switchView('lab');
      this.renderCircuitCanvas();
      this.runCircuit(true);
      this.updateInspectorWithGate(this.circuitGrid[0][0] || this.circuitGrid[1][0], 0);
      this.showToast(`Loaded ${gateId} Gate into Quantum Lab! Run and experiment with it.`, 'success');
    }

    createEmptyCircuitGrid(numQubits, numCols) {
      const grid = [];
      for (let c = 0; c < numCols; c++) {
        grid.push(new Array(numQubits).fill(null));
      }
      return grid;
    }

    changeQubitCount(count) {
      const newCount = Math.max(2, Math.min(4, count));
      this.numQubits = newCount;
      this.engine.setNumQubits(newCount);
      this.circuitGrid = this.createEmptyCircuitGrid(newCount, this.numCols);
      this.renderCircuitCanvas();
      this.runCircuit(false);
      this.showToast(`Circuit updated to ${newCount} qubits`, 'info');
    }

    toggleQubitInitialState(qIndex) {
      this.initialQubits[qIndex] = this.initialQubits[qIndex] === 0 ? 1 : 0;
      this.renderCircuitCanvas();
      this.runCircuit(false);
      this.showToast(`Qubit ${qIndex} initial state set to |${this.initialQubits[qIndex]}⟩`, 'info');
    }

    selectPaletteGate(gateType) {
      this.selectedPaletteGate = gateType;
      this.pendingTwoQubitGate = null;

      document.querySelectorAll('.gate-token').forEach(token => {
        if (token.dataset.gate === gateType) {
          token.classList.add('selected-for-placement');
        } else {
          token.classList.remove('selected-for-placement');
        }
      });

      this.showToast(`Selected ${gateType} gate. Click an empty slot on the circuit wire.`, 'info');
    }

    handleSlotClick(colIdx, qubitIdx) {
      // If a two-qubit gate is in progress (waiting for target)
      if (this.pendingTwoQubitGate) {
        if (this.pendingTwoQubitGate.col === colIdx && this.pendingTwoQubitGate.controlQubit !== qubitIdx) {
          const type = this.pendingTwoQubitGate.type;
          const ctrl = this.pendingTwoQubitGate.controlQubit;
          const tgt = qubitIdx;

          if (type === 'CNOT') {
            this.circuitGrid[colIdx][ctrl] = { type: 'CNOT', role: 'control', target: tgt };
            this.circuitGrid[colIdx][tgt] = { type: 'CNOT', role: 'target', control: ctrl };
          } else if (type === 'SWAP') {
            this.circuitGrid[colIdx][ctrl] = { type: 'SWAP', target: tgt };
            this.circuitGrid[colIdx][tgt] = { type: 'SWAP', target: ctrl };
          }

          this.pendingTwoQubitGate = null;
          this.renderCircuitCanvas();
          this.runCircuit();
          this.showToast(`Placed ${type} between Q${ctrl} and Q${tgt}`, 'success');
          return;
        } else {
          this.pendingTwoQubitGate = null;
        }
      }

      // If slot already has gate, select it for inspection or removal
      const existing = this.circuitGrid[colIdx][qubitIdx];
      if (existing) {
        this.updateInspectorWithGate(existing, qubitIdx);
        return;
      }

      // If gate selected from palette, place it
      if (!this.selectedPaletteGate) {
        this.showToast('Please select a gate from the palette first!', 'info');
        return;
      }

      const gateType = this.selectedPaletteGate;

      if (gateType === 'CNOT' || gateType === 'SWAP') {
        // Multi-qubit gate first click: mark control
        this.pendingTwoQubitGate = { type: gateType, col: colIdx, controlQubit: qubitIdx };
        this.showToast(`Control set to Q${qubitIdx}. Now click the target qubit slot in the SAME column.`, 'info');
        this.renderCircuitCanvas();
        return;
      }

      // Single-qubit gate
      this.circuitGrid[colIdx][qubitIdx] = {
        type: gateType,
        id: gateType
      };

      this.renderCircuitCanvas();
      this.runCircuit();
      this.updateInspectorWithGate(this.circuitGrid[colIdx][qubitIdx], qubitIdx);
    }

    removeGateAt(colIdx, qubitIdx, e) {
      if (e) e.stopPropagation();
      const existing = this.circuitGrid[colIdx][qubitIdx];
      if (!existing) return;

      if (existing.type === 'CNOT' || existing.type === 'SWAP') {
        const otherQ = existing.target !== undefined ? existing.target : existing.control;
        this.circuitGrid[colIdx][qubitIdx] = null;
        if (otherQ !== undefined && this.circuitGrid[colIdx][otherQ]) {
          this.circuitGrid[colIdx][otherQ] = null;
        }
      } else {
        this.circuitGrid[colIdx][qubitIdx] = null;
      }

      this.renderCircuitCanvas();
      this.runCircuit();
      this.showToast('Gate removed from circuit', 'info');
    }

    resetCircuit() {
      this.circuitGrid = this.createEmptyCircuitGrid(this.numQubits, this.numCols);
      this.initialQubits = [0, 0, 0, 0];
      this.pendingTwoQubitGate = null;
      this.renderCircuitCanvas();
      this.runCircuit(false);
      this.showToast('Circuit reset to ground state |0...0⟩', 'info');
    }

    renderCircuitCanvas() {
      const container = document.getElementById('circuitCanvasGrid');
      if (!container) return;

      let html = '';

      // For each qubit wire
      for (let q = 0; q < this.numQubits; q++) {
        const initVal = this.initialQubits[q] || 0;

        html += `
          <div class="qubit-row" data-qubit="${q}">
            <div class="qubit-label-box">
              <span class="qubit-name">Q${q}</span>
              <button class="qubit-state-toggle" onclick="window.App.toggleQubitInitialState(${q})" title="Click to toggle initial state |0⟩ / |1⟩">
                |${initVal}⟩
              </button>
            </div>
            <div class="circuit-wire-line"></div>
            <div class="circuit-slots-wrap">
        `;

        // Column slots
        for (let c = 0; c < this.numCols; c++) {
          const gate = this.circuitGrid[c] ? this.circuitGrid[c][q] : null;
          const isPendingCtrl = this.pendingTwoQubitGate && this.pendingTwoQubitGate.col === c && this.pendingTwoQubitGate.controlQubit === q;

          let gateContent = '';
          let slotClass = '';

          if (isPendingCtrl) {
            slotClass = 'has-gate';
            gateContent = `
              <div class="slot-gate-placed" style="background:rgba(236,72,153,0.3); border:2px dashed var(--magenta);">
                <span class="cnot-control-dot"></span>
              </div>
            `;
          } else if (gate) {
            slotClass = 'has-gate';
            if (gate.type === 'CNOT') {
              if (gate.role === 'control') {
                gateContent = `
                  <div class="slot-gate-placed" style="background:rgba(236,72,153,0.25); border:1px solid var(--magenta);">
                    <span class="cnot-control-dot"></span>
                    <span class="delete-btn" onclick="window.App.removeGateAt(${c}, ${q}, event)">✕</span>
                  </div>
                `;
              } else {
                gateContent = `
                  <div class="slot-gate-placed" style="background:rgba(236,72,153,0.25); border:1px solid var(--magenta);">
                    <span class="cnot-target-icon">⊕</span>
                    <span class="delete-btn" onclick="window.App.removeGateAt(${c}, ${q}, event)">✕</span>
                  </div>
                `;
              }
            } else if (gate.type === 'SWAP') {
              gateContent = `
                <div class="slot-gate-placed" style="background:rgba(16,185,129,0.25); border:1px solid var(--emerald);">
                  <span class="swap-icon">✕</span>
                  <span class="delete-btn" onclick="window.App.removeGateAt(${c}, ${q}, event)">✕</span>
                </div>
              `;
            } else if (gate.type === 'MEASURE') {
              gateContent = `
                <div class="slot-gate-placed" style="background:rgba(255,255,255,0.08); border:1px solid var(--border-subtle); color:#f1f5f9;">
                  <span>📏</span>
                  <span class="delete-btn" onclick="window.App.removeGateAt(${c}, ${q}, event)">✕</span>
                </div>
              `;
            } else {
              // Single-qubit gate
              gateContent = `
                <div class="slot-gate-placed token-${gate.type}">
                  <span>${gate.type}</span>
                  <span class="delete-btn" onclick="window.App.removeGateAt(${c}, ${q}, event)">✕</span>
                </div>
              `;
            }
          }

          html += `
            <div class="circuit-slot ${slotClass}" onclick="window.App.handleSlotClick(${c}, ${q})" ondragover="event.preventDefault(); event.dataTransfer.dropEffect = 'copy';" ondrop="window.App.handleSlotDrop(${c}, ${q}, event)">
              ${gateContent}
            </div>
          `;
        }

        html += `
            </div>
          </div>
        `;
      }

      container.innerHTML = html;
    }

    runCircuit(countAsExecution = true) {
      if (countAsExecution) {
        this.circuitsExecutedCount++;
        localStorage.setItem(STORAGE_KEYS.CIRCUITS_EXECUTED_COUNT, this.circuitsExecutedCount.toString());
      }

      // Execute on engine
      this.engine.setNumQubits(this.numQubits);
      this.lastExecutionResult = this.engine.executeCircuit(this.circuitGrid, this.initialQubits);

      // Re-sample shots
      this.lastShotResults = this.engine.sampleShots(this.activeShots);

      // Render downstream views
      this.renderMeasurementView();
      this.updateOverallProgress();

      if (countAsExecution) {
        this.showToast('⚡ Circuit executed successfully! State vector updated.', 'success');
      }
    }

    loadCircuitPreset(presetId, executeAfter = true) {
      if (!presetId) return;

      const presets = window.CIRCUIT_PRESETS || [];
      const preset = presets.find(p => p.id === presetId);
      if (!preset) return;

      this.numQubits = preset.numQubits;
      this.numCols = Math.max(5, preset.numCols);
      this.initialQubits = [0, 0, 0, 0];
      this.engine.setNumQubits(this.numQubits);

      // Deep copy grid
      this.circuitGrid = this.createEmptyCircuitGrid(this.numQubits, this.numCols);
      for (let c = 0; c < preset.grid.length; c++) {
        for (let q = 0; q < this.numQubits; q++) {
          if (preset.grid[c] && preset.grid[c][q]) {
            this.circuitGrid[c][q] = { ...preset.grid[c][q] };
          }
        }
      }

      // Sync UI dropdown
      const qubitSelect = document.getElementById('qubitCountSelect');
      if (qubitSelect) qubitSelect.value = this.numQubits.toString();

      this.renderCircuitCanvas();

      if (executeAfter) {
        this.runCircuit(true);
        this.showToast(`Loaded "${preset.title}". ${preset.description}`, 'info');
      }
    }

    updateInspectorWithGate(gate, qubitIndex = 0) {
      const elTitle = document.getElementById('inspectorGateTitle');
      const elType = document.getElementById('inspectorGateType');
      const elExpl = document.getElementById('inspectorExplanation');
      const elInput = document.getElementById('inspectorInput');
      const elOp = document.getElementById('inspectorOp');
      const elOutput = document.getElementById('inspectorOutput');

      if (!gate) return;

      const gatesCatalog = window.QUANTUM_GATES || [];
      const catalogEntry = gatesCatalog.find(g => g.id === gate.type);

      if (catalogEntry) {
        if (elTitle) elTitle.textContent = `${catalogEntry.name} (${catalogEntry.symbol})`;
        if (elType) elType.textContent = catalogEntry.category;
        if (elExpl) elExpl.textContent = catalogEntry.simpleExplanation;
        if (elInput) elInput.textContent = catalogEntry.inputOutput[0].input;
        if (elOp) elOp.textContent = `${catalogEntry.symbol} Gate`;
        if (elOutput) elOutput.textContent = catalogEntry.inputOutput[0].output;
      } else if (gate.type === 'MEASURE') {
        if (elTitle) elTitle.textContent = 'Projective Measurement';
        if (elType) elType.textContent = 'Readout';
        if (elExpl) elExpl.textContent = 'Collapses the qubit wavefunction into a definite classical bit (0 or 1) according to Born\'s Rule.';
        if (elInput) elInput.textContent = 'α|0⟩ + β|1⟩';
        if (elOp) elOp.textContent = 'Projective Z-basis Readout';
        if (elOutput) elOutput.textContent = '|0⟩ (Prob |α|²) or |1⟩ (Prob |β|²)';
      }
    }

    /* ------------------------------------------------------------------------
       MEASUREMENT & SHOTS (PRD Section 8)
       ------------------------------------------------------------------------ */
    initMeasurementView() {
      this.renderMeasurementView();
    }

    renderMeasurementView() {
      if (!this.lastExecutionResult) {
        this.lastExecutionResult = this.engine.executeCircuit(this.circuitGrid, this.initialQubits);
      }
      if (!this.lastShotResults) {
        this.lastShotResults = this.engine.sampleShots(this.activeShots);
      }

      this.renderTheoreticalHistogram();
      this.renderEmpiricalHistogram();
      this.renderBlochCoordinates();
    }

    renderTheoreticalHistogram() {
      const container = document.getElementById('theoreticalHistogram');
      if (!container) return;

      const probs = this.lastExecutionResult.probabilities || [];
      container.innerHTML = probs.map(p => {
        const pct = p.percentage;
        const ampStr = p.amplitude.toString(2);
        return `
          <div class="histo-row">
            <div class="histo-meta">
              <span class="histo-state-label">${p.label}</span>
              <span style="color:var(--text-dim); font-size:0.8rem;">Amp: ${ampStr}</span>
              <span class="histo-percent-label" style="color:var(--cyan);">${pct}%</span>
            </div>
            <div class="histo-bar-container">
              <div class="histo-bar-fill-theory" style="width:${pct}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    renderEmpiricalHistogram() {
      const container = document.getElementById('empiricalHistogram');
      if (!container) return;

      const shotsData = this.lastShotResults;
      if (!shotsData || !shotsData.results) return;

      container.innerHTML = shotsData.results.map(r => {
        return `
          <div class="histo-row">
            <div class="histo-meta">
              <span class="histo-state-label">${r.label}</span>
              <span class="histo-counts-label">${r.count} / ${shotsData.numShots} shots</span>
              <span class="histo-percent-label" style="color:var(--magenta);">${r.empiricalPercent}%</span>
            </div>
            <div class="histo-bar-container">
              <div class="histo-bar-fill-shots" style="width:${r.empiricalPercent}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    renderBlochCoordinates() {
      const grid = document.getElementById('blochCoordsGrid');
      if (!grid) return;

      const bloch0 = this.engine.getQubitBlochCoordinates(0);
      const bloch1 = this.numQubits > 1 ? this.engine.getQubitBlochCoordinates(1) : null;

      let html = `
        <div class="bloch-coord-item">
          <div style="color:var(--cyan); font-weight:700;">Qubit 0</div>
          <div>x: ${bloch0.x.toFixed(2)}</div>
          <div>y: ${bloch0.y.toFixed(2)}</div>
          <div>z: ${bloch0.z.toFixed(2)}</div>
          <div>θ: ${bloch0.thetaDeg}°</div>
        </div>
      `;

      if (bloch1) {
        html += `
          <div class="bloch-coord-item">
            <div style="color:var(--purple); font-weight:700;">Qubit 1</div>
            <div>x: ${bloch1.x.toFixed(2)}</div>
            <div>y: ${bloch1.y.toFixed(2)}</div>
            <div>z: ${bloch1.z.toFixed(2)}</div>
            <div>θ: ${bloch1.thetaDeg}°</div>
          </div>
        `;
      }

      html += `
        <div class="bloch-coord-item" style="grid-column: span ${bloch1 ? 1 : 2};">
          <div style="color:var(--emerald); font-weight:700;">Purity & Entanglement</div>
          <div>P(0): ${(bloch0.prob0 * 100).toFixed(0)}%</div>
          <div>P(1): ${(bloch0.prob1 * 100).toFixed(0)}%</div>
          <div style="font-size:0.75rem; color:${bloch0.purity < 0.9 ? 'var(--magenta)' : 'var(--emerald)'}">
            ${bloch0.purity < 0.9 ? '⚡ Entangled Pair' : 'Pure Qubit State'}
          </div>
        </div>
      `;

      grid.innerHTML = html;
    }

    runShots(numShots) {
      this.activeShots = numShots;

      // Update button active states
      document.querySelectorAll('.shot-btn').forEach(btn => {
        if (parseInt(btn.dataset.shots, 10) === numShots) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      this.labExperimentsCount++;
      localStorage.setItem(STORAGE_KEYS.LAB_EXPERIMENTS_COUNT, this.labExperimentsCount.toString());

      this.lastShotResults = this.engine.sampleShots(this.activeShots);
      this.renderEmpiricalHistogram();
      this.updateOverallProgress();
      this.showToast(`Sampled ${numShots} shots with probabilistic readout!`, 'info');
    }

    rerunActiveShots() {
      this.runShots(this.activeShots);
    }

    /* ------------------------------------------------------------------------
       ANALYTICS (PRD Section 10)
       ------------------------------------------------------------------------ */
    initAnalyticsView() {
      this.renderAnalytics();
    }

    renderAnalytics() {
      const overallProgress = this.calculateOverallProgress();

      // Top Cards
      const elProgress = document.getElementById('analyticsOverallProgress');
      const elMods = document.getElementById('analyticsModulesCount');
      const elGates = document.getElementById('analyticsGatesCount');
      const elCircuits = document.getElementById('analyticsCircuitsCount');
      const elBest = document.getElementById('analyticsBestScore');
      const elBestSub = document.getElementById('analyticsBestScoreSub');

      const totalMods = (window.LEARNING_MODULES && window.LEARNING_MODULES.length) || 8;
      if (elProgress) elProgress.textContent = `${overallProgress}%`;
      if (elMods) elMods.textContent = `${this.completedModules.length} / ${totalMods}`;
      if (elGates) elGates.textContent = `${this.studiedGates.length} / 8`;
      if (elCircuits) elCircuits.textContent = this.circuitsExecutedCount.toString();

      // Best Score
      if (this.assessmentAttempts.length > 0) {
        const bestAttempt = [...this.assessmentAttempts].sort((a, b) => b.score - a.score)[0];
        if (elBest) elBest.textContent = `${bestAttempt.score} / 25`;
        if (elBestSub) elBestSub.textContent = `${bestAttempt.percentage}% • ${bestAttempt.tier}`;
      } else {
        if (elBest) elBest.textContent = '—';
        if (elBestSub) elBestSub.textContent = 'No attempts yet';
      }

      // Topic Mastery Breakdown
      this.renderTopicMastery();

      // Attempts Table
      this.renderAttemptsTable();
    }

    renderTopicMastery() {
      const container = document.getElementById('analyticsTopicMastery');
      if (!container) return;

      const topics = [
        'Quantum Fundamentals',
        'Superposition',
        'Quantum Gates',
        'Measurement',
        'CNOT Gate',
        'Entanglement'
      ];

      // Calculate score per topic from assessment and modules
      const latestAttempt = this.assessmentAttempts[this.assessmentAttempts.length - 1];

      container.innerHTML = topics.map(topic => {
        let topicPercent = 40; // baseline

        // Boost by completed modules in this topic
        const modsInTopic = (window.LEARNING_MODULES || []).filter(m => m.topicTag === topic);
        const completedInTopic = modsInTopic.filter(m => this.completedModules.includes(m.id)).length;
        if (modsInTopic.length > 0) {
          topicPercent += (completedInTopic / modsInTopic.length) * 30;
        }

        // Boost/adjust if latest assessment exists
        if (latestAttempt && latestAttempt.topicScores && latestAttempt.topicScores[topic]) {
          const tScore = latestAttempt.topicScores[topic];
          topicPercent = Math.round((tScore.correct / tScore.total) * 100);
        }

        topicPercent = Math.min(100, Math.round(topicPercent));

        return `
          <div>
            <div class="topic-item-header">
              <span>${topic}</span>
              <span style="color:var(--cyan);">${topicPercent}%</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width:${topicPercent}%;"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    renderAttemptsTable() {
      const tbody = document.getElementById('attemptsTableBody');
      if (!tbody) return;

      if (this.assessmentAttempts.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align:center; color:var(--text-dim); padding:2rem;">
              No assessment attempts recorded yet.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = this.assessmentAttempts.map((att, i) => `
        <tr>
          <td><strong>Attempt ${i + 1}</strong></td>
          <td style="color:var(--text-muted);">${att.date}</td>
          <td><strong>${att.score} / 25</strong></td>
          <td style="color:var(--cyan); font-weight:700;">${att.percentage}%</td>
          <td>
            <span class="scorecard-badge-tier ${this.getTierClass(att.percentage)}" style="font-size:0.75rem; padding:0.15rem 0.6rem;">
              ${att.tier}
            </span>
          </td>
        </tr>
      `).join('');
    }

    resetAllStudentData() {
      if (!confirm('Are you sure you want to reset all your learning progress, completed gates, and test attempts?')) {
        return;
      }
      this.completedModules = [];
      this.studiedGates = [];
      this.labExperimentsCount = 0;
      this.circuitsExecutedCount = 0;
      this.assessmentAttempts = [];
      this.userQuizAnswers = {};

      localStorage.removeItem(STORAGE_KEYS.PROGRESS_MODULES);
      localStorage.removeItem(STORAGE_KEYS.PROGRESS_GATES);
      localStorage.removeItem(STORAGE_KEYS.LAB_EXPERIMENTS_COUNT);
      localStorage.removeItem(STORAGE_KEYS.CIRCUITS_EXECUTED_COUNT);
      localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS);

      this.updateOverallProgress();
      this.renderLearningSidebar();
      this.renderActiveModule();
      this.renderGatesSelectorBar();
      this.renderActiveGate();
      this.renderAnalytics();
      this.showToast('All student records have been reset.', 'info');
    }

    /* ------------------------------------------------------------------------
       OVERALL PROGRESS CALCULATOR (PRD Section 3)
       ------------------------------------------------------------------------ */
    calculateOverallProgress() {
      const totalMods = (window.LEARNING_MODULES && window.LEARNING_MODULES.length) || 8;
      const modRatio = this.completedModules.length / totalMods;
      const gateRatio = this.studiedGates.length / 8;
      const labRatio = Math.min(1, (this.circuitsExecutedCount + this.labExperimentsCount) / 10);
      
      let assessRatio = 0;
      if (this.assessmentAttempts.length > 0) {
        const best = Math.max(...this.assessmentAttempts.map(a => a.percentage));
        assessRatio = best / 100;
      }

      const total = (modRatio * 40) + (gateRatio * 25) + (labRatio * 15) + (assessRatio * 20);
      return Math.min(100, Math.round(total));
    }

    updateOverallProgress() {
      const progress = this.calculateOverallProgress();
      const totalMods = (window.LEARNING_MODULES && window.LEARNING_MODULES.length) || 8;

      // Header chip
      const elHeaderBadge = document.getElementById('headerProgressBadge');
      if (elHeaderBadge) elHeaderBadge.textContent = `${progress}%`;

      // Dashboard
      const elDashVal = document.getElementById('dashboardProgressVal');
      const elDashBar = document.getElementById('dashboardProgressBar');
      const elMetricMods = document.getElementById('dashMetricModules');
      const elMetricGates = document.getElementById('dashMetricGates');
      const elMetricRuns = document.getElementById('dashMetricRuns');
      const elMetricScore = document.getElementById('dashMetricScore');

      if (elDashVal) elDashVal.textContent = `${progress}%`;
      if (elDashBar) elDashBar.style.width = `${progress}%`;
      if (elMetricMods) elMetricMods.textContent = `${this.completedModules.length}/${totalMods}`;
      if (elMetricGates) elMetricGates.textContent = `${this.studiedGates.length}/8`;
      if (elMetricRuns) elMetricRuns.textContent = (this.circuitsExecutedCount + this.labExperimentsCount).toString();

      if (this.assessmentAttempts.length > 0) {
        const best = Math.max(...this.assessmentAttempts.map(a => a.score));
        if (elMetricScore) elMetricScore.textContent = `${best}/25`;
      } else {
        if (elMetricScore) elMetricScore.textContent = 'Not Taken';
      }

      // Card stats
      const elCardMods = document.getElementById('cardStatModules');
      const elCardGates = document.getElementById('cardStatGates');
      if (elCardMods) elCardMods.textContent = `${this.completedModules.length}/${totalMods} Completed`;
      if (elCardGates) elCardGates.textContent = `${this.studiedGates.length}/8 Studied`;
    }

    /* ------------------------------------------------------------------------
       25-QUESTION ASSESSMENT (PRD Sections 11, 12, 13, 14, 15)
       ------------------------------------------------------------------------ */
    initAssessment() {
      this.renderQuizQuestion();
      this.renderQuizDots();
    }

    renderQuizDots() {
      const container = document.getElementById('quizDotsNav');
      if (!container) return;

      container.innerHTML = this.quizQuestions.map((q, i) => {
        const isAnswered = this.userQuizAnswers[q.id] !== undefined;
        const isActive = i === this.currentQuizIndex;

        return `
          <button 
            class="dot-btn ${isActive ? 'active' : ''} ${isAnswered ? 'answered' : ''}" 
            onclick="window.App.jumpToQuizQuestion(${i})"
            title="Question ${i + 1} (${q.topic})"
          >
            ${i + 1}
          </button>
        `;
      }).join('');
    }

    jumpToQuizQuestion(index) {
      this.currentQuizIndex = Math.max(0, Math.min(this.quizQuestions.length - 1, index));
      this.renderQuizQuestion();
      this.renderQuizDots();
    }

    navQuizQuestion(delta) {
      this.jumpToQuizQuestion(this.currentQuizIndex + delta);
    }

    renderQuizQuestion() {
      const q = this.quizQuestions[this.currentQuizIndex];
      if (!q) return;

      const tracker = document.getElementById('quizQuestionTracker');
      const badge = document.getElementById('quizTopicBadge');
      const text = document.getElementById('quizQuestionText');
      const list = document.getElementById('quizOptionsList');
      const prevBtn = document.getElementById('quizPrevBtn');
      const nextBtn = document.getElementById('quizNextBtn');

      if (tracker) tracker.textContent = `Question ${this.currentQuizIndex + 1} of 25`;
      if (badge) badge.textContent = q.topic;
      if (text) text.textContent = q.question;

      if (prevBtn) {
        prevBtn.disabled = this.currentQuizIndex === 0;
        prevBtn.style.opacity = this.currentQuizIndex === 0 ? '0.4' : '1';
      }
      if (nextBtn) {
        nextBtn.disabled = this.currentQuizIndex === this.quizQuestions.length - 1;
        nextBtn.style.opacity = this.currentQuizIndex === this.quizQuestions.length - 1 ? '0.4' : '1';
      }

      const selectedOpt = this.userQuizAnswers[q.id];
      const letters = ['A', 'B', 'C', 'D'];

      if (list) {
        list.innerHTML = q.options.map((opt, i) => {
          const isSelected = selectedOpt === i;
          return `
            <div class="quiz-option-card ${isSelected ? 'selected' : ''}" onclick="window.App.selectQuizAnswer(${q.id}, ${i})">
              <span class="quiz-opt-letter">${letters[i]}</span>
              <span class="quiz-opt-text">${opt}</span>
            </div>
          `;
        }).join('');
      }
    }

    selectQuizAnswer(questionId, optionIndex) {
      this.userQuizAnswers[questionId] = optionIndex;
      this.renderQuizQuestion();
      this.renderQuizDots();
    }

    confirmSubmitAssessment() {
      const total = this.quizQuestions.length;
      const answered = Object.keys(this.userQuizAnswers).length;

      if (answered < total) {
        const remaining = total - answered;
        if (!confirm(`You have answered ${answered} of ${total} questions (${remaining} unanswered). Do you want to submit anyway?`)) {
          return;
        }
      }

      this.submitAssessment();
    }

    submitAssessment() {
      let correct = 0;
      const topicScores = {};

      this.quizQuestions.forEach(q => {
        const userChoice = this.userQuizAnswers[q.id];
        const isCorrect = userChoice === q.correctIndex;

        if (isCorrect) correct++;

        // Track topic performance
        if (!topicScores[q.topic]) {
          topicScores[q.topic] = { correct: 0, total: 0 };
        }
        topicScores[q.topic].total++;
        if (isCorrect) {
          topicScores[q.topic].correct++;
        }
      });

      const total = this.quizQuestions.length;
      const percentage = Math.round((correct / total) * 100);
      const tier = this.getPerformanceTier(percentage);

      const attemptResult = {
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        score: correct,
        total: total,
        percentage: percentage,
        tier: tier,
        topicScores: topicScores,
        answers: { ...this.userQuizAnswers }
      };

      this.latestQuizResult = attemptResult;
      this.assessmentAttempts.push(attemptResult);
      localStorage.setItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS, JSON.stringify(this.assessmentAttempts));

      this.renderScorecard(attemptResult);
      this.updateOverallProgress();

      // Switch to scorecard container
      const activeCont = document.getElementById('quizActiveContainer');
      const scorecardCont = document.getElementById('quizScorecardContainer');
      if (activeCont) activeCont.style.display = 'none';
      if (scorecardCont) scorecardCont.classList.add('active');

      this.showToast('Assessment submitted! Reviewing your scorecard.', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    getPerformanceTier(percentage) {
      if (percentage >= 90) return 'Excellent';
      if (percentage >= 75) return 'Very Good';
      if (percentage >= 60) return 'Good';
      if (percentage >= 40) return 'Needs Improvement';
      return 'Beginner';
    }

    getTierClass(percentage) {
      if (percentage >= 90) return 'tier-excellent';
      if (percentage >= 75) return 'tier-very-good';
      if (percentage >= 60) return 'tier-good';
      if (percentage >= 40) return 'tier-needs-improvement';
      return 'tier-beginner';
    }

    renderScorecard(result) {
      const studentName = this.studentName || 'Student';

      // 1. Hero
      const elTierBadge = document.getElementById('scorecardTierBadge');
      const elAnnouncement = document.getElementById('scorecardStudentAnnouncement');
      const elBigScore = document.getElementById('scorecardBigScore');
      const elPercent = document.getElementById('scorecardPercent');
      const elCorrect = document.getElementById('scorecardCorrect');
      const elIncorrect = document.getElementById('scorecardIncorrect');

      if (elTierBadge) {
        elTierBadge.className = `scorecard-badge-tier ${this.getTierClass(result.percentage)}`;
        elTierBadge.textContent = result.tier;
      }
      if (elAnnouncement) {
        elAnnouncement.textContent = `«${studentName} has secured ${result.score} out of 25 marks.»`;
      }
      if (elBigScore) elBigScore.textContent = result.score.toString();
      if (elPercent) elPercent.textContent = `${result.percentage}%`;
      if (elCorrect) elCorrect.textContent = `${result.score} / 25`;
      if (elIncorrect) elIncorrect.textContent = `${25 - result.score} / 25`;

      // 2. Topic Performance (PRD Section 14)
      const elTopicPerf = document.getElementById('scorecardTopicPerformance');
      const weakTopics = [];

      if (elTopicPerf) {
        elTopicPerf.innerHTML = Object.entries(result.topicScores).map(([topic, sc]) => {
          const pct = Math.round((sc.correct / sc.total) * 100);
          const isStrong = pct >= 70;
          if (!isStrong) {
            weakTopics.push(topic);
          }

          return `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0; border-bottom:1px solid var(--border-subtle);">
              <div>
                <strong style="color:var(--text-bright); font-size:0.95rem;">${topic}</strong>
                <span style="font-size:0.8rem; color:var(--text-dim); margin-left:0.5rem;">(${sc.correct}/${sc.total})</span>
              </div>
              <span class="topic-status-pill ${isStrong ? 'strong' : 'needs-practice'}">
                ${isStrong ? '✓ Strong' : '⚠ Needs Practice'}
              </span>
            </div>
          `;
        }).join('');
      }

      // 3. Recommended Learning (PRD Section 14)
      const elRecText = document.getElementById('recommendationText');
      if (elRecText) {
        if (weakTopics.length > 0) {
          elRecText.innerHTML = `«You should revise <strong>${weakTopics.join(' and ')}</strong> before taking the assessment again.»`;
          this.weakestTopic = weakTopics[0];
        } else {
          elRecText.innerHTML = `«Outstanding mastery! You have demonstrated strong competency across all quantum computing modules.»`;
          this.weakestTopic = null;
        }
      }

      // 4. Attempts Progress Summary (PRD Section 15)
      const elAttemptsSummary = document.getElementById('scorecardAttemptsSummary');
      if (elAttemptsSummary) {
        elAttemptsSummary.innerHTML = this.assessmentAttempts.map((att, i) => {
          const prev = i > 0 ? this.assessmentAttempts[i - 1] : null;
          const delta = prev ? att.percentage - prev.percentage : 0;
          const deltaStr = delta > 0 ? `(+${delta}%) 📈` : delta < 0 ? `(${delta}%)` : '';

          return `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0; border-bottom:1px solid var(--border-subtle); font-size:0.92rem;">
              <span><strong>Attempt ${i + 1}</strong> (${att.date})</span>
              <span>
                <b style="color:var(--cyan);">${att.percentage}%</b> 
                <span style="font-size:0.8rem; color:var(--emerald);">${deltaStr}</span>
              </span>
            </div>
          `;
        }).join('');
      }
    }

    retakeAssessment() {
      this.userQuizAnswers = {};
      this.currentQuizIndex = 0;

      const activeCont = document.getElementById('quizActiveContainer');
      const scorecardCont = document.getElementById('quizScorecardContainer');
      if (scorecardCont) scorecardCont.classList.remove('active');
      if (activeCont) activeCont.style.display = 'block';

      this.renderQuizQuestion();
      this.renderQuizDots();
      this.showToast('Ready for your new assessment attempt. Good luck!', 'info');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    reviseWeakestTopic() {
      if (this.weakestTopic) {
        // Find matching module or gate
        const matchingMod = (window.LEARNING_MODULES || []).findIndex(m => m.topicTag === this.weakestTopic);
        if (matchingMod >= 0) {
          this.switchView('learn');
          this.selectModule(matchingMod);
          this.showToast(`Navigated to ${this.weakestTopic} revision module`, 'info');
          return;
        }

        if (this.weakestTopic.includes('Gate') || this.weakestTopic.includes('CNOT')) {
          this.switchView('gates');
          if (this.weakestTopic.includes('CNOT')) {
            this.selectGate('CNOT');
          }
          this.showToast(`Navigated to ${this.weakestTopic} revision sandbox`, 'info');
          return;
        }
      }

      // Default fallback
      this.switchView('learn');
    }

    showQuestionReviewModal() {
      const modal = document.getElementById('reviewModal');
      const container = document.getElementById('reviewQuestionsContainer');
      if (!modal || !container) return;

      const letters = ['A', 'B', 'C', 'D'];
      const answers = this.latestQuizResult ? this.latestQuizResult.answers : this.userQuizAnswers;

      container.innerHTML = this.quizQuestions.map((q, i) => {
        const userChoice = answers[q.id];
        const isCorrect = userChoice === q.correctIndex;

        return `
          <div style="background:#ffffff; border:1px solid ${isCorrect ? '#a7f3d0' : '#fecaca'}; border-radius:var(--radius-md); padding:1.25rem; box-shadow:var(--shadow-xs);">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
              <span style="font-weight:700; color:var(--text-dim); font-size:0.85rem;">Question ${i + 1} (${q.topic})</span>
              <span style="font-weight:700; font-size:0.85rem; color:${isCorrect ? 'var(--emerald)' : '#dc2626'};">
                ${isCorrect ? '✓ Correct' : '✕ Incorrect'}
              </span>
            </div>
            <p style="font-size:1rem; font-weight:600; color:var(--text-bright); margin-bottom:0.85rem;">${q.question}</p>
            
            <div style="font-size:0.92rem; margin-bottom:0.75rem;">
              <div>Your Answer: <strong style="color:${isCorrect ? 'var(--emerald)' : '#dc2626'};">${userChoice !== undefined ? `${letters[userChoice]}. ${q.options[userChoice]}` : 'Unanswered'}</strong></div>
              ${!isCorrect ? `<div style="margin-top:0.25rem;">Correct Answer: <strong style="color:var(--emerald);">${letters[q.correctIndex]}. ${q.options[q.correctIndex]}</strong></div>` : ''}
            </div>

            <div style="font-size:0.88rem; color:var(--text-muted); background:#f8fafc; border:1px solid #e2e8f0; padding:0.75rem 1rem; border-radius:var(--radius-sm);">
              <strong>Explanation:</strong> ${q.explanation}
            </div>
          </div>
        `;
      }).join('');

      modal.classList.add('active');
    }
  }

  // Instantiate application when DOM is ready
  window.addEventListener('DOMContentLoaded', () => {
    window.App = new QuantumGateApp();
  });
})();
