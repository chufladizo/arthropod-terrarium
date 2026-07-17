# Changelog

## 2026-07-18 — Hormigas como especie piloto

- Rediseño anatómico de la hormiga en SVG: patas y antenas articuladas, con una
  silueta más reconocible a tamaño pequeño.
- El sprite moderno distingue ahora siete castas de hormiga mediante forma y
  carga (mandíbulas, hoja, miel, madera, seda o semilla), además del color de
  estado. La casta se conserva en jardín, ficha y corte del nido.
- Cerrado el primer reto de diseño y fijado el patrón para la siguiente especie.

## En desarrollo — robustez y accesibilidad

- Build multiplataforma: `motor/run-python.js` encuentra Python 3 en Windows, macOS y Linux.
- El demo Imperio ya es reproducible desde `ejemplo/imperio_data.json`; no depende de `tierra/`.
- Batería unificada `npm run verify:all` / `npm test` y CI con GitHub Actions.
- Verificadores auxiliares con entrada por defecto y salida limpia de avisos irrelevantes de canvas.
- Navegación por teclado, foco visible y nombres accesibles para nidos y bichos.
- Distribución inicial determinista de unidades y responsive reforzado para HUD, lentes, nidos y kanban.
- Inyección JSON endurecida contra cierres `</script>` procedentes de datos y prueba de regresión automática.
- `build.py` genera por defecto `demo/clasico.html` y una regresión automática impide que vuelva a sobrescribir Imperio.

## v0.4.3 — Auditoria por capas (robustez, ciempies, verificacion)

Mejoras seguras tras una auditoria completa del motor (analisis -> investigacion -> decision -> aplicacion):

### Render / castas
- **Ciempies arreglado:** las 8 castas funcionales (rastreador, indexador, fusionador, ensamblador,
  mensajero, segador, desplegador, alcantarillero) ahora mapean a su forma anatomica real
  (lithobiida / escutigera / escolopendra / geofilida) via el campo `sp` de cada casta. Antes TODAS
  caian al mismo fallback: el eje forma=utilidad estaba roto para esta especie. Hoy: 4 formas distintas.
- **Helpers deduplicados:** `shade`/`legs`/`eye` estaban definidos 3 veces en `critters.js`; la ultima
  copia (mantis) sobrescribia a todas con patas de 2.8 en vez de 3.2. Ahora hay una unica definicion
  canonica (3.2), restaurando el grosor de patas de diseno en 9 especies. -27 lineas muertas.
- `render_pendiente` de ciempies -> `false` (ya no aplica).

### Motor / build
- **Robustez:** validador de contrato minimo (`validate()`) con mensajes claros; acceso seguro `.get()`
  en los 6 campos antes desprotegidos (no mas `KeyError` mudo); aviso cuando un proyecto trae `categoria`
  desconocida (antes desaparecia en silencio).
- Verificacion de los **tres** marcadores de plantilla (incluido `/*__FONDOS__*/`), detectando ausencia
  y duplicados.
- `waiting_on` ausente se distingue de `"none"`/`""` (ausente -> heuristica de texto; explicito -> la desactiva).
- `seseras.py`: extraccion de `TERR` con manejo de error claro en vez de traceback.

### Verificacion
- `verificar.js` ahora afirma: caminos>0 si hay relaciones (A12); las **13 especies x sus castas**
  producen SVG distintos -cierra el agujero del ciempies para siempre- (A13); version coherente (A14).

### Calidad
- Version alineada a **0.4.3** en `package.json`, `package-lock.json` y `build.py`.
- Accesibilidad: **Escape** cierra el modal mas profundo (anatomia -> ficha -> colonia).
- Escorpion: `casta_base.camara` corregido de `"madriguera"` (invalido) a `"guarderia"`.


## v0.4 — Consolidación (motor único + castas por utilidad + cámaras + lentes)

