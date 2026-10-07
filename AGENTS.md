# recipe

This repository holds three small TypeScript libraries, each a public
package published to npm as an ES module only, and their documentation
site:

- `@lynstack/recipe`, in `packages/recipe`, creates recipes for values
  of any type. It exports `createRecipeKind`, which defines a kind of
  recipe by how it reduces values, such as class names or style objects,
  and returns the function that creates recipes of that kind, and
  `createSlotRecipeKind`, which returns the function that creates slot
  recipes of a kind, which reduce the values of each of several slots. It
  has no dependencies.
- `@lynstack/class-recipe`, in `packages/class-recipe`, builds class names
  on that engine.
- `@lynstack/native-recipe`, in `packages/native-recipe`, builds React
  Native style objects on that engine.

`@lynstack/class-recipe` exports:

- `cx`, a drop-in replacement for `clsx`.
- `cva` (also exported as `createRecipe`), which maps variants to the class
  name of one element.
- `sva` (also exported as `createSlotRecipe`), which maps variants to the
  class names of several elements (slots).
- `createRecipes`, which returns `cx` and the recipe creators bound to a
  custom join function, such as `twMerge`, or with the cache turned off.

The docs lead with the short names, `cva` and `sva`.

`@lynstack/native-recipe` exports `createStyleRecipe`, which maps variants
to the style of one element, and `createSlotStyleRecipe`, which maps
variants to the styles of several elements (slots), and
`createThemedRecipes`, which returns both for recipes whose styles are
built from the tokens of a theme, such as a light and a dark theme. A
recipe returns the same frozen style for the same variants, so that React
Native's `style` prop keeps its identity between renders.

## Layout

- The repository is a pnpm workspace with a private root. The root holds
  what the packages share: the tools, `tsconfig.base.json`, the shared
  lint rules in `.oxlintrc.json`, the formatting rules, and the scripts.
  `docs`, the documentation site, is a private workspace package, with
  its own `.oxlintrc.json` that extends the shared one.
- Each package in `packages` is self-contained: its own `package.json`
  with its scripts and development dependencies, `tsconfig.json`,
  `tsconfig.build.json` (the sources that tsdown builds),
  `vitest.config.ts`, `tsdown.config.ts`, `.oxlintrc.json`, README,
  CHANGELOG, LICENSE, and fixture. A package's `.oxlintrc.json` extends
  the shared one and holds the rules of that package only.
- Each package has one entry point, `src/index.ts`; every public export
  goes through it. tsdown bundles it into `dist/index.js` and
  `dist/index.d.ts`.
- In `@lynstack/recipe`, `recipe-kind.ts`, `slot-recipe-kind.ts`,
  `types.ts`, and `composition.ts`, the types of composing recipes, hold
  the public API and its types. The other modules are internal:
  `variants.ts` compiles variants into numbered options, so a selection
  becomes an integer key; `selector.ts` caches results by that key;
  `compose.ts` keeps the configs of each recipe, its layers, and merges
  the layers of a recipe that composes others into one config;
  `build-recipe.ts` compiles a recipe from one config or merged layers,
  combining the values of each option with the kind's `combine`;
  `reduce-values.ts` reduces the values of a selection; and `slots.ts`
  turns the values of a slot recipe into entries by slot and builds the
  result of each slot.
- In `@lynstack/class-recipe`, `cx.ts`, `recipe.ts`, `slot-recipe.ts`,
  `create-recipes.ts`, `join.ts`, and `types.ts` hold the public API and
  its types. `types.ts` re-exports the shared types of `@lynstack/recipe`.
  The other modules are internal: `compile-recipe.ts` builds the recipe
  functions on recipe kinds of `createRecipeKind`, and
  `compile-slot-recipe.ts` the slot recipe functions on slot recipe kinds
  of `createSlotRecipeKind`, using only the public API of
  `@lynstack/recipe`;
  `join-classes.ts` joins the classes of a selection; and
  `build-options.ts` holds the join and cache settings of a recipe.
