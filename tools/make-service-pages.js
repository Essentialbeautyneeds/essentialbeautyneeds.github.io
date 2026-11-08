// 改修2回目：サービスごとのページ（条件・当日の流れ・断り方・解約）
// 事実はすべて各社の公式サイトで 2026-11-08 に確認したもの。確認できなかった項目は書かない
// 使い方：node tools/make-service-pages.js   （同じ内容で何度実行してもよい）
const fs=require('fs'),path=require('path');
const R=path.resolve(__dirname,'..');const SITE='https://essential-beauty-needs.com/';const DAY='2026年11月8日';
const read=f=>fs.readFileSync(path.join(R,f),'utf8');const write=(f,s)=>fs.writeFileSync(path.join(R,f),s);
const tpl=read('datsumo.html');
const HEADER=tpl.match(/<header class="site-head">[\s\S]*?<\/header>/)[0];
const FOOTER=tpl.match(/<footer class="site-foot">[\s\S]*?<\/footer>/)[0];
const BAR=tpl.match(/<!-- ebn-bar -->[\s\S]*?<!-- \/ebn-bar -->/)[0];
const HEADMID=tpl.slice(tpl.indexOf('<link rel="icon"'),tpl.indexOf('<script type="application/ld+json">'));
const tc=read('trial-collection.html');
const card=name=>{const i=tc.indexOf(`<h3>${name}</h3>`);if(i<0)throw 'no card '+name;const s=tc.lastIndexOf('<div class="card">',i);const e=tc.indexOf('\n    </div>',i)+11;return tc.slice(s,e)};
const CAT={gym:['gym.html','ジム・ヨガ・オンライン'],datsumo:['datsumo.html','脱毛'],teeth:['teeth.html','歯のホワイトニング']};
const td='style="padding:8px;border-bottom:1px solid #e8e6e1;vertical-align:top"';
const th='style="text-align:left;padding:8px;border-bottom:1px solid #e8e6e1;vertical-align:top;white-space:nowrap;font-weight:700"';
const table=rows=>`<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.7"><tbody>
${rows.map(([a,b])=>`<tr><th ${th}>${a}</th><td ${td}>${b}</td></tr>`).join('\n')}
</tbody></table></div>`;
const box=(t,inner)=>`<div style="margin:16px 0;padding:16px 18px;background:#fbfbf9;border:1px solid #e8e6e1;border-left:4px solid #b83d63;line-height:1.8"><p style="margin:0 0 6px;font-weight:700">${t}</p>${inner}</div>`;
const S=[
{file:'lava-trial.html',cat:'gym',card:'ホットヨガスタジオLAVA',name:'ホットヨガスタジオLAVA',
 title:'LAVAの体験レッスン｜料金・持ち物・当日の流れと断り方',
 desc:'ホットヨガLAVAの体験レッスンは公式サイトで0円と案内されています。持ち物、手ぶら体験、当日の流れ、当日入会の特典、解約の期限を公式サイトの記載をもとに整理しました。',
 h1:'LAVAの体験は、<br>30分前に着いて約2時間みておく。',
 lead:'ホットヨガスタジオLAVAの体験レッスンは、公式サイトで0円（税込）と案内されています。レッスンは60分ですが、受付から着替えまでは約2時間です。体験の日に入会すると特典がつく一方、解約は店頭でしか受け付けていないなど、先に知っておきたい決まりがあります。',
 rows:[['体験の料金','0円（税込）と掲載。ただし「キャンペーンによって異なる」との記載もあり、申し込み画面で確かめる'],['時間','レッスンは60分。受付からレッスン後の着替えまで約2時間。開始の30分前に来店（30分前を過ぎると受けられない場合がある）'],['持ち物','運動できるウェア上下、汗ふき用のタオル、常温の水1リットル以上、シャワー用のバスタオル、替えの下着。手ぶら体験なら、ウェア・タオル・水・マットを店舗で無料で用意'],['予約','Web・LINEでレッスン開始の120分前まで。電話の体験予約もあり。キャンセルはレッスン前日23:59までWebで'],['体験の対象','入会したことがなく、過去5か月以内に体験していない人'],['当日入会の特典','入会金5,000円と登録金5,000円が0円、月会費が最大1,000円引き（店舗で確認）。施設使用料2,500円は必要'],['月会費の例','ライト・フルタイム 7,800円〜15,800円（店舗で違う）。ほかに運営管理費が毎月680円'],['解約','希望する月の前月15日までに、登録した店舗の店頭で手続き。Web・メールでは受け付けていない']],
 flow:['Web・LINE・電話で体験を予約する（開始の120分前まで）','開始の30分前に来店し、受付をする','着替えて、60分のレッスンを受ける','シャワー・着替えのあと、入会を希望する人は説明を受ける（入会の手続きは30〜45分ほど）'],
 refuse:'「今日は体験だけのつもりです。料金表をいただいて、家で比べてから決めます。」',
 refuseNote:'体験の日に入会すると入会金などが0円になる特典があります。それでも、通える店舗の月会費と、解約の期限を見てから決めても遅くありません。キャンペーンの中には、特価のあとに12ヶ月の継続が条件になるものもあります（2026年11月の案内）。',
 good:['まずは手ぶらで試してみたい','汗をかく運動を習慣にしたい','職場や家の近くに店舗がある'],bad:['店頭に行かずにWebで解約したい','暑い室内が苦手','続けて通える店舗が近くにない'],
 src:'ホットヨガスタジオLAVA 公式サイト（料金のページ・はじめての方へ・ヘルプセンター）'},
{file:'soelu-trial.html',cat:'gym',card:'SOELU（ソエル）',name:'SOELU（ソエル）',
 title:'SOELU（ソエル）の100円お試し｜料金・自動更新・解約の注意',
 desc:'SOELUはライト・プレミアムとも、12ヶ月コースの最初の1ヶ月が100円で試せます。2ヶ月目からの月額、自動更新、12ヶ月未満でやめたときの違約金を公式サイトの記載で整理しました。',
 h1:'SOELUの100円は、<br>12ヶ月コースの1ヶ月目の料金。',
 lead:'オンラインのヨガ・フィットネスのSOELU（ソエル）は、12ヶ月コースの最初の1ヶ月を100円（税込）で試せます。ただし、2ヶ月目からは通常の月額になり、12ヶ月より前にやめると違約金がかかります。申し込む前に、続けられるかと解約の決まりを確かめておきましょう。',
 rows:[['お試し','ライト・プレミアムとも、12ヶ月コースの最初の1ヶ月が100円（税込）'],['2ヶ月目から','ライト 12ヶ月コース 月3,278円、プレミアム 12ヶ月コース 月6,578円（税込）'],['1ヶ月コース','ライト 月4,378円、プレミアム 月9,878円（税込）'],['自動更新','自動更新。続けない場合はマイページ（Web）から解約の手続きが必要'],['途中でやめる','12ヶ月コースを12ヶ月未満で解約すると違約金がかかる'],['休会','どのプランも最長3ヶ月まで休会できる'],['支払い','クレジットカード、Amazon Pay']],
 flow:['公式サイトからお試しを申し込む','マイページでプランとコースを確かめる','自宅でオンラインのレッスンを受ける','続けない場合は、解約できる時期をマイページで確かめて、Webから手続きする'],
 refuse:'',refuseNote:'オンラインなので対面の勧誘はありません。そのかわり、自動更新と12ヶ月コースの違約金が大事な確認点です。お試しを始めた日をカレンダーに書いておくと、続けるかどうかを決め忘れません。',
 good:['家で、好きな時間に運動したい','ヨガやピラティスを少しずつ試したい','1年続けるつもりがある'],bad:['1〜2ヶ月だけ使いたい（1ヶ月コースのほうが合う）','画面越しだと続かない','解約の日を管理するのが苦手'],
 src:'SOELU 公式サイト（トップページ・料金のページ）'},
{file:'rizap-counseling.html',cat:'gym',card:'RIZAP',name:'RIZAP（ライザップ）',
 title:'RIZAPの無料カウンセリング｜所要時間・流れと返金保証の条件',
 desc:'RIZAPの無料カウンセリングは約60〜90分で、カウンセリングだけでもよいと公式サイトに書かれています。当日の流れ、料金の例、30日間全額返金保証の条件を整理しました。',
 h1:'RIZAPのカウンセリングは、<br>受けるだけでもよい。',
 lead:'RIZAPの無料カウンセリングは約60〜90分です。公式サイトのよくある質問には、カウンセリングを受けても入会しなくてよい（カウンセリングのみでも問題ない）と書かれています。料金は2ヶ月で40万円近くになるため、返金保証の条件まで見てから決めましょう。',
 rows:[['カウンセリング','無料。約60〜90分。Webフォームか電話で予約'],['内容','ヒアリング → 体の計測（結果のシートはその場でもらえる） → 目標の設定 → プログラムの提案 → 入会の申し込み（希望する人だけ）'],['入会しなくてよいか','「カウンセリングのみでも問題ない」と公式サイトに記載'],['料金の例','BASICプラン 2ヶ月 327,800円＋入会金55,000円＝合計382,800円（税込）'],['返金保証','コースの初回利用日から30日間、コース代金を全額返金。物品は対象外。手続きは来店して書面で（電話・メールは不可）。使うと再入会できない'],['途中でやめるとき','中途解約の決まりは、公式サイトにある会則で確かめる']],
 flow:['Webか電話でカウンセリングを予約する','店舗で今の体と生活について話す','体を計測し、結果のシートを受け取る','目標を決め、プログラムの提案を受ける','入会するかを決める（その日に決めなくてよい）'],
 refuse:'「今日はお話を聞きに来ました。料金と返金保証の資料をいただいて、家で考えます。」',refuseNote:'公式サイトでも「カウンセリングのみでも問題ない」とされています。料金が大きいので、総額・支払い方法・返金保証の条件を紙で受け取ってから考えましょう。',
 good:['短い期間で、食事も含めて見てもらいたい','一人では続かない','費用をかけてもよいと決めている'],bad:['費用をできるだけ抑えたい（月額制のジムやオンラインのほうが合う）','2ヶ月通う時間が取れない','食事の管理を自分で決めたい'],
 src:'RIZAP 公式サイト（プランのページ・ご利用の流れ・お支払い・よくある質問）'},
{file:'furdi-trial.html',cat:'gym',card:'ファディー（FURDI）',name:'ファディー（FURDI）',
 title:'ファディー（FURDI）の無料体験｜持ち物・所要時間・月会費と退会の期限',
 desc:'女性専用ジムのファディーは、約60分の無料体験があります。持ち物、月会費（年契約と月契約）、年契約を1年以内にやめたときの解除料、退会の期限を公式サイトの記載で整理しました。',
 h1:'ファディーは、<br>年契約か月契約かを先に決める。',
 lead:'女性専用ジムのファディー（FURDI）は、見学・カウンセリング・トレーニングの無料体験が約60分で受けられます。月会費は年契約のほうが安い一方、1年以内にやめると差額を払う決まりがあります。体験の前に、どちらで入るかの目安を持っておくと迷いません。',
 rows:[['体験','無料。約60分（スタジオ見学 → カウンセリング → トレーニング体験）'],['持ち物','動きやすい服装（更衣室あり）、室内用の運動靴、水、タオル。入会する場合は身分証とクレジットカードかキャッシュカード'],['予約','Web（店舗一覧から）、電話、メール'],['当日の入会','一度帰って、日を改めて入会の手続きをしてもよいと記載'],['月会費','プレミアム（年契約）7,678円、スタンダード（月契約）8,778円、U-18 5,428円（税込）'],['入会時の費用','事務手数料5,500円、カード発行手数料3,300円（税込）とトップページに記載。特定商取引法の表示には「月会費2ヶ月分・入会金」とあり、書き方が違うため店舗で確かめる'],['年契約の解約','1年以内に退会すると、スタンダードとの会費の差額を契約解除料として払う'],['退会','退会したい月の前月の末日までに、店舗で手続き'],['休会','月1,100円で休会できる。戻るときの復会料は5,500円（税込）']],
 flow:['Web・電話・メールで体験を予約する','スタジオを見学する','カウンセリングで目的と生活を話す','トレーニングを体験する','入会するかを決める（日を改めてもよい）'],
 refuse:'「今日は体験だけにして、年契約と月契約のどちらにするか、家で考えます。」',refuseNote:'公式サイトにも、日を改めて入会の手続きをしてよいと書かれています。1年続けられるか分からないなら、解除料のかからない月契約から考えるのが無難です。',
 good:['女性だけのジムで運動したい','短い時間のトレーニングを続けたい','近くに店舗がある'],bad:['1年以内に引っ越す予定がある（年契約の解除料に注意）','自分のペースで黙々と鍛えたい','通える場所に店舗がない'],
 src:'FURDI 公式サイト（トップページ・ファディーについて・無料体験・よくある質問・特定商取引法に基づく表記）'},
{file:'shirono-datsumo.html',cat:'datsumo',card:'シロノクリニック',name:'シロノクリニック',
 title:'シロノクリニックの医療脱毛｜全身5回の料金・通う間隔・ほかにかかる費用',
 desc:'シロノクリニックの全身脱毛は5回セット547,800円（税込）で、上半身と下半身に分けて計10回通います。カウンセリングの流れ、通う間隔、初診料などほかにかかる費用を公式サイトで確認しました。',
 h1:'シロノの全身脱毛は、<br>計10回・約1年で通う。',
 lead:'シロノクリニック（恵比寿・銀座・横浜）の全身脱毛は、5回セットで547,800円（税込）です。上半身と下半身を分けて5回ずつ、計10回通います。コースの料金のほかに、初診料や再診料などがかかります。すべて自由診療です。',
 rows:[['院','恵比寿・銀座・横浜'],['最初の流れ','Web（初診専用）・電話・LINEで予約 → 医師の診察とカウンセリングで、肌の状態に合わせた照射の強さを決める'],['全身5回セット','547,800円（税込）。顔とVIOは含まない（顔5回 110,000円、VIO 5回 165,000円）'],['通い方','上半身5回と下半身5回に分けて、計10回。照射の間隔は約6〜8週'],['期間','完了の目安は約1年（有効期限1年）'],['ほかにかかる費用','初診料3,300円、再診料1,650円、麻酔料1,100円〜、処方料550円、剃毛代（金額は院で確かめる）'],['診療','すべて自由診療']],
 flow:['Web・電話・LINEで初診を予約する','医師の診察を受け、肌の状態と照射の強さを相談する','回数・期間・総額・ほかにかかる費用の説明を受ける','納得したら申し込む（その日に決めなくてよい）'],
 refuse:'「今日は説明だけ伺いました。総額と通う回数を書いたものをいただいて、家で考えます。」',refuseNote:'医療脱毛は、肌の状態によって照射の強さや回数が変わります。痛み・赤みなどの肌の反応や、合わない場合の対応は、診察のときに医師に確かめてください。コース料金のほかに、初診料・再診料・麻酔料がかかる点も見落としやすい項目です。',
 good:['顔とVIO以外の全身をまとめて脱毛したい','恵比寿・銀座・横浜に通える','1年ほどかけて通える'],bad:['顔やVIOもまとめて安く済ませたい（別料金）','短い期間で終わらせたい','費用を抑えて少しずつ試したい'],
 src:'シロノクリニック 公式サイト（医療脱毛のページ・治療費一覧・特定商取引法に基づく表記）'},
{file:'white-meister.html',cat:'teeth',card:'ホワイトマイスター',name:'ホワイトマイスター',
 title:'ホワイトマイスター（銀座）の初回ホワイトニング｜料金・所要時間・施術後の注意',
 desc:'ホワイトマイスター東京銀座院の初回限定メニューは22,000円と28,000円（税込）。初診は約120分です。しみる場合の対応や、施術後24時間に避けたい飲食を公式サイトの記載で整理しました。',
 h1:'ホワイトマイスターは、<br>初回は2時間ほどみておく。',
 lead:'ホワイトマイスターは、東京・銀座にあるホワイトニング専門の歯科です。初回限定のメニューは22,000円と28,000円（税込）で、初診のホワイトニングは約120分かかります。施術のあと24時間は、色の濃い飲み物や食べ物を避けるよう案内されています。',
 rows:[['場所','東京銀座院（銀座駅から徒歩1分と記載）'],['初回の料金','マイスターホワイトニング 22,000円、マイスタープラスホワイトニング 28,000円（税込・初回限定・期間限定）。基本メニューのマイスタープラスは36,000円'],['所要時間','初診のホワイトニングは約120分（ページにより90〜100分の記載もあるため、予約のときに確かめる）'],['回数','1回で完了すると記載。持ちは平均6ヶ月〜1年で、3ヶ月に1度ほどのメンテナンスをすすめている'],['しみる場合','まれに一瞬の痛みを感じる人がいる（約1割と記載）。しみやすい人は事前に相談できる'],['受けられない人','18歳未満、妊娠・授乳中、無カタラーゼ症の人はオフィスホワイトニングを受けられない'],['予約','完全予約制。電話かネット予約'],['初回限定の注意','2週間以上先の予約と、直前のキャンセルはできない'],['支払い','都度払い。入会金なし']],
 flow:['電話かネットで予約する（初回限定は2週間以内の日で）','カウンセリングで歯の状態と希望の白さを話す','施術を受ける（初診は約120分）','施術のあと24時間は、色の濃い飲食を避ける'],
 refuse:'',refuseNote:'都度払いで入会金がないため、コースの契約を迫られる形ではありません。施術のあと24時間は、コーヒー・紅茶・赤ワイン・カレー・醤油など色の濃いものを避けるよう案内されています。予定のある日の前は、日程に気をつけましょう。',
 good:['1回で変化を見たい','銀座に通える','写真を撮る予定の前に白くしたい'],bad:['18歳未満・妊娠中・授乳中の人','知覚過敏が強い人（先に相談する）','自宅で少しずつ進めたい（ホームホワイトニングが合う）'],
 src:'ホワイトマイスター 公式サイト（トップページ・よくある質問・メニューとキャンペーンのページ）'},
];
const ul=a=>`<ul>\n${a.map(x=>`    <li>${x}</li>`).join('\n')}\n  </ul>`;
const out=[];
for(const s of S){const [catFile,catName]=CAT[s.cat];const url=SITE+s.file;
 const ld={"@context":"https://schema.org","@graph":[{"@type":"Article","headline":s.title,"description":s.desc,"url":url,"datePublished":"2026-11-08","dateModified":"2026-11-08","author":{"@type":"Organization","name":"Essential Beauty Needs 編集部","url":SITE+"about.html"},"publisher":{"@type":"Organization","name":"Essential Beauty Needs","url":SITE}},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"トップ","item":SITE},{"@type":"ListItem","position":2,"name":catName,"item":SITE+catFile},{"@type":"ListItem","position":3,"name":s.name,"item":url}]}]};
 const html=`<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${s.title}｜Essential Beauty Needs</title>
<meta name="description" content="${s.desc}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${s.title}｜Essential Beauty Needs">
<meta property="og:description" content="${s.desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}images/esthe.jpg">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
${HEADMID}<script type="application/ld+json">
${JSON.stringify(ld,null,1)}
</script>
</head>
<body>
${HEADER}
<main>
<div class="wrap">
<nav class="crumb" aria-label="現在位置" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12px;color:#6f6a67;padding:14px 0 0;font-family:'Zen Kaku Gothic New',sans-serif"><a href="index.html" style="color:#8c4a5c">トップ</a><span>›</span><a href="${catFile}" style="color:#8c4a5c">${catName}</a><span>›</span><span>${s.name}</span></nav>
<section class="phero">
  <p class="eyebrow">TRIAL CHECK</p>
  <h1>${s.h1}</h1>
  <p class="lead">${s.lead}</p>
</section>

<section>
  <h2>${s.name}の条件（公式サイトの記載）</h2>
  ${table(s.rows)}
  <p class="small">${DAY}に公式サイトで確かめた内容です。料金やキャンペーンは変わるため、申し込む前に公式サイトで最新の内容を確かめてください。</p>
</section>

<section>
  <h2>当日の流れ</h2>
  <ol>
${s.flow.map(x=>`    <li>${x}</li>`).join('\n')}
  </ol>
</section>

<section>
  <h2>${s.refuse?'その日に決めないための言い方':'申し込む前に気をつけること'}</h2>
  ${s.refuse?box('そのまま使える言い方',`<p style="margin:0">${s.refuse}</p>`):''}
  <p>${s.refuseNote}</p>
  <p class="small">体験のあとの断り方は<a href="gym-trial-refusal.html">体験だけで帰る方法</a>、契約の前に見る点は<a href="gym-cancel.html">契約の前に確認すること</a>にまとめています。</p>
</section>

<section>
  <h2>向いている人・向いていない人</h2>
  <div class="grid grid-2">
    <div class="card"><h3>向いている人</h3>
  ${ul(s.good)}</div>
    <div class="card"><h3>ほかを選んだほうがよい人</h3>
  ${ul(s.bad)}</div>
  </div>
</section>

<section>
  <h2>申し込みはこちら</h2>
  <div class="trial">
${card(s.card)}
  </div>
</section>

<section class="next">
  <p class="small">出典：${s.src}（${DAY}確認）</p>
  <p class="small">ほかのサービスとも比べるなら、<a href="${catFile}">${catName}の体験を比べる</a>と<a href="trial-collection.html">無料・低額で試せる体験リスト</a>へ。</p>
</section>
</div>
</main>
${FOOTER}
${BAR}
</body>
</html>
`;
 write(s.file,html);out.push(s.file);
 // 体験リストのカードから、このページへのリンク
 let t=read('trial-collection.html');const i=t.indexOf(`<h3>${s.card}</h3>`);const pe=t.indexOf('</p>',i);
 if(!t.slice(i,pe+200).includes(`href="${s.file}"`)){t=t.slice(0,pe)+` <a href="${s.file}">条件と当日の流れを見る</a>`+t.slice(pe);write('trial-collection.html',t);}
}
// 表参道 → 銀座（ホワイトマイスターの所在地を公式サイトで確認）
for(const f of fs.readdirSync(R).filter(f=>f.endsWith('.html'))){let b=read(f);if(/http-equiv="refresh"/i.test(b))continue;const o=b;
 b=b.replace(/<span class="tag n">表参道<\/span>/g,'<span class="tag n">銀座</span>').replace(/東京・表参道のホワイトニング専門の歯科/g,'東京・銀座のホワイトニング専門の歯科').replace(/クリニック（表参道）/g,'クリニック（銀座）');if(b!==o)write(f,b);}
// sitemap
let sm=read('sitemap.xml');const add=S.map(s=>s.file).filter(f=>!sm.includes(SITE+f)).map(f=>`  <url>\n    <loc>${SITE}${f}</loc>\n    <lastmod>2026-11-08</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`).join('');sm=sm.replace('</urlset>',add+'</urlset>');write('sitemap.xml',sm);
console.log('made',out.join(' '));
