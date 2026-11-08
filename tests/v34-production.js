const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),script=fs.readFileSync(path.join(root,'glb-model.js'),'utf8');
let requests=0;const context={TextDecoder,DataView,Uint8Array,Math,Map,Error,Number,Object,fetch:async url=>{requests++;const b=fs.readFileSync(path.join(root,url));return {ok:true,arrayBuffer:async()=>b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)}}};context.globalThis=context;vm.runInNewContext(script,context);
(async()=>{
 assert(['crawler','specter','warden'].every(kind=>Object.hasOwn(context.DungeonGLB.catalog,kind))); 
 for(const type of ['warden','crawler','specter']){
  const n=await context.DungeonGLB.loadCreature(type);assert(n>1000);
  const vertices=context.DungeonGLB.getModel(type);assert.equal(vertices.length,n*3);assert(vertices.every(v=>v.length===9&&v.every(Number.isFinite)));
  const scene=[];context.DungeonGLB.appendMesh(scene,vertices,4,7,[1,0],{time:1200,attack:true});assert.equal(scene.length,n*27);assert(scene.every(Number.isFinite));
  console.log(`${type}: ${n} triangles, transformed and verified`);
 }
 const before=requests;await context.DungeonGLB.loadCreature('specter');assert.equal(requests,before,'Model must be cached');
 await assert.rejects(context.DungeonGLB.loadCreature('../../bad'),/no admitida/);
 const lab=fs.readFileSync(path.join(root,'art-lab.html'),'utf8'),js=fs.readFileSync(path.join(root,'art-lab.js'),'utf8'),renderer=fs.readFileSync(path.join(root,'renderer3d.js'),'utf8');
 assert(lab.includes('id="animate"')&&lab.includes('Espectro'));assert(js.includes('animationEnabled'));assert(renderer.includes("'specter'].includes(m.kind)"));
 console.log('v3.4 three-model studio and animation controls OK');
})().catch(e=>{console.error(e);process.exitCode=1});
