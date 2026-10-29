// 新しいページ（checklist / wedding-start / after-wedding）を trial-collection.html の枠（head・ヘッダー・フッター）で作る
// 使い方：node tools/make-pages.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SITE = 'https://essential-beauty-needs.com/';

const tpl = fs.readFileSync(path.join(ROOT, 'trial-collection.html'), 'utf8');
const headTop = tpl.slice(0, tpl.indexOf('<title>'));
const gaEnd = tpl.indexOf('<link rel="stylesheet" href="assets/mobile.css">') + '<link rel="stylesheet" href="assets/mobile.css">'.length;
const headAssets = tpl.slice(tpl.indexOf('<link rel="icon"'), gaEnd);
const bodyTop = tpl.slice(tpl.indexOf('<body>'), tpl.indexOf('<div class="wrap">', tpl.indexOf('<main>')) + '<div class="wrap">'.length);
const foot = tpl.slice(tpl.indexOf('<footer class="site-foot">'));

const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const A = "color:#8c4a5c;text-decoration:underline;text-decoration-color:rgba(140,74,92,.4);text-underline-offset:3px";

function page({ slug, title, desc, image, crumb, body }) {
  const url = SITE + slug + '.html';
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'トップ', item: SITE },
        { '@type': 'ListItem', position: 2, name: crumb, item: url }] },
      { '@type': 'Article', headline: title.split('｜')[0], description: desc, image: SITE + 'images/' + image,
        datePublished: '2026-10-29', dateModified: '2026-10-29',
        author: { '@type': 'Organization', name: 'Essential Beauty Needs' },
        publisher: { '@type': 'Organization', name: 'Essential Beauty Needs', url: SITE },
        mainEntityOfPage: url, inLanguage: 'ja' }]
  };
  const html = `${headTop}<title>${title}｜Essential Beauty Needs</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}images/${image}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
${headAssets}
<script type="application/ld+json">
${JSON.stringify(ld, null, 1)}
</script>
</head>
${bodyTop}
<nav class="crumb" aria-label="現在位置" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12px;color:#6f6a67;padding:14px 0 0;font-family:'Zen Kaku Gothic New',sans-serif">
  <a href="index.html" style="${A}">トップ</a>
  <span aria-hidden="true">›</span>
  <span>${crumb}</span>
</nav>
${body}
</div>
</main>
${foot}`;
  fs.writeFileSync(path.join(ROOT, slug + '.html'), html);
  console.log('wrote', slug + '.html', Buffer.byteLength(html) + 'B');
}

// ad codes copied as-is from existing pages of this site
const HANAYUME = 'https://px.a8.net/svt/ejp?a8mat=4AX40F+8IMA3E+3DOK+6I1XE';
const HANAYUME_PX = '<img loading="lazy" decoding="async" border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=4AX40F+8IMA3E+3DOK+6I1XE" alt="" style="position:absolute">';
const sp = 'rel="nofollow sponsored" referrerpolicy="no-referrer-when-downgrade" target="_blank"';

// ---------- 1. 挙式日から逆算するチェックリスト ----------
const STEPS = [
  { id: 'venue', from: 999, to: 0, label: '会場がまだ決まっていない', items: [
    ['ブライダルフェアを予約して会場を見る', 'wedding-start.html', '会場と日取りが決まると、ここから先の締め切りがすべて決まります'],
  ] },
  { id: 'm6', from: 999, to: 6, label: '6ヶ月前までに始めたいこと（まだなら早めに）', items: [
    ['脱毛を始める（背中・うなじ・二の腕）', 'hair-removal.html', '2〜3ヶ月に1回・5回前後が目安。いちばん早く締め切りが来ます', 'trial-collection.html#datsumo'],
    ['食事を整え始める', 'half-year-plan.html', '体質を変えられる時期。無理な制限は要りません'],
    ['歯のホワイトニングの方法を決める', 'whitening.html', '3ヶ月以上あれば通院型でも自宅型でも間に合います'],
  ] },
  { id: 'm3', from: 6, to: 3, label: '挙式まで3〜6ヶ月', items: [
    ['ドレスの試着で気になる部位を決める', 'first-fitting.html', '試着の写真を撮っておくと、整える場所がはっきりします'],
    ['ジム・エステの体験を2社受けて比べる', 'bridal-esthe.html', 'ブライダルエステは3ヶ月前に始めるのが標準です', 'trial-collection.html#s3'],
    ['背中・二の腕を整え始める', 'bridal-care.html', '部位ごとに、変わるまでの期間が違います'],
  ] },
  { id: 'm1', from: 3, to: 1, label: '挙式まで1〜3ヶ月', items: [
    ['続けているケアを仕上げる。オンラインなら移動ゼロ', 'three-months-plan.html', '通う時間が取れない時期はオンラインで', 'trial-collection.html#s1'],
    ['ホワイトニングを通院型で進める', 'whitening.html', '1〜2ヶ月なら通院型を数回', 'trial-collection.html#white'],
    ['ムービー・前撮りの準備', 'photo-day-prep.html', '映像は素材集めに時間がかかります'],
  ] },
  { id: 'w2', from: 1, to: 0.5, label: '挙式まで2週間〜1ヶ月', items: [
    ['新しい施術は始めない。肌を崩さない', 'one-month-before.html', '1ヶ月前を切ってからの初めての施術は避けます'],
    ['むくみを抜く食事に切り替える', 'prehana-mukumi.html', '塩分と水分だけでは決まりません'],
  ] },
  { id: 'd1', from: 0.5, to: 0, label: '挙式まで2週間を切った', items: [
    ['日ごとにやること・やらないこと', 'two-weeks-before.html', '足す時期は終わっています'],
    ['前日の食事', 'day-before-meal.html', '急に減らすと当日の顔に出ます'],
  ] },
  { id: 'after', from: 0, to: -99, label: '挙式のあと', items: [
    ['写真を形にする・お礼をする・新生活の準備', 'after-wedding.html', '式のあとにやることをまとめました'],
  ] },
];

