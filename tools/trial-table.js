// 体験リスト（trial-collection.html）に「申し込み前に知っておくこと」の比較表を入れる
// 条件は A8.net の広告主の案内（2026年10月26日に確認）から、利用する人に関係する部分だけを書く
// node tools/trial-table.js
const fs = require('fs');
const path = require('path');
const f = path.join(__dirname, '..', 'trial-collection.html');
let h = fs.readFileSync(f, 'utf8');
const crlf = h.includes('\r\n');
h = h.replace(/\r\n/g, '\n');

// オンラインのメディカルダイエット（医療）のカードは外す
{
  const i = h.indexOf('<h3>レバクリ</h3>');
  if (i >= 0) {
    const s = h.lastIndexOf('<div class="card">', i);
    let d = 0, re = /<div(?![a-zA-Z-])|<\/div>/g, m, e = -1;
    re.lastIndex = s;
    while ((m = re.exec(h))) { d += m[0] === '</div>' ? -1 : 1; if (d === 0) { e = m.index + 6; break; } }
    h = h.slice(0, s).replace(/\s+$/, '\n    ') + h.slice(e).replace(/^\s+/, '');
  }
}

const ROWS = [
  // [名前, 節, 形式, 試せるもの, 申し込み前に知っておくこと]
  ['SOELU', 's1', 'オンライン', '30日100円のお試し', 'Webで「お試し100円」に登録する形。カメラをオフにして受けられる'],
  ['LAVA', 's2', '店舗', '体験レッスン', 'LAVA全店で初めて利用する人が対象。Webで予約してから来店'],
  ['Amazones', 's2', '店舗（女性専用）', '無料体験・見学', '初めて利用する女性が対象。Web申し込みから60日以内に体験・見学'],
  ['ボディーズ', 's2', '店舗（女性専用）', '無料体験', '初めて利用する人が対象。Webで体験を予約'],
  ['ミス・パリ', 's3', '店舗', '体験コース', 'Webで申し込んで来店。過去に体験した人・20歳未満・男性は対象外'],
  ['MMM', 's3', '店舗（完全貸切）', '体験プラン', '初めて利用する人が対象。申し込みから30日以内にカウンセリングと体験'],
  ['AILE', 's4', '店舗', '体験コース', '初めて利用する人が対象。申し込みから30日以内に来店。一部の店舗は対象外'],
  ['キュットレッグ', 's4', '店舗', '初回の施術', '初めて申し込む人が対象。申し込みから45日以内に施術'],
  ['健康やせEVE', 's4', '店舗（女性専用）', '1ヶ月体験プラン', '初めて利用する人が対象。申し込みから60日以内に来店'],
  ['エステティック ミス・パリ', 's4', '店舗', '体験コース', 'Webで申し込んで来店。過去に体験した人・20歳未満・男性は対象外'],
  ['カルミア美肌クリニック', 'datsumo', 'クリニック', '無料カウンセリング', '初めて利用する人が対象。申し込みから30日以内に来店してカウンセリング'],
  ['シロノクリニック', 'datsumo', 'クリニック', '無料カウンセリング', '初めて利用する人が対象。20歳未満は対象外。申し込みから30日以内に来院'],
  ['RinRin', 'datsumo', 'サロン', '初回来店', '初めて利用する人が対象。料金は変わることがあるため店舗で確認'],
  ['ディオーネ', 'datsumo', 'サロン', '全身脱毛の体験', '初めて利用する人が対象。体験を受けられる店舗が決まっている'],
  ['ホワイトマイスター', 'white', 'クリニック（表参道）', '初回の施術', '初めて利用する人が対象。カウンセリングだけでは施術にならない'],
  ['ハナユメ', 'venue', 'Web予約', '無料のブライダルフェア', '1組1会場の予約。予約から45日以内に来館'],
  ['ゼクシィ相談カウンター', 'venue', 'カウンター', '無料相談', '初めて利用する人が対象。Webで相談を予約'],
];

const table = `
<section>
  <h2 id="compare">申し込み前に知っておくこと（比較表）</h2>
  <p>体験には「初めて利用する人だけ」「Webから予約した場合だけ」などの条件があります。申し込んでから対象外だと分かることがないように、主な条件を並べました。</p>
  <div class="tbl-scroll"><table class="tbl">
    <thead><tr><th>サービス</th><th>形式</th><th>試せるもの</th><th>申し込み前に知っておくこと</th></tr></thead>
    <tbody>
${ROWS.map(([n, s, k, t, c]) => `      <tr><td><a href="#${s}">${n}</a></td><td>${k}</td><td>${t}</td><td>${c}</td></tr>`).join('\n')}
    </tbody>
  </table></div>
  <p class="small">2026年10月26日時点の各社の案内をもとにしています。体験の内容・料金・対象の店舗は変わることがあるので、申し込む前に公式サイトで確認してください。最終確認日：2026年10月29日。</p>
</section>
`;
h = h.replace(/\n<section>\n  <h2 id="compare">[\s\S]*?<\/section>\n/, '\n');
h = h.replace('\n<section>\n  <h2 id="s1">', table + '\n<section>\n  <h2 id="s1">');
if (!h.includes('href="#compare"')) {
  const A = "color:#8c4a5c;text-decoration:underline;text-decoration-color:rgba(140,74,92,.4);text-underline-offset:3px";
  h = h.replace(/(<li><a href="#pick"[^>]*>[^<]*<\/a><\/li>)/, `$1\n    <li><a href="#compare" style="${A}">申し込み前に知っておくこと（比較表）</a></li>`);
}
h = h.replace(/(<meta name="description" content=")[^"]*/, '$1花嫁が契約前に無料・低額で試せる体験を、申し込みの条件まで比べました。オンラインヨガ・女性専用ジム・ブライダルエステ・脱毛の無料カウンセリング・ホワイトニング・式場フェアを、挙式までの時期と目的から選べます。');
fs.writeFileSync(f, crlf ? h.replace(/\n/g, '\r\n') : h);
console.log('ok', (h.match(/<tr><td><a href="#/g) || []).length, 'rows', h.includes('<h3>レバクリ</h3>') ? 'レバクリ残り' : 'レバクリ削除');
