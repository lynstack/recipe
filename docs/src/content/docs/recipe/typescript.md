---
title: recipe with TypeScript
description: "How recipes infer their selection and result from a kind and a config, which variants are required, typing props with VariantsOf, and types for library authors."
sidebar:
  label: TypeScript
---

A recipe's types come from two places: the kind sets the type of its
values and its result, and the config sets the variants a selection
accepts.

## Types from the kind

`createRecipeKind` infers a kind's `Value` from the `value` parameter of
`reduce` or the `base` parameter of `initial`, and its result from
`finish`, or from `initial` without it (see
[Recipe kinds](/recipe/recipe/recipe-kinds/#types)). Every config of the
kind is checked against `Value`:

```ts
const text = styleRecipe({
  variants: {
    // @ts-expect-error: a style is an object, not a string.
    size: { sm: "small" },
  },
});
```

## Types from the config

A recipe infers its selection from its config:

- An option that a variant does not declare is a type error.
- A variant without a default is required; a variant with a default, or a
  boolean variant, is optional.
- A boolean variant accepts `true`, `false`, `"true"`, and `"false"`, and
  an option whose name is a number, written without quotes, accepts the
  number and the string.
- A compound variant or a default that names an undeclared variant or
  option is a type error.

```ts
const button = styleRecipe({
  variants: {
    tone: { primary: { color: "white" }, neutral: { color: "black" } },
    size: { sm: { height: 32 }, lg: { height: 48 } },
  },
  defaultVariants: { size: "sm" },
});

button({ tone: "primary" });

// @ts-expect-error: tone has no default, so it is required.
button({ size: "lg" });
```

## A config declared before the call

A config written inline is inferred as it is. Declare a config written
before the call `as const`, so that the options its compound and default
variants name stay literal types. The same goes for a slot recipe's
`slots`: without `as const`, the list is a `string[]`, so the slot recipe
takes any slot name, and a misspelled slot in `base`, in the variants, or
in the result is not a type error.

TypeScript also checks a declared config less strictly: it reports an
unknown name only in an object literal written where its type is
expected. So in a declared config, a misspelled name next to a correct one
is not a type error in these places:

- the variants that a compound variant names;
- the slots of `base`;
- the slots of a compound variant's value.

The recipe warns about such a name when it is created, and leaves it
out; see
[Names that a config does not declare](/recipe/recipe/api/#names-that-a-config-does-not-declare).
Write the config in the call when nothing needs it declared, so that
TypeScript reports these names as you type.

## Composed recipes

A recipe that composes others infers its selection from every config, and
its compound and default variants can name the variants of the recipes it
composes. Composing a recipe whose values have another type, or a slot
recipe in a recipe, is a type error (see
[Composing recipes](/recipe/recipe/composing/#types)).

Before TypeScript 5.9, the work of checking a chain of recipes, each of
which composes the one before, grows exponentially with its length: at
least twofold with each recipe. A long chain compiled in one project
fails with "Type instantiation is excessively deep and possibly
infinite". TypeScript 5.9 and newer check the same chain in time that
grows linearly.

The cost grows faster than twofold when the type of a recipe's result
keeps the types of the recipes it composes, as a style object that lists
the properties of each does. Two things do not lengthen a chain:

- A recipe that lists several recipes in one `composes`. Its cost grows
  linearly: a recipe that composes ten recipes costs about as much as the
  ten recipes.
- A recipe imported through emitted declarations, which counts as one
  recipe, however many recipes it composes.

Check the chains your library expects with the oldest TypeScript it
supports.

## Typing component props

`VariantsOf` returns the variants a recipe accepts. Use it to type the
props of a component built on a recipe:

```ts
import type { VariantsOf } from "@lynstack/recipe";

type ButtonVariants = VariantsOf<typeof button>;
// => { readonly tone: "primary" | "neutral";
//      readonly size?: "sm" | "lg" | undefined }
```

`VariantKey` names the variants of a selection as strings, as a recipe's
`variantKeys` lists them: `VariantKey<ButtonVariants>` is
`"tone" | "size"`.

A recipe's `variantOptions` and `defaultVariants` are typed with the names
of the options of each variant, as strings:

```ts
type ButtonOptions = (typeof button)["variantOptions"];
// => { readonly tone: readonly ("primary" | "neutral")[];
//      readonly size: readonly ("sm" | "lg")[] }

type ButtonDefaults = (typeof button)["defaultVariants"];
// => { readonly size: "sm" | "lg" }
```

When the variant names are not known, they are
`Readonly<Record<string, readonly string[]>>` and
`Readonly<Record<string, string>>`.

## Variant names not known in advance

When the variant names of a config are not known at compile time, as in a
function that passes on a config it received, a recipe accepts any
selection, compound condition, and default variants:

```ts
import type { KindVariants } from "@lynstack/recipe";

function createBox(variants: KindVariants<Style>) {
  return styleRecipe({ variants });
}

// Not a type error: the selection may name any variant.
createBox({ size: { sm: { padding: 4 } } })({ size: "sm", other: 1 });
```

## A function generic over a config

A library's own helper can take any config and return its recipe. Type
its variants and default names as `const` type parameters, and its result
as a `KindRecipe` of their `KindSelection`, which is any selection when
the variant names are not literal types:

```ts
import type {
  KindRecipe,
  KindRecipeConfig,
  KindSelection,
  KindVariants,
} from "@lynstack/recipe";

function defineStyle<
  const Variants extends KindVariants<Style>,
  const DefaultedName extends keyof Variants = never,
>(
  config: KindRecipeConfig<Style, Variants, DefaultedName>,
): KindRecipe<KindSelection<Variants, DefaultedName>, Style> {
  return styleRecipe(config);
}
```

A slot recipe's helper does the same with `KindSlotRecipeConfig`, and
returns a `KindRecipe` whose result is `Readonly<Record<Slot, Style>>`.

A helper whose configs compose recipes takes the recipes as a third type
parameter, and returns the type of `styleRecipe` for its type
parameters, which has the variants and defaults of the recipes it
composes:

```ts
import type {
  ComposableKindRecipe,
  ComposedVariants,
  KindRecipeConfig,
  KindVariants,
} from "@lynstack/recipe";

function defineComposedStyle<
  const Variants extends KindVariants<Style>,
  const DefaultedName extends keyof ComposedVariants<Composed, Variants> =
    never,
  const Composed extends readonly ComposableKindRecipe<Style>[] = readonly [],
>(
  config: KindRecipeConfig<Style, Variants, DefaultedName, Composed>,
): ReturnType<typeof styleRecipe<Variants, DefaultedName, Composed>> {
  return styleRecipe(config);
}
```

A slot recipe's helper does the same with `KindSlotRecipeConfig` and
`ComposableKindSlotRecipe<Style>`.

## A function that takes any recipe

A function that takes any recipe, such as one that lists the options of
each variant for a story, cannot type its parameter as a recipe of any
selection. That type can be called without variants, and a recipe with a
required variant cannot, so TypeScript rejects the recipe. Type the
parameter instead as a function of `never`, which your function does not
call, with the properties it reads:

```ts
import type { KindRecipe, KindSelection, KindVariants } from "@lynstack/recipe";

type AnyStyleRecipe = ((props: never) => Style) &
  Pick<
    KindRecipe<KindSelection<KindVariants<Style>, never>, Style>,
    "variantKeys" | "variantOptions" | "defaultVariants"
  >;

function listOptions(recipe: AnyStyleRecipe): readonly string[] {
  return recipe.variantKeys.flatMap((key) => recipe.variantOptions[key] ?? []);
}
```

For a slot recipe, pick the same properties from
`KindRecipe<KindSelection<KindSlotVariants<Style>, never>, Readonly<Record<string, Style>>>`,
and intersect them with
`(props: never) => Readonly<Record<string, Style>>`. A function that calls
the recipe should be generic over it instead, so that it keeps the
recipe's own selection.

## Exporting recipes with `isolatedDeclarations`

With `"isolatedDeclarations": true`, TypeScript requires that the
declarations of each file can be written from that file alone, as oxc and
the tools built on it, such as tsdown, write them. They cannot know what
a call returns, so each recipe that a module exports needs a type
annotation; without one, TypeScript reports TS9010.

`KindRecipeOf` and `KindSlotRecipeOf` give that type from the type of
the config. Declare the config `as const`, which isolated declarations
can read, and annotate the recipe with the value and result of the kind
and `typeof` the config:

```ts
import type { KindRecipeOf } from "@lynstack/recipe";

const textConfig = {
  variants: { size: { sm: { fontSize: 12 }, md: { fontSize: 16 } } },
  defaultVariants: { size: "md" },
} as const;

export const text: KindRecipeOf<Style, Style, typeof textConfig> =
  styleRecipe(textConfig);
```

A recipe that composes others spreads its config into the call with
`composes`, and lists the types of the recipes it composes as the last
type parameter, since isolated declarations cannot read a recipe inside
a config:

```ts
const headingConfig = {
  variants: { size: { xl: { fontSize: 32 } } },
} as const;

export const heading: KindRecipeOf<
  Style,
  Style,
  typeof headingConfig,
  readonly [typeof text]
> = styleRecipe({ ...headingConfig, composes: [text] });
```

`KindRecipeOf` rejects a config that lists `composes`, so that the type
cannot leave out the recipes it composes. `KindSlotRecipeOf` does the
same for a slot recipe of `createSlotRecipeKind`. A library that wraps the engine's recipes in its
own type defines its own such type, as `RecipeOf` of
`@lynstack/class-recipe` does.

Both types are for a config whose type is known where the recipe is
declared. They do not apply in a function generic over the whole config,
such as one that takes `config: Config` and returns
`KindRecipeOf<Style, Style, Config>`: `styleRecipe` infers the variants
from its config, and TypeScript cannot infer them from a config whose
type is a type parameter, so the recipe it returns does not have that
type. Make such a function generic over the variants instead, as
[A function generic over a config](#a-function-generic-over-a-config)
shows.

## Types for library authors

A library with its own config shape builds its types on the engine's, as
[Building a library](/recipe/recipe/building-a-library/#type-the-librarys-config)
shows:

| Type                | Use it for                                                                           |
| ------------------- | ------------------------------------------------------------------------------------ |
| `KindVariants`      | The `variants` of a config, to constrain the variants a function infers.             |
| `VariantSelection`  | The selection a recipe accepts, from the variants and the names that have a default. |
| `KindSelection`     | The selection a recipe accepts, or any selection when the variant names are unknown. |
| `KindRecipeOf`      | The type of the recipe of a config, to annotate an exported recipe.                  |
| `KindSlotRecipeOf`  | The type of the slot recipe of a config, to annotate an exported slot recipe.        |
| `DefaultVariants`   | The `defaultVariants` of a config.                                                   |
| `CompoundCondition` | The `variants` of a compound variant.                                                |
| `VariantOption`     | The values one variant accepts.                                                      |
| `RecipeFunction`    | A function whose argument is optional when every variant is.                         |
| `VariantKey`        | The names in `variantKeys`.                                                          |
| `VariantsOf`        | The variants a recipe accepts, which a library can define its own version of.        |
| `ComposedVariants`  | The variants of a config together with those of the recipes it composes.             |
| `Composable`        | The type of a library's recipe, marked so that other recipes can compose it.         |

A library can define its own `VariantsOf` to leave out the props its
recipes take besides their variants, as `@lynstack/class-recipe` leaves
out `className`. Slot recipes have their own config types,
`KindSlotRecipeConfig` and `KindSlotVariants`; see
the [API reference](/recipe/recipe/api/) for the full list.

## Next steps

- [Building a library](/recipe/recipe/building-a-library/#type-the-librarys-config)
  types a library's own config with these types.
- [Making library recipes composable](/recipe/recipe/composable-libraries/)
  types the recipes that other recipes compose.
- [API reference](/recipe/recipe/api/) gives the signature of each
  export.
