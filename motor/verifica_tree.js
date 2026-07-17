// Smoke test del módulo "Árbol de Mejoras" dentro del juego integrado.
const { JSDOM, VirtualConsole } = require("jsdom"); const fs = require("fs");
const html = fs.readFileSync(process.argv[2] || "demo/index.html", "utf-8");
let errs = [];
const vc = new VirtualConsole();
vc.on("jsdomError", e => { if(!/canvas|getContext|Not implemented/i.test(String(e.message||e))) errs.push(String(e.message||e)); });
const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: vc, url: "http://localhost/",
  beforeParse(w){ w.cowork = { callMcpTool:()=>Promise.resolve({structuredContent:[{results:[{v:"{}",ts:"0"}],success:true}],isError:false}), askClaude:()=>Promise.resolve("x") }; } });
dom.window.addEventListener("error", e => errs.push(String(e.message)));
dom.window.requestAnimationFrame = cb => setTimeout(cb, 0);
dom.window.confirm = () => true;
setTimeout(() => {
  const d = dom.window.document, T = dom.window.__tree;
  function A(c,m){ console.log((c?"PASS":"FAIL")+" — "+m); if(!c) process.exitCode = 1; }
  A(!!T, "window.__tree expuesto");
  A(!!T && T.ALL.length===17, "17 nodos definidos (" + (T?T.ALL.length:"-") + ")");
  A(d.querySelector("#bMejoras")!=null, "botón 🛠 presente en el HUD");
  A(T.statusOf(T.byId("r1"))==="ready", "r1 comprable (ready)");
  A(T.statusOf(T.byId("r2"))==="locked", "r2 bloqueada");
  T.open();
  A(d.querySelector("#mejoras").classList.contains("open"), "modal del árbol abre");
  const nodes = d.querySelectorAll("#treeBody .tr-node").length;
  A(nodes===17, "17 nodos renderizados (" + nodes + ")");
  const f0 = T.state().res.f;
  T.onClick(T.byId("r1"));
  A(!!T.state().unlocked.r1, "r1 desbloqueada tras click");
  A(Math.round(T.state().res.f)===Math.round(f0-60), "−60 comida (" + Math.round(T.state().res.f) + ")");
  A(d.querySelector('#treeBody .tr-node[data-id="r1"]').classList.contains("done"), "r1 marcada 'done' (halo verde)");
  A(T.statusOf(T.byId("r2"))!=="locked", "r2 se desbloquea como próximo paso");
  A(dom.window.__game!=null && d.querySelectorAll("#layer .bicho").length>0, "motor del juego intacto (bichos presentes)");
  A(errs.length===0, "0 errores JS (" + errs.slice(0,3).join(" | ") + ")");
  console.log(process.exitCode ? "TREE: FAIL" : "TREE: PASS");
  process.exit(process.exitCode || 0);
}, 500);
