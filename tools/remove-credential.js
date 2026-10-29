// サイト内の「栄養士」の自称表記を外す（「管理栄養士」＝各社のスタッフの説明はそのまま）
// 使い方：node tools/remove-credential.js        → 書き換え
//         node tools/remove-credential.js --dry  → 残りを数えるだけ
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const dry = process.argv.includes('--dry');
const N = '(?<!管理)';   // 「管理栄養士」は対象外

const RULES = [
  // 監修者の表記・構造化データ
  [/Yuri（栄養士）/g, 'Yuri'],
  [/,\s*"jobTitle":\s*"栄養士"/g, ''],
  [/"jobTitle":\s*"栄養士",\s*/g, ''],
  // タイトル・説明文によくある形
  [new RegExp(`を${N}栄養士が`, 'g'), 'を'],
  [new RegExp(`｜${N}栄養士が`, 'g'), '｜'],
  [new RegExp(`｜${N}栄養士の視点`, 'g'), '｜食事の視点'],
  [new RegExp(`、${N}栄養士が`, 'g'), '、'],
  [new RegExp(`${N}栄養士の視点`, 'g'), '食事の視点'],
  [new RegExp(`${N}栄養士目線`, 'g'), '食事の視点'],
  [new RegExp(`${N}栄養士の美肌メソッド`, 'g'), '食事から整える美肌メソッド'],
  [new RegExp(`${N}栄養士の食事メソッド`, 'g'), '食事から整えるメソッド'],
  [new RegExp(`${N}栄養士監修`, 'g'), '編集部まとめ'],
  [new RegExp(`${N}栄養士として`, 'g'), '食事の面から'],
  [new RegExp(`現役${N}栄養士`, 'g'), '編集部'],
  // 残りの「栄養士が〜」「栄養士の〜」はペルソナ名に
  [new RegExp(`${N}栄養士が`, 'g'), 'Yuriが'],
  [new RegExp(`${N}栄養士の`, 'g'), 'Yuriの'],
];

const files = [
  ...fs.readdirSync(ROOT).filter(f => f.endsWith('.html')),
  ...fs.readdirSync(path.join(ROOT, 'meal')).filter(f => f.endsWith('.html')).map(f => 'meal/' + f),
];
let changed = 0, total = 0;
const left = {};
for (const f of files) {
  const p = path.join(ROOT, f);
  const before = fs.readFileSync(p, 'utf8');
  let h = before;
  if (!dry) for (const [re, to] of RULES) h = h.replace(re, to);
  if (h !== before) { fs.writeFileSync(p, h); changed++; }
  for (const m of h.matchAll(new RegExp(`.{0,16}${N}栄養士.{0,16}`, 'g'))) {
    const k = m[0].replace(/<[^>]*>/g, '');
    left[k] = (left[k] || []).concat(f); total++;
  }
}
console.log(dry ? 'dry run' : `changed ${changed} files`, '| remaining (non-管理):', total);
for (const [k, fs_] of Object.entries(left)) console.log(fs_.length, k, '|', [...new Set(fs_)].slice(0, 3).join(' '));
