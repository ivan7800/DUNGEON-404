# v6.6 — Auditoría integral y mejoras de presentación

Fecha: 8 de noviembre de 2026. Rama de trabajo: `codex/v6.6-campaign-audit`. Base remota: `cf52b5281df2f73854a4ff0dba0d3e87d12f2d55`. Los apartados v6.0–v6.5 que siguen son históricos y sus estados de rama/publicación no describen la v6.6.

## Contenido real de la campaña

Cuatro mapas, cuatro custodios con fases, cuatro entidades cósmicas, especialidades para cuatro personajes, equipo, altares, investigación, tomos, rituales, cordura/lucidez, ocho secretos y cuatro ecos/reliquias. Hay cuatro desenlaces deterministas. La música usa 14 pistas locales y 20 efectos; no hay doblaje ni cinemáticas de vídeo. El código permite terminar la campaña; no se presenta como una campaña larga ni como diversión demostrada por pruebas unitarias.

## Causas encontradas y correcciones

1. Los fundidos de audio se cancelaban mediante un token sin detener las pistas abandonadas. Una transición rápida podía dejar varias músicas superpuestas. Ahora cada transición retira sus voces anteriores, conserva ganancias y limita efectos a ocho voces.
2. `validGame` accedía a estructuras anidadas antes de validarlas; JSON incompleto podía lanzar excepciones. Se validan contenedores y clases antes de leerlos. Se conserva el formato 16; esquemas futuros desconocidos se rechazan. La expresión regular de trampas excluía por error la cuarta profundidad: se corrige y prueba su ciclo de guardado/carga.
3. El laboratorio intentaba crear Canvas sobre un lienzo que ya podía tener WebGL. Ahora usa uno nuevo. El controlador libera buffers/programas al cambiar motor; tras restauración de contexto no reutiliza recursos GL invalidados.
4. La música y el aviso de jefe reaccionaban a enemigos tras paredes; se alinean con los pronósticos visibles. Al iniciar/cargar se limpian los avisos de otra sesión. La alerta Canvas de fase deja de aparecer por un jefe oculto.
5. Las oportunidades narrativas exigían recordar teclas/coordenadas y el sonido estaba relegado al códice. Se añaden señales cercanas con costes y enlaces de decisión, progreso y accesos directos sobre la partida. Se corrigen textos heredados que aún describían tres profundidades/destinos.

## Arte entregado

Cuatro SVG originales reproducibles con Python, integrados como relieves en paredes del raycaster: sepulcro del custodio, biblioteca bajo el agua, astrolabio y nichos óseos. Bóvedas y trazos de acero/magia en Canvas. No son arte de terceros ni una recoloración de las criaturas. El proyecto conserva sus once ilustraciones, cuatro retratos, sello y seis GLB. WebGL mantiene su contenido; esta revisión no incorpora nuevas mallas de monstruos.

## Resultados locales

- Línea base: 48 scripts JavaScript pasados antes de editar. Tras cambios: 52 scripts, incluidos cuatro de regresión v6.6.
- Ruta de campaña automática terminada con cinco valores fijos del azar (0,05/0,25/0,49/0,75/0,95): 223–226 acciones del guion, dos o tres supervivientes. Es una comprobación de ruta accesible con una estrategia concreta, no cinco partidas humanas ni una medición de duración.
- 20 SVG XML válidos; seis GLB decodificados y transformados por las pruebas; 34 OGG decodificables con ffprobe (0,21–36 s por archivo). No equivale a escucha crítica.
- Sintaxis JavaScript, Python y Bash; rutas relativas y claves de caché 66; IDs, selectores/listeners y ausencia de Service Worker.
- El navegador automático local no pudo arrancar: el ejecutable Chromium no estaba instalado y su descarga devolvió un archivo no válido. El navegador compartido tampoco puede acceder al servidor local (conexión rechazada). Se añade `tests/browser-audit.cjs` y un job de Actions para revisar el HTTP real en un perfil aislado.

## Verificación de publicación

Pendiente de ejecutar la auditoría Chromium en Actions y revisar la web publicada. Los resultados reales se incorporarán antes de cerrar esta entrega. No se afirma todavía una nueva revisión visual de v6.6 ni una medición de GPU física.

