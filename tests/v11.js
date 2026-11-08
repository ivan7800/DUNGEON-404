'use strict';
const assert=require('node:assert/strict');
const C=require('../engine.js');
const R=()=>0.5;
assert.equal(C.VERSION,16);
// Spell restrictions and non-consumption on failure.
const s=C.createGame();s.selected=0;
C.dispatch(s,'ward',R);assert.equal(s.party[3].mana,14);assert.equal(s.ward,0);
s.selected=3;s.party[3].mana=5;
C.dispatch(s,'ward',R);assert.equal(s.party[3].mana,5);assert.equal(s.ward,0);
// Compare exactly the same enemy phase with and without sanctuary.
function fight(shield){
 const st=C.createGame();st.x=2;st.y=1;st.dir=1;st.monsters=st.monsters.filter(m=>m.floor!==1);
 st.monsters.push({floor:1,x:3,y:1,hp:30,max:30,name:'Ensayo',damage:9,kind:'lurker'});
 st.selected=3;if(shield)C.dispatch(st,'ward',R);else C.dispatch(st,'guard',R);
 return st;
}
const a=fight(true),b=fight(false);
assert.equal(a.ward,2);assert.equal(a.party[3].mana,8);
const damageA=107-a.party.reduce((n,p)=>n+p.hp,0);
const damageB=107-b.party.reduce((n,p)=>n+p.hp,0);
assert(damageA<=damageB,'ward must reduce group damage');
C.dispatch(a,'guard',R);assert.equal(a.ward,1);
C.dispatch(a,'guard',R);assert.equal(a.ward,0);
assert(C.validGame(a));
// Replacing weapon equipment must affect melee damage for any weapon, including staff.
const plain=C.createGame(),equipped=C.createGame();
for(const st of [plain,equipped]){
 st.floor=1;st.x=1;st.y=1;st.dir=1;st.selected=2;
 st.monsters=st.monsters.filter(m=>m.floor!==1);
 st.monsters.push({floor:1,x:2,y:1,hp:80,max:80,name:'Dummy',damage:1,kind:'lurker'});
}
equipped.gear.push('staff');equipped.party[2].equippedWeapon='staff';
C.dispatch(plain,'attack',R);C.dispatch(equipped,'attack',R);
assert.equal(plain.monsters.at(-1).hp-equipped.monsters.at(-1).hp,3);
// v1.0 saved runs migrate into v1.1 without leaking new fields.
const old=C.createGame();old.schema=10;delete old.ward;
const migrated=C.importSave(old);assert(migrated&&migrated.ward===0&&migrated.schema===16);
assert(C.validGame(migrated));
const corrupt=C.createGame();corrupt.ward=999;assert.equal(C.importSave(corrupt),null);
console.log('OK v1.1: santuario, restricciones, caducidad, armas, guardados v1.0, validación');
