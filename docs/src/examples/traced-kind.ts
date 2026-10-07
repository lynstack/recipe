import type { RecipeKind } from "@lynstack/recipe";

import type { Recorder } from "./recorder.ts";
import type { Style } from "./configs.ts";
import { styleKind } from "./recipes/recipe/quick-start/style-kind.ts";

type MutableStyle = Record<string, string | number>;

/** Returns a kind that builds styles as the style kind does, recorded. */
function tracedKind(
  recorder: Recorder,
  combine: boolean,
): RecipeKind<Style, MutableStyle, Style> {
  const { finish, initial, reduce } = styleKind;
  return {
    cache: false,
    combine: combine
      ? (first: Style, second: Style): Style => recorder.combine(first, second)
      : undefined,
    finish: (style: MutableStyle): Style => {
      const result = finish(style);
      recorder.record("finish", undefined, result);
      return result;
    },
    initial: (base?: Style): MutableStyle => {
      const style = initial(base);
      recorder.record("initial", base, style);
      return style;
    },
    reduce: (style: MutableStyle, value: Style): MutableStyle => {
      const reduced = reduce(style, value);
      recorder.record("reduce", value, reduced);
      return reduced;
    },
  };
}

export { tracedKind };
