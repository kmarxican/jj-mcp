import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getJjVersion,
  isJjRepo,
  runJj,
  jjStatus,
  jjLog,
  jjDiff,
  jjDescribe,
  jjCommit,
  jjInit,
} from "../jj.js";

// Mock child_process
vi.mock("child_process", () => ({
  spawnSync: vi.fn(),
}));

import { spawnSync } from "child_process";
import fs from "fs";

// Mock fs and path
vi.mock("fs");
vi.mock("path", async () => {
  const actual = await vi.importActual<typeof import("path")>("path");
  return {
    ...actual,
    resolve: vi.fn(actual.resolve),
    join: vi.fn(actual.join),
    dirname: vi.fn(actual.dirname),
  };
});

const mockedSpawnSync = vi.mocked(spawnSync);

describe("jj.ts", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getJjVersion", () => {
    it("returns version string when jj is installed", () => {
      mockedSpawnSync.mockReturnValue({
        status: 0,
        stdout: "jj 0.15.1\n",
        stderr: "",
        pid: 1234,
        output: [],
        signal: null,
      });

      const result = getJjVersion();
      expect(result).toBe("jj 0.15.1");
      expect(mockedSpawnSync).toHaveBeenCalledWith("jj", ["--version"], {
        encoding: "utf8",
      });
    });

    it("returns null when jj is not found", () => {
      mockedSpawnSync.mockReturnValue({
        status: 1,
        stdout: "",
        stderr: "command not found",
        pid: 1234,
        output: [],
        signal: null,
      });

      const result = getJjVersion();
      expect(result).toBeNull();
    });
  });

  describe("isJjRepo", () => {
    it("returns true when .jj directory exists", () => {
      const mockExistsSync = vi.spyOn(fs, "existsSync");
      mockExistsSync.mockReturnValue(true);

      const result = isJjRepo("/repo");
      expect(result).toBe(true);
    });

    it("returns false when no .jj directory found", () => {
      const mockExistsSync = vi.spyOn(fs, "existsSync");
      mockExistsSync.mockReturnValue(false);

      const result = isJjRepo("/not-a-repo");
      expect(result).toBe(false);
    });
  });

  describe("runJj", () => {
    it("returns success result on successful command", () => {
      mockedSpawnSync.mockReturnValue({
        status: 0,
        stdout: '{"commits": []}',
        stderr: "",
        pid: 1234,
        output: [],
        signal: null,
      });

      const result = runJj(["log", "--limit", "10"]);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ commits: [] });
      expect(mockedSpawnSync).toHaveBeenCalledWith(
        "jj",
        ["log", "--limit", "10"],
        expect.any(Object)
      );
    });

    it("returns error result on failed command", () => {
      mockedSpawnSync.mockReturnValue({
        status: 1,
        stdout: "",
        stderr: "Error: Invalid revset expression",
        pid: 1234,
        output: [],
        signal: null,
      });

      const result = runJj(["log", "-r", "invalid"]);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Error: Invalid revset expression");
    });

    it("returns string data for non-JSON output", () => {
      mockedSpawnSync.mockReturnValue({
        status: 0,
        stdout: "Working copy changes:\nM file.txt",
        stderr: "",
        pid: 1234,
        output: [],
        signal: null,
      });

      const result = runJj(["status"]);

      expect(result.success).toBe(true);
      expect(result.data).toBe("Working copy changes:\nM file.txt");
    });

    it("handles spawn errors gracefully", () => {
      mockedSpawnSync.mockImplementation(() => {
        throw new Error("spawn jj ENOENT");
      });

      const result = runJj(["status"]);

      expect(result.success).toBe(false);
      expect(result.error).toBe("spawn jj ENOENT");
    });

    it("handles commands with cwd parameter", () => {
      mockedSpawnSync.mockReturnValue({
        status: 0,
        stdout: "OK",
        stderr: "",
        pid: 1234,
        output: [],
        signal: null,
      });

      runJj(["status"], "/custom/path");

      expect(mockedSpawnSync).toHaveBeenCalledWith(
        "jj",
        ["status"],
        expect.objectContaining({ cwd: "/custom/path" })
      );
    });
  });

  describe("jjStatus", () => {
    it("calls runJj with status command", () => {
      mockedSpawnSync.mockReturnValue({
        status: 0,
        stdout: "Working copy changes:",
        stderr: "",
        pid: 1234,
        output: [],
        signal: null,
      });

      jjStatus();

      expect(mockedSpawnSync).toHaveBeenCalledWith("jj", ["status"], expect.any(Object));
    });
  });

  describe("jjLog", () => {
    it("calls runJj with log command and optional parameters", () => {
      mockedSpawnSync.mockReturnValue({
        status: 0,
        stdout: "commit 1\ncommit 2",
        stderr: "",
        pid: 1234,
        output: [],
        signal: null,
      });

      jjLog("main", 5);

      expect(mockedSpawnSync).toHaveBeenCalledWith(
        "jj",
        ["log", "--limit", "5", "-r", "main"],
        expect.any(Object)
      );
    });

    it("calls runJj without optional parameters when not provided", () => {
      mockedSpawnSync.mockReturnValue({
        status: 0,
        stdout: "commit 1",
        stderr: "",
        pid: 1234,
        output: [],
        signal: null,
      });

      jjLog();

      expect(mockedSpawnSync).toHaveBeenCalledWith("jj", ["log"], expect.any(Object));
    });
  });

  describe("jjDiff", () => {
    it("calls runJj with diff command and optional revset", () => {
      mockedSpawnSync.mockReturnValue({
        status: 0,
        stdout: "diff output",
        stderr: "",
        pid: 1234,
        output: [],
        signal: null,
      });

      jjDiff("@~");

      expect(mockedSpawnSync).toHaveBeenCalledWith("jj", ["diff", "-r", "@~"], expect.any(Object));
    });
  });

  describe("jjDescribe", () => {
    it("calls runJj with describe command", () => {
      mockedSpawnSync.mockReturnValue({
        status: 0,
        stdout: "",
        stderr: "",
        pid: 1234,
        output: [],
        signal: null,
      });

      jjDescribe("New commit message", "@");

      expect(mockedSpawnSync).toHaveBeenCalledWith(
        "jj",
        ["describe", "-m", "New commit message", "-r", "@"],
        expect.any(Object)
      );
    });
  });

  describe("jjCommit", () => {
    it("calls runJj with commit command", () => {
      mockedSpawnSync.mockReturnValue({
        status: 0,
        stdout: "Created commit",
        stderr: "",
        pid: 1234,
        output: [],
        signal: null,
      });

      jjCommit("My commit message");

      expect(mockedSpawnSync).toHaveBeenCalledWith(
        "jj",
        ["commit", "-m", "My commit message"],
        expect.any(Object)
      );
    });
  });

  describe("jjInit", () => {
    it("calls runJj with git init --colocate command", () => {
      mockedSpawnSync.mockReturnValue({
        status: 0,
        stdout: "Initialized colocated Jujutsu repo.",
        stderr: "",
        pid: 1234,
        output: [],
        signal: null,
      });

      const result = jjInit("/new/repo");

      expect(mockedSpawnSync).toHaveBeenCalledWith(
        "jj",
        ["git", "init", "--colocate"],
        expect.objectContaining({ cwd: "/new/repo" })
      );
      expect(result.success).toBe(true);
    });
  });
});
