// Test CUIDADORES v5: cadencia por cuidador, IA opcional (on/off), panel Cuadrilla.
const { JSDOM } = require("jsdom"); const fs = require("fs");
const html = fs.readFileSync(process.argv[2], "utf-8");
let errs = [];
const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true, url: "http://localhost/",
  beforeParse(w){ w.cowork = { callMcpTool:()=>Promise.resolve({structuredContent:[{results:[{v:"{}",ts:"0"}],success:true}],isError:false}), askClaude:()=>Promise.resolve("Define el alcance mínimo y haz una prueba pequeña") }; } });
dom.window.addEventListener("error", e => errs.push(String(e.message)));
dom.window.requestAnimationFrame = cb => setTimeout(cb, 0);
dom.window.confirm = () => true;
setTimeout(() => {
  const d = dom.window.document, W = dom.window, G = W.__game;
  function A(c,m){ console.log((c?"PASS":"FAIL")+" — "+m); if(!c) process.exitCode = 1; }
  A(!!G && G.keepers().length === 5, "5 cuidadores");
  A(G.keepers().every(k=>k.auto===true), "auto por defecto");
  // cadencia POR cuidador
  G.setCadence("granjero", 8000);
  A(G.cadence("granjero") === 8000, "cadencia del granjero = 8000");
  A(G.cadence("detective") === 3000, "cadencia independiente por cuidador (detective sigue en 3000)");
  G.setCadence("granjero", 3000);
  // órdenes por colonia (sigue v4)
  G.setScope("medico","Sistemas/PC Windows"); A(G.keepers().find(k=>k.role==="medico").scope==="Sistemas/PC Windows", "órdenes por colonia (scope)"); G.setScope("medico","");
  // panel Cuadrilla
  A(d.querySelector("#bCuadrilla") != null, "botón 🧑‍🌾 Cuadrilla en el HUD");
  G.openCuadrilla();
  A(d.querySelector("#cuadrilla").classList.contains("open"), "panel Cuadrilla abre");
  A(d.querySelectorAll("#cuaBody .cua-card").length === 5, "Cuadrilla muestra los 5 cuidadores (" + d.querySelectorAll("#cuaBody .cua-card").length + ")");
  d.querySelector("#cuaClose").click();
  // médico pide intervención
  G.scanKeeper("medico"); const mk = G.keepers().find(k=>k.role==="medico"); const mq = mk.queue.length; G.tickKeeper("medico");
  A(mq===0 || mk.needs.length>=1, "médico pide intervención (needs=" + mk.needs.length + ")");
  // estadísticas + motor
  G.openStats(); A(d.querySelector("#statsbody").innerHTML.indexOf("Cuadrilla")>=0, "sección 'Cuadrilla' en 📊"); G.closeModal("stats");
  A(d.querySelectorAll("#keepers .keeper").length===5, "5 cuidadores en el mundo");
  A(d.querySelectorAll("#lenses .btn").length===6, "6 lentes");
  A(d.querySelectorAll("#layer .bicho").length>0, "motor intacto");
  // IA OFF -> el científico NO propone
  G.setAI(false); A(G.keeperAI()===false, "IA configurable: OFF");
  const id = G.firstId();
  const ndOff = G.aiProposeStep("cientifico", id);
  setTimeout(() => {
    A(ndOff.state !== "ready", "IA OFF: el científico NO usa IA (state=" + ndOff.state + ")");
    // IA ON -> propone
    G.setAI(true); A(G.keeperAI()===true, "IA configurable: ON");
    const ndOn = G.aiProposeStep("cientifico", id);
    setTimeout(() => {
      A(ndOn.state === "ready" && !!ndOn.proposal, "IA ON: el científico propone paso (\"" + (ndOn.proposal||"") + "\")");
      A(errs.length === 0, "0 errores JS (" + errs.slice(0,2).join(" | ") + ")");
      console.log(process.exitCode ? "KEEPERS: FAIL" : "KEEPERS: PASS");
      process.exit(process.exitCode || 0);
    }, 90);
  }, 90);
}, 700);
