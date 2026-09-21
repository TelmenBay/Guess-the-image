/* =====================================================================
   Guess the Image — The Duel
   Game logic. You do NOT need to edit this file to add images:
   put the file in images/<category>/ and add a line to images.js.
   ===================================================================== */
(() => {
  'use strict';

  // ---------- Tunables ----------
  const REVEAL_MS       = 1500;  // how long the correct answer stays on screen before switching
  const PASS_MS         = 900;   // how long the PASS card shows; the player's clock keeps running throughout
  const INTRO_COUNT     = 3;     // 3-2-1 countdown before Player 1's first turn
  const INTRO_STEP_MS   = 800;
  const GO_MS           = 450;   // how long "GO!" stays up before the timer starts
  const TIMES_UP_MS     = 1700;  // "TIME'S UP" flash before the results screen
  const RESULTS_LOCK_MS = 1200;  // ignore Space on the results screen for this long (avoids accidental rematch)
  const WARN_AT_S       = 15;    // timer turns amber at/below this
  const DANGER_AT_S     = 10;    // timer turns red and pulses at/below this
  const TICK_FROM_S     = 5;     // audible tick for each of the last N seconds
  const ALL_CATEGORIES  = 'All Categories';
  const TIME_OPTIONS    = [30, 45, 60];

  // ---------- Image data ----------
  const titleCase = s => s.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, c => c.toUpperCase());

  // Accepts { src, answer, category }. If answer/category are missing they are
  // derived from the file name / folder name so a bare { src } also works.
  function normalizeData(raw) {
    const out = [];
    for (const item of Array.isArray(raw) ? raw : []) {
      const src = typeof item === 'string' ? item : item && item.src;
      if (!src) continue;
      const parts = src.split('/').filter(Boolean);
      const file = parts[parts.length - 1] || '';
      const folder = parts.length >= 2 ? parts[parts.length - 2] : 'Misc';
      const answer = (item.answer || titleCase(file.replace(/\.[^.]+$/, ''))).trim();
      const category = (item.category || titleCase(folder)).trim();
      if (answer) out.push({ src, answer, category });
    }
    return out;
  }

  // images.js declares IMAGE_DATA with const, so read the binding directly (it is not on window).
  const DATA = normalizeData(typeof IMAGE_DATA !== 'undefined' ? IMAGE_DATA : window.IMAGE_DATA);
  const CATEGORIES = [...new Set(DATA.map(d => d.category))].sort((a, b) => a.localeCompare(b));
  if (CATEGORIES.length > 1) CATEGORIES.push(ALL_CATEGORIES);

  const poolFor = cat => DATA.filter(d => cat === ALL_CATEGORIES || d.category === cat);

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ---------- DOM ----------
  const $ = id => document.getElementById(id);
  const els = {
    screens: [...document.querySelectorAll('.screen')],
    // setup
    form: $('setup-form'), name1: $('name1'), name2: $('name2'),
    timeOptions: $('time-options'), slider: $('category-slider'),
    categoryName: $('category-name'), categoryCount: $('category-count'), ticks: $('category-ticks'),
    soundToggle: $('sound-toggle'), fullscreenBtn: $('fullscreen-btn'),
    startBtn: $('start-btn'), setupError: $('setup-error'),
    // game
    gameCategory: $('game-category'), imagesLeft: $('images-left'),
    turnName: $('turn-name'), bigTimer: $('big-timer'),
    image: $('game-image'), reveal: $('reveal'), revealCheck: $('reveal-check'), revealAnswer: $('reveal-answer'),
    revealNextLabel: $('reveal-next-label'), revealNext: $('reveal-next-name'),
    statusCard: [$('card-1'), $('card-2')],
    statusName: [$('status-name-1'), $('status-name-2')],
    statusTime: [$('status-time-1'), $('status-time-2')],
    // overlays
    intro: $('intro'), introName: $('intro-name'), introCount: $('intro-count'),
    timesUp: $('timesup'), timesUpName: $('timesup-name'),
    confetti: $('confetti'),
    // results
    resultEyebrow: $('result-eyebrow'), resultName: $('result-name'), resultSub: $('result-sub'),
    resultCard: [$('result-card-1'), $('result-card-2')],
    resultCardName: [$('result-name-1'), $('result-name-2')],
    resultCardTime: [$('result-time-1'), $('result-time-2')],
    rematchBtn: $('rematch-btn'), setupBtn: $('setup-btn'),
  };

  // ---------- State ----------
  const state = {
    phase: 'setup',            // setup | intro | playing | pass | reveal | switching | ending | results
    settings: { name1: '', name2: '', time: 45, category: '', sound: true },
    players: [],               // [{ name, remainingMs }, { name, remainingMs }]
    active: 0,                 // index of the player whose clock is running
    turnStartedAt: 0,          // performance.now() when the active clock last started
    pool: [],                  // shuffled images not yet shown this game
    current: null,             // image currently on screen
    winner: null,              // 0 | 1 | null (draw)
    endReason: '',             // 'timeout' | 'exhausted'
    resultsUnlocked: false,
  };
  let rafId = null;
  let deadlineId = null;       // setTimeout that ends the turn even if rAF is throttled (hidden tab)
  let lastTickSec = null;
  const pending = new Set();   // timeouts that must die when the game is abandoned

  const later = (fn, ms) => {
    const id = setTimeout(() => { pending.delete(id); fn(); }, ms);
    pending.add(id);
    return id;
  };
  const clearPending = () => { pending.forEach(clearTimeout); pending.clear(); };

  // ---------- Sound (synthesised, no files needed) ----------
  const sound = (() => {
    let ctx = null;
    const get = () => {
      if (!state.settings.sound) return null;
      try {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
      } catch { return null; }
    };
    const tone = (freq, dur, type = 'sine', gain = 0.2, delay = 0) => {
      const c = get(); if (!c) return;
      const t = c.currentTime + delay;
      const osc = c.createOscillator(); const g = c.createGain();
      osc.type = type; osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g).connect(c.destination);
      osc.start(t); osc.stop(t + dur + 0.05);
    };
    return {
      unlock: get,
      countdown: () => tone(620, 0.12, 'sine', 0.18),
      go:        () => { tone(880, 0.16, 'sine', 0.22); tone(1320, 0.35, 'sine', 0.18, 0.1); },
      ding:      () => { tone(988, 0.12, 'sine', 0.22); tone(1480, 0.3, 'sine', 0.18, 0.09); },
      tick:      () => tone(1100, 0.05, 'square', 0.06),
      pass:      () => { tone(330, 0.14, 'triangle', 0.18); tone(220, 0.22, 'triangle', 0.16, 0.1); },
      buzzer:    () => { tone(110, 0.7, 'sawtooth', 0.28); tone(82, 0.7, 'sawtooth', 0.28); },
      win:       () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.35, 'triangle', 0.2, i * 0.12)),
    };
  })();

  // ---------- Helpers ----------
  const showScreen = id => {
    els.screens.forEach(s => s.classList.toggle('active', s.id === id));
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  };

  // Countdown-clock formatting: whole seconds (rounded up) until 10s, then tenths.
  function fmtTime(ms) {
    ms = Math.max(0, ms);
    if (ms > 10000) return String(Math.ceil(ms / 1000));
    return (Math.floor(ms / 100) / 10).toFixed(1);
  }
  const fmtFinal = ms => (Math.max(0, ms) / 1000).toFixed(1);   // unit is added in CSS
  const urgencyOf = ms => ms <= DANGER_AT_S * 1000 ? 'danger' : ms <= WARN_AT_S * 1000 ? 'warn' : '';

  const retrigger = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

  const playerColor = i => i === 0 ? 'var(--p1)' : 'var(--p2)';

  // ---------- Settings persistence (nice-to-have; failures are ignored) ----------
  const STORAGE_KEY = 'guess-the-image-duel';
  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (saved.name1) els.name1.value = saved.name1;
      if (saved.name2) els.name2.value = saved.name2;
      if (TIME_OPTIONS.includes(saved.time)) selectTime(saved.time);
      if (typeof saved.sound === 'boolean') els.soundToggle.checked = saved.sound;
      const idx = CATEGORIES.indexOf(saved.category);
      if (idx >= 0) els.slider.value = idx;
    } catch { /* ignore */ }
  }
  function saveSettings() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.settings)); } catch { /* ignore */ }
  }

  // ---------- Setup screen ----------
  function selectTime(t) {
    [...els.timeOptions.children].forEach(b => b.classList.toggle('selected', Number(b.dataset.time) === t));
  }
  const selectedTime = () => Number(els.timeOptions.querySelector('.selected').dataset.time);

  function buildCategorySlider() {
    els.slider.max = Math.max(0, CATEGORIES.length - 1);
    els.ticks.innerHTML = '';
    CATEGORIES.forEach((_, i) => {
      const t = document.createElement('span');
      t.title = CATEGORIES[i];
      t.addEventListener('click', () => { els.slider.value = i; renderCategory(); });
      els.ticks.appendChild(t);
    });
  }

  function renderCategory() {
    const cat = CATEGORIES[Number(els.slider.value)];
    const n = cat ? poolFor(cat).length : 0;
    els.categoryName.textContent = cat || 'No images found';
    els.categoryCount.textContent = cat ? `${n} image${n === 1 ? '' : 's'}` : 'add some to images.js';
    els.categoryCount.classList.toggle('empty', n === 0);
    [...els.ticks.children].forEach((t, i) => t.classList.toggle('on', i === Number(els.slider.value)));
    els.startBtn.disabled = n === 0;
    els.setupError.classList.remove('show');
  }

  els.slider.addEventListener('input', renderCategory);
  els.timeOptions.addEventListener('click', e => {
    const b = e.target.closest('button[data-time]');
    if (b) selectTime(Number(b.dataset.time));
  });
  els.fullscreenBtn.addEventListener('click', toggleFullscreen);
  function toggleFullscreen() {
    const doc = document;
    if (doc.fullscreenElement) doc.exitFullscreen && doc.exitFullscreen();
    else doc.documentElement.requestFullscreen && doc.documentElement.requestFullscreen().catch(() => {});
  }

  els.form.addEventListener('submit', e => {
    e.preventDefault();
    state.settings = {
      name1: els.name1.value.trim() || 'Player 1',
      name2: els.name2.value.trim() || 'Player 2',
      time: selectedTime(),
      category: CATEGORIES[Number(els.slider.value)],
      sound: els.soundToggle.checked,
    };
    saveSettings();
    sound.unlock(); // first user gesture unlocks audio
    startGame();
  });

  // ---------- Game flow ----------
  function startGame() {
    const s = state.settings;
    const pool = shuffle(poolFor(s.category));
    if (pool.length === 0) {
      els.setupError.textContent = 'That category has no images yet.';
      els.setupError.classList.add('show');
      showScreen('screen-setup');
      return;
    }
    clearPending();
    cancelAnimationFrame(rafId); rafId = null;
    clearConfetti();

    state.players = [
      { name: s.name1, remainingMs: s.time * 1000 },
      { name: s.name2, remainingMs: s.time * 1000 },
    ];
    state.active = 0;
    state.pool = pool;
    state.current = null;
    state.winner = null;
    state.endReason = '';

    // Warm the browser cache so every image appears instantly when it's needed.
    pool.forEach(item => { const img = new Image(); img.src = item.src; });

    els.gameCategory.textContent = s.category;
    els.statusName[0].textContent = s.name1;
    els.statusName[1].textContent = s.name2;
    hideReveal();
    els.timesUp.classList.remove('show');
    document.body.dataset.urgency = '';
    renderActive();
    renderTimers();
    nextImage();                       // loaded behind the opaque intro overlay
    showScreen('screen-game');
    runIntro(() => startTurn());
  }

  function runIntro(done) {
    state.phase = 'intro';
    els.introName.textContent = state.players[0].name;
    els.intro.classList.add('show');
    let n = INTRO_COUNT;
    const step = () => {
      if (state.phase !== 'intro') return;
      if (n === 0) {
        els.introCount.textContent = 'GO!';
        retrigger(els.introCount, 'tick');
        sound.go();
        later(() => { els.intro.classList.remove('show'); done(); }, GO_MS);
        return;
      }
      els.introCount.textContent = String(n);
      retrigger(els.introCount, 'tick');
      sound.countdown();
      n--;
      later(step, INTRO_STEP_MS);
    };
    step();
  }

  function nextImage() {
    if (state.pool.length === 0) return false;
    state.current = state.pool.pop();
    els.image.src = state.current.src;
    els.image.alt = '';                // never leak the answer
    retrigger(els.image, 'swap');
    els.imagesLeft.textContent = String(state.pool.length);
    return true;
  }

  function startTurn() {
    state.phase = 'playing';
    state.turnStartedAt = performance.now();
    lastTickSec = null;
    renderActive();
    renderTimers();
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
    armDeadline();
  }

  const activeRemaining = () => state.players[state.active].remainingMs - (performance.now() - state.turnStartedAt);
  const CLOCK_RUNNING = new Set(['playing', 'pass']);   // phases during which the active clock ticks down

  // The rAF loop below drives the display, but rAF pauses in a hidden tab.
  // A plain timeout guarantees the clock still hits zero on time.
  function armDeadline() {
    disarmDeadline();
    deadlineId = later(checkTimeout, Math.max(0, activeRemaining()) + 20);
  }
  function disarmDeadline() {
    if (deadlineId != null) { clearTimeout(deadlineId); pending.delete(deadlineId); deadlineId = null; }
  }
  function checkTimeout() {
    deadlineId = null;
    if (!CLOCK_RUNNING.has(state.phase)) return false;
    const remaining = activeRemaining();
    if (remaining > 0) { armDeadline(); return false; }   // fired a hair early; re-arm
    state.players[state.active].remainingMs = 0;
    renderTimers();
    endGame('timeout');
    return true;
  }

  function tick() {
    if (!CLOCK_RUNNING.has(state.phase)) { rafId = null; return; }
    const remaining = activeRemaining();
    if (remaining <= 0) { rafId = null; checkTimeout(); return; }
    renderTimers(remaining);
    const sec = Math.ceil(remaining / 1000);
    if (sec <= TICK_FROM_S && sec !== lastTickSec) { lastTickSec = sec; sound.tick(); }
    rafId = requestAnimationFrame(tick);
  }

  // Space pressed: the active player answered correctly.
  function markCorrect() {
    if (state.phase !== 'playing') return;
    if (checkTimeout()) return;             // clock already at zero: that's a loss, not a point
    const p = state.players[state.active];

    // 1. Freeze this player's clock.
    p.remainingMs = activeRemaining();
    state.phase = 'reveal';
    cancelAnimationFrame(rafId); rafId = null;
    disarmDeadline();
    renderTimers();
    sound.ding();

    // 2. Show the answer.
    const opponent = 1 - state.active;
    showCard('correct', '✓ Correct', state.current.answer, 'Next up:', opponent);

    // 3–5. After the reveal: switch player, show next image, start their clock.
    later(() => {
      if (state.phase !== 'reveal') return;
      state.phase = 'switching';
      hideReveal();
      state.active = opponent;
      if (!nextImage()) { endGame('exhausted'); return; }
      // Start the clock once the new image is actually painted so nobody loses time to decoding.
      const go = () => { if (state.phase === 'switching') startTurn(); };
      if (els.image.decode) els.image.decode().then(go, go); else go();
    }, REVEAL_MS);
  }

  function showCard(kind, check, answer, nextLabel, nextPlayer) {
    els.reveal.dataset.kind = kind;
    els.revealCheck.textContent = check;
    els.revealAnswer.textContent = answer;
    els.revealNextLabel.textContent = nextLabel;
    els.revealNext.textContent = state.players[nextPlayer].name;
    els.reveal.style.setProperty('--next-color', playerColor(nextPlayer));
    els.reveal.classList.add('show');
  }
  function hideReveal() { els.reveal.classList.remove('show'); }

  // P pressed: skip this image. Same player, next image, and the clock never stops.
  function passImage() {
    if (state.phase !== 'playing') return;
    if (checkTimeout()) return;
    if (state.pool.length === 0) return;   // nothing left to swap to
    state.phase = 'pass';                  // Space/P blocked; rAF + deadline keep the clock running
    sound.pass();
    showCard('pass', '✕ Pass', state.current.answer, 'Still your turn,', state.active);
    later(() => {
      if (state.phase !== 'pass') return;
      hideReveal();
      nextImage();
      const go = () => { if (state.phase === 'pass') state.phase = 'playing'; };
      if (els.image.decode) els.image.decode().then(go, go); else go();
    }, PASS_MS);
  }

  function endGame(reason) {
    cancelAnimationFrame(rafId); rafId = null;
    disarmDeadline();
    clearPending();
    hideReveal();
    state.phase = 'ending';
    state.endReason = reason;

    const [a, b] = state.players;
    if (reason === 'timeout') state.winner = 1 - state.active;
    else state.winner = a.remainingMs === b.remainingMs ? null : (a.remainingMs > b.remainingMs ? 0 : 1);

    if (reason === 'timeout') {
      sound.buzzer();
      els.timesUpName.textContent = state.players[state.active].name;
      els.timesUp.classList.add('show');
      later(showResults, TIMES_UP_MS);
    } else {
      showResults();
    }
  }

  function showResults() {
    state.phase = 'results';
    state.resultsUnlocked = false;
    document.body.dataset.urgency = '';
    els.timesUp.classList.remove('show');

    const { players, winner, endReason } = state;
    const loser = winner == null ? null : 1 - winner;

    if (winner == null) {
      els.resultEyebrow.textContent = 'Draw';
      els.resultName.textContent = 'Dead heat!';
      els.resultName.style.setProperty('--winner', 'var(--gold)');
    } else {
      els.resultEyebrow.textContent = 'Winner';
      els.resultName.textContent = players[winner].name;
      els.resultName.style.setProperty('--winner', playerColor(winner));
    }
    els.resultSub.textContent = endReason === 'timeout'
      ? `${players[loser].name} ran out of time`
      : 'Every image was used — most time remaining wins';

    players.forEach((p, i) => {
      els.resultCardName[i].textContent = p.name;
      els.resultCardTime[i].textContent = fmtFinal(p.remainingMs);
      els.resultCard[i].classList.toggle('winner', winner === i);
      els.resultCard[i].classList.toggle('loser', winner != null && winner !== i);
    });

    showScreen('screen-results');
    if (winner != null) { sound.win(); launchConfetti(winner); }
    later(() => { state.resultsUnlocked = true; }, RESULTS_LOCK_MS);
  }

  function rematch() {
    if (state.phase !== 'results') return;
    startGame();
  }

  function goToSetup() {
    disarmDeadline();
    clearPending();
    cancelAnimationFrame(rafId); rafId = null;
    clearConfetti();
    hideReveal();
    els.intro.classList.remove('show');
    els.timesUp.classList.remove('show');
    document.body.dataset.urgency = '';
    document.body.dataset.active = '1';
    state.phase = 'setup';
    showScreen('screen-setup');
    renderCategory();
    els.name1.focus();
  }

  // ---------- Rendering ----------
  function renderActive() {
    const i = state.active;
    document.body.dataset.active = String(i + 1);
    els.turnName.textContent = state.players[i].name;
    els.statusCard.forEach((c, j) => c.classList.toggle('active', j === i));
  }

  function renderTimers(liveMs) {
    state.players.forEach((p, i) => {
      const ms = (i === state.active && liveMs != null) ? liveMs : p.remainingMs;
      const text = fmtTime(ms);
      const urgency = urgencyOf(ms);
      if (els.statusTime[i].textContent !== text) els.statusTime[i].textContent = text;
      if (els.statusCard[i].dataset.urgency !== urgency) els.statusCard[i].dataset.urgency = urgency;
      if (i === state.active) {
        if (els.bigTimer.textContent !== text) els.bigTimer.textContent = text;
        if (document.body.dataset.urgency !== urgency) document.body.dataset.urgency = urgency;
      }
    });
  }

  function launchConfetti(winner) {
    clearConfetti();
    const colors = [winner === 0 ? '#3ee0ff' : '#ff8a3d', '#ffd166', '#ffffff', '#4ade80'];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 90; i++) {
      const piece = document.createElement('i');
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = colors[i % colors.length];
      piece.style.animationDuration = 2.6 + Math.random() * 2.4 + 's';
      piece.style.animationDelay = Math.random() * 1.5 + 's';
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      piece.style.width = 6 + Math.random() * 8 + 'px';
      piece.style.height = 10 + Math.random() * 10 + 'px';
      frag.appendChild(piece);
    }
    els.confetti.appendChild(frag);
  }
  function clearConfetti() { els.confetti.innerHTML = ''; }

  // ---------- Global keys ----------
  document.addEventListener('keydown', e => {
    const isSpace = e.code === 'Space' || e.key === ' ';
    if (isSpace) {
      if (state.phase === 'setup') return;      // let people type spaces in their names
      e.preventDefault();                       // no page scroll, no focused-button clicks
      if (e.repeat) return;
      if (state.phase === 'playing') markCorrect();
      else if (state.phase === 'results' && state.resultsUnlocked) rematch();
      // intro / pass / reveal / switching / ending: deliberately ignored
      return;
    }
    if ((e.key === 'p' || e.key === 'P') && state.phase === 'playing') {
      e.preventDefault();
      if (!e.repeat) passImage();
      return;
    }
    if (e.key === 'Escape') {
      if (state.phase !== 'setup') { e.preventDefault(); goToSetup(); }
      return;
    }
    if ((e.key === 'f' || e.key === 'F') && state.phase !== 'setup') {
      toggleFullscreen();
    }
  });

  els.rematchBtn.addEventListener('click', rematch);
  els.setupBtn.addEventListener('click', goToSetup);

  // ---------- Boot ----------
  buildCategorySlider();
  loadSettings();
  renderCategory();
  els.name1.focus();
})();
