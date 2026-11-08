# Auditoría de controles — DUNGEON 404 v6.5

## Diagnóstico

No se reprodujo un fallo general de listeners en la v6.5 publicada. Chromium mostró la partida funcionando y los controles probados actualizaron el mapa, el turno, los mensajes o el estado visible.

Los aparentes «no hace nada» tienen explicaciones observadas en el flujo actual:

- El bloque «Artes, exploración y recursos» es un `<details>` plegado inicialmente. Sus acciones no se pueden pulsar hasta desplegarlo.
- Varias acciones dependen del personaje activo (Pulso, Escarcha, Santuario, conjuro, desactivar trampa) o de posición, objetivo y recursos disponibles. Si no se cumple el requisito, la acción responde en el diario y normalmente no consume turno.
- La guía «Cómo sobrevivir» es un diálogo modal: mientras está abierta, los controles de detrás quedan bloqueados hasta cerrarla.
- El laboratorio gráfico informa que WebGL no está disponible en el navegador de prueba. El cambio de modo sigue respondiendo y pasa a Canvas 2.5D.

No se encontró registro de Service Worker. El HUD, adornos del visor y pseudo-elementos examinados usan `pointer-events:none`; no apareció una capa CSS que interceptase los clics. Los errores de consola observados venían de una extensión del navegador, no de los scripts de la aplicación.

Se detectó un riesgo concreto de despliegue: `index.html` cargaba scripts con la clave de caché `v=64` y el laboratorio mezclaba recursos sin versión y `v=39`, aunque el proyecto ya era v6.5 / laboratorio v3.9. Se actualizaron las URLs locales a `v=65` para que cada despliegue use un conjunto coherente de archivos. No se afirma que la caché fuera la causa demostrada del reporte: no se pudo reproducir ese fallo concreto.

## Comprobaciones

- En la v6.5 publicada, interacciones con navegación de pestañas, mapa, controles de movimiento, ataque, defensa, poderes, investigación, altar, guía, presentación, audio, volumen y modos gráficos.
- En el laboratorio publicado, cambio de motor, profundidad y criatura, galería, GLB, animación, movimiento, reinicio y ataque.
- No se pulsaron guardar/cargar/importar/exportar en el sitio publicado para evitar modificar el almacenamiento persistente de una partida. El código conserva dichos controles y la suite existente comprueba serialización y migración.
- La copia local corregida no se pudo abrir en el navegador compartido (`ERR_BLOCKED_BY_CLIENT`); por ello el navegador real valida la v6.5 publicada antes del cambio de URL de caché, mientras que el paquete corregido se valida mediante la suite local y la comprobación de rutas.
- El navegador de prueba no proporcionó WebGL físico. Se observó el fallback Canvas; la renderización GPU real queda sin verificar.

## Archivos corregidos

- `index.html`: clave de caché v6.5 en scripts locales.
- `art-lab.html`: claves de caché v6.5 y título sincronizado con v3.9.
- `tests/v25-audio.js`: evita fijar una clave de caché obsoleta.
- `tests/ui-contract.js`: verifica selectores, listeners, IDs, rutas relativas de Pages, parámetros de caché y ausencia de Service Worker.
- `CHANGELOG.md` y `RELEASE-REPORT.md`: diagnóstico y alcance de verificación.
