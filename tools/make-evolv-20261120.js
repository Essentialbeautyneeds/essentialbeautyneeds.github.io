// 2026-11-20 新規：evolv-trial.html（Evolv の無料体験）と、ジム・体験リストへのカード
// 広告は ValueCommerce（サイト：美容のお試しノート sid=3758464、プログラム 2176014）。コードは管理画面のまま（rel に sponsored を足すだけ）
// 条件は公式サイト（evolv-ems.com の price・faq・studios・law・contraindication）を 2026-11-20 に確認
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SLUG = 'evolv-trial.html';

const VC = (pid) => `//ck.jp.ap.valuecommerce.com/servlet/referral?sid=3758464&pid=${pid}`;
const PX = (pid, extra = '') => `<img src="//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3758464&pid=${pid}" height="1" width="1" border="0"${extra}>`;
const BANNER = `<a class="thumb" href="${VC(892753091)}" rel="nofollow sponsored" target="_blank"><img src="//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3758464&pid=892753091" border="0" alt="Evolv（エボルブ）EMSフィットネス"></a>`;
const BTN = (label) => `<a class="apply" href="${VC(892753093)}" rel="nofollow sponsored" target="_blank">${PX(892753093, ' alt="" style="position:absolute"')}${label}</a>`;
const TEXT = `<a href="${VC(892753092)}" rel="nofollow sponsored" target="_blank">${PX(892753092)}EMSフィットネススタジオ Evolv｜体験予約はこちら</a>`;

const TITLE = 'Evolv（エボルブ）の無料体験｜所要時間・持ち物・月会費と解約の期限';
const DESC = 'EMSスーツを着て行う1回20分のマシンピラティス「Evolv（エボルブ）」の体験は、公式サイトで無料と案内されています。来店から約1時間〜1時間半、手ぶらで行けます。当日入会の特典、月会費、解約の期限、受けられない人の条件を公式の記載でまとめました。';
const KW_STYLE = "display:block;font-family:'Zen Kaku Gothic New',sans-serif;font-size:14px;font-weight:700;letter-spacing:.02em;color:#8c4a5c;line-height:1.6;margin:0 0 6px";

const card = (more) => `<div class="card">
      ${BANNER}
      <div class="tags"><span class="tag free">無料体験</span><span class="tag n">東京・神奈川8店舗</span><span class="tag n">手ぶらOK</span></div>
      <div class="row"><h3>Evolv（エボルブ）</h3><span class="price">無料体験</span></div>
      <p>専用のEMSスーツを着て、トレーナーがそばについて行う1回20分のマシンピラティス。ウェア・タオル・水を用意してくれるので手ぶらで行けます。荻窪店は女性専用。${more}</p>
      ${BTN('無料体験を予約 ＞')}
    </div>`;

// ---- ページ ----
let h = fs.readFileSync(path.join(ROOT, 'lava-trial.html'), 'utf8');
const oldTitle = h.match(/<title>([^<]*)<\/title>/)[1];
const oldDesc = h.match(/name="description" content="([^"]*)"/)[1];
h = h.split(oldTitle).join(TITLE).split(oldDesc).join(DESC).split('lava-trial.html').join(SLUG);
h = h.replace(/"headline":\s*"[^"]*"/, '"headline": "Evolv（エボルブ）の無料体験"');
h = h.replace(/("name":\s*")ホットヨガスタジオLAVA(")/g, '$1Evolv（エボルブ）$2');
h = h.replace(/"datePublished":\s*"[^"]*"/, '"datePublished": "2026-11-20"').replace(/"dateModified":\s*"[^"]*"/, '"dateModified": "2026-11-20"');
h = h.replace(/<meta property="og:image" content="[^"]*">/, '<meta property="og:image" content="https://essential-beauty-needs.com/images/bridal-fair.jpg">');

