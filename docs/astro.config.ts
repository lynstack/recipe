import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightLlmsTxt from "starlight-llms-txt";
import starlightSidebarTopics from "starlight-sidebar-topics";

import { lynstackDark, lynstackLight } from "./src/code-themes.ts";

const repository = "https://github.com/lynstack/recipe";
const site = "https://lynstack.github.io";
const base = "/recipe";

/** A sidebar link to a page outside the docs. */
interface ExternalLink {
  readonly attrs: { readonly rel: string; readonly target: string };
  readonly label: string;
  readonly link: string;
}

/** The sidebar link to the changelog of the package in `folder`. */
function changelog(folder: string): ExternalLink {
  return {
    attrs: { rel: "noopener", target: "_blank" },
    label: "Changelog",
    link: `${repository}/blob/main/packages/${folder}/CHANGELOG.md`,
  };
}

const changelogs = {
  classRecipe: changelog("class-recipe"),
  nativeRecipe: changelog("native-recipe"),
  recipe: changelog("recipe"),
};

export default defineConfig({
  base,
  integrations: [
    starlight({
      components: {
        Hero: "./src/components/Hero.astro",
        Sidebar: "./src/components/Sidebar.astro",
        SiteTitle: "./src/components/SiteTitle.astro",
      },
      customCss: ["./src/styles/lynstack.css"],
      description:
        "Fast, type-safe recipes that map a component's variants to its styles.",
      editLink: { baseUrl: `${repository}/edit/main/docs/` },
      expressiveCode: {
        styleOverrides: {
          borderColor: "var(--lyn-border)",
          borderRadius: "var(--lyn-radius-lg)",
          codeFontFamily: "var(--lyn-font-mono)",
          codeFontSize: "0.8125rem",
          codeLineHeight: "1.5385",
          frames: {
            editorActiveTabBackground: "var(--lyn-muted)",
            editorActiveTabBorderColor: "transparent",
            editorActiveTabForeground: "var(--lyn-foreground)",
            editorActiveTabIndicatorBottomColor: "transparent",
            editorActiveTabIndicatorTopColor: "transparent",
            editorTabBarBackground: "var(--lyn-muted)",
            editorTabBarBorderBottomColor: "var(--lyn-border)",
            frameBoxShadowCssValue: "none",
            terminalBackground: "var(--lyn-muted)",
            terminalTitlebarBackground: "var(--lyn-muted)",
            terminalTitlebarBorderBottomColor: "var(--lyn-border)",
            terminalTitlebarDotsOpacity: "0",
          },
          textMarkers: {
            delBackground: "var(--lyn-destructive-subtle)",
            delBorderColor: "var(--lyn-destructive)",
            delDiffIndicatorColor: "var(--lyn-destructive)",
            insBackground: "var(--lyn-success-subtle)",
            insBorderColor: "var(--lyn-success)",
            insDiffIndicatorColor: "var(--lyn-success)",
          },
          uiFontFamily: "var(--lyn-font-mono)",
        },
        themes: [lynstackDark, lynstackLight],
      },
      favicon: "/favicon.svg",
      head: [
        {
          attrs: { href: "https://fonts.googleapis.com", rel: "preconnect" },
          tag: "link",
        },
        {
          attrs: {
            crossorigin: "",
            href: "https://fonts.gstatic.com",
            rel: "preconnect",
          },
          tag: "link",
        },
        {
          attrs: {
            href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
            rel: "stylesheet",
          },
          tag: "link",
        },
      ],
      plugins: [
        starlightLlmsTxt({
          description:
            "Fast, type-safe recipes that map a component's variants to its styles: `@lynstack/class-recipe` for class names (`cva`, `sva`, `cx`), `@lynstack/native-recipe` for React Native styles, and `@lynstack/recipe`, the engine they are built on, for values of any type.",
          projectName: "lynstack recipe",
        }),
        starlightSidebarTopics([
          {
            icon: "class-recipe",
            id: "class-recipe",
            items: [
              {
                items: [
                  { label: "Overview", link: "/class-recipe/" },
                  "class-recipe/why-class-recipe",
                  "class-recipe/installation",
                  "class-recipe/quick-start",
                ],
                label: "Get started",
              },
              {
                items: [
                  "class-recipe/variants",
                  "class-recipe/composing",
                  "class-recipe/how-it-works",
                ],
                label: "Concepts",
              },
              {
                items: [
                  "class-recipe/conflict-free-recipes",
                  {
                    label: "Merging classes",
                    slug: "class-recipe/tailwind-merge",
                  },
                  "class-recipe/building-components",
                  { label: "Typing recipes", slug: "class-recipe/typescript" },
                ],
                label: "Guides",
              },
              {
                items: [
                  {
                    label: "From cva",
                    slug: "class-recipe/migrating-from-cva",
                  },
                  {
                    label: "From tailwind-variants",
                    slug: "class-recipe/migrating-from-tailwind-variants",
                  },
                ],
                label: "Migrate",
              },
              {
                items: [
                  "class-recipe/cva",
                  "class-recipe/sva",
                  "class-recipe/cx",
                  "class-recipe/create-recipes",
                  { label: "All exports", slug: "class-recipe/exports" },
                ],
                label: "API reference",
              },
              {
                items: [
                  "class-recipe/editor-setup",
                  "class-recipe/agent-skill",
                  { label: "Benchmarks", slug: "class-recipe/performance" },
                  "class-recipe/faq",
                  "class-recipe/glossary",
                  changelogs.classRecipe,
                ],
                label: "Resources",
              },
            ],
            label: "class-recipe",
            link: "/class-recipe/",
          },
          {
            icon: "native-recipe",
            id: "native-recipe",
            items: [
              {
                items: [
                  { label: "Overview", link: "/native-recipe/" },
                  "native-recipe/why-native-recipe",
                  "native-recipe/installation",
                  "native-recipe/quick-start",
                ],
                label: "Get started",
              },
              {
                items: [
                  "native-recipe/variants",
                  "native-recipe/composing",
                  "native-recipe/how-it-works",
                ],
                label: "Concepts",
              },
              {
                items: [
                  {
                    label: "Theming with design tokens",
                    slug: "native-recipe/themes",
                  },
                  "native-recipe/building-components",
                  { label: "Typing recipes", slug: "native-recipe/typescript" },
                ],
                label: "Guides",
              },
              {
                items: [
                  "native-recipe/create-style-recipe",
                  "native-recipe/create-slot-style-recipe",
                  "native-recipe/create-themed-recipes",
                  { label: "All exports", slug: "native-recipe/exports" },
                ],
                label: "API reference",
              },
              {
                items: [
                  "native-recipe/cookbook",
                  "native-recipe/agent-skill",
                  { label: "Benchmarks", slug: "native-recipe/performance" },
                  "native-recipe/faq",
                  "native-recipe/glossary",
                  changelogs.nativeRecipe,
                ],
                label: "Resources",
              },
            ],
            label: "native-recipe",
            link: "/native-recipe/",
          },
          {
            icon: "recipe",
            id: "recipe",
            items: [
              {
                items: [
                  { label: "Overview", link: "/recipe/" },
                  "recipe/installation",
                  "recipe/quick-start",
                ],
                label: "Get started",
              },
              {
                items: [
                  "recipe/recipe-kinds",
                  "recipe/variants",
                  "recipe/slot-recipes",
                  "recipe/composing",
                  "recipe/caching",
                  "recipe/how-it-works",
                ],
                label: "Concepts",
              },
              {
                items: [
                  "recipe/designing-a-kind",
                  "recipe/building-a-library",
                  "recipe/composable-libraries",
                  { label: "Typing recipes", slug: "recipe/typescript" },
                ],
                label: "Guides",
              },
              {
                items: ["recipe/api"],
                label: "API reference",
              },
              {
                items: [
                  { label: "Checklist", slug: "recipe/practices" },
                  "recipe/glossary",
                  { label: "Benchmarks", slug: "recipe/performance" },
                  changelogs.recipe,
                ],
                label: "Resources",
              },
            ],
            label: "recipe",
            link: "/recipe/",
          },
        ]),
      ],
      routeMiddleware: "./src/route-data.ts",
      social: [{ href: repository, icon: "github", label: "GitHub" }],
      title: "lynstack recipe",
    }),
  ],
  // Astro adds the base to each source, not to the destination.
  redirects: { "/recipe/exports": `${base}/recipe/api/` },
  site,
});
