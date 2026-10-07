import type { Call } from "./example.ts";
import { exampleOf } from "./examples.ts";
import { formatCallResult } from "./format.ts";
import { formatLiteral } from "./literal.ts";

const sources = import.meta.glob<string>("./recipes/**/*.ts", {
  eager: true,
  import: "default",
  query: "?raw",
});

/** Returns the code of the module of an example, as the docs show it. */
function sourceOf(name: string): string {
  const source = sources[`./recipes/${name}.ts`];
  if (source === undefined) {
    throw new Error(`${name} has no module in recipes`);
  }
  return source;
}

/**
 * Writes each of `calls` of an example's recipe and what it returns, or
 * the value of `slot` in what it returns.
 */
function formatCalls(
  name: string,
  calls: readonly Call[],
  slot?: string,
): string {
  const example = exampleOf(name);
  return calls
    .map((call) =>
      formatCallResult({
        call,
        name: example.name,
        slot,
        values: example.valuesOf(call),
      }),
    )
    .join("");
}

type Exports = Readonly<Record<string, unknown>>;

const evaluatedSources = import.meta.glob<string>("./evaluated/**/*.ts", {
  eager: true,
  import: "default",
  query: "?raw",
});

const evaluatedModules = import.meta.glob<Exports>("./evaluated/**/*.ts", {
  eager: true,
});

/** The widest line that keeps its result on the same line. */
const resultWidth = 72;

/** The widest line of code, as Prettier formats it. */
const codeWidth = 80;

/** A comment line, an empty line, or a statement that ends a line with `;`. */
const statementPattern = /^(?:\/\/.*|[^\n/][\s\S]*?;)?$/gmu;

const exportedConst =
  /^export const (?<name>\w+) =\s*(?<expression>[\s\S]+);$/u;

/**
 * Splits code into its statements, comment lines, and empty lines.
 *
 * @throws {SyntaxError} When a statement does not end a line with `;`.
 */
function statementsOf(source: string): readonly string[] {
  const statements = source.match(statementPattern) ?? [];
  if (statements.join("\n") !== source) {
    throw new SyntaxError(`A statement does not end with ";" in:\n${source}`);
  }
  return statements;
}

/** Whether a statement imports a module of the docs, which a page shows. */
function isRelativeImport(statement: string): boolean {
  return statement.startsWith("import ") && /from "\.{1,2}\//u.test(statement);
}

/**
 * Joins the lines of an expression that Prettier wrapped only because
 * `export const name = ` came before it, unless it is still too wide.
 */
function unwrap(expression: string): string {
  const joined = expression
    .replaceAll(/(?<open>[[(])\s*\n\s*/gu, "$<open>")
    .replaceAll(/\{\s*\n\s*/gu, "{ ")
    .replaceAll(/,?\s*\n\s*(?<close>[)\]])/gu, "$<close>")
    .replaceAll(/,?\s*\n\s*\}/gu, " }")
    .replaceAll(/\s*\n\s*/gu, " ");
  return joined.length + 1 > codeWidth ? expression : joined;
}

/**
 * Writes an exported constant as its expression, followed by its value on
 * the same line when both fit, or on the next one.
 */
function withResult(expression: string, value: unknown): string {
  const code = `${unwrap(expression.trim())};`;
  const result = `// => ${formatLiteral(value).text}`;
  return code.includes("\n") || code.length + result.length + 1 > resultWidth
    ? `${code}\n${result}`
    : `${code} ${result}`;
}

/**
 * Returns the code of the module `name` in `evaluated`, as the docs show
 * it: without the imports of other modules of the docs, and with each
 * exported constant written as the expression it holds, followed by its
 * value.
 *
 * @throws {RangeError} When there is no such module.
 */
function evaluatedCode(name: string): string {
  const path = `./evaluated/${name}.ts`;
  const source = evaluatedSources[path];
  const values = evaluatedModules[path];
  if (source === undefined || values === undefined) {
    throw new RangeError(`${name} has no module in evaluated`);
  }
  return statementsOf(source.trimEnd())
    .filter((statement) => !isRelativeImport(statement))
    .map((statement) => {
      const { name: constant, expression } =
        exportedConst.exec(statement)?.groups ?? {};
      return constant === undefined || expression === undefined
        ? statement
        : withResult(expression, values[constant]);
    })
    .join("\n")
    .trim();
}

export { evaluatedCode, formatCalls, sourceOf };
