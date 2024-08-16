export default function () {
  window.debugTimeout = 0;
  window.debugCount = 0;
  window.isDebug = false;

  function initDebugBtn() {
    // debug
    var scriptEl = document.createElement('script');
    scriptEl.src = '//cdn.jsdelivr.net/npm/eruda';
    scriptEl.onload = function () {
      let el = document.createElement('div');
      el.id = 'debug'
    //   el.style.display = 'none';
      document.body.appendChild(el);
      window.eruda.init({ container: el });
    };
    document.body.appendChild(scriptEl);
    // debugBtn
    var debugEl = document.createElement('div');
    debugEl.style.position = 'absolute';
    debugEl.style.width = '20px';
    debugEl.style.height = '20px';
    debugEl.style.top = '0';
    debugEl.style.left = '0';
    debugEl.style.zIndex = '10000';
    debugEl.onclick = debug;
    document.body.appendChild(debugEl);
  }
  function debug() {
    if (window.isDebug) return;
    window.debugCount++;
    if (window.debugCount === 10) openDebug();
    resetDebugTimeout();
  }

  function resetDebugTimeout() {
    clearTimeout(window.debugTimeout);
    window.debugTimeout = setTimeout(function () {
      window.debugTimeout = 0;
      window.debugCount = 0;
    }, 400);
  }

  function openDebug() {
    window.isDebug = true;
    const doc = document.getElementById('debug')
    if (doc && doc.style) {
      doc.style.display = 'block';
    }
  }

  initDebugBtn();
}
