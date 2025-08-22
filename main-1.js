// main.js

// 0️⃣ Configuration
const langMap = {
  en: { flagCode: 'gb', abbr: 'EN', name: 'English' },
  fr: { flagCode: 'fr', abbr: 'FR', name: 'Français' },
  mk: { flagCode: 'mk', abbr: 'MK', name: 'Македонски' },
  de: { flagCode: 'de', abbr: 'DE', name: 'Deutsch' }
};
const supportedLangs = Object.keys(langMap);
const defaultLang = 'mk';

// 1️⃣ Utilities
function getCurrentLang() {
  const urlLang = new URLSearchParams(location.search).get('lang');
  const stored = localStorage.getItem('selectedLang');
  const chosen = urlLang || stored || defaultLang;
  if (urlLang && urlLang !== stored) {
    localStorage.setItem('selectedLang', urlLang);
  }
  return supportedLangs.includes(chosen) ? chosen : defaultLang;
}

function getNavigatorLang() {
  const base = (navigator.language || 'en').split('-')[0];
  return supportedLangs.includes(base) ? base : 'en';
}

function countryCodeToEmoji(code) {
  return code.toUpperCase().split('').map(ch =>
    String.fromCodePoint(0x1f1e6 + (ch.charCodeAt(0) - 65))
  ).join('');
}

// Edge-friendly Twemoji flag creator
function createFlagImg(flagCode, title) {
  const wrapper = document.createElement('span');
  wrapper.textContent = countryCodeToEmoji(flagCode);
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.classList.add('twemoji-flag');
  twemoji.parse(wrapper, { folder: 'svg', ext: '.svg' });
  const img = wrapper.querySelector('img');
  if (img) {
    img.alt = `${title} flag`;
    img.title = title;
    return img;
  }
  return wrapper;
}

// 2️⃣ Mobile Menu
function initMobileMenu() {
  const ham = document.querySelector('.hamburger');
  const menu = document.getElementById('mobile-menu');
  let open = false;

  function trapFocus(container) {
    const items = Array.from(container.querySelectorAll('a, button, input, [tabindex]'));
    const first = items[0], last = items[items.length - 1];
    container.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  }

  function openMenu() {
    menu.classList.add('open');
    ham.classList.add('active');
    ham.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    trapFocus(menu);
    open = true;
  }

  function closeMenu() {
    menu.classList.remove('open');
    ham.classList.remove('active');
    ham.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    open = false;
  }

  ham.addEventListener('click', () => open ? closeMenu() : openMenu());
  document.addEventListener('click', e => {
    if (!open) return;
    if (!menu.contains(e.target) && !ham.contains(e.target)) closeMenu();
  });
  document.addEventListener('keyup', e => {
    if (open && e.key === 'Escape') {
      closeMenu();
      ham.focus();
    }
  });
  menu.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => open && closeMenu());
  });

  return closeMenu;
}

function closeMobileMenu() {
  const ham = document.querySelector('.hamburger');
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.remove('open');
  if (ham) {
    ham.classList.remove('active');
    ham.setAttribute('aria-expanded', 'false');
  }
}

// 3️⃣ Language Selector UI
function updateLangDisplay() {
  const lang = getCurrentLang();
  const { flagCode, abbr, name } = langMap[lang];
  const flagEl = document.getElementById('current-flag');
  const abbrEl = document.getElementById('current-abbr');
  if (!flagEl || !abbrEl) return;
  flagEl.innerHTML = '';
  abbrEl.textContent = abbr;
  const img = createFlagImg(flagCode, name);
  img.classList.add('twemoji-selector-flag');
  flagEl.append(img);
}
/*
function initLangOptionFlags() {
  document.querySelectorAll('.lang-options a').forEach(a => {
    const lang = new URL(a.href).searchParams.get('lang');
    if (!supportedLangs.includes(lang)) return;
    const { flagCode, abbr, name } = langMap[lang];
    const img = createFlagImg(flagCode, name);
    img.classList.add('twemoji-selector-flag');
    a.prepend(img);
  });
}
*/

        function initLangOptionFlags() {
        document.querySelectorAll('.lang-options a').forEach(a => {
            // 1) find the <span class="flag"> inside the <a>
            const spanFlag = a.querySelector('span.flag');
            if (!spanFlag) return;               // skip if you forgot to add it

            // 2) clear out any old icon/text
            spanFlag.innerHTML = '';

            // 3) pull the lang from the href
            const lang = new URL(a.href).searchParams.get('lang');
            if (!supportedLangs.includes(lang)) return;

            // 4) create the Edge-friendly Twemoji <img>
            const { flagCode, name } = langMap[lang];
            const img = createFlagImg(flagCode, name);
            img.classList.add('twemoji-selector-flag');

            // 5) append into the span.flag
            spanFlag.append(img);
        });
        }

