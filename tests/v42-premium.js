const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const text=fs.readFileSync(path.join(__dirname,'..','renderer3d.js'),'utf8');
for(const [label,re] of [
 ['material de agua negra',/material<19\.5/],
 ['ondas del agua',/float ripple=sin/],
 ['geometría de agua',/quad\(scene,\[x\+\.09,\.014/],
 ['impacto GLSL',/uniform float impact/],
 ['impacto enlazado',/uniform1f\(impactLoc/],
 ['tonemapping',/color=color\/\(vec3\(1\.\)\+color\*\.35\)/],
 ['paletas específicas',/floorId<3\.5/],
 ['fallback',/DungeonRenderer\.createRenderer\(canvas,mapCanvas,core\)/],
])assert.match(text,re,label);
assert.match(fs.readFileSync(path.join(__dirname,'..','README.md'),'utf8'),/v4\.(?:2|3)/);
console.log('v4.2: efectos visuales y controles conectados en código OK');
