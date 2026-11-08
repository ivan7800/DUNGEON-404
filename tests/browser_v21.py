from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for width,height in ((1440,900),(390,844)):
  page=browser.new_page(viewport={'width':width,'height':height});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  import re
  html=(ROOT/'index.html').read_text();html=re.sub(r'<link rel="stylesheet"[^>]*>','',html);html=re.sub(r'<script src="[^"]+" defer></script>','',html)
  page.set_content(html);page.add_style_tag(content=(ROOT/'style.css').read_text())
  for name in ('engine.js','renderer.js','renderer3d.js','game.js'):page.add_script_tag(content=(ROOT/name).read_text())
  page.wait_for_timeout(350)
  probe=page.evaluate("""(()=>{const c=document.createElement('canvas');const gl=c.getContext('webgl');return {available:!!gl,renderer:gl?gl.getParameter(gl.RENDERER):null}})()""")
  status=page.locator('#graphics-status').inner_text();print('viewport',width,'WebGL',probe,'status',status,'errors',errors)
  page.locator('#graphics-mode').select_option('canvas');page.keyboard.press('w');assert page.evaluate('Dungeon404.snapshot().x')==2
  page.locator('#graphics-mode').select_option('webgl');page.wait_for_timeout(200)
  assert page.locator('#view').is_visible();assert not errors,errors
  if width==1440:page.screenshot(path='/mnt/data/DUNGEON-404-v2.1-preview.png')
  assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth')
  page.close()
 browser.close()
print('Browser checks OK (WebGL availability reported, not assumed)')
