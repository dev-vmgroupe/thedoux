/* The Doux concept site: shared bag, working links and buttons across all pages.
   Every product opens the one product page; the bag persists between pages (localStorage). */
(function () {
  var CAT = {
    'Mousse Def Texture Foam': { size: '7 oz', p: 16.99, img: 'assets/orig-a1e867c7ebb2.jpg' },
    'CRAZYSEXYCURL Honey Setting Foam': { size: '7 oz', p: 16.99, img: 'assets/orig-938ecc94d734.jpg' },
    'Big Poppa Defining Gel': { size: '16 oz', p: 14.99, img: 'assets/orig-fbd0f14d0a30.jpg' },
    'Dear Mama Moisture Milk': { size: '12 oz', p: 18.99, img: 'assets/orig-e3b8bf64795d.jpg' },
    'Block Party Anti-Humidity Defining Gel': { size: '16 oz', p: 16.99, img: 'assets/p-block-party-900.webp' },
    'Bee Girl Honey Curl Custard': { size: '16 oz', p: 15.99, img: 'assets/p-bee-girl-custard-900.webp' },
    'Chief Rocka Xtreme Moisture Mousse': { size: '8 oz', p: 16.99, img: 'assets/p-chief-rocka-900.webp' },
    '808 Base Gel': { size: '12 oz', p: 16.99, img: 'assets/p-base-gel-808-900.webp' },
    'Act Right Anti-Humectant Serum': { size: '2 oz', p: 15.99, img: 'assets/p-act-right-900.webp' },
    'Get Honey Hair & Scalp Serum': { size: '', p: 14.99, img: '' },
    'Stay Ready Sculpting Wax': { size: '4 oz', p: 15.99, img: 'assets/p-stay-ready-900.webp' },
    'Bonita Bubble Balm Foaming Pomade': { size: '', p: 17.99, img: '' },
    'Ladies First Honey Shampoo': { size: '8 oz', p: 12.99, img: '' },
    'Supersonic Honey Condish': { size: '8 oz', p: 12.99, img: '' },
    'Push It! Honey Braid & Edge Gel': { size: '8 oz', p: 14.99, img: 'assets/cap-d249dc96e1.jpg' },
    'DJ Quick Quick Dry Spray': { size: '8 oz', p: 15.99, img: 'assets/p-dj-quick-900.webp' },
    'The Double Up Bundle': { size: 'Bundle', p: 47.59, img: 'assets/orig-911cdee349f3.jpg' }
  };
  var D = 'https://thedoux.com';
  /* link text -> destination for the mockup's placeholder (#) links */
  var LINKS = [
    [/^store locator$/i, D + '/pages/bullseye-store-locator-page-1', 1],
    [/^(the brand|the founders|meet the founders)$/i, D + '/pages/about-us', 1],
    [/(read the blog|the blog|watch the film|salon service|combos that eat: build)/i, D + '/blogs/news', 1],
    [/^(doux gang\+ rewards|brand ambassadors|doux gang pro)$/i, D + '/account', 1],
    [/^insider list$/i, '#footer', 0],
    [/^(combos|combos that eat|explore combos|doux-approved combos)$/i, 'index.html#combos', 0],
    [/^gift cards$/i, D + '/products/gift-card', 1],
    [/./, 'collection.html', 0]
  ];
  var KEY = 'doux-concept-bag';
  var bag = load();
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(bag)); } catch (e) {} }
  function count() { var n = 0; for (var k in bag) { n += bag[k]; } return n; }
  function total() { var t = 0; for (var k in bag) { t += (CAT[k] ? CAT[k].p : 0) * bag[k]; } return t; }
  function money(n) { return '$' + n.toFixed(2); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function match(name) {
    name = (name || '').replace(/\s+/g, ' ').trim();
    if (CAT[name]) { return name; }
    var low = name.toLowerCase();
    for (var k in CAT) { if (low.indexOf(k.toLowerCase()) > -1 || k.toLowerCase().indexOf(low) > -1) { return k; } }
    return null;
  }
  function add(name, q) { var k = match(name); if (!k) { return; } bag[k] = (bag[k] || 0) + (q || 1); save(); render(); open(); }

  /* ---- bag drawer ---- */
  var css = document.createElement('style');
  css.textContent = '#dx-scrim{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:2147483000;opacity:0;pointer-events:none;transition:opacity .25s}' +
    '#dx-bag{position:fixed;top:0;right:0;bottom:0;width:min(420px,100vw);background:#fff;color:#000;z-index:2147483001;transform:translateX(100%);transition:transform .3s cubic-bezier(.2,.7,.2,1),visibility .3s;display:flex;flex-direction:column;font-family:Jost,system-ui,sans-serif}' +
    '#dx-bag{visibility:hidden}body.dx-open #dx-scrim{opacity:1;pointer-events:auto}body.dx-open #dx-bag{transform:none;visibility:visible}' +
    '#dx-bag header{display:flex;justify-content:space-between;align-items:center;padding:20px 24px;border-bottom:1px solid #e5e5e5;font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase}' +
    '#dx-bag header button{border:0;background:none;font-size:26px;line-height:1;cursor:pointer;width:40px;height:40px}' +
    '.dx-ship{padding:14px 24px;font-size:12px;letter-spacing:.04em;border-bottom:1px solid #e5e5e5}.dx-track{height:4px;background:#eee;margin-top:8px}.dx-fill{height:100%;background:#8EF1D7;transition:width .3s}' +
    '.dx-lines{flex:1;overflow:auto;padding:8px 24px}.dx-line{display:grid;grid-template-columns:72px 1fr auto;gap:14px;padding:14px 0;border-bottom:1px solid #f0f0f0;align-items:center}' +
    '.dx-line .im{width:72px;height:90px;background:#f1efeb;display:flex;align-items:center;justify-content:center;overflow:hidden}.dx-line img{width:100%;height:100%;object-fit:cover}' +
    '.dx-line h4{margin:0;font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;line-height:1.3}.dx-line p{margin:4px 0 0;font-size:12px;color:#666}' +
    '.dx-q{display:inline-flex;align-items:center;border:1px solid #000;margin-top:8px}.dx-q button{width:28px;height:28px;border:0;background:none;cursor:pointer;font-size:15px}.dx-q span{min-width:22px;text-align:center;font-size:12px}' +
    '.dx-rm{border:0;background:none;font-size:11px;text-decoration:underline;cursor:pointer;color:#666;align-self:start;margin-top:4px}.dx-price{font-size:13px;font-weight:600;text-align:right}' +
    '.dx-empty{padding:48px 0;text-align:center;font-size:14px;color:#555}.dx-empty a{display:inline-block;margin-top:16px;color:#000;font-weight:600;letter-spacing:.06em;text-transform:uppercase;font-size:12px}' +
    '#dx-bag footer{padding:20px 24px;border-top:1px solid #e5e5e5}.dx-sub{display:flex;justify-content:space-between;font-size:14px;font-weight:600;margin-bottom:14px;text-transform:uppercase;letter-spacing:.04em}' +
    '.dx-go{width:100%;height:52px;border:0;background:#000;color:#fff;font:600 13px/1 Jost,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}.dx-note{margin:10px 0 0;font-size:12px;color:#555;text-align:center;min-height:16px}' +
    '.dx-toast{position:fixed;left:50%;bottom:48px;transform:translate(-50%,20px);background:#000;color:#fff;font:500 13px/1.3 Jost,system-ui,sans-serif;padding:12px 18px;z-index:2147483002;opacity:0;transition:all .25s;pointer-events:none;max-width:90vw;text-align:center}.dx-toast.on{opacity:1;transform:translate(-50%,0)}';
  document.head.appendChild(css);
  var scrim, drawer, toastEl;
  function build() {
    if (drawer) { return; }
    scrim = document.createElement('div'); scrim.id = 'dx-scrim';
    drawer = document.createElement('aside'); drawer.id = 'dx-bag'; drawer.setAttribute('aria-label', 'Your bag'); drawer.setAttribute('role', 'dialog');
    toastEl = document.createElement('div'); toastEl.className = 'dx-toast'; toastEl.setAttribute('role', 'status');
    document.body.appendChild(scrim); document.body.appendChild(drawer); document.body.appendChild(toastEl);
    scrim.addEventListener('click', close);
    render();
  }
  function render() {
    if (!drawer) { return; }
    var n = count(), t = total(), left = Math.max(0, 50 - t), keys = Object.keys(bag);
    drawer.innerHTML = '<header><span>Your bag (' + n + ')</span><button type="button" data-dx="close" aria-label="Close bag">&times;</button></header>' +
      '<div class="dx-ship">' + (left > 0 ? 'You’re ' + money(left) + ' away from free shipping' : 'You’ve unlocked free shipping') + '<div class="dx-track"><div class="dx-fill" style="width:' + Math.min(100, t / 50 * 100) + '%"></div></div></div>' +
      '<div class="dx-lines">' + (keys.length ? keys.map(function (k) {
        var c = CAT[k] || { p: 0, img: '', size: '' };
        return '<div class="dx-line"><a class="im" href="product.html">' + (c.img ? '<img src="' + c.img + '" alt="">' : '') + '</a><div><h4>' + esc(k) + '</h4><p>' + esc(c.size) + '</p>' +
          '<div class="dx-q"><button type="button" data-dx="dec" data-k="' + esc(k) + '" aria-label="Decrease">−</button><span>' + bag[k] + '</span><button type="button" data-dx="inc" data-k="' + esc(k) + '" aria-label="Increase">+</button></div></div>' +
          '<div><div class="dx-price">' + money(c.p * bag[k]) + '</div><button type="button" class="dx-rm" data-dx="rm" data-k="' + esc(k) + '">Remove</button></div></div>';
      }).join('') : '<div class="dx-empty">Your bag is empty.<br><a href="collection.html">Shop all</a></div>') + '</div>' +
      (keys.length ? '<footer><div class="dx-sub"><span>Subtotal</span><span>' + money(t) + '</span></div><button type="button" class="dx-go" data-dx="checkout">Checkout</button><p class="dx-note" aria-live="polite"></p></footer>' : '');
    syncCounts();
  }
  function open() { build(); render(); document.body.classList.add('dx-open'); }
  function close() { document.body.classList.remove('dx-open'); }
  function toast(msg) { build(); toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { toastEl.classList.remove('on'); }, 2600); }
  function syncCounts() {
    var n = String(count());
    document.querySelectorAll('button[aria-label="Open bag"]').forEach(function (b) {
      var sp = b.querySelector('span'); if (sp && sp.textContent !== n) { sp.textContent = n; }
    });
  }

  /* ---- placeholder links -> real destinations ---- */
  function fixLinks() {
    document.querySelectorAll('a[href="#"], a[href=""]').forEach(function (a) {
      var txt = ((a.textContent || '').replace(/\s+/g, ' ').trim()) || a.getAttribute('aria-label') || '';
      if (a.getAttribute('aria-label') === 'The Doux home' || /^the doux/i.test(txt)) { a.setAttribute('href', 'index.html'); return; }
      if (match(txt) && a.closest('article, .v-card, [class*="card"]')) { a.setAttribute('href', 'product.html'); return; }
      if (a.querySelector('img') && match(txt)) { a.setAttribute('href', 'product.html'); return; }
      for (var i = 0; i < LINKS.length; i++) {
        if (LINKS[i][0].test(txt)) { a.setAttribute('href', LINKS[i][1]); if (LINKS[i][2]) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); } return; }
      }
    });
  }

  /* ---- clicks: runs before the page's own handlers ---- */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var dx = t.closest && t.closest('[data-dx]');
    if (dx) {
      e.preventDefault(); var k = dx.getAttribute('data-k'), a = dx.getAttribute('data-dx');
      if (a === 'close') { close(); }
      else if (a === 'inc') { bag[k]++; save(); render(); }
      else if (a === 'dec') { bag[k]--; if (bag[k] <= 0) { delete bag[k]; } save(); render(); }
      else if (a === 'rm') { delete bag[k]; save(); render(); }
      else if (a === 'checkout') { var note = drawer.querySelector('.dx-note'); if (note) { note.textContent = 'Checkout isn’t connected in this concept. On the live site this goes to Shopify checkout.'; } }
      return;
    }
    var b = t.closest && t.closest('button');
    if (!b) { return; }
    var label = b.getAttribute('aria-label') || '', text = (b.textContent || '').replace(/\s+/g, ' ').trim();
    var stop = function () { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); };
    if (label === 'Open bag') { stop(); open(); return; }
    if (/^quick add /i.test(label)) { stop(); add(label.replace(/^quick add /i, ''), 1); return; }
    if (/^add /i.test(label) && !/to bag/i.test(label)) { stop(); add(label.replace(/^add /i, ''), 1); return; }
    if (/^add to bag/i.test(text) || /^add to bag/i.test(label)) {
      stop();
      var h1 = document.querySelector('h1'), q = 1;
      var dec = document.querySelector('button[aria-label="Decrease quantity"]');
      if (dec && dec.parentElement) { var m = dec.parentElement.textContent.match(/\d+/); if (m) { q = parseInt(m[0], 10) || 1; } }
      add(h1 ? h1.textContent : 'Mousse Def Texture Foam', q); return;
    }
    if (label === 'Search') { stop(); location.href = 'collection.html'; return; }
    if (label === 'Account') { stop(); window.open(D + '/account', '_blank', 'noopener'); return; }
    if (/^sign up$/i.test(text)) {
      stop(); var form = b.closest('form') || b.parentElement; var inp = form && form.querySelector('input[type=email], input');
      if (inp && inp.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value)) { toast('Enter a valid email address.'); return; }
      toast('You’re on the list. (Sign-up isn’t connected in this concept, so nothing was sent.)'); if (inp) { inp.value = ''; } return;
    }
    if (/^checkout$/i.test(text)) { stop(); open(); return; }
  }, true);
  document.addEventListener('submit', function (e) { e.preventDefault(); toast('You’re on the list. (Sign-up isn’t connected in this concept, so nothing was sent.)'); }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); } });
  window.addEventListener('storage', function (e) { if (e.key === KEY) { bag = load(); render(); syncCounts(); } });


  /* ---- "Click to Stick" tooltip on the homepage hero ---- */
  function stickTip() {
    var hero = document.querySelector('section[aria-label="Featured"]');
    if (!hero || hero.querySelector('.dx-tip')) { return; }
    var touch = window.matchMedia && matchMedia('(hover: none)').matches;
    var st = document.createElement('style');
    st.textContent = '.dx-tip{position:absolute;z-index:30;left:50%;top:40%;transform:translate(-50%,8px);opacity:0;pointer-events:none;background:#fff;color:#000;font:600 11px/1 Jost,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;padding:10px 14px;white-space:nowrap;box-shadow:0 6px 24px rgba(0,0,0,.18);transition:opacity .35s ease,transform .35s ease}' +
      '.dx-tip::before{content:"";position:absolute;left:14px;top:-5px;width:10px;height:10px;background:#fff;transform:rotate(45deg)}' +
      '.dx-tip.on{opacity:1;transform:translate(-50%,0)}.dx-tip.follow{transform:none;transition:opacity .35s ease}.dx-tip.follow::before{left:10px}.dx-tip.gone{opacity:0!important}' +
      '@media (prefers-reduced-motion:reduce){.dx-tip{transition:none}}';
    document.head.appendChild(st);
    var tip = document.createElement('div'); tip.className = 'dx-tip'; tip.setAttribute('role', 'tooltip'); tip.textContent = touch ? 'Tap to Stick' : 'Click to Stick';
    hero.appendChild(tip);
    setTimeout(function () { tip.classList.add('on'); }, Math.max(150, 1200 - (window.performance ? performance.now() : 0)));
    hero.addEventListener('mousemove', function (e) {
      if (tip.classList.contains('gone')) { return; }
      var r = hero.getBoundingClientRect();
      tip.classList.add('follow');
      tip.style.left = Math.min(e.clientX - r.left + 18, r.width - tip.offsetWidth - 12) + 'px';
      tip.style.top = (e.clientY - r.top + 34) + 'px';
    });
    hero.addEventListener('click', function (e) { if (!e.target.closest('a,button')) { tip.classList.add('gone'); } });
  }
  function init() { build(); fixLinks(); syncCounts(); stickTip(); setTimeout(stickTip, 300); setTimeout(stickTip, 900); }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
  new MutationObserver(function () { fixLinks(); syncCounts(); }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
