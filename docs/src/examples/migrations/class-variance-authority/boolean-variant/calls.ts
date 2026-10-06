import type { input as afterInput } from "./after.ts";
import type { input as beforeInput } from "./before.ts";

export const recipe = "input";

export const before: Parameters<typeof beforeInput>[0][] = [
  {},
  { disabled: false },
];

export const after: Parameters<typeof afterInput>[0][] = [
  {},
  { disabled: false },
];
