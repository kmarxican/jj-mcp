import { coreTools, type Tool } from "./core.js";
import { gitTools } from "./git.js";
import { advancedTools } from "./advanced.js";

export type { Tool };
export const tools: Tool[] = [...coreTools, ...gitTools, ...advancedTools];
