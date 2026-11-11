// 新しい分類「自宅で試す」（お試しセット・家庭用の美容器）を作り、ナビ・フッター・sitemap に足す（2026-11-11）
// 条件は、広告主が A8.net・もしもアフィリエイトに出している案内（2026-11-11 確認。ミラブルEx は販売元の公式通販の案内も）から、確認できたものだけを書く。効果・効能は書かない
// 使い方：node tools/make-home-trial.js   （何度実行してもよい）
const fs = require('fs'), path = require('path');
const R = path.resolve(__dirname, '..'); const SITE = 'https://essential-beauty-needs.com/';
const read = (f) => fs.readFileSync(path.join(R, f), 'utf8'); const write = (f, s) => fs.writeFileSync(path.join(R, f), s);
const tpl = read('datsumo.html');
const HEADMID = tpl.slice(tpl.indexOf('<link rel="icon"'), tpl.indexOf('<script type="application/ld+json">'));

// 広告（A8 は「美容のお試しノート」用に作成したリンク、もしもは原稿取得のもの）
const A8 = (mat, host, aid, mid) => ({ href: `https://px.a8.net/svt/ejp?a8mat=${mat}`, img: `https://${host}.a8.net/svt/bgt?aid=${aid}&wid=002&eno=01&mid=${mid}&mc=1` });
const MO = (a, p, pc, pl, img) => ({ href: `//af.moshimo.com/af/c/click?a_id=${a}&p_id=${p}&pc_id=${pc}&pl_id=${pl}`, img: `//image.moshimo.com/af-img/${img}` });
const card = (name, ad, tags, price, text, cta) => `    <div class="card">
      <a class="thumb" href="${ad.href}" rel="nofollow sponsored" referrerpolicy="no-referrer-when-downgrade" target="_blank"><img src="${ad.img}" alt="${name}" loading="lazy" onerror="this.parentNode.style.display='none'"></a>
      <div class="tags">${tags.map(([c, t]) => `<span class="tag ${c}">${t}</span>`).join('')}</div>
      <div class="row"><h3>${name}</h3><span class="price">${price}</span></div>
      <p>${text}</p>
      <a class="apply" href="${ad.href}" rel="nofollow sponsored" referrerpolicy="no-referrer-when-downgrade" target="_blank">${cta} ＞</a>
    </div>
`;
const SET = [
  ['オルビス ザ クレンジング オイル', A8('4BGINP+9FD4D6+1USQ+4YMOMP', 'www25', '261111157570', 's00000008657030003000'), [['free', '初回限定'], ['n', '公式通販']], '初回限定',
    'オルビスのメイク落とし（クレンジングオイル）。広告主の案内では、公式通販限定の初回セットが2,200円です。定期購入の条件がつくかは、申し込みの画面で確かめてください。', '初回セットを見る',
    '公式通販限定の初回セット 2,200円（広告主の案内）', '定期購入の条件の有無、送料'],
  ['オルビス ブライト', A8('4BGINP+AGVFH6+1USQ+44VNJ5', 'www24', '261111157633', 's00000008657025006000'), [['free', '初回限定'], ['n', '返金保証あり']], '初回限定',
    'オルビスのブライト シリーズを試せる、初回限定の体験セット。初回の送料は無料と案内されています。返金保証の制度がありますが、使える条件は公式サイトで確かめてください。', '体験セットを見る',
    '初回限定の体験セット、初回送料無料、返金保証の制度あり', '返金保証の期限と、使用後でも使えるか'],
  ['SNo.クリアエッセンス', A8('4BGINP+A7XXEI+5XZC+5YZ75', 'www20', '261111157618', 's00000027732001003000'), [['n', '定期便'], ['free', '回数の縛りなし']], '定期便',
    '皮脂や毛穴が気になる人向けの、定期便の美容液。広告主の案内では、回数の縛りがない定期便で、届く間隔を30〜90日の間で変えられます。', '内容を見る',
    '回数の縛りなしの定期便、配送間隔30〜90日で変更可（広告主の案内）', '解約の連絡の期限と方法'],
  ['BQCELL ダーマスキンピーリング', A8('4BGINP+AJ95WA+4GDM+HW2Q9', 'www28', '261111157637', 's00000020785003005000'), [['n', '自宅でピーリング'], ['n', '初回購入']], '初回購入',
    '韓国のブランド BQCELL の、自宅で使うピーリング。肌が敏感な人は、使い方と注意事項を公式サイトで読んでから使ってください。', '公式サイトで見る',
    '初めて買う人向けの案内（広告主の案内）', '使ってはいけない肌の状態、使う頻度'],
  ['琉白（るはく）', MO(5267364, 2679, 6020, 34352, '2138/000000034352.gif'), [['n', 'オーガニック'], ['free', 'トライアルセット']], 'トライアル',
    '沖縄の月桃を使ったオーガニックコスメのブランド。いくつかの品をまとめて試せるトライアルセットがあります。', 'トライアルセットを見る',
    'トライアルセットあり（初めて買う人が対象）', 'セットの中身と容量、定期購入の案内の有無'],
  ['Re:needle（リニードル）セラム', A8('4BGINP+A0SQ56+4TX4+1BNQZ5', 'www26', '261111157606', 's00000022540008005000'), [['n', '定期コース'], ['n', '針美容液']], '定期',
    '細かい針（マイクロニードル）を使った美容液。定期のトクトクコースと、3本おまとめコースがあります。販売会社の案内では、定期には受け取る回数の決まりがあり、解約は電話で次のお届けの10日前までです。', '内容を見る',
    '定期のトクトクコース、3本おまとめコース（販売会社の案内）', '定期の規定回数、解約は電話のみ（次のお届けの10日前まで）、返品はできない'],
  ['リフトマキシマイザー', A8('4BGINP+AAX3FE+44UC+BXYE9', 'www22', '261111157623', 's00000019290002006000'), [['n', '目元・口元用'], ['n', 'スティック型']], '購入',
    '目元や口元に塗る、スティック型の美容液バーム。ヒト幹細胞培養エキスや、3種のセラミドなどを配合していると案内されています。', '内容を見る',
    'スティック型の美容液バーム（広告主の案内）', '定期購入の案内の有無、肌に合わないときの対応'],
  ['VINOM（ビノム）', A8('4BGINP+A1ZLCQ+44UC+1BNJ9D', 'www23', '261111157608', 's00000019290008004000'), [['n', '美容スムージー'], ['free', '初回購入']], '初回購入',
    '朝の1杯に向けて作られた美容スムージー。広告主の案内では、コラーゲンペプチドを1杯に1,000mg配合し、1杯11kcalです。', '内容を見る',
    '初めて買う人向けの初回購入（広告主の案内）', '定期購入かどうか、2回目からの価格'],
];
const DEV = [
  ['トリア 4X', A8('4BGH3O+AJ95WA+54TM+HY7W1', 'www27', '261109140637', 's00000023953003015000'), [['n', '家庭用レーザー脱毛器'], ['n', '1年保証']], '購入',
    'ダイオードレーザーを使う家庭用の脱毛器。広告主の案内では1年保証つきで、返金保証の制度もあります。使えない部位や肌の条件を、買う前に確かめてください。', '公式サイトで見る',
    '1年保証、返金保証の制度あり（広告主の案内）', '返金保証の日数と条件、使えない部位'],
  ['JOVS Dora Scroll', A8('4BGH3O+9QOCUY+5W9E+5ZEMP', 'www24', '261109140589', 's00000027509001005000'), [['n', '家庭用光美容器'], ['n', 'スクロール型']], '購入',
    '肌の上を転がして使う、スクロール型の家庭用光美容器。返金保証の制度がありますが、日数と条件は公式サイトで確かめてください。', '公式サイトで見る',
    '返金保証の制度あり（広告主の案内）', '返金保証の日数と条件、正規販売店で買うこと'],
  ['ミラブルEx', A8('4BGINP+A36GKA+4X44+TU14H', 'www26', '261111157610', 's00000022954005011000'), [['n', 'シャワーヘッド'], ['n', 'メーカー保証1年']], '購入',
    '細かい泡（ウルトラファインバブル）を出すシャワーヘッド。販売元の公式通販の案内では、メーカー保証は1年です。自分の都合での返品は受け付けていないため、今のシャワーに取り付けられるかを買う前に確かめてください。', '公式サイトで見る',
    'メーカー保証1年、5,000円以上で送料無料（販売元の公式通販の案内）', '自分の都合での返品はできない、今のシャワーに取り付けられるか'],
  ['ケノン', MO(5267467, 3386, 8050, 49056, '2769/000000049056.jpg'), [['n', '家庭用光美容器'], ['n', '自宅']], '購入',
    '家庭用の光美容器。クリニックやサロンに通う前に、自宅でできる方法とも比べたい人向けです。購入する前に、使えない部位や肌の条件、保証の内容を公式サイトで確かめてください。', '公式サイトで見る',
    'メーカー保証あり', '保証の期間、使えない部位'],
  ['NIPLUX（ニップラックス）', A8('4BGINP+A8JD0A+4QVE+62ENL', 'www22', '261111157619', 's00000022145001019000'), [['n', '美容家電'], ['n', 'EMS']], '購入',
    'EMS などを使う健康・美容家電のブランド。首まわりの NECK RELAX など、使う部位ごとの機器があります。', '公式ストアで見る',
    'ブランドの公式ストアで購入（広告主の案内）', '保証の期間、使えない人の条件（取扱説明書）'],
  ['Re・De（リデ）', A8('4BGINP+ACPE8Q+4KJC+HXSGH', 'www25', '261111157626', 's00000021324003013000'), [['n', '美容家電'], ['n', '美容室発']], '購入',
    '美容室から生まれたブランドの美容家電。ドライヤー（Hairdry+）、スティック美顔器（Suhada）、ストレートアイロンがあります。', '公式ストアで見る',
    'ドライヤー・スティック美顔器・ストレートアイロン（広告主の案内）', '保証の期間、返品の条件'],
];
const HAIR = [
  ['CHOUCHOU（シュシュ）', A8('4BGINP+9ERORE+4KJC+631SX', 'www20', '261111157569', 's00000021324001022000'), [['n', 'サロン専売品'], ['n', '美容室が運営']], '通販',
    '美容室が運営する、サロン専売のヘアケア用品の通販。シャンプー・トリートメント・ドライヤー・ヘアアイロンなどを扱っています。', 'ショップを見る',
    '美容室が運営、メーカー正規販売店の認証あり（広告主の案内）', '送料、返品の条件'],
];

