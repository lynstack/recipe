import { Fragment, useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import type { VariantsOf } from "@lynstack/class-recipe";

import { badge, button, card, segment } from "./recipes.ts";

type ButtonVariants = VariantsOf<typeof button>;
type Tone = NonNullable<ButtonVariants["tone"]>;
type Size = NonNullable<ButtonVariants["size"]>;
type State = NonNullable<ButtonVariants["state"]>;

const tones = [
  "primary",
  "secondary",
  "ghost",
  "danger",
] as const satisfies readonly Tone[];
const sizes = ["sm", "md", "lg"] as const satisfies readonly Size[];
const states = [
  "idle",
  "loading",
  "disabled",
] as const satisfies readonly State[];

type ButtonProps = ComponentProps<"button"> &
  Omit<ButtonVariants, "state"> & { loading?: boolean };

function buttonState(loading: boolean, disabled: boolean): State {
  if (disabled) {
    return "disabled";
  }
  return loading ? "loading" : "idle";
}

function Button({
  tone,
  size,
  loading = false,
  disabled = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={button({ tone, size, state: buttonState(loading, disabled) })}
    >
      {loading && (
        <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

function Segment<Option extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly Option[];
  value: Option;
  onChange: (option: Option) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-xs uppercase tracking-wider text-muted">
        {label}
      </span>
      <div className={segment().root} role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={option === value}
            className={segment({ selected: option === value }).option}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function ButtonCall(variants: Required<ButtonVariants>) {
  const entries = Object.entries(variants);

  return (
    <figure className="overflow-hidden rounded-xl border border-line bg-code">
      <figcaption className="border-b border-line px-4 py-2 font-mono text-xs text-muted">
        Result
      </figcaption>
      <pre className="p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap">
        <code>
          <span className="text-code-function">button</span>
          <span className="text-code-muted">{"({ "}</span>
          {entries.map(([name, option], index) => (
            <Fragment key={name}>
              <span className="text-ink">{name}</span>
              <span className="text-code-muted">: </span>
              <span className="text-code-string">"{option}"</span>
              {index < entries.length - 1 && (
                <span className="text-code-muted">, </span>
              )}
            </Fragment>
          ))}
          <span className="text-code-muted">{" });"}</span>
          {"\n"}
          <span className="text-code-muted">{"// => "}</span>
          <span className="text-code-string">
            "
            {button(variants)
              .split(" ")
              .map((className, index) => (
                <Fragment key={className}>
                  {index > 0 && " "}
                  <span className="whitespace-nowrap">{className}</span>
                </Fragment>
              ))}
            "
          </span>
        </code>
      </pre>
    </figure>
  );
}

function Playground() {
  const [tone, setTone] = useState<Tone>("primary");
  const [size, setSize] = useState<Size>("md");
  const [state, setState] = useState<State>("idle");
  const classes = card({ highlighted: true });

  return (
    <section className={classes.root}>
      <div className={classes.header}>
        <div>
          <h2 className={classes.title}>Try the button recipe</h2>
          <p className={classes.description}>
            Pick its variants, or edit src/recipes.ts.
          </p>
        </div>
        <span className={badge({ tone: "brand" })}>cva</span>
      </div>
      <div className="flex flex-wrap gap-4">
        <Segment label="tone" options={tones} value={tone} onChange={setTone} />
        <Segment label="size" options={sizes} value={size} onChange={setSize} />
        <Segment
          label="state"
          options={states}
          value={state}
          onChange={setState}
        />
      </div>
      <div className="grid min-h-32 place-items-center rounded-xl border border-dashed border-line bg-canvas">
        <Button
          tone={tone}
          size={size}
          loading={state === "loading"}
          disabled={state === "disabled"}
        >
          Continue
        </Button>
      </div>
      <ButtonCall tone={tone} size={size} state={state} />
    </section>
  );
}

function Plan({
  name,
  price,
  description,
  highlighted = false,
  children,
}: {
  name: string;
  price: string;
  description: string;
  highlighted?: boolean;
  children: ReactNode;
}) {
  const classes = card({ highlighted });

  return (
    <article className={classes.root}>
      <div className={classes.header}>
        <h3 className={classes.title}>{name}</h3>
        {highlighted && (
          <span className={badge({ tone: "brand" })}>Popular</span>
        )}
      </div>
      <p className="text-3xl font-semibold tracking-tight">{price}</p>
      <p className={classes.description}>{description}</p>
      <div className={classes.footer}>{children}</div>
    </article>
  );
}

export function App() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className={badge({ tone: "brand" })}>
            @lynstack/class-recipe
          </span>
          <span className={badge({ tone: "success" })}>no conflicts</span>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Variants in, <span className="text-brand">class names out.</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          Fast, type-safe recipes that map a component's variants to its class
          names. Every recipe on this page lives in src/recipes.ts.
        </p>
      </header>

      <Playground />

      <section className="grid gap-6 md:grid-cols-3">
        <Plan
          name="Hobby"
          price="$0"
          description="For side projects and trying things out."
        >
          <Button tone="secondary" size="sm">
            Start free
          </Button>
        </Plan>
        <Plan
          name="Pro"
          price="$12"
          description="For teams shipping a design system."
          highlighted
        >
          <Button size="sm">Upgrade</Button>
          <Button tone="ghost" size="sm">
            Compare
          </Button>
        </Plan>
        <Plan
          name="Legacy"
          price="$8"
          description="No longer offered to new teams."
        >
          <Button tone="danger" size="sm" disabled>
            Unavailable
          </Button>
        </Plan>
      </section>
    </main>
  );
}
