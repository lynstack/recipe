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
 * The type of `compoundVariants`: the compound variants as written,
 * intersected with `Checked`. While an editor completes them, TypeScript has
 * not inferred them and takes `readonly []`, whose intersection would make
 * every element `never`; then it is `Unchecked`.
 */
type WrittenCompounds<Compounds, Checked, Unchecked> = [Compounds] extends [
  readonly [],
]
  ? Unchecked
  : Compounds & Checked;

export type { WrittenCompounds, WrittenDefaults };
