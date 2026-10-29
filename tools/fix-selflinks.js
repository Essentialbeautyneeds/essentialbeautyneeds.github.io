// まとめたあとに残った「自分自身へのリンク」を外し、メニューの「肌づくり」の行き先を直す
// node tools/fix-selflinks.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function anchorEnd(h, start) {
  const re = /<a(?![a-zA-Z-])|<\/a>/g;
  re.lastIndex = start;
  let d = 0, m;
  while ((m = re.exec(h))) { d += m[0] === '</a>' ? -1 : 1; if (d === 0) return m.index + 4; }
  return -1;
}

let pages = 0, removed = 0;
for (const f of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
  const p = path.join(ROOT, f);
  let h = fs.readFileSync(p, 'utf8');
  if (/http-equiv="refresh"/.test(h)) continue;
  const before = h;
  // メニュー・フッターの「肌づくり」「肌と施術」は計画表のページへ
  h = h.replace(/href="back-acne-urgent\.html"([^>]*)>(肌づくり|肌と施術|肌トラブル別のケア →)/g, 'href="lifestyle-skincare.html"$1>$2');
  if (f !== 'index.html') {
    // 一覧の中の自分へのリンク
    const li = new RegExp(`\\s*<li>\\s*<a href="${f.replace('.', '\\.')}"[^>]*>[^<]*</a>\\s*</li>`, 'g');
    h = h.replace(li, () => { removed++; return ''; });
    // 関連記事カードなど、ブロックになった自分へのリンク（本文中の短いリンクは残す）
    for (let g = 0; g < 20; g++) {
      const i = h.search(new RegExp(`<a href="${f.replace('.', '\\.')}" style="display:(block|grid)`));
      if (i < 0) break;
      const e = anchorEnd(h, i);
      if (e < 0) break;
      h = h.slice(0, i) + h.slice(e);
      removed++;
    }
  }
  if (h !== before) { fs.writeFileSync(p, h); pages++; }
}
console.log('pages', pages, 'self links removed', removed);
