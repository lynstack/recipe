import { badge } from "./recipes/badge.ts";
import { button } from "./recipes/button.ts";
import { card } from "./recipes/card.ts";

/** The option of each variant that a reader chose, as a recipe takes it. */
type Selection = Readonly<Record<string, string | boolean>>;

/** A variant that a reader can choose, with its options. */
interface Control {
  readonly name: string;
  readonly options: readonly string[];
  /** The option chosen at first, or `""` to leave the variant out. */
  readonly initial: string;
}

/** The class name of one slot, or of the one element when `slot` is undefined. */
interface SlotClassName {
  readonly slot: string | undefined;
  readonly className: string;
}

/** A recipe that a reader calls with the variants they choose. */
interface Playground {
  /** The name of the recipe in the code that the docs show. */
  readonly name: string;
  readonly controls: readonly Control[];
  readonly classNamesOf: (selection: Selection) => readonly SlotClassName[];
}

/** The options of each variant of a recipe, which `Props` lists. */
type OptionsOf<Props> = {
  readonly [
    Name in Exclude<
      keyof Props,
      "className" | "classNames"
    > as Name extends string ? Name : never
  ]-?: readonly `${Extract<NonNullable<Props[Name]>, string | number>}`[];
};

/** The variants of `Props` that a selection cannot leave out. */
type RequiredVariant<Props> = Extract<
  {
    [Name in keyof Props]-?: undefined extends Props[Name] ? never : Name;
  }[keyof Props],
  string
>;

/** A recipe, the options a reader can choose, and how to read its result. */
interface PlaygroundConfig<Props, Result> {
  readonly name: string;
  readonly recipe: ((props: Props) => Result) & {
    readonly variantKeys: readonly string[];
  };
  readonly options: OptionsOf<Props>;
  /** The variants without a default, which start at their first option. */
  readonly required: readonly RequiredVariant<Props>[];
  readonly classNamesOf: (result: Result) => readonly SlotClassName[];
}

type Entry = readonly [string, string | boolean];

/** Checks that `selection` chooses only options that `options` lists. */
function isSelectionOf<Props>(
  selection: Selection,
  options: OptionsOf<Props>,
): selection is Selection & Props {
  const optionsByVariant: Readonly<
    Record<string, readonly string[] | undefined>
  > = options;
  return Object.entries(selection).every(
    ([variant, option]: Entry) =>
      optionsByVariant[variant]?.includes(String(option)) === true,
  );
}

function definePlayground<Props, Result>({
  name,
  recipe,
  options,
  required,
  classNamesOf,
}: PlaygroundConfig<Props, Result>): Playground {
  const optionsByVariant: Readonly<
    Record<string, readonly string[] | undefined>
  > = options;
  const requiredVariants: readonly string[] = required;
  const controls = recipe.variantKeys.map((variant) => {
    const variantOptions = optionsByVariant[variant] ?? [];
    return {
      initial: requiredVariants.includes(variant)
        ? (variantOptions[0] ?? "")
        : "",
      name: variant,
      options: variantOptions,
    };
  });
  return {
    classNamesOf: (selection) => {
      if (!isSelectionOf(selection, options)) {
        throw new RangeError(`${name} has no such options`);
      }
      return classNamesOf(recipe(selection));
    },
    controls,
    name,
  };
}

function elementClassName(className: string): readonly SlotClassName[] {
  return [{ className, slot: undefined }];
}

function slotClassNames(
  classNames: Readonly<Record<string, string>>,
): readonly SlotClassName[] {
  return Object.entries(classNames).map(
    ([slot, className]: readonly [string, string]) => ({ className, slot }),
  );
}

/** The playgrounds of the docs, by name. */
const playgrounds = {
  badge: definePlayground({
    classNamesOf: elementClassName,
    name: "badge",
    options: {
      outlined: ["false", "true"],
      tone: ["neutral", "success", "danger"],
    },
    recipe: badge,
    required: ["tone"],
  }),
  button: definePlayground({
    classNamesOf: elementClassName,
    name: "button",
    options: {
      loading: ["false", "true"],
      size: ["sm", "md"],
      tone: ["primary", "neutral"],
    },
    recipe: button,
    required: [],
  }),
  card: definePlayground({
    classNamesOf: slotClassNames,
    name: "card",
    options: { elevated: ["false", "true"], size: ["sm", "md"] },
    recipe: card,
    required: [],
  }),
} as const satisfies Readonly<Record<string, Playground>>;

/** The name of a playground of the docs. */
type PlaygroundName = keyof typeof playgrounds;

/** Returns the options that the controls of `playground` start at. */
function initialSelection(playground: Playground): Selection {
  return Object.fromEntries(
    playground.controls
      .filter((control) => control.initial !== "")
      .map((control) => [control.name, control.initial]),
  );
}

export { initialSelection, playgrounds };
export type { Control, Playground, PlaygroundName, Selection, SlotClassName };
