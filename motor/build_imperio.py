#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Terrario IMPERIO — builder del demo genérico (pixel/AoE isométrico jugable).

Reutiliza el motor (motor/build.py) para derivar el TERR a partir de los datos
FICTICIOS de ejemplo/, le da la forma que espera el juego (igual que el pipeline
personal tierra/datos/app_build.py) y lo inyecta en motor/app_terrario_src.html
-> demo/index.html. Deja además el terrario estático clásico en demo/clasico.html.

NUNCA usa datos personales: solo ejemplo/ (jardín inventado).

Uso:
    python3 motor/build_imperio.py [CARPETA_DATOS] [SALIDA]
    def.: ejemplo  ->  demo/index.html
"""
import json, subprocess, sys, pathlib

AQUI = pathlib.Path(__file__).resolve().parent      # motor/
REPO = AQUI.parent
data_dir = sys.argv[1] if len(sys.argv) > 1 else "ejemplo"
salida   = sys.argv[2] if len(sys.argv) > 2 else "demo/index.html"

# 1) Motor: deriva el TERR (estado/casta/camara/tokens/metabolismo...) y lo deja en demo/clasico.html
subprocess.run([sys.executable, str(AQUI / "build.py"), data_dir, "demo/clasico.html"],
               cwd=str(REPO), check=True)
html = (REPO / "demo/clasico.html").read_text(encoding="utf-8")
linea = next(l for l in html.split("\n") if l.lstrip().startswith("const TERR ="))
TERR = json.loads(linea.strip()[len("const TERR ="):].strip().rstrip(";"))

# 2) Forma EXACTA que consume el juego (idéntico a tierra/datos/app_build.py).
SPK  = ("key", "c", "name", "emo", "fn", "air", "camaras", "metafora", "anatomia")
KEEP = ("id","area","title","status","deque","ultimo","proximo","temas","keyword","msgs","tokens",
        "state","stateName","color","caste","casteName","casteUtil","camara","size","act","vital","need",
        "waiting_on","featured","priority","merged","mergedCount","mergedFrom","ageDays","horas","files","lastDate")
sp   = {k: {kk: v.get(kk) for kk in SPK} for k, v in TERR["species"].items()}
proj = [{k: p.get(k) for k in KEEP} for p in TERR["projects"]]
data = {"areas": TERR["areas"], "species": sp, "projects": proj,
        "metabolismo": TERR.get("metabolismo"), "meta": TERR.get("meta")}

# 3) Inyectar en la plantilla del juego.
src = (AQUI / "app_terrario_src.html").read_text(encoding="utf-8")
assert "/*__DATA__*/" in src, "falta el marcador /*__DATA__*/ en app_terrario_src.html"
js  = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
out_path = REPO / salida
out_path.parent.mkdir(parents=True, exist_ok=True)
out_path.write_text(src.replace("/*__DATA__*/", js), encoding="utf-8")

from collections import Counter
print(f"OK -> {salida}  ({len(out_path.read_text(encoding='utf-8').encode('utf-8'))//1024} KB)")
print(f"bichos: {len(proj)}   colonias: {len(TERR['areas'])}   (estático clásico en demo/clasico.html)")
print("estados:", dict(Counter(p['state'] for p in proj)))
