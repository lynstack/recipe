import type {
  ThemedSlotStyleRecipeOf,
  ThemedStyleRecipeOf,
} from "@lynstack/native-recipe";

import { chip, tag, themed } from "./theme";
import type { Theme } from "./theme";

const badgeConfig = (theme: Theme) =>
  ({
    variants: { size: { sm: { padding: theme.gap as Theme["gap"] } } },
  }) as const;

const pillConfig = (theme: Theme) =>
  ({
    slots: ["icon"],
    variants: {
      closable: { true: { icon: { width: theme.gap as Theme["gap"] } } },
    },
  }) as const;

const badge: ThemedStyleRecipeOf<typeof badgeConfig, readonly [typeof chip]> =
  themed.createStyleRecipe((theme: Theme) => ({
    ...badgeConfig(theme),
    composes: [chip.withTheme(theme)],
  }));
const pill: ThemedSlotStyleRecipeOf<typeof pillConfig, readonly [typeof tag]> =
  themed.createSlotStyleRecipe((theme: Theme) => ({
    ...pillConfig(theme),
    composes: [tag.withTheme(theme)],
  }));

export { badge, pill };
