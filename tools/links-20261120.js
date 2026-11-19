// 2026-11-20 内部リンク：11/18〜11/20 の新しいページ（入ってくるリンクが2本だけ）へ、関連する既存ページから1文で案内する
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const A = (href, t) => `<a href="${href}">${t}</a>`;

const plan = [
  ['bridal-fair.html', 'bridal-fair-tokuten.html', `式場探しサイトの特典を受け取る条件は${A('bridal-fair-tokuten.html', 'ブライダルフェアの特典をもらう条件')}に、1件にかかる時間は${A('bridal-fair-duration.html', 'フェアの所要時間')}にまとめています。`],
  ['bridal-fair-no-booking.html', 'bridal-fair-tokuten.html', `式場探しサイトの特典は、そのサイトからのネット予約が条件のことが多いです。くわしくは${A('bridal-fair-tokuten.html', 'ブライダルフェアの特典をもらう条件')}にあります。`],
  ['bridal-fair-outfit.html', 'bridal-fair-tokuten.html', `特典の写真を送るキャンペーンもあります。条件は${A('bridal-fair-tokuten.html', 'ブライダルフェアの特典をもらう条件')}で確かめられます。`],
  ['wedding-start.html', 'bridal-fair-tokuten.html', `フェアの予約の前に、${A('bridal-fair-tokuten.html', '特典をもらう条件')}も見ておくと取りこぼしがありません。`],
  ['shirono-datsumo.html', 'datsumo-counseling-flow.html', `カウンセリングの日の流れと持ち物は${A('datsumo-counseling-flow.html', '医療脱毛の無料カウンセリングの流れ')}にあります。`],
  ['nape-hair-removal.html', 'datsumo-counseling-flow.html', `カウンセリングで聞くことは${A('datsumo-counseling-flow.html', '医療脱毛の無料カウンセリングの流れ')}にまとめています。`],
  ['miss-paris-trial.html', 'esthe-trial-flow.html', `体験の日の服装や持ち物は${A('esthe-trial-flow.html', 'エステ体験の流れと服装・持ち物')}にあります。`],
  ['ciz-labo-trial.html', 'esthe-trial-flow.html', `体験の日の服装や持ち物は${A('esthe-trial-flow.html', 'エステ体験の流れと服装・持ち物')}にあります。`],
  ['personal-gym.html', 'personal-gym-trial.html', `体験の日の服装と当日の流れは${A('personal-gym-trial.html', 'パーソナルジムの体験の流れ')}にあります。`],
  ['rizap-counseling.html', 'personal-gym-trial.html', `ほかのジムの体験と比べるときは${A('personal-gym-trial.html', 'パーソナルジムの体験の流れと服装・持ち物')}も参考になります。`],
  ['venue-choose.html', 'venue-search-timing.html', `探し始める時期は${A('venue-search-timing.html', '結婚式場はいつから探す？')}で逆算できます。`],
];

for (const [file, target, text] of plan) {
  const p = path.join(ROOT, file);
  let h = fs.readFileSync(p, 'utf8');
  const marker = `<!-- link:${target} -->`;
  if (h.includes(marker)) { console.log('skip', file); continue; }
  const para = `${marker}\n<section><p class="small">${text}</p></section>\n`;
  let i = h.indexOf('<section class="related"');
  if (i < 0) {
    const m = h.match(/<\/div>\s*<\/main>/);
    if (!m) throw new Error('no place: ' + file);
    i = m.index;
  }
  h = h.slice(0, i) + para + h.slice(i);
  fs.writeFileSync(p, h);
  console.log('ok', file, '→', target);
}

// 花嫁の準備のハブ：所要時間の行の次に特典のページ
const hub = path.join(ROOT, 'bridal.html');
let b = fs.readFileSync(hub, 'utf8');
if (!b.includes('bridal-fair-tokuten.html')) {
  const line = b.match(/<a href="bridal-fair-duration\.html">[^\n]*<\/a>/)[0];
  b = b.replace(line, line + '\n<a href="bridal-fair-tokuten.html"><span class="t">ブライダルフェアの特典をもらう条件｜予約の仕方・写真・アンケートの注意</span><span class="d">特典の種類と、もらえなくなる例。</span></a>');
  fs.writeFileSync(hub, b);
  console.log('ok bridal.html');
}
