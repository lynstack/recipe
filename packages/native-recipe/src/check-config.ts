type UncheckedRecord = Readonly<Record<string, unknown>>;

/** Checks the styles of a value, and names it in a message with `describe`. */
type CheckStyles = (value: unknown, describe: () => string) => void;

const slotExample = "such as `{ root: { padding: 16 } }`";

function isRecord(value: unknown): value is UncheckedRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Checks the style of a recipe: a style object. */
const elementStyle: CheckStyles = (value, describe) => {
  if (!isRecord(value)) {
    throw new TypeError(`${describe()} needs a style object.`);
  }
};

/** Checks the styles of a slot recipe: a style or nothing for each slot. */
const slotStyles: CheckStyles = (value, describe) => {
  const isSlotStyles =
    isRecord(value) &&
    Object.values(value).every(
      (style) => style === undefined || isRecord(style),
    );
  if (!isSlotStyles) {
    throw new TypeError(
      `${describe()} needs the style of each slot, ${slotExample}.`,
    );
  }
};

function checkVariants(variants: unknown, checkStyles: CheckStyles): void {
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
    for (const [option, style] of Object.entries(options)) {
      checkStyles(
        style,
        () => `The option "${option}" of the variant "${name}"`,
      );
    }
  }
}

/** Tells a config that names its styles another way how to name them. */
function renameHint(compound: UncheckedRecord, property: string): string {
  const misnamed = ["style", "styles"].find(
    (name) => name !== property && Object.hasOwn(compound, name),
  );
  return misnamed === undefined
    ? ""
    : ` Rename \`${misnamed}\` to \`${property}\`.`;
}

function checkCompoundVariants(
  compoundVariants: unknown,
  property: string,
  checkStyles: CheckStyles,
): void {
  if (!Array.isArray(compoundVariants)) {
    throw new TypeError(
      "`compoundVariants` needs an array of compound variants.",
    );
  }
  for (const [index, compound] of compoundVariants.entries()) {
    const fields = isRecord(compound) ? compound : {};
    const { [property]: styles } = fields;
    if (styles === undefined) {
      throw new TypeError(
        `Compound variant ${String(index)} needs \`${property}\`, the style it adds.${renameHint(fields, property)}`,
      );
    }
    checkStyles(
      styles,
      () => `The \`${property}\` of compound variant ${String(index)}`,
    );
  }
}

function checkConfig(
  config: unknown,
  property: string,
  checkStyles: CheckStyles,
): void {
  if (!isRecord(config)) {
    throw new TypeError("A recipe needs a config object.");
  }
  const { base, variants, compoundVariants = [] } = config;
  if (base !== undefined) {
    checkStyles(base, () => "`base`");
  }
  checkVariants(variants, checkStyles);
  checkCompoundVariants(compoundVariants, property, checkStyles);
}

/**
 * Checks the styles of a style recipe's config, which its types already
 * check, so that a config from untyped code fails when the recipe is
 * created, with a message that names what is wrong.
 *
 * @throws {TypeError} When a part of the config has the wrong shape.
 */
function checkStyleRecipeConfig(config: unknown): void {
  checkConfig(config, "style", elementStyle);
}

/**
 * Checks the styles of a slot style recipe's config, as
 * {@link checkStyleRecipeConfig} does for a style recipe.
 *
 * @throws {TypeError} When a part of the config has the wrong shape.
 */
function checkSlotStyleRecipeConfig(config: unknown): void {
  checkConfig(config, "styles", slotStyles);
}

export { checkSlotStyleRecipeConfig, checkStyleRecipeConfig };
