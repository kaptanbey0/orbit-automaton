/* ═══════════════════════════════════════════════════
   ORBIT AUTOMATON — APP.JS
   Starfield, Orbit visualization, Terminal, Animations
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initOrbitVisualization();
  initActivityGraph();
  initDependencyList();
  initAutomationGrid();
  initTerminal();
  initNavigation();
  initScrollAnimations();
  initClock();
  animateCounters();
  initObserverID();
  initSystemEventLog();
  initDatabaseMenu();
  initLanguageSystem();
  initAudioSynth();
});

/* ─── STARFIELD ─── */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  const STAR_COUNT = 200;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      star.pulse += star.pulseSpeed;
      const alpha = star.opacity * (0.5 + 0.5 * Math.sin(star.pulse));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
      ctx.fill();

      // Occasional purple stars
      if (star.size > 1.2) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${alpha * 0.15})`;
        ctx.fill();
      }

      star.y += star.speed;
      if (star.y > canvas.height + 5) {
        star.y = -5;
        star.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  draw();
  window.addEventListener('resize', () => { resize(); createStars(); });
}

/* ─── ORBIT VISUALIZATION ─── */
function initOrbitVisualization() {
  const canvas = document.getElementById('orbit-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const nodes = [];
  const edges = [];
  const NODE_COUNT = 40;
  let animFrame;
  let mouse = { x: -999, y: -999 };

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function createNodes() {
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    nodes.length = 0;
    edges.length = 0;

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 3 + 2,
        color: Math.random() > 0.65 ? '#a855f7' : '#00f0ff',
        glow: Math.random() > 0.7,
      });
    }

    // Create edges between close nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && Math.random() > 0.5) {
          edges.push([i, j]);
        }
      }
    }
  }

  function draw() {
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    ctx.clearRect(0, 0, w, h);

    // Draw edges
    edges.forEach(([a, b]) => {
      const na = nodes[a], nb = nodes[b];
      const dx = na.x - nb.x;
      const dy = na.y - nb.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 200) return;

      const alpha = Math.max(0, 1 - dist / 200) * 0.15;
      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);
      ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(node => {
      // Mouse interaction
      const dx = mouse.x - node.x;
      const dy = mouse.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        node.vx -= dx * 0.0003;
        node.vy -= dy * 0.0003;
      }

      node.x += node.vx;
      node.y += node.vy;

      // Bounce
      if (node.x < 0 || node.x > w) node.vx *= -1;
      if (node.y < 0 || node.y > h) node.vy *= -1;
      node.x = Math.max(0, Math.min(w, node.x));
      node.y = Math.max(0, Math.min(h, node.y));

      // Glow
      if (node.glow) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = node.color === '#a855f7'
          ? 'rgba(168, 85, 247, 0.08)'
          : 'rgba(0, 240, 255, 0.08)';
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.globalAlpha = 0.7;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    animFrame = requestAnimationFrame(draw);
  }

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -999;
    mouse.y = -999;
  });

  resize();
  createNodes();
  draw();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animFrame);
    resize();
    createNodes();
    draw();
  });
}

/* ─── ACTIVITY GRAPH ─── */
function initActivityGraph() {
  const container = document.getElementById('activity-graph');
  if (!container) return;

  const days = 30;
  const maxHeight = 80; // px

  for (let i = 0; i < days; i++) {
    const value = Math.floor(Math.random() * 40) + 2;
    const bar = document.createElement('div');
    bar.className = 'activity-bar';
    bar.style.height = `${(value / 42) * maxHeight}px`;
    bar.dataset.value = `${value} commit`;
    bar.style.animationDelay = `${i * 30}ms`;
    bar.style.animation = `barGrow 0.6s var(--ease-spring) ${i * 30}ms both`;
    container.appendChild(bar);
  }

  // Add animation keyframe dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes barGrow {
      from { transform: scaleY(0); transform-origin: bottom; }
      to { transform: scaleY(1); transform-origin: bottom; }
    }
  `;
  document.head.appendChild(style);
}

