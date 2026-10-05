/**
 * The icon of each package, from Tabler Icons (MIT), the outline set that
 * lyn-ui uses: the path data of each icon on a 24 grid.
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
} as const satisfies Readonly<Record<string, readonly string[]>>;

/** The name of a package's icon, which is the name of its folder. */
type PackageIconName = keyof typeof packageIcons;

const iconsByName: ReadonlyMap<string, readonly string[]> = new Map(
  Object.entries(packageIcons),
);

/** Returns the path data of `name`, or none when it names no icon. */
function packageIconPaths(name: string | undefined): readonly string[] {
  return iconsByName.get(name ?? "") ?? [];
}

export { packageIconPaths };
export type { PackageIconName };
