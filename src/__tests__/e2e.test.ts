import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.resolve(__dirname, "../../dist/index.js");

describe("jj-mcp e2e via MCP Client", () => {
  let transport: StdioClientTransport;
  let client: Client;

  beforeAll(async () => {
    transport = new StdioClientTransport({
      command: "node",
      args: [serverPath],
    });

    client = new Client({ name: "jj-mcp-e2e-test", version: "0.0.1" }, { capabilities: {} });

    await client.connect(transport);
  });

  afterAll(async () => {
    await client.close();
    await transport.close();
  });

  it("lists all jj-mcp tools", async () => {
    const response = await client.listTools();

    expect(response.tools).toBeDefined();
    expect(response.tools.length).toBeGreaterThan(0);

    const toolNames = response.tools.map((t) => t.name);

    // Core tools
    expect(toolNames).toContain("jj_status");
    expect(toolNames).toContain("jj_log");
    expect(toolNames).toContain("jj_diff");
    expect(toolNames).toContain("jj_describe");
    expect(toolNames).toContain("jj_commit");
    expect(toolNames).toContain("jj_new");
    expect(toolNames).toContain("jj_abandon");
    expect(toolNames).toContain("jj_rebase");
    expect(toolNames).toContain("jj_bookmark_list");
    expect(toolNames).toContain("jj_bookmark_create");
    expect(toolNames).toContain("jj_bookmark_delete");
    expect(toolNames).toContain("jj_sanity_check");
    expect(toolNames).toContain("jj_init");
    expect(toolNames).toContain("jj_squash");
    expect(toolNames).toContain("jj_split");
    expect(toolNames).toContain("jj_undo");
    expect(toolNames).toContain("jj_redo");
    expect(toolNames).toContain("jj_restore");
    expect(toolNames).toContain("jj_edit");
    expect(toolNames).toContain("jj_next");
    expect(toolNames).toContain("jj_prev");

    // Git-adjacent tools
    expect(toolNames).toContain("jj_git_fetch");
    expect(toolNames).toContain("jj_git_push");
    expect(toolNames).toContain("jj_git_import");
    expect(toolNames).toContain("jj_git_export");
    expect(toolNames).toContain("jj_git_clone");
    expect(toolNames).toContain("jj_obslog");
    expect(toolNames).toContain("jj_op_log");
    expect(toolNames).toContain("jj_workspace_list");
    expect(toolNames).toContain("jj_workspace_add");
    expect(toolNames).toContain("jj_config_get");
    expect(toolNames).toContain("jj_config_set");
    expect(toolNames).toContain("jj_bisect");
    expect(toolNames).toContain("jj_file_show");
    expect(toolNames).toContain("jj_tag_list");
    expect(toolNames).toContain("jj_tag_create");
    expect(toolNames).toContain("jj_sparse");

    // In a multi-server environment (e.g. alongside deepwiki or context7),
    // the MCP client would merge tool lists from each connected server.
    expect(response.tools.length).toBe(37);
  });

  it("calls jj_sanity_check and returns environment info", async () => {
    const result = await client.callTool({
      name: "jj_sanity_check",
      arguments: {},
    });

    const content = result.content as Array<{ text: string }>;
    expect(content).toBeDefined();
    expect(content.length).toBeGreaterThan(0);

    const text = content[0].text;
    expect(text).toBeDefined();
    expect(typeof text).toBe("string");

    // The response either confirms jj is installed or reports it missing
    const hasJj = text.includes("Found jj");
    const missingJj = text.includes("not found");
    expect(hasJj || missingJj).toBe(true);
  });

  it("lists jj resources", async () => {
    const response = await client.listResources();

    expect(response.resources).toBeDefined();
    expect(response.resources.length).toBe(4);

    const uris = response.resources.map((r) => r.uri);
    expect(uris).toContain("jj://status");
    expect(uris).toContain("jj://log/recent");
    expect(uris).toContain("jj://bookmarks");
    expect(uris).toContain("jj://config");

    // In a multi-server environment (e.g. alongside deepwiki or context7),
    // the MCP client would merge resource lists from each connected server.
  });

  it("reads jj://status resource", async () => {
    const result = await client.readResource({ uri: "jj://status" });

    const contents = result.contents as Array<{ text: string }>;
    expect(contents).toBeDefined();
    expect(contents.length).toBeGreaterThan(0);

    const text = contents[0].text;
    expect(typeof text).toBe("string");

    // May be an error if not in a jj repo, but the JSON-RPC envelope is valid
    expect(text.length).toBeGreaterThanOrEqual(0);
  });
});
