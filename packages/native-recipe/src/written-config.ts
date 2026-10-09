import type { DefaultVariants, VariantOption } from "@lynstack/recipe";

/**
 * The type of `defaultVariants`: the defaults as written, checked. While an
 * editor completes them, TypeScript has not yet inferred their names and
 * takes `never`, which would allow no name, so the type then takes an
 * optional default for each variant.
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
 * intersected with `Checked`. While an editor completes them, TypeScript
 * may not have inferred them yet and takes `readonly []`, whose
 * intersection would make every element `never`; the type is then a list of
 * `Unchecked`. In a config that a function returns, TypeScript infers them
 * from the element being written, whose properties complete only through
 * the intersection with `Checked`.
 */
type WrittenCompounds<Compounds, Checked, Unchecked> = [Compounds] extends [
  readonly [],
]
  ? readonly Unchecked[]
  : Compounds & { readonly [Index in keyof Compounds]: Checked };

export type { WrittenCompounds, WrittenDefaults };
