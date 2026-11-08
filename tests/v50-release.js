const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');let requests=0;
const ctx={TextDecoder,Uint8Array,DataView,Math,Map,Error,Number,Object,fetch:async url=>{requests++;const b=fs.readFileSync(path.join(root,url));return {ok:true,arrayBuffer:async()=>b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)}}};ctx.globalThis=ctx;
vm.runInNewContext(fs.readFileSync(path.join(root,'glb-model.js'),'utf8'),ctx);
(async()=>{
 for(const kind of Object.keys(ctx.DungeonGLB.catalog)){
  await ctx.DungeonGLB.loadCreature(kind);const mesh=ctx.DungeonGLB.getModel(kind);
  for(const face of [[0,1],[3,-2],[-2,0]]){
   const ice=[],normal=[];
   ctx.DungeonGLB.appendMesh(ice,mesh,2,3,face,{time:1200,kind,frozen:true});
   ctx.DungeonGLB.appendMesh(normal,mesh,2,3,face,{time:1200,kind,frozen:false});
   assert(ice.every(Number.isFinite));assert.equal(ice.length,normal.length);
   for(let i=8;i<ice.length;i+=9)assert.equal(ice[i],7);
   assert(normal.some((v,i)=>i%9===8&&v!==7));
  }
  assert(!mesh.some(v=>v[8]===19),'Creature gold must not use the animated water material');
 }
 const loaded=requests;await ctx.DungeonGLB.loadCreature('warden');assert.equal(requests,loaded);
 console.log('v5.0: all six GLBs, camera-facing transforms, frozen materials, gold/water separation and model cache PASS');
})().catch(e=>{console.error(e);process.exitCode=1});
