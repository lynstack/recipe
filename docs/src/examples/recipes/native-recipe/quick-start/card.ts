import { createSlotStyleRecipe } from "@lynstack/native-recipe";

export const card = createSlotStyleRecipe({
  // Your own names, one for each element of the card.
  slots: ["container", "title", "body"],
  base: {
    container: { borderRadius: 12, gap: 4, padding: 16 },
    title: { fontSize: 18, fontWeight: "600" },
    body: { fontSize: 14 },
  },
  variants: {
    tone: {
      light: {
        container: { backgroundColor: "#ffffff" },
        title: { color: "#111827" },
        body: { color: "#4b5563" },
      },
      inverted: {
        container: { backgroundColor: "#111827" },
        title: { color: "#ffffff" },
        body: { color: "#d1d5db" },
      },
    },
  },
  defaultVariants: { tone: "light" },
});
