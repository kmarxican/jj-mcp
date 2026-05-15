import type { Tool } from "./core.js";

export const gitTools: Tool[] = [
  {
    name: "jj_git_fetch",
    description: "Fetch changes from Git remotes",
    inputSchema: {
      type: "object",
      properties: {
        remote: {
          type: "string",
          description: "Remote name (default: origin)",
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)",
        },
      },
      required: [],
    },
  },
  {
    name: "jj_git_push",
    description: "Push changes to Git remotes",
    inputSchema: {
      type: "object",
      properties: {
        remote: {
          type: "string",
          description: "Remote name (default: origin)",
        },
        bookmark: {
          type: "string",
          description: "Bookmark to push (default: all bookmarks)",
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)",
        },
      },
      required: [],
    },
  },
  {
    name: "jj_git_import",
    description: "Import changes from Git into jj",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "Working directory (optional)",
        },
      },
      required: [],
    },
  },
  {
    name: "jj_git_export",
    description: "Export jj changes to Git",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "Working directory (optional)",
        },
      },
      required: [],
    },
  },
  {
    name: "jj_git_clone",
    description: "Clone a Git repository and initialize jj",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "Git repository URL to clone",
        },
        destination: {
          type: "string",
          description: "Destination directory (optional)",
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "jj_obslog",
    description: "Show the operation log (history of repository mutations)",
    inputSchema: {
      type: "object",
      properties: {
        revset: {
          type: "string",
          description: "Show operations that modified the given revisions",
        },
        limit: {
          type: "number",
          description: "Limit number of operations to show",
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)",
        },
      },
      required: [],
    },
  },
  {
    name: "jj_op_log",
    description: "Show the operation log with detailed operation information",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Limit number of operations to show",
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)",
        },
      },
      required: [],
    },
  },
  {
    name: "jj_workspace_list",
    description: "List all workspaces in the repository",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "Working directory (optional)",
        },
      },
      required: [],
    },
  },
  {
    name: "jj_workspace_add",
    description: "Add a new workspace to the repository",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name for the new workspace",
        },
        destination: {
          type: "string",
          description: "Where to create the new workspace (required)",
        },
        revision: {
          type: "string",
          description: "Revision for the new workspace (default: working copy @)",
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)",
        },
      },
      required: ["name", "destination"],
    },
  },
  {
    name: "jj_config_get",
    description: "Get a configuration value",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Configuration option name (required)",
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "jj_config_set",
    description: "Set a configuration value",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Configuration option name (required)",
        },
        value: {
          type: "string",
          description: "Configuration value (required)",
        },
        scope: {
          type: "string",
          enum: ["user", "repo", "workspace"],
          description: "Config scope (default: repo)",
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)",
        },
      },
      required: ["name", "value"],
    },
  },
  {
    name: "jj_bisect",
    description: "Binary search through commit history to find regression",
    inputSchema: {
      type: "object",
      properties: {
        range: {
          type: "string",
          description: "Revset range to bisect (required, e.g. 'v1.0..main')",
        },
        command: {
          type: "string",
          description: "Command to run to determine whether the bug is present (required)",
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)",
        },
      },
      required: ["range", "command"],
    },
  },
  {
    name: "jj_file_show",
    description: "Show file contents at a specific revision",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "File path to show (required)",
        },
        revision: {
          type: "string",
          description: "Revision to show file at (default: working copy @)",
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "jj_tag_list",
    description: "List all tags in the repository",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "Working directory (optional)",
        },
      },
      required: [],
    },
  },
  {
    name: "jj_tag_create",
    description: "Create a new tag",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Tag name (required)",
        },
        revision: {
          type: "string",
          description: "Revision to tag (default: working copy @)",
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "jj_sparse",
    description: "Manage sparse checkout patterns",
    inputSchema: {
      type: "object",
      properties: {
        add: {
          type: "array",
          items: { type: "string" },
          description: "Patterns to add to sparse checkout",
        },
        remove: {
          type: "array",
          items: { type: "string" },
          description: "Patterns to remove from sparse checkout",
        },
        list: {
          type: "boolean",
          description: "List current sparse patterns",
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)",
        },
      },
      required: [],
    },
  },
];
