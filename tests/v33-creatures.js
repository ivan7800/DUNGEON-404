const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const cp=require('node:child_process');
const dir=path.join(__dirname,'..');const source=fs.readFileSync(path.join(dir,'glb-model.js'),'utf8');
const ctx={TextDecoder,Uint8Array,DataView,Math,Error,Map,Object,Number,fetch:async(url)=>{const bytes=fs.readFileSync(path.join(dir,url));return {ok:true,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.length)}}};ctx.globalThis=ctx;vm.runInNewContext(source,ctx);
(async()=>{
 assert(['crawler','warden'].every(kind=>Object.hasOwn(ctx.DungeonGLB.catalog,kind))); // v3.3 assets remain supported when catalog grows
 for(const kind of ['warden','crawler']){
  const bytes=fs.readFileSync(path.join(dir,ctx.DungeonGLB.catalog[kind]));
  const ab=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.length);
  const mesh=ctx.DungeonGLB.parseGLB(ab);
  assert(mesh.length>3000 && mesh.every(row=>row.length===9&&row.every(Number.isFinite)));
  const triangles=await ctx.DungeonGLB.loadCreature(kind);assert.equal(triangles,mesh.length/3);
  const base=[],animated=[],hit=[];
  ctx.DungeonGLB.appendMesh(base,mesh,3,5,[0,1]);
  ctx.DungeonGLB.appendMesh(animated,mesh,3,5,[0,1],{time:850,attack:false});
  ctx.DungeonGLB.appendMesh(hit,mesh,3,5,[0,1],{time:850,attack:true});
  assert.equal(base.length,animated.length);assert.equal(base.length,hit.length);
  assert(base.every(Number.isFinite)&&animated.every(Number.isFinite)&&hit.every(Number.isFinite));
  assert.notDeepEqual(base,animated,'breathing/bobbing must visibly alter the geometry');
  assert.notDeepEqual(animated,hit,'attack must visibly change the pose');
  console.log(`${kind}: ${triangles} GLB triangles, static/breath/attack poses validated`);
 }
 await assert.rejects(ctx.DungeonGLB.loadCreature('../secret'),/no admitida/);
 for(const name of ['glb-model.js','renderer3d.js','art-lab.js'])cp.execFileSync(process.execPath,['--check',path.join(dir,name)]);
 const html=fs.readFileSync(path.join(dir,'art-lab.html'),'utf8');assert.match(html,/Modelo GLB original/);
 const lab=fs.readFileSync(path.join(dir,'art-lab.js'),'utf8');assert.match(lab,/loadCreature/);
 console.log('v3.3 creature catalog, safety, animation and studio wiring OK');
})().catch(e=>{console.error(e);process.exitCode=1;});
