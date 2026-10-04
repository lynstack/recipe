import { mkdtempSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { tmpdir } from "node:os";

import { listField, numberField, readJson, stringField } from "./json.ts";

/** The iterations per second of one task of a benchmark. */
interface Speed {
  readonly name: string;
  readonly hz: number;
}

/** The speed of each task, fastest first, keyed by the benchmark's full name. */
type Speeds = Readonly<Record<string, readonly Speed[]>>;

const MILLISECONDS_PER_SECOND = 1000;

/** Reads the speeds out of the report of Vitest's JSON reporter. */
function speedsOf(report: unknown): Speeds {
  const benchmarks = listField(report, "testResults").flatMap((file) =>
    listField(file, "assertionResults").flatMap((test) =>
      listField(test, "benchmarks"),
    ),
  );
  return Object.fromEntries(
    benchmarks.map((benchmark) => [
      stringField(benchmark, "name"),
      listField(benchmark, "tasks")
        .map((task): Speed => ({
          hz: MILLISECONDS_PER_SECOND / numberField(task, "period"),
          name: stringField(task, "name"),
        }))
        .toSorted((left, right) => right.hz - left.hz),
    ]),
  );
}

function runBenchmarks(directory: string, outputFile: string): unknown {
  execFileSync(
    "vitest",
    ["bench", "--run", "--reporter=json", `--outputFile=${outputFile}`],
    { cwd: directory, stdio: "inherit" },
  );
  return readJson(outputFile);
}

/**
 * Runs every benchmark of the package in `directory`, against its build, and
 * returns the speed of each task.
 */
function measureSpeeds(directory: string): Speeds {
  const output = mkdtempSync(path.join(tmpdir(), "recipe-measure-"));
  try {
    return speedsOf(
      runBenchmarks(directory, path.join(output, "benchmarks.json")),
    );
  } finally {
    rmSync(output, { force: true, recursive: true });
  }
}

/** Returns the speeds of a benchmark's tasks, which must have run. */
function speedsNamed(speeds: Speeds, benchmark: string): readonly Speed[] {
  const tasks = speeds[benchmark];
  if (tasks === undefined) {
    throw new Error(`No benchmark is named "${benchmark}".`);
  }
  return tasks;
}

export { measureSpeeds, speedsNamed };
export type { Speed, Speeds };
