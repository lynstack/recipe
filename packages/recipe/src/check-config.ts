type UncheckedRecord = Readonly<Record<string, unknown>>;

/** Checks a value of a slot recipe, such as an option's value. */
type CheckValue = (value: unknown, describe: () => string) => void;

const anyValue: CheckValue = () => {
  // A recipe's values have the type of its kind, which the engine cannot check.
};

function isRecord(value: unknown): value is UncheckedRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Checks a value of a slot recipe: undefined, or a value for each slot. */
const slotValues: CheckValue = (value, describe) => {
  if (value !== undefined && !isRecord(value)) {
    throw new TypeError(
      `${describe()} needs an object of the value of each slot.`,
    );
  }
};

function checkVariants(variants: unknown, checkValue: CheckValue): void {
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
    for (const [option, value] of Object.entries(options)) {
      checkValue(
        value,
        () => `The option "${option}" of the variant "${name}"`,
      );
    }
  }
}

function checkCompoundVariants(
  compoundVariants: unknown,
  checkValue: CheckValue,
): void {
  if (compoundVariants === undefined) {
    return;
  }
  if (!Array.isArray(compoundVariants)) {
    throw new TypeError(
      "`compoundVariants` needs an array of compound variants.",
    );
  }
  for (const [index, compound] of compoundVariants.entries()) {
    const { variants, value } = isRecord(compound) ? compound : {};
    if (!isRecord(variants)) {
      throw new TypeError(
        `Compound variant ${String(index)} needs \`variants\`, an object of the options it matches.`,
      );
    }
    checkValue(
      value,
      () => `The \`value\` of compound variant ${String(index)}`,
    );
  }
}

function checkLayer(config: unknown, checkValue: CheckValue): UncheckedRecord {
  if (!isRecord(config)) {
    throw new TypeError("A recipe needs a config object.");
  }
  const { variants, compoundVariants } = config;
  checkVariants(variants, checkValue);
  checkCompoundVariants(compoundVariants, checkValue);
  return config;
}

/**
 * Checks the shape of a recipe's config, which its types already check, so
 * that a config from untyped code fails when the recipe is created, with a
 * message that names what is wrong.
 *
 * @returns The config.
 * @throws {TypeError} When `variants` or a compound variant's `variants` is
 *   not an object.
 */
function checkRecipeConfig<Config>(config: Config): Config {
  checkLayer(config, anyValue);
  return config;
}

/**
 * Checks the shape of a slot recipe's config, as {@link checkRecipeConfig}
 * does, and that `slots` is an array and each value is an object of the
 * value of each slot.
 *
 * @returns The config.
 * @throws {TypeError} When a part of the config has the wrong shape.
 */
function checkSlotRecipeConfig<Config>(config: Config): Config {
  const { slots, base } = checkLayer(config, slotValues);
  if (!Array.isArray(slots)) {
    throw new TypeError(
      "A slot recipe's config needs `slots`, an array of the names of its slots.",
    );
  }
  slotValues(base, () => "The `base` of a slot recipe");
  return config;
}

export { checkRecipeConfig, checkSlotRecipeConfig };
