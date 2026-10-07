import { findPackage, packages } from "./packages.ts";
import type { PackageIconName } from "./icons.ts";
import type { PackageInfo } from "./packages.ts";

/** An element of the `<head>` of a page, as Starlight renders it. */
interface HeadEntry {
  readonly tag: "meta" | "script";
  readonly attrs: Readonly<Record<string, string>>;
  readonly content?: string;
}

/** What a page tells search engines and link previews about itself. */
interface PageInfo {
  /** The URL of the docs' home page, ending with a slash. */
  readonly siteUrl: string;
  readonly pageUrl: string;
  readonly siteTitle: string;
  readonly title: string;
  readonly description: string;
  /** The first segment of the page's path, which names its package, if any. */
  readonly folder: string;
}

/** An Open Graph image in `public`, which matches its text alternative. */
interface OpenGraphImage {
  readonly path: string;
  readonly alt: string;
}

/**
 * The token with which each search engine verifies that the site is ours,
 * or none when the build was given none.
 */
interface SiteVerification {
  readonly baidu: string | undefined;
  readonly bing: string | undefined;
  readonly google: string | undefined;
  readonly naver: string | undefined;
  readonly yandex: string | undefined;
}

/** A node of schema.org data. */
type LinkedData = Readonly<Record<string, unknown>>;

/** A node of schema.org data that other nodes refer to by its `@id`. */
interface LinkedNode extends LinkedData {
  readonly "@id": string;
}

const landingImage: OpenGraphImage = {
  alt: "lynstack recipe: variants in, styles out. Fast, type-safe recipes that map a component's variants to its class names, its React Native styles, or values of any type.",
  path: "og.png",
};

const packageImages = {
  "class-recipe": {
    alt: "lynstack class-recipe: variants in, class names out. cva, sva, and cx, a drop-in replacement for clsx.",
    path: "og/class-recipe.png",
  },
  "native-recipe": {
    alt: "lynstack native-recipe: variants in, styles out. React Native style recipes that return the same frozen style for the same variants.",
    path: "og/native-recipe.png",
  },
  recipe: {
    alt: "lynstack recipe: variants in, values out. The engine for recipes of any type.",
    path: "og/recipe.png",
  },
} as const satisfies Readonly<Record<PackageIconName, OpenGraphImage>>;

const imagesByFolder: ReadonlyMap<string, OpenGraphImage> = new Map(
  Object.entries(packageImages),
);

/** The name of the `<meta>` element that each search engine reads. */
const verificationNames: ReadonlyMap<string, string> = new Map(
  Object.entries({
    baidu: "baidu-site-verification",
    bing: "msvalidate.01",
    google: "google-site-verification",
    naver: "naver-site-verification",
    yandex: "yandex-verification",
  } satisfies Readonly<Record<keyof SiteVerification, string>>),
);

function verificationTags(verification: SiteVerification): HeadEntry[] {
  return Object.entries(verification).flatMap(
    ([engine, token]: readonly [string, string | undefined]) => {
      const name = verificationNames.get(engine);
      return name !== undefined && token !== undefined && token !== ""
        ? [{ attrs: { content: token, name }, tag: "meta" } as const]
        : [];
    },
  );
}

function openGraphProperty(property: string, content: string): HeadEntry {
  return { attrs: { content, property }, tag: "meta" };
}

function openGraphImageTags(siteUrl: string, folder: string): HeadEntry[] {
  const image = imagesByFolder.get(folder) ?? landingImage;
  return [
    openGraphProperty("og:image", `${siteUrl}${image.path}`),
    openGraphProperty("og:image:width", "1200"),
    openGraphProperty("og:image:height", "630"),
    openGraphProperty("og:image:alt", image.alt),
  ];
}

function packageNode(
  siteUrl: string,
  folder: string,
  pkg: PackageInfo,
): LinkedNode {
  const url = `${siteUrl}${folder}/`;
  return {
    "@id": `${url}#package`,
    "@type": "SoftwareSourceCode",
    codeRepository: pkg.source,
    description: pkg.summary,
    license: `https://spdx.org/licenses/${pkg.license}.html`,
    name: pkg.name,
    programmingLanguage: "TypeScript",
    url,
    version: pkg.version,
  };
}

/**
 * Describes the site, the page, and the packages it is about as schema.org
 * data: the landing page is a `WebPage` about every package, and a page of
 * a package is a `TechArticle` about that package.
 */
function structuredData(page: PageInfo): LinkedData {
  const websiteId = `${page.siteUrl}#website`;
  const pkg = findPackage(page.folder);
  const about = pkg
    ? [packageNode(page.siteUrl, page.folder, pkg)]
    : Object.entries(packages).map(
        ([folder, info]: readonly [string, PackageInfo]) =>
          packageNode(page.siteUrl, folder, info),
      );
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@id": websiteId,
        "@type": "WebSite",
        inLanguage: "en",
        name: page.siteTitle,
        url: page.siteUrl,
      },
      ...about,
      {
        "@id": page.pageUrl,
        "@type": pkg ? "TechArticle" : "WebPage",
        about: about.map((node) => ({ "@id": node["@id"] })),
        description: page.description,
        headline: page.title,
        inLanguage: "en",
        isPartOf: { "@id": websiteId },
        url: page.pageUrl,
      },
    ],
  };
}

/** Serializes `data` for a `<script>`, which must not contain `</script>`. */
function jsonLd(data: LinkedData): HeadEntry {
  return {
    attrs: { type: "application/ld+json" },
    content: JSON.stringify(data).replaceAll("<", String.raw`<`),
    tag: "script",
  };
}

/**
 * Returns the elements that a page adds to its `<head>`: the tokens that
 * search engines verify the site with, the Open Graph image of its package,
 * or of the landing page, and its structured data. The 404 page gets no
 * structured data.
 */
function seoHead(
  page: PageInfo,
  verification: SiteVerification,
  isNotFound: boolean,
): HeadEntry[] {
  const head = [
    ...verificationTags(verification),
    ...openGraphImageTags(page.siteUrl, page.folder),
  ];
  return isNotFound ? head : [...head, jsonLd(structuredData(page))];
}

export { seoHead };
export type { PageInfo, SiteVerification };
