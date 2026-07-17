const { JSDOM, VirtualConsole } = require("jsdom"); const fs = require("fs");
const html = fs.readFileSync(process.argv[2] || "demo/index.html", "utf-8");
const errs = [];
const vc = new VirtualConsole();
vc.on("jsdomError", e => { const m=String(e.message||e); if(/getContext|canvas|Not implemented|execCommand/i.test(m))return; errs.push(m); });
const linea = html.split("\n").find(l => l.trimStart().startsWith("const TERR ="));
const T = JSON.parse(linea.replace(/^\s*const TERR =\s*/, "").replace(/;\s*$/, "").replace(/<\\\//g, "</"));
let d1writes = 0, d1reads = 0;
const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: vc, url: "http://localhost/",
  beforeParse(window){ window.cowork = {
    callMcpTool: function(name, args){ const sql=(args&&args.sql)||""; if(/SELECT/i.test(sql)){d1reads++;return Promise.resolve({structuredContent:[{results:[{v:"{}",ts:"0"}],success:true}],isError:false});} d1writes++; return Promise.resolve({structuredContent:[{results:[],success:true}],isError:false}); },
    askClaude: function(p, data){ return Promise.resolve("respuesta de prueba de la IA"); }
  }; } });
dom.window.addEventListener("error", e => errs.push(String(e.message)));
dom.window.requestAnimationFrame = cb => setTimeout(cb, 0);
dom.window.confirm = () => true;
setTimeout(() => {
  const d = dom.window.document, G = dom.window.__game;
  const bichos = d.querySelectorAll("#layer .bicho").length;
  const nests = d.querySelectorAll("#layer .nest").length;
  const res = d.querySelectorAll("#res .res").length;
  const lenses = d.querySelectorAll("#lenses .btn").length;
  const expCol = T.areas.filter(a => T.species[a]).length;
  const a11yBichos = d.querySelectorAll('#layer .bicho[role="button"][tabindex="0"][aria-label]').length;
  const a11yNidos = d.querySelectorAll('#layer .nest[role="button"][tabindex="0"][aria-label]').length;
  console.log("bichos =", bichos, "| esperados =", T.projects.length);
  console.log("nidos =", nests, "| colonias =", expCol);
  console.log("HUD =", res, "| lentes =", lenses);
  console.log("accesibles: bichos =", a11yBichos, "| nidos =", a11yNidos);
  // selección
  const id = G.firstId(); G.selectOnly(id);
  const sel1 = G.selected.length === 1;
  const cmd = d.querySelector("#cmdbar").classList.contains("show");
  const ring = d.querySelectorAll("#layer .bicho.sel").length;
  console.log("selectOnly →", G.selected.length, "sel | cmdbar:", cmd, "| anillos:", ring);
  // acción: destacar
  G.act_feature(false); const f0 = G.featuredCount(); G.act_feature(true); const f1 = G.featuredCount();
  console.log("act_feature(true): featured", f0, "→", f1);
  // prioridad
  G.act_prio(1);
  // colonia + merge
  const area = T.projects.find(p=>p.id===id).area; G.selectColony(area);
  const nbefore = G.projects; const nsel = G.selected.length;
  if (nsel >= 2) G.act_merge();
  const nafter = G.projects;
  console.log("merge colonia("+nsel+"): proyectos", nbefore, "→", nafter);
  // archivar (mueve de cámara) — rebuild
  G.clearSel(); G.selectOnly(G.firstId()); G.act_camara("vertedero");
  // stats / export
  G.openStats(); const stOpen = d.querySelector("#stats").classList.contains("open");
  const tablas = d.querySelectorAll("#statsbody table.tb").length; G.closeModal("stats");
  G.openExport(); const exOpen = d.querySelector("#export").classList.contains("open");
  const exHas = (d.querySelector("#expText").value||"").length > 10; G.closeModal("export");
  console.log("stats abre:", stOpen, "| tablas:", tablas, "|| export abre:", exOpen, "| json:", exHas);
  // nido por doble-click
  const nest = d.querySelector("#layer .nest");
  nest.dispatchEvent(new dom.window.MouseEvent("dblclick", { bubbles: true }));
  const nestOpen = d.querySelector("#nest").classList.contains("open");
  const rooms = d.querySelectorAll("#nestbody .room").length;
  console.log("nido abre:", nestOpen, "| cámaras:", rooms);
  // mesa de trabajo
  G.setView(true); const wbOpen = d.querySelector("#workbench").classList.contains("open");
  G.switchTab("lista"); const wbRows = d.querySelectorAll("#wbbody table.wb tbody tr").length;
  G.switchTab("tablero"); const cols = d.querySelectorAll("#wbbody .col").length;
  G.switchTab("dupes"); const dupesOk = d.querySelector("#wbbody") != null;
  G.switchTab("ideas"); const ideasOk = d.querySelector("#wbbody") != null;
  G.switchTab("atencion"); const inboxOk = d.querySelector("#wbbody .inbox,#wbbody .card") != null;
  G.setView(false);
  console.log("mesa abre:", wbOpen, "| lista filas:", wbRows, "| tablero cols:", cols, "| inbox:", inboxOk);
  // ayuda + IA + ficha + lupa
  const hasHelp = !!d.querySelector("#vMesa[data-tip]");
  const aiOn = G.ai;
  G.openFicha(G.firstProj());
  const fwOk = !!d.querySelector("#fwNote") && !!d.querySelector("#fwGo") && !!d.querySelector("#fwExp");
  const fwQ = d.querySelector("#fwQ"); if (fwQ) fwQ.value = "¿qué hago aquí?";
  const fwGo = d.querySelector("#fwGo"); if (fwGo) fwGo.click();
  const chatMsgs = d.querySelectorAll("#fwLog .msg").length;
  let zipOk = false; try { d.querySelector("#fwExp").click(); zipOk = true; } catch (e) {}
  G.toggleLupa(); const lupaOn = d.querySelector("#lupa").classList.contains("on"); G.toggleLupa();
  d.querySelector("#fichaClose").click();
  console.log("ayuda:", hasHelp, "| IA:", aiOn, "| ficha-trabajo:", fwOk, "| chat msgs:", chatMsgs, "| export:", zipOk, "| lupa:", lupaOn);
  // nube
  const cloudOn = G.cloud;
  G.cloudSave();
  setTimeout(() => {
    const syncTxt = d.querySelector("#syncst").textContent;
    console.log("nube activa:", cloudOn, "| D1 lecturas:", d1reads, "escrituras:", d1writes, "| estado:", syncTxt);
    console.log("errores JS =", errs.length, errs.slice(0,4));
    const pass = bichos===T.projects.length && nests===expCol && a11yBichos===bichos && a11yNidos===nests && res>0 && lenses===6 &&
      sel1 && cmd && ring===1 && f1===f0+1 && stOpen && tablas>=1 && exOpen && exHas && nestOpen && rooms===6 &&
      wbOpen && wbRows>0 && cols===4 && inboxOk && cloudOn===true && d1reads>=1 && d1writes>=1 &&
      hasHelp && aiOn===true && fwOk && chatMsgs>=1 && zipOk && lupaOn && errs.length===0;
    console.log(pass ? "VERIFY APP: PASS" : "VERIFY APP: FAIL");
    process.exit(pass ? 0 : 1);
  }, 120);
}, 500);
