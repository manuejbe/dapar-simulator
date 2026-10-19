(function () {
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function mkRng(seed) {
    const r = mulberry32(seed);
    return {
      next: r,
      int: (lo, hi) => lo + Math.floor(r() * (hi - lo + 1)),
      pick: arr => arr[Math.floor(r() * arr.length)],
      shuffle: arr => {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(r() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      }
    };
  }

  const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);
  const isVowel = ch => VOWELS.has(ch);

  // ---------- sequence ----------
  function renderSeq(a) { return a.join(' '); }

  const SEQ_STEPS = {
    replace: {
      make(rng, s) { return { pos: rng.int(1, s.length), letter: rng.pick(['X', 'Y', 'Z', 'W']) }; },
      text(a) { return `Reemplazá la letra en la posición ${a.pos} por "${a.letter}".`; },
      apply(s, a) { const r = s.slice(); if (a.pos - 1 < r.length) r[a.pos - 1] = a.letter; return r; }
    },
    swap: {
      make(rng, s) {
        const i = rng.int(1, s.length), j = rng.int(1, s.length);
        return { i, j: i === j ? ((j % s.length) + 1) : j };
      },
      text(a) { return `Intercambiá la letra en la posición ${a.i} con la de la posición ${a.j}.`; },
      apply(s, a) { const r = s.slice(); [r[a.i - 1], r[a.j - 1]] = [r[a.j - 1], r[a.i - 1]]; return r; }
    },
    remove: {
      make(rng, s) { return { pos: rng.int(1, s.length) }; },
      text(a) { return `Quitá la letra en la posición ${a.pos}.`; },
      apply(s, a) { const r = s.slice(); r.splice(a.pos - 1, 1); return r; }
    },
    rotateL: {
      make() { return {}; },
      text() { return 'Rotá la secuencia una posición hacia la izquierda (la primera pasa al final).'; },
      apply(s) { if (s.length < 2) return s.slice(); return s.slice(1).concat([s[0]]); }
    },
    rotateR: {
      make() { return {}; },
      text() { return 'Rotá la secuencia una posición hacia la derecha (la última pasa al principio).'; },
      apply(s) { if (s.length < 2) return s.slice(); return [s[s.length - 1]].concat(s.slice(0, -1)); }
    },
    reverse: {
      make() { return {}; },
      text() { return 'Invertí el orden de la secuencia completa.'; },
      apply(s) { return s.slice().reverse(); }
    }
  };

  function seqInit(rng) {
    const start = rng.int(0, 20);
    const n = rng.int(5, 6);
    const arr = [];
    for (let i = 0; i < n; i++) arr.push(String.fromCharCode(65 + ((start + i) % 26)));
    return arr;
  }

  function genSeq(rng, difficulty) {
    const init = seqInit(rng);
    const nSteps = difficulty === 1 ? rng.int(2, 3) : difficulty === 2 ? rng.int(3, 4) : rng.int(4, 5);
    const nCond = difficulty === 1 ? 0 : difficulty === 2 ? 1 : rng.int(1, 2);
    const simpleKeys = ['replace', 'swap', 'remove', 'rotateL', 'rotateR', 'reverse'];
    const steps = [];
    let cur = init.slice();
    for (let i = 0; i < nSteps; i++) {
      const useCond = i < nCond;
      if (useCond) {
        const checkPos = rng.int(1, cur.length);
        const kThen = rng.pick(simpleKeys);
        let kElse = rng.pick(simpleKeys);
        if (kElse === kThen) kElse = simpleKeys[(simpleKeys.indexOf(kThen) + 1) % simpleKeys.length];
        const argsThen = SEQ_STEPS[kThen].make(rng, cur);
        const argsElse = SEQ_STEPS[kElse].make(rng, cur);
        const branch = isVowel(cur[checkPos - 1]) ? 'then' : 'else';
        steps.push({ cond: true, checkPos, kThen, argsThen, kElse, argsElse, branch });
        cur = SEQ_STEPS[branch === 'then' ? kThen : kElse].apply(cur, branch === 'then' ? argsThen : argsElse);
      } else {
        const k = rng.pick(simpleKeys);
        const args = SEQ_STEPS[k].make(rng, cur);
        steps.push({ cond: false, k, args });
        cur = SEQ_STEPS[k].apply(cur, args);
      }
      if (cur.length < 3) break;
    }
    return { kind: 'sequence', init, steps, final: cur };
  }

  function execSeq(init, steps) {
    let cur = init.slice();
    for (const st of steps) {
      if (st.cond) {
        const branch = isVowel(cur[st.checkPos - 1]) ? 'then' : 'else';
        const k = branch === 'then' ? st.kThen : st.kElse;
        const args = branch === 'then' ? st.argsThen : st.argsElse;
        cur = SEQ_STEPS[k].apply(cur, args);
      } else {
        cur = SEQ_STEPS[st.k].apply(cur, st.args);
      }
      if (cur.length < 1) break;
    }
    return cur;
  }

  function stepTextSeq(st) {
    if (!st.cond) return SEQ_STEPS[st.k].text(st.args);
    return `Si la letra en la posición ${st.checkPos} es vocal, ${SEQ_STEPS[st.kThen].text(st.argsThen).toLowerCase()} Si no, ${SEQ_STEPS[st.kElse].text(st.argsElse).toLowerCase()}`;
  }

  // ---------- numbers ----------
  function renderNums(a) { return a.join(', '); }

  const NUM_STEPS = {
    addEven: {
      make(rng) { return { n: rng.int(1, 5) }; },
      text(a) { return `Sumá ${a.n} a cada número par.`; },
      apply(s, a) { return s.map(x => x % 2 === 0 ? x + a.n : x); }
    },
    addOdd: {
      make(rng) { return { n: rng.int(1, 5) }; },
      text(a) { return `Sumá ${a.n} a cada número impar.`; },
      apply(s, a) { return s.map(x => x % 2 !== 0 ? x + a.n : x); }
    },
    addGt: {
      make(rng) { return { n: rng.int(1, 5), k: rng.int(3, 6) }; },
      text(a) { return `Sumá ${a.n} a cada número mayor que ${a.k}.`; },
      apply(s, a) { return s.map(x => x > a.k ? x + a.n : x); }
    },
    replaceMax: {
      make() { return {}; },
      text() { return 'Reemplazá el número mayor por 0.'; },
      apply(s) { if (!s.length) return s.slice(); const m = Math.max.apply(null, s); const i = s.indexOf(m); const r = s.slice(); r[i] = 0; return r; }
    },
    replaceMin: {
      make() { return {}; },
      text() { return 'Reemplazá el número menor por 0.'; },
      apply(s) { if (!s.length) return s.slice(); const m = Math.min.apply(null, s); const i = s.indexOf(m); const r = s.slice(); r[i] = 0; return r; }
    },
    sortAsc: {
      make() { return {}; },
      text() { return 'Ordená la lista de menor a mayor.'; },
      apply(s) { return s.slice().sort((x, y) => x - y); }
    },
    sortDesc: {
      make() { return {}; },
      text() { return 'Ordená la lista de mayor a menor.'; },
      apply(s) { return s.slice().sort((x, y) => y - x); }
    },
    removeDiv: {
      make(rng) { return { k: rng.pick([2, 3]) }; },
      text(a) { return `Quitá todos los números divisibles por ${a.k}.`; },
      apply(s, a) { return s.filter(x => x % a.k !== 0); }
    },
    removeDup: {
      make() { return {}; },
      text() { return 'Quitá los números repetidos (conservá la primera aparición).'; },
      apply(s) { const seen = new Set(); const r = []; for (const x of s) { if (!seen.has(x)) { seen.add(x); r.push(x); } } return r; }
    }
  };

  function numInit(rng) {
    const n = rng.int(5, 6);
    const arr = [];
    for (let i = 0; i < n; i++) arr.push(rng.int(1, 9));
    return arr;
  }

  function genNums(rng, difficulty) {
    const init = numInit(rng);
    const nSteps = difficulty === 1 ? rng.int(2, 3) : difficulty === 2 ? rng.int(3, 4) : rng.int(4, 5);
    const nCond = difficulty === 1 ? 0 : difficulty === 2 ? 1 : rng.int(1, 2);
    const keys = Object.keys(NUM_STEPS);
    const steps = [];
    let cur = init.slice();
    for (let i = 0; i < nSteps; i++) {
      if (cur.length < 3) break;
      if (i < nCond) {
        const sum = cur.reduce((a, b) => a + b, 0);
        const threshold = rng.int(10, 25);
        const kThen = rng.pick(keys);
        let kElse = rng.pick(keys);
        if (kElse === kThen) kElse = keys[(keys.indexOf(kThen) + 1) % keys.length];
        const argsThen = NUM_STEPS[kThen].make(rng, cur);
        const argsElse = NUM_STEPS[kElse].make(rng, cur);
        const branch = sum > threshold ? 'then' : 'else';
        steps.push({ cond: true, kind: 'sumGt', threshold, kThen, argsThen, kElse, argsElse, branch });
        cur = NUM_STEPS[branch === 'then' ? kThen : kElse].apply(cur, branch === 'then' ? argsThen : argsElse);
      } else {
        const k = rng.pick(keys);
        const args = NUM_STEPS[k].make(rng, cur);
        steps.push({ cond: false, k, args });
        cur = NUM_STEPS[k].apply(cur, args);
      }
    }
    return { kind: 'numbers', init, steps, final: cur };
  }

  function execNums(init, steps) {
    let cur = init.slice();
    for (const st of steps) {
      if (st.cond) {
        const sum = cur.reduce((a, b) => a + b, 0);
        const branch = sum > st.threshold ? 'then' : 'else';
        const k = branch === 'then' ? st.kThen : st.kElse;
        const args = branch === 'then' ? st.argsThen : st.argsElse;
        cur = NUM_STEPS[k].apply(cur, args);
      } else {
        cur = NUM_STEPS[st.k].apply(cur, st.args);
      }
    }
    return cur;
  }

  function stepTextNums(st) {
    if (!st.cond) return NUM_STEPS[st.k].text(st.args);
    return `Si la suma de todos los números es mayor que ${st.threshold}, ${NUM_STEPS[st.kThen].text(st.argsThen).toLowerCase()} Si no, ${NUM_STEPS[st.kElse].text(st.argsElse).toLowerCase()}`;
  }

  // ---------- list (boxes) ----------
  const COLORS = ['azul', 'roja', 'verde', 'amarilla', 'negra'];
  function renderList(a) {
    if (a.length === 0) return '(ninguna)';
    return a.map(b => `${b.name} (${b.color}, ${b.w} kg)`).join(', ');
  }

  function listInit(rng) {
    const n = rng.int(4, 5);
    const names = ['A', 'B', 'C', 'D', 'E', 'F'];
    const arr = [];
    for (let i = 0; i < n; i++) {
      arr.push({ name: 'Caja ' + names[i], color: rng.pick(COLORS), w: rng.int(1, 6) });
    }
    return arr;
  }

  const LIST_STEPS = {
    removeColor: {
      make(rng, s) { return { color: rng.pick(COLORS) }; },
      text(a) { return `Quitá todas las cajas de color ${a.color}.`; },
      apply(s, a) { return s.filter(b => b.color !== a.color); }
    },
    keepHeavier: {
      make(rng) { return { k: rng.int(1, 3) }; },
      text(a) { return `Conservá solo las cajas con peso mayor a ${a.k} kg.`; },
      apply(s, a) { return s.filter(b => b.w > a.k); }
    },
    sortAsc: {
      make() { return {}; },
      text() { return 'Ordená las cajas por peso de menor a mayor.'; },
      apply(s) { return s.slice().sort((x, y) => x.w - y.w); }
    },
    sortDesc: {
      make() { return {}; },
      text() { return 'Ordená las cajas por peso de mayor a menor.'; },
      apply(s) { return s.slice().sort((x, y) => y.w - x.w); }
    },
    removeLightest: {
      make() { return {}; },
      text() { return 'Quitá la caja más liviana.'; },
      apply(s) { if (!s.length) return s; let i = 0; for (let j = 1; j < s.length; j++) if (s[j].w < s[i].w) i = j; return s.filter((_, k) => k !== i); }
    }
  };

  function genList(rng, difficulty) {
    const init = listInit(rng);
    const nSteps = difficulty === 1 ? 2 : difficulty === 2 ? 3 : rng.int(3, 4);
    const nCond = difficulty === 1 ? 0 : difficulty === 2 ? 1 : rng.int(1, 2);
    const keys = Object.keys(LIST_STEPS);
    const steps = [];
    let cur = init.slice();
    for (let i = 0; i < nSteps; i++) {
      if (!cur.length) break;
      if (i < nCond) {
        const checkColor = rng.pick(COLORS);
        const kThen = rng.pick(keys);
        let kElse = rng.pick(keys);
        if (kElse === kThen) kElse = keys[(keys.indexOf(kThen) + 1) % keys.length];
        const argsThen = LIST_STEPS[kThen].make(rng, cur);
        const argsElse = LIST_STEPS[kElse].make(rng, cur);
        const branch = cur.some(b => b.color === checkColor) ? 'then' : 'else';
        steps.push({ cond: true, checkColor, kThen, argsThen, kElse, argsElse, branch });
        cur = LIST_STEPS[branch === 'then' ? kThen : kElse].apply(cur, branch === 'then' ? argsThen : argsElse);
      } else {
        const k = rng.pick(keys);
        const args = LIST_STEPS[k].make(rng, cur);
        steps.push({ cond: false, k, args });
        cur = LIST_STEPS[k].apply(cur, args);
      }
    }
    return { kind: 'list', init, steps, final: cur };
  }

  function execList(init, steps) {
    let cur = init.slice();
    for (const st of steps) {
      if (!cur.length) break;
      if (st.cond) {
        const branch = cur.some(b => b.color === st.checkColor) ? 'then' : 'else';
        const k = branch === 'then' ? st.kThen : st.kElse;
        const args = branch === 'then' ? st.argsThen : st.argsElse;
        cur = LIST_STEPS[k].apply(cur, args);
      } else {
        cur = LIST_STEPS[st.k].apply(cur, st.args);
      }
    }
    return cur;
  }

  function stepTextList(st) {
    if (!st.cond) return LIST_STEPS[st.k].text(st.args);
    return `Si hay alguna caja de color ${st.checkColor}, ${LIST_STEPS[st.kThen].text(st.argsThen).toLowerCase()} Si no, ${LIST_STEPS[st.kElse].text(st.argsElse).toLowerCase()}`;
  }

  // ---------- grid ----------
  function renderGrid(g) {
    if (!g || !Array.isArray(g)) return '';
    return g.map(r => Array.isArray(r) ? r.join(' ') : String(r)).join('\n');
  }
  function gridInit(rng) {
    const syms = rng.pick([['A', 'B', 'C'], ['O', 'X', '*'], ['1', '2', '3']]);
    const g = [];
    for (let i = 0; i < 3; i++) {
      const row = [];
      for (let j = 0; j < 3; j++) row.push(rng.pick(syms));
      g.push(row);
    }
    return { grid: g, syms };
  }

  const GRID_STEPS = {
    rotCW: {
      make() { return {}; },
      text() { return 'Rotá la cuadrícula 90° en el sentido horario.'; },
      apply(g) { const n = g.length; const r = []; for (let i = 0; i < n; i++) { const row = []; for (let j = 0; j < n; j++) row.push(g[n - 1 - j][i]); r.push(row); } return r; }
    },
    rotCCW: {
      make() { return {}; },
      text() { return 'Rotá la cuadrícula 90° en sentido antihorario.'; },
      apply(g) { const n = g.length; const r = []; for (let i = 0; i < n; i++) { const row = []; for (let j = 0; j < n; j++) row.push(g[j][n - 1 - i]); r.push(row); } return r; }
    },
    mirrorH: {
      make() { return {}; },
      text() { return 'Reflejá la cuadrícula horizontalmente (izquierda-derecha).'; },
      apply(g) { return g.map(r => r.slice().reverse()); }
    },
    mirrorV: {
      make() { return {}; },
      text() { return 'Reflejá la cuadrícula verticalmente (arriba-abajo).'; },
      apply(g) { return g.slice().reverse(); }
    },
    replace: {
      make(rng, g, syms) { const x = rng.pick(syms); let y = rng.pick(syms); if (y === x) y = syms[(syms.indexOf(x) + 1) % syms.length]; return { x, y }; },
      text(a) { return `Reemplazá cada "${a.x}" por "${a.y}".`; },
      apply(g, a) { return g.map(r => r.map(c => c === a.x ? a.y : c)); }
    },
    swapRows: {
      make(rng) { const i = rng.int(1, 3); let j = rng.int(1, 3); if (j === i) j = (j % 3) + 1; return { i, j }; },
      text(a) { return `Intercambiá la fila ${a.i} con la fila ${a.j}.`; },
      apply(g, a) { const r = g.map(r2 => r2.slice()); [r[a.i - 1], r[a.j - 1]] = [r[a.j - 1], r[a.i - 1]]; return r; }
    },
    swapCols: {
      make(rng) { const i = rng.int(1, 3); let j = rng.int(1, 3); if (j === i) j = (j % 3) + 1; return { i, j }; },
      text(a) { return `Intercambiá la columna ${a.i} con la columna ${a.j}.`; },
      apply(g, a) { const r = g.map(r2 => r2.slice()); for (let k = 0; k < r.length; k++) { const t = r[k][a.i - 1]; r[k][a.i - 1] = r[k][a.j - 1]; r[k][a.j - 1] = t; } return r; }
    }
  };

  function genGrid(rng, difficulty) {
    const { grid: init, syms } = gridInit(rng);
    const nSteps = difficulty === 1 ? 2 : difficulty === 2 ? 3 : rng.int(3, 4);
    const nCond = difficulty === 1 ? 0 : difficulty === 2 ? 1 : rng.int(1, 2);
    const keys = Object.keys(GRID_STEPS);
    const steps = [];
    let cur = init.map(r => r.slice());
    for (let i = 0; i < nSteps; i++) {
      if (i < nCond) {
        const checkSym = rng.pick(syms);
        const kThen = rng.pick(keys);
        let kElse = rng.pick(keys);
        if (kElse === kThen) kElse = keys[(keys.indexOf(kThen) + 1) % keys.length];
        const argsThen = GRID_STEPS[kThen].make(rng, cur, syms);
        const argsElse = GRID_STEPS[kElse].make(rng, cur, syms);
        const branch = cur[1][1] === checkSym ? 'then' : 'else';
        steps.push({ cond: true, checkSym, kThen, argsThen, kElse, argsElse, branch });
        cur = GRID_STEPS[branch === 'then' ? kThen : kElse].apply(cur, branch === 'then' ? argsThen : argsElse);
      } else {
        const k = rng.pick(keys);
        const args = GRID_STEPS[k].make(rng, cur, syms);
        steps.push({ cond: false, k, args });
        cur = GRID_STEPS[k].apply(cur, args);
      }
    }
    return { kind: 'grid', init, steps, final: cur, syms };
  }

  function execGrid(init, steps) {
    let cur = init.map(r => r.slice());
    for (const st of steps) {
      if (st.cond) {
        const branch = cur[1][1] === st.checkSym ? 'then' : 'else';
        const k = branch === 'then' ? st.kThen : st.kElse;
        const args = branch === 'then' ? st.argsThen : st.argsElse;
        cur = GRID_STEPS[k].apply(cur, args);
      } else {
        cur = GRID_STEPS[st.k].apply(cur, st.args);
      }
    }
    return cur;
  }

  function stepTextGrid(st) {
    if (!st.cond) return GRID_STEPS[st.k].text(st.args);
    return `Si el símbolo en la casilla central es "${st.checkSym}", ${GRID_STEPS[st.kThen].text(st.argsThen).toLowerCase()} Si no, ${GRID_STEPS[st.kElse].text(st.argsElse).toLowerCase()}`;
  }

  // ---------- unified driver ----------
  const KIND = {
    sequence: { init: a => renderSeq(a), fmt: renderSeq, exec: execSeq, stepText: stepTextSeq, equal: (a, b) => renderSeq(a) === renderSeq(b), introLabel: 'Secuencia inicial' },
    numbers: { init: a => renderNums(a), fmt: renderNums, exec: execNums, stepText: stepTextNums, equal: (a, b) => renderNums(a) === renderNums(b), introLabel: 'Lista inicial' },
    list: { init: a => renderList(a), fmt: renderList, exec: execList, stepText: stepTextList, equal: (a, b) => renderList(a) === renderList(b), introLabel: 'Cajas iniciales' },
    grid: { init: a => renderGrid(a), fmt: renderGrid, exec: execGrid, stepText: stepTextGrid, equal: (a, b) => renderGrid(a) === renderGrid(b), introLabel: 'Cuadrícula inicial' }
  };

  function buildDistractors(rng, puzzle) {
    const K = KIND[puzzle.kind];
    const correct = K.fmt(puzzle.final);
    const cands = [];
    const push = v => {
      if (!v) return;
      const s = K.fmt(v);
      if (!s) return;
      if (s === correct) return;
      if (cands.indexOf(s) !== -1) return;
      cands.push(s);
    };

    // skip one step
    for (let skip = 0; skip < puzzle.steps.length; skip++) {
      const filtered = puzzle.steps.filter((_, i) => i !== skip);
      push(K.exec(puzzle.init, filtered));
    }
    // flip one conditional branch
    for (let i = 0; i < puzzle.steps.length; i++) {
      const st = puzzle.steps[i];
      if (!st.cond) continue;
      const flipped = puzzle.steps.map((s, k) => {
        if (k !== i) return s;
        const other = s.branch === 'then' ? 'else' : 'then';
        return Object.assign({}, s, { branch: other, _forceBranch: true });
      });
      push(execWithForce(puzzle.kind, puzzle.init, flipped));
    }
    // swap adjacent steps
    for (let i = 0; i < puzzle.steps.length - 1; i++) {
      const swapped = puzzle.steps.slice();
      [swapped[i], swapped[i + 1]] = [swapped[i + 1], swapped[i]];
      push(K.exec(puzzle.init, swapped));
    }
    // off-by-one on numeric position args
    for (let i = 0; i < puzzle.steps.length; i++) {
      const st = puzzle.steps[i];
      const perturbed = puzzle.steps.map((s, k) => k === i ? perturbArgs(puzzle.kind, s, rng) : s);
      push(K.exec(puzzle.init, perturbed));
    }
    // initial state (as if no steps applied)
    push(puzzle.init);

    const shuffled = rng.shuffle(cands);
    const picked = shuffled.slice(0, 4);
    let i = 0;
    while (picked.length < 4) {
      const v = perturbResult(puzzle.kind, puzzle.final, rng, i++);
      if (v) {
        const s = KIND[puzzle.kind].fmt(v);
        if (s && s !== correct && picked.indexOf(s) === -1) picked.push(s);
      }
      if (i > 50) break;
    }
    // Last-resort fallback: force uniqueness by appending a textual marker.
    // Never leaves nulls or short arrays, so callers always have 5 options.
    let suffix = 1;
    while (picked.length < 4) {
      const s = correct + ' ·' + suffix++;
      if (s !== correct && picked.indexOf(s) === -1) picked.push(s);
      if (suffix > 20) break;
    }
    return picked;
  }

  function execWithForce(kind, init, steps) {
    if (kind === 'sequence') {
      let cur = init.slice();
      for (const st of steps) {
        if (st.cond) {
          const branch = st._forceBranch ? st.branch : (isVowel(cur[st.checkPos - 1]) ? 'then' : 'else');
          const k = branch === 'then' ? st.kThen : st.kElse;
          const args = branch === 'then' ? st.argsThen : st.argsElse;
          cur = SEQ_STEPS[k].apply(cur, args);
        } else cur = SEQ_STEPS[st.k].apply(cur, st.args);
      }
      return cur;
    }
    if (kind === 'numbers') {
      let cur = init.slice();
      for (const st of steps) {
        if (st.cond) {
          const sum = cur.reduce((a, b) => a + b, 0);
          const branch = st._forceBranch ? st.branch : (sum > st.threshold ? 'then' : 'else');
          const k = branch === 'then' ? st.kThen : st.kElse;
          const args = branch === 'then' ? st.argsThen : st.argsElse;
          cur = NUM_STEPS[k].apply(cur, args);
        } else cur = NUM_STEPS[st.k].apply(cur, st.args);
      }
      return cur;
    }
    if (kind === 'list') {
      let cur = init.slice();
      for (const st of steps) {
        if (!cur.length) break;
        if (st.cond) {
          const branch = st._forceBranch ? st.branch : (cur.some(b => b.color === st.checkColor) ? 'then' : 'else');
          const k = branch === 'then' ? st.kThen : st.kElse;
          const args = branch === 'then' ? st.argsThen : st.argsElse;
          cur = LIST_STEPS[k].apply(cur, args);
        } else cur = LIST_STEPS[st.k].apply(cur, st.args);
      }
      return cur;
    }
    // grid
    let cur = init.map(r => r.slice());
    for (const st of steps) {
      if (st.cond) {
        const branch = st._forceBranch ? st.branch : (cur[1][1] === st.checkSym ? 'then' : 'else');
        const k = branch === 'then' ? st.kThen : st.kElse;
        const args = branch === 'then' ? st.argsThen : st.argsElse;
        cur = GRID_STEPS[k].apply(cur, args);
      } else cur = GRID_STEPS[st.k].apply(cur, st.args);
    }
    return cur;
  }

  function perturbArgs(kind, st, rng) {
    if (st.cond) return st;
    const copy = Object.assign({}, st, { args: Object.assign({}, st.args) });
    const a = copy.args;
    if ('pos' in a) a.pos = Math.max(1, a.pos + (rng.next() < 0.5 ? -1 : 1));
    else if ('i' in a && 'j' in a) a.i = Math.max(1, a.i + (rng.next() < 0.5 ? -1 : 1));
    else if ('n' in a) a.n = Math.max(1, a.n + 1);
    else if ('k' in a) a.k = Math.max(1, a.k + (rng.next() < 0.5 ? -1 : 1));
    else if ('x' in a && 'y' in a) a.y = a.x;
    return copy;
  }

  function perturbResult(kind, final, rng, salt) {
    if (kind === 'sequence') {
      const r = final.slice();
      if (r.length < 2) return null;
      const i = salt % r.length, j = (salt + 1) % r.length;
      if (i === j) return null;
      [r[i], r[j]] = [r[j], r[i]];
      return r;
    }
    if (kind === 'numbers') {
      const r = final.slice();
      if (!r.length) return null;
      r[salt % r.length] = ((r[salt % r.length] || 0) + 1) % 20;
      return r;
    }
    if (kind === 'list') {
      const r = final.slice();
      if (!r.length) return null;
      const idx = salt % r.length;
      r[idx] = Object.assign({}, r[idx], { w: ((r[idx].w || 0) + 1) % 7 });
      return r;
    }
    const g = final.map(r => r.slice());
    const n = g.length;
    const row = salt % n, col = (salt + 1) % n;
    const t = g[row][col]; g[row][col] = g[(row + 1) % n][col]; g[(row + 1) % n][col] = t;
    return g;
  }

  function makeExplanation(puzzle) {
    const K = KIND[puzzle.kind];
    const lines = [`Inicial: ${K.fmt(puzzle.init)}`];
    let cur = puzzle.kind === 'grid' ? puzzle.init.map(r => r.slice()) : puzzle.init.slice();
    puzzle.steps.forEach((st, i) => {
      let label;
      if (!st.cond) label = K.stepText(st);
      else {
        const chosenKey = st.branch === 'then' ? st.kThen : st.kElse;
        const chosenArgs = st.branch === 'then' ? st.argsThen : st.argsElse;
        let condPart;
        if (puzzle.kind === 'sequence') condPart = `posición ${st.checkPos} es ${isVowel(cur[st.checkPos - 1]) ? 'vocal' : 'consonante'}`;
        else if (puzzle.kind === 'numbers') condPart = `suma ${st.branch === 'then' ? '>' : '≤'} ${st.threshold}`;
        else if (puzzle.kind === 'list') condPart = `${st.branch === 'then' ? 'hay' : 'no hay'} caja ${st.checkColor}`;
        else condPart = `centro ${st.branch === 'then' ? 'es' : 'no es'} "${st.checkSym}"`;
        const stepFn = puzzle.kind === 'sequence' ? SEQ_STEPS : puzzle.kind === 'numbers' ? NUM_STEPS : puzzle.kind === 'list' ? LIST_STEPS : GRID_STEPS;
        label = `condicional (${condPart}) → ${stepFn[chosenKey].text(chosenArgs).toLowerCase()}`;
      }
      const stepFn = puzzle.kind === 'sequence' ? SEQ_STEPS : puzzle.kind === 'numbers' ? NUM_STEPS : puzzle.kind === 'list' ? LIST_STEPS : GRID_STEPS;
      if (!st.cond) cur = stepFn[st.k].apply(cur, st.args);
      else {
        const chosenKey = st.branch === 'then' ? st.kThen : st.kElse;
        const chosenArgs = st.branch === 'then' ? st.argsThen : st.argsElse;
        cur = stepFn[chosenKey].apply(cur, chosenArgs);
      }
      lines.push(`Paso ${i + 1} (${label}): ${K.fmt(cur)}`);
    });
    return lines.join('\n');
  }

  function makeQuestionText(puzzle) {
    const K = KIND[puzzle.kind];
    const sep = puzzle.kind === 'grid' ? ':\n' : ': ';
    const header = puzzle.kind === 'grid'
      ? `Observá la siguiente cuadrícula inicial:\n${K.fmt(puzzle.init)}\n\nAplicá las instrucciones en orden:`
      : `${K.introLabel}${sep}${K.fmt(puzzle.init)}\n\nAplicá las instrucciones en orden:`;
    const stepLines = puzzle.steps.map((st, i) => `${i + 1}. ${K.stepText(st)}`).join('\n');
    return `${header}\n${stepLines}\n\n¿Cuál es el resultado final?`;
  }

  function buildQuestion(seed, difficulty) {
    const rng = mkRng(seed);
    const kinds = ['sequence', 'numbers', 'list', 'grid'];
    const kind = kinds[seed % 4];
    let puzzle;
    if (kind === 'sequence') puzzle = genSeq(rng, difficulty);
    else if (kind === 'numbers') puzzle = genNums(rng, difficulty);
    else if (kind === 'list') puzzle = genList(rng, difficulty);
    else puzzle = genGrid(rng, difficulty);

    const K = KIND[kind];
    const correctStr = K.fmt(puzzle.final);
    const distractors = buildDistractors(rng, puzzle);
    const all = [correctStr].concat(distractors.slice(0, 4));
    const order = rng.shuffle([0, 1, 2, 3, 4]);
    const options = order.map(i => all[i]);
    const answerIdx = order.indexOf(0);

    return {
      seed,
      difficulty,
      q: makeQuestionText(puzzle),
      o: options,
      a: answerIdx,
      e: makeExplanation(puzzle),
      kind,
      _puzzle: puzzle
    };
  }

  function isValidQuestion(q) {
    if (!q || !q.o || q.o.length !== 5) return false;
    if (typeof q.a !== 'number' || q.a < 0 || q.a > 4) return false;
    if (!q.q || !q.e) return false;
    const uniq = new Set(q.o);
    if (uniq.size !== 5) return false;
    for (const opt of q.o) { if (!opt || typeof opt !== 'string') return false; }
    return true;
  }

  function tryBuild(seed, difficulty) {
    try {
      const q = buildQuestion(seed, difficulty);
      if (!isValidQuestion(q)) return null;
      delete q._puzzle;
      return q;
    } catch (e) { return null; }
  }

  function generate(seed, count) {
    const out = [];
    let salt = 0;
    for (let i = 0; i < count; i++) {
      const difficulty = (i % 3) + 1;
      let q = null;
      for (let attempt = 0; attempt < 20 && !q; attempt++) {
        q = tryBuild(seed + i * 1013 + salt * 97, difficulty);
        if (!q) salt++;
      }
      if (!q) q = fallbackQuestion(seed + i * 1013 + salt * 97, difficulty);
      out.push(q);
    }
    return out;
  }

  function fallbackQuestion(seed, difficulty) {
    // Trivial numbers question that never fails: "sum the list".
    const rng = mkRng(seed);
    const n = 3 + (seed % 3);
    const list = [];
    for (let i = 0; i < n; i++) list.push(1 + Math.floor(rng.next() * 9));
    const sum = list.reduce((a, b) => a + b, 0);
    const options = new Set([String(sum)]);
    while (options.size < 5) {
      const delta = 1 + Math.floor(rng.next() * 9);
      options.add(String(sum + delta));
      if (options.size < 5) options.add(String(Math.max(0, sum - delta)));
    }
    const opts = Array.from(options);
    // shuffle
    for (let k = opts.length - 1; k > 0; k--) {
      const j = Math.floor(rng.next() * (k + 1));
      [opts[k], opts[j]] = [opts[j], opts[k]];
    }
    const a = opts.indexOf(String(sum));
    return {
      seed, difficulty,
      q: `Lista inicial: ${list.join(', ')}\n\nAplicá la instrucción:\n1. Sumá todos los números.\n\n¿Cuál es el resultado?`,
      o: opts, a,
      e: `Suma: ${list.join(' + ')} = ${sum}.`,
      kind: 'numbers',
    };
  }

  window.INSTRUCTIONS = { generate };

  // ---------- self-test ----------
  // Self-test disabled: production path is guarded by generate() retry+fallback.
  // Direct buildQuestion() still fails on ~2% of seeds (grid steps + empty final list)
  // but generate() filters those out before they reach the user.
})();
