// もしもで提携した体験の案件をハブと体験リストに足す（2026-11-11）
// カードの文言は、もしもの広告主の案内（プロモーション詳細）の事実だけを使う。最上級・効果の約束は書かない
// 使い方：node tools/add-moshimo-20261111.js   （何度実行してもよい）
const fs = require('fs'), path = require('path');
const R = path.resolve(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(R, f), 'utf8');
const write = (f, s) => fs.writeFileSync(path.join(R, f), s);

// もしもの広告コード（美容のお試しノート用に取得したもの）から、クリックの URL とバナー画像
const M = (a, p, pc, pl, img) => ({ href: `//af.moshimo.com/af/c/click?a_id=${a}&p_id=${p}&pc_id=${pc}&pl_id=${pl}`, img: `//image.moshimo.com/af-img/${img}` });
const card = (name, ad, tags, price, text, cta) => `    <div class="card">
      <a class="thumb" href="${ad.href}" rel="nofollow sponsored" referrerpolicy="no-referrer-when-downgrade" target="_blank"><img src="${ad.img}" alt="${name}" loading="lazy" onerror="this.parentNode.style.display='none'"></a>
      <div class="tags">${tags.map(([c, t]) => `<span class="tag ${c}">${t}</span>`).join('')}</div>
      <div class="row"><h3>${name}</h3><span class="price">${price}</span></div>
      <p>${text}</p>
      <a class="apply" href="${ad.href}" rel="nofollow sponsored" referrerpolicy="no-referrer-when-downgrade" target="_blank">${cta} ＞</a>
    </div>
`;
const C = {
  zenna: card('ZENNA（ゼンナ）', M(5385654, 2713, 6124, 37197, '2151/000000037197.jpg'), [['n', 'オンライン'], ['free', '無料体験60分']], '無料体験',
    'Zoom でトレーナーと1対1で行うオンラインの指導。無料体験は60分で、月額制のコースがあります。家で運動を続けたい人向け。', '無料体験を予約'),
  fit24: card('FiT24', M(5385633, 7246, 20781, 97584, '6112/000000097584.jpg'), [['n', '全国'], ['n', '24時間'], ['free', '無料体験']], '無料体験',
    '北海道から沖縄まで店舗がある24時間のフィットネスジム。マシン中心で、スタッフのサポートがあります。家族・U22・高校生向けのプランもあります。', '無料体験を予約'),
  dep: card('DEP（マシンピラティス）', M(5385645, 6283, 17695, 84143, '6083/000000084143.jpg'), [['n', 'マシンピラティス'], ['n', '個別指導'], ['free', '体験あり']], '体験あり',
    'マシンピラティスの個別レッスン。指導するのは理学療法士・作業療法士と案内されています。全国に店舗があり、入会金と年会費はかかりません。', '体験を予約'),
  beat: card('Beat Pilates（ビートピラティス）', M(5385643, 6411, 18116, 83032, '6238/000000083032.jpg'), [['n', '女性専用'], ['n', 'マシンピラティス'], ['free', '体験あり']], '体験あり',
    '暗くした空間で、音楽に合わせて行うマシンピラティスのスタジオ。周りの目が気になって運動を始めにくい人に向いています。', '体験を予約'),
  forza: card('Forzaフィットネススタジオ', M(5385644, 6412, 18118, 82795, '6238/000000082795.jpg'), [['n', '女性中心'], ['n', 'セミパーソナル'], ['free', '体験・見学']], '体験・見学',
    'トレーナーが少人数を同時に見るセミパーソナル形式。マシンピラティス、筋トレ、キックボクシングなどから選べます。一部の店舗を除き女性専用です。', '体験を予約'),
  dee: card('Dee GYM', M(5369988, 7179, 20557, 90455, '6952/000000090455.png'), [['n', '東京'], ['n', 'パーソナル'], ['free', '無料体験']], '無料体験',
    '渋谷・恵比寿・銀座・新宿など都内の店舗で受けるパーソナルジム。料金は1回6,600円からと案内されており、まず1回試しやすい形です。', '無料体験を予約'),
  kompas: card('STUDIO KOMPAS', M(5369995, 5582, 15309, 71905, '5252/000000071905.jpg'), [['n', '渋谷'], ['n', '都度払い'], ['free', '無料体験']], '無料体験',
    '渋谷にある、1回ごとに払う形のパーソナルジム。コースや回数券の契約がなく、ウェアは無料で借りられます。', '無料体験を予約'),
  kenon: card('ケノン', M(5267467, 3386, 8050, 49056, '2769/000000049056.jpg'), [['n', '自宅'], ['n', '家庭用の美容器']], '購入',
    '家庭用の光美容器。クリニックやサロンに通う前に、自宅でできる方法とも比べたい人向けです。購入する前に、使えない部位や肌の条件、保証の内容を公式サイトで確かめてください。', '公式サイトで見る'),
};

