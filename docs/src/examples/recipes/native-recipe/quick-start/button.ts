import { createSlotStyleRecipe } from "@lynstack/native-recipe";

export const button = createSlotStyleRecipe({
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
