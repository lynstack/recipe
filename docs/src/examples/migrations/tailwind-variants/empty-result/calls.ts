import type { label as afterLabel } from "./after.ts";
import type { label as beforeLabel } from "./before.ts";

export const recipe = "label";

export const before: Parameters<typeof beforeLabel>[0][] = [
  {},
  { tone: "muted" },
];

export const after: Parameters<typeof afterLabel>[0][] = [
  {},
  { tone: "muted" },
];
