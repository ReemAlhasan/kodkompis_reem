/**
 * Dagens pussel – JSONP med serverdatum, åldersfilter, timeout och fallback
 * - Hämtar från Google Apps Script via JSONP (?callback=...) – ingen CORS behövs
 * - Om hämtning misslyckas används lokal fallback
 * - Deterministik baseras på SERVERNS dateKey (Europe/Stockholm) för stabilitet
 * - Stöder både answer_hash (SHA-256) och äldre klartext answer (bakåtkompatibelt)
 */
(function () {
  const $ = (id) => {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`Element with id "${id}" not found`);
    }
    return el;
  };

  // ---------- JSONP helper (med timeout & cache-buster) ----------
  function jsonp(url, params = {}, timeoutMs = 6000) {
    return new Promise((resolve, reject) => {
      const cb = `__jsonp_cb_${Math.random().toString(36).slice(2)}`;
      const q = new URLSearchParams({ ...params, callback: cb });
      const s = document.createElement('script');

      // Loading progress updates
      let stage = 'connecting';
      const progressInterval = setInterval(() => {
        const messages = {
          'connecting': 'Ansluter till servern...',
          'loading': 'Laddar pusseldata...',
          'processing': 'Bearbetar innehåll...'
        };
        const feedbackEl = $('puzzle-feedback');
        if (feedbackEl && messages[stage]) {
          feedbackEl.textContent = messages[stage];
        }
        // Rotate through stages
        if (stage === 'connecting') stage = 'loading';
        else if (stage === 'loading') stage = 'processing';
      }, 1500);

      const timer = setTimeout(() => {
        cleanup();
        reject(new Error('JSONP timeout'));
      }, timeoutMs);

      function cleanup() {
        clearInterval(progressInterval);
        clearTimeout(timer);
        delete window[cb];
        s.remove();
      }

      window[cb] = (data) => { 
        try { 
          cleanup();
          resolve(data); 
        } catch (err) { 
          cleanup();
          reject(err);
        }
      };

      // cache-buster på dagsnivå minskar fel-cache
      const todayISO = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      s.src = url + (url.includes('?') ? '&' : '?') + q.toString() + `&_t=${todayISO}`;
      s.onerror = () => { 
        cleanup(); 
        reject(new Error('JSONP error')); 
      };
      document.head.appendChild(s);
    });
  }

  // ---------- Lokal fallbackbank (barnvänliga exempel) ----------
  const localPools = {
    '6-8': [
      { title: 'Robotens bana', text: 'En robot går: höger, höger, upp, upp. Var hamnar den från (0,0)? Svara som (x,y).', answer: '(2,2)', hint: 'Höger ökar x, upp ökar y.' },
      { title: 'Fruktkod', text: '🍎=2, 🍌=3. Vad blir 🍎+🍎+🍌?', answer: '7', hint: '2+2+3' },
      { title: 'Mönster', text: '1, 2, 3, 1, 2, 3, 1, 2, __?__', answer: '3', hint: 'Upprepar sig var tredje siffra.' }
    ],
    '9-12': [
      { title: 'Scratch-loop', text: 'En loop kör 5 varv och lägger på 2 poäng varje gång. Start 0. Slutpoäng?', answer: '10', hint: '2 × 5' },
      { title: 'Binär nyfikenhet', text: 'Vilket tal är binärt 1010 i decimal?', answer: '10', hint: '1·8 + 0·4 + 1·2 + 0·1' },
      { title: 'Villkor', text: 'Om x är jämn skriv "JA" annars "NEJ". Vad skrivs för x=14?', answer: 'JA', hint: '14 % 2 == 0' }
    ],
    '13-16': [
      { title: 'Strängrebus', text: 'I Python: s="katt". Vad blir s[1:3]?', answer: 'at', hint: 'Index 1–2 (3 exkluderas)' },
      { title: 'Komplexitet light', text: 'En lista med n element. En nästlad loop över listan två gånger. Ordning?', answer: 'O(n^2)', hint: 'Loop i loop → kvadratiskt' },
      { title: 'Logik', text: 'Sannolikhet: Ett rättvist mynt kastas två gånger. Sannolikheten för exakt en krona?', answer: '0.5', hint: 'KH eller HK: 2 av 4 utfall' }
    ]
  };

  // ---------- Hjälpare för deterministik & jämförelse ----------
  const pad2 = (n) => (n < 10 ? '0' + n : '' + n);

  function pickIndex(len, seed) {
    let h = 0 >>> 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return len ? (h % len) : 0;
  }

  function todayKeyLocal() {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    // används bara i fallback; annars tar vi serverns dateKey
  }

  function normalize(str) {
    return (str || '').toString().trim().toLowerCase().replace(/\s+/g, '');
  }

  async function sha256HexBrowser(str) {
    const enc = new TextEncoder();
    const buf = await crypto.subtle.digest('SHA-256', enc.encode(str));
    const arr = Array.from(new Uint8Array(buf));
    return arr.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ---------- Remote state ----------
  // Format: { version, dateKey:'YYYY-MM-DD', data: { '6-8': [ {title,text,answer_hash,hint}, ... ] } }
  let remote = null;      // kartan per ålder
  let serverDateKey = ''; // från servern (Europe/Stockholm)

  // ---------- UI State Management ----------
  function setLoadingState(loading) {
    const loadBtn = $('loadPuzzle');
    const answerInput = $('puzzle-answer');
    const checkBtn = $('checkAnswer');
    const hintBtn = $('showHint');
    const revealBtn = $('reveal');
    
    if (loading) {
      // Show loading state
      loadBtn.disabled = true;
      loadBtn.classList.add('loading');
      loadBtn.textContent = 'Laddar...';
      
      // Show loading message
      $('puzzle-title').textContent = 'Laddar pussel...';
      $('puzzle-text').textContent = 'Vänligen vänta medan dagens pussel hämtas.';
      
      // Disable interactive elements
      answerInput.disabled = true;
      checkBtn.disabled = true;
      hintBtn.disabled = true;
      revealBtn.disabled = true;
      $('puzzle-feedback').textContent = 'Ansluter till servern...';
    } else {
      // Hide loading state
      loadBtn.disabled = false;
      loadBtn.classList.remove('loading');
      loadBtn.textContent = 'Visa dagens pussel';
      
      // Re-enable interactive elements (but keep reveal disabled until puzzle loads)
      answerInput.disabled = false;
      checkBtn.disabled = false;
      hintBtn.disabled = false;
    }
  }

  function setErrorState(message) {
    setLoadingState(false);
    $('puzzle-title').textContent = 'Kunde inte ladda pussel';
    $('puzzle-text').textContent = message || 'Nätverksfel. Försök igen eller använd offline-läget.';
    $('puzzle-answer').value = '';
    $('puzzle-feedback').textContent = '';
    
    // Disable action buttons
    $('checkAnswer').disabled = true;
    $('showHint').disabled = true;
    $('reveal').disabled = true;
    $('puzzle-answer').disabled = true;
  }

  async function ensureRemote(group) {
    if (remote) return remote;
    
    const endpoint = (typeof window !== 'undefined' && window.PUZZLES_ENDPOINT) ? window.PUZZLES_ENDPOINT : null;
    if (!endpoint) {
      throw new Error('No endpoint configured');
    }
    
    try {
      const payload = await jsonp(endpoint, { age: group });
      
      if (payload && typeof payload === 'object') {
        if ('dateKey' in payload && 'data' in payload) {
          serverDateKey = String(payload.dateKey || '').trim();
          remote = payload.data;
        } else {
          serverDateKey = todayKeyLocal(); // bakåtkompatibel fallback
          remote = payload;
        }
        return remote;
      }
      throw new Error('Invalid server response');
    } catch (e) {
      console.warn('JSONP failed:', e);
      throw e; // Re-throw to handle in loadPuzzle
    }
  }

  function bankFor(group) {
    if (remote && remote[group] && Array.isArray(remote[group]) && remote[group].length) {
      return remote[group];
    }
    return localPools[group] || [];
  }

  // ---------- Enhanced loadPuzzle function ----------
  async function loadPuzzle() {
    const ageSelect = $('age');
    if (!ageSelect) {
      console.error('Age select element not found');
      return;
    }
    const group = ageSelect.value;
    
    // Show loading state immediately
    setLoadingState(true);

    try {
      // Försök hämta serverdata (gruppfiltrerat). Misslyckas → fallback.
      await ensureRemote(group);

      const list = bankFor(group);
      if (!list.length) {
        setErrorState('Inga pussel tillgängliga för den här åldersgruppen idag.');
        return;
      }

      // Seed: använd serverns dateKey (stabil) → annars lokal (fallback)
      const seedDate = serverDateKey || todayKeyLocal();
      const idx = pickIndex(list.length, `${seedDate}|${group}`);
      const p = list[Math.min(Math.max(idx, 0), list.length - 1)];

      // Update UI with puzzle content
      const puzzleTitle = $('puzzle-title');
      const puzzleText = $('puzzle-text');
      const puzzleAnswer = $('puzzle-answer');
      const puzzleFeedback = $('puzzle-feedback');
      
      if (puzzleTitle) puzzleTitle.textContent = p.title || 'Dagens pussel';
      if (puzzleText) puzzleText.textContent = p.text || '';
      if (puzzleAnswer) puzzleAnswer.value = '';
      if (puzzleFeedback) puzzleFeedback.textContent = '';

      // Enable all interactive elements
      setLoadingState(false);
      const checkBtn = $('checkAnswer');
      const hintBtn = $('showHint');
      const revealBtn = $('reveal');
      
      if (checkBtn) {
        checkBtn.disabled = false;
        checkBtn.onclick = () => { void checkAnswerWithEither(p); };
      }
      if (hintBtn) {
        hintBtn.disabled = false;
        hintBtn.onclick = () => showHint(p);
      }
      if (revealBtn) {
        revealBtn.disabled = false;
        revealBtn.onclick = () => revealAnswer(p);
      }
      if (puzzleAnswer) {
        puzzleAnswer.disabled = false;
        puzzleAnswer.focus();
      }

    } catch (error) {
      console.error('Puzzle loading error:', error);
      
      // Fallback: try to load from local pool
      try {
        const list = localPools[group] || [];
        if (list.length) {
          const seedDate = todayKeyLocal();
          const idx = pickIndex(list.length, `${seedDate}|${group}`);
          const p = list[Math.min(Math.max(idx, 0), list.length - 1)];
          
          const puzzleTitleOffline = $('puzzle-title');
          const puzzleTextOffline = $('puzzle-text');
          const puzzleAnswerOffline = $('puzzle-answer');
          const puzzleFeedbackOffline = $('puzzle-feedback');
          
          if (puzzleTitleOffline) puzzleTitleOffline.textContent = p.title || 'Dagens pussel (Offline)';
          if (puzzleTextOffline) puzzleTextOffline.textContent = p.text || '';
          if (puzzleAnswerOffline) puzzleAnswerOffline.value = '';
          
          setLoadingState(false);
          const checkBtnOffline = $('checkAnswer');
          const hintBtnOffline = $('showHint');
          const revealBtnOffline = $('reveal');
          
          if (checkBtnOffline) {
            checkBtnOffline.disabled = false;
            checkBtnOffline.onclick = () => { void checkAnswerWithEither(p); };
          }
          if (hintBtnOffline) {
            hintBtnOffline.disabled = false;
            hintBtnOffline.onclick = () => showHint(p);
          }
          if (revealBtnOffline) {
            revealBtnOffline.disabled = false;
            revealBtnOffline.onclick = () => revealAnswer(p);
          }
          if (puzzleAnswerOffline) {
            puzzleAnswerOffline.disabled = false;
          }
          if (puzzleFeedbackOffline) {
            puzzleFeedbackOffline.textContent = 'Använder offline-pussel.';
          }
        } else {
          setErrorState('Kunde inte ladda pussel från servern och inga offline-pussel finns.');
        }
      } catch (fallbackError) {
        setErrorState('Kunde inte ladda några pussel. Försök igen senare.');
      }
    }
  }

  // ---------- UI & interaktion ----------
  async function checkAnswerWithEither(p) {
    const answerInput = $('puzzle-answer');
    if (!answerInput) return;
    
    const userRaw = answerInput.value;
    const userNorm = normalize(userRaw);

    const feedbackEl = $('puzzle-feedback');
    if (!feedbackEl) return;
    
    if (p.answer_hash) {
      if (!crypto?.subtle) {
        feedbackEl.textContent = 'Din webbläsare saknar säker kontroll (Web Crypto). Prova senaste Chrome/Edge/Firefox/Safari.';
        return;
      }
      const userHash = await sha256HexBrowser(userNorm);
      const ok = userHash === String(p.answer_hash).toLowerCase();
      feedbackEl.textContent = ok ? '💫 Rätt! Grymt jobbat.' : 'Nästan! Testa igen eller ta en ledtråd.';
    } else if (p.answer) {
      const ok = userNorm === normalize(p.answer);
      feedbackEl.textContent = ok ? '💫 Rätt! Grymt jobbat.' : 'Nästan! Testa igen eller ta en ledtråd.';
    } else {
      feedbackEl.textContent = 'Ingen verifieringsdata tillgänglig.';
    }
  }

  function showHint(p) {
    const feedbackEl = $('puzzle-feedback');
    if (feedbackEl) {
      feedbackEl.textContent = `Ledtråd: ${p.hint || '—'}`;
    }
  }

  function revealAnswer(p) {
    const feedbackEl = $('puzzle-feedback');
    if (!feedbackEl) return;
    
    if (p.answer) {
      feedbackEl.textContent = `Facit: ${p.answer}`;
    } else if (p.answer_hash) {
      feedbackEl.textContent = 'Facit är dolt (säker läge). Fråga din handledare! 🙈';
    } else {
      feedbackEl.textContent = '—';
    }
  }

  // Initialize puzzle loader
  const loadPuzzleBtn = $('loadPuzzle');
  if (loadPuzzleBtn) {
    loadPuzzleBtn.addEventListener('click', loadPuzzle);
  }
})();
