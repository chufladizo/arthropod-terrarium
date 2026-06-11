# Imagenes ambientales del Terrario Vivo

Fondos raster del terrario. Los bichos, castas, estados, cámaras e iconos siguen
siendo SVG/codigo (deterministas); estas imagenes solo aportan ambiente.

| Archivo | Donde se usa |
|---|---|
| `terrarium-overview.png` | Fondo del jardin general (vista de reinas) y lente Caminos. |
| `feeder-action.png` | Fondo de la lente Comedero (🍴). |
| `compost-archive.png` | Fondo de la lente Compost (🍂). |
| `colony-chambers.png` | Fondo de la vista de colonia (corte transversal). |

## Como estan cableadas (autocontenido)
`motor/fondos.py` comprime estos PNG a JPEG ligero (`opt/*.jpg`, ~1280px) y los
embebe en **base64** dentro de `motor/fondos.css`. `motor/build.py` inyecta ese
CSS en el marcador `/*__FONDOS__*/` de la plantilla, asi el HTML final sigue
abriendose **sin conexion** (todo va dentro del archivo).

Para cambiar los fondos: sustituye los PNG aqui y ejecuta:
```
python3 motor/fondos.py    # regenera fondos.css
npm run build:personal     # reconstruye el terrario
```
Si borras `fondos.css`, el terrario vuelve a los degradados CSS (sin imagenes).
