// 2026-11-08 改修1回目：名義を編集部に・ヘッダー/フッター/下のバーを新しい分類に・ハブ5本・トップと運営者情報・images/ の写しを転送に
// 使い方：node tools/renew-phase1.js   （ファイルは消さない）
const fs=require('fs'),path=require('path');
const R=path.resolve(__dirname,'..');const SITE='https://essential-beauty-needs.com/';
const read=f=>fs.readFileSync(path.join(R,f),'utf8');const write=(f,s)=>fs.writeFileSync(path.join(R,f),s);
const isStub=b=>/http-equiv="refresh"/i.test(b);
const rootFiles=fs.readdirSync(R).filter(f=>f.endsWith('.html'));
const pages=rootFiles.filter(f=>!isStub(read(f)));
const titleOf=f=>((read(f).match(/<title>([^<]*)<\/title>/)||[])[1]||f).replace(/\s*[｜|]\s*Essential Beauty Needs\s*$/,'');
const descOf=f=>((read(f).match(/<meta name="description" content="([^"]*)"/)||[])[1]||'');
const A='style="display:block;color:#8c4a5c;text-decoration:underline;text-decoration-color:rgba(140,74,92,.4);text-underline-offset:3px;font-size:12.5px;font-weight:500;font-family:\'Zen Kaku Gothic New\',sans-serif;padding:3px 0;text-align:left;line-height:1.6"';
const P='style="margin:0 0 8px;font-size:10.5px;letter-spacing:.12em;color:#5f7a63;font-weight:700;font-family:\'Zen Kaku Gothic New\',sans-serif;text-align:left"';
const NAV=[['datsumo.html','脱毛'],['esthe.html','エステ'],['gym.html','ジム・ヨガ'],['teeth.html','ホワイトニング'],['bridal.html','花嫁の準備'],['trial-collection.html','体験リスト']];
const HEADER=`<header class="site-head">
  <div class="site-head-in">
    <a class="brand" href="index.html">Essential Beauty Needs<span>美容のお試しノート</span></a>
    <nav class="site-nav">
${NAV.map(([h,t])=>`        <a href="${h}">${t}</a>`).join('\n')}
    </nav>
  </div>
</header>`;
const grp=(name,links)=>`      <div>
        <p ${P}>${name}</p>
${links.map(([h,t])=>`        <a href="${h}" ${A}>${t}</a>`).join('\n')}
      </div>`;
const FOOTER=`<footer class="site-foot">
  <div class="wrap">
    <div class="foot-by">Essential Beauty Needs ／ 編集：Essential Beauty Needs 編集部</div>
    <div class="foot-groups" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:22px 24px;text-align:left">
${grp('分類から探す',[['datsumo.html','脱毛'],['esthe.html','エステ・整体'],['gym.html','ジム・ヨガ・オンライン'],['teeth.html','歯のホワイトニング'],['bridal.html','花嫁の準備']])}
${grp('比べて決める',[['trial-collection.html','無料・低額で試せる体験リスト'],['gym-trial-refusal.html','体験だけで帰る方法'],['gym-cancel.html','契約の前に確認すること']])}
${grp('サイト情報',[['about.html','運営者情報'],['privacy-policy.html','プライバシーポリシー'],['beauty-column.html','記事の一覧']])}
    </div>
    <p class="pr">当サイトはアフィリエイト広告を利用しています。掲載している価格・キャンペーン内容は変動する場合があるため、必ず各公式サイトで最新の情報をご確認ください。<br>本サイトの内容は一般的な情報提供を目的としたもので、診断・治療を目的とした医療行為ではありません。</p>
    <p class="pr">© 2026 Essential Beauty Needs</p>
  </div>
</footer>`;
const BAR=`<!-- ebn-bar -->
<div class="ebn-bar" style="position:fixed;left:0;right:0;bottom:0;z-index:60;display:flex;gap:8px;padding:8px 10px calc(8px + env(safe-area-inset-bottom));background:rgba(255,255,255,.97);border-top:1px solid #e8e6e1;box-shadow:0 -2px 10px rgba(0,0,0,.06)">
  <a href="trial-collection.html" style="flex:2;display:flex;align-items:center;justify-content:center;min-height:44px;padding:8px 10px;text-decoration:none;font-size:13.5px;font-weight:700;text-align:center;line-height:1.35;font-family:'Zen Kaku Gothic New',sans-serif;background:#b83d63;color:#fff">無料・低額で試せる体験リスト ＞</a>
  <a href="index.html#cat" style="flex:1;display:flex;align-items:center;justify-content:center;min-height:44px;padding:8px 10px;text-decoration:none;font-size:13.5px;font-weight:700;text-align:center;line-height:1.35;font-family:'Zen Kaku Gothic New',sans-serif;background:#fff;color:#3d3836;border:1px solid #c3d0c0">分類から探す</a>
</div>
<style>body{padding-bottom:76px}@media(min-width:900px){.ebn-bar{left:auto!important;right:16px!important;bottom:16px!important;width:440px;border:1px solid #e8e6e1!important}body{padding-bottom:0}}</style>
<!-- /ebn-bar -->`;
const ORG='{"@type":"Organization","name":"Essential Beauty Needs 編集部","url":"https://essential-beauty-needs.com/about.html"}';
const log=[];
// 1. 既存ページ：ヘッダー・フッター・バー・名義
const TXT=[[/Yuriのアドバイス/g,'編集部のメモ'],[/Yuriが順に答えました/g,'編集部が順に答えました'],[/Yuriが厳選した/g,'編集部が選んだ'],[/Yuriによる美容コラム一覧/g,'美容コラムの一覧'],[/Yuriが解説します/g,'編集部が解説します'],[/Yuriが/g,'編集部が']];
for(const f of pages){let b=read(f);const o=b;
 b=b.replace(/<header class="site-head">[\s\S]*?<\/header>/,HEADER);
 b=b.replace(/<footer class="site-foot">[\s\S]*?<\/footer>/,FOOTER);
 b=b.replace(/<!-- ebn-bar -->[\s\S]*?<!-- \/ebn-bar -->/,BAR);
 b=b.replace(/\{\s*"@type":\s*"Person",\s*"name":\s*"Yuri"(?:,\s*"jobTitle":\s*"[^"]*")?\s*\}/g,ORG);
 for(const [re,t] of TXT)b=b.replace(re,t);
 if(b!==o){write(f,b);log.push(f)}}
// 2. images/ の古い写し → 転送
const stub=to=>`<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="${SITE}${to}">
<meta http-equiv="refresh" content="0; url=/${to}">
<title>ページを移動しました｜Essential Beauty Needs</title>
</head>
<body><p><a href="/${to}">こちらのページに移動しました</a></p></body>
</html>
`;
for(const f of fs.readdirSync(path.join(R,'images')).filter(f=>f.endsWith('.html'))){write('images/'+f,stub(f));log.push('images/'+f+' → '+f)}
// 3. 新しいページの部品
const head=({file,title,desc,crumb})=>{const url=file==='index.html'?SITE:SITE+file;const ld={"@context":"https://schema.org","@graph":[{"@type":"WebSite","@id":SITE+"#website","url":SITE,"name":"Essential Beauty Needs","inLanguage":"ja"},{"@type":file==='index.html'?'WebPage':'CollectionPage',"name":title,"url":url,"description":desc,"publisher":JSON.parse(ORG)},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"トップ","item":SITE}].concat(crumb?[{"@type":"ListItem","position":2,"name":crumb,"item":url}]:[])}]};
return `<!DOCTYPE html>
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
<meta property="og:type" content="${file==='index.html'?'website':'article'}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&family=Shippori+Mincho:wght@500;600&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/site.css">
<script>function isInternalUser(){return document.cookie.split(';').some(function(c){return c.trim().indexOf('internal_user=true')===0})}
if(!isInternalUser()){var g=document.createElement('script');g.async=true;g.src="https://www.googletagmanager.com/gtag/js?id=G-2HGEPHVZYY";document.head.appendChild(g);window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-2HGEPHVZYY');}
</script>
<link rel="stylesheet" href="assets/mobile.css">
<script type="application/ld+json">
${JSON.stringify(ld,null,1)}
</script>
</head>
<body>
${HEADER}
<main>
<div class="wrap">
${crumb?`<nav class="crumb" aria-label="現在位置" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12px;color:#6f6a67;padding:14px 0 0;font-family:'Zen Kaku Gothic New',sans-serif"><a href="index.html" style="color:#8c4a5c">トップ</a><span>›</span><span>${crumb}</span></nav>`:''}
`;};
const tail=`
</div>
</main>
${FOOTER}
${BAR}
</body>
</html>
`;
const tc=read('trial-collection.html');
const sec=id=>{const i=tc.indexOf(`<h2 id="${id}"`);if(i<0)throw 'no section '+id;const s=tc.lastIndexOf('<section',i);const e=tc.indexOf('</section>',i)+10;return tc.slice(s,e)};
const list=(files)=>{const miss=files.filter(f=>!pages.includes(f));if(miss.length)throw 'missing '+miss;return `<div class="phase">
${files.map(f=>{const d=descOf(f);return `    <a href="${f}"><span class="t">${titleOf(f)}</span><span class="d">${d.length>60?d.slice(0,58)+'…':d}</span></a>`}).join('\n')}
  </div>`};
const checks=(rows)=>`<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.7">
<thead><tr><th style="text-align:left;padding:8px;border-bottom:2px solid #e8e6e1;white-space:nowrap">確かめること</th><th style="text-align:left;padding:8px;border-bottom:2px solid #e8e6e1">聞き方・見る場所</th></tr></thead>
<tbody>
${rows.map(([a,b])=>`<tr><td style="padding:8px;border-bottom:1px solid #e8e6e1;vertical-align:top;white-space:nowrap;font-weight:700">${a}</td><td style="padding:8px;border-bottom:1px solid #e8e6e1">${b}</td></tr>`).join('\n')}
</tbody></table></div>`;
const HUBS=[
 {file:'datsumo.html',crumb:'脱毛',title:'脱毛の無料カウンセリング・体験を比べる｜回数と間隔、受ける前の確認',desc:'脱毛は無料カウンセリングから始められます。医療脱毛とサロンの違い、回数と間隔、当日に聞くこと、契約の前に確かめる点を表で整理しました。',
  h1:'脱毛は、無料カウンセリングで<br>回数と期限を先に聞く。',lead:'脱毛は1回で終わらず、2〜3ヶ月おきに何回か通います。そのため、始める前に「いつまでに、何回通えるか」を無料カウンセリングで確かめるのが近道です。医療脱毛（クリニック）と脱毛サロンでは、使える機械や回数の目安が違います。',
  body:()=>`<section>
  <h2>カウンセリングの前に確かめること</h2>
  ${checks([['医療かサロンか','クリニック（医療脱毛）か、サロンかを公式サイトで確かめる'],['回数と間隔','「何回で、何ヶ月おきか」を聞く。終わらせたい時期があれば先に伝える'],['総額','初回の価格だけでなく、コース全体の金額と追加料金（剃り残し・麻酔など）を聞く'],['予約の取りやすさ','次の予約がどのくらい先まで埋まっているかを聞く'],['解約と返金','途中でやめるときの返金の決まりを、契約の前に書面で見る']])}
  <p class="small">料金やキャンペーンは変わります。申し込む前に、各公式サイトで最新の内容を確かめてください。</p>
</section>
${sec('datsumo')}
<section>
  <h2>脱毛の記事</h2>
  ${list(['shirono-datsumo.html','hair-removal.html','nape-hair-removal.html'])}
</section>`},
 {file:'esthe.html',crumb:'エステ・整体',title:'エステの体験・モニターを比べる｜初回料金と勧誘の断り方',desc:'エステや整体は、初回の体験やモニターで試せます。初回の料金、当日の流れ、勧誘を断る言い方、契約の前に確かめる点を表で整理しました。',
  h1:'エステは、体験で相性を見てから<br>契約するかを決める。',lead:'エステや整体の多くは、初回を割引の価格で試せます。いっぽうで、体験の日にコースをすすめられることもあります。その場で決めずに帰る準備をしてから行くと、落ち着いて比べられます。',
  body:()=>`<section>
  <h2>体験に行く前に確かめること</h2>
  ${checks([['初回の料金','体験の価格に、税・カウンセリング・化粧品代が含まれるかを確かめる'],['所要時間','カウンセリングを含めて何分かかるか。予定は余裕をもって入れる'],['当日の勧誘','「今日は決めません」と最初に伝える。断り方は<a href="gym-trial-refusal.html">体験だけで帰る方法</a>を参考に'],['コースの総額','回数・期間・総額・支払い方法を紙でもらう'],['解約','クーリング・オフや中途解約の決まりを、契約の前に確かめる（<a href="gym-cancel.html">契約の前に確認すること</a>）']])}
</section>
${sec('s4')}
<section>
  <h2>エステの記事</h2>
  ${list(['esthe-monitor.html','bridal-esthe.html','gym-vs-esthe.html','gym-cancel.html'])}
</section>`},
 {file:'gym.html',crumb:'ジム・ヨガ・オンライン',title:'ジム・ホットヨガ・オンラインフィットネスの体験を比べる｜初回の条件と断り方',desc:'パーソナルジム、女性専用ジム、ホットヨガ、オンラインフィットネスの体験を比べました。初回の条件、通いやすさ、体験だけで帰る方法を整理しています。',
  h1:'ジムは「通える場所か」を先に見て、<br>体験で続けられるかを試す。',lead:'ジムやヨガは、続けて通えるかで結果が変わります。そのため、内容より先に、家や職場から通える場所か、オンラインで済むかを決めると選びやすくなります。体験は無料や低額のところが多いので、2か所ほど試してから決めましょう。',
  body:()=>`<section>
  <h2>体験の前に確かめること</h2>
  ${checks([['通いやすさ','家・職場から片道何分か。オンラインなら移動はなし'],['体験の条件','無料か低額か、持ち物（ウェア・タオル・水）は借りられるか'],['入会金・月額','入会金、月会費、食事指導などの追加料金を聞く'],['休会・退会','休会できるか、退会はいつまでに何をすればよいかを確かめる'],['当日の勧誘','その場で決めない。断り方は<a href="gym-trial-refusal.html">体験だけで帰る方法</a>']])}
</section>
${sec('s1')}
${sec('s2')}
${sec('s3')}
<section>
  <h2>ジム・ヨガの記事</h2>
  ${list(['lava-trial.html','soelu-trial.html','rizap-counseling.html','furdi-trial.html','personal-gym.html','womens-gym.html','online-fitness.html','gym-trial-refusal.html','gym-cancel.html','workout-wear.html'])}
</section>`},
 {file:'teeth.html',crumb:'歯のホワイトニング',title:'ホワイトニングの初回体験を比べる｜通院と自宅の違いと回数',desc:'歯のホワイトニングを、通院（オフィス）と自宅（ホーム）で比べました。初回の体験、回数の目安、受ける前に確かめることを表で整理しています。',
  h1:'ホワイトニングは、<br>通院か自宅かを先に決める。',lead:'歯のホワイトニングには、歯科医院で受ける方法と、自宅で続ける方法があります。どちらも1回で終わるとは限らないため、何回・どのくらいの期間かかるかを、初回のカウンセリングで聞いておくと安心です。',
  body:()=>`<section>
  <h2>受ける前に確かめること</h2>
  ${checks([['通院か自宅か','医院で受ける（オフィス）か、マウスピースで自宅で続ける（ホーム）か'],['回数と期間','何回・何週間で、どのくらいの白さを目指すのかを聞く'],['しみやすさ','知覚過敏がある場合は、先に伝えて相談する'],['料金','初回の価格と、2回目からの価格、検診の費用を確かめる'],['食事の注意','施術のあとに避けたほうがよい飲み物や食べ物を聞く']])}
</section>
${sec('white')}
<section>
  <h2>ホワイトニングの記事</h2>
  ${list(['white-meister.html','whitening.html'])}
</section>`},
];
const BRIDAL={file:'bridal.html',crumb:'花嫁の準備',title:'花嫁の準備ノート｜挙式までの体と肌・ドレス・式場の記事一覧',desc:'挙式までの体と肌の整え方、ドレスの形別の準備、季節別の注意、ブライダルフェアの回り方まで、花嫁の準備の記事を時期と目的で並べました。',
 h1:'花嫁の準備は、<br>残りの期間から逆算する。',lead:'挙式までに何を整えるかは、残りの期間とドレスの形で変わります。まずは時期別の記事で順番を決め、気になる部位やドレスの記事へ進んでください。脱毛やエステなどの体験は、分類のページでも比べられます。',
 groups:[['時期別にやること',['checklist.html','diet-timing.html','half-year-plan.html','three-months-plan.html','one-month-before.html','two-weeks-before.html','budget-plan.html','weight-regain.html']],
 ['体を整える',['bridal-care.html','prehana-back.html','prehana-arm.html','prehana-mukumi.html','prehana-rounded-shoulders.html','back-open-dress.html','decollete.html','waist.html','face-slimming.html','morning-puffiness.html','arm-home-exercise.html','arm-photo-pose.html','back-bra-line.html']],
 ['肌と髪',['lifestyle-skincare.html','age-skincare.html','sensitive-skin.html','skin-emergency.html','seasons-skin.html','back-acne-urgent.html','hair-care.html','hair-3months.html']],
 ['ドレスの形別',['dress-line.html','a-line-dress.html','mermaid-dress.html','empire-dress.html','princess-dress.html','slender-dress.html','first-fitting.html','dress-confusion.html','arm-cover-dress.html','japanese-wedding.html']],
 ['季節・スタイル別',['spring-wedding.html','summer-wedding.html','autumn-wedding.html','winter-wedding.html','small-wedding.html','photo-only-wedding.html','bride-30s.html','bride-40s.html']],
 ['式場・当日・そのあと',['wedding-start.html','bridal-fair.html','bridal-fair-no-booking.html','bridal-fair-decision.html','photo-day-prep.html','groom-prep.html','wedding-gift.html','after-wedding.html']],
 ['食事と生活',['day-before-meal.html','eating-out.html','drinking-week.html','convenience-protein.html']]]};
const hero=(h1,lead)=>`<section class="phero">
  <p class="eyebrow">BEAUTY TRIAL NOTE</p>
  <h1>${h1}</h1>
  <p class="lead">${lead}</p>
</section>`;
for(const h of HUBS){write(h.file,head(h)+hero(h.h1,h.lead)+'\n'+h.body()+'\n'+`<section class="next"><p class="small">ほかの分類も見る：${NAV.filter(n=>n[0]!==h.file).map(([a,t])=>`<a href="${a}">${t}</a>`).join('・')}</p></section>`+tail);log.push('new '+h.file)}
write(BRIDAL.file,head(BRIDAL)+hero(BRIDAL.h1,BRIDAL.lead)+'\n'+BRIDAL.groups.map(([g,fs])=>`<section>\n  <h2>${g}</h2>\n  ${list(fs)}\n</section>`).join('\n')+'\n'+`<section class="next"><p class="small">脱毛・エステ・ホワイトニングの体験は、<a href="datsumo.html">脱毛</a>・<a href="esthe.html">エステ</a>・<a href="teeth.html">ホワイトニング</a>の分類で比べられます。</p></section>`+tail);log.push('new bridal.html');
// 4. トップ
const catCard=(f,t,d)=>`    <div class="card">
      <h3>${t}</h3>
      <p>${d}</p>
      <a class="go" href="${f}">${t}の体験を比べる →</a>
    </div>`;
const INDEX=head({file:'index.html',title:'美容のお試しノート｜脱毛・エステ・ジムの無料体験を条件で比べる',desc:'脱毛・エステ・ジム・ホワイトニングの無料体験や無料カウンセリングを、初回の料金・当日の流れ・断り方・解約の条件で比べるサイトです。編集部がまとめています。',crumb:''})+
`<section class="phero">
  <div class="hero-img"><img src="images/esthe.jpg" alt="エステの施術ルーム" fetchpriority="high"></div>
  <p class="eyebrow">BEAUTY TRIAL NOTE</p>
  <h1>美容の「お試し」は、<br>条件を見てから選ぶ。</h1>
  <p class="lead">脱毛もエステもジムも、初回は無料や低額で試せるものが多くあります。ただ、条件はサービスごとに違います。初回の料金、当日の流れ、勧誘の断り方、解約の決まりを先に見ておけば、その場で迷わずに済みます。</p>
  <a class="cta" href="trial-collection.html">無料・低額で試せる体験リストを見る</a>
</section>

<section id="cat">
  <h2>分類から探す</h2>
  <div class="grid grid-2">
${catCard('datsumo.html','脱毛','医療脱毛もサロンも、まず無料カウンセリングで回数と期間を聞くところから。')}
${catCard('esthe.html','エステ','初回の体験やモニターで相性を見てから。勧誘の断り方も先に用意しておきます。')}
${catCard('gym.html','ジム・ヨガ','通える場所か、オンラインで済むかを先に決めて、2か所ほど体験してから選びます。')}
${catCard('teeth.html','ホワイトニング','通院か自宅かを決めて、回数と期間を初回に確かめます。')}
  </div>
</section>

<section>
  <h2>体験を受ける前に決めておく3つ</h2>
  <div class="phase">
    <a href="gym-trial-refusal.html"><span class="n">1</span><span class="t">その日に契約しない</span><span class="d">「今日は決めません」と最初に伝える。体験だけで帰る言い方をまとめました。</span></a>
    <a href="gym-cancel.html"><span class="n">2</span><span class="t">解約の決まりを先に見る</span><span class="d">途中でやめるときの返金や、クーリング・オフの条件を契約の前に確かめます。</span></a>
    <a href="trial-collection.html"><span class="n">3</span><span class="t">2か所以上を比べる</span><span class="d">1か所だけだと、料金や通いやすさの良し悪しが分かりません。</span></a>
  </div>
</section>

<section>
  <h2>花嫁の準備</h2>
  <p>挙式までに体と肌を整えたい方向けの記事は、時期別・部位別・ドレスの形別にまとめています。</p>
  <a class="cta-sub" href="bridal.html">花嫁の準備の記事を見る</a>
</section>

<section class="next">
  <p class="small">このサイトについては<a href="about.html">運営者情報</a>をご覧ください。料金やキャンペーンは変わるため、申し込む前に各公式サイトで最新の内容を確かめてください。</p>
</section>`+tail;
write('index.html',INDEX);log.push('rewrite index.html');
// 5. 運営者情報
const ab=read('about.html');const abMainS=ab.indexOf('<main>'),abMainE=ab.indexOf('</main>')+7;
const ABOUT=`<main>
<div class="wrap">
<nav class="crumb" aria-label="現在位置" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12px;color:#6f6a67;padding:14px 0 0;font-family:'Zen Kaku Gothic New',sans-serif"><a href="index.html" style="color:#8c4a5c">トップ</a><span>›</span><span>運営者情報</span></nav>
<section class="phero">
  <p class="eyebrow">ABOUT</p>
  <h1>このサイトについて</h1>
  <p class="lead">Essential Beauty Needs（美容のお試しノート）は、脱毛・エステ・ジム・ホワイトニングなどの無料体験や無料カウンセリングを、条件で比べるための情報サイトです。Essential Beauty Needs 編集部が運営しています。</p>
</section>
<section>
  <h2>扱うこと</h2>
  <ul>
    <li>初回の料金、所要時間、持ち物などの体験の条件</li>
    <li>当日の流れと、その日に契約しないための断り方</li>
    <li>契約の前に確かめたい、総額・解約・返金の決まり</li>
    <li>花嫁の準備（体と肌・ドレス・式場探し）</li>
  </ul>
</section>
<section>
  <h2>編集の方針</h2>
  <p>サービスの効果を約束する書き方はしません。料金や条件は、各サービスの公式サイトの案内をもとに書き、ページに確かめた日を載せます。料金やキャンペーンは変わるため、申し込む前に必ず公式サイトで最新の内容を確かめてください。</p>
  <p>美容医療（医療脱毛など）は、診療の内容をクリニックの医師と相談して決めるものです。このサイトは、カウンセリングの前に確かめたいことを整理する役割にとどめます。</p>
</section>
<section>
  <h2>運営者</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.7"><tbody>
    <tr><th style="text-align:left;padding:8px;border-bottom:1px solid #e8e6e1;white-space:nowrap">サイト名</th><td style="padding:8px;border-bottom:1px solid #e8e6e1">Essential Beauty Needs（美容のお試しノート）</td></tr>
    <tr><th style="text-align:left;padding:8px;border-bottom:1px solid #e8e6e1;white-space:nowrap">運営</th><td style="padding:8px;border-bottom:1px solid #e8e6e1">Essential Beauty Needs 編集部</td></tr>
    <tr><th style="text-align:left;padding:8px;border-bottom:1px solid #e8e6e1;white-space:nowrap">URL</th><td style="padding:8px;border-bottom:1px solid #e8e6e1">https://essential-beauty-needs.com/</td></tr>
  </tbody></table>
</section>
<section>
  <h2>免責事項</h2>
  <ul>
    <li>掲載している情報は一般的な情報提供を目的としたものであり、診断・治療・医療行為に代わるものではありません。体調や肌に不安がある場合は、医師にご相談ください</li>
    <li>価格・キャンペーン内容・サービス内容は変わります。最終的な判断は、各公式サイトの情報を確かめたうえで行ってください</li>
    <li>当サイトはアフィリエイト広告を利用しています。掲載の順番や紹介の内容は、当サイトの編集の判断によるものです</li>
  </ul>
  <p>個人情報の取り扱いについては<a href="privacy-policy.html">プライバシーポリシー</a>をご覧ください。</p>
</section>
</div>
</main>`;
if(abMainS<0)throw 'about main';write('about.html',ab.slice(0,abMainS)+ABOUT+ab.slice(abMainE));log.push('rewrite about.html main');
// 6. sitemap
let sm=read('sitemap.xml');sm=sm.replace(/\s*<url>\s*<loc>https:\/\/essential-beauty-needs\.com\/start\.html<\/loc>[\s\S]*?<\/url>/,'');
const today='2026-11-08';sm=sm.replace(/(<loc>https:\/\/essential-beauty-needs\.com\/<\/loc>\s*<lastmod>)[^<]*/,'$1'+today).replace(/(<loc>https:\/\/essential-beauty-needs\.com\/about\.html<\/loc>\s*<lastmod>)[^<]*/,'$1'+today);
const add=['datsumo.html','esthe.html','gym.html','teeth.html','bridal.html'].filter(f=>!sm.includes(SITE+f)).map(f=>`  <url>\n    <loc>${SITE}${f}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`).join('');
sm=sm.replace('</urlset>',add+'</urlset>');write('sitemap.xml',sm);log.push('sitemap +5 -start.html');
console.log(log.length+' changes');console.log(log.filter(l=>!/\.html$/.test(l)||l.startsWith('new')||l.startsWith('rewrite')).join('\n'));