const stepHtml = STEPS.map(s => `  <div class="ck-step" data-from="${s.from}" data-to="${s.to}" id="ck-${s.id}">
    <h3>${s.label}</h3>
    <ul class="checks">
${s.items.map(([t, href, d, trial]) => `      <li><a href="${href}" style="${A};font-weight:700">${t}</a><br><span class="small">${d}</span>${trial ? `<br><a href="${trial}" style="${A};font-size:13px">無料・低額で試せるところを見る ＞</a>` : ''}</li>`).join('\n')}
    </ul>
  </div>`).join('\n');

page({
  slug: 'checklist',
  title: '挙式日から逆算する花嫁の準備チェックリスト｜残り期間でやること',
  desc: '挙式日を入れると、残り期間に合わせてやることが分かる花嫁の準備チェックリストです。脱毛・ホワイトニング・エステ・体づくり・前日の食事まで、始める順番を時期別にまとめました。',
  image: 'planning-desk.jpg',
  crumb: '準備チェックリスト',
  body: `
<section class="phero">
  <p class="eyebrow">CHECKLIST</p>
  <h1>挙式日から逆算する、<br>準備チェックリスト</h1>
  <p class="lead">挙式日を入れると、今やることが上に出ます。脱毛のように締め切りが早いものから順に並べています。</p>
</section>

<section>
  <div class="note-box" style="text-align:left">
    <label for="ck-date" style="display:block;font-weight:700;margin:0 0 8px">挙式日（前撮りが先ならその日）</label>
    <input id="ck-date" type="date" style="font-size:16px;padding:10px 12px;border:1px solid #c3d0c0;width:100%;max-width:260px;box-sizing:border-box">
    <label style="display:block;margin:12px 0 0;font-size:14px"><input id="ck-novenue" type="checkbox"> まだ会場が決まっていない</label>
    <p id="ck-out" style="margin:12px 0 0;font-weight:700;color:#b83d63"></p>
    <p class="small" style="margin:6px 0 0">入力した日付はこの端末の中だけで使い、どこにも送りません。</p>
  </div>
</section>

<section>
  <h2 id="now">今やること</h2>
  <div id="ck-now"></div>
  <a class="cta" href="trial-collection.html">無料・低額で試せる体験リストを見る</a>
  <p class="cta-note">ジム・エステ・脱毛のカウンセリング・ホワイトニング・式場フェアを、契約前に試せる形でまとめています</p>
</section>

<section>
  <h2 id="all">時期別のチェックリスト（全体）</h2>
  <div id="ck-all">
${stepHtml}
  </div>
</section>

<section class="next">
  <p class="eyebrow">次に読む</p>
  <p class="small">期間ごとの考え方は<a href="diet-timing.html">時期別ロードマップ</a>、費用の配分は<a href="budget-plan.html">花嫁美容の予算</a>に。</p>
</section>

<style>
.ck-step{margin:0 0 18px;padding:14px 16px;border:1px solid #e8e6e1;background:#fff}
.ck-step h3{margin:0 0 8px;font-size:16px}
.ck-step.ck-hit{border:2px solid #b83d63;background:#fffafb}
.ck-step.ck-done{opacity:.55}
</style>
<script>
(function(){
  var d=document.getElementById('ck-date'),nv=document.getElementById('ck-novenue'),out=document.getElementById('ck-out'),now=document.getElementById('ck-now');
  var steps=[].slice.call(document.querySelectorAll('.ck-step'));
  try{var s=localStorage.getItem('ebn-wedding');if(s)d.value=s;if(localStorage.getItem('ebn-novenue')==='1')nv.checked=true;}catch(e){}
  function run(){
    try{localStorage.setItem('ebn-wedding',d.value);localStorage.setItem('ebn-novenue',nv.checked?'1':'0');}catch(e){}
    now.innerHTML='';
    steps.forEach(function(el){el.classList.remove('ck-hit','ck-done')});
    if(!d.value){out.textContent='';now.innerHTML='<p class="small">挙式日を入れると、ここに今やることが出ます。</p>';return}
    var m=(new Date(d.value)-new Date())/864e5/30.4;
    out.textContent=m>0?'挙式まで約'+(m>=1?Math.round(m)+'ヶ月':Math.max(1,Math.round(m*30.4))+'日'):'挙式は終わっています';
    steps.forEach(function(el){
      var f=+el.dataset.from,t=+el.dataset.to,id=el.id;
      var hit=id==='ck-venue'?nv.checked:(m<=f&&m>t)||(id==='ck-m6'&&m>1);
      if(id==='ck-after')hit=m<=0;
      if(hit){el.classList.add('ck-hit');var c=el.cloneNode(true);c.removeAttribute('id');now.appendChild(c)}

    });
  }
  d.addEventListener('change',run);nv.addEventListener('change',run);run();
})();
</script>
`
});

