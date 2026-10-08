import type {
  ThemedRecipeCreators,
  ThemedSlotStyleRecipeOf,
} from "@lynstack/native-recipe";
import { createThemedRecipes } from "@lynstack/native-recipe";

interface Theme {
  readonly gap: number;
}

const themed: ThemedRecipeCreators<Theme> = createThemedRecipes<Theme>();

// Each level composes the one before, each typed from its config with
// ThemedSlotStyleRecipeOf.
const config0 = (theme: Theme) =>
  ({
    slots: ["root"],
    variants: { size: { md: { root: { gap: theme.gap } } } },
  }) as const;
const config1 = (theme: Theme) =>
  ({
    slots: ["icon"],
    variants: {
      tone: { danger: { icon: { gap: theme.gap } } },
    },
  }) as const;
const config2 = (theme: Theme) =>
  ({
    slots: ["label"],
    variants: {
      weight: { bold: { label: { gap: theme.gap } } },
    },
  }) as const;
const config3 = (theme: Theme) =>
  ({
    slots: ["badge"],
    variants: {
      shape: { round: { badge: { gap: theme.gap } } },
    },
  }) as const;
const config4 = (theme: Theme) =>
  ({
    slots: ["hint"],
    variants: {
      muted: { true: { hint: { gap: theme.gap } } },
    },
  }) as const;

const typed0: ThemedSlotStyleRecipeOf<typeof config0> =
  themed.createSlotStyleRecipe(config0);
const typed1: ThemedSlotStyleRecipeOf<
  typeof config1,
  readonly [typeof typed0]
> = themed.createSlotStyleRecipe((theme: Theme) => ({
  ...config1(theme),
  composes: [typed0.withTheme(theme)],
}));
const typed2: ThemedSlotStyleRecipeOf<
  typeof config2,
  readonly [typeof typed1]
> = themed.createSlotStyleRecipe((theme: Theme) => ({
  ...config2(theme),
  composes: [typed1.withTheme(theme)],
}));
const typed3: ThemedSlotStyleRecipeOf<
  typeof config3,
  readonly [typeof typed2]
> = themed.createSlotStyleRecipe((theme: Theme) => ({
  ...config3(theme),
  composes: [typed2.withTheme(theme)],
}));
const typed4: ThemedSlotStyleRecipeOf<
  typeof config4,
  readonly [typeof typed3]
> = themed.createSlotStyleRecipe((theme: Theme) => ({
  ...config4(theme),
  composes: [typed3.withTheme(theme)],
}));

export { themed, typed0, typed1, typed2, typed3, typed4 };
export type { Theme };
