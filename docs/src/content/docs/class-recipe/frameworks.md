---
title: class-recipe with frameworks and SSR
description: "Use class-recipe in React Server Components and Next.js, Vue, Svelte, Solid, and Astro: where to create recipes, why their cache is safe on a server, and how to pass the class name."
sidebar:
  label: Frameworks and SSR
---

A recipe is a plain function that returns a string, or an object of
strings for a slot recipe. It does not depend on React, on the DOM, or on
any framework, so it works wherever you can set a class.

The examples on this page use this recipe, created once in its own
module:

```ts
// src/button.ts
import { cva } from "@lynstack/class-recipe";

export const button = cva({
  base: "inline-flex items-center rounded-md font-medium",
  variants: {
    tone: {
      neutral: "bg-gray-100 text-gray-900",
      danger: "bg-red-600 text-white",
    },
    size: { sm: "h-8 px-3 text-sm", md: "h-10 px-4" },
  },
  defaultVariants: { size: "md" },
});
```

## Server rendering and React Server Components

Create recipes at the top level of a module, never inside a component or
a request handler. Then each recipe is created once per server process,
and its cache lasts.

Sharing one recipe across requests is safe:

- A recipe is pure. The same variants always give the same class name.
- The cache stores only the class names of declared selections, keyed by
  their options. It never stores `className`, `classNames`, or any other
  prop, so one request never sees another request's data.
- A slot recipe returns a frozen object, so no request can change the
  cached result.

A component that only calls a recipe needs no `"use client"` directive. In
Next.js, a Server Component and a Client Component can import the same
recipe:

```tsx
// app/components/button.tsx
import type { ComponentProps } from "react";
import type { VariantsOf } from "@lynstack/class-recipe";

import { button } from "@/button";

type ButtonProps = ComponentProps<"button"> & VariantsOf<typeof button>;

export function Button({ tone, size, className, ...props }: ButtonProps) {
  return <button className={button({ tone, size, className })} {...props} />;
}
```

The cache grows with each new combination of options, up to one entry for
each combination that the config declares. If the variants of a recipe
come from requests, such as query parameters, and the recipe declares
many combinations, turn its cache off (see
[Variants from untrusted input](/recipe/class-recipe/how-it-works/#variants-from-untrusted-input)).

## Vue

Pass the class name to `:class`:

```vue
<script setup lang="ts">
import { button } from "../button";

const props = defineProps<{
  tone: "neutral" | "danger";
  size?: "sm" | "md";
}>();
</script>

<template>
  <button :class="button({ tone: props.tone, size: props.size })">
    <slot />
  </button>
</template>
```

Vue reads the props in the template on each render, so the class name
follows them.

## Svelte

Pass the class name to `class`. In Svelte 5, read the variants from
`$props()`:

```svelte
<script lang="ts">
  import type { Snippet } from "svelte";
  import type { VariantsOf } from "@lynstack/class-recipe";
  import { button } from "../button";

  let {
    tone,
    size,
    children,
  }: VariantsOf<typeof button> & { children?: Snippet } = $props();
</script>

<button class={button({ tone, size })}>
  {@render children?.()}
</button>
```

## Solid

Pass the class name to `class`. Read the props as `props.tone`, without
destructuring them, so that Solid tracks them:

```tsx
import type { VariantsOf } from "@lynstack/class-recipe";
import type { ParentProps } from "solid-js";

import { button } from "../button";

export function Button(props: ParentProps<VariantsOf<typeof button>>) {
  return (
    <button class={button({ tone: props.tone, size: props.size })}>
      {props.children}
    </button>
  );
}
```

## Astro

Pass the class name to `class`, and type the component's props with
`VariantsOf`:

```astro
---
import type { VariantsOf } from "@lynstack/class-recipe";
import { button } from "../button";

type Props = VariantsOf<typeof button>;

const { tone, size } = Astro.props;
---

<button class={button({ tone, size })}>
  <slot />
</button>
```

## Next steps

- [Building components](/recipe/class-recipe/building-components/) shows
  more patterns for component props.
- [How it works](/recipe/class-recipe/how-it-works/) explains the cache.
- [FAQ](/recipe/class-recipe/faq/) answers common questions.
