# @lynstack/class-recipe

Class name recipes on `@lynstack/recipe`. It exports:

- `cx`, a drop-in replacement for `clsx`.
- `cva` (also exported as `createRecipe`), which maps variants to the class
  name of one element.
- `sva` (also exported as `createSlotRecipe`), which maps variants to the
  class names of several elements (slots).
- `createRecipes`, which returns `cx` and the recipe creators bound to a
  custom join function, such as `twMerge`, or with the cache turned off.

The docs lead with the short names, `cva` and `sva`.

## Modules

- `cx.ts`, `recipe.ts`, `slot-recipe.ts`, `create-recipes.ts`, `join.ts`,
  and `types.ts` hold the public API and its types. `types.ts` re-exports
  the shared types of `@lynstack/recipe`.
- The other modules are internal, and use only the public API of
  `@lynstack/recipe`:
  - `compile-recipe.ts` builds the recipe functions on recipe kinds of
    `createRecipeKind`, and `compile-slot-recipe.ts` the slot recipe
    functions on slot recipe kinds of `createSlotRecipeKind`.
  - `join-classes.ts` joins the classes of a selection.
  - `build-options.ts` holds the join and cache settings of a recipe.
  - `check-config.ts` checks the classes of a config when a recipe is
    created, so that a config from untyped code fails with a message
    that names what is wrong.

## Tests and benchmarks

- The property tests compare `cx` with `clsx`, `cva` with
  `class-variance-authority`, a slot recipe with a recipe for each slot,
  and a recipe that composes others with one config.
- The `*.compare.bench.ts` benchmarks measure the same work in other
  libraries (`clsx`, `classnames`, `class-variance-authority`,
  `tailwind-variants`), which are development dependencies of this package
  only; the docs report their results.

## Skill

`skills/class-recipe/SKILL.md` is an agent skill that ships with the
package. It teaches agents in consuming projects to write recipes whose
classes never conflict. It gives the same advice as the docs.
