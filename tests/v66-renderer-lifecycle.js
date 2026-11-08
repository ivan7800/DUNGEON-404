'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),C=require('../engine');
let deletedPrograms=0,deletedBuffers=0,released=0;const events=new Map();
const gl={VERTEX_SHADER:1,FRAGMENT_SHADER:2,COMPILE_STATUS:3,LINK_STATUS:4,ARRAY_BUFFER:5,FLOAT:6,DEPTH_TEST:7,CULL_FACE:8,COLOR_BUFFER_BIT:16,DEPTH_BUFFER_BIT:32,DYNAMIC_DRAW:64,TRIANGLES:4,NO_ERROR:0};
for(const key of ['compileShader','attachShader','linkProgram','useProgram','bindBuffer','enableVertexAttribArray','vertexAttribPointer','enable','disable','clearColor','viewport','clear','uniformMatrix4fv','uniform3fv','uniform1f','bufferData','drawArrays','shaderSource','deleteShader'])gl[key]=()=>{};
Object.assign(gl,{createShader:()=>({}),createProgram:()=>({}),createBuffer:()=>({}),getShaderParameter:()=>true,getProgramParameter:()=>true,getAttribLocation:()=>0,getUniformLocation:(_program,name)=>name,getError:()=>0,deleteProgram:()=>deletedPrograms++,deleteBuffer:()=>deletedBuffers++,getExtension:()=>({loseContext:()=>released++})});
gl.uniform3fv=(location,data)=>{assert.equal(data.length,location==='lightPos[0]'?15:3,'GPU vector arrays must contain exactly the declared xyz components');};
const ctx={DungeonRenderer:{createRenderer:()=>({renderMap(){}})},document:{createElement:()=>({})}};ctx.globalThis=ctx;
vm.runInNewContext(fs.readFileSync(require.resolve('../renderer3d.js'),'utf8'),ctx);
const canvas={width:960,height:540,getContext:()=>gl,addEventListener:(name,cb)=>events.set(name,cb),removeEventListener:name=>events.delete(name)};
const r=ctx.Dungeon3DRenderer.createRenderer(canvas,{},C);
for(let floor=1;floor<=4;floor++){const s=C.createGame();s.floor=floor;r.renderWorld(s,100);}
events.get('webglcontextlost')({preventDefault(){}});
events.get('webglcontextrestored')();
assert.throws(()=>r.renderWorld(C.createGame(),200),/context lost/,'restored buffers must be rebuilt by controller');
r.dispose();r.dispose();assert.equal(deletedPrograms,1);assert.equal(deletedBuffers,1);assert.equal(released,1);assert.equal(events.size,0);
console.log('v6.6 render lifecycle: context loss/restoration, idempotent GPU disposal and listener cleanup PASS');
