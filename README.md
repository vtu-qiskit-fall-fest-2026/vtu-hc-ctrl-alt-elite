# QuantumGate Cloud Lab ⚛️
### Interactive Quantum Computing Learning & Circuit Simulator

A modern, student-friendly web platform designed to teach beginners and engineering students the fundamentals of quantum computing through interactive lessons, an elementary gate catalog with live sandboxes, a visual multi-qubit circuit simulator, exact Born-rule measurement analytics, multi-shot Monte Carlo sampling, and a comprehensive 25-question assessment with personalized topic improvement analysis.

---

## 🌟 Key Features

1. **Simple Student Login**
   - Frictionless onboarding: enter your student name (e.g., *Sanmeet*) and start learning immediately.
   - All progress, gates learned, circuit experiments, and assessment scores are persisted locally in `localStorage` without requiring a backend database.

2. **Interactive Learning Academy**
   - 7 Progressive Modules covering:
     - Classical Computing vs Quantum Computing
     - Anatomy of a Qubit (|0⟩, |1⟩ Dirac notation, Bloch sphere)
     - Superposition & Quantum Wavefunction Interference
     - Measurement, Wavefunction Collapse & Born's Rule
     - Quantum Gates & Unitary Circuit Architecture
     - The CNOT Gate & Multi-Qubit Tensor Products
     - Quantum Entanglement & Einstein-Podolsky-Rosen (EPR) Bell States
   - Embedded interactive checkpoints with instant educational feedback.

3. **Dedicated Quantum Gates Catalog & Sandboxes**
   - Detailed conceptual, matrix, and intuitive real-world explanations for:
     - **Pauli-X Gate** (Quantum NOT / Bit Flip)
     - **Pauli-Y Gate** (Bit-Flip + Phase-Flip)
     - **Pauli-Z Gate** (Phase Flip)
     - **Hadamard (H) Gate** (Superposition Engine)
     - **Phase (S) Gate** (π/2 Phase Shift)
     - **T Gate** (π/4 Phase Shift, Universal Quantum Computing)
     - **CNOT Gate** (Controlled-NOT / Entanglement Generator)
     - **SWAP Gate** (Qubit State Exchange)
   - *"Try This Gate"* Live Sandbox: toggle input basis states and watch the state vector, probabilities, and Bloch sphere coordinates update in real-time.

4. **Quantum Lab (Visual Quantum Circuit Simulator)**
   - Wire grid for 2, 3, or 4 qubits with initial state toggles (|0⟩ or |1⟩).
   - Drag-and-drop or click-to-place gate tokens.
   - Intelligent multi-qubit gate wiring for CNOT (Control ● and Target ⊕) and SWAP (×).
   - Dynamic **Gate Inspector** detailing the exact input, matrix transformation, and output for any selected gate.
   - One-click loadable presets:
     - *Hadamard Superposition*
     - *Pauli-X Bit Flip*
     - *Bell State (Entanglement)*
     - *Quantum Phase Flip (H-Z-H)*
     - *GHZ 3-Qubit Entanglement*
     - *Quantum SWAP*

5. **Measurement & Multi-Shot Sampling**
   - Exact theoretical state vector probability distribution ($P(x) = |\alpha_x|^2$).
   - Monte Carlo multi-shot hardware emulator (100, 500, 1000 shots).
   - Real-time comparison between theoretical predictions and empirical measured counts.
   - Reduced density matrix Bloch sphere projections ($x, y, z, \theta, \phi$).

6. **25-Question Assessment & Scorecard**
   - Exactly 25 rigorous multiple-choice questions categorized by topic.
   - Real-time question navigator dots with answered status tracking.
   - Automated formula scoring: $\text{Percentage} = (\text{Score} / 25) \times 100$.
   - Certified scorecard with performance tiers (*Excellent*, *Very Good*, *Good*, *Needs Improvement*, *Beginner*).
   - Detailed **Improvement Analysis** identifying strong vs. weak topics.
   - Personalized **Recommended Learning** advice with direct navigation to revision topics.
   - Full question-by-question review detailing student choice, correct answers, and thorough explanations.
   - Multi-attempt historical tracking showing percentage improvement over time.

7. **Student Analytics Dashboard**
   - Comprehensive learning progress metrics.
   - Topic mastery proficiency bars.
   - Full history of assessment attempts.

---

## 🛠️ Technology Stack & GitHub Pages Compatibility

- **Pure HTML5, CSS3, & Vanilla JavaScript (ES6+)**
- **Zero External Backend**: Completely self-contained, requiring no Node.js server, Python server, Flask, or external database.
- **Instant Deployment**: Compatible out-of-the-box with **GitHub Pages**, Netlify, Vercel, or any static file host.
- **Responsive Design**: Tailored for desktops, laptops, tablets, and smartphones without horizontal overflow.

---

## 📁 Project Structure

```
QuantumGate/
│
├── index.html            # Main semantic HTML structure & modal containers
├── style.css             # Futuristic dark quantum design system & responsive CSS
├── README.md             # Project documentation & usage guide
│
└── js/
    ├── quantum-engine.js # Pure math complex arithmetic, state vector & unitary gate engine
    ├── gates-data.js     # Quantum gates catalog with mathematical matrices & analogies
    ├── learning-data.js  # 7 pedagogical academy modules with interactive checkpoints
    ├── quiz-data.js      # 25-question assessment bank categorized by topic
    ├── circuit-presets.js# Pre-built beginner-to-advanced quantum circuit templates
    └── app.js            # Main application controller, localStorage & UI orchestrator
```

---

## 🚀 How to Run Locally

Because this project is built with static web standards, you can run it simply by opening `index.html` in any modern web browser:

1. Double click `index.html` or open it with Google Chrome, Firefox, Safari, or Microsoft Edge.
2. Alternatively, serve it using any local static file server:
   ```bash
   # Python 3
   python -m http.server 8000
   ```
   Then navigate to `http://localhost:8000`.

---

## 📜 Educational Learning Cycle

$$\text{LEARN} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{EXPERIMENT} \longrightarrow \text{MEASURE} \longrightarrow \text{ANALYZE} \longrightarrow \text{TEST} \longrightarrow \text{IMPROVE}$$
