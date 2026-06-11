#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Terrario Vivo - motor de construccion (v0.4).

Toma una taxonomia (species.json) + una lista de proyectos (projects_data.json),
deriva los 6 ejes visuales de cada bicho y los inyecta en la plantilla
autocontenida para producir un HTML estatico que se abre sin conexion.

Los 6 EJES (esta logica es la convencion, no se improvisa):
    silueta      = colonia/area        -> species[area].key
    forma/casta  = UTILIDAD del proy.  -> castas.json (keywords ponderadas)   <-- v0.4
    color        = estado              -> activa/pendiente/atascada/hibernando/relevada
    tamano       = actividad           -> alta/media/baja
    postura      = vitalidad           -> ok / sleep / dead
    badge        = necesidad           -> hambre / no-sabe  (+ waiting_on)

Ademas agrupa cada bicho en una de las 6 CAMARAS de la colonia (la memoria como
habitat) y construye el grafo de CAMINOS (relaciones entre proyectos).

Uso:
    python3 motor/build.py [CARPETA_DATOS] [SALIDA]
    CARPETA_DATOS   carpeta con species.json y projects_data.json   (def.: ejemplo)
    SALIDA          archivo HTML a generar                          (def.: demo/index.html)

Ejemplos:
    python3 motor/build.py                                  # demo:  ejemplo/ -> demo/index.html
    python3 motor/build.py ../tierra/datos ../terrario.html # personal: tierra/datos -> raiz
