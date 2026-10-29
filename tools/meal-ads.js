// プレ花のページ（repo 直下）にある宅配食・健康食品の広告を数える／外す
// node tools/meal-ads.js        → 数えるだけ
// node tools/meal-ads.js --fix  → 外す
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SCAN = require(path.join(ROOT, '../../Kurashi.noTanka/Kurashi.noTanka.ClaudeCode/new-site-kit/a8/sites/essential-beauty-needs.json'));
const MEAL = new Set(('s00000024360001 s00000021830001 s00000025169001 s00000025860001 s00000020861001 s00000024962001 s00000023213001 ' +
  's00000027451001 s00000023792001 s00000021041001 s00000013027001 s00000020891001 s00000022857001 s00000000488017 s00000023614001 ' +
  's00000027355001 s00000024360002 s00000008115002 s00000027306001 s00000023309003 s00000022700001 s00000026705002').split(' '));
const mat2pid = {};
for (const p of SCAN.pages) for (const pr of p.pairs) { const [m, id] = pr.split('='); mat2pid[m] = id; }
const mealMats = Object.keys(mat2pid).filter(m => MEAL.has(mat2pid[m]));
const fix = process.argv.includes('--fix');
const isMeal = s => mealMats.some(m => s.includes(m)) || [...MEAL].some(id => s.includes('mid=' + id));

// 対応する閉じタグまでの範囲
function blockEnd(h, start, tag) {
  const re = new RegExp(`<${tag}(?=[\\s>])|</${tag}>`, 'g'); re.lastIndex = start;
  let d = 0, m;
  while ((m = re.exec(h))) { d += m[0][1] === '/' ? -1 : 1; if (d === 0) return m.index + m[0].length; }
  return -1;
}
function enclosing(h, pos, tag, cls) {
  let i = pos;
  while ((i = h.lastIndexOf(`<${tag}`, i - 1)) >= 0) {
    const open = h.slice(i, h.indexOf('>', i) + 1);
    const end = blockEnd(h, i, tag);
    if (end > pos && (!cls || new RegExp(`class="(?:[^"]* )?${cls}(?: [^"]*)?"`).test(open))) return [i, end];
    if (i === 0) break;
  }
  return null;
}
let total = 0, pages = 0;
for (const f of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  let h = fs.readFileSync(path.join(ROOT, f), 'utf8');
  let n = 0;
  for (let guard = 0; guard < 50; guard++) {
    const m = h.match(/<a\b[^>]*href="[^"]*a8mat=[^"]*"[^>]*>|<img\b[^>]*a8\.net[^>]*>/g)?.find(isMeal);
    if (!m) break;
    n++;
    if (!fix) { h = h.replace(m, ''); continue; }
    const pos = h.indexOf(m);
    const card = enclosing(h, pos, 'div', 'card');
    if (card) { h = h.slice(0, card[0]) + h.slice(card[1]); continue; }
    if (m.startsWith('<a')) {
      const end = h.indexOf('</a>', pos) + 4;
      h = h.slice(0, pos) + h.slice(end);
    } else h = h.replace(m, '');
  }
  if (n) {
    pages++; total += n;
    if (fix) {
      // 広告だけの節（.trial が空になった節）は、見出しごと外して目次からも消す
      const ids = [];
      for (let g = 0; g < 20; g++) {
        const e = h.search(/<div class="trial">\s*<\/div>/);
        if (e < 0) break;
        const sec = enclosing(h, e, 'section');
        if (!sec) { h = h.replace(/<div class="trial">\s*<\/div>/, ''); continue; }
        const id = (h.slice(sec[0], sec[1]).match(/<h2[^>]*id="([^"]+)"/) || [])[1];
        if (id) ids.push(id);
        h = h.slice(0, sec[0]) + h.slice(sec[1]);
      }
      for (const id of ids) h = h.replace(new RegExp(`\\s*<li><a href="#${id}"[^>]*>[^<]*</a></li>`), '');
      if (ids.length) console.log('  removed sections:', ids.join(' '));
      fs.writeFileSync(path.join(ROOT, f), h);
    }
    console.log(f, n);
  }
}
console.log(fix ? 'removed' : 'found', total, 'meal ad links/images on', pages, 'pages');
