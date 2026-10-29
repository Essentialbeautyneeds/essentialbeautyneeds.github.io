// trial-collection.html：早見表・脱毛・ホワイトニング・式場フェアの節を足し、関連記事の中に入っていた EVE のカードを エステ・整体 に移す
const fs = require('fs');
const f = require('path').join(__dirname, '..', 'trial-collection.html');
let h = fs.readFileSync(f, 'utf8'); const crlf = h.includes('\r\n'); h = h.replace(/\r\n/g, '\n');
const rep = (a, b) => { if (!h.includes(a)) throw new Error('not found: ' + a.slice(0, 50)); h = h.replace(a, b); };
const A = "color:#8c4a5c;text-decoration:underline;text-decoration-color:rgba(140,74,92,.4);text-underline-offset:3px";
const sp = 'rel="nofollow sponsored" referrerpolicy="no-referrer-when-downgrade" target="_blank"';

// title / description
const T = '花嫁が無料・低額で試せる体験リスト｜ジム・エステ・脱毛・ホワイトニング';
const D = '花嫁が契約前に無料または低額で試せる体験をまとめました。オンラインヨガ・女性専用ジム・ブライダルエステ・脱毛の無料カウンセリング・ホワイトニング・式場フェアを、挙式までの時期と目的から選べます。';
h = h.replace(/<title>[^<]*<\/title>/, `<title>${T}｜Essential Beauty Needs</title>`)
     .replace(/(<meta name="description" content=")[^"]*/, `$1${D}`)
     .replace(/(<meta property="og:title" content=")[^"]*/, `$1${T}`)
     .replace(/(<meta property="og:description" content=")[^"]*/, `$1${D}`);

// EVE card: move from the related-links grid into エステ・整体
const eveStart = h.indexOf('    <div class="card">\n      <a class="thumb" href="https://px.a8.net/svt/ejp?a8mat=4BA416+BNQN16+4MHW+5ZMCH"');
const eveEnd = h.indexOf('</div>\n', h.indexOf('1ヶ月体験プランを見る ＞', eveStart)) + '</div>\n'.length;
if (eveStart < 0) throw new Error('EVE not found');
const eve = h.slice(eveStart, eveEnd);
h = h.slice(0, eveStart) + h.slice(eveEnd);
rep('初回施術を予約 ＞</a>\n    </div>\n  </div>\n</section>', '初回施術を予約 ＞</a>\n    </div>\n' + eve + '  </div>\n</section>');

// TOC
rep('<li><a href="#s1"', `<li><a href="#pick" style="${A}">時期と目的から選ぶ早見表</a></li>\n    <li><a href="#s1"`);
rep('<li><a href="#s5"', `<li><a href="#datsumo" style="${A}">脱毛｜無料カウンセリング</a></li>\n    <li><a href="#white" style="${A}">歯のホワイトニング</a></li>\n    <li><a href="#venue" style="${A}">会場がまだなら｜無料フェア</a></li>\n    <li><a href="#s5"`);

// 早見表 after the hero note-box section
const pick = `
<section>
  <h2 id="pick">時期と目的から選ぶ早見表</h2>
  <p>挙式日が決まっているなら、<a href="checklist.html" style="${A};font-weight:700">挙式日から逆算するチェックリスト</a>で今やることを先に確認できます。</p>
  <div class="tbl-scroll"><table class="tbl">
    <thead><tr><th>目的</th><th>試せる形</th><th>向いている時期</th><th>見る場所</th></tr></thead>
    <tbody>
      <tr><td>会場を決める</td><td>ブライダルフェアの予約（無料）</td><td>会場が決まる前</td><td><a href="#venue">無料フェア</a></td></tr>
      <tr><td>背中・うなじの脱毛</td><td>無料カウンセリング・体験</td><td>6ヶ月以上前に開始</td><td><a href="#datsumo">脱毛</a></td></tr>
      <tr><td>歯を白くする</td><td>初回の施術</td><td>3ヶ月前〜2週間前</td><td><a href="#white">ホワイトニング</a></td></tr>
      <tr><td>自宅で体を整える</td><td>100円・無料のお試し</td><td>いつでも</td><td><a href="#s1">オンライン</a></td></tr>
      <tr><td>近くの店舗に通う</td><td>無料体験</td><td>3〜6ヶ月前</td><td><a href="#s2">通うタイプ</a></td></tr>
      <tr><td>短期間で仕上げる</td><td>体験・カウンセリング</td><td>3ヶ月前</td><td><a href="#s3">集中</a></td></tr>
      <tr><td>背中・脚を人に任せる</td><td>体験・初回施術</td><td>3ヶ月前〜1ヶ月前</td><td><a href="#s4">エステ・整体</a></td></tr>
    </tbody>
  </table></div>
  <p class="small">体験の内容や料金は変わることがあります。申し込む前に各公式サイトで確認してください。体験のあとに勧誘されるのが心配な場合は<a href="gym-trial-refusal.html">体験だけ受けて契約しない方法</a>を先に読んでおくと安心です。</p>
</section>
`;
rep('<section>\n  <h2 id="s1">', pick + '\n<section>\n  <h2 id="s1">');

