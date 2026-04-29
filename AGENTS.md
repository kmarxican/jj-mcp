# Agent Notes

## Repo Context
- This repository is managed by **Jujutsu** (`.jj/`). Git is colocated but currently has no commits.
- Domain reference: `jujutsu-SKILL.md` at root.

## Build & Run
- `npm run build` — compile TypeScript (`tsc`). Output goes to `dist/` (gitignored).
- `npm run dev` — `tsc --watch`.
- `npm start` — run compiled server (`node dist/index.js`).
- **No tests, linter, or formatter are configured.**

## Architecture
- ESM project (`"type": "module"`, `Node16` resolution).
- Entry: `src/index.ts` → `dist/index.js`.
- MCP stdio server wrapping the `jj` CLI via synchronous `child_process.spawnSync`.
- Tool definitions in `src/tools.ts`; command wrappers in `src/jj.ts`.

## Runtime Requirements
- `jj` CLI must be installed and available in `PATH`.
- Server communicates over stdio (MCP protocol), not HTTP.
