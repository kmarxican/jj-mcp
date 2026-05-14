# Agent Notes

## Repo Context
- This repository is managed by **Jujutsu** (`.jj/`). Git is colocated but currently has no commits.
- Domain reference: `jujutsu-SKILL.md` at root.

## Build & Run
- `npm run build` — compile TypeScript (`tsc`). Output goes to `dist/` (gitignored).
- `npm run dev` — `tsc --watch`.
- `npm start` — run compiled server (`node dist/index.js`).
- **No tests, linter, or formatter are configured.**
- `npm publish` triggers `prepublishOnly` which runs `npm run build` automatically.

## Architecture
- ESM project (`"type": "module"`, `Node16` resolution).
- Entry: `src/index.ts` → `dist/index.js`. The source file includes a `#!/usr/bin/env node` shebang for the CLI binary (`bin.jj-mcp` in `package.json`).
- MCP stdio server wrapping the `jj` CLI via synchronous `child_process.spawnSync`.
- Tool definitions in `src/tools.ts`; command wrappers in `src/jj.ts`.
- **Adding a new tool requires changes in BOTH `src/tools.ts` (schema) and `src/index.ts` (handler switch case).**

## Runtime Requirements
- `jj` CLI must be installed and available in `PATH`.
- Server communicates over stdio (MCP protocol), not HTTP.

## Version Gotcha
- Version string is hardcoded in `src/index.ts` (used for `--version` and MCP server metadata) **and** in `package.json`. When bumping, update both.
