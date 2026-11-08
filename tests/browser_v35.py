"""Injected-browser smoke in restricted environment; not evidence for real HTTP/WebGL/audio."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import re,shutil
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
html=re.sub(r'<link rel="stylesheet"[^>]*>','',html)
html=re.sub(r'<script src="[^"]+" defer></script>','',html)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path=shutil.which('chromium'),args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(1440,900),(390,844)]:
  page=browser.new_page(viewport={'width':width,'height':height})
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html)
  page.add_style_tag(content=(root/'style.css').read_text())
  page.evaluate('''() => {
    const db={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>db[k]||null,setItem:(k,v)=>db[k]=v}});
    window.Audio=class {constructor(src){this.src=src;this.volume=0;this.currentTime=0;this.loop=false;} play(){return Promise.resolve();} pause(){} addEventListener(){} };
  }''')
  for name in ['engine.js','renderer.js','renderer3d.js','audio.js','game.js']:
   page.add_script_tag(content=(root/name).read_text())
  assert page.locator('#sanity-value').inner_text()=='100/100'
  assert page.locator('#knowledge-status').inner_text().startswith('TESTIMONIOS 0/3')
  page.locator('[data-action="investigate"]').click()
  page.keyboard.press('w')
  assert not errors,errors
  if width==1440:page.screenshot(path='/mnt/data/DUNGEON-404-v3.5-preview.png',full_page=False)
  if width==390:assert not page.evaluate('document.documentElement.scrollWidth>document.documentElement.clientWidth')
  print('BROWSER INJECTED OK',width,'errors',len(errors),'renderer',page.locator('#graphics-status').inner_text())
  page.close()
 browser.close()
