'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const core=require('../engine.js');
const source=fs.readFileSync(require.resolve('../renderer3d.js'),'utf8');
function boot(gl){const cx={DungeonRenderer:{createRenderer:()=>({backend:'Canvas 2.5D',renderMap(){}})},document:{createElement:()=>({width:960,height:600})}};cx.globalThis=cx;vm.runInNewContext(source,cx);return cx.Dungeon3DRenderer.createRenderer({width:960,height:600,getContext:()=>gl,addEventListener(){}},{},core);}
assert.equal(boot(null).backend,'Canvas 2.5D');
let failShader={VERTEX_SHADER:1,FRAGMENT_SHADER:2,COMPILE_STATUS:3,createProgram:()=>({}),createShader:()=>({}),shaderSource(){},compileShader(){},getShaderParameter:()=>false,getShaderInfoLog:()=> 'shader compile failure'};
assert.throws(()=>boot(failShader),/shader compile failure/);
let failLink={...failShader,LINK_STATUS:4,createProgram:()=>({}),attachShader(){},linkProgram(){},getProgramParameter:()=>false,getProgramInfoLog:()=> 'program link failure',getShaderParameter:()=>true};
assert.throws(()=>boot(failLink),/program link failure/);
let gl={VERTEX_SHADER:1,FRAGMENT_SHADER:2,COMPILE_STATUS:3,LINK_STATUS:4,ARRAY_BUFFER:5,FLOAT:6,DEPTH_TEST:7,CULL_FACE:8,COLOR_BUFFER_BIT:16,DEPTH_BUFFER_BIT:32,DYNAMIC_DRAW:64,TRIANGLES:4,NO_ERROR:0};
for(const n of ['compileShader','attachShader','linkProgram','useProgram','bindBuffer','enableVertexAttribArray','vertexAttribPointer','enable','disable','clearColor','viewport','clear','uniformMatrix4fv','uniform3fv','uniform1f','bufferData','drawArrays'])gl[n]=()=>{};
Object.assign(gl,{createShader:()=>({}),shaderSource(){},createProgram:()=>({}),createBuffer:()=>({}),getShaderParameter:()=>true,getProgramParameter:()=>true,getAttribLocation:()=>0,getUniformLocation:()=>({}),getError:()=>1282});
let r=boot(gl);assert.throws(()=>r.renderWorld(core.createGame(),200,''),/WebGL draw error: 0x502/);
console.log('v2.2 failure modes OK: Canvas fallback, shader compilation, link and GL draw errors');
