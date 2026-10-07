import { card } from "../../../recipes/native-recipe/create-slot-style-recipe/card.ts";

export const same =
  card({ tone: "inverted", compact: true }) ===
  card({ tone: "inverted", compact: true });
