import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightSidebarTopics from "starlight-sidebar-topics";

const repository = "https://github.com/lynstack/recipe";
const site = "https://lynstack.github.io";
const base = "/recipe";

export default defineConfig({
  base,
  integrations: [
    starlight({
      components: { Hero: "./src/components/Hero.astro" },
      customCss: ["./src/styles/lynstack.css"],
      description:
        "Fast, type-safe recipes that map a component's variants to its styles.",
      editLink: { baseUrl: `${repository}/edit/main/docs/` },
      favicon: "/favicon.svg",
      head: [
        {
          attrs: { content: `${site}${base}/og.png`, property: "og:image" },
          tag: "meta",
        },
        {
          attrs: { content: "1200", property: "og:image:width" },
          tag: "meta",
        },
        {
          attrs: { content: "630", property: "og:image:height" },
          tag: "meta",
        },
        {
          attrs: {
            content:
              "lynstack recipe: variants in, styles out. Fast, type-safe recipes for class names and styles.",
            property: "og:image:alt",
          },
          tag: "meta",
        },
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
      logo: {
        dark: "./src/assets/logo-dark.svg",
        light: "./src/assets/logo-light.svg",
      },
      plugins: [
        starlightSidebarTopics([
          {
            icon: "seti:css",
            id: "class-recipe",
            items: [
              {
                items: [
                  { label: "Overview", link: "/class-recipe/" },
                  "class-recipe/installation",
                  "class-recipe/why-class-recipe",
                ],
                label: "Get started",
              },
              {
                items: [
                  "class-recipe/cx",
                  "class-recipe/cva",
                  "class-recipe/sva",
                ],
                label: "API",
              },
              {
                items: [
                  "class-recipe/conflict-free-recipes",
                  "class-recipe/tailwind-merge",
                  "class-recipe/typescript",
                  "class-recipe/migrating-from-cva",
                ],
                label: "Guides",
              },
              {
                items: ["class-recipe/performance", "class-recipe/exports"],
                label: "Reference",
              },
            ],
            label: "class-recipe",
            link: "/class-recipe/",
          },
          {
            icon: "puzzle",
            id: "recipe",
            items: [
              {
                items: [
                  { label: "Overview", link: "/recipe/" },
                  "recipe/installation",
                ],
                label: "Get started",
              },
              {
                items: ["recipe/recipe-kinds", "recipe/recipes"],
                label: "API",
              },
              {
                items: [
                  "recipe/practices",
                  "recipe/building-a-library",
                  "recipe/typescript",
                ],
                label: "Guides",
              },
              {
                items: ["recipe/performance", "recipe/exports"],
                label: "Reference",
              },
            ],
            label: "recipe",
            link: "/recipe/",
          },
        ]),
      ],
      social: [{ href: repository, icon: "github", label: "GitHub" }],
      title: "lynstack recipe",
    }),
  ],
  site,
});
