# Addendum v6.5 — interfaz analógica de terror cósmico

La interfaz usa etiquetas de archivo/cinta, tipografía monoespaciada en controles y paneles, contraste de fósforo turquesa y ámbar, violeta para lo anómalo y carmesí para peligro. Líneas de barrido sutiles solo aparecen en superficies de interfaz; la escena Canvas/WebGL conserva el arte original. No se añaden fuentes externas, dependencias ni efectos animados.

Verificación local de v6.5: los 47 scripts de prueba JavaScript superados, sintaxis de todos los archivos JavaScript comprobada y `git diff --check` limpio. Las pruebas existentes verifican ruta de victoria, migración de guardados, render WebGL simulado y fallback Canvas. La revisión visual en navegador real queda pendiente: el navegador compartido mostró una copia obsoleta y bloqueó el acceso a archivos locales; no se declara verificada la presentación visual ni el modo WebGL en GPU física.

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
