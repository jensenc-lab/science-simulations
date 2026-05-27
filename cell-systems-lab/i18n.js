// i18n.js — translation strings + helpers for Cell Systems Lab.
// Modules look up strings via t('key'). Static elements opt in by
// adding data-i18n="key" attributes; applyTranslations() walks the DOM
// and sets textContent for each. setLanguage(lang) updates AppState,
// re-runs the DOM walk, and dispatches a `language-changed` event so
// modules can re-render any dynamic UI they own.

const I18N = {
  en: {
    // App chrome
    'app.district': 'Ogden School District',
    'app.title': 'Cell Systems Lab',
    'app.subtitle': 'Utah SEEd Standard 7.3.2 — The Cell as a System',
    'app.footer': 'Built for Ogden School District | Aligned to Utah SEEd Standard 7.3.2',
    'lang.toggle': 'Español',

    // Cell type
    'cell.animal': 'Animal Cell',
    'cell.plant': 'Plant Cell',

    // Modes
    'mode.explore': 'Explore',
    'mode.system': 'System View',
    'mode.challenge': 'Challenge',

    // Explore
    'explore.hint': 'Click an organelle to learn about it.',
    'explore.section.structure': '📐 Structure',
    'explore.section.function': '⚙️ Function',
    'explore.section.system': '🔗 In the System',
    'badge.both': 'Found in: Plants & Animals',
    'badge.plant': 'Found in: Plants only',
    'badge.animal': 'Found in: Animals only',
    'explore.close': 'Close',

    // System view — status
    'system.status': 'Cell Status',
    'status.healthy': '✓ Healthy',
    'status.warning': '⚠ Failing',
    'status.critical': '✗ Critical',
    'status.dead': '✗ Cell Dead',
    'status.detail.allActive': 'All flows active',
    'status.detail.flowsActive': '{active} of {total} flows active',
    'status.detail.starving': '· {count} organelle(s) starving',
    'status.detail.dyingIn': 'Cell dying in {seconds}s',
    'status.detail.dead': 'Click Reset to revive',

    // System view — controls
    'button.pause': '⏸ Pause',
    'button.play': '▶ Play',
    'button.reset': '↻ Reset',
    'system.help': 'Click any organelle to disable it. Watch which flows stop and which other organelles fail as a result.',
    'system.disabled.heading': 'Disabled',
    'system.disabled.empty': 'None — all organelles working.',
    'system.disabled.enable': 'enable',
    'system.starving.label': 'starving',
    'system.starving.reason': 'starving (no {input})',
    'system.legend.heading': 'Legend',

    // Particle/flow names (for legend + starving reasons)
    'particle.sunlight': 'Sunlight',
    'particle.co2': 'CO₂',
    'particle.h2o': 'H₂O',
    'particle.o2': 'O₂',
    'particle.glucose': 'Glucose',
    'particle.atp': 'ATP',
    'particle.mrna': 'mRNA',

    // Challenge — chrome
    'challenge.progressLabel': 'Challenge',
    'challenge.of': 'of',
    'challenge.score': 'Score:',
    'challenge.instruction': '🔎 Click the organelle in the cell that you think is broken.',
    'challenge.button.hint': 'Show Hint',
    'challenge.button.reveal': 'Reveal Answer',
    'challenge.button.next': 'Next →',
    'challenge.button.startover': 'Start Over',

    // Challenge — feedback
    'feedback.correctFull': '✓ Correct! (1 point — nice work!)',
    'feedback.correctHalf': '✓ Correct! (½ point earned)',
    'feedback.wrongFirst': '✗ Not quite. Try again.',
    'feedback.wrongAgain': "✗ Still not right. Look more carefully at the flows and what's starving.",
    'feedback.wrongTip': "If you'd like to see the answer, click Reveal.",
    'feedback.hintLabel': '💡 Hint:',
    'feedback.hintCost': '(Using a hint caps this challenge at ½ point.)',
    'feedback.wrongCost': '(Max ½ point for this challenge after a wrong attempt.)',
    'feedback.revealedPrefix': 'The broken organelle was',
    'feedback.revealedSuffix': '(0 points — answer revealed)',

    // Challenge — summary
    'summary.heading': 'Challenges Complete!',
    'summary.outOf': 'out of',
    'summary.master.emoji': '🎉',
    'summary.master.title': 'Cell Master!',
    'summary.master.desc': 'You diagnosed the cell as a system with strong, clean reasoning.',
    'summary.strong.emoji': '👍',
    'summary.strong.title': 'Strong Work',
    'summary.strong.desc': "You're reading the system well. Review the trickier cascades and try again.",
    'summary.practice.emoji': '💪',
    'summary.practice.title': 'Keep Practicing',
    'summary.practice.desc': "You're building the model. Try Explore and System View again, then come back to these puzzles.",
    'summary.start.emoji': '🌱',
    'summary.start.title': 'Start Again',
    'summary.start.desc': 'These puzzles are tough. Spend some time in Explore and System View to see how the organelles work together, then return.'
  },
  es: {
    // App chrome
    'app.district': 'Distrito Escolar de Ogden',
    'app.title': 'Laboratorio de Sistemas Celulares',
    'app.subtitle': 'Estándar SEEd de Utah 7.3.2 — La célula como sistema',
    'app.footer': 'Creado para el Distrito Escolar de Ogden | Alineado con el Estándar SEEd de Utah 7.3.2',
    'lang.toggle': 'English',

    // Cell type
    'cell.animal': 'Célula Animal',
    'cell.plant': 'Célula Vegetal',

    // Modes
    'mode.explore': 'Explorar',
    'mode.system': 'Vista del Sistema',
    'mode.challenge': 'Desafío',

    // Explore
    'explore.hint': 'Haz clic en un organelo para aprender más sobre él.',
    'explore.section.structure': '📐 Estructura',
    'explore.section.function': '⚙️ Función',
    'explore.section.system': '🔗 En el sistema',
    'badge.both': 'Presente en: plantas y animales',
    'badge.plant': 'Presente en: solo plantas',
    'badge.animal': 'Presente en: solo animales',
    'explore.close': 'Cerrar',

    // System view — status
    'system.status': 'Estado de la célula',
    'status.healthy': '✓ Sana',
    'status.warning': '⚠ Fallando',
    'status.critical': '✗ Crítica',
    'status.dead': '✗ Célula muerta',
    'status.detail.allActive': 'Todos los flujos están activos',
    'status.detail.flowsActive': '{active} de {total} flujos activos',
    'status.detail.starving': '· {count} organelo(s) hambriento(s)',
    'status.detail.dyingIn': 'La célula muere en {seconds}s',
    'status.detail.dead': 'Haz clic en Reiniciar para revivir',

    // System view — controls
    'button.pause': '⏸ Pausar',
    'button.play': '▶ Reanudar',
    'button.reset': '↻ Reiniciar',
    'system.help': 'Haz clic en cualquier organelo para desactivarlo. Observa qué flujos se detienen y qué otros organelos fallan en consecuencia.',
    'system.disabled.heading': 'Desactivados',
    'system.disabled.empty': 'Ninguno — todos los organelos están funcionando.',
    'system.disabled.enable': 'activar',
    'system.starving.label': 'en inanición',
    'system.starving.reason': 'en inanición (sin {input})',
    'system.legend.heading': 'Leyenda',

    // Particle/flow names
    'particle.sunlight': 'Luz solar',
    'particle.co2': 'CO₂',
    'particle.h2o': 'H₂O',
    'particle.o2': 'O₂',
    'particle.glucose': 'Glucosa',
    'particle.atp': 'ATP',
    'particle.mrna': 'ARNm',

    // Challenge — chrome
    'challenge.progressLabel': 'Desafío',
    'challenge.of': 'de',
    'challenge.score': 'Puntuación:',
    'challenge.instruction': '🔎 Haz clic en el organelo de la célula que crees que está dañado.',
    'challenge.button.hint': 'Mostrar pista',
    'challenge.button.reveal': 'Revelar respuesta',
    'challenge.button.next': 'Siguiente →',
    'challenge.button.startover': 'Empezar de nuevo',

    // Challenge — feedback
    'feedback.correctFull': '✓ ¡Correcto! (1 punto — ¡bien hecho!)',
    'feedback.correctHalf': '✓ ¡Correcto! (½ punto ganado)',
    'feedback.wrongFirst': '✗ No exactamente. Intenta de nuevo.',
    'feedback.wrongAgain': '✗ Todavía no. Observa con más atención los flujos y qué organelos están hambrientos.',
    'feedback.wrongTip': 'Si quieres ver la respuesta, haz clic en Revelar.',
    'feedback.hintLabel': '💡 Pista:',
    'feedback.hintCost': '(Usar una pista limita este desafío a ½ punto.)',
    'feedback.wrongCost': '(Máximo ½ punto para este desafío después de un intento incorrecto.)',
    'feedback.revealedPrefix': 'El organelo dañado era',
    'feedback.revealedSuffix': '(0 puntos — respuesta revelada)',

    // Challenge — summary
    'summary.heading': '¡Desafíos completados!',
    'summary.outOf': 'de',
    'summary.master.emoji': '🎉',
    'summary.master.title': '¡Maestro celular!',
    'summary.master.desc': 'Diagnosticaste la célula como un sistema con un razonamiento claro y sólido.',
    'summary.strong.emoji': '👍',
    'summary.strong.title': 'Buen trabajo',
    'summary.strong.desc': 'Estás interpretando bien el sistema. Repasa las cascadas más difíciles y vuelve a intentarlo.',
    'summary.practice.emoji': '💪',
    'summary.practice.title': 'Sigue practicando',
    'summary.practice.desc': 'Estás construyendo el modelo. Vuelve a Explorar y Vista del Sistema, y luego regresa a estos rompecabezas.',
    'summary.start.emoji': '🌱',
    'summary.start.title': 'Empieza de nuevo',
    'summary.start.desc': 'Estos rompecabezas son difíciles. Pasa más tiempo en Explorar y Vista del Sistema para ver cómo trabajan juntos los organelos, y luego regresa.'
  }
};

