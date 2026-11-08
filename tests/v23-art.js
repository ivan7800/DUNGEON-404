/* v2.3 art contract: tests material palette, shaders and visual animation without claiming a real GPU. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const core=require('../engine.js');let shaders=[],draws=[],buffers=[];
const gl={VERTEX_SHADER:1,FRAGMENT_SHADER:2,COMPILE_STATUS:3,LINK_STATUS:4,ARRAY_BUFFER:5,FLOAT:6,DEPTH_TEST:7,CULL_FACE:8,COLOR_BUFFER_BIT:16,DEPTH_BUFFER_BIT:32,DYNAMIC_DRAW:64,TRIANGLES:4};
for(const n of ['compileShader','attachShader','linkProgram','useProgram','bindBuffer','enableVertexAttribArray','vertexAttribPointer','enable','disable','clearColor','viewport','clear','uniformMatrix4fv','uniform3fv','uniform1f'])gl[n]=()=>{};
gl.createShader=()=>({});gl.shaderSource=(_s,text)=>shaders.push(text);gl.createProgram=()=>({});gl.createBuffer=()=>({});gl.getShaderParameter=()=>true;gl.getProgramParameter=()=>true;gl.getAttribLocation=()=>0;gl.getUniformLocation=()=>({});gl.bufferData=(_target,data)=>buffers.push(Array.from(data));gl.drawArrays=(_mode,_start,count)=>draws.push(count);
const ctx={DungeonRenderer:{createRenderer:()=>({renderMap:()=>{}})},document:{createElement:()=>({width:960,height:600})}};ctx.globalThis=ctx;
vm.runInNewContext(fs.readFileSync(require.resolve('../renderer3d.js'),'utf8'),ctx);
const r=ctx.Dungeon3DRenderer.createRenderer({width:960,height:600,getContext:()=>gl},{},core);
assert(r.diagnostics.architecturalReliefs);assert(r.diagnostics.combatMotion);assert(r.diagnostics.shaderLinked);assert(r.diagnostics.shaderCompiled);assert(r.diagnostics.drawChecked);assert.equal(r.diagnostics.materials,23);assert(shaders[1].includes('fbm('));assert(shaders[1].includes('palette()'));assert(!shaders[1].includes('smoothstep(.065,.018'));assert(shaders[1].includes('1.-smoothstep(.012,.052'));
const state=core.createGame();r.renderWorld(state,100,'');const initial=buffers.at(-1);r.renderWorld(state,233,'attack');const animated=buffers.at(-1);
assert(draws[0]>3000);assert(draws[1]>draws[0]);assert.notDeepEqual(initial,animated);assert.equal(draws.length,2);
console.log('v2.2 renderer OK:',draws.join(' -> '),'vertices; procedurals, animation, shaders present');
// Review geometry submission across all four dungeon depths without GPU claims.
const floorVertexCounts=[];
for(let floor=1;floor<=4;floor++){
 const testState=core.createGame();testState.floor=floor;
 r.renderWorld(testState,500,'');floorVertexCounts.push(draws.at(-1));
 assert(draws.at(-1)>3000,`floor ${floor} geometry missing`);
}
assert.equal(floorVertexCounts.length,4);
console.log('Four-floor geometry checks:',floorVertexCounts.join(', '));

// Art pass should have more relief geometry and animated enemy submissions.
assert(shaders[1].includes('float mineral='));
const sample=core.createGame();sample.floor=4;
r.renderWorld(sample,110,'');const artIdle=buffers.at(-1);
r.renderWorld(sample,180,'attack');const artAttack=buffers.at(-1);
assert.notDeepEqual(artIdle,artAttack,'combat effect must deform a visible mesh');
console.log('v2.3 art contract OK');
