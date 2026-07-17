const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const repo = path.resolve(__dirname, "..");
const imperio = path.join(repo, "demo", "index.html");
const clasico = path.join(repo, "demo", "clasico.html");
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

const before = hash(imperio);
const run = spawnSync(process.execPath, [path.join(__dirname, "run-python.js"), path.join(__dirname, "build.py")], {
  cwd: repo,
  encoding: "utf8",
  env: { ...process.env, PYTHONUTF8: "1", PYTHONIOENCODING: "utf-8" },
});

if (run.status !== 0) {
  process.stderr.write(run.stdout || "");
  process.stderr.write(run.stderr || "");
  process.exit(run.status || 1);
}

const after = hash(imperio);
const classicOk = fs.readFileSync(clasico, "utf8").includes("const TERR = ");
console.log(`Imperio intacto = ${before === after} | clásica generada = ${classicOk}`);
if (before !== after || !classicOk) process.exit(1);
console.log("BUILD DEFAULT: PASS");
