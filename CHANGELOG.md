# MITOBET - Güncelleme Takip Listesi

---

## 2026-01-20 (v1 - İlk Bundle Release)

| Dosya | Güncelleme |
|-------|-----------|
| `build.js` | Build script oluşturuldu: tüm CSS/JS'i versiyonlu bundle'a birleştirir (node build.js v1/v2/--new). |
| `dist/v1/bundle.css` | 21 CSS dosyası tek bundle'da birleştirildi. |
| `dist/v1/bundle.js` | 1 JS dosyası (header_extra_buttons.js) bundle'a alındı. |
| `dist/loader.js` | CDN loader: CMS'e sadece bu eklenir, versiyon değişkeni ile v1/v2 arası geçiş yapılır. |
| `dist/version.json` | Versiyon takip dosyası: aktif versiyon, mevcut versiyonlar, son build tarihi. |

---

## 2026-01-20

| Dosya | Güncelleme |
|-------|-----------|
| `SCRIPT/header_extra_buttons.js` | Sadece Promosyonlar butonuna GPU hızlandırmalı slide-up text slider eklendi (PROMOSYONLAR → HEMEN KAZAN → BONUSLAR → FIRSATLARI GÖR, 3sn döngü, cubic-bezier easing). Buton boyutu sabitlendi (width/height kilitli). Canlı Destek butonuna JS border pulse efekti (altın↔yeşil). Promosyonlar butonuna JS sweep ışık overlay. Eski interval temizleme mekanizması eklendi (tekrar enjekte desteği). Web + mobil. |
| `CSS/header_buttons.css` | Promosyonlar butonuna CSS sweep ışık animasyonu (skewX çizgi + gradient kayma) eklendi. Canlı Destek CSS animasyonu JS'e taşındı, CSS'te sadece transition bırakıldı. |

---

## 2026-01-19

| Dosya | Güncelleme |
|-------|-----------|
| `CSS/modal_buttons.css` | Giriş Yap ve Kayıt Ol modal butonları solid gold gradient + sweep efekti ile güncellendi. |
| `CSS/section_buttons.css` | "TÜMÜNÜ GÖR" butonları minimal stile çekildi: transparan arka plan, altın renk border, mobilde küçültüldü. |
| `CSS/mobile_navbar.css` | Mobil alt navbar (#tabbar) site renklerine güncellendi: #181818 arka plan, altın text/icon, ortadaki animasyonlu logo boyut ve ortalama düzeltmesi. |
| `SCRIPT/header_extra_buttons.js` | Font Awesome iconları kaldırıldı (globe, gift, telegram). Canlı Destek buton click handler geliştirildi (Comm100 öncelikli). TV linki mitotv.live olarak güncellendi. Telegram linki t.me/mitoresmi olarak güncellendi. |
| `CSS/header_buttons.css` | Topbar "Güncel Giriş: mito.ws" eklendi (sabit, site renkleri). Mobil header yüksekliği 50-55px'e düşürüldü. Mobil bar ile header arası hizalama ve padding eşitlendi. Tüm icon stilleri kaldırıldı. Header alt çizgi eklendi. |

---

## 2026-01-18

| Dosya | Güncelleme |
|-------|-----------|
| `SCRIPT/header_extra_buttons.js` | TV, Promosyonlar, Canlı Destek, Telegram butonları header'a dinamik eklendi. Mobil bar oluşturuldu. Topbar (Güncel Giriş) fonksiyonu eklendi. fixMobileHeaderHeight() JS ile agresif yükseklik ayarı. |
| `CSS/header_buttons.css` | Header butonları kompakt stile çekildi (36px yükseklik, 6px gap). Giriş Yap outline altın, Kayıt Ol gradient + shine. Divider eklendi. Mobilde Giriş Yap gradient/glow kaldırıldı. |
| `CSS/search_design.css` | Arama butonu kayma sorunu düzeltildi: `[class*="search"] svg` selector'ı `#drop-container` ile scope'landı. |

---

## Pasife Alınan Dosyalar (Arşiv)

Aşağıdaki dosyalar `pasife/` klasörüne taşındı (CMS'de zaten aktif olanlar):

**JS:**
- `SCRIPT/Main`, `SCRIPT/BannerFunctions`, `SCRIPT/UIFunctions`
- `SCRIPT/UtilityFunctions`, `SCRIPT/SportPopupFunction`, `SCRIPT/PromosyonButton`
- `SCRIPT/font_loader.js`, `SCRIPT/snow_effect.js`, `SCRIPT/theme_toggle.js`
- `sidebar/promo_image_replacer.js`, `yatirim_uyari_sistemi/yatirim_uyari.js`

**CSS:**
- `Background/background.css`, `Giriş_Ekranı/signup-modal`
- `sidebar/sidebar.css`, `TEPE_WINNER/tepe_winner.css`
- `CSS/section_view_buttons.css`, `CSS/header_wallet.css`

---

## Aktif Dosyalar

**CSS (21 dosya):**
- `CSS/main.css` - Ana stil
- `CSS/hide.css` - Gizleme kuralları
- `CSS/vip_hide.css` - VIP gizleme
- `CSS/header_buttons.css` - Header buton stilleri + animasyonlar
- `CSS/search_design.css` - Arama kutusu tasarımı
- `CSS/mobile_navbar.css` - Mobil alt navbar
- `CSS/section_buttons.css` - "Tümünü Gör" butonları
- `CSS/modal_buttons.css` - Modal giriş/kayıt butonları
- `CSS/slider_bg/slider_border.css` - Slider border
- `CSS/EK`, `CSS/Kingo`, `CSS/Logo`, `CSS/sidebar` - Uzantısız CSS dosyaları
- `Slider_Alt_CSS/Slider_Alt_CSS.css` - Slider alt
- `PromoPage/promopage.css` - Promo sayfa
- `PromoPage/Promo_up_button.css` - Promo üst buton
- `giris_gorseli/mito_giris_gorseli.css` - Giriş görseli
- `slot_oncesi_css/mito_slot_oncesi.css` - Slot öncesi
- `slot_oncesi_css/mito_slot_unavailable.css` - Slot unavailable
- `slot_oncesi_css/slot_unavailable.css` - Slot unavailable (2)
- `yatirim_uyari_sistemi/yatirim_uyari.css` - Yatırım uyarı

**JS (1 dosya):**
- `SCRIPT/header_extra_buttons.js` - Header butonları + mobil bar + topbar
