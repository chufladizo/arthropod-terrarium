# Jardín de ejemplo (ficticio)

Datos **inventados** (un estudio indie imaginario). Sirven para dos cosas:

1. **Ver el demo** sin configurar nada (`demo/index.html` se genera de aquí con `npm run build`).
2. **Plantilla de partida**: copia estos dos archivos a tu carpeta privada `../tierra/datos/`.

```bash
mkdir -p ../tierra/datos
cp species.json projects_data.json ../tierra/datos/
```

## Qué contiene (pensado para lucir v0.4)

- `species.json` → 8 colonias (Web, Backend, Infra, Datos, Negocio, Hardware, Redes, Meta).
- `projects_data.json` → 22 proyectos elegidos para que se vea **todo** el sistema:
  - **Los 6 estados:** activo (halo verde), pendiente (naranja), atascado (rojo),
    hibernando (💤), relevado (💀) y sin rastro (atenuado).
  - **Castas variadas** (21 distintas): los títulos/temas casan con las castas de
    `motor/castas.json`, así cada bicho tiene su forma según su utilidad.
  - **Cámaras:** los bichos se reparten por despensa, granero, guardería, vertedero y túneles.
  - **Badges según `waiting_on`:** 🍴 cuando espera algo de ti
    (`user`/`external_person`/`physical`); mudo cuando depende del PC o la red
    (`system`/`internet`).
  - **Caminos:** ~12 relaciones (`depends_on`, `related`, `superseded_by` y un duplicado)
    que dibuja la lente 🧵.

No hay datos reales de nadie. Cámbialo entero sin miedo.
