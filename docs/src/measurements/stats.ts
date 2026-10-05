/** A headline number of a page, with what it measures. */
interface Stat {
  readonly value: string;
  readonly label: string;
}

/** Formats how many times as fast one speed is as another, such as `9×`. */
function formatTimes(hz: number, otherHz: number): string {
  return `${Math.round(hz / otherHz)}×`;
}

export { formatTimes };
export type { Stat };
