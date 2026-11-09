// 「最も」「絶対」などの言い切りを和らげる（2026-11-09）
// タイトル・h1・構造化データは順位を守るため変えない。転送ページは触らない
// 使い方：node tools/soften-wording.js   （何度実行してもよい）
const fs = require('fs'), path = require('path');
const R = path.resolve(__dirname, '..');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
  if (e.name.startsWith('.') || e.name === 'tools' || e.name === 'node_modules') return [];
  const p = path.join(d, e.name);
  return e.isDirectory() ? walk(p) : e.name.endsWith('.html') ? [p] : [];
});
const RULES = [
  [/最も多い失敗/g, 'よくある失敗'], [/最もよくある/g, 'よくある'], [/最も多い相談/g, '多い相談'], [/最も多いのが/g, '多いのが'], [/最も多い角度/g, '多い角度'],
  [/最も悪い判断/g, '避けたい判断'], [/最も損な選択/g, '損な選択'], [/最も損の少な/g, '損の少な'], [/最も安全/g, '安全'], [/最も確実な/g, '確かな'],
  [/最も早く効く/g, '早く効きやすい'], [/最も効果が早/g, '効果が早'], [/最も早い/g, '早い'], [/最も効くこと/g, '優先したいこと'], [/最も自然/g, '自然'],
  [/最も高い/g, '高い'], [/最も出る失敗/g, '出やすい失敗'], [/最も出ない/g, '出にくい'], [/最も出ます/g, '出やすいです'], [/最も出る/g, 'よく出る'], [/最も外れる/g, '外れやすい'],
  [/写真に最も写る/g, '写真によく写る'], [/Aラインは最も選ばれている/g, 'Aラインはよく選ばれている'], [/最も/g, '特に'],
  [/絶対に見えな/g, 'なかなか見えな'], [/絶対に続かな/g, 'どうしても続かな'], [/絶対にやらな/g, 'なかなかやらな'], [/絶対に後悔しない/g, '後悔しにくい'], [/絶対に/g, 'できるだけ'],
];
const KEEP = /<title>[\s\S]*?<\/title>|<meta property="og:title"[^>]*>|<h1[\s\S]*?<\/h1>|<script[\s\S]*?<\/script>/gi;
let changed = 0, n = 0;
const dryOut = [];
for (const f of walk(R)) {
  const o = fs.readFileSync(f, 'utf8');
  if (/http-equiv="refresh"/i.test(o)) continue;
  const parts = o.split(new RegExp(`(${KEEP.source})`, 'gi'));
  let b = '';
  parts.forEach((p, i) => {
    if (p === undefined) return;
    if (new RegExp(`^(?:${KEEP.source})$`, 'i').test(p)) { b += p; return; }
    let t = p;
    for (const [re, to] of RULES) t = t.replace(re, (m, off, str) => {
      n++; dryOut.push(path.relative(R, f) + ' | ' + str.slice(Math.max(0, off - 12), off).replace(/<[^>]*>|\n/g, '') + '【' + to + '】' + str.slice(off + m.length, off + m.length + 12).replace(/<[^>]*>|\n/g, ''));
      return to;
    });
    b += t;
  });
  if (b !== o) { fs.writeFileSync(f, b); changed++; }
}
console.log(dryOut.join('\n'));
console.log(`files ${changed}, replaced ${n}`);