const row = (th, td) => `<tr><th>${th}</th><td>${td}</td></tr>`;
const main = `<main>
<div class="wrap">
<nav class="crumb" aria-label="現在位置"><a href="index.html">トップ</a><span>›</span><a href="gym.html">ジム・ヨガ・オンライン</a><span>›</span><span>Evolv（エボルブ）</span></nav>
<section class="phero">
  <p class="eyebrow">TRIAL CHECK</p>
  <h1><span class="h1-kw" style="${KW_STYLE}">Evolv（エボルブ）の無料体験</span>Evolvの体験は、<br>手ぶらで約1時間〜1時間半。</h1>
  <p class="lead">Evolv（エボルブ）は、専用のEMSスーツを着てマシンピラティスを行うスタジオです。体験は公式サイトで無料と案内されていて、レッスン自体は20〜25分。体験の日に入会すると入会金がかからない一方、解約は店頭で前月5日までなど、先に知っておきたい決まりがあります。</p>
</section>

<section>
  <div class="note-box">
    <p>先に結論です。<strong>体験は無料・手ぶらで、来店から約1時間〜1時間半。</strong>当日に入会すると入会金33,000円（税込）が0円になりますが、月会費は月4回のプランで21,780円（税込）からで、スーツのレンタル代と運営管理費が別にかかります。料金表を持ち帰って比べても遅くありません。</p>
  </div>
</section>

<section>
  <h2>Evolvの体験の条件（公式サイトの記載）</h2>
  <div class="tbl-scroll"><table class="tbl"><tbody>
${row('体験の料金', '無料（公式の料金表で体験は0円と案内）。原則1回のみ、予約が必要')}
${row('時間', 'トレーニングは20〜25分。カウンセリング・着替えを含め、来店から退出まで約1時間〜1時間半。予約時間の5分前に来店')}
${row('持ち物', '手ぶらでよい（水・タオル・ウェアを用意）。入会を考えるなら本人名義のクレジットカード（支払いはクレジットカードのみ）')}
${row('対象', '入会は満16歳以上（18歳未満は親権者の同意書が必要）。荻窪店は女性専用')}
${row('当日入会の特典', '入会金33,000円（税込）が0円。後日の入会は33,000円')}
${row('月会費（税込）', 'M4（月4回）21,780円、M8（月8回）27,280円、M15（月15回）36,080円、MF（通い放題）54,780円。一定期間続けることを条件にした割引あり。スーツのレンタル代・運営管理費は別（金額は公式サイトに記載なし）')}
${row('解約・休会', '希望する月の前月5日までに店頭で手続き。休会費は月3,300円（税込）')}
${row('予約・キャンセル', '予約はレッスン開始の15分前まで、キャンセルは60分前まで。過ぎると1回分を使ったことになる')}
${row('営業時間', '月〜木 8:30〜21:45、土・日・祝 7:30〜18:30。毎週金曜は店休日')}
</tbody></table></div>
  <p class="small">2026年11月20日に公式サイトで確かめた内容です。料金やキャンペーンは変わるため、申し込む前に公式サイトで最新の内容を確かめてください。</p>
</section>

<section>
  <h2>当日の流れ</h2>
  <ol>
    <li>公式サイトから店舗と日時を選んで予約する</li>
    <li>予約時間の5分前に来店し、受付をする</li>
    <li>カウンセリングとスタジオの案内を受け、EMSスーツに着替える</li>
    <li>20〜25分のレッスンを受ける（トレーナーがそばでサポート）</li>
    <li>着替え（シャワーは成城学園前・荻窪・五反田の3店舗のみ）。入会を考える人はプランの説明を受ける</li>
  </ol>
  <p class="small">空腹での利用は控え、予約の2時間前を目安に食事をとるよう公式サイトで案内されています。</p>
</section>

<section>
  <h2>店舗（東京・神奈川の8店舗）</h2>
  <div class="tbl-scroll"><table class="tbl">
    <thead><tr><th>店舗</th><th>最寄り駅</th></tr></thead>
    <tbody>
${row('五反田', '五反田駅 西口から徒歩4分')}
${row('武蔵小山', '武蔵小山駅 東口から徒歩1分')}
${row('大森', '大森駅 東口から徒歩2分')}
${row('神楽坂', '牛込神楽坂駅から徒歩3分')}
${row('荻窪（女性専用）', '荻窪駅 北口から徒歩3分')}
${row('成城学園前', '成城学園前駅 南口から徒歩2分')}
${row('武蔵小杉', '武蔵小杉駅 新南改札から徒歩3分')}
${row('溝の口', '武蔵溝ノ口駅 南口から徒歩1分')}
    </tbody>
  </table></div>
</section>

<section>
  <h2>体験を受けられない人</h2>
  <p>EMSは電気の刺激を使うため、公式サイトの禁忌事項に当てはまる人は、契約の前後にかかわらず利用できません。主なものは次のとおりです。</p>
  <ul class="checks">
    <li>妊娠中、または産後（普通分娩は4ヶ月、帝王切開は8ヶ月）まで</li>
    <li>人工ペースメーカー・植え込み型除細動器を使っている、心筋梗塞・狭心症など心臓の病気がある</li>
    <li>過去6ヶ月以内に手術を受けた、骨折・椎間板ヘルニアがある、発熱している</li>
    <li>電極の近くに金属のインプラントやピアス（ゴム製は可）がある</li>
  </ul>
  <p class="small">ここに挙げたのは一部です。持病がある人は、予約の前に公式サイトの禁忌事項を読み、医師に相談してください。</p>
</section>

<section>
  <h2>その日に決めないための言い方</h2>
  <div class="note-box"><p>そのまま使える言い方</p><p>「今日は体験だけのつもりです。料金表をいただいて、家で比べてから決めます。」</p></div>
  <p>当日入会で入会金33,000円が0円になるのは大きな差です。それでも、通う回数に合う月会費と、スーツのレンタル代・運営管理費を足した毎月の合計、解約の期限（前月5日・店頭）を見てから決めても遅くありません。</p>
  <p class="small">体験のあとの断り方は<a href="gym-trial-refusal.html">体験だけで帰る方法</a>、契約の前に見る点は<a href="gym-cancel.html">契約の前に確認すること</a>にまとめています。同じ運営会社のホットヨガは<a href="lava-trial.html">LAVAの体験レッスン</a>で比べられます。</p>
</section>

<section>
  <h2>向いている人・向いていない人</h2>
  <div class="grid grid-2">
    <div class="card"><h3>向いている人</h3>
  <ul>
    <li>1回の運動時間を短くしたい</li>
    <li>トレーナーがそばにいる環境で始めたい</li>
    <li>東京・神奈川の店舗の近くに住んでいる・働いている</li>
  </ul></div>
    <div class="card"><h3>ほかを選んだほうがよい人</h3>
  <ul>
    <li>禁忌事項に当てはまる</li>
    <li>金曜日に通いたい（毎週金曜は店休日）</li>
    <li>店頭に行かずに解約したい</li>
  </ul></div>
  </div>
</section>

<section>
  <h2>体験の予約はこちら</h2>
  <div class="trial">
    ${card('')}
  </div>
  <p class="small">${TEXT}</p>
</section>

<section class="next">
  <p class="small">出典：Evolv 公式サイト（料金・プラン、よくある質問、スタジオ一覧、特定商取引法に基づく表示、禁忌事項）（2026年11月20日確認）。運営は株式会社LAVA International。</p>
  <p class="small">ほかのサービスとも比べるなら、<a href="gym.html">ジム・ヨガ・オンラインの体験を比べる</a>と<a href="trial-collection.html">無料・低額で試せる体験リスト</a>へ。</p>
</section>
</div>
</main>`;
h = h.replace(/<main>[\s\S]*<\/main>/, main);
fs.writeFileSync(path.join(ROOT, SLUG), h);
console.log('ok', SLUG);

