/* DUNGEON 404 v1.6 — browser controller, no external services. */
(() => {
'use strict';
const core=window.DungeonEngine;
if(!core||!window.DungeonRenderer)throw Error('Required game modules did not load');
const $=id=>document.getElementById(id);
let renderer;
// The illustrated Canvas renderer is the visual reference. WebGL remains
// available in settings, but should not silently replace the more expressive
// creature presentation on capable devices.
let renderMode='canvas';
let renderQuality='smooth';
try{if(JSON.parse(localStorage.getItem('d404-presentation')||'{}')?.quality==='economy')renderQuality='economy';}catch(_){}
function createCanvas(){
 const previous=$('view');
 const next=document.createElement('canvas');
 next.id='view';next.width=renderQuality==='economy'?480:960;next.height=next.width*9/16;
 next.setAttribute('aria-label','Vista de mazmorra en primera persona');
 previous.replaceWith(next);
 return next;
}
function initRenderer(mode='auto'){
 // Canvas contexts cannot switch from WebGL to 2D on the same element.
 // A fresh canvas is required, including when recovering from shader errors.
 renderer?.dispose?.();
 const canvas=createCanvas();
 let fallback=false;
 try{
  const factory=mode==='canvas'?window.DungeonRenderer:(window.Dungeon3DRenderer||window.DungeonRenderer);
  renderer=factory.createRenderer(canvas,$('map'),core);
  fallback=mode!=='canvas'&&!String(renderer.backend||'').includes('WebGL');
 }catch(error){
  console.warn('WebGL error; switching to Canvas.',error);
  renderer=window.DungeonRenderer.createRenderer(createCanvas(),$('map'),core);
  fallback=true;
 }
 renderMode=fallback?'canvas':mode;
 const select=$('graphics-mode');if(select)select.value=renderMode;
 const status=$('graphics-status');if(status){const details=renderer.diagnostics?.shaderLinked?' · shaders enlazados':'';status.textContent=String(renderer.backend||'Canvas 2.5D')+details+(fallback?' · WebGL no disponible':'');}
}
initRenderer('canvas');
// Models are optional art resources: failures never interrupt the RPG.
if(window.DungeonGLB){for(const type of Object.keys(window.DungeonGLB.catalog))window.DungeonGLB.loadCreature(type).catch(error=>console.warn('Modelo cósmico no disponible:',type,error));}
let renderRecovery=false;
function safeWorld(state,t,effect){
 try{renderer.renderWorld(state,t,effect);}
 catch(error){
  if(renderRecovery)throw error;
  renderRecovery=true;
  console.warn('Renderer failed during drawing; restoring Canvas.',error);
  initRenderer('canvas');
  try{renderer.renderWorld(state,t,effect);}finally{renderRecovery=false;}
 }
}
let state=core.createGame();
let showMap=true;
const soundtrack=window.DungeonAudio;
let lastAudioFloor=1;
let lastPresentationFloor=1;
const announcedBosses=new Set();
let lastThreatMode="explore";
let effect='';
let effectUntil=0;
let lastFrame=0;
const performanceStats={samples:0,totalMs:0,maxMs:0,firstAt:0,lastAt:0};
const ICONS={Guerrero:'⚔',Pícara:'⟡',Maga:'✧',Clérigo:'✥'};
function element(tag,className='',content=''){
  const el=document.createElement(tag);
  if(className)el.className=className;
  if(content)el.textContent=content;
  return el;
}
function note(text){
  state.messages.unshift(text);
  state.messages=state.messages.slice(0,24);
  $('message').textContent=text;
}
function beep(kind){soundtrack?.play(kind);}
function updateAudioFloor(){
 if(state.floor!==lastPresentationFloor){
  lastPresentationFloor=state.floor;
  const entrances={2:'La marea lame los estantes. Algo arrastra cadenas al otro lado del agua.',3:'Los pasos regresan antes de que los des. El archivo conserva tu nombre.',4:'Huele a cera caliente y hierro. Las paredes laten al ritmo de una respiración enorme.'};
  if(entrances[state.floor])note(entrances[state.floor]);
 }

 if(state.floor!==lastAudioFloor){lastAudioFloor=state.floor;soundtrack?.updateFloor(lastAudioFloor);}
 const visibleNames=new Set(core.threats(state).map(t=>t.name));
 const nearby=state.dead||state.won?[]:state.monsters.filter(m=>(m.floor||1)===state.floor&&m.hp>0&&visibleNames.has(m.name));
 const looming=nearby.find(m=>['warden','king','archivist','firstname'].includes(m.kind));
 if(looming&&!announcedBosses.has(looming.kind)){announcedBosses.add(looming.kind);note('El aire se corta. '+looming.name+' está cerca. Prepara al grupo antes de avanzar.');beep('boss-roar');}
 const boss=nearby.some(m=>['warden','king','archivist','firstname'].includes(m.kind));
 const threat=boss?'boss':nearby.length?'combat':'explore';
 if(threat!==lastThreatMode){lastThreatMode=threat;soundtrack?.updateThreat(threat);}
 const indicator=$('soundscape-indicator');if(indicator){indicator.textContent=({explore:'EXPLORACIÓN',combat:'PELIGRO · COMBATE',boss:'ENCUENTRO CON JEFE'}[threat])+' · MÚSICA ADAPTATIVA';indicator.dataset.mode=threat;}
}
function refreshAudioControls(){
 const active=!!soundtrack?.settings.enabled;
 $('sound').textContent=active?'Ⅱ SILENCIAR MÚSICA Y SONIDO':'▶ ACTIVAR MÚSICA Y SONIDO';
 $('sound').setAttribute('aria-pressed',String(active));
 $('music-volume').value=String(Math.round((soundtrack?.settings.music??.58)*100));
 $('effects-volume').value=String(Math.round((soundtrack?.settings.effects??.72)*100));
 $('ambience-volume').value=String(Math.round((soundtrack?.settings.ambience??.48)*100));
 $('music-value').textContent=$('music-volume').value+'%';
 $('effects-value').textContent=$('effects-volume').value+'%';
 $('ambience-value').textContent=$('ambience-volume').value+'%';
 $('audio-status').textContent=active?soundtrack.getStatus()+' · Profundidad '+state.floor:'Pulsa activar para comenzar. Música dinámica, paisajes sonoros y 20 efectos.';
 $('quick-sound').textContent=active?'Ⅱ SILENCIAR':'▶ SONIDO';
 $('quick-sound').setAttribute('aria-pressed',String(active));
}
function play(action){
  if(['drownedSeal','drownedListen'].includes(action)&&state.floor===2&&state.drownedRitual==='none'&&state.x===3&&state.y===11){
    const choice=action==='drownedSeal'?'Sellar la Marea recupera 15 de cordura, entrega una poción, reduce el daño mental y favorece el Pacto si sellaste la Cripta.':'Escuchar la Marea cuesta 12 de cordura, otorga 3 de Lucidez y abre la posibilidad del Sueño Invertido; los ataques mentales conservan su fuerza.';
    if(!window.confirm(choice+' La decisión es permanente en esta partida. ¿Continuar?'))return;
  }
  const events=core.dispatch(state,action);
  const important=[...events].reverse().find(e=>['hurt','attack','spell','heal','loot','victory','defeat','level','frost','ward'].includes(e.effect));
  if(important){effect=important.effect;effectUntil=performance.now()+420;}
  if(events.length){
    const cue=important||events.at(-1);
    beep(cue.effect==='loot'&&cue.text.includes('RELIQUIA OCULTA')?'secret':cue.effect);
    const strike=events.find(e=>['attack','spell','frost'].includes(e.effect));
    if(strike&&cue.effect==='hurt')beep(strike.effect);
  }
  updateAudioFloor();
  refreshAudioControls();
  renderUI();
  safeWorld(state,performance.now(),effect);
  renderer.renderMap(state,showMap);
}
function heroNode(hero,index){
  const b=element('button',`hero${index===state.selected?' selected':''}${hero.hp<=0?' dead':''}`);
  b.dataset.hero=String(index);b.type='button';b.setAttribute('aria-pressed',String(index===state.selected));
  b.title=`${hero.weapon} · ${hero.armor} · Experiencia: ${hero.xp}/${hero.level*35}`;
  const classes={Guerrero:'fighter',Pícara:'rogue',Maga:'mage',Clérigo:'cleric'};
  const portrait=element('span',`portrait ${classes[hero.role]||''}`);
  const drawing=document.createElement('img');drawing.src='assets/art/'+(classes[hero.role]||'fighter')+'.svg';drawing.alt='';portrait.append(drawing);
  portrait.setAttribute('aria-hidden','true');
  const info=element('span','hero-info');
  const name=element('strong','',`${index+1}. ${hero.name}`);
  const stats=element('small','',`${hero.role} · NV ${hero.level} · ${hero.hp}/${hero.max} PV${hero.maxMana?` · ${hero.mana}/${hero.maxMana} PM`:''}`);
  const bars=element('span','bars'),hpbar=element('span','bar');
  const hpFill=element('i');hpFill.style.width=`${Math.max(0,hero.hp/hero.max*100)}%`;
  hpbar.append(hpFill);bars.append(hpbar);
  if(hero.maxMana){const manaBar=element('span','bar mana'),fill=element('i');fill.style.width=`${hero.mana/hero.maxMana*100}%`;manaBar.append(fill);bars.append(manaBar);}
  info.append(name,stats,bars);b.append(portrait,info);
  b.addEventListener('click',()=>{state.selected=index;renderUI();});
  return b;
}
function renderUI(){
  const focusedHero=document.activeElement?.dataset.hero;
  const focusedTouchHero=document.activeElement?.dataset.touchHero;
  const dirs=['NORTE','ESTE','SUR','OESTE'];
  $('location').textContent=`PROFUNDIDAD ${['','I','II','III','IV'][state.floor]} · ${dirs[state.dir]} · TURNO ${state.turn}`;
  $('secrets-status').textContent=`SECRETOS DESCUBIERTOS: ${state.secretsFound.length}/8 · Pulsa E frente a paredes sospechosas.`;
  $('secrets-journal').replaceChildren(...state.secretsFound.map(id=>{const secret=core.SECRETS[id];return element('li','',secret.name+' — '+secret.lore);}));
  $('area').textContent=['','LA CRIPTA DE LOS SUSURROS','LA BIBLIOTECA SUMERGIDA · MAREA NEGRA','EL LABERINTO OLVIDADO · ARCHIVO NEGRO','EL OSARIO DEL PRIMER NOMBRE'][state.floor];
  $('quick-supplies').textContent=`${state.potions} POCIONES · ${state.ether} ESENCIAS · ${state.scrolls} PERGAMINOS`;
  document.querySelectorAll('[data-depth]').forEach(node=>{const depth=Number(node.dataset.depth);node.dataset.state=depth<state.floor||state.won?'complete':depth===state.floor?'current':'unknown';if(depth===state.floor)node.setAttribute('aria-current','step');else node.removeAttribute('aria-current');});
  $('message').textContent=state.messages[0]||'';
  const sanity=Number.isInteger(state.sanity)?state.sanity:100;
  $('sanity-value').textContent=`${sanity}/100`;$('sanity-fill').style.width=sanity+'%';
  $('sanity-panel').dataset.zone=sanity>=75?'stable':sanity>=40?'uneasy':'fractured';
  $('knowledge-status').textContent=`TESTIMONIOS ${state.knowledge?.length||0}/3 · ${state.ritualSealed?'RITO COMPLETADO':'RITO PENDIENTE'}`;
  $('lucidity-value').textContent=`${state.lucidity??0}/10`;
  $('tome-status').textContent=`TOMOS ${state.tomesRead?.length||0}/2`;
  const threshold=sanity>=75?'stable':sanity>=40?'uneasy':sanity>=20?'disturbed':'fractured';
  $('perception-report').textContent=({stable:'Percepción estable. El eco permanece distante.',uneasy:'Oyes pasos que nadie ha dado. Los indicadores continúan siendo fiables.',disturbed:'La piedra parece palpitar. Algunas sombras no corresponden a ningún objeto.',fractured:'El mundo tiembla en los bordes de la vista. Conservas el control de tus movimientos.'})[threshold];
  $('view-container').dataset.perception=threshold;
  $('tomes-journal').replaceChildren(...(state.tomesRead||[]).map(id=>{const t=Object.values(core.FORBIDDEN_TOMES).find(t=>t.id===id);return element('li','',t?t.name+' — '+t.text:id)}));
  $('drowned-status').textContent=`MANUSCRITOS ${state.drownedClues?.length||0}/2 · ${state.drownedRitual==='none'?'RITUAL PENDIENTE':state.drownedRitual==='seal'?'MAREA SELLADA':'MAREA ESCUCHADA'}`;
  $('drowned-journal').replaceChildren(...(state.drownedClues||[]).map(id=>{const t=Object.values(core.DROWNED_TEXTS).find(t=>t.id===id);return element('li','',t?t.title+' — '+t.text:id)}));
  $('cosmic-journal').replaceChildren(...(state.knowledge||[]).map(id=>{const c=core.COSMIC_CLUES[Object.keys(core.COSMIC_CLUES).find(k=>core.COSMIC_CLUES[k].id===id)];return element('li','',c?c.title+' — '+c.text:id)}));
  const ending=state.ending&&core.ENDINGS[state.ending];
  const reveal=$('ending-reveal');reveal.hidden=!state.won||!ending;
  if(ending){$('ending-title').textContent=ending.title;$('ending-text').textContent=ending.text;}
  $('ending-omens').textContent=state.won?'El destino se ha cumplido.':(state.echoChoices||[]).filter(v=>v.endsWith(':memory')).length===4?'Los cuatro recuerdos están a salvo. Conserva al menos 4 de Lucidez: esta ruta secreta prevalece sobre los demás desenlaces.':state.drownedRitual==='seal'?'Has sellado la Marea. El juramento de la Cripta también importa.':state.drownedRitual==='listen'?'Has escuchado la Marea. El conocimiento y la Lucidez abrirán o cerrarán una ruta secreta.':'La Marea todavía espera una decisión.';
  $('party').replaceChildren(...state.party.map(heroNode));
  $('touch-party').replaceChildren(...state.party.map((hero,index)=>{
    const b=element('button','touch-hero'+(index===state.selected?' selected':''));
    b.type='button';b.dataset.touchHero=String(index);b.setAttribute('aria-pressed',String(index===state.selected));
    b.setAttribute('aria-label',`${hero.name}, ${hero.role}, nivel ${hero.level}. ${hero.hp} de ${hero.max} PV${hero.maxMana?`, ${hero.mana} de ${hero.maxMana} PM`:''}`);
    b.append(element('strong','',hero.name),element('span','',`${hero.hp}/${hero.max} PV`),element('small','',hero.maxMana?`${hero.mana}/${hero.maxMana} PM`:hero.role));
    b.addEventListener('click',()=>{state.selected=index;renderUI();});return b;
  }));
  if(focusedHero!==undefined)$('party').querySelector('[data-hero="'+focusedHero+'"]').focus({preventScroll:true});
  if(focusedTouchHero!==undefined)$('touch-party').querySelector('[data-touch-hero="'+focusedTouchHero+'"]').focus({preventScroll:true});
  $('party-selection').textContent=String(state.selected+1).padStart(2,'0')+' / 04';
  const meter=document.querySelector('[role="meter"]');meter.setAttribute('aria-valuenow',String(sanity));
  const spec=core.SPECIALTIES[state.party[state.selected].role];
  const wait=Math.max(0,(state.party[state.selected].skillReadyAt||0)-state.turn);
  $('signature-action').textContent=spec.name+(wait?' · '+wait+' T':' · ENTER');
  $('ability-hint').textContent=state.party[state.selected].name+' · '+spec.detail;
  const threats=core.threats(state);const intent=$('encounter-intent');
  intent.dataset.danger=String(threats.some(t=>t.danger));
  intent.textContent=threats.length?threats.map(t=>t.name+' · '+t.hp+'/'+t.max+' PV · '+(t.phase===2?'FASE II · ':'')+t.text).join(' | '):'Sin amenaza en línea de visión. Explora, busca relieves y lee las inscripciones.';
  const options=core.opportunities(state),context=$('context-actions');context.hidden=!options.length;
  context.replaceChildren(...options.map(option=>{
    const row=element('div','context-opportunity'),button=element('button','',option.label);
    button.type='button';button.addEventListener('click',()=>{
      if(option.action)play(option.action);
      else{const tab=$('tab-'+option.page);tab.click();tab.focus({preventScroll:true});$('page-'+option.page).scrollIntoView({behavior:'auto',block:'nearest'});}
    });
    row.append(button,element('span','',option.detail));return row;
  }));

  $('log').replaceChildren(...state.messages.slice(0,12).map(t=>element('div','',t)));
  const goals=state.floor===1?[
    [state.key,'Encuentra la llave de obsidiana'],
    [!state.monsters.some(m=>m.kind==='warden'&&m.hp>0),'Derrota al Confesor Desollado'],
    [false,'Desciende por el Umbral (E)']
  ]:state.floor===2?[
    [state.sigil,'Recupera el Sello de los Nombres'],
    [state.gateOpen,'Activa la losa de presión y abre la reja'],
    [!state.monsters.some(m=>m.kind==='king'&&m.hp>0),'Derrota al Bibliotecario de las Mil Lenguas'],
    [false,'Desciende al Laberinto Olvidado (E)']
  ]:state.floor===3?[
    [state.voidHeart,'Recupera el Corazón del Vacío'],
    [state.labyrinthGateOpen,'Activa el sigilo del Archivo Negro'],
    [!state.monsters.some(m=>m.kind==='archivist'&&m.hp>0),'Derrota al Archivista Vacío'],
    [false,'Desciende al Osario del Primer Nombre (E)']
  ]:[
    [state.finalRune,'Recupera la Runa del Último Nombre'],
    [!state.monsters.some(m=>m.kind==='firstname'&&m.hp>0),'Derrota al Primer Nombre'],
    [state.won,'Escapa del Osario (E)']
  ];
  const echo=core.echoAt(state),echoId=`${state.floor}:${state.x},${state.y}`,echoPending=echo&&!state.echoes.includes(echoId);
  $('echo-panel').hidden=!echoPending;
  if(echoPending){$('echo-title').textContent='ECO SIN DESCIFRAR · '+echo.name;$('echo-text').textContent=echo.text+' Elige una consecuencia; solo puedes llevarte una.';
    $('echo-choices').replaceChildren(...[['GUARDAR EL RECUERDO · aporta al desenlace secreto','echo:memory'],['TOMAR '+echo.choiceB.toUpperCase()+' · '+core.RELICS[echo.relic].use.toUpperCase(),'echo:material']].map(([label,action])=>{const b=element('button','gear-btn echo-choice',label);b.type='button';b.disabled=state.dead||state.won;b.addEventListener('click',()=>play(action));return b;}));
  }else $('echo-choices').replaceChildren();
  const shrineReady=state.x===1&&state.y===1&&!(state.shrines||[]).includes(state.floor);
  $('shrine-status').textContent=shrineReady?'ALTAR DE ENTRADA · Elige una vez: claridad o esencia.':(state.shrines||[]).includes(state.floor)?'ALTAR DE ENTRADA · Su luz ya se ha extinguido.':'ALTAR DE ENTRADA · Vuelve a (1,1) para elegir.';
  $('shrine-choices').replaceChildren(...(shrineReady?[["RECUPERAR 12 CORDURA","shrine:mind"],["TOMAR 1 ESENCIA","shrine:ether"]].map(([label,action])=>{const b=element('button','gear-btn',label);b.type='button';b.addEventListener('click',()=>play(action));return b;}):[]));
  $('quests').replaceChildren(...goals.map(([done,name])=>{
    const row=element('div',`quest${done?' done':''}`);
    row.append(element('span','quest-mark',done?'✓':'◇'),element('span','',name));return row;
  }));
  const supplies=[['♥',state.potions,'POCIONES'],['✦',state.ether,'ESENCIAS'],['▤',state.scrolls,'PERGAMINOS'],['◈',state.floor===1?(state.key?'SÍ':'NO'):state.floor===2?(state.sigil?'SÍ':'NO'):state.floor===3?(state.voidHeart?'SÍ':'NO'):(state.finalRune?'SÍ':'NO'),state.floor===1?'LLAVE':state.floor===2?'SELLO':state.floor===3?'CORAZÓN':'RUNA']];
  $('inventory').replaceChildren(...supplies.map(([icon,value,name])=>{
    const b=element('div','supply inventory-slot');b.append(element('strong','',`${icon} ${value}`),element('small','',name));return b;
  }));
  $('bag').replaceChildren(...[['POCIÓN · CURAR','potion',state.potions],['ESENCIA · MANÁ','ether',state.ether],['PERGAMINO · MAPA','scroll',state.scrolls]].map(([title,action,count])=>{
    const btn=element('button','gear-btn bag-slot',`${title} (${count})`);btn.type='button';
    btn.disabled=state.dead||state.won||count===0;btn.addEventListener('click',()=>play(action));return btn;
  }),...state.relics.map(id=>{const relic=core.RELICS[id],label=`${relic.name} · ${relic.use} · USAR`;const btn=element('button','gear-btn relic-slot',label);btn.type='button';btn.disabled=state.dead||state.won;btn.title=label;btn.setAttribute('aria-label',`Usar ${relic.name}. ${relic.use}`);btn.addEventListener('click',()=>play('relic:'+id));return btn;}));
  const p=state.party[state.selected];
  const active=state.monsters.filter(m=>m.floor===state.floor && m.hp>0);
  $('bestiary').replaceChildren(...active.map(m=>{
    const entry=(m.cosmicType&&core.COSMIC_ENEMIES[m.cosmicType])||core.BESTIARY[m.kind]||{title:m.name,trait:'Criatura de las profundidades.'};
    return element('div','bestiary-entry',`${m.name} · ${m.hp}/${m.max} PV${m.frozen?' · CONGELADO':''} — ${entry.trait}`);
  }));
  $('ward-status').textContent=state.ward?`✥ SANTUARIO ACTIVO · ${state.ward} fases enemigas restantes`:'Sin protección mágica activa';
  $('equipment').textContent=`${p.name} · ARMA: ${core.GEAR[p.equippedWeapon]?.label||p.weapon} · ARMADURA: ${core.GEAR[p.equippedArmor]?.label||p.armor} · XP ${p.xp}/${p.level*35}`;
  $('path-status').textContent=p.path?`${p.name} · ${core.PATHS[p.path]}`:p.level<2?`${p.name} necesita nivel 2 para elegir su juramento.`:`${p.name} puede escoger un juramento permanente. Bastión resiste; Filo potencia su especialidad.`;
  $('path-choices').replaceChildren(...(p.path?[]:Object.entries(core.PATHS).map(([path,label])=>{
    const b=element('button','gear-btn path-choice',label);b.type='button';b.disabled=p.level<2||p.hp<=0||state.dead||state.won;
    b.addEventListener('click',()=>play('path:'+path));return b;
  })));
  $('gear').replaceChildren(...state.gear.map(id=>{
    const item=core.GEAR[id];const equipped=p[item.slot==='weapon'?'equippedWeapon':'equippedArmor']===id;const btn=element('button','gear-btn equipment-slot',`${equipped?'✓ EQUIPADO · ':''}${item.label} (+${item.bonus})${item.role?' · '+item.role:''}`);
    btn.type='button';btn.disabled=state.dead||state.won||!!(item.role&&p.role!==item.role);
    btn.addEventListener('click',()=>play('equip:'+id));
    return btn;
  }));
  const unequipRow=element('div','unequip-row');
  for(const [label,action,slot] of [['QUITAR ARMA','unequipWeapon','equippedWeapon'],['QUITAR ARMADURA','unequipArmor','equippedArmor']]){
    const b=element('button','gear-btn',label);b.type='button';
    b.disabled=state.dead||state.won||!p[slot];
    b.addEventListener('click',()=>play(action));unequipRow.append(b);
  }
  $('gear').append(unequipRow);
  document.querySelectorAll('[data-action]').forEach(b=>{b.disabled=state.dead||state.won;});
  $('signature-action').disabled=state.dead||state.won||p.hp<=0||wait>0;
  if(state.won){document.getElementById('tab-quest').click();}

}
function save(){
  try{localStorage.setItem(core.SAVE_KEY,JSON.stringify(state));note('Partida guardada en este navegador.');}
  catch(_){note('El navegador ha bloqueado el almacenamiento local.');}
  renderUI();
}
function load(){
  try{
    const raw=localStorage.getItem(core.SAVE_KEY);
    const old=!raw?(localStorage.getItem(core.V15_SAVE_KEY)||localStorage.getItem(core.V14_SAVE_KEY)||localStorage.getItem(core.V13_SAVE_KEY)||localStorage.getItem(core.V12_SAVE_KEY)||localStorage.getItem(core.V11_SAVE_KEY)||localStorage.getItem(core.V10_SAVE_KEY)||localStorage.getItem(core.V9_SAVE_KEY)||localStorage.getItem(core.V8_SAVE_KEY)||localStorage.getItem(core.V7_SAVE_KEY)||localStorage.getItem(core.PREVIOUS_SAVE_KEY)||localStorage.getItem(core.V5_SAVE_KEY)||localStorage.getItem(core.V4_SAVE_KEY)||localStorage.getItem(core.LEGACY_SAVE_KEY)):null;
    const imported=core.importSave(JSON.parse(raw||old));
    if(!imported)throw Error('missing or invalid save');
    state=imported;
    announcedBosses.clear();
    note(old?'Partida anterior importada. Guarda para conservar la migración.':'Partida recuperada correctamente.');
  }catch(_){note('No se ha encontrado una partida válida.');}
  updateAudioFloor();refreshAudioControls();renderUI();safeWorld(state,performance.now());renderer.renderMap(state,showMap);
}
// Save files are portable between file://, local servers and GitHub Pages.
// Never execute imported content or write it to localStorage without explicit Save.
function exportGame(){
  try{
    if(!core.validGame(state))throw Error('Invalid current game');
    const content=JSON.stringify({format:'dungeon404-save',version:1,game:state},null,2);
    const blob=new Blob([content],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');link.href=url;
    link.download=`DUNGEON-404-partida-p${state.floor}-t${state.turn}.json`;
    document.body.append(link);link.click();link.remove();
    // Revoke after the browser has had time to take ownership of the download.
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    note('Partida exportada como JSON. Guarda el archivo en un lugar seguro.');
  }catch(_){note('No se ha podido exportar la partida.');}
  renderUI();
}
async function importFile(file){
  if(!file)return false;
  try{
    if(file.size>1024*1024)throw Error('oversized save file');
    const body=await file.text();
    const data=JSON.parse(body);
    if(!data||data.format!=='dungeon404-save'||data.version!==1)throw Error('unknown save format');
    const imported=core.importSave(data.game);
    if(!imported||!core.validGame(imported))throw Error('invalid save');
    if(!window.confirm(`¿Importar partida de la profundidad ${imported.floor}, turno ${imported.turn}? La sesión actual se sustituirá, pero tu guardado local seguirá intacto hasta que pulses GUARDAR.`))return false;
    state=imported;announcedBosses.clear();note('Partida importada. Pulsa GUARDAR para conservarla en este navegador.');
    updateAudioFloor();refreshAudioControls();renderUI();safeWorld(state,performance.now());renderer.renderMap(state,showMap);
    return true;
  }catch(_){note('Archivo no válido o incompatible. La partida actual sigue intacta.');renderUI();return false;}
}
function reset(){
  if(!window.confirm('¿Iniciar otra aventura? La partida guardada seguirá disponible.'))return;
  state=core.createGame();announcedBosses.clear();updateAudioFloor();refreshAudioControls();renderUI();safeWorld(state,performance.now());renderer.renderMap(state,showMap);
}
$('graphics-mode').addEventListener('change',event=>{
 initRenderer(event.target.value);
 safeWorld(state,performance.now(),effect);
 renderer.renderMap(state,showMap);
});
window.addEventListener('d404-qualitychange',event=>{
 const next=event.detail==='economy'?'economy':'smooth';if(next===renderQuality)return;
 renderQuality=next;initRenderer(renderMode);safeWorld(state,performance.now(),effect);renderer.renderMap(state,showMap);
});
$('save').addEventListener('click',save);
$('export-save').addEventListener('click',exportGame);
$('import-save').addEventListener('click',()=>$('import-save-file').click());
$('import-save-file').addEventListener('change',async e=>{const file=e.target.files?.[0];e.target.value='';await importFile(file);});
$('load').addEventListener('click',load);
$('reset').addEventListener('click',reset);
$('toggle-map').addEventListener('click',()=>{showMap=!showMap;$('toggle-map').textContent=showMap?'OCULTAR · M':'MOSTRAR · M';renderer.renderMap(state,showMap);});
$('sound').addEventListener('click',()=>{soundtrack?.setEnabled(!soundtrack.settings.enabled);refreshAudioControls();});
$('quick-sound').addEventListener('click',()=>$('sound').click());
$('quick-save').addEventListener('click',save);
$('quick-settings').addEventListener('click',()=>{$('tab-settings').click();$('tab-settings').focus();$('page-settings').scrollIntoView({behavior:'auto',block:'nearest'});});
$('music-volume').addEventListener('input',e=>{soundtrack?.setMusicVolume(Number(e.target.value)/100);refreshAudioControls();});
$('effects-volume').addEventListener('input',e=>{soundtrack?.setEffectsVolume(Number(e.target.value)/100);refreshAudioControls();});
$('ambience-volume').addEventListener('input',e=>{soundtrack?.setAmbienceVolume(Number(e.target.value)/100);refreshAudioControls();});
document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>play(button.dataset.action)));
document.addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey||e.repeat)return;
  if(document.querySelector('dialog[open]')||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
  if(document.activeElement?.matches('button,summary,[role=tab]')&&[' ','Enter','ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  const key=e.key.toLowerCase();
  const lookup={enter:'signature',w:'forward',arrowup:'forward',s:'back',arrowdown:'back',a:'left',arrowleft:'left',d:'right',arrowright:'right',q:'strafeLeft',r:'strafeRight',e:'interact',' ':'attack',h:'potion',g:'guard',f:'spell',b:'ward',c:'frost',v:'pulse',t:'rest',j:'ether',n:'scroll',x:'disarm',z:'search',i:'investigate',o:'ritual',k:'readTome',l:'focusMind',u:'investigateDrowned',y:'drownedSeal',p:'drownedListen'};
  if(lookup[key]){e.preventDefault();play(lookup[key]);}
  else if(key==='m'){$('toggle-map').click();}
  else if(['1','2','3','4'].includes(key)){state.selected=Number(key)-1;renderUI();}
});
// Render only the world at a capped rate: UI and game mechanics remain deterministic and event-driven.
function frame(t){
  if(!document.hidden && t-lastFrame>(window.DungeonPresentation?.frameInterval||33)){
    lastFrame=t;
    if(t>=effectUntil)effect='';
    const began=performance.now();safeWorld(state,t,effect);
    const elapsed=performance.now()-began;performanceStats.samples++;performanceStats.totalMs+=elapsed;performanceStats.maxMs=Math.max(performanceStats.maxMs,elapsed);if(!performanceStats.firstAt)performanceStats.firstAt=t;performanceStats.lastAt=t;
  }
  requestAnimationFrame(frame);
}
// Read-only diagnostics for optional browser QA; actions use the same real public game rules.
window.Dungeon404=Object.freeze({version:core.VERSION,performance:()=>({...performanceStats,backend:renderer.backend||'Canvas 2.5D'}),snapshot:()=>JSON.parse(JSON.stringify(state)),play,audio:()=>({enabled:soundtrack.settings.enabled,music:soundtrack.settings.music,effects:soundtrack.settings.effects,tracks:soundtrack.tracks,effectCount:soundtrack.effectCount,status:soundtrack.getStatus(),mode:soundtrack.getMode(),ambience:soundtrack.settings.ambience})});
updateAudioFloor();renderUI();refreshAudioControls();renderer.renderMap(state,showMap);requestAnimationFrame(frame);
})();