- In `@lynstack/native-recipe`, `style-recipe.ts`, `slot-style-recipe.ts`,
  `themed-recipes.ts`, and `types.ts` hold the public API and its types;
  `types.ts` checks styles against the `ViewStyle`, `TextStyle`, and
  `ImageStyle` types of React Native and re-exports the shared types of
  `@lynstack/recipe`. The
  other modules are internal: `compile-style-recipe.ts` and
  `compile-slot-style-recipe.ts` build the recipe functions with
  `createRecipeKind` and `createSlotRecipeKind`, using only the public API
  of `@lynstack/recipe`, on one kind that merges loose styles in place;
  and `compile-themed-recipe.ts` keeps the recipe of each theme object in
  a `WeakMap`, with the recipe of the last theme apart.
  The package imports only types from React Native, which is its peer
  dependency and a development dependency for those types.
- Tests sit next to the code as `*.test.ts`, and benchmarks as
  `*.bench.ts`. The `*.property.test.ts` tests generate configs and calls
  with fast-check and compare the results with a reference: `cx` with
  `clsx`, `cva` with `class-variance-authority`, a recipe kind with a
  model of its documented behavior, a slot recipe with a recipe for each
  slot, and a recipe or slot recipe that composes others with one config,
  with and without the `combine` of its kind. Arbitraries that several
  property tests share sit in `*.arbitraries.ts`, which the build leaves
  out.
  A benchmark imports its package by its name, so it runs against the
  built bundle, never against the sources directly. The
  `*.compare.bench.ts` benchmarks of `@lynstack/class-recipe` measure the
  same work in other libraries (`clsx`, `classnames`,
  `class-variance-authority`, `tailwind-variants`), which are development
  dependencies of that package only; the docs report their results.
- `fixtures/consumer` in each package uses the built package; compiling it
  checks the published declarations. The fixture of
  `@lynstack/native-recipe` compiles with the settings of
  `@react-native/typescript-config`, which React Native apps extend,
  including `skipLibCheck`, since React Native's own declarations do not
  compile without it.
- `packages/class-recipe/skills/class-recipe/SKILL.md` is an agent skill
  that ships with `@lynstack/class-recipe`. It teaches agents in consuming
  projects to write recipes whose classes never conflict.
  `packages/native-recipe/skills/native-recipe/SKILL.md` ships with
  `@lynstack/native-recipe`. It teaches agents to keep styles stable and
  to build styles from theme tokens.
- `scripts` holds Node.js programs for maintainers, written in TypeScript
  that Node.js runs directly. `scripts/measure` runs the benchmarks of
  each package and saves the raw results, never formatted text, in
  `docs/src/measurements/<package>.json`. It has one module per package,
  which names the benchmarks that package reports.
- `docs` is the documentation site, built with Astro and Starlight and
  served by GitHub Pages at `https://lynstack.github.io/recipe/`. Each
  package has its own section, in `docs/src/content/docs/<package>`, and
  its own sidebar topic in `docs/astro.config.ts`; the landing page,
  `docs/src/content/docs/index.mdx`, lists the packages.
  `docs/src/packages.ts` holds what the docs show of each package: its
  version, read from its `package.json`, and the links to its npm page,
  source, and changelog. The theme maps
  the lynstack design system onto Starlight in
  `docs/src/styles/lynstack.css`. The docs read the measurements through
  the modules next to them in `docs/src/measurements`, which format them, and show them with the
  components in `docs/src/components`. Keep logic in `.ts` files, which
  are typechecked, and keep `.astro` files to markup.
- The docs show a recipe with `RecipeExample`, which writes the calls a
  page gives it and what the recipe returns for each, or with
  `RecipePlayground`, in which a reader chooses the variants. Both run
  the recipe while the docs build, and show its code above, unless the
  page shows it already. Use a playground where a reader should explore
  a recipe, as in the overview of each package and the first example of
  each API page, and calls where a rule needs particular ones, as in the
  quick starts; never show both for the same recipe in one place. Each
  recipe is a module of `docs/src/examples/recipes/<package>/<page>`,
  listed with its options in `docs/src/examples/registry`, and built from
  the packages in the workspace, so the docs build them first. A call
  that chooses an option the recipe does not declare fails the build.
  "How it works", "Composing recipes", and "Slot recipes" of
  `@lynstack/recipe` draw what the engine does with `OptionNumbers`,
  `CallFlow`, `RecipeTrace`, and `SlotRecipeTrace`, from the recipes
  listed in `docs/src/examples/traces.ts`. These are created with
  `styleRecipe` or `slotStyleRecipe` of `docs/src/examples/recipes/recipe`,
  which keep each config for the figures. `OptionNumbers` and `CallFlow`
  number options and key a call with `compileVariants` and `select` of the
  engine's sources, so they show what the engine computes. A trace builds
  a call with a kind that records each of its calls, and fails the build
  when the result differs from the recipe's, or a step cannot be told
  apart. The
  docs depend on React Native and its React types only to typecheck the
  recipes of `@lynstack/native-recipe`.
