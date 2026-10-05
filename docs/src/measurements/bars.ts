import { formatCompactHz, formatRelative, speedNamed } from "./format.ts";
import type { Speed } from "./format.ts";

const PERCENT = 100;

/**
 * A row of a table that draws its speed as a bar. The subject is the row
 * the others are compared with: the package, or the call with its cache.
 */
interface BarRow {
  readonly label: string;
  readonly hz: number;
  readonly subject: boolean;
}

/** Rows under an optional heading, one of which is the subject. */
interface BarGroup {
  readonly heading?: string;
  readonly rows: readonly BarRow[];
}

/** A row as the table shows it. */
interface BarLine {
  readonly label: string;
  readonly speed: string;
  /** The share of the fastest speed of its group, from 0 to 100. */
  readonly percent: number;
  /** How the row compares with the subject, unless it is the subject. */
  readonly relative: string | undefined;
  readonly subject: boolean;
}

/** A group as the table shows it. */
interface BarSection {
  readonly heading: string | undefined;
  readonly lines: readonly BarLine[];
}

/** Returns the rows of a benchmark of a cached and an uncached task. */
function cacheRows(title: string, speeds: readonly Speed[]): readonly BarRow[] {
  return [
    {
      hz: speedNamed(speeds, "cached"),
      label: `${title}, with cache`,
      subject: true,
    },
    {
      hz: speedNamed(speeds, "uncached"),
      label: `${title}, without cache`,
      subject: false,
    },
  ];
}

/**
 * Lays out a group: scales its bars to its fastest row, and compares each
 * row with its subject.
 */
function barSectionOf({ heading, rows }: BarGroup): BarSection {
  const subject = rows.find((row) => row.subject);
  if (subject === undefined) {
    throw new Error(`The group "${heading ?? ""}" has no subject.`);
  }
  const fastest = Math.max(...rows.map((row) => row.hz));
  return {
    heading,
    lines: rows.map((row) => ({
      label: row.label,
      percent: (row.hz / fastest) * PERCENT,
      relative: row.subject ? undefined : formatRelative(row.hz, subject.hz),
      speed: formatCompactHz(row.hz),
      subject: row.subject,
    })),
  };
}

export { barSectionOf, cacheRows };
export type { BarGroup, BarLine, BarRow, BarSection };
