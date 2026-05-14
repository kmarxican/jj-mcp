import type { JjResult } from "../jj.js";

export function formatToolResult(result: JjResult): {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
} {
  if (result.success) {
    const text =
      result.data !== undefined
        ? typeof result.data === "string"
          ? result.data
          : JSON.stringify(result.data, null, 2)
        : result.stdout || "Success";
    return { content: [{ type: "text", text }] };
  }
  return {
    content: [{ type: "text", text: result.error ?? "Unknown error" }],
    isError: true,
  };
}

export function formatResourceResult(
  result: JjResult,
  uri: string
): { contents: Array<{ uri: string; text: string }> } {
  if (result.success) {
    const text =
      result.data !== undefined
        ? typeof result.data === "string"
          ? result.data
          : JSON.stringify(result.data, null, 2)
        : result.stdout || "Success";
    return { contents: [{ uri, text }] };
  }
  return { contents: [{ uri, text: `Error reading resource: ${result.error}` }] };
}
