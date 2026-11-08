'use strict';
const assert=require('node:assert/strict');
const C=require('../engine.js');
const R=()=>0.5;
assert.equal(C.VERSION,16);
assert.equal(C.SAVE_KEY,'dungeon404-save-v16');
assert.equal(C.V10_SAVE_KEY,'dungeon404-save-v10');
assert.equal(C.V9_SAVE_KEY,'dungeon404-save-v9');
const s=C.createGame();
s.floor=3;s.x=7;s.y=5;
// Re-entering pickup location from a passable neighboring tile should collect a unique staff.
s.x=6;s.y=5;s.dir=1; C.dispatch(s,'forward',R);
assert.equal(s.x,7);assert(s.gear.includes('staff'));assert(C.validGame(s));
C.dispatch(s,'equipStaff',R);assert(!s.party.some(p=>p.equippedWeapon==='staff'));
s.selected=2;C.dispatch(s,'equipStaff',R);assert.equal(s.party[2].equippedWeapon,'staff');
const beforeGear=s.gear.length;C.dispatch(s,'left',R);C.dispatch(s,'right',R);C.dispatch(s,'back',R);C.dispatch(s,'forward',R);assert.equal(s.gear.length,beforeGear);
// Pulse cannot fire without target and must not consume mana then.
const caster=s.party[2],mana=caster.mana;
C.dispatch(s,'pulse',R);assert.equal(caster.mana,mana);
// A clear 2-tile corridor, with a target behind the first open cell.
const q=C.createGame();q.x=1;q.y=1;q.dir=1;q.selected=2;q.monsters=q.monsters.filter(m=>m.floor!==1);
q.monsters.push({floor:1,x:2,y:1,hp:35,max:35,name:'Objetivo de prueba',damage:1,kind:'lurker'});
const before=q.monsters.at(-1).hp;C.dispatch(q,'pulse',R);
assert(q.monsters.at(-1).hp<before);assert.equal(q.party[2].mana,9);
assert(C.validGame(q));
const old=C.createGame();old.schema=9;delete old.runes;
const upgraded=C.importSave(old);assert(upgraded&&upgraded.schema===16);
console.log('OK regresión v1.0: versioned save, third-floor gear, class restriction, pulse, migration');
