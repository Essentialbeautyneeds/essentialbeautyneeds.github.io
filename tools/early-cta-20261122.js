// 「先に結論」の直後に、そのページで一番上の体験カードへの短い案内を入れる（2026-11-22）
// スマホで早く答え、早く次の一歩へ。カードの名前・紹介文・一言（nudge）・申し込みリンク（同じ href と rel）をそのまま使う
//   node tools/early-cta-20261122.js          … 全ページに入れる（入っているページ・カードのないページ・転送ページは飛ばす）
//   node tools/early-cta-20261122.js --dry    … 入れる場所の一覧だけ
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const dry = process.argv.includes('--dry');
const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

let done = 0;
const skipped = {};
const skip = (why, f) => { (skipped[why] = skipped[why] || []).push(f); };
for (const f of fs.readdirSync(ROOT).filter((x) => x.endsWith('.html'))) {
  const file = path.join(ROOT, f);
  const html = fs.readFileSync(file, 'utf8');
  if (/http-equiv="refresh"/.test(html) || /name="robots" content="noindex/.test(html)) { skip('転送・noindex', f); continue; }
  if (html.includes('class="early-cta"')) { skip('入っている', f); continue; }
  // 申し込みリンク（class="apply"）を持つ最初のカード。「向いている人」などのカードは飛ばす
  const ai = html.indexOf('<a class="apply"');
  if (ai < 0) { skip('カードなし', f); continue; }
  const ci = html.lastIndexOf('<div class="card">', ai);
  if (ci < 0) { skip('カードなし', f); continue; }
  const card = html.slice(ci, html.indexOf('</div>\n', ai) + 6);
  const name = strip((card.match(/<h3>([\s\S]*?)<\/h3>/) || [])[1] || '');
  const desc = strip((card.match(/<\/div>\s*<p>([\s\S]*?)<\/p>/) || [])[1] || '');
  const nudge = strip((card.match(/<div class="nudge">([\s\S]*?)<\/div>/) || [])[1] || '');
  const a = card.match(/<a class="apply" ([^>]*)>([\s\S]*?)<\/a>/);
  if (!name || !a) { skip('カードの形が違う', f); continue; }
  const attrs = a[1];
  if (!/href="https?:\/\/(px\.a8\.net|af\.moshimo\.com|ck\.jp\.ap\.valuecommerce\.com)/.test(attrs) && !/href="[^"]*(a8mat|moshimo|valuecommerce)/.test(attrs)) { skip('広告のリンクではない', f); continue; }
  // 入れる場所：最初の h2 より前にある「先に結論」の箱（note-box）を含む section の直後。なければ最初の h2 の section の直前
  const mi = html.indexOf('<main');
  const h2 = html.indexOf('<h2', mi);
  const nb = html.indexOf('class="note-box"', mi);
  let at;
  if (nb > 0 && nb < h2) at = html.indexOf('</section>', nb) + '</section>'.length;
  else at = html.lastIndexOf('<section', h2);
  if (!(at > mi) || at > ci) { skip('入れる場所がない', f); continue; }
  const block = `\n<section class="early-cta" aria-label="迷ったら、まずここから"><div class="ecta">
  <p class="ecta-k">迷ったら、まずここから</p>
  <p class="ecta-name">${name}</p>
  ${desc ? `<p class="ecta-desc">${desc}</p>` : ''}
  ${nudge ? `<p class="ecta-nudge">${nudge}</p>` : ''}
  <a class="ecta-go" ${attrs}>詳細を見る ＞</a>
</div></section>`;
  if (dry) { console.log(f, '|', name, '|', Math.round((at - mi) / (html.length - mi) * 100) + '%'); done++; continue; }
  fs.writeFileSync(file, html.slice(0, at) + block + html.slice(at));
  done++;
}
// CSS
const C = path.join(ROOT, 'assets', 'site.css');
let css = fs.readFileSync(C, 'utf8');
if (!dry && !css.includes('.early-cta')) {
  css += `
.early-cta{margin:18px 0 0}
.early-cta .ecta{background:#fff;border:1.5px solid var(--rose,#c06c84);border-radius:14px;padding:14px 16px}
.early-cta .ecta-k{margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:.06em;color:var(--rose,#c06c84)}
.early-cta .ecta-name{margin:0 0 4px;font-size:16px;font-weight:700;color:#3d3836}
.early-cta .ecta-desc{margin:0 0 6px;font-size:14px;line-height:1.7;color:#4a4542}
.early-cta .ecta-nudge{position:relative;margin:0 0 10px;padding-left:1.35em;font-size:13px;font-weight:700;color:#3d3836}
.early-cta .ecta-nudge::before{content:"";position:absolute;left:.1em;top:.42em;width:.68em;height:.36em;border-left:2px solid var(--rose,#c06c84);border-bottom:2px solid var(--rose,#c06c84);transform:rotate(-45deg)}
.early-cta .ecta-go{display:block;text-align:center;padding:12px 10px;border-radius:999px;background:var(--rose,#c06c84);color:#fff;font-weight:700;text-decoration:none}
`;
  fs.writeFileSync(C, css);
}
console.log(dry ? 'dry' : 'done', done, Object.fromEntries(Object.entries(skipped).map(([k, v]) => [k, v.length])));
