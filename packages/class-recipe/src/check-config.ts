type UncheckedRecord = Readonly<Record<string, unknown>>;

/** Checks the classes of a value, and names it in a message with `describe`. */
type CheckClasses = (value: unknown, describe: () => string) => void;

const slotExample = 'such as `{ root: "p-4" }`';

function isRecord(value: unknown): value is UncheckedRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Checks the classes of a recipe: a string. */
const elementClasses: CheckClasses = (value, describe) => {
  if (typeof value !== "string") {
    throw new TypeError(`${describe()} needs a string of classes.`);
  }
};

/** Checks the classes of a slot recipe: a string or nothing for each slot. */
const slotClasses: CheckClasses = (value, describe) => {
  const isSlotClasses =
    isRecord(value) &&
    Object.values(value).every(
      (classes) => classes === undefined || typeof classes === "string",
    );
  if (!isSlotClasses) {
    throw new TypeError(
      `${describe()} needs the classes of each slot, ${slotExample}.`,
    );
  }
};

function checkVariants(variants: unknown, checkClasses: CheckClasses): void {
  if (!isRecord(variants)) {
    throw new TypeError(
      "A recipe's config needs `variants`, an object of the options of each variant. Use `variants: {}` for a recipe without variants.",
    );
  }
  for (const [name, options] of Object.entries(variants)) {
    if (!isRecord(options)) {
      throw new TypeError(
        `The variant "${name}" needs an object of its options.`,
      );
    }
    for (const [option, classes] of Object.entries(options)) {
      checkClasses(
        classes,
        () => `The option "${option}" of the variant "${name}"`,
      );
    }
  }
}

/**
 * The hint to rename `class`, `className`, or `classNames` to `property`,
 * when a compound variant that needs `property` gives its classes under
 * another of those names.
 */
function renameHint(compound: UncheckedRecord, property: string): string {
  const misnamed = ["class", "className", "classNames"].find(
    (name) => name !== property && Object.hasOwn(compound, name),
  );
  return misnamed === undefined
    ? ""
    : ` Rename \`${misnamed}\` to \`${property}\`.`;
}

function checkCompoundVariants(
  compoundVariants: unknown,
  property: string,
  checkClasses: CheckClasses,
): void {
  if (!Array.isArray(compoundVariants)) {
    throw new TypeError(
      "`compoundVariants` needs an array of compound variants.",
    );
  }
  for (const [index, compound] of compoundVariants.entries()) {
    const fields = isRecord(compound) ? compound : {};
    const { [property]: classes } = fields;
    const describe = (): string =>
      `The \`${property}\` of compound variant ${String(index)}`;
    if (classes === undefined) {
      throw new TypeError(
        `Compound variant ${String(index)} needs \`${property}\`, the classes it adds.${renameHint(fields, property)}`,
      );
    }
    checkClasses(classes, describe);
  }
}

function checkConfig(
  config: unknown,
  property: string,
  checkClasses: CheckClasses,
): void {
  if (!isRecord(config)) {
    throw new TypeError("A recipe needs a config object.");
  }
  const { base, variants, compoundVariants = [] } = config;
  if (base !== undefined) {
    checkClasses(base, () => "`base`");
  }
  checkVariants(variants, checkClasses);
  checkCompoundVariants(compoundVariants, property, checkClasses);
}

/**
 * Checks the classes of a recipe's config, which its types already check,
 * so that a config from untyped code, such as one written for another
 * library, fails when the recipe is created, with a message that names
 * what is wrong.
 *
 * @throws {TypeError} When a part of the config has the wrong shape.
 */
function checkRecipeConfig(config: unknown): void {
  checkConfig(config, "className", elementClasses);
}

/**
 * Checks the classes of a slot recipe's config, as
 * {@link checkRecipeConfig} does for a recipe.
 *
 * @throws {TypeError} When a part of the config has the wrong shape.
 */
function checkSlotRecipeConfig(config: unknown): void {
  checkConfig(config, "classNames", slotClasses);
}

export { checkRecipeConfig, checkSlotRecipeConfig };
