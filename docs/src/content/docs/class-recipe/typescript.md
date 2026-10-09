---
title: class-recipe with TypeScript
description: "How recipes infer their props from a config, which variants are required, typing component props with VariantsOf, typing variants from a CMS or an API, and the prop names class-recipe reserves."
sidebar:
  label: TypeScript
---

A recipe infers the props it accepts from its config:

- An option that a variant does not declare is a type error.
- A variant without a default is required; a variant with a default, or a
  boolean variant, is optional.
- A boolean variant accepts `true`, `false`, `"true"`, and `"false"`, and
  an option whose name is a number accepts the number and the string.
- A compound variant or a default that names an undeclared variant or
  option is a type error, and so is a slot that `slots` does not name.

```ts
import { cva } from "@lynstack/class-recipe";

const button = cva({
  variants: {
    tone: { neutral: "bg-gray-100", danger: "bg-red-600 text-white" },
    size: { sm: "h-8 px-3", md: "h-10 px-4" },
  },
  defaultVariants: { size: "md" },
});

button({ tone: "danger" });

// @ts-expect-error: tone has no default, so it is required.
button({ size: "sm" });
```

A library that exports its recipes, or sets `isolatedDeclarations`,
also needs [Exporting and wrapping recipes](/recipe/class-recipe/exporting-recipes/).

## A config declared before the call

A config written inline is inferred as it is. Declare a config before the
call `as const`, so that the options named in its compound and default
variants stay literal types. The same holds for the `slots` of `sva`: a
list declared without `as const` is a `string[]`, so the slot recipe
takes any slot name, and a misspelled slot in `base`, in the variants, in
`classNames`, or in the result is not a type error.

TypeScript also checks a declared config less than one written in the
call, since it reports a name that a type does not declare only in an
object written where that type is expected. In a declared config, a
misspelled name next to a correct one is not a type error in these
places:

- the variants that a compound variant names;
- the slots of `base`;
- the slots of a compound variant's `classNames`.

