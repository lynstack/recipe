import { cva, sva } from "@lynstack/class-recipe";

// Each CSS property of an element is set in one place, so no two classes
// ever conflict. The hover color depends on both the tone and the state,
// so only the compound variants set it.
export const button = cva({
  base: "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  variants: {
    tone: {
      primary: "bg-brand text-white",
      secondary: "border border-line bg-surface text-ink",
      ghost: "bg-transparent text-ink",
      danger: "bg-danger text-white",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    },
    state: {
      idle: "cursor-pointer",
      loading: "cursor-wait opacity-75",
      disabled: "cursor-not-allowed opacity-50",
    },
  },
  compoundVariants: [
    {
      variants: { tone: "primary", state: "idle" },
      className: "hover:bg-brand/90",
    },
    {
      variants: { tone: "secondary", state: "idle" },
      className: "hover:bg-canvas",
    },
    {
      variants: { tone: "ghost", state: "idle" },
      className: "hover:bg-ink/5",
    },
    {
      variants: { tone: "danger", state: "idle" },
      className: "hover:bg-danger/90",
    },
  ],
  defaultVariants: { tone: "primary", size: "md", state: "idle" },
});

export const badge = cva({
  base: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  variants: {
    tone: {
      neutral: "bg-ink/5 text-muted",
      brand: "bg-brand-soft text-brand-ink",
      success: "bg-success-soft text-success",
      danger: "bg-danger-soft text-danger",
    },
  },
  defaultVariants: { tone: "neutral" },
});

export const card = sva({
  slots: ["root", "header", "title", "description", "footer"],
  base: {
    root: "flex flex-col rounded-2xl border bg-surface",
    header: "flex items-start justify-between gap-4",
    title: "font-semibold text-ink",
    description: "text-sm text-muted",
    footer: "mt-auto flex items-center gap-2 border-t border-line",
  },
  variants: {
    size: {
      sm: { root: "gap-3 p-4", title: "text-sm", footer: "pt-3" },
      md: { root: "gap-4 p-6", title: "text-base", footer: "pt-4" },
    },
    highlighted: {
      true: { root: "border-brand shadow-lg shadow-brand/10" },
      false: { root: "border-line shadow-none" },
    },
  },
  defaultVariants: { size: "md" },
});

export const segment = sva({
  slots: ["root", "option"],
  base: {
    root: "inline-flex rounded-lg bg-ink/5 p-1",
    option:
      "cursor-pointer rounded-md px-3 py-1 text-sm font-medium transition-colors",
  },
  variants: {
    selected: {
      true: { option: "bg-surface text-ink shadow-sm" },
      false: { option: "bg-transparent text-muted hover:text-ink" },
    },
  },
});