// ---- ジム・体験リストの「マシンピラティス」の先頭にカード ----
for (const f of ['gym.html', 'trial-collection.html']) {
  const p = path.join(ROOT, f);
  let s = fs.readFileSync(p, 'utf8');
  if (s.includes('pid=892753091')) { console.log('skip', f); continue; }
  const i = s.indexOf('<h2 id="pilates">');
  const j = s.indexOf('<div class="trial">', i);
  const k = j + '<div class="trial">'.length;
  s = s.slice(0, k) + '\n    ' + card(` <a href="${SLUG}">条件と当日の流れを見る</a>`) + s.slice(k);
  s = s.replace('<h2 id="pilates">マシンピラティス・少人数で見てもらう</h2>', '<h2 id="pilates">マシンピラティス・EMS・少人数で見てもらう</h2>');
  fs.writeFileSync(p, s);
  console.log('ok card', f);
}

// ---- ジムのハブの記事一覧 ----
{
  const p = path.join(ROOT, 'gym.html');
  let s = fs.readFileSync(p, 'utf8');
  if (!s.includes(`<a href="${SLUG}"><span class="t">`)) {
    const line = s.match(/<a href="lava-trial\.html"><span class="t">[^\n]*<\/a>/)[0];
    s = s.replace(line, line + `\n    <a href="${SLUG}"><span class="t">${TITLE}</span><span class="d">1回20分のEMS×マシンピラティス。体験は無料・手ぶらで、当日入会の特典、月会費、解約の期限を公式の記載で。</span></a>`);
    fs.writeFileSync(p, s);
    console.log('ok list gym.html');
  }
}

// ---- LAVA のページから1文 ----
{
  const p = path.join(ROOT, 'lava-trial.html');
  let s = fs.readFileSync(p, 'utf8');
  if (!s.includes(SLUG)) {
    s = s.replace('<section class="next">', `<section><p class="small">同じ運営会社の、1回20分のEMS×マシンピラティスは<a href="${SLUG}">Evolv（エボルブ）の無料体験</a>にまとめています。</p></section>\n\n<section class="next">`);
    fs.writeFileSync(p, s);
    console.log('ok lava link');
  }
}

// ---- sitemap ----
const sp = path.join(ROOT, 'sitemap.xml');
let sm = fs.readFileSync(sp, 'utf8');
if (!sm.includes(SLUG)) {
  sm = sm.replace('</urlset>', `  <url>\n    <loc>https://essential-beauty-needs.com/${SLUG}</loc>\n    <lastmod>2026-11-20</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n</urlset>`);
  for (const f of ['gym.html', 'trial-collection.html', 'lava-trial.html']) sm = sm.replace(new RegExp(`(<loc>https://essential-beauty-needs\\.com/${f.replace('.', '\\.')}</loc>\\s*<lastmod>)[^<]*`), '$12026-11-20');
  fs.writeFileSync(sp, sm);
}
