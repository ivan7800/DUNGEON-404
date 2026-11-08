const assert=require('node:assert/strict');
const C=require('../engine.js');

function distance(floor,target){
  const queue=[[1,1]],steps=new Map([['1,1',0]]);
  for(let i=0;i<queue.length;i++){
    const [x,y]=queue[i],n=steps.get(`${x},${y}`);
    if(x===target[0]&&y===target[1])return n;
    for(const [dx,dy] of C.DIRS){
      const nx=x+dx,ny=y+dy,key=`${nx},${ny}`;
      if(C.passable(nx,ny,floor)&&!steps.has(key)){steps.set(key,n+1);queue.push([nx,ny]);}
    }
  }
  return -1;
}

for(let floor=1;floor<=4;floor++){
  const map=[C.LEVEL,C.LOWER,C.LABYRINTH,C.ABYSS][floor-1];
  assert(map.every(row=>row.length===15),`floor ${floor} width`);
  assert(distance(floor,[11,13])>=0,`floor ${floor} reaches boss approach and exit`);
}
assert.notDeepEqual(C.LEVEL,C.LOWER,'flooded library has its own route');
assert.notDeepEqual(C.LOWER,C.LABYRINTH,'forgotten labyrinth has its own route');
assert(distance(4,[4,11])<20,'final rune is reached without the old long detour');
assert(distance(4,[11,13])<30,'final boss approach is reachable by a short descent');

const beats=[
  {floor:1,from:[5,5],dir:1,to:'6,5'},
  {floor:2,from:[4,5],dir:1,to:'5,5'},
  {floor:3,from:[2,5],dir:1,to:'3,5'},
  {floor:4,from:[1,6],dir:2,to:'1,7'}
];
for(const beat of beats){
  const s=C.createGame();s.floor=beat.floor;s.x=beat.from[0];s.y=beat.from[1];s.dir=beat.dir;
  const id=`beat:${beat.floor}:${beat.to}`;
  const events=C.dispatch(s,'forward',()=>.5);
  assert(s.loreRead.includes(id),`floor ${beat.floor} story beat recorded`);
  assert(events.some(e=>/Los pasos|El agua|El corredor|Los nichos/.test(e.text)),`floor ${beat.floor} beat shown`);
  assert(C.validGame(C.importSave(JSON.parse(JSON.stringify(s)))),`floor ${beat.floor} beat save round-trip`);
}
const payoffs=[
 {floor:1,from:[9,8],dir:2,to:[9,9],check:s=>s.lucidity===1},
 {floor:2,from:[10,8],dir:2,to:[10,9],check:s=>s.sanity===97},
 {floor:3,from:[6,8],dir:2,to:[6,9],check:s=>s.ether===3},
 {floor:4,from:[7,2],dir:2,to:[7,3],check:s=>s.sanity===100}
];
for(const beat of payoffs){
 const s=C.createGame();s.floor=beat.floor;s.x=beat.from[0];s.y=beat.from[1];s.dir=beat.dir;
 const events=C.dispatch(s,'forward',()=>.5);assert.deepEqual([s.x,s.y],beat.to);assert(beat.check(s),`floor ${beat.floor} exploration payoff`);
 assert(events.some(e=>/cordura|lucidez|esencia/.test(e.text)));
 const saved=C.importSave(JSON.parse(JSON.stringify(s)));assert(saved&&beat.check(saved));
 C.dispatch(s,'back',()=>.5);C.dispatch(s,'forward',()=>.5);assert(beat.check(s),'one-shot payoff must not repeat on revisits');
}
console.log('v5.2 route: four reachable distinct layouts, shorter Osario route, one-shot horror beats and save compatibility OK');