### Arquitectura
- **Dos capas claras:** `arthropod-terrarium/` (motor público distribuible) vs `tierra/` + `colonias/` (sesera personal). El motor ya no contiene datos personales.
- **Motor único:** el único builder es `motor/build.py`. `build_hormigas.py` y `build_terrario.py` (este último roto, dependía de `sp_*.js`/`sp_*.caste.json` inexistentes) → `legacy/`.
- **Reproducible desde datos + plantilla + critters + castas.** Nada depende ya de archivos ausentes.

### Semántica (los 6 ejes)
- **Casta = utilidad del proyecto** (antes se derivaba por error de la *actividad*, y los nombres emitidos no existían en `critters.js`, así que **todos los bichos se dibujaban iguales**). Ahora hay reglas deterministas por especie en `motor/castas.json` (keywords ponderadas: title×3, temas×2, deque×1), una por especie en `motor/castas_src/`. Las 13 especies usan las castas que `critters.js` ya sabe dibujar; sin match → `casta_base`.
- **6 cámaras por colonia** (memoria = hábitat): reina, despensa, granero, guardería, vertedero, túneles; cada especie las nombra a su modo. `camara_of`: override explícito → vital/actividad → cámara por casta.

### Vistas
- **Vista de colonia = corte transversal subterráneo:** cada bicho aparece en su cámara (antes: dispersión aleatoria).
- **3 lentes en el overview** sin romper la metáfora: 🍴 comedero, 🍂 compost, 🧵 caminos.
- **Caminos:** grafo de relaciones (`TERR.caminos`) desde `superseded_by` / `depends_on` / `related` / duplicados, + afinidad por keyword.

### Datos (compatibles hacia atrás)
- Campos nuevos opcionales: `waiting_on` (user|system|internet|physical|external_person|none), `superseded_by`, `links[]`, `depends_on[]`, `related[]`, `camara`.
- `waiting_on` refina el badge y encaja con la anatomía (patas=LAN, alas=internet, entorno=el PC).
- Datos reales canonizados en `tierra/datos/` (projects_data v3 = 142 proyectos; species.json = 13 áreas).

### Verificación
- `package.json` declara **jsdom**; `npm install` + `npm run verify` / `verify:personal`.
- `verificar.js` ahora comprueba además: 6 cámaras por colonia, variedad de castas (el eje "forma" está vivo), lentes presentes y capa de caminos.

### Seseras Markdown (opt-in)
- `motor/seseras.py` genera `colonias/<especie>/bichos/<id>.md` **solo** para proyectos activos / atascados / hambrientos. No sobrescribe lo editado a mano.

### Arreglos
- El punto naranja/rojo del overview comparaba estados en inglés (`naranja`/`rojo`); ahora usa los estados reales en español.

### Pendiente para v0.5
- Anatomía dibujada para las castas del **ciempiés** (hoy semánticas, `render_pendiente`).
- Datos de demo (`ejemplo/`) que luzcan mejor la variedad de castas.
- Render de cámaras también en miniatura en el overview.

### v0.4.1 — Fondos ambientales, anatomia y ficha mas completa
- **Fondos ambientales** embebidos en base64 (autocontenido): foto del jardin en el overview, y por lente (comedero soleado, compost hojarasca) + corte de camaras de fondo en la colonia. Generados con `motor/fondos.py` -> `motor/fondos.css`, inyectados en `/*__FONDOS__*/`.
- **Panel de anatomia por especie** (boton 🔬 en la colonia): antenas=percepcion, cabeza=sesera, ojos=estado, patas=LAN, alas=internet (voladores) / sin alas=local-first, abdomen=identidad+actividad. Usa la nota `anatomia` de castas.json.
- **Ficha mas completa**: ahora muestra colonia, utilidad de la casta, camara + su significado, rastro (nº de mensajes) y a quien espera (`waiting_on`).
- Verificador ampliado: comprueba tambien el panel de anatomia.

