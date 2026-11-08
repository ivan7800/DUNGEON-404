const C=require('../engine.js');
const assert=require('node:assert/strict');
const s=C.createGame(),R=()=>.49;
const path=(start,target)=>{const q=[[...start]],seen=new Set([start.join(',')]),from=new Map();for(const p of q){if(p[0]===target[0]&&p[1]===target[1]){const out=[p];let k=p.join(',');while(from.has(k)){const prev=from.get(k);out.unshift(prev);k=prev.join(',');}return out;}for(const [dx,dy] of C.DIRS){const n=[p[0]+dx,p[1]+dy],k=n.join(',');if(C.passable(...n,s.floor)&&!seen.has(k)){seen.add(k);from.set(k,p);q.push(n);}}}throw Error('No path '+start+' '+target);};
let turns=0;
function act(a){C.dispatch(s,a,R);turns++;if(s.dead)throw Error(`Party dead after ${turns} actions; position ${s.x},${s.y}, party ${JSON.stringify(s.party)}`)}
function face(d){while(s.dir!==d)act('right');}
function interactOrFight(target){let count=0;while(C.monsterAt(s,...target)&&count++<20){let enemy=C.monsterAt(s,...target);const healer=s.party[3];const injured=s.party.filter(p=>p.hp>0&&p.hp/p.max<.4).sort((a,b)=>a.hp/a.max-b.hp/b.max);
if(injured.length&&healer.hp>0&&healer.mana>=4){s.selected=3;act('spell');}
else if(injured.length&&s.potions>0){s.selected=s.party.indexOf(injured[0]);act('potion');}
else {s.selected=s.party[2].mana>=5 && s.party[2].hp>0?2:0;act(s.selected===2?'spell':'attack');}}
if(count>=20)throw Error('Combat loop exceeded');}
function walk(target){const route=path([s.x,s.y],target);console.log('walk',target,'route',route.length);for(let i=1;i<route.length;i++){
const [x,y]=route[i],dx=x-s.x,dy=y-s.y,d=C.DIRS.findIndex(v=>v[0]===dx&&v[1]===dy);if(d<0)throw Error('Off route');face(d);interactOrFight([x,y]);act('forward');if(s.x!==x||s.y!==y){console.log('blocked',x,y,s.x,s.y);throw Error('Movement blocked unexpectedly');}
}}
walk([4,11]);assert(s.key);walk([11,13]);face(1);if(C.monsterAt(s,12,13))interactOrFight([12,13]);if(s.monsters.some(m=>m.kind==='warden'&&m.hp>0)){
 const g=s.monsters.find(m=>m.kind==='warden');walk([g.x-1,g.y]);face(1);interactOrFight([g.x,g.y]);walk([11,13]);face(1);
}
act('interact');assert.equal(s.floor,2);assert.equal(s.won,false);
walk([3,11]);assert(s.gear.includes('sword'));
s.selected=0;act('equipSword');assert.equal(s.party[0].equippedWeapon,'sword');
walk([4,11]);assert(s.sigil);
walk([11,13]);face(1);
if(C.monsterAt(s,12,13))interactOrFight([12,13]);
if(s.monsters.some(m=>m.kind==='king'&&m.hp>0)){
 const g=s.monsters.find(m=>m.kind==='king');walk([g.x-1,g.y]);face(1);interactOrFight([g.x,g.y]);walk([11,13]);face(1);
}
act('interact');assert.equal(s.floor,3);assert.equal(s.won,false);
walk([3,11]);assert(s.labyrinthGateOpen);
walk([4,11]);assert(s.voidHeart);
walk([11,13]);face(1);
if(C.monsterAt(s,12,13))interactOrFight([12,13]);
if(s.monsters.some(m=>m.kind==='archivist'&&m.hp>0)){
 const g=s.monsters.find(m=>m.kind==='archivist');walk([g.x-1,g.y]);face(1);interactOrFight([g.x,g.y]);walk([11,13]);face(1);
}
act('interact');assert.equal(s.floor,4);assert.equal(s.won,false);
walk([4,11]);assert(s.finalRune);
walk([11,13]);face(1);
if(C.monsterAt(s,12,13))interactOrFight([12,13]);
if(s.monsters.some(m=>m.kind==='firstname'&&m.hp>0)){
 const g=s.monsters.find(m=>m.kind==='firstname');walk([g.x-1,g.y]);face(1);interactOrFight([g.x,g.y]);walk([11,13]);face(1);
}
act('interact');console.log('won?',s.won,'floor',s.floor,'actions',turns,'party',s.party.map(p=>[p.name,p.hp,p.level,p.mana]),'messages',s.messages.slice(0,5));assert(s.won);
assert(C.validGame(s));
