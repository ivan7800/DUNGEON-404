"""Optional Chromium UI smoke. Requires Python playwright package and Chromium.

Uses injected local content so it also works in restricted file/network environments.
It is NOT a substitute for opening index.html normally on Windows and Linux.
"""
import re
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
HTML = (ROOT / 'index.html').read_text(encoding='utf-8')
HTML = re.sub(r'<link rel="stylesheet"[^>]*>', '', HTML)
HTML = re.sub(r'<script src="[^"]+" defer></script>', '', HTML)


def prepare(browser, viewport):
    page = browser.new_page(viewport=viewport, device_scale_factor=1)
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.set_content(HTML, wait_until='domcontentloaded')
    page.add_style_tag(content=(ROOT / 'style.css').read_text(encoding='utf-8'))
    page.evaluate("""() => {
        const data={};
        Object.defineProperty(window,'localStorage',{configurable:true,value:{
            getItem:(k)=>data[k]??null,
            setItem:(k,v)=>{data[k]=v;}
        }});
    }""")
    for name in ('engine.js', 'renderer.js', 'game.js'):
        page.add_script_tag(content=(ROOT / name).read_text(encoding='utf-8'))
    page.wait_for_timeout(350)
    return page, errors


def main():
    chromium = shutil.which('chromium') or shutil.which('chromium-browser')
    with sync_playwright() as play:
        browser = play.chromium.launch(headless=True, **({'executable_path': chromium} if chromium else {}),
                                       args=['--no-sandbox', '--disable-dev-shm-usage'])
        desktop, errors = prepare(browser, {'width': 1440, 'height': 900})
        assert desktop.evaluate('Dungeon404.version') == 13
        assert desktop.locator('#view').is_visible()
        assert desktop.locator('[data-action=ward]').is_visible()
        desktop.keyboard.press('4')
        desktop.keyboard.press('b')
        assert desktop.evaluate('Dungeon404.snapshot().ward') == 2
        assert 'SANTUARIO ACTIVO' in desktop.locator('#ward-status').inner_text()
        desktop.keyboard.press('w')
        assert desktop.evaluate('Dungeon404.snapshot().x') == 2
        desktop.locator('#save').click()
        assert desktop.evaluate('!!localStorage.getItem("dungeon404-save-v13")')
        desktop.locator('#load').click()
        assert 'recuperada' in desktop.locator('#message').inner_text()
        desktop.locator('#toggle-map').click()
        assert 'MOSTRAR' in desktop.locator('#toggle-map').inner_text()
        assert not errors, errors
        mobile, mobile_errors = prepare(browser, {'width': 390, 'height': 844})
        overflow = mobile.evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth')
        assert not overflow, 'Horizontal overflow on mobile'
        assert not mobile_errors, mobile_errors
        browser.close()
    print('OK: Chromium UI, Canvas, teclado, guardado/carga y responsive móvil')


if __name__ == '__main__':
    main()