// ---------- 2. 婚約したら最初にやること（式場探し） ----------
page({
  slug: 'wedding-start',
  title: '婚約したら最初にやること｜式場探しとブライダルフェアの進め方',
  desc: '婚約したら最初に決めるのは会場と日取りです。挙式・フォト婚・少人数婚の選び方、ブライダルフェアの予約と回り方、会場が決まったあとに始める体づくりの順番をまとめました。',
  image: 'hero-bride.jpg',
  crumb: '婚約したら最初にやること',
  body: `
<section class="phero">
  <p class="eyebrow">FIRST STEP</p>
  <h1>婚約したら、<br>最初に決めるのは会場と日取り。</h1>
  <p class="lead">体づくりも肌も脱毛も、すべて挙式日から逆算して決まります。だから最初の一歩は、会場を見に行くことです。</p>
</section>

<section>
  <h2 id="s1">まず形を決める</h2>
  <div class="phase">
    <a href="bridal-fair.html"><span class="t">会場で挙式・披露宴をする</span><span class="d">フェアを回って会場を決める</span></a>
    <a href="small-wedding.html"><span class="t">少人数で行う</span><span class="d">家族中心。距離が近いぶん質感が出る</span></a>
    <a href="photo-only-wedding.html"><span class="t">写真だけ残す（フォト婚）</span><span class="d">1日で終わるからこそ優先順位が変わる</span></a>
    <a href="japanese-wedding.html"><span class="t">和装で行う</span><span class="d">白無垢・色打掛で出る部位</span></a>
  </div>
</section>

<section>
  <h2 id="s2">ブライダルフェアは無料で予約できる</h2>
  <p>フェアは無料で参加でき、模擬挙式や試食、見積もりの相談ができます。<strong>式場探しサイト経由で予約すると、成約時の特典がつくことがあります。</strong>同じ会場でも直接予約では受け取れない特典なので、予約の前に確認しておくと損をしません。</p>
  <a class="cta" href="${HANAYUME}" ${sp}>ハナユメで無料フェアを探す</a>
  ${HANAYUME_PX}
  <p class="cta-note">エリアと希望日から検索できます。予約はWebで完結します</p>
  <p class="small">当日の見方は<a href="bridal-fair.html">ブライダルフェアの選び方と回り方</a>、その場で決めない方法は<a href="bridal-fair-decision.html">フェアで即決しない方法</a>に。</p>
</section>

<section>
  <h2 id="s3">会場が決まったら、その日から逆算する</h2>
  <p>日取りが決まると、締め切りの早い順に手をつけるものが決まります。いちばん早いのは脱毛です。回数と間隔が決まっているため、後から詰めることができません。</p>
  <ul class="checks">
    <li><strong>脱毛</strong>：2〜3ヶ月に1回・5回前後が目安。<a href="hair-removal.html">間に合う期間を確認する</a></li>
    <li><strong>体づくり・食事</strong>：半年あれば体質から整えられます。<a href="half-year-plan.html">半年前からの順番</a></li>
    <li><strong>エステ・ジム</strong>：3ヶ月前に始めるのが標準。<a href="trial-collection.html">契約前に体験で比べる</a></li>
  </ul>
  <a class="cta-sub" href="checklist.html">挙式日から逆算するチェックリストを使う</a>
</section>

<section>
  <h2 id="s4">もう一度フェアを探す</h2>
  <p>気になる会場が2〜3か所に絞れたら、同じ日に回れるかを比べて予約すると効率よく見られます。</p>
  <a class="cta" href="${HANAYUME}" ${sp}>無料フェアの空き状況を見る</a>
</section>
`
});

