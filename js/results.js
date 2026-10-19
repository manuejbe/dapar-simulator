// ─── 10-90 scoring ─────────────────────────────────────────
// Simple weighted-percentage mapping. Figural uses difficulty weights.
// Full documented in README "Decisiones de diseño".
function pctTo10_90(pct) {
  // 0% → 10, 100% → 90. Clamped. Linear with small curve at edges.
  const p = Math.max(0, Math.min(1, pct));
  // breakpoints (pct, score)
  const pts = [
    [0.00, 10], [0.10, 18], [0.20, 26], [0.30, 34], [0.40, 42],
    [0.50, 50], [0.60, 58], [0.70, 66], [0.80, 74], [0.90, 82], [1.00, 90]
  ];
  for (let i = 1; i < pts.length; i++) {
    if (p <= pts[i][0]) {
      const t = (p - pts[i-1][0]) / (pts[i][0] - pts[i-1][0] || 1);
      return Math.round(pts[i-1][1] + t * (pts[i][1] - pts[i-1][1]));
    }
  }
  return 90;
}

function scoreSection(record) {
  if (!record) return { pct: 0, score: 10, correct: 0, total: 0 };
  const total = record.questions.length;
  let correct = 0;
  let weighted = 0, weightSum = 0;
  if (record.id === 'figural') {
    record.state.forEach((s, i) => {
      const q = record.questions[i];
      const w = q && q._difficulty ? FIGURAL.weight(q._difficulty) : 1.0;
      weightSum += w;
      if (s.correct) { correct++; weighted += w; }
    });
    const pct = weightSum > 0 ? weighted / weightSum : 0;
    return { pct, score: pctTo10_90(pct), correct, total };
  }
  record.state.forEach(s => { if (s.correct) correct++; });
  const pct = total > 0 ? correct / total : 0;
  return { pct, score: pctTo10_90(pct), correct, total };
}

function overallScore() {
  const scores = Object.values(SECTION_RECORDS).map(scoreSection);
  if (!scores.length) return { pct: 0, score: 10 };
  const avgPct = scores.reduce((a, b) => a + b.pct, 0) / scores.length;
  return { pct: avgPct, score: pctTo10_90(avgPct) };
}

const INTERP = [
  { min: 90, label: 'Sobresaliente', opens: 'Unidades top de Inteligencia (ej. 8200).' },
  { min: 80, label: 'Excelente',     opens: 'Todas las opciones de la IDF.' },
  { min: 70, label: 'Muy bueno',     opens: 'La mayoría de las unidades top de Inteligencia.' },
  { min: 60, label: 'Bueno',         opens: 'Oficiales, Fuerzas Especiales, Piloto.' },
  { min: 50, label: 'Promedio',      opens: 'Roles de mando, no combate.' },
  { min: 0,  label: 'Limitado',      opens: 'Opciones de puesto restringidas.' },
];

function interpRow(score) {
  // Highlight the band whose min is immediately <= score.
  for (const row of INTERP) if (score >= row.min) return row;
  return INTERP[INTERP.length - 1];
}