---

# Addendum v6.5 — interfaz analógica de terror cósmico

La interfaz usa etiquetas de archivo/cinta, tipografía monoespaciada en controles y paneles, contraste de fósforo turquesa y ámbar, violeta para lo anómalo y carmesí para peligro. Líneas de barrido sutiles solo aparecen en superficies de interfaz; la escena Canvas/WebGL conserva el arte original. No se añaden fuentes externas, dependencias ni efectos animados.

Auditoría de botones en el sitio publicado: en Chromium real respondieron navegación del códice, mapa, movimiento, ataque, defensa, poderes, investigación, guía, ajustes de presentación, audio, niveles de volumen y selector de motor. Se comprobó también movimiento, reinicio, cambio de profundidad/criatura, ataque y controles del laboratorio visual. Los botones contextuales dan mensajes cuando el personaje, objetivo, recurso o casilla no permiten la acción. La guía modal impide pulsar controles de fondo hasta cerrarla, como corresponde. No hay Service Worker, ni capas CSS que intercepten la entrada del ratón, ni errores de consola procedentes de los scripts del juego en la sesión observada; los mensajes de consola observados pertenecían a una extensión del navegador. En este Chromium WebGL no está disponible y el juego/laboratorio activan su fallback Canvas.

Correcciones: parámetros `?v=65` coherentes para los scripts locales de juego y laboratorio, para evitar reutilizar archivos con claves de caché antiguas en GitHub Pages; título HTML del laboratorio actualizado de v3.4 a v3.9; nueva prueba de contrato para selectores, listeners, IDs, rutas relativas, caché y Service Worker.

Verificación local de v6.5: 48 scripts de prueba JavaScript, sintaxis de todos los archivos JavaScript, compilación Python del lanzador, sintaxis del lanzador Linux y `git diff --check`. Las pruebas cubren ruta de victoria, migración de guardados, render WebGL simulado y fallback Canvas. Guardar/cargar/importar/exportar no se pulsaron en el sitio publicado para no escribir ni sustituir datos de guardado del jugador; la prueba estática comprueba sus listeners y las pruebas existentes validan migraciones. La vista WebGL en GPU física no pudo probarse en este navegador porque carece de contexto WebGL.

# Addendum v6.4 — reliquias de eco y desenlace de la Catedral

Las cuatro cámaras de v6.3 ahora permiten elegir entre conservar un recuerdo o tomar una reliquia única. Linterna: +15 cordura. Espejo: protección para la siguiente fase enemiga. Brújula: +2 lucidez. Campana: interrumpe a los enemigos visibles hasta a dos casillas; si no hay objetivo, no se consume. Espejo y Campana activan la respuesta enemiga; las reliquias inmediatas no.

Conservar los cuatro recuerdos y alcanzar el final con 4 o más de Lucidez desbloquea «La Catedral recuerda». Esta ruta secreta prevalece si también se cumplen las condiciones de revelación o pacto; de lo contrario se conservan las prioridades previas. `echoChoices` y `relics` son campos opcionales dentro del esquema 16; importar una partida anterior los inicializa vacíos y no modifica su progreso.

Verificación de este addendum: prueba funcional de las cuatro cámaras, elecciones únicas, cuatro efectos, consumo y fallo sin objetivo, nuevo desenlace, precedencia narrativa, validación de datos de eco/reliquia y migración. También se han actualizado la ayuda contextual, inventario, textos del panel de destinos, versión visible y parámetros de caché. No se afirma revisión visual en navegador ni GPU física para esta entrega hasta ejecutar esas comprobaciones.

# Addendum v6.3 — exploración y revisión WebGL

La rama añade cuatro ecos opcionales en cámaras existentes. Cada sala ofrece una elección entre memoria y material, se registra una sola vez y se conserva en guardados v6.0/v6.1/v6.2 mediante el campo opcional `echoes` sin cambiar el esquema 16. En v6.4 el material pasa a ser una reliquia única en cada sitio.

