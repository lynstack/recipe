# @lynstack/recipe

The engine. It exports `createRecipeKind`, which defines a kind of recipe
by how it reduces values, such as class names or style objects, and
returns the function that creates recipes of that kind, and
`createSlotRecipeKind`, which returns the function that creates slot
recipes of a kind, which reduce the values of each of several slots. It
has no dependencies.

`@lynstack/class-recipe` and `@lynstack/native-recipe` are built on it and
use only its public API, so a change here that they need is a change to
that API.

## Modules

- `recipe-kind.ts`, `slot-recipe-kind.ts`, `types.ts`, and
  `composition.ts`, the types of composing recipes, hold the public API
  and its types.
- The other modules are internal:
  - `variants.ts` compiles variants into numbered options, so a selection
    becomes an integer key, and lists the variants, options, and defaults
    of a recipe.
  - `selector.ts` caches results by that key.
  - `compose.ts` keeps the configs of each recipe, its layers, and merges
    the layers of a recipe that composes others into one config.
  - `build-recipe.ts` compiles a recipe from one config or merged layers,
    combining the values of each option with the kind's `combine`.
  - `reduce-values.ts` reduces the values of a selection.
  - `slots.ts` turns the values of a slot recipe into entries by slot and
    builds the result of each slot.

## Tests

The property tests compare a recipe kind with a model of its documented
behavior, a slot recipe with a recipe for each slot, and a recipe or slot
recipe that composes others with one config, with and without the
`combine` of its kind.
