/**
 * MITOBET Local Dev Preview Server v2 - Injector Yaklaşımı
 * 
 * Gerçek siteyi tarayıcıda açarsın, bookmarklet ile local CSS/JS enjekte edilir.
 * Proxy yok, CORS sorunu yok, site normal çalışır.
 * 
 * Kullanım:
 *   npm run dev
 *   Tarayıcıda https://mitobet273.com/tr aç
 *   Bookmark bar'daki "MITO DEV" butonuna tıkla
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

// ============================================================
// AYARLAR
// ============================================================
const PORT = 3000;
const MITOBET_DIR = __dirname;

// ============================================================
// DOSYA LİSTELERİ
// ============================================================

const CSS_FILES = [
  // Pasife taşınanlar kaldırıldı: background.css, header_wallet.css,
  // section_view_buttons.css, sidebar.css, tepe_winner.css, signup-modal
  'CSS/header_buttons.css',
  'CSS/mobile_navbar.css',
  'CSS/section_buttons.css',
  'CSS/modal_buttons.css',
  'CSS/main.css',
  'CSS/hide.css',
  'CSS/vip_hide.css',
  'CSS/slider_bg/slider_border.css',
  'Slider_Alt_CSS/Slider_Alt_CSS.css',
  'PromoPage/promopage.css',
  'PromoPage/Promo_up_button.css',
  'giris_gorseli/mito_giris_gorseli.css',
  'slot_oncesi_css/mito_slot_oncesi.css',
  'slot_oncesi_css/mito_slot_unavailable.css',
  'slot_oncesi_css/slot_unavailable.css',
  'yatirim_uyari_sistemi/yatirim_uyari.css',
  // Uzantısız CSS dosyaları
  'CSS/EK',
  'CSS/Kingo',
  'CSS/Logo',
  'CSS/sidebar',
];

const JS_FILES_WITH_EXT = [
  // Pasife taşınanlar kaldırıldı: font_loader.js, theme_toggle.js, snow_effect.js,
  // promo_image_replacer.js, yatirim_uyari.js
  'SCRIPT/css_blocker.js',
  'SCRIPT/header_extra_buttons.js',
];

const JS_FILES_NO_EXT = [
  // Pasife taşınanlar kaldırıldı: Main, BannerFunctions, PromosyonButton,
  // SportPopupFunction, UIFunctions, UtilityFunctions
];

// ============================================================
// EXPRESS SUNUCU
// ============================================================
const app = express();

/**
 * Tüm yanıtlara CORS header'ları ekle
 * Gerçek siteden localhost'a istek yapılabilmesi için gerekli
 */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

/**
 * /injector.js → Tüm CSS/JS dosyalarını siteye enjekte eden ana script
 * Bookmarklet bu dosyayı yükler ve çalıştırır
 */
