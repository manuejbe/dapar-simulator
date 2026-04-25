function calcDapar(correct, total) {
  const pct = correct / total;
  const pts = [
    [0, 10], [0.10, 16], [0.20, 22], [0.30, 30], [0.35, 36],
    [0.40, 41], [0.45, 46], [0.50, 50], [0.55, 54], [0.60, 58],
    [0.65, 62], [0.70, 66], [0.75, 70], [0.80, 74], [0.85, 79],
    [0.90, 83], [0.95, 87], [1.00, 90]
  ];
  for (let i = 1; i < pts.length; i++) {
    if (pct <= pts[i][0]) {
      const t = (pct - pts[i-1][0]) / (pts[i][0] - pts[i-1][0]);
      return Math.round(pts[i-1][1] + t * (pts[i][1] - pts[i-1][1]));
    }
  }
  return 90;
}

function daparBand(score) {
  if (score < 30) return 'Bajo';
  if (score < 44) return 'Por debajo del promedio';
  if (score < 56) return 'Promedio';
  if (score < 68) return 'Por encima del promedio';
  if (score < 78) return 'Alto';
  return 'Excepcional';
}

function toggleExplanation(idx) {
  const content = document.getElementById('ri-exp-' + idx);
  const toggle  = document.getElementById('ri-toggle-' + idx);
  if (!content) return;
  const open = content.classList.toggle('open');
  toggle.textContent = open ? '▼ Ocultar explicación' : '▶ Ver explicación';
}

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

  const dapar = calcDapar(totCorrect, 54);
  document.getElementById('dapar-val').textContent = dapar;
  document.getElementById('dapar-band').textContent = daparBand(dapar);

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
        <div id="ri-toggle-${i}" class="ri-exp-toggle" onclick="toggleExplanation(${i})">▶ Ver explicación</div>
        <div id="ri-exp-${i}" class="ri-exp-content">${escHtml(q.e)}</div>
      </div>
    `;
    list.appendChild(div);
  });

  showScreen('results');
}
