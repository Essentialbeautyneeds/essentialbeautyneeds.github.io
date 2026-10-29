// note（yuri_organic）を閉じるため、サイト内の note へのリンク・案内を外す
// 使い方：node tools/remove-note-links.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const write = (f, h) => fs.writeFileSync(path.join(ROOT, f), h);

// <div class="X"> から、対応する </div> までを外す
function dropDiv(h, cls) {
  for (;;) {
    const start = h.indexOf(`<div class="${cls}">`);
    if (start < 0) return h;
    const re = /<div\b|<\/div>/g;
    re.lastIndex = start;
    let depth = 0, m, end = -1;
    while ((m = re.exec(h))) {
      depth += m[0] === '</div>' ? -1 : 1;
      if (depth === 0) { end = m.index + 6; break; }
    }
    if (end < 0) throw new Error('unbalanced ' + cls);
    h = h.slice(0, start) + h.slice(end);
  }
}
function edit(f, fn) {
  const before = read(f);
  const after = fn(before);
  if (after === before) console.log('no change:', f);
  else { write(f, after); console.log('edited:', f); }
}

// 1. 部位の記事：note の無料講座ボタン → 逆算チェックリスト
const TO_CHECKLIST = '<a href="checklist.html" class="btn">挙式日から逆算して、全体の順番を見る\n  </a>';
for (const f of ['prehana-arm.html', 'prehana-back.html', 'prehana-mukumi.html', 'prehana-rounded-shoulders.html'])
  edit(f, h => h.replace(/<a href="https:\/\/note\.com\/yuri_organic\/n\/n81b195407c3e" class="btn" target="_blank" rel="noopener">無料の花嫁ダイエット序章を読む\s*<\/a>/, TO_CHECKLIST));

// 2. 時期別：980円・無料の note への2つのボタン → チェックリスト1つ
edit('diet-timing.html', h => h
  .replace(/<a href="https:\/\/note\.com\/yuri_organic\/n\/xxxxxxxx" class="btn" target="_blank" rel="noopener">980円｜花嫁ダイエット序章を読む\s*<\/a>/, '<a href="checklist.html" class="btn">挙式日から逆算するチェックリストを使う\n  </a>')
  .replace(/<section>\s*<a href="https:\/\/note\.com\/yuri_organic\/n\/n81b195407c3e" class="btn" target="_blank" rel="noopener">無料の序章を読む\s*<\/a>\s*<\/section>\s*/, '')
  .replace('<!-- FAQ直後：980円へのブリッジ -->', '<!-- FAQ直後：チェックリストへ -->'));

// 3. トップ：「読み物」（note の講座・有料記事）の節を外す
edit('index.html', h => h.replace(/<section>\s*<h2>読み物<\/h2>[\s\S]*?<\/section>\s*/, ''));

// 4. コラム一覧：note 記事一覧のカードを外す
edit('beauty-column.html', h => h.replace(/\s*<a href="note-archive\.html" class="article-card">[\s\S]*?<\/a>/, ''));

// 5. note のバナーとメニューの「公式Note」
for (const f of ['hair-care.html', 'lifestyle-skincare.html', 'organic-science.html', 'smoothie-recipes.html'])
  edit(f, h => dropDiv(h, 'note-banner').replace(/\s*<a href="note-archive\.html">公式Note<\/a>/g, ''));

// 6. 運営者情報：関連の行は Pinterest に
edit('about.html', h => h.replace(
  /<a href="https:\/\/note\.com\/yuri_organic" target="_blank" rel="noopener">note<\/a>／<a href="note-archive\.html">記事一覧<\/a>/,
  '<a href="https://jp.pinterest.com/kagaset1/" target="_blank" rel="noopener">Pinterest</a>'));

// 7. 全ページのフッター「note記事」
let foot = 0;
for (const f of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const h = read(f);
  const after = h.replace(/\s*<a href="note-archive\.html"[^>]*>note記事<\/a>/g, '');
  if (after !== h) { write(f, after); foot++; }
}
console.log('footer links removed:', foot);

// 8. note-archive.html はトップへ転送（検索には出さない）
write('note-archive.html', `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=index.html">
<link rel="canonical" href="https://essential-beauty-needs.com/">
<title>Essential Beauty Needs</title>
</head>
<body>
<p><a href="index.html">トップページへ</a></p>
</body>
</html>
`);
let sm = read('sitemap.xml');
const parts = sm.split('  <url>');
write('sitemap.xml', parts.filter((p, i) => i === 0 || !p.includes('/note-archive.html</loc>')).join('  <url>'));

// 残りの確認
const left = [];
for (const f of fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'note-archive.html')) {
  const h = read(f);
  if (/note\.com|note-archive/.test(h)) left.push(f);
}
console.log('remaining note links in:', left.length ? left.join(' ') : 'none');
