type McpArgs = Record<string, unknown> | undefined;

export function getStringArg(args: McpArgs, key: string): string | undefined {
  const value = args?.[key];
  return typeof value === "string" ? value : undefined;
}

export function getNumberArg(args: McpArgs, key: string): number | undefined {
  const value = args?.[key];
  return typeof value === "number" ? value : undefined;
}

export function getBooleanArg(args: McpArgs, key: string): boolean | undefined {
  const value = args?.[key];
  return typeof value === "boolean" ? value : undefined;
}

export function getStringArrayArg(args: McpArgs, key: string): string[] | undefined {
  const value = args?.[key];
  if (!Array.isArray(value)) return undefined;
  if (value.every((item): item is string => typeof item === "string")) return value;
  return undefined;
}
