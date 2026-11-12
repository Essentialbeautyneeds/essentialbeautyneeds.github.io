// もしもで提携中の ARISANFIT（promotion 6189・無料体験申込→入会で成果）を、ジムのハブと体験リストの「東京」の節の先頭に足す（2026-11-12）
// 池袋店は 2026-11-12〜12-15 に特別単価のため、池袋の店舗を見出しと本文で目立たせる
// カードの文言は、もしもの広告主の案内（プロモーション詳細）の事実だけを使う。体型の変化などの効果の言い方は書かない
// 使い方：node tools/add-arisanfit-20261112.js   （何度実行してもよい）
const fs = require('fs'), path = require('path');
const R = path.resolve(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(R, f), 'utf8');
const write = (f, s) => fs.writeFileSync(path.join(R, f), s);
const href = '//af.moshimo.com/af/c/click?a_id=5346650&p_id=6189&pc_id=17406&pl_id=80222';
const img = '//image.moshimo.com/af-img/3167/000000080222.png';
const card = `    <div class="card">
      <a class="thumb" href="${href}" rel="nofollow sponsored" referrerpolicy="no-referrer-when-downgrade" target="_blank"><img src="${img}" alt="ARISANFIT" loading="lazy" onerror="this.parentNode.style.display='none'"></a>
      <div class="tags"><span class="tag n">渋谷・池袋・東高円寺</span><span class="tag n">女性向け</span><span class="tag free">無料体験</span></div>
      <div class="row"><h3>ARISANFIT（アリサンフィット）</h3><span class="price">無料体験</span></div>
      <p>渋谷・池袋・東高円寺の、どの店舗も駅から徒歩4分以内にあるパーソナルジム。広告主の案内では、通う人の8割以上が初心者の女性で、通常10,000円の体験が無料です。入会金などのキャンペーンは時期で変わるため、公式サイトで確かめてください。</p>
      <a class="apply" href="${href}" rel="nofollow sponsored" referrerpolicy="no-referrer-when-downgrade" target="_blank">池袋・渋谷の無料体験を予約 ＞</a>
    </div>
`;
const log = [];
for (const f of ['gym.html', 'trial-collection.html']) {
  let s = read(f);
  if (s.includes('ARISANFIT（アリサンフィット）')) continue;
  s = s.replace('<h2 id="tokyo">東京で通うなら｜1回ずつ試せるパーソナルジム</h2>\n  <p class="lead">コースの契約の前に、1回ずつ試せるパーソナルジム。都内に通える人向けです。</p>\n  <div class="trial">\n',
    `<h2 id="tokyo">東京で通うなら｜池袋・渋谷で無料体験できるパーソナルジム</h2>\n  <p class="lead">コースの契約の前に、無料体験や1回ずつで試せるパーソナルジム。池袋・渋谷など都内に通える人向けです。</p>\n  <div class="trial">\n${card}`);
  if (!s.includes('ARISANFIT（アリサンフィット）')) throw new Error(f + ' に東京の節が見つからない');
  write(f, s); log.push(f);
}
console.log(log.join(', ') || '変更なし');
// パーソナルジムの比較ページ：ボタンの文言に池袋・渋谷を入れる
{
  const f = 'personal-gym.html'; let s = read(f);
  const a = 'rel="nofollow sponsored" target="_blank">無料体験を予約 ＞</a>';
  const i = s.indexOf('p_id=6189&pc_id=17406&pl_id=80222" rel="nofollow sponsored" target="_blank">無料体験を予約 ＞</a>');
  if (i >= 0) { s = s.slice(0, i) + s.slice(i).replace(a, 'rel="nofollow sponsored" target="_blank">池袋・渋谷の無料体験を予約 ＞</a>'); write(f, s); console.log(f, 'ボタンの文言'); }
}
