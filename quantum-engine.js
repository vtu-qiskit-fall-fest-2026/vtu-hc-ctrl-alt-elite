/**
 * QuantumGate Cloud Lab - Quantum Physics Engine
 * Mathematically rigorous state-vector quantum simulator
 * Supports N-qubit registers, unitary gate operations, 
 * Born-rule projective measurement, and Monte Carlo multi-shot sampling.
 */

class Complex {
  constructor(re = 0, im = 0) {
    this.re = re;
    this.im = im;
  }

  static fromPolar(r, theta) {
    return new Complex(r * Math.cos(theta), r * Math.sin(theta));
  }

  add(other) {
    return new Complex(this.re + other.re, this.im + other.im);
  }

  sub(other) {
    return new Complex(this.re - other.re, this.im - other.im);
  }

  mul(other) {
    if (typeof other === 'number') {
      return new Complex(this.re * other, this.im * other);
    }
    return new Complex(
      this.re * other.re - this.im * other.im,
      this.re * other.im + this.im * other.re
    );
  }

  div(scalar) {
    return new Complex(this.re / scalar, this.im / scalar);
  }

  magSq() {
    return this.re * this.re + this.im * this.im;
  }

  mag() {
    return Math.sqrt(this.magSq());
  }

  phase() {
    return Math.atan2(this.im, this.re);
  }

  toString(decimals = 3) {
    const r = this.re.toFixed(decimals);
    const i = Math.abs(this.im).toFixed(decimals);
    if (Math.abs(this.im) < 1e-6) return `${r}`;
    if (Math.abs(this.re) < 1e-6) return `${this.im < 0 ? '-' : ''}${i}i`;
    return `${r} ${this.im >= 0 ? '+' : '-'} ${i}i`;
  }
}

class QuantumCircuitEngine {
  constructor(numQubits = 2) {
    this.numQubits = Math.max(1, Math.min(4, numQubits));
    this.resetState();
  }

  setNumQubits(numQubits) {
    this.numQubits = Math.max(1, Math.min(4, numQubits));
    this.resetState();
  }

  resetState(initialQubits = null) {
    const dim = 1 << this.numQubits;
    this.state = new Array(dim).fill(null).map(() => new Complex(0, 0));

    // Calculate initial state from individual qubit initial values (0 or 1)
    let initialIndex = 0;
    if (initialQubits && Array.isArray(initialQubits)) {
      for (let q = 0; q < this.numQubits; q++) {
        if (initialQubits[q] === 1) {
          initialIndex |= (1 << (this.numQubits - 1 - q));
        }
      }
    }
    this.state[initialIndex] = new Complex(1, 0);
  }

  /**
   * Applies a single-qubit 2x2 unitary matrix to qubit q (0 = top qubit)
   * U = [[u00, u01], [u10, u11]]
   */
  applySingleQubitGate(qubitIndex, u00, u01, u10, u11) {
    const bitPos = this.numQubits - 1 - qubitIndex;
    const bitMask = 1 << bitPos;
    const dim = 1 << this.numQubits;
    const newState = new Array(dim);

    for (let i = 0; i < dim; i++) {
      if ((i & bitMask) === 0) {
        const i0 = i;
        const i1 = i | bitMask;
        const v0 = this.state[i0];
        const v1 = this.state[i1];

        // newState[i0] = u00*v0 + u01*v1
        newState[i0] = u00.mul(v0).add(u01.mul(v1));
        // newState[i1] = u10*v0 + u11*v1
        newState[i1] = u10.mul(v0).add(u11.mul(v1));
      }
    }
    this.state = newState;
    this.normalize();
  }

  /**
   * Pauli-X (NOT / Bit Flip)
   */
  applyX(qubitIndex) {
    this.applySingleQubitGate(
      qubitIndex,
      new Complex(0, 0), new Complex(1, 0),
      new Complex(1, 0), new Complex(0, 0)
    );
  }

  /**
   * Pauli-Y (Bit & Phase Flip)
   */
  applyY(qubitIndex) {
    this.applySingleQubitGate(
      qubitIndex,
      new Complex(0, 0), new Complex(0, -1),
      new Complex(0, 1), new Complex(0, 0)
    );
  }

  /**
   * Pauli-Z (Phase Flip)
   */
  applyZ(qubitIndex) {
    this.applySingleQubitGate(
      qubitIndex,
      new Complex(1, 0), new Complex(0, 0),
      new Complex(0, 0), new Complex(-1, 0)
    );
  }

  /**
   * Hadamard Gate (Superposition creator)
   */
  applyH(qubitIndex) {
    const invSqrt2 = 1 / Math.SQRT2;
    this.applySingleQubitGate(
      qubitIndex,
      new Complex(invSqrt2, 0), new Complex(invSqrt2, 0),
      new Complex(invSqrt2, 0), new Complex(-invSqrt2, 0)
    );
  }

