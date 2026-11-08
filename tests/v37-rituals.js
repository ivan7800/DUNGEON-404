const assert=require('node:assert/strict');
const core=require('../engine.js');const a=(s,k)=>core.dispatch(s,k,()=>0.5);
const s=core.createGame();
assert.deepEqual(s.drownedClues,[]);assert.equal(s.drownedRitual,'none');
s.floor=2;s.x=5;s.y=1;s.dir=1;
a(s,'investigateDrowned');assert.deepEqual(s.drownedClues,['tide']);assert.equal(s.sanity,96);
a(s,'investigateDrowned');assert.equal(s.sanity,96);
s.x=7;s.y=5;a(s,'investigateDrowned');assert.deepEqual(s.drownedClues,['tide','bell']);assert.equal(s.sanity,90);
s.x=3;s.y=11;
a(s,'drownedSeal');assert.equal(s.drownedRitual,'seal');assert.equal(s.sanity,100);assert.equal(s.potions,4);
a(s,'drownedListen');a(s,'drownedSeal');assert.equal(s.potions,4);assert.equal(s.lucidity,0);
const t=core.createGame();t.floor=2;t.x=3;t.y=11;a(t,'drownedListen');assert.equal(t.drownedRitual,'none');
t.drownedClues=['tide','bell'];a(t,'drownedListen');assert.equal(t.drownedRitual,'listen');assert.equal(t.lucidity,3);assert.equal(t.sanity,88);
const reloaded=core.importSave(JSON.parse(JSON.stringify(t)));assert(reloaded);assert.equal(reloaded.drownedRitual,'listen');
const legacy=core.createGame();delete legacy.drownedClues;delete legacy.drownedRitual;const migrated=core.importSave(legacy);assert(migrated);assert.deepEqual(migrated.drownedClues,[]);assert.equal(migrated.drownedRitual,'none');
for(const invalid of [{drownedClues:['tide','tide']},{drownedClues:['oops']},{drownedRitual:'broken'}]){const x=core.createGame();Object.assign(x,invalid);assert.equal(core.validGame(x),false);}
console.log('v3.7 drowned ritual tests passed');
