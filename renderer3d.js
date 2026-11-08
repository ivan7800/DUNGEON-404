/* DUNGEON 404 v4.4 — The Unspeakable Horror. Offline WebGL; no external runtime. */
(function(root){'use strict';
function createRenderer(canvas,mapCanvas,core){
 const gl=canvas.getContext('webgl',{alpha:false,antialias:true,preserveDrawingBuffer:canvas.dataset?.capture==='true'});
 if(!gl) return root.DungeonRenderer.createRenderer(canvas,mapCanvas,core);
 const mapRenderer=root.DungeonRenderer.createRenderer(Object.assign(document.createElement('canvas'),{width:960,height:600}),mapCanvas,core);
 const vs=`attribute vec3 p;attribute vec3 n;attribute vec2 uv;attribute float mat;uniform mat4 projection;uniform mat4 view;varying vec3 world;varying vec3 normal;varying vec2 tex;varying float material;void main(){world=p;normal=n;tex=uv;material=mat;gl_Position=projection*view*vec4(p,1.);}`;
 const fs=`precision highp float;varying vec3 world;varying vec3 normal;varying vec2 tex;varying float material;uniform vec3 eye;uniform float tick;uniform float floorId;uniform vec3 lightPos[5];uniform float impact;uniform float dread;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
 float fbm(vec2 p){return .53*noise(p)+.27*noise(p*2.13)+.13*noise(p*4.27)+.07*noise(p*8.41);}
 vec3 palette(){if(floorId<1.5)return vec3(.23,.27,.29);if(floorId<2.5)return vec3(.15,.24,.25);if(floorId<3.5)return vec3(.24,.20,.31);return vec3(.28,.20,.23);}
 vec3 atmosphere(){if(floorId<1.5)return vec3(.026,.043,.052);if(floorId<2.5)return vec3(.012,.062,.073);if(floorId<3.5)return vec3(.067,.029,.093);return vec3(.080,.023,.042);}
 float fogDensity(){if(floorId<1.5)return .085;if(floorId<2.5)return .135;if(floorId<3.5)return .115;return .095;}
 float eldritchPulse(vec3 p){return .5+.5*sin(tick*.0027+p.x*2.7+p.z*1.9);}
 
 void main(){vec3 base;float mortar=0.;
 if(material<.5){vec2 brick=vec2(tex.x*2.6,tex.y*2.2);vec2 offset=vec2(mod(floor(brick.y),2.)*.5,0.);vec2 cell=floor(brick+offset),f=fract(brick+offset);mortar=1.-smoothstep(.012,.052,min(min(f.x,1.-f.x),min(f.y,1.-f.y)));
 float grain=fbm(tex*vec2(23.,19.));float crack=1.-smoothstep(.008,.035,abs(noise(tex*vec2(19.,7.))-.51));base=palette()*(.63+.48*hash(cell))*(.64+.58*grain);base*=1.-.24*crack;float weather=fbm(tex*vec2(5.,29.));base*=.70+.48*weather;float stain=pow(fbm(tex*vec2(4.,13.)),3.);base*=1.-.34*stain;float mineral=1.-smoothstep(.025,.075,abs(noise(tex*vec2(32.,23.))-.48));base+=palette()*.13*mineral;}
 else if(material<1.5){float grit=fbm(tex*13.);vec2 grid=fract(tex*4.);float seam=1.-smoothstep(.012,.035,min(min(grid.x,1.-grid.x),min(grid.y,1.-grid.y)));float worn=.84+.19*noise(tex*vec2(29.,31.));base=palette()*(.62+.45*grit)*worn*(1.-seam*.32);
 if(floorId>1.5&&floorId<2.5){float wet=.30+.70*fbm(tex*vec2(7.,11.));base=mix(base,vec3(.026,.10,.125),.52*wet);base+=vec3(.006,.032,.043)*pow(1.-abs(normalize(normal).y),2.);}
 if(floorId>2.5&&floorId<3.5){float rune=1.-smoothstep(.022,.09,abs(noise(tex*vec2(21.,29.))-.50));base+=vec3(.032,.009,.068)*rune*eldritchPulse(world);}
 if(floorId>3.5){float ash=fbm(tex*vec2(19.,17.));base*=.72+.28*ash;}
 }
 else if(material<2.5){float rock=fbm(tex*19.);base=mix(vec3(.10,.12,.14),palette()*.56,rock);base*=.9+.13*noise(tex*40.);}
 else if(material<3.5){float plank=1.-smoothstep(.015,.06,fract(tex.x*5.));float grain=fbm(tex*vec2(54.,3.));base=vec3(.29,.18,.105)*(.68+.46*grain)*(1.-plank*.65);}
 else if(material<4.5){float pat=fbm(tex*vec2(15.,22.));float rivet=1.-smoothstep(.025,.09,length(fract(tex*6.)-.5));base=vec3(.20,.25,.29)*(.65+.5*pat)+rivet*.17;}
 else if(material<5.5){float flesh=fbm(tex*18.);base=vec3(.19,.31,.24)*(.70+.45*flesh);}
 else if(material<6.5){base=vec3(.92,.29,.105)+vec3(.11,.11,.06)*sin(tick*.017+world.y*14.);}
 else if(material<7.5){base=vec3(.40,.73,.94)+vec3(.12,.16,.05)*sin(tick*.005+world.x*5.);}
 else if(material<8.5){float ribs=1.-smoothstep(.02,.09,fract(tex.x*9.));base=vec3(.19,.20,.23)+ribs*.15;}
 else if(material<9.5){float pat=fbm(tex*vec2(12.,18.));base=vec3(.41,.30,.20)*(.77+.4*pat);}
 else if(material<10.5){base=vec3(1.0,.51,.13)+vec3(.0,.22,.12)*sin(tick*.012+world.y*9.);}
 else if(material<11.5){base=mix(vec3(.30,.18,.16),vec3(.53,.38,.30),fbm(tex*17.));}
 else if(material<12.5){base=mix(vec3(.16,.13,.31),vec3(.38,.26,.56),fbm(tex*21.));}
 else if(material<13.5){base=mix(vec3(.29,.34,.39),vec3(.56,.62,.69),fbm(tex*12.));}
 else if(material<14.5){base=vec3(.77,.65,.34)*(0.68+.32*fbm(tex*14.));}
 else if(material<15.5){float veins=pow(noise(tex*vec2(22.,31.)),3.);base=mix(vec3(.055,.11,.14),vec3(.16,.54,.58),veins);}
 else if(material<16.5){float glow=.63+.37*sin(tick*.004+world.y*4.);base=vec3(.13,.58,.83)*glow;}
 else if(material<17.5){
 vec2 skin=world.xz*12.+vec2(world.y*4.,world.y*7.);
 float pores=fbm(skin*3.);float scar=1.-smoothstep(.02,.08,abs(noise(skin)-.49));
 base=mix(vec3(.13,.16,.15),vec3(.48,.41,.31),pores);
 base=mix(base,vec3(.23,.045,.055),scar*.34);
}
 else if(material<18.5){base=vec3(.08,.68,.78);}
 else if(material<19.5){float ripple=sin(26.*length(tex-vec2(.5)) - tick*.0025);float oil=fbm(tex*vec2(15.,18.)+vec2(tick*.00012,0.));base=mix(vec3(.008,.025,.034),vec3(.020,.090,.104),.33+.24*ripple+.29*oil);}
 else if(material<20.5){base=vec3(.62,.56,.35);}
 else if(material<21.5){float coagulated=fbm(tex*vec2(21.,7.));base=mix(vec3(.025,.004,.008),vec3(.24,.026,.018),coagulated*.72);}
 else {base=mix(vec3(.035,.025,.018),vec3(.16,.12,.075),fbm(tex*19.));}
 base*=1.-min(mortar,1.)*.55;float light=.115+max(0.,dot(normalize(normal),normalize(vec3(.4,.8,.3))))*.10;
 for(int i=0;i<5;i++){float d=distance(world,lightPos[i]);light+=1.55/(1.+d*d*3.0)*(0.84+0.16*sin(tick*.009+float(i)*2.));}
 // Floor-specific colored torch illumination and controlled tone mapping.
 if(floorId<1.5){base*=vec3(1.02,.94,.83);}else if(floorId<2.5){base*=vec3(.69,1.10,1.14);}else if(floorId<3.5){base*=vec3(.96,.78,1.18);}else{base*=vec3(1.20,.78,.68);}
 // Dread distorts perception but cannot modify collision or map data.
 float dreadPulse=0.5+0.5*sin(tick*.0018+world.x*.67+world.z*.73);
 base=mix(base,base*vec3(.70,.76,.98),dread*(.12+.24*dreadPulse));
 float dist=distance(world,eye);vec3 fog=atmosphere();float vignette=1.-.055*clamp(dist/11.,0.,1.);
 float fogMix=clamp(1.-exp(-max(0.,dist-2.0)*fogDensity()),0.,.88);
 vec3 color=mix(base*light*vignette,fog,fogMix);
 if(material>16.5&&material<17.5){
  float rim=pow(1.-abs(dot(normalize(normal),normalize(eye-world))),2.5);
  color+=vec3(.16,.12,.08)*rim*(1.-fogMix);
 }
 // Subtle distortions are confined to color: no geometry or compass manipulation.
 color=mix(color,color*vec3(.77,.89,1.13),dread*.28*(.50+.50*sin(tick*.003+world.y*4.)));
 if(floorId>1.5&&floorId<2.5&&material>0.5&&material<1.5){float glint=pow(max(0.,dot(normalize(normal),normalize(vec3(.20,.96,.14)))),14.);color+=vec3(.009,.033,.041)*glint*(.5+.5*eldritchPulse(world));}
 if(floorId>2.5&&floorId<3.5&&material<.5){float veins=pow(fbm(tex*vec2(28.,13.)),4.);color+=vec3(.045,.012,.08)*veins*eldritchPulse(world);}
 if(material>18.5&&material<19.5){float shine=pow(max(dot(normalize(normal),normalize(vec3(.2,.97,.15))),0.),22.);color+=vec3(.025,.08,.10)*shine*(.65+.35*sin(tick*.001+world.x*5.));}
 if(impact>0.){float distanceFade=clamp(1.-dist/8.,0.,1.);color=mix(color,vec3(.42,.075,.10),clamp(impact*.22*distanceFade,0.,.28));}
 color=color/(vec3(1.)+color*.35);color=pow(max(color,vec3(0.)),vec3(.93));
 if(material>9.5&&material<10.5)color=base*(1.1+.2*sin(tick*.013+world.y*11.));
 if(material>15.5&&material<16.5)color=base*(.85+.35*sin(tick*.004+world.x*8.));if(material>17.5&&material<18.5)color=base*(1.1+.18*sin(tick*.004));gl_FragColor=vec4(color,1.);}`;
 function compile(type,source){const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){const message=gl.getShaderInfoLog(sh)||'Shader compilation failed';gl.deleteShader?.(sh);throw Error(message);}return sh;}
 const program=gl.createProgram(),shaders=[];
 try{
  for(const [type,source] of [[gl.VERTEX_SHADER,vs],[gl.FRAGMENT_SHADER,fs]]){const shader=compile(type,source);shaders.push(shader);gl.attachShader(program,shader);}
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program)||'Shader program failed to link');
  gl.useProgram(program);
 }catch(error){gl.deleteProgram?.(program);gl.getExtension?.('WEBGL_lose_context')?.loseContext();throw error;}
 finally{for(const shader of shaders)gl.deleteShader?.(shader);}
 const attrs=['p','n','uv','mat'].map(n=>gl.getAttribLocation(program,n));const loc=n=>gl.getUniformLocation(program,n);const projLoc=loc('projection'),viewLoc=loc('view'),eyeLoc=loc('eye'),tickLoc=loc('tick'),floorLoc=loc('floorId'),lightsLoc=loc('lightPos[0]'),impactLoc=loc('impact'),dreadLoc=loc('dread');
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);const stride=9*4;attrs.forEach((a,i)=>{gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,[3,3,2,1][i],gl.FLOAT,false,stride,[0,3,6,8][i]*4);});
 gl.enable(gl.DEPTH_TEST); // Double-sided corridor surfaces.
 gl.disable(gl.CULL_FACE);
 gl.clearColor(.022,.033,.046,1);
 let staticFloor=0,staticData=[];const gateTransitions=new Map();let contextLost=false;
 const onContextLost=e=>{e.preventDefault?.();contextLost=true;};
 // Restored contexts have lost every program and buffer; let the controller rebuild safely.
 const onContextRestored=()=>{contextLost=true;};
 canvas.addEventListener?.('webglcontextlost',onContextLost);
 canvas.addEventListener?.('webglcontextrestored',onContextRestored);
 let disposed=false;
 function dispose(){
  if(disposed)return;disposed=true;contextLost=true;
  canvas.removeEventListener?.('webglcontextlost',onContextLost);
  canvas.removeEventListener?.('webglcontextrestored',onContextRestored);
  gl.deleteBuffer?.(buffer);gl.deleteProgram?.(program);
  gl.getExtension?.('WEBGL_lose_context')?.loseContext();
 }
 const put=(arr,p,n,uv,m)=>arr.push(...p,...n,...uv,m);
 function quad(arr,a,b,c,d,normal,mat=0){put(arr,a,normal,[0,0],mat);put(arr,b,normal,[1,0],mat);put(arr,c,normal,[1,1],mat);put(arr,a,normal,[0,0],mat);put(arr,c,normal,[1,1],mat);put(arr,d,normal,[0,1],mat);}
 function floorDisc(arr,x,y,z,rx,rz,mat,segments=12){
  const n=[0,1,0];
  for(let i=0;i<segments;i++){
   const a=i*Math.PI*2/segments,b=(i+1)*Math.PI*2/segments;
   const p=[x+Math.cos(a)*rx,y,z+Math.sin(a)*rz],q=[x+Math.cos(b)*rx,y,z+Math.sin(b)*rz];
   put(arr,[x,y,z],n,[.5,.5],mat);put(arr,p,n,[.5+.5*Math.cos(a),.5+.5*Math.sin(a)],mat);put(arr,q,n,[.5+.5*Math.cos(b),.5+.5*Math.sin(b)],mat);
  }
 }
 // Coordinates: X across map, Z down map, Y height. All normals face inward into traversable corridors.
 function wall(arr,x,z,side,m){let a,b,c,d,n;if(side===0){a=[x,0,z];b=[x,2,z];c=[x+1,2,z];d=[x+1,0,z];n=[0,0,1];}
 else if(side===1){a=[x+1,0,z+1];b=[x+1,2,z+1];c=[x,2,z+1];d=[x,0,z+1];n=[0,0,-1];}
 else if(side===2){a=[x,0,z+1];b=[x,2,z+1];c=[x,2,z];d=[x,0,z];n=[1,0,0];}
 else{a=[x+1,0,z];b=[x+1,2,z];c=[x+1,2,z+1];d=[x+1,0,z+1];n=[-1,0,0];}quad(arr,a,b,c,d,n,m);}
 // Wall-mounted architectural bays: cut lancet glass, clustered columns and depth-specific furnishings.
 function cathedralBay(out,x,z,side,f){
  const local=[];
  for(const u of [.055,.945]){
   box(local,u,.03,.035,.075,1.76,.075,8);
   for(const h of [.1,.35,1.35,1.68])box(local,u,h,.055,.12,.045,.11,14);
  }
  const path=[[.24,.45],[.24,1.18],[.27,1.38],[.34,1.56],[.5,1.83],[.66,1.56],[.73,1.38],[.76,1.18],[.76,.45]];
  for(let i=0;i<path.length-1;i++){
   const a=path[i],b=path[i+1],cx=.5,cy=1.05;
   const inner=p=>[cx+(p[0]-cx)*.86,cy+(p[1]-cy)*.91,.058];
   quad(local,[a[0],a[1],.06],[b[0],b[1],.06],inner(b),inner(a),[0,0,1],f===4?13:14);
   put(local,[cx,cy,.018],[0,0,1],[.5,.5],f===3?12:18);
   put(local,inner(a).map((v,j)=>j===2?.018:v),[0,0,1],[0,0],f===3?12:18);
   put(local,inner(b).map((v,j)=>j===2?.018:v),[0,0,1],[1,1],f===3?12:18);
  }
  box(local,.5,.48,.072,.028,1.13,.018,8);
  for(const h of [.72,1.02,1.29])box(local,.5,h,.072,.43,.025,.018,8);
  if(f===2){ // Books salvaged from a drowned scriptorium, all flush with the wall.
   for(const u of [.16,.84])for(let shelf=0;shelf<4;shelf++){
    box(local,u,.2+shelf*.3,.085,.13,.035,.14,9);
    for(let j=0;j<3;j++)box(local,u-.04+j*.04,.235+shelf*.3,.065,.025,.14+(j%2)*.06,.09,j%2?3:20);
   }
  }else if(f===4){
   for(const u of [.15,.85])for(let h=0;h<5;h++)ellipsoid(local,u,.3+h*.25,.09,.046,.058,.038,13,3,6);
  }else if(f===3){
   for(let j=0;j<12;j++){
    const a=j*Math.PI/6;box(local,.5+Math.cos(a)*.19,1.08+Math.sin(a)*.19,.088,.022,.033,.02,14);
   }
  }
  for(let i=0;i<local.length;i+=9){
   const u=local[i],h=local[i+1],v=local[i+2],nx=local[i+3],ny=local[i+4],nz=local[i+5];
   const point=side===0?[x+u,h,z+v]:side===1?[x+1-u,h,z+1-v]:side===2?[x+v,h,z+1-u]:[x+1-v,h,z+u];
   const normal=side===0?[nx,ny,nz]:side===1?[-nx,ny,-nz]:side===2?[nz,ny,-nx]:[-nz,ny,nx];
   out.push(...point,...normal,local[i+6],local[i+7],local[i+8]);
  }
 }
 function floorMesh(f){const out=[];for(let z=0;z<core.HEIGHT;z++)for(let x=0;x<core.WIDTH;x++){
 if(core.tile(x,z,f)==='#')continue;
 quad(out,[x,0,z+1],[x,0,z],[x+1,0,z],[x+1,0,z+1],[0,1,0],1);
 quad(out,[x,2,z],[x,2,z+1],[x+1,2,z+1],[x+1,2,z],[0,-1,0],2);
 for(const [i,dx,dz] of [[0,0,-1],[1,0,1],[2,-1,0],[3,1,0]]){if(core.tile(x+dx,z+dz,f)==='#'){wall(out,x,z,i,0);if((x+z)%2===0)cathedralBay(out,x,z,i,f);}}
 }
  // Thin pointed ribs replace the bulky floating lintels; the ceiling line stays readable.
  for(let z=1;z<core.HEIGHT-1;z++)for(let x=1;x<core.WIDTH-1;x++){
   if(core.tile(x,z,f)==='#')continue;
   if(core.tile(x-1,z,f)==='#'&&core.tile(x+1,z,f)==='#'){
    spire(out,x+.075,1.48,z+.5,.075,.45,8,7);
    spire(out,x+.925,1.48,z+.5,.075,.45,8,7);
   }else if(core.tile(x,z-1,f)==='#'&&core.tile(x,z+1,f)==='#'){
    spire(out,x+.5,1.48,z+.075,.075,.45,8,7);
    spire(out,x+.5,1.48,z+.925,.075,.45,8,7);
   }
  }
  // Architectural identity: bas-reliefs and buttresses positioned flush against existing walls.
  const carved=f===1?8:f===2?9:f===3?12:13;
  const metal=f===4?14:4;
  for(let z=1;z<core.HEIGHT-1;z++)for(let x=1;x<core.WIDTH-1;x++){
   if(core.tile(x,z,f)==='#')continue;
   const north=core.tile(x,z-1,f)==='#',south=core.tile(x,z+1,f)==='#';
   const west=core.tile(x-1,z,f)==='#',east=core.tile(x+1,z,f)==='#';
   if((x*11+z*7+f*3)%9!==0)continue;
   if(north||south){
    const face=north?z+.055:z+.945;
    box(out,x+.50,.35,face,.48,.98,.09,carved);
    box(out,x+.50,1.39,face,.57,.12,.12,metal);
    for(const dx of [-.15,.15])box(out,x+.5+dx,.56,face+(north?.045:-.045),.055,.56,.045,metal);
   }else if(west||east){
    const face=west?x+.055:x+.945;
    box(out,face,.35,z+.5,.09,.98,.48,carved);
    box(out,face,1.39,z+.5,.12,.12,.57,metal);
   }
  }
  return out;}
 function box(out,x,y,z,w,h,d,material){const x0=x-w/2,x1=x+w/2,y0=y,y1=y+h,z0=z-d/2,z1=z+d/2;
 quad(out,[x0,y0,z1],[x0,y1,z1],[x1,y1,z1],[x1,y0,z1],[0,0,1],material);
 quad(out,[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z0],[0,0,-1],material);
 quad(out,[x0,y0,z0],[x0,y1,z0],[x0,y1,z1],[x0,y0,z1],[-1,0,0],material);
 quad(out,[x1,y0,z1],[x1,y1,z1],[x1,y1,z0],[x1,y0,z0],[1,0,0],material);
 quad(out,[x0,y1,z1],[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[0,1,0],material);
 quad(out,[x0,y0,z0],[x0,y0,z1],[x1,y0,z1],[x1,y0,z0],[0,-1,0],material);}
 // Low-poly sculpting primitives: faceted rather than stacked cuboids.
 // Used for cultist masks, articulated weapons, boss shoulders and an altar per depth.
 function ellipsoid(out,x,y,z,rx,ry,rz,material,rings=5,sides=10){
  for(let i=0;i<rings;i++){
   const a0=-Math.PI/2+Math.PI*i/rings,a1=-Math.PI/2+Math.PI*(i+1)/rings;
   for(let j=0;j<sides;j++){
    const b0=Math.PI*2*j/sides,b1=Math.PI*2*(j+1)/sides;
    const pt=(a,b)=>[x+rx*Math.cos(a)*Math.cos(b),y+ry*Math.sin(a),z+rz*Math.cos(a)*Math.sin(b)];
    const p0=pt(a0,b0),p1=pt(a0,b1),p2=pt(a1,b1),p3=pt(a1,b0);
    const norm=q=>[(q[0]-x)/Math.max(rx,.001),(q[1]-y)/Math.max(ry,.001),(q[2]-z)/Math.max(rz,.001)];
    for(const [a,b,c] of [[p0,p1,p2],[p0,p2,p3]]){
     // Degenerate triangles at the poles are harmless, and not used for collision.
     put(out,a,norm(a),[0,0],material);put(out,b,norm(b),[1,0],material);put(out,c,norm(c),[1,1],material);
    }
   }
  }
 }
 function spire(out,x,y,z,r,height,material,sides=8){
  for(let i=0;i<sides;i++){
   const a=i*2*Math.PI/sides,b=(i+1)*2*Math.PI/sides;
   const p=[x+r*Math.cos(a),y,z+r*Math.sin(a)],q=[x+r*Math.cos(b),y,z+r*Math.sin(b)],tip=[x,y+height,z];
   const n=[Math.cos((a+b)/2),.2,Math.sin((a+b)/2)];
   put(out,p,n,[0,0],material);put(out,q,n,[1,0],material);put(out,tip,n,[.5,1],material);
  }
 }
 function sculptedAltar(out,x,z,f,t){
  const a=x+.5,b=z+.5,stone=f===1?8:f===2?9:f===3?12:13;
  // Compact floor-mounted silhouette; never blocks logical movement.
  box(out,a,.015,b,.60,.19,.55,stone);
  box(out,a,.20,b,.41,.36,.35,stone);
  ellipsoid(out,a,.62,b,.22,.11,.20,14,4,8);
  const pulse=.045*Math.sin(t*.0023+f);
  ellipsoid(out,a,.79+pulse,b,.105,.12,.105,16,5,10);
  for(const side of [-1,1])spire(out,a+side*.23,.24,b,.065,.34,4,8);
 }
 // Authored gothic relief: paired columns, crown and a faceted skull mask.
 // Decoration only; the dungeon engine remains the collision authority.
 function gothicRelief(out,x,z,f){
   const stone=f===1?8:f===2?9:f===3?12:13;
   const metal=f===4?14:4;
   const cx=x+.5,front=z+.14;
   box(out,cx,.18,front,.74,.10,.19,stone);
   for(const side of [-1,1]){
     const px=cx+side*.29;
     box(out,px,.24,front,.11,1.18,.14,stone);
     box(out,px,1.35,front,.19,.13,.19,metal);
     box(out,px,.20,front,.19,.13,.19,metal);
     spire(out,px,1.48,front,.11,.24,stone,8);
   }
   box(out,cx,1.43,front,.76,.12,.19,stone);
   ellipsoid(out,cx,1.02,front+.09,.19,.27,.12,13,7,12);
   for(const side of [-1,1]){
     ellipsoid(out,cx+side*.085,1.09,front+.19,.041,.055,.029,16,4,8);
     spire(out,cx+side*.14,1.28,front+.08,.05,.18,metal,6);
   }
   box(out,cx,.85,front+.21,.075,.12,.045,4);
   for(let i=0;i<5;i++)box(out,cx+(i-2)*.054,.76,front+.21,.037,.065,.038,13);
 }
 // v3.1 curated ritual gallery. It appears only in the read-only Art Lab;
 // physical game collision, map topology and RPG saves remain untouched.
 function gothicShowcase(out,s,time){
  if(!s.artShowcase)return;
  const f=core.DIRS[s.dir],side=[-f[1],f[0]];
  const target=(s.monsters||[])[0];
  if(!target)return;
  const center=[target.x+.5,target.y+.5];
  const point=(across,depth=0)=>[center[0]+side[0]*across+f[0]*depth,center[1]+side[1]*across+f[1]*depth];
  const tile=core.tile(target.x,target.y,s.floor);
  if(tile==='#')return;
  const stone=s.floor===1?8:s.floor===2?9:s.floor===3?12:13;
  const pulse=Math.sin(time*.002)*.055;
  // Low plinth and raised arches frame the monster from the player's viewpoint.
  for(const sign of [-1,1]){
   const [x,z]=point(sign*.43,.15);
   box(out,x,.04,z,.12,1.43,.12,stone);
   ellipsoid(out,x,1.43,z,.105,.13,.105,14,5,10);
   spire(out,x,1.51,z,.095,.30,stone,8);
   for(let k=0;k<3;k++){
    const y=.28+k*.36;
    ellipsoid(out,x,y,z,.11,.055,.11,14,3,8);
   }
  }
  const [topX,topZ]=point(0,.15);
  box(out,topX,1.78,topZ,.94,.12,.11,stone);
  for(let k=-3;k<=3;k++){
   const [x,z]=point(k*.115,.17);
   spire(out,x,1.9,z,.045,.13+(.06*(3-Math.abs(k))),14,6);
  }
  // Suspended glyphs remain thin and subtle rather than hiding the creature.
  for(let k=0;k<12;k++){
   const angle=k*Math.PI/6+time*.00035;
   const [x,z]=point(Math.cos(angle)*.30,-.06);
   const y=1.02+Math.sin(angle)*.21+pulse;
   box(out,x,y,z,.026,.046,.025,k%3===0?7:16);
  }
  // Shrine lights belong to the showcase only and are original geometry.
  for(const sign of [-1,1]){
   const [x,z]=point(sign*.39,-.28);
   box(out,x,.11,z,.12,.08,.12,4);
   ellipsoid(out,x,.25+pulse,z,.08,.15,.075,10,5,8);
  }
 }
 function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);}
 function look(eye,forward){const fx=forward[0],fz=forward[2],rx=-fz,rz=fx;return new Float32Array([rx,0,-fx,0,0,1,0,0,rz,0,-fz,0,-rx*eye[0]-rz*eye[2],-eye[1],fx*eye[0]+fz*eye[2],1]);}
 function renderWorld(s,t=0,effect=''){
  if(contextLost||gl.isContextLost?.())throw Error('WebGL context lost; switch to Canvas for recovery');
  if(staticFloor!==s.floor){staticData=floorMesh(s.floor);staticFloor=s.floor;}
  const scene=staticData.slice();const open=s.floor===3?s.labyrinthGateOpen:s.gateOpen;const currentTime=Number.isFinite(t)?t:0;
  for(let z=0;z<core.HEIGHT;z++)for(let x=0;x<core.WIDTH;x++){
   const tile=core.tile(x,z,s.floor);
   if(tile==='X'){
    box(scene,x+.5,0,z+.5,.85,1.89,.15,3);
    for(const dx of [-.36,.36])box(scene,x+.5+dx,0,z+.5,.075,1.89,.20,4);
    box(scene,x+.5,1.67,z+.5,.92,.20,.24,8);
   }
   if(core.gateAt(x,z,s.floor)){
    const key=s.floor+':'+x+':'+z;
    let tr=gateTransitions.get(key);
    if(!tr){tr={open,changed:currentTime};gateTransitions.set(key,tr);}
    if(tr.open!==open){tr.open=open;tr.changed=currentTime;}
    const p=open?Math.min(1,Math.max(0,(currentTime-tr.changed)/1000)):0;
    if(!open||p<1){
     const lift=p*1.95;
     box(scene,x+.5,1.89-lift,z+.5,.94,.18,.20,8);
     for(let k=0;k<7;k++)box(scene,x+.17+k*.11,-lift,z+.5,.055,1.95,.085,4);
     box(scene,x+.5,.12-lift,z+.5,.94,.13,.20,8);
    }
   }
  }
  // Library floor: localized oil-black puddles in dead-end spaces. Surface is
  // decorative and does not change navigability or simulation collision.
  if(s.floor===2){
   for(let z=1;z<core.HEIGHT-1;z++)for(let x=1;x<core.WIDTH-1;x++){
    if(core.tile(x,z,s.floor)==='#'||core.gateAt(x,z,s.floor))continue;
    if((x*7+z*13)%19!==0)continue;
    quad(scene,[x+.09,.014,z+.91],[x+.09,.014,z+.09],[x+.91,.014,z+.09],[x+.91,.014,z+.91],[0,1,0],19);
   }
  }
  // Floor-specific environmental storytelling, deliberately visible in the
  // walking lanes: blood in the crypt, violet script in the maze, bone dust below.
  if(s.floor===1){
   for(const [x,z,rx,rz] of [[3.15,1.52,.24,.11],[3.62,1.48,.16,.07],[4.08,1.56,.27,.10],[4.58,1.46,.13,.08]])floorDisc(scene,x,.018,z,rx,rz,21,10);
  }else if(s.floor===3){
   const pulse=.5+.5*Math.sin(currentTime*.0024);
   floorDisc(scene,3.5,.019,11.5,.40,.34,22,16);
   floorDisc(scene,3.5,.021,11.5,.31,.26,12,16);
   for(let i=0;i<6;i++){
    const a=i*Math.PI/3+currentTime*.0002;
    ellipsoid(scene,3.5+Math.cos(a)*.37,.035+pulse*.025,11.5+Math.sin(a)*.30,.035,.018,.035,16,3,6);
   }
  }else if(s.floor===4){
   for(const [x,z,angle] of [[3.4,1.5,.2],[6.5,5.4,-.4],[9.5,9.5,.7],[5.4,12.4,-.2],[10.4,11.5,.5]]){
    if(core.tile(Math.floor(x),Math.floor(z),s.floor)==='#')continue;
    ellipsoid(scene,x,.04,z,.20,.045,.055,22,4,8);
    box(scene,x+Math.cos(angle)*.13,.045,z+Math.sin(angle)*.13,.055,.055,.055,14);
   }
  }
  // Phase II boss sigils pulse on the floor; prepared attacks burn carmine.
  for(const m of s.monsters){if(m.hp<=0||(m.floor||1)!==s.floor||!m.phaseAwakened)continue;
   const pulse=.5+.5*Math.sin(currentTime*.006),r=.30+.08*pulse,mat=m.telegraph?21:19;
   floorDisc(scene,m.x+.5,.025,m.y+.5,r,r,mat,20);
   floorDisc(scene,m.x+.5,.028,m.y+.5,r*.68,r*.68,mat,16);
  }
  // Distinct procedural creature silhouettes. Animation is purely visual: engine rules unchanged.
  const hitFlash=effect&&/attack|hit|spell|frost|pulse|ward/i.test(String(effect));
  const dreadIntensity=Math.max(0,Math.min(1,(65-(Number.isFinite(s.sanity)?s.sanity:100))/65));
  for(const m of s.monsters){
   // Cosmic Library models are presentation only; the simulation retains its canonical monster kinds.
   const cosmicMesh=(s.floor===2&&m.cosmicType&&root.DungeonGLB)?root.DungeonGLB.getModel(m.cosmicType):null;
   if(m.hp>0&&(m.floor||1)===s.floor&&cosmicMesh){
    root.DungeonGLB.appendMesh(scene,cosmicMesh,m.x+.5,m.y+.5,[m.x-s.x,m.y-s.y],
      {time:t,kind:m.cosmicType,frozen:m.frozen>0,attack:!!hitFlash&&Math.abs(s.x-m.x)+Math.abs(s.y-m.y)<=2,
       impact:/hurt|damage/i.test(String(effect))&&Math.abs(s.x-m.x)+Math.abs(s.y-m.y)<=2});
    continue;
   }
   if(root.DungeonGLB&&root.DungeonGLB.getModel(m.kind)&&['warden','crawler','specter'].includes(m.kind)){
    if(m.hp<=0||(m.floor||1)!==s.floor)continue;
    const face=[m.x-s.x,m.y-s.y];
    // Imported asset is already authored in local Y-up coordinates.
    root.DungeonGLB.appendMesh(scene,root.DungeonGLB.getModel(m.kind),m.x+.5,m.y+.5,face,
      {time:t,kind:m.kind,frozen:m.frozen>0,attack:!!hitFlash&&Math.abs(s.x-m.x)+Math.abs(s.y-m.y)<=2,
       impact:/hurt|damage/i.test(String(effect))&&Math.abs(s.x-m.x)+Math.abs(s.y-m.y)<=2});
    continue;
   }
   if(m.hp<=0||(m.floor||1)!==s.floor)continue;
   const x=m.x+.5,z=m.y+.5,phase=t*.004+(m.x*7+m.y*3),bob=Math.sin(phase)*.045;
   const boss=['warden','king','archivist','firstname'].includes(m.kind);
   const cosmicRoamer=['starseer','chorus','cartographer','voidmoth'].includes(m.kind);
   const scale=boss?1.18:cosmicRoamer?1.08:1;
   const frozen=m.frozen>0;
   const torso=frozen?7:(m.kind==='specter'?12:m.kind==='crawler'?11:m.kind==='archivist'?12:m.kind==='firstname'?14:5);
   const armor=frozen?7:(boss?13:8);
   const strike=hitFlash?Math.max(0,Math.sin((t%220)/220*Math.PI)):.0;
   const swing=Math.sin(phase*1.6)*.13+strike*.28;
   // Weapon wind-up and recoil vary by silhouette; these are visual-only poses.
   const lunge=hitFlash?Math.sin((t%220)/220*Math.PI)*.23:0;
   const claw=Math.max(0,Math.sin(phase*2.4))*0.16;
   const spectral=0.07*Math.sin(phase*1.35);
   const breathe=1+.035*Math.sin(phase*.85);
   if(m.kind==='starseer'){
    // A blind astronomer: suspended torso, broken astrolabe and an orbit of eyes.
    ellipsoid(scene,x,.83+bob,z,.23,.38,.20,12,6,9);
    ellipsoid(scene,x,1.31+bob,z,.19,.18,.17,8,5,9);
    for(let i=0;i<6;i++){
     const a=phase*.28+i*Math.PI/3,ox=Math.cos(a)*.37,oz=Math.sin(a)*.32;
     ellipsoid(scene,x+ox,1.20+bob+Math.sin(a*2)*.10,z+oz,.055,.07,.05,i%2?16:6,4,7);
    }
    for(const side of [-1,1])for(let k=0;k<3;k++)
     spire(scene,x+side*(.23+k*.055),.63+bob,z+(k-1)*.12,.045,.48+claw,14,6);
    ellipsoid(scene,x,1.72+bob,z,.12,.025,.12,16,3,10);
   }else if(m.kind==='chorus'){
    // Three mouths sharing one drowned body; the central jaw opens on its pulse.
    ellipsoid(scene,x,.67+bob,z,.34,.48,.29,15,6,10);
    for(let i=0;i<3;i++){
     const hx=x+(i-1)*.20,hy=1.22+bob+(i===1?.12:0);
     ellipsoid(scene,hx,hy,z+.08,.15,.17,.13,i===1?11:15,5,8);
     ellipsoid(scene,hx,hy-.025,z+.205,.07,.035,.025,6,4,8);
     for(const side of [-1,1])ellipsoid(scene,hx+side*.07,hy+.035,z+.205,.022,.026,.018,18,3,6);
    }
    for(let k=0;k<5;k++){
     const a=phase*.5+k*Math.PI*2/5;
     ellipsoid(scene,x+Math.cos(a)*.40,.40+bob+Math.sin(phase+k)*.12,z+Math.sin(a)*.35,.055,.20,.055,15,4,7);
    }
   }else if(m.kind==='cartographer'){
    // A jointed, too-tall figure with map strips orbiting its exposed spine.
    ellipsoid(scene,x,.79+bob,z,.20,.57,.16,17,7,8);
    ellipsoid(scene,x,1.50+bob,z,.15,.22,.14,12,5,8);
    for(const side of [-1,1]){
     spire(scene,x+side*.28,.59+bob,z,.045,.77+swing,12,7);
     ellipsoid(scene,x+side*.32,1.06+bob+swing*side,z,.07,.08,.06,6,4,7);
    }
    for(let k=0;k<4;k++){
     const a=phase*.2+k*Math.PI/2;
     box(scene,x+Math.cos(a)*.32,1.0+bob+Math.sin(a)*.27,z+Math.sin(a)*.28,.045,.50,.035,k%2?16:14);
    }
    ellipsoid(scene,x,1.50+bob,z+.13,.035,.10,.03,6,4,7);
   }else if(m.kind==='voidmoth'){
    // A pale thorax and two vast, slowly beating wings covered in false eyes.
    const beat=Math.sin(phase*1.35)*.12;
    ellipsoid(scene,x,.84+bob,z,.22,.38,.18,13,6,9);
    ellipsoid(scene,x,1.28+bob,z+.12,.15,.14,.13,8,5,8);
    for(const side of [-1,1]){
     ellipsoid(scene,x+side*(.43+beat),1.12+bob,z,.30,.14,.12,13,6,10);
     spire(scene,x+side*(.64+beat),1.05+bob,z,.18,.23,13,7);
     for(let k=0;k<3;k++)ellipsoid(scene,x+side*(.38+k*.17+beat),1.13+bob,z+.115,.038,.045,.025,k===1?6:10,3,7);
     for(let k=0;k<3;k++)spire(scene,x+side*(.12+k*.12),.20+bob,z-.10-k*.08,.035,.32,13,6);
    }
    ellipsoid(scene,x,1.30+bob,z+.23,.035,.035,.025,18,4,7);
   }else if(m.kind==='crawler'){
    // Low insectoid body, six moving legs, jaw, spikes and luminescent eyes.
    box(scene,x,.20+bob,z+lunge*.3,.70*breathe,.29,.63*breathe,torso);
    box(scene,x,.45+bob,z+.25,.48,.26,.39,11);
    for(const sx of [-1,1])for(let k=0;k<3;k++){
      const dz=(k-1)*.23,step=Math.sin(phase*2+k*2+sx)*.085;
      box(scene,x+sx*.42,.12+bob+step,z+dz,.27,.13,.10,armor);
      box(scene,x+sx*.57,.02+bob+step,z+dz+claw*.25,.10,.24,.13,armor);
    }
    for(const sx of [-1,1]){
     box(scene,x+sx*.13,.55+bob,z+.43,.09,.075,.05,6);
     box(scene,x+sx*.12,.18+bob,z+.48,.10,.20,.09,14);
    }
    for(let k=0;k<4;k++)box(scene,x,.51+bob,z-.30+k*.18,.15,.11,.085,armor);
    // Segmented tail and forward raking mandibles.
    for(let k=0;k<3;k++)box(scene,x,.17+bob+Math.sin(phase+k)*.045,z-.43-k*.15,.18-k*.028,.14,.13,torso);
    for(const side of [-1,1])box(scene,x+side*.19,.19+bob+strike*.17,z+.47+strike*.26,.085,.08,.30,14);
   }else if(m.kind==='specter'||m.kind==='acolyte'||m.kind==='monk'){
    // Floating cultists: draped mantle, narrow glowing eyes, articulated sleeves.
    const hover=.19+Math.sin(phase*1.4)*.10+spectral;
    box(scene,x,hover,z,.49,.91,.41,torso);
    for(const sx of [-1,1]){
      box(scene,x+sx*.22,hover+.15,z,.22,.70,.39,12);
      box(scene,x+sx*.39,hover+.54+swing*sx,z+.12+lunge,.17,.48,.22,torso);
      box(scene,x+sx*.10,hover+1.15,z+.23,.069,.058,.046,7);
      box(scene,x+sx*.25,hover+.10,z,.12,.33,.15,torso);
    }
    box(scene,x,hover+.89,z,.38,.34,.35,12);
    box(scene,x,hover+1.20,z-.08,.44,.17,.37,torso);
    box(scene,x,hover+1.37,z-.02,.24,.13,.24,armor);
    // Layered spectral robes and crest mask.
    for(let k=0;k<3;k++)box(scene,x,hover+.03+k*.17,z-.04,.56-k*.06,.10,.47,torso);
    box(scene,x,hover+1.18,z+.22,.29,.12,.065,armor);
    for(const side of [-1,1])box(scene,x+side*.16,hover+1.20,z+.27,.055,.07,.042,7);
   }else if(!cosmicRoamer){
    // Animated armored figures. Bosses add crowns, horns, shield and rune weapon.
    box(scene,x,.09+bob,z,.56*scale,.94*scale,.42*scale,torso);
    box(scene,x,.90*scale+bob,z,.71*scale,.22,.51,armor);
    box(scene,x,1.06*scale+bob,z,.38,.30,.33,armor);
    box(scene,x,1.33*scale+bob,z,.46,.12,.36,8);
    for(const sx of [-1,1]){
      box(scene,x+sx*.40,.57+bob+swing*sx,z,.22,.69,.27,armor);
      box(scene,x+sx*.18,.06+bob,z,.22,.42,.29,torso);
      box(scene,x+sx*.10,1.17*scale+bob,z+.19,.07,.055,.035,7);
      if(boss)box(scene,x+sx*.29,1.43*scale+bob,z,.11,.28,.14,14);
    }
    if(boss){
      box(scene,x,1.45*scale+bob,z,.76,.11,.42,armor);
      box(scene,x+.52-lunge*.4,.26+bob+swing,z+.07+lunge,.11,1.17,.12,m.kind==='archivist'?7:14);
      box(scene,x-.50,.52+bob-swing,z+.14,.15,.67,.55,armor);
    }
    if(m.kind==='archivist')for(const sx of [-1,1])box(scene,x+sx*.40,1.57+bob,z,.17,.16,.17,7);
    if(m.kind==='firstname')box(scene,x,1.82+bob,z,.24,.26,.21,6);
    // Articulated vambraces, shoulder sigils and ceremonial waist plate.
    for(const side of [-1,1]){
      box(scene,x+side*.40,.78+bob+swing*side,z+.02,.26,.16,.33,13);
      if(boss)box(scene,x+side*.42,.93+bob,z+.14,.22,.10,.10,14);
    }
    box(scene,x,.38+bob,z+.24,.42,.20,.10,armor);
   }
   // Sculpted silhouettes distinguish undead, insects and bosses at a glance.
   if(m.kind==='crawler'){
     ellipsoid(scene,x,.31+bob,z,.36,.21,.43,11,5,10);
     ellipsoid(scene,x,.42+bob,z+.38,.24,.17,.25,5,5,10);
     for(const side of [-1,1]){
       spire(scene,x+side*.23,.49+bob,z+.29,.075,.23,14,7);
       ellipsoid(scene,x+side*.11,.48+bob,z+.56,.06,.075,.055,6,4,8);
     }
   }else if(m.kind==='specter'||m.kind==='acolyte'||m.kind==='monk'){
     ellipsoid(scene,x,1.35+bob,z,.26,.32,.23,12,5,10);
     // Hollow mask, bright narrow eyes and tapered hood crest.
     ellipsoid(scene,x,1.34+bob,z+.21,.16,.17,.045,8,4,8);
     for(const side of [-1,1])ellipsoid(scene,x+side*.105,1.38+bob,z+.267,.035,.043,.025,7,4,8);
     spire(scene,x,1.57+bob,z,.16,.32,12,8);
   }else if(!cosmicRoamer){
     ellipsoid(scene,x,1.19*scale+bob,z,.27,.25,.25,armor,5,10);
     for(const side of [-1,1])ellipsoid(scene,x+side*.39,.96+bob,z,.22,.15,.29,armor,4,8);
     if(boss){
       spire(scene,x-.24,1.45+bob,z,.11,.37,14,8);
       spire(scene,x+.24,1.45+bob,z,.11,.37,14,8);
       ellipsoid(scene,x,1.48+bob,z+.22,.20,.13,.09,8,4,8);
       for(const side of [-1,1])ellipsoid(scene,x+side*.11,1.49+bob,z+.305,.035,.035,.02,7,4,8);
     }
   }
   // Readable signature silhouettes for named horrors. The procedural forms
   // remain lightweight and require no external models or texture downloads.
   if(m.kind==='king'){
     // The Bibliotecario: a rotating crown of broken quills around a wet, eyeless face.
     for(let i=0;i<7;i++){
       const a=phase*.22+i*Math.PI*2/7;
       spire(scene,x+Math.cos(a)*.37,1.48+bob,z+Math.sin(a)*.30,.07,.42+(i%2)*.12,14,7);
       ellipsoid(scene,x+Math.cos(a)*.37,1.31+bob,z+Math.sin(a)*.30,.045,.06,.045,6,4,7);
     }
     ellipsoid(scene,x,1.22+bob,z+.285,.15,.12,.035,18,5,10);
   }else if(m.kind==='archivist'){
     // The Archivista: too many watching eyes embedded in its floating hood.
     for(let i=0;i<5;i++){
       const px=x+(i-2)*.105;
       ellipsoid(scene,px,1.39+bob,z+.29,.034,.045,.026,i===2?6:7,4,7);
     }
     for(const side of [-1,1])for(let k=0;k<3;k++){
       const a=phase*.18+k*2.1+side;
       spire(scene,x+side*(.39+.05*Math.sin(a)),1.22+bob+k*.12,z+Math.sin(a)*.22,.035,.28,12,6);
     }
   }else if(m.kind==='firstname'){
     // The First Name: a fractured halo and orbiting embers make the final boss
     // visually distinct even through the fourth floor's red fog.
     const ring=.5+.035*Math.sin(phase*1.8);
     for(let i=0;i<10;i++){
       const a=phase*.32+i*Math.PI*2/10;
       const px=x+Math.cos(a)*ring,pz=z+Math.sin(a)*ring*.72;
       spire(scene,px,1.77+bob+Math.sin(a*3)*.06,pz,.045,.23+(i%3)*.04,10,6);
       if(i%2===0)ellipsoid(scene,px,1.63+bob,pz,.045,.045,.045,6,4,7);
     }
     for(let i=0;i<3;i++){
       const a=-phase*.7+i*Math.PI*2/3;
       ellipsoid(scene,x+Math.cos(a)*.68,1.03+bob+Math.sin(phase+i)*.10,z+Math.sin(a)*.48,.055,.07,.055,10,4,7);
     }
   }else if(m.kind==='warden'){
     // The Confesor/Guardian: a nailed iron halo and a mask with a split jaw.
     for(let i=0;i<6;i++){
       const a=i*Math.PI/3;
       spire(scene,x+Math.cos(a)*.31,1.43+bob,z+Math.sin(a)*.25,.05,.24,14,6);
     }
     box(scene,x,1.12+bob,z+.285,.22,.045,.04,6);
   }
   // Three readable animations by class: claw arcs, ghostly hexes and heavy boss impacts.
   // Dynamic particles are deliberately short and positioned by world coordinates;
   // the game's AI, hitboxes, health and turn timings remain unchanged.
   if(hitFlash){
     const crest=Math.sin((t%220)/220*Math.PI);
     if(m.kind==='crawler'){
       for(const side of [-1,1])for(let k=0;k<3;k++)
         box(scene,x+side*(.16+k*.09),.28+crest*.33,z+.60+crest*.27,.045,.10+k*.035,.055,14);
     }else if(m.kind==='specter'||m.kind==='acolyte'||m.kind==='monk'){
       for(let k=0;k<8;k++){
         const a=k*Math.PI/4+phase*.75;
         box(scene,x+Math.cos(a)*(.28+crest*.25),.83+Math.sin(a*2)*.17,z+.32+Math.sin(a)*(.15+crest*.21),.045,.075,.045,7);
       }
   }else if(m.kind==='starseer'){
     for(let i=0;i<8;i++){const a=phase*.24+i*Math.PI/4;spire(scene,x+Math.cos(a)*.38,1.55+bob,z+Math.sin(a)*.28,.045,.34,14,6);}
   }else if(m.kind==='chorus'){
     for(let i=0;i<3;i++)ellipsoid(scene,x+(i-1)*.20,1.22+bob+(i===1?.12:0),z+.22,.045,.025,.02,6,3,6);
   }else if(m.kind==='cartographer'){
     for(let i=0;i<5;i++){const a=phase*.18+i*Math.PI*2/5;ellipsoid(scene,x+Math.cos(a)*.47,1.05+bob,z+Math.sin(a)*.36,.045,.055,.04,6,4,6);}
   }else if(m.kind==='voidmoth'){
     for(const side of [-1,1])for(let i=0;i<4;i++)ellipsoid(scene,x+side*(.28+i*.12),1.12+bob,z+.13,.035,.045,.02,i%2?6:18,3,6);
   }else if(!cosmicRoamer){
       for(let k=0;k<5;k++){
         const a=k*2.4+phase;
         box(scene,x+Math.sin(a)*(.25+crest*.50),.28+crest*.38,z+.53+Math.cos(a)*.14,.065,.085,.055,boss?6:14);
       }
     }
   }
   if(m.telegraph){
     const pulse=.04*Math.sin(phase*5);
     ellipsoid(scene,x,1.92+bob,z,.38+pulse,.035,.29+pulse, m.kind==='chorus'?16:m.kind==='voidmoth'?14:6,4,16);
     for(let i=0;i<4;i++){const a=phase*1.8+i*Math.PI/2;ellipsoid(scene,x+Math.cos(a)*.42,1.91+bob,z+Math.sin(a)*.32,.045,.05,.045,18,3,6);}
   }
   box(scene,x,.008,z,boss?.86:.67,.017,boss?.69:.58,2);
   // Animated halo for bosses, icy line for frozen enemies.
   if(boss||frozen){const h=frozen?7:14;const pulse=.04*Math.sin(phase*2);
     for(const sx of [-1,1])box(scene,x+sx*(.40+pulse),1.44+bob,z,.055,.12,.055,h);
   }
  }
  // A false figure watches from the end of the corridor during the opening
  // turns, then returns only when the expedition's sanity is badly damaged.
  // It is presentation-only: no enemy state, combat, collision or save data.
  const apparitionPulse=Math.sin(currentTime*.00115+s.floor*2.1+s.turn*.63);
  if(s.turn<=3||dreadIntensity>.34||apparitionPulse>.985){
   const f=core.DIRS[s.dir];let apparition=null;
   for(let distance=5;distance>=3;distance--){
    const gx=s.x+f[0]*distance, gz=s.y+f[1]*distance;
    if(core.tile(gx,gz,s.floor)==='#'||core.gateAt(gx,gz,s.floor)&&!open||
       (s.monsters||[]).some(m=>m.hp>0&&(m.floor||1)===s.floor&&m.x===gx&&m.y===gz))continue;
    let clear=true;
    for(let step=1;step<distance;step++){
     const tx=s.x+f[0]*step,tz=s.y+f[1]*step;
     if(core.tile(tx,tz,s.floor)==='#'||core.gateAt(tx,tz,s.floor)&&!open){clear=false;break;}
    }
    if(clear){apparition=[gx+.5,gz+.5,distance];break;}
   }
   if(apparition){
    const [gx,gz,distance]=apparition,scale=1.12-(distance-3)*.11;
    const sway=Math.sin(currentTime*.002+s.floor)*.10;
    const faceX=s.x+.5-gx,faceZ=s.y+.5-gz,faceLength=Math.max(.001,Math.hypot(faceX,faceZ));
    const nx=faceX/faceLength,nz=faceZ/faceLength,sx=-nz,sz=nx;
    const robe=s.floor===2?15:s.floor===3?12:s.floor===4?13:11;
    const eyes=s.floor===2?18:s.floor===4?10:6;
    // A narrow, unnaturally tall shroud with a split lower edge.
    ellipsoid(scene,gx+sway,.96,gz,.30*scale,.58*scale,.22*scale,robe,7,10);
    ellipsoid(scene,gx-sway,1.62*scale,gz,.19*scale,.22*scale,.17*scale,robe,6,10);
    for(let i=0;i<5;i++){
     const side=i-2,px=gx+sx*side*.115*scale;
     const height=(i%2===0?.46:.27)*scale;
     spire(scene,px,.16,gz+sz*side*.035,.045*scale,height,robe,6);
    }
    // The two lights are placed on the camera-facing side of the mask.
    for(const side of [-1,1]){
     ellipsoid(scene,gx+nx*.16*scale+sx*side*.075*scale,1.69*scale,
       gz+nz*.16*scale+sz*side*.075*scale,.035*scale,.028*scale,.024*scale,eyes,4,7);
    }
    const pulse=.5+.5*Math.sin(currentTime*.009+s.floor);
    ellipsoid(scene,gx,.035,gz,.24*scale,.018,.20*scale,21,4,12);
    for(let i=0;i<3;i++){
     const a=currentTime*.0008+i*Math.PI*2/3;
     ellipsoid(scene,gx+Math.cos(a)*(.33+pulse*.07),.46+pulse*.16,
       gz+Math.sin(a)*.22,.022,.035,.022,eyes,3,6);
    }
   }
  }
  // v4.4: Close-range threat cues are purely presentational: the RPG engine
  // remains authoritative for movement, attack timing, damage and targeting.
  // Cues pulse near creatures on the player's current floor, with a different
  // silhouette for armored bosses and roaming creatures.
  const nearbyThreats=(s.monsters||[]).filter(m=>m.hp>0&&(m.floor||1)===s.floor&&
    Math.abs(m.x-s.x)+Math.abs(m.y-s.y)<=2);
  for(const m of nearbyThreats.slice(0,5)){
    const x=m.x+.5,z=m.y+.5;
    const boss=['warden','king','archivist','firstname'].includes(m.kind);
    const pulse=.5+.5*Math.sin(currentTime*(boss?.007:.004)+m.x*3+m.y);
    const radius=(boss?.53:.33)+pulse*.07;
    const material=boss?16:14;
    for(let i=0;i<(boss?12:8);i++){
      const theta=i*2*Math.PI/(boss?12:8);
      const px=x+Math.cos(theta)*radius,pz=z+Math.sin(theta)*radius;
      // Never write to the map or change monster state: a visual warning only.
      box(scene,px,.018+pulse*.021,pz,.035,.022,.035,material);
    }
    if(boss){
      for(let i=0;i<3;i++){
        const a=i*2*Math.PI/3+currentTime*.001;
        ellipsoid(scene,x+Math.cos(a)*.37,1.20+.12*Math.sin(currentTime*.003+i),
          z+Math.sin(a)*.37,.054,.095,.054,16,4,7);
      }
    }
  }
  // Flooded-library ritual visuals respond to the recorded, irreversible
  // choice. This does not touch narrative logic, rewards, saves or collisions.
  if(s.floor===2&&['seal','listen'].includes(s.drownedRitual)){
    const altarX=3.5,altarZ=11.5;
    const sealed=s.drownedRitual==='seal';
    const material=sealed?7:16;
    const breathe=.5+.5*Math.sin(currentTime*.0023);
    for(let i=0;i<16;i++){
      const a=i*Math.PI/8+currentTime*(sealed?.00025:-.00045);
      const r=.39+breathe*.10;
      const px=altarX+Math.cos(a)*r,pz=altarZ+Math.sin(a)*r;
      if(core.tile(Math.floor(px),Math.floor(pz),s.floor)==='#')continue;
      box(scene,px,.18+.05*Math.sin(a*2+currentTime*.002),pz,.047,.075,.047,material);
    }
    if(!sealed){
      for(let i=0;i<5;i++){
        const a=i*2*Math.PI/5+currentTime*.0006;
        ellipsoid(scene,altarX+Math.cos(a)*.28,.64+.08*Math.sin(currentTime*.003+i),
          altarZ+Math.sin(a)*.28,.045,.060,.045,16,4,7);
      }
    }
  }
  gothicShowcase(scene,s,currentTime);
  // First-person weapon and attack effects at the near plane, timed to the engine's combat cue.
  if(hitFlash){
    const sw=Math.sin((t%220)/220*Math.PI);const f=core.DIRS[s.dir];
    const sx=s.x+.5+f[0]*.58,sz=s.y+.5+f[1]*.58;
    box(scene,sx,.58+sw*.42,sz,.12,.76,.12,14);
    box(scene,sx,.96+sw*.42,sz,.56,.065,.09,13);
  }
  // First-person spell trajectories: frost, arcane pulse and protective sanctuary.
  // These have no effect on damage or collision calculation.
  const cue=String(effect||'').toLowerCase();
  const casting=/spell|frost|pulse|ward|sanctuary|heal/.test(cue);
  if(casting){
    const d=core.DIRS[s.dir],side=[-d[1],d[0]];
    const prog=(currentTime%700)/700;
    const cold=/frost/.test(cue),guard=/ward|sanctuary|heal/.test(cue);
    const mat= cold?7:guard?14:16;
    for(let k=0;k<12;k++){
      const u=k/12,advance=.45+(prog+u*.55)*1.7;
      const spread=(.10+.18*u)*Math.sin(u*18+currentTime*.015);
      const px=s.x+.5+d[0]*advance+side[0]*spread;
      const pz=s.y+.5+d[1]*advance+side[1]*spread;
      const py=.75+.18*Math.sin(u*16+currentTime*.009);
      if(core.tile(Math.floor(px),Math.floor(pz),s.floor)==='#')continue;
      box(scene,px,py,pz,.035+.045*(1-u),.045+.065*(1-u),.04,mat);
    }
    if(guard){
      for(let k=0;k<14;k++){
        const a=k*Math.PI/7+currentTime*.003;
        box(scene,s.x+.5+Math.sin(a)*.44,.45+(k%5)*.22,s.y+.5+Math.cos(a)*.44,.06,.07,.06,14);
      }
    }
  }
  for(let z=1;z<core.HEIGHT-1;z++)for(let x=1;x<core.WIDTH-1;x++){
   if(core.tile(x,z,s.floor)==='#'||(x*17+z*23)%31!==0)continue;
   box(scene,x+.17,0,z+.17,.16,1.75,.16,0);
   box(scene,x+.17,1.68,z+.17,.29,.17,.29,4);
  }
  // A shrine vignette per floor: deliberately away from the player start,
  // positioned only when the central tile and its immediate neighbours are walkable.
  let altarCount=0;
  for(let z=2;z<core.HEIGHT-2&&altarCount<1;z++)for(let x=2;x<core.WIDTH-2&&altarCount<1;x++){
   if((x*7+z*13+s.floor*5)%17!==0)continue;
   if(core.tile(x,z,s.floor)==='#'||core.tile(x-1,z,s.floor)==='#'||core.tile(x+1,z,s.floor)==='#')continue;
   if(core.gateAt(x,z,s.floor)||core.tile(x,z,s.floor)==='X')continue;
   sculptedAltar(scene,x,z,s.floor,currentTime);altarCount++;
  }
  // One sculpted wall memorial per depth, on a cell with a wall to the north.
  // Kept out of the player's collision logic: gallery and game render identically.
  let reliefCount=0;
  for(let z=2;z<core.HEIGHT-2&&reliefCount<1;z++)for(let x=2;x<core.WIDTH-2&&reliefCount<1;x++){
   if(core.tile(x,z,s.floor)==='#'||core.tile(x,z-1,s.floor)!=='#')continue;
   if(core.gateAt(x,z,s.floor)||core.tile(x,z,s.floor)==='X')continue;
   if((x*11+z*7+s.floor*5)%9!==0)continue;
   gothicRelief(scene,x,z,s.floor);reliefCount++;
  }
  for(const pos of s.items||[]){const [x,z]=String(pos).split(',').map(Number);if(Number.isFinite(x)&&Number.isFinite(z))box(scene,x+.5,.04,z+.5,.20,.26,.20,6);}
  const dir=core.DIRS[s.dir],eye=[s.x+.5,1.0,s.y+.5],forward=[dir[0],0,dir[1]];
  const lightCandidates=[];
  for(let z=1;z<core.HEIGHT-1;z++)for(let x=1;x<core.WIDTH-1;x++){
   if(core.tile(x,z,s.floor)==='#'||core.tile(x,z,s.floor)==='X'||core.gateAt(x,z,s.floor)||(x*13+z*7)%11!==0)continue;
   const walls=[
    {wx:0,wz:-1,mx:x+.5,mz:z+.08,fx:x+.5,fz:z+.19},
    {wx:0,wz:1,mx:x+.5,mz:z+.92,fx:x+.5,fz:z+.81},
    {wx:-1,wz:0,mx:x+.08,mz:z+.5,fx:x+.19,fz:z+.5},
    {wx:1,wz:0,mx:x+.92,mz:z+.5,fx:x+.81,fz:z+.5}
   ].filter(w=>core.tile(x+w.wx,z+w.wz,s.floor)==='#');
   if(!walls.length)continue;
   walls.sort((a,b)=>Math.hypot(a.fx-eye[0],a.fz-eye[2])-Math.hypot(b.fx-eye[0],b.fz-eye[2]));
   const w=walls[0];lightCandidates.push([w.fx,1.58,w.fz,w.mx,w.mz]);
  }
  lightCandidates.sort((a,b)=>Math.hypot(a[0]-eye[0],a[2]-eye[2])-Math.hypot(b[0]-eye[0],b[2]-eye[2]));const lights=lightCandidates.slice(0,5);while(lights.length<5)lights.push([100,100,100]);
  for(const [x,y,z,mx,mz] of lights){if(x===100)continue;
   const flicker=Math.sin(currentTime*.011+x*3+z*2)*.075;
   box(scene,mx,1.34,mz,.12,.34,.12,8); // wall-mounted iron bracket
   box(scene,x,1.48,z,.20,.14,.18,9); // battered brazier, clear of the corridor center
   ellipsoid(scene,x,1.68+flicker,z,.075,.17,.07,10,5,8);
   ellipsoid(scene,x,1.91+flicker,z,.035,.10,.035,6,4,7);
   for(let k=0;k<3;k++)ellipsoid(scene,x+(k-1)*.07,1.65+flicker-k*.08,z,.016,.025,.016,14,3,6);
  }
  // Premium visual pass: deterministic, camera-local particles and runic memorial stones.
  // Static pseudo-random seeds avoid flickering and keep the draw calls reproducible.
  const visibleMotes=28;
  for(let i=0;i<visibleMotes;i++){
   const theta=i*2.399963229728653,rad=.35+(i%11)*.41;
   const mx=eye[0]+Math.cos(theta)*rad,mz=eye[2]+Math.sin(theta)*rad;
   const ix=Math.floor(mx),iz=Math.floor(mz);
   if(core.tile(ix,iz,s.floor)==='#')continue;
   const drift=Math.sin(currentTime*.00045+i*1.7)*.075;
   const my=.20+((i*7)%17)/17*1.48+drift;
   box(scene,mx,my,mz,.018,.022,.018,i%7===0?16:14);
  }
  // Dread apparitions: non-interactive floating eyes that vanish with recovered sanity.
  // Only populate walkable cells; never add monsters, alter collision, or affect save data.
  if(dreadIntensity>.15){
   const count=Math.min(8,Math.floor(dreadIntensity*9));
   for(let i=0;i<count;i++){
    const a=i*2.399963229728653+currentTime*.00006;
    const r=1.4+(i%4)*.85;
    const px=eye[0]+Math.cos(a)*r,pz=eye[2]+Math.sin(a)*r;
    if(core.tile(Math.floor(px),Math.floor(pz),s.floor)==='#')continue;
    const py=1.0+.23*Math.sin(currentTime*.0015+i);
    ellipsoid(scene,px,py,pz,.085,.036,.028,16,5,8);
    ellipsoid(scene,px,py,pz+.033,.028,.025,.014,7,4,7);
   }
  }
  // Ancient lit rune stones: one at most per chosen open cell; purely decorative.
  for(let z=2;z<core.HEIGHT-2;z++)for(let x=2;x<core.WIDTH-2;x++){
   if((x*19+z*11+s.floor*13)%47!==0||core.tile(x,z,s.floor)==='#')continue;
   const wallN=core.tile(x,z-1,s.floor)==='#';
   const wallS=core.tile(x,z+1,s.floor)==='#';
   if(!wallN&&!wallS)continue;
   const face=wallN?z+.06:z+.94;
   box(scene,x+.5,.64,face,.30,.48,.07,15);
   box(scene,x+.5,.78,face+(wallN?.048:-.048),.045,.28,.025,16);
   box(scene,x+.5,.90,face+(wallN?.048:-.048),.19,.035,.025,16);
  }
  gl.viewport(0,0,canvas.width,canvas.height);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);
  gl.uniformMatrix4fv(projLoc,false,perspective(Math.PI/2.85,canvas.width/canvas.height,.06,40));gl.uniformMatrix4fv(viewLoc,false,look(eye,forward));
  gl.uniform3fv(eyeLoc,eye);gl.uniform1f(tickLoc,t);gl.uniform1f(floorLoc,s.floor);gl.uniform3fv(lightsLoc,new Float32Array(lights.flatMap(light=>light.slice(0,3))));
  gl.uniform1f(impactLoc,/attack|hit|hurt|damage|boss/i.test(String(effect||'')) ? Math.max(0,Math.sin((currentTime%500)/500*Math.PI)) : 0);
  gl.uniform1f(dreadLoc,dreadIntensity);
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(scene),gl.DYNAMIC_DRAW);gl.drawArrays(gl.TRIANGLES,0,scene.length/9);
  const error=gl.getError?.();if(error&&error!==gl.NO_ERROR)throw Error(`WebGL draw error: 0x${error.toString(16)}`);
 }
 return {renderWorld,dispose,renderMap:mapRenderer.renderMap,backend:'WebGL 3D — La Catedral de la Marea',diagnostics:{cathedralBays:true,depthFurnishings:true,floorAtmospheres:true,blackWater:true,cinematicImpact:true,tonemapping:true,dreadVisuals:true,dreadApparitions:true,openingApparition:true,wallMountedTorches:true,scarredStone:true,bloodTrail:true,boneDebris:true,pointedRibs:true,threatTelegraphs:true,ritualVisualState:true,wetStone:true,arcaneVeins:true,shaderLinked:true,materials:23,creatureAnimation:true,shaderCompiled:true,drawChecked:true,architecturalReliefs:true,combatMotion:true,ambientMotes:true,runicReliefs:true,creatureAttackProfiles:true,cosmicCreaturePose:true,spellTrajectories:true,sculptedCreatures:true,facetedShrine:true,gothicRelief:true,artLabReady:true,gothicShowcase:true,ritualGallery:true,glbStudio:true}};
}
root.Dungeon3DRenderer={createRenderer};
})(typeof globalThis!=='undefined'?globalThis:this);
