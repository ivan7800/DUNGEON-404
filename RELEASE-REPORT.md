# v5.3 RC4 — Informe de entrega

Fecha: 8 de noviembre de 2026.

## Ambientación gráfica RC4

- Las antorchas ahora se colocan contra paredes; el foco queda dentro del pasillo y no en el centro de las casillas.
- Se redujo el aspecto de bloques suspendidos del techo y se sustituyó por nervaduras apuntadas más finas.
- El shader de piedra usa vetas, grietas y manchas de humedad más orgánicas; se ajustó la luz ambiental para una escena más sombría.
- La escena de apertura muestra una figura falsa al fondo del corredor durante los primeros turnos. Las apariciones también se activan con cordura baja y no tienen colisión ni lógica de enemigo.
- Se añadieron marcas de sangre, glifos y huesos como detalles ambientales propios de cada profundidad.
- `node --check renderer3d.js` y todos los scripts JavaScript de `tests/` pasan, incluida `v53-atmosphere.js`.

No se pudo abrir el servidor local en el Chrome compartido. Por tanto, la composición, legibilidad, calidad de shaders y rendimiento de esta build aún no se han inspeccionado en un navegador gráfico.

## Recorrido actualizado

- Se modificaron los mapas de la Biblioteca Sumergida y el Laberinto Olvidado para separarlos del trazado repetido de las primeras profundidades.
- Se rediseñó el Osario; la runa final queda a 13 pasos y el acceso al combate final a 22 pasos desde la entrada, usando camino mínimo.
- Se añadieron ocho sucesos narrativos de una sola aparición, dos por profundidad, persistentes mediante el campo de historia ya existente.
- La prueba de campaña registra victoria en 227 acciones frente a las 274 que registra la build anterior con el mismo guion.
- Se ejecutaron todos los scripts JavaScript de `tests/` y pasaron, incluida `v52-adventure-route.js`.

La reducción de acciones procede del rediseño de rutas y no demuestra por sí sola que el ritmo sea divertido. Sigue haciendo falta una partida humana y revisión visual de WebGL.

## Cambios RC2

- El Bibliotecario tiene una corona animada de plumas y un rostro húmedo.
- El Archivista tiene varios ojos y apéndices que se mueven.
- El Primer Nombre tiene un halo fracturado y brasas orbitantes.
- El Guardián tiene una aureola de hierro y máscara marcada.
- Son detalles geométricos procedurales. No añaden mallas descargables ni cambian la lógica de combate.
- Estos cambios visuales aún requieren inspección en navegador WebGL; no se consideran comprobados visualmente.

## Comprobado

- Los scripts JavaScript heredados de pruebas y la nueva prueba de rutas: pasan.
- 8 archivos JavaScript de aplicación: sintaxis correcta.
- Prueba nueva v50-release.js: pasa. Verifica los seis GLB con transformaciones en varias orientaciones, vértices finitos, hielo, caché y separación entre materiales dorados y agua.
- En RC1 la partida de referencia completaba la cuarta profundidad tras 274 acciones; en RC3, el mismo guion termina tras 227.
- Tres finales: resolución, persistencia y migración comprobadas por v40-endings.js.
- Lanzador Linux: sintaxis Bash correcta. Lanzador Python: compilación correcta.
- Prueba histórica v24-audio.js actualizada: acepta versiones posteriores de recursos y ampliaciones de catálogo. El contrato completo de audio actual sigue cubierto por v25-audio.js.

## Pendiente antes de declarar una release estable

- Revisión visual de cada profundidad, modelos cercanos, orientación, iluminación y congelación en WebGL.
- Interacción de la guía, ajustes, pantalla completa, guardado/carga y controles móviles en navegador.
- Medición de rendimiento, contraste y legibilidad con hardware real.
- Ejecución de lanzadores en Windows y Linux con escritorio.
- Escucha y valoración humana del sonido, tensión, diversión y dificultad.

## Bloqueo observado

Se intentó instalar Chromium mediante Playwright. La descarga devolvió un archivo inválido/truncado y no se pudo extraer. También se intentó abrir http://localhost:8044/ en el navegador compartido: net::ERR_CONNECTION_REFUSED. Las pruebas Node no equivalen a una inspección visual de WebGL. No hay capturas del resultado ni una puntuación de calidad inventada.

## Alcance artístico

