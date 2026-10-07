import { createSlotStyleRecipe } from "@lynstack/native-recipe";

// The slot names are your own: name them after the parts of your component.
export const card = createSlotStyleRecipe({
  slots: ["container", "title", "body", "footer"],
  base: {
    container: { borderRadius: 12, gap: 8 },
    title: { fontSize: 18, fontWeight: "600" },
    body: { fontSize: 14, lineHeight: 20 },
    footer: { flexDirection: "row", gap: 8, justifyContent: "flex-end" },
  },
  variants: {
    tone: {
      plain: {
        container: { backgroundColor: "#ffffff" },
        title: { color: "#111827" },
        body: { color: "#4b5563" },
      },
      muted: {
        container: { backgroundColor: "#f3f4f6" },
        title: { color: "#111827" },
        body: { color: "#6b7280" },
      },
    },
    padding: {
      sm: { container: { padding: 12 } },
      md: { container: { padding: 16 } },
    },
    elevated: {
      true: {
        container: {
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
        },
      },
    },
  },
  defaultVariants: { tone: "plain", padding: "md" },
});
