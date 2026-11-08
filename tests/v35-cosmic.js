const assert=require('node:assert/strict');
const C=require('../engine.js');
const action=(s,a)=>C.dispatch(s,a,()=>0.51);
const s=C.createGame();
assert.equal(s.sanity,100);assert.equal(s.knowledge.length,0);assert.equal(s.ritualSealed,false);
assert.equal(s.monsters.filter(m=>m.floor===1).length,4);
assert(s.monsters.find(m=>m.kind==='warden').name.includes('Confesor'));
for(const [floor,kind] of [[1,'starseer'],[2,'chorus'],[3,'cartographer'],[4,'voidmoth']]){
 const horror=s.monsters.find(m=>m.floor===floor&&m.kind===kind);
 assert(horror&&C.BESTIARY[kind],`Falta horror cósmico de profundidad ${floor}`);
}
const defeatedSave=C.createGame();
const defeatedStarseer=defeatedSave.monsters.find(m=>m.kind==='starseer');defeatedStarseer.hp=0;
const defeatedIndex=defeatedSave.monsters.findIndex(m=>m.kind==='starseer');defeatedSave.monsters[defeatedIndex].hp=0;
defeatedSave.monsters.splice(defeatedIndex,1);
defeatedSave.monsters.push({floor:1,x:7,y:7,hp:0,max:26,name:'El Astrónomo Ciego',damage:6,kind:'lurker'});
const mergedSave=C.importSave(JSON.parse(JSON.stringify(defeatedSave)));
assert(mergedSave&&mergedSave.monsters.some(m=>m.floor===1&&m.x===7&&m.y===7&&m.hp===0),'La migración no debe revivir entidades derrotadas');
// Investigate from the adjacent accessible tile (5,1).
s.x=4;s.y=1;s.dir=1;
action(s,'investigate');assert.equal(s.sanity,93);assert.deepEqual(s.knowledge,['custodians']);
action(s,'investigate');assert.equal(s.sanity,93); // no duplications
// From 3,11; the optional ritual requires a second clue.
s.x=3;s.y=11;s.dir=0;
action(s,'ritual');assert.equal(s.ritualSealed,false);
action(s,'investigate');assert.equal(s.sanity,88);assert.equal(s.knowledge.length,2);
const ether=s.ether;action(s,'ritual');assert.equal(s.ritualSealed,true);assert.equal(s.ether,ether+2);assert.equal(s.sanity,100);
action(s,'ritual');assert.equal(s.ether,ether+2);
// Encounter exposure happens only once for each kind.
s.x=4;s.y=2;s.dir=2;
const before=s.sanity;action(s,'forward');assert(s.sanity<before);
const after=s.sanity;action(s,'back');action(s,'forward');assert.equal(s.sanity,after);
const roundTrip=C.importSave(JSON.parse(JSON.stringify(s)));
assert(roundTrip);assert.deepEqual(roundTrip.knowledge,s.knowledge);assert.equal(roundTrip.sanity,s.sanity);
const legacy=C.createGame();delete legacy.sanity;delete legacy.knowledge;delete legacy.witnessed;delete legacy.ritualSealed;
const migrated=C.importSave(legacy);assert(migrated);assert.equal(migrated.sanity,100);assert.deepEqual(migrated.knowledge,[]);
for(const property of ['sanity','knowledge','witnessed','ritualSealed']){const invalid=C.createGame();if(property==='sanity')invalid.sanity=101;else if(property==='knowledge')invalid.knowledge=['not-a-clue'];else if(property==='witnessed')invalid.witnessed=['unknown'];else invalid.ritualSealed='yes';assert.equal(C.validGame(invalid),false);}
console.log('v3.5 cosmic tests passed');
