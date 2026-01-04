const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === '.git') continue;
      walk(full, cb);
    } else {
      cb(full);
    }
  }
}

const used = new Set();

function extractFromFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.html', '.js', '.css'].includes(ext)) return;
  const txt = fs.readFileSync(file, 'utf8');
  const re1 = /data-i18n="([^"]+)"/g;
  const re2 = /data-i18n-aria="([^"]+)"/g;
  const re3 = /i18n\.t\(\s*['"]([^'"]+)['"]/g;
  const re4 = /window\.i18n\.t\(\s*['"]([^'"]+)['"]/g;

  let m;
  while ((m = re1.exec(txt))) used.add(m[1]);
  while ((m = re2.exec(txt))) used.add(m[1]);
  while ((m = re3.exec(txt))) used.add(m[1]);
  while ((m = re4.exec(txt))) used.add(m[1]);
}

walk(ROOT, extractFromFile);

// Read translations.js
const transPath = path.join(ROOT, 'translations.js');
if (!fs.existsSync(transPath)) {
  console.error('translations.js not found at', transPath);
  process.exit(2);
}
const ttxt = fs.readFileSync(transPath, 'utf8');

function extractKeysFor(lang) {
  const idx = ttxt.indexOf(`${lang}:`);
  if (idx === -1) return new Set();
  // find the opening brace after lang:
  const start = ttxt.indexOf('{', idx);
  if (start === -1) return new Set();
  let depth = 0;
  let end = -1;
  for (let i = start; i < ttxt.length; i++) {
    const ch = ttxt[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end === -1) return new Set();
  const blob = ttxt.slice(start+1, end);
  const keyRe = /([a-zA-Z0-9_]+)\s*:\s*(?:['"`])/g;
  const s = new Set();
  let m;
  while ((m = keyRe.exec(blob))) {
    s.add(m[1]);
  }
  return s;
}

const langs = ['sv','en','ar'];
const translations = {};
for (const l of langs) translations[l] = extractKeysFor(l);

console.log('Found', used.size, 'used i18n keys in project files.');
console.log('');

for (const l of langs) {
  const missing = [];
  for (const k of used) {
    if (!translations[l].has(k)) missing.push(k);
  }
  console.log(`Language ${l}: missing ${missing.length} keys`);
  if (missing.length) console.log('  ', missing.join(', '));
  console.log('');
}

// Also list unused keys in translations
for (const l of langs) {
  const unused = [];
  for (const k of translations[l]) {
    if (!used.has(k)) unused.push(k);
  }
  console.log(`Language ${l}: ${unused.length} translation keys not used in files (sample up to 20):`);
  if (unused.length) console.log('  ', unused.slice(0,20).join(', '));
  console.log('');
}

// Exit 0
process.exit(0);
