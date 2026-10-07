import { sv } from "./sv.ts";

export const box = sv({
  base: { padding: 8 },
  variants: { tone: { muted: { opacity: 0.6 }, loud: { fontWeight: 700 } } },
  compoundVariants: [{ variants: { tone: "muted" }, style: { margin: 4 } }],
  defaultVariants: { tone: "muted" },
});
