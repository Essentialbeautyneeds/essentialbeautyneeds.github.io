// 宅配食のページ（/meal/・meal-delivery.html）をサイトから切り離す
// node tools/remove-meal-links.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const MEAL = 'href="(?:meal/[^"]*|meal-delivery\.html)"';

function blockEnd(h, start, tag) {
  const re = new RegExp(`<${tag}(?![a-zA-Z-])|</${tag}>`, 'g'); re.lastIndex = start;
  let d = 0, m;
  while ((m = re.exec(h))) { d += m[0][1] === '/' ? -1 : 1; if (d === 0) return m.index + m[0].length; }
  return -1;
}
function enclosing(h, pos, tag, cls) {
  let i = pos;
  while ((i = h.lastIndexOf(`<${tag}`, i - 1)) >= 0) {
    const open = h.slice(i, h.indexOf('>', i) + 1);
    if (!new RegExp(`^<${tag}(?![a-zA-Z-])`).test(open)) { if (i === 0) break; continue; }
    const end = blockEnd(h, i, tag);
    if (end > pos && (!cls || new RegExp(`class="(?:[^"]* )?${cls}(?: [^"]*)?"`).test(open))) return [i, end];
    if (i === 0) break;
  }
  return null;
}
// 宅配食のリンクを含むブロック（tag.cls）を丸ごと外す
function dropBlocks(h, tag, cls) {
  for (let g = 0; g < 30; g++) {
    const re = new RegExp(MEAL, 'g'); let m, done = false;
    while ((m = re.exec(h))) {
      const b = enclosing(h, m.index, tag, cls);
      if (b) { h = h.slice(0, b[0]) + h.slice(b[1]); done = true; break; }
    }
    if (!done) return h;
  }
  return h;
}

// 文の中のリンク：個別に言い換え
const SENTENCES = [
  [/作る時間がない場合は<a href="meal-delivery\.html"[^>]*>宅配食<\/a>で埋める方法もあります。/, ''],
  [/と<a href="meal-delivery\.html"[^>]*>宅配食の選び方<\/a>に。二人分をまとめて頼めるものもあります。/, 'に。'],
  [/<a href="meal-delivery\.html"[^>]*>宅配食<\/a>で埋める手もあります/, ''],
  [/食事の側から整えるなら<a href="meal-delivery\.html"[^>]*>宅配食の選び方<\/a>、/, ''],
  [/食事側は<a href="meal-delivery\.html"[^>]*>宅配食の選び方<\/a>にまとめています。/, ''],
  [/宅配食の比較は<a href="meal-delivery\.html"[^>]*>宅配食の選び方<\/a>、/, ''],
  [/、食事が作れない時期の対処は<a href="meal-delivery\.html"[^>]*>宅配食の選び方<\/a>/, ''],
  [/と<a href="meal-delivery\.html"[^>]*>宅配食の選び方<\/a>を先に読んでください。/, 'を先に読んでください。'],
  [/\s*<a href="meal-delivery\.html"><span class="t">食事から整える<\/span><span class="d">作る時間がない時期の宅配食<\/span><\/a>/, ''],
  [/\s*<li><strong>共働きの夕食<\/strong>[^\n]*<\/li>/, ''],
  [/\s*<li><strong>作り置きと組み合わせる<\/strong>[^\n]*<\/li>/, ''],
];

let n = 0;
for (const f of fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'meal-delivery.html')) {
  const p = path.join(ROOT, f);
  const before = fs.readFileSync(p, 'utf8');
  let h = before;
  for (const [re, to] of SENTENCES) h = h.replace(re, to);
  h = dropBlocks(h, 'aside', 'earlycta');      // 「先に比べておく」→ 宅配食
  h = dropBlocks(h, 'section', 'deepdive');    // 「宅配食を詳しく比較する」
  h = dropBlocks(h, 'div', 'card');            // トップの「作れない日の食事」
  h = dropBlocks(h, 'a', '');                  // 関連記事のカード・単独のリンク
  if (h !== before) { fs.writeFileSync(p, h); n++; }
  const left = h.match(new RegExp(MEAL, 'g'));
  if (left) console.log('left in', f, left.length);
}
console.log('edited', n, 'pages');

// meal-delivery.html と /meal/ はトップへ転送（検索には出さない）
const stub = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=/">
<link rel="canonical" href="https://essential-beauty-needs.com/">
<title>Essential Beauty Needs</title>
</head>
<body>
<p><a href="/">トップページへ</a></p>
</body>
</html>
`;
const stubs = ['meal-delivery.html', ...fs.readdirSync(path.join(ROOT, 'meal')).filter(f => f.endsWith('.html')).map(f => 'meal/' + f)];
for (const f of stubs) fs.writeFileSync(path.join(ROOT, f), stub);
console.log('redirect stubs:', stubs.length);
const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8').split('  <url>');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sm.filter((p, i) => i === 0 || !/\/meal\/|\/meal-delivery\.html</.test(p)).join('  <url>'));
