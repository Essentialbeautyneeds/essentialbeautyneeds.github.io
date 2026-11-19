// 2026-11-20 新規：bridal-fair-tokuten.html（ブライダルフェアの特典をもらう条件）
// bridal-fair-duration.html の枠（head・ヘッダー・フッター・固定バー）を使い、中身を差し替える
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SLUG = 'bridal-fair-tokuten.html';
const TITLE = 'ブライダルフェアの特典をもらう条件｜予約の仕方・写真・アンケートの注意';
const DESC = 'ブライダルフェアの特典（電子マネーなど）は、式場探しサイトのキャンペーンにエントリーし、そのサイトからネット予約して参加し、写真と感想を送るといった条件をすべて満たすと受け取れます。もらえなくなる例と、予約の前に確かめることを表にしました。';
const CRUMB = 'フェアの特典の条件';

const L = (href, text) => `<a href="${href}" style="color:#8c4a5c;text-decoration:underline;text-decoration-color:rgba(140,74,92,.4);text-underline-offset:3px">${text}</a>`;
const KW_STYLE = "display:block;font-family:'Zen Kaku Gothic New',sans-serif;font-size:14px;font-weight:700;letter-spacing:.02em;color:#8c4a5c;line-height:1.6;margin:0 0 6px";

let h = fs.readFileSync(path.join(ROOT, 'bridal-fair-duration.html'), 'utf8');
const oldTitle = h.match(/<title>([^<]*)<\/title>/)[1];
const oldDesc = h.match(/name="description" content="([^"]*)"/)[1];
h = h.split(oldTitle).join(TITLE).split(oldDesc).join(DESC).split('bridal-fair-duration.html').join(SLUG);
h = h.replace('"name": "フェアの所要時間"', `"name": "${CRUMB}"`).replace('"headline": "ブライダルフェアの所要時間"', '"headline": "ブライダルフェアの特典をもらう条件"');
h = h.replace(/"datePublished": "[^"]*", "dateModified": "[^"]*"/, '"datePublished": "2026-11-20", "dateModified": "2026-11-20"');

const toc = [['s1', '特典の種類'], ['s2', '受け取りの条件（ゼクシィの例）'], ['s3', 'もらえなくなる例'], ['s4', '特典で「稼ぐ」ことはできる？'], ['s5', 'フェアを探す']];
const tocHtml = toc.map(([id, t]) => `    <li><a href="#${id}" style="color:#8c4a5c;text-decoration:underline;text-decoration-color:rgba(140,74,92,.4);text-underline-offset:3px">${t}</a></li>`).join('\n');

