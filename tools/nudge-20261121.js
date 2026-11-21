// 体験カードのボタン（.apply）の直前に、申し込みたくなる一文（マイクロコピー）を入れる（2026-11-21）
// 一文はカードの価格欄（.price）にすでに書いてある事実だけから作る。無料と書くのは価格欄に「無料」があるときだけ
//   node tools/nudge-20261121.js        … 全ページに入れる（入っているカードは飛ばす）
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function nudge(price) {
  const p = (price || '').trim();
  if (/^30日100円$/.test(p)) return '30日100円で試してから、続けるか決められます';
  if (/無料体験|分無料/.test(p)) return '無料で体験して、自分に合うか確かめてから決められます';
  if (/無料診断/.test(p)) return '無料の診断で、自分に合うかを先に確かめられます';
  if (/(相談|カウンセリング|予約)無料|無料(相談|カウンセリング)/.test(p)) return '相談は無料。話を聞いてから決められます';
  if (/^体験(\d[\d,]*円)$/.test(p)) return p.replace(/^体験/, '') + 'の体験で、雰囲気を確かめてから決められます';
  if (/体験|見学/.test(p)) return '体験で雰囲気を確かめてから決められます';
  if (/カウンセリング/.test(p)) return 'カウンセリングで、内容と料金を聞いてから決められます';
  if (/初回/.test(p)) return '初回の内容と料金を確かめてから予約できます';
  if (/OFF/.test(p)) return '割引の条件を確かめてから申し込めます';
  if (/1回から/.test(p)) return '1回から利用できます。内容と料金を確かめてから予約できます';
  if (/通販|購入|定期|月額|店舗/.test(p)) return '商品の内容と価格を、公式サイトで確かめられます';
  if (/モニター/.test(p)) return 'モニターの条件を確かめてから登録できます';
  return '公式サイトで、内容と条件を確かめられます';
}

let pages = 0, added = 0;
for (const f of fs.readdirSync(ROOT).filter((x) => x.endsWith('.html'))) {
  const file = path.join(ROOT, f);
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('class="apply"')) continue;
  let out = '';
  let last = 0;
  let n = 0;
  const re = /<a class="apply"/g;
  let m;
  while ((m = re.exec(html))) {
    const i = m.index;
    const cardStart = html.lastIndexOf('<div class="card">', i);
    const before = html.slice(cardStart, i);
    if (cardStart < 0 || before.includes('class="nudge"')) continue;
    const pm = before.match(/<span class="price">([^<]*)<\/span>/);
    // 行頭のインデントをそろえる
    const lineStart = html.lastIndexOf('\n', i) + 1;
    const indent = html.slice(lineStart, i).match(/^\s*/)[0];
    out += html.slice(last, i) + `<div class="nudge">${nudge(pm && pm[1])}</div>\n${indent}`;
    last = i;
    n++;
  }
  if (!n) continue;
  out += html.slice(last);
  fs.writeFileSync(file, out);
  pages++;
  added += n;
}
// CSS：ボタンの上に一文の場所を足す（スマホは画像の下・ボタンの上）
const C = path.join(ROOT, 'assets', 'site.css');
let css = fs.readFileSync(C, 'utf8');
if (!css.includes('.card .nudge')) {
  css += `
/* ボタンの直前の一文（tools/nudge-20261121.js） */
.card{grid-template-areas:"tags thumb" "row thumb" "body thumb" "nudge thumb" "cta thumb"}
.card .nudge{grid-area:nudge;position:relative;margin-top:2px;padding-left:1.35em;font-size:13px;font-weight:700;color:var(--ink,#333);line-height:1.6}
.card .nudge::before{content:"";position:absolute;left:.1em;top:.42em;width:.68em;height:.36em;border-left:2px solid var(--rose);border-bottom:2px solid var(--rose);transform:rotate(-45deg)}
@media (max-width:620px){
  .card{grid-template-areas:"tags" "row" "body" "thumb" "nudge" "cta"}
}
`;
  fs.writeFileSync(C, css);
}
console.log('pages', pages, 'nudges', added);
