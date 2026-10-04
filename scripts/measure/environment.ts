import { cpus } from "node:os";

/** When and where the measurements ran. */
interface Environment {
  /** The day of the measurement, such as `2026-10-02`. */
  readonly date: string;
  readonly cpu: string;
  readonly node: string;
}

const isoDate = new Intl.DateTimeFormat("en-CA", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** Describes the machine and the day, in the local time zone. */
function readEnvironment(): Environment {
  return {
    cpu: cpus()[0]?.model ?? "an unknown CPU",
    date: isoDate.format(new Date()),
    node: process.versions.node,
  };
}

export { readEnvironment };
export type { Environment };
