---
title: Practices
description: "Write recipe kinds and recipes that stay fast and correct: type the values, freeze shared results, create recipes once, and apply overrides around them."
---

- **Annotate the `value` parameter of `reduce`, or the `base` parameter of
  `initial`.** It sets the type of every value of the kind: of `base`, of
  each option, and of each compound variant. Without either, the values
  are `unknown` and any value is accepted.
- **Return a new accumulator from `initial`** when `reduce` changes it in
  place, so that results never share it, and never change `base` itself.
- **Freeze an object result in `finish`.** A cached result is shared by
  every call with the same variants, so a caller that changes it changes
  them all.
- **Create kinds and recipes once, at the top level of a module.** Each
  recipe caches its own results; creating one on every render throws the
  cache away and compiles the config again.
- **Apply overrides around the recipe, not through it.** Merge an override
  prop, such as `style`, into the recipe's result, and only when it is
  passed, so that the call without it stays a cache lookup that returns
  the same result.
- **Put each value where it applies.** As with class names, values that
  apply to every selection go in `base`, the values of a variant in its
  options, and values that depend on several variants in compound
  variants, which apply after the options.