const td = 'style="padding:8px;border-bottom:1px solid #e8e6e1;vertical-align:top"';
const th = 'style="text-align:left;padding:8px;border-bottom:1px solid #e8e6e1;vertical-align:top;font-weight:700"';
const table = (rows) => `<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.7"><thead><tr><th ${th}>名前</th><th ${th}>確認できた条件</th><th ${th}>申し込む前に確かめること</th></tr></thead><tbody>
${rows.map((r) => `<tr><td ${td}>${r[0]}</td><td ${td}>${r[6]}</td><td ${td}>${r[7]}</td></tr>`).join('\n')}
</tbody></table></div>`;

const title = '自宅で試す美容｜お試しセットと家庭用美容器を条件で比べる';
const desc = '初回限定のお試しセットや定期便の化粧品、家庭用の脱毛器・光美容器・美容家電を、初回の条件・定期の縛り・返金保証・保証期間で比べます。広告主の案内で確認できた条件だけを載せています。';
const file = 'home-trial.html', url = SITE + file;
const ld = { '@context': 'https://schema.org', '@graph': [{ '@type': 'CollectionPage', name: title, description: desc, url, dateModified: '2026-11-11', publisher: { '@type': 'Organization', name: 'Essential Beauty Needs', url: SITE } }, { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'トップ', item: SITE }, { '@type': 'ListItem', position: 2, name: '自宅で試す', item: url }] }] };