function getCurrentLang() {
  return (window.AppState && window.AppState.currentLang) || 'en';
}

function t(key, vars) {
  const lang = getCurrentLang();
  let str = (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key;
  if (vars) {
    Object.keys(vars).forEach(function (k) {
      str = str.split('{' + k + '}').join(String(vars[k]));
    });
  }
  return str;
}

function applyTranslations(root) {
  const scope = root || document;
  scope.querySelectorAll('[data-i18n]').forEach(function (el) {
    el.textContent = t(el.dataset.i18n);
  });
}

function setLanguage(lang) {
  if (lang !== 'en' && lang !== 'es') return;
  if (window.AppState) window.AppState.currentLang = lang;
  document.documentElement.setAttribute('lang', lang);
  applyTranslations();
  document.dispatchEvent(new CustomEvent('language-changed', { detail: { lang: lang } }));
}

// localize(record) merges a content record's shared fields (icon,
// foundIn, cellType, id, brokenOrganelle, …) with its language-specific
// fields (name, tagline, structure, title, scenario, …) into one flat
// object. Falls back to English if the active language is missing.
function localize(record) {
  if (!record) return null;
  const lang = getCurrentLang();
  const localized = record[lang] || record.en || {};
  return Object.assign({}, record, localized);
}

window.I18N = I18N;
window.t = t;
window.applyTranslations = applyTranslations;
window.setLanguage = setLanguage;
window.localize = localize;