/* maybe - this version adds flag and language code - won't use it now 'cause it needs tweaking!
                    function initLangOptionFlags() {
                    document.querySelectorAll('.lang-options a').forEach(a => {
                        const spanFlag = a.querySelector('span.flag');
                        spanFlag.innerHTML = '';

                        const lang = new URL(a.href).searchParams.get('lang');
                        const entry = langMap[lang] || {};
                        const flagCode = entry.flagCode || toRegionalIndicator(lang);

                        // 1) Twemoji flag
                        const img = createFlagImg(flagCode, entry.name);
                        img.classList.add('twemoji-selector-flag');
                        spanFlag.append(img);

                        // 2) Abbreviation
                        const abbr = document.createElement('abbr');
                        abbr.textContent = lang.toUpperCase();
                        abbr.title = entry.name || lang;
                        spanFlag.append(abbr);
                    });
                    }

                    // Fallback: turn "xx" → 🇽🇽
                    function toRegionalIndicator(code) {
                    return code
                        .toUpperCase()
                        .split('')
                        .map(c => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
                        .join('');
                    }
*/

function highlightActiveLang() {
  const cur = getCurrentLang();
  document.querySelectorAll('.lang-options a').forEach(a => {
    a.classList.toggle(
      'active',
      new URL(a.href).searchParams.get('lang') === cur
    );
  });
}

function attachLangOptionHandlers() {
  document.querySelectorAll('.lang-options a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const sel = new URL(link.href).searchParams.get('lang');
      localStorage.setItem('selectedLang', sel);
/* to remove ?lang= using cookies
      // set a 1-year cookie that your server will read
      document.cookie = `locale=${lang};path=/;max-age=${60*60*24*365}`;

      // reload without any query
      window.location.href = location.pathname;      
*/
      location.search = `?lang=${sel}`;
    });
  });
}

function attachLangSelectorHandlers() {
  const sel = document.getElementById('lang-selector');
  const tog = sel?.querySelector('.lang-toggle');
  if (!sel || !tog) return;
  tog.addEventListener('click', () => {
    const exp = tog.getAttribute('aria-expanded') === 'true';
    sel.classList.toggle('open');
    tog.setAttribute('aria-expanded', String(!exp));
  });
  document.addEventListener('click', e => {
    if (!sel.contains(e.target)) {
      sel.classList.remove('open');
      tog.setAttribute('aria-expanded', 'false');
    }
  });
}

// 4️⃣ Load & Inject Translations

async function loadLanguageContent() {
  history.replaceState(null, '', location.pathname); //removes ?lang= from url
  const lang = getCurrentLang();
  try {
    const res = await fetch(`lang/${lang}.json`);
    const data = await res.json();
    injectSEO(data);
    injectTranslations(data);
  } catch (err) {
    console.error(`Failed to load translations for ${lang}:`, err);
  }
}

// 4.1️⃣ Translation & SEO Helpers
function getTranslationByKey(key, src) {
  return key.split('.').reduce((o, k) => o?.[k], src);
}

function injectTranslations(data) {
  const t = data.content || {};
  const lc = data.langCode || 'en';
  document.documentElement.lang = lc;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const attr = el.getAttribute('data-i18n-attr');
    const val = getTranslationByKey(key, t);
    if (!val) return console.warn(`Missing translation: ${key}`);

    if (el.tagName === 'SCRIPT' && el.type === 'application/ld+json') {
      try {
        const json = typeof val === 'string' ? JSON.parse(val) : val;
        el.textContent = JSON.stringify(json, null, 2);
      } catch (e) {
        console.error(`Invalid JSON-LD for ${key}`, e);
      }
      return;
    }

    if (attr) el.setAttribute(attr, val);
    else if (/<\/?[a-z][\s\S]*>/i.test(val)) el.innerHTML = val;
    else el.textContent = val;
  });
}

