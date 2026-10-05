import { defineRouteMiddleware } from "@astrojs/starlight/route-data";

import { seoHead } from "./seo.ts";

export const onRequest = defineRouteMiddleware(({ locals, site, url }) => {
  const route = locals.starlightRoute;
  route.head.push(
    ...seoHead(
      {
        description: route.entry.data.description ?? "",
        folder: route.id.split("/")[0] ?? "",
        pageUrl: new URL(url.pathname, site).href,
        siteTitle: route.siteTitle,
        siteUrl: new URL("/recipe/", site).href,
        title: route.entry.data.title,
      },
      route.id === "404",
    ),
  );
});