### v0.4.2 — Demo de ejemplo que luce v0.4
- **`ejemplo/` enriquecido** (resuelve el pendiente de v0.5 "datos de demo que luzcan la variedad de castas"): 22 proyectos cuyos títulos/temas casan castas reales → **21 castas distintas** (antes 15, con 15/22 cayendo en `casta_base`; ahora solo 5/22 base).
- Campos v0.4 en el demo: `waiting_on` (badges 🍴 / mudo), `depends_on` / `related` / `superseded_by` + un duplicado → **12 caminos** (antes 1), varios entre colonias. Dos relevados (uno por duplicado, otro por `superseded_by`).
- `demo/index.html` regenerado y verificado (`VERIFY: PASS`: 8 reinas, 22 bichos, 6 cámaras/colonia, 4 lentes, capa de caminos, 0 errores JS).
- Limpieza: `.gitignore` deduplicado y reforzado (ignora `tierra/`, `colonias/`, `legacy/`, `mis-datos/`); `ejemplo/LEEME.md` actualizado a la convención `tierra/`; imagen de portada en el README.

### v0.4.2 — Bichos con imagen (repertorio de artropodos)
- Cada proyecto se dibuja ahora con una **ilustracion real** del artropodo (`assets/images/arthropods`): 142/142 con imagen. Mapeo: bespoke por `project_id` (hormigas, escarabajos, mantis), por orden de celda y rangos por especie en los atlas mixtos, overflow a atlas genericos; + una reina "hero" por especie.
- La imagen aporta la **silueta**; el motor sigue codificando estado (disco/halo de color), postura (rotacion + desaturado si muerto), tamano y badge. Si falta sprite, cae al SVG parametrico (p.ej. la demo).
- Pipeline reproducible: `motor/sprites.py` (recorta el alfa, comprime a WEBP ~112px, base64 en pool indexado) -> `motor/sprites.json`; `build.py` lo inyecta en `TERR.sprites`. Para depurar en PNG: `python3 motor/sprites.py png`.
- HTML personal ~2.7 MB, sigue **autocontenido y offline**.

## 0.5.0 — 2026-06-11 · «Gabinete del naturalista»
- Rediseño completo de la plantilla: estética de lámina naturalista (papel+grano, tinta sepia, serif versalitas, láminas numeradas).
- Se retiran sprites fotográficos y fondos base64 (a legacy/v04/): todo vuelve a SVG paramétrico; el HTML personal baja de ~2.8MB a ~250KB.
- Jardín con montículos, flora y sol a tinta; corte del nido con cámaras orgánicas (blobs), estratos y túneles entintados.
- Ficha como etiqueta de espécimen con alfiler; anatomía como lámina rotulada.
- UX: área de clic ampliada por bicho (círculo de impacto invisible).
- Sin cambios de contrato: build.py, verificar.js y los 6 ejes siguen igual; VERIFY PASS en demo y personal.

## v0.6 — Terrario Imperio en el repo genérico
- El **demo público ahora es el juego** (pixel/AoE isométrico): `demo/index.html` = Terrario Imperio construido desde el jardín FICTICIO de `ejemplo/` (sin datos personales). La vista clásica estática queda en `demo/clasico.html`.
- Motor del juego en el repo: plantilla `motor/app_terrario_src.html` + `motor/build_imperio.py` (reusa `motor/build.py` y da al TERR la forma que consume el juego, igual que el pipeline personal `app_build.py`).
- Verificado con `motor/verifica_app.js`: `VERIFY APP: PASS` (22 bichos, 8 nidos, 5 lentes, selección/merge/stats/export/nido 6 cámaras/mesa de trabajo, 0 errores JS).
- `package.json`: `build`/`verify`/`todo` apuntan al Imperio; `build:clasico`/`verify:clasico` para la vista estática.
- Tarea programada de sincronización actualizada para construir y verificar el Imperio.