app.get('/injector.js', (req, res) => {
  res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store');

  const BASE = `http://localhost:${PORT}`;

  // CSS dosyaları için <link> oluştur
  const cssInjections = CSS_FILES.map(file => {
    const href = `${BASE}/local-dev/${encodeURIComponent(file).replace(/%2F/g, '/')}`;
    return `  injectCSS("${href}", "${file}");`;
  }).join('\n');

  // JS dosyaları için <script> oluştur
  const jsInjections = [...JS_FILES_WITH_EXT, ...JS_FILES_NO_EXT].map(file => {
    const src = `${BASE}/local-dev/${encodeURIComponent(file).replace(/%2F/g, '/')}`;
    return `  injectJS("${src}", "${file}");`;
  }).join('\n');

  const script = `
(function() {
  // Önceki enjeksiyonları temizle (tekrar tıklamada çift yükleme olmasın)
  document.querySelectorAll('[data-mitodev]').forEach(el => el.remove());

  var injectedCount = 0;
  var totalFiles = ${CSS_FILES.length + JS_FILES_WITH_EXT.length + JS_FILES_NO_EXT.length};

  function injectCSS(href, name) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href + '?t=' + Date.now(); // Cache bust
    link.setAttribute('data-mitodev', name);
    link.onload = function() {
      injectedCount++;
      if (injectedCount === totalFiles) showBanner();
    };
    link.onerror = function() {
      console.warn('[MITO DEV] CSS yüklenemedi: ' + name);
      injectedCount++;
      if (injectedCount === totalFiles) showBanner();
    };
    document.head.appendChild(link);
  }

  function injectJS(src, name) {
    var script = document.createElement('script');
    script.src = src + '?t=' + Date.now(); // Cache bust
    script.setAttribute('data-mitodev', name);
    script.onload = function() {
      injectedCount++;
      if (injectedCount === totalFiles) showBanner();
    };
    script.onerror = function() {
      console.warn('[MITO DEV] JS yüklenemedi: ' + name);
      injectedCount++;
      if (injectedCount === totalFiles) showBanner();
    };
    document.body.appendChild(script);
  }

  function showBanner() {
    // Başarı banner'ı göster
    var banner = document.createElement('div');
    banner.setAttribute('data-mitodev', 'banner');
    banner.style.cssText = 'position:fixed;top:10px;right:10px;z-index:999999;' +
      'background:linear-gradient(135deg,#1a1a2e,#16213e);color:#CFAE6D;' +
      'padding:12px 20px;border-radius:8px;font-family:sans-serif;font-size:13px;' +
      'box-shadow:0 4px 20px rgba(0,0,0,0.5);border:1px solid #CFAE6D;' +
      'cursor:pointer;transition:opacity 0.3s;';
    banner.innerHTML = '<strong>MITO DEV</strong> · ' + totalFiles + ' dosya enjekte edildi';
    banner.onclick = function() { banner.style.opacity = '0'; setTimeout(function() { banner.remove(); }, 300); };
    document.body.appendChild(banner);

    // 5 saniye sonra otomatik kaybol
    setTimeout(function() {
      if (banner.parentNode) {
        banner.style.opacity = '0';
        setTimeout(function() { banner.remove(); }, 300);
      }
    }, 5000);

    console.log('[MITO DEV] ' + totalFiles + ' dosya başarıyla enjekte edildi!');
    console.log('[MITO DEV] CSS: ${CSS_FILES.length} | JS: ${JS_FILES_WITH_EXT.length + JS_FILES_NO_EXT.length}');
  }

  // --- CSS Enjeksiyonları ---
${cssInjections}

  // --- JS Enjeksiyonları ---
${jsInjections}

})();
`;

  res.send(script);
});

/**
 * /local-dev/* → Local dosyaları sun
 */
app.get('/local-dev/*', (req, res) => {
  const relativePath = decodeURIComponent(req.params[0]);
  const filePath = path.join(MITOBET_DIR, relativePath);

  // Güvenlik: MITOBET klasörü dışına çıkmayı engelle
  if (!filePath.startsWith(MITOBET_DIR)) {
    return res.status(403).send('Forbidden');
  }

  if (!fs.existsSync(filePath)) {
    console.log(`[404] ${relativePath}`);
    return res.status(404).send(`Dosya bulunamadı: ${relativePath}`);
  }

  // Cache'i kapat (geliştirme modunda her zaman güncel dosya)
  res.setHeader('Cache-Control', 'no-cache, no-store');

  const content = fs.readFileSync(filePath, 'utf-8');

  if (filePath.endsWith('.css') || CSS_FILES.includes(relativePath)) {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
    res.send(content);
  } else if (filePath.endsWith('.js')) {
    res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
    res.send(content);
  } else if (JS_FILES_NO_EXT.includes(relativePath)) {
    // <script> wrapper'ını strip et
    res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
    const stripped = content
      .replace(/^\s*<script[^>]*>\s*/i, '')
      .replace(/\s*<\/script>\s*$/i, '');
    res.send(stripped);
  } else {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(content);
  }
});

