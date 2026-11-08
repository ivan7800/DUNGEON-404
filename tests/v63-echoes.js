'use strict';
const assert=require('node:assert/strict');const C=require('../engine.js');
const sites=[['1',6,5,'lantern'],['2',5,5,'mirror'],['3',3,5,'compass'],['4',1,7,'bell']];
for(const [floor,x,y,relic] of sites){
 const s=C.createGame();s.floor=Number(floor);s.x=x;s.y=y;s.sanity=50;s.lucidity=2;s.ether=0;s.potions=0;s.scrolls=0;
 assert(C.echoAt(s)?.name,'the room exposes its echo');const turn=s.turn;
 C.dispatch(s,'echo:material');assert(s.echoes.includes(floor+':'+x+','+y));assert(s.relics.includes(relic));assert.equal(s.turn,turn,'reading an echo costs no combat turn');
 const saved=C.importSave(JSON.parse(JSON.stringify(s)));assert(saved);assert(saved.relics.includes(relic));
 C.dispatch(s,'echo:material');assert.equal(s.relics.length,1,'resolved echo cannot duplicate its relic');
}
const memory=C.createGame();memory.floor=1;memory.x=6;memory.y=5;memory.lucidity=0;C.dispatch(memory,'echo:memory');assert.equal(memory.lucidity,1);assert.equal(memory.echoChoices[0],'1:6,5:memory');
const old=C.createGame();delete old.echoes;delete old.echoChoices;delete old.relics;const migrated=C.importSave(old);assert.deepEqual(migrated.echoes,[]);assert.deepEqual(migrated.relics,[]);
const invalid=C.createGame();invalid.echoes=['1:6,5','1:6,5'];assert.equal(C.validGame(invalid),false);
const ending=C.createGame();ending.echoChoices=['1:6,5:memory','2:5,5:memory','3:3,5:memory','4:1,7:memory'];ending.lucidity=4;assert.equal(C.resolveEnding(ending),'remembrance');
const oldEnding=C.createGame();oldEnding.drownedRitual='listen';oldEnding.drownedClues=['tide','bell'];oldEnding.lucidity=4;assert.equal(C.resolveEnding(oldEnding),'revelation','existing ending keeps its priority');
console.log('v6.4 echoes: memory route, four relic rewards, unique resolution, ending priority and schema-16 migration passed');

const lantern=C.createGame();lantern.relics=['lantern'];lantern.sanity=70;C.dispatch(lantern,'relic:lantern');assert.equal(lantern.sanity,85);assert.deepEqual(lantern.relics,[]);
const compass=C.createGame();compass.relics=['compass'];compass.lucidity=3;C.dispatch(compass,'relic:compass');assert.equal(compass.lucidity,5);assert.deepEqual(compass.relics,[]);
const mirror=C.createGame();mirror.floor=1;mirror.x=1;mirror.y=1;mirror.relics=['mirror'];C.dispatch(mirror,'relic:mirror',()=>.99);assert(mirror.ward>0);assert.deepEqual(mirror.relics,[]);
const bell=C.createGame();bell.floor=1;bell.x=3;bell.y=3;bell.relics=['bell'];const nearby=bell.monsters.find(m=>m.kind==='lurker');nearby.x=4;nearby.y=3;nearby.telegraph=true;const health=bell.party.reduce((n,h)=>n+h.hp,0);C.dispatch(bell,'relic:bell',()=>.99);assert.deepEqual(bell.relics,[]);assert.equal(bell.party.reduce((n,h)=>n+h.hp,0),health,'bell cancels the prepared adjacent strike');
const unusedBell=C.createGame();unusedBell.relics=['bell'];C.dispatch(unusedBell,'relic:bell');assert.deepEqual(unusedBell.relics,['bell'],'bell is not spent when no target is in sight');
