#!/usr/bin/env node
// Manual end-to-end verification of all jj-mcp tools
// Spawns the server and exercises each tool via JSON-RPC stdio

import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

const TMPDIR = fs.mkdtempSync(path.join(os.tmpdir(), "jj-mcp-e2e-"));
process.chdir(TMPDIR);

// Initialize a jj repo with a git colocation for tests that need it
const { execSync } = await import("child_process");
execSync("jj git init --colocate", { stdio: "pipe" });
execSync("git init", { stdio: "pipe" });
execSync("git remote add origin https://github.com/kmarxican/jj-mcp.git", { stdio: "pipe" });

// Create a file and commit so the repo has state
fs.writeFileSync("test.txt", "hello");
try {
  execSync("jj describe -m 'initial'", { stdio: "ignore" });
  execSync("jj commit", { stdio: "ignore" });
} catch {
  // If commit fails (e.g. empty working copy), just ensure a change exists
  fs.writeFileSync("test.txt", "hello world");
}

let reqId = 1;
function send(stdin, method, params = {}) {
  const req = { jsonrpc: "2.0", id: reqId++, method, params };
  const line = JSON.stringify(req) + "\n";
  stdin.write(line);
  return req.id;
}

function waitForResponse(stdout, targetId) {
  return new Promise((resolve, reject) => {
    const onData = (data) => {
      const lines = data.toString().split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const msg = JSON.parse(line);
          if (msg.id === targetId) {
            stdout.off("data", onData);
            resolve(msg);
          }
        } catch {}
      }
    };
    stdout.on("data", onData);
    setTimeout(() => {
      stdout.off("data", onData);
      reject(new Error("Timeout waiting for response"));
    }, 10000);
  });
}

const serverPath = process.argv[2] || "./dist/index.js";
const proc = spawn("node", [serverPath], { cwd: "/Users/timthorpe/code/jj-mcp" });

proc.stderr.on("data", (d) => {
  // Ignore server stderr unless needed
});

// Initialize
const initId = send(proc.stdin, "initialize", { protocolVersion: "2024-11-05", capabilities: {} });
await waitForResponse(proc.stdout, initId);

// List tools
const listId = send(proc.stdin, "tools/list");
const listRes = await waitForResponse(proc.stdout, listId);
const tools = listRes.result.tools;
console.log(`Discovered ${tools.length} tools`);

const results = [];
const cwd = TMPDIR;

for (const tool of tools) {
  const name = tool.name;
  const schema = tool.inputSchema;
  const args = {};

  // Build minimal valid args from schema
  const props = schema.properties || {};
  for (const [key, spec] of Object.entries(props)) {
    if (schema.required?.includes(key)) {
      if (spec.type === "string") args[key] = "test-value";
      if (spec.type === "number") args[key] = 1;
      if (spec.type === "boolean") args[key] = false;
      if (spec.type === "array") args[key] = [];
    }
  }

  // Tool-specific overrides for meaningful calls
  switch (name) {
    case "jj_git_clone":
      args.url = "https://github.com/kmarxican/jj-mcp.git";
      args.destination = path.join(TMPDIR, "clone-test");
      break;
    case "jj_git_fetch":
    case "jj_git_push":
      // These will likely fail with auth errors but should not crash
      break;
    case "jj_config_get":
      args.name = "ui.default-command";
      break;
    case "jj_config_set":
      args.name = "test.key";
      args.value = "test-value";
      break;
    case "jj_file_show":
      args.path = "test.txt";
      break;
    case "jj_tag_create":
      args.name = "test-tag";
      break;
    case "jj_bookmark_create":
      args.name = "test-bookmark";
      break;
    case "jj_workspace_add":
      args.name = "test-workspace";
      break;
    case "jj_bisect":
      args.range = "@-..@";
      break;
    case "jj_abandon":
      args.revset = "@-";
      break;
    case "jj_rebase":
      args.source = "@-";
      args.destination = "@";
      break;
    case "jj_describe":
      args.message = "test description";
      break;
    case "jj_commit":
      // Need a change to commit
      fs.writeFileSync(path.join(cwd, "commit-test.txt"), "data");
      args.message = "test commit";
      break;
    case "jj_squash":
      args.from = "@-";
      args.into = "@";
      break;
    case "jj_split":
      args.interactive = false;
      break;
    case "jj_restore":
      args.paths = ["test.txt"];
      break;
    case "jj_new":
      args.message = "new empty";
      break;
    case "jj_sparse":
      args.list = true;
      break;
    case "jj_edit":
      args.revset = "@";
      break;
    case "jj_next":
    case "jj_prev":
      args.amount = 1;
      break;
    case "jj_undo":
      args.from = 1;
      break;
    case "jj_redo":
      // no args needed
      break;
    case "jj_init":
      args.cwd = path.join(TMPDIR, "init-test");
      break;
    case "jj_sanity_check":
      // no args needed
      break;
  }

  // Always add cwd
  args.cwd = cwd;

  try {
    const callId = send(proc.stdin, "tools/call", { name, arguments: args });
    const res = await waitForResponse(proc.stdout, callId);
    const hasError = res.result?.isError || res.error;
    const ok = !hasError;
    results.push({ name, ok, hasError, text: res.result?.content?.[0]?.text?.slice(0, 120) });
    console.log(`${ok ? "✓" : "⚠"} ${name}`);
  } catch (err) {
    results.push({ name, ok: false, error: err.message });
    console.log(`✗ ${name}: ${err.message}`);
  }
}

proc.kill();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} tools passed`);
if (failed.length > 0) {
  console.log("\nFailed tools:");
  for (const f of failed) {
    console.log(`  ${f.name}: ${f.error || f.text || "tool returned error"}`);
  }
  process.exit(1);
}
console.log("\nAll tools verified successfully.");
process.exit(0);
