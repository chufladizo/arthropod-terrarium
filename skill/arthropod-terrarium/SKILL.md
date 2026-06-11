---
name: arthropod-terrarium
description: Convierte los proyectos/sesiones del usuario en un terrario visual de artrópodos. Cada área es una especie (colonia con una reina) y cada proyecto un bicho; tocar la reina entra en la colonia, y tocar un bicho abre su ficha (de qué va, último avance, próximo paso, temas). El estado se ve por color (activa/pendiente/atascada/hibernando/relevada), la actividad por el tamaño, lo que necesita por iconos (🍴 hambre, ❓ sin rumbo) y si está vivo/dormido/relevado por la postura. La casta (utilidad del proyecto) se deriva automáticamente vía castas.json. Los bichos viven en 6 cámaras por colonia; las lentes permiten filtrar por estado, necesidad o cámara. Úsala cuando el usuario pida ver sus proyectos o sesiones "como bichos", "terrario", "bestiario", "colonias" o "modo artrópodo", o quiera un mapa visual ilustrado sin paneles ni cuadrículas. NO la uses para gráficos de datos abstractos sin relación con sus proyectos.
---

# Terrario Vivo · skill

Genera un panel HTML **estático y autocontenido** donde los proyectos son artrópodos en colonias.
Flujo: jardín de colonias → entrar en una colonia → ficha de un bicho. Poco texto, muy ilustrativo.

## Cuándo se activa

"modo terrario", "bestiario", "colonias", "ver mis proyectos como bichos", "modo artrópodo",
"un mapa visual de todo lo que hago".

## Arquitectura

El motor vive en `motor/` del repo:

- `template.html` — plantilla con tres marcadores: `/*__CRITTERS__*/`, `/*__DATA__*/` y `/*__FONDOS__*/`.
- `critters.js` — define `critV2(key, {color, caste, vital})` para las 13 especies.
- `build.py` — calcula el estado de cada proyecto, deriva casta (via `castas.json`) e inyecta todo en la plantilla.
- `castas.json` — motor de derivación de casta por keywords ponderadas (title×3, temas×2, deque×1).

Datos: una taxonomía (`species.json`) y una lista de proyectos (`projects_data.json`).
Esquema y convenciones en `docs/ESQUEMA-DATOS.md`, `docs/TAXONOMIA.md` y `docs/DISENO.md`.

## Las 6 cámaras

Cada bicho vive en una de las 6 cámaras de su colonia:
**reina · despensa · granero · guarderia · vertedero · tuneles**.
Se puede forzar con el campo `camara`; si no, `build.py` la deriva por estado y rol.

## Las lentes

Filtros visuales que se activan desde el terrario para ver el jardín desde distintos ángulos:
por **estado** (activas, bloqueadas, hibernando…), por **necesidad** (🍴 / ❓),
o por **cámara** (todas las despensas, todos los vertederos…).

## Campos opcionales v0.4

El esquema acepta campos nuevos sin romper nada existente:
`waiting_on` (refina badge según quién bloquea), `superseded_by` (traza caminos de relevo),
`camara` (fuerza cámara), `links` (URLs externas), `depends_on` y `related` (caminos entre bichos).
Ver `reference/data_schema.md` para la referencia rápida y `docs/ESQUEMA-DATOS.md` para el detalle.

## Pasos para construir / actualizar

1. **Datos.** Si no hay `projects_data.json`, recopílalo con `session_info`
   (`list_sessions` → `read_transcript` con límite ~18 mensajes → resumir cada sesión según el
   esquema). Mapea cada sesión a un área (`categoria`).
2. **Construir.** `python3 motor/build.py <carpeta_datos> <salida.html>`.
3. **Verificar.** `node motor/verificar.js <salida.html>` → debe dar `VERIFY: PASS`
   (una reina por colonia, todos los bichos pintados, ficha abre, 0 errores).
4. **Entregar.** Registrar el HTML como artefacto y dejar los archivos en el repo.

## Reglas que NO se improvisan

El estado (activa / pendiente / atascada / hibernando / relevada / sin rastro), la vitalidad
(ok / sleep / dead) y la necesidad (🍴 / ❓) los calcula `build.py` a partir de los datos.
No los pongas a mano. Ver `docs/DISENO.md`.

## Instalación

Esta carpeta (`skill/arthropod-terrarium/`) es la skill instalable. En Claude / Cowork se añade
desde **Settings → Capabilities** (botón de guardar skill). No se puede instalar desde dentro de
una sesión.

> **Nota:** este es el esqueleto de la skill. Para empaquetarla, incluye junto a este `SKILL.md`
> una carpeta `assets/` con copias de `template.html`, `critters.js` y un `species.json` de
> ejemplo (puedes copiarlos de `motor/` y `ejemplo/`).

## Seseras (memoria como hábitat, opcional)

Tras construir, `python3 motor/seseras.py <salida.html> <carpeta_colonias>` genera un `.md` por bicho
(solo activos/atascados/hambrientos) en `colonias/<especie>/bichos/<id>.md`. No sobrescribe lo editado
a mano (idempotente). Es opt-in y privado (gitignored).

## Fan-out evolutivo por especie

El diseño evoluciona por especie. Para afinar una colonia (p.ej. hormigas) y propagar el patrón:
1. Edita las castas de la especie en `motor/castas_src/<especie>.json` y sincroniza `motor/castas.json`.
2. Ajusta su anatomía en `motor/critters.js` (`crit_<especie>`), reusando los helpers comunes
   `shade/legs/eye` (definidos una sola vez al inicio).
3. Reconstruye y verifica: `npm run build && npm run verify` (o `npm run todo`).
La casta codifica la UTILIDAD; el render de cada especie debe reconocer sus IDs funcionales de
`castas.json` (ver el mapa `sp`→forma anatómica del ciempiés como ejemplo de referencia).
