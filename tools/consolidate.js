// 似たページをまとめる（転送）・健康の話が中心のページを検索から外す（noindex）
// node tools/consolidate.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SITE = 'https://essential-beauty-needs.com/';

// 同じ検索語を取り合うページ → 残すページ
const MERGE = {
  'dress-arm-slim': 'prehana-arm', 'arm-3months': 'prehana-arm', 'thick-arms': 'prehana-arm', 'arm-type-check': 'prehana-arm',
  'shoulder-line': 'prehana-rounded-shoulders',
  'water-intake': 'prehana-mukumi', 'bloating': 'prehana-mukumi', 'standing-job-legs': 'prehana-mukumi',
  'sonoko-diet': 'diet-timing', 'diet-restart': 'diet-timing', 'before-losing-weight': 'diet-timing',
  'esthe-difference': 'bridal-esthe', 'bridal-gym-free-trial-guide': 'trial-collection',
  'arisan-gym': 'personal-gym', 'gym-with-diet-coaching': 'personal-gym',
  'whitening-count': 'whitening',
  'acne-care': 'back-acne-urgent',
  // 健康の判断が中心のページ（資格なしでは書けない）は内容ごと閉じて近いページへ
  'diet-beauty': 'diet-timing', 'protein-guide': 'diet-timing', 'skip-breakfast': 'diet-timing', 'snacking': 'diet-timing',
  'smoothie-recipes': 'lifestyle-skincare', 'organic-science': 'lifestyle-skincare', 'sleep': 'lifestyle-skincare',
  'period-overlap': 'checklist', 'postpartum-wedding': 'checklist', 'online-clinic': 'trial-collection',
};
// 健康・医療の判断が中心で、資格なしでは書きにくいページ（検索から外す）
const NOINDEX = ['remote-work', 'night-shift', 'questions'];

const stub = to => `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=${to}.html">
<link rel="canonical" href="${SITE}${to}.html">
<title>Essential Beauty Needs</title>
</head>
<body>
<p><a href="${to}.html">移動しました</a></p>
</body>
</html>
`;
for (const [from, to] of Object.entries(MERGE)) fs.writeFileSync(path.join(ROOT, from + '.html'), stub(to));

// サイト内リンクを、まとめた先に付け替える
let relinked = 0;
for (const f of fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && !MERGE[f.replace('.html', '')])) {
  const p = path.join(ROOT, f);
  let h = fs.readFileSync(p, 'utf8');
  const before = h;
  for (const [from, to] of Object.entries(MERGE)) h = h.split(`href="${from}.html`).join(`href="${to}.html`);
  // 付け替えで同じページへのリンクが並んだ一覧の重複を減らす（同じ href の <li> は最初だけ残す）
  h = h.replace(/(<ul[^>]*>)([\s\S]*?)(<\/ul>)/g, (m, a, body, c) => {
    const seen = new Set();
    return a + body.replace(/\s*<li>\s*<a href="([^"#]+)"[^>]*>[^<]*<\/a>\s*<\/li>/g, (li, href) => seen.has(href) ? '' : (seen.add(href), li)) + c;
  });
  if (h !== before) { fs.writeFileSync(p, h); relinked++; }
}
// 健康の話が中心のページは noindex
for (const s of NOINDEX) {
  const p = path.join(ROOT, s + '.html');
  let h = fs.readFileSync(p, 'utf8');
  if (!/name="robots"/.test(h)) h = h.replace(/(<meta charset="[^"]*">)/i, '$1\n<meta name="robots" content="noindex, follow">');
  fs.writeFileSync(p, h);
}
// サイトマップから外す
const drop = new Set([...Object.keys(MERGE), ...NOINDEX].map(s => `/${s}.html</loc>`));
const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8').split('  <url>');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sm.filter((p, i) => i === 0 || ![...drop].some(d => p.includes(d))).join('  <url>'));
console.log('merged', Object.keys(MERGE).length, '| relinked pages', relinked, '| noindex', NOINDEX.length);
