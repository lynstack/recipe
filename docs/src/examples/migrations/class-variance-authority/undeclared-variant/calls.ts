import type { button as afterButton } from "./after.ts";
import type { button as beforeButton } from "./before.ts";

export const recipe = "button";

export const before: Parameters<typeof beforeButton>[0][] = [
  { isInGroup: true },
  // @ts-expect-error -- a prop that is not a variant, from props spread in
  { isInGroup: true, isRounded: true },
];

export const after: Parameters<typeof afterButton>[0][] = [
  { isInGroup: true },
  { isInGroup: true, isRounded: true },
];
