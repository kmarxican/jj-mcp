import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

export interface JjResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  stdout: string;
  stderr: string;
}

export function getJjVersion(): string | null {
  const result = spawnSync("jj", ["--version"], { encoding: "utf8" });
  if (result.status === 0) {
    return result.stdout.trim();
  }
  return null;
}

export function isJjRepo(cwd: string = process.cwd()): boolean {
  let current = path.resolve(cwd);
  while (true) {
    if (fs.existsSync(path.join(current, ".jj"))) return true;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return false;
}

export function jjInit(cwd: string = process.cwd()): JjResult {
  try {
    const result = spawnSync("jj", ["git", "init", "--colocate"], {
      cwd,
      encoding: "utf8",
      env: { ...process.env, EDITOR: "true", VISUAL: "true" },
    });
    if (result.status === 0) {
      return {
        success: true,
        data: "Initialized colocated Jujutsu repo.",
        stdout: result.stdout.trim(),
        stderr: result.stderr.trim(),
      };
    }
    return {
      success: false,
      error: result.stderr || result.stdout || `Exit code: ${result.status}`,
      stdout: result.stdout.trim(),
      stderr: result.stderr.trim(),
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return {
      success: false,
      error: message,
      stdout: "",
      stderr: message,
    };
  }
}

/**
 * Execute a jj command synchronously with robust output capture.
 * Automatically parses JSON output when available.
 */
export function runJj(args: string[], cwd?: string, encoding: BufferEncoding = "utf-8"): JjResult {
  try {
    const result = spawnSync("jj", args, {
      cwd,
      encoding,
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large repos
      timeout: 30000, // 30s timeout to prevent indefinite hangs on interactive commands
      env: { ...process.env, EDITOR: "true", VISUAL: "true" },
      windowsHide: true, // Hide console window on Windows
      shell: false,
    });

    if (result.error) {
      return {
        success: false,
        error: `Command failed: ${result.error.message}`,
        stdout: result.stdout?.toString().trim() ?? "",
        stderr: result.stderr?.toString().trim() ?? "",
      };
    }

    const stdout = result.stdout?.toString() ?? "";
    const stderr = result.stderr?.toString() ?? "";
    const exitCode = result.status ?? (result.signal ? -1 : 0);
    const success = exitCode === 0;

    let data: unknown;
    if (success && stdout) {
      try {
        data = JSON.parse(stdout);
      } catch {
        data = stdout.trim();
      }
    }

    const error = success
      ? undefined
      : stderr ||
        stdout ||
        `Exit code: ${exitCode}${result.signal ? ` (signal: ${result.signal})` : ""}`;

    return {
      success,
      data,
      error,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return {
      success: false,
      error: message,
      stdout: "",
      stderr: message,
    };
  }
}

export function jjStatus(cwd?: string): JjResult {
  return runJj(["status"], cwd);
}

export function jjLog(revset?: string, limit?: number, cwd?: string): JjResult {
  const args = ["log"];
  if (limit) args.push("--limit", limit.toString());
  if (revset) args.push("-r", revset);
  return runJj(args, cwd);
}

export function jjDiff(revset?: string, cwd?: string): JjResult {
  const args = ["diff"];
  if (revset) args.push("-r", revset);
  return runJj(args, cwd);
}

export function jjDescribe(message: string, revset?: string, cwd?: string): JjResult {
  const args = ["describe", "-m", message];
  if (revset) args.push("-r", revset);
  return runJj(args, cwd);
}

export function jjCommit(message: string, cwd?: string): JjResult {
  return runJj(["commit", "-m", message], cwd);
}

export function jjNew(revset?: string, message?: string, cwd?: string): JjResult {
  const args = ["new"];
  if (revset) args.push("-r", revset);
  if (message) args.push("-m", message);
  return runJj(args, cwd);
}

export function jjAbandon(revset: string, cwd?: string): JjResult {
  return runJj(["abandon", "-r", revset], cwd);
}

export function jjRebase(source: string, destination: string, cwd?: string): JjResult {
  return runJj(["rebase", "-s", source, "-d", destination], cwd);
}

export function jjBookmarkList(cwd?: string): JjResult {
  return runJj(["bookmark", "list"], cwd);
}

export function jjBookmarkCreate(name: string, revset?: string, cwd?: string): JjResult {
  const args = ["bookmark", "create", name];
  if (revset) args.push("-r", revset);
  return runJj(args, cwd);
}

export function jjBookmarkDelete(name: string, cwd?: string): JjResult {
  return runJj(["bookmark", "delete", name], cwd);
}

export function jjSquash(from?: string, into?: string, message?: string, cwd?: string): JjResult {
  const args = ["squash"];
  if (from) args.push("--from", from);
  if (into) args.push("--into", into);
  if (message) args.push("-m", message);
  return runJj(args, cwd);
}

export function jjSplit(revset?: string, interactive: boolean = false, cwd?: string): JjResult {
  const args = ["split"];
  if (revset) args.push("-r", revset);
  if (interactive) args.push("-i");
  return runJj(args, cwd);
}

export function jjUndo(cwd?: string): JjResult {
  return runJj(["undo"], cwd);
}

export function jjRedo(cwd?: string): JjResult {
  return runJj(["redo"], cwd);
}

export function jjRestore(paths?: string[], from?: string, to?: string, cwd?: string): JjResult {
  const args = ["restore"];
  if (from) args.push("--from", from);
  if (to) args.push("--to", to);
  if (paths && paths.length > 0) args.push(...paths);
  return runJj(args, cwd);
}

export function jjEdit(revset?: string, cwd?: string): JjResult {
  const args = ["edit"];
  if (revset) args.push("-r", revset);
  return runJj(args, cwd);
}

export function jjNext(amount?: number, cwd?: string): JjResult {
  const args = ["next"];
  if (amount) args.push(amount.toString());
  return runJj(args, cwd);
}

export function jjPrev(amount?: number, cwd?: string): JjResult {
  const args = ["prev"];
  if (amount) args.push(amount.toString());
  return runJj(args, cwd);
}

export function jjGitFetch(remote?: string, cwd?: string): JjResult {
  const args = ["git", "fetch"];
  if (remote) args.push("--remote", remote);
  return runJj(args, cwd);
}

export function jjGitPush(remote?: string, bookmark?: string, cwd?: string): JjResult {
  const args = ["git", "push"];
  if (remote) args.push("--remote", remote);
  if (bookmark) args.push("--bookmark", bookmark);
  return runJj(args, cwd);
}

export function jjGitImport(cwd?: string): JjResult {
  return runJj(["git", "import"], cwd);
}

export function jjGitExport(cwd?: string): JjResult {
  return runJj(["git", "export"], cwd);
}

export function jjGitClone(url: string, destination?: string, cwd?: string): JjResult {
  const args = ["git", "clone", url];
  if (destination) args.push(destination);
  return runJj(args, cwd);
}

export function jjObslog(revset?: string, limit?: number, cwd?: string): JjResult {
  const args = ["obslog"];
  if (limit) args.push("--limit", limit.toString());
  if (revset) args.push("-r", revset);
  return runJj(args, cwd);
}

export function jjOpLog(limit?: number, cwd?: string): JjResult {
  const args = ["op", "log"];
  if (limit) args.push("--limit", limit.toString());
  return runJj(args, cwd);
}

export function jjWorkspaceList(cwd?: string): JjResult {
  return runJj(["workspace", "list"], cwd);
}

export function jjWorkspaceAdd(name: string, destination: string, revision?: string, cwd?: string): JjResult {
  const args = ["workspace", "add", "--name", name, destination];
  if (revision) args.push("-r", revision);
  return runJj(args, cwd);
}

export function jjConfigGet(name: string, cwd?: string): JjResult {
  return runJj(["config", "get", name], cwd);
}

export function jjConfigSet(name: string, value: string, scope: "user" | "repo" | "workspace" = "repo", cwd?: string): JjResult {
  return runJj(["config", "set", `--${scope}`, name, value], cwd);
}

export function jjBisect(range: string, command?: string, cwd?: string): JjResult {
  const args = ["bisect", "run", "--range", range];
  if (command) args.push("--", command);
  return runJj(args, cwd);
}

export function jjFileShow(path: string, revision?: string, cwd?: string): JjResult {
  const args = ["file", "show", path];
  if (revision) args.push("-r", revision);
  return runJj(args, cwd);
}

export function jjTagList(cwd?: string): JjResult {
  return runJj(["tag", "list"], cwd);
}

export function jjTagCreate(name: string, revision?: string, cwd?: string): JjResult {
  const args = ["tag", "set", name];
  if (revision) args.push("-r", revision);
  return runJj(args, cwd);
}

export function jjSparse(
  add?: string[],
  remove?: string[],
  list?: boolean,
  cwd?: string
): JjResult {
  if (list) {
    return runJj(["sparse", "list"], cwd);
  }
  const args = ["sparse", "set"];
  if (add && add.length > 0) {
    for (const pat of add) args.push("--add", pat);
  }
  if (remove && remove.length > 0) {
    for (const pat of remove) args.push("--remove", pat);
  }
  return runJj(args, cwd);
}
