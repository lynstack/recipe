import type { button as afterButton } from "./after.ts";
import type { button as beforeButton } from "./before.ts";

export const recipe = "button";

export const before: Parameters<typeof beforeButton>[0][] = [
  {},
  { size: null },
];

export const after: Parameters<typeof afterButton>[0][] = [
  {},
  { size: "none" },
];
