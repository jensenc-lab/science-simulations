# Build script: assembles earths-features/index.html by injecting cleaned world.svg paths.

$base = "c:\Users\JensenC\Desktop\Science Simulations\earths-features"

# ── 1. Read world.svg and extract all <path> lines ──────────────────────────
$svgLines = Get-Content "$base\world.svg"

$cleanPaths = [System.Collections.Generic.List[string]]::new()
$carry = ""   # accumulate multi-line path tags (shouldn't happen but just in case)

foreach ($line in $svgLines) {
    $t = $line.Trim()

    # Skip </path> closing tags and blank lines
    if ($t -eq "</path>" -or $t -eq "") { $carry = ""; continue }

    # Accumulate lines that start a path but might wrap (rare)
    if ($t.StartsWith("<path")) { $carry = $t }
    elseif ($carry -ne "") { $carry += " " + $t }

    # Once we have a complete opening tag (ends with >), process it
    if ($carry -ne "" -and ($carry.EndsWith(">") -or $carry.EndsWith("/>"))) {
        $p = $carry
        # Strip name attribute
        $p = [regex]::Replace($p, ' name="[^"]*"', '')
        # Strip class attribute (we'll set our own)
        $p = [regex]::Replace($p, ' class="[^"]*"', '')
        # Remove trailing > or /> to rebuild cleanly
        $p = $p.TrimEnd()
        if ($p.EndsWith("/>")) { $p = $p.Substring(0, $p.Length - 2).TrimEnd() }
        elseif ($p.EndsWith(">"))  { $p = $p.Substring(0, $p.Length - 1).TrimEnd() }
        # Append class and self-close
        $p = $p + ' class="land"/>'
        $cleanPaths.Add("    $p")
        $carry = ""
    }
}

Write-Host "Extracted $($cleanPaths.Count) land paths."

$pathBlock = $cleanPaths -join "`n"

# ── 2. Build complete index.html ────────────────────────────────────────────

