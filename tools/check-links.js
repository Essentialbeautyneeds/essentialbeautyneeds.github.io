// サイト内のリンク切れ・名義・禁止語を調べる（公開の前に必ず実行）
// 使い方：node tools/check-links.js
const fs=require('fs'),path=require('path');
const R=path.resolve(__dirname,'..');
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.name.startsWith('.')||e.name==='tools'||e.name==='node_modules'?[]:e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const all=walk(R).map(f=>path.relative(R,f).replace(/\\/g,'/'));const exists=new Set(all);
const html=all.filter(f=>f.endsWith('.html'));
let broken=[],words=[],noHead=[],count=0;
for(const f of html){const b=fs.readFileSync(path.join(R,f),'utf8');const stub=/http-equiv="refresh"/i.test(b);
 const body=b.replace(/<!--[\s\S]*?-->/g,'');
 for(const m of body.matchAll(/(?:href|src)="([^"#?]+)(?:[#?][^"]*)?"/g)){let u=m[1];if(/^(https?:|\/\/|mailto:|tel:|data:|javascript:)/.test(u)){if(/^https:\/\/essential-beauty-needs\.com\//.test(u))u=u.replace('https://essential-beauty-needs.com','');else continue;}
  let t=u.startsWith('/')?u.slice(1):path.posix.join(path.posix.dirname(f),u);if(t===''||t.endsWith('/'))t+='index.html';count++;
  if(!exists.has(t))broken.push(f+' → '+m[1]);}
 const txt=body.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g,'');
 if(!stub){for(const w of ['Yuri','監修','栄養士','一番','絶対','最も'])if(txt.includes(w)){const i=txt.indexOf(w);words.push(f+' ['+w+'] '+txt.slice(Math.max(0,i-20),i+20).replace(/<[^>]+>/g,'').replace(/\s+/g,' '))}
  if(!/<header class="site-head">/.test(b)||!/<footer/.test(b))noHead.push(f);}
}
console.log('links checked',count,'| broken',broken.length);broken.slice(0,40).forEach(x=>console.log('  BROKEN',x));
console.log('words',words.length);words.forEach(x=>console.log('  ',x));
console.log('pages without header/footer',noHead.length,noHead.join(' '));
