const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const dir=path.join(__dirname,'..');
const data=fs.readFileSync(path.join(dir,'assets/models/crypt-warden.glb'));const ab=data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength);
const ctx={TextDecoder,Uint8Array,DataView,Math,Error};ctx.globalThis=ctx;vm.runInNewContext(fs.readFileSync(path.join(dir,'glb-model.js'),'utf8'),ctx);
const model=ctx.DungeonGLB.parseGLB(ab);assert(model.length>6000);assert(model.every(row=>row.length===9&&row.every(Number.isFinite)));assert(new Set(model.map(v=>v[8])).size>=2);
const arr=[];ctx.DungeonGLB.appendMesh(arr,model,5.5,6.5,[0,1]);assert.equal(arr.length,model.length*9);assert(arr.every(Number.isFinite));
const html=fs.readFileSync(path.join(dir,'art-lab.html'),'utf8'),js=fs.readFileSync(path.join(dir,'art-lab.js'),'utf8'),renderer=fs.readFileSync(path.join(dir,'renderer3d.js'),'utf8');
assert.match(html,/glb-model\.js/);assert.match(html,/id="glb"/);assert.match(js,/DungeonGLB\.(loadModel|loadCreature)/);assert.match(renderer,/DungeonGLB\.appendMesh/);
const z=require('node:child_process');for(const f of ['glb-model.js','renderer3d.js','art-lab.js'])z.execFileSync(process.execPath,['--check',path.join(dir,f)]);
console.log('v3.2 GLB parsed:',model.length/3,'triangles; color variants and studio integration verified');
