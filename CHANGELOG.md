# v6.5 — Interfaz de archivo analógico

- La interfaz adopta el lenguaje de una cinta de campo: tipografía monoespaciada, sintonía de señal, fósforo turquesa, ámbar y violeta, bordes de monitor y texturas de barrido muy suaves.
- La identidad de la Catedral, las ilustraciones y la escena de mazmorra conservan sus colores y arte actuales; el tratamiento retro se limita a controles, paneles, diario y códice.
- El efecto es estático y ligero, sin filtros sobre Canvas/WebGL, fuentes remotas ni cambios de jugabilidad.
- Se mantienen focos visibles, tamaños táctiles y reglas de movimiento reducido.

# v6.4 — Reliquias de eco y la memoria de la Catedral

- Las cuatro cámaras de eco ahora enfrentan conservar memoria o llevarse una reliquia única de un uso.
- Linterna (15 cordura), Espejo (amparo de una fase enemiga), Brújula (2 lucidez) y Campana (interrumpe enemigos visibles a dos casillas).
- El uso de reliquias mágicas consume la respuesta enemiga cuando corresponde; la Campana no se gasta si no encuentra objetivo.
- Nuevo desenlace «La Catedral recuerda»: conservar los cuatro ecos y terminar con al menos 4 de Lucidez.
- Si el desenlace de los cuatro recuerdos y otro desenlace se cumplen a la vez, prevalece la ruta secreta; la interfaz lo explica.
- La pantalla de desenlaces explica la condición; el códice avisa cuando los cuatro recuerdos están preservados.
- Compatible con guardados de esquema 16: los campos nuevos son opcionales y las partidas antiguas se inicializan sin reliquias ni decisiones de eco.
- Pruebas ampliadas para efectos, consumo, interrupción, datos de guardado inválidos, migración y precedencia de finales.

# v6.3 — Ecos de las cámaras sumergidas (rama)

- Cuatro descubrimientos opcionales situados en salas existentes, uno en cada profundidad.
- Elección entre memoria y material; consecuencia única, persistida y sin coste de turno.
- Migración opcional `echoes` compatible con los guardados de esquema 16.
- Revisión del fallback WebGL a Canvas al perder el contexto.

---

# v6.2 — Ecos del segundo sello (rama de revisión)

- Avisos de ataque con texto propio para los cuatro jefes y su fase II.
- El Primer Nombre gana un golpe a distancia de dos casillas despejadas en fase II; el pronóstico respeta paredes.
- Sigilo animado bajo jefes en WebGL; alerta carmesí en el Canvas para golpes preparados.
- Destellos de combate más legibles.
- Prueba de fase, pronóstico, ataque y línea de visión.

---

# v6.1 — Juramentos de progreso (rama de revisión)

- Dos elecciones permanentes al nivel 2 para cada personaje, integradas en Inventario.
- Bastión añade supervivencia; Filo aumenta daño y la especialidad propia.
- Cuatro altares de entrada, uno por profundidad, con elección única de cordura o esencia.
- Campos opcionales compatibles con guardados de esquema 16; pruebas de elección, exclusividad y migración.
- Pendiente revisión WebGL y táctil físico, exportación JSON descargada e importación de archivo real.

---

# v6.0 — La Catedral de la Marea (rama de revisión)

- Identidad medieval cósmica: sello propio, cuatro retratos y once ilustraciones originales de criaturas para Canvas.
- Interfaz reorganizada con cuatro acciones principales, artes desplegables, amenaza visible y códice con navegación por teclado.
- Vanos góticos, columnas, tracerías y mobiliario por profundidad en WebGL; atlas de ventanales en Canvas.
- Especialidades del guerrero y la pícara; acceso rápido a las artes de maga y clérigo con recuperación por turnos.
- Golpes de jefe preparados, segunda fase y diferencias de armadura, drenaje y alcance.
- Conservación del esquema 16, con propiedades tácticas opcionales validadas.
- Confirmación narrativa del altar con costes y consecuencias; guía bloquea atajos mientras está abierta.
- Banco manual de escenarios, medición de dibujo y pruebas de tácticas. CI ejecuta todos los scripts JavaScript de tests.
- Revisión en navegador compartido de Canvas, controles y diseño estrecho; WebGL y rendimiento físico pendientes según RELEASE-REPORT.md.

---

# v5.3 RC4 — Haunted Corridors

- Antorchas montadas en paredes con luz localizada; dejan de aparecer suspendidas en el centro de la ruta.
- Material de piedra con desgaste menos regular y contraste ambiental más oscuro.
- Nervaduras góticas estilizadas en lugar de dinteles cúbicos que invadían el techo.
- Aparición ilusoria de apertura y al perder cordura, sin cambios en combate, colisiones ni guardados.
- Detalles ambientales por profundidad: sangre, glifos y restos óseos.
- Pruebas JavaScript y de contrato visual pasan. Sigue pendiente una inspección real de la escena WebGL en navegador.

# v5.2 RC3 — Descenso reescrito