// ナビとフッターを足してから、ページの部品を読む
const NAV = '<a href="home-trial.html">自宅で試す</a>';
let navAdded = 0, footAdded = 0;
for (const f of fs.readdirSync(R).filter((x) => x.endsWith('.html'))) {
  let b = read(f); const o = b;
  if (/http-equiv="refresh"/i.test(b)) continue;
  if (!b.includes(NAV)) b = b.replace(/(\n(\s*)<a href="teeth\.html">ホワイトニング<\/a>)/, (m, all, sp) => `${all}\n${sp}${NAV}`);
  const fm = b.match(/\n(\s*)<a href="teeth\.html" (style="[^"]*")>歯のホワイトニング<\/a>/);
  if (fm && !b.includes('href="home-trial.html" style=')) b = b.replace(fm[0], `${fm[0]}\n${fm[1]}<a href="home-trial.html" ${fm[2]}>自宅で試す（お試しセット・美容器）</a>`);
  if (b !== o) { if (b.includes(NAV)) navAdded++; footAdded++; write(f, b); }
}
const tpl2 = read('datsumo.html');
const HEADER = tpl2.match(/<header class="site-head">[\s\S]*?<\/header>/)[0];
const FOOTER = tpl2.match(/<footer class="site-foot">[\s\S]*?<\/footer>/)[0];
const BAR = tpl2.match(/<!-- ebn-bar -->[\s\S]*?<!-- \/ebn-bar -->/)[0];

const html = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}｜Essential Beauty Needs</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${title}｜Essential Beauty Needs">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}images/esthe.jpg">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
${HEADMID}<script type="application/ld+json">
${JSON.stringify(ld, null, 1)}
</script>
</head>
<body>
${HEADER}
<main>
<div class="wrap">
<nav class="crumb" aria-label="現在位置" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12px;color:#6f6a67;padding:14px 0 0;font-family:'Zen Kaku Gothic New',sans-serif"><a href="index.html" style="color:#8c4a5c">トップ</a><span>›</span><span>自宅で試す</span></nav>
<section class="phero">
  <p class="eyebrow">TRY AT HOME</p>
  <h1>自宅で試すなら、<br>効果より条件を先に比べる。</h1>
  <p class="lead">お試しセットや家庭用の美容器は、店舗の体験と違って、申し込んだあとに定期購入や返品の条件が関わります。このページでは、初回の条件、定期の縛り、返金保証、保証期間を並べました。効果や使い心地は人によって違うため、ここでは扱いません。</p>
