# Esquema de datos · referencia rápida (v0.4)

Ver la versión completa y comentada en `docs/ESQUEMA-DATOS.md`. Resumen:

`projects_data.json` es un array; un objeto por proyecto:

```json
{
  "id": "string — único; necesario para caminos y seseras",
  "title": "string",
  "status": "running | idle",
  "categoria": "una de las áreas de species.json",
  "deque": "de qué va, 1 frase",
  "ultimo_avance": "lo último hecho",
  "proximo_paso": "siguiente paso, o — si está cerrado",
  "temas": ["etiqueta1", "etiqueta2"],
  "msgs": 0,
  "actividad": "alta | media | baja",

  "waiting_on": "user | system | internet | physical | external_person | none",
  "superseded_by": "id-o-título del proyecto que lo relevó",
  "camara": "reina | despensa | granero | guarderia | vertedero | tuneles",
  "links": ["https://..."],
  "depends_on": ["id-o-título"],
  "related": ["id-o-título"]
}
```

Los campos desde `waiting_on` en adelante son **opcionales v0.4** — compatibles hacia atrás.

---

`species.json` es un objeto `área → {k, c, name, emo, fn, anchor:[x,y], air?}`.
Especies válidas (`k`): ant, beetle, butterfly, spider, bee, scorpion, centipede, dung, snail,
dragonfly, ladybug, mite, mantis.

**Casta:** se deriva por keywords ponderadas (title×3, temas×2, deque×1) contra `motor/castas.json`.
La casta codifica la **utilidad** del proyecto; si no hay match, se usa la `casta_base` de la especie.

**Las 6 cámaras:** reina · despensa · granero · guarderia · vertedero · tuneles.
Si el proyecto no tiene `camara`, `build.py` la deriva por estado y rol.

Al recopilar con `session_info`: `temas[0]` es la palabra clave que se ve en la colonia;
`msgs: 0` marca sesiones sin transcripción (bicho atenuado / sin rastro).
