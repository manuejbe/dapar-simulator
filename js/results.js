function showResults() {
  clearInterval(timerInterval);

  const elapsed = Math.floor((Date.now() - examStartTime) / 1000);
  const em = Math.floor(elapsed / 60);
  const es = elapsed % 60;
  document.getElementById('results-time').textContent = `Tiempo utilizado: ${em}m ${es}s`;

  let totCorrect = 0;
  const secScores = { verbal: 0, math: 0, abstract: 0 };

  state.forEach((s, i) => {
    if (s.correct) {
      totCorrect++;
      secScores[session[i].section]++;
    }
  });

  const pct = Math.round(totCorrect / 54 * 100);
  document.getElementById('score-pct').textContent = pct + '%';
  document.getElementById('score-raw').textContent = `${totCorrect} / 54 correctas`;

  ['verbal','math','abstract'].forEach(sec => {
    const c = secScores[sec];
    const p = Math.round(c / 18 * 100);
    document.getElementById(`sec-${sec}-pct`).textContent = p + '%';
    document.getElementById(`sec-${sec}-raw`).textContent = `${c} / 18`;
    document.getElementById(`sec-${sec}-bar`).style.width = p + '%';
  });

  const list = document.getElementById('review-list');
  list.innerHTML = '';
  session.forEach((q, i) => {
    const s = state[i];
    const div = document.createElement('div');
    div.className = 'review-item ' + (s.correct ? 'correct' : 'wrong');
    const secLabel = {verbal:'VERBAL', math:'MATEMÁTICAS', abstract:'ABSTRACTO'}[q.section];
    const letters = ['A','B','C','D'];
    const userAns = s.answered ? `${letters[s.selected]}. ${q.o[s.selected]}` : 'Sin respuesta';
    const correctAns = `${letters[q.a]}. ${q.o[q.a]}`;
    div.innerHTML = `
      <div class="review-item-hdr">
        <span class="ri-num">${i+1}.</span>
        <span>${secLabel}</span>
        <span>${s.correct ? '✓ CORRECTO' : '✗ INCORRECTO'}</span>
      </div>
      <div class="review-item-q">${escHtml(q.q).replace(/\n/g,'<br>')}</div>
      <div class="review-answers">
        ${!s.correct && s.answered ? `<div class="ri-user">Tu respuesta: ${escHtml(userAns)}</div>` : ''}
        <div class="ri-correct">Respuesta correcta: ${escHtml(correctAns)}</div>
        <div class="ri-exp">${escHtml(q.e)}</div>
      </div>
    `;
    list.appendChild(div);
  });

  showScreen('results');
}
