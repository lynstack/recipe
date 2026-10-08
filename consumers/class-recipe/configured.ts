import { createRecipes } from "@lynstack/class-recipe";

/** Keeps the last class of each prefix, as a merge of conflicts does. */
function keepLastOfEachPrefix(...classNames: readonly string[]): string {
  const byPrefix = new Map<string, string>();
  for (const className of classNames.join(" ").split(" ")) {
    const [prefix = className] = className.split("-");
    byPrefix.delete(prefix);
    byPrefix.set(prefix, className);
  }
  return [...byPrefix.values()].join(" ");
}

// A library's own module, which the other modules import the creators from.
const { cva, cx, sva } = createRecipes({
  cache: false,
  join: keepLastOfEachPrefix,
});

export { cva, cx, sva };
