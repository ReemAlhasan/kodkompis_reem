(function () {
  const t = (key, params = {}) => {
    if (window.i18n && typeof window.i18n.t === 'function') return window.i18n.t(key, params);
    return key;
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const makeKey = (x, y) => `${x},${y}`;

  function renderStars(container, count = 0, max = 3) {
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < max; i++) {
      const star = document.createElement('span');
      star.className = 'lab-star' + (i < count ? ' is-on' : '');
      star.textContent = i < count ? '★' : '☆';
      container.appendChild(star);
    }
  }

  // -------- Programming Lab --------
  const codeBoardEl = document.getElementById('codeBoard');
  const codeSequenceEl = document.getElementById('codeSequence');
  const codeFeedbackEl = document.getElementById('codeLabFeedback');
  const codeGoalCounterEl = document.getElementById('codeGoalCounter');
  const codeMovesCounterEl = document.getElementById('codeMovesCounter');
  const codeStageValueEl = document.getElementById('codeStageValue');
  const codeSolvedValueEl = document.getElementById('codeSolvedValue');
  const codeSequenceCountEl = document.getElementById('codeSequenceCount');
  const codeChallengeTitleEl = document.getElementById('codeChallengeTitle');
  const codeChallengeHintEl = document.getElementById('codeChallengeHint');
  const codeStarsEl = document.getElementById('codeStars');
  const codeChallengeTabsEl = document.getElementById('codeChallengeTabs');
  const runBtn = document.getElementById('runCodeLab');
  const clearBtn = document.getElementById('clearCodeLab');
  const resetBtn = document.getElementById('resetCodeLab');
  const cmdButtons = Array.from(document.querySelectorAll('.cmd-btn'));

  const dirMap = {
    up: { x: 0, y: -1, icon: '↑' },
    down: { x: 0, y: 1, icon: '↓' },
    left: { x: -1, y: 0, icon: '←' },
    right: { x: 1, y: 0, icon: '→' }
  };

  const codeChallenges = [
    {
      id: 'spark-trail', titleKey: 'labCodeChallenge1', hintKey: 'labCodeHint1',
      width: 5, height: 5,
      start: { x: 0, y: 4 }, goal: { x: 4, y: 0 },
      blocks: ['1,4', '1,3', '3,3', '3,2', '2,1'], gems: ['2,4'], teleports: [], maxCommands: 8
    },
    {
      id: 'gem-run', titleKey: 'labCodeChallenge2', hintKey: 'labCodeHint2',
      width: 6, height: 5,
      start: { x: 0, y: 4 }, goal: { x: 5, y: 0 },
      blocks: ['1,4', '1,2', '2,2', '4,3', '4,2'], gems: ['2,4', '3,1'], teleports: [], maxCommands: 10
    },
    {
      id: 'teleport-loop', titleKey: 'labCodeChallenge3', hintKey: 'labCodeHint3',
      width: 6, height: 6,
      start: { x: 0, y: 5 }, goal: { x: 5, y: 0 },
      blocks: ['1,5', '1,4', '3,4', '3,3', '4,2'], gems: ['2,5', '2,1'], teleports: [['0,2', '5,3']], maxCommands: 12
    },
    {
      id: 'crystal-cave', titleKey: 'labCodeChallenge4', hintKey: 'labCodeHint4',
      width: 7, height: 6,
      start: { x: 0, y: 5 }, goal: { x: 6, y: 0 },
      blocks: ['1,5', '1,4', '2,4', '4,4', '4,3', '4,2', '2,2', '5,1'], gems: ['3,5', '6,3', '2,0'], teleports: [['0,1', '6,5']], maxCommands: 14
    }
  ];

  const codeState = {
    challengeIndex: 0,
    pos: { x: 0, y: 0 },
    sequence: [],
    running: false,
    collected: new Set(),
    completed: new Set(),
    bestStars: {}
  };

  function getCodeChallenge() { return codeChallenges[codeState.challengeIndex]; }
  function buildTeleportMap(challenge) {
    const map = new Map();
    (challenge.teleports || []).forEach(([a, b]) => {
      map.set(a, b); map.set(b, a);
    });
    return map;
  }

  function renderCodeTabs() {
    if (!codeChallengeTabsEl) return;
    codeChallengeTabsEl.innerHTML = '';
    codeChallenges.forEach((challenge, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lab-tab' + (index === codeState.challengeIndex ? ' is-active' : '') + (codeState.completed.has(challenge.id) ? ' is-complete' : '');
      const stars = codeState.bestStars[challenge.id] || 0;
      btn.innerHTML = `<span>${index + 1}. ${t(challenge.titleKey)}</span>${stars ? `<small>${'★'.repeat(stars)}</small>` : ''}`;
      btn.addEventListener('click', () => {
        codeState.challengeIndex = index;
        resetCodeLab(true);
      });
      codeChallengeTabsEl.appendChild(btn);
    });
  }

  function updateCodeMeta() {
    const challenge = getCodeChallenge();
    if (codeGoalCounterEl) codeGoalCounterEl.textContent = `${codeState.collected.size}/${challenge.gems.length}`;
    if (codeMovesCounterEl) codeMovesCounterEl.textContent = `${codeState.sequence.length}/${challenge.maxCommands}`;
    if (codeStageValueEl) codeStageValueEl.textContent = `${codeState.challengeIndex + 1}/${codeChallenges.length}`;
    if (codeSolvedValueEl) codeSolvedValueEl.textContent = `${codeState.completed.size}/${codeChallenges.length}`;
    if (codeSequenceCountEl) codeSequenceCountEl.textContent = `${codeState.sequence.length}`;
    if (codeChallengeTitleEl) codeChallengeTitleEl.textContent = t(challenge.titleKey);
    if (codeChallengeHintEl) codeChallengeHintEl.textContent = t(challenge.hintKey);
    renderStars(codeStarsEl, codeState.bestStars[challenge.id] || 0);
  }

  function renderCodeBoard() {
    if (!codeBoardEl) return;
    const challenge = getCodeChallenge();
    const teleportMap = buildTeleportMap(challenge);
    const blockSet = new Set(challenge.blocks);
    const gemSet = new Set(challenge.gems.filter((key) => !codeState.collected.has(key)));

    codeBoardEl.innerHTML = '';
    codeBoardEl.style.gridTemplateColumns = `repeat(${challenge.width}, minmax(0, 1fr))`;
    codeBoardEl.style.gridTemplateRows = `repeat(${challenge.height}, minmax(0, 1fr))`;

    for (let y = 0; y < challenge.height; y++) {
      for (let x = 0; x < challenge.width; x++) {
        const key = makeKey(x, y);
        const cell = document.createElement('div');
        cell.className = 'code-cell';
        if ((x + y) % 2 === 0) cell.classList.add('is-even');

        let content = '';
        if (blockSet.has(key)) {
          cell.classList.add('is-block');
          content = '<span>⬛</span>';
        } else if (challenge.goal.x === x && challenge.goal.y === y) {
          cell.classList.add('is-goal');
          content = '<span>🏁</span>';
        } else if (gemSet.has(key)) {
          cell.classList.add('is-gem');
          content = '<span>💎</span>';
        } else if (teleportMap.has(key)) {
          cell.classList.add('is-portal');
          content = '<span>🌀</span>';
        }

        if (codeState.pos.x === x && codeState.pos.y === y) {
          cell.classList.add('is-robot');
          content = '<span>🤖</span>' + content;
        }

        cell.innerHTML = content;
        codeBoardEl.appendChild(cell);
      }
    }
    updateCodeMeta();
  }

  function renderCodeSequence() {
    if (!codeSequenceEl) return;
    codeSequenceEl.innerHTML = '';
    if (!codeState.sequence.length) {
      const empty = document.createElement('div');
      empty.className = 'command-empty';
      empty.textContent = t('labCodeEmpty');
      codeSequenceEl.appendChild(empty);
      updateCodeMeta();
      return;
    }

    codeState.sequence.forEach((command, index) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'command-chip';
      chip.disabled = codeState.running;
      chip.innerHTML = `<span>${index + 1}.</span> ${dirMap[command].icon}`;
      chip.title = t('labCodeRemoveStep');
      chip.addEventListener('click', () => {
        if (codeState.running) return;
        codeState.sequence.splice(index, 1);
        renderCodeSequence();
        renderCodeBoard();
      });
      codeSequenceEl.appendChild(chip);
    });
    updateCodeMeta();
  }

  function setCodeFeedback(text, kind) {
    if (!codeFeedbackEl) return;
    codeFeedbackEl.className = 'feedback lab-feedback';
    if (kind) codeFeedbackEl.classList.add(`is-${kind}`);
    codeFeedbackEl.textContent = text;
  }

  function setCodeButtonsDisabled(disabled) {
    [...cmdButtons, runBtn, clearBtn, resetBtn].forEach((btn) => { if (btn) btn.disabled = disabled; });
  }

  function resetCodeLab(clearSequence = false) {
    const challenge = getCodeChallenge();
    codeState.pos = { ...challenge.start };
    codeState.running = false;
    codeState.collected = new Set();
    if (clearSequence) codeState.sequence = [];
    renderCodeTabs();
    renderCodeSequence();
    renderCodeBoard();
    setCodeButtonsDisabled(false);
    setCodeFeedback(`${t(challenge.titleKey)} · ${t(challenge.hintKey)}`, 'info');
  }

  function tryAddCommand(command) {
    const challenge = getCodeChallenge();
    if (codeState.running) return;
    if (codeState.sequence.length >= challenge.maxCommands) {
      setCodeFeedback(t('labCodeTooMany'), 'warn');
      return;
    }
    codeState.sequence.push(command);
    renderCodeSequence();
    setCodeFeedback(t('labCodeTry'), 'info');
  }

  function nextPosition(pos, command) {
    const delta = dirMap[command];
    return { x: pos.x + delta.x, y: pos.y + delta.y };
  }

  function isOutside(pos, challenge) {
    return pos.x < 0 || pos.x >= challenge.width || pos.y < 0 || pos.y >= challenge.height;
  }

  function calcStars(stepsUsed, maxCommands) {
    if (stepsUsed <= Math.ceil(maxCommands * 0.55)) return 3;
    if (stepsUsed <= Math.ceil(maxCommands * 0.8)) return 2;
    return 1;
  }

  async function runCodeLab() {
    const challenge = getCodeChallenge();
    const blockSet = new Set(challenge.blocks);
    const teleportMap = buildTeleportMap(challenge);
    if (codeState.running) return;
    if (!codeState.sequence.length) {
      setCodeFeedback(t('labCodeEmptyRun'), 'warn');
      return;
    }

    codeState.running = true;
    setCodeButtonsDisabled(true);
    setCodeFeedback(t('labCodeRunning'), 'info');
    let pos = { ...challenge.start };
    const collected = new Set();
    codeState.pos = { ...pos };
    codeState.collected = new Set(collected);
    renderCodeBoard();

    for (const command of codeState.sequence) {
      await sleep(260);

      if (!dirMap[command]) {
        setCodeFeedback(t('labCodeInvalidCommand') || 'Ogiltigt kommando', 'warn');
        codeState.running = false;
        setCodeButtonsDisabled(false);
        return;
      }

      let candidate = nextPosition(pos, command);
      if (isOutside(candidate, challenge)) {
        codeState.pos = { ...pos };
        renderCodeBoard();
        setCodeFeedback(t('labCodeOut'), 'error');
        codeState.running = false;
        setCodeButtonsDisabled(false);
        return;
      }
      const candidateKey = makeKey(candidate.x, candidate.y);
      if (blockSet.has(candidateKey)) {
        codeState.pos = { ...pos };
        renderCodeBoard();
        setCodeFeedback(t('labCodeBlocked'), 'error');
        codeState.running = false;
        setCodeButtonsDisabled(false);
        return;
      }

      pos = candidate;
      if (challenge.gems.includes(candidateKey)) collected.add(candidateKey);
      if (teleportMap.has(candidateKey)) {
        const [x, y] = teleportMap.get(candidateKey).split(',').map(Number);
        pos = { x, y };
      }
      codeState.pos = { ...pos };
      codeState.collected = new Set(collected);
      renderCodeBoard();

      if (pos.x === challenge.goal.x && pos.y === challenge.goal.y) {
        if (collected.size === challenge.gems.length) {
          const stars = calcStars(codeState.sequence.length, challenge.maxCommands);
          codeState.completed.add(challenge.id);
          codeState.bestStars[challenge.id] = Math.max(codeState.bestStars[challenge.id] || 0, stars);
          renderCodeTabs();
          renderStars(codeStarsEl, codeState.bestStars[challenge.id]);
          updateCodeMeta();
          setCodeFeedback(`${t('labCodeSuccess')} ${'★'.repeat(stars)}`, 'success');
        } else {
          setCodeFeedback(t('labCodeNeedGems', { count: challenge.gems.length }), 'warn');
        }
        codeState.running = false;
        setCodeButtonsDisabled(false);
        return;
      }
    }

    codeState.running = false;
    setCodeButtonsDisabled(false);
    setCodeFeedback(t('labCodeMiss'), 'warn');
  }

  cmdButtons.forEach((btn) => btn.addEventListener('click', () => tryAddCommand(btn.dataset.cmd)));
  if (runBtn) runBtn.addEventListener('click', runCodeLab);
  if (clearBtn) clearBtn.addEventListener('click', () => {
    codeState.sequence = [];
    renderCodeSequence();
    setCodeFeedback(t('labCodeReady'), 'info');
  });
  if (resetBtn) resetBtn.addEventListener('click', () => resetCodeLab(true));

  // -------- Math Lab --------
  const currentEl = document.getElementById('mathCurrentValue');
  const targetEl = document.getElementById('mathTargetValue');
  const movesEl = document.getElementById('mathMovesLeft');
  const historyEl = document.getElementById('mathHistory');
  const feedbackEl = document.getElementById('mathLabFeedback');
  const progressEl = document.getElementById('mathProgressBar');
  const resetMathBtn = document.getElementById('resetMathLab');
  const opButtonsWrap = document.querySelector('.math-ops-grid');
  const mathChallengeTabsEl = document.getElementById('mathChallengeTabs');
  const mathEquationDisplayEl = document.getElementById('mathEquationDisplay');
  const mathChallengeHintEl = document.getElementById('mathChallengeHint');
  const mathStageValueEl = document.getElementById('mathStageValue');
  const mathSolvedValueEl = document.getElementById('mathSolvedValue');
  const mathStarsEl = document.getElementById('mathStars');

  const operationLabels = {
    '+1': '+1', '+2': '+2', '-1': '−1', '*2': '×2', '+5': '+5', '-3': '−3', '*3': '×3', '/2': '÷2', '+10': '+10'
  };
  const operationFns = {
    '+1': (n) => n + 1,
    '+2': (n) => n + 2,
    '-1': (n) => n - 1,
    '*2': (n) => n * 2,
    '+5': (n) => n + 5,
    '-3': (n) => n - 3,
    '*3': (n) => n * 3,
    '/2': (n) => (n % 2 === 0 ? n / 2 : null),
    '+10': (n) => n + 10
  };

  const mathChallenges = [
    { id: 'spark', titleKey: 'labMathChallenge1', hintKey: 'labMathHint1', start: 0, target: 8, moves: 4, ops: ['+2', '*2', '-1'] },
    { id: 'bridge', titleKey: 'labMathChallenge2', hintKey: 'labMathHint2', start: 3, target: 18, moves: 4, ops: ['+1', '*2', '+5'] },
    { id: 'reactor', titleKey: 'labMathChallenge3', hintKey: 'labMathHint3', start: 24, target: 9, moves: 4, ops: ['/2', '-3', '+1'] },
    { id: 'orbit', titleKey: 'labMathChallenge4', hintKey: 'labMathHint4', start: 2, target: 31, moves: 5, ops: ['*3', '+5', '-1'] },
    { id: 'boss', titleKey: 'labMathChallenge5', hintKey: 'labMathHint5', start: 4, target: 42, moves: 5, ops: ['*2', '+10', '-1', '+2'] }
  ];

  const mathState = {
    challengeIndex: 0,
    current: 0,
    start: 0,
    target: 0,
    movesLeft: 0,
    history: [],
    locked: false,
    ops: [],
    expression: '0',
    completed: new Set(),
    bestStars: {}
  };

  function getMathChallenge() { return mathChallenges[mathState.challengeIndex]; }

  function renderMathTabs() {
    if (!mathChallengeTabsEl) return;
    mathChallengeTabsEl.innerHTML = '';
    mathChallenges.forEach((challenge, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lab-tab' + (index === mathState.challengeIndex ? ' is-active' : '') + (mathState.completed.has(challenge.id) ? ' is-complete' : '');
      const stars = mathState.bestStars[challenge.id] || 0;
      btn.innerHTML = `<span>${index + 1}. ${t(challenge.titleKey)}</span>${stars ? `<small>${'★'.repeat(stars)}</small>` : ''}`;
      btn.addEventListener('click', () => {
        mathState.challengeIndex = index;
        resetMathLab();
      });
      mathChallengeTabsEl.appendChild(btn);
    });
  }

  function renderMathOps() {
    if (!opButtonsWrap) return;
    opButtonsWrap.innerHTML = '';
    mathState.ops.forEach((op) => {
      const btn = document.createElement('button');
      btn.className = 'op-btn';
      btn.type = 'button';
      btn.dataset.op = op;
      btn.textContent = operationLabels[op] || op;
      btn.addEventListener('click', () => applyOperation(op));
      opButtonsWrap.appendChild(btn);
    });
  }

  function renderMathState() {
    const challenge = getMathChallenge();
    if (currentEl) currentEl.textContent = mathState.current;
    if (targetEl) targetEl.textContent = mathState.target;
    if (movesEl) movesEl.textContent = mathState.movesLeft;
    if (mathEquationDisplayEl) mathEquationDisplayEl.textContent = mathState.expression;
    if (mathChallengeHintEl) mathChallengeHintEl.textContent = t(challenge.hintKey);
    if (mathStageValueEl) mathStageValueEl.textContent = `${mathState.challengeIndex + 1}/${mathChallenges.length}`;
    if (mathSolvedValueEl) mathSolvedValueEl.textContent = `${mathState.completed.size}/${mathChallenges.length}`;
    if (historyEl) {
      historyEl.innerHTML = mathState.history.length
        ? mathState.history.map((item) => `<span class="math-chip">${item}</span>`).join('')
        : `<span class="math-chip math-chip--empty">${t('labMathHistoryEmpty')}</span>`;
    }
    if (progressEl) {
      const startDistance = Math.max(1, Math.abs(mathState.target - mathState.start));
      const currentDistance = Math.abs(mathState.target - mathState.current);
      const progress = Math.max(8, Math.min(100, 100 - (currentDistance / startDistance) * 100));
      progressEl.style.width = `${progress}%`;
    }
    renderStars(mathStarsEl, mathState.bestStars[challenge.id] || 0);
    renderMathTabs();
    renderMathOps();
  }

  function setMathFeedback(text, kind) {
    if (!feedbackEl) return;
    feedbackEl.className = 'feedback lab-feedback';
    if (kind) feedbackEl.classList.add(`is-${kind}`);
    feedbackEl.textContent = text;
  }

  function resetMathLab() {
    const challenge = getMathChallenge();
    mathState.start = challenge.start;
    mathState.current = challenge.start;
    mathState.target = challenge.target;
    mathState.movesLeft = challenge.moves;
    mathState.history = [];
    mathState.locked = false;
    mathState.ops = challenge.ops.slice();
    mathState.expression = `${challenge.start}`;
    renderMathState();
    setMathFeedback(`${t(challenge.titleKey)} · ${t(challenge.hintKey)}`, 'info');
  }

  function calcMathStars(movesLeft, totalMoves) {
    const used = totalMoves - movesLeft;
    if (used <= Math.ceil(totalMoves * 0.5)) return 3;
    if (used <= Math.ceil(totalMoves * 0.8)) return 2;
    return 1;
  }

  function finishMath(kind, message) {
    mathState.locked = true;
    setMathFeedback(message, kind);
    renderMathState();
  }

  function applyOperation(op) {
    if (mathState.locked || mathState.movesLeft <= 0) return;
    const fn = operationFns[op];
    const next = fn ? fn(mathState.current) : null;
    if (next === null || Number.isNaN(next)) {
      setMathFeedback(t('labMathInvalidMove'), 'warn');
      return;
    }

    mathState.current = next;
    mathState.movesLeft -= 1;
    mathState.history.push(operationLabels[op] || op);
    mathState.expression = `${mathState.expression} ${operationLabels[op] || op} = ${next}`;
    renderMathState();

    if (mathState.current === mathState.target) {
      const challenge = getMathChallenge();
      const stars = calcMathStars(mathState.movesLeft, challenge.moves);
      mathState.completed.add(challenge.id);
      mathState.bestStars[challenge.id] = Math.max(mathState.bestStars[challenge.id] || 0, stars);
      finishMath('success', `${t('labMathSuccess')} ${'★'.repeat(stars)}`);
      return;
    }
    if (mathState.movesLeft === 0) {
      finishMath('warn', t('labMathMiss'));
      return;
    }
    setMathFeedback(t('labMathKeepGoing'), 'info');
  }

  if (resetMathBtn) resetMathBtn.addEventListener('click', resetMathLab);

  if (codeBoardEl && codeSequenceEl) resetCodeLab(true);
  if (currentEl) resetMathLab();

  document.addEventListener('languageChanged', () => {
    if (codeBoardEl && codeSequenceEl) {
      renderCodeTabs();
      renderCodeSequence();
      renderCodeBoard();
      const challenge = getCodeChallenge();
      if (!codeState.running) setCodeFeedback(`${t(challenge.titleKey)} · ${t(challenge.hintKey)}`, 'info');
    }
    if (currentEl) {
      renderMathState();
      const challenge = getMathChallenge();
      if (!mathState.locked) setMathFeedback(`${t(challenge.titleKey)} · ${t(challenge.hintKey)}`, 'info');
    }
  });
})();
