---
title: Writing conflict-free recipes
description: Design recipes whose classes never conflict.
---

By default, classes are joined with `cx`, which keeps every class. When two
classes set the same CSS property, such as `px-4` and `px-2`, the one
defined later in the stylesheet wins, whatever their order in the class
name. A recipe avoids this by construction when it sets each CSS property
of an element in one place:

- **Set each property in `base` or in one variant, never in both.** Give
  every option of the variant its own class, rather than a default in
  `base` that an option overrides.
- **Turn props that set the same property into one variant.** For
  example, derive a `state` of `idle`, `loading`, or `disabled` from the
  `loading` and `disabled` props, rather than a variant for each.
- **Set a property that depends on several variants only in compound
  variants**, with one compound variant for each combination.
- **Add an option rather than an override.** `className`, `classNames`,
  and compound variants add classes after the variants; they never remove
  one.

```ts
// Conflicting: base and the variant both set the border color.
const conflicting = cva({
  base: "rounded-md border border-gray-300",
  variants: { invalid: { true: "border-red-600" } },
});

conflicting({ invalid: true });
// => "rounded-md border border-gray-300 border-red-600"

// Conflict-free: only the variant sets it.
const input = cva({
  base: "rounded-md border",
  variants: {
    invalid: { true: "border-red-600", false: "border-gray-300" },
  },
});

input({ invalid: true }); // => "rounded-md border border-red-600"
```

These rules, with more examples, are available as an agent skill. Install
it in your project with the [skills](https://skills.sh) CLI:

```sh
npx skills add lynstack/recipe --skill class-recipe
```

Or give your coding agent this prompt to use it in the current session
without installing it:

```text
Run `npx skills use lynstack/recipe@class-recipe` and follow the generated skill instructions now. Read its complete output, redirecting it to a temporary file first if necessary.
```

The skill also ships in the package, so you can point your agent to
`node_modules/@lynstack/class-recipe/skills/class-recipe/SKILL.md`, or copy
the `skills/class-recipe` folder into your agent's skills folder, such as
`.claude/skills`.
