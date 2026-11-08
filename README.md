# DUNGEON 404 — Midnight Terror · v5.4 Final Candidate

Dungeon crawler por casillas de horror cósmico: cuatro expedicionarios, cuatro profundidades, cordura, investigación, rituales y tres finales. Estética propia de horror pulp ochentero con carmesí, ámbar y luz fría. Esta entrega reúne el bestiario cósmico, los encuentros tácticos, las reliquias y los sucesos con consecuencias. Las pruebas automatizadas pasan; la inspección visual en navegador y el rendimiento en hardware real quedan pendientes.

Esta campaña conserva la progresión y los sistemas de juego construidos desde las versiones v4.2 y v4.3.

## Iniciar

Necesitas Python 3 y un navegador moderno. No necesita cuentas, claves ni servicios externos.

- Windows: extrae todo el ZIP y ejecuta INICIAR-WINDOWS.bat.
- Linux: `chmod +x INICIAR-LINUX.sh` y `./INICIAR-LINUX.sh`.
- Mantén abierta la ventana del servidor. Ctrl+C lo cierra.
- Alternativa: `python3 -m http.server 8044 --bind 127.0.0.1`; abre http://localhost:8044/.
- Mantener el puerto 8044 conserva el origen de los guardados anteriores. Exporta tu partida JSON antes de cambiar de navegador o dirección.
- GitHub Pages: publica el contenido de esta carpeta. Las rutas son relativas; no requiere backend. El servidor local permite jugar sin conexión a Internet; no hay service worker ni instalación PWA.

## Cambios de esta edición

- Cuatro entidades nuevas, una por profundidad: Astrónomo Ciego, Madre de la Marea, Cartógrafo de la Herida y Polilla del Último Cielo. Cada una tiene silueta, paleta, ataque y efecto de cordura propios.
- Los ataques mentales están limitados a dos exposiciones por criatura y requieren línea de visión. Las partidas existentes reciben los nuevos encuentros al importarse sin revivir enemigos derrotados que ocupen sus posiciones.
- Se amplían los dibujos procedurales tanto del motor WebGL como del Canvas alternativo.
- Los ataques fuertes ahora se anuncian un turno antes, con una señal pulsante sobre el enemigo y un mensaje exclusivo. El aviso queda guardado y puede interrumpirse congelando a la criatura.
- Dos escondites ahora contienen reliquias con efectos jugables: lucidez para controlar la cordura y un sello que protege durante el siguiente encuentro. El resto mantiene sus consumibles; los ocho secretos siguen siendo opcionales.
- Cuatro sucesos de exploración de una sola aparición tienen ahora consecuencias propias: lucidez, cordura, esencia o recuperación de cordura. Sus efectos se guardan junto al diario y no se repiten al volver a la casilla.

- Antorchas fijadas a los muros, luz más localizada y piedra con vetas, humedad, grietas y manchas menos repetitivas.
- Dinteles voluminosos sustituidos por nervaduras góticas finas, para despejar el techo de la vista en primera persona.
- Aparición ilusoria en los primeros turnos y cuando cae mucho la cordura; no tiene colisión ni participa en el combate.
- Rastros de sangre en la Cripta, marcas arcanas en el Laberinto y restos óseos en el Osario.

- Cada profundidad tiene una ruta más diferenciada; la Biblioteca y el Laberinto dejan de reutilizar el trazado anterior, y el Osario reduce los rodeos hacia la runa y el jefe final.
- Dos sucesos de horror por profundidad aparecen una sola vez al explorar. Se guardan en la partida y no cambian combate ni colisiones.
- El recorrido automático de la campaña baja de 274 a 227 acciones en la comprobación reproducible incluida.

- Los modelos esculpidos de Guardián, Larva y Espectro se usan en la campaña; antes requerían activar la opción del laboratorio. Los tres modelos abisales siguen disponibles en la Biblioteca.
- Todos los modelos se precargan con recuperación al arte procedural si no se pueden descargar. Son seis esculturas existentes, sin nuevas mallas ni rig esquelético.
- Orientación de los modelos hacia el jugador, material de hielo al congelarlos, detalle de piel en coordenadas del mundo y luz de contorno.
- Corrección del material dorado: ya no comparte el shader del agua negra.
- Cadencia visual objetivo de 30 imágenes por segundo, con modo económico de 12. Es una cadencia solicitada, no una medición de rendimiento.
- Guía de supervivencia accesible, pantalla completa, acabado de película opcional y preferencias visuales persistentes.
- Nuevos mensajes de entrada a las profundidades y avisos de jefes próximos. No consumen acciones adicionales.
- Lanzadores consistentes que sirven sólo en la interfaz local y explican errores de inicio.

## Jugar

Pulsa CÓMO SOBREVIVIR para consultar los controles. El juego avanza por acciones; no necesitas reaccionar a tiempo real. Selecciona héroe con 1–4; W/S avanza/retrocede, A/D gira, Q/R desplaza lateralmente. Espacio ataca, G defiende, F conjura, H usa poción, J esencia, E interactúa, Z busca, X desactiva trampas, T descansa.

El botón de sonido permite activar la música adaptativa y ajustar música, ambiente y efectos por separado. PELÍCULA quita el tratamiento visual. FLUIDEZ cambia la cadencia. El selector de motor permite usar Canvas si WebGL no está disponible.

## Campaña y finales

La campaña implementada recorre Cripta, Biblioteca Sumergida, Laberinto Olvidado y Osario del Primer Nombre. Los antiguos nombres de actos de COSMIC-DESIGN.md pertenecen al documento conceptual; no son niveles adicionales anunciados para esta entrega.

- El Silencio: completar la campaña por la ruta estándar.
- El Pacto de la Marea: completar el Ritual del Silencio y elegir Sellar la Marea.
- El Sueño Invertido: escuchar la Marea, investigar ambos manuscritos y conservar al menos 4 de Lucidez al terminar.

Los desenlaces son variantes narrativas, sin cinemáticas específicas.

## Comprobaciones y límites

Consulta RELEASE-REPORT.md. La campaña y las pruebas automatizadas pasan. No se ha conseguido abrir el juego en un navegador durante esta entrega: Chromium no pudo descargarse y el navegador compartido rechazó el acceso al servidor local. No se afirman calidad visual verificada, FPS medidos, funcionamiento táctil comprobado ni pruebas en Windows físico. La animación es procedural y la iluminación es aproximada; no hay sombras físicas, texturas PBR ni iluminación global.