/* ─── DEPENDENCY LIST ─── */
function initDependencyList() {
  const container = document.getElementById('dep-items');
  if (!container) return;

  const deps = [
    { file: 'api/webhooks.js', msg: 'Yeni endpoint eklendi — 3 downstream servis etkileniyor', severity: 'medium', count: '3 etki' },
    { file: 'lib/auth/oauth.ts', msg: 'Token yenileme mantığı güncellendi — güvenli', severity: 'low', count: '1 etki' },
    { file: 'services/discord.js', msg: 'Rate limiter konfigürasyonu değişti', severity: 'low', count: '2 etki' },
    { file: 'game/init.lua', msg: 'DataStore v2 migrasyonu tamamlandı', severity: 'low', count: '5 etki' },
    { file: 'config/deploy.yml', msg: 'Production branch kuralı eklendi — CI pipeline tetikleniyor', severity: 'high', count: '12 etki' },
    { file: 'middleware/cors.js', msg: 'Wildcard origin kaldırıldı — tüm frontend\'ler etkileniyor', severity: 'high', count: '8 etki' },
  ];

  deps.forEach((dep, i) => {
    const item = document.createElement('div');
    item.className = 'dep-item';
    item.style.animationDelay = `${i * 80}ms`;
    item.innerHTML = `
      <span class="dep-item__severity dep-item__severity--${dep.severity}"></span>
      <span class="dep-item__file">${dep.file}</span>
      <span class="dep-item__msg">${dep.msg}</span>
      <span class="dep-item__count">${dep.count}</span>
    `;
    container.appendChild(item);
  });
}

/* ─── AUTOMATION GRID ─── */
function initAutomationGrid() {
  const container = document.getElementById('auto-grid');
  if (!container) return;

  const items = [
    { name: 'Discord Bot Monitor', status: 'Aktif', active: true },
    { name: 'Roblox Script Sync', status: 'Aktif', active: true },
    { name: 'API Docs Fetcher', status: 'Aktif', active: true },
    { name: 'Test Runner', status: 'Bekleme', active: false },
    { name: 'Webhook Listener', status: 'Aktif', active: true },
    { name: 'Dependency Scanner', status: 'Aktif', active: true },
    { name: 'CI/CD Pipeline', status: 'Aktif', active: true },
    { name: 'Log Aggregator', status: 'Bekleme', active: false },
    { name: 'Impact Analyzer', status: 'Aktif', active: true },
  ];

  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'auto-item';
    el.innerHTML = `
      <span class="auto-item__indicator auto-item__indicator--${item.active ? 'active' : 'idle'}"></span>
      <span class="auto-item__name">${item.name}</span>
      <span class="auto-item__status">${item.status}</span>
    `;
    container.appendChild(el);
  });
}

