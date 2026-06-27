// Smoke test de los ÁRBOLES POR ESPECIE dentro del juego integrado.
const { JSDOM } = require("jsdom"); const fs = require("fs");
const html = fs.readFileSync(process.argv[2], "utf-8");
let errs = [];
const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true, url: "http://localhost/",
  beforeParse(w){ w.cowork = { callMcpTool:()=>Promise.resolve({structuredContent:[{results:[{v:"{}",ts:"0"}],success:true}],isError:false}), askClaude:()=>Promise.resolve("x") }; } });
dom.window.addEventListener("error", e => errs.push(String(e.message)));
dom.window.requestAnimationFrame = cb => setTimeout(cb, 0);
setTimeout(() => {
  const d = dom.window.document, W = dom.window, T = W.__tree;
  function A(c,m){ console.log((c?"PASS":"FAIL")+" — "+m); if(!c) process.exitCode = 1; }
  A(!!T, "window.__tree expuesto");
  A(!!T && T.KEYS.length===13, "13 colonias con árbol (" + (T?T.KEYS.length:"-") + ")");
  A(!!T && T.PATTERN.length===16, "patrón de 16 nodos");
  T.open();
  A(d.querySelector("#mejoras").classList.contains("open"), "modal abre (selector)");
  const picks = d.querySelectorAll("#treeBody .tr-pick").length;
  A(picks===13, "selector con 13 colonias (" + picks + ")");
  T.openTree("Claude/Skills/Automatización");
  const nodes = d.querySelectorAll("#treeBody .tr-node").length;
  A(nodes===17, "árbol hormigas: 17 nodos (" + nodes + ")");
  const bhead = d.querySelector("#treeBody .tr-branch[data-b='patas'] .tr-bhead");
  A(!!bhead && /Patas/i.test(bhead.textContent), "rama Patas etiquetada (" + (bhead?bhead.textContent.trim():"-") + ")");
  const f0 = T.state().res.f;
  const p1 = d.querySelector('#treeBody .tr-node[data-id="p1"]');
  p1.dispatchEvent(new W.MouseEvent("click", { bubbles:true }));
  A(!!T.state().unlocked.p1, "compra p1 desbloquea");
  A(Math.round(T.state().res.f)===Math.round(f0-60), "−60 recurso f (" + Math.round(T.state().res.f) + ")");
  A(d.querySelector('#treeBody .tr-node[data-id="p1"]').classList.contains("done"), "p1 'done' (halo verde)");
  T.openTree("Negocio/Ideas");
  A(d.querySelectorAll("#treeBody .tr-node").length===17, "árbol abejas render (17)");
  A(!T.state().unlocked.p1, "estado independiente por colonia (abejas p1 sin comprar)");
  A(W.__game!=null && d.querySelectorAll("#layer .bicho").length>0, "motor del juego intacto");
  A(errs.length===0, "0 errores JS (" + errs.slice(0,2).join(" | ") + ")");
  console.log(process.exitCode ? "TREES: FAIL" : "TREES: PASS");
  process.exit(process.exitCode || 0);
}, 500);
