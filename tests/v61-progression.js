'use strict';
const assert=require('node:assert/strict');
const C=require('../engine.js');
const s=C.createGame(),p=s.party[0];
const legacy=C.importSave(JSON.parse(JSON.stringify(s)));
assert(legacy && legacy.party.every(h=>h.path===undefined));
C.dispatch(s,'path:edge');assert.equal(p.path,undefined,'level gate');
p.level=2;const turn=s.turn,damage=p.damage;
C.dispatch(s,'path:edge');assert.equal(p.path,'edge');assert.equal(p.damage,damage+2);assert.equal(s.turn,turn,'choice is not a combat turn');
C.dispatch(s,'path:bulwark');assert.equal(p.path,'edge','choice is irreversible');
assert.equal(C.importSave(JSON.parse(JSON.stringify(s))).party[0].path,'edge');
const a=C.createGame();a.party[0].level=2;const max=a.party[0].max,hp=a.party[0].hp,def=a.party[0].defense;
C.dispatch(a,'path:bulwark');assert.equal(a.party[0].max,max+6);assert.equal(a.party[0].hp,hp+6);assert.equal(a.party[0].defense,def+1);
for(const role of [1,2,3]){const sample=C.createGame();sample.selected=role;sample.party[role].level=2;C.dispatch(sample,'path:edge');assert.equal(sample.party[role].path,'edge');assert(C.validGame(sample));}
for(const invalid of ['x',null,42]){const sample=C.createGame();sample.party[0].path=invalid;assert.equal(C.validGame(sample),false);}
console.log('v6.1 progression: level gate, two exclusive vows, persistence and legacy saves passed');
const altar=C.createGame();altar.sanity=60;const altarTurn=altar.turn;
C.dispatch(altar,'shrine:mind');assert.equal(altar.sanity,72);assert.deepEqual(altar.shrines,[1]);assert.equal(altar.turn,altarTurn);
C.dispatch(altar,'shrine:ether');assert.equal(altar.ether,2,'same altar cannot be claimed twice');
const next=C.importSave(JSON.parse(JSON.stringify(altar)));assert.deepEqual(next.shrines,[1]);next.floor=2;next.x=1;next.y=1;C.dispatch(next,'shrine:ether');assert.deepEqual(next.shrines,[1,2]);assert.equal(next.ether,3);
const old=C.createGame();delete old.shrines;assert.deepEqual(C.importSave(old).shrines,[]);
