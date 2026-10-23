/**
 * QuantumGate Cloud Lab - Learning Academy Content
 * Step-by-step educational curriculum for beginners and engineering students
 */

const LEARNING_MODULES = [
  {
    id: 'mod1',
    number: '01',
    title: 'Introduction to Quantum Computing',
    icon: '⚡',
    duration: '6 min read',
    topicTag: 'Quantum Fundamentals',
    summary: 'Discover why quantum computers differ fundamentally from classical digital computers and how quantum parallelism changes computing power.',
    contentHtml: `
      <div class="lesson-block">
        <h3>1. The Dawn of Quantum Information</h3>
        <p>Every digital computer we use today—from smartphones to high-performance supercomputers—relies on <strong>classical bits</strong>. A classical bit is fundamentally binary: it must be strictly <code>0</code> (low voltage) or <code>1</code> (high voltage) at any given moment.</p>
        <p>Quantum computers, however, exploit the physical laws of <strong>quantum mechanics</strong>—the branch of physics that governs nature at atomic and subatomic scales. Instead of classical bits, quantum computers manipulate <strong>qubits (quantum bits)</strong>.</p>
      </div>

      <div class="comparison-grid">
        <div class="comparison-card classical">
          <div class="card-tag">Classical Computing</div>
          <h4>The Deterministic Bit</h4>
          <ul>
            <li><strong>State:</strong> Strictly <code>0</code> OR <code>1</code></li>
            <li><strong>Physical Basis:</strong> Silicon transistor voltage switch</li>
            <li><strong>Information:</strong> N bits store <em>one</em> specific N-bit number</li>
            <li><strong>Scaling:</strong> Linear growth in parallel processing power</li>
            <li><strong>Algorithms:</strong> Boolean algebra (AND, OR, NOT, NAND)</li>
          </ul>
        </div>
        <div class="comparison-card quantum">
          <div class="card-tag">Quantum Computing</div>
          <h4>The Quantum Qubit</h4>
          <ul>
            <li><strong>State:</strong> Linear combination α|0⟩ + β|1⟩ (Superposition)</li>
            <li><strong>Physical Basis:</strong> Superconducting circuits, trapped ions, photon polarizations</li>
            <li><strong>Information:</strong> N qubits exist in a simultaneous superposition of 2<sup>N</sup> states!</li>
            <li><strong>Scaling:</strong> Exponential information capacity (2<sup>N</sup> basis amplitudes)</li>
            <li><strong>Algorithms:</strong> Unitary linear transformations & interference</li>
          </ul>
        </div>
      </div>

      <div class="key-takeaway-box">
        <div class="takeaway-icon">💡</div>
        <div>
          <strong>Key Insight:</strong> Classical computing is like reading a single path through a maze one by one. Quantum computing uses quantum interference and superposition to evaluate pathways simultaneously!
        </div>
      </div>
    `,
    checkpoint: {
      question: "Which of the following describes the fundamental capacity advantage of N qubits over N classical bits?",
      options: [
        "N qubits can hold 2^N states simultaneously in superposition",
        "N qubits compute using higher voltages than classical transistors",
        "N qubits eliminate the need for any programming algorithms",
        "N qubits can never produce any measurement errors"
      ],
      correctIndex: 0,
      explanation: "A register of N qubits is described by a 2^N dimensional state vector, allowing quantum algorithms to explore an exponential state space simultaneously."
    }
  },
  {
    id: 'mod2',
    number: '02',
    title: 'Classical Bit vs Qubit',
    icon: '⚛️',
    duration: '8 min read',
    topicTag: 'Superposition',
    summary: 'Understand the mathematical definition of a qubit, the bra-ket Dirac notation |0⟩ and |1⟩, and the 3D Bloch sphere representation.',
    contentHtml: `
      <div class="lesson-block">
        <h3>1. The Quantum Bit (Qubit)</h3>
        <p>In quantum computing, states are represented using <strong>Dirac notation (bra-ket notation)</strong>:</p>
        <div class="formula-banner">
          |ψ⟩ = α|0⟩ + β|1⟩
        </div>
        <p>Here, <code>|0⟩</code> and <code>|1⟩</code> are the computational basis states (orthonormal basis vectors):</p>
        <div class="vector-display">
          <span>|0⟩ = <span class="matrix-bracket">[</span> 1 , 0 <span class="matrix-bracket">]</span><sup>T</sup></span>
          <span style="margin: 0 1.5rem;">and</span>
          <span>|1⟩ = <span class="matrix-bracket">[</span> 0 , 1 <span class="matrix-bracket">]</span><sup>T</sup></span>
        </div>
        <p>The symbols <strong>α</strong> (alpha) and <strong>β</strong> (beta) are <strong>complex numbers</strong> known as <em>probability amplitudes</em>.</p>
      </div>

      <div class="lesson-block">
        <h3>2. Normalization Condition</h3>
        <p>Total probability must always equal 100% (1.0). Therefore, the amplitudes must obey Born's normalization rule:</p>
        <div class="formula-banner highlight">
          |α|² + |β|² = 1
        </div>
        <p>• <code>|α|²</code> represents the exact probability of measuring outcome <strong>0</strong>.<br/>
           • <code>|β|²</code> represents the exact probability of measuring outcome <strong>1</strong>.</p>
      </div>

      <div class="lesson-block">
        <h3>3. The Bloch Sphere</h3>
        <p>While a classical bit can only live at the North Pole (|0⟩) or South Pole (|1⟩), a pure qubit can point to <em>any continuous point on the surface of a unit sphere</em> called the <strong>Bloch Sphere</strong>!</p>
        <div class="bloch-concept-visual">
          <div class="bloch-legend-item"><span class="badge pole">North Pole (Z = +1)</span> |0⟩ state</div>
          <div class="bloch-legend-item"><span class="badge eq">Equator (+X)</span> |+⟩ = (|0⟩ + |1⟩)/√2 (Equal 50/50 superposition)</div>
          <div class="bloch-legend-item"><span class="badge pole">South Pole (Z = -1)</span> |1⟩ state</div>
        </div>
      </div>
    `,
    checkpoint: {
      question: "If a qubit state is |ψ⟩ = (1/√2)|0⟩ + (1/√2)|1⟩, what is the probability of measuring |0⟩?",
      options: [
        "100%",
        "50% (since |1/√2|² = 1/2)",
        "25%",
        "0%"
      ],
      correctIndex: 1,
      explanation: "By Born's rule, the probability of measuring |0⟩ is |α|² = (1/√2)² = 1/2 = 50%."
    }
  },
  {
    id: 'mod3',
    number: '03',
    title: 'Superposition & Quantum Interference',
    icon: '🌊',
    duration: '7 min read',
    topicTag: 'Superposition',
    summary: 'Explore how quantum particles exist in multiple states at once and how constructive and destructive interference creates quantum speedup.',
    contentHtml: `
      <div class="lesson-block">
        <h3>1. The Superposition Principle</h3>
        <p>Superposition does <strong>not</strong> mean the qubit is secretly 0 or secretly 1 and we just don't know it yet. Rather, until measured, the qubit exists in a genuine linear combination of both possibilities simultaneously.</p>
        <div class="analogy-card">
          <div class="analogy-badge">The Spinning Coin Analogy</div>
          <p>If a coin sits stationary on a table, it is either Heads or Tails. But if you spin the coin rapidly on edge, it exhibits both Heads and Tails simultaneously until your hand slaps it flat down (the measurement event).</p>
        </div>
      </div>

      <div class="lesson-block">
        <h3>2. Quantum Interference</h3>
        <p>Because amplitudes α and β can have positive, negative, or complex values, quantum states can interfere like water waves:</p>
        <ul>
          <li><strong>Constructive Interference:</strong> Amplitudes with the same phase add together, increasing the probability of the correct answer.</li>
          <li><strong>Destructive Interference:</strong> Amplitudes with opposite phases cancel each other out, driving the probability of wrong answers to zero!</li>
        </ul>
        <p>All landmark quantum algorithms (Shor's algorithm, Grover's search) work by orchestrating quantum interference so incorrect paths cancel out and the correct answer peaks.</p>
      </div>
    `,
    checkpoint: {
      question: "What physical wave-like phenomenon allows quantum algorithms to boost correct answers and cancel incorrect answers?",
      options: [
        "Quantum Interference",
        "Heat Dissipation",
        "Binary Arithmetic",
        "Clock Frequency"
      ],
      correctIndex: 0,
      explanation: "Quantum interference allows positive and negative amplitudes to reinforce correct states (constructive) while canceling wrong states (destructive)."
    }
  },
  {
    id: 'mod4',
    number: '04',
    title: 'Quantum Measurement & State Collapse',
    icon: '🎯',
    duration: '7 min read',
    topicTag: 'Measurement',
    summary: 'Understand the Born rule, projective measurement, why measurement collapses superposition, and how multi-shot sampling works.',
    contentHtml: `
      <div class="lesson-block">
        <h3>1. The Act of Measurement</h3>
        <p>In classical computing, you can read the voltage of a wire without destroying the data. In quantum mechanics, however, <strong>measurement is invasive and irreversible</strong>.</p>
        <p>When a detector measures a qubit in superposition <code>α|0⟩ + β|1⟩</code>, the qubit instantaneously <strong>collapses</strong> into either <code>|0⟩</code> or <code>|1⟩</code>.</p>
        <div class="state-collapse-diagram">
          <div class="state-pill before">Superposition: (|0⟩ + |1⟩)/√2</div>
          <div class="arrow">───[ Measurement ]───►</div>
          <div class="state-pill after">Definite: |0⟩ (50%) or |1⟩ (50%)</div>
        </div>
      </div>

      <div class="lesson-block">
        <h3>2. Why We Need "Shots"</h3>
        <p>Because a single measurement gives only a single random outcome (0 or 1), a quantum computer must run the identical circuit many times—each run is called a <strong>shot</strong>.</p>
        <p>By collecting statistics over 100, 500, or 1000 shots, we reconstruct the empirical probability distribution and confirm the theoretical quantum state vector!</p>
      </div>
    `,
    checkpoint: {
      question: "What happens to a qubit in superposition (|0⟩ + |1⟩)/√2 immediately after it is measured?",
      options: [
        "It collapses into either |0⟩ or |1⟩ with 50% probability each",
        "It remains in superposition indefinitely",
        "It turns into a classical byte of 8 bits",
        "It disappears completely from the circuit"
      ],
      correctIndex: 0,
      explanation: "According to the measurement postulate, measuring a qubit projects (collapses) the state vector into one of the measurement basis states."
    }
  },
  {
    id: 'mod5',
    number: '05',
    title: 'Quantum Gates & Circuit Architecture',
    icon: '🔲',
    duration: '9 min read',
    topicTag: 'Quantum Gates',
    summary: 'Discover how quantum gates act as unitary matrix rotations and how quantum circuit diagrams are structured from left to right.',
    contentHtml: `
      <div class="lesson-block">
        <h3>1. Unitary Transformations</h3>
        <p>In quantum computing, operations on qubits are represented by <strong>unitary matrices</strong> (U<sup>†</sup>U = I). This fundamental requirement guarantees two things:</p>
        <ol>
          <li><strong>Probability Conservation:</strong> The sum of measurement probabilities remains strictly 1.0 at every step.</li>
          <li><strong>Reversibility:</strong> Every quantum gate (except measurement) is mathematically reversible!</li>
        </ol>
      </div>

      <div class="lesson-block">
        <h3>2. Reading Quantum Circuit Diagrams</h3>
        <p>In a visual quantum circuit diagram:</p>
        <ul>
          <li><strong>Horizontal Lines (Wires):</strong> Each wire represents the timeline of a specific qubit (e.g., Qubit 0, Qubit 1).</li>
          <li><strong>Time Flow:</strong> Operations execute strictly from <strong>left to right</strong>.</li>
          <li><strong>Gate Blocks:</strong> Single-qubit gates (H, X, Y, Z, S, T) sit on individual wires.</li>
          <li><strong>Multi-Qubit Gates:</strong> CNOT and SWAP span across multiple wires with vertical connecting lines.</li>
          <li><strong>Measurement Meters:</strong> Meter symbols indicate projective readout into classical memory.</li>
        </ul>
      </div>
    `,
    checkpoint: {
      question: "Why must all quantum gates (excluding measurement) be unitary matrices?",
      options: [
        "To preserve the total probability equal to 1 and ensure reversibility",
        "Because quantum computers only use real numbers",
        "To prevent qubits from running out of electricity",
        "To force all qubits to equal zero"
      ],
      correctIndex: 0,
      explanation: "Unitary matrices conserve inner products, preserving total probability (|α|² + |β|² = 1), and their inverse is their conjugate transpose (reversibility)."
    }
  },
  {
    id: 'mod6',
    number: '06',
    title: 'The CNOT Gate & Two-Qubit Registers',
    icon: '🔗',
    duration: '8 min read',
    topicTag: 'CNOT Gate',
    summary: 'Learn how multi-qubit states are formed via tensor products and how the CNOT gate enables conditional quantum logic.',
    contentHtml: `
      <div class="lesson-block">
        <h3>1. Multi-Qubit State Space (Tensor Product)</h3>
        <p>When we combine two single qubits |ψ₁⟩ and |ψ₂⟩, their joint state is given by the <strong>Kronecker tensor product</strong> (denoted ⊗):</p>
        <div class="formula-banner">
          |0⟩ ⊗ |0⟩ = |00⟩, \\quad |0⟩ ⊗ |1⟩ = |01⟩, \\quad |1⟩ ⊗ |0⟩ = |10⟩, \\quad |1⟩ ⊗ |1⟩ = |11⟩
        </div>
        <p>For 2 qubits, there are 4 basis states (2²). For 3 qubits, 8 states (2³). For N qubits, 2<sup>N</sup> states.</p>
      </div>

      <div class="lesson-block">
        <h3>2. The CNOT (Controlled-NOT) Gate</h3>
        <p>The CNOT gate requires two qubits:</p>
        <ul>
          <li><strong>Control Qubit (●):</strong> Decides whether the operation triggers.</li>
          <li><strong>Target Qubit (⊕):</strong> Receives the NOT (bit flip) if and only if the control qubit is |1⟩.</li>
        </ul>
        <table class="truth-table">
          <thead><tr><th>Input State |c, t⟩</th><th>Control Qubit (c)</th><th>Target Qubit (t)</th><th>Output State</th></tr></thead>
          <tbody>
            <tr><td>|00⟩</td><td>0</td><td>0</td><td>|00⟩</td></tr>
            <tr><td>|01⟩</td><td>0</td><td>1</td><td>|01⟩</td></tr>
            <tr><td>|10⟩</td><td>1</td><td>0</td><td><strong>|11⟩ (Flipped!)</strong></td></tr>
            <tr><td>|11⟩</td><td>1</td><td>1</td><td><strong>|10⟩ (Flipped!)</strong></td></tr>
          </tbody>
        </table>
      </div>
    `,
    checkpoint: {
      question: "If the input to a CNOT gate is |10⟩ (Control = 1, Target = 0), what is the resulting output state?",
      options: [
        "|11⟩",
        "|00⟩",
        "|10⟩",
        "|01⟩"
      ],
      correctIndex: 0,
      explanation: "Since the control qubit is 1, the target qubit flips from 0 to 1, producing |11⟩."
    }
  },
  {
    id: 'mod7',
    number: '07',
    title: 'Quantum Entanglement & Bell States',
    icon: '✨',
    duration: '10 min read',
    topicTag: 'Entanglement',
    summary: 'Discover Einstein\'s "spooky action at a distance", the famous Bell state (|00⟩ + |11⟩)/√2, and why entangled qubits cannot be described individually.',
    contentHtml: `
      <div class="lesson-block">
        <h3>1. What is Quantum Entanglement?</h3>
        <p><strong>Quantum entanglement</strong> is a physical phenomenon where two or more qubits become inextricably linked. Even if the entangled qubits are separated by light-years across the galaxy, measuring one qubit instantly determines the state of the other!</p>
        <p>Einstein famously referred to this as <em>"spukhafte Fernwirkung"</em> (spooky action at a distance).</p>
      </div>

      <div class="lesson-block">
        <h3>2. Creating the Canonical Bell State (|Φ⁺⟩)</h3>
        <p>You can create an entangled pair using just two gates: an <strong>H gate</strong> and a <strong>CNOT gate</strong>!</p>
        <ol>
          <li>Start with both qubits in ground state: <code>|00⟩</code></li>
          <li>Apply Hadamard to Qubit 0: creates <code>(|0⟩ + |1⟩)/√2 ⊗ |0⟩ = (|00⟩ + |10⟩)/√2</code></li>
          <li>Apply CNOT with Qubit 0 as control and Qubit 1 as target:
            <ul>
              <li>The term <code>|00⟩</code> stays <code>|00⟩</code></li>
              <li>The term <code>|10⟩</code> flips to <code>|11⟩</code></li>
            </ul>
          </li>
        </ol>
        <div class="formula-banner highlight">
          |Φ⁺⟩ = \\frac{|00⟩ + |11⟩}{\\sqrt{2}}
        </div>
        <p>Notice: there are NO |01⟩ or |10⟩ components! If you measure Qubit 0 and observe 0, Qubit 1 will be 0 with 100% certainty. If you measure Qubit 0 and observe 1, Qubit 1 will be 1 with 100% certainty!</p>
      </div>
    `,
    checkpoint: {
      question: "In the Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2, what happens to Qubit 1 if Qubit 0 is measured to be 1?",
      options: [
        "Qubit 1 immediately collapses to |1⟩ with 100% probability",
        "Qubit 1 has a 50/50 chance of being 0 or 1",
        "Qubit 1 collapses to |0⟩",
        "Qubit 1 is destroyed"
      ],
      correctIndex: 0,
      explanation: "Because the two qubits are maximally entangled in (|00⟩ + |11⟩)/√2, measuring Qubit 0 as 1 instantly leaves the system in state |11⟩, ensuring Qubit 1 is also 1."
    }
  },
  {
    id: 'mod8',
    number: '08',
    title: 'Beginner Quantum Algorithms',
    icon: '🚀',
    duration: '10 min read',
    topicTag: 'Quantum Fundamentals',
    summary: 'Discover how quantum parallelism, phase kickback, and constructive interference create speedups in Deutsch-Jozsa and Grover search.',
    contentHtml: `
      <div class="lesson-block">
        <h3>1. The Power of Quantum Parallelism</h3>
        <p>In classical computing, to evaluate a function <code>f(x)</code> for multiple inputs, a computer must evaluate each input one by one. In quantum computing, putting an N-qubit register into superposition allows the quantum oracle to evaluate all 2<sup>N</sup> inputs simultaneously in a single computational step!</p>
        <div class="formula-banner">
          |ψ⟩ = (1 / √2<sup>N</sup>) ∑ |x⟩
        </div>
      </div>

      <div class="lesson-block">
        <h3>2. The Deutsch-Jozsa Algorithm</h3>
        <p>The Deutsch-Jozsa algorithm provided the earliest mathematical proof of exponential quantum speedup over classical computing:</p>
        <ul>
          <li><strong>The Problem:</strong> Determine whether a hidden function is <em>constant</em> (same output for all inputs) or <em>balanced</em> (outputs 0 for half the inputs, 1 for the other half).</li>
          <li><strong>Classical Approach:</strong> Requires up to 2<sup>N-1</sup> + 1 queries in the worst case to be certain.</li>
          <li><strong>Quantum Advantage:</strong> Using quantum superposition and phase kickback, the algorithm solves the problem in <strong>strictly 1 single quantum query</strong>!</li>
        </ul>
      </div>

      <div class="lesson-block">
        <h3>3. Grover's Search Algorithm</h3>
        <p>Searching an unsorted database of N items requires scanning an average of N/2 items classically. Lov Grover's algorithm uses <strong>amplitude amplification</strong> (constructive interference) to pinpoint the desired target state in only ~√N operations—achieving a quadratic quantum speedup!</p>
        <div class="key-takeaway-box">
          <div class="takeaway-icon">💡</div>
          <div>
            <strong>Key Insight:</strong> Quantum algorithms don't just compute faster clock speeds—they orchestrate wave interference so wrong answers destructively cancel out while the correct answer's probability amplitude amplifies to near 100%!
          </div>
        </div>
      </div>
    `,
    checkpoint: {
      question: "How many queries does the Deutsch-Jozsa algorithm need on a quantum computer to distinguish whether a function is constant or balanced?",
      options: [
        "Exactly 1 single quantum query",
        "2^(N-1) + 1 queries",
        "N^2 queries",
        "Zero queries"
      ],
      correctIndex: 0,
      explanation: "Through quantum superposition and constructive interference, the Deutsch-Jozsa algorithm determines with 100% certainty if a function is constant or balanced in just 1 single evaluation."
    }
  }
];

window.LEARNING_MODULES = LEARNING_MODULES;
