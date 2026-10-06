import type { button as afterButton } from "./after.ts";
import type { button as beforeButton } from "./before.ts";

export const recipe = "button";

export const before: Parameters<typeof beforeButton>[0][] = [
  // @ts-expect-error -- null from untyped data
  { size: null },
];

export const after: Parameters<typeof afterButton>[0][] = [
  // @ts-expect-error -- null from untyped data
  { size: null },
];
