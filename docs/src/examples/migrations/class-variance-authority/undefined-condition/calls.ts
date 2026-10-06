import type { alert as afterAlert } from "./after.ts";
import type { alert as beforeAlert } from "./before.ts";

export const recipe = "alert";

export const before: Parameters<typeof beforeAlert>[0][] = [
  {},
  { tone: "danger" },
];

export const after: Parameters<typeof afterAlert>[0][] = [
  {},
  { tone: "danger" },
];