</section>

<section>
  <h2 id="check">申し込む前に比べる5つの項目</h2>
  <ul>
    <li><strong>初回の価格</strong>：初回限定の価格と、2回目からの価格の両方を見る</li>
    <li><strong>定期購入の縛り</strong>：回数の決まりがあるか、途中でやめると何か払うか</li>
    <li><strong>解約の期限と方法</strong>：次の発送の何日前までに、電話・Web のどちらで連絡するか</li>
    <li><strong>返金保証</strong>：何日以内か、使ったあとでも使えるか、送料は誰が払うか</li>
    <li><strong>保証期間（美容器）</strong>：故障したときの保証の年数と、正規の販売店で買う必要があるか</li>
  </ul>
  <p class="small">店舗で受ける無料体験は<a href="trial-collection.html">無料・低額で試せる体験リスト</a>にまとめています。</p>
</section>

<section>
  <h2 id="set">初回限定・お試しセット（化粧品）</h2>
  <p class="lead">肌に合うかは使ってみないと分かりません。少ない量で試せるものから始め、肌に異常が出たら使うのをやめてください。</p>
  <div class="trial">
${SET.map((s) => card(...s.slice(0, 6))).join('')}  </div>
  ${table(SET)}
</section>

<section>
  <h2 id="device">家庭用の美容器・美容家電</h2>
  <p class="lead">クリニックやサロンの脱毛とは、仕組みも費用の払い方も違います。1回で払う金額が大きいので、返金保証と保証期間を先に確かめましょう。<a href="datsumo.html">脱毛の無料カウンセリング</a>とも比べられます。</p>
  <div class="trial">
${DEV.map((s) => card(...s.slice(0, 6))).join('')}  </div>
  ${table(DEV)}
</section>

<section>
  <h2 id="hair">ヘアケアはサロン専売品から選ぶ</h2>
  <p class="lead">ドライヤーやシャンプーは毎日使うものです。美容室で使われている品を、通販で買える店をまとめました。</p>
  <div class="trial">
${HAIR.map((s) => card(...s.slice(0, 6))).join('')}  </div>
  ${table(HAIR)}
</section>

<section class="next">
  <p class="small">出典：各社が A8.net・もしもアフィリエイトに出している広告主の案内と、ミラブルEx・Re:needle は販売元の公式通販の案内（2026年11月11〜12日確認）。価格・キャンペーン・保証の内容は変わるため、申し込む前に各社の公式サイトで最新の内容を確かめてください。</p>
  <p class="small">ほかの分類も見る：<a href="datsumo.html">脱毛</a>・<a href="esthe.html">エステ</a>・<a href="gym.html">ジム・ヨガ</a>・<a href="teeth.html">ホワイトニング</a>・<a href="bridal.html">花嫁の準備</a></p>
</section>
</div>
</main>
${FOOTER}
${BAR}
</body>
</html>
`;
write(file, html);
// 脱毛の「自宅で試す」の節から、このページへ
let d = read('datsumo.html');
if (!d.includes('href="home-trial.html">お試しセットと家庭用美容器の比較')) {
  d = d.replace(/(<h2 id="home">自宅で試す｜家庭用の美容器<\/h2>\n\s*<p class="lead">[^<]*)/, '$1 ほかの美容器やお試しセットは<a href="home-trial.html">お試しセットと家庭用美容器の比較</a>にまとめています。');
  write('datsumo.html', d);
}
let sm = read('sitemap.xml');
if (!sm.includes(url)) { sm = sm.replace('</urlset>', `  <url>\n    <loc>${url}</loc>\n    <lastmod>2026-11-11</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n</urlset>`); write('sitemap.xml', sm); }
console.log('made', file, '| nav added', navAdded, '| footer/nav files changed', footAdded);
