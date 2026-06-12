/* ============================================================
   CAIUBY HAIR CLUB — script.js
============================================================ */

/* ============================================================
   SMOOTH SCROLL (offset for fixed header)
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const headerH = document.getElementById('header')?.offsetHeight ?? 70;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - headerH,
      behavior: 'smooth'
    });
  });
});

/* ============================================================
   HEADER SCROLL CLASS
============================================================ */
const header = document.getElementById('header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   INTERSECTION OBSERVER — FADE IN
============================================================ */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -36px 0px' }
);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ============================================================
   TESTIMONIALS CAROUSEL
============================================================ */
(function initCarousel() {
  const track    = document.getElementById('testimonials-carousel');
  if (!track) return;

  const wrapper  = track.parentElement;
  const cards    = Array.from(track.querySelectorAll('.depoimento-card'));
  const dotsWrap = document.querySelector('.carousel-dots');
  const prevBtn  = document.querySelector('.carousel-prev');
  const nextBtn  = document.querySelector('.carousel-next');

  let currentIdx  = 0;
  let cpv         = 1; // cards per view
  let autoTimer   = null;

  function getCardsPerView() {
    const w = window.innerWidth;
    if (w >= 1080) return Math.min(3, cards.length);
    if (w >= 680)  return Math.min(2, cards.length);
    return 1;
  }

  function totalSlides() {
    return Math.max(1, cards.length - cpv + 1);
  }

  function setCardWidths() {
    const gap = 20; // px, matches CSS 1.25rem ≈ 20px
    const wrapW = wrapper.offsetWidth;
    const cardW = (wrapW - gap * (cpv - 1)) / cpv;
    cards.forEach(c => {
      c.style.minWidth = cardW + 'px';
      c.style.maxWidth = cardW + 'px';
    });
    track.style.gap = gap + 'px';
  }

  function applyTranslate() {
    const gap = 20;
    const cardW = cards[0]?.offsetWidth ?? 0;
    const offset = currentIdx * (cardW + gap);
    track.style.transform = `translateX(-${offset}px)`;
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const total = totalSlides();
    for (let i = 0; i < total; i++) {
      const btn = document.createElement('button');
      btn.className = 'carousel-dot' + (i === currentIdx ? ' active' : '');
      btn.setAttribute('aria-label', `Depoimento ${i + 1}`);
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(i === currentIdx));
      btn.addEventListener('click', () => { goTo(i); resetAuto(); });
      dotsWrap.appendChild(btn);
    }
  }

  function updateDots() {
    const dots = dotsWrap.querySelectorAll('.carousel-dot');
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === currentIdx);
      d.setAttribute('aria-selected', String(i === currentIdx));
    });
  }

  function goTo(idx) {
    const max = totalSlides() - 1;
    currentIdx = Math.max(0, Math.min(idx, max));
    applyTranslate();
    updateDots();
  }

  function next() { goTo((currentIdx + 1) % totalSlides()); }
  function prev() { goTo((currentIdx - 1 + totalSlides()) % totalSlides()); }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 4800);
  }

  function refresh() {
    cpv = getCardsPerView();
    // clamp index after resize
    if (currentIdx >= totalSlides()) currentIdx = totalSlides() - 1;
    setCardWidths();
    applyTranslate();
    buildDots();
  }

  prevBtn?.addEventListener('click', () => { prev(); resetAuto(); });
  nextBtn?.addEventListener('click', () => { next(); resetAuto(); });

  // Touch / swipe
  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = touchX - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 45) { dx > 0 ? next() : prev(); resetAuto(); }
  });

  // Pause on hover
  wrapper.addEventListener('mouseenter', () => clearInterval(autoTimer));
  wrapper.addEventListener('mouseleave', resetAuto);

  // Debounced resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refresh, 160);
  });

  // Init
  refresh();
  resetAuto();
})();

/* ============================================================
   GOOGLE ADS — CONVERSÃO WHATSAPP (AW-10785251197/J-kYCJiEwb0cEP2-55Yo)
   Os botões têm target="_blank", por isso chamamos sem URL:
   a aba do WhatsApp abre normalmente e o evento dispara.
============================================================ */
document.querySelectorAll('a[href*="whatsapp.com"]').forEach(btn => {
  btn.addEventListener('click', function () {
    if (typeof gtag_report_conversion === 'function') {
      gtag_report_conversion();
    }
  });
});
