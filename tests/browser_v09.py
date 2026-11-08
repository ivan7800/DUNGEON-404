from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from functools import partial
from playwright.sync_api import sync_playwright
base=Path(__file__).resolve().parents[1]
server=ThreadingHTTPServer(('127.0.0.1',0),partial(SimpleHTTPRequestHandler,directory=str(base)))
Thread(target=server.serve_forever,daemon=True).start()
try:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  for width,height in [(1280,900),(390,844)]:
   page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
   errors=[]
   page.on('pageerror',lambda err: errors.append(str(err)))
   html=(base/'index.html').read_text()
   import re
   html=re.sub(r'<link rel="stylesheet" href="style.css\?v=09">',lambda _: '<style>'+ (base/'style.css').read_text()+'</style>',html)
   for script in ('engine','renderer','game'):
    html=html.replace(f'<script src="{script}.js?v=09" defer></script>', '<script>'+ (base/(script+'.js')).read_text()+'</script>')
   page.set_content(html,wait_until='load')
   assert page.title().find('v0.9')>=0
   assert page.locator('[data-action="frost"]').count()==1
   assert page.evaluate('Dungeon404.version')==9
   before=page.evaluate('Dungeon404.snapshot().dir')
   page.locator('[data-action="right"]').click()
   assert page.evaluate('Dungeon404.snapshot().dir')==(before+1)%4
   assert page.locator('canvas#view').evaluate('(c)=>c.width')==960
   assert not errors,errors
   print('Browser OK',width,height,'turn',page.evaluate('Dungeon404.snapshot().turn'))
   if width==1280: page.screenshot(path='/mnt/data/DUNGEON-404-v0.9-preview.png',full_page=True)
   page.close()
  browser.close()
finally:
 server.shutdown()
