# recipe

This repository holds three small TypeScript libraries, each a public
package published to npm as an ES module only, and their documentation
site:

- `@lynstack/recipe`, in `packages/recipe`, the engine: it creates recipes
  for values of any type, from a kind that says how to reduce them. It has
  no dependencies.
- `@lynstack/class-recipe`, in `packages/class-recipe`, builds class names
  on that engine (`cx`, `cva`, `sva`).
- `@lynstack/native-recipe`, in `packages/native-recipe`, builds React
  Native style objects on that engine.
- `docs`, the documentation site of the three.

This file holds what they share. Each package and `docs` has its own
`AGENTS.md`, with its API, its modules, and what applies only there; read
it before working in that folder.

## Layout

- The repository is a pnpm workspace with a private root. The root holds
  what the packages share: the tools, `tsconfig.base.json`, the shared
  lint rules in `.oxlintrc.json`, the formatting rules, and the scripts.
  `docs` is a private workspace package.
- Each package in `packages` is self-contained: its own `package.json`
  with its scripts and development dependencies, `tsconfig.json`,
  `tsconfig.build.json` (the sources that tsdown builds),
  `vitest.config.ts`, `tsdown.config.ts`, `.oxlintrc.json`, README,
  CHANGELOG, and LICENSE. A package's `.oxlintrc.json`, and that
  of `docs`, extends the shared one and holds its own rules only.
- Each package has one entry point, `src/index.ts`; every public export
  goes through it. tsdown bundles it into `dist/index.js` and
  `dist/index.d.ts`.
- Tests sit next to the code as `*.test.ts`, and benchmarks as
  `*.bench.ts`. The `*.property.test.ts` tests generate configs and calls
  with fast-check and compare the results with a reference. Arbitraries
  that several property tests share sit in `*.arbitraries.ts`, which the
  build leaves out. A benchmark imports its package by its name, so it
  runs against the built bundle, never against the sources directly.
- `consumers` holds the apps that check the published types: an app of
  each package, `consumers/<package>`, and a library of each package
  that sets `isolatedDeclarations`, `consumers/<package>-isolated`. Each is a
  private workspace package, with its own `package.json`,
  `tsconfig.json`, and `.oxlintrc.json`, that depends on its package and
  on no other package of the workspace, as an app does, and exports what
  it builds with it, so that compiling it with declarations checks the
  published types. In the workspace, pnpm links the package folder, whose
  types TypeScript can always name; `scripts/consumers` installs the
  packed packages in a copy of each app outside the repository, where an
  app can name only the types that its dependencies export. A type of
  `@lynstack/recipe` that the type of a recipe names, such as
  `RecipeComposition`, must therefore be exported by the package too.
- `api` keeps the declarations that show every change to a public type
  in a diff: `api/<package>.d.ts`, the public API of each package, which
  is its `dist/index.d.ts` without comments, and `api/consumers/<app>`,
  the declarations that each app of `consumers` emits when it installs
  the packed packages, which show how the types of the apps' recipes
  print. Only `pnpm api --update` and `pnpm consumers --update` write
  them.
- A package's README is short: what the package does, how to install it,
  one example, and links to the docs. The docs hold everything else.
- A package's `CHANGELOG.md` lists its versions, the newest first, each
  with its date and what changed for its users. It ships in the package.
  When it grows long, move the entries of earlier major versions to a
  file of their own, such as `CHANGELOG-1.x.md`, and link to it.
- `scripts` holds Node.js programs for maintainers, written in TypeScript
  that Node.js runs directly. `scripts/measure` runs the benchmarks of
  each package and saves the raw results, never formatted text, in
  `docs/src/measurements/<package>.json`. It has one module per package,
  which names the benchmarks that package reports. `scripts/consumers`
  compiles the apps of `consumers` with the packed packages, and
  `scripts/api` compares the public API of each package with `api`.
- `examples` holds an example of each package that readers open in the
  browser, from the Open in StackBlitz or Open in Snack link of its
  overview page: `recipe` and `class-recipe` are React apps, built with
  Vite, that StackBlitz opens from the `main` branch, and
  `native-recipe/App.tsx` is the app of an Expo Snack, whose link
  `docs/src/packages.ts` builds. The examples are not in the workspace:
  they install the published packages, at the exact version of their last
  release, with npm.
