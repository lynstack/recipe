import { badge } from "../../../recipes/native-recipe/index/badge.ts";

export const same = badge({ tone: "danger" }) === badge({ tone: "danger" });
