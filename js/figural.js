(function () {
  'use strict';

  var DEFAULT_STROKE = '#c8e6c8';
  var ACCENT_STROKE = '#ffb74d';
  var STROKE_WIDTH = 2.5;

  var SHAPES = ['circle', 'square', 'triangle', 'arrow', 'star', 'pentagon', 'hexagon'];
  var FILLS = ['none', 'solid', 'hatch'];
  var SCALES = [0.6, 0.8, 1.0];
  var DOT_POS = ['top', 'bottom', 'left', 'right'];
  var LINE_ORIENT = [0, 45, 90, 135];

  function mulberry32(seed) {
    return function () {
      var t = (seed += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
  function pickDiff(rng, arr, not) {
    var filtered = arr.filter(function (x) { return x !== not; });
    return filtered[Math.floor(rng() * filtered.length)];
  }

  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  // --- Figure model ---
  // A figure = { shape, fill, stroke, scale, rotation, reflectX, reflectY, internal: null | {kind:'dot', pos} | {kind:'line', orient} }
  function newFigure(rng, composite) {
    return {
      shape: pick(rng, SHAPES),
      fill: pick(rng, FILLS),
      stroke: DEFAULT_STROKE,
      scale: pick(rng, SCALES),
      rotation: 0,
      reflectX: false,
      reflectY: false,
      internal: composite ? (rng() < 0.5
        ? { kind: 'dot', pos: pick(rng, DOT_POS) }
        : { kind: 'line', orient: pick(rng, LINE_ORIENT) }) : null,
    };
  }

  // --- Shape path builders (centered at 50,50, nominal radius 30) ---
  function shapePath(shape) {
    var cx = 50, cy = 50, r = 30;
    switch (shape) {
      case 'circle':
        return '<circle cx="50" cy="50" r="30" PLACE/>';
      case 'square':
        return '<rect x="20" y="20" width="60" height="60" PLACE/>';
      case 'triangle':
        return '<polygon points="50,20 80,72 20,72" PLACE/>';
      case 'arrow':
        return '<polygon points="20,40 60,40 60,25 85,50 60,75 60,60 20,60" PLACE/>';
      case 'star':
        return starPoints(cx, cy, r);
      case 'pentagon':
        return regularPoly(cx, cy, r, 5, -90);
      case 'hexagon':
        return regularPoly(cx, cy, r, 6, 0);
    }
    return '';
  }

  function regularPoly(cx, cy, r, n, startDeg) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var a = (startDeg + i * 360 / n) * Math.PI / 180;
      pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1));
    }
    return '<polygon points="' + pts.join(' ') + '" PLACE/>';
  }

  function starPoints(cx, cy, r) {
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var rad = i % 2 === 0 ? r : r * 0.45;
      var a = (-90 + i * 36) * Math.PI / 180;
      pts.push((cx + rad * Math.cos(a)).toFixed(1) + ',' + (cy + rad * Math.sin(a)).toFixed(1));
    }
    return '<polygon points="' + pts.join(' ') + '" PLACE/>';
  }

  // --- SVG rendering ---
  function renderFigure(fig) {
    var patternId = 'h' + Math.abs(hashFig(fig));
    var defs = '';
    var fillAttr;
    if (fig.fill === 'solid') fillAttr = fig.stroke;
    else if (fig.fill === 'hatch') {
      fillAttr = 'url(#' + patternId + ')';
      defs = '<defs><pattern id="' + patternId + '" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">' +
        '<line x1="0" y1="0" x2="0" y2="6" stroke="' + fig.stroke + '" stroke-width="1.5"/></pattern></defs>';
    } else fillAttr = 'none';

    var placeAttrs = 'fill="' + fillAttr + '" stroke="' + fig.stroke + '" stroke-width="' + STROKE_WIDTH + '" stroke-linejoin="round" stroke-linecap="round"';
    var body = shapePath(fig.shape).replace('PLACE', placeAttrs);

    if (fig.internal) {
      body += renderInternal(fig.internal, fig.stroke);
    }

    var transforms = [];
    transforms.push('translate(50 50)');
    if (fig.reflectX) transforms.push('scale(-1 1)');
    if (fig.reflectY) transforms.push('scale(1 -1)');
    if (fig.rotation) transforms.push('rotate(' + fig.rotation + ')');
    if (fig.scale !== 1.0) transforms.push('scale(' + fig.scale + ')');
    transforms.push('translate(-50 -50)');

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
      defs +
      '<g transform="' + transforms.join(' ') + '">' + body + '</g>' +
      '</svg>';
  }

  function renderInternal(internal, stroke) {
    if (internal.kind === 'dot') {
      var map = { top: [50, 28], bottom: [50, 72], left: [28, 50], right: [72, 50] };
      var p = map[internal.pos] || [50, 50];
      return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.5" fill="' + stroke + '"/>';
    }
    // line through center at orientation
    var rad = (internal.orient || 0) * Math.PI / 180;
    var len = 18;
    var dx = Math.cos(rad) * len, dy = Math.sin(rad) * len;
    return '<line x1="' + (50 - dx).toFixed(1) + '" y1="' + (50 - dy).toFixed(1) +
      '" x2="' + (50 + dx).toFixed(1) + '" y2="' + (50 + dy).toFixed(1) +
      '" stroke="' + stroke + '" stroke-width="' + STROKE_WIDTH + '" stroke-linecap="round"/>';
  }

  function hashFig(fig) {
    var s = JSON.stringify(fig);
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return h;
  }

  // --- Transformations ---
  function applyT(fig, t) {
    var f = clone(fig);
    switch (t.type) {
      case 'rotate':
        f.rotation = (f.rotation + t.deg + 360) % 360;
        break;
      case 'reflectH':
        f.reflectX = !f.reflectX;
        break;
      case 'reflectV':
        f.reflectY = !f.reflectY;
        break;
      case 'scaleUp':
        f.scale = f.scale < 1.0 ? 1.0 : f.scale;
        break;
      case 'scaleDown':
        f.scale = f.scale >= 1.0 ? 0.6 : f.scale;
        break;
      case 'fillChange': {
        var order = ['none', 'solid', 'hatch'];
        f.fill = order[(order.indexOf(f.fill) + 1) % 3];
        break;
      }
      case 'strokeColor':
        f.stroke = f.stroke === DEFAULT_STROKE ? ACCENT_STROKE : DEFAULT_STROKE;
        break;
      case 'addInternal':
        if (!f.internal) f.internal = t.payload;
        break;
      case 'removeInternal':
        f.internal = null;
        break;
      case 'moveInternal':
        if (f.internal) {
          if (f.internal.kind === 'dot' && t.pos !== undefined) f.internal.pos = t.pos;
          else if (f.internal.kind === 'line' && t.orient !== undefined) f.internal.orient = t.orient;
        }
        break;
    }
    return f;
  }

  function applyAll(fig, ts) { return ts.reduce(applyT, fig); }

  // --- Transformation list generation per difficulty ---
  function pickTransforms(rng, difficulty, baseFig) {
    var count;
    if (difficulty === 1) count = 1;
    else if (difficulty === 2) count = 2;
    else if (difficulty === 3) count = 3;
    else if (difficulty === 4) count = 3;
    else count = 3 + (rng() < 0.5 ? 1 : 0);

    var pool = ['rotate', 'reflectH', 'reflectV', 'fillChange', 'strokeColor'];
    if (baseFig.scale < 1.0) pool.push('scaleUp');
    if (baseFig.scale >= 1.0) pool.push('scaleDown');
    if (baseFig.internal) {
      pool.push('removeInternal', 'moveInternal');
    } else if (difficulty >= 4) {
      pool.push('addInternal');
    }

    // D5 nudge: ensure at least one rotate-vs-reflect pair is in play
    var ts = [];
    var used = {};
    while (ts.length < count && pool.length > 0) {
      var type = pick(rng, pool);
      if (used[type]) continue;
      used[type] = true;
      ts.push(makeT(rng, type, baseFig));
    }

    if (difficulty === 5) {
      var hasRot = ts.some(function (t) { return t.type === 'rotate'; });
      var hasRef = ts.some(function (t) { return t.type === 'reflectH' || t.type === 'reflectV'; });
      if (!hasRot) ts[0] = makeT(rng, 'rotate', baseFig);
      if (!hasRef) ts[ts.length - 1] = makeT(rng, 'reflectH', baseFig);
    }

    return ts;
  }

  function makeT(rng, type, baseFig) {
    switch (type) {
      case 'rotate': return { type: 'rotate', deg: pick(rng, [45, 90, 180, 270]) };
      case 'reflectH': return { type: 'reflectH' };
      case 'reflectV': return { type: 'reflectV' };
      case 'scaleUp': return { type: 'scaleUp' };
      case 'scaleDown': return { type: 'scaleDown' };
      case 'fillChange': return { type: 'fillChange' };
      case 'strokeColor': return { type: 'strokeColor' };
      case 'removeInternal': return { type: 'removeInternal' };
      case 'moveInternal':
        if (baseFig.internal && baseFig.internal.kind === 'dot') {
          return { type: 'moveInternal', pos: pickDiff(rng, DOT_POS, baseFig.internal.pos) };
        }
        return { type: 'moveInternal', orient: pickDiff(rng, LINE_ORIENT, baseFig.internal ? baseFig.internal.orient : 0) };
      case 'addInternal':
        return {
          type: 'addInternal',
          payload: rng() < 0.5
            ? { kind: 'dot', pos: pick(rng, DOT_POS) }
            : { kind: 'line', orient: pick(rng, LINE_ORIENT) },
        };
    }
    return { type: 'rotate', deg: 90 };
  }

  // --- Distractor generation: near-misses applied to f2 ---
  function mutateTransforms(rng, ts, strategy) {
    var out = clone(ts);
    if (out.length === 0) return out;
    switch (strategy) {
      case 'omit':
        out.splice(Math.floor(rng() * out.length), 1);
        return out;
      case 'reverseRotate':
        for (var i = 0; i < out.length; i++) {
          if (out[i].type === 'rotate') { out[i].deg = (360 - out[i].deg) % 360; return out; }
        }
        return null;
      case 'swapReflectAxis':
        for (var j = 0; j < out.length; j++) {
          if (out[j].type === 'reflectH') { out[j].type = 'reflectV'; return out; }
          if (out[j].type === 'reflectV') { out[j].type = 'reflectH'; return out; }
        }
        return null;
      case 'skipFill':
        return out.filter(function (t) { return t.type !== 'fillChange'; });
      case 'skipScale':
        return out.filter(function (t) { return t.type !== 'scaleUp' && t.type !== 'scaleDown'; });
      case 'extraRotate':
        out.push({ type: 'rotate', deg: pick(rng, [90, 180]) });
        return out;
      case 'swapRotateReflect':
        for (var k = 0; k < out.length; k++) {
          if (out[k].type === 'rotate') { out[k] = { type: 'reflectH' }; return out; }
        }
        return null;
    }
    return null;
  }

  function buildOptions(rng, f2, ts, correctSvg) {
    var strategies = ['omit', 'reverseRotate', 'swapReflectAxis', 'skipFill', 'skipScale', 'extraRotate', 'swapRotateReflect'];
    var seen = {};
    seen[correctSvg] = true;
    var distractors = [];
    for (var i = 0; i < strategies.length && distractors.length < 3; i++) {
      var mts = mutateTransforms(rng, ts, strategies[i]);
      if (!mts) continue;
      // Must differ from original transform list
      if (JSON.stringify(mts) === JSON.stringify(ts)) continue;
      var svg = renderFigure(applyAll(f2, mts));
      if (seen[svg]) continue;
      seen[svg] = true;
      distractors.push(svg);
    }
    // Fallback: tweak the figure directly
    var tweaks = [
      function (f) { f.rotation = (f.rotation + 90) % 360; return f; },
      function (f) { f.reflectX = !f.reflectX; return f; },
      function (f) { f.reflectY = !f.reflectY; return f; },
      function (f) { var o = ['none', 'solid', 'hatch']; f.fill = o[(o.indexOf(f.fill) + 1) % 3]; return f; },
      function (f) { f.scale = f.scale >= 1.0 ? 0.6 : 1.0; return f; },
      function (f) { f.stroke = f.stroke === DEFAULT_STROKE ? ACCENT_STROKE : DEFAULT_STROKE; return f; },
    ];
    var correctFig = applyAll(f2, ts);
    for (var ti = 0; ti < tweaks.length && distractors.length < 3; ti++) {
      var mut = tweaks[ti](clone(correctFig));
      var s = renderFigure(mut);
      if (!seen[s]) { seen[s] = true; distractors.push(s); }
    }
    return distractors.length >= 3 ? distractors.slice(0, 3) : null;
  }

  function differentShape(rng, notShape) {
    var choices = SHAPES.filter(function (s) { return s !== notShape; });
    return choices[Math.floor(rng() * choices.length)];
  }

  function generate(seed, difficulty) {
    difficulty = Math.max(1, Math.min(5, difficulty | 0));
    var rng = mulberry32(seed >>> 0);
    var composite = difficulty >= 4;

    var ts, f4, f2, f3Svg, f4Svg, f2Svg, options, correctSvg, answerIndex;

    for (var attempt = 0; attempt < 20; attempt++) {
      f4 = newFigure(rng, composite);
      ts = pickTransforms(rng, difficulty, f4);
      if (ts.length === 0) continue;

      var f3 = applyAll(f4, ts);
      if (JSON.stringify(f3) === JSON.stringify(f4)) continue;

      f2 = newFigure(rng, composite);
      f2.shape = differentShape(rng, f4.shape);
      // Ensure applying ts to f2 is well-defined (addInternal only if f2 lacks one, etc.)
      // Pre-adjust: if ts has removeInternal/moveInternal, f2 needs internal
      var needsInternal = ts.some(function (t) { return t.type === 'removeInternal' || t.type === 'moveInternal'; });
      var needsNoInternal = ts.some(function (t) { return t.type === 'addInternal'; });
      if (needsInternal && !f2.internal) {
        f2.internal = { kind: 'dot', pos: pick(rng, DOT_POS) };
      }
      if (needsNoInternal && f2.internal) f2.internal = null;

      var f2Transformed = applyAll(f2, ts);
      if (JSON.stringify(f2Transformed) === JSON.stringify(f2)) continue;

      correctSvg = renderFigure(f2Transformed);
      var distractors = buildOptions(rng, f2, ts, correctSvg);
      if (!distractors) continue;

      f4Svg = renderFigure(f4);
      f3Svg = renderFigure(f3);
      f2Svg = renderFigure(f2);
      answerIndex = Math.floor(rng() * 4);
      options = [];
      var di = 0;
      for (var oi = 0; oi < 4; oi++) {
        if (oi === answerIndex) options.push(correctSvg);
        else options.push(distractors[di++]);
      }
      // Final uniqueness guard
      var uniq = {};
      options.forEach(function (s) { uniq[s] = true; });
      if (Object.keys(uniq).length !== 4) continue;

      return {
        seed: seed,
        difficulty: difficulty,
        answerIndex: answerIndex,
        svgs: { f4: f4Svg, f3: f3Svg, f2: f2Svg, options: options },
        transformations: ts,
      };
    }

    // Fallback: deterministic trivial question (should not happen)
    f4 = { shape: 'square', fill: 'none', stroke: DEFAULT_STROKE, scale: 1.0, rotation: 0, reflectX: false, reflectY: false, internal: null };
    f2 = { shape: 'circle', fill: 'none', stroke: DEFAULT_STROKE, scale: 1.0, rotation: 0, reflectX: false, reflectY: false, internal: null };
    ts = [{ type: 'rotate', deg: 90 }];
    var fb3 = applyAll(f4, ts), fb2t = applyAll(f2, ts);
    return {
      seed: seed, difficulty: difficulty, answerIndex: 0,
      svgs: {
        f4: renderFigure(f4), f3: renderFigure(fb3), f2: renderFigure(f2),
        options: [
          renderFigure(fb2t),
          renderFigure(applyAll(f2, [{ type: 'rotate', deg: 180 }])),
          renderFigure(applyAll(f2, [{ type: 'rotate', deg: 270 }])),
          renderFigure(applyAll(f2, [{ type: 'reflectH' }])),
        ],
      },
      transformations: ts,
    };
  }

  function nextDifficulty(current, wasCorrect) {
    var n = (current | 0) + (wasCorrect ? 1 : -1);
    return Math.max(1, Math.min(5, n));
  }

  var WEIGHTS = { 1: 0.6, 2: 0.8, 3: 1.0, 4: 1.3, 5: 1.6 };
  function weight(difficulty) { return WEIGHTS[difficulty | 0] || 1.0; }

  window.FIGURAL = {
    generate: generate,
    nextDifficulty: nextDifficulty,
    weight: weight,
  };

  (function selfTest() {
    try {
      var seeds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
      for (var i = 0; i < seeds.length; i++) {
        var d = (i % 5) + 1;
        var q = generate(seeds[i], d);
        if (!(q.answerIndex >= 0 && q.answerIndex <= 3)) {
          console.error('FIGURAL selfTest: answerIndex out of range', q); return;
        }
        var set = {};
        q.svgs.options.forEach(function (s) { set[s] = true; });
        if (Object.keys(set).length !== 4) {
          console.error('FIGURAL selfTest: duplicate option SVGs for seed', seeds[i], 'd', d); return;
        }
        if (!q.transformations || q.transformations.length === 0) {
          console.error('FIGURAL selfTest: empty transformations', q); return;
        }
        var q2 = generate(seeds[i], d);
        if (JSON.stringify(q) !== JSON.stringify(q2)) {
          console.error('FIGURAL selfTest: non-deterministic for seed', seeds[i], 'd', d); return;
        }
      }
      if (nextDifficulty(5, true) !== 5 || nextDifficulty(1, false) !== 1) {
        console.error('FIGURAL selfTest: nextDifficulty bounds wrong'); return;
      }
      if (weight(3) !== 1.0) { console.error('FIGURAL selfTest: weight(3) != 1.0'); return; }
      // console.log('FIGURAL selfTest OK');
    } catch (e) {
      console.error('FIGURAL selfTest threw:', e);
    }
  })();
})();
