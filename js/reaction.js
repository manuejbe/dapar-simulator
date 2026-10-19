(function() {
'use strict';

const CFG = {
  rounds: 20,
  stimulusMs: 800,
  isiMin: 1000,
  isiMax: 2500,
  targetMin: 5,
  targetMax: 7,
  minHardDistractors: 4,
  targetShape: 'circle',
  targetColors: ['greenDark', 'greenLight'],
};

const COLORS = {
  yellow:     '#ffd54a',
  pink:       '#e667a3',
  greenDark:  '#1a7a2e',
  greenLight: '#4caf50',
};

const SHAPES = ['circle', 'triangle', 'ellipse', 'blob', 'square'];
const COLOR_KEYS = Object.keys(COLORS);

function shapeSvg(shape, colorKey, size) {
  const c = COLORS[colorKey];
  const s = size || 140;
  const half = s / 2;
  if (shape === 'circle')   return `<svg viewBox="0 0 100 100" width="${s}" height="${s}"><circle cx="50" cy="50" r="38" fill="${c}" stroke="#000" stroke-width="2"/></svg>`;
  if (shape === 'square')   return `<svg viewBox="0 0 100 100" width="${s}" height="${s}"><rect x="14" y="14" width="72" height="72" fill="${c}" stroke="#000" stroke-width="2"/></svg>`;
  if (shape === 'triangle') return `<svg viewBox="0 0 100 100" width="${s}" height="${s}"><polygon points="50,10 90,86 10,86" fill="${c}" stroke="#000" stroke-width="2"/></svg>`;
  if (shape === 'ellipse')  return `<svg viewBox="0 0 100 100" width="${s}" height="${s}"><ellipse cx="50" cy="50" rx="42" ry="28" fill="${c}" stroke="#000" stroke-width="2"/></svg>`;
  // blob (irregular splash)
  return `<svg viewBox="0 0 100 100" width="${s}" height="${s}"><path d="M50 8 C72 12 92 28 90 50 C96 70 80 90 58 92 C34 94 10 76 10 54 C4 32 28 4 50 8 Z" fill="${c}" stroke="#000" stroke-width="2"/></svg>`;
}

function isTarget(trial) {
  return trial.shape === CFG.targetShape && CFG.targetColors.includes(trial.color);
}

function isHardDistractor(trial) {
  if (isTarget(trial)) return false;
  // green ellipse (similar to circle)
  if (trial.shape === 'ellipse' && CFG.targetColors.includes(trial.color)) return true;
  // non-green circle (same shape, different color)
  if (trial.shape === 'circle' && !CFG.targetColors.includes(trial.color)) return true;
  return false;
}

function buildTrials() {
  const n = CFG.rounds;
  const trials = new Array(n);
  const targetCount = CFG.targetMin + Math.floor(Math.random() * (CFG.targetMax - CFG.targetMin + 1));

  const targetSlots = [];
  const slots = Array.from({length: n}, (_, i) => i);
  for (let k = slots.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [slots[k], slots[j]] = [slots[j], slots[k]];
  }
  for (let i = 0; i < targetCount; i++) targetSlots.push(slots[i]);

  for (let i = 0; i < n; i++) {
    if (targetSlots.includes(i)) {
      trials[i] = { shape: 'circle', color: CFG.targetColors[Math.random() < 0.5 ? 0 : 1] };
    } else {
      trials[i] = null;
    }
  }

  // place at least minHardDistractors
  let hardPlaced = 0;
  const emptyIndices = trials.map((t, i) => t ? -1 : i).filter(i => i !== -1);
  for (let k = emptyIndices.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [emptyIndices[k], emptyIndices[j]] = [emptyIndices[j], emptyIndices[k]];
  }
  for (const idx of emptyIndices) {
    if (hardPlaced >= CFG.minHardDistractors) break;
    const pickGreenEllipse = Math.random() < 0.5;
    trials[idx] = pickGreenEllipse
      ? { shape: 'ellipse', color: CFG.targetColors[Math.random() < 0.5 ? 0 : 1] }
      : { shape: 'circle',  color: Math.random() < 0.5 ? 'yellow' : 'pink' };
    hardPlaced++;
  }

  // fill remaining with random non-target non-hard distractors
  for (let i = 0; i < n; i++) {
    if (trials[i]) continue;
    let shape, color, tries = 0;
    do {
      shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      color = COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)];
      tries++;
    } while ((isTarget({shape,color}) || isHardDistractor({shape,color})) && tries < 20);
    trials[i] = { shape, color };
  }

  return trials;
}

let running = false;
let onDone = null;
let currentTrialIdx = -1;
let trials = [];
let responses = [];
let trialStartMs = 0;
let responded = false;
let stimulusTimeout = null;
let isiTimeout = null;

