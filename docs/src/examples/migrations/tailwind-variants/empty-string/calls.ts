import type { stack as afterStack } from "./after.ts";
import type { stack as beforeStack } from "./before.ts";

export const recipe = "stack";

export const before: Parameters<typeof beforeStack>[0][] = [
  // @ts-expect-error -- an empty string from untyped data
  { gap: "" },
];

export const after: Parameters<typeof afterStack>[0][] = [
  // @ts-expect-error -- an empty string from untyped data
  { gap: "" },
];
