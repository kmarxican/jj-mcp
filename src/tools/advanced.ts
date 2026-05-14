import type { Tool } from "./core.js";

export const advancedTools: Tool[] = [
  {
    name: "jj_sanity_check",
    description:
      "Verify the Jujutsu environment is set up correctly. Use this tool to verify the Jujutsu environment if other tools are failing.",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "Working directory to check (optional)",
        },
      },
      required: [],
    },
  },
  {
    name: "jj_init",
    description:
      "Initialize a new Jujutsu repository in the current directory (colocated with Git).",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "The directory to initialize in (optional)",
        },
      },
      required: [],
    },
  },
  {
    name: "jj_squash",
    description:
      "Squash (combine) changes from one revision into another. Default: squashes @ into @-",
    inputSchema: {
      type: "object",
      properties: {
        from: {
          type: "string",
          description: "Revision to squash from (default: @)",
        },
        into: {
          type: "string",
          description: "Revision to squash into (default: @-)",
        },
        message: {
          type: "string",
          description: "New message for squashed commit",
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
    name: "jj_split",
    description: "Split a revision into two. Interactively select changes for the first commit.",
    inputSchema: {
      type: "object",
      properties: {
        revset: {
          type: "string",
          description: "Revision to split (default: @)",
        },
        interactive: {
          type: "boolean",
          description: "Use interactive picker (default: true)",
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
    name: "jj_undo",
    description: "Undo the last operation (jj undo). Use --from to undo to a specific operation.",
    inputSchema: {
      type: "object",
      properties: {
        from: {
          type: "number",
          description: "Undo back to this operation number (optional)",
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
    name: "jj_redo",
    description: "Redo the most recently undone operation",
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
    name: "jj_restore",
    description:
      "Restore files from another revision. Resets specified paths to their state in the source revision.",
    inputSchema: {
      type: "object",
      properties: {
        paths: {
          type: "array",
          items: { type: "string" },
          description: "Paths to restore (default: all)",
        },
        from: {
          type: "string",
          description: "Source revision to restore from (default: @-)",
        },
        to: {
          type: "string",
          description: "Destination revision to restore into (default: @)",
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
    name: "jj_edit",
    description: "Edit a specific revision. Sets the working copy to the specified revision.",
    inputSchema: {
      type: "object",
      properties: {
        revset: {
          type: "string",
          description: "Revision to edit (default: @)",
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
    name: "jj_next",
    description: "Move the working copy commit to the next child revision",
    inputSchema: {
      type: "object",
      properties: {
        amount: {
          type: "number",
          description: "How many commits to move forward (default: 1)",
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
    name: "jj_prev",
    description: "Move the working copy commit to the previous parent revision",
    inputSchema: {
      type: "object",
      properties: {
        amount: {
          type: "number",
          description: "How many commits to move backward (default: 1)",
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
