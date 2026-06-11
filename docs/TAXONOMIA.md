# Taxonomía — tus áreas ↔ especies

En `species.json` decides qué **especie** representa cada **área** tuya. Es un objeto donde la
clave es el nombre del área (el mismo texto que pones en `categoria` de cada proyecto):

```json
{
  "Web / Frontend": {
    "k": "butterfly",
    "c": "#9a5cf0",
    "name": "Mariposas",
    "emo": "🎨✨",
    "fn": "interfaces y cosas bonitas",
    "anchor": [80, 20],
    "air": true
  }
}
```

| campo    | qué es |
|----------|--------|
| `k`      | especie (una de las 13, ver abajo) |
| `c`      | color de la colonia (hex) |
| `name`   | nombre que se muestra |
| `emo`    | dos emojis que resumen el área |
| `fn`     | para qué es esa área, en pocas palabras |
| `anchor` | posición `[x, y]` en el terrario, en % (0–100) |
| `air`    | opcional; `true` = la reina vuela (mira hacia *las alas* / internet) |

## Las 13 especies disponibles

`ant` · `beetle` · `butterfly` · `spider` · `bee` · `scorpion` · `centipede` · `dung` ·
`snail` · `dragonfly` · `ladybug` · `mite` · `mantis`

Elige por afinidad, no hay reglas fijas. Algunas ideas:

- **hormigas** → automatización, tareas repetitivas, "fábricas".
- **arañas** → servidores, backends, redes que tejen.
- **abejas** → negocio, dinero, ideas (vuelan).
- **mariposas** → diseño, interfaces, cosas visuales (vuelan).
- **escarabajos** → sistemas, infraestructura, herramientas.
- **escorpiones** → electrónica, hardware, medir.
- **libélulas** → redes, conectividad (vuelan).
- **mantis** → la meta: diseñar el propio terrario.

## Consejos

- Reserva **una** especie para lo "meta" (tu trabajo sobre el terrario): la **mantis** va perfecta.
- Reparte los `anchor` por el lienzo para que no se amontonen.
- Marca con `air` solo las que conceptualmente "miran fuera".