const body = `<nav class="crumb" aria-label="現在位置" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12px;color:#6f6a67;padding:14px 0 0;font-family:'Zen Kaku Gothic New',sans-serif">
  ${L('index.html', 'トップ')}
  <span aria-hidden="true">›</span>
  ${L('bridal.html', '花嫁の準備')}
  <span aria-hidden="true">›</span>
  <span>${CRUMB}</span>
</nav>
<nav class="toc" aria-label="目次" style="margin:0 0 4px;padding:16px 18px;background:#fbfbf9;border:1px solid #e8e6e1">
  <p style="margin:0 0 9px;font-size:10.5px;letter-spacing:.14em;color:#5f7a63;font-weight:700;font-family:'Zen Kaku Gothic New',sans-serif">このページの内容</p>
  <ol style="margin:0;padding-left:20px;display:grid;gap:5px;font-size:13.5px;line-height:1.65;font-family:'Zen Kaku Gothic New',sans-serif">
${tocHtml}
  </ol>
</nav>

<section class="phero">
  <p class="eyebrow">FAIR GIFT</p>
  <h1><span class="h1-kw" style="${KW_STYLE}">ブライダルフェアの特典をもらう条件</span>特典は、<br>予約の経路で決まる。</h1>
  <p class="lead">ブライダルフェアの特典には、式場探しサイトが出す電子マネーなどの特典と、会場が出す試食や割引の特典があります。前者は、決まった手順を1つでも外すと受け取れません。</p>
</section>

<section>
  <div class="note-box">
    <p>先に結論です。<strong>式場探しサイトの特典は「エントリー」「そのサイトからのネット予約」「参加」「写真と感想の送付」をすべて満たしたときに受け取れます。</strong>たとえばゼクシィの式場探し特典では、電話や相談カウンター、外部サイトからの予約は対象外です。条件と金額は月ごとに変わるので、予約の前にキャンペーンのページで確かめてください。</p>
  </div>
</section>

<section>
  <h2 id="s1">ブライダルフェアの特典の種類</h2>
  <div class="tbl-scroll">
  <table class="tbl">
    <thead><tr><th>特典</th><th>出すところ</th><th>受け取る条件の例</th></tr></thead>
    <tbody>
      <tr><td><strong>見学・フェア参加の特典</strong></td><td>式場探しサイト</td><td>キャンペーンにエントリーし、そのサイトから予約して参加。写真や感想を送る</td></tr>
      <tr><td><strong>成約の特典</strong></td><td>式場探しサイト</td><td>参加した会場と契約し、成約のアンケートや書類を送る</td></tr>
      <tr><td><strong>フェアの特典（試食・成約時の割引など）</strong></td><td>会場</td><td>そのフェアに参加する。割引は期限内の契約が条件のことが多い</td></tr>
    </tbody>
  </table>
  </div>
  <p class="small">会場の成約特典は、その日に決めると割引が大きくなる形もあります。その場で決めない進め方は${L('bridal-fair-decision.html', 'ブライダルフェアで即決しない方法')}にあります。</p>
</section>

<section>
  <h2 id="s2">ブライダルフェアの特典を受け取る条件（ゼクシィの例）</h2>
  <p>ゼクシィの「式場探し特典」では、次の4つをすべて満たすと特典の対象になります。エントリーと予約は、期間内ならどちらが先でもかまいません。</p>
  <div class="tbl-scroll">
  <table class="tbl">
    <thead><tr><th>条件</th><th>内容</th></tr></thead>
    <tbody>
      <tr><td><strong>1. エントリー</strong></td><td>その月の式場探し特典のフォームからエントリーする</td></tr>
      <tr><td><strong>2. ネット予約</strong></td><td>対象エリアの会場の見学・フェアを、ゼクシィのWebサイト・アプリなどから予約する</td></tr>
      <tr><td><strong>3. 参加</strong></td><td>予約した会場の見学・フェアに参加する（オンライン相談会も対象）</td></tr>
      <tr><td><strong>4. 写真と感想を送る</strong></td><td>参加した会場で自分で撮った写真と、自分で書いた感想を送る（オンライン相談会は感想のみ）</td></tr>
      <tr><td><strong>成約の追加特典</strong></td><td>条件4で送った会場と税込65万円以上で成約し、成約アンケートを送ると、5,000円分が追加される</td></tr>
    </tbody>
  </table>
  </div>
  <p class="small">特典は電子マネーギフトで、案内は応募したメールアドレスに届き、受け取るときに電話番号の認証があります。金額や期間は月ごとに変わるため、ここには書いていません。ハナユメなどほかの式場探しサイトにも来館特典のある時期がありますが、条件はサイトごとに違います。</p>
</section>

<section>
  <h2 id="s3">ブライダルフェアの特典がもらえなくなる例</h2>
  <ul class="checks">
    <li><strong>予約の経路が違う。</strong>電話・相談カウンター・外部サイトからの予約は、ゼクシィの式場探し特典の対象外です</li>
    <li><strong>メールアドレスがそろっていない。</strong>エントリー・予約・写真の送付で別のアドレスを使うと対象外になります</li>
    <li><strong>写真が自分で撮ったものではない。</strong>パンフレットやホームページの写真は対象外です</li>
    <li><strong>同じ会場に2回行った。</strong>1会場につき1回の予約・参加分だけが対象です</li>
    <li><strong>会場がもう決まっている。</strong>決定済みの人のエントリーや予約は無効になる場合があると書かれています</li>
    <li><strong>連絡先の入力ミス。</strong>電話番号やメールアドレスに誤りがあると受け取れず、あとから直せません</li>
  </ul>
  <p>予約の前に、キャンペーンのページの「対象外」の欄を一度読んでおくと、写真の撮り忘れや予約の経路の間違いを防げます。当日に撮る場所や聞くことは${L('venue-visit-checklist.html', '式場見学の持ち物とチェックリスト')}にまとめています。</p>
</section>

<section>
  <h2 id="s4">ブライダルフェアの特典で「稼ぐ」ことはできる？</h2>
  <p>特典は、式場を探しているカップルが見学やフェアに参加したことへのお礼です。ゼクシィの例では<strong>1カップルにつき受け取りは1回</strong>で、関係者の応募はできず、不正な応募と判断されると無効になります。</p>
  <p>何度も受け取ることを目当てにするものではありません。行きたい会場を2〜3件に絞り、比べるために参加した結果として受け取る、と考えておくと条件も満たしやすくなります。何件回るかの考え方は${L('bridal-fair.html', 'ブライダルフェアの選び方と回り方')}にあります。</p>
</section>

<section>
  <h2 id="s5">フェアを探す</h2>
  <p>特典のキャンペーンの有無は、予約するサイトのページで確かめてから申し込みます。</p>
  <a class="cta" href="https://px.a8.net/svt/ejp?a8mat=4AX40F+8IMA3E+3DOK+6I1XE" rel="nofollow sponsored" target="_blank">ハナユメで無料フェアを探す</a>
  <img loading="lazy" decoding="async" border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=4AX40F+8IMA3E+3DOK+6I1XE" alt="" style="position:absolute">
  <p class="cta-note">エリアと希望日から検索できます。キャンペーンの条件は予約の前に公式で確かめてください</p>
  <p>見学の前に、自分たちの条件での費用を知っておきたい場合は、式場紹介サービスも使えます。</p>
  <div class="trial">
    <div class="card">
      <a class="thumb" href="https://px.a8.net/svt/ejp?a8mat=4BERA7+DLECT6+4P5Q+BZ0Z5" rel="nofollow sponsored" referrerpolicy="no-referrer-when-downgrade" target="_blank"><img src="https://www21.a8.net/svt/bgt?aid=261029023822&wid=002&eno=01&mid=s00000021923002011000&mc=1" alt="トキハナ" loading="lazy" onerror="this.parentNode.style.display='none'"></a>
      <img loading="lazy" decoding="async" border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=4BERA7+DLECT6+4P5Q+BZ0Z5" alt="" style="position:absolute">
      <div class="tags"><span class="tag free">相談無料</span><span class="tag n">見学前に見積もり</span><span class="tag n">オンライン相談可</span></div>
      <div class="row"><h3>トキハナ</h3><span class="price">相談無料</span></div>
      <p>式場紹介サービスです。見学の前に、自分たちの条件での見積もりの目安が分かります。広告主の案内では、その場で即決しなくても最低価格保証が適用されます。<strong>相談・見学は新郎新婦2人での予約が対象</strong>です。</p>
      <a class="apply" href="https://px.a8.net/svt/ejp?a8mat=4BERA7+DLECT6+4P5Q+C4TB6" rel="nofollow sponsored" referrerpolicy="no-referrer-when-downgrade" target="_blank">トキハナで式場を探す ＞</a>
      <img loading="lazy" decoding="async" border="0" width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=4BERA7+DLECT6+4P5Q+C4TB6" alt="" style="position:absolute">
    </div>
  </div>
  <p class="small">出典：ゼクシィ「式場探し特典」のエントリーページ（2026年11月に確認）。条件・金額・期間は月ごとに変わります。</p>
</section>
`;

