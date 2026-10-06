import type { toggle as afterToggle } from "./after.ts";
import type { toggle as beforeToggle } from "./before.ts";

export const recipe = "toggle";

export const before: Parameters<typeof beforeToggle>[0][] = [
  { pressed: true },
  { level: 2 },
  // @ts-expect-error -- the name of an option, from untyped data
  { pressed: "true" },
  // @ts-expect-error -- the name of an option, from untyped data
  { level: "2" },
];

export const after: Parameters<typeof afterToggle>[0][] = [
  { pressed: true },
  { level: 2 },
  { pressed: "true" },
  { level: "2" },
];
