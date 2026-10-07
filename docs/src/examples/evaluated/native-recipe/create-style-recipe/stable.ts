import { badge } from "../../../recipes/native-recipe/create-style-recipe/badge.ts";

export const same = badge({ tone: "success" }) === badge({ tone: "success" });
export const frozen = Object.isFrozen(badge({ tone: "success" }));
