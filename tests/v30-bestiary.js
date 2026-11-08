const assert=require('node:assert/strict');const fs=require('node:fs');const cp=require('node:child_process');const path=require('node:path');const base=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(base,'art-lab.html'),'utf8');const code=fs.readFileSync(path.join(base,'art-lab.js'),'utf8');
for(const kind of ['crawler','specter','warden','archivist','firstname']) assert(html.includes('value="'+kind+'"'),kind);
for(const id of ['creature','attack','mode','floor','scene'])assert(html.includes('id="'+id+'"'),id);
for(const token of ['function placeCreature()','state.monsters=[]','core.tile(x,y,state.floor)','core.gateAt(x,y,state.floor)','attackUntil','function updateStatus()'])assert(code.includes(token),token);
assert(!code.includes('localStorage'));
cp.execFileSync(process.execPath,['--check',path.join(base,'art-lab.js')]);
console.log('v3.0 Bestiary Studio syntax and structure OK');
