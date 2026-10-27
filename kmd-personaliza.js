/* KM Design · Personalización con tus tiempos · v1 */
(function () {
  var SUCCESS = !!window.__kmdSuccess || /\/checkout\/.*(success|confirm)/i.test(location.pathname);
  if (SUCCESS) { if (window.__kmdSDone) return; window.__kmdSDone = 1; }
  else { if (window.__kmdPers) return; window.__kmdPers = 1; }
  var FORM = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLScPqk1SEoXLmMhZd3fph1DUR4EKjJlty3tn0Gl2ELDXr1dtrw/formResponse';
  var ENTRY = 'entry.1436273367';
  var CDN = 'https://cdn.jsdelivr.net/gh/tomdemin-sudo/kmdesign-assets@main/';
  var KEY = 'kmd_pers_v1';
  var OPT = 'Con mis tiempos';
  var P = {
    369194543: { k: 'm', name: 'Cuadro Maratón Buenos Aires 2026', img: CDN + 'pers_bg_maraton.jpg',
      fields: [{ k: 't', l: 'Tiempo final', d: '3:27:50' }],
      ov: [{ k: 't', x: 84.57, y: 84.98, s: 2.82, w: 700 }] },
    371553669: { k: 'i', name: 'Cuadro IRONMAN 70.3 Buenos Aires 2026', img: CDN + 'pers_bg_ironman.jpg',
      fields: [{ k: 'sw', l: 'Natación (swim)', d: '49:21' }, { k: 'bk', l: 'Bici (bike)', d: '3:10:02' },
               { k: 'rn', l: 'Carrera (run)', d: '1:51:21' }, { k: 'tt', l: 'Tiempo final', d: '5:59:04' }],
      ov: [{ k: 'sw', x: 78.43, y: 16.54, s: 3.2, w: 800, left: 1 }, { k: 'bk', x: 78.43, y: 45.61, s: 3.2, w: 800, left: 1 },
           { k: 'rn', x: 78.43, y: 74.67, s: 3.2, w: 800, left: 1 }, { k: 'tt', x: 42.24, y: 88.33, s: 1.78, w: 800 }] }
  };

  function ls(get, val) { try { if (get) return JSON.parse(localStorage.getItem(KEY) || '[]'); localStorage.setItem(KEY, JSON.stringify(val)); } catch (e) { return []; } }
  function post(text) {
    try {
      var b = new URLSearchParams(); b.append(ENTRY, text);
      fetch(FORM, { method: 'POST', mode: 'no-cors', body: b, keepalive: true }).catch(function () {});
    } catch (e) {
      try { var i = new Image(); i.src = FORM + '?' + ENTRY + '=' + encodeURIComponent(text) + '&submit=Submit'; } catch (e2) {}
    }
  }
  function fmt(v) { var d = String(v).replace(/\D/g, '').replace(/^0+/, '').slice(0, 6), o = ''; while (d.length > 2) { o = ':' + d.slice(-2) + o; d = d.slice(0, -2); } return d + o; }
  function valid(v) { return /^\d{1,2}(:\d\d){1,2}$/.test(v); }
  function css(t) { var s = document.createElement('style'); s.textContent = t; document.head.appendChild(s); }
  /* receptor de pedidos personalizados (Google Apps Script) */
  var APP = 'https://script.google.com/macros/s/AKfycbx5v2BaDzGw4DlqjYPOFgckIC9eNB7LScU4Eu_fk10hcAcJ5zL7wSEjewerLAsQXjr-/exec', APP_KEY = 'kmd-2026-gpx', CKEY = 'kmd_custom_v1', CUSTOM_ID = 371969427;
  function api(o) {
    o.key = APP_KEY;
    return fetch(APP, { method: 'POST', body: JSON.stringify(o), headers: { 'Content-Type': 'text/plain;charset=utf-8' }, keepalive: !o.data })
      .then(function (r) { return r.json(); });
  }
  function cget() { try { return JSON.parse(localStorage.getItem(CKEY) || '[]'); } catch (e) { return []; } }
  function cset(v) { try { localStorage.setItem(CKEY, JSON.stringify(v)); } catch (e) {} }
  function esc(t) { return String(t || '').replace(/[<>&"]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]; }); }

  /* ---------- Página de confirmación (checkout) ---------- */
  if (/\/checkout\//.test(location.pathname) && !SUCCESS) return;
  if (SUCCESS) {
    var list = ls(1).filter(function (r) { return !r.sent && Date.now() - r.ts < 7 * 864e5; });
    var clist = cget().filter(function (r) { return !r.sent && Date.now() - r.ts < 7 * 864e5; });
    if (!list.length && !clist.length) return;
    var tries = 0;
    (function wait() {
      var txt = document.body ? document.body.innerText : '';
      var m = txt.match(/(?:orden|pedido|compra)[^#\d]{0,25}#?\s?(\d{2,8})/i) || txt.match(/#(\d{2,8})/);
      var num = (window.LS && LS.order && (LS.order.number || LS.order.id)) || (m && m[1]);
      if (!num && tries++ < 6) return setTimeout(wait, 500);
      var html = '';
      if (list.length) {
        var lines = list.map(function (r) { return r.name + ' → ' + r.times; }).join('\n');
        post('✅ COMPRA CONFIRMADA\nPedido: #' + (num || '¿?') + '\nURL: ' + location.href.split('?')[0] + '\n' + lines + '\n(Chequeá en el pedido que la variante diga "Con mis tiempos")');
        ls(0, ls(1).map(function (r) { r.sent = 1; return r; }));
        html += '<b>¡Recibimos tus tiempos!</b><br>' + list.map(function (r) { return r.name + ': <b>' + r.times + '</b>'; }).join('<br>') + '<br><span style="font-size:12px">Los vamos a imprimir tal cual. Si algo está mal, respondé el mail de tu compra.</span>';
      }
      if (clist.length) {
        var items = clist.map(function (r) { return { race: r.race, text: r.text || ('Carrera: ' + r.race), gpx: r.gpx || '' }; });
        api({ type: 'order', order: num || '', items: items });
        post('🗺️ CUADRO PERSONALIZADO · COMPRA CONFIRMADA\nPedido: #' + (num || '¿?') + '\n' + items.map(function (i) { return i.text; }).join('\n\n'));
        cset(cget().map(function (r) { r.sent = 1; return r; }));
        html += (html ? '<br><br>' : '') + '<b>¡Recibimos los datos de tu cuadro!</b><br>' + items.map(function (i) { return 'Cuadro: <b>' + esc(i.race) + '</b><br>Archivo GPX: <b>' + (i.gpx ? 'recibido' : 'pendiente') + '</b>'; }).join('<br><br>') +
          '<br><span style="font-size:12px">' + (items.some(function (i) { return !i.gpx; }) ? 'Si todavía no nos mandaste el .gpx (Strava o Garmin), respondé el mail de tu compra con el archivo. ' : '') + 'Te vamos a mandar el diseño para que lo apruebes antes de producir.</span>';
      }
      var box = document.createElement('div');
      box.style.cssText = 'margin:16px auto;max-width:560px;padding:14px 16px;border-radius:10px;background:#fff7ed;border:1px solid #fb923c;color:#7c2d12;font:500 14px/1.45 Poppins,Arial,sans-serif';
      box.innerHTML = html;
      var host = document.querySelector('main') || document.body; host.insertBefore(box, host.firstChild);
    })();
    return;
  }

  /* ---------- Página de producto ---------- */
  function boot(n) {
    var cfg = window.LS && LS.product && P[LS.product.id];
    var form = document.querySelector('[data-store^="product-form-"]') || document.querySelector('.js-product-form');
    var sel = form && form.querySelector('select[name="variation[0]"]');
    var slider = document.querySelector('.product-slider-container');
    if (!cfg) return;
    if (!form || !sel || !slider) { if ((n || 0) < 40) setTimeout(function () { boot((n || 0) + 1); }, 250); return; }
    if (![].some.call(sel.options, function (o) { return o.value === OPT || o.text === OPT; })) return;

    var fl = document.createElement('link'); fl.rel = 'stylesheet';
    fl.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@700;800&display=swap'; document.head.appendChild(fl);
    new Image().src = cfg.img;

    css(
      '.kmd-hide{display:none!important}' +
      '.kmd-opt{display:flex;gap:10px;margin:4px 0 14px}' +
      '.kmd-opt button{flex:1;text-align:left;border:1px solid #2a3340;border-radius:12px;padding:12px 14px;background:#12161d;color:#e5e7eb;cursor:pointer;font-family:inherit;transition:border-color .2s,background .2s}' +
      '.kmd-opt button b{display:block;color:#fff;font-size:14px;font-weight:600}.kmd-opt button span{font-size:12px;color:#94a3b8}' +
      '.kmd-opt button.on{border-color:#fb923c;background:#1b1610}.kmd-opt button.on span{color:#fdba74}' +
      '.kmd-lbl{font-size:12px;color:#e5e7eb;margin:0 0 6px}' +
      '.kmd-form{overflow:hidden;max-height:0;opacity:0;transition:max-height .35s ease,opacity .3s ease}.kmd-form.on{max-height:420px;opacity:1}' +
      '.kmd-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px}.kmd-fields.one{grid-template-columns:1fr}' +
      '.kmd-f label{display:block;font-size:12px;color:#94a3b8;margin-bottom:4px}' +
      '.kmd-f input{width:100%;box-sizing:border-box;background:#0f1218;border:1px solid #2a3340;color:#fff;border-radius:10px;padding:11px 12px;font:600 18px Poppins,sans-serif;letter-spacing:.06em}' +
      '.kmd-f input:focus{outline:none;border-color:#fb923c}.kmd-f input.err{border-color:#ef4444}' +
      '.kmd-hint{font-size:12px;color:#64748b;margin:8px 0 14px}.kmd-err{color:#f87171;font-size:13px;margin:-4px 0 12px;display:none}' +
      '.product-slider-container{position:relative}' +
      '.kmd-prev{position:absolute;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 40%,#f4f2ee,#dcd8d1);opacity:0;pointer-events:none;transition:opacity .35s ease}' +
      '.kmd-prev.on{opacity:1;pointer-events:auto}' +
      '.kmd-frame{width:min(90%,calc(88% * var(--r,1)));background:#1a1a1a;padding:3.2%;border-radius:3px;box-shadow:0 18px 36px rgba(0,0,0,.45),inset 0 0 0 2px #2b2b2b}' +
      '.kmd-pic{container-type:inline-size;position:relative;background:#fff;box-shadow:inset 0 0 12px rgba(0,0,0,.25)}.kmd-pic img{width:100%;display:block}' +
      '.kmd-ov{position:absolute;font-family:Inter,sans-serif;color:#0a0f18;line-height:1.21;white-space:nowrap;transform:translateX(-50%)}.kmd-ov.left{transform:none}.kmd-ov.ph{opacity:.35}' +
      '.kmd-badge{position:absolute;left:12px;top:12px;background:#fb923c;color:#111;font:600 11px Poppins,sans-serif;padding:4px 8px;border-radius:6px;letter-spacing:.04em}'
    );

    /* tarjetas de opción */
    var varWrap = form.querySelector('.js-product-variants') || sel.closest('.js-product-variants-group');
    var opt = document.createElement('div');
    opt.innerHTML = '<div class="kmd-lbl">Personalización</div><div class="kmd-opt">' +
      '<button type="button" data-v="0"><b>Sin personalizar</b><span>El cuadro tal como se ve</span></button>' +
      '<button type="button" data-v="1"><b>Con mis tiempos</b><span>Sin costo extra · impresos en el cuadro</span></button></div>';
    var box = document.createElement('div'); box.className = 'kmd-form';
    box.innerHTML = '<div class="kmd-fields' + (cfg.fields.length === 1 ? ' one' : '') + '"></div>' +
      '<div class="kmd-hint">Escribí solo los números, los dos puntos se ponen solos. Mirá cómo queda en la imagen mientras escribís.</div>' +
      '<div class="kmd-err">Completá ' + (cfg.fields.length > 1 ? 'todos tus tiempos' : 'tu tiempo final') + ' para agregar al carrito.</div>';
    varWrap.parentNode.insertBefore(opt, varWrap);
    varWrap.parentNode.insertBefore(box, varWrap.nextSibling);
    varWrap.classList.add('kmd-hide');

    var vals = {};
    var grid = box.querySelector('.kmd-fields');
    cfg.fields.forEach(function (f) {
      var w = document.createElement('div'); w.className = 'kmd-f';
      w.innerHTML = '<label>' + f.l + '</label><input inputmode="numeric" autocomplete="off" placeholder="' + f.d + '">';
      var i = w.querySelector('input');
      i.addEventListener('input', function () { i.value = fmt(i.value); vals[f.k] = i.value; i.classList.remove('err'); paint(); });
      grid.appendChild(w);
    });

    /* vista previa sobre el slider */
    var prev = document.createElement('div'); prev.className = 'kmd-prev';
    prev.innerHTML = '<span class="kmd-badge">VISTA PREVIA</span><div class="kmd-frame"><div class="kmd-pic"><img alt="Vista previa de tu cuadro"></div></div>';
    prev.querySelector('img').src = cfg.img;
    var pic = prev.querySelector('.kmd-pic');
    var ovs = cfg.ov.map(function (o) {
      var e = document.createElement('div'); e.className = 'kmd-ov' + (o.left ? ' left' : '');
      e.style.cssText = 'left:' + o.x + '%;top:' + o.y + '%;font-size:' + o.s + 'cqw;font-weight:' + o.w;
      pic.appendChild(e); return e;
    });
    slider.appendChild(prev);
    function ratio() { var r = slider.clientWidth / Math.max(1, slider.clientHeight); prev.style.setProperty('--r', (1300 / 919 > r ? 1 : r / (1300 / 919)).toFixed(3)); }
    ratio(); window.addEventListener('resize', ratio);

    function paint() {
      cfg.ov.forEach(function (o, n) { var v = vals[o.k]; ovs[n].textContent = v || cfg.fields.filter(function (f) { return f.k === o.k; })[0].d; ovs[n].classList.toggle('ph', !v); });
    }
    paint();

    function custom() { var o = sel.options[sel.selectedIndex]; return !!o && (o.value === OPT || o.text === OPT); }
    function setVar(on) {
      var want = [].filter.call(sel.options, function (o) { return (o.value === OPT || o.text === OPT) === on; })[0];
      if (want && sel.value !== want.value) {
        sel.value = want.value;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      }
      sync();
    }
    var last = null;
    function sync() {
      var on = custom(); if (on === last) return; last = on;
      opt.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', (b.dataset.v === '1') === on); });
      box.classList.toggle('on', on); prev.classList.toggle('on', on); ratio();
      if (on && innerWidth < 768) slider.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    opt.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setVar(b.dataset.v === '1'); });
    sel.addEventListener('change', function () { last = null; sync(); });
    setInterval(sync, 400);
    sync();

    /* bloquear carrito si faltan tiempos + guardar */
    function check(e) {
      if (!custom()) return;
      var miss = cfg.fields.filter(function (f) { return !valid(vals[f.k] || ''); });
      var err = box.querySelector('.kmd-err');
      if (miss.length) {
        e.preventDefault(); e.stopImmediatePropagation();
        err.style.display = 'block';
        grid.querySelectorAll('input').forEach(function (i, n) { if (!valid(vals[cfg.fields[n].k] || '')) i.classList.add('err'); });
        grid.querySelector('input.err').focus();
        return;
      }
      err.style.display = 'none';
      var times = cfg.fields.map(function (f) { return f.l + ': ' + vals[f.k]; }).join(' · ');
      var key = cfg.name + '|' + times;
      var list = ls(1).filter(function (r) { return r.key !== key && Date.now() - r.ts < 7 * 864e5; });
      list.push({ key: key, name: cfg.name, times: times, ts: Date.now() });
      ls(0, list);
      if (window.__kmdLastPost !== key) {
        window.__kmdLastPost = key;
        post('🛒 AGREGADO AL CARRITO\n' + cfg.name + ' → ' + times + '\nCant: ' + ((form.querySelector('input[name="quantity"]') || {}).value || 1) + '\n' + new Date().toLocaleString('es-AR'));
      }
    }
    form.addEventListener('submit', function (e) { check(e); upsell(e, form, sel); }, true);
    document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-store^="product-form-"] .js-addtocart, [data-store^="product-form-"] [type=submit]')) { check(e); upsell(e, form, sel); } }, true);
  }

  /* ---------- Oferta al agregar un cuadro: pack de 2 placas a $19.999 ---------- */
  var PACK_ID = 375526293, PACK_PRICE = 19999, PACK_OLD = 39999, CUADROS = [369194543, 371553669];
  var PACK_IMG = 'https://dcdn-us.mitiendanube.com/stores/001/036/160/products/1_kit_mis_records_ambiente-0828ff1e8baaaca0fb17915013894955-480-0.webp';
  function addLine(pid, val, q) {
    var fd = new FormData(); fd.append('add_to_cart', String(pid)); if (val) fd.append('variation[0]', val); fd.append('quantity', String(q || 1));
    return fetch('/comprar/', { method: 'POST', body: fd, credentials: 'include' }).then(function (r) { if (!r.ok) throw new Error('add ' + r.status); return r; });
  }
  function money(x) { return '$' + Math.round(x).toLocaleString('es-AR'); }
  function upsell(e, form, sel) {
    if (e.defaultPrevented || window.__kmdUpDone || document.querySelector('.kmd-up')) return;
    if (!(window.LS && LS.product && CUADROS.indexOf(LS.product.id) > -1)) return;
    if (cartItems().some(function (i) { return i.pid === KIT_ID || i.pid === PACK_ID; })) return;
    e.preventDefault(); e.stopImmediatePropagation();
    var q = parseInt((form.querySelector('input[name="quantity"]') || {}).value, 10) || 1;
    var v = (LS.variants || []).filter(function (x) { return x.option0 === sel.value; })[0] || (LS.variants || [])[0] || {};
    var cuadro = (v.price_number || 0) * q, sub = 0;
    try { (LS.cart.items || []).forEach(function (i) { sub += (i.unit_price || 0) * i.quantity / 100; }); } catch (er) {}
    var total = sub + cuadro + PACK_PRICE, gratis = sub + cuadro < FREE_MIN && total >= FREE_MIN;
    css('.kmd-up{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;padding:16px;font-family:Poppins,sans-serif}' +
      '.kmd-up-c{position:relative;width:100%;max-width:440px;max-height:92vh;overflow:auto;background:#0f1218;border:1px solid #2a3340;border-radius:16px;padding:20px;color:#e5e7eb;box-shadow:0 20px 60px rgba(0,0,0,.6)}' +
      '.kmd-up-x{position:absolute;top:8px;right:12px;background:none;border:0;color:#94a3b8;font-size:26px;cursor:pointer;line-height:1}' +
      '.kmd-up-top{display:flex;gap:14px;align-items:center;margin-bottom:12px}.kmd-up-top img{width:84px;height:84px;object-fit:cover;border-radius:10px;flex:none}' +
      '.kmd-up h3{margin:0 0 4px;font-size:18px;color:#fff;font-weight:700}.kmd-up p{margin:0;font-size:13px;line-height:1.4;color:#cbd5e1}' +
      '.kmd-up-pr{font-size:20px;font-weight:700;color:#fb923c}.kmd-up-pr s{font-size:13px;color:#64748b;font-weight:500;margin-left:6px}' +
      '.kmd-up-env{display:inline-block;margin-top:6px;background:#1b1610;border:1px dashed #fb923c;color:#fdba74;font-size:12px;padding:4px 8px;border-radius:8px}' +
      '.kmd-up-l{font-size:13px;font-weight:600;color:#fff;margin:14px 0 8px}' +
      '.kmd-up-g{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}' +
      '.kmd-up-g div{position:relative;border:1px solid #2a3340;background:#12161d;border-radius:10px;padding:10px 2px;text-align:center;font:700 12px Poppins,sans-serif;color:#fff;cursor:pointer;line-height:1.15}' +
      '.kmd-up-g div span{display:block;font-size:9px;font-weight:500;color:#94a3b8;margin-top:2px}.kmd-up-g div.on{border-color:#fb923c;background:#1b1610}' +
      '.kmd-up-g div.on:after{content:"\\2713";position:absolute;top:2px;right:5px;font-size:10px;color:#fb923c}' +
      '.kmd-up-e{color:#f87171;font-size:12px;margin-top:8px;display:none}' +
      '.kmd-up-b{display:block;width:100%;margin-top:14px;background:#fb923c;color:#111;border:0;border-radius:10px;padding:14px;font:700 14px Poppins,sans-serif;text-transform:uppercase;letter-spacing:.04em;cursor:pointer}' +
      '.kmd-up-b[disabled]{opacity:.6}.kmd-up-n{display:block;width:100%;margin-top:8px;background:none;border:0;color:#94a3b8;font:500 13px Poppins,sans-serif;text-decoration:underline;cursor:pointer;padding:8px}');
    var m = document.createElement('div'); m.className = 'kmd-up';
    m.innerHTML = '<div class="kmd-up-c"><button class="kmd-up-x" aria-label="Cerrar">&times;</button>' +
      '<div class="kmd-up-top"><img src="' + PACK_IMG + '" alt="Kit MIS RÉCORDS"><div><h3>Sumá tus récords a tu cuadro</h3>' +
      '<p>2 placas MIS RÉCORDS (título + 2 distancias) solo con tu cuadro:</p>' +
      '<div class="kmd-up-pr">' + money(PACK_PRICE) + '<s>' + money(PACK_OLD) + '</s></div></div></div>' +
      (gratis ? '<span class="kmd-up-env">Sumándolas, tu envío es GRATIS</span>' : '<span class="kmd-up-env">50% off, solo en esta compra</span>') +
      '<div class="kmd-up-l">Elegí tus 2 distancias</div><div class="kmd-up-g">' +
      DIST.map(function (d, i) { return '<div data-i="' + i + '">' + d[0] + (d[1] ? '<span>' + d[1] + '</span>' : '') + '</div>'; }).join('') + '</div>' +
      '<div class="kmd-up-e">Elegí 2 distancias.</div>' +
      '<button class="kmd-up-b">Agregar cuadro + 2 placas</button><button class="kmd-up-n">No, gracias. Solo el cuadro</button></div>';
    document.body.appendChild(m);
    var chosen = [];
    m.querySelector('.kmd-up-g').addEventListener('click', function (ev) {
      var el = ev.target.closest('[data-i]'); if (!el) return; var i = +el.dataset.i, p = chosen.indexOf(i);
      if (p > -1) chosen.splice(p, 1); else { if (chosen.length >= 2) chosen.shift(); chosen.push(i); }
      m.querySelectorAll('.kmd-up-g [data-i]').forEach(function (d) { d.classList.toggle('on', chosen.indexOf(+d.dataset.i) > -1); });
      m.querySelector('.kmd-up-e').style.display = 'none';
    });
    function close() { m.remove(); }
    m.querySelector('.kmd-up-x').onclick = close;
    m.addEventListener('click', function (ev) { if (ev.target === m) close(); });
    m.querySelector('.kmd-up-n').onclick = function () {
      window.__kmdUpDone = 1; close();
      var b = form.querySelector('[data-store="product-buy-button"], .js-addtocart[type=submit], [type=submit]'); if (b) b.click(); else form.requestSubmit();
    };
    m.querySelector('.kmd-up-b').onclick = function () {
      if (chosen.length !== 2) { m.querySelector('.kmd-up-e').style.display = 'block'; return; }
      var btn = this; btn.disabled = true; btn.textContent = 'Agregando...'; fixing = true;
      var list = chosen.slice().sort(function (a, b) { return a - b; });
      var fd = new FormData(form); if (!fd.get('add_to_cart')) fd.set('add_to_cart', String(LS.product.id));
      var chain = fetch('/comprar/', { method: 'POST', body: fd, credentials: 'include' }).then(function (r) { if (!r.ok) throw new Error('cuadro'); })
        .then(function () { return addLine(PACK_ID, null, 1); });
      list.forEach(function (i) { chain = chain.then(function () { return addLine(ADDON_ID, 'placa ' + DIST[i][3], 1); }); });
      post('🎁 CUADRO + PACK 2 PLACAS\n' + (LS.product.name || '') + '\nPlacas → ' + list.map(function (i) { return DIST[i][3]; }).join(' · ') + '\n' + new Date().toLocaleString('es-AR'));
      chain.then(function () { location.href = '/comprar/'; }).catch(function () {
        fixing = false; btn.disabled = false; btn.textContent = 'Agregar cuadro + 2 placas';
        var er = m.querySelector('.kmd-up-e'); er.textContent = 'No se pudo agregar. Probá de nuevo.'; er.style.display = 'block'; });
    };
  }

  /* ---------- Kit MIS RÉCORDS: distancias a elección ---------- */
  var KIT_ID = 371553865, ADDON_ID = 373656430, FREE_MIN = 79999;
  var DIST = [['5K','','5k','5K'],['10K','','10k','10K'],['15K','','15k','15K'],['21K','','21k','21K'],['Media','maratón','media','Media maratón'],
              ['30K','','30k','30K'],['42K','','42k','42K'],['Maratón','','maraton','Maratón'],['IRONMAN','70.3','ironman703','IRONMAN 70.3'],['IRONMAN','','ironman','IRONMAN']];
  /* ocultar las líneas de $0 en carrito y carrito lateral (en toda la tienda) */
  css('[data-store="cart-item-' + ADDON_ID + '"]{display:none!important}');
  /* ---- carrito: helpers ----
     Regla: en el carrito hay como máximo UN tablero = 1 línea de kit (N placas, cant q) + N líneas de $0 con cant q.
     Si se borra el kit, se borran sus placas. Si se cambia la cantidad del kit, se igualan las placas. */
  function cartItems() {
    /* el DOM del carrito es lo que está al día (LS.cart no se actualiza cuando el cliente borra o cambia algo) */
    var ls = {}, all = [];
    try { all = LS.cart.items || []; all.forEach(function (i) { ls[i.item_id] = i; }); } catch (e) {}
    var rows = document.querySelectorAll('[data-store^="cart-item-"][data-item-id]');
    if (!rows.length) return all.map(function (i) { return { line: i.item_id, pid: i.product_id, q: i.quantity, label: i.short_variant_name || '' }; });
    var seen = {}, out = [];
    rows.forEach(function (r) {
      var line = +r.getAttribute('data-item-id'); if (seen[line]) return; seen[line] = 1;
      var inp = document.querySelector('[name="quantity[' + line + ']"]') || r.querySelector('input[type=number], .js-cart-quantity-input'), sm = r.querySelector('.name small'), l = ls[line] || {};
      out.push({ line: line, pid: +r.getAttribute('data-store').replace('cart-item-', ''), q: (inp && parseInt(inp.value, 10)) || l.quantity || 1, label: (sm && sm.textContent) || l.short_variant_name || '' });
    });
    /* mantener LS.cart en línea con lo que se ve (para el contador del carrito) */
    try { LS.cart.items = all.filter(function (i) { return seen[i.item_id]; });
      LS.cart.items.forEach(function (i) { out.forEach(function (o) { if (o.line === i.item_id) i.quantity = o.q; }); }); } catch (e) {}
    return out;
  }
  function freshCart() { /* lee el carrito real del servidor (por si cambió en otra pestaña) */
    return fetch('/comprar/', { credentials: 'include', cache: 'no-store' }).then(function (r) { return r.text(); }).then(function (h) {
      var d = new DOMParser().parseFromString(h, 'text/html'), seen = {}, out = [];
      d.querySelectorAll('[data-store^="cart-item-"][data-item-id]').forEach(function (el) {
        var line = el.getAttribute('data-item-id'); if (seen[line]) return; seen[line] = 1;
        var inp = d.querySelector('[name="quantity[' + line + ']"]'), nm = el.querySelector('.name small');
        out.push({ line: +line, pid: +el.getAttribute('data-store').replace('cart-item-', ''), q: inp ? parseInt(inp.value, 10) || 1 : 1, label: nm ? nm.textContent : '' });
      });
      return out;
    });
  }
  function runOps(ops) { /* todos los cambios en un solo pedido; después se reflejan en la página */
    if (!ops.length) return Promise.resolve();
    return fetch('/cart/update/', { method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' },
      body: ops.map(function (o) { return 'quantity%5B' + o[0] + '%5D=' + o[1]; }).join('&') })
      .then(function (r) { return r.json(); }).then(function (j) { if (!j.success) throw new Error('upd');
        ops.forEach(function (o) {
          if (o[1] === 0) document.querySelectorAll('[data-item-id="' + o[0] + '"]').forEach(function (r) { r.remove(); });
          document.querySelectorAll('[name="quantity[' + o[0] + ']"]').forEach(function (inp) { if (o[1] === 0) inp.remove(); else inp.value = o[1]; });
          try { LS.cart.items = LS.cart.items.filter(function (i) { return !(i.item_id === o[0] && o[1] === 0); });
            LS.cart.items.forEach(function (i) { if (i.item_id === o[0]) i.quantity = o[1]; }); } catch (e) {}
        }); return j; });
  }
  function nPlacas(label) { var m = /(\d+)\s*placa/.exec(label || ''); return m ? +m[1] : 0; }
  function planFix(items) {
    var kits = items.filter(function (i) { return i.pid === KIT_ID; }), packs = items.filter(function (i) { return i.pid === PACK_ID; }),
        adds = items.filter(function (i) { return i.pid === ADDON_ID; }), ops = [];
    var hasCuadro = items.some(function (i) { return CUADROS.indexOf(i.pid) > -1; });
    if (packs.length && !hasCuadro) {                      /* el pack de $19.999 solo va con un cuadro */
      packs.forEach(function (p) { ops.push([p.line, 0]); });
      if (!kits.length) adds.forEach(function (a) { ops.push([a.line, 0]); });
      return ops;
    }
    var tabs = kits.map(function (k) { return { l: k, n: nPlacas(k.label), q: k.q }; }).concat(packs.map(function (p) { return { l: p, n: 2, q: 1 }; }));
    if (!tabs.length) adds.forEach(function (a) { ops.push([a.line, 0]); });               /* placas huérfanas: afuera */
    else if (tabs.length === 1) {
      var t = tabs[0];
      if (t.l.pid === PACK_ID && t.l.q !== 1) ops.push([t.l.line, 1]);                     /* un solo pack por compra */
      if (adds.length === t.n) adds.forEach(function (a) { if (a.q !== t.q) ops.push([a.line, t.q]); }); /* misma cantidad */
    }
    return ops;
  }
  function fixBadge() {
    try {
      var real = 0; cartItems().forEach(function (i) { if (i.pid !== ADDON_ID) real += i.q; });
      document.querySelectorAll('.js-cart-widget-amount').forEach(function (b) { if (b.textContent.trim() !== String(real)) b.textContent = real; });
    } catch (e) {}
  }
  function showDist() { /* muestra las distancias debajo del kit en el carrito */
    try {
      var adds = cartItems().filter(function (i) { return i.pid === ADDON_ID; }).map(function (a) { return a.label.replace(/[()]/g, '').replace(/^placa\s*/i, '').trim(); })
        .sort(function (a, b) { var o = DIST.map(function (d) { return d[3]; }); return o.indexOf(a) - o.indexOf(b); });
      document.querySelectorAll('[data-store="cart-item-' + KIT_ID + '"], [data-store="cart-item-' + PACK_ID + '"]').forEach(function (row) {
        var nm = row.querySelector('.name, .js-cart-item-name') || row; var t = row.querySelector('.kmd-dist');
        if (!adds.length) { if (t) t.remove(); return; }
        if (!t) { t = document.createElement('div'); t.className = 'kmd-dist'; t.style.cssText = 'font-size:12px;color:#fb923c;margin-top:4px;font-weight:600'; nm.parentNode.insertBefore(t, nm.nextSibling); }
        var txt = 'Distancias: ' + adds.join(' · '); if (t.textContent !== txt) t.textContent = txt;
      });
    } catch (e) {}
  }
  var fixing = false, lastSig = '';
  function reconcile() {
    if (SUCCESS || fixing || !(window.LS && LS.cart && LS.cart.items)) return;
    var items = cartItems(), sig = JSON.stringify(items);
    fixBadge(); showDist();
    if (sig === lastSig) return; lastSig = sig;
    var ops = planFix(items); if (!ops.length) return;
    fixing = true;
    runOps(ops).catch(function () {}).then(function () { fixing = false; lastSig = ''; fixBadge(); showDist(); });
  }
  setInterval(reconcile, 1000);
  /* antes de ir al checkout, asegurar que no queden placas sueltas */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[name="go_to_checkout"], .js-go-checkout-btn, [data-component="cart.checkout-button"]');
    if (!b || b.dataset.kmdOk) return;
    if (!cartItems().some(function (i) { return i.pid === KIT_ID || i.pid === ADDON_ID || i.pid === PACK_ID; })) return;
    e.preventDefault(); e.stopImmediatePropagation(); fixing = true;
    freshCart().then(function (items) { return runOps(planFix(items)); }).catch(function () {})
      .then(function () { fixing = false; b.dataset.kmdOk = 1; b.click(); });
  }, true);
  function kit(n) {
    fixBadge();
    if (!(window.LS && LS.product && LS.product.id === KIT_ID)) return;
    var form = document.querySelector('[data-store^="product-form-"]') || document.querySelector('.js-product-form');
    var sel = form && form.querySelector('select[name="variation[0]"]');
    var anchor = document.querySelector('.product-price-container');
    if (!sel || !anchor) { if ((n || 0) < 40) setTimeout(function () { kit((n || 0) + 1); }, 250); return; }
    css('.kmd-hide{display:none!important}' +
      '.kmd-k-lbl{font-size:13px;color:#e5e7eb;font-weight:600;margin:18px 0 2px}.kmd-k-sub{font-size:12px;color:#94a3b8;margin:0 0 10px}' +
      '.kmd-k-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}@media(max-width:420px){.kmd-k-grid{gap:6px}}' +
      '.kmd-k-chip{position:relative;border:1px solid #2a3340;background:#12161d;border-radius:10px;padding:11px 2px;text-align:center;font:700 13px Poppins,sans-serif;color:#fff;cursor:pointer;line-height:1.15;transition:border-color .15s,background .15s;-webkit-tap-highlight-color:transparent}' +
      '.kmd-k-chip span{display:block;font-size:10px;font-weight:500;color:#94a3b8;margin-top:2px}' +
      '.kmd-k-chip.on{border-color:#fb923c;background:#1b1610}.kmd-k-chip.on span{color:#fdba74}.kmd-k-chip.on:after{content:"\\2713";position:absolute;top:3px;right:6px;font-size:11px;color:#fb923c}' +
      '.kmd-k-sum{margin-top:14px;border:1px solid #2a3340;border-radius:12px;padding:12px 14px;background:#11141a;font-size:13px}' +
      '.kmd-k-row{display:flex;justify-content:space-between;margin:3px 0}.kmd-k-row b{color:#fff}' +
      '.kmd-k-tags{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.kmd-k-tag{background:#fb923c;color:#111;font-size:11px;font-weight:700;border-radius:6px;padding:3px 8px}' +
      '.kmd-k-next{font-size:12px;color:#fdba74;margin-top:6px}.kmd-k-err{color:#f87171;font-size:13px;margin-top:8px;display:none}' +
      '.kmd-falta{display:none;align-items:center;gap:8px;margin:10px 0 4px;padding:9px 12px;border:1px dashed #fb923c;border-radius:10px;background:#1b1610;color:#fdba74;font-size:13px;line-height:1.35}' +
      '.kmd-falta.on{display:flex}.kmd-falta b{color:#fb923c}.kmd-falta svg{flex:none}.kmd-falta-hide{display:none!important}');
    var varWrap = form.querySelector('.js-product-variants'); if (varWrap) varWrap.classList.add('kmd-hide');
    var ui = document.createElement('div');
    ui.innerHTML = '<div class="kmd-k-lbl">Elegí tus distancias</div><div class="kmd-k-sub">Tocá cada distancia que quieras en tu tablero. Una placa por distancia.</div>' +
      '<div class="kmd-k-grid">' + DIST.map(function (d, i) { return '<div class="kmd-k-chip" data-i="' + i + '">' + d[0] + (d[1] ? '<span>' + d[1] + '</span>' : '') + '</div>'; }).join('') + '</div>' +
      '<div class="kmd-k-sum"><div class="kmd-k-row"><span>Tu tablero</span><b class="kmd-k-n">Sin distancias</b></div><div class="kmd-k-tags"></div>' +
      '<div class="kmd-k-row"><span>Total</span><b class="kmd-k-tot">-</b></div><div class="kmd-k-next">Elegí al menos una distancia.</div></div>' +
      '<div class="kmd-k-err">Elegí al menos una distancia para agregar al carrito.</div>';
    (varWrap || form.firstChild).parentNode.insertBefore(ui, varWrap || form.firstChild);
    var falta = document.createElement('div'); falta.className = 'kmd-falta';
    falta.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="#fb923c"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9 1.96 2.5H17V9.5h2.5zM18 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg><span></span>';
    anchor.appendChild(falta);
    var cartSub = 0; try { (LS.cart.items || []).forEach(function (i) { if (i.product_id !== KIT_ID && i.product_id !== PACK_ID) cartSub += (i.unit_price || 0) * i.quantity / 100; }); } catch (e) {}
    var chosen = [];
    function money(x) { return '$' + Math.round(x).toLocaleString('es-AR'); }
    function vFor(c) { var name = c + (c === 1 ? ' placa' : ' placas'); return (LS.variants || []).filter(function (v) { return v.option0 === name; })[0]; }
    function priceFor(c) { var v = vFor(c); return v ? v.price_number : (c > 10 ? priceFor(10) + 6000 * (c - 10) : 0); }
    function qty() { return parseInt((form.querySelector('input[name="quantity"]') || {}).value, 10) || 1; }
    function slideTo(key) {
      var sw = document.querySelector('.js-swiper-product'); if (!sw || !sw.swiper) return;
      var slides = sw.querySelectorAll('.swiper-slide');
      for (var i = 0; i < slides.length; i++) {
        var im = slides[i].querySelector('img'); var s = im ? (im.getAttribute('data-srcset') || im.getAttribute('srcset') || im.src || '') : '';
        if (s.indexOf('placa_' + key + '-') > -1) { sw.swiper.slideTo(i); return; }
      }
    }
    function render() {
      var c = chosen.length;
      ui.querySelectorAll('.kmd-k-chip').forEach(function (el) { el.classList.toggle('on', chosen.indexOf(+el.dataset.i) > -1); });
      ui.querySelector('.kmd-k-n').textContent = c ? c + (c === 1 ? ' placa' : ' placas') : 'Sin distancias';
      ui.querySelector('.kmd-k-tags').innerHTML = chosen.slice().sort(function (a, b) { return a - b; }).map(function (i) { return '<span class="kmd-k-tag">' + DIST[i][3] + '</span>'; }).join('');
      ui.querySelector('.kmd-k-tot').textContent = c ? money(priceFor(c) * qty()) : '-';
      ui.querySelector('.kmd-k-next').textContent = c ? (c < DIST.length ? 'Sumá otra distancia por solo ' + money(priceFor(c + 1) - priceFor(c)) + '.' : 'Tenés todas las distancias.') : 'Elegí al menos una distancia.';
      var total = cartSub + (c ? priceFor(c) * qty() : 0);
      var nat = document.querySelector('.js-free-shipping-minimum-message');
      if (!c || total >= FREE_MIN) { falta.classList.remove('on'); if (nat) nat.classList.toggle('kmd-falta-hide', !c); }
      else { falta.querySelector('span').innerHTML = 'Te faltan <b>' + money(FREE_MIN - total) + '</b> para el envío gratis.'; falta.classList.add('on'); if (nat) nat.classList.add('kmd-falta-hide'); }
    }
    function setVariant() {
      var c = Math.max(1, chosen.length), name = c + (c === 1 ? ' placa' : ' placas');
      if (sel.value !== name && [].some.call(sel.options, function (o) { return o.value === name; })) { sel.value = name; sel.dispatchEvent(new Event('change', { bubbles: true })); }
    }
    ui.querySelector('.kmd-k-grid').addEventListener('click', function (e) {
      var el = e.target.closest('.kmd-k-chip'); if (!el) return;
      var i = +el.dataset.i, p = chosen.indexOf(i);
      if (p > -1) chosen.splice(p, 1); else chosen.push(i);
      ui.querySelector('.kmd-k-err').style.display = 'none';
      setVariant(); render();
      if (p === -1) setTimeout(function () { slideTo(DIST[i][2]); }, 250);
    });
    form.addEventListener('input', render);
    /* si ya hay un tablero en el carrito: precargar sus distancias (el nuevo lo reemplaza) */
    var inCart = cartItems(), hadKit = inCart.some(function (i) { return i.pid === KIT_ID || i.pid === PACK_ID; }), hadPack = inCart.some(function (i) { return i.pid === PACK_ID; });
    if (hadKit) {
      inCart.forEach(function (a) { if (a.pid !== ADDON_ID) return; var lb = a.label.replace(/[()]/g, '').replace(/^placa\s*/i, '').trim();
        DIST.forEach(function (d, i) { if (d[3] === lb && chosen.indexOf(i) < 0) chosen.push(i); }); });
      var nt = document.createElement('div'); nt.className = 'kmd-k-sub'; nt.style.cssText = 'color:#fdba74;margin:10px 0 0';
      nt.textContent = hadPack ? 'Ya tenés el pack de 2 placas con tu cuadro. Si armás el kit acá, reemplaza al pack (se cobra el precio del kit).' : 'Ya tenés un tablero en tu carrito con estas distancias. Sumá o sacá las que quieras y tocá "Actualizar carrito".';
      ui.querySelector('.kmd-k-sum').appendChild(nt);
    }
    setVariant(); render();
    var btn0 = form.querySelector('[data-store="product-buy-button"], .js-addtocart[type=submit]');
    if (hadKit && btn0) btn0.value = 'ACTUALIZAR CARRITO';
    var busy = false;
    function addOne(pid, val, q) {
      var fd = new FormData(); fd.append('add_to_cart', String(pid)); fd.append('variation[0]', val); fd.append('quantity', String(q));
      return fetch('/comprar/', { method: 'POST', body: fd, credentials: 'include' }).then(function (r) { if (!r.ok) throw new Error('add ' + r.status); return r; });
    }
    function onAdd(e) {
      e.preventDefault(); e.stopImmediatePropagation();
      if (!chosen.length) { ui.querySelector('.kmd-k-err').style.display = 'block'; return; }
      if (busy) return; busy = true;
      var q = qty(), list = chosen.slice().sort(function (a, b) { return a - b; });
      var btn = form.querySelector('[data-store="product-buy-button"], .js-addtocart[type=submit]');
      if (btn) { btn.dataset.kmdTxt = btn.value; btn.value = 'AGREGANDO...'; btn.disabled = true; }
      post('🧩 KIT AL CARRITO\n' + list.length + ' placas → ' + list.map(function (i) { return DIST[i][3]; }).join(' · ') + '\nCant: ' + q + '\n' + new Date().toLocaleString('es-AR'));
      /* 1) sacar del carrito cualquier tablero anterior (kit + placas de $0), leído en vivo del servidor
         2) en orden: el kit (crea el carrito si no existe), después cada placa */
      fixing = true;
      var chain = freshCart().catch(function () { return cartItems(); }).then(function (items) {
        return runOps(items.filter(function (i) { return i.pid === KIT_ID || i.pid === ADDON_ID || i.pid === PACK_ID; }).map(function (i) { return [i.line, 0]; }));
      }).then(function () { return addOne(KIT_ID, sel.value, q); });
      list.forEach(function (i) { chain = chain.then(function () { return addOne(ADDON_ID, 'placa ' + DIST[i][3], q); }); });
      chain.then(function () { location.href = '/comprar/'; })
        .catch(function () { busy = false; fixing = false; if (btn) { btn.value = btn.dataset.kmdTxt || 'AGREGAR AL CARRITO'; btn.disabled = false; }
          ui.querySelector('.kmd-k-err').textContent = 'No se pudo agregar. Probá de nuevo.'; ui.querySelector('.kmd-k-err').style.display = 'block'; });
    }
    form.addEventListener('submit', onAdd, true);
    document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-store^="product-form-"] .js-addtocart, [data-store^="product-form-"] [type=submit]')) onAdd(e); }, true);
  }

  /* ---------- Cuadro personalizado: 3 tipos + datos + GPX + vista previa ---------- */
  /* ===== Cuadro personalizado v2: 3 tipos, mapa real, 3D ===== */
  var CP = {
    carrera: { label: 'Carrera', sub: 'Portamedallas + 1 mapa', img: CDN + 'cp_carrera_v3.jpg', W: 1300, H: 919, opt: /carrera/i,
      legs: [{ n: 'Recorrido', c: [949.5, 316, 222] }],
      fields: [{ k: 'name', l: 'Tu nombre', ph: 'Ej.: Juan Pérez', opt: 1, txt: 1 }, { k: 'tt', l: 'Tiempo final', ph: '3:27:50', time: 1 }],
      ov: [{ k: 'title', x: 50, y: 60.4, s: 3.4, w: 800, up: 1, max: 82, d: 'TU CARRERA' }, { k: 'name', x: 50, y: 66.6, s: 2.3, w: 500, d: '' },
           { k: 'tt', x: 84.6, y: 85.2, s: 2.7, w: 700, d: '' },
           { k: 'dist', x: 15.4, y: 85.4, s: 2.1, w: 700, d: '-- KM' }, { x: 32.7, y: 85.4, s: 2.1, w: 700, fix: 'Tu ciudad', ph: 1 },
           { k: 'date', x: 50, y: 85.4, s: 2.1, w: 700, d: 'Fecha' }, { k: 'elev', x: 67.4, y: 85.4, s: 2.1, w: 700, d: '-- m' }] },
    triatlon: { label: 'Triatlón', sub: 'Portamedallas + 3 mapas', img: CDN + 'cp_triatlon_v3.jpg', W: 1300, H: 919, opt: /triatl/i,
      legs: [{ n: 'Natación', c: [748, 192.5, 132] }, { n: 'Bici', c: [748, 460, 132] }, { n: 'Carrera', c: [748, 727, 132] }],
      fields: [{ k: 'name', l: 'Tu nombre', ph: 'Ej.: Juan Pérez', opt: 1, txt: 1 }, { k: 'sw', l: 'Natación', ph: '49:21', time: 1 }, { k: 'bk', l: 'Bici', ph: '3:10:02', time: 1 },
               { k: 'rn', l: 'Carrera', ph: '1:51:21', time: 1 }, { k: 'tt', l: 'Tiempo final', ph: '5:59:04', time: 1 }],
      ov: [{ k: 'title', x: 9.1, y: 7.0, s: 4.0, w: 800, up: 1, left: 1, wrap: 36, d: 'TU TRIATLÓN' }, { k: 'name', x: 25.8, y: 75.2, s: 2.2, w: 500, max: 40, d: '' },
           { k: 'sw', x: 78.4, y: 18.6, s: 3.2, w: 800, left: 1, d: '' }, { k: 'bk', x: 78.4, y: 47.7, s: 3.2, w: 800, left: 1, d: '' },
           { k: 'rn', x: 78.4, y: 76.8, s: 3.2, w: 800, left: 1, d: '' },
           { k: 'swd', x: 78.5, y: 24.2, s: 1.5, w: 600, left: 1, d: '' }, { k: 'bkd', x: 78.5, y: 53.3, s: 1.5, w: 600, left: 1, d: '' }, { k: 'rnd', x: 78.5, y: 82.4, s: 1.5, w: 600, left: 1, d: '' },
           { k: 'tt', x: 42.2, y: 91.3, s: 1.8, w: 800, d: '' },
           { k: 'dist', x: 9.4, y: 91.7, s: 1.5, w: 700, d: '-- KM' }, { x: 21.3, y: 91.7, s: 1.5, w: 700, fix: 'Tu ciudad', ph: 1 }, { k: 'date', x: 31.6, y: 91.7, s: 1.5, w: 700, d: 'Fecha' }] },
    recorrido: { label: 'Recorrido', sub: 'Sin medallero · viaje, trekking, paseo', img: CDN + 'cp_recorrido.jpg', W: 919, H: 1300, v: 1, opt: /recorrido/i,
      legs: [{ n: 'Recorrido', c: [459, 469, 352] }],
      fields: [{ k: 'name', l: 'Nombre', ph: 'Ej.: Juan y Sofi', opt: 1, txt: 1 }],
      ov: [{ k: 'title', x: 50, y: 75.5, s: 5.2, w: 800, up: 1, max: 80, d: 'TU RECORRIDO' }, { k: 'name', x: 50, y: 82.6, s: 3.0, w: 600, d: '' },
           { k: 'dist', x: 25, y: 88.5, s: 3.0, w: 700, d: '-- KM' }, { x: 50, y: 88.5, s: 3.0, w: 700, fix: 'Lugar', ph: 1 }, { k: 'date', x: 75, y: 88.5, s: 3.0, w: 700, d: 'Fecha' }] }
  };
  var MES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  var LIBS = {};
  function lib(src, isCss) {
    if (LIBS[src]) return LIBS[src];
    return (LIBS[src] = new Promise(function (res, rej) {
      var e = document.createElement(isCss ? 'link' : 'script');
      if (isCss) { e.rel = 'stylesheet'; e.href = src; res(); } else { e.src = src; e.onload = res; e.onerror = rej; }
      document.head.appendChild(e);
    }));
  }
  function loadMap() { lib('https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css', 1); return lib('https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js'); }
  function load3D() { return lib('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js').then(function () { return lib('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js'); }); }
  var CAN3D = (function () { try { var cv = document.createElement('canvas'); if (!(cv.getContext('webgl') || cv.getContext('experimental-webgl'))) return false; } catch (e) { return false; }
    return (navigator.hardwareConcurrency || 4) >= 4 && (navigator.deviceMemory || 4) >= 3; })();
  /* --- GPX --- */
  function parseGpx(text) {
    var doc = new DOMParser().parseFromString(text, 'application/xml');
    if (doc.getElementsByTagName('parsererror').length) throw new Error('el archivo no es un GPX válido');
    var nodes = doc.getElementsByTagName('trkpt'); if (!nodes.length) nodes = doc.getElementsByTagName('rtept');
    var pts = [];
    for (var i = 0; i < nodes.length; i++) { var n = nodes[i], la = parseFloat(n.getAttribute('lat')), lo = parseFloat(n.getAttribute('lon'));
      if (!isFinite(la) || !isFinite(lo)) continue;
      var e = n.getElementsByTagName('ele')[0], t = n.getElementsByTagName('time')[0];
      pts.push({ la: la, lo: lo, e: e ? parseFloat(e.textContent) : NaN, t: t ? Date.parse(t.textContent) : NaN }); }
    if (pts.length < 2) throw new Error('no tiene puntos de recorrido (puede ser una actividad en pileta o rodillo)');
    return pts;
  }
  function hav(a, b) { var R = 6371008.8, d = Math.PI / 180, dl = (b.la - a.la) * d, dn = (b.lo - a.lo) * d, x = Math.sin(dl / 2) * Math.sin(dl / 2) + Math.cos(a.la * d) * Math.cos(b.la * d) * Math.sin(dn / 2) * Math.sin(dn / 2); return 2 * R * Math.asin(Math.min(1, Math.sqrt(x))); }
  function gstats(pts) {
    if (pts._s) return pts._s;
    var dist = 0; for (var i = 1; i < pts.length; i++) dist += hav(pts[i - 1], pts[i]);
    var el = pts.map(function (p) { return p.e; }).filter(isFinite), gain = NaN;
    if (el.length > 10) { var sm = [], w = 3; for (var j = 0; j < el.length; j++) { var s = 0, c = 0; for (var k = Math.max(0, j - w); k <= Math.min(el.length - 1, j + w); k++) { s += el[k]; c++; } sm.push(s / c); }
      gain = 0; var ref = sm[0]; for (var m = 1; m < sm.length; m++) { var dd = sm[m] - ref; if (dd >= 3) { gain += dd; ref = sm[m]; } else if (dd < -3) ref = sm[m]; } }
    var ts = pts.map(function (p) { return p.t; }).filter(isFinite);
    return (pts._s = { dist: dist, gain: gain, t0: ts.length ? Math.min.apply(null, ts) : NaN });
  }
  function km(m) { if (!isFinite(m) || !m) return ''; var v = m / 1000; return (v >= 100 ? Math.round(v).toString() : v.toFixed(1).replace('.', ',')) + ' KM'; }
  function fdate(t) { if (!isFinite(t)) return ''; var d = new Date(t); return d.getDate() + ' ' + MES[d.getMonth()] + ' ' + d.getFullYear(); }
  /* --- mapa real --- */
  var MAPSTYLE = { version: 8, sources: {
      ofm: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' },
      dem: { type: 'raster-dem', tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'], encoding: 'terrarium', tileSize: 256, maxzoom: 15 } },
    layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#1f2023' } },
      { id: 'hs', type: 'hillshade', source: 'dem', paint: { 'hillshade-exaggeration': 0.6, 'hillshade-shadow-color': '#000000', 'hillshade-highlight-color': '#6d7077', 'hillshade-accent-color': '#151618', 'hillshade-illumination-direction': 315 } },
      { id: 'water', type: 'fill', source: 'ofm', 'source-layer': 'water', paint: { 'fill-color': '#a9d4e6' } },
      { id: 'waterway', type: 'line', source: 'ofm', 'source-layer': 'waterway', paint: { 'line-color': '#a9d4e6', 'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.6, 14, 2.5] } }] };
  /* --- 3D --- */
  function merc(lo, la) { var s = Math.sin(la * Math.PI / 180); return [(lo + 180) / 360, 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)]; }
  function unmerc(x, y) { var n = Math.PI - 2 * Math.PI * y; return [x * 360 - 180, 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))]; }
  function region(pts) {
    var xy = pts.map(function (p) { return merc(p.lo, p.la); }), mnx = 1, mxx = 0, mny = 1, mxy = 0;
    xy.forEach(function (q) { mnx = Math.min(mnx, q[0]); mxx = Math.max(mxx, q[0]); mny = Math.min(mny, q[1]); mxy = Math.max(mxy, q[1]); });
    var cx = (mnx + mxx) / 2, cy = (mny + mxy) / 2, r = 0; xy.forEach(function (q) { r = Math.max(r, Math.hypot(q[0] - cx, q[1] - cy)); });
    r = Math.max(r / 0.78, 2e-6); var lat = unmerc(cx, cy)[1];
    return { cx: cx, cy: cy, R: r, xy: xy, meters: r * 40075016.7 * Math.cos(lat * Math.PI / 180) };
  }
  function loadImg(url) { return fetch(url, { mode: 'cors' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.blob(); }).then(function (b) { return createImageBitmap(b); }); }
  function heightGrid(rg) {
    var D = 2 * rg.R, z = Math.max(1, Math.min(14, Math.floor(Math.log2(320 / (D * 256))))), n = Math.pow(2, z);
    var tx0 = Math.floor((rg.cx - rg.R) * n), tx1 = Math.floor((rg.cx + rg.R) * n), ty0 = Math.floor((rg.cy - rg.R) * n), ty1 = Math.floor((rg.cy + rg.R) * n);
    var W = (tx1 - tx0 + 1) * 256, H = (ty1 - ty0 + 1) * 256, cv = document.createElement('canvas'); cv.width = W; cv.height = H; var g = cv.getContext('2d', { willReadFrequently: true }), jobs = [];
    for (var tx = tx0; tx <= tx1; tx++) for (var ty = ty0; ty <= ty1; ty++) (function (tx, ty) {
      jobs.push(loadImg('https://s3.amazonaws.com/elevation-tiles-prod/terrarium/' + z + '/' + (((tx % n) + n) % n) + '/' + ty + '.png').then(function (im) { g.drawImage(im, (tx - tx0) * 256, (ty - ty0) * 256); }).catch(function () {}));
    })(tx, ty);
    return Promise.all(jobs).then(function () {
      var d = g.getImageData(0, 0, W, H).data;
      return function (mx, my) {
        var px = (mx * n - tx0) * 256 - 0.5, py = (my * n - ty0) * 256 - 0.5, x0 = Math.max(0, Math.min(W - 2, Math.floor(px))), y0 = Math.max(0, Math.min(H - 2, Math.floor(py))), fx = Math.min(1, Math.max(0, px - x0)), fy = Math.min(1, Math.max(0, py - y0));
        function h(x, y) { var i = (y * W + x) * 4; if (d[i + 3] === 0) return NaN; return d[i] * 256 + d[i + 1] + d[i + 2] / 256 - 32768; }
        var a = h(x0, y0), b = h(x0 + 1, y0), c = h(x0, y0 + 1), e = h(x0 + 1, y0 + 1);
        if (!isFinite(a + b + c + e)) { var v = [a, b, c, e].filter(isFinite); return v.length ? v[0] : 0; }
        return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + e * fx) * fy;
      };
    });
  }
  function waterTexture(rg) {
    return new Promise(function (res) {
      var S = 1024, box = document.createElement('div'); box.style.cssText = 'position:fixed;left:-3000px;top:0;width:' + S + 'px;height:' + S + 'px;pointer-events:none'; document.body.appendChild(box);
      var ll = unmerc(rg.cx, rg.cy), zoom = Math.log2(S / (2 * rg.R * 512)), done = false, m;
      function fin(ok) { if (done) return; done = true; var cv = document.createElement('canvas'); cv.width = S; cv.height = S; var g = cv.getContext('2d'); g.fillStyle = '#2a2b2f'; g.fillRect(0, 0, S, S);
        if (ok) { try { g.drawImage(m.getCanvas(), 0, 0, S, S); } catch (e) {} } try { m && m.remove(); } catch (e) {} box.remove(); res(cv); }
      try {
        m = new maplibregl.Map({ container: box, style: { version: 8, sources: { ofm: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' } }, layers: [
          { id: 'bg', type: 'background', paint: { 'background-color': '#2a2b2f' } }, { id: 'water', type: 'fill', source: 'ofm', 'source-layer': 'water', paint: { 'fill-color': '#a9d4e6' } },
          { id: 'waterway', type: 'line', source: 'ofm', 'source-layer': 'waterway', paint: { 'line-color': '#a9d4e6', 'line-width': 2.5 } }] },
          center: ll, zoom: zoom, interactive: false, attributionControl: false, preserveDrawingBuffer: true, pixelRatio: 1, fadeDuration: 0 });
        m.once('idle', function () { fin(true); }); m.on('error', function () {});
      } catch (e) { fin(false); }
      setTimeout(function () { fin(!!m); }, 9000);
    });
  }
  function buildPiece(rg, hAt, tex) {
    var T = THREE, grp = new T.Group(), RINGS = 90, SEG = 220, i, j, hmin = Infinity, hmax = -Infinity, raw = [];
    function H(x, y) { return hAt(rg.cx + x * rg.R, rg.cy - y * rg.R); }
    for (i = 0; i <= RINGS; i++) { raw[i] = []; var rr = i / RINGS, segs = i === 0 ? 1 : SEG; for (j = 0; j < segs; j++) { var a = j / SEG * Math.PI * 2, x = rr * Math.cos(a), y = rr * Math.sin(a), h = H(x, y); raw[i].push([x, y, h]); if (isFinite(h)) { hmin = Math.min(hmin, h); hmax = Math.max(hmax, h); } } }
    if (!isFinite(hmin)) { hmin = 0; hmax = 0; }
    var range = Math.max(1, hmax - hmin), nat = 1 / rg.meters, ex = Math.max(1.5, Math.min(6, 0.12 / (range * nat))); ex = Math.min(ex, 0.32 / (range * nat));
    var K = nat * ex, BASE = 0.07;
    function Y(h) { return (isFinite(h) ? h - hmin : 0) * K + BASE; }
    var pos = [], uv = [], idx = [], start = [];
    for (i = 0; i <= RINGS; i++) { start[i] = pos.length / 3; raw[i].forEach(function (p) { pos.push(p[0], Y(p[2]), -p[1]); uv.push((p[0] + 1) / 2, (p[1] + 1) / 2); }); }
    for (j = 0; j < SEG; j++) idx.push(0, start[1] + j, start[1] + (j + 1) % SEG);
    for (i = 1; i < RINGS; i++) for (j = 0; j < SEG; j++) { var a0 = start[i] + j, a1 = start[i] + (j + 1) % SEG, b0 = start[i + 1] + j, b1 = start[i + 1] + (j + 1) % SEG; idx.push(a0, b0, a1, a1, b0, b1); }
    var geo = new T.BufferGeometry(); geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
    var map = new T.CanvasTexture(tex); if (T.sRGBEncoding) map.encoding = T.sRGBEncoding; map.anisotropy = 4;
    grp.add(new T.Mesh(geo, new T.MeshStandardMaterial({ map: map, roughness: 0.92, metalness: 0 })));
    var wp = [], wi = [];
    for (j = 0; j < SEG; j++) { var p = raw[RINGS][j]; wp.push(p[0], Y(p[2]), -p[1], p[0], 0, -p[1]); }
    for (j = 0; j < SEG; j++) { var k = j * 2, k2 = ((j + 1) % SEG) * 2; wi.push(k, k + 1, k2, k2, k + 1, k2 + 1); }
    var wg = new T.BufferGeometry(); wg.setAttribute('position', new T.Float32BufferAttribute(wp, 3)); wg.setIndex(wi); wg.computeVertexNormals();
    var side = new T.MeshStandardMaterial({ color: new T.Color(0x1d1e21).convertSRGBToLinear(), roughness: 0.85, side: T.DoubleSide });
    grp.add(new T.Mesh(wg, side)); var bot = new T.Mesh(new T.CircleGeometry(1, SEG), side); bot.rotation.x = Math.PI / 2; grp.add(bot);
    var step = Math.max(1, Math.ceil(rg.xy.length / 700)), cp = [];
    for (i = 0; i < rg.xy.length; i += step) { var q = rg.xy[i], xx = (q[0] - rg.cx) / rg.R, yy = -(q[1] - rg.cy) / rg.R; cp.push(new T.Vector3(xx, Y(H(xx, yy)) + 0.012, -yy)); }
    if (cp.length > 1) { var curve = new T.CatmullRomCurve3(cp, false, 'centripetal');
      grp.add(new T.Mesh(new T.TubeGeometry(curve, Math.min(3000, cp.length * 3), 0.013, 8, false), new T.MeshStandardMaterial({ color: new T.Color(0xf26a1d).convertSRGBToLinear(), roughness: 0.5, emissive: new T.Color(0xf26a1d).convertSRGBToLinear(), emissiveIntensity: 0.18 }))); }
    return { grp: grp, ex: ex, relief: range };
  }
  function shadowMesh() { var cv = document.createElement('canvas'); cv.width = cv.height = 128; var g = cv.getContext('2d'), gr = g.createRadialGradient(64, 64, 10, 64, 64, 64); gr.addColorStop(0, 'rgba(0,0,0,.45)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    var m = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 2.9), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.y = -0.32; return m; }

  function custom(n) {
    if (!(window.LS && LS.product && LS.product.id === CUSTOM_ID)) return;
    var form = document.querySelector('[data-store="product-form-' + CUSTOM_ID + '"]') || document.querySelector('.js-product-form');
    var btn = form && form.querySelector('[data-store="product-buy-button"], .js-addtocart[type=submit], [type=submit]');
    var slider = document.querySelector('.product-slider-container');
    if (!btn || !slider) { if ((n || 0) < 40) setTimeout(function () { custom((n || 0) + 1); }, 250); return; }
    var fl0 = document.createElement('link'); fl0.rel = 'stylesheet'; fl0.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700;800&display=swap'; document.head.appendChild(fl0);
    Object.keys(CP).forEach(function (k) { new Image().src = CP[k].img; });
    var sel = form.querySelector('select[name="variation[0]"]');
    css('.kmd-hide{display:none!important}.kmd-c{margin:4px 0 16px}.kmd-c [hidden]{display:none!important}.kmd-c-l{display:block;font-size:13px;font-weight:600;color:#fff;margin:14px 0 6px}.kmd-c-l span{font-weight:400;color:#94a3b8;font-size:12px}' +
      '.kmd-c-t{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.kmd-c-t button{text-align:left;border:1px solid #2a3340;border-radius:12px;padding:11px 12px;background:#12161d;color:#e5e7eb;cursor:pointer;font-family:inherit}' +
      '.kmd-c-t b{display:block;color:#fff;font-size:14px}.kmd-c-t span{font-size:11px;color:#94a3b8;line-height:1.3;display:block;margin-top:2px}.kmd-c-t button.on{border-color:#fb923c;background:#1b1610}.kmd-c-t button.on span{color:#fdba74}' +
      '@media(max-width:480px){.kmd-c-t{grid-template-columns:1fr}}' +
      '.kmd-c-g{display:grid;grid-template-columns:1fr 1fr;gap:10px}.kmd-c-g .full{grid-column:1/-1}' +
      '.kmd-c input[type=text]{width:100%;box-sizing:border-box;background:#0f1218;border:1px solid #2a3340;color:#fff;border-radius:10px;padding:11px 12px;font:500 15px Poppins,sans-serif}' +
      '.kmd-c input.tm{font:600 17px Poppins,sans-serif;letter-spacing:.05em}.kmd-c input[type=text]:focus{outline:none;border-color:#fb923c}.kmd-c input.err{border-color:#ef4444}.kmd-c input:disabled{opacity:.4}' +
      '.kmd-c-ck{display:flex;align-items:center;gap:8px;font-size:13px;color:#cbd5e1;margin-top:10px;cursor:pointer}.kmd-c-ck input{accent-color:#fb923c;width:16px;height:16px}' +
      '.kmd-c-drops{display:grid;gap:8px}.kmd-c-f{position:relative;display:flex;align-items:center;gap:10px;border:1px dashed #2a3340;border-radius:10px;padding:12px;background:#12161d;cursor:pointer;color:#cbd5e1;font-size:13px;min-width:0}' +
      '.kmd-c-f.on{border-color:#fb923c;background:#1b1610;color:#fdba74}.kmd-c-f.bad{border-color:#ef4444;color:#f87171}.kmd-c-f input{position:absolute;width:1px;height:1px;opacity:0}.kmd-c-f .lg{font-weight:600;color:#fff;min-width:68px}.kmd-c-f .fn{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0}.kmd-c-f .x{margin-left:auto;background:none;border:0;color:#94a3b8;cursor:pointer;font:600 12px Poppins,sans-serif}' +
      '.kmd-c-h{font-size:12px;color:#94a3b8;margin-top:8px;line-height:1.45}.kmd-c-h b{color:#e5e7eb}.kmd-c details{margin-top:8px;font-size:12px;color:#94a3b8;line-height:1.5}.kmd-c summary{cursor:pointer;color:#fb923c;font-weight:600}' +
      '.kmd-c-3d{margin-top:10px;background:#fb923c;color:#111;border:0;border-radius:10px;padding:10px 14px;font:700 13px Poppins,sans-serif;cursor:pointer}' +
      '.kmd-c-dis{margin-top:10px;font-size:12px;color:#cbd5e1;background:#12161d;border:1px solid #2a3340;border-radius:10px;padding:9px 11px;line-height:1.45}' +
      '.kmd-c-e{color:#f87171;font-size:13px;margin-top:10px;display:none}' +
      '.product-slider-container{position:relative}.kmd-cp{position:absolute;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 40%,#f4f2ee,#dcd8d1)}' +
      '.kmd-cp-fr{background:#1a1a1a;padding:3%;border-radius:3px;box-shadow:0 18px 36px rgba(0,0,0,.45),inset 0 0 0 2px #2b2b2b}.kmd-cp-pic{container-type:inline-size;position:relative;background:#fff}.kmd-cp-pic img{width:100%;display:block}' +
      '.kmd-cp-pic svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}' +
      '.kmd-cp-o{position:absolute;font-family:Inter,sans-serif;color:#0a0f18;line-height:1.15;white-space:nowrap;transform:translateX(-50%)}.kmd-cp-o.left{transform:none}.kmd-cp-o.ph{opacity:.3}' +
      '.kmd-cp-b{position:absolute;left:12px;top:12px;background:#fb923c;color:#111;font:600 11px Poppins,sans-serif;padding:4px 8px;border-radius:6px;letter-spacing:.04em;z-index:4}' +
      '.kmd-cp-cr{position:absolute;right:8px;bottom:6px;font:500 9px Poppins,sans-serif;color:#6b6b6b;z-index:4}' +
      '.kmd-mapd{position:absolute;border-radius:50%;overflow:hidden;aspect-ratio:1;pointer-events:none;opacity:0;transition:opacity .5s}.kmd-mapd.ok{opacity:1}.kmd-mapd .in{position:absolute;left:0;top:0;transform-origin:0 0}' +
      '.kmd-mapd::after{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08),inset -4px -6px 14px rgba(0,0,0,.35),inset 3px 4px 10px rgba(255,255,255,.06)}' +
      '.kmd-hot{position:absolute;border-radius:50%;aspect-ratio:1;border:0;padding:0;background:transparent;cursor:pointer;z-index:3;display:flex;align-items:flex-end;justify-content:center}' +
      '.kmd-hot span{margin-bottom:-2.4cqw;background:#fb923c;color:#111;font:600 1.6cqw/1 Poppins,sans-serif;padding:.6cqw 1cqw;border-radius:99px;opacity:0;transition:.2s;white-space:nowrap}' +
      '.kmd-hot:hover span{opacity:1}@media (hover:none){.kmd-hot span{opacity:.92}}.kmd-hot:hover{box-shadow:0 0 0 .5cqw rgba(251,146,60,.55)}' +
      '.kmd-cp.is3d .kmd-cp-fr{visibility:hidden}.kmd-v3{position:absolute;inset:0;z-index:6;background:radial-gradient(circle at 50% 35%,#f4f2ee,#d6d1c9);display:flex;flex-direction:column}' +
      '.kmd-v3[hidden]{display:none!important}.kmd-v3gl{flex:1;min-height:0;touch-action:none;cursor:grab}.kmd-v3gl canvas{display:block;width:100%!important;height:100%!important}' +
      '.kmd-v3top{position:absolute;left:12px;right:12px;top:12px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between}' +
      '.kmd-v3back{background:#111;color:#fff;border:0;border-radius:99px;padding:8px 14px;font:600 13px Poppins,sans-serif;cursor:pointer}' +
      '.kmd-v3tabs{position:absolute;left:0;right:0;bottom:36px;display:flex;gap:6px;justify-content:center;flex-wrap:wrap}.kmd-v3tabs button{background:rgba(17,17,17,.85);color:#fff;border:0;border-radius:99px;padding:7px 12px;font:600 12px Poppins,sans-serif;cursor:pointer}.kmd-v3tabs button.on{background:#fb923c;color:#111}.kmd-v3tabs button:disabled{opacity:.35}' +
      '.kmd-v3foot{position:absolute;left:12px;right:12px;bottom:10px;display:flex;justify-content:space-between;gap:10px;font:500 11px Poppins,sans-serif;color:#3b3b3b;flex-wrap:wrap}' +
      '.kmd-v3msg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:600 14px Poppins,sans-serif;color:#2b2b2b;text-align:center;padding:20px}.kmd-v3msg[hidden]{display:none!important}');
    var box = document.createElement('div'); box.className = 'kmd-c';
    box.innerHTML = '<span class="kmd-c-l">Elegí tu cuadro</span><div class="kmd-c-t">' +
      Object.keys(CP).map(function (k) { return '<button type="button" data-t="' + k + '"><b>' + CP[k].label + '</b><span>' + CP[k].sub + '</span></button>'; }).join('') + '</div>' +
      '<span class="kmd-c-l">Título del cuadro</span><input type="text" class="kmd-c-ti" maxlength="60" placeholder="Ej.: Maratón de Buenos Aires 2026">' +
      '<div class="kmd-c-fields"></div>' +
      '<span class="kmd-c-l kmd-c-gl">Tu recorrido (.gpx) <span>· opcional</span></span><div class="kmd-c-drops"></div>' +
      '<div class="kmd-c-h">Con tu GPX dibujamos <b>el recorrido exacto</b> de tu mapa y completamos distancia, fecha y desnivel. Si no lo tenés, comprá igual: pegá abajo el link de tu actividad o te lo pedimos por mail.</div>' +
      '<details><summary>¿Cómo consigo mi GPX?</summary><b>Strava</b> (desde la compu): abrí tu actividad → menú <b>⋯</b> → <b>Exportar GPX</b>.<br><b>Garmin Connect</b>: abrí tu actividad → <b>⚙</b> → <b>Exportar a GPX</b>.<br>En el celular es más fácil mandarnos el link de la actividad.</details>' +
      '<button type="button" class="kmd-c-3d" hidden>Ver mapa en 3D</button>' +
      '<div class="kmd-c-dis" hidden>Imagen orientativa. Tu mapa final se arma en relieve 3D con los datos reales de tu recorrido y puede verse distinto.</div>' +
      '<span class="kmd-c-l">Link de tu actividad <span>· opcional (Strava, Garmin)</span></span><input type="text" class="kmd-c-lk" maxlength="200" placeholder="https://www.strava.com/activities/...">' +
      '<div class="kmd-c-e"></div>';
    var qEl = form.querySelector('.js-product-quantity');
    var anchorEl = (qEl && (qEl.closest('.product-quantity') || qEl.closest('.row') || qEl.closest('.form-group'))) || btn;
    if (!anchorEl.parentNode || !form.contains(anchorEl)) anchorEl = btn;
    anchorEl.parentNode.insertBefore(box, anchorEl);
    var varWrap = form.querySelector('.js-product-variants'); if (varWrap && sel) varWrap.classList.add('kmd-hide');
    var title = box.querySelector('.kmd-c-ti'), link = box.querySelector('.kmd-c-lk'), err = box.querySelector('.kmd-c-e'), wrap = box.querySelector('.kmd-c-fields'), drops = box.querySelector('.kmd-c-drops'), b3d = box.querySelector('.kmd-c-3d'), dis = box.querySelector('.kmd-c-dis');
    var type = 'carrera', vals = {}, noTime = false, FILES = {}, TR = {};
    /* vista previa */
    var prev = document.createElement('div'); prev.className = 'kmd-cp';
    prev.innerHTML = '<span class="kmd-cp-b">VISTA PREVIA · APROXIMADA</span><div class="kmd-cp-fr"><div class="kmd-cp-pic"><img alt="Vista previa de tu cuadro"><svg aria-hidden="true"></svg></div></div>' +
      '<span class="kmd-cp-cr" hidden>Mapa © OpenFreeMap © OpenMapTiles © OpenStreetMap</span>' +
      '<div class="kmd-v3" hidden><div class="kmd-v3gl"></div><div class="kmd-v3top"><span class="kmd-cp-b" style="position:static">VISTA 3D APROXIMADA · NO ES EL DISEÑO FINAL</span><button type="button" class="kmd-v3back">← Volver al cuadro</button></div>' +
      '<div class="kmd-v3tabs"></div><div class="kmd-v3foot"><span class="kmd-v3info"></span><span>Arrastrá para girar · pellizcá para acercar</span></div>' +
      '<div class="kmd-v3msg kmd-v3load">Armando tu mapa en 3D…</div><div class="kmd-v3msg kmd-v3err" hidden>No pudimos armar la vista 3D ahora. Probá de nuevo en un rato.</div></div>';
    slider.appendChild(prev);
    var pic = prev.querySelector('.kmd-cp-pic'), fr = prev.querySelector('.kmd-cp-fr'), svg = prev.querySelector('svg'), credit = prev.querySelector('.kmd-cp-cr'), ovEls = [], maps = [];
    var v3 = { on: false, token: 0, ren: null, raf: 0 }, V3 = prev.querySelector('.kmd-v3'), v3gl = prev.querySelector('.kmd-v3gl');
    function legs() { return CP[type].legs; }
    function tracks() { return TR[type] || (TR[type] = []); }
    function fit() {
      var c = CP[type], sw = slider.clientWidth, sh = slider.clientHeight || sw, r = c.W / c.H;
      var w = Math.min(sw * 0.9, sh * 0.88 * r); fr.style.width = Math.round(w) + 'px';
      ovEls.forEach(function (e) { var o = e._o;
        if (o.wrap) { e.style.fontSize = o.s + 'cqw'; var k2 = 0; while (e.offsetHeight > pic.clientHeight * 0.16 && k2++ < 30) e.style.fontSize = (parseFloat(e.style.fontSize) * 0.93) + 'cqw'; }
        if (o.max) { e.style.fontSize = o.s + 'cqw'; var maxW = pic.clientWidth * o.max / 100, k = 0; while (e.offsetWidth > maxW && k++ < 30) e.style.fontSize = (parseFloat(e.style.fontSize) * 0.93) + 'cqw'; } });
      maps.forEach(sizeMap);
    }
    function auto(k) {
      var S = tracks().map(function (p) { return p ? gstats(p) : null; }), any = S.filter(Boolean); if (!any.length) return '';
      if (k === 'dist') return km(any.reduce(function (s, x) { return s + x.dist; }, 0));
      if (k === 'date') { var t = any.map(function (x) { return x.t0; }).filter(isFinite); return t.length ? fdate(Math.min.apply(null, t)) : ''; }
      if (k === 'elev') { var g = any[0].gain; return isFinite(g) ? Math.round(g) + ' m' : ''; }
      var leg = ['swd', 'bkd', 'rnd'].indexOf(k); if (leg > -1 && S[leg]) return km(S[leg].dist);
      return '';
    }
    function paint() {
      ovEls.forEach(function (e) {
        var o = e._o, f = CP[type].fields.filter(function (x) { return x.k === o.k; })[0], v;
        if (o.fix) v = o.fix; else if (o.k === 'title') v = title.value.trim(); else if (f) v = (f.time && noTime) ? '' : (vals[o.k] || ''); else v = auto(o.k);
        var show = v || (o.fix ? '' : o.d || ''); e.textContent = o.up ? show.toUpperCase() : show; e.classList.toggle('ph', !!o.ph || !v);
      });
      fit();
    }
    /* dibujo rápido (disco oscuro + ruta) mientras carga el mapa */
    var NS = 'http://www.w3.org/2000/svg';
    function sv(nm, a, p) { var e = document.createElementNS(NS, nm); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
    function routeD(pts, C) {
      var lat0 = pts.reduce(function (s, p) { return s + p.la; }, 0) / pts.length, k = Math.cos(lat0 * Math.PI / 180), xy = pts.map(function (p) { return [p.lo * k, -p.la]; });
      var mnx = Infinity, mxx = -Infinity, mny = Infinity, mxy = -Infinity; xy.forEach(function (q) { mnx = Math.min(mnx, q[0]); mxx = Math.max(mxx, q[0]); mny = Math.min(mny, q[1]); mxy = Math.max(mxy, q[1]); });
      var cx = (mnx + mxx) / 2, cy = (mny + mxy) / 2, rad = 0; xy.forEach(function (q) { rad = Math.max(rad, Math.hypot(q[0] - cx, q[1] - cy)); });
      var sc = rad > 0 ? (C[2] * 0.76) / rad : 1, d = '', lx = null, ly = null;
      xy.forEach(function (q, i) { var x = C[0] + (q[0] - cx) * sc, y = C[1] + (q[1] - cy) * sc; if (lx === null || i === xy.length - 1 || Math.hypot(x - lx, y - ly) >= 0.7) { d += (d ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); lx = x; ly = y; } });
      return d;
    }
    function draw() {
      var c = CP[type]; svg.setAttribute('viewBox', '0 0 ' + c.W + ' ' + c.H); svg.innerHTML = '';
      maps.forEach(function (m) { try { m.map && m.map.remove(); } catch (e) {} m.div.remove(); }); maps = [];
      pic.querySelectorAll('.kmd-hot').forEach(function (e) { e.remove(); });
      var T = tracks(), has = T.some(Boolean);
      credit.hidden = !has; dis.hidden = !has; b3d.hidden = !(has && CAN3D);
      c.legs.forEach(function (leg, i) {
        var pts = T[i]; if (!pts) return; var C = leg.c, r = C[2], w = Math.max(4, r * 0.042);
        var G = sv('g', {}, svg); sv('circle', { cx: C[0], cy: C[1], r: r + 1.5, fill: '#232427' }, G);
        var d = routeD(pts, C); sv('path', { d: d, fill: 'none', stroke: '#f26a1d', 'stroke-width': w, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, G);
        if (CAN3D) { var b = document.createElement('button'); b.type = 'button'; b.className = 'kmd-hot'; b.setAttribute('aria-label', 'Ver ' + leg.n + ' en 3D');
          b.style.left = ((C[0] - r) / c.W * 100) + '%'; b.style.top = ((C[1] - r) / c.H * 100) + '%'; b.style.width = (2 * r / c.W * 100) + '%';
          b.innerHTML = '<span>' + (c.legs.length > 1 ? 'Tocá para ver en 3D' : 'Ver en 3D') + '</span>'; b.addEventListener('click', function () { open3D(i); }); pic.appendChild(b); }
        realMap(leg, i, pts, G);
      });
    }
    function sizeMap(m) { var real = m.div.clientWidth || 200; m.inner.style.width = m.L + 'px'; m.inner.style.height = m.L + 'px'; m.inner.style.transform = 'scale(' + (real / m.L) + ')'; }
    function realMap(leg, i, pts, G) {
      var c = CP[type], C = leg.c, tp = type;
      loadMap().then(function () {
        if (tp !== type || tracks()[i] !== pts) return;
        var div = document.createElement('div'); div.className = 'kmd-mapd';
        div.style.left = ((C[0] - C[2]) / c.W * 100) + '%'; div.style.top = ((C[1] - C[2]) / c.H * 100) + '%'; div.style.width = (2 * C[2] / c.W * 100) + '%';
        var inner = document.createElement('div'); inner.className = 'in'; div.appendChild(inner); pic.insertBefore(div, pic.querySelector('.kmd-hot'));
        var step = Math.max(1, Math.ceil(pts.length / 5000)), co = []; for (var j = 0; j < pts.length; j += step) co.push([pts[j].lo, pts[j].la]); co.push([pts[pts.length - 1].lo, pts[pts.length - 1].la]);
        var bb = co.reduce(function (a, p) { return [Math.min(a[0], p[0]), Math.min(a[1], p[1]), Math.max(a[2], p[0]), Math.max(a[3], p[1])]; }, [180, 90, -180, -90]);
        var m = { div: div, inner: inner }; m.L = Math.max(300, Math.min(800, Math.round((div.clientWidth || 200) * 2))); sizeMap(m); maps.push(m);
        try { m.map = new maplibregl.Map({ container: inner, style: MAPSTYLE, interactive: false, attributionControl: false, fadeDuration: 0, bounds: [[bb[0], bb[1]], [bb[2], bb[3]]], fitBoundsOptions: { padding: m.L * 0.2 }, maxZoom: 16 }); } catch (e) { div.remove(); return; }
        m.map.on('load', function () {
          var w = m.L * 0.016;
          m.map.addSource('rt', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: co } } });
          m.map.addLayer({ id: 'rt-sh', type: 'line', source: 'rt', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#000', 'line-opacity': 0.55, 'line-width': w * 1.6, 'line-translate': [w * 0.35, w * 0.45], 'line-blur': w * 0.3 } });
          m.map.addLayer({ id: 'rt', type: 'line', source: 'rt', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#f26a1d', 'line-width': w } });
          m.map.addLayer({ id: 'rt-hi', type: 'line', source: 'rt', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#ffb07a', 'line-opacity': 0.75, 'line-width': w * 0.32, 'line-translate': [-w * 0.18, -w * 0.22] } });
          m.map.once('idle', function () { div.classList.add('ok'); G.style.display = 'none'; });
        });
        m.map.on('error', function () {});
      }).catch(function () {});
    }
    /* 3D */
    function stop3D() { cancelAnimationFrame(v3.raf); if (v3.ren) { try { v3.ren.dispose(); v3.ren.forceContextLoss(); } catch (e) {} v3.ren = null; } v3gl.innerHTML = ''; }
    function close3D() { v3.on = false; v3.token++; stop3D(); prev.classList.remove('is3d'); V3.hidden = true; fit(); }
    function open3D(i) {
      var pts = tracks()[i]; if (!pts || !CAN3D) return;
      v3.on = true; var tok = ++v3.token; prev.classList.add('is3d'); V3.hidden = false;
      V3.querySelector('.kmd-v3load').hidden = false; V3.querySelector('.kmd-v3err').hidden = true;
      var L = legs(); V3.querySelector('.kmd-v3tabs').innerHTML = L.length > 1 ? L.map(function (l, k) { return '<button type="button" data-k="' + k + '"' + (k === i ? ' class="on"' : '') + (tracks()[k] ? '' : ' disabled') + '>' + l.n + '</button>'; }).join('') : '';
      stop3D();
      Promise.all([loadMap(), load3D()]).then(function () { var rg = region(pts); return Promise.all([heightGrid(rg), waterTexture(rg), rg]); }).then(function (r) {
        if (tok !== v3.token || !v3.on) return;
        var w = v3gl.clientWidth, h = v3gl.clientHeight, ren = new THREE.WebGLRenderer({ antialias: true, alpha: true }); ren.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); ren.setSize(w, h);
        if (THREE.sRGBEncoding) ren.outputEncoding = THREE.sRGBEncoding; v3gl.innerHTML = ''; v3gl.appendChild(ren.domElement);
        var sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(35, w / h, 0.05, 50); cam.position.set(0, 2.35, 2.75);
        sc.add(new THREE.HemisphereLight(0xffffff, 0x3a3530, 0.5)); var dl = new THREE.DirectionalLight(0xffffff, 0.85); dl.position.set(-2.2, 3, 1.4); sc.add(dl);
        var pc = buildPiece(r[2], r[0], r[1]); pc.grp.position.y = -0.1; sc.add(pc.grp); sc.add(shadowMesh());
        var ct = new THREE.OrbitControls(cam, ren.domElement); ct.enableDamping = true; ct.dampingFactor = 0.08; ct.enablePan = false; ct.minDistance = 1.3; ct.maxDistance = 6; ct.maxPolarAngle = Math.PI * 0.62; ct.autoRotate = true; ct.autoRotateSpeed = 1.1;
        ren.domElement.addEventListener('pointerdown', function () { ct.autoRotate = false; });
        v3.ren = ren; v3.cam = cam; V3.querySelector('.kmd-v3load').hidden = true;
        V3.querySelector('.kmd-v3info').textContent = (L.length > 1 ? L[i].n + ' · ' : '') + 'Relieve ' + Math.round(pc.relief) + ' m · altura exagerada ' + pc.ex.toFixed(1).replace('.', ',') + '×';
        (function loop() { if (!v3.on || v3.ren !== ren) return; ct.update(); ren.render(sc, cam); v3.raf = requestAnimationFrame(loop); })();
      }).catch(function () { if (tok !== v3.token) return; V3.querySelector('.kmd-v3load').hidden = true; V3.querySelector('.kmd-v3err').hidden = false; });
    }
    V3.querySelector('.kmd-v3back').addEventListener('click', close3D);
    V3.querySelector('.kmd-v3tabs').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b && !b.disabled) open3D(+b.dataset.k); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && v3.on) close3D(); });
    b3d.addEventListener('click', function () { var T = tracks(); for (var k = 0; k < T.length; k++) if (T[k]) { open3D(k); try { slider.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {} return; } });
    window.addEventListener('resize', function () { fit(); if (v3.ren) { var w = v3gl.clientWidth, h = v3gl.clientHeight; v3.ren.setSize(w, h); v3.cam.aspect = w / h; v3.cam.updateProjectionMatrix(); } });
    /* carga de GPX por tramo */
    function buildDrops() {
      var L = legs(), F = FILES[type] || (FILES[type] = []); drops.innerHTML = '';
      box.querySelector('.kmd-c-gl').innerHTML = (L.length > 1 ? 'Tus recorridos (.gpx)' : 'Tu recorrido (.gpx)') + ' <span>· opcional</span>';
      L.forEach(function (leg, i) {
        var lb = document.createElement('label'); lb.className = 'kmd-c-f' + (F[i] ? ' on' : '');
        lb.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="#fb923c" aria-hidden="true"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>' + (L.length > 1 ? '<span class="lg">' + leg.n + '</span>' : '') +
          '<span class="fn">' + (F[i] ? esc(F[i].name) : (L.length > 1 ? 'Subir .gpx' : 'Subir archivo .gpx')) + '</span>' + (F[i] ? '<button type="button" class="x">Quitar</button>' : '') +
          '<input type="file" accept=".gpx,application/gpx+xml,application/xml,text/xml">';
        var inp = lb.querySelector('input');
        inp.addEventListener('change', function () { if (inp.files[0]) take(inp.files[0], i, lb); });
        lb.addEventListener('dragover', function (e) { e.preventDefault(); });
        lb.addEventListener('drop', function (e) { e.preventDefault(); var fl = e.dataTransfer.files; if (fl && fl[0]) take(fl[0], i, lb); });
        var x = lb.querySelector('.x'); if (x) x.addEventListener('click', function (e) { e.preventDefault(); F[i] = null; tracks()[i] = null; buildDrops(); draw(); paint(); });
        drops.appendChild(lb);
      });
    }
    function take(file, i, lb) {
      if (file.size > 15 * 1024 * 1024) { lb.classList.add('bad'); lb.querySelector('.fn').textContent = 'Archivo muy grande (máx. 15 MB). Podés comprar igual y mandárnoslo después.'; return; }
      var F = FILES[type], tp = type; F[i] = file;
      var rd = new FileReader();
      rd.onload = function () {
        var pts = null; try { pts = parseGpx(String(rd.result)); } catch (er) { pts = null; }
        if (tp !== type) return;
        tracks()[i] = pts; buildDrops(); draw(); paint();
        if (!pts) { var l2 = drops.children[i]; if (l2) { l2.classList.add('bad'); l2.querySelector('.fn').textContent = file.name + ': lo recibimos, pero no pudimos dibujarlo.'; } }
      };
      rd.readAsText(file);
    }
    function build() {
      var c = CP[type]; prev.querySelector('img').src = c.img; if (v3.on) close3D();
      ovEls.forEach(function (e) { e.remove(); }); ovEls = c.ov.map(function (o) {
        var e = document.createElement('div'); e.className = 'kmd-cp-o' + (o.left ? ' left' : ''); e._o = o;
        e.style.cssText = 'left:' + o.x + '%;top:' + o.y + '%;font-size:' + o.s + 'cqw;font-weight:' + o.w + (o.wrap ? ';white-space:normal;width:' + o.wrap + '%;line-height:1.05' : ''); pic.appendChild(e); return e; });
      var hasTime = c.fields.some(function (f) { return f.time; });
      wrap.innerHTML = '<div class="kmd-c-g">' + c.fields.map(function (f) {
        return '<div class="' + (f.txt ? 'full' : '') + '"><span class="kmd-c-l" style="margin-top:12px">' + f.l + (f.opt ? ' <span>· opcional</span>' : '') + '</span>' +
          '<input type="text" data-k="' + f.k + '" ' + (f.time ? 'inputmode="numeric" class="tm" ' : '') + 'maxlength="' + (f.time ? 9 : 40) + '" placeholder="' + f.ph + '" value="' + esc(vals[f.k] || '') + '"></div>'; }).join('') + '</div>' +
        (hasTime ? '<label class="kmd-c-ck"><input type="checkbox"' + (noTime ? ' checked' : '') + '> Prefiero sin ' + (type === 'triatlon' ? 'tiempos' : 'tiempo') + '</label>' : '');
      wrap.querySelectorAll('input[data-k]').forEach(function (i) {
        var f = c.fields.filter(function (x) { return x.k === i.dataset.k; })[0]; i.disabled = !!(f.time && noTime);
        i.addEventListener('input', function () { if (f.time) i.value = fmt(i.value); vals[f.k] = i.value; i.classList.remove('err'); showErr(''); paint(); });
      });
      var ck = wrap.querySelector('.kmd-c-ck input');
      if (ck) ck.addEventListener('change', function () { noTime = ck.checked; wrap.querySelectorAll('input.tm').forEach(function (i) { i.disabled = noTime; i.classList.remove('err'); }); showErr(''); paint(); });
      box.querySelectorAll('.kmd-c-t button').forEach(function (b) { b.classList.toggle('on', b.dataset.t === type); });
      title.placeholder = type === 'triatlon' ? 'Ej.: IRONMAN 70.3' : type === 'recorrido' ? 'Ej.: Camino de Santiago' : 'Ej.: Maratón de Buenos Aires 2026';
      if (sel) { var o = [].filter.call(sel.options, function (x) { return c.opt.test(x.value) || c.opt.test(x.text); })[0]; if (o && sel.value !== o.value) { sel.value = o.value; sel.dispatchEvent(new Event('change', { bubbles: true })); } }
      buildDrops(); draw(); paint();
    }
    function showErr(t) { err.textContent = t; err.style.display = t ? 'block' : 'none'; }
    box.querySelector('.kmd-c-t').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b && b.dataset.t !== type) { type = b.dataset.t; Object.keys(vals).forEach(function (k) { if (k !== 'name') delete vals[k]; }); build(); } });
    title.addEventListener('input', function () { title.classList.remove('err'); showErr(''); paint(); });
    prev.querySelector('img').addEventListener('load', fit);
    build(); setTimeout(fit, 300);
    function upload(f) {
      return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(String(r.result).split(',')[1]); }; r.onerror = rej; r.readAsDataURL(f); })
        .then(function (b64) { return api({ type: 'gpx', name: f.name, data: b64 }); }).then(function (r) { return r && r.ok ? r.url : ''; }).catch(function () { return ''; });
    }
    function summary(gpx) {
      var c = CP[type], L = ['Tipo: ' + c.label, 'Título: ' + title.value.trim()];
      c.fields.forEach(function (f) { if (f.time) { if (!noTime) L.push(f.l + ': ' + (vals[f.k] || '-')); } else if (vals[f.k]) L.push(f.l + ': ' + vals[f.k]); });
      if (noTime && c.fields.some(function (f) { return f.time; })) L.push('Tiempos: sin tiempo');
      var d = auto('dist'), dt = auto('date'), el = type === 'carrera' ? auto('elev') : '';
      if (d || dt || el) L.push('Del GPX: ' + [d, dt, el].filter(Boolean).join(' · '));
      if (link.value.trim()) L.push('Link actividad: ' + link.value.trim());
      L.push('GPX: ' + (gpx.length ? gpx.join(' , ') : 'no lo subió'));
      return L.join('\n');
    }
    var busy = false, ok = false;
    function go(e) {
      if (ok) return;
      e.preventDefault(); e.stopImmediatePropagation();
      if (!title.value.trim()) { title.classList.add('err'); title.focus(); showErr('Escribí el título de tu cuadro (ej.: el nombre de la carrera).'); return; }
      var c = CP[type], bad = c.fields.filter(function (f) { return f.time && !noTime && !valid(vals[f.k] || ''); });
      if (bad.length) { wrap.querySelectorAll('input.tm').forEach(function (i) { if (!valid(vals[i.dataset.k] || '')) i.classList.add('err'); }); showErr('Completá ' + (bad.length > 1 ? 'tus tiempos' : 'tu tiempo') + ' (solo números) o tildá "Prefiero sin ' + (type === 'triatlon' ? 'tiempos' : 'tiempo') + '".'); return; }
      if (busy) return; busy = true;
      var F = (FILES[type] || []), L = legs(), fs = [], names = [];
      L.forEach(function (l, i) { if (F[i]) { fs.push(F[i]); names.push(L.length > 1 ? l.n + ': ' : ''); } });
      var txt = btn.value;
      function done(gpx) {
        var text = summary(gpx), l = cget().filter(function (r) { return !r.sent && Date.now() - r.ts < 7 * 864e5; });
        l.push({ race: title.value.trim(), text: text, gpx: gpx.join(' , '), ts: Date.now() }); cset(l);
        post('🗺️ CUADRO PERSONALIZADO AL CARRITO\n' + text + '\n' + new Date().toLocaleString('es-AR'));
        ok = true; busy = false; btn.value = txt; btn.disabled = false; btn.click(); setTimeout(function () { ok = false; }, 1500);
      }
      if (!fs.length) return done([]);
      btn.value = 'SUBIENDO TU RECORRIDO...'; btn.disabled = true;
      Promise.all(fs.map(upload)).then(function (urls) { done(urls.map(function (u, i) { return u ? names[i] + u : ''; }).filter(Boolean)); if (urls.some(function (u) { return !u; })) post('⚠️ Algún GPX no se pudo subir'); });
    }
    form.addEventListener('submit', go, true);
    document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-store^="product-form-"] .js-addtocart, [data-store^="product-form-"] [type=submit]')) go(e); }, true);
  }

  function start() { boot(0); kit(0); custom(0); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
