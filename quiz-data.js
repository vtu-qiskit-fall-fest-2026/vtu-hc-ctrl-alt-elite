/**
 * QuantumGate Cloud Lab - 25-Question Assessment Bank
 * Rigorous, educational multiple-choice questions aligned with curriculum
 * Categorized by topic to enable targeted improvement analysis
 */

const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    topic: 'Superposition',
    question: "What does the Hadamard (H) gate create when applied to a qubit in state |0⟩?",
    options: [
      "Always |0⟩",
      "Always |1⟩",
      "An equal superposition of |0⟩ and |1⟩: (|0⟩ + |1⟩)/√2",
      "It completely deletes the qubit from memory"
    ],
    correctIndex: 2,
    explanation: "The Hadamard gate transforms the computational basis state |0⟩ into the symmetric superposition state |+⟩ = (|0⟩ + |1⟩)/√2."
  },
  {
    id: 2,
    topic: 'Quantum Gates',
    question: "Which quantum gate acts as the quantum equivalent of the classical NOT gate by flipping |0⟩ to |1⟩ and |1⟩ to |0⟩?",
    options: [
      "Pauli-X Gate",
      "Pauli-Z Gate",
      "Hadamard Gate",
      "Phase (S) Gate"
    ],
    correctIndex: 0,
    explanation: "The Pauli-X gate performs a bit-flip operation: X|0⟩ = |1⟩ and X|1⟩ = |0⟩."
  },
  {
    id: 3,
    topic: 'Measurement',
    question: "According to the Born rule, if a qubit is in state |ψ⟩ = α|0⟩ + β|1⟩, what is the probability of measuring outcome 1?",
    options: [
      "α + β",
      "|β|²",
      "|α|²",
      "β / α"
    ],
    correctIndex: 1,
    explanation: "Born's rule states that the probability of observing an outcome is equal to the squared magnitude of its probability amplitude: P(1) = |β|²."
  },
  {
    id: 4,
    topic: 'Quantum Gates',
    question: "What is the primary effect of the Pauli-Z gate on the state |1⟩?",
    options: [
      "Flips it to |0⟩",
      "Applies a phase flip, changing |1⟩ to -|1⟩",
      "Leaves both |0⟩ and |1⟩ completely unchanged",
      "Creates an entangled pair"
    ],
    correctIndex: 1,
    explanation: "The Pauli-Z gate leaves |0⟩ unchanged but applies a π phase shift to |1⟩, resulting in Z|1⟩ = -|1⟩."
  },
  {
    id: 5,
    topic: 'CNOT Gate',
    question: "In a CNOT gate, what condition causes the target qubit to undergo a bit flip?",
    options: [
      "When the target qubit is currently 0",
      "When the control qubit is in state |1⟩",
      "Only when both qubits are in superposition",
      "When the circuit clock cycle reaches zero"
    ],
    correctIndex: 1,
    explanation: "The CNOT gate flips the target qubit if and only if the control qubit is in state |1⟩."
  },
  {
    id: 6,
    topic: 'Entanglement',
    question: "Which of the following two-qubit states represents a canonical maximally entangled Bell State?",
    options: [
      "(|00⟩ + |11⟩) / √2",
      "|00⟩",
      "(|00⟩ + |01⟩ + |10⟩ + |11⟩) / 2",
      "|10⟩"
    ],
    correctIndex: 0,
    explanation: "(|00⟩ + |11⟩)/√2 is the canonical Bell state (|Φ⁺⟩), where measuring one qubit instantaneously determines the state of the other."
  },
  {
    id: 7,
    topic: 'Quantum Fundamentals',
    question: "How many distinct computational basis states can an N-qubit quantum register represent simultaneously in superposition?",
    options: [
      "N states",
      "2N states",
      "2^N states",
      "N^2 states"
    ],
    correctIndex: 2,
    explanation: "An N-qubit system has a state vector of dimension 2^N, enabling 2^N amplitudes in superposition."
  },
  {
    id: 8,
    topic: 'Measurement',
    question: "Why do repeated measurements (shots) of a quantum circuit in superposition produce slightly varying counts across runs?",
    options: [
      "Because quantum measurement is fundamentally probabilistic (Born rule)",
      "Because classical computers have faulty transistors",
      "Because the wires lose electrical voltage over time",
      "Because qubits overheat after 100 shots"
    ],
    correctIndex: 0,
    explanation: "Quantum mechanics is inherently probabilistic. Sampling N shots produces statistical fluctuations around the exact theoretical probabilities."
  },
  {
    id: 9,
    topic: 'Quantum Gates',
    question: "What is the relationship between the Phase (S) gate and the Pauli-Z gate?",
    options: [
      "S = Z²",
      "S² = Z (S is the square root of Z)",
      "S and Z are the exact same gate",
      "S is the inverse of the Hadamard gate"
    ],
    correctIndex: 1,
    explanation: "The S gate applies a π/2 phase shift. Applying S twice gives (π/2 + π/2 = π), which equals the Pauli-Z gate: S² = Z."
  },
  {
    id: 10,
    topic: 'Quantum Gates',
    question: "What phase shift does the T gate apply to the |1⟩ component of a qubit?",
    options: [
      "π (180°)",
      "π/2 (90°)",
      "π/4 (45°)",
      "2π (360°)"
    ],
    correctIndex: 2,
    explanation: "The T gate applies a π/4 (45°) phase rotation: T|1⟩ = e^{iπ/4}|1⟩."
  },
  {
    id: 11,
    topic: 'CNOT Gate',
    question: "If a two-qubit system is initialized in state |10⟩ (Control = 1, Target = 0), what is the state after applying a CNOT gate?",
    options: [
      "|10⟩",
      "|01⟩",
      "|11⟩",
      "|00⟩"
    ],
    correctIndex: 2,
    explanation: "Because Control is 1, the target qubit flips from 0 to 1, producing |11⟩."
  },
  {
    id: 12,
    topic: 'Quantum Gates',
    question: "What does the SWAP gate do to a pair of qubits A and B?",
    options: [
      "It deletes qubit B and doubles qubit A",
      "It exchanges the quantum states of qubit A and qubit B",
      "It multiplies both qubits by -1",
      "It projects both qubits into the ground state |0⟩"
    ],
    correctIndex: 1,
    explanation: "The SWAP gate interchanges the states of the two qubits: SWAP|a, b⟩ = |b, a⟩."
  },
  {
    id: 13,
    topic: 'Quantum Fundamentals',
    question: "What geometric sphere is commonly used to visualize the state of a single pure qubit?",
    options: [
      "The Riemann Sphere",
      "The Bloch Sphere",
      "The Poincare Sphere",
      "The Kepler Sphere"
    ],
    correctIndex: 1,
    explanation: "The Bloch sphere is a geometrical representation of the pure state space of a two-level quantum system (qubit)."
  },
  {
    id: 14,
    topic: 'Measurement',
    question: "What happens to a qubit in superposition immediately after it undergoes a projective measurement?",
    options: [
      "It stays in continuous superposition",
      "Its state collapses into one of the definite basis states (|0⟩ or |1⟩)",
      "It splits into two separate qubits",
      "Its amplitude increases by a factor of 2"
    ],
    correctIndex: 1,
    explanation: "Wavefunction collapse dictates that measurement forces the qubit into one of the eigenbasis states corresponding to the observed outcome."
  },
  {
    id: 15,
    topic: 'Superposition',
    question: "For a valid normalized quantum state |ψ⟩ = α|0⟩ + β|1⟩, which mathematical condition must always hold true?",
    options: [
      "|α|² + |β|² = 1",
      "α + β = 0",
      "|α| - |β| = 1",
      "α × β = 1"
    ],
    correctIndex: 0,
    explanation: "Conservation of total probability requires the sum of squared magnitudes of all amplitudes to equal 1: |α|² + |β|² = 1."
  },
  {
    id: 16,
    topic: 'Entanglement',
    question: "Which standard circuit combination produces the Bell state (|00⟩ + |11⟩)/√2 from initial state |00⟩?",
    options: [
      "Apply X to Q0, then X to Q1",
      "Apply H to Q0, then CNOT with Q0 as control and Q1 as target",
      "Apply Z to Q0, then SWAP Q0 and Q1",
      "Apply H to both Q0 and Q1 simultaneously without any CNOT"
    ],
    correctIndex: 1,
    explanation: "Hadamard on Q0 produces (|0⟩+|1⟩)/√2 ⊗ |0⟩ = (|00⟩+|10⟩)/√2. The subsequent CNOT flips the target only for the |10⟩ component, yielding (|00⟩+|11⟩)/√2."
  },
  {
    id: 17,
    topic: 'Quantum Gates',
    question: "What is the result of applying two Hadamard gates in immediate succession to any qubit (H · H)?",
    options: [
      "It permanently randomizes the state",
      "It returns the qubit to its original initial state (H is self-inverse: H² = I)",
      "It creates an entangled Bell state",
      "It multiplies the qubit by i"
    ],
    correctIndex: 1,
    explanation: "The Hadamard gate is Hermitian and unitary, meaning H = H† = H⁻¹. Therefore, H² = I (Identity matrix), returning the state to its original condition."
  },
  {
    id: 18,
    topic: 'Quantum Fundamentals',
    question: "Why can't an arbitrary unknown quantum state be copied perfectly to another qubit?",
    options: [
      "Due to the No-Cloning Theorem",
      "Due to insufficient memory RAM",
      "Because quantum computers lack copy-paste commands",
      "Due to classical voltage drop"
    ],
    correctIndex: 0,
    explanation: "The No-Cloning Theorem proves that the linearity of quantum mechanics prohibits creating an identical copy of an arbitrary unknown quantum state."
  },
  {
    id: 19,
    topic: 'Quantum Gates',
    question: "Which Pauli gate produces both a bit flip AND an imaginary phase factor i?",
    options: [
      "Pauli-X",
      "Pauli-Y",
      "Pauli-Z",
      "Hadamard"
    ],
    correctIndex: 1,
    explanation: "The Pauli-Y gate matrix is [[0, -i], [i, 0]], which rotates by π around the Y-axis, combining bit-flip and phase characteristics."
  },
  {
    id: 20,
    topic: 'Measurement',
    question: "If a circuit produces the state |ψ⟩ = (1/2)|00⟩ + (√3/2)|11⟩, what is the exact probability of measuring |00⟩?",
    options: [
      "50%",
      "25% ((1/2)² = 1/4)",
      "75% ((√3/2)² = 3/4)",
      "100%"
    ],
    correctIndex: 1,
    explanation: "The probability of measuring |00⟩ is |1/2|² = 1/4 = 0.25 = 25%."
  },
  {
    id: 21,
    topic: 'CNOT Gate',
    question: "If the input to a CNOT gate is |01⟩ (Control = 0, Target = 1), what is the output state?",
    options: [
      "|01⟩ (Unchanged, because control is 0)",
      "|11⟩",
      "|00⟩",
      "|10⟩"
    ],
    correctIndex: 0,
    explanation: "Since the control qubit is 0, the CNOT gate does not trigger, leaving the target qubit untouched as |01⟩."
  },
  {
    id: 22,
    topic: 'Quantum Circuits',
    question: "In a standard visual quantum circuit diagram, how does the flow of time proceed?",
    options: [
      "From right to left",
      "From top to bottom",
      "From left to right",
      "Circuits execute in random non-chronological order"
    ],
    correctIndex: 2,
    explanation: "Quantum circuit diagrams represent time on the horizontal axis, executing gate operations sequentially from left to right."
  },
  {
    id: 23,
    topic: 'Entanglement',
    question: "If Alice and Bob share the entangled Bell state (|00⟩ + |11⟩)/√2 and Alice measures her qubit to be 0, what will Bob observe?",
    options: [
      "Bob will definitely measure 0 with 100% certainty",
      "Bob has a 50% chance of measuring 1",
      "Bob will always measure 1",
      "Bob's qubit is automatically erased"
    ],
    correctIndex: 0,
    explanation: "In (|00⟩ + |11⟩)/√2, Alice's measurement of 0 collapses the joint state to |00⟩. Consequently, Bob's measurement will be 0 with 100% certainty."
  },
  {
    id: 24,
    topic: 'Quantum Gates',
    question: "How many consecutive CNOT gates can be combined to implement a full SWAP gate between two qubits?",
    options: [
      "1 CNOT",
      "2 CNOTs",
      "3 alternating CNOTs",
      "10 CNOTs"
    ],
    correctIndex: 2,
    explanation: "A SWAP gate between two qubits can be constructed from three alternating CNOT gates: CNOT(0,1) · CNOT(1,0) · CNOT(0,1)."
  },
  {
    id: 25,
    topic: 'Superposition',
    question: "What state is produced when a Hadamard gate is applied to the state |1⟩?",
    options: [
      "|0⟩",
      "|-⟩ = (|0⟩ - |1⟩) / √2",
      "|+⟩ = (|0⟩ + |1⟩) / √2",
      "-|1⟩"
    ],
    correctIndex: 1,
    explanation: "H|1⟩ creates the orthogonal superposition state |-⟩ = (|0⟩ - |1⟩)/√2, which has a relative phase of π (180°)."
  }
];

window.ASSESSMENT_QUESTIONS = ASSESSMENT_QUESTIONS;
