const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),code=fs.readFileSync(path.join(root,'glb-model.js'),'utf8');
const ctx={TextDecoder,DataView,Uint8Array,Math,Map,Error,Number,Object,fetch:async url=>{const b=fs.readFileSync(path.join(root,url));return {ok:true,arrayBuffer:async()=>b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)}}};ctx.globalThis=ctx;vm.runInNewContext(code,ctx);
(async()=>{
for(const kind of ['drowned','tideborn','librarian','warden','specter']){
 await ctx.DungeonGLB.loadCreature(kind);const mesh=ctx.DungeonGLB.getModel(kind),before=JSON.stringify(mesh);
 const idle=[],attack=[],impact=[],later=[];
 for(const [out,options] of [[idle,{time:1030,kind}],[attack,{time:1030,kind,attack:true}],[impact,{time:1030,kind,impact:true}],[later,{time:1290,kind}]]){
  ctx.DungeonGLB.appendMesh(out,mesh,5,6,[0,1],options);
  assert.equal(out.length,mesh.length*9);assert(out.every(Number.isFinite));
 }
 assert.notDeepEqual(attack,idle,kind+' attack differs from idle');assert.notDeepEqual(impact,idle,kind+' recoil differs from idle');assert.notDeepEqual(later,idle,kind+' movement changes with time');
 assert.equal(JSON.stringify(mesh),before,'source mesh must remain immutable');
 console.log(kind,'distinct poses and unchanged GLB OK');
}
const renderer=fs.readFileSync(path.join(root,'renderer3d.js'),'utf8');
assert.match(renderer,/kind:m\.cosmicType/);assert.match(renderer,/kind:m\.kind/);
assert.match(renderer,/Math\.abs\(s\.x-m\.x\)\+Math\.abs\(s\.y-m\.y\)<=2/);
console.log('v4.5 procedural creature motion tests PASS');
})().catch(err=>{console.error(err);process.exitCode=1});
