const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const src=fs.readFileSync(require('node:path').join(__dirname,'../renderer3d.js'),'utf8');
for(const token of ['vec3 atmosphere()','float fogDensity()','float eldritchPulse(vec3 p)','wetStone:true','arcaneVeins:true','if(floorId>1.5&&floorId<2.5)','if(floorId>2.5&&floorId<3.5)','if(floorId>3.5)']) assert.ok(src.includes(token),`Missing shader feature: ${token}`);
assert.ok(!src.includes('smoothstep(.09,.022'), 'Undefined reversed smoothstep');
const root={};vm.runInNewContext(src,{globalThis:root});assert.equal(typeof root.Dungeon3DRenderer.createRenderer,'function');
console.log('v4.1: four floor palettes, volumetric-distance fog approximation, wet stone, runes and renderer exports OK');
