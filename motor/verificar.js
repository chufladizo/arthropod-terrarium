// Verificador del Terrario Vivo (jsdom) - v0.6.0
// Comprueba: nº reinas == colonias, nº bichos == proyectos, 6 cámaras/colonia,
// variedad de castas, lentes y capa de caminos, ficha abre, anatomía, 0 errores JS.
// v0.4.3 añade: A12 caminos>0 si hay relaciones, A13 las 13 especies × castas
// producen SVG distintos (eje forma=utilidad vivo), A14 versión coherente.
// v0.6.0 añade: 5ª lente 🍖 metabolismo (uso de tokens = comida) y A15: la
// lámina del metabolismo se puebla (con datos o con el aviso de ayuno).
//
// Uso:  node motor/verificar.js [ruta_html]        (def.: demo/index.html)
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const htmlPath = process.argv[2] || path.join(__dirname, "..", "demo", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");

const linea = html.split("\n").find(l => l.trimStart().startsWith("const TERR ="));
const TERR = JSON.parse(linea.replace(/^\s*const TERR =\s*/, "").replace(/;\s*$/, ""));
const nAreas = TERR.areas.length;
const nBichos = TERR.projects.length;
const castasDistintas = new Set(TERR.projects.map(p => p.caste)).size;
const minCastas = Math.max(3, Math.min(8, nAreas));

// A12: si hay relaciones explícitas declaradas, el grafo de caminos no puede estar vacío
const hasRelations = TERR.projects.some(p =>
  (p.depends_on && p.depends_on.length > 0) ||
  (p.related && p.related.length > 0) ||
  !!p.superseded_by);
const caminosOk = !hasRelations || TERR.caminos.length > 0;

// A14: la versión de package.json es coherente con TERR.meta.version
const pkgVersion = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")).version;
const versionOk = !!(TERR.meta && pkgVersion.startsWith(TERR.meta.version));

// A13: castas por especie desde castas.json
const CASTAS_MAP = JSON.parse(fs.readFileSync(path.join(__dirname, "castas.json"), "utf8"));
function castasDeEspecie(sp) {
  const info = CASTAS_MAP[sp] || {};
  return (info.castas || []).map(c => (typeof c === "object" ? c.id : c));
}

const errs = [];
const vc = new VirtualConsole();
vc.on("jsdomError", e => errs.push(e.message.split("\n")[0]));
const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: vc });
const w = dom.window, d = w.document;

const queens = d.querySelectorAll("#ov .queen").length;
const areas = [...d.querySelectorAll("#ov .queen")].map(q => q.dataset.area);
const lentes = d.querySelectorAll(".lensbtn").length;
const camlayer = !!d.getElementById("camlayer");
const anatbtn = !!d.querySelector(".anatbtn");

let total = 0, openErr = [];
for (const a of areas) {
  try { w.openColony(a); } catch (e) { openErr.push(a + ": " + e.message); continue; }
  total += d.querySelectorAll("#conest .sbug").length;
  const L = d.querySelectorAll("#conest .chlabel").length;
  if (L !== 6) openErr.push(a + ": " + L + " camaras (esperado 6)");
}

w.openColony(areas[0]);
const fb = d.querySelector("#conest .sbug");
let detail = false, dt = "";
if (fb) {
  fb.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  detail = d.getElementById("scrim").classList.contains("show");
  dt = d.getElementById("bt").textContent;
}

let anatOk = false;
try { w.openColony(areas[0]); w.openAnat(); anatOk = d.getElementById("anatscrim").classList.contains("show"); }
catch (e) { openErr.push("anat: " + e.message); }

// A15: lámina del metabolismo poblada (con datos => 3 cajas + barras; sin => aviso de ayuno)
const metplate = d.getElementById("metplate");
let metOk = false, metInfo = "";
if (!metplate) { metInfo = "falta #metplate"; }
else if (TERR.metabolismo) {
  metOk = metplate.querySelectorAll(".mbox").length >= 3 && metplate.querySelectorAll("rect").length > 0;
  metInfo = "con datos (cajas=" + metplate.querySelectorAll(".mbox").length + ", barras=" + metplate.querySelectorAll("rect").length + ")";
} else {
  metOk = /ayunas/.test(metplate.textContent);
  metInfo = "sin tokens.json (aviso de ayuno=" + metOk + ")";
}

// A13: cada una de las 13 especies, con sus castas reales, produce >=2 formas distintas
const ALL13 = ["ant","beetle","butterfly","spider","bee","scorpion","centipede","dung","snail","dragonfly","ladybug","mite","mantis"];
let rerr = [];
ALL13.forEach(sp => {
  const castes = castasDeEspecie(sp);
  if (castes.length < 2) { rerr.push(sp + ": <2 castas en castas.json"); return; }
  const svgs = castes.slice(0, 4).map(c => {
    try {
      const s = w.critV2(sp, { color: "#8a7350", caste: c, vital: "ok" });
      if (!/<g[ >]/.test(s)) rerr.push(sp + "/" + c + " sin <g>");
      return s;
    } catch (e) { rerr.push(sp + "/" + c + ": " + e.message); return ""; }
  });
  if (new Set(svgs.filter(Boolean)).size < 2)
    rerr.push(sp + ": todas las castas producen SVG identico (fallback bug)");
  ["ok","sleep","dead"].forEach(v => {
    try {
      if (!/<g[ >]/.test(w.critV2(sp, { color: "#8a7350", caste: castes[0], vital: v })))
        rerr.push(sp + "/vital=" + v + " sin <g>");
    } catch (e) { rerr.push(sp + "/vital=" + v + ": " + e.message); }
  });
});

console.log("reinas =", queens, "| colonias esperadas =", nAreas);
console.log("bichos pintados =", total, "| bichos esperados =", nBichos);
console.log("castas distintas =", castasDistintas, "| minimo =", minCastas);
console.log("lentes =", lentes, "| capa caminos =", camlayer, "| caminos =", TERR.caminos.length, "| caminosOk =", caminosOk);
console.log("version pkg =", pkgVersion, "| meta =", TERR.meta && TERR.meta.version, "| versionOk =", versionOk);
console.log("anatomia: boton =", anatbtn, "| panel abre =", anatOk);
console.log("metabolismo:", metOk, "|", metInfo);
console.log("ficha abre =", detail, "| titulo =", JSON.stringify(dt));
console.log("errores camaras/apertura =", openErr.length, openErr.slice(0, 5));
console.log("errores render (13 especies x castas) =", rerr.length, rerr.slice(0, 8));
console.log("errores JS =", errs.length, errs.slice(0, 5));

const ok = queens === nAreas && total === nBichos && detail &&
           castasDistintas >= minCastas && lentes === 5 && camlayer && anatbtn && anatOk &&
           caminosOk && versionOk && metOk &&
           openErr.length === 0 && rerr.length === 0 && errs.length === 0;
console.log(ok ? "VERIFY: PASS" : "VERIFY: FAIL");
process.exit(ok ? 0 : 1);
