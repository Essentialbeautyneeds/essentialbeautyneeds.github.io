// 健康・美容の効果を言い切っている文を言い換える（個別の文ごと）
// node tools/soften-claims.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const T = '花嫁の体づくり｜背中・二の腕・むくみ・肩を挙式までに整える順番';
const D = '花嫁の体づくりを部位別に整理しました。背中・二の腕・むくみ・巻き肩のどこから手をつけるか、挙式までの期間別の進め方と、プロに任せる場合の体験の選び方をまとめています。';
const OLD_D = '結婚式直前でも間に合う。背中ニキビ・二の腕のたるみを即効で整える花嫁ケアならミス・パリ。Yuriが仕組みと選び方を解説。';

const EDITS = {
  'bridal-care.html': [
    [/<title>[^<]*<\/title>/, `<title>${T}</title>`],
    [OLD_D, D], [OLD_D, D], [OLD_D, D], [OLD_D, D],
    [/(<meta property="og:title" content=")[^"]*/, `$1${T}`],
    ['編集部まとめ｜即効性重視の特別プログラム', '編集部まとめ｜残り期間が短い場合の選び方'],
    ['肌質改善のための「食事療法」は、効果が出るまでに<strong>最低28日（ターンオーバー周期）</strong>かかります。', '肌の生まれ変わり（ターンオーバー）には<strong>一般に約4週間かかる</strong>といわれ、生活を変えても見た目に出るまでには時間がかかります。'],
    ['alt="肌質改善のための食事療法とターンオーバー周期（28日）の解説図"', 'alt="肌のターンオーバー周期の解説図"'],
    [/寝ているだけで有酸素運動レベルの効果を狙えるマシンと、<br>プロのハンド技術で<strong>セルライト・脂肪層に直接アプローチ<\/strong>。/, 'マシンとハンドの施術を組み合わせたコースがあります。<br><strong>内容は店舗やコースによって違う</strong>ので、体験のときに確認してください。'],
    ['多少お金をかけても確実にサイズを落としたい', '費用をかけてでもプロに任せたい'],
    ['※※正直、即効性はサロンには敵いません。<br>ただし「何もしない」よりは、写真写りに明確な差が出ます。', '※自宅でのケアは時間がかかります。続けられる範囲で取り入れてください。'],
    ['<span class="parts-desc">タプタプを解消</span>', '<span class="parts-desc">太く見える原因から</span>'],
    ['<span class="parts-desc">天使の羽を出す</span>', '<span class="parts-desc">後ろ姿を整える</span>'],
    ['<span class="parts-name">むくみ撃退</span>', '<span class="parts-name">むくみ</span>'],
    ['<span class="parts-desc">即効スッキリ</span>', '<span class="parts-desc">前日・当日の整え方</span>'],
    ['<span class="parts-desc">デコルテ美人へ</span>', '<span class="parts-desc">肩の位置から</span>'],
  ],
  'lifestyle-skincare.html': [
    ['アルコールフリーや鎮静効果のあるものを選びましょう。', 'アルコールフリーなど刺激の少ないものを選びましょう。'],
    ['レモングラスやゼラニウムの香りは、虫除け効果とリフレッシュ効果の一石二鳥です。', 'レモングラスやゼラニウムなど、好きな香りで気分を切り替えるのも一つの方法です。'],
    ['短時間でも質の高い睡眠がとれるようになり、翌朝の肌のハリが劇的に変わります。', '眠りに入りやすくなる人もいます。睡眠が足りているかどうかは、翌朝の肌の調子にも出やすい部分です。'],
    ['ラベンダー、ネロリ、フランキンセンスは鎮静効果が高くおすすめです。', 'ラベンダー、ネロリ、フランキンセンスなど、落ち着いた香りが好まれます。'],
  ],
  'hair-care.html': [['日々のちょっとした習慣で髪質は劇的に変わります。', '日々の習慣を見直すと、髪の手ざわりや見え方が変わることがあります。']],
  'beauty-column.html': [['水分・塩分・姿勢から整える即効ケア。', '水分・塩分・姿勢から整える方法。']],
  'dress-line.html': [['姿勢の問題なので即効性があります', '姿勢の問題なので、早めに見直せます']],
  'prehana-back.html': [['背中に効く厳選5社を見る ＞', '背中のケアを体験で試す ＞']],
  'prehana-mukumi.html': [['セルフケアでは限界がある「頑固なむくみ」や、挙式直前の「即効性」を求めるなら、<br>', '自分のケアだけでは不安な場合や、挙式が近い場合は、<br>']],
  'prehana-rounded-shoulders.html': [['>むくみ撃退', '>むくみの整え方']],
  'skin-emergency.html': [['逆に減らすのは即効性があります。使っているものを減らして刺激を止めるだけで、数日で落ち着くことがあります。', '逆に減らすほうは、すぐに試せます。使っているものを減らして刺激を止めると、数日で落ち着くこともあります。']],
};

for (const [f, list] of Object.entries(EDITS)) {
  const p = path.join(ROOT, f);
  let h = fs.readFileSync(p, 'utf8');
  for (const [a, b] of list) {
    const hit = typeof a === 'string' ? h.includes(a) : a.test(h);
    if (!hit) { console.log('miss', f, String(a).slice(0, 40)); continue; }
    h = h.replace(a, b);
  }
  fs.writeFileSync(p, h);
}
console.log('done');
