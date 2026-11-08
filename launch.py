"""Local-only launcher. Uses the same origin to keep existing browser saves."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import functools
import threading
import webbrowser

if __name__ == '__main__':
    directory = str(Path(__file__).resolve().parent)
    handler = functools.partial(SimpleHTTPRequestHandler, directory=directory)
    try:
        server = ThreadingHTTPServer(('127.0.0.1', 8044), handler)
    except OSError as error:
        print('No se puede abrir el puerto 8044. Cierra el servidor anterior y vuelve a iniciar.', error)
        input('Pulsa Intro para salir. ')
        raise SystemExit(1)
    url = 'http://localhost:8044/'
    print('DUNGEON 404 — MIDNIGHT TERROR\n'+url+'\nDeja esta ventana abierta. Ctrl+C para cerrar.')
    threading.Timer(0.7, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