- `examples` holds an example of each package that readers open in the
  browser, from the Open in StackBlitz or Open in Snack link of its
  overview page: `recipe` and
  `class-recipe` are React apps, built with Vite, that StackBlitz opens
  from the `main` branch, and `native-recipe/App.tsx` is the app of an
  Expo Snack, whose link `docs/src/packages.ts` builds. The examples are not in the
  workspace: they install the published packages, at the exact version of
  their last release, with npm.
- A package's README is short: what the package does, how to install it,
  one example, and links to the docs. The docs hold everything else.
- A package's `CHANGELOG.md` lists its versions, the newest first, each
  with its date and what changed for its users. It ships in the package.
  When it grows long, move the entries of earlier major versions to a
  file of their own, such as `CHANGELOG-1.x.md`, and link to it.
- `.github/workflows` holds a CI and a release workflow for each package,
  named after it, `ci.yml`, which checks what the packages share and the
  docs, and `docs.yml`, which builds the docs and deploys them to GitHub
  Pages on every push to `main` that changes them.

## Commands

Run `pnpm check` at the root before every commit. It runs the `check`
script of each package and of the docs, dependencies first, then
typechecks and lints the scripts and checks formatting. The docs' `check`
typechecks them, lints them, checks their formatting, and builds them. A
package's `check` builds it
(which runs publint and Are the Types Wrong), typechecks it, compiles its
fixture, lints it, checks its formatting, and runs its tests.
`@lynstack/class-recipe` and `@lynstack/native-recipe` need
`@lynstack/recipe` built first.

Run a package's scripts with `pnpm --filter <name> <script>`, such as
`pnpm --filter @lynstack/recipe test`, or from its folder.

- `pnpm test` runs the tests of every package.
- `test:coverage`, in a package, runs its tests and reports coverage. Use
  it to find behavior without a test; it sets no threshold, and a test
  written only to cover a line adds nothing.
- `pnpm bench` builds each package and runs its benchmarks. Run it after
  every change to the `src` of a package.
- `pnpm measure` builds the packages, runs their benchmarks, and saves the
  results, with the date, in `docs/src/measurements`. Pass
  package folder names, as in `pnpm measure class-recipe`, to measure only
  those. Run it before a release, and after a change that affects speed;
  it takes a few minutes. Commit the results with the change.
- `pnpm docs:dev` serves the docs locally, and `pnpm docs:build` builds
  them into `docs/dist`.
- `pnpm format` formats every file.

### Releasing

Each package is released on its own, by publishing a GitHub release whose
tag names the package and its version: `recipe@1.0.0` for
`@lynstack/recipe`, `class-recipe@1.2.0` for `@lynstack/class-recipe`,
`native-recipe@1.0.0` for `@lynstack/native-recipe`. Before a release,
add the version to the package's `CHANGELOG.md`, with its date, and use
that entry as the notes of the GitHub release. After the version is on npm, set
it in the package's example in `examples`, and update its
`package-lock.json` with `npm install`. The
package's release workflow checks that the tag matches the version in its
`package.json`, runs its `check`, packs it with `pnpm pack`, which turns
each `workspace:^` dependency into a range, such as `^1.1.2`, and
publishes it to npm, unless that version is already there, so that a
release of a version published by hand, or a rerun, publishes nothing.
Release a package first when a package built on it needs a new version of
it, since the range starts at the version in the workspace.

npm sets up trusted publishing only for a package that exists, so the
first version of a new package is published by hand, before its GitHub
release. Publish the tarball that `pnpm pack` writes, never the package
folder with `npm publish`, which keeps `workspace:^` and publishes a
version that no package manager can install.

## Rules

### General

**Ask before making an open decision.** When a choice would be costly to
change later (a public API, a dependency, the build or release process),
propose an option, explain why you recommend it, and wait for approval
before proceeding.