  /**
   * Phase S Gate (π/2 phase shift)
   */
  applyS(qubitIndex) {
    this.applySingleQubitGate(
      qubitIndex,
      new Complex(1, 0), new Complex(0, 0),
      new Complex(0, 0), new Complex(0, 1) // e^(i*pi/2) = i
    );
  }

  /**
   * T Gate (π/4 phase shift, non-Clifford)
   */
  applyT(qubitIndex) {
    const cosPi4 = Math.cos(Math.PI / 4);
    const sinPi4 = Math.sin(Math.PI / 4);
    this.applySingleQubitGate(
      qubitIndex,
      new Complex(1, 0), new Complex(0, 0),
      new Complex(0, 0), new Complex(cosPi4, sinPi4)
    );
  }

  /**
   * CNOT Gate (Controlled NOT)
   */
  applyCNOT(controlQubit, targetQubit) {
    if (controlQubit === targetQubit) return;
    const ctrlBitPos = this.numQubits - 1 - controlQubit;
    const tgtBitPos = this.numQubits - 1 - targetQubit;
    const ctrlMask = 1 << ctrlBitPos;
    const tgtMask = 1 << tgtBitPos;
    const dim = 1 << this.numQubits;
    const newState = [...this.state];

    for (let i = 0; i < dim; i++) {
      // If control bit is 1 and target bit is 0, swap amplitude with target bit 1
      if ((i & ctrlMask) !== 0 && (i & tgtMask) === 0) {
        const iOther = i | tgtMask;
        const temp = newState[i];
        newState[i] = newState[iOther];
        newState[iOther] = temp;
      }
    }
    this.state = newState;
    this.normalize();
  }

  /**
   * SWAP Gate: Swaps state of two qubits
   */
  applySWAP(qubitA, qubitB) {
    if (qubitA === qubitB) return;
    const bitPosA = this.numQubits - 1 - qubitA;
    const bitPosB = this.numQubits - 1 - qubitB;
    const maskA = 1 << bitPosA;
    const maskB = 1 << bitPosB;
    const dim = 1 << this.numQubits;
    const newState = [...this.state];

    for (let i = 0; i < dim; i++) {
      const bitA = (i & maskA) !== 0;
      const bitB = (i & maskB) !== 0;
      // Only swap if the bits differ and bitA is 0
      if (!bitA && bitB) {
        const iSwapped = (i | maskA) & ~maskB;
        const temp = newState[i];
        newState[i] = newState[iSwapped];
        newState[iSwapped] = temp;
      }
    }
    this.state = newState;
    this.normalize();
  }

  /**
   * Controlled-Z Gate (CZ)
   */
  applyCZ(controlQubit, targetQubit) {
    if (controlQubit === targetQubit) return;
    const ctrlBitPos = this.numQubits - 1 - controlQubit;
    const tgtBitPos = this.numQubits - 1 - targetQubit;
    const ctrlMask = 1 << ctrlBitPos;
    const tgtMask = 1 << tgtBitPos;
    const dim = 1 << this.numQubits;

    for (let i = 0; i < dim; i++) {
      if ((i & ctrlMask) !== 0 && (i & tgtMask) !== 0) {
        this.state[i] = this.state[i].mul(-1);
      }
    }
    this.normalize();
  }

  normalize() {
    let sumMagSq = 0;
    for (const amp of this.state) {
      sumMagSq += amp.magSq();
    }
    if (sumMagSq > 0 && Math.abs(sumMagSq - 1) > 1e-9) {
      const norm = Math.sqrt(sumMagSq);
      for (let i = 0; i < this.state.length; i++) {
        this.state[i] = this.state[i].div(norm);
      }
    }
  }

  /**
   * Computes theoretical probability distribution for each basis state
   * Returns array of { stateBinary, stateLabel, amplitude, probability, phase }
   */
  getProbabilities() {
    const dim = 1 << this.numQubits;
    const results = [];

    for (let i = 0; i < dim; i++) {
      const bin = i.toString(2).padStart(this.numQubits, '0');
      const amp = this.state[i];
      const prob = amp.magSq();
      const phaseRad = amp.phase();
      const phaseDeg = (phaseRad * 180 / Math.PI + 360) % 360;

      results.push({
        index: i,
        binary: bin,
        label: `|${bin}⟩`,
        amplitude: amp,
        probability: Math.max(0, Math.min(1, prob)),
        percentage: (Math.max(0, Math.min(1, prob)) * 100).toFixed(2),
        phaseDeg: phaseDeg.toFixed(1)
      });
    }
    return results;
  }

