import {
  createSlotStyleRecipe,
  createStyleRecipe,
  createThemedRecipes,
} from "@lynstack/native-recipe";

interface Theme {
  readonly colors: { readonly primary: string };
}

const themed = createThemedRecipes<Theme>();

const box = createStyleRecipe({
  defaultVariants: { size: "md" },
  variants: {
    size: { md: { height: 40 }, sm: { height: 32 } },
    tone: { muted: { opacity: 0.6 } },
  },
});
const card = createSlotStyleRecipe({
  slots: ["root", "title"],
  variants: { raised: { true: { root: { elevation: 2 } } } },
});

const declared = {
  variants: { size: { md: { textAlign: "middle" } } },
} as const;

/** Configs whose styles are arrays of styles, which the types reject. */
function createArrayStyleRecipes(): void {
  const styles = [{ padding: 8 }];
  // @ts-expect-error: a style is an object, not an array of styles.
  createStyleRecipe({ base: styles, variants: {} });
  // @ts-expect-error: a style is an object, not an array of styles.
  createStyleRecipe({ base: [{ padding: 8 }], variants: {} });
  // @ts-expect-error: a style is an object, not an array of styles.
  createStyleRecipe({ variants: { size: { sm: [{ padding: 8 }] } } });
}

/** Calls and configs that the types reject, one of each mistake. */
function misuses(): void {
  // @ts-expect-error: tone has no default, so a call must name it.
  box({ size: "sm" });
  // @ts-expect-error: size has no option xl.
  box({ size: "xl", tone: "muted" });
  // @ts-expect-error: a style has no property named colour.
  createStyleRecipe({ base: { colour: "red" }, variants: {} });
  createStyleRecipe({
    // @ts-expect-error: flexDirection has no value sideways.
    variants: { dir: { row: { flexDirection: "sideways" } } },
  });
  // @ts-expect-error: fontWeight has no value 650.
  createStyleRecipe({ base: { fontWeight: 650 }, variants: {} });
  // @ts-expect-error: a declared config whose textAlign has no value middle.
  createStyleRecipe(declared);
  createSlotStyleRecipe({
    slots: ["root"],
    // @ts-expect-error: an option styles only the slots of the recipe.
    variants: { size: { md: { title: {} } } },
  });
  // @ts-expect-error: a recipe composes recipes, not slot recipes.
  createStyleRecipe({ composes: [card], variants: {} });
  themed.createStyleRecipe((theme) => ({
    variants: {
      // @ts-expect-error: a themed option checks the values of its styles.
      tone: { primary: { color: theme.colors, opacity: 1 } },
    },
  }));
}

export { box, card, createArrayStyleRecipes, misuses };