WebGL: revisión estática de shaders, creación del contexto, errores GL por frame y recuperación Canvas. No hay GPU física expuesta a este entorno; no se afirma compilación/renderizado real WebGL. La restauración del contexto perdido se resuelve de forma segura con Canvas si el contexto no puede volver a renderizar.

# Addendum v6.2 — rama de revisión

La fase II del Primer Nombre incorpora alcance de dos casillas con línea de visión; cada jefe anuncia su ataque con un texto propio. Canvas señala telegráficos en carmesí y WebGL dibuja un sigilo dinámico bajo los jefes.

Verificación: sintaxis JS y suite completa de scripts; prueba nueva de aviso, impacto a distancia y bloqueo por muro. No se ha verificado WebGL en una GPU física, pantalla táctil real ni rendimiento en hardware físico. La exploración existente conserva cuatro mapas, secretos y sucesos únicos con consecuencias; esta rama no añade nuevos mapas.

---

# Addendum v6.1 — revisión

La rama v6.1 incorpora juramentos al nivel 2 y altares de entrada con decisiones de recurso. Conservar el esquema 16 permite importar guardados v6.0; el nuevo campo `shrines` se inicializa vacío y `path` es opcional. La revisión WebGL en GPU, exportación de JSON descargado e importación de archivo y móvil físico continúan pendientes. Verificación local: 45 scripts JavaScript y sintaxis del motor e interfaz superados; recorrido de victoria existente superado. La pantalla de inicio v6.1 se abrió en Chrome compartido y mostró el altar y las cuatro pestañas. El flujo de descarga e importación JSON, WebGL en GPU y móvil físico siguen sin comprobación real.

---

# v6.0 — La Catedral de la Marea · Informe de revisión

Fecha: 8 de noviembre de 2026. Rama: `codex/cathedral-of-the-drowned-star`.

Estado: cambios preparados para revisión. No fusionados en `main` ni publicados en GitHub Pages. Este informe sustituye el informe acumulativo de los candidatos v5.x, que sigue disponible en el historial Git.

## Línea base

Commit de partida: `affc35e2cdc8e174b068a09d66763f247a8f3f80` (v5.4 Final Candidate; la página todavía mostraba RC8). Los 42 scripts JavaScript existentes pasaron antes de editar. Se encontraron cuatro profundidades, tres finales, esquema de guardado 16, seis modelos GLB, modo WebGL y modo Canvas, sonido local y controles completos.

El problema principal era la acumulación de controles y estilos de distintas versiones. La especialización del guerrero y la pícara era menor que la de los conjuradores y los jefes no tenían un aviso consistente de sus golpes fuertes.

## Cambios entregados

- Nuevo sistema visual de piedra, hueso, latón y marea. Sello, cuatro retratos y once ilustraciones de criaturas SVG originales, editables y sin recursos remotos.
- Interfaz completa reorganizada: grupo, mapa y cordura; cuatro acciones principales; artes desplegables; códice con Juramento, Inventario, Códice y Ajustes y partida.
- Nuevos vanos de arco apuntado, tracería, columnas y detalles de libros, astrolabios y huesos para WebGL. Atlas de vanos y nuevas criaturas para Canvas, conservando recuperación al dibujo anterior si una imagen no carga.
- Especialidades con recuperación por turnos: intercepción de Aldric, interrupción de Mara y acceso rápido a Escarcha/Santuario. Se conservan los conjuros anteriores.
- Golpes fuertes de jefe con preparación y fase II: cambios de armadura, drenaje y alcance. Barra de amenaza con línea de visión y fase.
- Decisión del altar con costes y efectos explícitos. Teclado accesible en pestañas, foco de selección de personajes, etiquetas de movimiento y medidor de cordura con valor accesible.
- Guardados compatibles con esquema 16 y clave anterior, con propiedades tácticas opcionales validadas. Sin dependencias nuevas de producción.

## Comprobaciones automáticas

