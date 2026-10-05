---
title: Designing a kind
description: "Patterns for writing a recipe kind: immutable values, an accumulator changed in place, a string accumulator, and collecting values for finish, with what each one costs and how to test a kind."
---

A kind decides what every uncached call costs, and whether its results are
correct when they are shared. This page compares the ways to write one,
from the simplest to the fastest.

## Choose the value

`Value` is what one option adds, not what a recipe returns. Make it the
smallest thing that an option can say on its own:

- For class names, a string of classes.
- For styles, a partial style object, which `reduce` merges.
- For anything built from parts, such as a list of tokens or a set of
  props, one part, or a few.

An option whose value is `undefined` adds nothing, so a value type never
needs a way to say "nothing" of its own.

## Return a new value each time

The simplest kind returns a new accumulator from every `reduce`:

```ts
const styleRecipe = createRecipeKind({
  initial: (base?: Style): Style => ({ ...base }),
  reduce: (style: Style, value: Style): Style => ({ ...style, ...value }),
  finish: (style: Style): Style => Object.freeze(style),
});
```

It never changes anything it receives, so it cannot get sharing wrong.
Each value copies the whole style, though, so a result built from many
values costs many copies.

## Change the accumulator in place

`initial` is called for every result, so the accumulator it returns
belongs to that result alone, and `reduce` can change it in place:

```ts
type MutableStyle = Record<string, string | number>;

const styleRecipe = createRecipeKind({
  initial: (base?: Style): MutableStyle => ({ ...base }),
  reduce: (style: MutableStyle, value: Style) => Object.assign(style, value),
  finish: (style: MutableStyle): Style => Object.freeze(style),
});
```

A result now costs one copy, however many values it has. This is the
design to start from for objects. Keep the rules that make it safe:
`initial` always returns a new object, and `reduce` changes only the
accumulator, never `base` or `value`.

## Reduce into a primitive

A string accumulator is never shared, since strings cannot change, and
needs no `finish`:

```ts
const classRecipe = createRecipeKind({
  initial: (base?: string): string => base ?? "",
  reduce: (className, classes: string) =>
    className === "" ? classes : `${className} ${classes}`,
});
```

This is how `@lynstack/class-recipe` concatenates class names. It
allocates only the strings it builds.

## Collect, then finish

Some results need every value at once: resolving conflicts between class
names, sorting, or deduplicating. Collect the values into a list, and do
that work in `finish`:

```ts
import { twMerge } from "tailwind-merge";

const mergedClassRecipe = createRecipeKind({
  initial: (base?: string): string[] => (base === undefined ? [] : [base]),
  reduce: (classes: string[], value: string) => {
    classes.push(value);
    return classes;
  },
  finish: (classes: string[]): string => twMerge(classes),
});

const button = mergedClassRecipe({
  base: "px-4 py-2",
  variants: { size: { sm: "px-2 py-1", lg: "px-6 py-3" } },
});

button({ size: "sm" }); // => "px-2 py-1"
```

`finish` runs once per result, and with the cache once per selection, so
an expensive merge costs little in a cached recipe. This is how
`@lynstack/class-recipe` uses a join such as `twMerge`.

## Convert in `finish`

The accumulator and the result can be different types. Reduce into
whatever is cheapest to extend, such as an array, a `Map`, or a mutable
object, and turn it into the result in `finish`: a string, a frozen
object, or an immutable structure.

## What each design costs

| Design                       | Copies per result | Safe to share without `finish` |
| ---------------------------- | ----------------- | ------------------------------ |
| A new value each time        | One per value     | No: freeze it                  |
| Accumulator changed in place | One               | No: freeze it                  |
| Primitive accumulator        | None              | Yes                            |
| Collect, then finish         | One list          | Depends on the result          |

Only uncached calls pay these costs. Measure a kind on its uncached path,
with `cache: false`, when its speed matters.

## Test a kind

A kind's bugs show up when results are shared, so test it as a cached
recipe uses it:

- Call a recipe twice with the same variants, and check that it returns
  the same result, and that the result is frozen when it is an object.
- Build two selections that share options one after the other, and check
  that the first result has not changed.
- Run the same tests with `cache: false`, which builds every result anew
  and shows whether `initial` returns a new accumulator each time.