- Trazados propios para la Biblioteca Sumergida y el Laberinto Olvidado; rediseño del Osario para acercar objetivos y reducir rodeos sin mover los hitos ni los combates existentes.
- Dos sucesos narrativos de horror por profundidad, de aparición única y persistentes en la partida.
- La partida automática completa pasa de 274 a 227 acciones con el mismo guion de juego.
- Nueva prueba de rutas y persistencia añadida a la ejecución continua. Revisión visual WebGL y prueba en hardware real siguen pendientes.

# v5.1 RC2 — Enemigos con identidad

- Siluetas de jefes más reconocibles: corona de plumas giratorias del Bibliotecario, ojos múltiples y apéndices del Archivista, halo fracturado del Primer Nombre y aureola de hierro del Guardián.
- Los detalles se generan con geometría procedural de bajo coste; no requieren descargas, texturas externas ni alteran colisiones, salud o combate.
- Actualizados título, cabecera y pie a v5.1 RC2. Sigue siendo candidata: falta validación visual en navegador y pruebas en hardware real.

# v5.0 RC1 — Midnight Terror

- Modelos esculpidos clásicos activados en la campaña, precarga de los seis GLB y orientación hacia el jugador.
- Piel procedural, luz de contorno, congelación GLB y separación de material dorado/agua.
- Guía, ajustes visuales persistentes y pantalla completa.
- Cadencia objetivo de 30 Hz o 12 Hz, avisos ambientales y de jefes.
- Lanzadores locales y documentación de release actualizados.
- 47 comprobaciones automáticas satisfactorias. Revisión visual de navegador pendiente; consultar RELEASE-REPORT.md.

# DUNGEON 404 v4.6 — Midnight Grindhouse

- Nueva dirección visual de horror pulp ochentero en carmesí, ámbar y negro.
- Presentación cinematográfica con viñeta y textura de película discreta; el HUD conserva su legibilidad.
- Acabado unificado de cabecera, controles, bestiario, party, inventario y paneles.
- Se mantienen los seis modelos GLB y las animaciones por especie de v4.5; no se alteran combate ni guardados.
- La apariencia WebGL sigue necesitando validación en una GPU física; Canvas 2.5D continúa disponible.

## v4.5 — Cosmic Creature Remaster

- Animaciones procedurales diferenciadas para Ahogado, Larva de la Marea, Bibliotecario y criaturas clásicas GLB.
- Poses de desplazamiento, ataque e impacto separadas; sin animación esquelética ni cambios de hitbox.
- Los ataques animados en GLB se restringen a criaturas próximas, evitando que todos los enemigos de la planta ejecuten una animación simultánea.
- Mantiene el catálogo GLB, audio, las cuatro plantas, los tres finales y la estructura de guardados.
- WebGL visual en GPU real aún pendiente; simulación geométrica y campaña testadas.
# v5.4 RC5 — Eldritch Bestiary

- Cuatro criaturas nuevas, una en cada profundidad, con silueta, paleta, ataques y asaltos mentales diferenciados.
- Añadidos apéndices orbitales, rostros múltiples, mapas levitando y alas con ocelos a las formas procedurales WebGL; Canvas incluye variantes visuales propias.
- Los ataques a distancia requieren visión despejada y los asaltos de cordura ocurren como máximo dos veces por criatura.
- Las partidas anteriores reciben las nuevas entidades al migrar, sin resucitar un enemigo vencido que ocupe su casilla.
- Pruebas de campaña, motor, geometría, render alternativo y migración completadas. Falta inspección visual en navegador real.

# v5.4 RC6 — Encuentros que respiran

- Los cuatro horrores cósmicos anuncian su ataque fuerte con un turno de antelación y frases propias.
- Señal visual pulsante sobre la criatura en WebGL y Canvas; el ataque anunciado se puede interrumpir con Escarcha.
- Los ataques anunciados hacen más daño, pero permiten responder con defensa, retirada o control; el estado persiste en partidas guardadas.
- Prueba específica de telegráficos, persistencia e interrupción; suite completa ejecutada.
- Sigue pendiente revisión visual en navegador y prueba humana de dificultad.

# v5.4 RC7 — Reliquias ocultas

- El Nicho del Testigo Ahogado recompensa con lucidez; el Archivo Oculto entrega un sello protector para el siguiente encuentro.
- Los escondites conectan así la exploración con la cordura y el combate, conservando los consumibles en los demás secretos.
- Las reliquias son opcionales y de un solo uso; no alteran objetivos ni bloquean la campaña.
- Suite completa de pruebas ejecutada, incluida prueba de recompensas y persistencia.

# v5.4 RC8 — Ecos de profundidad

- Cuatro momentos narrativos ya existentes ahora tienen efecto mecánico único, temático y persistente: lucidez, pérdida de cordura, esencia o recuperación de cordura.
- No se añaden trampas inevitables ni se modifica la ruta principal. Los sucesos se pueden evitar simplemente no explorando esa casilla.
- Extendida la prueba de rutas para verificar recompensa, guardado y que no se pueda repetir.

