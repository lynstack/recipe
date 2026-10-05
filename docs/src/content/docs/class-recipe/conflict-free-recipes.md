---
title: Writing conflict-free recipes
description: "Design class name recipes whose classes never conflict, without tailwind-merge, by setting each CSS property of an element in one place."
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

These rules, with more examples, ship with the package as an
[agent skill](/recipe/class-recipe/agent-skill/), which teaches coding
agents to follow them.