/* ─── TERMINAL ─── */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const body = document.getElementById('terminal-body');
  if (!input || !body) return;

  const commands = {
    help: {
      response: [
        { type: 'info', prefix: 'help', text: 'Kullanılabilir komutlar:' },
        { type: 'system', prefix: '  ', text: 'access     — Sci-Fi Veritabanı Menüsünü Aç' },
        { type: 'system', prefix: '  ', text: 'status     — Orbit & Anomali durumunu göster' },
        { type: 'system', prefix: '  ', text: 'scan       — Substrate düğüm taraması başlat' },
        { type: 'system', prefix: '  ', text: 'researchers— Araştırmacı Veritabanına Git' },
        { type: 'system', prefix: '  ', text: 'cat 00     — [GİZLİ] Fragment 00 Origin Point oku' },
        { type: 'system', prefix: '  ', text: 'deploy     — Deploy ve pipeline durumu' },
        { type: 'system', prefix: '  ', text: 'clear      — Terminali temizle' },
        { type: 'system', prefix: '  ', text: 'version    — Orbit Automaton sürümü' },
      ]
    },
    status: {
      response: [
        { type: 'success', prefix: '✓', text: 'Orbit Agent: Çevrimiçi (Dark Zenith)' },
        { type: 'success', prefix: '✓', text: 'Substrate Arşivi: Senkronize (%82 Anomali Dizin)' },
        { type: 'info', prefix: 'WARN', text: 'Fragment 14: Kararsız Titreşim Algılandı' },
        { type: 'info', prefix: 'info', text: 'Bellek Kullanımı: 234 MB / 2048 MB' },
        { type: 'info', prefix: 'info', text: 'CPU: %2.4 — Kararlı' },
      ]
    },
    access: {
      response: [
        { type: 'ready', prefix: '⚡', text: 'Veritabanı menüsü açılıyor...' }
      ]
    },
    scan: {
      response: [
        { type: 'system', prefix: '⟳', text: 'Substrate düğüm taraması başlatılıyor...' },
        { type: 'success', prefix: '✓', text: '128 API endpoint & 31 Fragment tarandı' },
        { type: 'success', prefix: '✓', text: 'Researcher A-07 sinyali: RECURSIVE ECHO' },
        { type: 'info', prefix: 'info', text: 'Fragment 00 varlığı: GİZLENMİŞ' },
        { type: 'ready', prefix: '⚡', text: 'Tarama tamamlandı — Düğüm güvende' },
      ]
    },
    deploy: {
      response: [
        { type: 'info', prefix: 'info', text: 'Son deploy: 2 saat önce' },
        { type: 'success', prefix: '✓', text: 'Production: v2.4.1 — Kararlı' },
        { type: 'success', prefix: '✓', text: 'Staging: v2.5.0-beta — Test aşamasında' },
      ]
    },
    version: {
      response: [
        { type: 'ready', prefix: '⚡', text: 'Orbit Automaton v2.4.1 (Dark Zenith + Substrate)' },
        { type: 'system', prefix: '  ', text: 'Tema: Dark Zenith Core' },
        { type: 'system', prefix: '  ', text: 'Motor: JavaScript, Luau & Python' },
        { type: 'system', prefix: '  ', text: 'Build: 2026.07.25' },
      ]
    },
    ping: {
      response: [
        { type: 'success', prefix: '✓', text: 'gitlab.orbit → 12ms' },
        { type: 'success', prefix: '✓', text: 'discord.api → 34ms' },
        { type: 'success', prefix: '✓', text: 'roblox.api → 67ms' },
        { type: 'ready', prefix: '⚡', text: 'Tüm bağlantılar sağlıklı' },
      ]
    },
  };

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const cmd = input.value.trim().toLowerCase();
    input.value = '';

    if (!cmd) return;

    // Echo command
    addLine('system', `<span style="color:var(--neon-green)">orbit@automaton</span> <span style="color:var(--text-muted)">~</span> <span style="color:var(--neon-purple)">❯</span> ${escapeHtml(cmd)}`);

    if (cmd === 'clear') {
      body.innerHTML = '';
      return;
    }

    if (cmd === 'access') {
      const modal = document.getElementById('database-modal');
      if (modal) modal.classList.add('active');
    }

    if (cmd === 'cat 00' || cmd === 'cat fragment-00' || cmd === '00' || cmd === 'fragment-00') {
      setTimeout(() => {
        window.location.href = 'fragment-00.html';
      }, 500);
      addLine('ready', '<span class="terminal-line__prefix">⚡</span><span>GIZLI DECRYPT PROTOKOLÜ BLASTER. FRAGMENT 00 ACILIYOR...</span>', true);
      return;
    }

    if (cmd === 'researchers') {
      window.location.href = 'researchers.html';
      return;
    }

    const handler = commands[cmd];
    if (handler) {
      handler.response.forEach((line, i) => {
        setTimeout(() => {
          addLine(line.type, `<span class="terminal-line__prefix">${line.prefix}</span><span>${line.text}</span>`, true);
        }, (i + 1) * 120);
      });
    } else {
      setTimeout(() => {
        addLine('error', `<span class="terminal-line__prefix">✗</span><span>Bilinmeyen komut: "${escapeHtml(cmd)}" — "help" veya "access" yazabilirsiniz</span>`, true);
      }, 100);
    }
  });

  function addLine(type, html, raw = false) {
    const div = document.createElement('div');
    div.className = `terminal-line terminal-line--${type}`;
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Secret Orbit Logo Click Trigger
  const logo = document.getElementById('orbit-logo');
  if (logo) {
    let clicks = 0;
    logo.addEventListener('click', () => {
      clicks++;
      if (clicks >= 3) {
        alert('[SYSTEM SECURITY OVERRIDE]: Fragment 00 Protocol Triggered.');
        window.location.href = 'fragment-00.html';
      }
    });
  }
}

