'use strict';
const assert=require('node:assert/strict');const C=require('../engine.js');
const sites=[['1',6,5,'memory','lucidity'],['2',5,5,'memory','sanity'],['3',3,5,'material','scrolls'],['4',1,7,'material','potions']];
for(const [floor,x,y,choice,field] of sites){
 const s=C.createGame();s.floor=Number(floor);s.x=x;s.y=y;s.sanity=50;s.lucidity=2;s.ether=0;s.potions=0;s.scrolls=0;
 assert(C.echoAt(s)?.name,'the room exposes its echo');const before=s[field];const turn=s.turn;
 C.dispatch(s,'echo:'+choice);assert(s.echoes.includes(floor+':'+x+','+y));assert.notEqual(s[field],before,'choice changes a resource');assert.equal(s.turn,turn,'reading an echo costs no combat turn');
 const saved=C.importSave(JSON.parse(JSON.stringify(s)));assert(saved);assert.equal(C.echoAt(saved).name,C.echoAt(s).name);
 const after=s[field];C.dispatch(s,'echo:'+choice);assert.equal(s[field],after,'resolved echo cannot be farmed');
}
const old=C.createGame();delete old.echoes;assert.deepEqual(C.importSave(old).echoes,[]);
const invalid=C.createGame();invalid.echoes=['1:6,5','1:6,5'];assert.equal(C.validGame(invalid),false);
console.log('v6.3 exploration: four echoes, choices, one-time rewards and schema-16 migration passed');
