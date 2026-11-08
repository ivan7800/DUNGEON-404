"""Headless browser smoke test for v1.5 (optional, requires playwright and Chromium)."""
from pathlib import Path
import contextlib,http.server,threading
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
class Quiet(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*args,**kw):super().__init__(*args,directory=str(root),**kw)
    def log_message(self,*args):pass
srv=http.server.ThreadingHTTPServer(('127.0.0.1',0),Quiet)
threading.Thread(target=srv.serve_forever,daemon=True).start()
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1280,'height':850})
        errs=[]
        page.on('pageerror',lambda exc:errs.append(str(exc)))
        # The CI sandbox can block localhost/file://; inject our checked local assets.
        import re
        from html import escape
        html=(root/'index.html').read_text()
        html=re.sub(r'<link rel="stylesheet" href="style.css\?v=15">', lambda m:'<style>'+ (root/'style.css').read_text() +'</style>',html)
        for fname in ['engine.js','renderer.js','game.js']:
            html=html.replace(f'<script src="{fname}?v=15" defer></script>', '<script>'+ (root/fname).read_text().replace('</script>',r'<\/script>') +'</script>')
        page.goto('about:blank')
        page.set_content(html,wait_until='load')
        page.wait_for_function('window.Dungeon404 && window.Dungeon404.version===15')
        assert '0/8' in page.locator('#secrets-status').inner_text()
        page.evaluate("Dungeon404.play('left');Dungeon404.play('left')");page.locator('[data-action=interact]').click()
        assert '1/8' in page.locator('#secrets-status').inner_text()
        assert page.evaluate('Dungeon404.snapshot().potions')==5
        # Storage cannot be tested on opaque about:blank origins.
        page.set_viewport_size({'width':390,'height':844})
        assert page.locator('[data-action="search"]').is_visible()
        assert not errs,errs
        print('OK Chromium: UI, wall cache discovery, mobile controls, no JS errors')
        browser.close()
finally:srv.shutdown()
