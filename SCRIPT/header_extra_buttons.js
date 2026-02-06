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

    // ===== ÜST BANNER (Sonraki Domain) =====
    function getNextDomain() {
        var host = window.location.hostname; // örn: mitobet274.com
        var match = host.match(/^(mitobet)(\d+)\.(.+)$/i);
        if (match) {
            var prefix = match[1];
            var num = parseInt(match[2]);
            var tld = match[3];
            return prefix + (num + 1) + '.' + tld;
        }
        return null;
    }

    function addTopBar() {
        if (document.querySelector('.mito-topbar')) return;
        var header = document.querySelector('#header') || document.querySelector('header');
        if (!header) return;

        var nextDomain = getNextDomain();
        var topbar = document.createElement('div');
        topbar.className = 'mito-topbar';
        topbar.setAttribute('data-mito-extra', 'topbar');

        if (nextDomain) {
            topbar.innerHTML = '<span>Sıradaki adresimiz:</span> <a href="https://' + nextDomain + '" target="_blank">' + nextDomain + '</a>';
        } else {
            topbar.innerHTML = '<span>Güncel Giriş:</span> <a href="https://mito.ws/giris" target="_blank">mito.ws</a>';
        }

        header.parentNode.insertBefore(topbar, header);
        console.log('[MITO] Üst banner eklendi');
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
