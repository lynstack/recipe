import { slotSv } from "./slot-sv.ts";

export const card = slotSv({
  slots: ["root", "title"],
  base: { root: { padding: 16 }, title: { fontSize: 18 } },
  variants: {
    tone: {
      light: { root: { backgroundColor: "white" } },
      dark: { root: { backgroundColor: "black" }, title: { color: "white" } },
    },
  },
  compoundVariants: [
    { variants: { tone: "dark" }, styles: { title: { fontWeight: 700 } } },
  ],
  defaultVariants: { tone: "light" },
});
