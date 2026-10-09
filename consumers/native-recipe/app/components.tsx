import { Pressable, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import {
  createSlotStyleRecipe,
  createStyleRecipe,
  createThemedRecipes,
} from "@lynstack/native-recipe";
import type { ReactNode } from "react";
import type { VariantsOf } from "@lynstack/native-recipe";

interface Theme {
  readonly colors: { readonly primary: string };
}

const box = createStyleRecipe({
  base: { borderRadius: 8 },
  defaultVariants: { padded: true },
  variants: {
    padded: { false: { padding: 0 }, true: { padding: 16 } },
    tone: { muted: { opacity: 0.6 }, plain: {} },
  },
});

const button = createSlotStyleRecipe({
  base: { label: { fontWeight: "600" }, root: { alignItems: "center" } },
  defaultVariants: { size: "md" },
  slots: ["root", "label"],
  variants: {
    size: {
      md: { label: { fontSize: 16 }, root: { height: 40 } },
      sm: { label: { fontSize: 14 }, root: { height: 32 } },
    },
  },
});

const themed = createThemedRecipes<Theme>();
const chip = themed.createStyleRecipe((theme) => ({
  variants: { tone: { primary: { backgroundColor: theme.colors.primary } } },
}));

type BoxProps = VariantsOf<typeof box> & {
  readonly children?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
};

/** A view whose variants are props, before the style of its caller. */
function Box({ children, style, ...variants }: BoxProps): ReactNode {
  return <View style={[box(variants), style]}>{children}</View>;
}

type ButtonProps = VariantsOf<typeof button> & {
  readonly label: string;
  readonly onPress?: () => void;
};

/** A pressable whose slots style the view and its text. */
function Button({ label, onPress, ...variants }: ButtonProps): ReactNode {
  const styles = button(variants);
  return (
    <Pressable onPress={onPress} style={styles.root}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

type ChipProps = VariantsOf<typeof chip> & { readonly theme: Theme };

/** A view styled from the theme its caller passes. */
function Chip({ theme, ...variants }: ChipProps): ReactNode {
  return <View style={chip(theme, variants)} />;
}

const theme: Theme = { colors: { primary: "#2563eb" } };

/** A screen that renders the components with their props. */
function Screen(): ReactNode {
  return (
    <Box style={{ flex: 1 }} tone="muted">
      <Button label="Save" size="sm" />
      <Chip theme={theme} tone="primary" />
    </Box>
  );
}

export { Box, Button, Chip, Screen };
export type { BoxProps, ButtonProps, ChipProps };
