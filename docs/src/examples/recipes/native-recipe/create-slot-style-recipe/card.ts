import { createSlotStyleRecipe } from "@lynstack/native-recipe";

export const card = createSlotStyleRecipe({
  slots: ["root", "title", "body"],
  base: {
    root: { borderRadius: 12, padding: 16 },
    title: { fontSize: 18, fontWeight: "600" },
    body: { fontSize: 14 },
  },
  variants: {
    tone: {
      plain: {
        root: { backgroundColor: "#ffffff" },
        title: { color: "#111827" },
        body: { color: "#4b5563" },
      },
      inverted: {
        root: { backgroundColor: "#111827" },
        title: { color: "#ffffff" },
        body: { color: "#d1d5db" },
      },
    },
    compact: {
      true: { root: { padding: 8 }, title: { fontSize: 16 } },
    },
  },
  defaultVariants: { tone: "plain" },
});
