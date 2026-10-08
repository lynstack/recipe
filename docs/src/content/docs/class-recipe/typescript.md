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

A config written inline is inferred as it is. Declare a config before the
call `as const`, so that the options named in its compound and default
variants stay literal types.

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

## Other types

The package exports the types of every config, props object, and recipe,
such as `RecipeConfig` and `SlotRecipeProps`, for code that builds on
them; see [Exports](/recipe/class-recipe/exports/). For a library of
recipes of other values, build on the types of
[`@lynstack/recipe`](/recipe/recipe/typescript/).

## Next steps

- [Building components](/recipe/class-recipe/building-components/) uses
  these types in components.
- [Exporting recipes from a library](/recipe/class-recipe/exporting-recipes/)
  annotates exported recipes with `RecipeOf` and `SlotRecipeOf`, for
  `isolatedDeclarations`.
- [All exports](/recipe/class-recipe/exports/) lists every type.
- [FAQ](/recipe/class-recipe/faq/) answers common type errors.
