import {
  createSlotStyleRecipe,
  createStyleRecipe,
} from "@lynstack/native-recipe";
import { Pressable, StyleSheet, Text, View } from "react-native";

const badge = createStyleRecipe({
  base: { alignSelf: "flex-start", borderRadius: 999, paddingHorizontal: 8 },
  variants: {
    tone: {
      neutral: { backgroundColor: "#f3f4f6" },
      success: { backgroundColor: "#dcfce7" },
      danger: { backgroundColor: "#fee2e2" },
    },
    size: {
      sm: { height: 20 },
      md: { height: 24 },
    },
    outlined: {
      true: { borderColor: "#d1d5db", borderWidth: 1 },
    },
  },
  compoundVariants: [
    {
      variants: { tone: "danger", outlined: true },
      style: { borderColor: "#dc2626" },
    },
  ],
  defaultVariants: { tone: "neutral", size: "md" },
});

const button = createSlotStyleRecipe({
  slots: ["root", "label"],
  base: {
    root: { alignItems: "center", borderRadius: 8, justifyContent: "center" },
    label: { fontWeight: "600" },
  },
  variants: {
    tone: {
      primary: {
        root: { backgroundColor: "#2563eb" },
        label: { color: "#ffffff" },
      },
      ghost: {
        root: { backgroundColor: "transparent" },
        label: { color: "#2563eb" },
      },
    },
    size: {
      sm: {
        root: { height: 32, paddingHorizontal: 12 },
        label: { fontSize: 14 },
      },
      md: {
        root: { height: 40, paddingHorizontal: 16 },
        label: { fontSize: 16 },
      },
    },
  },
  defaultVariants: { tone: "primary", size: "md" },
});

export default function App() {
  const primary = button();
  const ghost = button({ tone: "ghost", size: "sm" });

  return (
    <View style={styles.screen}>
      <View style={badge({ tone: "success" })}>
        <Text>Edit App.tsx</Text>
      </View>
      <View style={badge({ tone: "danger", outlined: true })}>
        <Text>Danger</Text>
      </View>
      <Pressable style={primary.root}>
        <Text style={primary.label}>Primary</Text>
      </Pressable>
      <Pressable style={ghost.root}>
        <Text style={ghost.label}>Ghost</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: 12, justifyContent: "center", padding: 24 },
});
