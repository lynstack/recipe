import { badge } from "../../../recipes/native-recipe/quick-start/badge.ts";

export const same = badge({ tone: "success" }) === badge({ tone: "success" });
