// ─── CONFIG ────────────────────────────────────────────────
const CFG = {
  modes: {
    short: {
      figural:      { count: 12, timePerQ: 40 },
      quant1:       { count: 12, timeTotal: 18 * 60 },
      quant2:       { count: 12, timeTotal: 18 * 60 },
      instructions: { count: 12, timeTotal: 15 * 60 },
    },
    full: {
      figural:      { count: 25, timePerQ: 60 },
      quant1:       { count: 25, timeTotal: Math.round(25 * 90) },
      quant2:       { count: 25, timeTotal: Math.round(25 * 90) },
      instructions: { count: 25, timeTotal: Math.round(25 * 75) },
    },
  },
  sectionOrder: ['figural', 'quant1', 'quant2', 'instructions'],
  sectionNames: {
    verbal: 'Verbal (no incluida en el examen para olim)',
    quant1: 'Razonamiento cuantitativo 1',
    quant2: 'Razonamiento cuantitativo 2',
    instructions: 'Comprensión de instrucciones',
    figural: 'Analogías figurales',
    abstract: 'Razonamiento abstracto (extra)',
  },
  sectionShort: { verbal:'VERBAL', quant1:'CUANT 1', quant2:'CUANT 2', instructions:'INSTRUC', figural:'FIGURAL', abstract:'ABSTRACT' },
  sectionOptions: { instructions: 5, figural: 4, quant1: 4, quant2: 4, verbal: 4, abstract: 4 },
  recommendedPerQ: { figural: 60, quant1: 90, quant2: 90, instructions: 75 },
  historyKey: 'dapar_history',
  historyMax: 20,
  sectionInstructions: {
    figural: 'La figura 4 es la original y, tras una manipulación, se convierte en la figura 3. Aplicá la misma manipulación a la figura 2 y elegí el resultado entre las 4 opciones. Las manipulaciones pueden incluir tamaño, color, orientación y más — prestá atención a todos los detalles. Hay tiempo por pregunta y no se puede volver atrás.',
    quant1:  'Problemas verbales de porcentajes, proporciones, velocidad y fracciones. Solo requiere conocimientos básicos, sin fórmulas avanzadas. Se recomienda usar papel borrador. 4 opciones, una correcta. Podés moverte libremente entre las preguntas de esta sección.',
    quant2:  'Promedios, probabilidad, ecuaciones de una variable y geometría básica. Solo conocimientos básicos, sin fórmulas avanzadas. Se recomienda usar papel borrador. 4 opciones, una correcta. Podés moverte libremente entre las preguntas de esta sección.',
    instructions: 'Evalúa la capacidad de seguir y ejecutar instrucciones. Seguí cuidadosamente todas las instrucciones antes de elegir una respuesta entre las 5 opciones. Cada conjunto de instrucciones tiene una única respuesta correcta. Podés moverte libremente entre las preguntas de esta sección.',
    verbal:  'Analogías, antónimos y lógica formal. Esta sección NO forma parte del Dapar para olim; se incluye solo para práctica libre.',
    abstract:'Matrices, patrones y razonamiento espacial. No corresponde al formato figural del examen real; se incluye solo para práctica libre.',
  },
};

// ─── STATE ─────────────────────────────────────────────────
let MODE = null;                 // 'short' | 'full' | 'free'
let FREE_SECTION = null;         // when MODE==='free': the section id
let PLAN = [];                   // ordered section ids for current run
let CUR_SEC_IDX = -1;
let SECTION_RECORDS = {};        // keyed by sectionId
let REACTION_RECORD = null;
let EXAM_SEED = 0;
let SEC = null;                  // current section runtime (see beginSection)

// ─── UTIL ──────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickN(arr, n) { return shuffle(arr).slice(0, n); }

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + id);
  if (el) el.classList.add('active');
}

