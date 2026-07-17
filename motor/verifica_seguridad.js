// Regresión: los datos se incrustan como JSON seguro aunque contengan </script>.
"use strict";
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { JSDOM, VirtualConsole } = require("jsdom");

const root = path.resolve(__dirname, "..");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "terrario-security-"));
const out = path.join(tmp, "out.html");
let ok = false;

try {
  for (const name of ["projects_data.json", "species.json", "tokens.json"])
    fs.copyFileSync(path.join(root, "ejemplo", name), path.join(tmp, name));
  const dataPath = path.join(tmp, "projects_data.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  data[0].ultimo_avance = "cierre hostil </script><script>throw new Error('XSS')</script>";
  fs.writeFileSync(dataPath, JSON.stringify(data), "utf8");

  const build = spawnSync(process.execPath,
    [path.join(__dirname, "run-python.js"), path.join(__dirname, "build.py"), tmp, out],
    { cwd: root, encoding: "utf8" });
  if (build.status !== 0) throw new Error(build.stderr || build.stdout || "build falló");

  const html = fs.readFileSync(out, "utf8");
  const escaped = html.includes("\\u003c/script>") && !html.includes("cierre hostil </script>");
  const errors = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", e => errors.push(String(e.message || e)));
  const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: vc });
  const api = typeof dom.window.openColony === "function";
  ok = escaped && api && errors.length === 0;
  console.log("escape HTML =", escaped, "| API intacta =", api, "| errores JS =", errors.length);
  console.log(ok ? "SECURITY: PASS" : "SECURITY: FAIL");
} finally {
  const resolved = path.resolve(tmp);
  if (resolved.startsWith(path.resolve(os.tmpdir()) + path.sep) && path.basename(resolved).startsWith("terrario-security-"))
    fs.rmSync(resolved, { recursive: true, force: true });
}

process.exit(ok ? 0 : 1);
