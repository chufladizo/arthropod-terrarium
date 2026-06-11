# Sistema de diseño · v0.4

El terrario tiene reglas fijas para que **todo se lea en el dibujo**, con poco texto. Si adaptas el
proyecto, respeta estas convenciones (o el demo dejará de tener sentido).

---

## Flujo: reina → colonia → detalle

1. **Jardín** — todas las colonias a la vez. Cada una es una **reina** grande con su silueta y su
   nombre. Nada de cuadrículas ni ventanas: es un paisaje.
2. **Colonia** — tocas la reina y entras en su nido: un **corte transversal subterráneo** con sus
   6 cámaras. Cada bicho aparece en la cámara que le corresponde.
3. **Ficha** — tocas un bicho y se abre su detalle: de qué va, último avance, próximo paso, temas.

---

## Los 6 ejes

Toda la información del bicho se codifica en su forma dibujada. No hay texto de estado.

### 1. Silueta = colonia

La silueta del bicho identifica su especie → su colonia → su área de trabajo. Un `ant` siempre
es del área que asignaste a `ant` en `species.json`.

### 2. Forma / casta = utilidad

La **casta** codifica **qué tipo de trabajo es** el proyecto (su utilidad), no su actividad.

Cada especie tiene sus castas propias en `motor/castas.json`:

```json
{
  "ant": {
    "casta_base": "obrera",
    "castas": [
      { "id": "soldado", "keywords": ["defensa", "seguridad", "bloqueo"] },
      { "id": "recolectora", "keywords": ["datos", "scraping", "importar"] }
    ]
  }
}
```

El motor puntúa cada proyecto contra los keywords con peso:
`título × 3 · temas × 2 · deque (últimas entradas) × 1`

Gana la casta con mayor score. Si nada hace match → `casta_base` (cuerpo genérico).
Las formas de cada casta están dibujadas en `motor/critters.js`. Las fuentes de diseño por especie
viven en `motor/castas_src/`.

### 3. Color = estado

| Estado | Color / apariencia | Regla de datos |
|--------|-------------------|----------------|
| Activo | verde + **halo** | `status: running` |
| Pendiente | naranja | tiene `next_step` |
| Atascado | rojo | `next_step` + texto de bloqueo |
| Hibernando | gris + 💤 | sin `next_step`, con contenido |
| Relevado | gris + 💀 boca arriba | duplicado superado por otro |
| Sin rastro | gris atenuado | `msgs: 0` |

### 4. Tamaño = actividad

`alta` → bicho grande · `media` → mediano · `baja` → pequeño.
Tres tallas, no gradiente continuo.

### 5. Postura = vitalidad

- **De pie** — vivo, en algún estado activo.
- **Dormido** (enroscado, patas recogidas) — hibernando.
- **Boca arriba** (patas al aire) — relevado / muerto.

### 6. Badge = necesidad

Aparece sobre el bicho cuando lo necesita:

- 🍴 **Hambre** — espera una acción tuya (decidir, confirmar, responder...).
- ❓ **Confuso** — vivo pero sin próximo paso claro.

Sin badge → el bicho no necesita nada ahora mismo.

---

## Las 6 cámaras

La vista de colonia es un **corte transversal subterráneo**. Los nombres de las cámaras
pueden variar por especie (definidos en `castas.json`), pero la función es siempre la misma:

| Cámara | Función |
|--------|---------|
| 🏛 **Reina** | Núcleo de la colonia — la reina y los proyectos más centrales |
| 🍖 **Despensa** | Contexto activo — lo que se consume ahora mismo |
| 🌾 **Granero** | Almacén / lo hecho — resultados y entregables |
| 🥚 **Guardería** | En construcción — proyectos en desarrollo |
| 🗑 **Vertedero** | Archivo muerto — relevados, abandonados |
| 🕳 **Túneles** | Enlaces — conexiones explícitas con otras colonias |

Un bicho vive en la cámara que mejor describe su estado actual.
La cámara es parte del **hábitat** (la memoria del proyecto vive aquí como sesera .md).

---

## Las lentes del jardín

En el overview se pueden activar lentes para ver patrones sin salir de la metáfora:

| Lente | Qué resalta |
|-------|------------|
| 🍴 **Comedero** | Colonias con bichos hambrientos (badge 🍴) |
| 🍂 **Compost** | Colonias con muchos dormidos y muertos |
| 🧵 **Caminos** | Líneas entre colonias: **sólidas** = relación explícita en datos, **punteadas** = afinidad por keyword compartida |

Las lentes no cambian el dibujo base: solo superponen información. El jardín sigue siendo un jardín.

---

## Necesidades

- 🍴 **hambre** — el bicho espera una acción tuya (decidir, confirmar, responder...).
- ❓ **confuso** — vivo pero sin próximo paso claro.

---

## La metáfora del hábitat

El vocabulario del terrario tiene una capa anatómica:

- **El entorno** = el ordenador (la tierra del terrario).
- **Las patas** = la LAN / red local (lo que pisa el suelo de casa).
- **Las alas** = internet / la net. Solo las especies voladoras: `butterfly`, `bee`, `dragonfly`.
- **La cabeza** = la sesera (la memoria del proyecto).

Una colonia **sin alas es local-first**: vive en la tierra, no mira hacia fuera.
Una colonia con alas tiene presencia en la red.

---

## Principios

- Poco texto, muy ilustrativo. Pensado para que dé gusto mirarlo.
- Sin cuadrículas, sin ventanas tipo dashboard: es un jardín, no una hoja de cálculo.
- Un único HTML autocontenido: funciona sin conexión y sin servidor.
- Memoria = hábitat: la sesera de un bicho vive en su cámara, no en una base de datos.

---

## Diseño evolutivo por especie

La idea: afinar el dibujo de **una** especie (su anatomía, sus castas, su metáfora) y luego
propagar ese mismo cuidado especie por especie. Cada colonia puede tener su propio carácter
visual sin romper estas reglas comunes.

Las fuentes de diseño por especie (referencias, bocetos, decisiones) viven en `motor/castas_src/`.

## Notas (v0.4.3)

- **Solape de keywords entre especies**: un mismo termino puede aparecer en castas de varias especies
  sin conflicto — la asignacion opera solo dentro de la especie del area del proyecto.
- **Desempate por posicion**: si dos castas empatan en score, gana la que aparece primero en `castas[]`.
  El orden tiene significado: las castas mas genericas suelen ir primero.
- **`castas_src/<especie>.json`** es la fuente editada por especie; **`castas.json`** es el consolidado.
  Edita ambos en sincronia (o usa el fan-out por especie).
- **Helpers de dibujo** `shade/legs/eye` se definen UNA sola vez al inicio de `critters.js` (grosor de
  patas canonico 3.2). No los redefinas por especie.
