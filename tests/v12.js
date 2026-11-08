'use strict';
const assert=require('node:assert/strict');
const core=require('../engine.js');
assert.equal(core.VERSION,16);
assert.equal(core.V12_SAVE_KEY,'dungeon404-save-v12');
assert.equal(core.V11_SAVE_KEY,'dungeon404-save-v11');
const s=core.createGame();
const older=JSON.parse(JSON.stringify(s));older.schema=11;
const imported=core.importSave(older);
assert(imported&&core.validGame(imported),'Import must accept version 11');
assert.equal(imported.schema,16);
for(let floor=1;floor<=3;floor++){
 const level=[core.LEVEL,core.LOWER,core.LABYRINTH][floor-1];
 assert.equal(level.length,15);
 assert(level.every(row=>row.length===15));
}
const Renderer=require('../renderer.js');
assert.equal(typeof Renderer.createRenderer,'function');
console.log('OK v1.2: version, save migration, maps, rendering module');
