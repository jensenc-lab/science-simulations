// ============================================================
// Conservation of Matter — reaction-visuals.js
// Flask fizzing scene  (Baking Soda + Vinegar)
// Candle flame scene   (Burning a Candle / Methane combustion)
// ============================================================

const ReactionVisuals = (function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';

  // ---- Flask state (baking soda) ----
  let _bubblesG = null, _intervalId = null, _stopId = null;

  // ---- Candle state (burning candle) ----
  let _candleBodyEl = null, _waxEl = null, _wickEl = null, _flameOuter = null, _heatG = null;
  let _heatTimer = null, _meltRaf = null;

  // ---- Nail state (rusting iron) ----
  let _oDotsG = null, _rustClipRect = null, _nailLabel = null, _rustRaf = null, _rustDelayId = null;

  // =========================================================
  // FLASK SCENE  (Baking Soda + Vinegar)
  // =========================================================

  function buildSVG() {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 200 160');
    svg.setAttribute('width',   '200');
    svg.setAttribute('height',  '160');
    svg.style.display = 'block';

    // Clip path — confines bubbles to flask interior
    const defs = document.createElementNS(NS, 'defs');
    const clip = document.createElementNS(NS, 'clipPath');
    clip.setAttribute('id', 'rv-clip');
    const cp = document.createElementNS(NS, 'path');
    cp.setAttribute('d', 'M91,10 L91,50 L44,144 L156,144 L109,50 L109,10 Z');
    clip.appendChild(cp); defs.appendChild(clip); svg.appendChild(defs);

    // Liquid fill (light blue tint)
    const liq = document.createElementNS(NS, 'path');
    liq.setAttribute('d', 'M91,10 L91,50 L44,144 L156,144 L109,50 L109,10 Z');
    liq.setAttribute('fill', '#c8e6f5'); liq.setAttribute('opacity', '0.5');
    svg.appendChild(liq);

    // White powder at base
    const pow = document.createElementNS(NS, 'ellipse');
    pow.setAttribute('cx', '100'); pow.setAttribute('cy', '139');
    pow.setAttribute('rx', '52'); pow.setAttribute('ry', '7');
    pow.setAttribute('fill', '#f0f0e8');
    svg.appendChild(pow);

    // Flask outline
    const fl = document.createElementNS(NS, 'path');
    fl.setAttribute('d', 'M88,5 L88,50 L40,148 L160,148 L112,50 L112,5 Z');
    fl.setAttribute('fill', 'none');
    fl.setAttribute('stroke', '#1a5276'); fl.setAttribute('stroke-width', '2.5');
    fl.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(fl);

    // Neck rim
    const rim = document.createElementNS(NS, 'line');
    rim.setAttribute('x1', '88'); rim.setAttribute('y1', '5');
    rim.setAttribute('x2', '112'); rim.setAttribute('y2', '5');
    rim.setAttribute('stroke', '#1a5276'); rim.setAttribute('stroke-width', '2.5');
    rim.setAttribute('stroke-linecap', 'round');
    svg.appendChild(rim);

    // Small label below flask
    const lbl = document.createElementNS(NS, 'text');
    lbl.setAttribute('x', '100'); lbl.setAttribute('y', '156');
    lbl.setAttribute('text-anchor', 'middle'); lbl.setAttribute('font-size', '9');
    lbl.setAttribute('fill', '#888');
    lbl.setAttribute('font-family', 'Segoe UI,system-ui,sans-serif');
    lbl.textContent = 'NaHCO\u2083 + CH\u2083COOH';
    svg.appendChild(lbl);

    // Bubble group clipped to flask interior
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('clip-path', 'url(#rv-clip)');
    svg.appendChild(g);
    _bubblesG = g;

    return svg;
  }

  function spawnBubble() {
    if (!_bubblesG) return;
    const x   = 58 + Math.random() * 84;
    const r   = 3  + Math.random() * 4;
    const dur = 800 + Math.random() * 700;

    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('r', r);
    c.setAttribute('fill',         'rgba(255,255,255,0.9)');
    c.setAttribute('stroke',       'rgba(26,82,118,0.25)');
    c.setAttribute('stroke-width', '0.5');
    _bubblesG.appendChild(c);

    const t0 = Date.now();
    (function step() {
      const t  = Math.min(1, (Date.now() - t0) / dur);
      c.setAttribute('cx', x);
      c.setAttribute('cy', 140 - t * 92);
      const op = t < 0.12 ? t / 0.12 : t > 0.72 ? (1 - t) / 0.28 : 1;
      c.setAttribute('opacity', (Math.max(0, op) * 0.85).toFixed(2));
      if (t < 1) requestAnimationFrame(step);
      else       c.remove();
    })();
  }

  function react() {
    if (!_bubblesG) return;
    stop();
    spawnBubble();
    _intervalId = setInterval(spawnBubble, 250);
    _stopId     = setTimeout(stop, 3000);
  }

  function stop() {
    clearInterval(_intervalId); _intervalId = null;
    clearTimeout(_stopId);      _stopId     = null;
    if (_bubblesG) while (_bubblesG.firstChild) _bubblesG.removeChild(_bubblesG.firstChild);
  }

  // =========================================================
  // CANDLE SCENE  (Burning a Candle / Methane combustion)
  // =========================================================

  function buildCandleSVG() {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 200 160');
    svg.setAttribute('width', '200'); svg.setAttribute('height', '160');
    svg.style.display = 'block';

    // Shorthand element builder
    function el(tag, attrs) {
      const e = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
      return e;
    }

    // Holder plate
    svg.appendChild(el('rect', { x:'72', y:'143', width:'56', height:'8', rx:'3', fill:'#bbb' }));

    // Candle body
    const body = el('rect', { x:'83', y:'68', width:'34', height:'75', rx:'2',
      fill:'#fffacd', stroke:'#e8d8a0', 'stroke-width':'1' });
    svg.appendChild(body); _candleBodyEl = body;

    // Wax pool on top
    const wax = el('ellipse', { cx:'100', cy:'68', rx:'18', ry:'5', fill:'#fff8dc' });
    svg.appendChild(wax); _waxEl = wax;

    // Wick
    const wick = el('line', { x1:'100', y1:'68', x2:'100', y2:'56',
      stroke:'#3a2a1a', 'stroke-width':'1.5', 'stroke-linecap':'round' });
    svg.appendChild(wick); _wickEl = wick;

    // Heat wave group (populated when reacting)
    const hg = document.createElementNS(NS, 'g');
    svg.appendChild(hg); _heatG = hg;

    // Flame outer group — pivot at wick tip (100, 56)
    const fg = document.createElementNS(NS, 'g');
    fg.setAttribute('transform', 'translate(100,56)');
    fg.style.opacity    = '0';
    fg.style.transition = 'opacity 0.45s ease';

    // Warm glow halo (separate pulse animation)
    const glow = el('circle', { cx:'0', cy:'-18', r:'24', fill:'rgba(255,150,0,0.25)' });
    glow.id = 'rv-glow'; fg.appendChild(glow);

    // Flicker group — CSS animation target, scaled around wick base (origin 0,0)
    const ff = document.createElementNS(NS, 'g'); ff.id = 'rv-flame-flicker';
    ff.appendChild(el('path', { d:'M0,-36 C-18,-26 -18,-6 0,0 C18,-6 18,-26 0,-36 Z', fill:'#ff8800' }));
    ff.appendChild(el('path', { d:'M0,-28 C-9,-20 -9,-6 0,-2 C9,-6 9,-20 0,-28 Z',   fill:'#ffee00' }));
    ff.appendChild(el('circle', { cx:'0', cy:'-28', r:'4', fill:'rgba(255,255,215,0.85)' }));
    fg.appendChild(ff);

    svg.appendChild(fg); _flameOuter = fg;

    // Label
    const lbl = el('text', { x:'100', y:'158', 'text-anchor':'middle', 'font-size':'9',
      fill:'#888', 'font-family':'Segoe UI,system-ui,sans-serif' });
    lbl.textContent = 'CH\u2084 + 2O\u2082'; svg.appendChild(lbl);

    return svg;
  }

  function spawnHeatWave() {
    if (!_heatG) return;
    const dx  = (Math.random() - 0.5) * 20;
    const dur = 1100 + Math.random() * 600;
    const p   = document.createElementNS(NS, 'path');
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', 'rgba(180,180,180,0.5)');
    p.setAttribute('stroke-width', '1.5');
    p.setAttribute('stroke-linecap', 'round');
    _heatG.appendChild(p);

    const t0 = Date.now(), x0 = 100 + dx;
    (function step() {
      const t  = Math.min(1, (Date.now() - t0) / dur);
      const y0 = 18 - t * 34;
      p.setAttribute('d', `M${x0},${y0} C${x0+7},${y0-8} ${x0-7},${y0-16} ${x0},${y0-24}`);
      const op = t < 0.15 ? t / 0.15 : t > 0.6 ? (1 - t) / 0.4 : 1;
      p.setAttribute('opacity', (Math.max(0, op) * 0.4).toFixed(2));
      if (t < 1) requestAnimationFrame(step);
      else       p.remove();
    })();
  }

  function candleReact() {
    if (!_flameOuter) return;
    candleStop();

    // Fade flame in, start CSS flicker + glow pulse
    _flameOuter.style.opacity = '1';
    const ff = document.getElementById('rv-flame-flicker');
    if (ff) ff.classList.add('rv-flame-lit');
    const gl = document.getElementById('rv-glow');
    if (gl) gl.classList.add('rv-glow-pulse');

    // Heat waves for ~4.5 s (atom animation duration), flame stays lit after
    _heatTimer = setInterval(spawnHeatWave, 500);
    setTimeout(() => { clearInterval(_heatTimer); _heatTimer = null; }, 4500);

    // Candle body melts ~10 px from the top over 5 s; wick and flame follow
    const y0   = +_candleBodyEl.getAttribute('y'),  h0   = +_candleBodyEl.getAttribute('height');
    const cy0  = +_waxEl.getAttribute('cy');
    const wy1  = +_wickEl.getAttribute('y1'),       wy2  = +_wickEl.getAttribute('y2');
    const t0   = Date.now();
    (function meltStep() {
      const shift = Math.min(1, (Date.now() - t0) / 5000) * 10;
      _candleBodyEl.setAttribute('y',      y0  + shift);
      _candleBodyEl.setAttribute('height', h0  - shift);
      _waxEl.setAttribute('cy',  cy0 + shift);
      _wickEl.setAttribute('y1', wy1 + shift);
      _wickEl.setAttribute('y2', wy2 + shift);
      _flameOuter.setAttribute('transform', `translate(100,${wy2 + shift})`);
      if (shift < 10) _meltRaf = requestAnimationFrame(meltStep);
      else            _meltRaf = null;
    })();
  }

  function candleStop() {
    clearInterval(_heatTimer); _heatTimer = null;
    if (_meltRaf) { cancelAnimationFrame(_meltRaf); _meltRaf = null; }
    if (_flameOuter) {
      _flameOuter.style.opacity = '0';
      const ff = document.getElementById('rv-flame-flicker');
      if (ff) ff.classList.remove('rv-flame-lit');
      const gl = document.getElementById('rv-glow');
      if (gl) gl.classList.remove('rv-glow-pulse');
    }
    if (_heatG) while (_heatG.firstChild) _heatG.removeChild(_heatG.firstChild);
    // Reset candle, wick, and flame to original unlit positions
    if (_candleBodyEl) { _candleBodyEl.setAttribute('y', '68'); _candleBodyEl.setAttribute('height', '75'); }
    if (_waxEl)        { _waxEl.setAttribute('cy', '68'); }
    if (_wickEl)       { _wickEl.setAttribute('y1', '68'); _wickEl.setAttribute('y2', '56'); }
    if (_flameOuter)   { _flameOuter.setAttribute('transform', 'translate(100,56)'); }
  }

  // =========================================================
  // NAIL SCENE  (Rusting Iron: 4Fe + 3O₂ → 2Fe₂O₃)
  // =========================================================

  function buildNailSVG() {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 200 160');
    svg.setAttribute('width', '200'); svg.setAttribute('height', '160');
    svg.style.display = 'block';

    function el(tag, attrs) {
      const e = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
      return e;
    }

    // Defs: vertical metallic gradient + rust reveal clip path
    const defs = document.createElementNS(NS, 'defs');
    const grad = el('linearGradient', { id:'rv-nail-grad', x1:'0', y1:'0', x2:'0', y2:'1' });
    grad.appendChild(el('stop', { offset:'0',    'stop-color':'#d8d8d8' }));
    grad.appendChild(el('stop', { offset:'0.45', 'stop-color':'#b0b0b0' }));
    grad.appendChild(el('stop', { offset:'1',    'stop-color':'#808080' }));
    defs.appendChild(grad);
    const clip = document.createElementNS(NS, 'clipPath'); clip.setAttribute('id','rv-rust-clip');
    const cr = el('rect', { x:'22', y:'66', width:'0', height:'28' });
    clip.appendChild(cr); defs.appendChild(clip); svg.appendChild(defs);
    _rustClipRect = cr;

    // Silver nail: square head + shaft + pointed tip
    svg.appendChild(el('rect',    { x:'22', y:'70', width:'18', height:'20', rx:'2', fill:'url(#rv-nail-grad)' }));
    svg.appendChild(el('rect',    { x:'40', y:'76', width:'122', height:'8',          fill:'url(#rv-nail-grad)' }));
    svg.appendChild(el('polygon', { points:'162,76 176,80 162,84',                    fill:'url(#rv-nail-grad)' }));
    // Shine highlight on shaft
    svg.appendChild(el('rect', { x:'44', y:'77', width:'114', height:'2', fill:'rgba(255,255,255,0.35)', rx:'1' }));

    // O₂ dots floating around the nail (representing oxygen in air)
    const og = document.createElementNS(NS, 'g');
    [[62,43],[108,38],[150,49],[55,120],[108,124],[152,114],[24,80]].forEach(([cx, cy]) => {
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('transform', `translate(${cx},${cy})`);
      g.appendChild(el('circle', { r:'10', fill:'rgba(190,225,255,0.65)',
        stroke:'rgba(80,140,220,0.4)', 'stroke-width':'1' }));
      const t = document.createElementNS(NS, 'text');
      t.setAttribute('text-anchor','middle'); t.setAttribute('dy','3');
      t.setAttribute('font-size','7.5'); t.setAttribute('fill','#3a6fa8');
      t.setAttribute('font-family','Segoe UI,system-ui,sans-serif');
      t.setAttribute('font-weight','bold'); t.textContent = 'O\u2082';
      g.appendChild(t); og.appendChild(g);
    });
    _oDotsG = og; svg.appendChild(og);

    // Rust overlay — same nail shapes in rust color, revealed left→right by clip
    const rg = document.createElementNS(NS, 'g'); rg.setAttribute('clip-path','url(#rv-rust-clip)');
    rg.appendChild(el('rect',    { x:'22', y:'70', width:'18', height:'20', rx:'2', fill:'#b87333' }));
    rg.appendChild(el('rect',    { x:'40', y:'76', width:'122', height:'8',          fill:'#b87333' }));
    rg.appendChild(el('polygon', { points:'162,76 176,80 162,84',                    fill:'#b87333' }));
    // Dark texture spots (pitting and flaking)
    [[34,75,4,3],[52,81,3,2],[70,78,5,3],[88,82,4,2],[106,77,5,3],[124,82,3,3],
     [142,78,4,2],[158,80,3,3],[43,78,2,2],[78,80,3,2],[114,79,2,3],[156,76,3,2],
     [28,74,3,2],[61,82,2,2],[98,76,3,2],[130,81,2,3]
    ].forEach(([cx,cy,rx,ry]) =>
      rg.appendChild(el('ellipse', { cx, cy, rx, ry, fill:'#6b3010', opacity:'0.7' }))
    );
    svg.appendChild(rg);

    // Post-reaction label (hidden; fades in after rust complete)
    const lblG = document.createElementNS(NS, 'g');
    lblG.style.opacity = '0'; lblG.style.transition = 'opacity 0.8s ease';
    function addLbl(txt, y) {
      const t = el('text', { x:'100', y, 'text-anchor':'middle', 'font-size':'8.5',
        fill:'#7a3a00', 'font-family':'Segoe UI,system-ui,sans-serif' });
      t.textContent = txt; lblG.appendChild(t);
    }
    addLbl('The rusty nail has MORE mass!',    '144');
    addLbl('Oxygen atoms bonded to iron.',     '155');
    svg.appendChild(lblG); _nailLabel = lblG;

    return svg;
  }

  function nailReact() {
    nailStop();
    // O₂ dots fade out — absorbed by nail surface
    if (_oDotsG) { _oDotsG.style.transition = 'opacity 0.9s ease'; _oDotsG.style.opacity = '0'; }

    // Rust spreads left → right across nail over 2.5 s, after 0.8 s delay
    const TOTAL_W = 154, DUR = 2500;
    _rustDelayId = setTimeout(() => {
      _rustDelayId = null;
      const t0 = Date.now();
      (function rustStep() {
        const t = Math.min(1, (Date.now() - t0) / DUR);
        _rustClipRect.setAttribute('width', (t * TOTAL_W).toFixed(1));
        if (t < 1) { _rustRaf = requestAnimationFrame(rustStep); }
        else { _rustRaf = null; if (_nailLabel) _nailLabel.style.opacity = '1'; }
      })();
    }, 800);
  }

  function nailStop() {
    if (_rustDelayId) { clearTimeout(_rustDelayId); _rustDelayId = null; }
    if (_rustRaf)     { cancelAnimationFrame(_rustRaf); _rustRaf = null; }
    if (_rustClipRect) _rustClipRect.setAttribute('width', '0');
    if (_nailLabel)    _nailLabel.style.opacity = '0';
    if (_oDotsG) { _oDotsG.style.transition = 'none'; _oDotsG.style.opacity = '1'; }
  }

  // =========================================================
  // SHARED: show / init
  // =========================================================

  function show(key) {
    const flask  = document.getElementById('rv-wrap');
    const candle = document.getElementById('rv-candle-wrap');
    const nail   = document.getElementById('rv-nail-wrap');
    if (flask)  flask.style.display  = key === 'bakingSodaVinegar' ? '' : 'none';
    if (candle) candle.style.display = key === 'burningCandle'     ? '' : 'none';
    if (nail)   nail.style.display   = key === 'rustingIron'       ? '' : 'none';
    if (key !== 'bakingSodaVinegar') stop();
    if (key !== 'burningCandle')     candleStop();
    if (key !== 'rustingIron')       nailStop();
  }

  (function init() {
    const anchor = document.getElementById('reactantsDisplay');

    // Flask wrap
    const wrap = document.createElement('div');
    wrap.id = 'rv-wrap'; wrap.style.cssText = 'margin-bottom:8px; display:none;';
    wrap.appendChild(buildSVG());
    anchor.parentNode.insertBefore(wrap, anchor);

    // Candle wrap
    const cwrap = document.createElement('div');
    cwrap.id = 'rv-candle-wrap'; cwrap.style.cssText = 'margin-bottom:8px; display:none;';
    cwrap.appendChild(buildCandleSVG());
    anchor.parentNode.insertBefore(cwrap, anchor);

    // Nail wrap
    const nwrap = document.createElement('div');
    nwrap.id = 'rv-nail-wrap'; nwrap.style.cssText = 'margin-bottom:8px; display:none;';
    nwrap.appendChild(buildNailSVG());
    anchor.parentNode.insertBefore(nwrap, anchor);

    // CSS keyframes for flame flicker + glow pulse
    const sty = document.createElement('style');
    sty.textContent =
      '@keyframes rv-flicker{0%,100%{transform:scaleX(1) scaleY(1)}' +
      '33%{transform:scaleX(.88) scaleY(1.1)}66%{transform:scaleX(1.05) scaleY(.95)}}' +
      '.rv-flame-lit{transform-box:fill-box;transform-origin:center bottom;' +
      'animation:rv-flicker .38s ease-in-out infinite}' +
      '@keyframes rv-glow-pulse{from{opacity:.2}to{opacity:.45}}' +
      '.rv-glow-pulse{animation:rv-glow-pulse .6s ease-in-out infinite alternate}';
    document.head.appendChild(sty);

    // React button — fire the matching scene
    document.getElementById('reactBtn').addEventListener('click', () => {
      const key = document.querySelector('.reaction-card.active').dataset.reaction;
      if (key === 'bakingSodaVinegar') react();
      if (key === 'burningCandle')     candleReact();
      if (key === 'rustingIron')       nailReact();
    });

    // Reset button — restore scene when molecules reset
    document.getElementById('resetBtn').addEventListener('click', () => {
      const key = document.querySelector('.reaction-card.active').dataset.reaction;
      if (key === 'burningCandle') candleStop();
      if (key === 'rustingIron')   nailStop();
    });

    // Reaction card clicks — show matching scene
    document.querySelectorAll('.reaction-card').forEach(card =>
      card.addEventListener('click', () => show(card.dataset.reaction))
    );

    show('bakingSodaVinegar');   // initial scene
  })();

  return { show, react, stop };

})();
