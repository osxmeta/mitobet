/* ===== SCRIPT/css_blocker.js ===== */
/* =====================================================
   MITOBET - CSS Blocker
   CMS'deki hatalı CSS dosyalarını engeller.
   ===================================================== */

(function() {
    'use strict';

    var BLOCKED = [
        'btT2zvLncVttPgLh7UhpfCCihTtMYy5y',
        'search-gold',
        'multisearch'
    ];

    function shouldBlock(el) {
        // Link href kontrolü
        var href = el.getAttribute('href') || '';
        if (href.indexOf('btT2zvLncVttPgLh7UhpfCCihTtMYy5y') > -1) return true;

        // Style içerik kontrolü (inline CSS)
        if (el.tagName === 'STYLE' && el.textContent) {
            var txt = el.textContent;
            if (txt.indexOf('--search-gold') > -1 && txt.indexOf('multisearch') > -1) return true;
        }

        return false;
    }

    function killCSS() {
        // Tüm stylesheet ve style etiketlerini tara
        var els = document.querySelectorAll('link[rel="stylesheet"], style');
        els.forEach(function(el) {
            if (shouldBlock(el)) {
                el.disabled = true;
                el.parentNode && el.parentNode.removeChild(el);
                console.log('[MITO BLOCKER] Kaldırıldı:', el.tagName, el.getAttribute('href') || '(inline)');
            }
        });

        // document.styleSheets üzerinden de kontrol
        try {
            for (var i = document.styleSheets.length - 1; i >= 0; i--) {
                var sheet = document.styleSheets[i];
                var href = sheet.href || '';
                if (href.indexOf('btT2zvLncVttPgLh7UhpfCCihTtMYy5y') > -1) {
                    sheet.disabled = true;
                    if (sheet.ownerNode) {
                        sheet.ownerNode.parentNode && sheet.ownerNode.parentNode.removeChild(sheet.ownerNode);
                    }
                    console.log('[MITO BLOCKER] StyleSheet devre dışı:', href);
                }
            }
        } catch(e) {}
    }

    // MutationObserver - eklenen her node'u kontrol et
    var obs = new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i++) {
            var nodes = mutations[i].addedNodes;
            for (var j = 0; j < nodes.length; j++) {
                var n = nodes[j];
                if (!n.tagName) continue;
                var tag = n.tagName.toUpperCase();
                if (tag === 'LINK' || tag === 'STYLE') {
                    if (shouldBlock(n)) {
                        n.disabled = true;
                        n.parentNode && n.parentNode.removeChild(n);
                        console.log('[MITO BLOCKER] Engellendi:', tag, n.getAttribute('href') || '(inline)');
                    }
                }
                // İçindeki link/style'ları da kontrol et
                if (n.querySelectorAll) {
                    var inner = n.querySelectorAll('link[rel="stylesheet"], style');
                    inner.forEach(function(el) {
                        if (shouldBlock(el)) {
                            el.disabled = true;
                            el.parentNode && el.parentNode.removeChild(el);
                            console.log('[MITO BLOCKER] İç eleman engellendi');
                        }
                    });
                }
            }
        }
    });

    obs.observe(document.documentElement, { childList: true, subtree: true });

    // Hemen çalıştır
    killCSS();
    // DOM hazır olunca tekrar
    document.addEventListener('DOMContentLoaded', killCSS);
    // Sayfa yüklenince tekrar
    window.addEventListener('load', killCSS);
    // Periyodik kontrol
    setInterval(killCSS, 1000);

    console.log('[MITO BLOCKER] Aktif - btT2zvLncVttPgLh7UhpfCCihTtMYy5y.css engelleniyor');
})();


