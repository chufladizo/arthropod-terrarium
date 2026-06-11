# Repertorio de artropodos

Este directorio contiene atlas PNG para dar apariencia propia a proyectos y subproyectos del
Terrario Vivo.

## Carpetas

- `raw/`: atlas originales con fondo magenta `#ff00ff`.
- `transparent/`: atlas listos para usar con canal alpha. Usa estos en el motor.
- `sprites/`: cada atlas recortado en 16 PNG individuales (`cell-01.png` ... `cell-16.png`).
- `atlas-manifest.json`: indice de atlas, especie, colonia y celdas de proyecto.

## Convencion de atlas

Cada atlas esta pensado como spritesheet 4x4:

- celda `1` = fila 1, columna 1
- celda `2` = fila 1, columna 2
- ...
- celda `16` = fila 4, columna 4

Para recortar una celda:

```js
const col = (cell - 1) % 4;
const row = Math.floor((cell - 1) / 4);
const cellW = image.width / 4;
const cellH = image.height / 4;
```

Si no quieres implementar recorte todavia, usa directamente:

```text
assets/images/arthropods/sprites/<atlas-id>/cell-01.png
```

## Capas

- `generic-*`: repertorio general para proyectos futuros.
- `projects-*`: bichos disenados para proyectos actuales de Javier.
- `subarthropods-eggs-larvae.png`: subtareas, hijos, ideas, bloqueos pequenos.
- `future-insect-orders.png`: especies extra para colonias futuras.

Los estados siguen viniendo del motor: color, halo, badge, postura y tamano. Estos atlas aportan
la silueta/prop visual del proyecto.

## Como se cablean en el motor (v0.4.2)
`motor/sprites.py` lee este `atlas-manifest.json`, recorta y comprime cada celda usada
(WEBP ~112px) y construye `motor/sprites.json` (pool base64 + indices por proyecto y por reina).
`motor/build.py` lo inyecta en `TERR.sprites`; la plantilla pinta la imagen con el disco de
estado, el halo, la postura, el tamano y el badge que pone el motor. Para depurar en PNG:
`python3 motor/sprites.py png`. Si borras `sprites.json`, los bichos vuelven al dibujo SVG.