/* ─── NAVIGATION ─── */
function initNavigation() {
  const links = document.querySelectorAll('.topbar__link');
  const topbar = document.getElementById('topbar');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.section;
      const section = document.getElementById(target);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.topbar__link[data-section="${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));

  // Topbar scroll effect
  window.addEventListener('scroll', () => {
    topbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

/* ─── SCROLL ANIMATIONS ─── */
function initScrollAnimations() {
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(s => observer.observe(s));
}

/* ─── CLOCK ─── */
function initClock() {
  const el = document.getElementById('clock');
  if (!el) return;

  function update() {
    const now = new Date();
    el.textContent = now.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  update();
  setInterval(update, 1000);
}

/* ─── COUNTER ANIMATION ─── */
function animateCounters() {
  const counters = [
    { el: document.getElementById('uptime-value'), target: 99.97, suffix: '%', decimals: 2 },
    { el: document.getElementById('hooks-value'), target: 47, suffix: '', decimals: 0 },
    { el: document.getElementById('apis-value'), target: 128, suffix: '', decimals: 0 },
    { el: document.getElementById('impact-value'), target: 0, suffix: '', decimals: 0 },
  ];

  counters.forEach(counter => {
    if (!counter.el) return;
    let current = 0;
    const duration = 2000;
    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart

      current = counter.target * eased;
      counter.el.textContent = current.toFixed(counter.decimals) + counter.suffix;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    // Start when visible
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    observer.observe(counter.el);
  });
}

/* ─── OBSERVER ID SYSTEM ─── */
function initObserverID() {
  let observerID = sessionStorage.getItem('orbit_observer_id');
  if (!observerID) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    observerID = `OBSERVER-${randomNum}-OMEGA`;
    sessionStorage.setItem('orbit_observer_id', observerID);
  }

  const badgeEl = document.getElementById('observer-id-badge');
  if (badgeEl) {
    badgeEl.innerHTML = `<span class="observer-badge__dot"></span><span>${observerID}</span>`;
  }
}

/* ─── SYSTEM EVENT LOG STREAMER ─── */
function initSystemEventLog() {
  const container = document.getElementById('system-event-log-list');
  if (!container) return;

  const events = [
    'Observer session authenticated',
    'SUBSTRATE archive indexed: Fragment 31 resonance detected',
    'Fragment 14 synchronization wave alert issued',
    'Researcher IX node broadcast captured',
    'External GitHub Node ping: kaptanbey0/orbit-automaton',
    'Background automation cycle #894 completed',
    'Classified query blocked: Fragment 00 origin scan',
    'Dark Zenith Core: All telemetry links operational'
  ];

  function getTimestamp() {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  }

  function addEvent(msg) {
    const row = document.createElement('div');
    row.className = 'event-log-row';
    row.innerHTML = `<span class="event-log-row__time">[${getTimestamp()}]</span><span>${msg}</span>`;
    container.insertBefore(row, container.firstChild);

    if (container.children.length > 8) {
      container.removeChild(container.lastChild);
    }
  }

  // Initial populate
  addEvent('Observer connected to Orbit Core');
  addEvent('Substrate archive index mounted at 82%');

  // Periodic updates
  setInterval(() => {
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    addEvent(randomEvent);
  }, 6000);
}

/* ─── GLOBAL DATABASE SELECTOR MENU ─── */
function initDatabaseMenu() {
  const modal = document.getElementById('database-modal');
  const openBtn = document.getElementById('nav-db-btn');
  const closeBtn = document.getElementById('close-db-modal');

  if (!modal) return;

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('active');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/* ─── DUAL LANGUAGE SYSTEM (TR / EN) ─── */
function initLanguageSystem() {
  const toggleBtn = document.getElementById('lang-toggle-btn');
  const toggleText = document.getElementById('lang-toggle-text');
  
  // Detect browser language or saved preference
  let currentLang = localStorage.getItem('orbit_lang') || (navigator.language.startsWith('tr') ? 'tr' : 'en');

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('orbit_lang', lang);
    document.documentElement.lang = lang;

    if (toggleText) {
      toggleText.textContent = lang === 'tr' ? '🌐 TR (Türkçe)' : '🌐 EN (English)';
    }

    // Update all elements with data-tr and data-en attributes
    const elements = document.querySelectorAll('[data-tr][data-en]');
    elements.forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        if (el.children.length === 0 || el.tagName === 'SPAN' || el.tagName === 'P' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'BUTTON') {
          el.textContent = text;
        }
      }
    });
  }

  applyLanguage(currentLang);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const newLang = currentLang === 'tr' ? 'en' : 'tr';
      applyLanguage(newLang);
      if (window.orbitSynthBeep) window.orbitSynthBeep(880, 0.05);
    });
  }
}

/* ─── WEB AUDIO SCI-FI SYNTHESIZER ─── */
function initAudioSynth() {
  let audioCtx = null;

  window.orbitSynthBeep = function(freq = 600, duration = 0.04) {
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio fallback silent
    }
  };

  // Add click sound effects to interactive buttons
  document.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('.database-menu-item') || e.target.closest('.topbar__link')) {
      if (window.orbitSynthBeep) window.orbitSynthBeep(700, 0.04);
    }
  });
}


