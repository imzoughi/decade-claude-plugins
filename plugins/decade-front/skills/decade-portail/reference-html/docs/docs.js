// Documentation UI: theme toggle, code tabs + copy, navigation filter, mobile menu, device width for page previews.
(function () {
  var root = document.documentElement;
  document.querySelector('[data-doc-theme]').addEventListener('click', function () {
    var t = root.dataset.theme === 'dark' ? 'light' : 'dark'; root.dataset.theme = t; try { localStorage.setItem('doc-theme', t); } catch (e) {}
  });
  document.querySelectorAll('[data-doc-tabs]').forEach(function (box) {
    var tabs = box.querySelectorAll('[role="tab"]'), panels = box.querySelectorAll('[role="tabpanel"]');
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { tabs.forEach(function (x, j) { x.setAttribute('aria-selected', i === j); panels[j].hidden = i !== j; }); }); });
    box.querySelector('[data-doc-copy]').addEventListener('click', function (e) {
      var p = Array.prototype.find.call(panels, function (x) { return !x.hidden; }); var b = e.currentTarget, label = b.lastChild, prev = label.textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(p.textContent) : Promise.reject()).then(function () { label.textContent = 'Copié'; setTimeout(function () { label.textContent = prev; }, 1500); }).catch(function () {});
    });
  });
  document.querySelectorAll('[data-doc-copy-block]').forEach(function (b) {
    b.addEventListener('click', function () {
      var pre = b.closest('.doc-codetabs').querySelector('pre'); var prev = b.textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(pre.textContent) : Promise.reject()).then(function () { b.textContent = 'Copié'; setTimeout(function () { b.textContent = prev; }, 1500); }).catch(function () {});
    });
  });
  var filter = document.querySelector('[data-doc-filter]');
  filter && filter.addEventListener('input', function () {
    var q = filter.value.trim().toLowerCase();
    document.querySelectorAll('.doc-nav li').forEach(function (li) { li.hidden = q && li.textContent.toLowerCase().indexOf(q) < 0; });
  });
  var menu = document.querySelector('[data-doc-menu]'), nav = document.getElementById('doc-nav');
  menu.addEventListener('click', function () { var o = !nav.classList.contains('is-open'); nav.classList.toggle('is-open', o); menu.setAttribute('aria-expanded', o); });
  document.querySelectorAll('[data-doc-device]').forEach(function (seg) {
    var frame = seg.closest('.doc-section').querySelector('iframe');
    seg.addEventListener('is:seg-change', function (e) { frame.style.width = seg.querySelectorAll('.is-seg__btn')[e.detail.index].dataset.w; });
  });
})();