function start(container, callback) {
  if (running) return;
  running = true;
  onDone = callback;
  trials = buildTrials();
  responses = new Array(trials.length).fill(null);
  currentTrialIdx = -1;
  container.innerHTML = '<div class="rx-stage" id="rx-stage" role="img" aria-label="Área de estímulos"></div><div class="rx-counter" id="rx-counter"></div>';
  document.addEventListener('keydown', onKey);
  const stage = document.getElementById('rx-stage');
  if (stage) stage.addEventListener('pointerdown', onPointer);
  nextTrial();
}

function onKey(e) {
  if (!running) return;
  if (e.code === 'Space' || e.key === ' ') {
    e.preventDefault();
    registerResponse();
  }
}

function onPointer(e) {
  if (!running) return;
  e.preventDefault();
  registerResponse();
}

function registerResponse() {
  if (currentTrialIdx < 0 || currentTrialIdx >= trials.length) return;
  if (responded) return;
  responded = true;
  responses[currentTrialIdx] = { rt: Date.now() - trialStartMs };
}

function nextTrial() {
  currentTrialIdx++;
  if (currentTrialIdx >= trials.length) return finish();

  const counter = document.getElementById('rx-counter');
  if (counter) counter.textContent = `${currentTrialIdx + 1} / ${trials.length}`;

  const stage = document.getElementById('rx-stage');
  const t = trials[currentTrialIdx];
  responded = false;
  trialStartMs = Date.now();
  if (stage) {
    const size = 140;
    const w = stage.clientWidth || 500;
    const h = stage.clientHeight || 360;
    const x = Math.floor(Math.random() * Math.max(1, w - size));
    const y = Math.floor(Math.random() * Math.max(1, h - size));
    stage.innerHTML = `<div style="position:absolute;left:${x}px;top:${y}px;">${shapeSvg(t.shape, t.color)}</div>`;
  }

  stimulusTimeout = setTimeout(() => {
    if (stage) stage.innerHTML = '';
    const isi = CFG.isiMin + Math.floor(Math.random() * (CFG.isiMax - CFG.isiMin));
    isiTimeout = setTimeout(nextTrial, isi);
  }, CFG.stimulusMs);
}

function finish() {
  running = false;
  document.removeEventListener('keydown', onKey);
  clearTimeout(stimulusTimeout);
  clearTimeout(isiTimeout);

  let hits = 0, omissions = 0, falseHard = 0, falseEasy = 0;
  const rts = [];
  for (let i = 0; i < trials.length; i++) {
    const t = trials[i];
    const r = responses[i];
    const target = isTarget(t);
    const hard = isHardDistractor(t);
    if (target && r)        { hits++; rts.push(r.rt); }
    else if (target && !r)  { omissions++; }
    else if (!target && r)  { if (hard) falseHard++; else falseEasy++; }
  }

  const avgRt = rts.length ? Math.round(rts.reduce((a,b) => a+b, 0) / rts.length) : null;
  const minRt = rts.length ? Math.min(...rts) : null;
  const targets = trials.filter(isTarget).length;

  if (typeof onDone === 'function') {
    onDone({ hits, omissions, falseHard, falseEasy, avgRt, minRt, targets, rounds: trials.length });
  }
}

function renderIntroShapes(container) {
  const shapes = [
    { shape: 'circle',   color: 'yellow',     label: 'Círculo' },
    { shape: 'triangle', color: 'yellow',     label: 'Triángulo' },
    { shape: 'ellipse',  color: 'yellow',     label: 'Elipse' },
    { shape: 'blob',     color: 'yellow',     label: 'Mancha' },
    { shape: 'square',   color: 'yellow',     label: 'Cuadrado' },
  ];
  const colors = [
    { color: 'yellow',     label: 'Amarillo' },
    { color: 'pink',       label: 'Rosa' },
    { color: 'greenDark',  label: 'Verde oscuro' },
    { color: 'greenLight', label: 'Verde claro' },
  ];
  const shapesHtml = shapes.map(s => `<div class="rx-swatch"><div class="rx-swatch-fig">${shapeSvg(s.shape, 'yellow', 60)}</div><div class="rx-swatch-lbl">${s.label}</div></div>`).join('');
  const colorsHtml = colors.map(c => `<div class="rx-swatch"><div class="rx-swatch-fig">${shapeSvg('circle', c.color, 60)}</div><div class="rx-swatch-lbl">${c.label}</div></div>`).join('');
  container.innerHTML = `
    <div class="rx-intro-block">
      <div class="rx-intro-h">Formas</div>
      <div class="rx-swatches">${shapesHtml}</div>
    </div>
    <div class="rx-intro-block">
      <div class="rx-intro-h">Colores</div>
      <div class="rx-swatches">${colorsHtml}</div>
    </div>
  `;
}

window.REACTION = { start, renderIntroShapes };
})();