// ─── UI ────────────────────────────────────────────────────
function showResults() {
  stopAllTimers();
  const box = document.getElementById('results-box');
  box.innerHTML = '';

  const title = document.createElement('div');
  title.className = 'results-title';
  title.textContent = 'RESULTADOS';
  box.appendChild(title);

  const sub = document.createElement('div');
  sub.className = 'results-sub';
  const modeText = MODE === 'short' ? 'Práctica corta' : MODE === 'full' ? 'Examen completo' : 'Práctica libre';
  sub.textContent = `Modo: ${modeText}`;
  box.appendChild(sub);

  const sections = Object.values(SECTION_RECORDS);
  const hasExamScore = (MODE === 'short' || MODE === 'full') && sections.length > 0;

  if (hasExamScore) {
    const ov = overallScore();
    const card = document.createElement('div');
    card.className = 'dapar-score-card';
    card.innerHTML = `
      <div class="dapar-label">PUNTAJE ESTIMADO · ESCALA 10–90</div>
      <div class="dapar-val">${ov.score}</div>
      <div class="dapar-band">${interpRow(ov.score).label.toUpperCase()}</div>
      <div class="dapar-note">* Estimación orientativa. El DAPAR real se calcula en relación con todos los que rinden el examen, así que este número no es tu puntaje oficial.</div>
    `;
    box.appendChild(card);

    // Interpretation table
    const interp = document.createElement('div');
    interp.className = 'interp-table';
    interp.innerHTML = `
      <div class="interp-title">¿Qué significa cada puntaje?</div>
      <table>
        <thead><tr><th>Puntaje</th><th>Significado</th><th>Acceso</th></tr></thead>
        <tbody>
          ${INTERP.map(r => {
            const cur = interpRow(ov.score);
            const hl = r.min === cur.min ? ' class="hl"' : '';
            const label = r.min === 0 ? '< 50' : r.min;
            return `<tr${hl}><td>${label}</td><td>${r.label}</td><td>${r.opens}</td></tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
    box.appendChild(interp);
  }

  // Per-section cards
  if (sections.length) {
    const grid = document.createElement('div');
    grid.className = 'section-scores';
    sections.forEach(rec => {
      const sc = scoreSection(rec);
      const unansw = rec.state.filter(s => !s.answered).length;
      const times = rec.state.filter(s => s.answered && s.timeMs > 0).map(s => s.timeMs / 1000);
      let avgTime = null;
      if (rec.id === 'figural' && times.length) {
        avgTime = (times.reduce((a,b) => a+b, 0) / times.length).toFixed(1);
      } else {
        // For section-timer sections, avg Q time = elapsed / answered
        const answered = rec.state.filter(s => s.answered).length;
        if (answered > 0) avgTime = (rec.elapsedMs / 1000 / answered).toFixed(1);
      }
      const recom = CFG.recommendedPerQ[rec.id];
      const card = document.createElement('div');
      card.className = 'sec-score-card ' + rec.id;
      let extra = '';
      if (rec.id === 'figural' && rec.maxDifficulty) {
        extra = `<div class="sec-extra">Nivel máx. alcanzado: <b>${rec.maxDifficulty}</b></div>`;
      }
      card.innerHTML = `
        <div class="sec-score-name">${CFG.sectionShort[rec.id]}</div>
        <div class="sec-score-pct">${sc.score}</div>
        <div class="sec-score-raw">${sc.correct} / ${sc.total} correctas</div>
        <div class="sec-bar"><div class="sec-bar-fill" style="width:${Math.round(sc.pct*100)}%"></div></div>
        <div class="sec-extra">Sin responder: <b>${unansw}</b></div>
        ${avgTime ? `<div class="sec-extra">Tiempo medio por preg.: <b>${avgTime}s</b>${recom ? ` <span class="sec-rec">(recom. ${recom}s)</span>` : ''}</div>` : ''}
        ${extra}
      `;
      grid.appendChild(card);
    });
    box.appendChild(grid);
  }

  // Reaction block
  if (REACTION_RECORD) {
    const r = REACTION_RECORD;
    const rx = document.createElement('div');
    rx.className = 'reaction-card';
    rx.innerHTML = `
      <div class="reaction-title">Atención sostenida</div>
      <div class="reaction-note">Separado del puntaje 10–90. Mide velocidad y precisión en el test de reacción.</div>
      <div class="reaction-grid">
        <div class="rx-stat"><div class="rx-stat-v">${r.hits} / ${r.targets}</div><div class="rx-stat-l">Aciertos</div></div>
        <div class="rx-stat"><div class="rx-stat-v">${r.omissions}</div><div class="rx-stat-l">Omisiones</div></div>
        <div class="rx-stat"><div class="rx-stat-v">${r.falseHard + r.falseEasy}</div><div class="rx-stat-l">Falsas alarmas</div></div>
        <div class="rx-stat"><div class="rx-stat-v">${r.falseHard}</div><div class="rx-stat-l">… ante distractores difíciles</div></div>
        <div class="rx-stat"><div class="rx-stat-v">${r.avgRt != null ? r.avgRt + ' ms' : '—'}</div><div class="rx-stat-l">RT medio (aciertos)</div></div>
        <div class="rx-stat"><div class="rx-stat-v">${r.minRt != null ? r.minRt + ' ms' : '—'}</div><div class="rx-stat-l">RT mínimo</div></div>
      </div>
    `;
    box.appendChild(rx);
  }

  // Save history (only for exam modes with score)
  if (hasExamScore) {
    const ov = overallScore();
    const sectionsScores = {};
    sections.forEach(rec => { sectionsScores[rec.id] = scoreSection(rec).score; });
    saveHistory({
      date: Date.now(),
      mode: modeText,
      score: ov.score,
      sections: sectionsScores,
      reaction: REACTION_RECORD || null,
    });
  }

  // Review
  if (sections.length) {
    const revTitle = document.createElement('div');
    revTitle.className = 'review-title';
    revTitle.textContent = 'REVISIÓN DE PREGUNTAS';
    box.appendChild(revTitle);

    const list = document.createElement('div');
    list.id = 'review-list';
    sections.forEach(rec => {
      rec.questions.forEach((q, i) => {
        const s = rec.state[i];
        const div = document.createElement('div');
        div.className = 'review-item ' + (s.correct ? 'correct' : (s.answered ? 'wrong' : 'skipped'));
        const sectionLabel = CFG.sectionShort[rec.id];
        const letters = ['A','B','C','D','E'];

        let bodyHtml = '';
        if (q.svgs) {
          // Figural
          bodyHtml = `
            <div class="review-figural">
              <div class="figural-pair">
                <div class="figural-cell"><div class="fig-num">4</div>${q.svgs.f4}</div>
                <div class="figural-arrow">→</div>
                <div class="figural-cell"><div class="fig-num">3</div>${q.svgs.f3}</div>
              </div>
              <div class="figural-pair">
                <div class="figural-cell"><div class="fig-num">2</div>${q.svgs.f2}</div>
                <div class="figural-arrow">→</div>
                <div class="figural-cell"><div class="fig-num">?</div>${q.svgs.options[q.answerIndex]}</div>
              </div>
            </div>
            <div class="review-figural-opts">${q.svgs.options.map((svg, oi) => {
              let cls = '';
              if (oi === q.answerIndex) cls = 'correct';
              else if (oi === s.selected) cls = 'wrong';
              return `<div class="figopt ${cls}"><span class="choice-letter">${letters[oi]}</span><div>${svg}</div></div>`;
            }).join('')}</div>
            <div class="ri-meta">Nivel ${q._difficulty || '?'} · ${s.timeout ? 'tiempo agotado' : (s.answered ? `respondió ${letters[s.selected]}` : 'sin respuesta')}</div>
          `;
        } else {
          const userAns = s.answered ? `${letters[s.selected]}. ${q.o[s.selected]}` : 'Sin respuesta';
          const correctAns = `${letters[q.a]}. ${q.o[q.a]}`;
          bodyHtml = `
            <div class="review-item-q">${escHtml(q.q).replace(/\n/g,'<br>')}</div>
            <div class="review-answers">
              ${!s.correct && s.answered ? `<div class="ri-user">Tu respuesta: ${escHtml(userAns)}</div>` : ''}
              <div class="ri-correct">Respuesta correcta: ${escHtml(correctAns)}</div>
              <div class="ri-exp-toggle" onclick="toggleExplanation('${rec.id}-${i}')">▶ Ver explicación</div>
              <div id="ri-exp-${rec.id}-${i}" class="ri-exp-content">${escHtml(q.e || '').replace(/\n/g,'<br>')}</div>
            </div>
          `;
        }
        div.innerHTML = `
          <div class="review-item-hdr">
            <span class="ri-num">${i+1}.</span>
            <span>${sectionLabel}</span>
            <span>${s.correct ? '✓ CORRECTO' : (s.answered ? '✗ INCORRECTO' : '— SIN RESPUESTA')}</span>
          </div>
          ${bodyHtml}
        `;
        list.appendChild(div);
      });
    });
    box.appendChild(list);
  }

  const btn = document.createElement('button');
  btn.className = 'btn-restart';
  btn.textContent = '↺ VOLVER AL INICIO';
  btn.onclick = goHome;
  box.appendChild(btn);

  showScreen('results');
}

function toggleExplanation(id) {
  const content = document.getElementById('ri-exp-' + id);
  if (!content) return;
  content.classList.toggle('open');
}
