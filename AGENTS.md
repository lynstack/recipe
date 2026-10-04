# recipe

This repository holds two small TypeScript libraries, each a public
package published to npm as an ES module only, and their documentation
site:

- `@lynstack/recipe`, in `packages/recipe`, creates recipes for values
  of any type. It exports `createRecipeKind`, which defines a kind of
  recipe by how it reduces values, such as class names or style objects,
  and returns the function that creates recipes of that kind. It has no
  dependencies.
- `@lynstack/class-recipe`, in `packages/class-recipe`, builds class names
  on that engine.

`@lynstack/class-recipe` exports:

- `cx`, a drop-in replacement for `clsx`.
- `cva` (also exported as `createRecipe`), which maps variants to the class
  name of one element.
- `sva` (also exported as `createSlotRecipe`), which maps variants to the
  class names of several elements (slots).
- `createRecipes`, which returns `cx` and the recipe creators bound to a
  custom join function, such as `twMerge`, or with the cache turned off.

The docs lead with the short names, `cva` and `sva`.

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
  LICENSE, and fixture. A package's `.oxlintrc.json` extends the shared
  one and holds the rules of that package only.
- Each package has one entry point, `src/index.ts`; every public export
  goes through it. tsdown bundles it into `dist/index.js` and
  `dist/index.d.ts`.
- In `@lynstack/recipe`, `recipe-kind.ts` and `types.ts` hold the
  public API and its types. The other modules are internal:
  `variants.ts` compiles variants into numbered options, so a selection
  becomes an integer key; `selector.ts` caches results by that key; and
  `reduce-values.ts` reduces the values of a selection.
- In `@lynstack/class-recipe`, `cx.ts`, `recipe.ts`, `slot-recipe.ts`,
  `create-recipes.ts`, `join.ts`, and `types.ts` hold the public API and
  its types. `types.ts` re-exports the shared types of `@lynstack/recipe`.
  The other modules are internal: `compile-recipe.ts` and
  `compile-slot-recipe.ts` build the recipe functions on recipe kinds of
  `createRecipeKind`, using only the public API of `@lynstack/recipe`;
  `join-classes.ts` joins the classes of a selection; and
  `build-options.ts` holds the join and cache settings of a recipe.
- Tests sit next to the code as `*.test.ts`, and benchmarks as
  `*.bench.ts`. A benchmark imports its package by its name, so it runs
  against the built bundle, never against the sources directly. The
  `*.compare.bench.ts` benchmarks of `@lynstack/class-recipe` measure the
  same work in other libraries (`clsx`, `classnames`,
  `class-variance-authority`, `tailwind-variants`), which are development
  dependencies of that package only; the docs report their results.
- `fixtures/consumer` in each package uses the built package; compiling it
  checks the published declarations.
- `packages/class-recipe/skills/class-recipe/SKILL.md` is an agent skill
  that ships with `@lynstack/class-recipe`. It teaches agents in consuming
  projects to write recipes whose classes never conflict.
- `scripts` holds Node.js programs for maintainers, written in TypeScript
  that Node.js runs directly. `scripts/measure` runs the benchmarks of
  each package and saves the raw results, never formatted text, in
  `docs/src/measurements/<package>.json`. It has one module per package,
  which names the benchmarks that package reports.
- `docs` is the documentation site, built with Astro and Starlight and
  served by GitHub Pages at `https://lynstack.github.io/recipe/`. Each
  package has its own section, in `docs/src/content/docs/<package>`, and
  its own sidebar topic in `docs/astro.config.ts`; the landing page,
  `docs/src/content/docs/index.mdx`, lists the packages. The theme maps
  the lynstack design system onto Starlight in
  `docs/src/styles/lynstack.css`. The docs read the measurements through
  the modules next to them in `docs/src/measurements`, which format them, and show them with the
  components in `docs/src/components`. Keep logic in `.ts` files, which
  are typechecked, and keep `.astro` files to markup.
- A package's README is short: what the package does, how to install it,
  one example, and links to the docs. The docs hold everything else.
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
`@lynstack/class-recipe` needs `@lynstack/recipe` built first.

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
`@lynstack/recipe`, `class-recipe@1.2.0` for `@lynstack/class-recipe`. The
package's release workflow checks that the tag matches the version in its
`package.json`, runs its `check`, packs it with `pnpm pack`, which writes
the exact version of `@lynstack/recipe` into `@lynstack/class-recipe`, and
publishes it to npm. Release `@lynstack/recipe` first when
`@lynstack/class-recipe` needs a new version of it.

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
`@lynstack/class-recipe` uses only the public API of `@lynstack/recipe`;
when it needs more, extend that API instead of reaching into its
internals.

**Document every public export with TSDoc.** Describe what it does, its
parameters (`@param`), its type parameters (`@typeParam`), and its return
value (`@returns`), with an `@example` for each function. Keep the docs
and the TSDoc in agreement, and check that every example produces the
output it shows.

**Keep the docs, the READMEs, the TSDoc, and the skill in agreement.** The
docs of each package describe the same API as its TSDoc, the docs of
`@lynstack/class-recipe` and its skill give the same advice, and each
README agrees with the docs it links to. When a change affects what one
of them says, update the others in the same commit, and check that every
example in the docs, the READMEs, and the skill produces the output it
shows. Never write a measured number by hand: the docs read every number
from `docs/src/measurements/<package>.json`, which only `pnpm measure`
writes.

**Add no other runtime dependencies.** `@lynstack/recipe` ships with
none, and `@lynstack/class-recipe` depends only on `@lynstack/recipe`,
through `workspace:*`, which publishing turns into its exact version. A
development dependency is added only when its value clearly outweighs its
cost.

**Ship ES modules only.** Do not add a CommonJS build. Write relative
imports with the `.js` extension, as `module: nodenext` requires.

**Test behavior and types.** Every behavior has a runtime test, and every
public type has a type test (`expectTypeOf`, or `@ts-expect-error` for
input that must be rejected). A test that only exercises the types still
asserts the runtime outcome.

**Performance comes first.** A recipe of any kind, a class name recipe,
and a slot recipe must be faster with the cache than without it. The
benchmarks assert this; never merge a change that makes them fail. Back
every optimization with a benchmark showing that it matters, and keep the
hot paths (`cx`, and a cached call of a recipe) free of allocations. A
difference of a few percent is within the noise of one run; to compare
two versions, run the benchmarks of each several times, alternating
between them, and compare the medians.

**Benchmark soundly.** Check that the code returns the expected values
before timing it, rotate between several inputs in each iteration, and
measure only the library's work.

**Pin dependencies to exact versions.** Do not use version ranges. Pin
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
