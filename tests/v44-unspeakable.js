const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'..','renderer3d.js'),'utf8');
for(const [name,pattern] of [
 ['nearby threats',/const nearbyThreats=\(s\.monsters\|\|\[\]\)\.filter/],
 ['alive filter',/m\.hp>0/],
 ['range filter',/Math\.abs\(m\.x-s\.x\)\+Math\.abs\(m\.y-s\.y\)<=2/],
 ['render cap',/nearbyThreats\.slice\(0,5\)/],
 ['boss distinction',/const boss=\['warden','king','archivist','firstname'\]/],
 ['ritual based on save',/\['seal','listen'\]\.includes\(s\.drownedRitual\)/],
 ['ritual branch',/const sealed=s\.drownedRitual==='seal'/],
 ['WebGL diagnostic',/threatTelegraphs:true,ritualVisualState:true/],
 ['Canvas retained',/DungeonRenderer\.createRenderer\(canvas,mapCanvas,core\)/]
])assert.match(src,pattern,name);
const core=fs.readFileSync(path.join(__dirname,'..','engine.js'),'utf8');
assert.match(core,/drownedRitual:'none'/);
assert.match(core,/drownedRitual='seal'/);
assert.match(core,/drownedRitual='listen'/);
console.log('v4.4 near-threat atmosphere and ritual presentation: PASS');