The recipe warns about such a name when it is created, and adds no
classes for it; see
[Names the config does not declare](/recipe/class-recipe/cva/#names-the-config-does-not-declare).
Write the config in the call when nothing needs it declared, so that
TypeScript reports these names as you type.

## Typing component props

`VariantsOf` returns the variants a recipe or slot recipe accepts, without
`className` or `classNames`:

```ts
import type { VariantsOf } from "@lynstack/class-recipe";

type ButtonVariants = VariantsOf<typeof button>;
// => { readonly tone: "neutral" | "danger";
//      readonly size?: "sm" | "md" | undefined }
```

See [Building components](/recipe/class-recipe/building-components/) for
using it in a component.

## Props that include `className`

`VariantsOf` leaves out `className` and `classNames`. To type everything a
recipe accepts, overrides included, use `PropsOf`:

```ts
import type { PropsOf } from "@lynstack/class-recipe";

type ButtonProps = PropsOf<typeof button>;
// => { readonly tone: "neutral" | "danger";
//      readonly size?: "sm" | "md" | undefined;
//      readonly className?: string | undefined }
```

For a slot recipe, `PropsOf` includes `classNames` instead, typed with
[`SlotClasses`](/recipe/class-recipe/exports/#types-for-components).

### `RecipeProps` takes a config, not a recipe

The package exports `RecipeProps` and `SlotRecipeProps`, but they build
the props from the parts of a config, not from a recipe.
`RecipeProps<Variants, DefaultedName>` takes two type arguments: the type
of the config's `variants`, and the names of the variants that have a
default. So `RecipeProps<typeof button>` is an error:

```ts
type Props = RecipeProps<typeof button>;
// Error: Generic type 'RecipeProps' requires 2 type argument(s).
```

`SlotRecipeProps<Slot, Variants, DefaultedName>` takes the slot names
first. Use them only in code that builds on configs, such as a function
that creates recipes. For a recipe, use `PropsOf` or `VariantsOf` as
above.

## Reserved names

`className` and `classNames` are the names of the overrides, so they
cannot be variant names: a config that declares either is a type error.

## Variants from a CMS or an API

When the classes of a recipe come from outside the code, such as a CMS or
a theme file, type the data with the names of its variants and options.
The recipe then checks every call as above. Write the type with `type`,
not `interface`. An interface has no index signature, so it does not
satisfy the type of `variants`, and TypeScript reports
"Index signature for type 'string' is missing in type …":

```ts
import { sva } from "@lynstack/class-recipe";
import type { SlotClasses } from "@lynstack/class-recipe";

type CardClasses = SlotClasses<"root" | "title">;

type CardTheme = {
  readonly size: Readonly<Record<"sm" | "md", CardClasses>>;
  readonly tone: Readonly<Record<"neutral" | "danger", CardClasses>>;
};

const theme: CardTheme = await fetchCardTheme();

const card = sva({
  slots: ["root", "title"],
  variants: theme,
  defaultVariants: { size: "md", tone: "neutral" },
});

card({ size: "sm" });

// @ts-expect-error: "lg" is not a size.
card({ size: "lg" });
```

If the data is not checked where it arrives, parse it with a schema
library whose result has these types, so that a CMS that renames an
option fails there instead of adding no classes.

## Variant names not known in advance

When the names cannot be known, as in a function that passes on a config
it received, type the variants as `RecipeVariants` or
`SlotRecipeVariants`. A recipe then accepts any variant name, with its
option named by a string, and `classNames` for the declared slots:

```ts
import { sva } from "@lynstack/class-recipe";
import type { SlotRecipeVariants } from "@lynstack/class-recipe";

function createCard(variants: SlotRecipeVariants) {
  return sva({ slots: ["root", "title"], variants });
}

const card = createCard(theme);

card({ size: "sm", classNames: { title: "font-bold" } });

// @ts-expect-error: an option is named by a string.
card({ size: 1 });
```

Such a recipe checks less:

- Every variant is optional, and an undeclared variant or option is not a
  type error. It adds no classes.
- A slot recipe also accepts classes by slot as an option, such as
  `size: { root: "p-2" }`, because TypeScript cannot leave `classNames`
  out of the names that variants may take. Such a value names no option,
  so the variant uses its default, if it has one.
- `VariantsOf` returns `Readonly<Record<string, string | undefined>>`.

## A function generic over a config

A function of yours that takes a config and returns its recipe is typed
in
[Exporting and wrapping recipes](/recipe/class-recipe/exporting-recipes/#a-function-generic-over-a-config).

## A function that takes any recipe

A function that takes any recipe, such as one that lists the options of
each variant for a story, cannot take it as a recipe of any selection:
that type can be called without variants, which a recipe with a required
variant cannot, so TypeScript rejects such a recipe. Type it as a function
of `never`, which the function does not call, with the properties it
reads:

```ts
import type {
  Recipe,
  RecipeProps,
  RecipeVariants,
} from "@lynstack/class-recipe";

type AnyRecipe = ((props: never) => string) &
  Pick<
    Recipe<RecipeProps<RecipeVariants, never>>,
    "variantKeys" | "variantOptions" | "defaultVariants"
  >;
```

For a slot recipe, use `(props: never) => Readonly<Record<string, string>>`
with the same properties of
`SlotRecipe<string, SlotRecipeProps<string, SlotRecipeVariants, never>>`.
A function that calls the recipe is generic over it instead, so that it
keeps the recipe's own props.

## Chains of composed recipes

Before TypeScript 5.9, the work of checking a chain of recipes, each of
which composes the one before, grows exponentially with its length,
about twofold with each recipe. A chain of about fourteen recipes
compiled in the same project fails with "Type instantiation is
excessively deep and possibly infinite", and a shorter one already slows
the editor down. TypeScript 5.9 and newer check the same chain in time
that grows linearly.

With an older TypeScript:

- List the recipes in one `composes` rather than chaining them: a recipe
  that composes ten recipes costs about what each of them costs.
- A recipe imported from a package, through its emitted declarations,
  counts as one recipe, however many recipes it composes.
- Or upgrade to TypeScript 5.9 or newer.

## Other types

The package exports the types of every config, props object, and recipe,
such as `RecipeConfig` and `SlotRecipeProps`, for code that builds on
them; see [Exports](/recipe/class-recipe/exports/). For a library of
recipes of other values, build on the types of
[`@lynstack/recipe`](/recipe/recipe/typescript/).

## Next steps

- [Building components](/recipe/class-recipe/building-components/) uses
  these types in components.
- [Exporting and wrapping recipes](/recipe/class-recipe/exporting-recipes/)
  annotates exported recipes with `RecipeOf` and `SlotRecipeOf`, for
  `isolatedDeclarations`, and types a function that creates recipes.
- [All exports](/recipe/class-recipe/exports/) lists every type.
- [FAQ](/recipe/class-recipe/faq/) answers common type errors.
