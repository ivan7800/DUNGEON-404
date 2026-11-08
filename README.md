# DUNGEON 404 — La Catedral de la Marea · v6.6

Dungeon crawler por casillas y acciones: cuatro aventureros descienden por catedrales enterradas bajo un océano cósmico. La campaña conserva sus cuatro profundidades, investigación, rituales, equipo, cordura y ocho secretos; ahora ofrece cuatro desenlaces y reliquias de eco de un solo uso.

La campaña continúa la progresión y los sistemas de las versiones v4.2 y v4.3.

La v6.6 añade relieves originales por profundidad al modo Canvas, señales contextuales de exploración y accesos directos a sonido, guardado y ajustes sobre la partida. Conserva la estética de archivo analógico de terror cósmico de los ochenta. Consulta [RELEASE-REPORT.md](RELEASE-REPORT.md) para el alcance y las comprobaciones realizadas y pendientes.

## Iniciar

Necesitas Python 3 y un navegador moderno. Sin cuentas, claves, dependencias de producción ni servicios externos.

- Windows: extrae el proyecto y ejecuta `INICIAR-WINDOWS.bat`.
- Linux: `chmod +x INICIAR-LINUX.sh` y `./INICIAR-LINUX.sh`.
- Alternativa: `python3 -m http.server 8044 --bind 127.0.0.1`; abre `http://localhost:8044/`.
- Mantén abierto el servidor. Mantener el puerto 8044 conserva el origen de los guardados. Exporta un JSON antes de cambiar de dirección o navegador.
- GitHub Pages sirve la raíz del proyecto; todos los recursos usan rutas relativas compatibles con subdirectorios. No hay backend, service worker ni instalación PWA.

## Identidad y presentación

Piedra oscura, hueso tallado, latón envejecido y luz de marea. Un sello original une el nombre de la expedición, cuatro retratos y once ilustraciones vectoriales de criaturas en Canvas y cuatro relieves arquitectónicos distintos: sepulcro, biblioteca inundada, astrolabio y osario. Se pueden regenerar con `python3 tools/create-environment-art.py`. La arquitectura WebGL incorpora vanos de arco apuntado, tracerías y columnas: libros en la Biblioteca, marcas de astrolabio en el Laberinto y nichos óseos en el Osario.

La vista ocupa el centro. La compañía, el mapa y la cordura permanecen accesibles; el códice reúne Juramento, Inventario, Códice y Ajustes y partida. Las artes y recursos adicionales se despliegan bajo las cuatro acciones principales. El diseño se adapta a una columna y retratos en dos columnas en pantallas estrechas.

El modo Canvas conserva el arte procedural como recuperación si no carga una ilustración. WebGL mantiene las seis esculturas GLB y sus animaciones procedurales; esta revisión no incorpora rig esquelético ni texturas PBR. Las ilustraciones nuevas son SVG originales editables, sin fuentes ni servicios remotos.

## Combate y especialidades

Selecciona un personaje con 1–4 o su retrato. Cada personaje tiene una especialidad en el botón principal o con Enter cuando el foco está en el juego. Leer páginas, seleccionar un héroe y girar no consumen turnos. Avanzar, atacar y usar habilidades ejecuta la respuesta enemiga.

| Personaje | Especialidad | Coste y recuperación |
| --- | --- | --- |
| Aldric | Juramento de hierro: intercepta los golpes de una fase y bloquea 6 PV de cada uno | 3 turnos tras el uso |
| Mara | Corte del silencio: daño reforzado adyacente e interrupción de una fase | 4 turnos tras el uso |
| Ilyra | Escarcha del Olvido: daño y congelación hasta dos casillas | 7 PM; 3 turnos tras el uso |
| Borin | Santuario de la marea: reduce en 3 PV cada golpe durante tres fases, incluida la de lanzamiento | 6 PM; 3 turnos tras el uso |

Los conjuros antiguos siguen disponibles en el desplegable, con sus costes y reglas anteriores. Una especialidad sin objetivo, sin maná o en recuperación no consume un turno.

La barra bajo la escena muestra enemigos en línea de visión, vida, fase y ataques preparados. Los jefes preparan golpes fuertes; por debajo de la mitad de vida lo hacen con mayor frecuencia y fuerza. El Confesor pierde su armadura en fase II, el Bibliotecario aumenta el drenaje y el Archivista gana alcance. Interrumpir, congelar o romper la línea de visión son alternativas a recibir el golpe; la protección del grupo también ayuda.

## Juramentos de progreso (v6.1)

Al llegar al nivel 2, cada aventurero elige una vez en Inventario: Bastión (+6 PV máximos y +1 defensa) o Filo (+2 daño y un refuerzo adicional a su especialidad: bloqueo para Aldric, corte para Mara, escarcha para Ilyra, Santuario para Borin). Elegir no consume turno. Los guardados anteriores conservan el esquema 16 y pueden elegir cuando cumplan el requisito.

## Patrones de jefes y combate

Las fases II conservan señales legibles y ahora usan avisos propios por jefe. El Primer Nombre alcanza dos casillas despejadas en fase II; la barra de amenaza anticipa ese alcance y no muestra ataques tras los muros. En WebGL, un sigilo dinámico distingue fase activa y golpe preparado. Las señales de impacto duran más para que se perciban al jugar.

## Ecos, reliquias y desenlaces v6.4

