/* Node 18+ — reproducible functional tests, no third-party packages. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const core=require('../engine.js');
const rand=()=>.5;
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
for(const file of ['engine.js','renderer.js','game.js'])new vm.Script(read(file),{filename:file});
const html=read('index.html');
const ids=['view','map','party','log','message','location','save','load','reset','inventory','bag','equipment','gear','quests','toggle-map','sound','bestiary'];
for(const id of ids)assert.match(html,new RegExp(`id="${id}"`),`Falta ${id}`);
for(const file of ['engine.js','renderer.js','game.js','style.css'])assert(fs.existsSync(path.join(root,file)));
assert.match(html,/data-action="scroll"/);
assert.match(html,/data-action="disarm"/);
assert.equal(core.WIDTH,15);assert.equal(core.HEIGHT,15);
assert(core.LEVEL.every(r=>r.length===15));
for(const mark of ['S','K','G','X'])assert(core.LEVEL.some(row=>row.includes(mark)));
const initial=core.createGame();
assert.equal(initial.party.length,4);assert.equal(initial.monsters.length,16);
assert.equal(initial.x,1);assert.equal(initial.y,1);
assert(core.validGame(initial));
const turn=initial.turn;
core.dispatch(initial,'right',rand);assert.equal(initial.dir,2);assert.equal(initial.turn,turn);
core.dispatch(initial,'forward',rand);assert.equal(initial.y,2);
core.dispatch(initial,'forward',rand);assert.equal(initial.y,3);
core.dispatch(initial,'right',rand);assert.equal(initial.dir,3);
core.dispatch(initial,'forward',rand);assert.equal(initial.x,1,'Wall collision must keep position');
const walls=core.createGame();
core.dispatch(walls,'left',rand);assert.equal(walls.dir,0);
core.dispatch(walls,'forward',rand);assert.deepEqual([walls.x,walls.y],[1,1]);
const key=core.createGame();key.x=3;key.y=11;key.dir=1;core.dispatch(key,'forward',rand);
assert.equal(key.key,true);assert.match(key.messages[0],/llave/);
const combat=core.createGame();combat.x=4;combat.y=3;combat.dir=1;
const foe=combat.monsters[0];
for(let i=0;i<5&&foe.hp>0;i++)core.dispatch(combat,'attack',rand);
assert.equal(foe.hp,0);assert(combat.party.every(p=>p.xp>0||p.level>1));
const mage=core.createGame();mage.x=4;mage.y=3;mage.dir=1;mage.selected=2;
core.dispatch(mage,'spell',rand);assert.equal(mage.party[2].mana,13);assert(mage.monsters[0].hp<18);
const cleric=core.createGame();cleric.party[0].hp=4;cleric.selected=3;
core.dispatch(cleric,'spell',rand);assert(cleric.party[0].hp>4);assert.equal(cleric.party[3].mana,10);
const heal=core.createGame();heal.party[0].hp=1;
core.dispatch(heal,'potion',rand);assert.equal(heal.party[0].hp,19);assert.equal(heal.potions,2);
const rest=core.createGame();rest.party[0].hp=10;rest.party[2].mana=4;
core.dispatch(rest,'rest',rand);assert.equal(rest.party[0].hp,18);assert.equal(rest.party[2].mana,12);
const map=core.createGame();core.dispatch(map,'scroll',rand);
assert.equal(map.scrolls,0);assert(map.visited.length>1);
const win=core.createGame();win.x=11;win.y=13;win.dir=1;
core.dispatch(win,'interact',rand);assert.equal(win.won,false);
win.key=true;core.dispatch(win,'interact',rand);assert.equal(win.won,false);
win.monsters.find(m=>m.kind==='warden').hp=0;
core.dispatch(win,'interact',rand);assert.equal(win.floor,2);assert.equal(win.won,false);
win.x=11;win.y=13;win.dir=1;win.sigil=true;win.monsters.find(m=>m.kind==='king').hp=0;
core.dispatch(win,'interact',rand);assert.equal(win.floor,3);assert.equal(win.won,false);
win.x=11;win.y=13;win.dir=1;win.voidHeart=true;win.labyrinthGateOpen=true;win.monsters.find(m=>m.kind==='archivist').hp=0;core.dispatch(win,'interact',rand);assert.equal(win.floor,4);assert.equal(win.won,false);win.x=11;win.y=13;win.finalRune=true;win.monsters.find(m=>m.kind==='firstname').hp=0;core.dispatch(win,'interact',rand);assert.equal(win.won,true);
const legacy=core.createGame();delete legacy.schema;delete legacy.loreRead;delete legacy.trapsTriggered;
for(const m of legacy.monsters)delete m.kind;
const updated=core.importSave(legacy);
assert(updated&&core.validGame(updated));assert.equal(updated.schema,16);
assert.equal(updated.monsters[2].kind,'warden');
assert.equal(core.importSave({...legacy,x:200}),null);
assert.equal(core.importSave({...legacy,party:[{hp:-200}]}),null);
const oldKeyConflict=core.createGame();delete oldKeyConflict.schema;
oldKeyConflict.items.push('4,11');
const migrated=core.importSave(oldKeyConflict);
assert(!migrated.items.includes('4,11'));
assert(!core.createGame().items.includes('4,11'),'Potion cannot conceal key');
const trap=core.createGame();trap.x=2;trap.y=7;trap.dir=1;
core.dispatch(trap,'forward',rand);
assert.equal(trap.trapsTriggered.includes('1:3,7'),true);
const trapCount=trap.trapsTriggered.length;
core.dispatch(trap,'back',rand);core.dispatch(trap,'forward',rand);
assert.equal(trap.trapsTriggered.length,trapCount,'Trap must trigger once');
// Breadth-first reachability through the real map, excluding the blocked exit.
function reachable(from,to){
 const queue=[from],visited=new Set([from.join(',')]);
 for(const [x,y] of queue){
   if(x===to[0]&&y===to[1])return true;
   for(const [dx,dy] of core.DIRS){
     const p=[x+dx,y+dy],key=p.join(',');
     if(core.passable(...p)&&!visited.has(key)){visited.add(key);queue.push(p);}
   }
 }
 return false;
}
assert(reachable([1,1],[4,11]));assert(reachable([1,1],[11,13]));
assert(core.LOWER.every(row=>row.length===15));
function reachableFloor(floor,from,to){let q=[from],seen=new Set([from.join(',')]);for(const [x,y] of q){if(x===to[0]&&y===to[1])return true;for(const [dx,dy] of core.DIRS){const p=[x+dx,y+dy],k=p.join(',');if(core.passable(...p,floor)&&!seen.has(k)){seen.add(k);q.push(p);}}}return false;}
assert(reachableFloor(2,[1,1],[4,11]));assert(reachableFloor(2,[1,1],[11,13]));
const equip=core.createGame();equip.floor=2;equip.x=2;equip.y=11;equip.dir=1;core.dispatch(equip,'forward',rand);assert(equip.gear.includes('sword'));core.dispatch(equip,'equipSword',rand);assert.equal(equip.party[0].equippedWeapon,'sword');assert(core.validGame(equip));
const migrated4=core.createGame();migrated4.schema=4;migrated4.monsters=migrated4.monsters.filter(m=>m.floor===1);delete migrated4.floor;delete migrated4.sigil;delete migrated4.gear;delete migrated4.gearFound;delete migrated4.visitedByFloor;const m4=core.importSave(migrated4);assert(m4&&m4.monsters.length===16);
const oldDefeated=core.createGame();const oldRoamer=oldDefeated.monsters.find(m=>m.kind==='starseer');oldRoamer.hp=0;oldDefeated.monsters=oldDefeated.monsters.filter(m=>m!==oldRoamer);oldDefeated.monsters.push({floor:1,x:oldRoamer.x,y:oldRoamer.y,hp:0,max:oldRoamer.max,name:oldRoamer.name,damage:oldRoamer.damage,kind:'lurker'});const oldDefeatedMigrated=core.importSave(oldDefeated);assert(oldDefeatedMigrated&&oldDefeatedMigrated.monsters.find(m=>m.floor===1&&m.x===oldRoamer.x&&m.y===oldRoamer.y).hp===0);
const oldWon={...migrated4,won:true};const resumed=core.importSave(oldWon);assert(resumed&&!resumed.won&&resumed.floor===2);
assert(core.validGame(core.importSave(JSON.parse(JSON.stringify(core.createGame()))))); 
console.log('OK: motor, HTML, 2 mapas, colisiones, combate, magia, inventario equipable, victoria de 2 niveles, migración v3/v4 y rutas alcanzables.');

// v0.6: barred corridor and pressure plate, reversible rendering collision.
const gate=core.createGame();gate.floor=2;gate.x=7;gate.y=13;gate.dir=1;
assert(core.wallAt(8,13,2,gate));
core.dispatch(gate,'forward',rand);assert.equal(gate.x,7);
gate.x=2;gate.y=11;gate.dir=1;
core.dispatch(gate,'forward',rand);assert(gate.gateOpen);
assert(!core.wallAt(8,13,2,gate));
gate.x=7;gate.y=13;gate.dir=1;core.dispatch(gate,'forward',rand);assert.equal(gate.x,8);
assert(core.validGame(gate));
// Rogue can neutralize a known trap once; other classes cannot.
const rogue=core.createGame();rogue.x=2;rogue.y=7;rogue.dir=1;
core.dispatch(rogue,'disarm',rand);assert.equal(rogue.disarmedTraps.length,0);
rogue.selected=1;core.dispatch(rogue,'disarm',rand);assert.deepEqual(rogue.disarmedTraps,['1:3,7']);
const before=rogue.party.map(h=>h.hp);core.dispatch(rogue,'forward',rand);assert.deepEqual(rogue.party.map(h=>h.hp),before);
const saved=core.importSave(JSON.parse(JSON.stringify(rogue)));assert(saved&&saved.disarmedTraps.includes('1:3,7'));
const old5=core.createGame();old5.schema=5;delete old5.gateOpen;delete old5.disarmedTraps;
const migrated5=core.importSave(old5);assert(migrated5&&migrated5.schema===16&&!migrated5.gateOpen);
console.log('OK v0.6: reja bloqueada/abierta, losa de presión, trampas desactivables, migración y mochila.');

// v0.7: enemy archetypes, tactical guard and v0.6 save migration.
assert.match(html,/data-action="guard"/);
assert(core.BESTIARY.specter && core.BESTIARY.king);
const old6=core.createGame();old6.schema=6;delete old6.guard;
const migrated6=core.importSave(old6);
assert(migrated6 && migrated6.schema===16 && migrated6.guard===null);
const defending=core.createGame();defending.x=4;defending.y=3;defending.selected=0;
defending.monsters[0].x=5;defending.monsters[0].y=3;
// Choose a deterministic target: (turn 1 + monster x 5) % 4 => Aldric index 2?
// We test the guarded hero by choosing the target of this particular turn.
defending.selected=(defending.turn+1+5)%4;
const guardedHero=defending.party[defending.selected];
const guardedBefore=guardedHero.hp;
core.dispatch(defending,'guard',rand);
assert(guardedHero.hp>=guardedBefore-1,'Defender should substantially reduce incoming damage');
assert.equal(defending.guard,null,'Guard expires after an enemy round');
const specter=core.createGame();specter.floor=2;specter.x=5;specter.y=1;
const ghost=specter.monsters.find(m=>m.kind==='specter');
ghost.x=5;ghost.y=3;
const hpbefore=specter.party.reduce((sum,h)=>sum+h.hp,0);
core.dispatch(specter,'attack',rand);
assert(specter.party.reduce((sum,h)=>sum+h.hp,0)<hpbefore,'Specter attacks at two tiles');
assert(core.validGame(core.importSave(JSON.parse(JSON.stringify(specter)))));
console.log('OK v0.7: defensa, ataque a distancia, bestiario, migración v0.6 y caducidad de guardia.');

// v0.8: labyrinth, new seal, third boss, migration from successful v0.7 adventure.
assert(core.LABYRINTH.every(row=>row.length===15));
assert(reachableFloor(3,[1,1],[4,11]));
assert(reachableFloor(3,[1,1],[11,13]));
const archive=core.createGame();archive.floor=3;archive.x=2;archive.y=11;archive.dir=1;
core.dispatch(archive,'forward',rand);assert(archive.labyrinthGateOpen);
core.dispatch(archive,'forward',rand);assert(archive.voidHeart);
const archiveSave=core.importSave(JSON.parse(JSON.stringify(archive)));
assert(archiveSave && archiveSave.voidHeart && archiveSave.labyrinthGateOpen);
const seventh=core.createGame();seventh.schema=7;seventh.won=true;
delete seventh.voidHeart;delete seventh.labyrinthGateOpen;delete seventh.visitedByFloor[3];
seventh.monsters=seventh.monsters.filter(m=>m.floor<3);
const v7=core.importSave(seventh);assert(v7 && v7.floor===3 && !v7.won && v7.monsters.length===16);
console.log('OK v0.9: tercera profundidad, sigilo, reliquia, migración v0.7.');
