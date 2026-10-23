/**
 * QuantumGate Cloud Lab - Quantum Gates Knowledge Base & Interactive Catalog
 * Complete pedagogical details for each elementary quantum gate
 */

const QUANTUM_GATES = [
  {
    id: 'X',
    name: 'Pauli-X Gate',
    symbol: 'X',
    category: 'Single Qubit',
    subtitle: 'The Quantum NOT Gate (Bit Flip)',
    badgeColor: '#00f0ff',
    simpleExplanation: 'Flips the state of a qubit. Transforms |0⟩ into |1⟩ and |1⟩ into |0⟩. It rotates the qubit by 180° (π radians) around the X-axis of the Bloch sphere.',
    intuitiveAnalogy: 'Imagine a classical light switch: if the light is OFF (|0⟩), flipping the switch turns it ON (|1⟩). In quantum computing, the Pauli-X gate performs this exact bit-flip operation on quantum states.',
    inputOutput: [
      { input: '|0⟩', output: '|1⟩', desc: 'Flips ground state to excited state' },
      { input: '|1⟩', output: '|0⟩', desc: 'Flips excited state to ground state' },
      { input: 'α|0⟩ + β|1⟩', output: 'β|0⟩ + α|1⟩', desc: 'Swaps arbitrary amplitudes' }
    ],
    matrix: [
      ['0', '1'],
      ['1', '0']
    ],
    mathEquation: 'X|0⟩ = |1⟩, \\quad X|1⟩ = |0⟩',
    blochEffect: 'Rotates the Bloch vector by 180° (π radians) around the X-axis, inverting the Z-coordinate.',
    interactiveDefaults: {
      defaultState: '0',
      availableStates: [
        { label: '|0⟩', val: '0' },
        { label: '|1⟩', val: '1' },
        { label: '|+⟩ = (|0⟩+|1⟩)/√2', val: '+' }
      ]
    }
  },
  {
    id: 'Y',
    name: 'Pauli-Y Gate',
    symbol: 'Y',
    category: 'Single Qubit',
    subtitle: 'Bit-Flip and Phase-Flip Combined',
    badgeColor: '#7928ca',
    simpleExplanation: 'Flips both the bit value and introduces a complex phase factor i (imaginary unit). It rotates the qubit by 180° around the Y-axis of the Bloch sphere.',
    intuitiveAnalogy: 'Like flipping a coin over (bit-flip) while simultaneously twisting it sideways into the imaginary dimension by 90 degrees.',
    inputOutput: [
      { input: '|0⟩', output: 'i|1⟩', desc: 'Flips to |1⟩ with an imaginary phase +i' },
      { input: '|1⟩', output: '-i|0⟩', desc: 'Flips to |0⟩ with an imaginary phase -i' }
    ],
    matrix: [
      ['0', '-i'],
      ['i', '0']
    ],
    mathEquation: 'Y = \\begin{bmatrix} 0 & -i \\\\ i & 0 \\end{bmatrix}',
    blochEffect: 'Rotates the Bloch sphere by π radians around the Y-axis. Flips North pole to South pole while shifting phase along the equator.',
    interactiveDefaults: {
      defaultState: '0',
      availableStates: [
        { label: '|0⟩', val: '0' },
        { label: '|1⟩', val: '1' },
        { label: '|+⟩', val: '+' }
      ]
    }
  },
  {
    id: 'Z',
    name: 'Pauli-Z Gate',
    symbol: 'Z',
    category: 'Single Qubit',
    subtitle: 'Phase Flip Gate',
    badgeColor: '#ff007a',
    simpleExplanation: 'Leaves |0⟩ unchanged, but flips the phase of |1⟩ by applying a minus sign (-1 = e^{iπ}). It performs a 180° rotation around the Z-axis of the Bloch sphere.',
    intuitiveAnalogy: 'Imagine an analog clock: moving the hour hand without changing its length, reversing the direction of wave interference from constructive to destructive.',
    inputOutput: [
      { input: '|0⟩', output: '|0⟩', desc: 'Zero amplitude is unchanged' },
      { input: '|1⟩', output: '-|1⟩', desc: 'Phase flips to negative' },
      { input: '|+⟩ = (|0⟩+|1⟩)/√2', output: '|-⟩ = (|0⟩-|1⟩)/√2', desc: 'Swaps |+⟩ and |-⟩ superposition states' }
    ],
    matrix: [
      ['1', '0'],
      ['0', '-1']
    ],
    mathEquation: 'Z|0⟩ = |0⟩, \\quad Z|1⟩ = -|1⟩',
    blochEffect: 'Rotates around the Z-axis by 180°. Points on the equator (superpositions) swing to the opposite side, altering phase without changing measurement probabilities in the computational basis.',
    interactiveDefaults: {
      defaultState: '+',
      availableStates: [
        { label: '|0⟩', val: '0' },
        { label: '|1⟩', val: '1' },
        { label: '|+⟩', val: '+' }
      ]
    }
  },
  {
    id: 'H',
    name: 'Hadamard (H) Gate',
    symbol: 'H',
    category: 'Single Qubit',
    subtitle: 'The Superposition Engine',
    badgeColor: '#00ff88',
    simpleExplanation: 'The most fundamental gate in quantum computing. It takes a definite basis state (|0⟩ or |1⟩) and transforms it into an equal superposition of both states. It rotates the qubit state by 180° around the diagonal axis (X+Z)/√2.',
    intuitiveAnalogy: 'Imagine a coin resting flat on a table showing Heads (|0⟩). The Hadamard gate sets the coin spinning vigorously on its edge. While spinning, it is simultaneously both Heads and Tails with a 50/50 chance when stopped!',
    inputOutput: [
      { input: '|0⟩', output: '|+⟩ = (|0⟩ + |1⟩) / √2', desc: 'Equal superposition with relative phase 0° (50% 0, 50% 1)' },
      { input: '|1⟩', output: '|-⟩ = (|0⟩ - |1⟩) / √2', desc: 'Equal superposition with relative phase 180° (50% 0, 50% 1)' },
      { input: '|+⟩', output: '|0⟩', desc: 'H is self-inverse: H(H|0⟩) = |0⟩' }
    ],
    matrix: [
      ['1/√2', '1/√2'],
      ['1/√2', '-1/√2']
    ],
    mathEquation: 'H = \\frac{1}{\\sqrt{2}}\\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\end{bmatrix}',
    blochEffect: 'Swaps the Z-axis and X-axis. Rotates the North pole (|0⟩) down to the equator (+X axis), turning certainty into maximum superposition.',
    interactiveDefaults: {
      defaultState: '0',
      availableStates: [
        { label: '|0⟩', val: '0' },
        { label: '|1⟩', val: '1' },
        { label: '|+⟩', val: '+' }
      ]
    }
  },
  {
    id: 'S',
    name: 'Phase (S) Gate',
    symbol: 'S',
    category: 'Single Qubit',
    subtitle: 'Quarter-Turn Phase Shift (π/2)',
    badgeColor: '#38bdf8',
    simpleExplanation: 'Applies a 90° (π/2 radians) phase shift to the |1⟩ component of a qubit, multiplying it by the imaginary unit i. The S gate is the square root of the Pauli-Z gate (S² = Z).',
    intuitiveAnalogy: 'Turning a dial on an audio synthesizer by a quarter turn. The volume (probability) stays identical, but the sound wave shifts in time by a quarter cycle.',
    inputOutput: [
      { input: '|0⟩', output: '|0⟩', desc: 'State |0⟩ remains unchanged' },
      { input: '|1⟩', output: 'i|1⟩ = e^{iπ/2}|1⟩', desc: 'Applies 90° phase shift' },
      { input: '|+⟩', output: '|R⟩ = (|0⟩ + i|1⟩)/√2', desc: 'Creates right-circular polarized equatorial state' }
    ],
    matrix: [
      ['1', '0'],
      ['0', 'i']
    ],
    mathEquation: 'S = \\begin{bmatrix} 1 & 0 \\\\ 0 & i \\end{bmatrix}, \\quad S^2 = Z',
    blochEffect: 'Rotates the Bloch vector 90° clockwise around the Z-axis. Leaves the poles intact while spinning points on the equator.',
    interactiveDefaults: {
      defaultState: '+',
      availableStates: [
        { label: '|0⟩', val: '0' },
        { label: '|1⟩', val: '1' },
        { label: '|+⟩', val: '+' }
      ]
    }
  },
  {
    id: 'T',
    name: 'T Gate (π/8 Gate)',
    symbol: 'T',
    category: 'Single Qubit',
    subtitle: 'Eighth-Turn Phase Shift (π/4)',
    badgeColor: '#eab308',
    simpleExplanation: 'Applies a 45° (π/4 radians) phase shift to the |1⟩ state: e^{iπ/4} = (1+i)/√2. It is the fourth root of Z (T⁴ = Z, T² = S). Crucially, adding the T gate enables universal quantum computation!',
    intuitiveAnalogy: 'A fine precision vernier adjustment knob that rotates quantum states by 45°. Without the T gate, circuits can be simulated efficiently on classical computers (Gottesman-Knill theorem); adding T unlocks true quantum power!',
    inputOutput: [
      { input: '|0⟩', output: '|0⟩', desc: 'State |0⟩ remains unchanged' },
      { input: '|1⟩', output: 'e^{iπ/4}|1⟩ = \\frac{1+i}{\\sqrt{2}}|1⟩', desc: 'Applies 45° phase shift' }
    ],
    matrix: [
      ['1', '0'],
      ['0', 'e^{iπ/4}']
    ],
    mathEquation: 'T = \\begin{bmatrix} 1 & 0 \\\\ 0 & e^{i\\pi/4} \\end{bmatrix}, \\quad T^2 = S',
    blochEffect: 'Rotates the state vector 45° around the Z-axis. Used heavily in fault-tolerant magic state distillation.',
    interactiveDefaults: {
      defaultState: '+',
      availableStates: [
        { label: '|0⟩', val: '0' },
        { label: '|1⟩', val: '1' },
        { label: '|+⟩', val: '+' }
      ]
    }
  },
  {
    id: 'CNOT',
    name: 'CNOT Gate (Controlled-NOT)',
    symbol: 'CX',
    category: 'Two Qubits',
    subtitle: 'The Entanglement Generator',
    badgeColor: '#ec4899',
    simpleExplanation: 'Acts on two qubits: a Control qubit (●) and a Target qubit (⊕). If the control qubit is in state |1⟩, it flips the target qubit. If the control is |0⟩, the target is left untouched. When combined with an H gate, it creates quantum entanglement!',
    intuitiveAnalogy: 'A high-tech automated door: ONLY if the security badge sensor detects an authorized person (|1⟩) does the mechanical lock trigger and swing open (NOT). If no badge is present (|0⟩), nothing happens.',
    inputOutput: [
      { input: '|00⟩', output: '|00⟩', desc: 'Control is 0 → Target unchanged' },
      { input: '|01⟩', output: '|01⟩', desc: 'Control is 0 → Target unchanged' },
      { input: '|10⟩', output: '|11⟩', desc: 'Control is 1 → Target flipped 0 to 1' },
      { input: '|11⟩', output: '|10⟩', desc: 'Control is 1 → Target flipped 1 to 0' },
      { input: '(|0⟩+|1⟩)|0⟩/√2', output: '(|00⟩+|11⟩)/√2', desc: 'Creates the famous Bell Entangled State!' }
    ],
    matrix: [
      ['1', '0', '0', '0'],
      ['0', '1', '0', '0'],
      ['0', '0', '0', '1'],
      ['0', '0', '1', '0']
    ],
    mathEquation: '\\text{CNOT}|c, t\\rangle = |c, c \\oplus t\\rangle',
    blochEffect: 'Creates correlated two-qubit composite states. For entangled states, individual qubits can no longer be described on separate Bloch spheres—they become interconnected!',
    interactiveDefaults: {
      defaultState: '10',
      availableStates: [
        { label: '|00⟩', val: '00' },
        { label: '|10⟩', val: '10' },
        { label: '|01⟩', val: '01' },
        { label: '|11⟩', val: '11' },
        { label: 'Bell: (|00⟩+|11⟩)/√2', val: 'bell' }
      ]
    }
  },
  {
    id: 'SWAP',
    name: 'SWAP Gate',
    symbol: 'SWAP',
    category: 'Two Qubits',
    subtitle: 'Qubit State Exchange',
    badgeColor: '#10b981',
    simpleExplanation: 'Exchanges the quantum states of two qubits. Whatever information qubit A possessed is transferred to qubit B, and vice-versa. Can be constructed using three consecutive alternating CNOT gates.',
    intuitiveAnalogy: 'Passing two glasses of water across a table: Person A gets Glass B, and Person B gets Glass A in a single simultaneous transfer step.',
    inputOutput: [
      { input: '|00⟩', output: '|00⟩', desc: 'Both zero: unchanged' },
      { input: '|01⟩', output: '|10⟩', desc: 'States swapped across qubits' },
      { input: '|10⟩', output: '|01⟩', desc: 'States swapped across qubits' },
      { input: '|11⟩', output: '|11⟩', desc: 'Both one: unchanged' }
    ],
    matrix: [
      ['1', '0', '0', '0'],
      ['0', '0', '1', '0'],
      ['0', '1', '0', '0'],
      ['0', '0', '0', '1']
    ],
    mathEquation: '\\text{SWAP}|a, b\\rangle = |b, a\\rangle',
    blochEffect: 'Directly interchanges the state vectors and Bloch coordinates between the two physical qubits.',
    interactiveDefaults: {
      defaultState: '01',
      availableStates: [
        { label: '|01⟩', val: '01' },
        { label: '|10⟩', val: '10' },
        { label: '|00⟩', val: '00' },
        { label: '|11⟩', val: '11' }
      ]
    }
  }
];

window.QUANTUM_GATES = QUANTUM_GATES;
