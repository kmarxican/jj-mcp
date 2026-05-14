export interface Tool {
  name: string;
  description: string;
  inputSchema: object;
}

export const coreTools: Tool[] = [
  {
    name: "jj_status",
    description: "Show the working copy status - what files are modified, added, or deleted",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)",
        },
      },
      required: [],
    },
  },
  {
    name: "jj_log",
    description:
      "Show commit history. Supports revset expressions like '@' (working copy), '@-' (parent), 'main', '::main' (ancestors), etc.",
    inputSchema: {
      type: "object",
      properties: {
        revset: {
          type: "string",
          description: "Revset expression to filter commits (e.g., '@', '@-', 'main', '::main')",
        },
        limit: {
          type: "number",
          description: "Maximum number of commits to show",
        },
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)",
        },
      },
      required: [],
    },
  },
  {
    name: "jj_diff",
    description: "Show differences between commits or the working copy",
    inputSchema: {
      type: "object",
      properties: {
        revset: {
          type: "string",
          description: "Revset to show diff for (default: working copy changes)",
        },
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)",
        },
      },
      required: [],
    },
  },
  {
    name: "jj_describe",
    description: "Edit the commit message/description of a commit",
    inputSchema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "New commit message",
        },
        revset: {
          type: "string",
          description: "Commit to describe (default: working copy @)",
        },
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)",
        },
      },
      required: ["message"],
    },
  },
  {
    name: "jj_commit",
    description: "Create a new commit from the working copy changes",
    inputSchema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Commit message",
        },
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)",
        },
      },
      required: ["message"],
    },
  },
  {
    name: "jj_new",
    description:
      "Create a new empty commit. If no revset specified, creates after the working copy parent",
    inputSchema: {
      type: "object",
      properties: {
        revset: {
          type: "string",
          description: "Parent revision for the new commit",
        },
        message: {
          type: "string",
          description: "Commit message for the new commit",
        },
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)",
        },
      },
      required: [],
    },
  },
  {
    name: "jj_abandon",
    description:
      "Abandon (remove) a commit. Children will be rebased onto the abandoned commit's parents",
    inputSchema: {
      type: "object",
      properties: {
        revset: {
          type: "string",
          description: "Commit to abandon (required)",
        },
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)",
        },
      },
      required: ["revset"],
    },
  },
  {
    name: "jj_rebase",
    description:
      "Rebase commits onto a new destination. Rebase source commits and their descendants",
    inputSchema: {
      type: "object",
      properties: {
        source: {
          type: "string",
          description: "Source commit(s) to rebase (revset)",
        },
        destination: {
          type: "string",
          description: "Destination to rebase onto (revset)",
        },
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)",
        },
      },
      required: ["source", "destination"],
    },
  },
  {
    name: "jj_bookmark_list",
    description: "List all bookmarks (branches) in the repository",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)",
        },
      },
      required: [],
    },
  },
  {
    name: "jj_bookmark_create",
    description: "Create a new bookmark (branch) pointing to a commit",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name for the new bookmark",
        },
        revset: {
          type: "string",
          description: "Commit to point the bookmark to (default: working copy @)",
        },
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "jj_bookmark_delete",
    description: "Delete a bookmark (branch)",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name of the bookmark to delete",
        },
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)",
        },
      },
      required: ["name"],
    },
  },
];
