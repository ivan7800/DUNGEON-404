/* Adaptive local soundtrack. A transition owns every music voice it leaves playing. */
(function(root){'use strict';
const effectNames=['attack','hurt','move','spell','frost','ward','heal','loot','victory','defeat','level','interact','search','rest','gate','trap','boss-roar','boss-hit','magic-impact','secret'];
const effects=new Set(effectNames),media=new Map(),activeEffects=new Set();
const settings={enabled:false,music:.56,effects:.68,ambience:.48};
const storageKey='dungeon404-audio-v25';
try{
 const old=JSON.parse(localStorage.getItem(storageKey)||localStorage.getItem('dungeon404-audio-v24')||'{}');
 for(const key of ['music','effects','ambience'])if(Number.isFinite(old?.[key]))settings[key]=Math.max(0,Math.min(1,old[key]));
}catch(_){}
let floor=1,mode='explore',current=null,ambient=null,fadeId=0,status='Silenciado';
const fading=new Set();
const clamp=v=>Math.max(0,Math.min(1,Number(v)||0));
function persist(){try{localStorage.setItem(storageKey,JSON.stringify({music:settings.music,effects:settings.effects,ambience:settings.ambience}));}catch(_){}}
function stop(a){a.pause();a.currentTime=0;a.volume=0;}
function get(name){
 if(!media.has(name)){
  const a=new Audio('assets/audio/'+name+'.ogg');a.loop=true;a.preload='none';a.volume=0;
  a.addEventListener('error',()=>{if(settings.enabled&&(a===current||a===ambient))status='No se ha podido cargar '+name;});
  media.set(name,a);
 }
 return media.get(name);
}
function playMedia(a){
 try{
  const result=a.play();
  if(result&&typeof result.catch==='function')result.catch(()=>{if(settings.enabled&&(a===current||a===ambient))status='Reproducción bloqueada: pulsa ACTIVAR';});
 }catch(_){status='Reproducción bloqueada: pulsa ACTIVAR';}
}
function target(){return mode==='boss'?'boss-'+(floor>=3?2:1):mode==='combat'?'combat-'+floor:'floor-'+floor;}
function transition(old,next){
 const token=++fadeId,start=performance.now();
 // An interrupted fade must retire its previous voices, including a track being reused.
 for(const track of fading)if(track!==old&&track!==next)stop(track);
 fading.clear();
 const oldGain=old&&settings.music?clamp(old.volume/settings.music):0;
 const nextGain=settings.music?clamp(next.volume/settings.music):0;
 if(old)fading.add(old);
 next.volume=clamp(settings.music*nextGain);playMedia(next);
 function frame(now){
  if(token!==fadeId||!settings.enabled)return;
  const p=clamp((now-start)/1100);
  next.volume=clamp(settings.music*(nextGain+(1-nextGain)*p));
  if(old)old.volume=clamp(settings.music*oldGain*(1-p));
  if(p<1)requestAnimationFrame(frame);
  else if(old){stop(old);fading.delete(old);}
 }
 requestAnimationFrame(frame);
}
function refresh(){
 if(!settings.enabled)return;
 status='ACTIVO · '+({explore:'EXPLORACIÓN',combat:'COMBATE',boss:'JEFE'}[mode]);
 const targetTrack=get(target()),amb=get('ambience-'+floor);
 if(current!==targetTrack){const old=current;current=targetTrack;transition(old,current);}
 else playMedia(current);
 if(ambient!==amb){if(ambient)stop(ambient);ambient=amb;ambient.volume=clamp(settings.ambience*.65);playMedia(ambient);}
 else ambient.volume=clamp(settings.ambience*.65);
}
function setEnabled(value){
 if(settings.enabled===!!value)return;
 settings.enabled=!!value;
 if(settings.enabled)refresh();
 else{
  ++fadeId;for(const a of media.values())stop(a);fading.clear();
  for(const a of activeEffects){a.pause();a.removeAttribute?.('src');}
  activeEffects.clear();current=null;ambient=null;status='Silenciado';
 }
}
function setMusicVolume(v){
 const previous=settings.music;settings.music=clamp(v);persist();
 for(const track of [current,...fading])if(track)track.volume=previous?clamp(track.volume/previous*settings.music):0;
 // Fade callbacks apply the new gain on their next frame; a settled track updates immediately.
 if(current&&!fading.size)current.volume=settings.music;
}
function setEffectsVolume(v){settings.effects=clamp(v);persist();for(const a of activeEffects)a.volume=clamp(settings.effects*.82);}
function setAmbienceVolume(v){settings.ambience=clamp(v);persist();if(ambient)ambient.volume=settings.ambience*.65;}
function updateFloor(value){const next=Math.max(1,Math.min(4,Math.round(value)||1));if(floor!==next){floor=next;refresh();}}
function updateThreat(newMode){const next=['explore','combat','boss'].includes(newMode)?newMode:'explore';if(mode!==next){mode=next;refresh();}}
function play(kind){
 if(!settings.enabled||!settings.effects)return;
 if(!effects.has(kind))kind='interact';
 try{
  // Repeated input cannot create an unbounded stack of overlapping effects.
  if(activeEffects.size>=8){const oldest=activeEffects.values().next().value;oldest.pause();oldest.removeAttribute?.('src');activeEffects.delete(oldest);}
  const a=new Audio('assets/audio/'+kind+'.ogg');a.preload='auto';a.volume=clamp(settings.effects*.82);activeEffects.add(a);
  const cleanup=()=>{activeEffects.delete(a);a.removeAttribute?.('src');};
  a.addEventListener('ended',cleanup,{once:true});a.addEventListener('error',cleanup,{once:true});
  const promise=a.play();if(promise?.catch)promise.catch(cleanup);
 }catch(_){}
}
function dispose(){setEnabled(false);}
root.DungeonAudio=Object.freeze({settings,setEnabled,setMusicVolume,setEffectsVolume,setAmbienceVolume,updateFloor,updateThreat,play,dispose,getStatus:()=>status,getMode:()=>mode,tracks:14,effectCount:effects.size});
})(window);
