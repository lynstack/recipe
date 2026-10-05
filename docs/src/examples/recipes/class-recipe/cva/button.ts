import { cva } from "@lynstack/class-recipe";

export const button = cva({
  base: "inline-flex rounded-md",
  variants: {
    tone: { neutral: "bg-gray-100", danger: "bg-red-600 text-white" },
    size: { sm: "h-8 px-3", md: "h-10 px-4" },
    outlined: { true: "ring-1 ring-inset" },
  },
  compoundVariants: [
    // When tone is danger and size is md.
    { variants: { tone: "danger", size: "md" }, className: "font-semibold" },
    // When tone is neutral and outlined is true, whatever the size.
    {
      variants: { tone: "neutral", outlined: true },
      className: "ring-gray-300",
    },
  ],
  defaultVariants: { size: "md" },
});