Cuatro cámaras secundarias, una por profundidad, ofrecen una elección única: conservar el recuerdo (recuperas algo de cordura o lucidez) o tomar una reliquia de un uso. La Linterna recupera 15 de cordura; el Espejo protege durante la siguiente fase enemiga; la Brújula recupera 2 de lucidez; la Campana interrumpe enemigos visibles hasta a dos casillas. La Campana no se consume si no encuentra un objetivo. La elección de eco no cuesta turno; el Espejo y la Campana sí desencadenan la respuesta enemiga.

Conservar los cuatro ecos y llegar al final con al menos 4 de Lucidez abre «La Catedral recuerda». Si se cumplen simultáneamente las condiciones de otro desenlace, la ruta de los cuatro recuerdos prevalece; con menos de cuatro recuerdos, se aplican las rutas de ritual existentes. Todo se persiste en el esquema 16 con campos opcionales; los guardados antiguos se migran sin reiniciarse.

## Altares de entrada (v6.1)

Al entrar en cada profundidad, el altar de (1,1) ofrece una elección única: recuperar 12 de cordura o recoger una esencia. Puedes regresar antes de descender. La elección se guarda y no consume turno.

## Controles y accesibilidad

- W/S o flechas arriba/abajo: avanzar y retroceder. A/D o flechas izquierda/derecha: girar. Q/R: paso lateral.
- Espacio: atacar; G: defender; Enter: especialidad; E: interactuar.
- F: conjuro; B: Santuario; C: Escarcha; V: Pulso; H: poción; J: esencia; T: descansar; N: pergamino.
- Z: buscar; X: desactivar trampas; I: investigar; O: rito; K: leer tomo; L: recuperar cordura; U: manuscrito; Y/P: sellar/escuchar marea; M: mostrar/ocultar mapa.
- Las pestañas admiten flechas izquierda/derecha, Inicio y Fin. Los botones mantienen su activación nativa con teclado. La guía abierta bloquea atajos de juego.
- Ajustes y partida contiene el selector WebGL/Canvas, guardado/carga, JSON y mezclador de audio. La barra superior conserva ayuda, viñeta, fluidez y pantalla completa.

La cordura es compartida. Modifica la atmósfera y las posibilidades narrativas; no bloquea controles ni oculta los indicadores de juego. El medidor expone su valor accesible. Se respeta la preferencia de movimiento reducido en la interfaz.

## Guardados y finales

Se conserva la clave `dungeon404-save-v16` y el esquema 16. Las propiedades tácticas nuevas son opcionales y validadas: recuperación de habilidades, fase de jefe e interrupción. Las migraciones anteriores permanecen. Usar habilidades y cargar una partida mantienen sus recuperaciones y avisos de ataque.

- **La Catedral recuerda:** conserva los cuatro recuerdos de eco y termina con al menos 4 de Lucidez; tiene prioridad sobre las otras rutas.
- **El Silencio:** ruta estándar.
- **El Pacto de la Marea:** rito de la Cripta completado y Marea sellada.
- **El Sueño Invertido:** Marea escuchada, ambos manuscritos y al menos 4 de Lucidez al terminar.

Las oportunidades cercanas aparecen bajo la escena: leer, descifrar, buscar mampostería y abrir umbrales. Las decisiones de altar y eco llevan al Juramento o Códice. Los testimonios y tomos muestran sus costes antes de leer; consultar estas señales no consume turnos.

La interfaz explica los costes y consecuencias antes de confirmar la decisión irreversible del altar. Los desenlaces son variantes narrativas, sin cinemáticas nuevas.

## Comprobaciones

Ejecuta todos los scripts de reglas y contratos con Node:

```sh
for test in tests/*.js; do node "$test" || exit 1; done
```

`tests/browser-lab.html` ofrece escenarios reproducibles de las cuatro plantas y un jefe en fase II, una vista de 390 px y una medición de dibujo. Utiliza la interfaz real; restaura el guardado anterior tras cargar cada escenario. No pulses Guardar en un escenario si deseas conservar tu partida local. Este banco es para revisión manual, no una prueba automática de navegador.

La instrumentación informa tiempo CPU de dibujo y frecuencia observada en el navegador que la ejecuta; no mide GPU ni certifica rendimiento en un equipo físico. El informe de entrega detalla la revisión de Canvas y la indisponibilidad de WebGL en el navegador compartido.

## Auditoría v6.6

52 scripts Node cubren reglas, cuatro rutas narrativas, migraciones, arte y recuperación de render. Las regresiones de v6.6 comprueban transiciones musicales interrumpidas, límite de efectos simultáneos, rechazo limpio de JSON mal formado, trampas de la cuarta profundidad, oportunidades contextuales y liberación de recursos WebGL. La clave y esquema de guardado siguen siendo 16.

Para la auditoría actual de navegador, ejecuta `npm install --no-save --package-lock=false playwright@1.56.1`, `npx playwright install chromium` y `node tests/browser-audit.cjs`. Usa un perfil aislado y una ruta HTTP `/DUNGEON-404/`; prueba botones, menús, las cuatro profundidades, un jefe, móvil 390/320 px, descarga/importación JSON y captura PNG del laboratorio. Deja capturas y un informe en un directorio temporal. El job `browser-audit` de Actions conserva estos archivos como artefacto. Los scripts Python con versiones antiguas en su nombre son comprobaciones históricas; el punto de entrada actual es `browser-audit.cjs`.

Los 34 OGG son locales: 14 pistas de exploración/combate/jefes/ambiente y 20 efectos. El sonido se activa con un clic del jugador; los navegadores restringen el inicio automático. Una prueba de decodificación no sustituye una escucha crítica ni una partida humana completa.