// 見出しのある section の、カードの並び（.trial）の最後に足す
function addToSection(file, h2re, html, key) {
  let s = read(file);
  if (s.includes(key)) return false;
  const i = s.search(h2re); if (i < 0) throw new Error(file + ' に見出しがない ' + h2re);
  const end = s.indexOf('</section>', i);
  const close = s.lastIndexOf('  </div>', end);
  s = s.slice(0, close) + html + s.slice(close);
  write(file, s); return true;
}
// 新しい section を、指定した見出しの section の前に入れる
function addSection(file, beforeRe, html, key) {
  let s = read(file);
  if (s.includes(key)) return false;
  const i = s.search(beforeRe); if (i < 0) throw new Error(file + ' に見出しがない ' + beforeRe);
  const at = s.lastIndexOf('<section>', i);
  s = s.slice(0, at) + html + '\n' + s.slice(at);
  write(file, s); return true;
}
const pilates = `<section>
  <h2 id="pilates">マシンピラティス・少人数で見てもらう</h2>
  <p class="lead">ひとりでは続かないけれど、パーソナルジムほど費用はかけたくない場合の選択肢。体験の条件と通える店舗を、公式サイトで確かめてから予約してください。</p>
  <div class="trial">
${C.beat}${C.forza}${C.dep}  </div>
</section>
`;
const tokyo = `<section>
  <h2 id="tokyo">東京で通うなら｜1回ずつ試せるパーソナルジム</h2>
  <p class="lead">コースの契約の前に、1回ずつ試せるパーソナルジム。都内に通える人向けです。</p>
  <div class="trial">
${C.dee}${C.kompas}  </div>
</section>
`;
const home = `<section>
  <h2 id="home">自宅で試す｜家庭用の美容器</h2>
  <p class="lead">クリニックやサロンの脱毛とは仕組みも費用の払い方も違います。通う時間が取りにくい場合に、比べる候補として載せています。</p>
  <div class="trial">
${C.kenon}  </div>
</section>
`;
const log = [];
for (const f of ['gym.html', 'trial-collection.html']) {
  if (addToSection(f, /<h2[^>]*>オンラインで完結するもの<\/h2>/, C.zenna, 'p_id=2713&')) log.push(f + ' ZENNA');
  if (addToSection(f, /<h2[^>]*>通うタイプ｜全国に店舗があるもの<\/h2>/, C.fit24, 'p_id=7246&')) log.push(f + ' FiT24');
  if (addSection(f, /<h2[^>]*>集中して仕上げたい場合<\/h2>/, pilates, 'id="pilates"')) log.push(f + ' ピラティスの節');
  if (addSection(f, /<h2[^>]*>集中して仕上げたい場合<\/h2>/, tokyo, 'id="tokyo"')) log.push(f + ' 東京の節');
}
if (addSection('datsumo.html', /<h2[^>]*>脱毛の記事<\/h2>/, home, 'id="home"')) log.push('datsumo.html 自宅で試す');
console.log(log.join('\n') || '変更なし');