// ---------- 3. 結婚式のあとにやること ----------
const PHOTOBACK = 'https://px.a8.net/svt/ejp?a8mat=4BA75B+EHJRH6+3WUA+64C3L';
page({
  slug: 'after-wedding',
  title: '結婚式のあとにやること｜写真・お礼・新生活の準備',
  desc: '結婚式が終わったあとにやることを、写真をフォトブックにする、両親へのお礼、新生活の光熱費や食事の整え方、式のあとのリバウンドを防ぐ食べ方の順にまとめました。',
  image: 'healthy-table.jpg',
  crumb: '結婚式のあとにやること',
  body: `
<section class="phero">
  <p class="eyebrow">AFTER THE WEDDING</p>
  <h1>式が終わってから、<br>やっておくこと。</h1>
  <p class="lead">準備に使っていた時間とお金が、式のあとは新しい生活に移ります。写真、お礼、暮らしの順に整理しました。</p>
</section>

<section>
  <h2 id="s1">写真を形にする</h2>
  <p>データのまま置いておくと、ほとんど見返さなくなります。<strong>フォトブックにしておくと、両家への贈り物にもなります。</strong></p>
  <div class="trial">
    <div class="card">
      <a class="thumb" href="${PHOTOBACK}" rel="nofollow sponsored" target="_blank"><img loading="lazy" decoding="async" src="https://www26.a8.net/svt/bgt?aid=260816303876&amp;wid=002&amp;eno=01&amp;mid=s00000018253001028000&amp;mc=1" alt="Photoback" onerror="this.parentNode.style.display='none'"></a>
      <div class="tags"><span class="tag n">フォトブック</span><span class="tag n">ブラウザで編集</span></div>
      <div class="row"><h3>Photoback</h3><span class="price">通販</span></div>
      <p>撮った写真を本の形にまとめられるサービス。ブラウザ上で編集でき、専用ソフトは要りません。</p>
      <a class="apply" href="${PHOTOBACK}" rel="nofollow sponsored" target="_blank">サイズと価格を見る ＞</a>
    </div>
  </div>
</section>

<section>
  <h2 id="s2">お礼をする</h2>
  <p>両親への贈呈品や、当日に残るものの選び方は<a href="wedding-gift.html">両親への贈呈品と、当日に残るもの</a>にまとめています。</p>
</section>

<section>
  <h2 id="s3">式のあとのリバウンドを防ぐ</h2>
  <p>準備期間に食事を絞っていた人ほど、式のあとに戻りやすくなります。<a href="weight-regain.html">式のあとのリバウンド</a>で、戻し方と食べ方を整理しています。</p>
</section>

<section>
  <h2 id="s4">新生活の暮らしを整える</h2>
  <ul class="checks">
    <li><strong>二人暮らしの光熱費</strong>：電気代の目安は<a href="https://kurashi-tanka.com/denki/futari-denki/" target="_blank" rel="noopener">二人暮らしの電気代（くらしの単価表）</a>で確認できます</li>
    <li><strong>共働きの夕食</strong>：毎日作る前提をやめると回りやすくなります。<a href="meal/working-parents.html">共働きの宅配食の選び方</a>、<a href="meal/two-people.html">二人暮らしで宅配食を使う</a></li>
    <li><strong>作り置きと組み合わせる</strong>：<a href="meal/weekend-prep.html">作り置きと宅配食の併用</a></li>
  </ul>
</section>

<section class="next">
  <p class="eyebrow">次に読む</p>
  <p class="small">これから式を迎える友人には<a href="checklist.html">挙式日から逆算するチェックリスト</a>を。</p>
</section>
`
});
