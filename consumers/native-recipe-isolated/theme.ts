import type {
  ThemedRecipeCreators,
  ThemedSlotStyleRecipeOf,
  ThemedStyleRecipeOf,
} from "@lynstack/native-recipe";
import { createThemedRecipes } from "@lynstack/native-recipe";

interface Theme {
  readonly gap: number;
  readonly radius: number;
}

const light: Theme = { gap: 4, radius: 8 };

const themed: ThemedRecipeCreators<Theme> = createThemedRecipes<Theme>();

const chipConfig = (theme: Theme) =>
  ({
    base: { borderRadius: theme.radius as Theme["radius"] },
    defaultVariants: { tone: "primary" },
    variants: { tone: { muted: { opacity: 0.6 }, primary: { opacity: 1 } } },
  }) as const;

const tagConfig = (theme: Theme) =>
  ({
    base: { root: { gap: theme.gap as Theme["gap"] } },
    slots: ["root", "label"],
    variants: { size: { sm: { label: { fontSize: 12 } } } },
  }) as const;

const chip: ThemedStyleRecipeOf<typeof chipConfig> =
  themed.createStyleRecipe(chipConfig);
const tag: ThemedSlotStyleRecipeOf<typeof tagConfig> =
  themed.createSlotStyleRecipe(tagConfig);

export { chip, light, tag, themed };
export type { Theme };