"""
import json, pathlib, sys, unicodedata
from collections import Counter

AQUI = pathlib.Path(__file__).resolve().parent      # motor/
REPO = AQUI.parent                                  # arthropod-terrarium/

data_dir = REPO / (sys.argv[1] if len(sys.argv) > 1 else "ejemplo")
salida   = REPO / (sys.argv[2] if len(sys.argv) > 2 else "demo/index.html")

TPL    = (AQUI / "template.html").read_text(encoding="utf-8")
CRIT   = (AQUI / "critters.js").read_text(encoding="utf-8")
SPEC   = json.loads((data_dir / "species.json").read_text(encoding="utf-8"))
DATA   = json.loads((data_dir / "projects_data.json").read_text(encoding="utf-8"))
# castas.json: reglas utilidad->casta por especie (generado por el fan-out por especie).
# Si falta, el motor sigue funcionando con una casta generica por colonia.
CASTAS_PATH = AQUI / "castas.json"
CASTAS = json.loads(CASTAS_PATH.read_text(encoding="utf-8")) if CASTAS_PATH.exists() else {}
# fondos.css: imagenes ambientales en base64 (opcional; mantiene el HTML autocontenido).
FONDOS_PATH = AQUI / "fondos.css"
FONDOS = FONDOS_PATH.read_text(encoding="utf-8") if FONDOS_PATH.exists() else ""
# sprites.json: imagenes de artropodos (pool base64 indexado). Opcional.
SPRITES_PATH = AQUI / "sprites.json"
SPRITES = json.loads(SPRITES_PATH.read_text(encoding="utf-8")) if SPRITES_PATH.exists() else {"pool": [], "byProject": {}, "queens": {}}

# ---------------------------------------------------------------- utilidades
def norm(s):
    s = unicodedata.normalize("NFKD", (s or "").lower())
    return "".join(c for c in s if not unicodedata.combining(c))

def aslist(x):
    if x is None: return []
    return x if isinstance(x, list) else [x]

CAMARAS = {"reina", "despensa", "granero", "guarderia", "vertedero", "tuneles"}
CAMARAS_DEF = {"reina": "Camara real", "despensa": "Despensa", "granero": "Granero",
               "guarderia": "Guarderia", "vertedero": "Vertedero", "tuneles": "Tuneles"}

BLOQUEO = ["limite", "bloque", "error", "cortad", "token", "500", "no detect",
           "atasc", "fallo", "reintent", "reset", "no respond", "caido", "timeout"]
USUARIO = ["usuario", "responde", "respond", "decidir", "decision", "confirm", "ok",
           "pega", "dime", "revisar", "elegir", "elige", "contesta", "indica",
           "definir", "sube", "activar", "lanzar", "aprobar", "instalar", "rellenar"]
# waiting_on (campo opcional): quien bloquea. patas=LAN, alas=internet, entorno=el PC.
WAIT_HAMBRE = {"user", "external_person", "physical"}   # necesita accion tuya/de alguien
WAIT_MUDO   = {"system", "internet", "none", ""}        # no depende de ti (el PC / la net)

COLOR = {"activa": "#4e9a3a", "pendiente": "#d98326", "atascada": "#c0392b",
         "hibernando": "#a3957c", "relevada": "#b7b1a5", "sin rastro": "#b7b1a5"}

def tiene_proximo(d):
    p = (d.get("proximo_paso") or "").strip()
    return bool(p) and p != "—"

# ---- casta desde la UTILIDAD (keywords ponderadas por campo) ----------------
FIELD_WEIGHT = (("title", 3), ("temas", 2), ("deque", 1))
def caste_of(d, key):
    info  = CASTAS.get(key) or {}
    rules = info.get("castas", [])
    base  = info.get("casta_base") or {"id": "base", "nombre": "Base", "sp": "", "camara": "guarderia"}
    blobs = {"title": norm(d.get("title", "")),
             "temas": norm(" ".join(d.get("temas") or [])),
             "deque": norm(d.get("deque", ""))}
    best = None
    for idx, c in enumerate(rules):
        kws = c.get("keywords") or []
        score = sum(w for field, w in FIELD_WEIGHT if any(k in blobs[field] for k in kws))
        if score:
            cand = (score, -idx)
            if best is None or cand > best[0]:
                best = (cand, c)
    c = base if best is None else best[1]
    return c.get("id", "base"), c.get("nombre", c.get("id", "base")), c.get("sp", ""), c.get("camara", "guarderia"), c.get("utilidad", "")

# ---- camara: override explicito > vital/actividad > camara por casta ---------
def camara_of(d, vital, casta_cam, act, running):
    cam = (d.get("camara") or "").strip()
    if cam in CAMARAS:
        return cam
    if vital in ("dead", "sleep"):
        return "granero" if act == "alta" else "vertedero"
    if running and act == "alta":
        return "despensa"
    return casta_cam if casta_cam in CAMARAS else "guarderia"

# ---- necesidad (badge): waiting_on manda; si no, heuristica de texto ---------
def need_of(d, vital, estado):
    if vital in ("dead", "sleep"):
        return None
    wo = norm(d.get("waiting_on", "")) if "waiting_on" in d else None
    if wo in WAIT_HAMBRE:
        return "hambre"
    if wo is not None and wo in WAIT_MUDO:
        return None if tiene_proximo(d) else "confuso"
    if estado == "atascada":
        return None
    if not tiene_proximo(d):
        return "confuso"
    if any(k in norm(d.get("proximo_paso", "")) for k in USUARIO):
        return "hambre"
    return None

SIZE = {"alta": 50, "media": 40, "baja": 32}

# ---- duplicados / relevados -------------------------------------------------
# Un proyecto queda "relevado" (dead) si es duplicado de otro mas fuerte por
# titulo, o si trae 'superseded_by' apuntando a otro proyecto.
grupos = {}
for i, d in enumerate(DATA):
    t = d.get("title", "")
    if not t:
        print(f"  AVISO proyecto[{i}]: sin 'title' — se omite del dedup")
        continue
    grupos.setdefault(norm(t), []).append(i)
muerto_dup, relevado_por = set(), {}
for idxs in grupos.values():
    if len(idxs) > 1:
        vivo = max(idxs, key=lambda j: (DATA[j].get("status") == "running", DATA[j].get("msgs", 0)))
        for j in idxs:
            if j != vivo:
                muerto_dup.add(j); relevado_por[j] = DATA[vivo].get("id")

ids_set = {d.get("id") for d in DATA if d.get("id")}
id_by_norm = {}
for d in DATA:
    id_by_norm.setdefault(norm(d.get("title", "")), d.get("id"))
def resolve_ref(t):
    if t in ids_set: return t
    return id_by_norm.get(norm(t))

sup_explicit = set()
for i, d in enumerate(DATA):
    if d.get("superseded_by"):
        sup_explicit.add(i); relevado_por.setdefault(i, resolve_ref(d["superseded_by"]))

# ---- derivacion por proyecto -----------------------------------------------
def derivar(d, idx, key):
    msgs = d.get("msgs", 0)
    prox = tiene_proximo(d)
    texto = norm(d.get("proximo_paso", "") + " " + d.get("ultimo_avance", "") + " " + d.get("deque", ""))
    bloqueado = any(k in texto for k in BLOQUEO)

    if idx in muerto_dup or idx in sup_explicit: vital, estado = "dead", "relevada"
    elif msgs == 0:                              vital, estado = "dead", "sin rastro"
    elif d.get("status") == "running":           vital, estado = "ok", "activa"
    elif prox and bloqueado:                     vital, estado = "ok", "atascada"
    elif prox:                                   vital, estado = "ok", "pendiente"
    else:                                        vital, estado = "sleep", "hibernando"

    act = d.get("actividad", "baja")
    caste, casteName, casteSp, casta_cam, casteUtil = caste_of(d, key)
    camara = camara_of(d, vital, casta_cam, act, d.get("status") == "running")
    size = SIZE.get(act, 34)
    if vital == "dead":
        size = 28

    return dict(state=estado, stateName=estado, color=COLOR[estado],
                need=need_of(d, vital, estado), vital=vital, faded=(msgs == 0),
                caste=caste, casteName=casteName, casteSp=casteSp, casteUtil=casteUtil, camara=camara,
                size=size, act=act,
                waiting_on=(d.get("waiting_on") or ""),
                links=aslist(d.get("links")), depends_on=aslist(d.get("depends_on")),
                related=aslist(d.get("related")), superseded_by=(d.get("superseded_by") or ""))

# ---- taxonomia (acepta "k" o "key") + nombres de camara por especie ---------
species_out = {}
for area, s in SPEC.items():
    key = s.get("key", s.get("k"))
    cinfo = CASTAS.get(key, {})
    species_out[area] = {"key": key, "c": s["c"], "name": s["name"], "emo": s["emo"],
                         "fn": s.get("fn", ""), "anchor": s["anchor"],
                         "air": bool(s.get("air", False) or cinfo.get("vuela", False)),
                         "queenCaste": "reina",
                         "camaras": cinfo.get("camaras", CAMARAS_DEF),
                         "metafora": cinfo.get("metafora", ""),
                         "anatomia": cinfo.get("anatomia", ""),
                         "queenSprite": SPRITES["queens"].get(key)}

# ---- validador de contrato minimo (mensajes claros en vez de KeyError / descarte mudo) ----
VALID_STATUS = {"running", "idle"}
def validate(data, species_out):
    errores, avisos, vistos = [], [], {}
    for i, d in enumerate(data):
        loc = f"[{i}] id={d.get('id','?')!r}"
        for campo in ("id", "title", "status", "categoria"):
            if not d.get(campo):
                errores.append(f"{loc}: falta el campo obligatorio '{campo}'")
        s = d.get("status")
        if s and s not in VALID_STATUS:
            avisos.append(f"{loc}: status={s!r} no estandar (se trata como no-activo)")
        cat = d.get("categoria")
        if cat and cat not in species_out:
            avisos.append(f"{loc}: categoria={cat!r} no existe en species.json -> proyecto omitido")
        cam = d.get("camara")
        if cam and cam not in CAMARAS:
            avisos.append(f"{loc}: camara={cam!r} no valida -> se derivara")
        pid = d.get("id")
        if pid is not None:
            if pid in vistos:
                avisos.append(f"{loc}: id={pid!r} duplicado (ya en [{vistos[pid]}])")
            else:
                vistos[pid] = i
    for a in avisos:  print(f"  AVISO: {a}")
    for e in errores: print(f"  ERROR: {e}")
    if errores:
        raise SystemExit(f"Build abortado: {len(errores)} error(es) de contrato en projects_data.json.")

validate(DATA, species_out)

# ---- colonias ordenadas por n de proyectos ---------------------------------
cnt = Counter(d.get("categoria") for d in DATA if d.get("categoria"))
areas = [a for a, _ in cnt.most_common() if a in species_out]

# ---- bichos -----------------------------------------------------------------
projects, area_by_id = [], {}
for area in areas:
    key = species_out[area]["key"]
    for i, d in enumerate(DATA):
        if d.get("categoria") != area:
            continue
        area_by_id[d.get("id")] = area
        projects.append({"id": d.get("id"), "area": area, "title": d.get("title", ""),
                         "status": d.get("status", ""), "deque": d.get("deque", ""),
                         "ultimo": d.get("ultimo_avance", ""), "proximo": d.get("proximo_paso", ""),
                         "temas": d.get("temas", []), "keyword": (d.get("temas") or [""])[0],
                         "msgs": d.get("msgs", 0), "spriteIdx": SPRITES["byProject"].get(d.get("id")),
                         **derivar(d, i, key)})

# ---- caminos (relaciones entre proyectos) ----------------------------------
caminos, seen = [], set()
def add_edge(a, b, tipo):
    if not a or not b or a == b: return
    k = (a, b, tipo)
    if k in seen: return
    seen.add(k)
    caminos.append({"from": a, "to": b, "type": tipo,
                    "cross": area_by_id.get(a) != area_by_id.get(b),
                    "fromArea": area_by_id.get(a), "toArea": area_by_id.get(b)})
for d in DATA:
    pid = d.get("id")
    if d.get("superseded_by"): add_edge(pid, resolve_ref(d["superseded_by"]), "superseded")
    for t in aslist(d.get("depends_on")): add_edge(pid, resolve_ref(t), "depends")
    for t in aslist(d.get("related")):    add_edge(pid, resolve_ref(t), "related")
for j, vid in relevado_por.items():
    if j in muerto_dup: add_edge(DATA[j].get("id"), vid, "duplicate")

TERR = {"areas": areas, "species": species_out, "projects": projects, "caminos": caminos, "sprites": SPRITES.get("pool", []),
        "meta": {"version": "0.5.0", "nProyectos": len(projects), "nColonias": len(areas)}}

for _m in ("/*__CRITTERS__*/", "/*__DATA__*/", "/*__FONDOS__*/"):
    _n = TPL.count(_m)
    if _n == 0:
        raise SystemExit("ERROR: falta el marcador " + _m + " en template.html (revisa merge o edicion)")
    if _n > 1:
        raise SystemExit("ERROR: el marcador " + _m + " aparece " + str(_n) + " veces en template.html")
html = (TPL.replace("/*__CRITTERS__*/", CRIT)
           .replace("/*__DATA__*/", json.dumps(TERR, ensure_ascii=False))
           .replace("/*__FONDOS__*/", FONDOS))

salida.parent.mkdir(parents=True, exist_ok=True)
salida.write_text(html, encoding="utf-8")

# ---- resumen ----------------------------------------------------------------
try:
    rel = salida.relative_to(REPO.parent)
except ValueError:
    rel = salida
print(f"OK -> {rel}  ({len(html)//1024} KB)")
print(f"colonias: {len(areas)}   bichos: {len(projects)}   caminos: {len(caminos)}")
print("estados :", dict(Counter(p["state"] for p in projects)))
print("camaras :", dict(Counter(p["camara"] for p in projects)))
keys_used = {sp["key"] for sp in species_out.values()}
base_ids = {k: (CASTAS.get(k, {}).get("casta_base", {}) or {}).get("id") for k in keys_used}
sin_casta = sum(1 for p in projects if p["caste"] == base_ids.get(species_out[p["area"]]["key"]))
print(f"castas  : {len(set(p['caste'] for p in projects))} distintas   sin clasificar (base): {sin_casta}/{len(projects)}")
