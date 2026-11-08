"""Restricted CI browser: injected application and a mocked media transport.
Not an actual test of audio playback / GPU WebGL.
"""
from playwright.sync_api import sync_playwright
from pathlib import Path
import re, shutil
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
html=re.sub(r'<link rel="stylesheet"[^>]*>','',html)
html=re.sub(r'<script src="[^"]+" defer></script>','',html)
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path=shutil.which('chromium'),args=['--no-sandbox','--disable-dev-shm-usage'])
 for width,height in [(1440,900),(390,844)]:
  page=browser.new_page(viewport={'width':width,'height':height})
  errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
  page.set_content(html)
  page.add_style_tag(content=(root/'style.css').read_text())
  page.evaluate('''() => {
    const db={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:(k)=>db[k]||null,setItem:(k,v)=>db[k]=v}});
    window.Audio=class { constructor(src){this.src=src;this.volume=0;this.currentTime=0;this.loop=false;} play(){return Promise.resolve();} pause(){} addEventListener(){} };
  }''')
  for n in ['engine.js','renderer.js','renderer3d.js','audio.js','game.js']:
   page.add_script_tag(content=(root/n).read_text())
  assert page.locator('#sound').is_visible()
  assert page.evaluate('Dungeon404.audio().tracks')==14
  page.locator('#sound').click()
  assert page.evaluate('Dungeon404.audio().enabled')
  page.locator('#music-volume').fill('26')
  assert abs(page.evaluate('Dungeon404.audio().music')-.26)<.00001
  page.locator('#effects-volume').fill('41')
  page.locator('#ambience-volume').fill('35')
  assert abs(page.evaluate('Dungeon404.audio().ambience')-.35)<.00001
  page.keyboard.press('w')
  page.wait_for_timeout(200)
  assert not errors,errors
  if width==390:assert not page.evaluate('document.documentElement.scrollWidth>document.documentElement.clientWidth')
  print('BROWSER INJECTED OK',width,'audio dynamic UI, controls, JS errors',len(errors))
  page.close()
 browser.close()
