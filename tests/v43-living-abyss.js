const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const text=fs.readFileSync(path.join(__dirname,'..','renderer3d.js'),'utf8');
for(const [label,re] of [
 ['shader dread uniform',/uniform float dread/],
 ['uniform bound',/dreadLoc=loc\('dread'\)/],
 ['dread sent',/gl\.uniform1f\(dreadLoc,dreadIntensity\)/],
 ['clamped sanity',/Math\.max\(0,Math\.min\(1,\(65-\(Number\.isFinite\(s\.sanity\)\?s\.sanity:100\)\)\/65\)\)/],
 ['chromatic perception',/color=mix\(color,color\*vec3/],
 ['apparitions',/if\(dreadIntensity>\.15\)/],
 ['walkable cells',/core\.tile\(Math\.floor\(px\),Math\.floor\(pz\),s\.floor\)==='#'/],
 ['Canvas fallback',/DungeonRenderer\.createRenderer\(canvas,mapCanvas,core\)/]
])assert.match(text,re,label);
const readme=fs.readFileSync(path.join(__dirname,'..','README.md'),'utf8');
assert.match(readme,/v4\.3/);
console.log('v4.3 sanity linked to reversible WebGL effects: PASS');
