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
- `src/route-data.ts` adds to the `<head>` of each page what `src/seo.ts`
  builds: the tokens that search engines verify the site with, the Open
  Graph image, and the structured data. Each token comes from an
  environment variable that `src/env-schema.ts` declares, such as
  `GOOGLE_SITE_VERIFICATION`; `docs.yml` reads it from the repository
  variable of the same name, and a token that is not set adds no tag.
- Keep logic in `.ts` files, which are typechecked, and keep `.astro`
  files to markup.

## Structure of a package's section

- Every topic has the same groups, in this order: Get started, Concepts,
  Guides, API reference, and Resources. class-recipe also has Migrate.
- Concepts explain, Guides show how to do a task, and API reference pages
  list a function's signature, config, and result. A rule belongs to one
  page; the others link to it.
- The docs of class-recipe and native-recipe are complete without the
  engine's. They never require its words, such as "kind" or "reduce",
  and link to the engine only in an "Under the hood" aside.
- The engine's section is for authors of libraries built on it.
- Each package has a glossary, and defines a term, or links it there, the
  first time a page uses it. Quick starts and guides end with Next steps.
- Never change a page's slug: the packages' TSDoc, READMEs, and skills
  link to them. When a section moves, keep a heading with its text where
  a link points to it, with a link to the new place.
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
- Any other value the docs show after `// =>`, such as `variantKeys`, a
  result of `cx`, or a comparison of two results, comes from
  `EvaluatedCode`. It shows a module of `src/examples/evaluated/<package>/<page>`
  without its imports of other modules of the docs, and writes the value
  of each `export const` after its expression. Only types, which nothing
  evaluates, are written by hand.

## Figures of the engine

Three pages of `@lynstack/recipe` draw what the engine does, from the
recipes listed in `src/examples/traces.ts`:

- "How it works" numbers the options of a recipe with `OptionNumbers`,
  follows a call with `CallFlow`, and traces the order of the values with
  `RecipeTrace`.
- "Composing recipes" traces the order of the values of a recipe that
  composes another, and the same recipe built without and with `combine`,
  with `RecipeTrace`.
- "Slot recipes" traces the values of each slot with `SlotRecipeTrace`.

How they are drawn:

- These recipes are created with `styleRecipe` or `slotStyleRecipe` of
  `src/examples/recipes/recipe`, which keep each config for the figures.
- `OptionNumbers` and `CallFlow` number options and key a call with
  `compileVariants` and `select` of the engine's sources, so they show
  what the engine computes.
- A trace builds a call with a kind that records each of its calls, and
  fails the build when the result differs from the recipe's, or a step
  cannot be told apart.
