/* ═══════════════════════════════════════════════════
   ORBIT AUTOMATON — APP.JS
   Starfield, Orbit visualization, Terminal, Animations
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initBootLoader();
  initDiscordCopyBtn();
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
  initLiveGitHubRepos();
  initAudioAmbientSynth();
});

/* ─── AUDIO SYNTH BEEP (used by boot loader & UI feedback) ─── */
function initAudioSynth() {
  window.orbitSynthBeep = function(freq, vol) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq || 440, ctx.currentTime);
      gain.gain.setValueAtTime(vol || 0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } catch(e) { /* silent fail */ }
  };
}

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
        { type: 'system', prefix: '  ', text: 'archive    — Substrate Fragment Arşivini Aç' },
        { type: 'system', prefix: '  ', text: 'cat 00     — [GİZLİ] Fragment 00 Origin Point oku' },
        { type: 'system', prefix: '  ', text: 'deploy     — Deploy ve pipeline durumu' },
        { type: 'system', prefix: '  ', text: 'ping       — Bağlantı hızı testi' },
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
        { type: 'ready', prefix: '⚡', text: 'KaptanBey0 Automaton v2.4.1 (Dark Zenith Engine)' },
        { type: 'system', prefix: '  ', text: 'Developer: kaptanbey01' },
        { type: 'system', prefix: '  ', text: 'Motor: JavaScript, Luau & Python' },
        { type: 'system', prefix: '  ', text: 'Build: 2026.07.25' },
      ]
    },
    ping: {
      response: [
        { type: 'success', prefix: '✓', text: 'kaptanbey0.network → 12ms' },
        { type: 'success', prefix: '✓', text: 'discord.api (kaptanbey01) → 34ms' },
        { type: 'success', prefix: '✓', text: 'roblox.api (luau) → 67ms' },
        { type: 'ready', prefix: '⚡', text: 'Tüm bağlantılar sağlıklı' },
      ]
    },
    whoami: {
      response: [
        { type: 'info', prefix: '👤', text: 'OBSERVER ID: ' + (sessionStorage.getItem('orbit_observer_id') || 'OBSERVER-XXXX-OMEGA') },
        { type: 'system', prefix: '  ', text: 'Clearance Level: 3 — Standard Observer' },
        { type: 'system', prefix: '  ', text: 'Session: Active' },
        { type: 'system', prefix: '  ', text: 'Protocol: Dark Zenith v2.4.1' },
      ]
    },
    date: {
      response: [
        { type: 'info', prefix: '📅', text: new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
        { type: 'system', prefix: '  ', text: new Date().toLocaleTimeString('tr-TR') + ' UTC+3' },
      ]
    },
    uptime: {
      response: [
        { type: 'success', prefix: '⏱', text: 'Sistem Uptime: 99.97% (Son 30 gün)' },
        { type: 'system', prefix: '  ', text: 'Son yeniden başlatma: 72 saat önce' },
        { type: 'system', prefix: '  ', text: 'Active webhooks: 47 — Active endpoints: 128' },
      ]
    },
  };

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const cmd = input.value.trim().toLowerCase();
    input.value = '';

    if (!cmd) return;

    // Echo command
    addLine('system', `<span style="color:var(--neon-green)">kaptanbey01@automaton</span> <span style="color:var(--text-muted)">~</span> <span style="color:var(--neon-purple)">❯</span> ${escapeHtml(cmd)}`);

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

    if (cmd === 'archive') {
      window.location.href = 'archive.html';
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
  const searchInput = document.getElementById('db-modal-search');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 150);
    }
  }

  function closeModal() {
    modal.classList.remove('active');
    if (searchInput) {
      searchInput.value = '';
      filterItems('');
    }
  }

  function filterItems(query) {
    const q = query.toLowerCase().trim();
    const items = modal.querySelectorAll('.database-menu-item');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? 'flex' : 'none';
    });
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterItems(e.target.value);
    });
  }
}

/* ─── MULTI-LANGUAGE SYSTEM (TR, EN, DE, FR, ES, RU, JA) ─── */
function initLanguageSystem() {
  if (window.i18nEngine) {
    window.i18nEngine.init();
  }
}