function injectSEO(data) {
  const seo = data.seo || {};
  const lc = data.langCode || 'en';
  const base = location.origin + location.pathname;
  document.title = seo.title || document.title;

  const setM = (sel, val, at = 'content') => {
    const m = document.querySelector(sel);
    if (m && val) m.setAttribute(at, val);
  };

  setM('meta[name="description"]', seo.description);
  setM('meta[name="keywords"]', seo.keywords);
  setM('meta[property="og:title"]', seo.title);
  setM('meta[property="og:description"]', seo.description);
  setM('meta[property="og:image"]', seo.image);
  setM('meta[property="og:locale"]', lc);
  setM('meta[name="twitter:title"]', seo.title);
  setM('meta[name="twitter:description"]', seo.description);
  setM('meta[name="twitter:image"]', seo.image);

  document.querySelectorAll('link[rel="canonical"], link[rel="alternate"]').forEach(n => n.remove());

  const can = document.createElement('link');
  can.rel = 'canonical';
  can.href = `${base}?lang=${lc}`;
  document.head.append(can);

  supportedLangs.forEach(l => {
    const alt = document.createElement('link');
    alt.rel = 'alternate';
    alt.hreflang = l;
    alt.href = `${base}?lang=${l}`;
    document.head.append(alt);
  });

  const xd = document.createElement('link');
  xd.rel = 'alternate';
  xd.hreflang = 'x-default';
  xd.href = base;
  document.head.append(xd);
}

// 5️⃣ UI Modules
function initSlider() {
  const slides = document.querySelectorAll('.slider .slide');
  let i = 0;
  setInterval(() => {
    slides[i].classList.remove('active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('active');
  }, 4000);
}

function initLazyLoad() {
  const imgs = document.querySelectorAll('img[data-lazy]');
  if (!('IntersectionObserver' in window)) {
    imgs.forEach(img => {
      img.src = img.dataset.lazy;
      img.removeAttribute('data-lazy');
    });
    return;
  }
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const img = e.target;
      img.src = img.dataset.lazy;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.removeAttribute('data-lazy');
      o.unobserve(img);
    });
  }, { rootMargin: '200px 0px' });
  imgs.forEach(img => obs.observe(img));
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', `#${id}`);
    });
  });
}

function initScrollToTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Lightbox #1
/*function initLightbox() {
  const overlay = document.getElementById('lightbox-overlay');
  const thumbs = Array.from(document.querySelectorAll('.gallery-item img'));
  const imgEl = overlay?.querySelector('.lb-img');
  const capEl = overlay?.querySelector('.lb-caption');
  const btnClose = overlay?.querySelector('.lb-close');
  const btnPrev = overlay?.querySelector('.lb-prev');
  const btnNext = overlay?.querySelector('.lb-next');
  let idx = 0;
  if (!overlay || !imgEl || !capEl || !btnClose || !btnPrev || !btnNext || !thumbs.length) return;

  function show(i) {
    idx = (i + thumbs.length) % thumbs.length;
    const t = thumbs[idx];
    overlay.removeAttribute('hidden');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
    imgEl.src = t.src;
    imgEl.alt = t.alt || '';
    capEl.textContent = t.closest('figure')?.querySelector('figcaption')?.textContent.trim() || t.alt || '';
  }

  function hide() {
    overlay.setAttribute('hidden', '');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  thumbs.forEach((t, i) => {
    t.style.cursor = 'pointer';
    t.addEventListener('click', e => {
      e.preventDefault();
      show(i);
    });
  });

  btnClose.addEventListener('click', hide);
  btnPrev.addEventListener('click', () => show(idx - 1));
  btnNext.addEventListener('click', () => show(idx + 1));
  overlay.addEventListener('click', e => e.target === overlay && hide());
  document.addEventListener('keydown', e => {
    if (overlay.hasAttribute('hidden')) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
}*/

