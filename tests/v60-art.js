'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../engine.js'),R=require('../renderer.js');
const kinds=['lurker','crawler','warden','specter','king','archivist','firstname','starseer','chorus','cartographer','voidmoth'];
for(const name of ['seal','fighter','rogue','mage','cleric','environment-crypt','environment-library','environment-archive','environment-ossuary',...kinds.map(k=>'creature-'+k)]){
 const body=fs.readFileSync(path.join(__dirname,'../assets/art',name+'.svg'),'utf8');
 assert(body.includes('<svg'));assert(!/NaN|Infinity|<script|<foreignObject|href=/.test(body),name+' must be a self-contained finite vector');
}
const images=[],drawn=[];const context=new Proxy({
 createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}}),
 drawImage(...args){if(args[0] instanceof global.Image)drawn.push(args);}
},{get:(o,k)=>k in o?o[k]:()=>{}});
const oldDocument=global.document,oldImage=global.Image;
try{
 global.document={createElement:()=>({width:128,height:128,getContext:()=>context})};
 global.Image=class{constructor(){this.complete=true;this.naturalWidth=256;images.push(this);}};
 const renderer=R.createRenderer({width:960,height:540,getContext:()=>context},{getContext:()=>context},C);
 assert.equal(images.filter(image=>image.src.includes('creature-')).length,11);
 assert.equal(images.filter(image=>image.src.includes('environment-')).length,4);
 for(const image of images.filter(image=>image.src.includes('environment-')))image.onload();
 for(const kind of kinds){
  const s=C.createGame(),m=s.monsters.find(m=>m.kind===kind);s.floor=1;m.floor=1;s.x=4;s.y=3;s.dir=1;s.monsters=[m];m.x=5;m.y=3;m.frozen=1;m.telegraph=true;
  const before=drawn.length;renderer.renderWorld(s,200);assert(drawn.length>before,kind+' must use its vector image when available');
  assert(drawn.at(-1).slice(1).every(Number.isFinite));
 }
}finally{global.document=oldDocument;global.Image=oldImage;}
console.log('v6.0 art: 20 original SVG assets and all 11 loaded creature drawing paths passed');
