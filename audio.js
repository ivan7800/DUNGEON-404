/* DUNGEON 404 v2.8 — adaptive offline soundtrack; no external audio services. */
(function(root){'use strict';
const effectNames=['attack','hurt','move','spell','frost','ward','heal','loot','victory','defeat','level','interact','search','rest','gate','trap','boss-roar','boss-hit','magic-impact','secret'];
const effects=new Set(effectNames),media=new Map(),activeEffects=new Set();
const settings={enabled:false,music:.56,effects:.68,ambience:.48};
const storageKey='dungeon404-audio-v25';
try{const old=JSON.parse(localStorage.getItem(storageKey)||localStorage.getItem('dungeon404-audio-v24')||'{}');for(const key of ['music','effects','ambience'])if(Number.isFinite(old[key]))settings[key]=Math.max(0,Math.min(1,old[key]));}catch(_){}
let floor=1,mode='explore',current=null,ambient=null,fadeId=0,status='Silenciado';
let updateClock=()=>performance.now();
const clamp=v=>Math.max(0,Math.min(1,Number(v)||0));
function persist(){try{localStorage.setItem(storageKey,JSON.stringify({music:settings.music,effects:settings.effects,ambience:settings.ambience}));}catch(_){}}
function get(name){if(!media.has(name)){
 const a=new Audio('assets/audio/'+name+'.ogg');a.loop=true;a.preload='none';a.volume=0;
 a.addEventListener('error',()=>{status='No se ha podido cargar '+name;});media.set(name,a);
}return media.get(name);}
function playMedia(a){try{const result=a.play();if(result&&typeof result.catch==='function')result.catch(()=>{status='Reproducción bloqueada: pulsa ACTIVAR';});}catch(_){status='Reproducción bloqueada: pulsa ACTIVAR';}}
function target(){return mode==='boss'?'boss-'+(floor>=3?2:1):mode==='combat'?'combat-'+floor:'floor-'+floor;}
function volumeFor(track){return track===ambient?settings.ambience*.65:settings.music;}
function transition(old,next,token){const start=updateClock(),duration=1100;next.volume=0;playMedia(next);
 function frame(now){if(token!==fadeId||!settings.enabled)return;
  const p=Math.max(0,Math.min(1,(now-start)/duration));next.volume=clamp(volumeFor(next)*p);
  if(old)old.volume=clamp(volumeFor(old)*(1-p));
  if(p<1)requestAnimationFrame(frame);else if(old){old.pause();old.currentTime=0;}
 }requestAnimationFrame(frame);
}
function refresh(){if(!settings.enabled)return;
 const targetTrack=get(target()),amb=get('ambience-'+floor);
 if(current!==targetTrack){const old=current;current=targetTrack;transition(old,current,++fadeId);}
 else{current.volume=clamp(settings.music);playMedia(current);}
 if(ambient!==amb){const old=ambient;ambient=amb;ambient.volume=clamp(settings.ambience*.65);playMedia(ambient);if(old){old.pause();old.currentTime=0;}}
 else{ambient.volume=clamp(settings.ambience*.65);}
 status='ACTIVO · '+({explore:'EXPLORACIÓN',combat:'COMBATE',boss:'JEFE'}[mode]);
}
function setEnabled(value){if(settings.enabled===!!value)return;
 settings.enabled=!!value;if(settings.enabled){refresh();}else{++fadeId;for(const a of media.values()){a.pause();a.currentTime=0;}for(const a of activeEffects){a.pause();a.src='';}activeEffects.clear();current=null;ambient=null;status='Silenciado';}}
function setMusicVolume(v){settings.music=clamp(v);persist();if(current)current.volume=settings.music;}
function setEffectsVolume(v){settings.effects=clamp(v);persist();}
function setAmbienceVolume(v){settings.ambience=clamp(v);persist();if(ambient)ambient.volume=settings.ambience*.65;}
function updateFloor(value){const next=Math.max(1,Math.min(4,Math.round(value)||1));if(floor!==next){floor=next;refresh();}}
function updateThreat(newMode){const next=['explore','combat','boss'].includes(newMode)?newMode:'explore';if(mode!==next){mode=next;refresh();}}
function play(kind){if(!settings.enabled||!settings.effects)return;if(!effects.has(kind))kind='interact';
 try{const a=new Audio('assets/audio/'+kind+'.ogg');a.preload='auto';a.volume=clamp(settings.effects*.82);activeEffects.add(a);
 const cleanup=()=>{activeEffects.delete(a);a.removeAttribute?.('src');};a.addEventListener('ended',cleanup,{once:true});a.addEventListener('error',cleanup,{once:true});
 const promise=a.play();if(promise?.catch)promise.catch(cleanup);
 }catch(_){}
}
function dispose(){setEnabled(false);}
root.DungeonAudio=Object.freeze({settings,setEnabled,setMusicVolume,setEffectsVolume,setAmbienceVolume,updateFloor,updateThreat,play,dispose,getStatus:()=>status,getMode:()=>mode,tracks:14,effectCount:effects.size});
})(window);
