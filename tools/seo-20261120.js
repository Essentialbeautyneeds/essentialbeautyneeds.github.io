// 2026-11-20 SEO と成約の底上げ（全ページ）
//  1) title の末尾「｜Essential Beauty Needs」を外す（長すぎて検索結果で切れるため）
//  2) H1 に検索語（title の前半）が入っていないページは、H1 の先頭に検索語の行を足す
//  3) 画面下の固定バーを、ページの分類に合う行き先にする（式場探し＝ハナユメ・トキハナ、脱毛＝脱毛の比較 など）
//  4) 変えたページの sitemap の lastmod を更新
// node tools/seo-20261120.js [--dry]
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const DRY = process.argv.includes('--dry');
const TODAY = '2026-11-20';

const SKIP = new Set(['about.html', 'privacy-policy.html', 'contact.html', 'set-internal.html', 'beauty-column.html']);
const FAIR = new Set(['bridal-fair', 'bridal-fair-decision', 'bridal-fair-duration', 'bridal-fair-no-booking', 'bridal-fair-outfit', 'bridal-fair-tokuten', 'venue-choose', 'venue-search-timing', 'venue-visit-checklist', 'wedding-start', 'wedding-estimate', 'wedding-mochikomi'].map((s) => s + '.html'));
const HUBS = new Set(['datsumo.html', 'esthe.html', 'gym.html', 'teeth.html', 'home-trial.html', 'trial-collection.html', 'index.html']);

const KW_STYLE = "display:block;font-family:'Zen Kaku Gothic New',sans-serif;font-size:14px;font-weight:700;letter-spacing:.02em;color:#8c4a5c;line-height:1.6;margin:0 0 6px";
const BTN = "display:flex;align-items:center;justify-content:center;min-height:44px;padding:8px 10px;text-decoration:none;font-size:13.5px;font-weight:700;text-align:center;line-height:1.35;font-family:'Zen Kaku Gothic New',sans-serif;";
const MAIN = BTN + 'flex:2;background:#b83d63;color:#fff';
const SUB = BTN + 'flex:1;background:#fff;color:#3d3836;border:1px solid #c3d0c0';

// 広告コードは各ページで使っているものをそのまま使う
const HANAYUME = 'https://px.a8.net/svt/ejp?a8mat=4AX40F+8IMA3E+3DOK+6I1XE';
const HANAYUME_PX = '<img loading="lazy" decoding="async" border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=4AX40F+8IMA3E+3DOK+6I1XE" alt="" style="position:absolute">';
const TOKIHANA = 'https://px.a8.net/svt/ejp?a8mat=4BERA7+DLECT6+4P5Q+C4TB6';
const TOKIHANA_PX = '<img loading="lazy" decoding="async" border="0" width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=4BERA7+DLECT6+4P5Q+C4TB6" alt="" style="position:absolute">';

function bar(file, crumb) {
  let main, sub;
  if (FAIR.has(file)) {
    main = `<a href="${HANAYUME}" rel="nofollow sponsored" target="_blank" style="${MAIN}">無料フェアを探す ＞</a>${HANAYUME_PX}`;
    sub = `<a href="${TOKIHANA}" rel="nofollow sponsored" referrerpolicy="no-referrer-when-downgrade" target="_blank" style="${SUB}">式場の見積もり相談</a>${TOKIHANA_PX}`;
  } else {
    let hub = null;
    if (!HUBS.has(file)) {
      if (/脱毛/.test(crumb) || /hair-removal|datsumo|dione/.test(file)) hub = ['datsumo.html', '脱毛の無料カウンセリングを比べる ＞'];
      else if (/エステ/.test(crumb) || /esthe|miss-paris|ciz-labo/.test(file)) hub = ['esthe.html', 'エステの体験・初回料金を比べる ＞'];
      else if (/ジム/.test(crumb) || /gym|lava|soelu|furdi|rizap|amazones|online-fitness|workout/.test(file)) hub = ['gym.html', 'ジム・ヨガの無料体験を比べる ＞'];
      else if (/ホワイトニング/.test(crumb) || /whitening|white-meister/.test(file)) hub = ['teeth.html', 'ホワイトニングの初回を比べる ＞'];
      else if (/自宅で試す/.test(crumb)) hub = ['home-trial.html', 'お試しセット・美容器を比べる ＞'];
    }
    if (!hub) return null; // 今のまま（体験リスト）
    main = `<a href="${hub[0]}" style="${MAIN}">${hub[1]}</a>`;
    sub = `<a href="trial-collection.html" style="${SUB}">体験リスト</a>`;
  }
  return `<!-- ebn-bar -->\n<div class="ebn-bar" style="position:fixed;left:0;right:0;bottom:0;z-index:60;display:flex;gap:8px;padding:8px 10px calc(8px + env(safe-area-inset-bottom));background:rgba(255,255,255,.97);border-top:1px solid #e8e6e1;box-shadow:0 -2px 10px rgba(0,0,0,.06)">\n  ${main}\n  ${sub}\n</div>`;
}

