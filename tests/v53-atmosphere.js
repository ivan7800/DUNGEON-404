const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const core=require('../engine.js');
const src=fs.readFileSync(path.join(__dirname,'..','renderer3d.js'),'utf8');

for(const [feature,pattern] of [
  ['opening apparition',/s\.turn<=3\|\|dreadIntensity>\.34/],
  ['non-combat apparition contract',/presentation-only: no enemy state, combat, collision or save data/],
  ['wall-mounted torches',/wall-mounted iron bracket/],
  ['natural scarred stone',/float stain=pow\(fbm\(tex\*vec2\(4\.,13\.\)\),3\.\)/],
  ['crypt blood material',/material<21\.5/],
  ['burial bone material',/material<20\.5/],
  ['pointed corridor ribs',/Thin pointed ribs replace the bulky floating lintels/],
  ['floor-specific debris',/bone dust below/]
])assert.match(src,pattern,feature);

assert.match(src,/openingApparition:true/);
assert.match(src,/wallMountedTorches:true/);

const shaders=[],buffers=[];
const gl={VERTEX_SHADER:1,FRAGMENT_SHADER:2,COMPILE_STATUS:3,LINK_STATUS:4,ARRAY_BUFFER:5,FLOAT:6,DEPTH_TEST:7,CULL_FACE:8,COLOR_BUFFER_BIT:16,DEPTH_BUFFER_BIT:32,DYNAMIC_DRAW:64,TRIANGLES:4};
for(const name of ['compileShader','attachShader','linkProgram','useProgram','bindBuffer','enableVertexAttribArray','vertexAttribPointer','enable','disable','clearColor','viewport','clear','uniformMatrix4fv','uniform3fv','uniform1f'])gl[name]=()=>{};
gl.createShader=()=>({});gl.shaderSource=(_shader,text)=>shaders.push(text);gl.createProgram=()=>({});gl.createBuffer=()=>({});
gl.getShaderParameter=()=>true;gl.getProgramParameter=()=>true;gl.getAttribLocation=()=>0;gl.getUniformLocation=()=>({});gl.bufferData=(_target,data)=>buffers.push(data.length);gl.drawArrays=()=>{};
const ctx={DungeonRenderer:{createRenderer:()=>({renderMap:()=>{}})},document:{createElement:()=>({width:960,height:600})}};ctx.globalThis=ctx;
vm.runInNewContext(src,ctx);
const renderer=ctx.Dungeon3DRenderer.createRenderer({width:960,height:600,getContext:()=>gl},{},core);
const state=core.createGame();state.turn=2;renderer.renderWorld(state,100,'');const openingGeometry=buffers.at(-1);
state.turn=4;renderer.renderWorld(state,100,'');const settledGeometry=buffers.at(-1);
assert(openingGeometry>settledGeometry,'opening apparition contributes visible geometry');
console.log('v5.3 atmosphere contract: apparition, sculpted light, stone material and depth-specific set dressing present');
