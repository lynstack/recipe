import type { badge as afterBadge } from "./after.ts";
import type { badge as beforeBadge } from "./before.ts";

export const recipe = "badge";

export const before: Parameters<typeof beforeBadge>[0][] = [
  {},
  { tone: "danger" },
];

export const after: Parameters<typeof afterBadge>[0][] = [
  {},
  { tone: "danger" },
];
