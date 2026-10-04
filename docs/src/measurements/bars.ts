import type { Speed } from "./format.ts";
import { speedNamed } from "./format.ts";

/** A row of a table that draws its speed as a bar. */
interface BarRow {
  readonly label: string;
  readonly version?: string;
  readonly hz: number;
  readonly emphasis: "strong" | "muted" | "none";
}

/** Rows under an optional heading. */
interface BarGroup {
  readonly heading?: string;
  readonly rows: readonly BarRow[];
}

/** Returns the rows of a benchmark of a cached and an uncached task. */
function cacheRows(title: string, speeds: readonly Speed[]): readonly BarRow[] {
  return [
    {
      emphasis: "none",
      hz: speedNamed(speeds, "cached"),
      label: `${title}, with cache`,
    },
    {
      emphasis: "muted",
      hz: speedNamed(speeds, "uncached"),
      label: `${title}, without cache`,
    },
  ];
}

export { cacheRows };
export type { BarGroup, BarRow };
