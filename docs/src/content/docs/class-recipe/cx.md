---
title: cx
description: Join class names with a drop-in replacement for clsx.
---

`cx` joins class names and skips falsy values. It accepts the same inputs
as `clsx` (strings, numbers, objects, and nested arrays) and returns the
same output, so you can replace `clsx` with it.

```ts
import { cx } from "@lynstack/class-recipe";

cx("btn", isActive && "btn-active", { "btn-disabled": isDisabled });
// => "btn btn-active" when isActive is true and isDisabled is false

cx(["flex", ["items-center", null]], { hidden: false }, 0, "");
// => "flex items-center"
```
