/* DUNGEON 404 v3.4: limited, safe glTF 2.0 GLB loader for authored static mesh.
   Does not evaluate scripts or support arbitrary extensions, skins or remote buffers. */
(function(root){'use strict';
const loadedByKind=new Map(); let loaded=null;
function parseGLB(buffer){
 const v=new DataView(buffer);
 if(v.byteLength<20||v.getUint32(0,true)!==0x46546c67||v.getUint32(4,true)!==2||v.getUint32(8,true)!==v.byteLength)throw Error('GLB 2.0 inválido');
 let off=12,meta=null,bin=null;
 while(off+8<=v.byteLength){const len=v.getUint32(off,true),type=v.getUint32(off+4,true);off+=8;
  if(len>v.byteLength-off)throw Error('GLB truncado');
  if(type===0x4e4f534a)meta=JSON.parse(new TextDecoder().decode(new Uint8Array(buffer,off,len)));
  if(type===0x004e4942)bin=new DataView(buffer,off,len);
  off+=len;
 }
 if(!meta||!bin||!Array.isArray(meta.meshes)||!meta.meshes.length)throw Error('Malla GLB ausente');
 const components={5121:[1,'getUint8'],5123:[2,'getUint16'],5125:[4,'getUint32'],5126:[4,'getFloat32']};
 const read=(index)=>{
  const a=meta.accessors?.[index],b=meta.bufferViews?.[a?.bufferView];
  if(!a||!b||b.buffer!==0||a.sparse||!Number.isSafeInteger(a.count)||a.count<1||a.count>200000)throw Error('Accessor GLB no admitido');
  const c=components[a.componentType],dim={SCALAR:1,VEC3:3,VEC4:4}[a.type];if(!c||!dim)throw Error('Formato de atributo no admitido');
  const stride=b.byteStride||c[0]*dim,base=(b.byteOffset||0)+(a.byteOffset||0),out=[];
  if(!Number.isSafeInteger(base)||base<0||!Number.isSafeInteger(stride)||stride<c[0]*dim||base+Math.max(0,a.count-1)*stride+c[0]*dim>bin.byteLength)throw Error('Accessor fuera de límites');
  for(let i=0;i<a.count;i++){const row=[];for(let j=0;j<dim;j++)row.push(bin[c[1]](base+i*stride+j*c[0],true));out.push(row);}
  return out;
 };
 const out=[];
 for(const mesh of meta.meshes){for(const primitive of mesh.primitives||[]){
  if(primitive.mode!==undefined&&primitive.mode!==4)throw Error('Solo triángulos GLB');
  const attr=primitive.attributes||{};
  const pos=read(attr.POSITION),colors=attr.COLOR_0!==undefined?read(attr.COLOR_0):null;
  const idx=primitive.indices!==undefined?read(primitive.indices).map(v=>v[0]):pos.map((_,i)=>i);
  if(idx.length%3||idx.length>600000)throw Error('Índices inválidos');
  if(!pos.length||idx.some(row=>!Number.isSafeInteger(row)||row<0||row>=pos.length))throw Error('Índice GLB fuera de límites');
  for(let i=0;i<idx.length;i+=3){const a=pos[idx[i]],b=pos[idx[i+1]],c=pos[idx[i+2]];
   if(!a||!b||!c||!a.every(Number.isFinite)||!b.every(Number.isFinite)||!c.every(Number.isFinite))throw Error('Vértice GLB inválido');
   const u=b.map((q,k)=>q-a[k]),w=c.map((q,k)=>q-a[k]);const n=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]];
   const len=Math.hypot(...n)||1;
   for(const vi of idx.slice(i,i+3)){
    const p=pos[vi],rgba=colors?.[vi]||[125,131,120,255];
    const green=rgba[1]>rgba[0]*1.55&&rgba[2]>rgba[0]*1.55;
    const gold=rgba[0]>rgba[1]*1.07&&rgba[1]>rgba[2]*1.13;
    out.push([p[0],p[1],p[2],n[0]/len,n[1]/len,n[2]/len,0,0,green?18:gold?20:17]);
   }
  }
 }}
 if(!out.length)throw Error('GLB vacío');return out;
}
// Non-skeletal, per-species mesh deformation. The underlying RPG hitboxes stay
// unchanged. Model vertices are never mutated; each animation emits a new frame.
function creaturePose(kind,time,attack,impact,vertex){
 const t=Number.isFinite(time)?time:0;
 const phase=t*.0028;
 const y=vertex[1],x=vertex[0],z=vertex[2];
 const pulse=attack?Math.max(0,Math.sin((t%600)/600*Math.PI)):0;
 const recoil=impact?Math.max(0,Math.sin((t%420)/420*Math.PI)):0;
 let px=x,py=y,pz=z;
 if(kind==='drowned'){
  // The drowned one drags its arms, sways sideways and lunges when attacking.
  px+=.052*Math.sin(phase+y*2.8)*(0.3+Math.min(1,y));
  pz+=pulse*.19*Math.min(1,y/1.2);
  py+=.032*Math.sin(phase*1.3+x*3);
 }else if(kind==='tideborn'||kind==='crawler'){
  // Insectoid locomotion: alternating gait, abdomen compression, jaw strike.
  py+=.045*Math.sin(phase*3.4+Math.sign(x)*Math.PI/2+z*3)*Math.min(1,Math.abs(x)*2.5);
  pz+=pulse*.23*(z>0?1:.25);
  px*=1+.024*Math.sin(phase*2.1);
 }else if(kind==='librarian'||kind==='specter'){
  // Floating priest: opposing drapery torsion and expanding attack silhouette.
  const twist=.075*Math.sin(phase+y*1.5);
  px=x*Math.cos(twist)-z*Math.sin(twist);
  pz=x*Math.sin(twist)+z*Math.cos(twist);
  py+=.07*Math.sin(phase*1.2)+pulse*.07;
  px*=1+pulse*.12;
 }else if(kind==='warden'){
  // Slow weight transfer and massive upper-body wind-up.
  px+=.026*Math.sin(phase)*Math.min(1,y);
  pz-=pulse*.14*Math.min(1,y);
  py+=.012*Math.sin(phase*1.4);
 }else{
  py+=.026*Math.sin(phase+x*2);
 }
 pz-=recoil*.15;
 return [px,py,pz];
}
function appendMesh(scene,triangles,x,z,dir,animation){
 const elapsed=Number.isFinite(animation?.time)?animation.time:0;
 const attack=animation?.attack===true;
 const impact=animation?.impact===true;
 const kind=animation?.kind||'warden';
 const yaw=Math.atan2(-dir[0],-dir[1]),c=Math.cos(yaw),s=Math.sin(yaw);
 const bob=Math.sin(elapsed*.004)*.021;
 for(const v of triangles){
  const [px,py,pz]=creaturePose(kind,elapsed,attack,impact,v);
  scene.push(x+px*c-pz*s,py+bob,z+px*s+pz*c,
   v[3]*c-v[5]*s,v[4],v[3]*s+v[5]*c,v[6],v[7],animation?.frozen?7:v[8]);
 }
}
const catalog=Object.freeze({warden:'assets/models/crypt-warden.glb',crawler:'assets/models/crypt-crawler.glb',specter:'assets/models/crypt-specter.glb',drowned:'assets/models/abyss-drowned.glb',tideborn:'assets/models/abyss-tideborn.glb',librarian:'assets/models/abyss-librarian.glb'});
async function loadCreature(kind='warden'){
 if(!Object.hasOwn(catalog,kind))throw Error('Criatura GLB no admitida');
 if(loadedByKind.has(kind))return loadedByKind.get(kind).length/3;
 const url=catalog[kind];
 const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw Error('HTTP '+response.status+' al cargar GLB');
 const buffer=await response.arrayBuffer();if(buffer.byteLength>8*1024*1024)throw Error('GLB demasiado grande');
 const model=parseGLB(buffer);loadedByKind.set(kind,model);if(kind==='warden')loaded=model;return model.length/3;
}
root.DungeonGLB={loadModel:()=>loadCreature('warden'),loadCreature,parseGLB,creaturePose,getModel:(kind='warden')=>loadedByKind.get(kind)||null,appendMesh,catalog};
})(typeof globalThis!=='undefined'?globalThis:this);
