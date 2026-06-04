// ── PARTICLES ──
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 1.5 + 0.5,
    alpha: Math.random() * 0.4 + 0.1,
  };
}
for (let i = 0; i < 80; i++) particles.push(createParticle());

// ── FLOATING CODE SNIPPETS ──
const codeSnippets = [
  'class Cloud {}', 'new SpringBoot()', '@RestController',
  'docker run', 'kubectl apply', 'git push',
  'lambda x ->', 'extends JVM', 'implements API',
  '@Override', 'System.out', 'public static',
  'new Thread()', 'async/await', 'microservice',
  'JWT.verify()', 'OAuth2.0', 'https://',
];

let floatingCodes = [];
for (let i = 0; i < 12; i++) {
  floatingCodes.push({
    text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vy: -(Math.random() * 0.3 + 0.1),
    alpha: Math.random() * 0.07 + 0.02,
    size: Math.random() * 4 + 9,
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // floating code snippets
  ctx.font = '11px monospace';
  floatingCodes.forEach(c => {
    ctx.fillStyle = `rgba(224,16,16,${c.alpha})`;
    ctx.font = `${c.size}px monospace`;
    ctx.fillText(c.text, c.x, c.y);
    c.y += c.vy;
    if (c.y < -20) {
      c.y = canvas.height + 20;
      c.x = Math.random() * canvas.width;
      c.text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    }
  });

  // particles
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(224,16,16,${p.alpha})`;
    ctx.fill();
  });

  // lines between close particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(224,16,16,${0.08 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── NAV DOTS ──
const total = 17;
const nav = document.getElementById('navDots');
for (let i = 1; i <= total; i++) {
  const btn = document.createElement('button');
  btn.className = 'nav-dot';
  btn.textContent = i;
  btn.onclick = () => goToSlide(i);
  nav.appendChild(btn);
}

const bar = document.getElementById('progress');
const dots = document.querySelectorAll('.nav-dot');
const slides = document.querySelectorAll('.slide');
let currentSlide = 1;

function goToSlide(n) {
  if (n < 1 || n > total) return;
  currentSlide = n;
  document.getElementById('slide-' + n).scrollIntoView({ behavior: 'smooth' });
}

function getCurrentSlide() {
  let closest = 1;
  slides.forEach((slide, i) => {
    const rect = slide.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) closest = i + 1;
  });
  return closest;
}

// ── KEYBOARD ──
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToSlide(getCurrentSlide() + 1);
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToSlide(getCurrentSlide() - 1);
});

// ── PREV / NEXT BUTTONS ──
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
prevBtn.addEventListener('click', () => { burstParticles(prevBtn); goToSlide(getCurrentSlide() - 1); });
nextBtn.addEventListener('click', () => { burstParticles(nextBtn); goToSlide(getCurrentSlide() + 1); });

// ── BUTTON PARTICLE BURST ──
function burstParticles(btn) {
  const rect = btn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const count = 12;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed; left:${cx}px; top:${cy}px;
      width:${Math.random()*4+2}px; height:${Math.random()*4+2}px;
      border-radius:50%;
      background:rgba(224,16,16,${Math.random()*0.7+0.3});
      pointer-events:none; z-index:9998;
      transform:translate(-50%,-50%);
    `;
    document.body.appendChild(el);
    const angle = (i / count) * Math.PI * 2;
    const dist = Math.random() * 50 + 20;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    el.animate([
      { transform: `translate(-50%,-50%) scale(1)`, opacity: 1 },
      { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
    ], { duration: 500 + Math.random() * 300, easing: 'cubic-bezier(0,0,0.2,1)' }).onfinish = () => el.remove();
  }
  // short line sparks
  for (let i = 0; i < 6; i++) {
    const el = document.createElement('div');
    const angle = Math.random() * Math.PI * 2;
    const len = Math.random() * 24 + 10;
    el.style.cssText = `
      position:fixed; left:${cx}px; top:${cy}px;
      width:${len}px; height:1.5px;
      background: linear-gradient(90deg, rgba(224,16,16,0.9), transparent);
      pointer-events:none; z-index:9998;
      transform-origin: left center;
      transform: translate(-50%,-50%) rotate(${angle}rad);
    `;
    document.body.appendChild(el);
    el.animate([
      { opacity: 1, transform: `translate(-50%,-50%) rotate(${angle}rad) scaleX(1)` },
      { opacity: 0, transform: `translate(-50%,-50%) rotate(${angle}rad) scaleX(0)` }
    ], { duration: 350, easing: 'ease-out' }).onfinish = () => el.remove();
  }
}

// ── FULLSCREEN ──
(function () {
  const btn = document.getElementById('fullscreenBtn');
  const enterIcon = btn.querySelector('.fs-enter');
  const exitIcon  = btn.querySelector('.fs-exit');

  // Toast helper
  let toastEl = null;
  function showToast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'fs-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove('show'), 1800);
  }

  function updateIcon() {
    const isFs = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
    enterIcon.style.display = isFs ? 'none' : '';
    exitIcon.style.display  = isFs ? '' : 'none';
    btn.title = isFs ? 'Exit Fullscreen (F or Esc)' : 'Enter Fullscreen (F)';
  }

  function toggleFullscreen() {
    const isFs = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
    if (!isFs) {
      const el = document.documentElement;
      const req = el.requestFullscreen || el.webkitRequestFullscreen ||
                  el.mozRequestFullScreen || el.msRequestFullscreen;
      if (req) {
        req.call(el).catch(() => showToast('FULLSCREEN BLOCKED'));
        showToast('FULLSCREEN ON');
      }
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen ||
                   document.mozCancelFullScreen || document.msExitFullscreen;
      if (exit) exit.call(document);
      showToast('FULLSCREEN OFF');
    }
  }

  btn.addEventListener('click', () => { burstParticles(btn); toggleFullscreen(); });

  // Keyboard shortcut: F key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
      if (document.activeElement.tagName !== 'INPUT' &&
          document.activeElement.tagName !== 'TEXTAREA') {
        toggleFullscreen();
      }
    }
  });

  // Sync icon when Esc exits fullscreen
  document.addEventListener('fullscreenchange', updateIcon);
  document.addEventListener('webkitfullscreenchange', updateIcon);
  document.addEventListener('mozfullscreenchange', updateIcon);
  document.addEventListener('MSFullscreenChange', updateIcon);
})();