Se han integrado las esculturas existentes en la campaña y mejorado su presentación. No se han creado seis monstruos nuevos ni animaciones esqueléticas. La edición conserva las reglas y contenido de combate previos; la comprobación automática demuestra que se puede completar, sin demostrar por sí sola el equilibrio subjetivo o la diversión.
# v5.4 RC5 — Informe de entrega

Fecha: 8 de noviembre de 2026.

## Bestiario cósmico

- Se incorporan cuatro entidades móviles nuevas, una por profundidad: El Astrónomo Ciego, La Madre de la Marea, El Cartógrafo de la Herida y La Polilla del Último Cielo.
- Cada criatura tiene geometría, color, movimiento visual, patrón de ataque y mensaje de horror propios. Dos especies pueden atacar a distancia con línea despejada.
- Sus visiones reducen cordura como máximo dos veces por criatura, sólo cuando hay línea de visión y dentro de tres casillas. La Madre y el Cartógrafo también consumen 1 PM.
- Las partidas previas migran los encuentros nuevos sin resucitar una criatura derrotada ya guardada en su casilla.
- Canvas 2.5D y WebGL tienen representación diferenciada; ambas se verifican con contratos de render automatizados.

## Verificación

- Sintaxis de engine.js, renderer.js y renderer3d.js correcta.
- Todos los scripts de `tests/` pasan; incluye las pruebas históricas de campaña, migración, renderer con WebGL simulado y Canvas, más el contrato atmosférico v5.3.
- Las pruebas no sustituyen la inspección en un navegador con GPU. La calidad final de la composición y el rendimiento real aún no se han visto en esta sesión.

# v5.4 RC6 — Encuentros tácticos

## Cambios

- Cada horror cósmico anuncia un golpe de mayor intensidad un turno antes de ejecutarlo. El mensaje y el halo visual varían según criatura.
- Durante el aviso, el jugador puede defenderse, alejarse o interrumpir al enemigo con Escarcha. Congelar una criatura durante el aviso cancela el golpe pendiente.
- El estado del aviso queda dentro del guardado existente; se valida tanto en importación como al reanudar partida.

## Comprobaciones

- `tests/v54-encounters.js`: anuncio previo, sin daño durante el aviso, golpe siguiente, persistencia y congelación.
- Todos los scripts de `tests/*.js` y comprobación sintáctica de los motores pasan.
- No se ha completado una inspección visual en navegador real en esta fase; los contratos automatizados no sustituyen esa revisión ni validan por sí solos el equilibrio subjetivo.

# v5.4 RC7 — Exploración y reliquias

- Dos secretos tienen recompensas con efecto en sistemas centrales: +2 lucidez y +1 nivel de Santuario.
- Todos los secretos siguen siendo opcionales, únicos por partida y compatibles con el registro existente.
- `tests/v14.js` comprueba las dos recompensas y el resultado narrativo; toda la suite JavaScript pasa.
- Persisten los límites de validación visual en navegador señalados en RC5 y RC6.

# v5.4 RC8 — Sucesos con consecuencias

- Se conectaron cuatro sucesos narrativos de las profundidades con recompensas/efectos de cordura, lucidez y esencia.
- Efectos acotados y de una sola ejecución, ligados al registro `loreRead` existente; continúan guardándose en el formato actual.
- La prueba `v52-adventure-route.js` verifica ubicación, consecuencia, round-trip de guardado y que revisitar no repita el efecto.
- Suite completa JavaScript pasa. La inspección WebGL en navegador real continúa pendiente.

# v5.4 — Candidata final de publicación

Fecha: 8 de noviembre de 2026.

## Pruebas ejecutadas en esta entrega

- Todos los scripts de `tests/*.js`: correctos.
- Sintaxis de `engine.js`, `renderer.js` y `renderer3d.js`: correcta.
- Lanzador Linux (`bash -n`) y compilación Python de `launch.py`: correctos.
- Integridad del ZIP: comprobada con `unzip -t`.

## Pendiente de validación manual

- No hay Chromium instalado en este entorno; no se completó la prueba visual WebGL/Canvas, el recorrido interactivo del navegador ni capturas.
- No se ejecutaron los lanzadores en escritorios Windows/Linux físicos ni se midió rendimiento de GPU.
- La campaña completa sí está cubierta por las pruebas automatizadas; eso no sustituye una sesión humana para valorar dificultad y ritmo.

Esta entrega es funcionalmente completa según sus pruebas automatizadas. Para llamarla publicación verificada, aún hay que realizar la lista manual anterior en al menos un navegador de escritorio y un móvil.

