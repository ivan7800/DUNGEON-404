const assert=require('node:assert/strict');
const core=require('../engine.js');
function attackWith(type,ritual='none'){
 const s=core.createGame();s.floor=2;s.x=4;s.y=3;s.drownedRitual=ritual;
 s.monsters=s.monsters.filter(m=>m.floor===2 && m.cosmicType===type);
 const m=s.monsters[0];m.x=5;m.y=3;s.turn=2;
 const events=core.dispatch(s,'guard',()=>0.5);
 return {s,m,events};
}
const a=core.createGame();
assert.equal(a.monsters.filter(m=>m.floor===2&&m.cosmicType).length,3);
assert.equal(Object.keys(core.COSMIC_ENEMIES).length,3);
for(const type of Object.keys(core.COSMIC_ENEMIES)){
 const normal=attackWith(type);
 assert.equal(normal.m.mindStrikes,1);assert.equal(normal.s.sanity,100-core.COSMIC_ENEMIES[type].loss);
 assert(normal.events.some(e=>e.text.includes('visión imposible')));
 const sealed=attackWith(type,'seal');
 assert.equal(sealed.s.sanity,100-Math.floor(core.COSMIC_ENEMIES[type].loss/2));
 const listened=attackWith(type,'listen');assert.equal(listened.s.lucidity,1);
 // A maximum of two mental strikes prevents infinitely farming lucidity.
 const s=listened.s,m=listened.m;
 s.turn=5;core.dispatch(s,'guard',()=>0.5);assert.equal(m.mindStrikes,2);
 s.turn=8;core.dispatch(s,'guard',()=>0.5);assert.equal(m.mindStrikes,2);assert.equal(s.lucidity,2);
}
const legacy=core.createGame();legacy.monsters.filter(m=>m.floor===2).forEach(m=>{delete m.cosmicType;delete m.mindStrikes});
const migrated=core.importSave(legacy);assert(migrated);assert.equal(migrated.monsters.filter(m=>m.floor===2&&m.cosmicType).length,3);
const corrupt=core.createGame();corrupt.monsters[3].mindStrikes=3;assert.equal(core.validGame(corrupt),false);
console.log('v3.8 cosmic enemy / sanity combat tests passed');
