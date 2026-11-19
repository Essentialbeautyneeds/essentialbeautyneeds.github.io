// 2026-11-20 Search Console で表示のある検索語に合わせて、3ページのタイトルと中身を直す
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function edit(file, pairs) {
  const p = path.join(ROOT, file);
  let h = fs.readFileSync(p, 'utf8');
  for (let [a, b] of pairs) {
    if (!h.includes(a) && h.includes(a.split(String.fromCharCode(10)).join(String.fromCharCode(13,10)))) { a = a.split(String.fromCharCode(10)).join(String.fromCharCode(13,10)); b = b.split(String.fromCharCode(10)).join(String.fromCharCode(13,10)); }
    if (!h.includes(a) && h.includes(b)) continue;
    const n = h.split(a).length - 1;
    if (n === 0) throw new Error(`${file}: 見つからない「${a.slice(0, 40)}」`);
    h = h.split(a).join(b);
  }
  h = h.replace(/("dateModified":\s*")[^"]*/, '$12026-11-20');
  fs.writeFileSync(p, h);
  console.log('ok', file);
}

// 花嫁 二の腕 太い（10位）・ウェディングドレス 二の腕痩せ（18位）
edit('prehana-arm.html', [
  ['花嫁の二の腕が太い原因と細く見せる方法｜ドレスまで1〜3ヶ月の整え方', '花嫁の二の腕が太い原因と細く見せる方法｜ウェディングドレスまで1〜3ヶ月'],
  ['どれが原因かの見分け方と、挙式・前撮りまで1〜3ヶ月で細く見せる順番を整理しました。', 'どれが原因かの見分け方と、ウェディングドレスの試着・前撮りまで1〜3ヶ月で二の腕を細く見せる順番を整理しました。'],
]);

// ブライダルエステ いつから（75位）
edit('bridal-esthe.html', [
  ['ブライダルエステはいつから｜4社の比較と失敗しない受け方｜Essential Beauty Needs', 'ブライダルエステはいつから？残り期間別の目安と4社の比較'],
  ['ブライダルエステを始める時期、部位の選び方、契約前に確認すること。ミス・パリ、シーズ・ラボ、AILE、キュットレッグを目的別に比べました。', 'ブライダルエステはいつから始めるか、挙式までの残り期間別の目安を表にしました。部位の選び方と契約前に確認すること、ミス・パリ・シーズ・ラボ・AILE・キュットレッグの比較もまとめています。'],
  ['<h2 id="s2">時期ごとの目安</h2>', '<h2 id="s2">ブライダルエステはいつから？残り期間ごとの目安</h2>'],
]);

// ウェディング ドレス 背中 肉 隠す（31位）
edit('back-bra-line.html', [
  ['ウェディングドレスで気になる背中のはみ肉｜ブラの上の段差の原因と整え方', 'ウェディングドレスの背中のはみ肉を隠す・整える｜段差の原因と試着でできること'],
  ['背中の段差は、脂肪だけでなく下着のサイズや姿勢、むくみが重なって出ます。原因の見分け方と、試着前にできること、自宅でできる背中の運動を表でまとめました。', 'ウェディングドレスで背中のはみ肉が気になるときは、インナーとドレスの形で隠せる部分と、姿勢やむくみで整える部分があります。原因の見分け方と隠し方、自宅でできる背中の運動を表でまとめました。'],
  [`<section>
  <h2>背中は自分で見えない</h2>`, `<section>
  <h2 id="hide">ウェディングドレスで背中の肉を隠す方法</h2>
  <p>挙式までの時間が短いときは、整えるより先に<strong>インナーとドレスの形で目立たなくする</strong>方法を試着で確かめます。</p>
  <div class="tbl-scroll">
  <table class="tbl">
    <thead><tr><th>方法</th><th>試着で確かめること</th></tr></thead>
    <tbody>
      <tr><td><strong>ドレス用インナー（ブライダルインナー）</strong></td><td>普段のブラより背中側が長く、肉を前に寄せて段差を出しにくくする形が多い。ドレスの背中の開きから見えないか</td></tr>
      <tr><td><strong>背中が詰まったデザイン・レースの背中</strong></td><td>ドレスを選ぶ前なら候補に入れる。レースや透ける生地は段差が出にくいか、後ろ姿を撮って見る</td></tr>
      <tr><td><strong>ボレロ・ケープ・ショール</strong></td><td>挙式だけ羽織り、披露宴で外すこともできる。会場の決まりと、ドレスショップで追加料金がかかるか</td></tr>
      <tr><td><strong>編み上げ・ファスナーの調整</strong></td><td>締め付けの位置で段差の出方が変わる。当日のスタッフに調整してもらえるか</td></tr>
    </tbody>
  </table>
  </div>
  <p class="small">インナーの形や扱いはドレスショップや会場で違います。最終の試着で、当日と同じインナーを着けて確かめてください。二の腕を隠す袖やボレロの選び方は<a href="arm-cover-dress.html">二の腕をカバーできるウェディングドレス</a>にあります。</p>
</section>

<section>
  <h2>背中は自分で見えない</h2>`],
]);