/* ─── LIVE GITHUB REPOS FETCHER & SHOWCASE ─── */
async function initLiveGitHubRepos() {
  const container = document.getElementById('github-projects-grid');
  if (!container) return;

  const defaultProjects = [
    {
      name: "orbit-automaton",
      tag: "⚡ NODE 01 — AUTOMATON CORE",
      desc: "KaptanBey0 Automaton — Dark Zenith temalı, Substrate lore zekası ve GitLab/GitHub otomasyon portalı.",
      url: "https://github.com/kaptanbey0/orbit-automaton",
      lang: "JavaScript / HTML / CSS",
      stars: 12
    },
    {
      name: "discord-bot-framework",
      tag: "🤖 NODE 02 — DISCORD BOT",
      desc: "Discord.js v14 ile geliştirilmiş ölçeklenebilir bot altyapısı ve gelişmiş komut yöneticisi.",
      url: "https://github.com/kaptanbey0",
      lang: "JavaScript / Node.js",
      stars: 8
    },
    {
      name: "roblox-luau-systems",
      tag: "🎮 NODE 03 — ROBLOX SCRIPTING",
      desc: "Luau mimarisi ile oyun içi otomasyon, DataStore kaydı ve gerçek zamanlı sunucu event yönetimi.",
      url: "https://github.com/kaptanbey0",
      lang: "Luau",
      stars: 15
    },
    {
      name: "python-automation-suite",
      tag: "🛠️ NODE 04 — PYTHON AUTOMATION",
      desc: "Python tabanlı veri işleme modülleri, REST API entegrasyonları ve otomatik sistem araçları.",
      url: "https://github.com/kaptanbey0",
      lang: "Python",
      stars: 6
    }
  ];

  function renderProjects(items) {
    container.innerHTML = '';
    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <span class="project-card__tag">${item.tag || '⚡ GITHUB NODE'}</span>
        <h3 style="font-size: 1.1rem; color: #fff; margin: 8px 0;">${item.name}</h3>
        <p style="font-size: 0.85rem; color: #94a3b8; line-height: 1.6;">${item.desc || item.description || 'KaptanBey0 otomasyon reposu ve yazılım düğümü.'}</p>
        <div style="background: rgba(168, 85, 247, 0.08); border-left: 2px solid var(--neon-purple); padding: 8px 12px; margin: 12px 0; border-radius: 0 4px 4px 0; font-size: 0.75rem; color: #cbd5e1;">
          🤖 <strong>AI Analizi:</strong> Modüler mimari, optimize event döngüsü & kararlı API entegrasyonu.
        </div>
        <div class="project-card__footer">
          <span style="color:var(--neon-cyan); font-weight: 600; font-size: 0.8rem;">★ ${item.stars || item.stargazers_count || 0} STAR &middot; ${item.lang || item.language || 'JS/Luau'}</span>
          <a href="${item.url || item.html_url || 'https://github.com/kaptanbey0'}" target="_blank" style="color:var(--neon-green); font-weight:600; font-size:0.8rem; text-decoration:underline;">GitHub Node →</a>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Initial render with default showcase projects
  renderProjects(defaultProjects);

  // Fetch live repos from GitHub API
  try {
    const res = await fetch('https://api.github.com/users/kaptanbey0/repos?sort=updated&per_page=6');
    if (res.ok) {
      const repos = await res.json();
      if (Array.isArray(repos) && repos.length > 0) {
        const apisEl = document.getElementById('apis-value');
        if (apisEl) apisEl.textContent = repos.length;

        const liveMapped = repos.map((r, i) => ({
          name: r.name,
          tag: `⚡ GITHUB NODE 0${i + 1}`,
          desc: r.description || 'KaptanBey0 kamuya açık GitHub reposu.',
          url: r.html_url,
          lang: r.language || 'JavaScript',
          stars: r.stargazers_count
        }));
        renderProjects(liveMapped);
      }
    }
  } catch (e) {
    // Keep fallback showcase
  }
}

/* ─── CINEMATIC BOOT LOADER ─── */
function initBootLoader() {
  const loader = document.getElementById('boot-loader');
  const fill = document.getElementById('boot-progress-fill');
  const status = document.getElementById('boot-status');
  if (!loader) return;

  // Auto hide immediately after 600ms to guarantee no freeze
  setTimeout(() => {
    loader.classList.add('loaded');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 400);
  }, 600);

  const steps = [
    { p: 40, txt: 'MOUNTING SUBSTRATE ARCHIVE... 40%' },
    { p: 80, txt: 'AUTHENTICATING KAPTANBEY0 CORE... 80%' },
    { p: 100, txt: 'KAPTANBEY0 AUTOMATON READY 100%' }
  ];

  let stepIdx = 0;
  const timer = setInterval(() => {
    if (stepIdx < steps.length) {
      if (fill) fill.style.width = steps[stepIdx].p + '%';
      if (status) status.textContent = steps[stepIdx].txt;
      if (window.orbitSynthBeep) window.orbitSynthBeep(400 + stepIdx * 200, 0.03);
      stepIdx++;
    } else {
      clearInterval(timer);
    }
  }, 150);
}

