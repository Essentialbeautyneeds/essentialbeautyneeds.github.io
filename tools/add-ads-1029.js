// 2026-10-29 に貼ってもらった A8 の広告（プレ花嫁の準備ノート用のコード）を各ページに載せる
// node tools/add-ads-1029.js   （同じカードがすでにあれば入れない）
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SP = 'rel="nofollow sponsored" referrerpolicy="no-referrer-when-downgrade" target="_blank"';

// [リンク, バナー画像, 0.gif]（貼ってもらったコードそのまま）
const AD = {
  zexy: ['https://px.a8.net/svt/ejp?a8mat=4BA416+BGLFRU+2T18+ZRIB5', 'https://www29.a8.net/svt/bgt?aid=260812266693&wid=002&eno=01&mid=s00000013094006007000&mc=1', 'https://www18.a8.net/0.gif?a8mat=4BA416+BGLFRU+2T18+ZRIB5'],
  nanairo: ['https://px.a8.net/svt/ejp?a8mat=4AX40F+8BH2U2+453S+5ZMCH', 'https://www23.a8.net/svt/bgt?aid=260205711503&wid=002&eno=01&mid=s00000019324001006000&mc=1', 'https://www14.a8.net/0.gif?a8mat=4AX40F+8BH2U2+453S+5ZMCH'],
  calmia: ['https://px.a8.net/svt/ejp?a8mat=45KRG0+5R6W2I+2NSW+C28PT', 'https://www23.a8.net/svt/bgt?aid=251231472348&wid=002&eno=01&mid=s00000012416002026000&mc=1', 'https://www13.a8.net/0.gif?a8mat=45KRG0+5R6W2I+2NSW+C28PT'],
  misspariEsthe: ['https://px.a8.net/svt/ejp?a8mat=4AVAC6+2SMASA+1OGO+656YP', 'https://www24.a8.net/svt/bgt?aid=260120598169&wid=002&eno=01&mid=s00000007836001032000&mc=1', 'https://www19.a8.net/0.gif?a8mat=4AVAC6+2SMASA+1OGO+656YP'],
  pourvous: ['https://px.a8.net/svt/ejp?a8mat=4BA1PC+11IBW2+30NO+5ZU29', 'https://www26.a8.net/svt/bgt?aid=260809248063&wid=001&eno=01&mid=s00000014082001007000&mc=1', 'https://www14.a8.net/0.gif?a8mat=4BA1PC+11IBW2+30NO+5ZU29'],
  nijikai: ['https://px.a8.net/svt/ejp?a8mat=4BERA7+DHTR6I+45X8+BZ0Z5', 'https://www26.a8.net/svt/bgt?aid=261029023816&wid=002&eno=01&mid=s00000019430002011000&mc=1', 'https://www17.a8.net/0.gif?a8mat=4BERA7+DHTR6I+45X8+BZ0Z5'],
  imari: ['https://px.a8.net/svt/ejp?a8mat=4BERA7+F1SI1M+5DSO+601S1', 'https://www21.a8.net/svt/bgt?aid=261029023910&wid=002&eno=01&mid=s00000025116001008000&mc=1', 'https://www14.a8.net/0.gif?a8mat=4BERA7+F1SI1M+5DSO+601S1'],
};
const CARD = {
  zexy: ['ゼクシィ相談カウンター', '無料相談', ['無料相談', '全国'], '式場探しや結婚式の準備を、カウンターで無料で相談できるサービス。予算・人数・雰囲気から会場を提案してもらえます。初めて利用する人が対象で、Webから相談を予約します。', '無料相談を予約 ＞'],
  nanairo: ['ナナイロウエディング', 'ムービー制作', ['プロフィール', 'オープニング', 'エンドロール'], '結婚式のプロフィールムービー・オープニング・エンドロールを制作するサービス。広告主の案内では、修正は無料で何度でも頼めます。式場に持ち込む場合は、持ち込み料がかかるかを先に確認してください。', 'ムービーを見る ＞'],
  calmia: ['カルミア美肌クリニック', '無料カウンセリング', ['医療脱毛', '無料カウンセリング'], '医療脱毛のクリニック。Webで申し込んで、無料カウンセリングで回数とスケジュールを相談できます。挙式日を伝えて、間に合うかを先に聞いておけます。初めて利用する人が対象です。', 'カウンセリングを予約 ＞'],
  misspariEsthe: ['エステティック ミス・パリ', '体験あり', ['エステ', 'ブライダル'], 'ブライダルエステも扱うエステサロンの体験コース。内容は店舗や時期で変わるので、予約の前に確認してください。20歳未満・男性・過去に体験した人は対象外です。', '体験の内容を見る ＞'],
  pourvous: ['Pour Vous（プール・ヴー）', '通販', ['パーティードレス', 'ワンピース'], 'パーティードレスやワンピースの通販。会食や二次会で着る服を、着る日に合わせて選べます。広告主の案内では、平日16時までの注文は当日に発送されます。', 'ドレスを見る ＞'],
  nijikai: ['2次会くん', '無料相談会', ['二次会', '幹事代行'], '結婚式の二次会の幹事を代行するサービス。無料の相談会で、会場や進行を相談できます。提携している会場がある地域が対象です。', '無料相談会を見る ＞'],
  imari: ['伊萬里牛 松尾勝馬牧場', '通販', ['和牛ギフト', '佐賀県'], '佐賀県の牧場のブランド和牛ギフト。両家の顔合わせのお礼や、遠方の親族への内祝いなど、食べものを贈りたい場合の選択肢です。', 'ギフトを見る ＞'],
};
function card(k) {
  const [href, img] = AD[k];
  const [name, price, tags, desc, cta] = CARD[k];
  return `    <div class="card">
      <a class="thumb" href="${href}" ${SP}><img src="${img}" alt="${name}" loading="lazy" onerror="this.parentNode.style.display='none'"></a>
      <div class="tags">${tags.map(t => `<span class="tag n">${t}</span>`).join('')}</div>
      <div class="row"><h3>${name}</h3><span class="price">${price}</span></div>
      <p>${desc}</p>
      <a class="apply" href="${href}" ${SP}>${cta}</a>
    </div>
`;
}
function divEnd(h, start) {
  const re = /<div(?![a-zA-Z-])|<\/div>/g; re.lastIndex = start;
  let d = 0, m;
  while ((m = re.exec(h))) { d += m[0] === '</div>' ? -1 : 1; if (d === 0) return m.index; }
  return -1;
}
// h2#id の後ろの最初の .trial の最後にカードを足す
function intoTrial(h, id, k) {
  if (h.includes(AD[k][0])) return h;
  const s = h.indexOf(`id="${id}"`);
  const t = h.indexOf('<div class="trial">', s);
  const next = h.indexOf('<h2', s + 5);
  if (s < 0 || t < 0 || (next > 0 && t > next)) throw new Error(`no trial after #${id}`);
  const e = divEnd(h, t);
  return h.slice(0, e) + card(k) + '  ' + h.slice(e);
}
function edit(f, fn) {
  const p = path.join(ROOT, f);
  let h = fs.readFileSync(p, 'utf8');
  const crlf = h.includes('\r\n'); h = h.replace(/\r\n/g, '\n');
  const after = fn(h);
  fs.writeFileSync(p, crlf ? after.replace(/\n/g, '\r\n') : after);
  console.log('edited', f);
}
const section = (id, title, lead, keys) => `<section>
  <h2 id="${id}">${title}</h2>
  <p>${lead}</p>
  <div class="trial">
${keys.map(card).join('')}  </div>
</section>

`;

