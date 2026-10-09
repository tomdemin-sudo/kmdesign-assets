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

  /* ---------- Página de confirmación (checkout) ---------- */
  if (/\/checkout\//.test(location.pathname) && !SUCCESS) return;
  if (SUCCESS) {
    var list = ls(1).filter(function (r) { return !r.sent && Date.now() - r.ts < 7 * 864e5; });
    if (!list.length) return;
    var tries = 0;
    (function wait() {
      var txt = document.body ? document.body.innerText : '';
      var m = txt.match(/(?:orden|pedido|compra)[^#\d]{0,25}#?\s?(\d{2,8})/i) || txt.match(/#(\d{2,8})/);
      var num = (window.LS && LS.order && (LS.order.number || LS.order.id)) || (m && m[1]);
      if (!num && tries++ < 6) return setTimeout(wait, 500);
      var lines = list.map(function (r) { return r.name + ' → ' + r.times; }).join('\n');
      post('✅ COMPRA CONFIRMADA\nPedido: #' + (num || '¿?') + '\nURL: ' + location.href.split('?')[0] + '\n' + lines + '\n(Chequeá en el pedido que la variante diga "Con mis tiempos")');
      ls(0, ls(1).map(function (r) { r.sent = 1; return r; }));
      var box = document.createElement('div');
      box.style.cssText = 'margin:16px auto;max-width:560px;padding:14px 16px;border-radius:10px;background:#fff7ed;border:1px solid #fb923c;color:#7c2d12;font:500 14px/1.45 Poppins,Arial,sans-serif';
      box.innerHTML = '<b>¡Recibimos tus tiempos!</b><br>' + list.map(function (r) { return r.name + ': <b>' + r.times + '</b>'; }).join('<br>') + '<br><span style="font-size:12px">Los vamos a imprimir tal cual. Si algo está mal, respondé el mail de tu compra.</span>';
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
      '<button type="button" data-v="1"><b>Con mis tiempos</b><span>+$5.000 · impresos en el cuadro</span></button></div>';
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
    form.addEventListener('submit', check, true);
    document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-store^="product-form-"] .js-addtocart, [data-store^="product-form-"] [type=submit]')) check(e); }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { boot(0); }); else boot(0);
})();
