import { fileURLToPath } from "node:url";
import path from "node:path";

import { foldersIn } from "./files.ts";

/** The root of the repository. */
const root = fileURLToPath(new URL("../../", import.meta.url));

/** The folder that holds the packages. */
const packagesFolder = path.join(root, "packages");

/** The folder name of each package in `packages`, such as `class-recipe`. */
function packageNames(): readonly string[] {
  return foldersIn(packagesFolder);
}

export { packageNames, packagesFolder, root };
