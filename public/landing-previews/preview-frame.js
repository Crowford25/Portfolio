(function () {
  'use strict';

  var expanded = false;
  var viewportHeight = 0;
  var queuedFrame = 0;
  var lastHeight = 0;
  var visibleTop = 0;
  var visibleHeight = 100;
  var originalVisibleVars = ['--preview-visible-top', '--preview-visible-height'].map(function (name) {
    return {
      name: name,
      value: document.documentElement.style.getPropertyValue(name),
      priority: document.documentElement.style.getPropertyPriority(name)
    };
  });
  var originalStyles = Array.from(document.querySelectorAll('style')).map(function (node) {
    return { node: node, text: node.textContent };
  });
  var expandedStyle = document.createElement('style');
  expandedStyle.setAttribute('data-portfolio-preview', 'expanded');
  expandedStyle.textContent =
    'html{height:auto!important;min-height:0!important;overflow:hidden!important}' +
    'body{display:flow-root!important;height:auto!important;min-height:0!important;overflow:visible!important}' +
    'dialog[open]{position:fixed!important;top:calc(var(--preview-visible-top) + 12px)!important;bottom:auto!important;margin-block:0!important;max-height:calc(var(--preview-visible-height) - 24px)!important}';

  function setVisibleViewport(top, height) {
    visibleTop = Math.min(60000, Math.max(0, top));
    visibleHeight = Math.min(5000, Math.max(100, height));
    if (!expanded) return;
    document.documentElement.style.setProperty('--preview-visible-top', visibleTop + 'px');
    document.documentElement.style.setProperty('--preview-visible-height', visibleHeight + 'px');
  }

  function validNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
  }

  function sendSize() {
    queuedFrame = 0;
    if (!expanded || !document.body) return;

    var height = Math.min(60000, Math.max(1, Math.ceil(Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight
    ))));
    if (lastHeight && Math.abs(height - lastHeight) <= 1) return;
    lastHeight = height;
    window.parent.postMessage({ type: 'portfolio:preview-size', height: height }, '*');
  }

  function scheduleSize() {
    if (expanded && !queuedFrame) queuedFrame = window.requestAnimationFrame(sendSize);
  }

  function freezeViewportUnits() {
    // A content-height iframe must not make its own viewport-height sections grow again.
    originalStyles.forEach(function (entry) {
      entry.node.textContent = entry.text.replace(
        /(-?\d*\.?\d+)(?:svh|dvh|lvh|vh)\b/gi,
        function (_, amount) {
          return (Math.round(Number(amount) * viewportHeight * 10) / 1000) + 'px';
        }
      );
    });
  }

  function setMode(nextExpanded, nextViewportHeight) {
    if (nextExpanded === expanded && (!nextExpanded || nextViewportHeight === viewportHeight)) {
      scheduleSize();
      return;
    }

    var wasExpanded = expanded;
    expanded = nextExpanded;
    viewportHeight = nextViewportHeight;
    lastHeight = 0;

    if (expanded) {
      freezeViewportUnits();
      setVisibleViewport(visibleTop, visibleHeight);
      if (!expandedStyle.isConnected) document.head.appendChild(expandedStyle);
      if (!wasExpanded && window.scrollY !== 0) window.scrollTo(0, 0);
      scheduleSize();
    } else {
      if (queuedFrame) window.cancelAnimationFrame(queuedFrame);
      queuedFrame = 0;
      expandedStyle.remove();
      originalStyles.forEach(function (entry) { entry.node.textContent = entry.text; });
      originalVisibleVars.forEach(function (entry) {
        if (entry.value) document.documentElement.style.setProperty(entry.name, entry.value, entry.priority);
        else document.documentElement.style.removeProperty(entry.name);
      });
    }
  }

  window.addEventListener('message', function (event) {
    if (event.source !== window.parent) return;
    var message = event.data;
    if (!message || typeof message !== 'object') return;
    if (message.type === 'portfolio:preview-viewport') {
      if (expanded && validNumber(message.visibleTop) && validNumber(message.visibleHeight)) {
        setVisibleViewport(message.visibleTop, message.visibleHeight);
      }
      return;
    }
    if (message.type !== 'portfolio:preview-mode') return;
    if (typeof message.expanded !== 'boolean' || typeof message.viewportHeight !== 'number') return;
    if (!Number.isFinite(message.viewportHeight) || message.viewportHeight <= 0 || message.viewportHeight > 60000) return;
    if ('visibleTop' in message && !validNumber(message.visibleTop)) return;
    if ('visibleHeight' in message && !validNumber(message.visibleHeight)) return;
    setVisibleViewport(
      'visibleTop' in message ? message.visibleTop : 0,
      'visibleHeight' in message ? message.visibleHeight : message.viewportHeight
    );
    setMode(message.expanded, message.viewportHeight);
  });

  document.addEventListener('click', function (event) {
    if (!expanded || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!(event.target instanceof Element)) return;
    var anchor = event.target.closest('a[href]');
    if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
    var href = anchor.getAttribute('href');
    if (!href || href.charAt(0) !== '#') return;

    var id;
    try { id = decodeURIComponent(href.slice(1)); } catch (_) { return; }
    var target = id ? document.getElementById(id) || document.getElementsByName(id)[0] : document.body;
    if (!target) return;
    var top = id ? Math.max(0, target.getBoundingClientRect().top + window.scrollY) : 0;
    if (!Number.isFinite(top)) return;
    event.preventDefault();
    window.parent.postMessage({ type: 'portfolio:preview-anchor', top: top }, '*');
  });

  if (typeof ResizeObserver !== 'undefined' && document.body) {
    var observer = new ResizeObserver(scheduleSize);
    observer.observe(document.body);
  }
  window.addEventListener('load', scheduleSize, true);
  window.addEventListener('resize', scheduleSize);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleSize);
})();
