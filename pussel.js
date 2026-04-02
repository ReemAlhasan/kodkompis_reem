(function () {
  const $ = (id) => document.getElementById(id);
  const els = {
    age: $('age'),
    load: $('loadPuzzle'),
    title: $('puzzle-title'),
    text: $('puzzle-text'),
    answer: $('puzzle-answer'),
    check: $('checkAnswer'),
    hint: $('showHint'),
    reveal: $('reveal'),
    feedback: $('puzzle-feedback')
  };

  if (!els.age || !els.load || !els.title || !els.text || !els.answer || !els.check || !els.hint || !els.reveal || !els.feedback) {
    return;
  }

  const localPools = {
    '6-8': [
      { title: 'Robotens bana', text: 'En robot går höger, höger, upp, upp från (0,0). Var hamnar den? Svara som (x,y).', answer: '(2,2)', hint: 'Höger ökar x och upp ökar y.' },
      { title: 'Fruktkod', text: '🍎 = 2 och 🍌 = 3. Vad blir 🍎 + 🍎 + 🍌?', answer: '7', hint: 'Räkna 2 + 2 + 3.' },
      { title: 'Mönsterjakt', text: '1, 2, 3, 1, 2, 3, 1, 2, __?', answer: '3', hint: 'Mönstret upprepas var tredje siffra.' }
    ],
    '9-12': [
      { title: 'Loop-poäng', text: 'En loop kör 5 varv och lägger till 2 poäng varje gång. Hur många poäng blir det totalt?', answer: '10', hint: '2 poäng fem gånger.' },
      { title: 'Binär nyfikenhet', text: 'Vilket tal är 1010 i binär form omvandlat till vanligt tal?', answer: '10', hint: '8 + 2.' },
      { title: 'Villkor i kod', text: 'Om x är jämnt skrivs "JA", annars "NEJ". Vad skrivs om x = 14?', answer: 'JA', hint: '14 går att dela med 2 utan rest.' }
    ],
    '13-16': [
      { title: 'Python-sträng', text: 'I Python: s = "katt". Vad blir s[1:3]?', answer: 'at', hint: 'Index 1 och 2 tas med.' },
      { title: 'Loop i loop', text: 'Du kör en loop över en lista och inuti den en till loop över samma lista. Vilken ordning får koden?', answer: 'O(n^2)', hint: 'Loop i loop ger kvadratisk tillväxt.' },
      { title: 'Sannolikhet', text: 'Ett rättvist mynt kastas två gånger. Vad är sannolikheten för exakt en krona?', answer: '0.5', hint: 'Två av fyra utfall fungerar.' }
    ]
  };

  let activePuzzle = null;

  function normalize(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(',', '.');
  }

  function daySeed() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  function pickPuzzle(group) {
    const pool = localPools[group] || localPools['9-12'];
    const seed = `${daySeed()}|${group}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return pool[hash % pool.length];
  }

  function setReadyState(ready) {
    els.answer.disabled = !ready;
    els.check.disabled = !ready;
    els.hint.disabled = !ready;
    els.reveal.disabled = !ready;
  }

  function renderPuzzle() {
    activePuzzle = pickPuzzle(els.age.value);
    els.title.textContent = activePuzzle.title;
    els.text.textContent = activePuzzle.text;
    els.answer.value = '';
    els.feedback.textContent = 'Utmaningen är laddad. Testa själv först och ta sedan en ledtråd om du vill.';
    setReadyState(true);
    els.answer.focus();
  }

  function checkAnswer() {
    if (!activePuzzle) return;
    const user = normalize(els.answer.value);
    if (!user) {
      els.feedback.textContent = 'Skriv ett svar först.';
      return;
    }

    const expected = normalize(activePuzzle.answer);
    const accepted = [expected];
    if (expected === '0.5') accepted.push('50%', '1/2');
    if (expected === '(2,2)') accepted.push('2,2');

    const correct = accepted.includes(user);
    els.feedback.textContent = correct
      ? 'Rätt! Bra jobbat ✅'
      : 'Inte riktigt ännu. Testa igen eller ta en ledtråd.';
  }

  function showHint() {
    if (!activePuzzle) return;
    els.feedback.textContent = `Ledtråd: ${activePuzzle.hint}`;
  }

  function revealAnswer() {
    if (!activePuzzle) return;
    els.feedback.textContent = `Facit: ${activePuzzle.answer}`;
  }

  els.load.addEventListener('click', renderPuzzle);
  els.age.addEventListener('change', renderPuzzle);
  els.check.addEventListener('click', checkAnswer);
  els.hint.addEventListener('click', showHint);
  els.reveal.addEventListener('click', revealAnswer);

  setReadyState(false);
  renderPuzzle();
})();
