import type { dateField as afterDateField } from "./after.ts";
import type { dateField as beforeDateField } from "./before.ts";

export const recipe = "dateField";

export const before: Parameters<typeof beforeDateField>[0][] = [
  {},
  { size: "sm" },
];

export const after: Parameters<typeof afterDateField>[0][] = [
  {},
  { size: "sm" },
];
