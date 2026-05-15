import type { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
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
} from "../jj.js";
import { getStringArg, getNumberArg, getBooleanArg, getStringArrayArg } from "./arguments.js";
import { formatToolResult } from "./result.js";

export function handleToolRequest(request: CallToolRequest): {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
} {
  const { name, arguments: args } = request.params;
  const cwd = getStringArg(args, "cwd");

  try {
    let result;

    switch (name) {
      case "jj_status":
        result = jjStatus(cwd);
        break;

      case "jj_log":
        result = jjLog(getStringArg(args, "revset"), getNumberArg(args, "limit"), cwd);
        break;

      case "jj_diff":
        result = jjDiff(getStringArg(args, "revset"), cwd);
        break;

      case "jj_describe":
        result = jjDescribe(getStringArg(args, "message") ?? "", getStringArg(args, "revset"), cwd);
        break;

      case "jj_commit":
        result = jjCommit(getStringArg(args, "message") ?? "", cwd);
        break;

      case "jj_new":
        result = jjNew(getStringArg(args, "revset"), getStringArg(args, "message"), cwd);
        break;

      case "jj_abandon":
        result = jjAbandon(getStringArg(args, "revset") ?? "", cwd);
        break;

      case "jj_rebase":
        result = jjRebase(
          getStringArg(args, "source") ?? "",
          getStringArg(args, "destination") ?? "",
          cwd
        );
        break;

      case "jj_bookmark_list":
        result = jjBookmarkList(cwd);
        break;

      case "jj_bookmark_create":
        result = jjBookmarkCreate(
          getStringArg(args, "name") ?? "",
          getStringArg(args, "revset"),
          cwd
        );
        break;

      case "jj_bookmark_delete":
        result = jjBookmarkDelete(getStringArg(args, "name") ?? "", cwd);
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
          getStringArg(args, "from"),
          getStringArg(args, "into"),
          getStringArg(args, "message"),
          cwd
        );
        break;

      case "jj_split":
        result = jjSplit(
          getStringArg(args, "revset"),
          getBooleanArg(args, "interactive") ?? false,
          cwd
        );
        break;

      case "jj_undo":
        result = jjUndo(cwd);
        break;

      case "jj_redo":
        result = jjRedo(cwd);
        break;

      case "jj_restore":
        result = jjRestore(
          getStringArrayArg(args, "paths"),
          getStringArg(args, "from"),
          getStringArg(args, "to"),
          cwd
        );
        break;

      case "jj_edit":
        result = jjEdit(getStringArg(args, "revset"), cwd);
        break;

      case "jj_next":
        result = jjNext(getNumberArg(args, "amount"), cwd);
        break;

      case "jj_prev":
        result = jjPrev(getNumberArg(args, "amount"), cwd);
        break;

      case "jj_git_fetch":
        result = jjGitFetch(getStringArg(args, "remote"), cwd);
        break;

      case "jj_git_push":
        result = jjGitPush(getStringArg(args, "remote"), getStringArg(args, "bookmark"), cwd);
        break;

      case "jj_git_import":
        result = jjGitImport(cwd);
        break;

      case "jj_git_export":
        result = jjGitExport(cwd);
        break;

      case "jj_git_clone":
        result = jjGitClone(
          getStringArg(args, "url") ?? "",
          getStringArg(args, "destination"),
          cwd
        );
        break;

      case "jj_obslog":
        result = jjObslog(getStringArg(args, "revset"), getNumberArg(args, "limit"), cwd);
        break;

      case "jj_op_log":
        result = jjOpLog(getNumberArg(args, "limit"), cwd);
        break;

      case "jj_workspace_list":
        result = jjWorkspaceList(cwd);
        break;

      case "jj_workspace_add":
        result = jjWorkspaceAdd(
          getStringArg(args, "name") ?? "",
          getStringArg(args, "destination") ?? "",
          getStringArg(args, "revision"),
          cwd
        );
        break;

      case "jj_config_get":
        result = jjConfigGet(getStringArg(args, "name") ?? "", cwd);
        break;

      case "jj_config_set": {
        const rawScope = getStringArg(args, "scope");
        const scope: "user" | "repo" | "workspace" | undefined =
          rawScope === "user" || rawScope === "repo" || rawScope === "workspace"
            ? rawScope
            : undefined;
        result = jjConfigSet(
          getStringArg(args, "name") ?? "",
          getStringArg(args, "value") ?? "",
          scope,
          cwd
        );
        break;
      }

      case "jj_bisect":
        result = jjBisect(getStringArg(args, "range") ?? "", getStringArg(args, "command"), cwd);
        break;

      case "jj_file_show":
        result = jjFileShow(getStringArg(args, "path") ?? "", getStringArg(args, "revision"), cwd);
        break;

      case "jj_tag_list":
        result = jjTagList(cwd);
        break;

      case "jj_tag_create":
        result = jjTagCreate(getStringArg(args, "name") ?? "", getStringArg(args, "revision"), cwd);
        break;

      case "jj_sparse":
        result = jjSparse(
          getStringArrayArg(args, "add"),
          getStringArrayArg(args, "remove"),
          getBooleanArg(args, "list"),
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

    return formatToolResult(result);
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
}
