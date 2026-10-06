import type { iconButton as afterIconButton } from "./after.ts";
import type { iconButton as beforeIconButton } from "./before.ts";

export const recipe = "iconButton";

export const before: Parameters<typeof beforeIconButton>[0][] = [
  { size: "sm" },
  { size: "md", tone: "danger" },
  { size: "lg", width: "full" },
];

export const after: Parameters<typeof afterIconButton>[0][] = [
  { size: "sm" },
  { size: "md", tone: "danger" },
  { size: "lg", width: "full" },
];
