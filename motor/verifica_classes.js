// Test de CLASES/OFICIOS + tooltips dentro del juego integrado.
const { JSDOM } = require("jsdom"); const fs = require("fs");
const html = fs.readFileSync(process.argv[2], "utf-8");
let errs = [];
const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true, url: "http://localhost/",
  beforeParse(w){ w.cowork = { callMcpTool:()=>Promise.resolve({structuredContent:[{results:[{v:"{}",ts:"0"}],success:true}],isError:false}), askClaude:()=>Promise.resolve("x") }; } });
dom.window.addEventListener("error", e => errs.push(String(e.message)));
dom.window.requestAnimationFrame = cb => setTimeout(cb, 0);
dom.window.confirm = () => true;
setTimeout(() => {
  const d = dom.window.document, W = dom.window, G = W.__game;
  function A(c,m){ console.log((c?"PASS":"FAIL")+" — "+m); if(!c) process.exitCode = 1; }
  // oficios en los bichos (clase k-*)
  const cls = {};
  d.querySelectorAll("#layer .bicho").forEach(b => { const m = b.className.match(/\bk-([a-z]+)/); if(m) cls[m[1]] = (cls[m[1]]||0)+1; });
  const kinds = Object.keys(cls);
  A(kinds.length>=5, "bichos con ≥5 oficios distintos (" + kinds.length + ": " + kinds.join(",") + ")");
  // 6 lentes (incl. Clases)
  const lenses = d.querySelectorAll("#lenses .btn").length;
  A(lenses===6, "6 lentes incl. Clases (" + lenses + ")");
  const cb = d.querySelector('[data-lens="clases"]');
  cb.dispatchEvent(new W.MouseEvent("click", { bubbles:true }));
  A(d.querySelector("#layer").classList.contains("lensclass"), "lente Clases activa (glow por oficio)");
  // tooltips en cmdbar
  G.selectOnly(G.firstId());
  const actTips = d.querySelectorAll("#selActs .btn[data-tip]").length;
  A(actTips>=10, "acciones del cmdbar con tooltip (" + actTips + ")");
  // ficha con clase + tooltips
  G.openFicha(G.firstProj());
  const stTips = d.querySelectorAll("#fichaBody .st[data-tip]").length;
  A(stTips>=2, "ficha: estado/oficio con tooltip (" + stTips + ")");
  const facts = d.querySelectorAll("#fichaActs .btn[data-tip]").length;
  A(facts>=6, "ficha: acciones con tooltip (" + facts + ")");
  d.querySelector("#fichaClose").click();
  const total = d.querySelectorAll("[data-tip]").length;
  A(total>=30, "muchos elementos con tooltip explicativo (" + total + ")");
  A(W.__game!=null && d.querySelectorAll("#layer .bicho").length>0, "motor del juego intacto");
  A(errs.length===0, "0 errores JS (" + errs.slice(0,2).join(" | ") + ")");
  console.log(process.exitCode ? "CLASSES: FAIL" : "CLASSES: PASS");
  process.exit(process.exitCode || 0);
}, 600);
