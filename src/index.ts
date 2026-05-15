#!/usr/bin/env node
/* eslint-disable no-console */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { tools } from "./tools/index.js";
import { getJjVersion, isJjRepo } from "./jj.js";
import { handleToolRequest } from "./handlers/tools.js";
import { handleListResources, handleReadResource } from "./handlers/resources.js";

const server = new Server(
  {
    name: "jj-mcp",
    version: "1.0.5",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, () => ({ tools }));
server.setRequestHandler(CallToolRequestSchema, handleToolRequest);
server.setRequestHandler(ListResourcesRequestSchema, handleListResources);
server.setRequestHandler(ReadResourceRequestSchema, handleReadResource);

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes("--version")) {
    console.log("jj-mcp v1.0.5");
    process.exit(0);
  }

  if (args.includes("--help")) {
    console.log("jj-mcp - MCP server for Jujutsu version control");
    console.log("");
    console.log("Usage: jj-mcp [options]");
    console.log("");
    console.log("Options:");
    console.log("  --version   Print version and exit");
    console.log("  --help      Print this help message and exit");
    console.log("  --check     Verify environment and exit");
    console.log("");
    console.log("Without options, starts the MCP stdio server.");
    process.exit(0);
  }

  if (args.includes("--check")) {
    const version = getJjVersion();
    if (!version) {
      console.error("❌ Environment Error: 'jj' binary not found in PATH.");
      process.exit(1);
    }

    if (isJjRepo()) {
      console.log(`✅ Ready: Found ${version} in a valid jj repo.`);
    } else {
      console.warn(`⚠️ Warning: Found ${version}, but this is NOT a jj repo.`);
      console.log("👉 Suggestion: Run 'jj git init --colocate' to start.");
    }
    process.exit(0);
  }

  if (process.stdin.isTTY) {
    console.error("🚀 jj-mcp server started. Waiting for JSON-RPC messages on stdin.");
    console.error("Run with --check to verify your environment.");
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
