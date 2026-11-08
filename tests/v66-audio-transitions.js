'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
let clock=0,frames=[];const media=[];
class Audio{
 constructor(src){Object.assign(this,{src,volume:0,currentTime:0,paused:true});media.push(this);}
 play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}
 addEventListener(){}removeAttribute(){this.src='';}
}
const ctx={Audio,window:null,performance:{now:()=>clock},requestAnimationFrame:cb=>frames.push(cb),localStorage:{getItem:()=>null,setItem(){}}};ctx.window=ctx;
vm.runInNewContext(fs.readFileSync(require.resolve('../audio.js'),'utf8'),ctx);
const A=ctx.DungeonAudio;
function advance(ms){clock+=ms;const old=frames;frames=[];old.forEach(cb=>cb(clock));}
A.setEnabled(true);advance(1200);
A.updateThreat('combat');advance(300);A.updateThreat('boss');advance(150);A.updateFloor(4);advance(200);A.updateThreat('explore');advance(1200);
let live=media.filter(m=>!m.paused);assert.equal(live.length,2,'only final score and current floor ambience may survive interrupted fades');
assert(live.some(m=>m.src.endsWith('/floor-4.ogg')));assert(live.some(m=>m.src.endsWith('/ambience-4.ogg')));
A.updateThreat('combat');advance(200);A.updateThreat('explore');advance(1200);
assert.equal(media.filter(m=>!m.paused).length,2,'reusing an outgoing track must not leave a third voice');
for(let i=0;i<25;i++)A.play('attack');assert.equal(media.filter(m=>!m.paused&&!m.loop).length,8,'effects polyphony is bounded');
A.setEffectsVolume(0);assert(media.filter(m=>!m.paused&&!m.loop).every(m=>m.volume===0));
A.setMusicVolume(.2);assert.equal(live.find(m=>m.src.endsWith('/floor-4.ogg')).volume,.2);
A.setEnabled(false);advance(1200);assert(media.every(m=>m.paused));
console.log('v6.6 audio: interrupted fades, returning track, floor ambience, live gains, eight-effect cap and mute PASS');