// Lightbox #2
/*function initLightbox1() {
  const overlay = document.getElementById('lightbox-overlay');
  const thumbs = Array.from(document.querySelectorAll('.galerija-item img'));
  const imgEl = overlay?.querySelector('.lb-img');
  const capEl = overlay?.querySelector('.lb-caption');
  const btnClose = overlay?.querySelector('.lb-close');
  const btnPrev = overlay?.querySelector('.lb-prev');
  const btnNext = overlay?.querySelector('.lb-next');
  let idx = 0;
  if (!overlay || !imgEl || !capEl || !btnClose || !btnPrev || !btnNext || !thumbs.length) return;

  function show(i) {
    idx = (i + thumbs.length) % thumbs.length;
    const t = thumbs[idx];
    overlay.removeAttribute('hidden');
    overlay.classList.remove('closing');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
    imgEl.src = t.src;
    imgEl.alt = t.alt || '';
    capEl.textContent = t.closest('figure')?.querySelector('figcaption')?.textContent.trim() || t.alt || '';
  }

  function hide() {
    overlay.classList.add('closing');
    overlay.classList.remove('visible');
    const onEnd = e => {
      if (e.target !== imgEl) return;
      imgEl.removeEventListener('transitionend', onEnd);
      overlay.setAttribute('hidden', '');
      overlay.classList.remove('closing');
      document.body.style.overflow = '';
    };
    imgEl.addEventListener('transitionend', onEnd);
  }

  thumbs.forEach((t, i) => {
    t.style.cursor = 'pointer';
    t.addEventListener('click', e => {
      e.preventDefault();
      show(i);
    });
  });

  btnClose.addEventListener('click', hide);
  btnPrev.addEventListener('click', () => show(idx - 1));
  btnNext.addEventListener('click', () => show(idx + 1));
  overlay.addEventListener('click', e => e.target ===_OVER);
    btnClose.addEventListener('click', hide);
  btnPrev.addEventListener('click', () => show(idx - 1));
  btnNext.addEventListener('click', () => show(idx + 1));
  overlay.addEventListener('click', e => {
    if (e.target === overlay) hide();
  });

  document.addEventListener('keydown', e => {
    if (overlay.hasAttribute('hidden')) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
}*/


