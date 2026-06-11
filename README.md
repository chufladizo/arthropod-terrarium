# 🦗 Terrario Vivo · v0.5 «gabinete del naturalista»

**Convierte todos tus proyectos en un terrario de artrópodos.** Cada área de trabajo es una
**especie** (una colonia con su **reina**) y cada proyecto es un **bicho**. De un vistazo ves qué
tienes vivo, qué está parado y qué espera algo de ti — sin tablas, sin cuadrículas, muy ilustrado.

> **¿Vienes a ayudar con el diseño?** Empieza por la
> **[Guía de diseño para colaboradores](docs/guia-diseno.html)** (ábrela en el navegador):
> explica los 6 ejes con muestras dibujadas en vivo, la arquitectura, las funciones clave
> del motor, el sistema visual v0.5 y los retos de diseño abiertos.

> Es un panel **HTML estático y autocontenido**: un solo archivo que se abre en cualquier navegador,
> sin servidor y sin conexión. Tú pones tus datos; el motor dibuja el terrario.

---

## ¿Qué es esto?

Una forma distinta de mirar tu trabajo. En vez de una lista aburrida, tus proyectos son criaturas
en un jardín:

- **Entras por la reina** → tocas una colonia y se amplía en corte transversal subterráneo.
- **Ves los bichos en sus cámaras** → cada proyecto vive en la cámara que le corresponde.
- **Abres la ficha** → de qué va, último avance, próximo paso, temas.

El estado se lee *en el dibujo*, no en el texto:

| Lo que ves | Qué significa |
|---|---|
| Silueta de especie | El **área** de trabajo (colonia) |
| Forma/casta del bicho | La **utilidad** del proyecto (qué hace) |
| 🟢 Halo verde | Proyecto **activo** (en marcha ahora) |
| 🟠 Punto naranja | Tiene un **próximo paso** pendiente |
| 🔴 Rojo | **Atascado** (algo falla o bloquea) |
| 💤 Gris dormido | **Hibernando** (terminado o en pausa) |
| 💀 Boca arriba | **Relevado** (duplicado superado por otro) |
| 🍴 / ❓ | Necesita algo: **decisión tuya** / sin rumbo claro |
| Tamaño del bicho | **Actividad** (más grande = más movimiento) |

---

## Las dos capas

```
arthropod-terrarium/    ← MOTOR PÚBLICO — distribuible, vive en git
│  motor/               #   el único builder: build.py + template + critters + castas
│  demo/                #   terrario de ejemplo pregenerado
│  ejemplo/             #   datos ficticios para el demo
│  skill/               #   skill instalable en Claude / Cowork
│  docs/                #   guías
│  package.json
│
tierra/                 ← SESERA PERSONAL — privada, nunca en git
│  datos/               #   tus species.json + projects_data.json
│  terrario.html        #   tu terrario generado
│
colonias/               ← HÁBITATS — seseras .md por bicho (opt-in)
│  hormigas/bichos/
│  arañas/bichos/
│  ...
│
legacy/                 ← JUBILADOS — build_hormigas.py, build_terrario.py, etc.
```

**El motor y tus datos están separados a propósito.** Actualizas el motor sin tocar lo tuyo.
Tus proyectos nunca acaban en el repo público.

---

## Los 6 ejes de lectura

Toda la información del bicho se codifica en su dibujo:

| Eje | Qué codifica |
|---|---|
| **Silueta** | Colonia (a qué especie/área pertenece) |
| **Forma / casta** | Utilidad del proyecto (qué tipo de trabajo es) |
| **Color** | Estado (activo · pendiente · atascado · hibernando · relevado) |
| **Tamaño** | Actividad (alta · media · baja) |
| **Postura** | Vitalidad (de pie = vivo · dormido = pausa · boca-arriba = muerto) |
| **Badge** | Necesidad (🍴 hambre = espera acción tuya · ❓ = sin rumbo claro) |

La **casta** codifica la **utilidad** (no la actividad). Cada especie tiene sus propias castas
definidas en `motor/castas.json` con keywords ponderadas. Si nada hace match, cae en `casta_base`.

---

## Las 6 cámaras (vista de colonia)

Al entrar en una colonia ves un **corte transversal subterráneo**. Los bichos viven en su cámara:

| Cámara | Qué contiene |
|---|---|
| 🏛 **Reina** | El núcleo de la colonia |
| 🍖 **Despensa** | Contexto activo (lo que se está usando ahora) |
| 🌾 **Granero** | Almacén / lo hecho |
| 🥚 **Guardería** | En construcción |
| 🗑 **Vertedero** | Archivo muerto |
| 🕳 **Túneles** | Enlaces entre colonias |

---

## Las lentes del overview

En el jardín general puedes activar lentes que resaltan patrones (sin romper la metáfora):

- 🍴 **Comedero** — resalta colonias con bichos hambrientos.
- 🍂 **Compost** — resalta los dormidos y muertos.
- 🧵 **Caminos** — dibuja líneas entre colonias: sólidas = relaciones explícitas, punteadas = afinidad por keyword compartida.

---

## Cómo se ve

Desde la v0.5 todo es **una sola estética**: lámina de historia natural — papel con grano,
tinta sepia, versalitas, montículos y cámaras dibujadas a tinta. Todo SVG paramétrico,
sin fotos ni webfonts (los sprites fotográficos de la v0.4 se jubilaron).
La mejor forma de verlo es abrir la demo:

```
demo/index.html      ← ábrelo en el navegador
```

Un estudio inventado con 8 colonias y 22 proyectos, pensado para enseñar **todos** los estados, las castas, las cámaras y los caminos de un vistazo. Cuando lo montes con lo tuyo, se verá igual pero con tus cosas.

---

## Arranque rápido

```bash
# Desde arthropod-terrarium/
npm install
npm run build           # construye la demo (ejemplo/ → demo/index.html)
npm run verify          # comprueba que la demo está bien
npm run build:personal  # construye la tuya (tierra/datos → tierra/terrario.html)
npm run verify:personal
```

Guía paso a paso en [`docs/COMO-EMPEZAR.md`](docs/COMO-EMPEZAR.md).

---

## Las 13 especies

`ant` (hormigas) · `beetle` (escarabajos) · `butterfly` (mariposas) · `spider` (arañas) ·
`bee` (abejas) · `scorpion` (escorpiones) · `centipede` (ciempiés) · `dung` (peloteros) ·
`snail` (caracoles) · `dragonfly` (libélulas) · `ladybug` (mariquitas) · `mite` (ácaros) ·
`mantis` (mantis).

Las que vuelan (`butterfly`, `bee`, `dragonfly`) tienen alas: miran hacia fuera, viven en la red.
El resto son **local-first**: sin alas, sin nube. Ver [`docs/DISENO.md`](docs/DISENO.md).

---

## La metáfora completa (opcional, pero bonita)

El terrario también habla de **dónde vive** cada cosa:

- **El entorno** = tu ordenador (la tierra del terrario).
- **Las patas** = tu red local / LAN (lo que toca el suelo de casa).
- **Las alas** = internet / la net (solo las especies voladoras).
- **La cabeza** = la sesera (memoria del proyecto).

Una colonia local-first no tiene alas. Una que vive en la nube, sí.

---

## Licencia

[MIT](LICENSE). Úsalo, trastéalo y comparte tu propio terrario.
