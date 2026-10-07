import { createSlotStyleRecipe } from "@lynstack/native-recipe";

export const dialog = createSlotStyleRecipe({
  slots: ["overlay", "content", "title", "description", "actions"],
  base: {
    overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", flex: 1, padding: 16 },
    content: { backgroundColor: "#ffffff", gap: 12, padding: 20 },
    title: { color: "#111827", fontSize: 18, fontWeight: "600" },
    description: { color: "#4b5563", fontSize: 14, lineHeight: 20 },
    actions: { flexDirection: "row", gap: 8, justifyContent: "flex-end" },
  },
  variants: {
    placement: {
      center: {
        overlay: { justifyContent: "center" },
        content: { borderRadius: 16 },
      },
      bottom: {
        overlay: { justifyContent: "flex-end", padding: 0 },
        content: { borderTopLeftRadius: 16, borderTopRightRadius: 16 },
      },
    },
    size: {
      sm: { content: { maxWidth: 360 } },
      md: { content: { maxWidth: 480 } },
    },
  },
  compoundVariants: [
    // A bottom sheet spans the screen, whatever its size.
    {
      variants: { placement: "bottom", size: ["sm", "md"] },
      styles: { content: { maxWidth: "100%" } },
    },
  ],
  defaultVariants: { placement: "center", size: "md" },
});
