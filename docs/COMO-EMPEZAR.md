# Cómo empezar · v0.4

---

## Lo que necesitas

- **Python 3** — para generar el HTML.
- **Node.js** — para los comandos `npm run *` (build + verificar).
- Un navegador para mirar el resultado.

Desde `arthropod-terrarium/`:

```bash
npm install    # instala jsdom y lo demás (una sola vez)
```

---

## 1. Mira el demo

```bash
npm run build     # reconstruye demo/index.html desde ejemplo/
npm run verify    # debe decir VERIFY: PASS
```

O abre `demo/index.html` directamente en el navegador (ya viene generado).

Juega con él: toca una reina para entrar en su colonia, toca un bicho para ver su ficha.

---

## 2. Pon tus datos en tierra/

Copia los datos de ejemplo a tu carpeta personal:

```bash
cp ejemplo/species.json  tierra/datos/species.json
cp ejemplo/projects_data.json  tierra/datos/projects_data.json
```

Luego edítalos:

- **`species.json`** — tus áreas y su especie. Ver [TAXONOMIA.md](TAXONOMIA.md).
- **`projects_data.json`** — un objeto por proyecto. Ver [ESQUEMA-DATOS.md](ESQUEMA-DATOS.md).

`tierra/` está en `.gitignore`: tus datos nunca suben al repo.

---

## 3. Construye tu terrario

```bash
npm run build:personal
```

Esto corre `motor/build.py` apuntando a `tierra/datos/` y genera `tierra/terrario.html`.
Abre ese archivo en el navegador.

---

## 4. Verifica

```bash
npm run verify:personal
```

Comprueba que el HTML carga sin errores, que hay una reina por colonia y que cada colonia
pinta sus bichos y abre ficha. Debe decir `VERIFY: PASS`.

---

## 5. (Opcional) Genera las seseras

Las **seseras** son archivos `.md` por bicho — la memoria de cada proyecto en su cámara.

```bash
python3 motor/seseras.py
```

Genera `colonias/<especie>/bichos/<id>.md` solo para proyectos activos, atascados o hambrientos.
**Nunca sobrescribe** lo que hayas editado a mano.

Los archivos viven en `colonias/`, que también está en `.gitignore`.

---

## Flujo completo

```
tierra/datos/
  species.json + projects_data.json
        ↓
  motor/build.py
  (+ template.html + critters.js + castas.json)
        ↓
  tierra/terrario.html     ← tu terrario
        ↓
  motor/verificar.js       ← comprobación
        ↓
  motor/seseras.py         ← seseras .md (opt-in)
        ↓
  colonias/<especie>/bichos/<id>.md
```

---

## Con Claude / Cowork

Instala la skill (`skill/arthropod-terrarium/`) y pídele "modo terrario" para que recopile
tus sesiones y rellene los datos por ti.

---

## Referencia de comandos

```bash
# Desde arthropod-terrarium/

npm run build           # demo: ejemplo/ → demo/index.html
npm run verify          # verifica la demo

npm run build:personal  # tierra/datos → tierra/terrario.html
npm run verify:personal # verifica la tuya

python3 motor/seseras.py   # genera seseras .md (opt-in)
```
