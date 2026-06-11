#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador de SESERAS (memoria Markdown por bicho) — opt-in.

Solo genera la sesera de los proyectos que piden tu atencion:
ACTIVOS (corriendo), ATASCADOS (bloqueados) o HAMBRIENTOS (necesitan algo tuyo).
NO toca las seseras que ya existan (tu texto curado manda).

Lee el TERR ya inyectado en el HTML generado (misma verdad que el terrario),
asi los datos derivados (casta, camara, estado) coinciden exactamente.

Uso:
    python3 motor/seseras.py [HTML] [CARPETA_COLONIAS]
    HTML              terrario generado     (def.: ../tierra/terrario.html)
    CARPETA_COLONIAS  donde viven las seseras (def.: ../colonias)
"""
import json, pathlib, sys, re, unicodedata, datetime

AQUI = pathlib.Path(__file__).resolve().parent
html_path = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else (AQUI.parent.parent / "tierra" / "terrario.html")
col_dir   = pathlib.Path(sys.argv[2]) if len(sys.argv) > 2 else (AQUI.parent.parent / "colonias")
HOY = datetime.date.today().isoformat()

html = html_path.read_text(encoding="utf-8")
try:
    linea = next(l for l in html.split("\n") if l.lstrip().startswith("const TERR ="))
    TERR = json.loads(linea.strip()[len("const TERR ="):].rstrip(";").strip())
except StopIteration:
    raise SystemExit(f"ERROR: no se encontro 'const TERR =' en {html_path}. Ejecuta seseras.py despues de build.py.")
except json.JSONDecodeError as e:
    raise SystemExit(f"ERROR: no se pudo parsear TERR en {html_path}: {e}")

def slug(s):
    s = unicodedata.normalize("NFKD", (s or "").lower())
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")

def quiere_atencion(p):
    return p.get("state") in ("activa", "atascada") or p.get("need") == "hambre"

NEED = {"hambre": "🍴 hambre (necesita algo tuyo)", "confuso": "❓ no sabe qué hacer"}
creadas, saltadas, por_colonia = 0, 0, {}
for p in TERR["projects"]:
    if not quiere_atencion(p):
        continue
    area = p["area"]; s = TERR["species"][area]
    folder = col_dir / slug(s["name"]) / "bichos"
    folder.mkdir(parents=True, exist_ok=True)
    pid = p.get("id") or slug(p.get("title", "bicho"))
    f = folder / (str(pid) + ".md")
    if f.exists():                      # respeta lo curado a mano
        saltadas += 1; continue
    cam = (s.get("camaras") or {}).get(p.get("camara"), p.get("camara") or "")
    enlaces = []
    if p.get("superseded_by"): enlaces.append("- ↳ relevado por [[%s]]" % p["superseded_by"])
    for t in p.get("depends_on", []): enlaces.append("- ⛓ depende de [[%s]]" % t)
    for t in p.get("related", []):     enlaces.append("- 🧵 relacionado con [[%s]]" % t)
    for t in p.get("links", []):       enlaces.append("- 🔗 %s" % t)
    cuerpo = f"""---
id: {pid}
colonia: "{area}"
especie: {s['name']} ({s['key']})
casta: {p.get('casteName','')}{(' — ' + p['casteSp']) if p.get('casteSp') else ''}
estado: {p.get('stateName','')}
vital: {p.get('vital','')}
camara: {cam}
necesidad: {NEED.get(p.get('need'), '—')}
actividad: {p.get('act','')}
generado: {HOY} · arthropod-terrarium v0.4 (auto — edita libremente, no se sobrescribe)
---

# {p.get('title','(sin título)')}

**De qué va:** {p.get('deque') or '—'}

**Último avance:** {p.get('ultimo') or '—'}

**Próximo paso:** {p.get('proximo') or '—'}

**Temas:** {', '.join(p.get('temas') or []) or '—'}

## Decisiones
<!-- fecha — decisión — por qué -->

## Enlaces
{chr(10).join(enlaces) if enlaces else '<!-- teje caminos con [[otra-sesera]] o [[otra-colonia]] -->'}
"""
    f.write_text(cuerpo, encoding="utf-8")
    creadas += 1
    por_colonia[s["name"]] = por_colonia.get(s["name"], 0) + 1

print(f"seseras creadas: {creadas}   (saltadas por existir ya: {saltadas})")
for k, v in sorted(por_colonia.items(), key=lambda x: -x[1]):
    print(f"  {k:14s} {v}")
