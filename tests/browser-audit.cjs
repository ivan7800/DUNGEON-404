/* Real HTTP + Chromium audit. Run: npm install --no-save --package-lock=false playwright@1.56.1
   npx playwright install chromium && node tests/browser-audit.cjs
   Artifacts go to D404_EVIDENCE_DIR, or a temporary directory outside the repository. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'):'playwright');
const C=require('../engine'),root=path.resolve(__dirname,'..');
const evidence=process.env.D404_EVIDENCE_DIR||fs.mkdtempSync(path.join(os.tmpdir(),'dungeon404-browser-'));
fs.mkdirSync(evidence,{recursive:true});
const prefix='/DUNGEON-404/';
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(!pathname.startsWith(prefix)){res.writeHead(404).end();return;}
 const file=path.resolve(root,pathname.slice(prefix.length)||'index.html');
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
 const types={'.js':'text/javascript','.html':'text/html','.css':'text/css','.svg':'image/svg+xml','.ogg':'audio/ogg','.glb':'model/gltf-binary'};
 res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res);
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${server.address().port}${prefix}`;
 let browser;
 const report={routes:prefix,errors:[],failedRequests:[],scenarios:[],buttons:[],downloads:false,import:false,canvas:false,webgl:false};
 try{
  browser=await chromium.launch({headless:true,...(process.env.D404_CHROMIUM_PATH?{executablePath:process.env.D404_CHROMIUM_PATH}:{}),args:['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader','--use-angle=swiftshader']});
  report.browser=browser.version();
  console.log('BROWSER: launched',report.browser);
  const context=await browser.newContext({viewport:{width:1440,height:1100},acceptDownloads:true});
  const page=await context.newPage();page.setDefaultTimeout(10000);page.setDefaultNavigationTimeout(30000);
  page.on('pageerror',error=>report.errors.push(String(error)));
  page.on('response',response=>{if(response.status()>=400)report.failedRequests.push(response.url()+' '+response.status());});
  await page.addInitScript(()=>localStorage.setItem('d404-presentation',JSON.stringify({film:true,quality:'economy'})));
  console.log('BROWSER: opening game');await page.goto(base);await page.waitForFunction(()=>window.Dungeon404);
  report.webgl=(await page.locator('#graphics-status').innerText()).includes('WebGL 3D');
  console.log('BROWSER: direct controls');await page.locator('#quick-sound').click();
  assert.equal(await page.locator('#quick-sound').getAttribute('aria-pressed'),'true');
  await page.locator('#quick-save').click();
  assert(await page.evaluate(key=>!!localStorage.getItem(key),C.SAVE_KEY));
  await page.locator('#quick-settings').click();
  await page.locator('#graphics-mode').selectOption('canvas');
  assert.match(await page.locator('#graphics-status').innerText(),/Canvas 2.5D/);report.canvas=true;
  for(const pageName of ['quest','bag','lore','settings']){
   await page.locator('#tab-'+pageName).click();assert(await page.locator('#page-'+pageName).isVisible());
  }
  // The download and reimport use an isolated browser profile, never the player's save.
  console.log('BROWSER: JSON download and import');const pending=page.waitForEvent('download');await page.locator('#export-save').click();const download=await pending;
  const exported=path.join(evidence,'roundtrip.json');await download.saveAs(exported);
  const envelope=JSON.parse(fs.readFileSync(exported,'utf8'));assert(C.importSave(envelope.game));report.downloads=true;
  page.once('dialog',dialog=>dialog.accept());await page.locator('#import-save-file').setInputFiles(exported);
  await page.waitForFunction(()=>document.getElementById('message').textContent.includes('Partida importada'));report.import=true;
  const previous=await page.evaluate(()=>Dungeon404.snapshot());
  await page.locator('#import-save-file').setInputFiles({name:'broken.json',mimeType:'application/json',buffer:Buffer.from('{"format":"dungeon404-save","version":1,"game":{"party":null}}')});
  await page.waitForFunction(()=>document.getElementById('message').textContent.includes('Archivo no válido'));
  assert.equal((await page.evaluate(()=>Dungeon404.snapshot())).turn,previous.turn);
  await page.locator('#load').click();assert.match(await page.locator('#message').innerText(),/recuperada/);
  page.once('dialog',dialog=>dialog.dismiss());await page.locator('#reset').click();
  await page.locator('#toggle-map').click();assert.match(await page.locator('#toggle-map').innerText(),/MOSTRAR/);await page.locator('#toggle-map').click();
  await page.locator('#release-help').click();assert(await page.locator('dialog[open]').isVisible());
  const turn=await page.evaluate(()=>Dungeon404.snapshot().turn);await page.locator('dialog').press('w');assert.equal(await page.evaluate(()=>Dungeon404.snapshot().turn),turn);
  await page.locator('.guide-close').click();await page.locator('#release-film').click();await page.locator('#release-quality').click();
  await page.locator('.advanced-actions summary').click();
  const actions=await page.locator('[data-action]').evaluateAll(nodes=>[...new Set(nodes.map(n=>n.dataset.action))]);
  for(const action of actions){console.log('BROWSER: action',action);
   const button=page.locator(`[data-action="${action}"]`).first();
   if(!await button.isVisible())await page.locator('#tab-lore').click();
   await button.click();report.buttons.push(action);
  }
  for(let floor=1;floor<=4;floor++){console.log('BROWSER: floor',floor);
   const state=C.createGame();state.floor=floor;state.visited=['1,1'];state.visitedByFloor[floor]=state.visited;
   await page.evaluate(({key,state})=>localStorage.setItem(key,JSON.stringify(state)),{key:C.SAVE_KEY,state});
   await page.locator('#tab-settings').click();await page.locator('#load').click();
   assert.equal(await page.evaluate(()=>Dungeon404.snapshot().floor),floor);
   await page.locator('#tab-quest').click();await page.screenshot({path:path.join(evidence,`depth-${floor}.png`),fullPage:true});
   report.scenarios.push(floor);
  }
  // Real boss telegraph and interrupt through the same public controls as a player.
  console.log('BROWSER: boss scenario');const state=C.createGame(),boss=state.monsters.find(m=>m.kind==='warden');
  Object.assign(state,{x:4,y:3,dir:1,selected:1});Object.assign(boss,{x:5,y:3,hp:20,phaseAwakened:true,telegraph:true});
  state.monsters=[boss];state.visited=['4,3'];state.visitedByFloor[1]=state.visited;
  await page.evaluate(({key,state})=>localStorage.setItem(key,JSON.stringify(state)),{key:C.SAVE_KEY,state});
  await page.locator('#tab-settings').click();await page.locator('#load').click();
  assert.match(await page.locator('#encounter-intent').innerText(),/ATAQUE PREPARADO/);
  await page.locator('#signature-action').click();
  assert.equal(await page.evaluate(()=>Dungeon404.snapshot().monsters[0].telegraph),false);
  await page.locator('#tab-bag').click();
  const perf0=await page.evaluate(()=>Dungeon404.performance());await page.waitForTimeout(3000);const perf1=await page.evaluate(()=>Dungeon404.performance());
  const samples=perf1.samples-perf0.samples;report.performance={backend:perf1.backend,samples,meanDrawMs:samples?(perf1.totalMs-perf0.totalMs)/samples:null,observedDrawHz:samples/3,note:'Chromium headless, software environment; CPU draw time, not physical GPU FPS.'};
  for(const width of [390,320]){
   await page.setViewportSize({width,height:844});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),`overflow at ${width}`);
   await page.screenshot({path:path.join(evidence,`mobile-${width}.png`),fullPage:true});
  }
  console.log('BROWSER: art laboratory');await page.goto(base+'art-lab.html');await page.waitForFunction(()=>document.getElementById('status').textContent.includes('Motor ACTIVO'));
  await page.locator('#mode').selectOption('canvas');
  for(const floor of ['1','2','3','4'])await page.locator('#floor').selectOption(floor);
  for(const kind of ['crawler','specter','warden','drowned','tideborn','librarian','archivist','firstname'])await page.locator('#creature').selectOption(kind);
  for(const action of ['left','right','forward','back','strafeLeft','strafeRight'])await page.locator(`[data-move="${action}"]`).click();
  await page.locator('#attack').click();await page.locator('#animate').uncheck();await page.locator('#showcase').uncheck();await page.locator('#reset').click();
  const pngPending=page.waitForEvent('download');await page.locator('#snapshot').click();const png=await pngPending;await png.saveAs(path.join(evidence,'lab.png'));
  assert.equal(fs.readFileSync(path.join(evidence,'lab.png')).subarray(1,4).toString(),'PNG');
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.failedRequests,[]);
  fs.writeFileSync(path.join(evidence,'browser-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));console.log('Evidence:',evidence);
 }catch(error){report.failure=String(error.stack||error);throw error;}finally{fs.writeFileSync(path.join(evidence,'browser-report.json'),JSON.stringify(report,null,2));server.closeAllConnections?.();server.close();if(browser)await browser.close();}
})().catch(error=>{console.error('::error::'+String(error.stack||error).replace(/%/g,'%25').replace(/\r/g,'%0D').replace(/\n/g,'%0A'));process.exit(1);});
