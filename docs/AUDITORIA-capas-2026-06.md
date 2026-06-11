# Auditoría por capas — Terrario Vivo (2026-06-07)

Auditoría completa del proyecto con un enjambre de agentes: **6 capas × 3 roles**
(comprender → investigar → depurar/decidir) + grupo de aplicación + verificación.
Resultado: **`npm run verify` → VERIFY: PASS**, build determinista, 0 corrupción.

## Método
18 agentes de análisis en tres oleadas (una por rol), un agente por capa:
Datos · Taxonomía/Castas · Render · Build/Estructura · Verificación · Skill/Docs.
Cada oleada dejó su informe en briefs; la decisión se consolidó y se aplicó solo lo **seguro**.

## Cambios aplicados (seguros, verificados)

### Render / castas
- **Ciempiés arreglado (bug real):** las 8 castas funcionales caían todas al mismo dibujo
  (eje forma=utilidad roto). Ahora cada casta mapea a su forma anatómica real
  (lithobiida/escutigera/escolopendra/geofilida) usando el campo `sp` ya declarado por el autor.
  Hoy: **4 formas distintas**. SVG preservado byte a byte; sin cambiar el contrato de datos.
- **Helpers deduplicados:** `shade/legs/eye` estaban 3 veces en `critters.js`; la copia de mantis
  sobrescribía a todas (patas 2.8 en vez de 3.2). Una sola definición canónica (3.2). −27 líneas.
- `render_pendiente` de ciempiés → `false`.

### Motor / build
- Validador de contrato mínimo (`validate()`) con mensajes claros; `.get()` defensivo en los 6
  accesos que antes lanzaban `KeyError` mudo; aviso ante `categoria` desconocida (antes: descarte mudo).
- Verificación de los **3** marcadores de plantilla (incluido `/*__FONDOS__*/`), con detección de
  ausencia y duplicados (antes solo 2, vía `assert` desactivable con `python -O`).
- `waiting_on` ausente se distingue de `"none"`/`""`.
- `seseras.py`: extracción de `TERR` con error claro.

### Verificación
- `verificar.js`: +A12 (caminos>0 si hay relaciones), +A13 (las **13 especies × sus castas**
  producen SVG distintos — cierra el agujero del ciempiés para siempre), +A14 (versión coherente).

### Calidad
- Versión alineada a **0.4.3** (package.json, package-lock.json, build.py).
- **Escape** cierra el modal más profundo (anatomía → ficha → colonia).
- Escorpión: `casta_base.camara` de `"madriguera"` (inválido) → `"guarderia"`.
- `skill/SKILL.md` y `docs/` actualizados (3 marcadores, fan-out evolutivo, seseras, notas de diseño).

## Propuestas pendientes (requieren tu criterio — NO aplicadas)
- **Anatomía por especie:** flechas del panel 🔬 con coordenadas fijas → mal puestas en araña,
  caracol, ácaro, ciempiés. Plan: `anatLabels` por especie en `species.json`.
- **Daltonismo:** el par verde/rojo (activa/atascada) es difícil para deuteranopia; paleta alterna propuesta.
- **Keywords personales del ciempiés** (VPostal/Zaragoza) en el motor público → generalizar o mover a `mis-datos/`.
- **dragonfly**: añadir keywords de red (vlan/wireguard) o una 4ª casta `skimmer`.
- **Cámaras en miniatura en el overview**, caminos intra-colonia visibles, `tabindex` en reinas.
- **CI** (`.github/workflows/verify.yml`) y empaquetado `.skill` instalable.
- **Helpers comunes** (`vitalEyes/crown/antenna`) para abaratar el fan-out por especie.

## Verificación final
`npm run build && npm run verify` → 8 reinas, 22 bichos, 6 cámaras/colonia, 4 lentes, capa de
caminos, A12/A13/A14 OK, 0 errores JS, **VERIFY: PASS**. Build determinista (MD5 estable).
