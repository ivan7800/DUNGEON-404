'use strict';
const assert=require('node:assert/strict'),C=require('../engine.js');
const rng=()=>.5;
function encounter(role=0,kind='warden'){
 const s=C.createGame();s.x=4;s.y=3;s.dir=1;s.selected=role;
 const m=s.monsters.find(m=>m.kind===kind);s.monsters=[m];Object.assign(m,{floor:1,x:5,y:3,hp:200,max:200,damage:12});return {s,m};
}
// Warrior actually intercepts the blow even when deterministic targeting chooses another hero.
{
 const {s}=encounter();const before=s.party.map(p=>p.hp);C.dispatch(s,'signature',rng);
 assert(s.party[0].hp<before[0]);assert.deepEqual(s.party.slice(1).map(p=>p.hp),before.slice(1));assert.equal(s.intercept,undefined);
 const turn=s.turn;C.dispatch(s,'signature',rng);assert.equal(s.turn,turn,'cooldown attempts do not consume turns');
 assert.equal(s.party[0].skillReadyAt,4);
}
// Rogue damage includes gear and interrupts a prepared strike without spending mana.
{
 const {s,m}=encounter(1);m.telegraph=true;const hp=s.party.map(p=>p.hp);C.dispatch(s,'signature',rng);
 assert.equal(m.hp,188);assert.equal(m.telegraph,false);assert.deepEqual(s.party.map(p=>p.hp),hp);assert.equal(s.party[1].skillReadyAt,5);
 const saved=C.importSave(JSON.parse(JSON.stringify(s)));assert(saved);assert.equal(saved.party[1].skillReadyAt,5);
}
for(const role of [2,3]){
 const {s,m}=encounter(role);const mana=s.party[role].mana;C.dispatch(s,'signature',rng);
 assert.equal(s.party[role].mana,mana-(role===2?7:6));assert(s.party[role].skillReadyAt>0);
 if(role===2)assert.equal(m.frozen,1);else assert.equal(s.ward,2);
 const poor=encounter(role).s;poor.party[role].mana=0;C.dispatch(poor,'signature',rng);assert.equal(poor.turn,0);assert.equal(poor.party[role].skillReadyAt,undefined);
}
{
 const {s,m}=encounter();s.turn=2;const hp=s.party.map(p=>p.hp);C.dispatch(s,'guard',rng);
 assert(m.telegraph);assert.deepEqual(s.party.map(p=>p.hp),hp,'wind-up deals no physical damage');assert(C.threats(s)[0].danger);
 const saved=C.importSave(JSON.parse(JSON.stringify(s)));assert(saved.monsters[0].telegraph);C.dispatch(saved,'guard',rng);assert.equal(saved.monsters[0].telegraph,false);
 m.hp=90;C.dispatch(s,'guard',rng);assert(m.phaseAwakened);assert.equal(C.threats(s)[0].phase,2);assert(C.importSave(JSON.parse(JSON.stringify(s))).monsters[0].phaseAwakened);
}
// Forecast never exposes an enemy behind stone.
{
 const s=C.createGame();s.x=1;s.y=2;const m=s.monsters[0];s.monsters=[m];m.x=4;m.y=2;assert.equal(C.threats(s).length,0);
}
// Schema 16 saves retain their key and gain optional tactics fields only on use.
{
 const legacy=C.createGame();legacy.party.forEach(p=>delete p.skillReadyAt);const migrated=C.importSave(JSON.parse(JSON.stringify(legacy)));assert(C.validGame(migrated));assert.equal(C.SAVE_KEY,'dungeon404-save-v16');
 for(const invalid of [-1,Infinity,'soon']){const s=C.createGame();s.party[0].skillReadyAt=invalid;assert.equal(C.validGame(s),false);}
}
console.log('v6.0 tactics: interception, interruption, cooldowns, costs, boss wind-ups, phase persistence, forecasts and legacy saves passed');
