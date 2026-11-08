'use strict';
const assert=require('node:assert/strict'),C=require('../engine.js');
const clone=()=>JSON.parse(JSON.stringify(C.createGame()));
for(const bad of [null,undefined,[],{},42,'save']){
 assert.equal(C.validGame(bad),false);assert.equal(C.importSave(bad),null);
}
for(const key of ['party','monsters','visited','messages','gear','gearFound','disarmedTraps','visitedByFloor','loreRead','trapsTriggered']){
 for(const value of [null,42,'broken',{}]){
  const s=clone();s[key]=value;
  assert.equal(C.validGame(s),false,`${key} rejected without throwing`);
  // Two historic optional lists are recovered by the existing migration.
  if(!['loreRead','trapsTriggered'].includes(key))assert.equal(C.importSave(s),null,`${key} import rejected`);
 }
}
for(const change of [s=>s.party[0]=null,s=>s.party[0].role='Unknown',s=>s.monsters[0]=null,s=>s.monsters[0].name=42,s=>s.schema=999]){
 const s=clone();change(s);assert.equal(C.importSave(s),null);
}
const s=clone();s.floor=4;s.x=2;s.y=7;s.dir=1;s.selected=1;s.monsters=[];
C.dispatch(s,'disarm',()=>.5);
assert(s.disarmedTraps.includes('4:3,7'));
assert(C.validGame(s));assert.deepEqual(C.importSave(JSON.parse(JSON.stringify(s))).disarmedTraps,s.disarmedTraps);
const legacy=clone();delete legacy.echoes;delete legacy.echoChoices;delete legacy.relics;delete legacy.shrines;
const restored=C.importSave(legacy);assert(restored);assert.equal(restored.schema,16);assert.deepEqual(restored.shrines,[]);
console.log('v6.6 saves: malformed JSON containers, unknown roles/schema, fourth-floor trap and legacy migration PASS');
