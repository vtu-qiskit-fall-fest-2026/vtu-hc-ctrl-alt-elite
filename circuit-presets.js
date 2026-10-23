/**
 * QuantumGate Cloud Lab - Preset Circuits
 * Verified beginner-to-intermediate quantum circuits with educational explanations
 */

const CIRCUIT_PRESETS = [
  {
    id: 'hadamard-superposition',
    title: 'Hadamard Superposition',
    badge: 'Beginner',
    numQubits: 2,
    numCols: 4,
    description: 'Applies an H gate to Qubit 0, putting it into an equal 50/50 superposition of |0⟩ and |1⟩.',
    expectedOutcome: 'Measuring Q0 yields outcome 0 ~50% of the time and outcome 1 ~50% of the time (|00⟩: 50%, |10⟩: 50%).',
    grid: [
      // Col 0
      [
        { type: 'H', id: 'H' },
        null
      ],
      // Col 1
      [
        { type: 'MEASURE', id: 'MEASURE' },
        null
      ],
      // Col 2
      [null, null],
      // Col 3
      [null, null]
    ]
  },
  {
    id: 'bit-flip-x',
    title: 'Pauli-X Bit Flip',
    badge: 'Beginner',
    numQubits: 2,
    numCols: 4,
    description: 'Flips Qubit 0 from |0⟩ to |1⟩ using the quantum NOT gate.',
    expectedOutcome: 'Qubit 0 is deterministically |1⟩. Measurement yields 100% |10⟩ (or |1⟩ for Q0).',
    grid: [
      [
        { type: 'X', id: 'X' },
        null
      ],
      [
        { type: 'MEASURE', id: 'MEASURE' },
        null
      ],
      [null, null],
      [null, null]
    ]
  },
  {
    id: 'bell-state',
    title: 'Bell State (Entanglement)',
    badge: 'Classic',
    numQubits: 2,
    numCols: 4,
    description: 'Creates the famous Einstein-Podolsky-Rosen (EPR) Bell state (|00⟩ + |11⟩)/√2. Measuring one qubit instantaneously dictates the state of the other.',
    expectedOutcome: 'Outcomes |00⟩ (~50%) and |11⟩ (~50%). States |01⟩ and |10⟩ are strictly 0%!',
    grid: [
      // Col 0: H on Q0
      [
        { type: 'H', id: 'H' },
        null
      ],
      // Col 1: CNOT Q0 -> Q1
      [
        { type: 'CNOT', role: 'control', target: 1 },
        { type: 'CNOT', role: 'target', control: 0 }
      ],
      // Col 2: Measure both
      [
        { type: 'MEASURE', id: 'MEASURE' },
        { type: 'MEASURE', id: 'MEASURE' }
      ],
      // Col 3: empty
      [null, null]
    ]
  },
  {
    id: 'phase-flip-z',
    title: 'Quantum Phase Flip',
    badge: 'Intermediate',
    numQubits: 2,
    numCols: 4,
    description: 'Prepares |+⟩ via H, flips phase with Z to get |-⟩, then applies another H. Demonstrates quantum interference!',
    expectedOutcome: 'Constructive/destructive interference produces |10⟩ with 100% certainty (H·Z·H|0⟩ = |1⟩).',
    grid: [
      [
        { type: 'H', id: 'H' },
        null
      ],
      [
        { type: 'Z', id: 'Z' },
        null
      ],
      [
        { type: 'H', id: 'H' },
        null
      ],
      [
        { type: 'MEASURE', id: 'MEASURE' },
        null
      ]
    ]
  },
  {
    id: 'ghz-entanglement',
    title: 'GHZ State (3-Qubit Entanglement)',
    badge: 'Advanced',
    numQubits: 3,
    numCols: 5,
    description: 'Greenberger-Horne-Zeilinger state (|000⟩ + |111⟩)/√2 across 3 qubits. Genuine tri-partite quantum entanglement.',
    expectedOutcome: 'Outcomes |000⟩ (~50%) and |111⟩ (~50%). All intermediate combinations are zero.',
    grid: [
      // Col 0: H on Q0
      [
        { type: 'H', id: 'H' },
        null,
        null
      ],
      // Col 1: CNOT Q0 -> Q1
      [
        { type: 'CNOT', role: 'control', target: 1 },
        { type: 'CNOT', role: 'target', control: 0 },
        null
      ],
      // Col 2: CNOT Q1 -> Q2
      [
        null,
        { type: 'CNOT', role: 'control', target: 2 },
        { type: 'CNOT', role: 'target', control: 1 }
      ],
      // Col 3: Measure all
      [
        { type: 'MEASURE', id: 'MEASURE' },
        { type: 'MEASURE', id: 'MEASURE' },
        { type: 'MEASURE', id: 'MEASURE' }
      ],
      [null, null, null]
    ]
  },
  {
    id: 'swap-circuit',
    title: 'Quantum SWAP Gate',
    badge: 'Two Qubits',
    numQubits: 2,
    numCols: 4,
    description: 'Initializes Q0 with X (state |1⟩) and Q1 with |0⟩, then swaps them. Demonstrates state exchange.',
    expectedOutcome: 'State transforms from |10⟩ to |01⟩ (100% probability of |01⟩).',
    grid: [
      [
        { type: 'X', id: 'X' },
        null
      ],
      [
        { type: 'SWAP', target: 1 },
        { type: 'SWAP', target: 0 }
      ],
      [
        { type: 'MEASURE', id: 'MEASURE' },
        { type: 'MEASURE', id: 'MEASURE' }
      ],
      [null, null]
    ]
  }
];

window.CIRCUIT_PRESETS = CIRCUIT_PRESETS;
