export interface Tool {
  name: string;
  description: string;
  inputSchema: object;
}

export const tools: Tool[] = [
  {
    name: "jj_status",
    description: "Show the working copy status - what files are modified, added, or deleted",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_log",
    description: "Show commit history. Supports revset expressions like '@' (working copy), '@-' (parent), 'main', '::main' (ancestors), etc.",
    inputSchema: {
      type: "object",
      properties: {
        revset: {
          type: "string",
          description: "Revset expression to filter commits (e.g., '@', '@-', 'main', '::main')"
        },
        limit: {
          type: "number",
          description: "Maximum number of commits to show"
        },
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_diff",
    description: "Show differences between commits or the working copy",
    inputSchema: {
      type: "object",
      properties: {
        revset: {
          type: "string",
          description: "Revset to show diff for (default: working copy changes)"
        },
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_describe",
    description: "Edit the commit message/description of a commit",
    inputSchema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "New commit message"
        },
        revset: {
          type: "string",
          description: "Commit to describe (default: working copy @)"
        },
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)"
        }
      },
      required: ["message"]
    }
  },
  {
    name: "jj_commit",
    description: "Create a new commit from the working copy changes",
    inputSchema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Commit message"
        },
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)"
        }
      },
      required: ["message"]
    }
  },
  {
    name: "jj_new",
    description: "Create a new empty commit. If no revset specified, creates after the working copy parent",
    inputSchema: {
      type: "object",
      properties: {
        revset: {
          type: "string",
          description: "Parent revision for the new commit"
        },
        message: {
          type: "string",
          description: "Commit message for the new commit"
        },
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_abandon",
    description: "Abandon (remove) a commit. Children will be rebased onto the abandoned commit's parents",
    inputSchema: {
      type: "object",
      properties: {
        revset: {
          type: "string",
          description: "Commit to abandon (required)"
        },
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)"
        }
      },
      required: ["revset"]
    }
  },
  {
    name: "jj_rebase",
    description: "Rebase commits onto a new destination. Rebase source commits and their descendants",
    inputSchema: {
      type: "object",
      properties: {
        source: {
          type: "string",
          description: "Source commit(s) to rebase (revset)"
        },
        destination: {
          type: "string",
          description: "Destination to rebase onto (revset)"
        },
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)"
        }
      },
      required: ["source", "destination"]
    }
  },
  {
    name: "jj_bookmark_list",
    description: "List all bookmarks (branches) in the repository",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_bookmark_create",
    description: "Create a new bookmark (branch) pointing to a commit",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name for the new bookmark"
        },
        revset: {
          type: "string",
          description: "Commit to point the bookmark to (default: working copy @)"
        },
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)"
        }
      },
      required: ["name"]
    }
  },
  {
    name: "jj_bookmark_delete",
    description: "Delete a bookmark (branch)",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name of the bookmark to delete"
        },
        cwd: {
          type: "string",
          description: "Working directory to run the command in (optional)"
        }
      },
      required: ["name"]
    }
  },
  {
    name: "jj_sanity_check",
    description: "Verify the Jujutsu environment is set up correctly. Use this tool to verify the Jujutsu environment if other tools are failing.",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "Working directory to check (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_init",
    description: "Initialize a new Jujutsu repository in the current directory (colocated with Git).",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "The directory to initialize in (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_squash",
    description: "Squash (combine) changes from one revision into another. Default: squashes @ into @-",
    inputSchema: {
      type: "object",
      properties: {
        from: {
          type: "string",
          description: "Revision to squash from (default: @)"
        },
        into: {
          type: "string",
          description: "Revision to squash into (default: @-)"
        },
        message: {
          type: "string",
          description: "New message for squashed commit"
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_split",
    description: "Split a revision into two. Interactively select changes for the first commit.",
    inputSchema: {
      type: "object",
      properties: {
        revset: {
          type: "string",
          description: "Revision to split (default: @)"
        },
        interactive: {
          type: "boolean",
          description: "Use interactive picker (default: true)"
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_undo",
    description: "Undo the last operation (jj undo). Use --from to undo to a specific operation.",
    inputSchema: {
      type: "object",
      properties: {
        from: {
          type: "number",
          description: "Undo back to this operation number (optional)"
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_redo",
    description: "Redo the most recently undone operation",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_restore",
    description: "Restore files from another revision. Resets specified paths to their state in the source revision.",
    inputSchema: {
      type: "object",
      properties: {
        paths: {
          type: "array",
          items: { type: "string" },
          description: "Paths to restore (default: all)"
        },
        from: {
          type: "string",
          description: "Source revision to restore from (default: @-)"
        },
        to: {
          type: "string",
          description: "Destination revision to restore into (default: @)"
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_edit",
    description: "Edit a specific revision. Sets the working copy to the specified revision.",
    inputSchema: {
      type: "object",
      properties: {
        revset: {
          type: "string",
          description: "Revision to edit (default: @)"
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_next",
    description: "Move the working copy commit to the next child revision",
    inputSchema: {
      type: "object",
      properties: {
        amount: {
          type: "number",
          description: "How many commits to move forward (default: 1)"
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_prev",
    description: "Move the working copy commit to the previous parent revision",
    inputSchema: {
      type: "object",
      properties: {
        amount: {
          type: "number",
          description: "How many commits to move backward (default: 1)"
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_git_fetch",
    description: "Fetch changes from Git remotes",
    inputSchema: {
      type: "object",
      properties: {
        remote: {
          type: "string",
          description: "Remote name (default: origin)"
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_git_push",
    description: "Push changes to Git remotes",
    inputSchema: {
      type: "object",
      properties: {
        remote: {
          type: "string",
          description: "Remote name (default: origin)"
        },
        bookmark: {
          type: "string",
          description: "Bookmark to push (default: all bookmarks)"
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_git_import",
    description: "Import changes from Git into jj",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_git_export",
    description: "Export jj changes to Git",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_git_clone",
    description: "Clone a Git repository and initialize jj",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "Git repository URL to clone"
        },
        destination: {
          type: "string",
          description: "Destination directory (optional)"
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: ["url"]
    }
  },
  {
    name: "jj_obslog",
    description: "Show the operation log (history of repository mutations)",
    inputSchema: {
      type: "object",
      properties: {
        revset: {
          type: "string",
          description: "Show operations that modified the given revisions"
        },
        limit: {
          type: "number",
          description: "Limit number of operations to show"
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_op_log",
    description: "Show the operation log with detailed operation information",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Limit number of operations to show"
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_workspace_list",
    description: "List all workspaces in the repository",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_workspace_add",
    description: "Add a new workspace to the repository",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name for the new workspace"
        },
        revision: {
          type: "string",
          description: "Revision for the new workspace (default: working copy @)"
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: ["name"]
    }
  },
  {
    name: "jj_config_get",
    description: "Get a configuration value",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Configuration option name (required)"
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: ["name"]
    }
  },
  {
    name: "jj_config_set",
    description: "Set a configuration value",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Configuration option name (required)"
        },
        value: {
          type: "string",
          description: "Configuration value (required)"
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: ["name", "value"]
    }
  },
  {
    name: "jj_bisect",
    description: "Binary search through commit history to find regression",
    inputSchema: {
      type: "object",
      properties: {
        good: {
          type: "string",
          description: "Known good revision"
        },
        bad: {
          type: "string",
          description: "Known bad revision"
        },
        command: {
          type: "string",
          description: "Command to test each revision (optional)"
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_file_show",
    description: "Show file contents at a specific revision",
    inputSchema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          description: "File path to show (required)"
        },
        revision: {
          type: "string",
          description: "Revision to show file at (default: working copy @)"
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: ["path"]
    }
  },
  {
    name: "jj_tag_list",
    description: "List all tags in the repository",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: []
    }
  },
  {
    name: "jj_tag_create",
    description: "Create a new tag",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Tag name (required)"
        },
        revision: {
          type: "string",
          description: "Revision to tag (default: working copy @)"
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: ["name"]
    }
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
          description: "Patterns to add to sparse checkout"
        },
        remove: {
          type: "array",
          items: { type: "string" },
          description: "Patterns to remove from sparse checkout"
        },
        list: {
          type: "boolean",
          description: "List current sparse patterns"
        },
        cwd: {
          type: "string",
          description: "Working directory (optional)"
        }
      },
      required: []
    }
  }
];
