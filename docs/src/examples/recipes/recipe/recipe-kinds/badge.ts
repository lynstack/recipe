import { createRecipeKind } from "@lynstack/recipe";

const classRecipe = createRecipeKind({
  initial: (base?: string): string => base ?? "",
  reduce: (className, classes: string) =>
    className === "" ? classes : `${className} ${classes}`,
});

export const badge = classRecipe({
  base: "badge",
  variants: { tone: { info: "badge-info", danger: "badge-danger" } },
});
