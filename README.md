# recipe

Fast, type-safe recipes: functions that map a component's variants to its
styles.

| Package                                           | Version                                                                                                             | Size                                                                                                                                         | Description                                                                                                                    |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [`@lynstack/class-recipe`](packages/class-recipe) | [![npm](https://img.shields.io/npm/v/@lynstack/class-recipe)](https://www.npmjs.com/package/@lynstack/class-recipe) | [![Bundle size](https://img.shields.io/bundlephobia/minzip/@lynstack/class-recipe)](https://bundlephobia.com/package/@lynstack/class-recipe) | Class name recipes with variants, compound variants, and slots, plus `cx`, a drop-in replacement for `clsx`.                   |
| [`@lynstack/recipe`](packages/recipe)             | [![npm](https://img.shields.io/npm/v/@lynstack/recipe)](https://www.npmjs.com/package/@lynstack/recipe)             | [![Bundle size](https://img.shields.io/bundlephobia/minzip/@lynstack/recipe)](https://bundlephobia.com/package/@lynstack/recipe)             | Recipes for values of any type, such as styles: define how a kind of recipe combines values, then create recipes of that kind. |

[Documentation](https://lynstack.github.io/recipe/)

## Contributing

The repository is a pnpm workspace and uses Node.js 24 LTS.

```sh
pnpm install
pnpm check # build, package checks, typecheck, lint, format check, tests
pnpm bench # build, then benchmarks
pnpm measure # build, benchmark, and save the results the docs report
pnpm docs:dev # serve the docs locally
```

Each package also runs its own checks, such as
`pnpm --filter @lynstack/recipe check`. Read [AGENTS.md](AGENTS.md) for
the project's rules. Commits follow
[Conventional Commits](https://www.conventionalcommits.org/).

## License

[MIT](LICENSE)
