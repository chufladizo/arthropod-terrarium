# Esquema de datos — `projects_data.json` · v0.4

Un **array** JSON. Un objeto por proyecto:

## Campos base (obligatorios u opcionales existentes)

| campo           | tipo       | descripción |
|-----------------|------------|-------------|
| `id`            | string     | identificador único — necesario para caminos, enlaces y seseras |
| `title`         | string     | título (si dos coinciden, el más activo gana; el otro queda *relevado* 💀) |
| `status`        | string     | `"running"` (halo verde) o `"idle"` |
| `categoria`     | string     | una de tus áreas — debe existir en `species.json` |
| `deque`         | string     | de qué va, en una frase |
| `ultimo_avance` | string     | lo último hecho |
| `proximo_paso`  | string     | siguiente paso; `"—"` si está cerrado |
| `temas`         | string[]   | 2–5 etiquetas; `temas[0]` es la palabra clave visible en la colonia |
| `msgs`          | number     | nº de mensajes/actividad registrada; `0` = sin rastro (bicho atenuado) |
| `actividad`     | string     | `"alta"`, `"media"` o `"baja"` → controla el **tamaño** del bicho |

## Campos nuevos opcionales · v0.4

Todos compatibles hacia atrás: si no están presentes, no pasa nada.

| campo           | tipo       | descripción |
|-----------------|------------|-------------|
| `waiting_on`    | string     | `"user"` \| `"system"` \| `"internet"` \| `"physical"` \| `"external_person"` \| `"none"` — refina el badge de necesidad (ver abajo) |
| `superseded_by` | string     | id (o título) del proyecto que lo relevó → bicho queda *relevado* y se traza un camino |
| `camara`        | string     | fuerza la cámara del bicho: `"reina"` \| `"despensa"` \| `"granero"` \| `"guarderia"` \| `"vertedero"` \| `"tuneles"` — si no se pone, `build.py` la deriva |
| `links`         | string[]   | URLs externas asociadas al proyecto |
| `depends_on`    | string[]   | ids o títulos de proyectos de los que depende → caminos "depende de" |
| `related`       | string[]   | ids o títulos de proyectos relacionados → caminos "relacionado con" |

### `waiting_on` y el badge de necesidad

La anatomía del bicho da pistas: **patas = LAN**, **alas = internet**, **entorno = el PC**.

| valor             | badge | lógica |
|-------------------|-------|--------|
| `user`            | 🍴 hambre | espera una acción tuya |
| `external_person` | 🍴 hambre | espera que otra persona actúe |
| `physical`        | 🍴 hambre | depende del mundo físico |
| `system`          | *(mudo)* | depende del PC / proceso local — no depende de ti |
| `internet`        | *(mudo)* | depende de un servicio externo — no depende de ti |
| `none`            | *(sin badge)* | ningún bloqueo |

---

## Cómo se decide el estado (lo calcula `build.py`, no lo pongas a mano)

- **activa** 🟢 — `status: "running"`.
- **atascada** 🔴 — tiene próximo paso y el texto huele a bloqueo (*error, límite, caído, timeout…*).
- **pendiente** 🟠 — tiene próximo paso.
- **hibernando** 💤 — sin próximo paso pero con contenido (terminado / en pausa).
- **relevada** 💀 — superada por otro proyecto (`superseded_by`) o duplicado con igual título.
- **sin rastro** — `msgs: 0` (bicho gris atenuado).

**Vitalidad** (postura del bicho): `ok` | `sleep` | `dead` — se deriva del estado, no se pone a mano.

Y la **necesidad**:

- 🍴 **hambre** — el próximo paso espera algo de ti o de alguien (ver `waiting_on`).
- ❓ **confuso** — está vivo pero sin próximo paso claro.

---

## Derivación de casta

`build.py` pondera keywords contra `motor/castas.json`:
**title × 3 · temas × 2 · deque × 1** → la casta con mayor puntuación gana.
Si ninguna supera el umbral, se usa la `casta_base` de la especie.
La casta codifica la **utilidad** del proyecto (investigación, construcción, mantenimiento…).

---

## Las 6 cámaras

Cada bicho vive en una cámara de su colonia según su rol y estado:

| cámara       | quién vive aquí |
|--------------|-----------------|
| `reina`      | la reina de la colonia (un bicho por especie) |
| `despensa`   | proyectos activos con recursos disponibles |
| `granero`    | proyectos completados / hibernando con valor acumulado |
| `guarderia`  | proyectos nuevos o en incubación |
| `vertedero`  | proyectos relevados o sin rastro |
| `tuneles`    | proyectos bloqueados o en espera |

---

## Ejemplo mínimo con campos v0.4

```json
[
  {
    "id": "p-001",
    "title": "Mi primer proyecto",
    "status": "running",
    "categoria": "Web / Frontend",
    "deque": "Una landing para el lanzamiento",
    "ultimo_avance": "Hecha la portada",
    "proximo_paso": "Decidir la paleta de color",
    "temas": ["landing", "diseño"],
    "msgs": 5,
    "actividad": "media",
    "waiting_on": "user",
    "depends_on": ["p-002"],
    "links": ["https://figma.com/mi-diseno"]
  },
  {
    "id": "p-002",
    "title": "Guía de marca vieja",
    "status": "idle",
    "categoria": "Web / Frontend",
    "deque": "Guía de marca que ya fue relevada",
    "ultimo_avance": "Versión 1 entregada",
    "proximo_paso": "—",
    "temas": ["marca", "diseño"],
    "msgs": 3,
    "actividad": "baja",
    "superseded_by": "p-001",
    "camara": "vertedero"
  }
]
```

## Notas (v0.4.3)

- **`tuneles`** como camara corresponde a castas con afinidad de integracion/interconexion entre
  sistemas (o `camara: "tuneles"` explicito); no es "proyectos bloqueados".
- **`proximo_paso`**: `""` (vacio) equivale a `"—"` (sin proximo paso).
- **`waiting_on`**: omitir el campo activa la heuristica de texto para el badge; `"none"` (o `""`) la
  desactiva explicitamente. Valores: user | system | internet | physical | external_person | none.
- El build valida el contrato minimo y avisa (no aborta) ante `categoria` desconocida, `status` no
  estandar, `camara` invalida o `id` duplicado.
