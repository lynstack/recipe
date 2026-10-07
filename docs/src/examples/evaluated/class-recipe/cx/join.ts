import { cx } from "@lynstack/class-recipe";

const isActive = true;
const isDisabled = false;

export const active = cx("btn", isActive && "btn-active", {
  "btn-disabled": isDisabled,
});

export const nested = cx(
  ["flex", ["items-center", null]],
  { hidden: false },
  0,
  "",
);
