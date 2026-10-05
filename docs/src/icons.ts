/** The path data of an icon on a 24 grid. */
type IconPaths = readonly string[];

/**
 * The icon of each package, from Tabler Icons (MIT), the outline set that
 * lyn-ui uses.
 */
const packageIcons = {
  /** `code`: class names go on the elements of markup. */
  "class-recipe": ["M7 8l-4 4l4 4", "M17 8l4 4l-4 4", "M14 4l-4 16"],
  /** `device-mobile`: the styles go on React Native components. */
  "native-recipe": [
    "M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14",
    "M11 4h2",
    "M12 17v.01",
  ],
  /** `braces`: the engine reduces values of any type, such as objects. */
  recipe: [
    "M7 4a2 2 0 0 0 -2 2v3a2 3 0 0 1 -2 3a2 3 0 0 1 2 3v3a2 2 0 0 0 2 2",
    "M17 4a2 2 0 0 1 2 2v3a2 3 0 0 0 2 3a2 3 0 0 0 -2 3v3a2 2 0 0 1 -2 2",
  ],
} as const satisfies Readonly<Record<string, IconPaths>>;

/** The name of a package's icon, which is the name of its folder. */
type PackageIconName = keyof typeof packageIcons;

const iconsByName: ReadonlyMap<string, IconPaths> = new Map(
  Object.entries(packageIcons),
);

/** Returns the path data of `name`, or none when it names no icon. */
function packageIconPaths(name: string | undefined): IconPaths {
  return iconsByName.get(name ?? "") ?? [];
}

/** The icons of the links of a package, from Tabler Icons too. */
const linkIcons = {
  /** `history`: the versions of the package. */
  changelog: ["M12 8l0 4l2 2", "M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"],
  /** `brand-npm`. */
  npm: [
    "M1 8h22v7h-12v2h-4v-2h-6l0 -7",
    "M7 8v7",
    "M14 8v7",
    "M17 11v4",
    "M4 11v4",
    "M11 11v1",
    "M20 11v4",
  ],
  /** `player-play`: runs the example app of the package. */
  run: ["M7 4v16l13 -8l-13 -8"],
  /** `brand-github`: the source of the package. */
  source: [
    "M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5",
  ],
} as const satisfies Readonly<Record<string, IconPaths>>;

export { linkIcons, packageIconPaths };
export type { IconPaths, PackageIconName };
