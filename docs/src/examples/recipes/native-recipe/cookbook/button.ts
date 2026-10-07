import { createSlotStyleRecipe } from "@lynstack/native-recipe";

export const button = createSlotStyleRecipe({
  slots: ["root", "label"],
  base: {
    root: {
      alignItems: "center",
      borderRadius: 8,
      flexDirection: "row",
      gap: 8,
      justifyContent: "center",
    },
    label: { fontWeight: "600" },
  },
  variants: {
    tone: {
      primary: {
        root: { backgroundColor: "#2563eb" },
        label: { color: "#ffffff" },
      },
      secondary: {
        root: { backgroundColor: "#f3f4f6" },
        label: { color: "#111827" },
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
    disabled: { true: { root: { opacity: 0.5 } } },
    fullWidth: { true: { root: { alignSelf: "stretch" } } },
  },
  compoundVariants: [
    // A ghost button gets a border when it is disabled, so it stays visible.
    {
      variants: { tone: "ghost", disabled: true },
      styles: { root: { borderColor: "#d1d5db", borderWidth: 1 } },
    },
  ],
  defaultVariants: { tone: "primary", size: "md" },
});
