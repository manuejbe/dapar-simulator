const BANK = {
  verbal:   VERBAL_QUESTIONS,
  math:     MATH_QUESTIONS,
  abstract: ABSTRACT_QUESTIONS,
};

let session = [];
let state   = [];
let current = 0;
let timerInterval = null;
let secondsLeft   = 40 * 60;
let examStartTime = null;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startExam() {
  const vb = shuffle(BANK.verbal).slice(0, 18);
  const mt = shuffle(BANK.math).slice(0, 18);
  const ab = shuffle(BANK.abstract).slice(0, 18);

  session = [
    ...vb.map(q => ({...q, section:'verbal'})),
    ...mt.map(q => ({...q, section:'math'})),
    ...ab.map(q => ({...q, section:'abstract'})),
  ];

  state = session.map(() => ({ answered: false, selected: -1, flagged: false, correct: false }));
  current = 0;
  secondsLeft = 40 * 60;
  examStartTime = Date.now();

  buildNavGrids();
  showScreen('exam');
  renderQuestion();
  startTimer();
}

function buildNavGrids() {
  ['verbal','math','abstract'].forEach((sec, si) => {
    const grid = document.getElementById('grid-' + sec);
    grid.innerHTML = '';
    const start = si * 18;
    for (let i = 0; i < 18; i++) {
      const idx = start + i;
      const btn = document.createElement('button');
      btn.className = 'q-btn';
      btn.id = 'qb-' + idx;
      btn.textContent = i + 1;
      btn.setAttribute('aria-label', `Ir a pregunta ${i + 1} de ${sec}`);
      btn.onclick = () => goTo(idx);
      grid.appendChild(btn);
    }
  });
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    secondsLeft--;
    updateTimerDisplay();
    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      showResults();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  const el = document.getElementById('timer-display');
  el.textContent = String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
  el.className = 'timer-val' + (secondsLeft < 300 ? ' danger' : secondsLeft < 600 ? ' warning' : '');
}

function navigate(dir) {
  cancelAutoAdvance();
  const next = current + dir;
  if (next < 0 || next >= session.length) return;
  current = next;
  renderQuestion();
}

function goTo(idx) {
  cancelAutoAdvance();
  current = idx;
  renderQuestion();
}

function updateProgress() {
  const done = state.filter(s => s.answered).length;
  document.getElementById('prog-text').textContent = `${done} / 54 respondidas`;
  document.getElementById('prog-fill').style.width = (done / 54 * 100) + '%';
}

function confirmFinish() {
  const done = state.filter(s => s.answered).length;
  const msg = done < 54
    ? `Quedan ${54-done} preguntas sin responder. ¿Deseas finalizar el examen?`
    : '¿Deseas finalizar el examen?';
  if (confirm(msg)) {
    clearInterval(timerInterval);
    showResults();
  }
}

function restartExam() {
  showScreen('start');
}

// keyboard shortcuts during exam
document.addEventListener('keydown', e => {
  if (!document.getElementById('screen-exam').classList.contains('active')) return;
  if (['1','2','3','4'].includes(e.key)) {
    const idx = parseInt(e.key) - 1;
    if (!state[current]?.answered) selectAnswer(idx);
  }
  if (e.key === 'ArrowRight') navigate(1);
  if (e.key === 'ArrowLeft')  navigate(-1);
  if (e.key === 'f' || e.key === 'F') toggleFlag();
});

updateTimerDisplay();