- 44 scripts JavaScript: los 42 anteriores más `v60-tactics.js` y `v60-art.js`.
- Sintaxis de los nueve archivos JavaScript de la aplicación; Python y Bash de los lanzadores.
- Ruta completa automatizada: victoria en la profundidad IV en 224 acciones del guion, con tres personajes vivos. Este resultado prueba que existe una ruta de victoria; no demuestra diversión ni equilibrio para todos los estilos de juego.
- Pruebas nuevas: intercepción, interrupción, recuperación, maná, avisos y persistencia de fase, pronósticos bloqueados por paredes, guardados anteriores y rechazo de campos tácticos inválidos.
- Pruebas nuevas de arte: presencia de los 16 SVG originales y dibujo con imágenes cargadas de las once clases de criatura. XML de SVG, IDs HTML únicos y recursos HTML con rutas relativas comprobados.
- La prueba histórica de ataques mentales se ajustó para muestrear el impacto del Bibliotecario después de su preparación. Se conserva la comprobación de pérdida de cordura, reducción del sello y límite de dos exposiciones.
- CI actualizada para ejecutar todos los scripts JavaScript de `tests/`, incluido el test de encuentros v5.4 que faltaba en la lista anterior.

## Revisión real en navegador

Se abrió la aplicación en Chrome compartido mediante el servidor de vista previa. Se inspeccionaron las cuatro profundidades en Canvas y un escenario de jefe en fase II. Se comprobó visualmente la nueva ilustración del Confesor, sus avisos y la selección de Mara; al pulsar Corte del silencio el jefe perdió vida, su preparación se canceló y se activó la recuperación de cuatro turnos.

También se comprobó la apertura/cierre de la guía, las páginas de Inventario/Códice/Ajustes, guardar/cargar y la activación/desactivación de audio. La exportación JSON mostró su mensaje de éxito, pero la herramienta no recogió el evento de descarga desde el iframe antes de agotar el tiempo: el archivo descargado y su reimportación no se consideran verificados en esta revisión de navegador. El contrato de guardados sigue cubierto por las pruebas Node.

A 390 px de anchura externa (375 px útiles por la barra de desplazamiento), el documento no presentó desbordamiento horizontal: `scrollWidth = clientWidth = 375`. La interfaz mostró los controles, retratos y pestañas en su distribución estrecha. Es una comprobación de ancho y clics, no una prueba en un teléfono físico.

Captura de la aplicación real, con el escenario preparado de jefe: [docs/evidence/v6-desktop.jpg](docs/evidence/v6-desktop.jpg). No es una captura de una partida completa jugada por una persona.

## Muestra de rendimiento

En el escenario Canvas del jefe, la instrumentación del controlador registró 148 dibujos durante una muestra de cinco segundos: 29,6 dibujos/s y 1,73 ms de CPU por llamada de dibujo de media. Se midió dentro del navegador compartido, no en hardware del usuario. Este dato no mide tiempo GPU ni constituye una garantía de FPS en otros dispositivos.

## Límites y revisión pendiente

- En este Chrome, la petición de contexto WebGL no está disponible y el juego recupera Canvas. Se probó el selector y se observó esa recuperación. No se certifica el aspecto, la compilación real de shaders ni el rendimiento de WebGL; las pruebas con contexto simulado no sustituyen esa revisión.
- No se han ejecutado los lanzadores en Windows ni Linux con escritorio físico, ni se han probado gestos en iOS/Android. Sólo sintaxis de lanzadores y diseño estrecho en navegador.
- No se ha completado una partida humana de principio a fin, ni una escucha crítica de la banda sonora. Pantalla completa, archivo JSON descargado y reimportación real requieren su comprobación final en navegador compatible.
- No se incorporan mallas nuevas de monstruos, rig esquelético, PBR ni iluminación global. Las esculturas anteriores se mantienen; el arte nuevo de criaturas corresponde al modo Canvas.

## Reproducir la revisión

Sirve la raíz del repositorio y abre `tests/browser-lab.html`. El banco permite preparar cada profundidad, el jefe, una anchura de 390 px y una muestra de dibujo. Restaura el guardado anterior después de cargar el escenario; pulsar GUARDAR dentro del juego sí sustituye la partida de ese origen, como en la aplicación normal.

Antes de fusionar, revisar WebGL en un navegador con contexto disponible, exportar/importar un JSON y probar pantalla completa y controles en un móvil físico. La publicación permanece bajo decisión del propietario.