const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ── CARDS STAGGER ──
const cardEls = document.querySelectorAll('.card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.closest('.content-grid')?.querySelectorAll('.card') || [entry.target];
      cards.forEach((card, i) => setTimeout(() => card.classList.add('visible'), i * 120));
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
cardEls.forEach(card => cardObserver.observe(card));

// ── OBJ ITEMS STAGGER ──
const objItems = document.querySelectorAll('.obj-item');
const objObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = entry.target.closest('.obj-list')?.querySelectorAll('.obj-item') || [entry.target];
      siblings.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `opacity 0.4s ease ${i * 80}ms, transform 0.4s ease ${i * 80}ms`;
        setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'translateX(0)'; }, 50);
      });
      objObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
objItems.forEach(item => objObserver.observe(item));

// ── SLIDE LINE DRAW ──
const slideLines = document.querySelectorAll('.slide-line');
const lineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('line-drawn');
      lineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
slideLines.forEach(line => lineObserver.observe(line));

// ── COUNTER ANIMATION (slower: 3500ms) ──
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 3500;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.counter);
      const suffix = entry.target.dataset.suffix || '';
      animateCounter(entry.target, target, suffix);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObserver.observe(el));

// ── TYPEWRITER EFFECT ──
(function () {
  const el = document.querySelector('.typewriter');
  if (!el) return;
  const text = el.textContent.trim();
  el.textContent = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, 38 + Math.random() * 22);
    }
  }
  setTimeout(type, 600);
})();
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total_h = document.body.scrollHeight - window.innerHeight;
  bar.style.width = (scrolled / total_h * 100) + '%';

  slides.forEach((slide, i) => {
    const rect = slide.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
      dots.forEach(d => d.classList.remove('active'));
      if (dots[i]) dots[i].classList.add('active');
      currentSlide = i + 1;
    }
  });

  prevBtn.style.opacity = currentSlide <= 1 ? '0.3' : '1';
  nextBtn.style.opacity = currentSlide >= total ? '0.3' : '1';
});
