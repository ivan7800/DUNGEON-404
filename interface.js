/* Accessible codex navigation; no game turns are consumed by reading. */
(()=>{'use strict';
const tabs=[...document.querySelectorAll('[data-page]')];
function open(tab){
 for(const b of tabs){const selected=b===tab;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;document.getElementById('page-'+b.dataset.page).hidden=!selected;}
}
for(const [i,tab] of tabs.entries()){
 tab.addEventListener('click',()=>open(tab));
 tab.addEventListener('keydown',e=>{
  let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;
  e.preventDefault();open(tabs[n]);tabs[n].focus();
 });
}
})();