/* ===== SCRIPT/font_loader.js ===== */
<script>
// MITOBET Font Yükleyici ve Style Injector
(function() {
    'use strict';

    const GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Stack+Sans+Headline:wght@200..700&display=swap';

    const FONT_STYLES = `
/* Root font tanımları */
:root {
    --mito-font-primary: 'Stack Sans Headline', sans-serif;
    --mito-font-secondary: 'Stack Sans Headline', sans-serif;
    --mito-font-display: 'Stack Sans Headline', sans-serif;
    --mito-font-heading: 'Stack Sans Headline', sans-serif;
}

/* Genel font uygulama */
* {
    font-family: var(--mito-font-primary) !important;
}

body {
    font-family: var(--mito-font-primary) !important;
}

/* Başlık fontları */
h1, h2, h3, h4, h5, h6,
.title, .heading, .banner-title, .modal-title {
    font-family: var(--mito-font-heading) !important;
}

/* Display ve Hero alanları */
.display-title, .hero-title, .big-title {
    font-family: var(--mito-font-display) !important;
}

/* Butonlar ve Formlar */
button, .btn, .button,
input, select, textarea,
.form-control {
    font-family: var(--mito-font-primary) !important;
}

/* Navigasyon */
.nav, .menu, .navbar {
    font-family: var(--mito-font-secondary) !important;
}

/* Font Weight Ayarları */
.font-thin { font-weight: 100 !important; }
.font-light { font-weight: 300 !important; }
.font-regular { font-weight: 400 !important; }
.font-medium { font-weight: 500 !important; }
.font-semibold { font-weight: 600 !important; }
.font-bold { font-weight: 700 !important; }
.font-black { font-weight: 900 !important; }

/* Mevcut font-weight stillerini koru ama font-family'i zorla */
[style*="font-weight"] {
    font-family: var(--mito-font-primary) !important;
}
`;

    // Google Fonts Preconnect
    function addPreconnect() {
        if (document.querySelector('link[href="https://fonts.googleapis.com"]')) return;
        
        const l1 = document.createElement('link');
        l1.rel = 'preconnect';
        l1.href = 'https://fonts.googleapis.com';
        
        const l2 = document.createElement('link');
        l2.rel = 'preconnect';
        l2.href = 'https://fonts.gstatic.com';
        l2.crossOrigin = 'anonymous';
        
        document.head.appendChild(l1);
        document.head.appendChild(l2);
    }
    
    // Google Fonts Linki
    function addGoogleFonts() {
        // Ana URL'in query parametreleri olmadan kontrolü
        const baseUrl = GOOGLE_FONTS_URL.split('?')[0];
        if (document.querySelector(`link[href^="${baseUrl}"]`)) return;
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = GOOGLE_FONTS_URL;
        document.head.appendChild(link);
        console.log('🌐 Google Fonts linki eklendi: Stack Sans Headline');
    }

    // Style Injection
    function injectStyles() {
        // Zaten eklenmiş mi kontrol et
        if (document.getElementById('mito-font-styles')) return;

        const style = document.createElement('style');
        style.id = 'mito-font-styles';
        style.textContent = FONT_STYLES;
        document.head.appendChild(style);
        console.log('🎨 Mito Font stilleri enjekte edildi');
    }
    
    function init() {
        addPreconnect();
        addGoogleFonts();
        injectStyles();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
</script>


/* ===== SCRIPT/promo_image_replacer.js ===== */
<script>
// MITOBET - Promosyonlar Arka Plan Görseli Değiştirici + CSS
(function() {
    'use strict';
    
    // Görsel URL'leri (Desktop ve Mobil)
    const DESKTOP_PROMO_IMAGE = 'https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/GakckagaakasdqGVAEgA/statics/x6yNHDx1ZEUxqkaCPr73sE2GaS3Px0q3nF5XurLu.png';
    const MOBILE_PROMO_IMAGE = 'https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/GakckagaakasdqGVAEgA/statics/Yrcmm2n208IMrjgybyQshrSqLz5162mM0bEHqRtw.png';
    
    // CSS Injection - Promosyonlar için özel stiller
    function injectPromoStyles() {
        const styleId = 'promo-custom-styles';
        
        // Zaten eklendiyse tekrar ekleme
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Promosyonlar Büyük Buton - Özel Stiller (Menü içindeki linke dokunma) */
            .sidebar__links a[href*="promotions"],
            .sidebar__link.sidebar__link--casino[href*="promotions"],
            .sidebar__link.w-100[href*="promotions"] {
                overflow: hidden !important;
                position: relative !important;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), 
                            0 0 20px rgba(154, 106, 12, 0.15) !important;
            }
            
            /* Hover Animasyonu - Yukarı Kalk + Glow */
            .sidebar__links a[href*="promotions"]:hover,
            .sidebar__link.sidebar__link--casino[href*="promotions"]:hover,
            .sidebar__link.w-100[href*="promotions"]:hover {
                transform: translateY(-4px) !important;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3), 
                            0 0 35px rgba(154, 106, 12, 0.4),
                            0 0 50px rgba(154, 106, 12, 0.2) !important;
                filter: brightness(1.08) !important;
            }
            
            /* Parlama Efekti */
            .sidebar__links a[href*="promotions"]:before,
            .sidebar__link.sidebar__link--casino[href*="promotions"]:before,
            .sidebar__link.w-100[href*="promotions"]:before {
                content: '' !important;
                position: absolute !important;
                top: 0 !important;
                left: -100% !important;
                width: 100% !important;
                height: 100% !important;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent) !important;
                transition: left 0.6s ease !important;
                z-index: 1 !important;
                pointer-events: none !important;
            }
            
            .sidebar__links a[href*="promotions"]:hover:before,
            .sidebar__link.sidebar__link--casino[href*="promotions"]:hover:before,
            .sidebar__link.w-100[href*="promotions"]:hover:before {
                left: 100% !important;
            }
            
            /* Pulse Animasyonu - Devamlı hafif ışıltı */
            @keyframes promoPulse {
                0%, 100% { 
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), 
                                0 0 20px rgba(154, 106, 12, 0.15);
                }
                50% { 
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2), 
                                0 0 30px rgba(154, 106, 12, 0.25),
                                0 0 45px rgba(154, 106, 12, 0.15);
                }
            }
            
            .sidebar__links a[href*="promotions"],
            .sidebar__link.sidebar__link--casino[href*="promotions"],
            .sidebar__link.w-100[href*="promotions"] {
                animation: promoPulse 3s ease-in-out infinite !important;
            }
            
            /* Hover'da animasyonu durdur */
            .sidebar__links a[href*="promotions"]:hover,
            .sidebar__link.sidebar__link--casino[href*="promotions"]:hover,
            .sidebar__link.w-100[href*="promotions"]:hover {
                animation: none !important;
            }
            
            /* Mobil için özel ayarlar */
            @media (max-width: 767px) {
                .sidebar__links a[href*="promotions"]:hover,
                .sidebar__link.w-100[href*="promotions"]:hover {
                    transform: translateY(-2px) !important;
                }
            }
        `;
        
        document.head.appendChild(style);
        console.log('✅ Promosyonlar CSS eklendi');
    }
    
    // Görseli değiştir (Responsive) - SADECE büyük butona
    function changePromoImage() {
        // Cihaz genişliğine göre görsel seç
        const isMobile = window.innerWidth <= 767;
        const imageUrl = isMobile ? MOBILE_PROMO_IMAGE : DESKTOP_PROMO_IMAGE;
        
        // SADECE büyük promosyonlar butonunu bul (menü içindeki linki hariç tut)
        const promoLinks = [
            document.querySelector('.sidebar__links a[href*="promotions"]'),
            document.querySelector('a.sidebar__link.sidebar__link--casino[href*="promotions"]'),
            document.querySelector('a.sidebar__link.w-100[href*="promotions"]')
        ];
        
        promoLinks.forEach(promoLink => {
            if (promoLink && !promoLink.closest('li')) {
                // li içinde değilse (yani menü değilse) görseli değiştir
                promoLink.style.background = `url("${imageUrl}") center center / cover no-repeat`;
                promoLink.style.backgroundSize = 'cover';
                promoLink.style.backgroundPosition = 'center center';
                promoLink.style.backgroundRepeat = 'no-repeat';
                
                console.log('✅ Promosyonlar büyük buton görseli değiştirildi:', isMobile ? 'Mobil' : 'Desktop', imageUrl);
            }
        });
    }
    
    // Optimize edildi: Sadece 2 deneme yeterli
    function tryMultiple() {
        injectPromoStyles(); // CSS'i ekle
        changePromoImage();
        setTimeout(changePromoImage, 500); // Sadece bir kez daha dene
    }
    
    // Sayfa yüklendiğinde çalıştır
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryMultiple);
    } else {
        tryMultiple();
    }
    
    // MutationObserver - DOM değişikliklerini izle
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                const target = mutation.target;
                
                // Eğer sidebar veya promosyonlar linki değiştiyse
                if (target.classList && 
                    (target.classList.contains('sidebar') || 
                     target.classList.contains('sidebar__big') || 
                     target.classList.contains('sidebar__small') ||
                     target.querySelector('a[href*="promotions"]'))) {
                    setTimeout(changePromoImage, 50);
                }
            }
        });
    });
    
    // Body'yi izle
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
    
    // Interval kaldırıldı - MutationObserver yeterli
    
    // Mobil olayları ve resize (görsel değişimi için)
    window.addEventListener('orientationchange', () => setTimeout(changePromoImage, 200));
    window.addEventListener('resize', () => setTimeout(changePromoImage, 100));
    
    // Debounced resize handler (performans için)
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(changePromoImage, 250);
    });
    
})();
</script>



/* ===== SCRIPT/header_extra_buttons.js ===== */
/* =====================================================
   MITOBET - Header Extra Butonlar
   Desktop: header__actions içine yan yana
   Mobil: header altına ortalanmış bar olarak
   ===================================================== */

(function() {
    'use strict';

    // Önceki instance'ı temizle (tekrar enjekte edilebilmesi için)
    if (window._mitoIntervals) {
        window._mitoIntervals.forEach(function(id) { clearInterval(id); });
    }
    window._mitoIntervals = [];

    // Font Awesome kaldırıldı (ikonlar kullanılmıyor)

    function getLang() {
        var path = window.location.pathname;
        if (path.indexOf('/en') === 0 || path === '/en') return 'en';
        return 'tr';
    }

    function createSupportClickHandler() {
        return function() {
            if (typeof Comm100API !== 'undefined') {
                if (Comm100API.open_chat_window) { Comm100API.open_chat_window(); return; }
                if (Comm100API.open) { Comm100API.open(); return; }
                if (Comm100API.do) { Comm100API.do('livechat.button.click'); return; }
            }
            var comm100Btn = document.querySelector('[id*="comm100"], [class*="comm100"], #chat-button, .comm100-button, iframe[src*="comm100"]');
            if (comm100Btn) { comm100Btn.click(); return; }
            if (typeof Tawk_API !== 'undefined' && Tawk_API.maximize) { Tawk_API.maximize(); return; }
            if (typeof LiveChatWidget !== 'undefined' && LiveChatWidget.call) { LiveChatWidget.call('maximize'); return; }
            if (typeof Intercom !== 'undefined') { Intercom('show'); return; }
            if (typeof $crisp !== 'undefined' && $crisp.push) { $crisp.push(['do', 'chat:open']); return; }
            if (typeof zE !== 'undefined') { zE('messenger', 'open'); return; }
            var chatEls = document.querySelectorAll('[class*="chat-btn"], [class*="chat-button"], [class*="livechat"], [id*="chat-button"], [id*="livechat"], [class*="support"], [onclick*="chat"]');
            for (var i = 0; i < chatEls.length; i++) {
                if (chatEls[i].offsetParent !== null) { chatEls[i].click(); return; }
            }
            console.log('[MITO] Canlı destek widget bulunamadı, fallback kullanılıyor');
            window.open('/tr/contact', '_blank');
        };
    }

    // ===== PROMO TEXT SLİDER =====
    var promoTexts = ['PROMOSYONLAR', 'HEMEN KAZAN', 'BONUSLAR'];
    var promoIdx = 0;
    var sliding = false;

    function setupPromoSlider(btn) {
        if (!btn || btn.getAttribute('data-mito-slider')) return;
        btn.setAttribute('data-mito-slider', '1');

        var textEl = btn.querySelector('.mito-btn-text');
        var isDesktop = !!textEl;
        var cs = getComputedStyle(btn);
        var lineH = parseInt(cs.fontSize) || 12;

        // Buton boyutunu sabitle
        var rect = btn.getBoundingClientRect();
        btn.style.setProperty('width', rect.width + 'px', 'important');
        btn.style.setProperty('min-width', rect.width + 'px', 'important');
        btn.style.setProperty('max-width', rect.width + 'px', 'important');
        btn.style.setProperty('height', rect.height + 'px', 'important');
        btn.style.setProperty('min-height', rect.height + 'px', 'important');
        btn.style.setProperty('max-height', rect.height + 'px', 'important');

        // En uzun text genişliği
        var measure = document.createElement('span');
        measure.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:' + cs.font + ';letter-spacing:' + cs.letterSpacing + ';';
        document.body.appendChild(measure);
        var maxW = 0;
        promoTexts.forEach(function(t) { measure.textContent = t; if (measure.offsetWidth > maxW) maxW = measure.offsetWidth; });
        document.body.removeChild(measure);

        // Mask
        var mask = document.createElement('span');
        mask.className = 'mito-slider-mask';
        mask.style.cssText = 'display:inline-block;position:relative;overflow:hidden;' +
            'height:' + lineH + 'px;line-height:' + lineH + 'px;vertical-align:middle;' +
            'width:' + maxW + 'px;text-align:center;';

        // A span (görünür, mevcut text)
        var spanA = document.createElement('span');
        spanA.className = 'mito-slide-a';
        spanA.style.cssText = 'display:block;position:absolute;left:0;right:0;top:0;height:' + lineH + 'px;' +
            'line-height:' + lineH + 'px;white-space:nowrap;text-align:center;' +
            'will-change:transform;backface-visibility:hidden;';
        spanA.textContent = isDesktop ? textEl.textContent.trim() : btn.textContent.trim();

        // B span (aşağıda bekliyor)
        var spanB = document.createElement('span');
        spanB.className = 'mito-slide-b';
        spanB.style.cssText = 'display:block;position:absolute;left:0;right:0;top:0;height:' + lineH + 'px;' +
            'line-height:' + lineH + 'px;white-space:nowrap;text-align:center;' +
            'will-change:transform;backface-visibility:hidden;' +
            'transform:translateY(' + lineH + 'px);';

        mask.appendChild(spanA);
        mask.appendChild(spanB);

        if (isDesktop) {
            textEl.textContent = '';
            textEl.appendChild(mask);
        } else {
            var sweepEl = btn.querySelector('.mito-sweep');
            btn.textContent = '';
            btn.appendChild(mask);
            if (sweepEl) btn.appendChild(sweepEl);
        }
    }

    function startPromoSlider() {
        setTimeout(function() {
            document.querySelectorAll('.mito-header-btn--promo, .mito-mobile-btn--promo').forEach(setupPromoSlider);
        }, 500);

        var id = setInterval(function() {
            if (sliding) return;
            sliding = true;
            promoIdx = (promoIdx + 1) % promoTexts.length;
            var newText = promoTexts[promoIdx];

            document.querySelectorAll('.mito-slider-mask').forEach(function(mask) {
                var spanA = mask.querySelector('.mito-slide-a');
                var spanB = mask.querySelector('.mito-slide-b');
                if (!spanA || !spanB) return;

                var h = mask.offsetHeight;

                // B'yi aşağıda hazırla
                spanB.textContent = newText;
                spanB.style.transition = 'none';
                spanB.style.transform = 'translateY(' + h + 'px)';

                // Reflow zorla
                void spanB.offsetHeight;

                // Aynı anda ikisini de kaydır
                requestAnimationFrame(function() {
                    spanA.style.transition = 'transform 0.5s ease-in-out';
                    spanB.style.transition = 'transform 0.5s ease-in-out';
                    spanA.style.transform = 'translateY(-' + h + 'px)';
                    spanB.style.transform = 'translateY(0)';
                });

                // Bitince A'yı resetle
                setTimeout(function() {
                    spanA.style.transition = 'none';
                    spanA.textContent = newText;
                    spanA.style.transform = 'translateY(0)';
                    spanB.style.transition = 'none';
                    spanB.style.transform = 'translateY(' + h + 'px)';
                    sliding = false;
                }, 550);
            });
        }, 3000);
        window._mitoIntervals.push(id);
    }

    // ===== CANLI DESTEK PULSE (sadece desktop) =====
    function startSupportPulse() {
        var on = false;
        var id = setInterval(function() {
            on = !on;
            // Sadece desktop butonuna uygula
            var btns = document.querySelectorAll('.mito-header-btn--support');
            btns.forEach(function(btn) {
                btn.style.borderColor = on ? 'rgba(74, 222, 128, 0.6)' : 'rgba(207, 174, 109, 0.45)';
                btn.style.boxShadow = on ? '0 0 10px rgba(74, 222, 128, 0.25)' : 'none';
            });
        }, 1200);
        window._mitoIntervals.push(id);
    }

    // ===== PROMO SWEEP IŞIK =====
    function addSweepToBtn(btn) {
        if (!btn || btn.querySelector('.mito-sweep')) return;
        var sweep = document.createElement('span');
        sweep.className = 'mito-sweep';
        sweep.style.cssText = 'position:absolute;top:0;left:-60%;width:30%;height:100%;' +
            'background:linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent);' +
            'transform:skewX(-20deg);pointer-events:none;z-index:2;opacity:0.8;';
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(sweep);

        function runSweep() {
            sweep.style.transition = 'none';
            sweep.style.left = '-60%';
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    sweep.style.transition = 'left 0.7s ease-in-out';
                    sweep.style.left = '130%';
                });
            });
        }
        runSweep();
        var id = setInterval(runSweep, 3500);
        window._mitoIntervals.push(id);
    }

    // ===== CSS TRANSITION INJECT =====
    function injectAnimationCSS() {
        if (document.getElementById('mito-anim-css')) return;
        var style = document.createElement('style');
        style.id = 'mito-anim-css';
        style.textContent =
            '.mito-header-btn--promo .mito-btn-text,' +
            '.mito-mobile-btn--promo {' +
            '  transition: opacity 0.3s ease !important;' +
            '}' +
            '.mito-header-btn--support,' +
            '.mito-mobile-btn--support {' +
            '  transition: border-color 0.6s ease, box-shadow 0.6s ease !important;' +
            '}';
        document.head.appendChild(style);
    }

    // ===== ÜST BANNER (Güncel Giriş) =====
    function addTopBar() {
        if (document.querySelector('.mito-topbar')) return;
        var header = document.querySelector('#header') || document.querySelector('header');
        if (!header) return;

        var topbar = document.createElement('div');
        topbar.className = 'mito-topbar';
        topbar.setAttribute('data-mito-extra', 'topbar');
        topbar.innerHTML = '<span>Güncel Giriş:</span> <a href="https://mito.ws/giris" target="_blank">mito.ws</a>';
        header.parentNode.insertBefore(topbar, header);
        console.log('[MITO] Üst banner (güncel giriş) eklendi');
    }

    // ===== DESKTOP BUTONLARI =====
    function addDesktopButtons() {
        if (window.innerWidth <= 992) return;
        addTopBar();

        var headerActions = document.querySelector('.header__actions');
        if (!headerActions) return;
        if (headerActions.querySelector('.mito-header-btn')) return;

        var lang = getLang();
        var firstExisting = headerActions.firstChild;

        var tvBtn = document.createElement('a');
        tvBtn.href = 'https://mitotv.live/';
        tvBtn.target = '_blank';
        tvBtn.className = 'mito-header-btn mito-header-btn--tv';
        tvBtn.innerHTML = '<span class="mito-tv-icon">&#9654;</span> <span class="mito-btn-text">TV</span>';
        tvBtn.setAttribute('data-mito-extra', 'tv');

        var promoBtn = document.createElement('a');
        promoBtn.href = '/promotions';
        promoBtn.className = 'mito-header-btn mito-header-btn--promo';
        promoBtn.innerHTML = '<span class="mito-btn-text">' + (lang === 'en' ? 'PROMOTIONS' : 'PROMOSYONLAR') + '</span>';
        promoBtn.setAttribute('data-mito-extra', 'promo');

        var supportBtn = document.createElement('button');
        supportBtn.type = 'button';
        supportBtn.className = 'mito-header-btn mito-header-btn--support';
        supportBtn.innerHTML = '<span class="mito-live-dot"></span><span class="mito-btn-text">' + (lang === 'en' ? 'LIVE SUPPORT' : 'CANLI DESTEK') + '</span>';
        supportBtn.setAttribute('data-mito-extra', 'support');
        supportBtn.addEventListener('click', createSupportClickHandler());

        var divider = document.createElement('span');
        divider.className = 'mito-header-divider';
        divider.setAttribute('data-mito-extra', 'divider');

        var tgBtn = document.createElement('a');
        tgBtn.href = 'https://t.me/mitoresmi';
        tgBtn.target = '_blank';
        tgBtn.className = 'mito-header-btn mito-header-btn--telegram';
        tgBtn.innerHTML = '<span class="mito-btn-text">TELEGRAM</span>';
        tgBtn.setAttribute('data-mito-extra', 'telegram');

        headerActions.insertBefore(tvBtn, firstExisting);
        headerActions.insertBefore(promoBtn, firstExisting);
        headerActions.insertBefore(supportBtn, firstExisting);
        headerActions.insertBefore(tgBtn, firstExisting);
        headerActions.insertBefore(divider, firstExisting);

        // Butonlar eklendikten sonra sweep ekle
        setTimeout(function() { addSweepToBtn(promoBtn); }, 200);

        console.log('[MITO] Desktop header butonlar eklendi');
    }

    // ===== MOBİL BAR =====
    function addMobileBar() {
        if (window.innerWidth > 992) return;
        if (document.querySelector('.mito-mobile-bar')) return;

        var header = document.querySelector('#header') || document.querySelector('header');
        if (!header) return;

        var lang = getLang();

        var bar = document.createElement('div');
        bar.className = 'mito-mobile-bar';
        bar.setAttribute('data-mito-extra', 'mobile-bar');

        var tvBtn = document.createElement('a');
        tvBtn.href = 'https://mitotv.live/';
        tvBtn.target = '_blank';
        tvBtn.className = 'mito-mobile-btn mito-mobile-btn--tv';
        tvBtn.innerHTML = '<span class="mito-tv-icon">&#9654;</span> TV';

        var promoBtn = document.createElement('a');
        promoBtn.href = '/promotions';
        promoBtn.className = 'mito-mobile-btn mito-mobile-btn--promo';
        promoBtn.textContent = (lang === 'en' ? 'PROMOTIONS' : 'PROMOSYONLAR');
        promoBtn.style.position = 'relative';
        promoBtn.style.overflow = 'hidden';

        var supportBtn = document.createElement('button');
        supportBtn.type = 'button';
        supportBtn.className = 'mito-mobile-btn mito-mobile-btn--support';
        supportBtn.innerHTML = '<span class="mito-live-dot"></span> ' + (lang === 'en' ? 'LIVE SUPPORT' : 'CANLI DESTEK');
        supportBtn.addEventListener('click', createSupportClickHandler());

        var tgBtn = document.createElement('a');
        tgBtn.href = 'https://t.me/mitoresmi';
        tgBtn.target = '_blank';
        tgBtn.className = 'mito-mobile-btn mito-mobile-btn--telegram';
        tgBtn.innerHTML = 'TELEGRAM';

        bar.appendChild(tvBtn);
        bar.appendChild(promoBtn);
        bar.appendChild(supportBtn);
        bar.appendChild(tgBtn);

        addTopBar();
        header.parentNode.insertBefore(bar, header.nextSibling);

        // Butonlar eklendikten sonra sweep ekle
        setTimeout(function() { addSweepToBtn(promoBtn); }, 200);

        console.log('[MITO] Mobil header bar eklendi');
    }

    // Mobilde header yükseklik fix
    function fixMobileHeaderHeight() {
        if (window.innerWidth > 992) return;
        var els = [
            { sel: '#header', css: { height: '50px', 'max-height': '50px', 'min-height': '0', padding: '0', overflow: 'visible' } },
            { sel: '#header .container', css: { height: '50px', padding: '0 12px' } },
            { sel: '#header .container .row', css: { height: '50px', margin: '0' } },
            { sel: '#header .container .row > .col-12', css: { height: '50px', padding: '0' } },
            { sel: '.header__content', css: { height: '50px', 'max-height': '50px', 'min-height': '0', padding: '0', overflow: 'visible', display: 'flex', 'align-items': 'center' } }
        ];
        els.forEach(function(item) {
            var el = document.querySelector(item.sel);
            if (el) {
                Object.keys(item.css).forEach(function(prop) {
                    el.style.setProperty(prop, item.css[prop], 'important');
                });
            }
        });
    }

    function init() {
        injectAnimationCSS();

        if (window.innerWidth > 992) {
            addDesktopButtons();
        } else {
            addMobileBar();
            fixMobileHeaderHeight();
        }

        // Animasyonları başlat
        startPromoSlider();
        startSupportPulse();

        // SPA desteği
        var observer = new MutationObserver(function() {
            if (window.innerWidth > 992) {
                var headerActions = document.querySelector('.header__actions');
                if (headerActions && !headerActions.querySelector('.mito-header-btn')) {
                    addDesktopButtons();
                }
            } else {
                if (!document.querySelector('.mito-mobile-bar')) {
                    addMobileBar();
                }
                fixMobileHeaderHeight();
            }
        });

        var root = document.getElementById('root');
        if (root) {
            observer.observe(root, { childList: true, subtree: true });
        }

        // Resize
        var resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                addTopBar();
                if (window.innerWidth > 992) {
                    var mobileBar = document.querySelector('.mito-mobile-bar');
                    if (mobileBar) mobileBar.remove();
                    var headerActions = document.querySelector('.header__actions');
                    if (headerActions && !headerActions.querySelector('.mito-header-btn')) {
                        addDesktopButtons();
                    }
                    document.querySelectorAll('.mito-header-btn, .mito-header-divider').forEach(function(b) { b.style.display = ''; });
                } else {
                    document.querySelectorAll('.mito-header-btn, .mito-header-divider').forEach(function(b) { b.style.display = 'none'; });
                    if (!document.querySelector('.mito-mobile-bar')) {
                        addMobileBar();
                    }
                }
            }, 200);
        });

        console.log('[MITO] Header extra butonlar + animasyonlar yüklendi');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { setTimeout(init, 500); });
    } else {
        setTimeout(init, 500);
    }

})();