- `compat` checks the packed packages where the docs say they run.
  `compat/versions.json` holds the oldest Node.js, Bun, Deno, and
  TypeScript that the packages support, and the docs read their
  requirements from it. `smoke.mjs` imports each package and `smoke.cjs`
  requires it. The apps of `consumers` are compiled with the packed
  packages, with the React Native that the apps of
  `@lynstack/native-recipe` list and the oldest that its peer dependency
  allows.
  To support an older or newer minimum, change `versions.json`; never
  write those versions by hand in the docs.
- `.github/workflows` holds a CI and a release workflow for each package,
  named after it, `ci.yml`, which checks what the packages share and the
  docs, `compat.yml`, which runs `compat` on the oldest and the newest of
  each runtime and TypeScript, and `docs.yml`, which builds the docs and
  deploys them to GitHub Pages on every push to `main` that changes them.

## Commands

Run `pnpm check` at the root before every commit. It runs the `check`
script of each package and of the docs, dependencies first, then
checks the public API of each package with `pnpm api`, typechecks and
lints the scripts, and checks formatting. The docs' `check`
typechecks them, lints them, checks their formatting, and builds them. A
package's `check` builds it
(which runs publint and Are the Types Wrong), typechecks it, lints it,
checks its formatting, and runs its tests. The `check` of an app of
`consumers` compiles it and lints it.
`@lynstack/class-recipe` and `@lynstack/native-recipe` need
`@lynstack/recipe` built first.

Run a package's scripts with `pnpm --filter <name> <script>`, such as
`pnpm --filter @lynstack/recipe test`, or from its folder. To check a
package with its apps, run
`pnpm --filter @lynstack/class-recipe --filter "./consumers/class-recipe*" check`.

- `pnpm test` runs the tests of every package.
- `pnpm api` checks that the public API of each built package is the one
  that `api/<package>.d.ts` keeps, and writes how they differ. After a
  change to a public type, run `pnpm api --update` and commit `api` with
  the change.
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
- `pnpm consumers` packs the packages, installs them in a copy of each
  app of `consumers` outside the repository, and compiles it. It also
  checks that the declarations of the recipes of each chain of an app,
  `chain.ts` or a module ending in `-chain.ts`, each of which composes
  the one before, grow linearly with the level of composition, and,
  with the TypeScript and React Native of the repository, that each app
  emits the declarations that `api/consumers/<app>` keeps. A TypeScript
  older than 5.5, which has no `isolatedDeclarations`, compiles an app
  that sets it without it. Pass
  `--typescript <version>` or `--react-native <version>` to compile with
  those, and `--update` to write the declarations of the apps to `api`.
  Run it after a change to a public type, or to the dependencies between
  the packages, and commit `api` with the change; CI runs it on the
  oldest and newest TypeScript and React Native.
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

**Review every change to `api`.** A change to `api` is a change to the
types that users compile with, and its diff is the review of that change.
Read it before you commit, and check that it changes only what the change
means to: a change that adds a feature adds declarations and leaves the
existing ones as they were, or it changes the types of code that does not
use the feature. Never update `api` only to make a check pass.

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

**Test types the way users use them.** A type that works on one inline
call can still fail in a user's project. Check each public type, in a
test or in an app of `consumers`, in each way users reach it:

- inferred from an inline argument, and from a value declared before the
  call;
- passed through a function of the user's that is generic over it, and
  returned from that function;
- exported from one module and used in another, with declarations
  emitted, as an app that installs the packed package compiles it;
- with `isolatedDeclarations`;
- nested or composed several levels deep, where its declarations must
  grow linearly;
- with the oldest and the newest TypeScript that the packages support.

When a feature adds a way to use a type, add that way to every type it
applies to, and to this list.

**Fix a bug everywhere it lives.** The packages and the docs share
patterns: the same type helper, the same check, the same example. When
you fix a bug, find the pattern that caused it, then search every
package, the docs, the skills, and the READMEs for that pattern. Fix
each place in the same change, with a test for each, or say why a place
is not affected. List in the commit body where you looked.

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