const related = [['bridal-fair.html', 'ブライダルフェアの進め方', '何件回るか・予約の取り方'], ['bridal-fair-no-booking.html', '予約なしで行ける？', '当日参加で損をする点'], ['bridal-fair-decision.html', '即決しない方法', '当日割引の断り方'], ['venue-visit-checklist.html', '式場見学の持ち物', '当日に聞くこと']];
const relHtml = related.map(([href, t, s]) => `    <a href="${href}" style="display:block;padding:15px 16px;background:#fbfbf9;border:1px solid #e8e6e1;text-decoration:none;font-family:'Zen Kaku Gothic New',sans-serif">
      <span style="display:block;font-family:'Shippori Mincho',serif;font-size:15.5px;font-weight:600;color:#3d3836;line-height:1.5;margin-bottom:4px">${t}</span>
      <span style="display:block;font-size:12.5px;color:#6f6a67;line-height:1.65">${s}</span>
    </a>`).join('\n');

const start = h.indexOf('<nav class="crumb"');
const relStart = h.indexOf('<section class="related"');
const relInner = h.indexOf('<div style="display:grid', relStart);
const relEnd = h.indexOf('</section>', relStart);
h = h.slice(0, start) + body + '\n' + h.slice(relStart, relInner) + `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:2px;margin-top:14px">\n${relHtml}\n  </div>\n` + h.slice(relEnd);
fs.writeFileSync(path.join(ROOT, SLUG), h);

// sitemap
const sp = path.join(ROOT, 'sitemap.xml');
let sm = fs.readFileSync(sp, 'utf8');
if (!sm.includes(SLUG)) {
  sm = sm.replace('</urlset>', `  <url>\n    <loc>https://essential-beauty-needs.com/${SLUG}</loc>\n    <lastmod>2026-11-20</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n</urlset>`);
  fs.writeFileSync(sp, sm);
}
console.log('ok', SLUG);
