import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightSidebarTopics from "starlight-sidebar-topics";

import { lynstackDark, lynstackLight } from "./src/code-themes.ts";

const repository = "https://github.com/lynstack/recipe";
const site = "https://lynstack.github.io";
const base = "/recipe";

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
        starlightSidebarTopics([
          {
            icon: "class-recipe",
            id: "class-recipe",
            items: [
              {
                items: [
                  { label: "Overview", link: "/class-recipe/" },
                  "class-recipe/installation",
                  "class-recipe/editor-setup",
                  "class-recipe/quick-start",
                  "class-recipe/agent-skill",
                  "class-recipe/why-class-recipe",
                ],
                label: "Get started",
              },
              {
                items: ["class-recipe/how-it-works"],
                label: "Concepts",
              },
              {
                items: [
                  "class-recipe/cx",
                  "class-recipe/cva",
                  "class-recipe/sva",
                  "class-recipe/create-recipes",
                ],
                label: "API",
              },
              {
                items: [
                  "class-recipe/conflict-free-recipes",
                  "class-recipe/tailwind-merge",
                  "class-recipe/building-components",
                  "class-recipe/typescript",
                  "class-recipe/migrating-from-cva",
                  "class-recipe/migrating-from-tailwind-variants",
                ],
                label: "Guides",
              },
              {
                items: ["class-recipe/exports", "class-recipe/performance"],
                label: "Reference",
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
                  "native-recipe/installation",
                  "native-recipe/quick-start",
                  "native-recipe/agent-skill",
                ],
                label: "Get started",
              },
              {
                items: ["native-recipe/how-it-works"],
                label: "Concepts",
              },
              {
                items: [
                  "native-recipe/create-style-recipe",
                  "native-recipe/create-slot-style-recipe",
                  "native-recipe/create-themed-recipes",
                ],
                label: "API",
              },
              {
                items: [
                  "native-recipe/themes",
                  "native-recipe/building-components",
                  "native-recipe/typescript",
                ],
                label: "Guides",
              },
              {
                items: ["native-recipe/exports", "native-recipe/performance"],
                label: "Reference",
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
                  "recipe/how-it-works",
                  "recipe/recipe-kinds",
                  "recipe/variants",
                  "recipe/caching",
                  "recipe/slot-recipes",
                ],
                label: "Concepts",
              },
              {
                items: [
                  "recipe/designing-a-kind",
                  "recipe/building-a-library",
                  "recipe/practices",
                  "recipe/typescript",
                ],
                label: "Guides",
              },
              {
                items: ["recipe/api", "recipe/exports", "recipe/performance"],
                label: "Reference",
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
  site,
});
