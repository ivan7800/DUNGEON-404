const assert=require('node:assert/strict');
const C=require('../engine.js');
const action=(s,a)=>C.dispatch(s,a,()=>0.51);
const s=C.createGame();
assert.equal(s.lucidity,0);assert.deepEqual(s.tomesRead,[]);
s.x=4;s.y=1;s.dir=1;
action(s,'readTome');assert.equal(s.lucidity,2);assert.equal(s.sanity,88);assert.deepEqual(s.tomesRead,['silenced']);
action(s,'readTome');assert.equal(s.lucidity,2);assert.equal(s.sanity,88);
action(s,'focusMind');assert.equal(s.sanity,100);assert.equal(s.lucidity,0);
action(s,'focusMind');assert.equal(s.lucidity,0);
s.x=7;s.y=5;s.dir=1;action(s,'readTome');assert.equal(s.lucidity,3);assert.equal(s.sanity,84);
const restored=C.importSave(JSON.parse(JSON.stringify(s)));assert(restored);assert.deepEqual(restored.tomesRead,s.tomesRead);assert.equal(restored.lucidity,3);
const old=C.createGame();delete old.lucidity;delete old.tomesRead;const migrated=C.importSave(old);assert(migrated);assert.equal(migrated.lucidity,0);assert.deepEqual(migrated.tomesRead,[]);
for(const bad of [()=>({lucidity:11}),()=>({lucidity:-1}),()=>({tomesRead:['bogus']}),()=>({tomesRead:['silenced','silenced']})]){
 const v=C.createGame();Object.assign(v,bad());assert.equal(C.validGame(v),false);
}
console.log('v3.6 madness and revelation tests passed');
