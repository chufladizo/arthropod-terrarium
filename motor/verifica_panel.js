const { JSDOM } = require("jsdom"); const fs = require("fs");
const html = fs.readFileSync(process.argv[2] || "../tierra/panel.html", "utf-8");
const errs = [];
// extraer TERR del propio HTML (const no se expone en window)
const linea = html.split("\n").find(l => l.trimStart().startsWith("const TERR ="));
const T = JSON.parse(linea.replace(/^\s*const TERR =\s*/, "").replace(/;\s*$/, "").replace(/<\\\//g, "</"));
const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true });
dom.window.addEventListener("error", e => errs.push(String(e.message)));
setTimeout(() => {
  const d = dom.window.document;
  const filas = d.querySelectorAll("#tb tr.row").length;
  const kpis = d.querySelectorAll(".kpi").length;
  const feat = d.querySelectorAll("#tb tr.row .star").length;
  console.log("filas =", filas, "| esperadas =", T.projects.length);
  console.log("kpis =", kpis, "| destacados con estrella =", feat);
  console.log("svg =", d.querySelectorAll("svg").length, "| caminos box =", d.querySelectorAll("#caminos").length);
  const tr = d.querySelector("#tb tr.row"); tr.click();
  const ficha = d.querySelectorAll("tr.det .fich").length;
  console.log("ficha abre =", ficha === 1);
  // filtro destacados
  const ck = d.getElementById("fFeat"); ck.checked = true; ck.dispatchEvent(new dom.window.Event("change"));
  const soloFeat = d.querySelectorAll("#tb tr.row").length;
  console.log("filtro ★ deja", soloFeat, "filas");
  ck.checked = false; ck.dispatchEvent(new dom.window.Event("change"));
  // filtro prioridad 1
  const sp = d.getElementById("fPrio"); sp.value = "1"; sp.dispatchEvent(new dom.window.Event("change"));
  const p1 = d.querySelectorAll("#tb tr.row").length;
  console.log("filtro P1 deja", p1, "filas");
  sp.value = ""; sp.dispatchEvent(new dom.window.Event("change"));
  // busqueda
  const q = d.getElementById("q"); q.value = "terrario"; q.dispatchEvent(new dom.window.Event("input"));
  const tras = d.querySelectorAll("#tb tr.row").length;
  console.log('busqueda "terrario" deja', tras, "filas");
  console.log("errores JS =", errs.length, errs.slice(0, 3));
  const pass = filas === T.projects.length && kpis === 11 && ficha === 1 &&
               soloFeat > 0 && soloFeat <= filas && p1 > 0 && tras > 0 && tras < filas && errs.length === 0;
  console.log(pass ? "VERIFY PANEL: PASS" : "VERIFY PANEL: FAIL");
}, 350);