$before = @'
<!-- SEEd 5.1.1: Earth's Features Map Lab — Complete -->
<!-- Chunk 9/9: Polish, Accessibility, Mobile, Launch -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Earth's Features Map Lab — Utah SEEd 5.1.1</title>
  <style>
    /* ── Reset & Base ─────────────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #f0f2f5;
      color: #1a2b3c;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      font-size: 16px;
      line-height: 1.55;
    }
    .page-wrap {
      max-width: 1100px;
      margin: 0 auto;
      width: 100%;
      padding: 0 16px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    /* ── Header ───────────────────────────────────────────────────── */
    .header {
      background: linear-gradient(135deg, #1a3a5c, #0d2240);
      border-bottom: 3px solid #29b6f6;
      padding: 12px 20px;
      color: #fff;
    }
    .header-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .sim-title { font-size: clamp(1rem, 2.6vw, 1.45rem); font-weight: 700; flex: 1; min-width: 200px; }
    .header-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .badge-group { position: relative; }
    .std-badge {
      background: rgba(41,182,246,0.22); color: #b3e5fc;
      border: 1.5px solid #29b6f6; border-radius: 20px;
      padding: 3px 13px; font-size: 0.82rem; font-weight: 700;
      cursor: pointer; font-family: inherit; transition: background 0.15s; white-space: nowrap;
    }
    .std-badge:hover { background: rgba(41,182,246,0.38); }
    .std-popup {
      position: absolute; top: calc(100% + 8px); right: 0;
      background: #fff; border: 2px solid #29b6f6; border-radius: 10px;
      padding: 10px 14px; font-size: 0.84rem; color: #0d47a1;
      width: 280px; z-index: 30; box-shadow: 0 4px 18px rgba(0,0,0,0.15); line-height: 1.5;
    }
    .lang-btn {
      background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.4);
      border-radius: 12px; padding: 4px 12px; font-size: 0.78rem; color: #fff;
      cursor: pointer; font-family: inherit; font-weight: 600;
      transition: background 0.2s; white-space: nowrap;
    }
    .lang-btn:hover { background: rgba(255,255,255,0.28); }
    .hidden { display: none !important; }

    /* ── Main layout ──────────────────────────────────────────────── */
    .main-content { padding: 16px 0 24px; display: flex; flex-direction: column; gap: 16px; }
    .map-section  { display: flex; flex-direction: column; gap: 0; }

    /* ── Map container ────────────────────────────────────────────── */
    #map-container {
      position: relative;
      width: 100%;
      aspect-ratio: 900 / 500;
      background: #2b5ea7;
      border-radius: 12px 12px 0 0;
      overflow: hidden;
      box-shadow: 0 4px 18px rgba(0,0,0,0.20);
      min-height: 220px;
    }
    #world-map {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
    }

    /* Land paths — unified natural earth tone, political borders hidden */
    .land {
      fill: #8cb369;
      stroke: #7a9a5a;
      stroke-width: 0.4;
    }

    /* ── Data layer element styles (populated in chunks 3–6) ─────── */
    .data-layer { transition: opacity 0.8s ease; }

    .earthquake-dot {
      fill: #e63946; fill-opacity: 0.55; stroke: #c1121f; stroke-width: 0.5;
      cursor: pointer; transition: fill-opacity 0.15s;
    }
    .earthquake-dot:hover { fill-opacity: 0.95; }
    .earthquake-dot.hidden-layer { display: none; }

    .volcano-marker {
      fill: #ff6b35; fill-opacity: 0.78; stroke: #d4380d; stroke-width: 0.5;
      cursor: pointer; transition: fill-opacity 0.15s;
    }
    .volcano-marker:hover { fill-opacity: 1; }
    .volcano-marker.hidden-layer { display: none; }

    .mountain-path {
      fill: none; stroke: #8b4513; stroke-width: 3;
      stroke-linecap: round; stroke-linejoin: round;
      filter: drop-shadow(0 0 2px rgba(139,69,19,0.5));
    }
    .mountain-path.hidden-layer { display: none; }
    .mountain-path.underwater {
      stroke: #5B8C6E; stroke-width: 2.5;
      stroke-dasharray: 10 5; filter: none; opacity: 0.7;
    }

    .plate-boundary {
      fill: none; stroke: #e8760a; stroke-width: 2;
      stroke-dasharray: 8 4; opacity: 0.82;
    }
    .plate-boundary.hidden-layer { display: none; }
    .plate-label {
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 16px; font-weight: 600;
      fill: rgba(255,255,255,0.7); text-anchor: middle;
      pointer-events: none; letter-spacing: 2px;
      paint-order: stroke;
      stroke: rgba(0,0,0,0.3); stroke-width: 3px;
    }

    @keyframes dotPop {
      0%   { transform: scale(0); opacity: 0; }
      60%  { transform: scale(1.3); }
      100% { transform: scale(1);   opacity: 1; }
    }
    .prediction-earthquake {
      fill: #ff4444; fill-opacity: 0.7; stroke: white; stroke-width: 1;
      cursor: pointer;
      animation: dotPop 0.3s ease-out;
    }
    .prediction-volcano {
      fill: #ff8800; fill-opacity: 0.7; stroke: white; stroke-width: 1;
      cursor: pointer;
      animation: dotPop 0.3s ease-out;
    }
    .hint-mode { opacity: 0.45 !important; display: block !important; }
    .hint-mode .plate-boundary { stroke: #f0a050; stroke-width: 2.5; stroke-dasharray: 12 6; }
    .phase-label {
      display: inline-block; background: #2196F3; color: white;
      padding: 3px 12px; border-radius: 12px; font-size: 12px;
      font-weight: 600; margin-bottom: 10px;
    }
    .dot-counter {
      font-size: 14px; color: #666; margin-top: 10px;
      padding: 8px 12px; background: #f5f5f5; border-radius: 8px;
    }
    #prediction-mode h3 { margin: 0 0 15px 0; color: #1a3a5c; }
    .score-card {
      text-align: center; padding: 20px;
      background: linear-gradient(135deg, #f5f7fa, #e8ecf1);
      border-radius: 12px; margin: 15px 0;
    }
    .score-emoji { font-size: 48px; margin-bottom: 10px; }
    .score-text  { font-size: 18px; font-weight: 600; color: #1a3a5c; margin-bottom: 10px; }
    .score-detail { font-size: 14px; color: #555; line-height: 1.8; }

    .guided-highlight {
      fill: none; stroke: #ffeb3b; stroke-width: 3; stroke-dasharray: 6 3;
      animation: spin-dash 1.5s linear infinite; pointer-events: none;
    }
    @keyframes spin-dash { to { stroke-dashoffset: -18; } }

    /* Tooltip */
    #map-tooltip {
      position: absolute; background: rgba(10,25,45,0.92); color: #fff;
      padding: 7px 12px; border-radius: 8px; font-size: 0.8rem;
      pointer-events: none; z-index: 20; max-width: 200px; line-height: 1.4;
      display: none; box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }

    /* ── Map legend ───────────────────────────────────────────────── */
    .map-legend {
      background: rgba(255,255,255,0.93); border: 1.5px solid #c8d8e8; border-top: none;
      border-radius: 0 0 12px 12px; padding: 8px 16px;
      display: flex; flex-wrap: wrap; gap: 6px 20px; align-items: center;
      box-shadow: 0 3px 8px rgba(0,0,0,0.07);
    }
    .legend-label {
      font-size: 0.72rem; font-weight: 700; color: #546e7a;
      text-transform: uppercase; letter-spacing: 0.04em; margin-right: 4px;
    }
    .legend-item {
      display: flex; align-items: center; gap: 6px;
      font-size: 0.80rem; color: #37474f; white-space: nowrap; padding: 2px 4px;
    }
    .legend-icon { display: flex; align-items: center; justify-content: center; }

    /* ── Controls + info row ──────────────────────────────────────── */
    .sim-lower { display: grid; grid-template-columns: 1fr 1.6fr; gap: 14px; align-items: start; }

    #controls-panel {
      background: #fff; border-radius: 12px; border: 1.5px solid #d0dde8;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 14px 16px;
      display: flex; flex-direction: column; gap: 14px;
    }
    .controls-heading {
      font-size: 0.78rem; font-weight: 700; color: #1976d2;
      text-transform: uppercase; letter-spacing: 0.05em;
      padding-bottom: 6px; border-bottom: 1.5px solid #e3f0fb;
      display: flex; align-items: center; gap: 6px;
    }
    #layer-toggles, #mode-controls { display: flex; flex-direction: column; gap: 8px; }
    .placeholder-text { font-size: 0.82rem; color: #90a4ae; font-style: italic; padding: 6px 0; }

    .layer-toggle {
      display: flex; align-items: center; gap: 10px; cursor: pointer;
      font-size: 0.88rem; color: #37474f; user-select: none;
      padding: 5px 8px; border-radius: 8px; transition: background 0.14s;
    }
    .layer-toggle:hover { background: #f0f6ff; }
    .layer-toggle input[type="checkbox"] {
      appearance: none; -webkit-appearance: none; width: 20px; height: 20px;
      border: 2px solid #90a4ae; border-radius: 5px; cursor: pointer; flex-shrink: 0;
      position: relative; background: #fff; transition: border-color 0.15s, background 0.15s;
    }
    .layer-toggle input[type="checkbox"]:checked { background: #1976d2; border-color: #1976d2; }
    .layer-toggle input[type="checkbox"]:checked::after {
      content: ''; position: absolute; left: 4px; top: 1px; width: 7px; height: 11px;
      border: 2.5px solid #fff; border-top: none; border-left: none; transform: rotate(42deg);
    }
    .toggle-swatch { width: 14px; height: 14px; border-radius: 3px; flex-shrink: 0; }

    .mode-btn {
      background: #e3f0fb; border: 1.5px solid #90caf9; border-radius: 9px;
      padding: 8px 12px; font-size: 0.84rem; font-weight: 600; color: #1565c0;
      cursor: pointer; font-family: inherit; text-align: left;
      display: flex; align-items: center; gap: 8px;
      transition: background 0.15s, border-color 0.15s, transform 0.1s; width: 100%;
    }
    .mode-btn:hover { background: #bbdefb; border-color: #64b5f6; transform: translateY(-1px); }
    .mode-btn.active { background: #1976d2; color: #fff; border-color: #1565c0; }

    .guided-step {
      background: #fff8e1; border: 1.5px solid #ffe082; border-radius: 10px;
      padding: 12px 14px; font-size: 0.88rem; color: #4e342e; line-height: 1.55;
    }
    .guided-step .step-num { font-weight: 800; color: #f57f17; margin-right: 4px; }
    .guided-nav { display: flex; gap: 8px; margin-top: 10px; }
    .guided-nav-btn {
      flex: 1; background: #fff; border: 1.5px solid #ffe082; border-radius: 8px;
      padding: 6px; font-size: 0.82rem; font-weight: 600; color: #f57f17;
      cursor: pointer; font-family: inherit; transition: background 0.15s;
    }
    .guided-nav-btn:hover { background: #fff8e1; }
    .guided-nav-btn.primary { background: #f57f17; color: #fff; border-color: #f57f17; }
    .guided-nav-btn.primary:hover { background: #ef6c00; }

    #info-panel {
      background: #fff; border-radius: 12px; border: 1.5px solid #d0dde8;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 18px 20px;
      display: flex; flex-direction: column; gap: 12px;
    }
    .info-panel-header { display: flex; align-items: center; gap: 10px; }
    .info-panel-icon { font-size: 1.8rem; flex-shrink: 0; }
    .info-panel-title { font-size: 1rem; font-weight: 700; color: #1565c0; }
    .info-panel-body { font-size: 0.92rem; color: #37474f; line-height: 1.65; }
    .info-panel-body strong { color: #1a3a5c; }

    .question-callout {
      background: #e8f5e9; border-left: 4px solid #43a047; border-radius: 0 8px 8px 0;
      padding: 10px 14px; font-size: 0.88rem; color: #1b5e20; font-weight: 600; line-height: 1.5;
    }
    .question-callout::before { content: '🔬 '; }

    .answer-feedback {
      border-radius: 8px; padding: 10px 14px; font-size: 0.86rem;
      font-weight: 600; line-height: 1.5; display: none;
    }
    .answer-feedback.correct   { background: #e8f5e9; color: #2e7d32; border: 1.5px solid #a5d6a7; }
    .answer-feedback.incorrect { background: #fff3e0; color: #e65100; border: 1.5px solid #ffcc80; }

    .btn-primary {
      display: inline-flex; align-items: center; gap: 7px; background: #1976d2;
      color: #fff; border: none; border-radius: 10px; padding: 10px 20px;
      font-size: 0.92rem; font-weight: 700; cursor: pointer; font-family: inherit;
      transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
      box-shadow: 0 2px 8px rgba(25,118,210,0.28); align-self: flex-start;
    }
    .btn-primary:hover { background: #1565c0; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(25,118,210,0.35); }
    .btn-primary:active { transform: translateY(0); }
    .btn-secondary {
      display: inline-flex; align-items: center; gap: 7px; background: #fff;
      color: #1976d2; border: 1.5px solid #90caf9; border-radius: 10px;
      padding: 8px 16px; font-size: 0.88rem; font-weight: 600; cursor: pointer;
      font-family: inherit; transition: background 0.15s, transform 0.1s; align-self: flex-start;
    }
    .btn-secondary:hover { background: #e3f2fd; transform: translateY(-1px); }

    /* ── Chunk 7A: Guided + Free Explore mode styles ──────────────── */
    #progress-bar-container {
      background: #e0e0e0; border-radius: 20px; height: 12px;
      position: relative; margin-bottom: 5px; overflow: hidden;
    }
    #progress-bar {
      background: linear-gradient(90deg, #2196F3, #1976D2);
      height: 100%; border-radius: 20px; width: 0%;
      transition: width 0.5s ease;
    }
    #progress-text {
      display: block; text-align: center; font-size: 13px; color: #666; margin-top: 5px;
    }
    #guided-mode, #explore-mode { display: flex; flex-direction: column; gap: 12px; }
    .guided-step h3 { margin: 0 0 10px 0; font-size: 1.2em; color: #1a3a5c; }
    .guided-explanation {
      background: #f0f7ff; border-left: 4px solid #2196F3;
      padding: 12px 15px; border-radius: 0 8px 8px 0;
      margin-bottom: 15px; line-height: 1.6; font-size: 0.92rem; color: #37474f;
    }
    .guided-prompt label {
      display: block; font-weight: 600; margin-bottom: 8px; color: #333; font-size: 0.9rem;
    }
    .guided-prompt textarea {
      width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px;
      font-family: inherit; font-size: 15px; resize: vertical;
      transition: border-color 0.3s; box-sizing: border-box;
    }
    .guided-prompt textarea:focus { border-color: #2196F3; outline: none; }
    .primary-btn {
      display: inline-block; background: #2196F3; color: white; border: none;
      padding: 12px 28px; border-radius: 25px; font-size: 16px; font-weight: 600;
      cursor: pointer; margin-top: 15px;
      transition: background 0.3s, transform 0.1s; align-self: flex-start;
    }
    .primary-btn:hover { background: #1976D2; transform: scale(1.03); }
    .primary-btn:active { transform: scale(0.98); }
    .secondary-btn {
      display: inline-block; background: transparent; color: #666;
      border: 2px solid #ddd; padding: 10px 22px; border-radius: 25px;
      font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 10px;
      transition: all 0.3s;
    }
    .secondary-btn:hover { border-color: #999; color: #333; }
    #explore-buttons { display: flex; gap: 10px; flex-wrap: wrap; }
    .toggle-control {
      display: flex; align-items: center; padding: 8px 0; cursor: pointer; user-select: none;
    }
    .toggle-control input[type="checkbox"] { display: none; }
    .toggle-slider {
      width: 44px; height: 24px; background: #ccc; border-radius: 12px;
      position: relative; transition: background 0.3s; flex-shrink: 0; margin-right: 12px;
    }
    .toggle-slider::after {
      content: ''; position: absolute; width: 20px; height: 20px; background: white;
      border-radius: 50%; top: 2px; left: 2px; transition: transform 0.3s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }
    .toggle-control input:checked + .toggle-slider { background: #2196F3; }
    .toggle-control input:checked + .toggle-slider::after { transform: translateX(20px); }
    .toggle-label { font-size: 15px; font-weight: 500; }
    .info-callout {
      background: #fff8e1; border-left: 4px solid #ffc107;
      padding: 12px 15px; border-radius: 0 8px 8px 0; margin: 5px 0;
      font-size: 0.88rem; line-height: 1.55;
    }
    .progress-bar-wrap { background: #e3f0fb; border-radius: 6px; height: 7px; overflow: hidden; }
    .progress-bar-fill {
      height: 100%; background: linear-gradient(90deg, #1976d2, #29b6f6);
      border-radius: 6px; transition: width 0.4s ease; width: 0%;
    }
    .progress-label { font-size: 0.74rem; color: #78909c; margin-top: 3px; text-align: right; }

    /* ── Collapsible panels ───────────────────────────────────────── */
    .collapsibles { display: flex; flex-direction: column; gap: 8px; }
    .col-panel {
      background: #fff; border: 1.5px solid #d0dde8; border-radius: 12px;
      overflow: hidden; box-shadow: 0 1px 5px rgba(0,0,0,0.05);
    }
    .col-panel summary {
      padding: 12px 18px; cursor: pointer; font-size: 0.92rem; font-weight: 700;
      color: #1565c0; list-style: none; display: flex; justify-content: space-between;
      align-items: center; user-select: none; transition: background 0.15s;
    }
    .col-panel summary:hover { background: #f5f9ff; }
    .col-panel summary::-webkit-details-marker { display: none; }
    .col-panel summary::after { content: '▼'; font-size: 0.65rem; opacity: 0.6; transition: transform 0.2s; }
    .col-panel[open] summary::after { transform: rotate(180deg); }

    /* ── Vocabulary ───────────────────────────────────────────────── */
    .vocab-dl { padding: 4px 18px 16px; display: flex; flex-direction: column; gap: 0; }
    .vocab-entry {
      display: grid; grid-template-columns: 190px 1fr; gap: 8px 16px;
      padding: 9px 10px; border-radius: 7px; align-items: baseline;
      border-left: 4px solid transparent; transition: background 0.12s;
    }
    .vocab-entry:nth-child(even) { background: #f7faff; }
    .vocab-entry:hover { background: #e8f3ff; border-left-color: #1976d2; }
    .vocab-term { font-weight: 700; color: #1565c0; font-size: 0.90rem; }
    .vocab-def  { font-size: 0.88rem; color: #37474f; line-height: 1.55; }

    /* ── Key Concepts ─────────────────────────────────────────────── */
    .concepts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 8px 18px 16px; }
    .concept-card {
      border-radius: 10px; padding: 12px 14px; font-size: 0.87rem; color: #1a2b3c;
      line-height: 1.55; display: flex; gap: 10px; align-items: flex-start;
      border: 1.5px solid transparent;
    }
    .concept-card:nth-child(1) { background: #e8f5e9; border-color: #a5d6a7; }
    .concept-card:nth-child(2) { background: #e3f2fd; border-color: #90caf9; }
    .concept-card:nth-child(3) { background: #fce4ec; border-color: #f48fb1; }
    .concept-card:nth-child(4) { background: #fff8e1; border-color: #ffe082; }
    .concept-emoji { font-size: 1.4rem; flex-shrink: 0; line-height: 1.2; }
    .concept-text strong { color: #0d1f30; }

    /* ── Footer ───────────────────────────────────────────────────── */
    .footer {
      background: #1a3a5c; color: rgba(255,255,255,0.65); text-align: center;
      padding: 14px 20px; font-size: 0.78rem; line-height: 1.6; margin-top: auto;
    }

    /* ── Map container polish ─────────────────────────────────────── */
    #map-container {
      box-shadow: 0 2px 12px rgba(0,0,0,0.15), inset 0 1px 3px rgba(0,0,0,0.1);
    }

    /* ── Score card animation ─────────────────────────────────────── */
    @keyframes scoreReveal {
      0%   { transform: scale(0.9); opacity: 0; }
      100% { transform: scale(1);   opacity: 1; }
    }
    .score-card { animation: scoreReveal 0.5s ease-out; }

    /* ── Touch-friendly min heights ──────────────────────────────── */
    .primary-btn, .secondary-btn, .guided-nav-btn, .mode-btn,
    .std-badge, .lang-btn {
      min-height: 44px;
    }

    /* ── Progress text contrast fix ─────────────────────────────── */
    #progress-text { color: #4a4a4a; }

    /* ── Reduced motion ──────────────────────────────────────────── */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }

    /* ── Medium screens (tablets, small laptops) ─────────────────── */
    @media (max-width: 1024px) {
      .page-wrap { padding: 0 12px; }
      .map-legend { gap: 4px 14px; }
      .legend-item { font-size: 0.75rem; }
      .plate-label { font-size: 14px; }
    }

    /* ── Small screens (phones, narrow tablets) ──────────────────── */
    @media (max-width: 768px) {
      /* Stack layout vertically */
      .sim-lower { grid-template-columns: 1fr; }
      #controls-panel { order: 2; }
      #info-panel     { order: 1; }
      /* Concepts + vocab */
      .concepts-grid { grid-template-columns: 1fr; }
      .vocab-entry   { grid-template-columns: 1fr; gap: 2px; }
      /* Sim title */
      .sim-title { font-size: 0.95rem; }
      /* Map legend: wrap to 2 rows rather than overflow */
      .map-legend { flex-wrap: wrap; gap: 5px 14px; }
      /* Textarea full width, won't overflow */
      .guided-prompt textarea { width: 100%; min-width: 0; }
      /* Buttons wrap text */
      .primary-btn, .secondary-btn { white-space: normal; text-align: center; }
      /* Toggle rows: more vertical padding for easier tapping */
      .toggle-control { padding: 12px 4px; }
      /* Plate labels smaller so they don't overlap */
      .plate-label { font-size: 12px; }
      /* Header: let badge group wrap below title if needed */
      .header-inner { gap: 8px; }
      .header-right { flex-wrap: wrap; gap: 6px; }
      /* Info panel padding */
      #info-panel { padding: 14px 14px; }
      /* Progress bar minimum width */
      #progress-bar-container { min-width: 120px; }
    }

    @media (max-width: 480px) {
      .page-wrap { padding: 0 8px; }
      .map-legend { gap: 4px 10px; font-size: 0.72rem; }
      #info-panel { padding: 12px 10px; }
    }
  </style>
</head>
<body>

  <!-- ═══════════════════════════════════════════════════════ HEADER -->
  <header class="header">
    <div class="header-inner">
      <h1 class="sim-title" data-i18n="pageTitle">🌎 Earth's Features Map Lab</h1>
      <div class="header-right">
        <div class="badge-group">
          <button class="std-badge" id="stdBadge">5.1.1</button>
          <div class="std-popup hidden" id="stdPopup">
            <strong>Utah SEEd 5.1.1</strong><br>
            Analyze and interpret data to describe patterns of Earth's features.
          </div>
        </div>
        <button class="lang-btn" id="langBtn" data-i18n="langBtnLabel">🇪🇸 Español</button>
      </div>
    </div>
  </header>

  <!-- ════════════════════════════════════════════════════════ MAIN -->
  <div class="page-wrap">
    <main class="main-content">

      <!-- ── Map section ──────────────────────────────────────────── -->
      <section class="map-section">

        <div id="map-container">
          <!--
            EMBEDDED WORLD SVG — SimpleMaps world.svg (MIT license)
            ViewBox  : 0 0 2000 857
            Projection: Robinson
            Calibration:
              centerX = 1000   (lon=0  → x=1000, horizontal centre)
              centerY = 428.5  (lat=0  → y=428.5, vertical centre = 857/2)
              R       = 318.31 (= 1000/π, fits ±180° lon in 2000 px)
            Land paths: name attr stripped, class="land" applied uniformly
          -->
          <svg id="world-map"
               viewBox="0 0 2000 857"
               width="100%"
               preserveAspectRatio="xMidYMid meet"
               xmlns="http://www.w3.org/2000/svg"
               role="img"
               aria-label="Interactive world map showing Earth's features">

            <defs>
              <linearGradient id="ocean-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stop-color="#3a7bd5"/>
                <stop offset="100%" stop-color="#1e4fa0"/>
              </linearGradient>
              <!-- Coastal glow: soft lighter halo around land to suggest shelf depth -->
              <filter id="coastal-glow" x="-8%" y="-8%" width="116%" height="116%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
                <feColorMatrix in="blur" type="matrix"
                  values="0.2 0 0 0 0.35
                          0.2 0 0 0 0.52
                          0   0 0 0 0.75
                          0   0 0 0.4 0" result="glow"/>
                <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            <!-- Ocean background -->
            <rect x="0" y="0" width="2000" height="857" fill="url(#ocean-gradient)"/>

            <!-- Land paths (all countries + territories) -->
            <g id="land-layer" filter="url(#coastal-glow)">
'@

$after = @'
            </g><!-- end #land-layer -->

            <!-- ════ DATA LAYERS ════ -->
            <g id="plate-boundary-layer" class="data-layer" style="display:none; opacity:0;"></g>
            <g id="mountain-layer"       class="data-layer" style="display:none; opacity:0;"></g>
            <g id="earthquake-layer"     class="data-layer" style="display:none; opacity:0;"></g>
            <g id="volcano-layer"        class="data-layer" style="display:none; opacity:0;"></g>
            <!-- Prediction challenge layer — always present -->
            <g id="prediction-layer"     class="data-layer"></g>


          </svg><!-- end #world-map -->

          <div id="map-tooltip" role="tooltip"></div>

        </div><!-- end #map-container -->

        <!-- ── Map legend ──────────────────────────────────────────── -->
        <div class="map-legend">
          <span class="legend-label">Legend:</span>

          <div class="legend-item">
            <div class="legend-icon">
              <svg width="14" height="14" viewBox="0 0 14 14">
                <circle cx="7" cy="7" r="5.5" fill="#e63946" fill-opacity="0.75" stroke="#c1121f" stroke-width="1"/>
              </svg>
            </div>
            <span data-i18n="legendEq">Earthquakes</span>
          </div>

          <div class="legend-item">
            <div class="legend-icon">
              <svg width="14" height="14" viewBox="0 0 14 14">
                <polygon points="7,1 13,13 1,13" fill="#ff6b35" fill-opacity="0.82" stroke="#d4380d" stroke-width="1"/>
              </svg>
            </div>
            <span data-i18n="legendVol">Volcanoes</span>
          </div>

          <div class="legend-item">
            <div class="legend-icon">
              <svg width="22" height="8" viewBox="0 0 22 8">
                <path d="M1 6 Q6 1 11 4 Q16 7 21 2" fill="none" stroke="#8b4513" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>
            <span data-i18n="legendMtn">Mountain Chains</span>
          </div>

          <div class="legend-item">
            <div class="legend-icon">
              <svg width="22" height="6" viewBox="0 0 22 6">
                <line x1="0" y1="3" x2="22" y2="3" stroke="#e8760a" stroke-width="2" stroke-dasharray="6 3"/>
              </svg>
            </div>
            <span data-i18n="legendPlate">Plate Boundaries</span>
          </div>
        </div>

      </section>

      <!-- ── Controls + Info row ─────────────────────────────────── -->
      <div class="sim-lower">

        <div id="controls-panel">
          <div id="layer-toggles"></div>
          <div id="mode-controls"></div>
        </div>

        <div id="info-panel" role="region" aria-label="Investigation panel" aria-live="polite">

          <!-- ── Guided Investigation mode ────────────────────────── -->
          <div id="guided-mode">
            <div id="progress-bar-container"
                 role="progressbar"
                 aria-valuenow="1" aria-valuemin="1" aria-valuemax="5"
                 aria-label="Investigation progress">
              <div id="progress-bar"></div>
            </div>
            <span id="progress-text">Step 1 of 5</span>
            <div id="guided-content" aria-live="polite">
              <!-- Step content loaded by showGuidedStep() -->
            </div>
          </div>

          <!-- ── Prediction Challenge mode ──────────────────────────── -->
          <div id="prediction-mode" style="display:none;">
            <h3 id="prediction-title" data-i18n="predTitle">🎯 Prediction Challenge</h3>
            <div id="prediction-instructions"></div>
            <div id="prediction-score" style="display:none;"></div>
            <div id="prediction-buttons"></div>
          </div>

          <!-- ── Free Explore mode ─────────────────────────────────── -->
          <div id="explore-mode" style="display:none;">
            <h3 data-i18n="exploreTitle">🔍 Free Explore</h3>
            <p data-i18n="exploreSubtitle" style="font-size:0.9rem;color:#37474f;">Toggle layers on and off to explore patterns on your own!</p>

            <div id="explore-layer-toggles">
              <label class="toggle-control">
                <input type="checkbox" id="toggle-plates" checked aria-label="Toggle plate boundaries layer">
                <span class="toggle-slider"></span>
                <span class="toggle-label" data-i18n="togglePlates">🟠 Plate Boundaries</span>
              </label>
              <label class="toggle-control">
                <input type="checkbox" id="toggle-earthquakes" checked aria-label="Toggle earthquakes layer">
                <span class="toggle-slider"></span>
                <span class="toggle-label" data-i18n="toggleEq">🔴 Earthquakes</span>
              </label>
              <label class="toggle-control">
                <input type="checkbox" id="toggle-volcanoes" checked aria-label="Toggle volcanoes layer">
                <span class="toggle-slider"></span>
                <span class="toggle-label" data-i18n="toggleVol">🔺 Volcanoes</span>
              </label>
              <label class="toggle-control">
                <input type="checkbox" id="toggle-mountains" checked aria-label="Toggle mountain chains layer">
                <span class="toggle-slider"></span>
                <span class="toggle-label" data-i18n="toggleMtn">⛰️ Mountain Chains</span>
              </label>
            </div>

            <div id="explore-info" class="info-callout">
              <p>💡 <strong>Try this:</strong> Turn off everything except earthquakes. Then turn on just plate boundaries. See how they match up?</p>
            </div>

            <div id="explore-buttons">
              <button id="prediction-btn" class="primary-btn" data-i18n="predChallengeBtnLabel">🎯 Prediction Challenge</button>
              <button id="restart-btn" class="secondary-btn" data-i18n="restartBtnLabel">↩ Restart Investigation</button>
            </div>
          </div>

        </div>

      </div>

      <!-- ── Vocabulary + Key Concepts ───────────────────────────── -->
      <div class="collapsibles">

        <details class="col-panel" open>
          <summary data-i18n="vocabSummary">📖 Vocabulary</summary>
          <dl class="vocab-dl">
            <div class="vocab-entry">
              <dt class="vocab-term" data-i18n="term_earthquake">Earthquake</dt>
              <dd class="vocab-def"  data-i18n="def_earthquake">A sudden shaking of Earth's surface caused by movement along cracks in the crust.</dd>
            </div>
            <div class="vocab-entry">
              <dt class="vocab-term" data-i18n="term_volcano">Volcano</dt>
              <dd class="vocab-def"  data-i18n="def_volcano">An opening in Earth's surface where melted rock (magma), gases, and ash can escape from deep underground.</dd>
            </div>
            <div class="vocab-entry">
              <dt class="vocab-term" data-i18n="term_mountain">Mountain chain</dt>
              <dd class="vocab-def"  data-i18n="def_mountain">A long row of connected mountains that formed together, often stretching hundreds of miles.</dd>
            </div>
            <div class="vocab-entry">
              <dt class="vocab-term" data-i18n="term_plate">Tectonic plate</dt>
              <dd class="vocab-def"  data-i18n="def_plate">One of the giant, slow-moving pieces of Earth's outer layer (crust) that fit together like a puzzle.</dd>
            </div>
            <div class="vocab-entry">
              <dt class="vocab-term" data-i18n="term_boundary">Plate boundary</dt>
              <dd class="vocab-def"  data-i18n="def_boundary">The edges where two tectonic plates meet. Most earthquakes and volcanoes happen near these edges.</dd>
            </div>
            <div class="vocab-entry">
              <dt class="vocab-term" data-i18n="term_rof">Ring of Fire</dt>
              <dd class="vocab-def"  data-i18n="def_rof">A horseshoe-shaped zone around the Pacific Ocean where many earthquakes and volcanoes occur.</dd>
            </div>
            <div class="vocab-entry">
              <dt class="vocab-term" data-i18n="term_ridge">Mid-ocean ridge</dt>
              <dd class="vocab-def"  data-i18n="def_ridge">A long underwater mountain chain where plates pull apart and new ocean floor is created.</dd>
            </div>
            <div class="vocab-entry">
              <dt class="vocab-term" data-i18n="term_pattern">Pattern</dt>
              <dd class="vocab-def"  data-i18n="def_pattern">Something that repeats in a way that is predictable. Scientists look for patterns in data to understand how the world works.</dd>
            </div>
          </dl>
        </details>

        <details class="col-panel">
          <summary data-i18n="conceptsSummary">🧠 Key Concepts</summary>
          <div class="concepts-grid">
            <div class="concept-card">
              <span class="concept-emoji">🌍</span>
              <p class="concept-text" data-i18n="concept1">Most earthquakes and volcanoes happen in <strong>bands</strong> along the edges of tectonic plates.</p>
            </div>
            <div class="concept-card">
              <span class="concept-emoji">🌊</span>
              <p class="concept-text" data-i18n="concept2">These bands are often found where <strong>continents meet oceans</strong>.</p>
            </div>
            <div class="concept-card">
              <span class="concept-emoji">⛰️</span>
              <p class="concept-text" data-i18n="concept3">Major mountain chains are usually found <strong>near the edges of continents</strong> or where plates push together.</p>
            </div>
            <div class="concept-card">
              <span class="concept-emoji">🔬</span>
              <p class="concept-text" data-i18n="concept4">Scientists study <strong>patterns in data</strong> — like maps — to understand how Earth's surface was shaped.</p>
            </div>
          </div>
        </details>

      </div>

    </main>
  </div>

  <!-- ════════════════════════════════════════════════════════ FOOTER -->
  <footer class="footer">
    <p data-i18n="footer">Built for Ogden School District &nbsp;|&nbsp; Aligned to Utah Science with Engineering Education (SEEd) Standards</p>
  </footer>

  <!-- ════════════════════════════ SCRIPT ═══════════════════════════ -->
  <script>
    // ── Standard badge popup ─────────────────────────────────────────
    document.getElementById('stdBadge').addEventListener('click', () =>
      document.getElementById('stdPopup').classList.toggle('hidden'));
    document.addEventListener('click', e => {
      if (!e.target.closest('.badge-group'))
        document.getElementById('stdPopup').classList.add('hidden');
    });

    // ── Robinson Projection Converter ────────────────────────────────
    //
    // Converts geographic lat/lon (degrees) to SVG x,y for this map.
    //
    // Map: SimpleMaps world.svg — ViewBox 0 0 2000 857, Robinson projection.
    //
    // Calibration parameters:
    //   centerX = 1000   — lon=0° (prime meridian) maps to x=1000
    //   centerY = 428.5  — lat=0° (equator) maps to y=428.5  (= 857/2)
    //   R       = 318.31 — scale factor = 1000/π, so ±180° lon fills ±1000px
    //
    // Verification against known city positions in the SVG:
    //   India center  (~20°N, 78°E) : calc x≈1426 — SVG path start x=1427.6 ✓
    // ── Robinson projection — calibrated from 5 real reference points ──────
    // Least-squares fit to: GoG(0,0), NYC(40.7,-74), Tokyo(35.7,139.7),
    //                       Sydney(-33.9,151.2), Rio(-22.9,-43.2)
    // Max error across all 5 points: ~12px x, ~5px y (well within 20px target)
    const ROBINSON_TABLE = [
      [ 0, 1.0000, 0.0000], [ 5, 0.9986, 0.0620], [10, 0.9954, 0.1240],
      [15, 0.9900, 0.1860], [20, 0.9822, 0.2480], [25, 0.9730, 0.3100],
      [30, 0.9600, 0.3720], [35, 0.9427, 0.4340], [40, 0.9216, 0.4958],
      [45, 0.8962, 0.5571], [50, 0.8679, 0.6176], [55, 0.8350, 0.6769],
      [60, 0.7986, 0.7346], [65, 0.7597, 0.7903], [70, 0.7186, 0.8435],
      [75, 0.6732, 0.8936], [80, 0.6213, 0.9394], [85, 0.5722, 0.9761],
      [90, 0.5322, 1.0000],
    ];
    const ROB_CX = 980.7;   // SVG x for lon=0
    const ROB_CY = 500.3;   // SVG y for lat=0
    const ROB_RX = 325.4;   // horizontal scale factor
    const ROB_RY = 514.9;   // vertical scale factor

    /**
     * latLonToSVG(lat, lon) → [x, y]
     * Maps geographic coordinates to this SVG's viewBox coordinate space.
     * @param {number} lat  Latitude  (-90 … +90)
     * @param {number} lon  Longitude (-180 … +180)
     * @returns {[number, number]}
     */
    function latLonToSVG(lat, lon) {
      const absLat = Math.min(Math.abs(lat), 90);
      const sign   = lat >= 0 ? 1 : -1;
      const lonRad = Math.max(-Math.PI, Math.min(Math.PI, lon * Math.PI / 180));

      let i = 0;
      while (i < ROBINSON_TABLE.length - 2 && ROBINSON_TABLE[i + 1][0] <= absLat) i++;
      const r0 = ROBINSON_TABLE[i], r1 = ROBINSON_TABLE[i + 1];
      const t  = r0[0] === r1[0] ? 0 : (absLat - r0[0]) / (r1[0] - r0[0]);
      const plen = r0[1] + t * (r1[1] - r0[1]);
      const pdfe = r0[2] + t * (r1[2] - r0[2]);

      return [
        ROB_CX + ROB_RX * plen * lonRad,
        ROB_CY - ROB_RY * pdfe * sign,
      ];
    }

    // ── Earthquake Data ──────────────────────────────────────────────────────
    // ~150 [lat, lon] pairs representing global seismicity patterns.
    // Points are positioned on subduction zones / plate boundaries, not city centers.
    const earthquakeData = [
      // ── West coast of South America (Chile, Peru, Ecuador, Colombia) ──────
      [-34.2, -72.1], [-31.5, -71.4], [-27.8, -70.3], [-24.1, -70.9],
      [-20.6, -70.2], [-17.4, -72.8], [-14.1, -76.3], [-10.3, -78.8],
      [ -5.7, -80.6], [ -1.2, -80.9],

      // ── Central America & Mexico ──────────────────────────────────────────
      [  8.4, -83.2], [ 10.2, -85.7], [ 12.8, -87.4], [ 14.6, -90.5],
      [ 15.9, -92.3], [ 17.5, -99.1], [ 19.2,-104.6], [ 16.3, -95.8],

      // ── West coast of North America (California to British Columbia) ──────
      [ 32.6,-117.4], [ 34.1,-120.3], [ 36.7,-121.8], [ 38.8,-123.0],
      [ 40.5,-124.7], [ 44.2,-124.5], [ 47.8,-124.0], [ 50.3,-128.6],

      // ── Alaska ────────────────────────────────────────────────────────────
      [ 55.4,-133.2], [ 57.8,-136.9], [ 59.2,-143.4], [ 60.1,-147.8],
      [ 61.4,-150.9], [ 62.3,-150.2],

      // ── Aleutian Islands arc ──────────────────────────────────────────────
      [ 52.8,-169.4], [ 51.9,-178.2], [ 51.4, 178.6], [ 52.3, 172.1],
      [ 53.1, 165.8], [ 54.2, 161.3],

      // ── Kuril Islands / Japan / northeastern arc ──────────────────────────
      [ 50.7, 156.1], [ 47.3, 153.4], [ 44.1, 149.6], [ 41.8, 143.8],
      [ 38.4, 141.7], [ 36.1, 141.2], [ 33.5, 136.8], [ 30.2, 131.4],

      // ── Philippines / Taiwan ──────────────────────────────────────────────
      [ 24.8, 121.9], [ 22.3, 121.5], [ 18.9, 122.3], [ 16.4, 122.7],
      [ 13.2, 124.8], [ 10.6, 126.3],

      // ── Indonesia (Sumatra, Java, eastern arc) ────────────────────────────
      [  4.8,  96.2], [  2.1,  97.8], [ -0.7,  99.4], [ -3.2, 100.9],
      [ -5.8, 104.6], [ -7.4, 107.3], [ -8.6, 114.2], [ -8.3, 122.7],

      // ── Papua New Guinea / Solomon Islands / Vanuatu ─────────────────────
      [ -3.8, 145.2], [ -5.4, 150.3], [ -9.1, 158.6], [-13.4, 166.2],
      [-16.2, 167.8], [-19.7, 169.4],

      // ── New Zealand / Tonga / Fiji ────────────────────────────────────────
      [-38.4, 176.2], [-35.1, 179.1], [-25.3,-175.8], [-19.6,-175.2],
      [-17.4, 178.4],

      // ── Mid-Atlantic Ridge: Iceland cluster ───────────────────────────────
      [ 65.3, -18.4], [ 64.8, -19.1], [ 63.9, -20.7], [ 63.4, -22.1],

      // ── Mid-Atlantic Ridge: main ridge (N to S) ───────────────────────────
      [ 52.3, -33.1], [ 47.6, -29.8], [ 43.1, -28.4], [ 38.7, -30.2],
      [ 34.2, -32.6], [ 29.1, -43.4], [ 23.4, -44.8], [ 17.6, -24.7],
      [ 13.3, -44.9], [  7.8, -34.2], [  3.1, -32.8], [ -1.4, -15.7],
      [ -7.2, -13.4], [-12.6, -14.8], [-18.3, -12.6], [-25.1, -13.9],
      [-32.4, -13.1], [-40.2, -16.4], [-48.6, -14.2], [-54.8, -13.6],

      // ── Mediterranean (Turkey, Greece, Italy, Spain) ──────────────────────
      [ 39.2,  29.4], [ 37.8,  21.3], [ 36.1,  26.8], [ 38.6,  14.2],
      [ 41.3,  13.7], [ 36.4,  -4.1],

      // ── Iran / Afghanistan / Pakistan ─────────────────────────────────────
      [ 28.6,  57.3], [ 30.4,  57.8], [ 33.7,  59.2], [ 35.8,  69.1],
      [ 36.9,  71.4],

      // ── Himalayas / Nepal / northern India ────────────────────────────────
      [ 34.2,  72.8], [ 32.9,  73.9], [ 31.4,  79.3], [ 28.6,  84.7],
      [ 27.8,  88.1], [ 29.4,  94.3],

      // ── Myanmar / Yunnan China ────────────────────────────────────────────
      [ 28.1,  97.4], [ 24.7,  98.8], [ 21.3,  99.6], [ 19.1, 100.3],

      // ── Caucasus (Georgia, Armenia, eastern Turkey) ───────────────────────
      [ 42.8,  43.2], [ 41.3,  44.9], [ 39.8,  46.3], [ 38.6,  40.1],

      // ── East African Rift ─────────────────────────────────────────────────
      [ 11.7,  42.8], [  8.3,  39.4], [  4.1,  36.7], [  0.2,  30.1],
      [ -4.6,  29.8], [ -8.7,  33.4], [-11.3,  34.6], [-14.8,  35.2],

      // ── New Madrid seismic zone (central US) ─────────────────────────────
      [ 36.4, -89.6], [ 35.2, -89.9],

      // ── Central Asia intraplate ───────────────────────────────────────────
      [ 41.8,  73.1], [ 38.6,  67.4],

      // ── Northern/central China ────────────────────────────────────────────
      [ 39.6, 106.2], [ 34.8, 103.7],

      // ── Indian Ocean / southern mid-ocean ridges ──────────────────────────
      [ -4.8,  67.3], [-20.4,  66.8],

      // ── Arctic ridge (north of Iceland) ──────────────────────────────────
      [ 71.3, -5.4], [ 73.8,  8.2],

      // ── Southern Ocean ridges ─────────────────────────────────────────────
      [-54.2, -2.1], [-57.6, -26.4],
    ];

    function renderEarthquakes() {
      const g  = document.getElementById('earthquake-layer');
      const ns = 'http://www.w3.org/2000/svg';
      earthquakeData.forEach(([lat, lon]) => {
        const [x, y] = latLonToSVG(lat, lon);
        const c = document.createElementNS(ns, 'circle');
        c.setAttribute('cx', x.toFixed(1));
        c.setAttribute('cy', y.toFixed(1));
        c.setAttribute('r', '3.5');
        c.setAttribute('class', 'earthquake-dot');
        g.appendChild(c);
      });
    }

    renderEarthquakes();

    // \u2500\u2500 Volcano Data \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    const volcanoData = [
      // ── Andes / South America ─────────────────────────────────────────────
      [ -0.7, -78.4],  // Cotopaxi, Ecuador
      [ -1.5, -78.4],  // Tungurahua, Ecuador
      [  4.9, -75.3],  // Nevado del Ruiz, Colombia
      [-16.3, -71.4],  // Misti, Peru
      [-16.4, -70.9],  // Ubinas, Peru
      [-38.7, -71.6],  // Llaima, Chile
      [-39.4, -71.9],  // Villarrica, Chile
      [-41.3, -72.6],  // Calbuco, Chile

      // ── Central America & Mexico ──────────────────────────────────────────
      [ 19.0, -98.6],  // Popocatépetl, Mexico
      [ 19.5,-103.6],  // Colima, Mexico
      [ 14.5, -90.9],  // Fuego, Guatemala
      [ 14.8, -91.6],  // Santa María, Guatemala
      [ 12.0, -86.2],  // Masaya, Nicaragua
      [ 10.5, -84.7],  // Arenal, Costa Rica

      // ── Cascades & Alaska ─────────────────────────────────────────────────
      [ 41.4,-122.2],  // Mount Shasta
      [ 46.2,-122.2],  // Mount St. Helens
      [ 46.9,-121.8],  // Mount Rainier
      [ 61.3,-152.3],  // Mount Spurr, Alaska
      [ 60.5,-152.7],  // Mount Redoubt, Alaska
      [ 55.4,-161.9],  // Mount Pavlof, Alaska
      [ 52.8,-169.9],  // Mount Cleveland, Alaska

      // ── Aleutians curving to Kamchatka ────────────────────────────────────
      [ 54.8,-163.9],  // Shishaldin
      [ 53.4,-168.1],  // Okmok
      [ 56.1, 160.6],  // Klyuchevskoy, Russia
      [ 56.0, 160.6],  // Bezymianny, Russia
      [ 54.0, 159.4],  // Karymsky, Russia

      // ── Japan ─────────────────────────────────────────────────────────────
      [ 36.4, 138.5],  // Asama
      [ 35.4, 138.7],  // Mount Fuji
      [ 33.0, 131.1],  // Mount Aso
      [ 32.8, 130.3],  // Unzen
      [ 31.6, 130.7],  // Sakurajima

      // ── Philippines ───────────────────────────────────────────────────────
      [ 15.1, 120.4],  // Pinatubo
      [ 14.0, 121.0],  // Taal
      [ 13.3, 123.7],  // Mayon
      [ 10.4, 123.1],  // Kanlaon

      // ── Indonesia ─────────────────────────────────────────────────────────
      [  3.2,  98.4],  // Sinabung, Sumatra
      [ -6.1, 105.4],  // Krakatoa
      [ -7.5, 110.4],  // Merapi
      [ -7.9, 112.9],  // Bromo
      [ -8.1, 112.9],  // Semeru
      [ -8.2, 118.0],  // Tambora
      [ -8.3, 115.5],  // Agung, Bali

      // ── Papua New Guinea / Melanesia ──────────────────────────────────────
      [ -4.1, 145.0],  // Manam
      [ -5.1, 151.3],  // Ulawun
      [ -4.3, 152.2],  // Rabaul / Tavurvur
      [-19.5, 169.4],  // Yasur, Vanuatu

      // ── New Zealand / Tonga ───────────────────────────────────────────────
      [-37.5, 177.2],  // White Island, NZ
      [-39.1, 175.6],  // Tongariro, NZ
      [-39.3, 175.6],  // Ruapehu, NZ
      [-20.5,-175.4],  // Hunga Tonga

      // ── Mediterranean / Alpine-Himalayan Belt ─────────────────────────────
      [ 40.8,  14.1],  // Campi Flegrei, Italy
      [ 40.8,  14.4],  // Vesuvius, Italy
      [ 38.8,  15.2],  // Stromboli, Italy
      [ 37.8,  15.0],  // Mount Etna, Italy
      [ 36.4,  25.4],  // Santorini, Greece
      [ 43.4,  42.4],  // Elbrus, Russia
      [ 38.6,  42.2],  // Nemrut Dağı, Turkey
      [ 35.9,  52.1],  // Damavand, Iran

      // ── East African Rift ─────────────────────────────────────────────────
      [ 13.6,  40.7],  // Erta Ale, Ethiopia
      [ -1.4,  29.2],  // Nyamuragira, DRC
      [ -1.5,  29.2],  // Nyiragongo, DRC
      [ -2.8,  35.9],  // Ol Doinyo Lengai, Tanzania
      [ -3.1,  37.4],  // Kilimanjaro, Tanzania

      // ── Iceland / Mid-Atlantic Ridge ──────────────────────────────────────
      [ 63.9, -22.3],  // Fagradalsfjall
      [ 63.6, -19.6],  // Eyjafjallajökull
      [ 64.0, -19.7],  // Hekla
      [ 63.6, -19.1],  // Katla
      [ 64.4, -17.3],  // Grímsvötn

      // ── Hotspot volcanoes (not on plate boundaries) ───────────────────────
      [ 19.5,-155.6],  // Mauna Loa, Hawaii
      [ 19.4,-155.3],  // Kīlauea, Hawaii
      [  4.2,   9.2],  // Mount Cameroon, West Africa
      [-21.2,  55.7],  // Piton de la Fournaise, Réunion
      [-77.5, 167.2],  // Mount Erebus, Antarctica
    ];

    function renderVolcanoes() {
      const g  = document.getElementById('volcano-layer');
      const ns = 'http://www.w3.org/2000/svg';
      volcanoData.forEach(([lat, lon]) => {
        const [x, y] = latLonToSVG(lat, lon);
        // Upward-pointing triangle: peak at top, base below centre
        const pts = `${x.toFixed(1)},${(y - 5).toFixed(1)} ${(x - 4).toFixed(1)},${(y + 4).toFixed(1)} ${(x + 4).toFixed(1)},${(y + 4).toFixed(1)}`;
        const tri = document.createElementNS(ns, 'polygon');
        tri.setAttribute('points', pts);
        tri.setAttribute('class', 'volcano-marker');
        g.appendChild(tri);
      });
    }

    renderVolcanoes();

    // ── Mountain Chain Data ───────────────────────────────────────────────────
    const mountainData = [
      // ── Continental ranges ────────────────────────────────────────────────
      { name: 'Andes', pts: [
        [ 10.2, -67.4], [  7.1, -73.2], [  2.3, -77.1], [ -5.3, -78.2],
        [-10.1, -76.4], [-16.2, -70.3], [-20.1, -66.3], [-23.2, -66.1],
        [-27.4, -69.2], [-30.1, -70.1], [-33.2, -70.3], [-36.2, -71.1],
        [-39.2, -71.4], [-42.1, -72.3], [-46.1, -72.4], [-49.2, -73.1],
        [-52.3, -73.2], [-55.1, -68.8],
      ]},
      { name: 'Rocky Mountains', pts: [
        [ 62.1,-141.2], [ 58.3,-133.4], [ 54.2,-122.3], [ 51.1,-116.2],
        [ 48.1,-114.3], [ 46.2,-111.4], [ 43.1,-110.2], [ 40.2,-106.3],
        [ 39.1,-106.1], [ 37.2,-105.4], [ 36.1,-106.2], [ 34.1,-106.3],
      ]},
      { name: 'Appalachians', pts: [
        [ 33.2, -87.1], [ 35.1, -84.2], [ 37.2, -80.3], [ 38.6, -79.1],
        [ 40.1, -77.2], [ 41.6, -75.3], [ 43.1, -73.2], [ 44.2, -71.3],
        [ 46.1, -69.2],
      ]},
      { name: 'Alps', pts: [
        [ 44.1,   6.1], [ 44.6,   6.9], [ 45.6,   7.1], [ 46.1,   7.6],
        [ 46.6,   8.6], [ 47.1,  10.1], [ 47.1,  11.6], [ 47.1,  13.1],
        [ 46.6,  14.1], [ 46.3,  14.6],
      ]},
      { name: 'Himalayas', pts: [
        [ 36.1,  72.2], [ 35.1,  74.3], [ 34.2,  76.4], [ 32.3,  77.2],
        [ 30.6,  79.3], [ 29.1,  83.2], [ 28.1,  85.4], [ 27.6,  87.3],
        [ 27.1,  89.2], [ 28.1,  92.3], [ 27.2,  95.1], [ 26.2,  97.3],
      ]},
      { name: 'Urals', pts: [
        [ 68.1,  66.2], [ 65.2,  61.3], [ 62.1,  59.4], [ 60.2,  59.1],
        [ 58.1,  59.3], [ 56.2,  59.2], [ 54.1,  57.4], [ 52.2,  56.3],
        [ 50.1,  55.2],
      ]},
      { name: 'Atlas', pts: [
        [ 30.1,  -9.2], [ 32.1,  -6.3], [ 33.6,  -3.1], [ 34.6,  -1.2],
        [ 35.6,   1.1], [ 36.1,   3.2], [ 36.2,   6.1], [ 35.6,   8.6],
      ]},
      { name: 'Scandinavian Mountains', pts: [
        [ 70.1,  23.2], [ 68.1,  18.3], [ 66.2,  15.1], [ 64.1,  14.2],
        [ 62.1,   8.3], [ 61.1,   7.2], [ 60.1,   7.1], [ 59.1,   7.3],
      ]},
      { name: 'Great Dividing Range', pts: [
        [-16.1, 145.3], [-19.2, 147.1], [-22.3, 148.2], [-25.1, 150.3],
        [-28.2, 152.1], [-31.1, 151.3], [-34.2, 150.1], [-36.1, 148.3],
        [-37.2, 147.2], [-38.1, 146.3],
      ]},
      { name: 'Transantarctic Mountains', pts: [
        [-72.1, 170.2], [-74.1, 165.3], [-78.2, 160.1], [-80.1, 155.2],
        [-82.3, 150.1], [-83.2, 140.3], [-84.1, 120.2], [-85.2, 100.1],
      ]},

      // ── Underwater / mid-ocean ridges (dashed style) ──────────────────────
      { name: 'Mid-Atlantic Ridge', underwater: true, pts: [
        [ 70.1, -15.2], [ 65.1, -18.3], [ 55.2, -30.1], [ 45.1, -28.3],
        [ 35.2, -35.1], [ 25.1, -42.3], [ 15.2, -45.1], [  5.1, -25.3],
        [ -5.2, -15.1], [-15.1, -14.3], [-25.2, -13.1], [-35.1, -15.2],
        [-45.2, -15.1], [-55.1,  -5.2],
      ]},
      { name: 'East Pacific Rise', underwater: true, pts: [
        [ 50.1,-130.2], [ 40.2,-125.1], [ 25.1,-110.3], [ 15.2,-105.1],
        [  5.1,-103.2], [ -5.2,-108.1], [-15.1,-113.2], [-25.2,-115.1],
        [-40.1,-110.3],
      ]},
    ];

    function renderMountains() {
      const g  = document.getElementById('mountain-layer');
      const ns = 'http://www.w3.org/2000/svg';
      mountainData.forEach(({ name, pts, underwater }) => {
        const ptStr = pts.map(([lat, lon]) => {
          const [x, y] = latLonToSVG(lat, lon);
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');
        const pl = document.createElementNS(ns, 'polyline');
        pl.setAttribute('points', ptStr);
        pl.setAttribute('class', underwater ? 'mountain-path underwater' : 'mountain-path');
        pl.setAttribute('data-name', name);
        g.appendChild(pl);
      });
    }

    renderMountains();

    // ── Plate Boundary Data ───────────────────────────────────────────────────
    const plateBoundaryData = [
      // ── Pacific Plate — eastern boundary (East Pacific Rise / San Andreas) ──
      { name: 'Pacific-E', pts: [
        [-55.2,-125.1], [-35.1,-110.3], [-20.2,-113.1], [ -5.1,-105.2],
        [ 10.1,-104.3], [ 15.2,-105.1], [ 20.1,-108.2], [ 25.3,-110.1],
        [ 30.2,-117.3], [ 35.1,-121.2], [ 40.2,-125.1], [ 44.3,-130.2],
        [ 50.1,-130.3],
      ]},
      // ── Pacific Plate — northern boundary (Aleutian Trench) ──────────────
      { name: 'Pacific-N-W', pts: [
        [ 50.1,-130.3], [ 52.1,-145.2], [ 53.2,-155.1], [ 54.1,-163.2],
        [ 52.3,-170.1], [ 51.2,-178.3],
      ]},
      { name: 'Pacific-N-E', pts: [   // crosses date line — split segment
        [ 51.1, 175.2], [ 52.2, 165.3], [ 54.1, 160.2],
      ]},
      // ── Pacific Plate — western boundary (Kuril/Japan/Mariana/PNG) ───────
      { name: 'Pacific-W', pts: [
        [ 54.1, 160.2], [ 50.2, 157.3], [ 45.1, 150.2], [ 40.3, 144.1],
        [ 35.2, 140.3], [ 30.1, 138.2], [ 27.2, 140.1], [ 22.1, 143.3],
        [ 18.2, 147.1], [ 13.1, 148.2], [  8.3, 137.1], [  2.1, 135.2],
        [ -3.2, 140.1], [ -6.1, 147.3], [ -8.2, 152.1], [-12.1, 160.3],
        [-15.2, 168.1], [-20.1, 172.3],
      ]},
      // ── Pacific/Tonga boundary (Tonga-Kermadec Trench, crosses date line) ─
      { name: 'Tonga-W', pts: [
        [-20.1, 172.3], [-25.2, 178.1],
      ]},
      { name: 'Tonga-E', pts: [
        [-25.2,-178.3], [-30.1,-176.2],
      ]},
      // ── Indo-Australian / Pacific — New Zealand ───────────────────────────
      { name: 'NZ-boundary', pts: [
        [-30.1,-176.2], [-35.3,-179.1], [-38.2, 178.3], [-40.1, 176.2],
        [-43.2, 172.1], [-47.3, 166.2], [-50.2, 163.1], [-55.1, 155.3],
      ]},
      // ── Nazca / South American (Peru-Chile Trench) ────────────────────────
      { name: 'Peru-Chile Trench', pts: [
        [  5.1, -78.2], [  0.2, -81.1], [ -5.1, -82.3], [-10.2, -80.1],
        [-15.1, -76.3], [-18.2, -73.1], [-22.1, -71.2], [-25.2, -71.1],
        [-28.1, -72.2], [-31.2, -72.1], [-34.1, -73.2], [-38.3, -75.1],
        [-42.1, -76.3], [-46.2, -76.1],
      ]},
      // ── North American / Eurasian — Mid-Atlantic Ridge (north) ───────────
      { name: 'MAR-North', pts: [
        [ 80.1,   5.2], [ 73.2,   8.1], [ 68.1, -15.3], [ 65.2, -18.2],
        [ 62.1, -20.1], [ 55.3, -30.2], [ 48.1, -28.3], [ 43.2, -28.1],
        [ 38.1, -32.3], [ 33.2, -38.1], [ 28.1, -43.2], [ 23.2, -45.1],
      ]},
      // ── South American / African — Mid-Atlantic Ridge (south) ────────────
      { name: 'MAR-South', pts: [
        [ 23.2, -45.1], [ 18.1, -46.2], [ 12.3, -44.1], [  5.1, -32.2],
        [  0.2, -20.1], [ -5.1, -14.3], [-12.2, -14.1], [-20.1, -13.2],
        [-28.2, -13.1], [-35.1, -16.2], [-45.3, -14.1], [-55.2,  -5.1],
      ]},
      // ── African / Eurasian (Mediterranean / Alpine zone) ─────────────────
      { name: 'Afro-Eurasian', pts: [
        [ 38.1, -32.3], [ 36.2, -10.1], [ 37.1,  -2.3], [ 37.2,   5.1],
        [ 37.1,  10.2], [ 37.3,  15.1], [ 35.2,  22.3], [ 36.1,  28.2],
        [ 37.2,  32.1], [ 37.1,  38.3], [ 36.2,  42.1], [ 33.1,  48.3],
      ]},
      // ── Indian / Eurasian (Himalayan collision zone) ──────────────────────
      { name: 'Himalayan', pts: [
        [ 33.1,  48.3], [ 33.2,  55.1], [ 34.1,  62.3], [ 36.2,  70.1],
        [ 35.1,  74.2], [ 33.2,  76.1], [ 30.1,  80.3], [ 28.2,  85.1],
        [ 27.1,  89.2], [ 27.3,  93.1], [ 26.1,  96.3], [ 23.2,  98.1],
      ]},
      // ── Indian Ocean spreading ridge (SW Indian + Central Indian) ────────
      { name: 'IndianOcean-Ridge', pts: [
        [-55.2,  -5.1], [-55.1,  10.2], [-48.2,  30.1], [-40.1,  45.3],
        [-30.2,  60.1], [-20.1,  65.2], [-10.3,  68.1], [  0.2,  63.1],
        [  8.1,  58.2], [ 12.3,  44.1],
      ]},
      // ── East African Rift ─────────────────────────────────────────────────
      { name: 'EAR', pts: [
        [ 12.3,  44.1], [ 10.2,  40.3], [  7.1,  38.2], [  3.2,  36.1],
        [  0.1,  36.3], [ -2.1,  35.2], [ -5.3,  33.1], [ -8.2,  32.3],
        [-12.1,  34.2], [-15.2,  35.1],
      ]},
      // ── Sunda Trench (Indonesian subduction zone) ─────────────────────────
      { name: 'Sunda', pts: [
        [ 23.2,  98.1], [ 20.1,  96.3], [ 14.2,  94.1], [  8.1,  94.3],
        [  4.1,  96.2], [  0.2,  99.1], [ -4.1, 102.3], [ -7.2, 106.1],
        [ -9.1, 112.2], [-10.2, 118.1], [ -8.1, 125.3],
      ]},
      // ── Antarctic Plate boundary ──────────────────────────────────────────
      { name: 'Antarctic-E', pts: [
        [-55.1, 155.3], [-60.2, 140.1], [-62.1, 120.3], [-63.2, 100.1],
        [-64.1,  80.2], [-60.3,  60.1], [-58.1,  30.2], [-57.2,   0.1],
      ]},
      { name: 'Antarctic-W', pts: [
        [-57.2,   0.1], [-58.1, -25.3], [-60.2, -55.1], [-62.1, -65.3],
        [-60.1, -90.2], [-58.3,-120.1],
      ]},
    ];

    const plateLabels = [
      { name: 'Pacific Plate',            lat:   5, lon: -170 },
      { name: 'North American\nPlate',    lat:  50, lon:  -95 },
      { name: 'South American\nPlate',    lat: -15, lon:  -50 },
      { name: 'African Plate',            lat:   5, lon:   20 },
      { name: 'Eurasian Plate',           lat:  55, lon:   80 },
      { name: 'Indo-Australian\nPlate',   lat: -25, lon:  110 },
      { name: 'Antarctic Plate',          lat: -78, lon:    0 },
      { name: 'Nazca\nPlate',             lat: -20, lon: -100 },
    ];

    function renderPlateBoundaries() {
      const g  = document.getElementById('plate-boundary-layer');
      const ns = 'http://www.w3.org/2000/svg';

      // Draw boundary polylines
      plateBoundaryData.forEach(({ name, pts }) => {
        const ptStr = pts.map(([lat, lon]) => {
          const [x, y] = latLonToSVG(lat, lon);
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');
        const pl = document.createElementNS(ns, 'polyline');
        pl.setAttribute('points', ptStr);
        pl.setAttribute('class', 'plate-boundary');
        pl.setAttribute('data-name', name);
        g.appendChild(pl);
      });

      // Draw plate name labels
      plateLabels.forEach(({ name, lat, lon }) => {
        const [x, y] = latLonToSVG(lat, lon);
        const lines = name.split('\n');
        const txt = document.createElementNS(ns, 'text');
        txt.setAttribute('x', x.toFixed(1));
        txt.setAttribute('y', y.toFixed(1));
        txt.setAttribute('class', 'plate-label');
        if (lines.length === 1) {
          txt.textContent = name;
        } else {
          lines.forEach((line, i) => {
            const ts = document.createElementNS(ns, 'tspan');
            ts.setAttribute('x', x.toFixed(1));
            ts.setAttribute('dy', i === 0 ? '0' : '18');
            ts.textContent = line;
            txt.appendChild(ts);
          });
        }
        g.appendChild(txt);
      });
    }

    renderPlateBoundaries();

    // ── Guided Investigation + Free Explore Modes ────────────────────────────

    // Helper: fade a layer in (display:block → opacity:1)
    function showLayer(id) {
      const el = document.getElementById(id);
      el.style.display = 'block';
      el.style.opacity = '0';
      requestAnimationFrame(() => requestAnimationFrame(() => { el.style.opacity = '1'; }));
    }

    // Helper: fade a layer out, then hide
    function hideLayer(id) {
      const el = document.getElementById(id);
      el.style.opacity = '0';
      el.addEventListener('transitionend', function handler() {
        el.style.display = 'none';
        el.removeEventListener('transitionend', handler);
      });
    }

    // ── Layer order for guided steps (same in both languages) ────────────
    const LAYER_ORDER = [
      'plate-boundary-layer', 'earthquake-layer', 'volcano-layer', 'mountain-layer', null
    ];

    let currentStep = 1;

    function showGuidedStep(stepNum) {
      currentStep = stepNum;
      const T = translations[currentLang];
      const s = T.guidedSteps[stepNum - 1];
      const layerToShow = LAYER_ORDER[stepNum - 1];

      // Progress bar + ARIA
      document.getElementById('progress-bar').style.width = ((stepNum / 5) * 100) + '%';
      document.getElementById('progress-text').textContent = T.progressText(stepNum);
      const pbCont = document.getElementById('progress-bar-container');
      pbCont.setAttribute('aria-valuenow', stepNum);

      // Reveal this step's layer (layers accumulate — don't hide previous ones)
      if (layerToShow) showLayer(layerToShow);

      // Render step content
      const isLast = stepNum === 5;
      const btnText = isLast ? T.unlockBtn : T.nextStepBtn;
      document.getElementById('guided-content').innerHTML =
        '<div class="guided-step">' +
          '<h3>' + s.icon + ' ' + s.title + '</h3>' +
          '<p class="guided-explanation">' + s.question + '</p>' +
          '<div class="guided-prompt">' +
            '<label>' + s.prompt + '</label>' +
            '<textarea id="student-response" rows="3" placeholder="' + s.placeholder + '"></textarea>' +
          '</div>' +
          '<button id="next-step-btn" class="primary-btn">' + btnText + '</button>' +
        '</div>';

      document.getElementById('next-step-btn').addEventListener('click', () => {
        if (isLast) switchToExplore();
        else showGuidedStep(stepNum + 1);
      });

      // Move focus to textarea for keyboard users
      const ta = document.getElementById('student-response');
      if (ta) ta.focus();
    }

    // ── Free Explore mode ──────────────────────────────────────────────────
    function getExploreKey() {
      return [
        document.getElementById('toggle-plates').checked      ? '1' : '0',
        document.getElementById('toggle-earthquakes').checked  ? '1' : '0',
        document.getElementById('toggle-volcanoes').checked    ? '1' : '0',
        document.getElementById('toggle-mountains').checked    ? '1' : '0',
      ].join('');
    }

    function updateExploreTip() {
      const T = translations[currentLang];
      const key = getExploreKey();
      const tip = T.tips[key] || T.tips._default;
      document.getElementById('explore-info').innerHTML = '<p>' + tip + '</p>';
    }

    // ── Mode switcher ──────────────────────────────────────────────────────
    function showMode(modeId) {
      ['guided-mode','explore-mode','prediction-mode'].forEach(id => {
        document.getElementById(id).style.display = id === modeId ? 'flex' : 'none';
      });
    }

    function switchToExplore() {
      showMode('explore-mode');
      ['plate-boundary-layer','earthquake-layer','volcano-layer','mountain-layer'].forEach(id => showLayer(id));
      ['toggle-plates','toggle-earthquakes','toggle-volcanoes','toggle-mountains'].forEach(id => {
        document.getElementById(id).checked = true;
      });
      updateExploreTip();
      // Move focus to first toggle
      setTimeout(() => document.getElementById('toggle-plates').focus(), 50);
    }

    function switchToGuided() {
      showMode('guided-mode');
      ['plate-boundary-layer','earthquake-layer','volcano-layer','mountain-layer'].forEach(id => hideLayer(id));
      showGuidedStep(1);
    }

    // Wire up explore toggles
    const layerMap = {
      'toggle-plates':      'plate-boundary-layer',
      'toggle-earthquakes': 'earthquake-layer',
      'toggle-volcanoes':   'volcano-layer',
      'toggle-mountains':   'mountain-layer',
    };
    Object.entries(layerMap).forEach(([cbId, layerId]) => {
      document.getElementById(cbId).addEventListener('change', function() {
        if (this.checked) showLayer(layerId); else hideLayer(layerId);
        updateExploreTip();
      });
    });

    document.getElementById('restart-btn').addEventListener('click', switchToGuided);

    // ── Chunk 7B/9: Prediction Challenge Mode ─────────────────────────────────
    let earthquakePredictions = [];  // [{x, y}]
    let volcanoPredictions    = [];  // [{x, y}]
    let predPhase = 0;               // 1 = eq, 2 = vol, 3 = reveal
    let mapClickHandler = null;

    function removePredictionClickHandler() {
      if (mapClickHandler) {
        const svg = document.getElementById('world-map');
        svg.removeEventListener('click', mapClickHandler);
        svg.removeEventListener('touchend', mapClickHandler);
        mapClickHandler = null;
      }
    }

    function addPredictionClickHandler(onClickFn) {
      removePredictionClickHandler();
      const svg = document.getElementById('world-map');
      mapClickHandler = function(e) {
        // Support both mouse click and touch
        let clientX, clientY;
        if (e.changedTouches && e.changedTouches.length) {
          e.preventDefault(); // prevent scroll on touch
          clientX = e.changedTouches[0].clientX;
          clientY = e.changedTouches[0].clientY;
        } else {
          clientX = e.clientX;
          clientY = e.clientY;
        }
        const pt = svg.createSVGPoint();
        pt.x = clientX; pt.y = clientY;
        const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());
        onClickFn(svgPt.x, svgPt.y);
      };
      svg.addEventListener('click', mapClickHandler);
      svg.addEventListener('touchend', mapClickHandler, { passive: false });
    }

    function clearPredictions() {
      earthquakePredictions = [];
      volcanoPredictions    = [];
      const layer = document.getElementById('prediction-layer');
      while (layer.firstChild) layer.removeChild(layer.firstChild);
    }

    function placePredictionDot(x, y, type) {
      const ns  = 'http://www.w3.org/2000/svg';
      const lyr = document.getElementById('prediction-layer');
      if (type === 'eq') {
        const c = document.createElementNS(ns, 'circle');
        c.setAttribute('cx', x.toFixed(1));
        c.setAttribute('cy', y.toFixed(1));
        c.setAttribute('r', '6');
        c.setAttribute('class', 'prediction-earthquake');
        lyr.appendChild(c);
        earthquakePredictions.push({ x, y, el: c });
        document.getElementById('eq-count').textContent = earthquakePredictions.length;
      } else {
        const cx = x, cy = y;
        const pts = `${cx.toFixed(1)},${(cy-7).toFixed(1)} ${(cx-5).toFixed(1)},${(cy+5).toFixed(1)} ${(cx+5).toFixed(1)},${(cy+5).toFixed(1)}`;
        const tri = document.createElementNS(ns, 'polygon');
        tri.setAttribute('points', pts);
        tri.setAttribute('class', 'prediction-volcano');
        lyr.appendChild(tri);
        volcanoPredictions.push({ x, y, el: tri });
        document.getElementById('vol-count').textContent = volcanoPredictions.length;
      }
    }

    function undoLast(type) {
      const arr = type === 'eq' ? earthquakePredictions : volcanoPredictions;
      if (!arr.length) return;
      const last = arr.pop();
      last.el.parentNode.removeChild(last.el);
      const countId = type === 'eq' ? 'eq-count' : 'vol-count';
      document.getElementById(countId).textContent = arr.length;
    }

    function scorePredictions(predictions, realData, threshold) {
      let hits = 0;
      predictions.forEach(pred => {
        const isHit = realData.some(real => {
          const [rx, ry] = latLonToSVG(real[0], real[1]);
          return Math.sqrt((pred.x - rx) ** 2 + (pred.y - ry) ** 2) < threshold;
        });
        if (isHit) hits++;
      });
      return { hits, total: predictions.length };
    }

    function startPredictionChallenge() {
      // Hide all data layers; show plate boundaries as faint hint
      ['earthquake-layer','volcano-layer','mountain-layer'].forEach(id => {
        const el = document.getElementById(id);
        el.style.opacity = '0';
        el.style.display = 'none';
      });
      const pb = document.getElementById('plate-boundary-layer');
      pb.style.display = 'block';
      pb.style.opacity  = '1';
      pb.classList.add('hint-mode');

      clearPredictions();
      showMode('prediction-mode');
      showPredictionPhase1();
    }

    function showPredictionPhase1() {
      const T = translations[currentLang];
      predPhase = 1;
      document.getElementById('prediction-score').style.display = 'none';
      document.getElementById('prediction-instructions').innerHTML =
        '<div class="prediction-phase">' +
          '<span class="phase-label">' + T.phase1Label + '</span>' +
          '<p>' + T.phase1Q + '</p>' +
          '<p>' + T.phase1Desc + '</p>' +
          '<p style="font-size:12px;color:#888;">' + T.phaseHint + '</p>' +
          '<p class="dot-counter">' + T.phaseCounter + ' <span id="eq-count">0</span>' +
            ' <button id="undo-eq-btn" class="secondary-btn" style="margin:0 0 0 10px;padding:2px 10px;font-size:0.78rem;min-height:32px;">↩ ' + T.undoBtn + '</button></p>' +
        '</div>';
      document.getElementById('prediction-buttons').innerHTML =
        '<button id="phase2-btn" class="primary-btn">' + T.phase2Btn + '</button>';
      document.getElementById('phase2-btn').addEventListener('click', showPredictionPhase2);
      document.getElementById('undo-eq-btn').addEventListener('click', () => undoLast('eq'));

      document.getElementById('world-map').style.cursor = 'crosshair';
      addPredictionClickHandler((x, y) => placePredictionDot(x, y, 'eq'));
      document.getElementById('world-map').addEventListener('contextmenu', function undoEq(e) {
        e.preventDefault();
        undoLast('eq');
      });
    }

    function showPredictionPhase2() {
      const T = translations[currentLang];
      predPhase = 2;
      document.getElementById('prediction-instructions').innerHTML =
        '<div class="prediction-phase">' +
          '<span class="phase-label">' + T.phase2Label + '</span>' +
          '<p>' + T.phase2Q + '</p>' +
          '<p>' + T.phase2Desc + '</p>' +
          '<p style="font-size:12px;color:#888;">' + T.phaseHint + '</p>' +
          '<p class="dot-counter">' + T.phaseCounter + ' <span id="vol-count">0</span>' +
            ' <button id="undo-vol-btn" class="secondary-btn" style="margin:0 0 0 10px;padding:2px 10px;font-size:0.78rem;min-height:32px;">↩ ' + T.undoBtn + '</button></p>' +
        '</div>';
      document.getElementById('prediction-buttons').innerHTML =
        '<button id="reveal-btn" class="primary-btn">' + T.revealBtn + '</button>';
      document.getElementById('reveal-btn').addEventListener('click', revealResults);
      document.getElementById('undo-vol-btn').addEventListener('click', () => undoLast('vol'));

      addPredictionClickHandler((x, y) => placePredictionDot(x, y, 'vol'));
      document.getElementById('world-map').addEventListener('contextmenu', function undoVol(e) {
        e.preventDefault();
        undoLast('vol');
      });
    }

    function revealResults() {
      const T = translations[currentLang];
      predPhase = 3;
      removePredictionClickHandler();
      document.getElementById('world-map').style.cursor = '';

      // Restore plate boundaries to full opacity, show real data layers
      const pb = document.getElementById('plate-boundary-layer');
      pb.classList.remove('hint-mode');
      pb.style.opacity = '1';
      showLayer('earthquake-layer');
      showLayer('volcano-layer');

      // Fade prediction dots to half opacity
      document.getElementById('prediction-layer').querySelectorAll('circle, polygon').forEach(el => {
        el.style.opacity = '0.5';
      });

      // Score
      const eqR  = scorePredictions(earthquakePredictions, earthquakeData, 50);
      const volR = scorePredictions(volcanoPredictions,    volcanoData,    50);
      const eqT  = eqR.total + volR.total;
      const eqH  = eqR.hits  + volR.hits;
      const pct  = eqT === 0 ? 0 : eqH / eqT;
      const tier = T.scores.find(s => pct >= s.min) || T.scores[T.scores.length - 1];

      const scoreEl = document.getElementById('prediction-score');
      scoreEl.style.display = 'block';
      scoreEl.setAttribute('tabindex', '-1');
      scoreEl.innerHTML =
        '<div class="score-card">' +
          '<div class="score-emoji">' + tier.emoji + '</div>' +
          '<div class="score-text">'  + tier.msg   + '</div>' +
          '<div class="score-detail">' +
            T.scoreEqLabel  + ' ' + eqR.hits  + ' ' + T.scoreOf + ' ' + (eqR.total  || 0) + ' ' + T.scoreNearEq  + '<br>' +
            T.scoreVolLabel + ' ' + volR.hits + ' ' + T.scoreOf + ' ' + (volR.total || 0) + ' ' + T.scoreNearVol +
          '</div>' +
        '</div>';

      // Move focus to score card for accessibility
      setTimeout(() => scoreEl.focus(), 50);

      document.getElementById('prediction-instructions').innerHTML = '';
      document.getElementById('prediction-buttons').innerHTML =
        '<button id="retry-btn" class="primary-btn">' + T.retryBtn + '</button>' +
        '<button id="back-explore-btn" class="secondary-btn">' + T.backExploreBtn + '</button>';
      document.getElementById('retry-btn').addEventListener('click', () => {
        clearPredictions();
        startPredictionChallenge();
      });
      document.getElementById('back-explore-btn').addEventListener('click', () => {
        clearPredictions();
        switchToExplore();
      });
    }

    document.getElementById('prediction-btn').addEventListener('click', startPredictionChallenge);

    // ── Teacher bypass: triple-click on std badge → Free Explore ──────────
    let badgeClickCount = 0, badgeTimer = null;
    document.getElementById('stdBadge').addEventListener('click', () => {
      badgeClickCount++;
      if (badgeTimer) clearTimeout(badgeTimer);
      badgeTimer = setTimeout(() => { badgeClickCount = 0; }, 2000);
      if (badgeClickCount >= 3) {
        badgeClickCount = 0;
        clearTimeout(badgeTimer);
        switchToExplore();
      }
    });

    // ── Bilingual Support (English / Spanish) ────────────────────────────────
    let currentLang = 'en';

    const translations = {
      en: {
        langBtnLabel: '🇪🇸 Español',
        pageTitle: '🌎 Earth\'s Features Map Lab',
        footer: 'Built for Ogden School District &nbsp;|&nbsp; Aligned to Utah Science with Engineering Education (SEEd) Standards',
        legendEq: 'Earthquakes', legendVol: 'Volcanoes',
        legendMtn: 'Mountain Chains', legendPlate: 'Plate Boundaries',
        progressText: (n) => 'Step ' + n + ' of 5',
        nextStepBtn: 'Next Step →',
        unlockBtn: '🔓 Unlock Free Explore!',
        exploreTitle: '🔍 Free Explore',
        exploreSubtitle: 'Toggle layers on and off to explore patterns on your own!',
        togglePlates: '🟠 Plate Boundaries', toggleEq: '🔴 Earthquakes',
        toggleVol: '🔺 Volcanoes', toggleMtn: '⛰️ Mountain Chains',
        predChallengeBtnLabel: '🎯 Prediction Challenge',
        restartBtnLabel: '↩ Restart Investigation',
        predTitle: '🎯 Prediction Challenge',
        phase1Label: 'Phase 1 of 2',
        phase1Q: '<strong>Where do you think most earthquakes happen?</strong>',
        phase1Desc: 'Click on the map to place your predictions. Use the faint boundary lines as a clue!',
        phaseHint: '(Right-click to undo last dot)',
        phaseCounter: 'Predictions placed:',
        phase2Btn: 'Next: Predict Volcanoes →',
        phase2Label: 'Phase 2 of 2',
        phase2Q: '<strong>Now, where do you think volcanoes are located?</strong>',
        phase2Desc: 'Click to place volcano predictions. Hint: Think about where your earthquakes are!',
        revealBtn: '🔍 Reveal the Answer!',
        scores: [
          { min: 0.80, emoji: '🌟', msg: 'Amazing! You really understand where Earth\'s features are found!' },
          { min: 0.60, emoji: '🎉', msg: 'Great job! You found most of the major patterns!' },
          { min: 0.40, emoji: '👍', msg: 'Good work! You spotted many of the patterns. Compare your predictions to the real data to see what you missed.' },
          { min: 0,    emoji: '🔬', msg: 'Nice try, scientist! Look at where the real earthquakes and volcanoes are — what pattern do you see?' },
        ],
        scoreEqLabel: '🔴 Earthquakes:', scoreOf: 'of',
        scoreNearEq: 'predictions near real earthquakes',
        scoreVolLabel: '🔺 Volcanoes:',
        scoreNearVol: 'predictions near real volcanoes',
        undoBtn: 'Undo',
        retryBtn: '🔄 Try Again',
        backExploreBtn: '↩ Back to Free Explore',
        vocabSummary: '📖 Vocabulary',
        term_earthquake: 'Earthquake',
        def_earthquake: 'A sudden shaking of Earth\'s surface caused by movement along cracks in the crust.',
        term_volcano: 'Volcano',
        def_volcano: 'An opening in Earth\'s surface where melted rock (magma), gases, and ash can escape from deep underground.',
        term_mountain: 'Mountain chain',
        def_mountain: 'A long row of connected mountains that formed together, often stretching hundreds of miles.',
        term_plate: 'Tectonic plate',
        def_plate: 'One of the giant, slow-moving pieces of Earth\'s outer layer (crust) that fit together like a puzzle.',
        term_boundary: 'Plate boundary',
        def_boundary: 'The edges where two tectonic plates meet. Most earthquakes and volcanoes happen near these edges.',
        term_rof: 'Ring of Fire',
        def_rof: 'A horseshoe-shaped zone around the Pacific Ocean where many earthquakes and volcanoes occur.',
        term_ridge: 'Mid-ocean ridge',
        def_ridge: 'A long underwater mountain chain where plates pull apart and new ocean floor is created.',
        term_pattern: 'Pattern',
        def_pattern: 'Something that repeats in a way that is predictable. Scientists look for patterns in data to understand how the world works.',
        conceptsSummary: '🧠 Key Concepts',
        concept1: 'Most earthquakes and volcanoes happen in <strong>bands</strong> along the edges of tectonic plates.',
        concept2: 'These bands are often found where <strong>continents meet oceans</strong>.',
        concept3: 'Major mountain chains are usually found <strong>near the edges of continents</strong> or where plates push together.',
        concept4: 'Scientists study <strong>patterns in data</strong> — like maps — to understand how Earth\'s surface was shaped.',
        tips: {
          '0000': '👆 Toggle some layers on to explore the map!',
          '1000': '🔍 These lines divide Earth\'s surface into giant pieces called tectonic plates. Most of Earth\'s action happens along these edges!',
          '0100': '🔍 Notice how earthquakes form bands and lines, not random scattered dots. What shapes do you see?',
          '0010': '🔍 Volcanoes form a pattern very similar to earthquakes. The band around the Pacific Ocean is called the Ring of Fire!',
          '0001': '🔍 Most mountain chains are near the edges of continents. They form where plates push together over millions of years.',
          '0110': '🔍 See how earthquakes and volcanoes follow almost the exact same pattern? Both are caused by plate movement!',
          '1100': '🔍 Almost every earthquake dot sits right on a plate boundary line. That\'s because earthquakes happen when plates move against each other.',
          '1111': '🔍 All of Earth\'s major features — earthquakes, volcanoes, and mountains — cluster along plate boundaries. You\'ve discovered one of the biggest patterns in Earth science!',
          _default: '💡 Try different combinations to discover how Earth\'s features are connected!',
        },
        guidedSteps: [
          {
            icon: '🟠', title: 'Step 1: Plate Boundaries',
            question: 'Scientists have discovered that Earth\'s outer layer is cracked into giant pieces called <strong>tectonic plates</strong>. The orange dashed lines show where these plates meet — these are called <strong>plate boundaries</strong>.',
            prompt: 'Look at the plate boundaries on the map. Describe where you see most of the boundary lines. Are they spread evenly across the Earth, or do they follow a pattern?',
            placeholder: 'I notice that the plate boundaries...',
          },
          {
            icon: '🔴', title: 'Step 2: Earthquakes',
            question: 'Now the map shows where major <strong>earthquakes</strong> have happened (red dots). Earthquakes happen when tectonic plates push, pull, or slide against each other.',
            prompt: 'Compare the earthquake dots to the plate boundary lines. What pattern do you notice?',
            placeholder: 'When I compare earthquakes to plate boundaries, I see...',
          },
          {
            icon: '🔺', title: 'Step 3: Volcanoes',
            question: 'Now <strong>volcanoes</strong> appear on the map (orange triangles). Volcanoes often form where one plate slides under another, melting rock deep underground.',
            prompt: 'How does the pattern of volcanoes compare to the earthquakes and plate boundaries? Do you see any volcanoes that are NOT near a plate boundary?',
            placeholder: 'The volcanoes seem to...',
          },
          {
            icon: '⛰️', title: 'Step 4: Mountain Chains',
            question: 'Finally, the map shows major <strong>mountain chains</strong> (brown lines). Mountains often form when plates push together over millions of years, crumpling the land upward.',
            prompt: 'Where are most mountain chains located — in the middle of continents, or near the edges? How do they relate to the plate boundaries?',
            placeholder: 'I notice that mountain chains are mostly...',
          },
          {
            icon: '🌎', title: 'Step 5: The Big Pattern',
            question: 'Now you can see all four layers together: plate boundaries, earthquakes, volcanoes, and mountain chains. You\'ve just discovered one of the biggest patterns in Earth science!',
            prompt: 'Describe the big pattern you see. How are earthquakes, volcanoes, and mountains connected to plate boundaries?',
            placeholder: 'The big pattern I discovered is...',
          },
        ],
        plateLabels: [
          { lat:   5, lon: -170, name: 'Pacific Plate' },
          { lat:  50, lon:  -95, name: 'North American\nPlate' },
          { lat: -15, lon:  -50, name: 'South American\nPlate' },
          { lat:   5, lon:   20, name: 'African Plate' },
          { lat:  55, lon:   80, name: 'Eurasian Plate' },
          { lat: -25, lon:  110, name: 'Indo-Australian\nPlate' },
          { lat: -78, lon:    0, name: 'Antarctic Plate' },
          { lat: -20, lon: -100, name: 'Nazca\nPlate' },
        ],
      },

      es: {
        langBtnLabel: '🇺🇸 English',
        pageTitle: '🌎 Laboratorio de Características de la Tierra',
        footer: 'Creado para el Distrito Escolar de Ogden &nbsp;|&nbsp; Alineado con los Estándares Utah SEEd',
        legendEq: 'Terremotos', legendVol: 'Volcanes',
        legendMtn: 'Cadenas Montañosas', legendPlate: 'Límites de Placas',
        progressText: (n) => 'Paso ' + n + ' de 5',
        nextStepBtn: 'Siguiente Paso →',
        unlockBtn: '🔓 ¡Explorar Libremente!',
        exploreTitle: '🔍 Exploración Libre',
        exploreSubtitle: '¡Activa y desactiva capas para explorar patrones por tu cuenta!',
        togglePlates: '🟠 Límites de Placas', toggleEq: '🔴 Terremotos',
        toggleVol: '🔺 Volcanes', toggleMtn: '⛰️ Cadenas Montañosas',
        predChallengeBtnLabel: '🎯 Desafío de Predicción',
        restartBtnLabel: '↩ Reiniciar Investigación',
        predTitle: '🎯 Desafío de Predicción',
        phase1Label: 'Fase 1 de 2',
        phase1Q: '<strong>¿Dónde crees que ocurren la mayoría de los terremotos?</strong>',
        phase1Desc: '¡Haz clic en el mapa para colocar tus predicciones. Usa las líneas tenues como pista!',
        phaseHint: '(Clic derecho para deshacer el último punto)',
        phaseCounter: 'Predicciones colocadas:',
        phase2Btn: 'Siguiente: Predice Volcanes →',
        phase2Label: 'Fase 2 de 2',
        phase2Q: '<strong>Ahora, ¿dónde crees que están los volcanes?</strong>',
        phase2Desc: '¡Haz clic para colocar volcanes. Pista: ¡Piensa en dónde están tus terremotos!',
        revealBtn: '🔍 ¡Revelar la Respuesta!',
        scores: [
          { min: 0.80, emoji: '🌟', msg: '¡Increíble! ¡Realmente entiendes dónde se encuentran las características de la Tierra!' },
          { min: 0.60, emoji: '🎉', msg: '¡Muy bien! ¡Encontraste la mayoría de los patrones importantes!' },
          { min: 0.40, emoji: '👍', msg: '¡Buen trabajo! Notaste muchos patrones. Compara tus predicciones con los datos reales para ver lo que te faltó.' },
          { min: 0,    emoji: '🔬', msg: '¡Buen intento, científico! Observa dónde están los terremotos y volcanes reales — ¿qué patrón ves?' },
        ],
        scoreEqLabel: '🔴 Terremotos:', scoreOf: 'de',
        scoreNearEq: 'predicciones cerca de terremotos reales',
        scoreVolLabel: '🔺 Volcanes:',
        scoreNearVol: 'predicciones cerca de volcanes reales',
        undoBtn: 'Deshacer',
        retryBtn: '🔄 Intentar de Nuevo',
        backExploreBtn: '↩ Volver a Exploración Libre',
        vocabSummary: '📖 Vocabulario',
        term_earthquake: 'Terremoto',
        def_earthquake: 'Un sacudimiento repentino de la superficie terrestre causado por el movimiento a lo largo de grietas en la corteza.',
        term_volcano: 'Volcán',
        def_volcano: 'Una apertura en la superficie de la Tierra por donde la roca derretida (magma), gases y ceniza pueden escapar desde las profundidades.',
        term_mountain: 'Cadena montañosa',
        def_mountain: 'Una larga fila de montañas conectadas que se formaron juntas, frecuentemente extendiéndose por cientos de millas.',
        term_plate: 'Placa tectónica',
        def_plate: 'Una de las piezas gigantes y de movimiento lento de la capa exterior de la Tierra (corteza) que encajan como un rompecabezas.',
        term_boundary: 'Límite de placa',
        def_boundary: 'Los bordes donde se encuentran dos placas tectónicas. La mayoría de los terremotos y volcanes ocurren cerca de estos bordes.',
        term_rof: 'Anillo de Fuego',
        def_rof: 'Una zona en forma de herradura alrededor del Océano Pacífico donde ocurren muchos terremotos y volcanes.',
        term_ridge: 'Dorsal oceánica',
        def_ridge: 'Una larga cadena montañosa submarina donde las placas se separan y se crea nuevo fondo oceánico.',
        term_pattern: 'Patrón',
        def_pattern: 'Algo que se repite de manera predecible. Los científicos buscan patrones en los datos para entender cómo funciona el mundo.',
        conceptsSummary: '🧠 Conceptos Clave',
        concept1: 'La mayoría de los terremotos y volcanes ocurren en <strong>franjas</strong> a lo largo de los bordes de las placas tectónicas.',
        concept2: 'Estas franjas se encuentran frecuentemente donde <strong>los continentes se encuentran con los océanos</strong>.',
        concept3: 'Las principales cadenas montañosas generalmente se encuentran <strong>cerca de los bordes de los continentes</strong> o donde las placas se empujan.',
        concept4: 'Los científicos estudian <strong>patrones en los datos</strong> — como los mapas — para entender cómo se formó la superficie de la Tierra.',
        tips: {
          '0000': '👆 ¡Activa algunas capas para explorar el mapa!',
          '1000': '🔍 Estas líneas dividen la superficie de la Tierra en grandes piezas llamadas placas tectónicas. ¡La mayoría de la actividad de la Tierra ocurre a lo largo de estos bordes!',
          '0100': '🔍 Observa cómo los terremotos forman franjas y líneas, no puntos dispersos al azar. ¿Qué formas ves?',
          '0010': '🔍 Los volcanes forman un patrón muy similar a los terremotos. ¡La franja alrededor del Océano Pacífico se llama el Anillo de Fuego!',
          '0001': '🔍 La mayoría de las cadenas montañosas están cerca de los bordes de los continentes. Se forman donde las placas se empujan durante millones de años.',
          '0110': '🔍 ¿Ves cómo los terremotos y los volcanes siguen casi el mismo patrón? ¡Ambos son causados por el movimiento de las placas!',
          '1100': '🔍 Casi cada punto de terremoto está justo sobre una línea de límite de placa. ¡Eso es porque los terremotos ocurren cuando las placas se mueven!',
          '1111': '🔍 ¡Todas las características de la Tierra — terremotos, volcanes y montañas — se agrupan a lo largo de los límites de las placas. ¡Has descubierto uno de los patrones más importantes de las Ciencias de la Tierra!',
          _default: '💡 ¡Prueba diferentes combinaciones para descubrir cómo están conectadas las características de la Tierra!',
        },
        guidedSteps: [
          {
            icon: '🟠', title: 'Paso 1: Límites de Placas',
            question: 'Los científicos han descubierto que la capa exterior de la Tierra está agrietada en piezas gigantes llamadas <strong>placas tectónicas</strong>. Las líneas naranjas punteadas muestran dónde se encuentran estas placas — se llaman <strong>límites de placas</strong>.',
            prompt: 'Observa los límites de las placas en el mapa. Describe dónde ves la mayoría de las líneas. ¿Están distribuidas uniformemente por la Tierra, o siguen un patrón?',
            placeholder: 'Noto que los límites de las placas...',
          },
          {
            icon: '🔴', title: 'Paso 2: Terremotos',
            question: 'Ahora el mapa muestra dónde han ocurrido los principales <strong>terremotos</strong> (puntos rojos). Los terremotos ocurren cuando las placas tectónicas se empujan, se jalan o se deslizan una contra la otra.',
            prompt: 'Compara los puntos de terremotos con las líneas de límites de placas. ¿Qué patrón notas?',
            placeholder: 'Cuando comparo los terremotos con los límites de placas, veo...',
          },
          {
            icon: '🔺', title: 'Paso 3: Volcanes',
            question: 'Ahora aparecen <strong>volcanes</strong> en el mapa (triángulos naranjas). Los volcanes frecuentemente se forman donde una placa se desliza debajo de otra, derritiendo la roca en las profundidades.',
            prompt: '¿Cómo se compara el patrón de volcanes con los terremotos y los límites de placas? ¿Ves algún volcán que NO esté cerca de un límite de placa?',
            placeholder: 'Los volcanes parecen...',
          },
          {
            icon: '⛰️', title: 'Paso 4: Cadenas Montañosas',
            question: 'Por último, el mapa muestra las principales <strong>cadenas montañosas</strong> (líneas cafés). Las montañas frecuentemente se forman cuando las placas se empujan juntas durante millones de años, arrugando la tierra hacia arriba.',
            prompt: '¿Dónde están ubicadas la mayoría de las cadenas montañosas — en el centro de los continentes o cerca de los bordes? ¿Cómo se relacionan con los límites de las placas?',
            placeholder: 'Noto que las cadenas montañosas están principalmente...',
          },
          {
            icon: '🌎', title: 'Paso 5: El Gran Patrón',
            question: 'Ahora puedes ver las cuatro capas juntas: límites de placas, terremotos, volcanes y cadenas montañosas. ¡Acabas de descubrir uno de los patrones más grandes en las Ciencias de la Tierra!',
            prompt: 'Describe el gran patrón que ves. ¿Cómo están conectados los terremotos, volcanes y montañas con los límites de las placas?',
            placeholder: 'El gran patrón que descubrí es...',
          },
        ],
        plateLabels: [
          { lat:   5, lon: -170, name: 'Placa del\nPacífico' },
          { lat:  50, lon:  -95, name: 'Placa de\nNorteamérica' },
          { lat: -15, lon:  -50, name: 'Placa de\nSudamérica' },
          { lat:   5, lon:   20, name: 'Placa\nAfricana' },
          { lat:  55, lon:   80, name: 'Placa\nEurásica' },
          { lat: -25, lon:  110, name: 'Placa\nIndoaustraliana' },
          { lat: -78, lon:    0, name: 'Placa\nAntártica' },
          { lat: -20, lon: -100, name: 'Placa\nde Nazca' },
        ],
      },
    };

    // ── Re-render plate labels in current language ─────────────────────────
    function renderPlateLabels() {
      const g  = document.getElementById('plate-boundary-layer');
      const ns = 'http://www.w3.org/2000/svg';
      // Remove existing label text elements
      g.querySelectorAll('text.plate-label').forEach(el => el.parentNode.removeChild(el));
      // Add labels for current language
      translations[currentLang].plateLabels.forEach(({ name, lat, lon }) => {
        const [x, y] = latLonToSVG(lat, lon);
        const lines  = name.split('\n');
        const txt    = document.createElementNS(ns, 'text');
        txt.setAttribute('x', x.toFixed(1));
        txt.setAttribute('y', y.toFixed(1));
        txt.setAttribute('class', 'plate-label');
        if (lines.length === 1) {
          txt.textContent = name;
        } else {
          lines.forEach((line, i) => {
            const ts = document.createElementNS(ns, 'tspan');
            ts.setAttribute('x', x.toFixed(1));
            ts.setAttribute('dy', i === 0 ? '0' : '18');
            ts.textContent = line;
            txt.appendChild(ts);
          });
        }
        g.appendChild(txt);
      });
    }

    // ── Apply all translations to the page ────────────────────────────────
    function applyTranslations() {
      const T = translations[currentLang];
      document.documentElement.lang = currentLang;
      // Update all static data-i18n elements
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (T[key] !== undefined) el.innerHTML = T[key];
      });
      // Re-render plate labels in new language
      renderPlateLabels();
      // Re-render the active mode with new language
      if (document.getElementById('guided-mode').style.display !== 'none') {
        showGuidedStep(currentStep);
      } else if (document.getElementById('explore-mode').style.display !== 'none') {
        updateExploreTip();
      } else if (document.getElementById('prediction-mode').style.display !== 'none') {
        // Re-render whichever prediction phase is active
        if      (predPhase === 1) showPredictionPhase1();
        else if (predPhase === 2) showPredictionPhase2();
        // Phase 3 (score card) — just re-render the static buttons/title; score stays
        else if (predPhase === 3) {
          document.getElementById('prediction-buttons').innerHTML =
            '<button id="retry-btn" class="primary-btn">' + T.retryBtn + '</button>' +
            '<button id="back-explore-btn" class="secondary-btn">' + T.backExploreBtn + '</button>';
          document.getElementById('retry-btn').addEventListener('click', () => {
            clearPredictions(); startPredictionChallenge();
          });
          document.getElementById('back-explore-btn').addEventListener('click', () => {
            clearPredictions(); switchToExplore();
          });
        }
      }
    }

    // ── Language toggle ────────────────────────────────────────────────────
    document.getElementById('langBtn').addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'es' : 'en';
      applyTranslations();
    });

    // ── Start in guided mode at step 1 ────────────────────────────────────
    showGuidedStep(1);
  </script>

</body>
</html>
'@

# Write final file
$outPath = "$base\index.html"
$content = $before + $pathBlock + $after
[System.IO.File]::WriteAllText($outPath, $content, [System.Text.Encoding]::UTF8)

$size = (Get-Item $outPath).Length
Write-Host "Written: $outPath ($([Math]::Round($size/1024, 1)) KB)"

