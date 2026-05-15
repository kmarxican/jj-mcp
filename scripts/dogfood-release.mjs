#!/usr/bin/env node
// Dogfood the release using jj-mcp's own MCP tools

import { spawn } from "child_process";
import process from "process";

const CWD = "/Users/timthorpe/code/jj-mcp";
const SERVER = `${CWD}/dist/index.js`;

let reqId = 1;
function send(stdin, method, params = {}) {
  const req = { jsonrpc: "2.0", id: reqId++, method, params };
  const line = JSON.stringify(req) + "\n";
  stdin.write(line);
  return req.id;
}

function waitForResponse(stdout, targetId, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const onData = (data) => {
      const lines = data.toString().split("\n").filter(Boolean);
      for (const line of lines) {
        try {
          const msg = JSON.parse(line);
          if (msg.id === targetId) {
            stdout.off("data", onData);
            clearTimeout(timer);
            resolve(msg);
          }
        } catch {}
      }
    };
    stdout.on("data", onData);
    const timer = setTimeout(() => {
      stdout.off("data", onData);
      reject(new Error("Timeout waiting for response"));
    }, timeout);
  });
}

async function callTool(proc, name, args = {}) {
  const id = send(proc.stdin, "tools/call", { name, arguments: { ...args, cwd: CWD } });
  return waitForResponse(proc.stdout, id, 30000);
}

const proc = spawn("node", [SERVER], { cwd: CWD });
proc.stderr.on("data", () => {});

// Initialize
const initId = send(proc.stdin, "initialize", { protocolVersion: "2024-11-05", capabilities: {} });
await waitForResponse(proc.stdout, initId);

console.log("1. Describing working copy...");
const describeRes = await callTool(proc, "jj_describe", { message: "chore(release): bump version to 1.0.5" });
console.log(describeRes.result?.content?.[0]?.text || describeRes.error?.message || "OK");

console.log("2. Committing...");
const commitRes = await callTool(proc, "jj_commit", { message: "chore(release): bump version to 1.0.5" });
console.log(commitRes.result?.content?.[0]?.text || commitRes.error?.message || "OK");

console.log("3. Creating tag v1.0.5...");
const tagRes = await callTool(proc, "jj_tag_create", { name: "v1.0.5" });
console.log(tagRes.result?.content?.[0]?.text || tagRes.error?.message || "OK");

console.log("4. Pushing to origin...");
const pushRes = await callTool(proc, "jj_git_push", { remote: "origin" });
console.log(pushRes.result?.content?.[0]?.text || pushRes.error?.message || "OK");

proc.kill();
console.log("\nDogfood release complete.");
