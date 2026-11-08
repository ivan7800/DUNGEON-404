const assert=require('node:assert/strict');const fs=require('node:fs');const cp=require('node:child_process');const path=require('node:path');const base=path.join(__dirname,'..');
for(const filename of ['art-lab.html','art-lab.js','renderer3d.js'])assert(fs.existsSync(path.join(base,filename)));
const html=fs.readFileSync(path.join(base,'art-lab.html'),'utf8');for(const fragment of ['renderer3d.js','art-lab.js','id="scene"','id="floor"','id="mode"','id="snapshot"'])assert(html.includes(fragment),fragment);
const js=fs.readFileSync(path.join(base,'art-lab.js'),'utf8');for(const fragment of ['toDataURL','Dungeon3DRenderer','DungeonRenderer','core.createGame','requestAnimationFrame','Motor ACTIVO'])assert(js.includes(fragment),fragment);
const source=fs.readFileSync(path.join(base,'renderer3d.js'),'utf8');assert(source.includes('function gothicRelief('));assert(source.includes('gothicRelief(scene,x,z,s.floor)'));assert(source.includes('artLabReady:true'));
for(const filename of ['art-lab.js','renderer3d.js'])cp.execFileSync(process.execPath,['--check',path.join(base,filename)]);
console.log('v2.9 Art Lab structure, diagnostics and syntax OK');
