import type { stack as afterStack } from "./after.ts";
import type { stack as beforeStack } from "./before.ts";

export const recipe = "stack";

export const before: Parameters<typeof beforeStack>[0][] = [
  {},
  { gap: "tight" },
];

export const after: Parameters<typeof afterStack>[0][] = [{}, { gap: "tight" }];
