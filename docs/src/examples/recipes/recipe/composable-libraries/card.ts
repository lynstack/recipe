import { sv } from "./sv.ts";

const box = sv({
  base: { padding: 8 },
  variants: { tone: { muted: { opacity: 0.6 } } },
  compoundVariants: [{ variants: { tone: "muted" }, style: { margin: 4 } }],
});

export const card = sv({
  composes: [box],
  variants: { tone: { loud: { fontWeight: 700 } } },
  defaultVariants: { tone: "muted" },
});
