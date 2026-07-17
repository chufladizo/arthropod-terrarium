// Regresión del rediseño piloto de hormigas en las vistas moderna y clásica.
const fs = require("fs");
const app = fs.readFileSync("motor/app_terrario_src.html", "utf8");
const svg = fs.readFileSync("motor/critters.js", "utf8");
const html = fs.readFileSync(process.argv[2] || "demo/index.html", "utf8");

let failed = false;
function assert(ok, label) {
  console.log((ok ? "PASS" : "FAIL") + " — " + label);
  if (!ok) failed = true;
}

assert(/function bugSprite\([^)]*caste\)/.test(app), "sprite moderno recibe la casta");
assert(/bugSprite\([^\n]*p\.caste\)/.test(app), "jardín propaga la casta al sprite");
assert(/openFicha[\s\S]{0,300}p\.caste/.test(app), "ficha conserva la identidad de casta");
assert(/openNest[\s\S]{0,900}p\.caste/.test(app), "corte del nido conserva la identidad de casta");

for (const caste of ["legionaria", "bala", "cortadora", "melifera", "carpintera", "tejedora", "cosechadora"]) {
  assert(app.includes(`caste==='${caste}'`), `señal visual moderna: ${caste}`);
  assert(svg.includes(`case "${caste}"`), `variante SVG clásica: ${caste}`);
}

assert(/L43 43 L32 39/.test(svg) && /stroke-linejoin="round"/.test(svg), "patas y antenas SVG articuladas");
assert(/"key": "ant"/.test(html) && /"caste":/.test(html), "build contiene hormigas con casta");

console.log(failed ? "ANTS: FAIL" : "ANTS: PASS");
process.exit(failed ? 1 : 0);
