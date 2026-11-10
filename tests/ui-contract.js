'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');

for(const page of ['index.html','art-lab.html']){
  const html=read(page);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(new Set(ids).size,ids.length,`${page}: IDs duplicados`);
  for(const [,attribute,url] of html.matchAll(/\b(src|href)="([^"#]+)"/g)){
    if(/^(?:[a-z]+:)?\/\//i.test(url)||url.startsWith('data:'))continue;
    const local=url.split(/[?#]/,1)[0];
    assert(fs.existsSync(path.join(root,local)),`${page}: ruta local ausente: ${url}`);
  }
  assert(!/serviceWorker|service-worker|navigator\.serviceWorker/i.test(html),`${page}: registro de Service Worker inesperado`);
}

const html=read('index.html'),game=read('game.js'),presentation=read('presentation.js');
assert.match(game,/initRenderer\('canvas'\)/,'La presentación ilustrada Canvas debe ser el motor inicial');
assert.match(html,/<option value="canvas" selected>CLÁSICO · CANVAS 2\.5D · RECOMENDADO<\/option>/,'Canvas debe aparecer marcado como motor recomendado');
const staticIds=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]));
const referenced=[...game.matchAll(/(?:\$\(|getElementById\()'([^']+)'\s*\)/g)].map(match=>match[1]);
for(const id of referenced)assert(staticIds.has(id),`game.js: selector sin nodo HTML: ${id}`);
for(const id of ['release-help','release-film','release-quality','release-fullscreen'])
  assert(presentation.includes(`id="${id}"`),`presentation.js: control dinámico ausente: ${id}`);
assert.match(game,/querySelectorAll\('\[data-action\]'\).*addEventListener\('click'/s,'Las acciones de combate/exploración no tienen listener');
for(const id of ['save','load','reset','export-save','import-save','toggle-map','sound','graphics-mode'])
  assert.match(game,new RegExp(`\\$\\('${id}'\\)\\.addEventListener`),`Sin listener para #${id}`);
for(const file of ['engine.js','renderer.js','renderer3d.js','audio.js','glb-model.js','interface.js','game.js','presentation.js'])
  assert.match(html,new RegExp(`<script src="${file}\\?v=67"`),`index.html: caché no alineada para ${file}`);
assert.match(read('art-lab.html'),/<title>DUNGEON 404 · Laboratorio visual v3\.9<\/title>/,'Título del laboratorio desfasado');
for(const file of ['engine.js','renderer.js','renderer3d.js','glb-model.js','art-lab.js'])
  assert.match(read('art-lab.html'),new RegExp(`<script src="${file}\\?v=67"`),`art-lab.html: caché no alineada para ${file}`);
console.log('OK UI contract: selectores, listeners, IDs, rutas Pages, caché y ausencia de Service Worker');
