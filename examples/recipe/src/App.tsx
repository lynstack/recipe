import type { ComponentProps } from "react";
import type { VariantsOf } from "@lynstack/recipe";

import { button } from "./recipes.ts";

type ButtonProps = ComponentProps<"button"> & VariantsOf<typeof button>;

function Button({ tone, size, disabled, ...props }: ButtonProps) {
  return (
    <button
      style={button({ tone, size, disabled })}
      disabled={disabled}
      {...props}
    />
  );
}

const selections: VariantsOf<typeof button>[] = [
  {},
  { tone: "neutral", size: "sm" },
  { disabled: true },
];

export function App() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 32 }}>
      <h1>recipe</h1>
      <p>Edit src/recipes.ts and watch the buttons change.</p>
      <div style={{ display: "flex", gap: 8 }}>
        <Button>Primary</Button>
        <Button tone="neutral" size="sm">
          Neutral
        </Button>
        <Button disabled>Disabled</Button>
      </div>
      {selections.map((selection) => (
        <pre key={JSON.stringify(selection)}>
          button({JSON.stringify(selection)}){"\n"}
          {"// => "}
          {JSON.stringify(button(selection))}
        </pre>
      ))}
    </main>
  );
}
