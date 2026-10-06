import type { card as afterCard } from "./after.ts";
import type { card as beforeCard } from "./before.ts";

export const recipe = "card";

export const before: Parameters<typeof beforeCard>[0][] = [{ size: "sm" }];

export const after: Parameters<typeof afterCard>[0][] = [{ size: "sm" }];
