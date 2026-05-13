// Fullscreen toggle for the simulation page.
// Uses the standard Fullscreen API with a Safari prefix fallback.
(function () {
  function isFullscreen() {
    return document.fullscreenElement || document.webkitFullscreenElement;
  }
  function enterFullscreen() {
    var el = document.documentElement;
    if (el.requestFullscreen) return el.requestFullscreen();
    if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
  }
  function exitFullscreen() {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
  }
  function updateButton(button) {
    var inFS = !!isFullscreen();
    button.setAttribute('aria-label', inFS ? 'Exit fullscreen' : 'Enter fullscreen');
    button.setAttribute('title', inFS ? 'Exit fullscreen' : 'Enter fullscreen');
    button.classList.toggle('fs-toggle--active', inFS);
  }
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('fullscreen-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (isFullscreen()) { exitFullscreen(); } else { enterFullscreen(); }
    });
    document.addEventListener('fullscreenchange', function () { updateButton(btn); });
    document.addEventListener('webkitfullscreenchange', function () { updateButton(btn); });
    updateButton(btn);
  });
})();
