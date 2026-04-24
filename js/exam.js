let autoAdvanceTimer = null;

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderQuestion() {
  cancelAutoAdvance();

  const q = session[current];
  const s = state[current];

  document.getElementById('q-num-label').textContent = `PREGUNTA ${current+1} DE 54`;
  const tag = document.getElementById('q-section-tag');
  const secNames = {verbal:'VERBAL', math:'MATEMÁTICAS', abstract:'ABSTRACTO'};
  tag.textContent = secNames[q.section];
  tag.className = 'q-section-tag ' + q.section;

  document.getElementById('btn-flag').classList.toggle('active', s.flagged);

  document.querySelectorAll('.q-btn').forEach(b => b.classList.remove('current'));
  const curBtn = document.getElementById('qb-' + current);
  if (curBtn) curBtn.classList.add('current');

  const body = document.getElementById('q-body');
  body.innerHTML = '';

  const qtxt = document.createElement('div');
  qtxt.className = 'q-text';
  qtxt.innerHTML = escHtml(q.q).replace(/\n/g, '<br>');
  body.appendChild(qtxt);

  const choices = document.createElement('div');
  choices.className = 'choices';
  const letters = ['A','B','C','D'];
  q.o.forEach((opt, oi) => {
    const btn = document.createElement('button');
    btn.className = 'choice' + (s.answered ? ' disabled' : '');
    btn.setAttribute('aria-label', `Opción ${letters[oi]}: ${opt}`);
    btn.innerHTML = `<span class="choice-letter">${letters[oi]}.</span> ${escHtml(opt)}`;
    if (s.answered) {
      if (oi === q.a) btn.classList.add('correct');
      if (oi === s.selected && s.selected !== q.a) btn.classList.add('wrong');
    } else {
      btn.onclick = () => selectAnswer(oi);
      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectAnswer(oi); }
      });
    }
    choices.appendChild(btn);
  });
  body.appendChild(choices);

  const fb = document.createElement('div');
  fb.className = 'feedback-box';
  fb.id = 'feedback';
  if (s.answered) {
    fb.style.display = 'block';
    if (s.correct) {
      fb.classList.add('correct');
      fb.innerHTML = `<div class="feedback-label correct">✓ CORRECTO</div>${escHtml(q.e)}`;
    } else {
      fb.classList.add('wrong');
      fb.innerHTML = `<div class="feedback-label wrong">✗ INCORRECTO</div>${escHtml(q.e)}`;
    }
  }
  body.appendChild(fb);

  updateProgress();
}

function selectAnswer(idx) {
  const s = state[current];
  if (s.answered) return;

  s.answered = true;
  s.selected = idx;
  s.correct = idx === session[current].a;

  const btn = document.getElementById('qb-' + current);
  if (btn) {
    btn.classList.remove('current');
    btn.classList.add(s.correct ? 'correct' : 'wrong');
  }

  renderQuestion();

  const isLast = current === session.length - 1;
  const allAnswered = state.every(st => st.answered);

  if (isLast || allAnswered) {
    showSubmitPrompt();
  } else {
    showAutoAdvanceBar();
    autoAdvanceTimer = setTimeout(() => {
      autoAdvanceTimer = null;
      const next = findNextUnanswered();
      if (next !== -1) {
        current = next;
        renderQuestion();
      }
    }, 1200);
  }
}

function findNextUnanswered() {
  for (let i = current + 1; i < session.length; i++) {
    if (!state[i].answered) return i;
  }
  for (let i = 0; i < current; i++) {
    if (!state[i].answered) return i;
  }
  return -1;
}

function showAutoAdvanceBar() {
  const body = document.getElementById('q-body');
  const bar = document.createElement('div');
  bar.id = 'auto-advance-bar';
  bar.className = 'auto-advance-bar';
  bar.setAttribute('role', 'status');
  bar.setAttribute('aria-live', 'polite');
  bar.innerHTML = `
    <span class="auto-advance-label">Avanzando en 1.2s…</span>
    <button class="btn-skip-advance" onclick="cancelAutoAdvance()" aria-label="Cancelar avance automático">Mantener aquí</button>
  `;
  body.appendChild(bar);
}

function cancelAutoAdvance() {
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
  const bar = document.getElementById('auto-advance-bar');
  if (bar) bar.remove();
}

function showSubmitPrompt() {
  const body = document.getElementById('q-body');
  const prompt = document.createElement('div');
  prompt.className = 'submit-prompt';
  prompt.innerHTML = `
    <span>Última pregunta respondida.</span>
    <button class="btn-submit-exam" onclick="confirmFinish()">Entregar examen ▶</button>
  `;
  body.appendChild(prompt);
}

function toggleFlag() {
  state[current].flagged = !state[current].flagged;
  const s = state[current];
  document.getElementById('btn-flag').classList.toggle('active', s.flagged);
  const btn = document.getElementById('qb-' + current);
  if (btn && !s.answered) {
    btn.classList.toggle('flagged', s.flagged);
  }
}
