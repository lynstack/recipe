import type { ClassJoin } from "./join.js";
import { cx } from "./cx.js";

/** How a recipe combines and caches its classes. */
interface BuildOptions {
  /** Combines the class strings of a recipe into its class name. */
  readonly join: ClassJoin;
  /** Whether to cache the class names of each declared selection. */
  readonly cache: boolean;
}

const defaultBuildOptions: BuildOptions = { cache: true, join: cx };

export { defaultBuildOptions };
export type { BuildOptions };
