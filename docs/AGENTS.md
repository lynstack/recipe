# docs

The documentation site, built with Astro and Starlight and served by
GitHub Pages at `https://lynstack.github.io/recipe/`.

## Layout

- Each package has its own section, in `src/content/docs/<package>`, and
  its own sidebar topic in `astro.config.ts`; the landing page,
  `src/content/docs/index.mdx`, lists the packages.
- `src/packages.ts` holds what the docs show of each package: its version,
  read from its `package.json`, and the links to its npm page, source, and
  changelog.
- The theme maps the lynstack design system onto Starlight in
  `src/styles/lynstack.css`.
- The docs read the measurements through the modules next to them in
  `src/measurements`, which format them, and show them with the components
  in `src/components`.
- Keep logic in `.ts` files, which are typechecked, and keep `.astro`
  files to markup.
- The docs depend on React Native and its React types only to typecheck
  the recipes of `@lynstack/native-recipe`.

## Recipes on a page

- The docs show a recipe with `RecipeExample`, which writes the calls a
  page gives it and what the recipe returns for each, or with
  `RecipePlayground`, in which a reader chooses the variants. Both run the
  recipe while the docs build, and show its code above, unless the page
  shows it already.
- Use a playground where a reader should explore a recipe, as in the
  overview of each package and the first example of each API page, and
  calls where a rule needs particular ones, as in the quick starts; never
  show both for the same recipe in one place.
- Each recipe is a module of `src/examples/recipes/<package>/<page>`,
  listed with its options in `src/examples/registry`, and built from the
  packages in the workspace, so the docs build them first. The types of a
  registry reject an option the recipe does not declare and a list that
  leaves one out, so a call that chooses an option the recipe does not
  declare fails the build.

## Figures of the engine

"How it works", "Composing recipes", and "Slot recipes" of
`@lynstack/recipe` draw what the engine does with `OptionNumbers`,
`CallFlow`, `RecipeTrace`, and `SlotRecipeTrace`, from the recipes listed
in `src/examples/traces.ts`.

- These recipes are created with `styleRecipe` or `slotStyleRecipe` of
  `src/examples/recipes/recipe`, which keep each config for the figures.
- `OptionNumbers` and `CallFlow` number options and key a call with
  `compileVariants` and `select` of the engine's sources, so they show
  what the engine computes.
- A trace builds a call with a kind that records each of its calls, and
  fails the build when the result differs from the recipe's, or a step
  cannot be told apart.
