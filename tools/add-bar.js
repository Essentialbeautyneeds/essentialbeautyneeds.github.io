// プレ花の全ページ（/meal/ 以外）の下に、体験リストと逆算チェックリストへの固定バーを入れる。もう一度実行しても二重には入らない
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['trial-collection.html', 'privacy-policy.html', 'about.html']);
const F = "font-family:'Zen Kaku Gothic New',sans-serif";
const BTN = `display:flex;align-items:center;justify-content:center;min-height:44px;padding:8px 10px;text-decoration:none;font-size:13.5px;font-weight:700;text-align:center;line-height:1.35;${F}`;
const bar = (self) => `<!-- ebn-bar -->
<div class="ebn-bar" style="position:fixed;left:0;right:0;bottom:0;z-index:60;display:flex;gap:8px;padding:8px 10px calc(8px + env(safe-area-inset-bottom));background:rgba(255,255,255,.97);border-top:1px solid #e8e6e1;box-shadow:0 -2px 10px rgba(0,0,0,.06)">
  <a href="trial-collection.html" style="flex:2;${BTN};background:#b83d63;color:#fff">無料・低額で試せる体験リスト ＞</a>
  ${self === 'checklist.html' ? '' : `<a href="checklist.html" style="flex:1;${BTN};background:#fff;color:#3d3836;border:1px solid #c3d0c0">挙式日から逆算</a>`}
</div>
<style>body{padding-bottom:76px}@media(min-width:900px){.ebn-bar{left:auto!important;right:16px!important;bottom:16px!important;width:440px;border:1px solid #e8e6e1!important}body{padding-bottom:0}}</style>
<!-- /ebn-bar -->
`;
let n = 0;
for (const f of fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && !SKIP.has(f))) {
  const p = path.join(ROOT, f);
  let h = fs.readFileSync(p, 'utf8');
  h = h.replace(/<!-- ebn-bar -->[\s\S]*?<!-- \/ebn-bar -->\r?\n?/, '');
  const i = h.lastIndexOf('</body>');
  if (i < 0) { console.log('no body:', f); continue; }
  h = h.slice(0, i) + bar(f) + h.slice(i);
  fs.writeFileSync(p, h); n++;
}
console.log('bar added to', n, 'pages');
