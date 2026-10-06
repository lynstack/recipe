/** The lines that differ between two texts, numbered from 1. */
interface LineDiff {
  /** The lines of the first text that the second does not keep. */
  readonly removed: readonly number[];
  /** The lines of the second text that the first does not have. */
  readonly added: readonly number[];
}

interface Lines {
  readonly before: readonly string[];
  readonly after: readonly string[];
}

interface Position {
  readonly row: number;
  readonly column: number;
}

/** What one step of a diff does: keep a line, remove one, or add one. */
type Move = "add" | "keep" | "remove";

/**
 * Returns, for each pair of positions in the lines, the length of the
 * longest common sequence of the lines from there on, one row per line
 * of `before`.
 */
function commonLengths({ before, after }: Lines): Int32Array {
  const width = after.length + 1;
  const lengths = new Int32Array((before.length + 1) * width);
  for (let row = before.length - 1; row >= 0; row -= 1) {
    for (let column = after.length - 1; column >= 0; column -= 1) {
      const below = lengths[(row + 1) * width + column] ?? 0;
      const right = lengths[row * width + column + 1] ?? 0;
      const diagonal = lengths[(row + 1) * width + column + 1] ?? 0;
      lengths[row * width + column] =
        before[row] === after[column] ? diagonal + 1 : Math.max(below, right);
    }
  }
  return lengths;
}

/** Returns the move of a diff at `position`, which is not at the end. */
function moveAt(
  { before, after }: Lines,
  lengths: Int32Array,
  { row, column }: Position,
): Move {
  if (row < before.length && before[row] === after[column]) {
    return "keep";
  }
  const width = after.length + 1;
  const removing = lengths[(row + 1) * width + column] ?? 0;
  const adding = lengths[row * width + column + 1] ?? 0;
  return column === after.length || (row < before.length && removing >= adding)
    ? "remove"
    : "add";
}

/** Returns the moves of a diff from `position` to the end of the lines. */
function movesFrom(
  lines: Lines,
  lengths: Int32Array,
  position: Position,
): readonly Move[] {
  if (
    position.row === lines.before.length &&
    position.column === lines.after.length
  ) {
    return [];
  }
  const move = moveAt(lines, lengths, position);
  const next = {
    column: position.column + (move === "remove" ? 0 : 1),
    row: position.row + (move === "add" ? 0 : 1),
  };
  return [move, ...movesFrom(lines, lengths, next)];
}

/** Returns the numbers of the lines that the moves of `change` touch. */
function linesOf(
  moves: readonly Move[],
  change: Exclude<Move, "keep">,
): readonly number[] {
  return moves
    .filter((move) => move === change || move === "keep")
    .flatMap((move, index) => (move === change ? [index + 1] : []));
}

/**
 * Compares two texts line by line, keeping the longest common sequence of
 * lines, as a unified diff does.
 */
function diffLines(before: string, after: string): LineDiff {
  const lines = {
    after: after.trimEnd().split("\n"),
    before: before.trimEnd().split("\n"),
  };
  const moves = movesFrom(lines, commonLengths(lines), { column: 0, row: 0 });
  return { added: linesOf(moves, "add"), removed: linesOf(moves, "remove") };
}

export { diffLines };
export type { LineDiff };
