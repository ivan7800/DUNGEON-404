from playwright.sync_api import sync_playwright
from pathlib import Path
import subprocess, time, shutil
root=Path(__file__).resolve().parents[1]
server=subprocess.Popen(['python','-m','http.server','8144','--bind','127.0.0.1'],cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
 time.sleep(.8)
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path=shutil.which('chromium'),args=['--no-sandbox','--disable-dev-shm-usage','--autoplay-policy=no-user-gesture-required'])
  for width,height in [(1440,900),(390,844)]:
   page=browser.new_page(viewport={'width':width,'height':height})
   errors=[]; page.on('pageerror',lambda err:errors.append(str(err)))
   requests=[];page.on('requestfailed',lambda req:requests.append(req.url))
   page.goto('http://127.0.0.1:8144/',wait_until='load')
   assert page.locator('#sound').is_visible()
   assert page.evaluate('window.Dungeon404?.audio()?.tracks')==4
   page.locator('#sound').click()
   page.wait_for_timeout(400)
   assert page.evaluate('Dungeon404.audio().enabled')
   page.locator('#music-volume').fill('26')
   assert abs(page.evaluate('Dungeon404.audio().music')-.26)<.00001
   page.locator('#effects-volume').fill('41')
   page.keyboard.press('w')
   page.wait_for_timeout(200)
   assert not errors,errors
   assert not requests,requests
   if width==390: assert not page.evaluate('document.documentElement.scrollWidth>document.documentElement.clientWidth')
   print('BROWSER OK',width, 'audio status',page.evaluate('Dungeon404.audio().status'),'render',page.locator('#graphics-status').inner_text())
   page.close()
  browser.close()
finally:
 server.terminate();server.wait()
