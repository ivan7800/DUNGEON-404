/* DUNGEON 404 v3.3 - read-only visual art laboratory */
(()=>{'use strict';
const core=window.DungeonEngine, canvasHolder=document.querySelector('#scene'), status=document.querySelector('#status');
let state=core.createGame(),renderer,active='canvas',failure='',last=0,attackUntil=0,animationEnabled=true;
const $=id=>document.getElementById(id);
function resetFloor(){state=core.createGame();state.floor=Number($('floor').value);state.x=1;state.y=1;state.dir=1;
 // Move the showcase camera to a known, traversable tile on each floor.
 let best=null;
 for(let y=1;y<core.HEIGHT-1;y++)for(let x=1;x<core.WIDTH-1;x++){
  if(core.tile(x,y,state.floor)==='#'||core.gateAt(x,y,state.floor))continue;
  for(let dir=0;dir<4;dir++){
   const [dx,dy]=core.DIRS[dir];let length=0;
   while(length<9&&core.tile(x+dx*(length+1),y+dy*(length+1),state.floor)!=='#'&&!core.gateAt(x+dx*(length+1),y+dy*(length+1),state.floor))length++;
   const score=length*5-Math.abs(x-7)*.13-Math.abs(y-7)*.13;
   if(!best||score>best.score)best={x,y,dir,score};
  }
 }
 if(best){state.x=best.x;state.y=best.y;state.dir=best.dir;}

 state.artShowcase=$('showcase').checked;state.studioGlb=$('glb').checked;state.monsters=[];placeCreature();
}
function placeCreature(){
 state.monsters=[];
 const kind=$('creature').value;
 if(kind==='none')return;
 const [dx,dy]=core.DIRS[state.dir];
 // Only place the model in a traversable tile. Never edit the engine or a saved campaign.
 let target=null;
 for(let d=2;d>=1;d--){const x=state.x+dx*d,y=state.y+dy*d;
  if(core.tile(x,y,state.floor)!=='#'&&!core.gateAt(x,y,state.floor)&&core.tile(x,y,state.floor)!=='X'){target={x,y};break;}}
 if(!target)return;
 const names={crawler:'Carroñero',specter:'Espectro',warden:'Guardián del Umbral',drowned:'Ahogado del Umbral',tideborn:'Larva de la Marea Negra',librarian:'Bibliotecario de las Mil Lenguas',archivist:'Archivista Vacío',firstname:'El Primer Nombre'};
 state.monsters=[{...target,floor:state.floor,hp:999,max:999,name:names[kind],damage:0,kind}];
}
function start(){const old=$('scene'),canvas=document.createElement('canvas');canvas.id='scene';canvas.width=960;canvas.height=600;old.replaceWith(canvas);
 const requested=$('mode').value;failure='';
 try{renderer=(requested==='canvas'?window.DungeonRenderer:window.Dungeon3DRenderer).createRenderer(canvas,$('map'),core);
   active=String(renderer.backend||'').includes('WebGL')?'webgl':'canvas';
   if(requested==='webgl'&&active==='canvas')failure='No se pudo crear WebGL. Se utiliza Canvas 2.5D.';
 }catch(error){failure='Error WebGL: '+String(error.message||error);renderer=window.DungeonRenderer.createRenderer(canvas,$('map'),core);active='canvas';}
 updateStatus();
}
function updateStatus(){
 const kind=$('creature').value;
 $('status').textContent='Motor ACTIVO: '+(renderer.backend||active)+' · Profundidad '+state.floor+' · Casilla '+state.x+','+state.y+' · Galería: '+(state.artShowcase?'activa':'desactivada')+' · GLB: '+(state.studioGlb?'seleccionado':'desactivado')+' · Animación: '+(animationEnabled?'activa':'pausada')+' · Bestiario: '+(kind==='none'?'sin criatura':kind)+(failure?'\n'+failure:'');
}
function step(action){const dir=core.DIRS[state.dir],left=[dir[1],-dir[0]];
 if(action==='left')state.dir=(state.dir+3)%4;
 else if(action==='right')state.dir=(state.dir+1)%4;
 else{const move=action==='forward'?dir:action==='back'?dir.map(v=>-v):action==='strafeLeft'?left:left.map(v=>-v);
 const x=state.x+move[0],y=state.y+move[1];if(core.tile(x,y,state.floor)!=='#'&&!core.gateAt(x,y,state.floor)&&core.tile(x,y,state.floor)!=='X'){state.x=x;state.y=y;}}
 placeCreature();updateStatus();
}
function frame(t){try{const visualTime=animationEnabled?t:0;renderer.renderWorld(state,visualTime,animationEnabled&&t<attackUntil?'attack':'');last=t;}catch(error){failure='Fallo durante el render: '+String(error.message||error);$('mode').value='canvas';start();}requestAnimationFrame(frame);}
async function refreshGLB(){
 state.studioGlb=$('glb').checked;
 if(state.studioGlb){
  if(!['warden','crawler','specter','drowned','tideborn','librarian'].includes($('creature').value))$('creature').value='warden';
  try{const n=await window.DungeonGLB.loadCreature($('creature').value);failure='GLB '+$('creature').value+' cargado: '+n+' triángulos.';}
  catch(err){failure='GLB no disponible: '+err.message;state.studioGlb=false;$('glb').checked=false;}
 }
 placeCreature();updateStatus();
}
$('glb').addEventListener('change',refreshGLB);
$('animate').addEventListener('change',()=>{animationEnabled=$('animate').checked;updateStatus();});
$('showcase').addEventListener('change',()=>{state.artShowcase=$('showcase').checked;updateStatus();});
$('creature').addEventListener('change',()=>{if(!['warden','crawler','specter','drowned','tideborn','librarian'].includes($('creature').value)){state.studioGlb=false;$('glb').checked=false;placeCreature();updateStatus();}else if(state.studioGlb){refreshGLB();}else{placeCreature();updateStatus();}});$('attack').addEventListener('click',()=>{attackUntil=performance.now()+550;});
$('floor').addEventListener('change',()=>{resetFloor();start();});$('mode').addEventListener('change',start);$('reset').addEventListener('click',()=>{resetFloor();start();});
document.querySelectorAll('[data-move]').forEach(b=>b.addEventListener('click',()=>step(b.dataset.move)));
document.addEventListener('keydown',e=>{if(['SELECT','INPUT','BUTTON'].includes(document.activeElement?.tagName))return;
 const m={w:'forward',s:'back',a:'left',d:'right',q:'strafeLeft',e:'strafeRight'}[e.key.toLowerCase()];if(m){e.preventDefault();step(m);}});
$('snapshot').addEventListener('click',()=>{try{const a=document.createElement('a');a.download='dungeon404-v39-planta-'+state.floor+'-'+active+'.png';a.href=$('scene').toDataURL('image/png');a.click();}catch(error){$('status').textContent='No se pudo exportar PNG: '+error.message;}});
resetFloor();start();requestAnimationFrame(frame);
})();
