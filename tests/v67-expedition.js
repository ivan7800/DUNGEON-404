'use strict';
const assert=require('node:assert/strict'),C=require('../engine');
for(const [id,e] of Object.entries(C.ENCOUNTERS)){
 for(const choice of ['a','b']){
  const s=C.createGame();const [f,pos]=id.split(':');[s.x,s.y]=pos.split(',').map(Number);s.floor=+f;
  assert(C.passable(s.x,s.y,s.floor),id+' must be reachable floor');
  s.monsters.forEach(m=>m.hp=0);s.potions=s.ether=s.scrolls=5;s.sanity=40;
  const before=s.turn;C.dispatch(s,'adventure:'+choice,()=>.5);
  assert.equal(s.turn,before+1);assert.deepEqual(s.expeditionChoices,[id+':'+choice]);
  const snapshot=JSON.stringify({...s,messages:[]});C.dispatch(s,'adventure:'+choice,()=>.5);
  assert.equal(JSON.stringify({...s,messages:[]}),snapshot,'No repeat reward');
  assert(C.importSave(s),'new choices survive a roundtrip');
 }
}
const poor=C.createGame();poor.x=5;poor.potions=0;poor.monsters.forEach(m=>m.hp=0);C.dispatch(poor,'adventure:a');assert.equal(poor.expeditionChoices.length,0);assert.equal(poor.turn,0);
const danger=C.createGame();danger.x=5;danger.y=1;C.dispatch(danger,'adventure:b');assert.equal(danger.expeditionChoices.length,0,'Threat prevents free story rewards');
const s=C.createGame();s.party[1].hp=0;s.party[0].hp=1;C.dispatch(s,'camp');assert(s.party[1].hp>0);assert.equal(s.ether,0);assert.deepEqual(s.campsUsed,[1]);const hp=s.party[0].hp;C.dispatch(s,'camp');assert.equal(s.party[0].hp,hp);
const full=C.createGame();C.dispatch(full,'camp');assert.equal(full.ether,2);assert.deepEqual(full.campsUsed,[]);
const hunt=C.createGame();const roamer=hunt.monsters.find(m=>m.id==='roamer-starseer');C.dispatch(hunt,'claimHunt');assert.equal(hunt.huntsClaimed.length,0);roamer.hp=0;C.dispatch(hunt,'claimHunt');assert.equal(hunt.potions,4);C.dispatch(hunt,'claimHunt');assert.equal(hunt.potions,4);
const boss=C.createGame();boss.x=9;boss.y=13;boss.dir=1;boss.party[0].damage=200;boss.monsters.find(m=>m.kind==='warden').hp=1;C.dispatch(boss,'attack',()=>.5);assert.deepEqual(boss.bossSpoils,['warden']);assert.equal(boss.ether,3);
const legacy=C.createGame();for(const k of ['expeditionChoices','campsUsed','huntsClaimed','bossSpoils'])delete legacy[k];const migrated=C.importSave(legacy);assert(migrated);assert.deepEqual(migrated.expeditionChoices,[]);assert.equal(migrated.party[0].hp,legacy.party[0].hp);
for(const bad of [null,'a',{},['1:5,1:a','1:5,1:b'],['__proto__']]){const t=C.createGame();t.expeditionChoices=bad;assert.equal(C.importSave(t),null,'Malformed choices rejected');}
console.log('v6.7: 16 story routes, replay prevention, costs, threat gating, camp rescue, hunt and boss rewards, legacy migration PASS');
