#!/usr/bin/env node
"use strict";

const { spawnSync } = require("node:child_process");

const args = process.argv.slice(2);
if (!args.length) {
  console.error("Uso: node motor/run-python.js <script.py> [argumentos...]");
  process.exit(2);
}

const candidates = process.platform === "win32"
  ? [["py", ["-3"]], ["python", []], ["python3", []]]
  : [["python3", []], ["python", []], ["py", ["-3"]]];

for (const [command, prefix] of candidates) {
  const probe = spawnSync(command, [...prefix, "--version"], { encoding: "utf8" });
  if (probe.error || probe.status !== 0) continue;
  const env = { ...process.env, PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" };
  const result = spawnSync(command, [...prefix, ...args], { stdio: "inherit", env });
  process.exit(result.status == null ? 1 : result.status);
}

console.error("No se encontró Python 3. Instálalo y asegúrate de que py, python o python3 esté disponible.");
process.exit(127);