  /**
   * Runs Monte Carlo multi-shot measurement sampling
   * Returns object with counts and empirical percentages
   */
  sampleShots(numShots = 1000) {
    const probs = this.getProbabilities();
    const counts = {};
    for (const p of probs) {
      counts[p.binary] = 0;
    }

    // Cumulative probability distribution
    const cumProbs = [];
    let cum = 0;
    for (let i = 0; i < probs.length; i++) {
      cum += probs[i].probability;
      cumProbs.push(cum);
    }
    // Ensure final element is 1.0 to avoid precision drop
    cumProbs[cumProbs.length - 1] = 1.0;

    for (let s = 0; s < numShots; s++) {
      const r = Math.random();
      let chosenIdx = 0;
      for (let i = 0; i < cumProbs.length; i++) {
        if (r <= cumProbs[i]) {
          chosenIdx = i;
          break;
        }
      }
      const bin = probs[chosenIdx].binary;
      counts[bin] = (counts[bin] || 0) + 1;
    }

    const shotResults = probs.map(p => {
      const count = counts[p.binary] || 0;
      const empiricalPercent = ((count / numShots) * 100).toFixed(1);
      return {
        ...p,
        count,
        empiricalPercent
      };
    });

    return {
      numShots,
      results: shotResults
    };
  }

  /**
   * Computes single qubit Bloch sphere coordinates (x, y, z, theta, phi)
   * Using reduced density matrix for qubit q
   */
  getQubitBlochCoordinates(qubitIndex) {
    const bitPos = this.numQubits - 1 - qubitIndex;
    const bitMask = 1 << bitPos;
    const dim = 1 << this.numQubits;

    // Reduced density matrix elements: rho00, rho01, rho10, rho11
    let rho00 = 0;
    let rho11 = 0;
    let rho01_re = 0;
    let rho01_im = 0;

    for (let i = 0; i < dim; i++) {
      if ((i & bitMask) === 0) {
        const i0 = i;
        const i1 = i | bitMask;
        const v0 = this.state[i0];
        const v1 = this.state[i1];

        rho00 += v0.magSq();
        rho11 += v1.magSq();

        // rho01 += v0 * conj(v1)
        rho01_re += v0.re * v1.re + v0.im * v1.im;
        rho01_im += v0.im * v1.re - v0.re * v1.im;
      }
    }

    // Bloch vector:
    // x = 2 * Re(rho01)
    // y = -2 * Im(rho01)
    // z = rho00 - rho11
    const x = 2 * rho01_re;
    const y = -2 * rho01_im;
    const z = rho00 - rho11;

    // Spherical coordinates
    const r = Math.sqrt(x * x + y * y + z * z);
    const theta = Math.acos(Math.max(-1, Math.min(1, r > 1e-6 ? z / r : 1)));
    const phi = Math.atan2(y, x);

    return {
      x,
      y,
      z,
      r,
      purity: r, // 1 for pure state, < 1 for entangled / mixed
      thetaDeg: (theta * 180 / Math.PI).toFixed(1),
      phiDeg: ((phi * 180 / Math.PI + 360) % 360).toFixed(1),
      prob0: Math.max(0, Math.min(1, rho00)),
      prob1: Math.max(0, Math.min(1, rho11))
    };
  }

  /**
   * Helper: executes an array of circuit columns
   * circuitColumns: [ [gateOnQ0, gateOnQ1, ...], ... ]
   */
  executeCircuit(circuitColumns, initialQubits = null) {
    this.resetState(initialQubits);

    for (let c = 0; c < circuitColumns.length; c++) {
      const col = circuitColumns[c];
      if (!col) continue;

      // Handle 2-qubit gates first if present in column, else single-qubit
      const handledQubits = new Set();

      // Look for multi-qubit gates (CNOT, SWAP, CZ)
      for (let q = 0; q < col.length; q++) {
        const item = col[q];
        if (!item || handledQubits.has(q)) continue;

        if (item.type === 'CNOT') {
          // item: { type: 'CNOT', role: 'control', target: t } or role: 'target'
          if (item.role === 'control' && item.target !== undefined) {
            this.applyCNOT(q, item.target);
            handledQubits.add(q);
            handledQubits.add(item.target);
          }
        } else if (item.type === 'SWAP') {
          if (item.target !== undefined && !handledQubits.has(item.target)) {
            this.applySWAP(q, item.target);
            handledQubits.add(q);
            handledQubits.add(item.target);
          }
        } else if (item.type === 'CZ') {
          if (item.role === 'control' && item.target !== undefined) {
            this.applyCZ(q, item.target);
            handledQubits.add(q);
            handledQubits.add(item.target);
          }
        }
      }

      // Single-qubit gates
      for (let q = 0; q < col.length; q++) {
        if (handledQubits.has(q)) continue;
        const item = col[q];
        if (!item) continue;

        switch (item.type) {
          case 'H':
            this.applyH(q);
            break;
          case 'X':
            this.applyX(q);
            break;
          case 'Y':
            this.applyY(q);
            break;
          case 'Z':
            this.applyZ(q);
            break;
          case 'S':
            this.applyS(q);
            break;
          case 'T':
            this.applyT(q);
            break;
          case 'MEASURE':
            // Measurement marker
            break;
          default:
            break;
        }
      }
    }

    return {
      state: this.state,
      probabilities: this.getProbabilities()
    };
  }
}

// Export for browser global
window.Complex = Complex;
window.QuantumCircuitEngine = QuantumCircuitEngine;
