import {
  BAIDU_SITE_VERIFICATION,
  BING_SITE_VERIFICATION,
  GOOGLE_SITE_VERIFICATION,
  NAVER_SITE_VERIFICATION,
  YANDEX_SITE_VERIFICATION,
} from "astro:env/server";
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
      {
        baidu: BAIDU_SITE_VERIFICATION,
        bing: BING_SITE_VERIFICATION,
        google: GOOGLE_SITE_VERIFICATION,
        naver: NAVER_SITE_VERIFICATION,
        yandex: YANDEX_SITE_VERIFICATION,
      },
      route.id === "404",
    ),
  );
});
