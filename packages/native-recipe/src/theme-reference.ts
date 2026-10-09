const references = new WeakSet();
const building: { theme: object | undefined } = { theme: undefined };

function themeBeingBuilt(): object {
  const { theme } = building;
  if (theme === undefined) {
    throw new TypeError(
      "The themeToken of createThemedRecipes is read outside the config function of a recipe. Read it inside the function, as in `createStyleRecipe(() => ({ base: { gap: themeToken.gap } }))`.",
    );
  }
  return theme;
}

/**
 * Returns an object that reads the theme whose recipe is being built, so
 * that a config function can read the theme without taking it.
 */
function createThemeReference(): object {
  const reference = new Proxy(
    {},
    {
      get: (_target, key): unknown => Reflect.get(themeBeingBuilt(), key),
      getOwnPropertyDescriptor: (
        _target,
        key,
      ): PropertyDescriptor | undefined => {
        const descriptor = Reflect.getOwnPropertyDescriptor(
          themeBeingBuilt(),
          key,
        );
        return descriptor === undefined
          ? undefined
          : { ...descriptor, configurable: true };
      },
      has: (_target, key): boolean => Reflect.has(themeBeingBuilt(), key),
      ownKeys: (): (string | symbol)[] => Reflect.ownKeys(themeBeingBuilt()),
    },
  );
  references.add(reference);
  return reference;
}

/** Returns the theme being built if `theme` is a reference, else `theme`. */
function resolveTheme(theme: object): object {
  return references.has(theme) ? themeBeingBuilt() : theme;
}

/** Calls `build` with `theme` as the theme that references read. */
function buildWithTheme<Result>(
  theme: object,
  build: (theme: object) => Result,
): Result {
  const outerTheme = building.theme;
  building.theme = theme;
  try {
    return build(theme);
  } finally {
    building.theme = outerTheme;
  }
}

export { buildWithTheme, createThemeReference, resolveTheme };