// 脱毛・ホワイトニング・式場フェア before 目的別に絞り込む
const extra = `
<section>
  <h2 id="datsumo">脱毛｜無料カウンセリングから始める</h2>
  <p class="lead">回数と間隔が決まっているため、いちばん早く締め切りが来ます。一般的に2〜3ヶ月に1回・5回前後が目安です。<a href="hair-removal.html">間に合う期間</a>と<a href="nape-hair-removal.html">うなじの回数</a>も確認してください。</p>
  <div class="trial">
    <div class="card">
      <a class="thumb" href="https://px.a8.net/svt/ejp?a8mat=4BA416+BUAEOQ+24LS+BYDTT" ${sp}><img src="https://www21.a8.net/svt/bgt?aid=260812266716&wid=002&eno=01&mid=s00000009928002008000&mc=1" alt="シロノクリニック" loading="lazy" onerror="this.parentNode.style.display='none'"></a>
      <div class="tags"><span class="tag free">無料カウンセリング</span><span class="tag n">医療脱毛</span></div>
      <div class="row"><h3>シロノクリニック</h3><span class="price">無料カウンセリング</span></div>
      <p>全身の医療脱毛。Webで申し込んで、まず無料のカウンセリングで回数とスケジュールを相談できます。挙式日を伝えて、間に合うかを先に聞いておく使い方ができます。</p>
      <a class="apply" href="https://px.a8.net/svt/ejp?a8mat=4BA416+BUAEOQ+24LS+BYDTT" ${sp}>カウンセリングを予約 ＞</a>
    </div>
    <div class="card">
      <a class="thumb" href="https://px.a8.net/svt/ejp?a8mat=4BA416+B1461M+2FM6+661TT" rel="nofollow sponsored" target="_blank"><img loading="lazy" decoding="async" src="https://www24.a8.net/svt/bgt?aid=260812266667&amp;wid=002&amp;eno=01&amp;mid=s00000011355001036000&amp;mc=1" alt="脱毛サロン RinRin" onerror="this.parentNode.style.display='none'"></a>
      <div class="tags"><span class="tag n">脱毛サロン</span><span class="tag n">全国</span></div>
      <div class="row"><h3>RinRin</h3><span class="price">初回来店</span></div>
      <p>全国に店舗がある脱毛サロン。通う回数が多くなるので、職場や自宅から近い店舗があるかを先に確認してください。料金は変わっている可能性があるため、店舗で確認してください。</p>
      <a class="apply" href="https://px.a8.net/svt/ejp?a8mat=4BA416+B1461M+2FM6+661TT" rel="nofollow sponsored" target="_blank">近くの店舗を見る ＞</a>
    </div>
    <div class="card">
      <a class="thumb" href="https://px.a8.net/svt/ejp?a8mat=4AVFRY+7MGVFE+3W7I+HWAG1" ${sp}><img src="https://www22.a8.net/svt/bgt?aid=260127646461&wid=002&eno=01&mid=s00000018171003006000&mc=1" alt="ディオーネ 全身脱毛" loading="lazy" onerror="this.parentNode.style.display='none'"></a>
      <div class="tags"><span class="tag n">敏感肌向け</span><span class="tag n">全身脱毛</span></div>
      <div class="row"><h3>ディオーネ</h3><span class="price">体験あり</span></div>
      <p>敏感肌を専門にした脱毛サロン。痛みや肌の反応が心配で脱毛を先送りしてきた場合に、体験で確かめてから決められます。</p>
      <a class="apply" href="https://px.a8.net/svt/ejp?a8mat=4AVFRY+7MGVFE+3W7I+HWAG1" ${sp}>体験の詳細 ＞</a>
    </div>
  </div>
</section>

<section>
  <h2 id="white">歯のホワイトニング</h2>
  <p class="lead">写真でいちばん写るのは顔で、そこで目立つのが歯です。1〜2ヶ月前なら通院型を数回、2〜3週間前なら1回で変化を出すタイプを検討する時期です。<a href="whitening.html">いつから始めるか</a>を先に確認してください。</p>
  <div class="trial">
    <div class="card">
      <a class="thumb" href="https://px.a8.net/svt/ejp?a8mat=4BA416+BDM9QY+4TU2+609HT" ${sp}><img src="https://www20.a8.net/svt/bgt?aid=260812266688&wid=002&eno=01&mid=s00000022529001009000&mc=1" alt="ホワイトマイスター" loading="lazy" onerror="this.parentNode.style.display='none'"></a>
      <div class="tags"><span class="tag n">通院型</span><span class="tag n">表参道</span></div>
      <div class="row"><h3>ホワイトマイスター</h3><span class="price">初回の施術</span></div>
      <p>東京・表参道のホワイトニング専門の歯科。1回の施術で変化を出すタイプなので、挙式や前撮りまでの期間が短い場合の選択肢です。</p>
      <a class="apply" href="https://px.a8.net/svt/ejp?a8mat=4BA416+BDM9QY+4TU2+609HT" ${sp}>予約の空きを見る ＞</a>
    </div>
  </div>
</section>

<section>
  <h2 id="venue">会場がまだなら｜無料フェアから</h2>
  <p class="lead">体づくりも脱毛も、挙式日から逆算して決まります。会場が決まっていないなら、まずフェアで会場を見るところからです。フェアは無料で参加できます。</p>
  <a class="cta" href="https://px.a8.net/svt/ejp?a8mat=4AX40F+8IMA3E+3DOK+6I1XE" ${sp}>ハナユメで無料フェアを探す</a>
  <img loading="lazy" decoding="async" border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=4AX40F+8IMA3E+3DOK+6I1XE" alt="" style="position:absolute">
  <p class="cta-note">式場探しサイト経由の予約は、成約時の特典がつくことがあります。<a href="wedding-start.html">婚約したら最初にやること</a>も参考に</p>
</section>
`;
rep('<section>\n  <h2 id="s5">', extra + '\n<section>\n  <h2 id="s5">');
fs.writeFileSync(f, crlf ? h.replace(/\n/g, '\r\n') : h);
console.log('ok', Buffer.byteLength(h));
