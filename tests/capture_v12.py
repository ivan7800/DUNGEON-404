from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright
from importlib.machinery import SourceFileLoader
browser_test=SourceFileLoader('browser_test',str(Path(__file__).with_name('browser-smoke.py'))).load_module()
with sync_playwright() as p:
  chromium=shutil.which('chromium') or shutil.which('chromium-browser')
  browser=p.chromium.launch(headless=True,**({'executable_path':chromium} if chromium else {}),args=['--no-sandbox','--disable-dev-shm-usage'])
  page,errors=browser_test.prepare(browser,{'width':1440,'height':900})
  page.screenshot(path='/mnt/data/DUNGEON-404-v1.2-preview.png',full_page=False)
  assert not errors,errors
  browser.close()