function fmtMMSS(s) {
  const m = Math.floor(s / 60);
  const r = Math.max(0, s % 60);
  return String(m).padStart(2,'0') + ':' + String(r).padStart(2,'0');
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── ENTRY POINTS ──────────────────────────────────────────
function startShort() { startExamMode('short'); }
function startFull()  { startExamMode('full'); }
function startExamMode(mode) {
  MODE = mode;
  FREE_SECTION = null;
  const inc = document.getElementById('inc-instructions');
  const includeInstr = inc ? inc.checked : true;
  EXAM_SEED = Date.now();
  PLAN = CFG.sectionOrder.filter(s => s !== 'instructions' || includeInstr);
  SECTION_RECORDS = {};
  REACTION_RECORD = null;
  CUR_SEC_IDX = -1;
  nextSection();
}

function openFreePractice() { showScreen('free'); }

function startFreeSection(sectionId) {
  MODE = 'free';
  FREE_SECTION = sectionId;
  EXAM_SEED = Date.now();
  PLAN = [sectionId];
  SECTION_RECORDS = {};
  REACTION_RECORD = null;
  CUR_SEC_IDX = -1;
  if (sectionId === 'reaction') return showReactionIntro();
  nextSection();
}

function nextSection() {
  CUR_SEC_IDX++;
  if (CUR_SEC_IDX >= PLAN.length) {
    if (MODE === 'short' || MODE === 'full') return showReactionIntro();
    return showResults();
  }
  showSectionIntro(PLAN[CUR_SEC_IDX]);
}

function showSectionIntro(id) {
  const isExam = MODE === 'short' || MODE === 'full';
  const cfg = isExam ? CFG.modes[MODE][id] : null;
  const count = cfg ? cfg.count : (id === 'figural' ? 15 : null); // free practice figural: 15 by default
  const timeText = isExam
    ? (cfg.timeTotal ? `${Math.round(cfg.timeTotal/60)} min para la sección` : `${cfg.timePerQ} s por pregunta (sin volver atrás)`)
    : 'Sin tiempo · feedback inmediato';
  const nq = count != null ? count : 'libre';
  document.getElementById('intro-title').textContent = CFG.sectionNames[id];
  document.getElementById('intro-progress').textContent = isExam ? `Sección ${CUR_SEC_IDX + 1} de ${PLAN.length}` : 'Práctica libre';
  document.getElementById('intro-instructions').textContent = CFG.sectionInstructions[id] || '';
  document.getElementById('intro-count').textContent = `${nq} preguntas`;
  document.getElementById('intro-time').textContent = timeText;
  document.getElementById('intro-start').onclick = () => beginSection(id);
  showScreen('intro');
}

// ─── SECTION BUILD ─────────────────────────────────────────
function buildSectionQuestions(id, count) {
  if (id === 'quant1')  return pickN(QUANT1_QUESTIONS, count).map(q => ({...q, section:'quant1'}));
  if (id === 'quant2')  return pickN(QUANT2_QUESTIONS, count).map(q => ({...q, section:'quant2'}));
  if (id === 'verbal')  return pickN(VERBAL_QUESTIONS, count).map(q => ({...q, section:'verbal'}));
  if (id === 'abstract')return pickN(ABSTRACT_QUESTIONS, count).map(q => ({...q, section:'abstract'}));
  if (id === 'instructions') {
    const qs = INSTRUCTIONS.generate(EXAM_SEED + 100, count);
    return qs.map(q => ({...q, section:'instructions'}));
  }
  if (id === 'figural') {
    // Build enough placeholders; questions are generated adaptively as player progresses.
    return new Array(count).fill(null).map((_, i) => ({ _placeholder: true, section:'figural', _idx: i }));
  }
  return [];
}

// ─── BEGIN SECTION ─────────────────────────────────────────
function beginSection(id) {
  const isExam = MODE === 'short' || MODE === 'full';
  const cfg = isExam ? CFG.modes[MODE][id] : null;
  const defaultFreeCount = { figural: 15, quant1: 20, quant2: 20, instructions: 15, verbal: 20, abstract: 20 };
  const count = cfg ? cfg.count : defaultFreeCount[id];

  SEC = {
    id,
    isExam,
    questions: buildSectionQuestions(id, count),
    state: new Array(count).fill(null).map(() => ({ answered: false, selected: -1, flagged: false, correct: false, timeMs: 0 })),
    current: 0,
    secondsLeft: cfg && cfg.timeTotal ? cfg.timeTotal : 0,
    perQSec: cfg && cfg.timePerQ ? cfg.timePerQ : 0,
    startedAt: Date.now(),
    timerHandle: null,
    perQTimerHandle: null,
    perQSecLeft: 0,
    perQStartedAt: 0,
    curDifficulty: 3, // for figural
    maxDifficulty: 0, // for figural
  };

  showScreen('exam');
  buildExamSidebar();

  if (id === 'figural') {
    renderFiguralQuestion();
    if (SEC.perQSec > 0) startPerQTimer();
  } else {
    renderFreeNavQuestion();
    if (SEC.secondsLeft > 0) startSectionTimer();
  }
}

// ─── SIDEBAR ───────────────────────────────────────────────
function buildExamSidebar() {
  const sidebar = document.getElementById('sidebar-content');
  sidebar.innerHTML = '';

  // Timer block
  const timerDiv = document.createElement('div');
  timerDiv.className = 'sidebar-timer';
  if (SEC.id === 'figural' && SEC.perQSec > 0) {
    timerDiv.innerHTML = `
      <div class="timer-label">TIEMPO POR PREGUNTA</div>
      <div class="timer-val" id="timer-display">${SEC.perQSec}s</div>
    `;
  } else if (SEC.secondsLeft > 0) {
    timerDiv.innerHTML = `
      <div class="timer-label">TIEMPO DE SECCIÓN</div>
      <div class="timer-val" id="timer-display">${fmtMMSS(SEC.secondsLeft)}</div>
    `;
  } else {
    timerDiv.innerHTML = `
      <div class="timer-label">PRÁCTICA LIBRE</div>
      <div class="timer-val" style="font-size:1.1rem">sin tiempo</div>
    `;
  }
  sidebar.appendChild(timerDiv);

  // Section header
  const secHdr = document.createElement('div');
  secHdr.className = 'sidebar-section';
  secHdr.innerHTML = `<div class="sidebar-sec-label">${CFG.sectionShort[SEC.id]}</div>`;
  if (SEC.id !== 'figural') {
    const grid = document.createElement('div');
    grid.className = 'q-grid';
    grid.id = 'nav-grid';
    for (let i = 0; i < SEC.questions.length; i++) {
      const btn = document.createElement('button');
      btn.className = 'q-btn';
      btn.id = 'qb-' + i;
      btn.textContent = i + 1;
      btn.setAttribute('aria-label', `Pregunta ${i + 1}`);
      btn.onclick = () => goTo(i);
      grid.appendChild(btn);
    }
    secHdr.appendChild(grid);
  } else {
    const info = document.createElement('div');
    info.className = 'figural-info';
    info.innerHTML = `<div id="fig-counter" style="font-size:0.8rem;color:var(--text-dim);padding:6px 0;">1 / ${SEC.questions.length}</div><div style="font-size:0.65rem;color:var(--text-dim);">Nivel: <span id="fig-level">${SEC.curDifficulty}</span></div>`;
    secHdr.appendChild(info);
  }
  sidebar.appendChild(secHdr);

  const prog = document.createElement('div');
  prog.className = 'sidebar-progress';
  prog.innerHTML = `
    <span id="prog-text">0 / ${SEC.questions.length} respondidas</span>
    <div class="prog-bar"><div class="prog-fill" id="prog-fill" style="width:0%"></div></div>
  `;
  sidebar.appendChild(prog);

  const finishBtn = document.createElement('button');
  finishBtn.className = 'btn-finish';
  finishBtn.textContent = SEC.id === 'figural' ? 'TERMINAR SECCIÓN' : 'TERMINAR SECCIÓN';
  finishBtn.onclick = confirmFinishSection;
  sidebar.appendChild(finishBtn);
}

function updateProgress() {
  const done = SEC.state.filter(s => s.answered).length;
  const total = SEC.questions.length;
  const txt = document.getElementById('prog-text');
  const fill = document.getElementById('prog-fill');
  if (txt) txt.textContent = `${done} / ${total} respondidas`;
  if (fill) fill.style.width = (done / total * 100) + '%';
}

// ─── TIMERS ────────────────────────────────────────────────
function startSectionTimer() {
  clearInterval(SEC.timerHandle);
  SEC.timerHandle = setInterval(() => {
    SEC.secondsLeft--;
    const el = document.getElementById('timer-display');
    if (el) {
      el.textContent = fmtMMSS(SEC.secondsLeft);
      el.className = 'timer-val' + (SEC.secondsLeft < 60 ? ' danger' : SEC.secondsLeft < 180 ? ' warning' : '');
    }
    if (SEC.secondsLeft <= 0) {
      clearInterval(SEC.timerHandle);
      finishSection(true);
    }
  }, 1000);
}

function startPerQTimer() {
  clearInterval(SEC.perQTimerHandle);
  SEC.perQSecLeft = SEC.perQSec;
  SEC.perQStartedAt = Date.now();
  const el = document.getElementById('timer-display');
  if (el) el.textContent = SEC.perQSecLeft + 's';
  SEC.perQTimerHandle = setInterval(() => {
    SEC.perQSecLeft--;
    const el = document.getElementById('timer-display');
    if (el) {
      el.textContent = SEC.perQSecLeft + 's';
      el.className = 'timer-val' + (SEC.perQSecLeft < 5 ? ' danger' : SEC.perQSecLeft < 10 ? ' warning' : '');
    }
    if (SEC.perQSecLeft <= 0) {
      clearInterval(SEC.perQTimerHandle);
      // Timeout = incorrect, auto-advance
      figuralSubmit(-1, true);
    }
  }, 1000);
}

function stopAllTimers() {
  if (SEC) {
    clearInterval(SEC.timerHandle);
    clearInterval(SEC.perQTimerHandle);
  }
}

// ─── NAVIGATION (free-nav) ─────────────────────────────────
function navigate(dir) {
  if (!SEC || SEC.id === 'figural') return;
  const next = SEC.current + dir;
  if (next < 0 || next >= SEC.questions.length) return;
  SEC.current = next;
  renderFreeNavQuestion();
}
function goTo(idx) {
  if (!SEC || SEC.id === 'figural') return;
  SEC.current = idx;
  renderFreeNavQuestion();
}

// ─── FINISH SECTION ────────────────────────────────────────
function confirmFinishSection() {
  const unanswered = SEC.state.filter(s => !s.answered).length;
  const msg = unanswered > 0
    ? `Quedan ${unanswered} preguntas sin responder. Recordá que NO hay penalización por respuestas incorrectas: conviene marcar algo. ¿Terminar sección igual?`
    : '¿Terminar sección?';
  if (confirm(msg)) finishSection(false);
}

function finishSection(timedOut) {
  stopAllTimers();
  // Compute correctness for free-nav sections
  if (SEC.id !== 'figural') {
    SEC.state.forEach((s, i) => {
      s.correct = s.answered && s.selected === SEC.questions[i].a;
    });
  }
  SECTION_RECORDS[SEC.id] = {
    id: SEC.id,
    questions: SEC.questions,
    state: SEC.state,
    elapsedMs: Date.now() - SEC.startedAt,
    timedOut,
    maxDifficulty: SEC.maxDifficulty, // figural
  };
  SEC = null;
  if (MODE === 'free') return showResults();
  nextSection();
}

// ─── REACTION ──────────────────────────────────────────────
function showReactionIntro() {
  showScreen('reaction-intro');
  if (window.REACTION) REACTION.renderIntroShapes(document.getElementById('rx-intro-shapes'));
}
function startReactionTest() {
  showScreen('reaction');
  REACTION.start(document.getElementById('reaction-stage-wrapper'), (result) => {
    REACTION_RECORD = result;
    if (MODE === 'free' && FREE_SECTION === 'reaction') return showResults();
    showResults();
  });
}
function skipReaction() {
  REACTION_RECORD = null;
  showResults();
}

// ─── HOME ──────────────────────────────────────────────────
function goHome() {
  stopAllTimers();
  SEC = null;
  renderHistoryOnHome();
  showScreen('start');
}

function renderHistoryOnHome() {
  const container = document.getElementById('history-list');
  if (!container) return;
  const history = loadHistory();
  if (!history.length) {
    container.innerHTML = '<div class="hist-empty">Todavía no hay intentos registrados.</div>';
    return;
  }
  const rows = history.slice(0, 5).map(h => {
    const date = new Date(h.date);
    const d = date.toLocaleDateString('es-AR') + ' ' + date.toLocaleTimeString('es-AR', {hour:'2-digit',minute:'2-digit'});
    const sec = Object.entries(h.sections).map(([id, v]) => `${CFG.sectionShort[id] || id}: ${v}`).join(' · ');
    return `<div class="hist-row"><div class="hist-date">${d}</div><div class="hist-score">${h.score}</div><div class="hist-mode">${h.mode}</div><div class="hist-secs">${sec}</div></div>`;
  }).join('');
  container.innerHTML = rows;
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(CFG.historyKey);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function saveHistory(entry) {
  try {
    const hist = loadHistory();
    hist.unshift(entry);
    localStorage.setItem(CFG.historyKey, JSON.stringify(hist.slice(0, CFG.historyMax)));
  } catch (e) { /* storage may be disabled */ }
}

// ─── INFO COLLAPSIBLE ──────────────────────────────────────
function toggleInfo() {
  const box = document.getElementById('info-content');
  const chev = document.getElementById('info-chev');
  const open = box.classList.toggle('open');
  if (chev) chev.textContent = open ? '▼' : '▶';
}

// ─── KEYBOARD ──────────────────────────────────────────────
document.addEventListener('keydown', e => {
  const examActive = document.getElementById('screen-exam').classList.contains('active');
  if (!examActive || !SEC) return;
  const maxOpts = CFG.sectionOptions[SEC.id] || 4;
  if (/^[1-5]$/.test(e.key)) {
    const idx = parseInt(e.key, 10) - 1;
    if (idx >= maxOpts) return;
    if (SEC.id === 'figural') {
      figuralSubmit(idx, false);
    } else if (!SEC.state[SEC.current].answered) {
      selectAnswer(idx);
    } else {
      // allow re-selection
      selectAnswer(idx);
    }
    return;
  }
  if (SEC.id !== 'figural') {
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'm' || e.key === 'M' || e.key === 'f' || e.key === 'F') toggleFlag();
  }
});

// Boot
window.addEventListener('load', () => {
  renderHistoryOnHome();
});
