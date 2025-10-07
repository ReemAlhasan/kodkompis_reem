/**
 * Dagens pussel – JSONP med serverdatum, åldersfilter, timeout och fallback
 * - Hämtar från Google Apps Script via JSONP (?callback=...) – ingen CORS behövs
 * - Om hämtning misslyckas används lokal fallback
 * - Deterministik baseras på SERVERNS dateKey (Europe/Stockholm) för stabilitet
 * - Stöder både answer_hash (SHA-256) och äldre klartext answer (bakåtkompatibelt)
 */
(function () {
  const $ = (id) => document.getElementById(id);

  // ---------- JSONP helper (med timeout & cache-buster) ----------
  function jsonp(url, params = {}, timeoutMs = 6000) {
    return new Promise((resolve, reject) => {
      const cb = `__jsonp_cb_${Math.random().toString(36).slice(2)}`;
      const q = new URLSearchParams({ ...params, callback: cb });
      const s = document.createElement('script');

      const timer = setTimeout(() => {
        cleanup();
        reject(new Error('JSONP timeout'));
      }, timeoutMs);

      function cleanup() {
        clearTimeout(timer);
        delete window[cb];
        s.remove();
      }

      window[cb] = (data) => { try { resolve(data); } finally { cleanup(); } };

      // cache-buster på dagsnivå minskar fel-cache
      const todayISO = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      s.src = url + (url.includes('?') ? '&' : '?') + q.toString() + `&_t=${todayISO}`;
      s.onerror = () => { cleanup(); reject(new Error('JSONP error')); };
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

  async function ensureRemote(group) {
    if (remote) return remote;
    const endpoint = (typeof window !== 'undefined' && window.PUZZLES_ENDPOINT) ? window.PUZZLES_ENDPOINT : null;
    if (!endpoint) return null;
    try {
      // Hämta gärna bara relevant ålder för snabbare laddning
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
      return null;
    } catch (e) {
      console.warn('JSONP misslyckades:', e);
      return null;
    }
  }

  function bankFor(group) {
    if (remote && Array.isArray(remote[group]) && remote[group].length) return remote[group];
    return localPools[group] || [];
  }

  // ---------- UI & interaktion ----------
  async function checkAnswerWithEither(p) {
    const userRaw = $('puzzle-answer').value;
    const userNorm = normalize(userRaw);

    if (p.answer_hash) {
      if (!crypto?.subtle) {
        $('puzzle-feedback').textContent = 'Din webbläsare saknar säker kontroll (Web Crypto). Prova senaste Chrome/Edge/Firefox/Safari.';
        return;
      }
      const userHash = await sha256HexBrowser(userNorm);
      const ok = userHash === String(p.answer_hash).toLowerCase();
      $('puzzle-feedback').textContent = ok ? '💫 Rätt! Grymt jobbat.' : 'Nästan! Testa igen eller ta en ledtråd.';
    } else if (p.answer) {
      const ok = userNorm === normalize(p.answer);
      $('puzzle-feedback').textContent = ok ? '💫 Rätt! Grymt jobbat.' : 'Nästan! Testa igen eller ta en ledtråd.';
    } else {
      $('puzzle-feedback').textContent = 'Ingen verifieringsdata tillgänglig.';
    }
  }

  function showHint(p) {
    $('puzzle-feedback').textContent = `Ledtråd: ${p.hint || '—'}`;
  }

  function revealAnswer(p) {
    if (p.answer) {
      $('puzzle-feedback').textContent = `Facit: ${p.answer}`;
    } else if (p.answer_hash) {
      $('puzzle-feedback').textContent = 'Facit är dolt (säker läge). Fråga din handledare! 🙈';
    } else {
      $('puzzle-feedback').textContent = '—';
    }
  }

  async function loadPuzzle() {
    const group = $('age').value;

    // Försök hämta serverdata (gruppfiltrerat). Misslyckas → fallback.
    await ensureRemote(group);

    const list = bankFor(group);
    if (!list.length) {
      $('puzzle-title').textContent = '—';
      $('puzzle-text').textContent = 'Inga aktiva pussel idag.';
      $('puzzle-answer').value = '';
      $('puzzle-feedback').textContent = '';
      return;
    }

    // Seed: använd serverns dateKey (stabil) → annars lokal (fallback)
    const seedDate = serverDateKey || todayKeyLocal();
    const idx = pickIndex(list.length, `${seedDate}|${group}`);
    const p = list[Math.min(Math.max(idx, 0), list.length - 1)];

    $('puzzle-title').textContent = p.title || 'Dagens pussel';
    $('puzzle-text').textContent = p.text || '';
    $('puzzle-answer').value = '';
    $('puzzle-feedback').textContent = '';

    $('checkAnswer').onclick = () => { void checkAnswerWithEither(p); };
    $('showHint').onclick = () => showHint(p);
    $('reveal').onclick = () => revealAnswer(p);
  }

  $('loadPuzzle').addEventListener('click', loadPuzzle);
})();
