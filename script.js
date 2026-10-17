// ===== LOADER =====
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
let progress = 0;
const loadInterval = setInterval(() => {
  progress += Math.random() * 18;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loadInterval);
    setTimeout(() => loader.classList.add('done'), 300);
  }
  loaderFill.style.width = progress + '%';
}, 80);

// ===== CURSOR =====
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top = my + 'px';
});

(function animCursor() {
  cx += (mx - cx) * 0.1;
  cy += (my - cy) * 0.1;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
  requestAnimationFrame(animCursor);
})();

document.addEventListener('mousedown', () => cursor.classList.add('click'));
document.addEventListener('mouseup', () => cursor.classList.remove('click'));
document.querySelectorAll('a,button,.srv-card,.tr-card,.price-card,.faq-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// ===== SCROLL PROGRESS =====
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  scrollProgress.style.width = pct + '%';
}, { passive: true });

// ===== NAV =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== BACK TO TOP =====
const floatTop = document.getElementById('floatTop');
window.addEventListener('scroll', () => {
  floatTop.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

// ===== MOBILE MENU =====
const burger = document.getElementById('burger');
const mobNav = document.getElementById('mobNav');
let mobOpen = false;
burger.addEventListener('click', () => {
  mobOpen = !mobOpen;
  mobNav.classList.toggle('open', mobOpen);
  document.body.style.overflow = mobOpen ? 'hidden' : '';
});
function closeMob() {
  mobOpen = false;
  mobNav.classList.remove('open');
  document.body.style.overflow = '';
}

// ===== SCROLL REVEAL =====
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = +e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('on'), delay);
      revealIO.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-reveal]').forEach((el, i) => {
  if (!el.dataset.delay) el.dataset.delay = (i % 5) * 100;
  revealIO.observe(el);
});

// ===== NUMBER COUNTERS =====
function animateCount(el) {
  const target = +el.dataset.count;
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
      if (target === 49) { el.textContent = '4.9'; return; }
      if (target === 10000) { el.textContent = '10K'; return; }
    }
    if (target === 49) {
      el.textContent = (current / 10).toFixed(1);
    } else if (target >= 1000) {
      el.textContent = Math.floor(current / 1000) + 'K';
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

const counterIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-count]').forEach(animateCount);
      counterIO.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterIO.observe(heroStats);

// ===== BMI CALCULATOR =====
let gender = 'M';
function setGender(g) {
  gender = g;
  document.getElementById('genM').classList.toggle('active', g === 'M');
  document.getElementById('genF').classList.toggle('active', g === 'F');
}

function calcBMI() {
  const w = +document.getElementById('bmiWeight').value;
  const h = +document.getElementById('bmiHeight').value;
  if (!w || !h || w <= 0 || h <= 0) {
    document.getElementById('bmiStatus').textContent = 'Enter valid values';
    return;
  }
  const hm = h / 100;
  let bmi = w / (hm * hm);
  if (gender === 'F') bmi -= 0.5;
  bmi = bmi.toFixed(1);

  document.getElementById('bmiVal').textContent = bmi;

  let status, tip;
  if (bmi < 18.5) {
    status = 'Underweight';
    tip = 'You need to gain healthy muscle mass. Our trainers will design a bulking plan tailored for you.';
  } else if (bmi < 25) {
    status = 'Normal ✓';
    tip = 'Great! Maintain and improve with our strength programs. You\'re on the right track.';
  } else if (bmi < 30) {
    status = 'Overweight';
    tip = 'Our weight loss and cardio programs can help. Join now and see results in 30 days!';
  } else {
    status = 'Obese';
    tip = 'Don\'t worry — we\'ve helped hundreds of people in your position. Our expert trainers will guide you safely.';
  }
  document.getElementById('bmiStatus').textContent = status;
  document.getElementById('bmiTip').textContent = tip;
}

// ===== TESTIMONIAL SLIDER =====
const track = document.getElementById('testiTrack');
const cards = document.querySelectorAll('.testi-card');
let currentSlide = 0;
const visibleCards = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3;
const cardWidth = () => cards[0]?.offsetWidth + 24 || 364;

document.getElementById('tcNext')?.addEventListener('click', () => {
  const max = cards.length - visibleCards();
  currentSlide = Math.min(currentSlide + 1, max);
  track.style.transform = `translateX(-${currentSlide * cardWidth()}px)`;
});

document.getElementById('tcPrev')?.addEventListener('click', () => {
  currentSlide = Math.max(currentSlide - 1, 0);
  track.style.transform = `translateX(-${currentSlide * cardWidth()}px)`;
});

// Auto slide
setInterval(() => {
  const max = cards.length - visibleCards();
  currentSlide = currentSlide >= max ? 0 : currentSlide + 1;
  track.style.transform = `translateX(-${currentSlide * cardWidth()}px)`;
}, 4000);

// ===== FAQ =====
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  document.querySelectorAll('.faq-q').forEach(q => {
    q.classList.remove('open');
    q.nextElementSibling.classList.remove('open');
  });
  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

// ===== CONTACT FORM =====
document.getElementById('cForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-gold');
  const orig = btn.textContent;
  btn.textContent = '✅ Message Sent! We\'ll call you soon.';
  btn.style.background = '#22c55e';
  btn.style.color = '#fff';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
    btn.style.color = '';
    btn.disabled = false;
    e.target.reset();
  }, 4000);
});

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const activeIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.style.color = 'var(--yellow)';
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => activeIO.observe(s));