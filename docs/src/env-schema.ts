import { envField } from "astro/config";

/** A token that a search engine verifies the site with, if the build has one. */
const siteVerification = envField.string({
  access: "public",
  context: "server",
  optional: true,
});

/** The environment variables that the build of the docs reads. */
const envSchema = {
  BAIDU_SITE_VERIFICATION: siteVerification,
  BING_SITE_VERIFICATION: siteVerification,
  GOOGLE_SITE_VERIFICATION: siteVerification,
  NAVER_SITE_VERIFICATION: siteVerification,
  YANDEX_SITE_VERIFICATION: siteVerification,
};

export { envSchema };