/**
 * / → Kullanım kılavuzu sayfası
 */
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  const bookmarkletCode = `javascript:void(function(){var s=document.createElement('script');s.src='http://localhost:${PORT}/injector.js?t='+Date.now();document.body.appendChild(s)})()`;

  res.send(`<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MITO DEV - Local Preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a1a; color: #e0e0e0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .container { max-width: 700px; padding: 40px; }
    h1 { color: #CFAE6D; font-size: 28px; margin-bottom: 8px; }
    .subtitle { color: #888; font-size: 14px; margin-bottom: 32px; }
    .step { background: #111; border: 1px solid #222; border-radius: 10px; padding: 20px; margin-bottom: 16px; }
    .step-num { display: inline-block; background: #CFAE6D; color: #000; width: 28px; height: 28px; text-align: center; line-height: 28px; border-radius: 50%; font-weight: bold; font-size: 14px; margin-right: 10px; }
    .step h3 { display: inline; font-size: 16px; color: #fff; }
    .step p { margin-top: 8px; color: #aaa; font-size: 14px; line-height: 1.5; }
    .bookmarklet { display: inline-block; background: linear-gradient(135deg, #CFAE6D, #a8893a); color: #000; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; margin-top: 12px; cursor: grab; transition: transform 0.2s; }
    .bookmarklet:hover { transform: scale(1.05); }
    code { background: #1a1a2e; color: #CFAE6D; padding: 2px 8px; border-radius: 4px; font-size: 13px; }
    .info { background: #0d1b2a; border: 1px solid #1b3a5c; border-radius: 10px; padding: 16px; margin-top: 24px; font-size: 13px; color: #7ba3c9; }
    .files { margin-top: 24px; font-size: 12px; color: #555; }
  </style>
</head>
<body>
  <div class="container">
    <h1>MITO DEV</h1>
    <p class="subtitle">Local Preview Server · ${CSS_FILES.length} CSS + ${JS_FILES_WITH_EXT.length + JS_FILES_NO_EXT.length} JS dosyası</p>

    <div class="step">
      <span class="step-num">1</span>
      <h3>Bookmarklet'i sürükle</h3>
      <p>Aşağıdaki butonu bookmark bar'ına <strong>sürükle-bırak</strong> yap:</p>
      <p><a class="bookmarklet" href="${bookmarkletCode}">MITO DEV</a></p>
    </div>

    <div class="step">
      <span class="step-num">2</span>
      <h3>Siteyi aç</h3>
      <p>Tarayıcıda gerçek siteyi aç: <code>https://mitobet273.com/tr</code></p>
    </div>

    <div class="step">
      <span class="step-num">3</span>
      <h3>Bookmarklet'e tıkla</h3>
      <p>Bookmark bar'daki <strong>"MITO DEV"</strong> butonuna tıkla. Tüm CSS/JS dosyaların anında siteye enjekte edilir.</p>
    </div>

    <div class="info">
      <strong>İpucu:</strong> Dosyalarda değişiklik yaptıktan sonra sayfayı yenile ve tekrar bookmarklet'e tıkla. Her tıklamada dosyalar güncel halden yüklenir (cache yok).
    </div>

    <div class="files">
      Sunucu: http://localhost:${PORT} · Dosyalar: /local-dev/* · Injector: /injector.js
    </div>
  </div>
</body>
</html>`);
});

// ============================================================
// SUNUCUYU BAŞLAT
// ============================================================
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║        MITO DEV - Local Preview Server v2          ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║  Sunucu:     http://localhost:${PORT}                   ║`);
  console.log(`║  Injector:   http://localhost:${PORT}/injector.js       ║`);
  console.log('║                                                       ║');
  console.log(`║  CSS: ${CSS_FILES.length} dosya  ·  JS: ${(JS_FILES_WITH_EXT.length + JS_FILES_NO_EXT.length)} dosya                    ║`);
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log('║                                                       ║');
  console.log('║  1. http://localhost:3000 aç → bookmarklet\'i al       ║');
  console.log('║  2. mitobet273.com/tr aç                              ║');
  console.log('║  3. Bookmarklet\'e tıkla → CSS/JS enjekte edilir       ║');
  console.log('║                                                       ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');

  // Eksik dosya kontrolü
  const allFiles = [...CSS_FILES, ...JS_FILES_WITH_EXT, ...JS_FILES_NO_EXT];
  const missing = allFiles.filter(f => !fs.existsSync(path.join(MITOBET_DIR, f)));
  if (missing.length > 0) {
    console.log('⚠ Bulunamayan dosyalar:');
    missing.forEach(f => console.log(`  - ${f}`));
    console.log('');
  }
});
