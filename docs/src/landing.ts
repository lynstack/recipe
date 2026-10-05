import type { PackageIconName } from "./icons.ts";
import type { PackageInfo } from "./packages.ts";
import { packages } from "./packages.ts";
import { speedup } from "./measurements/class-recipe.ts";

/** A package that the landing page lists. */
interface LandingPackage extends Pick<
  PackageInfo,
  "name" | "version" | "label"
> {
  /** What the package does, in one sentence. */
  readonly description: string;
  /** The link to the package's section of the docs. */
  readonly href: string;
  /** The icon of the package, as in its sidebar topic. */
  readonly icon: PackageIconName;
}

/** A section of the landing page. */
interface LandingSectionProps {
  /** The id of the section's heading, which labels the section. */
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly lead?: string;
}

/** A reason to use the packages. */
interface LandingFeature {
  readonly title: string;
  readonly description: string;
  /** A measured number, shown in `mono` before the description. */
  readonly stat?: string;
}

/**
 * The packages, those for a kind of value first, then the engine they are
 * built on.
 */
const landingPackages: readonly LandingPackage[] = [
  {
    description:
      "cva for one element, sva for several, and cx, a drop-in replacement for clsx. Joins with twMerge when you need it.",
    href: "/recipe/class-recipe/",
    icon: "class-recipe",
    ...packages["class-recipe"],
  },
  {
    description:
      "Style recipes and slot style recipes for React Native, built from theme tokens when you need them, which return the same frozen style for the same variants.",
    href: "/recipe/native-recipe/",
    icon: "native-recipe",
    ...packages["native-recipe"],
  },
  {
    description:
      "The engine: define how a kind of value combines, and get recipes and slot recipes that select, cache, and type it.",
    href: "/recipe/recipe/",
    icon: "recipe",
    ...packages.recipe,
  },
];

const landingFeatures: readonly LandingFeature[] = [
  {
    description:
      "the calls per second of class-variance-authority. A recipe compiles its config once and caches each selection, so a call is a lookup.",
    stat: `${speedup}×`,
    title: "Fast",
  },
  {
    description:
      "Variants, options, and slots are inferred from the config. An unknown option is a type error, and a variant without a default is required.",
    title: "Type-safe",
  },
  {
    description:
      "Bring twMerge or any join of your own. It runs once per selection, not on every call.",
    title: "Your join",
  },
  {
    description:
      "Every package shares the variants, the cache, and the types of one engine, so a recipe behaves the same whatever it returns.",
    title: "One engine",
  },
];

export { landingFeatures, landingPackages };
export type { LandingFeature, LandingPackage, LandingSectionProps };
