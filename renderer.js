/* DUNGEON 404 v1.2 — offline Canvas 2.5D renderer, original procedural textures. */
(function(root, factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.DungeonRenderer=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const TAU=Math.PI*2;
const TORCHES=[
  {x:2.45,y:1.28},{x:5.56,y:3.36},{x:7.48,y:5.55},{x:2.52,y:7.48},
  {x:5.45,y:9.38},{x:4.53,y:11.55},{x:8.52,y:13.35},{x:11.53,y:13.57}
];
function noise(seed){let v=seed|0;return ()=>{v^=v<<13;v^=v>>>17;v^=v<<5;return (v>>>0)/4294967296;};}
function texture(type,cathedral=false,depth=1){
  const c=document.createElement('canvas');c.width=c.height=128;
  const x=c.getContext('2d'),rand=noise(type==='door'?2929:type==='moss'?4188:type==='crypt'?8161:type==='abyss'?11659:1447);
  x.fillStyle=type==='door'?'#242326':type==='moss'?'#282f2d':type==='crypt'?'#332d3e':type==='abyss'?'#203e3b':'#343b3e';x.fillRect(0,0,128,128);
  for(let row=0;row<8;row++){
    const stagger=(row%2)*21;
    for(let col=-1;col<5;col++){
      const px=col*42-stagger,py=row*16;
      const v=rand()*18;
      x.fillStyle=type==='door'?`rgb(${36+v},${37+v},${43+v})`:
        type==='moss'?`rgb(${32+v},${41+v},${38+v})`:type==='crypt'?`rgb(${52+v},${44+v},${61+v})`:type==='abyss'?`rgb(${27+v},${57+v},${55+v})`:`rgb(${53+v},${60+v},${61+v})`;
      x.fillRect(px+1,py+1,40,14);
      x.fillStyle='rgba(0,0,0,.35)';x.fillRect(px+1,py+14,40,2);
      x.fillStyle='rgba(202,190,156,.13)';x.fillRect(px+2,py+1,36,1);
    }
  }
  for(let i=0;i<1100;i++){
    const x0=rand()*128,y0=rand()*128;
    x.fillStyle=rand()>.6?'rgba(204,193,163,.07)':'rgba(5,11,14,.15)';
    x.fillRect(x0,y0,1+rand()*4,1+rand()*3);
  }
  for(let i=0;i<17;i++){
    x.strokeStyle='rgba(9,11,10,.3)';x.lineWidth=.7+rand();
    const px=rand()*128,py=rand()*128;
    x.beginPath();x.moveTo(px,py);x.lineTo(px+rand()*12-6,py+rand()*15);x.stroke();
  }
  if(type==='moss'){
    for(let i=0;i<110;i++){
      x.fillStyle='rgba(75,104,67,.27)';x.fillRect(rand()*128,rand()*128,rand()*12,rand()*5);
    }
  }
  if(type==='door'){
    x.fillStyle='#171d20';x.fillRect(9,7,9,114);x.fillRect(110,7,9,114);
    x.fillStyle='#554f44';x.fillRect(17,8,2,113);x.fillRect(109,8,2,113);
    x.strokeStyle='#8a7459';x.lineWidth=2;
    x.beginPath();x.arc(64,64,28,0,TAU);x.stroke();
    x.strokeStyle='#a06649';x.beginPath();x.arc(64,64,20,0,TAU);x.stroke();
    x.fillStyle='#c29259';x.font='bold 27px Georgia';x.textAlign='center';x.fillText('◈',64,75);
    x.strokeStyle='rgba(213,146,84,.7)';
    for(let i=0;i<8;i++){const a=i*TAU/8;x.beginPath();x.moveTo(64+32*Math.cos(a),64+32*Math.sin(a));x.lineTo(64+38*Math.cos(a),64+38*Math.sin(a));x.stroke();}
  }
  if(cathedral){
    // Original lancet tracery and fluted columns, painted into the raycaster's wall atlas.
    x.fillStyle='#091d22';x.beginPath();x.moveTo(34,108);x.lineTo(34,57);x.quadraticCurveTo(34,35,64,13);x.quadraticCurveTo(94,35,94,57);x.lineTo(94,108);x.closePath();x.fill();
    const glow=x.createLinearGradient(34,0,94,128);glow.addColorStop(0,depth===3?'#6e5795':'#348e8a');glow.addColorStop(1,'#15343f');x.fillStyle=glow;x.fill();
    x.strokeStyle='#a99b72';x.lineWidth=3;x.stroke();
    x.strokeStyle='#1b2929';x.lineWidth=3;x.beginPath();x.moveTo(64,17);x.lineTo(64,108);x.moveTo(35,66);x.lineTo(93,66);x.moveTo(35,87);x.lineTo(93,87);x.stroke();
    x.strokeStyle='#8f987f';x.lineWidth=2;x.beginPath();x.arc(64,53,13,0,TAU);x.stroke();
    if(depth===2){
      for(const px of [18,100])for(let shelf=0;shelf<4;shelf++){
        x.fillStyle='#7e7760';x.fillRect(px,37+shelf*20,10,2);
        for(let j=0;j<3;j++){x.fillStyle=j%2?'#716951':'#40595b';x.fillRect(px+j*3,25+shelf*20,2,12);}
      }
    }
    if(depth===4){
      x.fillStyle='#b7b396';for(const px of [21,107])for(let h=0;h<4;h++){x.beginPath();x.ellipse(px,37+h*21,5,6,0,0,TAU);x.fill();x.fillStyle='#182c2e';x.fillRect(px-3,36+h*21,2,2);x.fillRect(px+1,36+h*21,2,2);x.fillStyle='#b7b396';}
    }
    for(const px of [9,115]){x.fillStyle='#46534c';x.fillRect(px,4,5,121);x.fillStyle='#aca17b';for(const py of [12,32,102,119])x.fillRect(px-3,py,11,3);}
  }
  return c;
}
function createRenderer(canvas,mapCanvas,core){
  const ctx=canvas.getContext('2d',{alpha:false}),mc=mapCanvas.getContext('2d');
  const mats={stone:texture('stone'),moss:texture('moss'),door:texture('door'),crypt:texture('crypt'),abyss:texture('abyss')};
  const bays={1:texture('stone',true),2:texture('abyss',true,2),3:texture('crypt',true,3),4:texture('crypt',true,4)};
  const creatureArt={};
  if(typeof Image!=='undefined')for(const kind of ['lurker','crawler','warden','specter','king','archivist','firstname','starseer','chorus','cartographer','voidmoth']){
    const image=new Image();image.src='assets/art/creature-'+kind+'.svg';creatureArt[kind]=image;
  }
  const W=canvas.width,H=canvas.height;
  const FOV=Math.PI/2.85;
  const depths=new Float32Array(W);
  // Transient visual-only gate animation; collision logic remains authoritative in engine.js.
  // Loading an opened gate starts in its final state instead of replaying the animation.
  const gateVisual=new Map();
  function gateLift(floor,isOpen,time){
    if(!isOpen){gateVisual.set(floor,{opened:false,started:0});return 0;}
    const record=gateVisual.get(floor);
    if(!record){gateVisual.set(floor,{opened:true,started:-100000});return 1;}
    if(!record.opened){record.opened=true;record.started=time;}
    return Math.min(1,Math.max(0,(time-record.started)/850));
  }
  function backdrop(t){
    let g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#070c14');g.addColorStop(.37,'#121a20');
    g.addColorStop(.49,'#263039');g.addColorStop(.5,'#27221c');
    g.addColorStop(.84,'#0d1011');g.addColorStop(1,'#07090b');
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='rgba(142,132,106,.14)';ctx.lineWidth=1;
    const horizon=H*.5;
    for(let i=1;i<=13;i++){
      const delta=(H*.52)*(1-1/(i*.32+1));
      let y=horizon+delta;
      ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();
    }
    for(let i=-6;i<=6;i++){
      ctx.beginPath();ctx.moveTo(W/2+i*10,horizon);ctx.lineTo(W/2+i*170,H);ctx.stroke();
    }
    const centerGlow=ctx.createRadialGradient(W/2,H*.49,0,W/2,H*.49,W*.48);
    centerGlow.addColorStop(0,'rgba(193,124,70,.10)');centerGlow.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=centerGlow;ctx.fillRect(0,0,W,H);
  }
  function camera(s){return {x:s.x+.5,y:s.y+.5,ang:s.dir*Math.PI/2-Math.PI/2};}
  function castRay(s,cam,rayAng,visualGate){
    const rx=Math.cos(rayAng),ry=Math.sin(rayAng);
    let mapX=Math.floor(cam.x),mapY=Math.floor(cam.y),side=0;
    const deltaX=rx===0?Infinity:Math.abs(1/rx);
    const deltaY=ry===0?Infinity:Math.abs(1/ry);
    const stepX=rx<0?-1:1,stepY=ry<0?-1:1;
    let sideX=(rx<0?cam.x-mapX:mapX+1-cam.x)*deltaX;
    let sideY=(ry<0?cam.y-mapY:mapY+1-cam.y)*deltaY;
    let n=0;
    while(n++<32){
      if(sideX<sideY){sideX+=deltaX;mapX+=stepX;side=0;}
      else{sideY+=deltaY;mapY+=stepY;side=1;}
      if(core.wallAt(mapX,mapY,s.floor,s)||(visualGate&&core.gateAt(mapX,mapY,s.floor)))break;
    }
    const dist=Math.max(.04,side===0?sideX-deltaX:sideY-deltaY);
    const hit=side===0?cam.y+dist*ry:cam.x+dist*rx;
    let tx=((hit-Math.floor(hit))*128)|0;
    if((side===0&&rx>0)||(side===1&&ry<0))tx=127-tx;
    return {dist,tx,side,mapX,mapY};
  }
  function project(cam,x,y){
    const dx=x-cam.x,dy=y-cam.y;
    let ang=Math.atan2(dy,dx)-cam.ang;
    ang=Math.atan2(Math.sin(ang),Math.cos(ang));
    const dist=Math.hypot(dx,dy),corrected=dist*Math.cos(ang);
    return {ang,dist,corrected,x:W/2+Math.tan(ang)/Math.tan(FOV/2)*W/2};
  }
  function spriteVisible(p){
    if(p.corrected<=0||Math.abs(p.ang)>FOV*.67)return false;
    const sample=Math.max(0,Math.min(W-1,Math.round(p.x)));
    return p.corrected<=depths[sample]+.14;
  }
  function enemySprite(m,cam,t){
    const p=project(cam,m.x+.5,m.y+.5);
    if(!spriteVisible(p))return;
    const art=creatureArt[m.kind];
    if(art?.complete&&art.naturalWidth){
      const size=Math.min(H*.94,H*.70/Math.max(.4,p.corrected));
      const x=p.x-size*.4,y=H*.52-size*.64+Math.sin(t*.002+m.x)*2;
      ctx.save();ctx.fillStyle='rgba(0,5,10,.7)';ctx.beginPath();ctx.ellipse(p.x,y+size*.92,size*.34,size*.075,0,0,TAU);ctx.fill();
      if(m.frozen){ctx.globalAlpha=.75;ctx.shadowColor='#a5e4ea';ctx.shadowBlur=12;}
      ctx.drawImage(art,x,y,size*.8,size);
      ctx.globalAlpha=1;
      if(m.telegraph){ctx.strokeStyle='#f0aa9d';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,y+size*.25,size*.2,0,TAU);ctx.stroke();}
      ctx.fillStyle='#071316';ctx.fillRect(p.x-size*.24,y-9,size*.48,4);ctx.fillStyle=m.telegraph?'#e09583':'#a0b99b';ctx.fillRect(p.x-size*.24,y-9,size*.48*m.hp/m.max,4);ctx.restore();return;
    }
    const scale=Math.min(2.2,1/Math.max(.25,p.corrected));
    const size=H*.73*scale;
    const bob=Math.sin(t*.002+m.x*4)*4*scale;
    const cx=p.x,cy=H*.5+size*.24+bob;
    ctx.save();ctx.translate(cx,cy);ctx.scale(size/170,size/170);
    const guardian=m.kind==='warden'||m.kind==='king'||m.kind==='archivist',crawler=m.kind==='crawler';
    const cosmic=['starseer','chorus','cartographer','voidmoth'].includes(m.kind);
    let body=m.kind==='starseer'?'#26203f':m.kind==='chorus'?'#25464b':m.kind==='cartographer'?'#44304c':m.kind==='voidmoth'?'#4d3a52':m.kind==='archivist'?'#244c49':m.kind==='king'?'#30283f':m.kind==='specter'?'#38566c':guardian?'#453840':crawler?'#364540':'#344a47';
    let trim=cosmic?(m.kind==='starseer'?'#c5a4ff':m.kind==='chorus'?'#70e2ce':m.kind==='cartographer'?'#ee8a9e':'#e7d69c'):m.kind==='archivist'?'#7bcbbb':m.kind==='king'?'#a59bbd':guardian?'#927167':'#738075';
    ctx.fillStyle='rgba(3,3,8,.65)';ctx.beginPath();ctx.ellipse(0,6,66,16,0,0,TAU);ctx.fill();
    if(crawler){
      ctx.strokeStyle='#141c19';ctx.lineWidth=14;ctx.lineCap='round';
      for(const sg of [-1,1])for(let i=0;i<3;i++){
        ctx.beginPath();ctx.moveTo(sg*24,-43+i*13);ctx.lineTo(sg*(63+i*5),-55+i*10);ctx.lineTo(sg*(80+i*3),-12+i*8);ctx.stroke();
      }
    } else {
      ctx.fillStyle='#181d21';ctx.beginPath();ctx.moveTo(-32,-64);ctx.lineTo(-54,0);ctx.lineTo(-25,-8);ctx.lineTo(25,-8);ctx.lineTo(56,0);ctx.lineTo(33,-64);ctx.fill();
      ctx.strokeStyle='#1b2025';ctx.lineWidth=16;ctx.beginPath();ctx.moveTo(-28,-68);ctx.lineTo(-47,-24);ctx.moveTo(28,-68);ctx.lineTo(48,-23);ctx.stroke();
    }
    ctx.fillStyle=body;ctx.beginPath();ctx.moveTo(-35,-118);ctx.lineTo(-44,-50);ctx.lineTo(-36,-6);ctx.lineTo(36,-6);ctx.lineTo(44,-50);ctx.lineTo(35,-118);ctx.closePath();ctx.fill();
    ctx.fillStyle=trim;ctx.beginPath();ctx.moveTo(-29,-118);ctx.lineTo(0,-91);ctx.lineTo(30,-118);ctx.lineTo(19,-129);ctx.lineTo(-19,-129);ctx.fill();
    ctx.fillStyle='#171c20';ctx.beginPath();ctx.ellipse(0,-127,30,38,0,0,TAU);ctx.fill();
    if(cosmic){
      ctx.strokeStyle=trim;ctx.lineWidth=5;ctx.shadowColor=trim;ctx.shadowBlur=18;
      if(m.kind==='voidmoth'){
        for(const sg of [-1,1]){ctx.beginPath();ctx.ellipse(sg*54,-91,42,22,sg*.35,0,TAU);ctx.fillStyle='rgba(120,87,134,.68)';ctx.fill();ctx.stroke();for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(sg*(38+i*13),-92,4,0,TAU);ctx.fillStyle='#f4dca1';ctx.fill();}}
      }else if(m.kind==='chorus'){
        for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse((i-1)*22,-153,12,15,0,0,TAU);ctx.fillStyle='#171c20';ctx.fill();ctx.stroke();ctx.fillStyle='#ffb39e';ctx.fillRect((i-1)*22-5,-150,10,3);}
      }else if(m.kind==='cartographer'){
        for(let i=0;i<4;i++){ctx.save();ctx.translate(0,-112);ctx.rotate(t*.0003+i*Math.PI/2);ctx.strokeRect(-3,-65,6,45);ctx.restore();}
      }else{
        for(let i=0;i<7;i++){const a=t*.00025+i*TAU/7;ctx.beginPath();ctx.arc(Math.cos(a)*47,-154+Math.sin(a)*18,7,0,TAU);ctx.stroke();ctx.fillStyle='#d8c8ff';ctx.fill();}
      }
      ctx.shadowBlur=0;
    }else if(guardian){
      ctx.fillStyle='#60565b';ctx.beginPath();ctx.moveTo(-27,-149);ctx.lineTo(-34,-179);ctx.lineTo(-10,-160);ctx.lineTo(0,-169);ctx.lineTo(15,-159);ctx.lineTo(32,-181);ctx.lineTo(26,-144);ctx.fill();
      ctx.strokeStyle='#9e8378';ctx.lineWidth=3;ctx.strokeRect(-14,-73,28,28);
      ctx.fillStyle='#b87c54';ctx.font='23px Georgia';ctx.textAlign='center';ctx.fillText('◇',0,-50);
    }else{
      ctx.fillStyle=body;ctx.beginPath();ctx.moveTo(-28,-151);ctx.lineTo(-20,-167);ctx.lineTo(-5,-159);ctx.lineTo(10,-162);ctx.lineTo(25,-169);ctx.lineTo(30,-143);ctx.fill();
    }
    let eye=m.kind==='starseer'?'#dccaff':m.kind==='chorus'?'#75ffe3':m.kind==='cartographer'?'#ff819f':m.kind==='voidmoth'?'#f4dca1':m.kind==='archivist'?'#59f5cd':m.kind==='king'?'#ba9cff':m.kind==='specter'?'#93daef':guardian?'#eb9c62':crawler?'#c6e1a0':'#d4bb7e';
    ctx.shadowColor=eye;ctx.shadowBlur=16;ctx.fillStyle=eye;
    ctx.beginPath();ctx.ellipse(-10,-129,6,3,0,0,TAU);ctx.ellipse(10,-129,6,3,0,0,TAU);ctx.fill();ctx.shadowBlur=0;
    ctx.strokeStyle='rgba(168,174,165,.5)';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(-14,-96);ctx.lineTo(-4,-83);ctx.lineTo(0,-95);ctx.lineTo(6,-82);ctx.stroke();
    if(m.kind==='archivist'){
      ctx.strokeStyle='rgba(88,231,191,.58)';ctx.lineWidth=2.4;
      for(let j=0;j<5;j++){const a=j*TAU/5+t*.00055;ctx.beginPath();ctx.arc(Math.cos(a)*66,-100+Math.sin(a)*24,7,0,TAU);ctx.stroke();}
    }
    if(m.telegraph){
      ctx.strokeStyle=eye;ctx.lineWidth=4;ctx.shadowColor=eye;ctx.shadowBlur=22;
      ctx.beginPath();ctx.ellipse(0,-189,48+Math.sin(t*.012)*5,13,0,0,TAU);ctx.stroke();
      for(let i=0;i<4;i++){const a=t*.004+i*TAU/4;ctx.beginPath();ctx.arc(Math.cos(a)*53,-189+Math.sin(a)*11,4,0,TAU);ctx.fillStyle=eye;ctx.fill();}
      ctx.shadowBlur=0;
    }
    if(m.frozen>0){ctx.strokeStyle='#a3e8ff';ctx.lineWidth=5;ctx.shadowColor='#a4eafa';ctx.shadowBlur=15;ctx.strokeRect(-42,-170,84,170);ctx.shadowBlur=0;}
    ctx.restore();
    const barW=Math.max(27,Math.min(108,size*.42));
    const top=cy-size*.99;
    if(top>0){
      ctx.fillStyle='#07080bdd';ctx.fillRect(cx-barW/2-2,top-2,barW+4,8);
      ctx.fillStyle='#713b3b';ctx.fillRect(cx-barW/2,top,barW,4);
      ctx.fillStyle=guardian?'#cb8f69':'#a47f66';ctx.fillRect(cx-barW/2,top,barW*m.hp/m.max,4);
    }
  }
  function bottleSprite(pos,cam,kind,t){
    const p=project(cam,pos.x+.5,pos.y+.5);
    if(!spriteVisible(p))return;
    const height=Math.min(125,60/Math.max(.3,p.corrected)),cx=p.x,cy=H*.57+height*.9;
    ctx.save();ctx.translate(cx,cy);ctx.scale(height/80,height/80);
    ctx.shadowColor=kind==='key'?'#efb16e':kind==='rune'?'#bda8ed':kind==='gear'?'#dfbc72':'#a23f42';ctx.shadowBlur=18;
    if(kind==='key'){
      ctx.strokeStyle='#e2bf80';ctx.lineWidth=8;ctx.beginPath();ctx.arc(-5,-35,13,0,TAU);ctx.moveTo(5,-29);ctx.lineTo(25,-8);ctx.lineTo(25,-18);ctx.moveTo(18,-14);ctx.lineTo(18,-24);ctx.stroke();
    }else if(kind==='rune'||kind==='gear'){
      ctx.fillStyle=kind==='rune'?'#c9abff':'#e1bf73';ctx.font='bold 57px Georgia';ctx.textAlign='center';ctx.fillText(kind==='rune'?'✥':'⚔',0,-3);
    }else{
      ctx.fillStyle='#802b3b';ctx.fillRect(-13,-35,26,34);ctx.fillStyle='#c66f68';ctx.fillRect(-9,-28,18,21);ctx.fillStyle='#aaa395';ctx.fillRect(-8,-44,16,10);
    }
    ctx.restore();
  }
  function torchSprite(pos,cam,t){
    const p=project(cam,pos.x,pos.y);
    if(!spriteVisible(p))return;
    const h=Math.min(225,170/Math.max(.38,p.corrected));
    const y=H*.5-h*.12,x=p.x;
    const glow=ctx.createRadialGradient(x,y,0,x,y,h*.8);
    glow.addColorStop(0,'rgba(253,153,65,.19)');glow.addColorStop(1,'rgba(253,153,65,0)');
    ctx.fillStyle=glow;ctx.fillRect(x-h,y-h,h*2,h*2);
    ctx.save();ctx.translate(x,y);
    ctx.strokeStyle='#51453d';ctx.lineWidth=Math.max(2,h*.065);
    ctx.beginPath();ctx.moveTo(-h*.12,-h*.05);ctx.lineTo(0,h*.18);ctx.stroke();
    const flame=h*(.32+Math.sin(t*.008+pos.x*4)*.045);
    ctx.shadowBlur=17;ctx.shadowColor='#f1913b';ctx.fillStyle='#a94622';
    ctx.beginPath();ctx.moveTo(-h*.085,-h*.04);ctx.quadraticCurveTo(-h*.15,-h*.16,0,-flame);ctx.quadraticCurveTo(h*.15,-h*.13,h*.07,-h*.04);ctx.closePath();ctx.fill();
    ctx.fillStyle='#f9b85e';ctx.beginPath();ctx.moveTo(-h*.05,-h*.04);ctx.quadraticCurveTo(-h*.08,-h*.16,0,-flame*.75);ctx.quadraticCurveTo(h*.09,-h*.1,h*.05,-h*.04);ctx.fill();
    ctx.restore();
  }
  function renderWorld(s,time=0,effect=''){
    const cam=camera(s);backdrop(time);
    const open=s.floor===3?s.labyrinthGateOpen:s.gateOpen;
    const gateProgress=gateLift(s.floor,open,time);
    const visualGate=open&&gateProgress<1;
    for(let sx=0;sx<W;sx+=2){
      const offset=(sx/W*2-1)*Math.tan(FOV/2);
      const ray=cam.ang+Math.atan(offset);
      const hit=castRay(s,cam,ray,visualGate);
      const corrected=Math.max(.04,hit.dist*Math.cos(ray-cam.ang));
      depths[sx]=depths[sx+1]=corrected;
      const wallHeight=Math.min(H*2.5,H*.96/corrected);
      const top=(H-wallHeight)/2;
      const isGate=core.gateAt(hit.mapX,hit.mapY,s.floor);
      const isDoor=core.tile(hit.mapX,hit.mapY,s.floor)==='X'||isGate;
      const mat=isDoor?mats.door:(hit.mapX+hit.mapY)%3===0?bays[s.floor]:(hit.mapX*9+hit.mapY*11)%9<2?mats.moss:s.floor===2?mats.abyss:s.floor===3?mats.crypt:s.floor===4?mats.crypt:mats.stone;
      const lift=isGate&&open?gateProgress:0;
      const shownHeight=Math.max(0,wallHeight*(1-lift));
      // Rising portcullis: draw only the still-visible lower texture strip, lifted upward.
      if(shownHeight>0)ctx.drawImage(mat,hit.tx,0,1,128*(1-lift),sx,top,2,shownHeight);
      // Fog, side shadow and nearby torch warmth; no external assets or GPU required.
      const distShade=Math.min(.85,.08+corrected*.105+(hit.side?.14:0));
      ctx.fillStyle=`rgba(1,8,15,${distShade})`;ctx.fillRect(sx,top,2,shownHeight);
      let torchLight=0;
      for(const torch of TORCHES){
        const d=Math.hypot(hit.mapX+.5-torch.x,hit.mapY+.5-torch.y);
        torchLight+=Math.max(0,.10-d*.032);
      }
      if(torchLight>0){ctx.fillStyle=`rgba(190,89,30,${Math.min(.19,torchLight*(.65+Math.sin(time*.005)*.14))})`;ctx.fillRect(sx,top,2,shownHeight);}
      if(sx%26===0){ctx.fillStyle='rgba(0,0,0,.04)';ctx.fillRect(sx,top,2,shownHeight);}
    }
    const sprites=[];
    for(const torch of TORCHES)sprites.push({x:torch.x,y:torch.y,type:'torch',object:torch});
    for(const mon of s.monsters)if(mon.hp>0 && (mon.floor||1)===s.floor)sprites.push({x:mon.x+.5,y:mon.y+.5,type:'enemy',object:mon});
    if(s.floor===1){
      for(const key of s.items){const [x,y]=key.split(',').map(Number);sprites.push({x:x+.5,y:y+.5,type:'bottle',object:{x,y}});}
      if(!s.key)sprites.push({x:4.5,y:11.5,type:'key',object:{x:4,y:11}});
    }else if(s.floor===2){
      if(!s.sigil)sprites.push({x:4.5,y:11.5,type:'rune',object:{x:4,y:11}});
      for(const pos of ['3,11','7,5'])if(!s.gearFound.includes(pos)){
        const [x,y]=pos.split(',').map(Number);sprites.push({x:x+.5,y:y+.5,type:'gear',object:{x,y}});
      }
    }else if(s.floor===3){
      if(!s.voidHeart)sprites.push({x:4.5,y:11.5,type:'rune',object:{x:4,y:11}});
    }else{
      if(!s.finalRune)sprites.push({x:4.5,y:11.5,type:'rune',object:{x:4,y:11}});
    }
    sprites.sort((a,b)=>Math.hypot(b.x-cam.x,b.y-cam.y)-Math.hypot(a.x-cam.x,a.y-cam.y));
    for(const sprite of sprites){
      if(sprite.type==='torch')torchSprite(sprite.object,cam,time);
      else if(sprite.type==='enemy')enemySprite(sprite.object,cam,time);
      else bottleSprite(sprite.object,cam,sprite.type,time);
    }
    // Dust and abyss motes are deterministic per frame and do not affect game state.
    ctx.save();
    for(let i=0;i<34;i++){
      const seed=i*137.508, x=(i*197.3+time*(.003+i%3*.001))%W;
      const y=(i*113.71-time*(.005+i%4*.001)+20000)%H;
      const a=.045+.065*(.5+.5*Math.sin(time*.001+i));
      ctx.fillStyle=s.floor===3?`rgba(99,214,184,${a})`:s.floor===2?`rgba(175,157,204,${a})`:`rgba(226,184,121,${a})`;
      ctx.fillRect(x,y,i%6===0?2:1,i%6===0?2:1);
    }
    ctx.restore();
    const vignette=ctx.createRadialGradient(W/2,H*.48,H*.16,W/2,H*.5,W*.67);
    vignette.addColorStop(0,'rgba(2,2,3,0)');vignette.addColorStop(1,'rgba(1,3,7,.84)');
    ctx.fillStyle=vignette;ctx.fillRect(0,0,W,H);
    if(s.floor===2){ctx.fillStyle='rgba(23,18,47,.16)';ctx.fillRect(0,0,W,H);}
    if(s.floor===3){ctx.fillStyle='rgba(15,59,52,.24)';ctx.fillRect(0,0,W,H);}
    if(s.floor===4){ctx.fillStyle='rgba(69,30,63,.24)';ctx.fillRect(0,0,W,H);}
    if(effect==='hurt') {ctx.fillStyle='rgba(164,26,29,.17)';ctx.fillRect(0,0,W,H);}
    if(effect==='attack'){ctx.fillStyle='rgba(218,159,100,.11)';ctx.fillRect(0,0,W,H);}
    if(effect==='spell'){ctx.fillStyle='rgba(89,121,201,.19)';ctx.fillRect(0,0,W,H);}
    if(effect==='frost'){ctx.fillStyle='rgba(113,202,236,.23)';ctx.fillRect(0,0,W,H);}
    if(effect==='ward'){ctx.fillStyle='rgba(224,185,94,.14)';ctx.fillRect(0,0,W,H);}
    if(s.ward>0){ctx.strokeStyle='rgba(235,198,115,.55)';ctx.lineWidth=5;ctx.strokeRect(5,5,W-10,H-10);}
    if(effect==='heal'){ctx.fillStyle='rgba(56,146,97,.12)';ctx.fillRect(0,0,W,H);}
    ctx.strokeStyle='rgba(231,204,155,.55)';ctx.lineWidth=1.4;
    ctx.beginPath();ctx.moveTo(W/2-8,H/2);ctx.lineTo(W/2+8,H/2);ctx.moveTo(W/2,H/2-8);ctx.lineTo(W/2,H/2+8);ctx.stroke();
    if(s.dead||s.won){
      ctx.fillStyle='rgba(2,4,10,.79)';ctx.fillRect(0,0,W,H);
      ctx.textAlign='center';ctx.fillStyle='#d9ad75';ctx.font='bold 42px Georgia';
      ctx.fillText(s.won?'EL UMBRAL SE HA ABIERTO':'LA COMPAÑÍA HA CAÍDO',W/2,H/2-20);
      ctx.fillStyle='#b8b1a4';ctx.font='20px Georgia';
      ctx.fillText(s.won?'Habéis escapado de las tres profundidades.':'Las sombras vuelven a reclamar sus nombres.',W/2,H/2+24);
      ctx.textAlign='start';
    }
  }
  function renderMap(s,enabled){
    const w=mapCanvas.width,h=mapCanvas.height,size=14,left=(w-core.WIDTH*size)/2,top=(h-core.HEIGHT*size)/2;
    mc.fillStyle='#0d1318';mc.fillRect(0,0,w,h);
    if(!enabled){mc.fillStyle='#c6af82';mc.font='14px Georgia';mc.fillText('Pulsa M para mostrar',22,h/2);return;}
    const seen=new Set(s.visited);
    for(let y=0;y<core.HEIGHT;y++)for(let x=0;x<core.WIDTH;x++){
      const key=`${x},${y}`;if(!seen.has(key))continue;
      mc.fillStyle=core.tile(x,y,s.floor)==='X'?'#ac7848':'#5e594f';
      mc.fillRect(left+x*size,top+y*size,size-1,size-1);
      for(const [dx,dy] of core.DIRS){if(core.wallAt(x+dx,y+dy,s.floor,s)){
        mc.fillStyle=(core.tile(x+dx,y+dy,s.floor)==='X'||(core.gateAt(x+dx,y+dy,s.floor)&&!(s.floor===3?s.labyrinthGateOpen:s.gateOpen)))?'#996d4c':'#333f41';
        mc.fillRect(left+(x+dx)*size,top+(y+dy)*size,size-1,size-1);
      }}
    }
    for(const m of s.monsters)if(m.hp>0&&(m.floor||1)===s.floor&&seen.has(`${m.x},${m.y}`)){
      mc.fillStyle='#af614f';mc.fillRect(left+m.x*size+4,top+m.y*size+4,size-8,size-8);
    }
    mc.fillStyle='#f9c578';mc.fillRect(left+s.x*size+2,top+s.y*size+2,size-5,size-5);
    mc.strokeStyle='#fff1c1';mc.lineWidth=2;
    mc.beginPath();mc.moveTo(left+(s.x+.5)*size,top+(s.y+.5)*size);
    mc.lineTo(left+(s.x+.5+core.DIRS[s.dir][0]*.65)*size,top+(s.y+.5+core.DIRS[s.dir][1]*.65)*size);mc.stroke();
  }
  return {renderWorld,renderMap};
}
return {createRenderer};
});
