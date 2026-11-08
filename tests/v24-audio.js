const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.join(__dirname,'..');const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const game=fs.readFileSync(path.join(root,'game.js'),'utf8');
for(const id of ['sound','music-volume','effects-volume','audio-status'])assert(html.includes(`id="${id}"`),id);
assert(/audio\.js\?v=\d+/.test(html));assert(game.includes('soundtrack?.updateFloor'));
let played=0,paused=0;function Audio(url){this.src=url;this.volume=0;this.loop=false;this.currentTime=0;this.preload='none';this.play=()=>{played++;return Promise.resolve();};this.pause=()=>paused++;this.addEventListener=()=>{};}
const mem={};const callbacks=[];
const ctx={Audio,window:{},localStorage:{getItem:k=>mem[k]||null,setItem:(k,v)=>mem[k]=v},performance:{now:()=>1000},requestAnimationFrame:cb=>callbacks.push(cb)};
ctx.window=ctx;vm.runInNewContext(fs.readFileSync(path.join(root,'audio.js'),'utf8'),ctx);
const a=ctx.DungeonAudio;assert(a.tracks>=4);assert(a.effectCount>=14);assert.equal(a.settings.enabled,false);
a.setMusicVolume(.45);a.setEffectsVolume(.33);assert.equal(a.settings.music,.45);a.setEnabled(true);assert(played>=2);a.updateFloor(2);assert(played>=3);a.setEnabled(false);assert(paused>0);
for(let floor=1;floor<=4;floor++){const p=path.join(root,'assets','audio',`floor-${floor}.ogg`);assert(fs.statSync(p).size>100000,`missing scored soundtrack: ${p}`);}
for(const kind of ['attack','hurt','move','spell','frost','ward','heal','loot','victory','defeat','level','interact','search','rest'])assert(fs.statSync(path.join(root,'assets/audio',kind+'.ogg')).size>2000,kind);
console.log('v2.4 audio OK: 4 original score loops, 14 effect files, volume controls, transitions and mute.');
