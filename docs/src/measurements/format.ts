/** The calls per second of one task of a benchmark. */
interface Speed {
  readonly name: string;
  readonly hz: number;
}

/** When and where the measurements of a package ran. */
interface Environment {
  readonly date: string;
  readonly cpu: string;
  readonly node: string;
  readonly versions: Readonly<Record<string, string>>;
}

/** A package that was measured, with its version. */
interface Library {
  readonly name: string;
  readonly version: string;
}

const MILLION = 1_000_000;
const THOUSAND = 1000;

const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const oneDecimal = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});
const compact = new Intl.NumberFormat("en-US", {
  maximumSignificantDigits: 3,
  notation: "compact",
});
const longDate = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

const VOWEL = /^[aeiou]/iu;

/** Formats calls per second, such as `2.25M` or `156K`. */
function formatCompactHz(hz: number): string {
  return compact.format(hz);
}

/** Formats calls per second in millions, such as `17.8`. */
function formatMillions(hz: number): string {
  return oneDecimal.format(hz / MILLION);
}

/** Formats calls per second for prose, such as `2.2 million`. */
function formatRoughHz(hz: number): string {
  return hz >= MILLION
    ? `${formatMillions(hz)} million`
    : integer.format(Math.round(hz / THOUSAND) * THOUSAND);
}

/** Formats a date such as `2026-10-02` for prose, as `October 2, 2026`. */
function formatDate(isoDate: string): string {
  return longDate.format(new Date(isoDate));
}

/**
 * Compares a speed with that of a subject, such as `9.2× slower`,
 * `1.7× faster`, or `on par` when they round to the same.
 */
function formatRelative(hz: number, subjectHz: number): string {
  const slower = hz <= subjectHz;
  const times = oneDecimal.format(slower ? subjectHz / hz : hz / subjectHz);
  if (times === oneDecimal.format(1)) {
    return "on par";
  }
  return `${times}× ${slower ? "slower" : "faster"}`;
}

/** Returns the speed named `name`, which must have been measured. */
function speedNamed(speeds: readonly Speed[], name: string): number {
  const speed = speeds.find((candidate) => candidate.name === name);
  if (speed === undefined) {
    throw new Error(`No speed is named "${name}".`);
  }
  return speed.hz;
}

/** Returns the version of a package that was measured. */
function versionOf(environment: Environment, name: string): string {
  const version = environment.versions[name];
  if (version === undefined) {
    throw new Error(`No version of "${name}" was recorded.`);
  }
  return version;
}

/** Names the machine, such as `an Apple M1 Pro with Node.js 24.21.0`. */
function machineOf(environment: Environment): string {
  const article = VOWEL.test(environment.cpu) ? "an" : "a";
  return `${article} ${environment.cpu} with Node.js ${environment.node}`;
}

/** Lists the measured packages, in the order of `names`. */
function librariesOf(
  environment: Environment,
  names: readonly string[],
): readonly Library[] {
  return names.map((name) => ({ name, version: versionOf(environment, name) }));
}

export {
  formatCompactHz,
  formatDate,
  formatMillions,
  formatRelative,
  formatRoughHz,
  librariesOf,
  machineOf,
  speedNamed,
  versionOf,
};
export type { Environment, Library, Speed };