/* ================= FROM TEST-GALLERY ================ */
/* with nudge
function initLightbox() {
  const overlay = document.getElementById('lightbox-overlay');
  const thumbs  = Array.from(document.querySelectorAll('.gallery-item img'));
  const imgEl   = overlay?.querySelector('.lb-img');
  const capEl   = overlay?.querySelector('.lb-caption');
  const btnClose= overlay?.querySelector('.lb-close');
  const btnPrev = overlay?.querySelector('.lb-prev');
  const btnNext = overlay?.querySelector('.lb-next');
  let currentIdx = 0;

  if (!overlay || !imgEl || !capEl || !btnClose || !btnPrev || !btnNext || !thumbs.length) return;

  // Show overlay + first image
  function show(idx) {
    currentIdx = (idx + thumbs.length) % thumbs.length;
    const thumb = thumbs[currentIdx];

    overlay.removeAttribute('hidden');
    overlay.classList.remove('closing');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';

    imgEl.src = thumb.src;
    imgEl.alt = thumb.alt || '';
    capEl.textContent = thumb.closest('figure')
      ?.querySelector('figcaption')?.textContent.trim() 
      || thumb.alt 
      || '';
  }

  // Closing with ease-out
  function hide() {
    overlay.classList.add('closing');
    overlay.classList.remove('visible');

    function onEnd(e) {
      if (e.target !== imgEl) return;
      imgEl.removeEventListener('transitionend', onEnd);

      overlay.setAttribute('hidden', '');
      overlay.classList.remove('closing');
      document.body.style.overflow = '';
    }
    imgEl.addEventListener('transitionend', onEnd);
  }

  // Slide-transition helper
  function changeImage(newIdx, direction) {
    const outClass = direction > 0
      ? 'slide-out-left'
      : 'slide-out-right';
    const inClass = direction > 0
      ? 'slide-in-right'
      : 'slide-in-left';

    imgEl.classList.add(outClass);

    function handleOut(e) {
      if (!e.animationName.startsWith('slideOut')) return;
      imgEl.removeEventListener('animationend', handleOut);

      // update index + content
      currentIdx = (newIdx + thumbs.length) % thumbs.length;
      const thumb = thumbs[currentIdx];
      imgEl.src = thumb.src;
      imgEl.alt = thumb.alt || '';
      capEl.textContent = thumb.closest('figure')
        ?.querySelector('figcaption')?.textContent.trim()
        || thumb.alt
        || '';

      // animate new image in
      imgEl.classList.remove(outClass);
      imgEl.classList.add(inClass);

      function handleIn(e2) {
        if (!e2.animationName.startsWith('slideIn')) return;
        imgEl.removeEventListener('animationend', handleIn);
        imgEl.classList.remove(inClass);
      }
      imgEl.addEventListener('animationend', handleIn);
    }

    imgEl.addEventListener('animationend', handleOut);
  }

  // Wire up thumbnails
  thumbs.forEach((thumb, i) => {
    thumb.style.cursor = 'pointer';
    thumb.addEventListener('click', e => {
      e.preventDefault();
      show(i);
    });
  });

  // Close button & backdrop
  btnClose.addEventListener('click', hide);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) hide();
  });

  // Prev/Next now use slide transitions
  btnPrev.addEventListener('click', () => changeImage(currentIdx - 1, -1));
  btnNext.addEventListener('click', () => changeImage(currentIdx + 1, +1));

  // Keyboard nav
  document.addEventListener('keydown', e => {
    if (overlay.hasAttribute('hidden')) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowLeft') changeImage(currentIdx - 1, -1);
    if (e.key === 'ArrowRight') changeImage(currentIdx + 1, +1);
  });
}*/
/* without nudge */
function initLightbox() {
  const overlay    = document.getElementById('lightbox-overlay');
  const thumbs     = Array.from(document.querySelectorAll('.gallery-item img'));
  const imgEl      = overlay?.querySelector('.lb-img');
  const capEl      = overlay?.querySelector('.lb-caption');
  const btnClose   = overlay?.querySelector('.lb-close');
  const btnPrev    = overlay?.querySelector('.lb-prev');
  const btnNext    = overlay?.querySelector('.lb-next');
  const header     = document.querySelector('header'); // optional fixed header
  let currentIdx   = 0;

  if (!overlay || !imgEl || !capEl || !btnClose || !btnPrev || !btnNext || !thumbs.length) {
    return;
  }

  function show(idx) {
    // 1. calculate scrollbar width
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    // 2. hide scrollbar and compensate
    document.body.style.overflow     = 'hidden';
    document.body.style.paddingRight = `${scrollBarWidth}px`;

    // 3. adjust header if present
    if (header) {
      header.style.paddingRight = `${scrollBarWidth}px`;
    }

    // 4. display overlay
    currentIdx = (idx + thumbs.length) % thumbs.length;
    const thumb = thumbs[currentIdx];

    overlay.removeAttribute('hidden');
    overlay.classList.remove('closing');
    overlay.classList.add('visible');

    imgEl.src   = thumb.src;
    imgEl.alt   = thumb.alt || '';
    capEl.textContent = 
      thumb.closest('figure')?.querySelector('figcaption')?.textContent.trim() 
      || thumb.alt 
      || '';
  }
/*
  function hide() {
    overlay.classList.add('closing');
    overlay.classList.remove('visible');

    function onEnd(e) {
      if (e.target !== imgEl) return;
      imgEl.removeEventListener('transitionend', onEnd);

      // reset styles
      overlay.setAttribute('hidden', '');
      overlay.classList.remove('closing');
      document.body.style.overflow     = '';
      document.body.style.paddingRight = '';
      if (header) {
        header.style.paddingRight = '';
      }
    }

    imgEl.addEventListener('transitionend', onEnd);
  }
*/

function hide() {
  overlay.classList.add('closing');
  overlay.classList.remove('visible');

  // Always unlock scroll immediately
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  if (header) {
    header.style.paddingRight = '';
  }

  // Optionally delay hiding overlay until transition ends
  function onEnd(e) {
    if (e.target !== imgEl) return;
    imgEl.removeEventListener('transitionend', onEnd);
    overlay.setAttribute('hidden', '');
    overlay.classList.remove('closing');
  }

  imgEl.addEventListener('transitionend', onEnd);

  // Fallback: force hide after timeout in case transitionend never fires
  setTimeout(() => {
    overlay.setAttribute('hidden', '');
    overlay.classList.remove('closing');
  }, 500); // adjust to match your CSS transition duration
}




  function changeImage(newIdx, direction) {
    const outClass = direction > 0 ? 'slide-out-left'  : 'slide-out-right';
    const inClass  = direction > 0 ? 'slide-in-right' : 'slide-in-left';

    imgEl.classList.add(outClass);

    function handleOut(e) {
      if (!e.animationName.startsWith('slideOut')) return;
      imgEl.removeEventListener('animationend', handleOut);

      currentIdx = (newIdx + thumbs.length) % thumbs.length;
      const thumb = thumbs[currentIdx];

      imgEl.src   = thumb.src;
      imgEl.alt   = thumb.alt || '';
      capEl.textContent = 
        thumb.closest('figure')?.querySelector('figcaption')?.textContent.trim() 
        || thumb.alt 
        || '';

      imgEl.classList.remove(outClass);
      imgEl.classList.add(inClass);

      function handleIn(e2) {
        if (!e2.animationName.startsWith('slideIn')) return;
        imgEl.removeEventListener('animationend', handleIn);
        imgEl.classList.remove(inClass);
      }

      imgEl.addEventListener('animationend', handleIn);
    }

    imgEl.addEventListener('animationend', handleOut);
  }

  // Wire up thumbnails
  thumbs.forEach((thumb, i) => {
    thumb.style.cursor = 'pointer';
    thumb.addEventListener('click', e => {
      e.preventDefault();
      show(i);
    });
  });

  // Close button & backdrop
  btnClose.addEventListener('click', hide);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) hide();
  });

  // Prev/Next
  btnPrev.addEventListener('click', () => changeImage(currentIdx - 1, -1));
  btnNext.addEventListener('click', () => changeImage(currentIdx + 1, +1));

  // Keyboard nav
  document.addEventListener('keydown', e => {
    if (overlay.hasAttribute('hidden')) return;
    if (e.key === 'Escape')       hide();
    if (e.key === 'ArrowLeft')   changeImage(currentIdx - 1, -1);
    if (e.key === 'ArrowRight')  changeImage(currentIdx + 1, +1);
  });
}
/* ================= FROM TEST-GALLERY ================ */


