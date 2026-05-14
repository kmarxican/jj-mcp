import type { ReadResourceRequest } from "@modelcontextprotocol/sdk/types.js";
import { jjStatus, jjLog, jjBookmarkList, runJj } from "../jj.js";
import { formatResourceResult } from "./result.js";

export function handleListResources(): {
  resources: Array<{ uri: string; name: string; description: string; mimeType: string }>;
} {
  const resources = [
    {
      uri: "jj://status",
      name: "Repository Status",
      description: "Current working copy status and changes",
      mimeType: "text/plain",
    },
    {
      uri: "jj://log/recent",
      name: "Recent Commits",
      description: "Recent commit history (default limit: 10)",
      mimeType: "text/plain",
    },
    {
      uri: "jj://bookmarks",
      name: "Bookmarks",
      description: "List of all bookmarks (branches)",
      mimeType: "text/plain",
    },
    {
      uri: "jj://config",
      name: "Configuration",
      description: "Repository configuration settings",
      mimeType: "text/plain",
    },
  ];

  return { resources };
}

export function handleReadResource(request: ReadResourceRequest): {
  contents: Array<{ uri: string; text: string }>;
} {
  const { uri } = request.params;

  // Extract cwd from URI if provided (e.g., "jj://status?cwd=/path/to/repo")
  const url = new URL(uri, "jj://");
  const cwd = url.searchParams.get("cwd") ?? undefined;

  try {
    let result;

    switch (uri.split("?")[0]) {
      case "jj://status":
        result = jjStatus(cwd);
        break;

      case "jj://log/recent": {
        // Get limit from URL params, default to 10
        const limit = url.searchParams.get("limit")
          ? parseInt(url.searchParams.get("limit")!, 10)
          : 10;
        result = jjLog(undefined, limit, cwd);
        break;
      }

      case "jj://bookmarks":
        result = jjBookmarkList(cwd);
        break;

      case "jj://config":
        result = runJj(["config", "list"], cwd);
        break;

      default:
        return {
          contents: [
            {
              uri,
              text: `Unknown resource: ${uri}`,
            },
          ],
        };
    }

    return formatResourceResult(result, uri);
  } catch (error) {
    return {
      contents: [
        {
          uri,
          text: `Error reading resource ${uri}: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}