// 婚約したら最初にやること：ハナユメの下に、ゼクシィの相談カウンター
edit('wedding-start.html', h => h.includes(AD.zexy[0]) ? h : h.replace(
  /(<p class="small">当日の見方は)/,
  `<p>会場を見る前に、何を基準に選べばいいか分からない場合は、相談カウンターで条件を整理してもらう方法もあります。</p>\n  <div class="trial">\n${card('zexy')}  </div>\n  $1`));
// ブライダルフェア：予約の節にゼクシィ、ムービーの節にナナイロ
edit('bridal-fair.html', h => {
  h = intoTrial(h, 's6', 'nanairo');
  if (!h.includes(AD.zexy[0])) h = h.replace(/(<p class="cta-note">エリアと希望日から検索できます。予約はWebで完結します<\/p>)/,
    `$1\n  <p>フェアの前に条件を整理したい場合は、無料の相談カウンターも使えます。</p>\n  <div class="trial">\n${card('zexy')}  </div>`);
  return h;
});
// 脱毛：カルミア
edit('hair-removal.html', h => intoTrial(h, 's4', 'calmia'));
edit('nape-hair-removal.html', h => intoTrial(h, 's6', 'calmia'));
// ブライダルエステ：エステティック ミス・パリ
edit('bridal-esthe.html', h => intoTrial(h, 's3', 'misspariEsthe'));
// 体験リスト：脱毛にカルミア、エステにミス・パリ、会場の節にゼクシィ
edit('trial-collection.html', h => {
  h = intoTrial(h, 'datsumo', 'calmia');
  h = intoTrial(h, 's4', 'misspariEsthe');
  if (!h.includes(AD.zexy[0])) h = h.replace(/(<p class="cta-note">式場探しサイト経由の予約は、成約時の特典がつくことがあります。[^\n]*<\/p>)/,
    `$1\n  <div class="trial">\n${card('zexy')}  </div>`);
  return h;
});
// 少人数婚：会食・二次会の節（Pour Vous・2次会くん）
edit('small-wedding.html', h => h.includes(AD.pourvous[0]) ? h : h.replace('<section class="next">',
  section('s7', '会食・二次会の準備', '少人数婚では、式のあとに会食や二次会を別に行うことがあります。着る服と、二次会の幹事を誰が担うかを先に決めておくと、当日の負担が減ります。', ['pourvous', 'nijikai']) + '<section class="next">'));
// 両親への贈呈品：食べものを贈る場合（伊萬里牛）
edit('wedding-gift.html', h => h.includes(AD.imari[0]) ? h : h.replace('<section class="next">',
  section('s5', '食べものを贈る場合', '顔合わせのお礼や、式に来られなかった親族への内祝いでは、形に残るものより食べものを選ぶ人もいます。', ['imari']) + '<section class="next">'));