/* ─── DISCORD NICK COPY BUTTON (kaptanbey01) ─── */
function initDiscordCopyBtn() {
  const btn = document.getElementById('discord-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const nick = 'kaptanbey01';
    navigator.clipboard.writeText(nick).then(() => {
      const originalText = btn.innerHTML;
      btn.innerHTML = `<span>✓ Kopyalandı: ${nick}!</span>`;
      btn.style.borderColor = 'var(--neon-green)';
      btn.style.color = 'var(--neon-green)';
      if (window.orbitSynthBeep) window.orbitSynthBeep(950, 0.06);

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.borderColor = '';
        btn.style.color = '';
      }, 2500);

      setTimeout(() => {
        window.open('https://discord.com/users/' + nick, '_blank');
      }, 600);
    }).catch(() => {
      prompt('Discord kullanıcı adı:', nick);
    });
  });
}

/* ─── AMBIENT SCI-FI SYNTH MUSIC GENERATOR ─── */
function initAudioAmbientSynth() {
  const btn = document.getElementById('ambient-music-btn');
  if (!btn) return;

  let isPlaying = false;
  let audioCtx = null;
  let oscs = [];
  let filter = null;
  let gainNode = null;
  let lfo = null;

  btn.addEventListener('click', () => {
    if (!isPlaying) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        // Polyphonic Cyberpunk Synth Chord: A2, E3, A3, E4
        const freqs = [110.00, 164.81, 220.00, 329.63];
        oscs = [];

        // Lowpass Biquad Filter for sweeping Blade Runner ambient tone
        filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, audioCtx.currentTime);

        // LFO for subtle filter sweep
        lfo = audioCtx.createOscillator();
        lfo.frequency.setValueAtTime(0.2, audioCtx.currentTime); // 0.2Hz sweep
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.setValueAtTime(200, audioCtx.currentTime);
        lfo.connect(filter.frequency);
        lfo.start();

        gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 1.5); // Rich audible volume

        freqs.forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          osc.connect(filter);
          osc.start();
          oscs.push(osc);
        });

        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        isPlaying = true;
        btn.innerHTML = '<span>🎵 AMBIENT: ON (PLAYING)</span>';
        btn.style.borderColor = 'var(--neon-green)';
        btn.style.color = 'var(--neon-green)';
        btn.style.boxShadow = '0 0 20px rgba(34, 255, 136, 0.4)';
      } catch (e) {
        console.error('Audio synth error:', e);
      }
    } else {
      if (gainNode && audioCtx) {
        gainNode.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
        setTimeout(() => {
          oscs.forEach(o => { try { o.stop(); } catch(e){} });
          if (lfo) { try { lfo.stop(); } catch(e){} }
        }, 900);
      }
      isPlaying = false;
      btn.innerHTML = '<span>🎵 AMBIENT: OFF</span>';
      btn.style.borderColor = '';
      btn.style.color = '';
      btn.style.boxShadow = '';
    }
  });
}

/* ─── KEYBOARD SHORTCUTS ─── */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Escape — close any active modal
    if (e.key === 'Escape') {
      const modal = document.getElementById('database-modal');
      if (modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        e.preventDefault();
        return;
      }
    }

    // Ctrl+K or Cmd+K — open database
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const modal = document.getElementById('database-modal');
      if (modal) modal.classList.toggle('active');
      return;
    }

    // "/" — focus terminal (when not typing)
    if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      const termInput = document.getElementById('terminal-input');
      if (termInput) {
        const termSection = document.getElementById('terminal');
        if (termSection) termSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => termInput.focus(), 400);
      }
    }
  });
}

/* ─── SECTION ENTRANCE ANIMATIONS ─── */
function initEntranceAnimations() {
  const cards = document.querySelectorAll('.stat-card, .project-card, .lang-card, .visual-card-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${index * 60}ms`;
        entry.target.classList.add('entrance-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s var(--ease-out), transform 0.6s var(--ease-out)';
    observer.observe(card);
  });
}

// Apply entrance-visible
document.addEventListener('DOMContentLoaded', () => {
  // Add the CSS class dynamically
  const style = document.createElement('style');
  style.textContent = `.entrance-visible { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);

  initKeyboardShortcuts();
  initEntranceAnimations();
});



