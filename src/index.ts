#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  type CallToolRequest,
} from "@modelcontextprotocol/sdk/types.js";

import { tools } from "./tools.js";
import {
  jjStatus,
  jjLog,
  jjDiff,
  jjDescribe,
  jjCommit,
  jjNew,
  jjAbandon,
  jjRebase,
  jjBookmarkList,
  jjBookmarkCreate,
  jjBookmarkDelete,
  getJjVersion,
  isJjRepo,
  jjInit,
  jjSquash,
  jjSplit,
  jjUndo,
  jjRedo,
  jjRestore,
  jjEdit,
  jjNext,
  jjPrev,
  runJj,
  jjGitFetch,
  jjGitPush,
  jjGitImport,
  jjGitExport,
  jjGitClone,
  jjObslog,
  jjOpLog,
  jjWorkspaceList,
  jjWorkspaceAdd,
  jjConfigGet,
  jjConfigSet,
  jjBisect,
  jjFileShow,
  jjTagList,
  jjTagCreate,
  jjSparse,
} from "./jj.js";

const server = new Server(
  {
    name: "jj-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
  const { name, arguments: args } = request.params;
  const cwd = args?.cwd as string | undefined;

  try {
    let result;

    switch (name) {
      case "jj_status":
        result = jjStatus(cwd);
        break;

      case "jj_log":
        result = jjLog(
          args?.revset as string | undefined,
          args?.limit as number | undefined,
          cwd
        );
        break;

      case "jj_diff":
        result = jjDiff(args?.revset as string | undefined, cwd);
        break;

      case "jj_describe":
        result = jjDescribe(
          args?.message as string,
          args?.revset as string | undefined,
          cwd
        );
        break;

      case "jj_commit":
        result = jjCommit(args?.message as string, cwd);
        break;

      case "jj_new":
        result = jjNew(
          args?.revset as string | undefined,
          args?.message as string | undefined,
          cwd
        );
        break;

      case "jj_abandon":
        result = jjAbandon(args?.revset as string, cwd);
        break;

      case "jj_rebase":
        result = jjRebase(
          args?.source as string,
          args?.destination as string,
          cwd
        );
        break;

      case "jj_bookmark_list":
        result = jjBookmarkList(cwd);
        break;

      case "jj_bookmark_create":
        result = jjBookmarkCreate(
          args?.name as string,
          args?.revset as string | undefined,
          cwd
        );
        break;

      case "jj_bookmark_delete":
        result = jjBookmarkDelete(args?.name as string, cwd);
        break;

      case "jj_sanity_check": {
        const version = getJjVersion();
        const repo = isJjRepo(cwd);
        if (!version) {
          return {
            content: [
              {
                type: "text",
                text: "❌ Environment Error: 'jj' binary not found in PATH.",
              },
            ],
            isError: true,
          };
        }
        const messages = [`✅ Found ${version}`];
        if (repo) {
          messages.push("✅ Current directory is inside a valid jj repo.");
        } else {
          messages.push("⚠️ Current directory is NOT inside a jj repo.");
          messages.push("👉 Suggestion: Run 'jj git init --colocate' to start.");
        }
        return {
          content: [
            {
              type: "text",
              text: messages.join("\n"),
            },
          ],
        };
      }

      case "jj_init":
        result = jjInit(cwd);
        break;

      case "jj_squash":
        result = jjSquash(
          args?.from as string | undefined,
          args?.into as string | undefined,
          args?.message as string | undefined,
          cwd
        );
        break;

      case "jj_split":
        result = jjSplit(
          args?.revset as string | undefined,
          args?.interactive as boolean | undefined,
          cwd
        );
        break;

      case "jj_undo":
        result = jjUndo(args?.from as number | undefined, cwd);
        break;

      case "jj_redo":
        result = jjRedo(cwd);
        break;

      case "jj_restore":
        result = jjRestore(
          args?.paths as string[] | undefined,
          args?.from as string | undefined,
          args?.to as string | undefined,
          cwd
        );
        break;

      case "jj_edit":
        result = jjEdit(args?.revset as string | undefined, cwd);
        break;

      case "jj_next":
        result = jjNext(args?.amount as number | undefined, cwd);
        break;

      case "jj_prev":
        result = jjPrev(args?.amount as number | undefined, cwd);
        break;

      case "jj_git_fetch":
        result = jjGitFetch(args?.remote as string | undefined, cwd);
        break;

      case "jj_git_push":
        result = jjGitPush(
          args?.remote as string | undefined,
          args?.bookmark as string | undefined,
          cwd
        );
        break;

      case "jj_git_import":
        result = jjGitImport(cwd);
        break;

      case "jj_git_export":
        result = jjGitExport(cwd);
        break;

      case "jj_git_clone":
        result = jjGitClone(
          args?.url as string,
          args?.destination as string | undefined,
          cwd
        );
        break;

      case "jj_obslog":
        result = jjObslog(
          args?.revset as string | undefined,
          args?.limit as number | undefined,
          cwd
        );
        break;

      case "jj_op_log":
        result = jjOpLog(args?.limit as number | undefined, cwd);
        break;

      case "jj_workspace_list":
        result = jjWorkspaceList(cwd);
        break;

      case "jj_workspace_add":
        result = jjWorkspaceAdd(
          args?.name as string,
          args?.revision as string | undefined,
          cwd
        );
        break;

      case "jj_config_get":
        result = jjConfigGet(args?.name as string, cwd);
        break;

      case "jj_config_set":
        result = jjConfigSet(
          args?.name as string,
          args?.value as string,
          cwd
        );
        break;

      case "jj_bisect":
        result = jjBisect(
          args?.range as string,
          args?.command as string | undefined,
          cwd
        );
        break;

      case "jj_file_show":
        result = jjFileShow(
          args?.path as string,
          args?.revision as string | undefined,
          cwd
        );
        break;

      case "jj_tag_list":
        result = jjTagList(cwd);
        break;

      case "jj_tag_create":
        result = jjTagCreate(
          args?.name as string,
          args?.revision as string | undefined,
          cwd
        );
        break;

      case "jj_sparse":
        result = jjSparse(
          args?.add as string[] | undefined,
          args?.remove as string[] | undefined,
          args?.list as boolean | undefined,
          cwd
        );
        break;

      default:
        return {
          content: [
            {
              type: "text",
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }

    if (result.success) {
      const text = result.data
        ? typeof result.data === "string"
          ? result.data
          : JSON.stringify(result.data, null, 2)
        : "Success";
      return {
        content: [
          {
            type: "text",
            text,
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: result.error || "Unknown error",
          },
        ],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error executing ${name}: ${error}`,
        },
      ],
      isError: true,
    };
  }
});

// Resource handlers
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const resources = [
    {
      uri: "jj://status",
      name: "Repository Status",
      description: "Current working copy status and changes",
      mimeType: "text/plain"
    },
    {
      uri: "jj://log/recent",
      name: "Recent Commits",
      description: "Recent commit history (default limit: 10)",
      mimeType: "text/plain"
    },
    {
      uri: "jj://bookmarks",
      name: "Bookmarks",
      description: "List of all bookmarks (branches)",
      mimeType: "text/plain"
    },
    {
      uri: "jj://config",
      name: "Configuration",
      description: "Repository configuration settings",
      mimeType: "text/plain"
    }
  ];

  return { resources };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  // Extract cwd from URI if provided (e.g., "jj://status?cwd=/path/to/repo")
  const url = new URL(uri, "jj://");
  const cwd = url.searchParams.get("cwd") || undefined;

  try {
    let result;

    switch (uri.split("?")[0]) {
      case "jj://status":
        result = jjStatus(cwd);
        break;

      case "jj://log/recent":
        // Get limit from URL params, default to 10
        const limit = url.searchParams.get("limit") 
          ? parseInt(url.searchParams.get("limit")!, 10) 
          : 10;
        result = jjLog(undefined, limit, cwd);
        break;

      case "jj://bookmarks":
        result = jjBookmarkList(cwd);
        break;

      case "jj://config":
        result = runJj(["config", "list"], cwd);
        break;

      default:
        return {
          contents: [
            {
              uri,
              text: `Unknown resource: ${uri}`,
            },
          ],
        };
    }

    if (result.success) {
      const text = result.data
        ? typeof result.data === "string"
          ? result.data
          : JSON.stringify(result.data, null, 2)
        : "Success";
      
      return {
        contents: [
          {
            uri,
            text,
          },
        ],
      };
    } else {
      return {
        contents: [
          {
            uri,
            text: `Error reading resource: ${result.error}`,
          },
        ],
      };
    }
  } catch (error) {
    return {
      contents: [
        {
          uri,
          text: `Error reading resource ${uri}: ${error}`,
        },
      ],
    };
  }
});

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--version")) {
    console.log("jj-mcp v1.0.0");
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
