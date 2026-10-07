import { createSlotStyleRecipe } from "@lynstack/native-recipe";

export const field = createSlotStyleRecipe({
  slots: ["root", "label", "input", "hint"],
  base: {
    root: { gap: 4 },
    label: { color: "#374151", fontSize: 14, fontWeight: "500" },
    input: {
      borderColor: "#d1d5db",
      borderRadius: 6,
      borderWidth: 1,
      color: "#111827",
      paddingHorizontal: 12,
    },
    hint: { color: "#6b7280", fontSize: 12 },
  },
  variants: {
    size: {
      sm: { input: { fontSize: 14, height: 32 } },
      md: { input: { fontSize: 16, height: 40 } },
    },
    invalid: {
      true: { input: { borderColor: "#dc2626" }, hint: { color: "#dc2626" } },
    },
    disabled: {
      true: { input: { backgroundColor: "#f3f4f6", color: "#9ca3af" } },
    },
  },
  compoundVariants: [
    // A disabled field shows no error: the user cannot fix it.
    {
      variants: { invalid: true, disabled: true },
      styles: { input: { borderColor: "#d1d5db" }, hint: { color: "#6b7280" } },
    },
  ],
  defaultVariants: { size: "md" },
});
