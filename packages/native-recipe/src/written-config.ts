import type { DefaultVariants, VariantOption } from "@lynstack/recipe";

/**
 * The type of `defaultVariants`: the defaults as written, checked. While an
 * editor completes them, TypeScript has not inferred their names and takes
 * `never`, which would allow no name; then it is a default for any variant.
 */
type WrittenDefaults<Variants, DefaultedName extends keyof Variants> = [
  DefaultedName,
] extends [never]
  ? {
      readonly [Name in keyof Variants]?: VariantOption<
        NoInfer<Variants>[Name]
      >;
    }
  : DefaultVariants<Variants, DefaultedName>;

/**
 * The type of `compoundVariants`: the compound variants as written, each
 * intersected with `Checked`. While an editor completes them, TypeScript has
 * either not inferred them and takes `readonly []`, whose intersection would
 * make every element `never`, so that each is `Unchecked`; or, in a config
 * that a function returns, inferred them from the element being written,
 * whose properties complete only through its intersection with `Checked`.
 */
type WrittenCompounds<Compounds, Checked, Unchecked> = [Compounds] extends [
  readonly [],
]
  ? readonly Unchecked[]
  : Compounds & { readonly [Index in keyof Compounds]: Checked };

export type { WrittenCompounds, WrittenDefaults };
