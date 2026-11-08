const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');const ctx={TextDecoder,DataView,Uint8Array,Math,Map,Error,Number,Object,fetch:async url=>{const data=fs.readFileSync(path.join(root,url));return {ok:true,arrayBuffer:async()=>data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength)}}};ctx.globalThis=ctx;
vm.runInNewContext(fs.readFileSync(path.join(root,'glb-model.js'),'utf8'),ctx);
(async()=>{
for(const kind of ['drowned','tideborn','librarian']){
 const triangles=await ctx.DungeonGLB.loadCreature(kind);assert(triangles>=3000);
 const mesh=ctx.DungeonGLB.getModel(kind);assert(mesh.every(v=>v.length===9&&v.every(Number.isFinite)));
 const scene=[];ctx.DungeonGLB.appendMesh(scene,mesh,3,4,[0,1],{time:1234,attack:true});assert.equal(scene.length,mesh.length*9);
 console.log(kind,triangles,'triangles validated');
}
const renderer=fs.readFileSync(path.join(root,'renderer3d.js'),'utf8');assert(renderer.includes('m.cosmicType')&&renderer.includes('cosmicMesh'));
const lab=fs.readFileSync(path.join(root,'art-lab.html'),'utf8');for(const kind of ['drowned','tideborn','librarian'])assert(lab.includes('value="'+kind+'"'));
const page=fs.readFileSync(path.join(root,'index.html'),'utf8');assert(page.indexOf('glb-model.js')<page.indexOf('game.js'));
console.log('v3.9 art assets and optional campaign integration OK');
})().catch(e=>{console.error(e);process.exitCode=1});
