// コラム一覧（beauty-column.html）から、閉じたページを指すカードを外し、名前の合わないカードを直す
const fs = require('fs');
const path = require('path');
const f = path.join(__dirname, '..', 'beauty-column.html');
let h = fs.readFileSync(f, 'utf8');
const DROP = ['食べて痩せる肌診断', 'ARISANFIT 無料体験レポ', '花嫁ボディメイク厳選5選', 'オーガニック成分の科学', 'インナービューティー＆ダイエット', 'おすすめスムージー'];
for (const t of DROP) {
  const i = h.indexOf(`card-title">${t}<`);
  if (i < 0) { console.log('miss', t); continue; }
  const start = h.lastIndexOf('<a ', i);
  const end = h.indexOf('</a>', i) + 4;
  h = h.slice(0, start).replace(/\s+$/, '') + h.slice(end);
}
h = h.replace('card-title">花嫁美容・肌診断ツール<', 'card-title">部位別の体づくり<');
fs.writeFileSync(f, h);
console.log('ok');