// 6️⃣ Inject Sections
function injectSections() {
  const main = document.getElementById('main-content');
  if (!main) return;
  fetch('data/sections.json')
    .then(res => res.json())
    .then(secs => {
      secs.forEach(s => {
        const sec = document.createElement('section');
        sec.id = s.id;
        sec.className = s.class || '';
        sec.innerHTML = `
          <h2>${s.title}</h2>
          <p>${s.text}</p>
          ${s.img ? `<img src="${s.img.src}" alt="${s.img.alt}">` : ''}
        `;
        main.append(sec);
      });
    })
    .catch(err => console.error('Section injection failed:', err));
}

// 7️⃣ Service Worker
function registerServiceWorker() {
  fetch('/assets/sw.js', { method: 'HEAD' })
    .then(res => {
      if (res.ok) {
        return navigator.serviceWorker.register('/assets/sw.js');
      }
      console.warn('sw.js not found, skipping SW registration');
    })
    .then(reg => reg && console.log('SW registered:', reg.scope))
    .catch(err => console.warn('SW registration failed:', err));
}

// 8️⃣ Anchor Scroll
function setupAnchorScroll() {
  function scrollToTarget(id, tries = 0) {
    if (id === 'home' || id === 'preface') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    const navH = document.querySelector('nav')?.offsetHeight || 0;
    const top = el.getBoundingClientRect().top + window.scrollY - navH - 80;
    window.scrollTo({ top, behavior: 'smooth' });
    if (tries < 3) setTimeout(() => scrollToTarget(id, tries + 1), 100);
  }

  document.body.addEventListener('click', e => {
    const a = e.target.closest('a[data-scroll]');
    if (!a) return;
    e.preventDefault();
    closeMobileMenu();
    requestIdleCallback(() => {
      scrollToTarget(a.dataset.scroll);
      history.replaceState(null, '', location.pathname);
    }, { timeout: 200 });
  });

  window.addEventListener('load', () => {
    const hash = location.hash.slice(1);
    if (!hash || hash === 'home' || hash === 'preface') return;
    requestIdleCallback(() => {
      scrollToTarget(hash);
      history.replaceState(null, '', location.pathname);
    }, { timeout: 300 });
  });
}

// 🔚 DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  updateLangDisplay();
  initLangOptionFlags();
  highlightActiveLang();
  attachLangOptionHandlers();
  attachLangSelectorHandlers();
  loadLanguageContent();

  initSlider();
  initLazyLoad();
  initSmoothScroll();
  initScrollToTop();
  initLightbox();
  injectSections();
  setupAnchorScroll();

  if ('serviceWorker' in navigator) {
    registerServiceWorker();
  }

  // Show focus outlines only when tabbing
  document.body.addEventListener('keydown', e => {
    if (e.key === 'Tab') document.body.classList.add('user-is-tabbing');
  });
  document.body.addEventListener('mousedown', () => {
    document.body.classList.remove('user-is-tabbing');
  });

  console.log('[main.js] Initialization complete');
});