const norm = (s) => s.replace(/<[^>]+>/g, '').replace(/[\s、。？?！!「」・｜|]/g, '');

const changed = [];
for (const f of fs.readdirSync(ROOT).filter((x) => x.endsWith('.html'))) {
  const p = path.join(ROOT, f);
  let h = fs.readFileSync(p, 'utf8');
  if (/http-equiv="refresh"/.test(h) || /name="robots"[^>]*noindex/.test(h) || SKIP.has(f)) continue;
  const before = h;
  const notes = [];

  // 1) title
  h = h.replace(/(<title>[^<]*?)\s*[｜|]\s*Essential Beauty Needs\s*(<\/title>)/, '$1$2');
  h = h.replace(/(property="og:title" content="[^"]*?)\s*[｜|]\s*Essential Beauty Needs(")/, '$1$2');
  if (h !== before) notes.push('title');
  const title = (h.match(/<title>([^<]*)<\/title>/) || [, ''])[1];
  let kw = title.split(/[｜|]/)[0].trim();
  if (kw.includes('？')) kw = kw.slice(0, kw.indexOf('？') + 1);
  if (f === 'lifestyle-skincare.html') kw = '花嫁のためのスキンケア計画表（期間・タイプ別）';

  // 2) H1
  const m = h.match(/<h1([^>]*)>([\s\S]*?)<\/h1>/);
  if (m && kw && !h.includes('class="h1-kw"')) {
    if (f === 'lifestyle-skincare.html') {
      h = h.replace(m[0], `<h1${m[1]}>${kw}</h1>`);
      notes.push('h1');
    } else if (!norm(m[2]).includes(norm(kw))) {
      h = h.replace(m[0], `<h1${m[1]}><span class="h1-kw" style="${KW_STYLE}">${kw}</span>${m[2]}</h1>`);
      notes.push('h1');
    }
  }

  // 3) 固定バー
  const crumb = ((h.match(/"position":\s*2,[^}]*?"name":\s*"([^"]*)"/) || [, ''])[1]);
  const nb = bar(f, crumb);
  if (nb && /<!-- ebn-bar -->[\s\S]*?<\/div>/.test(h)) {
    const h2 = h.replace(/<!-- ebn-bar -->[\s\S]*?<\/div>/, nb);
    if (h2 !== h) { h = h2; notes.push('bar'); }
  }

  if (h !== before) {
    changed.push(f);
    console.log(f, notes.join(','), '|', kw);
    if (!DRY) fs.writeFileSync(p, h);
  }
}

// 4) sitemap
if (!DRY) {
  const sp = path.join(ROOT, 'sitemap.xml');
  let sm = fs.readFileSync(sp, 'utf8');
  for (const f of changed) {
    const loc = f === 'index.html' ? 'https://essential-beauty-needs.com/' : `https://essential-beauty-needs.com/${f}`;
    sm = sm.replace(new RegExp(`(<loc>${loc.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}</loc>\\s*<lastmod>)[^<]*`), `$1${TODAY}`);
  }
  fs.writeFileSync(sp, sm);
}
console.log('changed', changed.length);