**Treat the public API as a contract.** Everything exported from each
package's `src/index.ts`, including types, follows semantic versioning,
and each package has its own version. Do not rename, remove, or change the
behavior of an export without a major version. Keep internals out of
`src/index.ts`; export a type only when users need to name it.
`@lynstack/class-recipe` and `@lynstack/native-recipe` use only the public
API of `@lynstack/recipe`; when they need more, extend that API instead of
reaching into its internals.

**Document every public export with TSDoc.** Describe what it does, its
parameters (`@param`), its type parameters (`@typeParam`), and its return
value (`@returns`), with an `@example` for each function. Keep the docs
and the TSDoc in agreement, and check that every example produces the
output it shows.

**Keep the docs, the READMEs, the TSDoc, and the skills in agreement.** The
docs of each package describe the same API as its TSDoc, the docs of
`@lynstack/class-recipe` and of `@lynstack/native-recipe` give the same
advice as their skills, and each
README agrees with the docs it links to. When a change affects what one
of them says, update the others in the same commit, and check that every
example in the docs, the READMEs, and the skills produces the output it
shows. Never write by hand in the docs what a recipe returns: show the
call with `RecipeExample`. Never write a measured number by hand: the
docs read every number from `docs/src/measurements/<package>.json`, which
only `pnpm measure` writes.

**Add no other runtime dependencies.** `@lynstack/recipe` ships with
none, and `@lynstack/class-recipe` and `@lynstack/native-recipe` depend
only on `@lynstack/recipe`, through a range, as the rule on pinning
dependencies describes. `@lynstack/native-recipe` also has React Native
as a peer dependency, for its types only. A
development dependency is added only when its value clearly outweighs its
cost.

**Ship ES modules only.** Do not add a CommonJS build. Write relative
imports with the `.js` extension, as `module: nodenext` requires.

**Test behavior and types.** Every behavior has a runtime test, and every
public type has a type test (`expectTypeOf`, or `@ts-expect-error` for
input that must be rejected). A test that only exercises the types still
asserts the runtime outcome.

**Performance comes first.** A recipe and a slot recipe of any kind, a
class name recipe and slot recipe, and a style recipe and slot style
recipe must be faster with the cache than without it. The benchmarks
assert this; never merge a change that makes them fail. Back
every optimization with a benchmark showing that it matters, and keep the
hot paths (`cx`, and a cached call of a recipe) free of allocations. A
difference of a few percent is within the noise of one run; to compare
two versions, run the benchmarks of each several times, alternating
between them, and compare the medians.

**Benchmark soundly.** Check that the code returns the expected values
before timing it, rotate between several inputs in each iteration, and
measure only the library's work.

**Pin dependencies to exact versions.** Do not use version ranges, except
between the packages of this workspace: a package that depends on another
does so through `workspace:^`, which publishing turns into a range from
the version in the workspace, such as `^1.1.2`. An app that installs
several of them then shares one copy of each, and a fix to one reaches
the users of the packages built on it without a release of theirs. Pin
GitHub Actions to a commit SHA, with the version in a comment.

**Use the latest stable release.** Add languages, runtimes, tools, and
dependencies at their latest stable version, never a pre-release (alpha,
beta, RC, or nightly). If a project publishes long-term support (LTS)
releases, use its latest LTS release. Look up the current version when you
add it; do not rely on memory.

**Use only current, recommended practices.** Do not use any feature, API,
library, option, or pattern that its maintainers have deprecated, marked as
legacy, or discouraged, even if it still works. Check the official
documentation for the currently recommended approach before relying on
something. When a dependency deprecates something the project uses,
migrate away from it; do not suppress the warning.

**Comment only when truly necessary.** Code that explains itself needs no
comment. If code needs a comment to be understood, first rewrite it to be
clearer (better names, smaller functions); a comment is never an excuse for
hard-to-read code. When a comment is needed, keep it short and describe the
code as it is now, never its history or earlier versions. TSDoc on public
exports is documentation, not a comment, and is always required.

**Language.** Write code, comments, commit messages, and documentation in
American English.

**Commits.** Use Conventional Commits (`feat:`, `fix:`, `refactor:`,
`docs:`, `test:`, `build:`, `ci:`, `perf:`, `chore:`), with one logical
change per commit. Mark a breaking change with `!` and a
`BREAKING CHANGE:` footer.

**When blocked, stop and report.** Do not disable a check, weaken a test, or
add an exception to get past an obstacle.
