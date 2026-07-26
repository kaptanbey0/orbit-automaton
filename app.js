/* ═══════════════════════════════════════════════════
   ORBIT AUTOMATON — APP.JS
   Starfield, Orbit visualization, Terminal, Animations
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initBootLoader();
  initDiscordCopyBtn();
  initStarfield();
  initAmbientParticles();
  initHeroOrbs();
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
  initCertificates();
  initCyberEyes();
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

/* ─── ENHANCED COSMIC PARTICLE STARFIELD ─── */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  const STAR_COUNT = 240;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      const isPurple = Math.random() > 0.65;
      const isGreen = !isPurple && Math.random() > 0.8;
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25 - 0.08,
        size: Math.random() * 1.8 + 0.4,
        baseOpacity: Math.random() * 0.5 + 0.2,
        color: isPurple ? '168, 85, 247' : isGreen ? '34, 255, 136' : '0, 240, 255',
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      star.pulse += star.pulseSpeed;
      const alpha = star.baseOpacity * (0.5 + 0.5 * Math.sin(star.pulse));

      // Movement
      star.x += star.vx;
      star.y += star.vy;

      // Wrap around screen
      if (star.x < -10) star.x = canvas.width + 10;
      if (star.x > canvas.width + 10) star.x = -10;
      if (star.y < -10) star.y = canvas.height + 10;
      if (star.y > canvas.height + 10) star.y = -10;

      // Glow aura for larger stars
      if (star.size > 1.4) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${alpha * 0.2})`;
        ctx.fill();
      }

      // Core particle
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${star.color}, ${alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  draw();
  window.addEventListener('resize', () => { resize(); createStars(); });
}

/* ─── AMBIENT FLOATING COSMIC DUST ─── */
function initAmbientParticles() {
  const container = document.getElementById('ambient-particles');
  if (!container) return;

  const PARTICLE_COUNT = 35;
  const colors = [
    'rgba(0, 240, 255, 0.4)',
    'rgba(168, 85, 247, 0.35)',
    'rgba(34, 255, 136, 0.3)',
    'rgba(255, 170, 34, 0.25)',
    'rgba(0, 240, 255, 0.2)',
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const dot = document.createElement('div');
    dot.className = 'cosmic-dust';
    const size = Math.random() * 4 + 1.5;
    const x = Math.random() * 100;
    const delay = Math.random() * 20;
    const duration = Math.random() * 18 + 14;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const blur = Math.random() * 3 + 1;

    dot.style.cssText = `
      left: ${x}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      box-shadow: 0 0 ${blur * 3}px ${color}, 0 0 ${blur * 8}px ${color};
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      filter: blur(${blur * 0.5}px);
    `;
    container.appendChild(dot);
  }
}

/* ─── HERO ENERGY ORBS ─── */
function initHeroOrbs() {
  const hero = document.querySelector('.section--hero');
  if (!hero) return;

  const orbCount = 6;
  const orbColors = [
    { bg: 'rgba(0, 240, 255, 0.08)', glow: '0, 240, 255' },
    { bg: 'rgba(168, 85, 247, 0.07)', glow: '168, 85, 247' },
    { bg: 'rgba(34, 255, 136, 0.06)', glow: '34, 255, 136' },
    { bg: 'rgba(0, 240, 255, 0.05)', glow: '0, 240, 255' },
    { bg: 'rgba(168, 85, 247, 0.06)', glow: '168, 85, 247' },
    { bg: 'rgba(255, 170, 34, 0.05)', glow: '255, 170, 34' },
  ];

  for (let i = 0; i < orbCount; i++) {
    const orb = document.createElement('div');
    orb.className = 'hero-energy-orb';
    const size = Math.random() * 180 + 60;
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 70 + 10;
    const delay = Math.random() * 8;
    const duration = Math.random() * 10 + 12;
    const c = orbColors[i % orbColors.length];

    orb.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, ${c.bg} 0%, transparent 70%);
      box-shadow: 0 0 ${size * 0.6}px rgba(${c.glow}, 0.15);
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
    `;
    hero.appendChild(orb);
  }
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

  function render() {
    container.innerHTML = '';
    const t = (key, fallback) => (window.i18nEngine ? window.i18nEngine.t(key, fallback) : fallback);
    const deps = [
      { file: 'api/webhooks.js', msg: t('dep_msg_1', 'Yeni endpoint eklendi — 3 downstream servis etkileniyor'), severity: 'medium', count: t('dep_cnt_1', '3 etki') },
      { file: 'lib/auth/oauth.ts', msg: t('dep_msg_2', 'Token yenileme mantığı güncellendi — güvenli'), severity: 'low', count: t('dep_cnt_2', '1 etki') },
      { file: 'services/discord.js', msg: t('dep_msg_3', 'Rate limiter konfigürasyonu değişti'), severity: 'low', count: t('dep_cnt_3', '2 etki') },
      { file: 'game/init.lua', msg: t('dep_msg_4', 'DataStore v2 migrasyonu tamamlandı'), severity: 'low', count: t('dep_cnt_4', '5 etki') },
      { file: 'config/deploy.yml', msg: t('dep_msg_5', 'Production branch kuralı eklendi — CI pipeline tetikleniyor'), severity: 'high', count: t('dep_cnt_5', '12 etki') },
      { file: 'middleware/cors.js', msg: t('dep_msg_6', 'Wildcard origin kaldırıldı — tüm frontend\'ler etkileniyor'), severity: 'high', count: t('dep_cnt_6', '8 etki') },
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

  render();
  document.addEventListener('orbit:lang-changed', render);
}

/* ─── AUTOMATION GRID ─── */
function initAutomationGrid() {
  const container = document.getElementById('auto-grid');
  if (!container) return;

  function render() {
    container.innerHTML = '';
    const t = (key, fallback) => (window.i18nEngine ? window.i18nEngine.t(key, fallback) : fallback);
    const activeText = t('auto_active', 'Aktif');
    const idleText = t('auto_idle', 'Bekleme');

    const items = [
      { name: 'Discord Bot Monitor', status: activeText, active: true },
      { name: 'Roblox Script Sync', status: activeText, active: true },
      { name: 'API Docs Fetcher', status: activeText, active: true },
      { name: 'Test Runner', status: idleText, active: false },
      { name: 'Webhook Listener', status: activeText, active: true },
      { name: 'Dependency Scanner', status: activeText, active: true },
      { name: 'CI/CD Pipeline', status: activeText, active: true },
      { name: 'Log Aggregator', status: idleText, active: false },
      { name: 'Impact Analyzer', status: activeText, active: true },
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

  render();
  document.addEventListener('orbit:lang-changed', render);
}

/* ─── TERMINAL ─── */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const body = document.getElementById('terminal-body');
  if (!input || !body) return;

  function getHelpResponse() {
    const t = (key, fallback) => (window.i18nEngine ? window.i18nEngine.t(key, fallback) : fallback);
    return [
      { type: 'info', prefix: 'help', text: t('term_help_title', 'Kullanılabilir komutlar:') },
      { type: 'system', prefix: '  ', text: t('term_cmd_access', 'access     — Sci-Fi Veritabanı Menüsünü Aç') },
      { type: 'system', prefix: '  ', text: t('term_cmd_status', 'status     — Orbit & Anomali durumunu göster') },
      { type: 'system', prefix: '  ', text: t('term_cmd_scan', 'scan       — Substrate düğüm taraması başlat') },
      { type: 'system', prefix: '  ', text: t('term_cmd_res', 'researchers— Araştırmacı Veritabanına Git') },
      { type: 'system', prefix: '  ', text: t('term_cmd_arch', 'archive    — Substrate Fragment Arşivini Aç') },
      { type: 'system', prefix: '  ', text: t('term_cmd_cat', 'cat 00     — [GİZLİ] Fragment 00 Origin Point oku') },
      { type: 'system', prefix: '  ', text: t('term_cmd_deploy', 'deploy     — Deploy ve pipeline durumu') },
      { type: 'system', prefix: '  ', text: t('term_cmd_ping', 'ping       — Bağlantı hızı testi') },
      { type: 'system', prefix: '  ', text: t('term_cmd_clear', 'clear      — Terminali temizle') },
      { type: 'system', prefix: '  ', text: t('term_cmd_ver', 'version    — Orbit Automaton sürümü') },
    ];
  }

  const commands = {
    help: {
      get response() { return getHelpResponse(); }
    },
    status: {
      response: [
        { type: 'success', prefix: '✓', text: 'Orbit Agent: Çevrimiçi (Nexus Prime Core)' },
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
        { type: 'ready', prefix: '⚡', text: 'KaptanBey0 Automaton v2.4.1 (Nexus Prime Engine)' },
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
        { type: 'system', prefix: '  ', text: 'Protocol: Nexus Prime v2.4.1' },
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

    if (cmd === 'cv' || cmd === 'dossier' || cmd === 'resume') {
      setTimeout(() => {
        window.location.href = 'cv.html';
      }, 500);
      addLine('ready', '<span class="terminal-line__prefix">📜</span><span>OPENING KAPTANBEY0 DEVELOPER DOSSIER & CV...</span>', true);
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

  const t = (key, fallback) => (window.i18nEngine ? window.i18nEngine.t(key, fallback) : fallback);

  const eventKeys = [
    'event_log_1',
    'event_log_2',
    'event_log_3',
    'event_log_4',
    'event_log_5',
    'event_log_6',
    'event_log_7',
    'event_log_8'
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
  addEvent(t('event_log_init', 'Gözlemci Orbit Core\'a bağlandı'));
  addEvent(t('event_log_mounted', 'Substrate arşiv indeksi %82 oranında yüklendi'));

  // Periodic updates
  setInterval(() => {
    const randomKey = eventKeys[Math.floor(Math.random() * eventKeys.length)];
    addEvent(t(randomKey, 'System event logged'));
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

  let currentProjects = [
    {
      name: "orbit-automaton",
      tagKey: "proj_1_tag",
      descKey: "proj_1_desc",
      tagDefault: "⚡ DÜĞÜM 01 — AUTOMATON CORE",
      descDefault: "KaptanBey0 Automaton — Nexus Prime temalı, Substrate lore zekası ve GitLab/GitHub otomasyon portalı.",
      url: "https://github.com/kaptanbey0/orbit-automaton",
      lang: "JavaScript / HTML / CSS",
      stars: 12
    },
    {
      name: "discord-bot-framework",
      tagKey: "proj_2_tag",
      descKey: "proj_2_desc",
      tagDefault: "🤖 DÜĞÜM 02 — DISCORD BOT",
      descDefault: "Discord.js v14 ile geliştirilmiş ölçeklenebilir bot altyapısı ve gelişmiş komut yöneticisi.",
      url: "https://github.com/kaptanbey0",
      lang: "JavaScript / Node.js",
      stars: 8
    },
    {
      name: "roblox-luau-systems",
      tagKey: "proj_3_tag",
      descKey: "proj_3_desc",
      tagDefault: "🎮 DÜĞÜM 03 — ROBLOX SCRIPTING",
      descDefault: "Luau mimarisi ile oyun içi otomasyon, DataStore kaydı ve gerçek zamanlı sunucu event yönetimi.",
      url: "https://github.com/kaptanbey0",
      lang: "Luau",
      stars: 15
    },
    {
      name: "python-automation-suite",
      tagKey: "proj_4_tag",
      descKey: "proj_4_desc",
      tagDefault: "🛠️ DÜĞÜM 04 — PYTHON OTOMASYON",
      descDefault: "Python tabanlı veri işleme modülleri, REST API entegrasyonları ve otomatik sistem araçları.",
      url: "https://github.com/kaptanbey0",
      lang: "Python",
      stars: 6
    }
  ];

  function renderProjects(items) {
    container.innerHTML = '';
    const t = (key, fallback) => (window.i18nEngine ? window.i18nEngine.t(key, fallback) : fallback);

    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      const tag = item.tagKey ? t(item.tagKey, item.tagDefault) : (item.tag || t('proj_default_tag', '⚡ GITHUB DÜĞÜMÜ'));
      const desc = item.descKey ? t(item.descKey, item.descDefault) : (item.desc || item.description || t('proj_default_desc', 'KaptanBey0 otomasyon reposu ve yazılım düğümü.'));
      const aiTitle = t('ai_analysis_title', 'AI Analizi:');
      const aiDesc = t('ai_analysis_desc', 'Modüler mimari, optimize event döngüsü & kararlı API entegrasyonu.');
      const nodeLinkText = t('proj_view_github', 'GitHub\'da İncele') + ' →';

      card.innerHTML = `
        <span class="project-card__tag">${tag}</span>
        <h3 style="font-size: 1.1rem; color: #fff; margin: 8px 0;">${item.name}</h3>
        <p style="font-size: 0.85rem; color: #94a3b8; line-height: 1.6;">${desc}</p>
        <div style="background: rgba(168, 85, 247, 0.08); border-left: 2px solid var(--neon-purple); padding: 8px 12px; margin: 12px 0; border-radius: 0 4px 4px 0; font-size: 0.75rem; color: #cbd5e1;">
          🤖 <strong>${aiTitle}</strong> ${aiDesc}
        </div>
        <div class="project-card__footer">
          <span style="color:var(--neon-cyan); font-weight: 600; font-size: 0.8rem;">★ ${item.stars || item.stargazers_count || 0} STAR &middot; ${item.lang || item.language || 'JS/Luau'}</span>
          <a href="${item.url || item.html_url || 'https://github.com/kaptanbey0'}" target="_blank" style="color:var(--neon-green); font-weight:600; font-size:0.8rem; text-decoration:underline;">${nodeLinkText}</a>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Initial render
  renderProjects(currentProjects);

  // Re-render on language change
  document.addEventListener('orbit:lang-changed', () => {
    renderProjects(currentProjects);
  });

  // Fetch live repos from GitHub API
  try {
    const res = await fetch('https://api.github.com/users/kaptanbey0/repos?sort=updated&per_page=6');
    if (res.ok) {
      const repos = await res.json();
      if (Array.isArray(repos) && repos.length > 0) {
        const apisEl = document.getElementById('apis-value');
        if (apisEl) apisEl.textContent = repos.length;

        currentProjects = repos.map((r, i) => ({
          name: r.name,
          tag: `⚡ GITHUB NODE 0${i + 1}`,
          desc: r.description,
          url: r.html_url,
          lang: r.language || 'JavaScript',
          stars: r.stargazers_count
        }));
        renderProjects(currentProjects);
      }
    }
  } catch (e) {
    // Keep showcase
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

    // "m" — toggle ambient audio
    if ((e.key === 'm' || e.key === 'M') && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      const musicBtn = document.getElementById('ambient-music-btn');
      if (musicBtn) musicBtn.click();
    }

    // "l" — cycle language
    if ((e.key === 'l' || e.key === 'L') && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      if (window.i18nEngine) {
        const langs = ['tr', 'en', 'de', 'fr', 'es', 'ru', 'ja'];
        const nextIdx = (langs.indexOf(window.i18nEngine.currentLang) + 1) % langs.length;
        window.i18nEngine.setLanguage(langs[nextIdx]);
      }
    }

    // "?" — toggle shortcuts overlay
    if (e.key === '?' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      toggleShortcutsModal();
    }
  });

  // Attach universal synth sound feedback to all interactive elements
  document.querySelectorAll('a, button, .visual-card-item, .project-card, .database-menu-item, .hub-link').forEach(el => {
    el.addEventListener('click', () => {
      if (window.orbitSynthBeep) window.orbitSynthBeep(750, 0.04);
    });
  });
}

/* ─── SHORTCUTS OVERLAY MODAL ─── */
function toggleShortcutsModal() {
  let modal = document.getElementById('shortcuts-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'shortcuts-modal';
    modal.style.cssText = 'position:fixed; inset:0; z-index:99999; background:rgba(3,3,6,0.92); backdrop-filter:blur(16px); display:flex; align-items:center; justify-content:center; padding:20px;';
    modal.innerHTML = `
      <div style="background:var(--bg-card); border:1px solid var(--border-neon); border-radius:var(--radius-md); max-width:480px; width:100%; padding:28px; box-shadow:0 0 40px rgba(0,240,255,0.25); position:relative;">
        <button id="close-shortcuts-modal" style="position:absolute; top:18px; right:18px; background:none; border:none; color:var(--neon-red); cursor:pointer; font-family:var(--font-mono); font-size:1.1rem;">[X]</button>
        <div style="font-size:0.75rem; color:var(--neon-cyan); letter-spacing:0.2em; margin-bottom:8px;">NEXUS PRIME // KEYBOARD MATRIX</div>
        <h3 style="font-size:1.3rem; color:#fff; font-family:var(--font-mono); margin-bottom:16px;">⌨️ Keyboard Shortcuts</h3>
        <div style="display:flex; flex-direction:column; gap:10px; font-family:var(--font-mono); font-size:0.82rem; color:#cbd5e1;">
          <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:6px;"><span>Open Sci-Fi Database</span><span style="color:var(--neon-cyan); font-weight:bold;">Ctrl + K</span></div>
          <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:6px;"><span>Focus Sci-Fi Terminal</span><span style="color:var(--neon-cyan); font-weight:bold;">/</span></div>
          <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:6px;"><span>Toggle Ambient Music</span><span style="color:var(--neon-cyan); font-weight:bold;">M</span></div>
          <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:6px;"><span>Cycle 7 Languages</span><span style="color:var(--neon-cyan); font-weight:bold;">L</span></div>
          <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:6px;"><span>Toggle Shortcuts Overlay</span><span style="color:var(--neon-cyan); font-weight:bold;">?</span></div>
          <div style="display:flex; justify-content:space-between; padding-top:2px;"><span>Close Active Modals</span><span style="color:var(--neon-red); font-weight:bold;">Esc</span></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('close-shortcuts-modal').addEventListener('click', () => {
      modal.style.display = 'none';
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  } else {
    modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
  }
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

// Apply entrance-visible & initializations
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `.entrance-visible { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);

  initKeyboardShortcuts();
  initEntranceAnimations();
  initFragmentInspector();
  initCursorParticleTrail();
  init3DCardTilt();
  initThemeSwitcher();
  initRadarScanner();
  initTerminalHistory();
  initScrollTopButton();

  const shortcutsBtn = document.getElementById('shortcuts-btn');
  if (shortcutsBtn) {
    shortcutsBtn.addEventListener('click', () => toggleShortcutsModal());
  }
});

/* ─── FLOATING SCROLL-TO-TOP BUTTON ─── */
function initScrollTopButton() {
  let btn = document.getElementById('scroll-top-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'scroll-top-btn';
    btn.title = 'Yukarı Dön (Scroll to Top)';
    btn.innerHTML = '🚀';
    document.body.appendChild(btn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.orbitSynthBeep) window.orbitSynthBeep(900, 0.05);
  });
}

/* ─── ANOMALY RADAR SCANNER ─── */
function initRadarScanner() {
  const canvas = document.getElementById('radar-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = canvas.width / 2 - 4;

  let angle = 0;
  const blips = [
    { r: 25, a: 0.8, opacity: 0.9 },
    { r: 40, a: 2.4, opacity: 0.7 },
    { r: 18, a: 4.1, opacity: 0.8 },
    { r: 48, a: 5.2, opacity: 0.6 }
  ];

  function drawRadar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Concentric grid circles
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.lineWidth = 1;
    [0.3, 0.65, 0.95].forEach(scale => {
      ctx.beginPath();
      ctx.arc(cx, cy, radius * scale, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(cx, 4); ctx.lineTo(cx, canvas.height - 4);
    ctx.moveTo(4, cy); ctx.lineTo(canvas.width - 4, cy);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.stroke();

    // Sweeping beam arc
    angle += 0.04;
    if (angle > Math.PI * 2) angle = 0;

    const startAngle = angle - 0.5;
    const endAngle = angle;

    const gradient = ctx.createConicGradient(angle - Math.PI / 2, cx, cy);
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
    gradient.addColorStop(0.15, 'rgba(0, 240, 255, 0.05)');
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Sweeping leading line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.9)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Blips
    blips.forEach(b => {
      const bx = cx + Math.cos(b.a) * b.r;
      const by = cy + Math.sin(b.a) * b.r;

      ctx.beginPath();
      ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 85, 247, ${b.opacity})`;
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 6;
      ctx.fill();
    });

    requestAnimationFrame(drawRadar);
  }

  requestAnimationFrame(drawRadar);
}

/* ─── TERMINAL COMMAND HISTORY ─── */
function initTerminalHistory() {
  const input = document.getElementById('terminal-input');
  if (!input) return;

  const history = [];
  let historyIdx = -1;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value.trim();
      if (val && history[history.length - 1] !== val) {
        history.push(val);
      }
      historyIdx = history.length;
    } else if (e.key === 'ArrowUp') {
      if (history.length === 0) return;
      e.preventDefault();
      if (historyIdx > 0) historyIdx--;
      input.value = history[historyIdx] || '';
    } else if (e.key === 'ArrowDown') {
      if (history.length === 0) return;
      e.preventDefault();
      if (historyIdx < history.length - 1) {
        historyIdx++;
        input.value = history[historyIdx];
      } else {
        historyIdx = history.length;
        input.value = '';
      }
    }
  });
}

/* ─── DYNAMIC THEME SWITCHER ─── */
function initThemeSwitcher() {
  const themes = {
    cyan: { name: 'CYAN', cyan: '#00f0ff', purple: '#a855f7', border: 'rgba(0, 240, 255, 0.3)' },
    emerald: { name: 'EMERALD', cyan: '#22ff88', purple: '#00f0ff', border: 'rgba(34, 255, 136, 0.3)' },
    amber: { name: 'AMBER', cyan: '#ffaa00', purple: '#ff0055', border: 'rgba(255, 170, 0, 0.3)' },
    purple: { name: 'PURPLE', cyan: '#a855f7', purple: '#ff0055', border: 'rgba(168, 85, 247, 0.3)' }
  };

  const themeKeys = Object.keys(themes);
  let savedTheme = localStorage.getItem('orbit_theme') || 'cyan';
  if (!themes[savedTheme]) savedTheme = 'cyan';

  function applyTheme(themeKey) {
    const t = themes[themeKey];
    document.documentElement.style.setProperty('--neon-cyan', t.cyan);
    document.documentElement.style.setProperty('--neon-purple', t.purple);
    document.documentElement.style.setProperty('--border-neon', t.border);

    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.querySelector('span').textContent = `🎨 THEME: ${t.name}`;
      btn.style.color = t.cyan;
      btn.style.borderColor = t.border;
    }

    localStorage.setItem('orbit_theme', themeKey);
  }

  applyTheme(savedTheme);

  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentIdx = themeKeys.indexOf(localStorage.getItem('orbit_theme') || 'cyan');
      const nextKey = themeKeys[(currentIdx + 1) % themeKeys.length];
      applyTheme(nextKey);
      if (window.orbitSynthBeep) window.orbitSynthBeep(880, 0.05);
    });
  }
}

/* ─── CURSOR SPARK PARTICLE TRAIL ─── */
function initCursorParticleTrail() {
  // Mobile / touch devices skip to save performance
  if ('ontouchstart' in window || window.innerWidth < 768) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'cursor-trail-canvas';
  canvas.style.cssText = 'position:fixed; inset:0; pointer-events:none; z-index:9998; width:100vw; height:100vh;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  let mouse = { x: -100, y: -100 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Spawn 2 spark particles per movement
    for (let i = 0; i < 2; i++) {
      particles.push({
        x: mouse.x + (Math.random() - 0.5) * 8,
        y: mouse.y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.5,
        size: Math.random() * 2.5 + 1,
        life: 1,
        decay: Math.random() * 0.03 + 0.02,
        color: Math.random() > 0.4 ? '0, 240, 255' : '168, 85, 247'
      });
    }
  });

  function renderTrail() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.life * 0.7})`;
      ctx.shadowColor = `rgba(${p.color}, 0.8)`;
      ctx.shadowBlur = 6;
      ctx.fill();
    }

    requestAnimationFrame(renderTrail);
  }

  requestAnimationFrame(renderTrail);
}

/* ─── 3D CARD PARALLAX TILT ─── */
function init3DCardTilt() {
  const cards = document.querySelectorAll('.visual-card-item, .project-card, .personnel-card, .stat-card');

  cards.forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.style.perspective = '1000px';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (centerY - y) / 12;
      const rotateY = (x - centerX) / 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ─── FRAGMENT INSPECTOR MODAL ─── */
function initFragmentInspector() {
  const modal = document.getElementById('frag-modal');
  const closeBtn = document.getElementById('close-frag-modal');
  if (!modal) return;

  const t = (key, fallback) => (window.i18nEngine ? window.i18nEngine.t(key, fallback) : fallback);

  document.querySelectorAll('.frag-inspect-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const fragId = btn.getAttribute('data-frag');
      if (!fragId) return;

      if (window.orbitSynthBeep) window.orbitSynthBeep(600, 0.05);

      const titleEl = document.getElementById('frag-modal-title');
      const metaEl = document.getElementById('frag-modal-meta');
      const bodyEl = document.getElementById('frag-modal-body');
      const simLink = document.getElementById('frag-modal-sim-link');

      const title = t('frag_' + fragId + '_title', `FRAGMENT ${fragId}`);
      const body = t('frag_' + fragId + '_body', 'Transcript loading...');
      const simText = t('open_3d_sim', '[OPEN 3D SIMULATION]');

      if (titleEl) titleEl.textContent = title;
      if (metaEl) metaEl.textContent = `Fragment ID: ${fragId} · Substrate Archive`;
      if (bodyEl) bodyEl.textContent = body;
      if (simLink) {
        simLink.textContent = simText;
        if (fragId === '03') simLink.href = 'phenomena.html';
        else if (fragId === '07') simLink.href = 'impossibilia.html';
        else if (fragId === '14' || fragId === '11') simLink.href = 'containment-log.html';
        else if (fragId === '19' || fragId === '31') simLink.href = 'morphogenesis.html';
        else if (fragId === '22') simLink.href = 'github-universe.html';
      }

      modal.style.display = 'flex';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
    }
  });
}

/* ─── CERTIFICATES & LICENSES FILTERING & MODAL ENGINE ─── */
function initCertificates() {
  const filterBtns = document.querySelectorAll('.cert-filter-btn');
  const certCards = document.querySelectorAll('.cert-card');
  const modalOverlay = document.getElementById('cert-modal-overlay');
  const closeBtn = document.getElementById('close-cert-modal');

  if (filterBtns.length > 0 && certCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (window.orbitSynthBeep) window.orbitSynthBeep(640, 0.04);

        certCards.forEach(card => {
          const category = card.dataset.category;
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Global Cert Modal Opener
  window.openCertModal = function(id, title, issuer, date, desc, hash) {
    if (!modalOverlay) return;
    const titleEl = document.getElementById('modal-cert-title');
    const issuerEl = document.getElementById('modal-cert-issuer');
    const idEl = document.getElementById('modal-cert-id');
    const dateEl = document.getElementById('modal-cert-date');
    const descEl = document.getElementById('modal-cert-desc');
    const hashEl = document.getElementById('modal-cert-hash');

    if (titleEl) titleEl.textContent = title;
    if (issuerEl) issuerEl.textContent = issuer;
    if (idEl) idEl.textContent = id;
    if (dateEl) dateEl.textContent = date;
    if (descEl) descEl.textContent = desc;
    if (hashEl) hashEl.textContent = hash;

    modalOverlay.classList.add('active');
    if (window.orbitSynthBeep) window.orbitSynthBeep(880, 0.06);
  };

  if (closeBtn && modalOverlay) {
    closeBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      if (window.orbitSynthBeep) window.orbitSynthBeep(320, 0.03);
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
      }
    });
  }
}

/* ─── INTERACTIVE MOUSE-TRACKING CYBER EYES ─── */
function initCyberEyes() {
  const eyeLeft = document.getElementById('cyber-eye-left');
  const eyeRight = document.getElementById('cyber-eye-right');
  const pupilLeft = document.getElementById('cyber-pupil-left');
  const pupilRight = document.getElementById('cyber-pupil-right');

  if (!eyeLeft || !eyeRight || !pupilLeft || !pupilRight) return;

  function trackEye(eye, pupil, mouseX, mouseY) {
    const rect = eye.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
    const dist = Math.hypot(mouseX - eyeCenterX, mouseY - eyeCenterY);
    const maxOffset = 14;
    const offset = Math.min(dist * 0.1, maxOffset);

    const pupilX = Math.cos(angle) * offset;
    const pupilY = Math.sin(angle) * offset;

    pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
  }

  window.addEventListener('mousemove', (e) => {
    trackEye(eyeLeft, pupilLeft, e.clientX, e.clientY);
    trackEye(eyeRight, pupilRight, e.clientX, e.clientY);
  });
}
