# Jujutsu MCP Server

A Model Context Protocol (MCP) server for the [Jujutsu](https://github.com/jj-vcs/jj) version control system. Exposes `jj` commands as MCP tools so AI assistants can read and manipulate jj repositories directly.

## Requirements

- Node.js 18+
- `jj` CLI 0.25+ installed and in PATH

## Installation

```bash
npm install -g jj-mcp
```

Or run without installing:

```bash
npx jj-mcp
```

## Client Configuration

Add to your MCP client config. All clients use the same JSON shape:

```json
{
  "mcpServers": {
    "jj": {
      "command": "jj-mcp"
    }
  }
}
```

| Client | Config file |
|--------|-------------|
| **Claude Desktop** | `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) |
| **Windsurf** | `~/.codeium/windsurf/mcp_config.json` |
| **Cursor** | `~/.cursor/mcp.json` |
| **Cline** | MCP settings in VS Code extension |

For a local build, point `command` at the compiled binary instead:

```json
{
  "mcpServers": {
    "jj": {
      "command": "node",
      "args": ["/path/to/jj-mcp/dist/index.js"]
    }
  }
}
```

## Available Tools

### Core

| Tool | Description |
|------|-------------|
| `jj_status` | Working copy status |
| `jj_log` | Commit history (supports revset expressions) |
| `jj_diff` | Show differences |
| `jj_describe` | Edit commit message |
| `jj_commit` | Create commit from working copy |
| `jj_new` | Create new empty commit |
| `jj_abandon` | Remove a commit |
| `jj_rebase` | Rebase commits |
| `jj_squash` | Combine commits |
| `jj_split` | Split a commit |
| `jj_undo` | Undo last operation |
| `jj_redo` | Redo undone operation |
| `jj_restore` | Restore files from a revision |
| `jj_edit` | Set working copy to a revision |
| `jj_next` | Move to next child revision |
| `jj_prev` | Move to previous parent revision |

### Bookmarks

| Tool | Description |
|------|-------------|
| `jj_bookmark_list` | List bookmarks |
| `jj_bookmark_create` | Create bookmark |
| `jj_bookmark_delete` | Delete bookmark |

### Git Integration

| Tool | Description |
|------|-------------|
| `jj_git_fetch` | Fetch from a Git remote |
| `jj_git_push` | Push to a Git remote |
| `jj_git_import` | Import Git refs into jj |
| `jj_git_export` | Export jj changes to Git |
| `jj_git_clone` | Clone a Git repo and initialize jj |

### Operations & History

| Tool | Description |
|------|-------------|
| `jj_obslog` | Obslog for a revision (mutation history) |
| `jj_op_log` | Operation log |
| `jj_bisect` | Binary search for a regression (`range` required, e.g. `v1.0..main`) |

### Files & Tags

| Tool | Description |
|------|-------------|
| `jj_file_show` | Show file contents at a revision |
| `jj_tag_list` | List tags |
| `jj_tag_create` | Create a tag |

### Workspaces & Config

| Tool | Description |
|------|-------------|
| `jj_workspace_list` | List workspaces |
| `jj_workspace_add` | Add a workspace |
| `jj_config_get` | Get a config value |
| `jj_config_set` | Set a config value |
| `jj_sparse` | Manage sparse checkout patterns |
| `jj_init` | Initialize a new jj repo |
| `jj_sanity_check` | Verify jj is installed and repo is valid |

## Available Resources

Resources provide read-only repository state without a tool call:

| URI | Description |
|-----|-------------|
| `jj://status` | Working copy status |
| `jj://log/recent` | Recent commits (default limit: 10) |
| `jj://bookmarks` | All bookmarks |
| `jj://config` | Repository configuration |

All URIs accept a `cwd` query parameter, and `jj://log/recent` also accepts `limit`:

```
jj://log/recent?cwd=/path/to/repo&limit=20
```

## Revset Expressions

All tools that accept a `revset` parameter support jj's revision syntax:

| Expression | Meaning |
|------------|---------|
| `@` | Working copy |
| `@-` | Parent of working copy |
| `main` | Bookmark named "main" |
| `::main` | All ancestors of main |
| `main..@` | Commits between main and working copy |

## Troubleshooting

**`jj command not found`** — ensure `jj` is on your PATH:
```bash
which jj && jj --version
```

**Verify the server**:
```bash
jj-mcp --check   # checks jj is found and cwd is a jj repo
jj-mcp --version
```

**Large output** — the server uses a 10 MB buffer. For very large diffs or logs, use the `limit` parameter.
