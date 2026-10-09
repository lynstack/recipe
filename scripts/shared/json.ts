import { readFileSync } from "node:fs";

/** Parses JSON text, whose shape the caller checks. */
function parseJson(text: string): unknown {
  const value: unknown = JSON.parse(text);
  return value;
}

/** Reads and parses a JSON file, whose shape the caller checks. */
function readJson(file: string): unknown {
  return parseJson(readFileSync(file, "utf8"));
}

/** Returns `value[key]`, or `undefined` when `value` is not an object. */
function field(value: unknown, key: string): unknown {
  return typeof value === "object" && value !== null
    ? Object.getOwnPropertyDescriptor(value, key)?.value
    : undefined;
}

/** Returns the list `value[key]`, or an empty list when there is none. */
function listField(value: unknown, key: string): readonly unknown[] {
  const items = field(value, key);
  return Array.isArray(items) ? items : [];
}

/** Returns the string `value[key]`, or `undefined` when there is none. */
function optionalStringField(value: unknown, key: string): string | undefined {
  const text = field(value, key);
  return typeof text === "string" ? text : undefined;
}

/** Returns the string `value[key]`, which must exist. */
function stringField(value: unknown, key: string): string {
  const text = optionalStringField(value, key);
  if (text === undefined) {
    throw new TypeError(`Expected a string at "${key}".`);
  }
  return text;
}

/** Returns the number `value[key]`, which must exist. */
function numberField(value: unknown, key: string): number {
  const number = field(value, key);
  if (typeof number !== "number") {
    throw new TypeError(`Expected a number at "${key}".`);
  }
  return number;
}

export {
  field,
  listField,
  numberField,
  optionalStringField,
  parseJson,
  readJson,
  stringField,
};
