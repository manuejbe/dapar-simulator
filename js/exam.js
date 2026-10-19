// ─── FREE-NAV RENDERER (quant1, quant2, instructions, verbal, abstract) ──
function renderFreeNavQuestion() {
  const q = SEC.questions[SEC.current];
  const s = SEC.state[SEC.current];
  const maxOpts = CFG.sectionOptions[SEC.id] || 4;
  const letters = ['A','B','C','D','E'];

  document.getElementById('q-num-label').textContent = `PREGUNTA ${SEC.current + 1} DE ${SEC.questions.length}`;
  const tag = document.getElementById('q-section-tag');
  tag.textContent = CFG.sectionShort[SEC.id];
  tag.className = 'q-section-tag ' + SEC.id;

  document.getElementById('btn-flag').classList.toggle('active', s.flagged);

  // nav grid highlight
  document.querySelectorAll('.q-btn').forEach(b => b.classList.remove('current'));
  const curBtn = document.getElementById('qb-' + SEC.current);
  if (curBtn) curBtn.classList.add('current');

  const body = document.getElementById('q-body');
  body.innerHTML = '';

  const qtxt = document.createElement('div');
  qtxt.className = 'q-text';
  qtxt.innerHTML = escHtml(q.q).replace(/\n/g, '<br>');
  body.appendChild(qtxt);

  const choices = document.createElement('div');
  choices.className = 'choices';
  q.o.slice(0, maxOpts).forEach((opt, oi) => {
    const btn = document.createElement('button');
    btn.className = 'choice' + (s.answered && s.selected === oi ? ' selected' : '');
    btn.setAttribute('aria-label', `Opción ${letters[oi]}: ${opt}`);
    btn.innerHTML = `<span class="choice-letter">${letters[oi]}.</span> <span class="choice-txt">${escHtml(opt).replace(/\n/g,'<br>')}</span>`;
    // For free-practice mode (no timer), show feedback. For exam mode, no feedback.
    const showFeedback = !SEC.isExam;
    if (showFeedback && s.answered) {
      btn.classList.add('disabled');
      if (oi === q.a) btn.classList.add('correct');
      if (oi === s.selected && s.selected !== q.a) btn.classList.add('wrong');
    } else {
      btn.onclick = () => selectAnswer(oi);
    }
    choices.appendChild(btn);
  });
  body.appendChild(choices);

  // Feedback box (practice mode only)
  if (!SEC.isExam && s.answered) {
    const fb = document.createElement('div');
    fb.className = 'feedback-box ' + (s.correct ? 'correct' : 'wrong');
    fb.style.display = 'block';
    fb.innerHTML = `<div class="feedback-label ${s.correct ? 'correct' : 'wrong'}">${s.correct ? '✓ CORRECTO' : '✗ INCORRECTO'}</div>${escHtml(q.e).replace(/\n/g,'<br>')}`;
    body.appendChild(fb);
  }

  updateProgress();
}

function selectAnswer(idx) {
  const s = SEC.state[SEC.current];
  const q = SEC.questions[SEC.current];
  s.answered = true;
  s.selected = idx;
  // In exam mode, correct is computed only at section end so it can't leak.
  if (!SEC.isExam) s.correct = idx === q.a;

  const btn = document.getElementById('qb-' + SEC.current);
  if (btn) {
    btn.classList.remove('current');
    if (SEC.isExam) {
      btn.classList.add('answered');
    } else {
      btn.classList.add(s.correct ? 'correct' : 'wrong');
    }
  }
  renderFreeNavQuestion();
  updateProgress();
}

function toggleFlag() {
  if (!SEC || SEC.id === 'figural') return;
  const s = SEC.state[SEC.current];
  s.flagged = !s.flagged;
  document.getElementById('btn-flag').classList.toggle('active', s.flagged);
  const btn = document.getElementById('qb-' + SEC.current);
  if (btn) btn.classList.toggle('flagged', s.flagged);
}

// ─── FIGURAL RENDERER (adaptive) ───────────────────────────
function renderFiguralQuestion() {
  const idx = SEC.current;
  const total = SEC.questions.length;

  // Generate the actual question using current difficulty
  const q = FIGURAL.generate(EXAM_SEED + idx * 1009 + SEC.curDifficulty * 7, SEC.curDifficulty);
  q.section = 'figural';
  q._difficulty = SEC.curDifficulty;
  SEC.questions[idx] = q;
  SEC.maxDifficulty = Math.max(SEC.maxDifficulty, SEC.curDifficulty);

  document.getElementById('q-num-label').textContent = `PREGUNTA ${idx + 1} DE ${total}`;
  const tag = document.getElementById('q-section-tag');
  tag.textContent = 'FIGURAL';
  tag.className = 'q-section-tag figural';

  const counter = document.getElementById('fig-counter');
  if (counter) counter.textContent = `${idx + 1} / ${total}`;
  const level = document.getElementById('fig-level');
  if (level) level.textContent = SEC.curDifficulty;

  const body = document.getElementById('q-body');
  body.innerHTML = '';

  const prompt = document.createElement('div');
  prompt.className = 'q-text';
  prompt.innerHTML = 'Observá cómo la figura 4 se transforma en la figura 3. Aplicá la misma transformación a la figura 2 y elegí el resultado.';
  body.appendChild(prompt);

  // Row of base figures (4 → 3, 2 → ?)
  const row = document.createElement('div');
  row.className = 'figural-row';
  row.innerHTML = `
    <div class="figural-pair">
      <div class="figural-cell"><div class="fig-num">4</div>${q.svgs.f4}</div>
      <div class="figural-arrow">→</div>
      <div class="figural-cell"><div class="fig-num">3</div>${q.svgs.f3}</div>
    </div>
    <div class="figural-pair">
      <div class="figural-cell"><div class="fig-num">2</div>${q.svgs.f2}</div>
      <div class="figural-arrow">→</div>
      <div class="figural-cell figural-cell-q"><div class="fig-num">?</div><div class="fig-q">?</div></div>
    </div>
  `;
  body.appendChild(row);

  const choices = document.createElement('div');
  choices.className = 'choices figural-choices';
  const letters = ['A','B','C','D'];
  q.svgs.options.forEach((svg, oi) => {
    const btn = document.createElement('button');
    btn.className = 'choice choice-figural';
    btn.setAttribute('aria-label', `Opción ${letters[oi]}`);
    btn.innerHTML = `<span class="choice-letter">${letters[oi]}</span><div class="choice-figural-svg">${svg}</div>`;
    btn.onclick = () => figuralSubmit(oi, false);
    choices.appendChild(btn);
  });
  body.appendChild(choices);
}

function figuralSubmit(idx, timeout) {
  if (!SEC || SEC.id !== 'figural') return;
  clearInterval(SEC.perQTimerHandle);
  const cur = SEC.current;
  const q = SEC.questions[cur];
  const s = SEC.state[cur];
  s.answered = true;
  s.selected = idx;
  s.correct = idx === q.answerIndex;
  s.timeMs = Date.now() - SEC.perQStartedAt;
  s.difficulty = q._difficulty;
  s.timeout = !!timeout;

  // Adapt difficulty
  SEC.curDifficulty = FIGURAL.nextDifficulty(SEC.curDifficulty, s.correct);
  SEC.current++;

  if (SEC.current >= SEC.questions.length) {
    finishSection(false);
    return;
  }
  renderFiguralQuestion();
  if (SEC.perQSec > 0) startPerQTimer();
}
