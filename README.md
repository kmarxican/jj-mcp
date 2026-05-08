# Jujutsu MCP Server

A Model Context Protocol (MCP) server for the [Jujutsu](https://github.com/jj-vcs/jj) version control system.

## Installation

### Option 1: Global NPM Install (Recommended)

```bash
npm install -g jj-mcp
```

The `jj-mcp` command will be available system-wide.

### Option 2: Local Install

```bash
git clone <repo-url>
cd jj-mcp
npm install
npm run build
```

### Option 3: NPX (No Install)

```bash
npx jj-mcp
```

## Usage with MCP Clients

### Claude Desktop

Config location:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "jj": {
      "command": "jj-mcp"
    }
  }
}
```

Or with local install:

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

### Cursor

Add to Cursor MCP settings (Settings > Features > MCP Servers):

```json
{
  "mcpServers": {
    "jj": {
      "command": "jj-mcp"
    }
  }
}
```

Or add directly to `~/.cursor/mcp.json`.

### Cline (VS Code Extension)

Add to Cline MCP settings:

```json
{
  "mcpServers": [
    {
      "name": "jj",
      "command": "jj-mcp"
    }
  ]
}
```

### Custom MCP Clients

For any MCP client, configure with:

| Setting | Value |
|---------|-------|
| Transport | `stdio` |
| Command | `jj-mcp` (or `node /path/to/dist/index.js`) |
| Environment | Optional `cwd` parameter per tool call |

Example client connection:

```javascript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "jj-mcp",
});

const client = new Client({ name: "my-client", version: "1.0.0" });
await client.connect(transport);

// List available tools
const tools = await client.listTools();
```

## Available Tools

| Tool | Description |
|------|-------------|
| `jj_status` | Working copy status |
| `jj_log` | Commit history with revset support |
| `jj_diff` | Show differences |
| `jj_describe` | Edit commit message |
| `jj_commit` | Create commit from working copy |
| `jj_new` | Create new empty commit |
| `jj_abandon` | Remove a commit |
| `jj_rebase` | Rebase commits |
| `jj_bookmark_list` | List bookmarks |
| `jj_bookmark_create` | Create bookmark |
| `jj_bookmark_delete` | Delete bookmark |
| `jj_squash` | Combine commits |
| `jj_split` | Split a commit |
| `jj_undo` | Undo last operation |
| `jj_redo` | Redo undone operation |
| `jj_restore` | Restore files from revision |
| `jj_edit` | Edit a specific revision |
| `jj_next` | Move to next child revision |
| `jj_prev` | Move to previous parent revision |

## Available Resources

Resources provide read-only access to repository state without explicit tool calls.

| Resource URI | Description | Parameters |
|--------------|-------------|------------|
| `jj://status` | Repository status | `cwd` (optional) |
| `jj://log/recent` | Recent commits | `cwd` (optional), `limit` (default: 10) |
| `jj://bookmarks` | List all bookmarks | `cwd` (optional) |
| `jj://config` | Repository configuration | `cwd` (optional) |

### Using Resources

Resources can be read with URL parameters:

```javascript
// Read status with custom working directory
const { contents } = await client.readResource({
  uri: "jj://status?cwd=/path/to/repo"
});

// Read recent commits with custom limit
const { contents } = await client.readResource({
  uri: "jj://log/recent?cwd=/path/to/repo&limit=20"
});
```

## Revset Expressions

Jujutsu supports powerful revision selection:

- `@` - Working copy
- `@-` - Parent of working copy
- `main` - Bookmark named "main"
- `::main` - Ancestors of main
- `main..@` - Commits between main and working copy

## Environment Variables

| Variable | Description |
|----------|-------------|
| `JJ MCP_CWD` | Default working directory for all operations |
| `PATH` | Must include `jj` binary location |

Per-invocation `cwd` can be passed via tool arguments to override.

## Requirements

- Node.js 18+
- `jj` CLI 0.15+ installed and in PATH

## Troubleshooting

### "jj command not found"

Ensure `jj` is installed and in your PATH:
```bash
which jj
jj --version
```

### Connection refused

Verify the server runs standalone:
```bash
jj-mcp
# Should start and wait for JSON-RPC messages on stdin
```

### Large repositories

The server uses a 10MB buffer for command output. For very large diffs or logs, use the `limit` parameter in `jj_log`.
