/**
 * Builds the "Son of Mr. X & Mrs. Y" lines shown in the Families section.
 * Each line is an array of "pieces" that never break in the middle on mobile.
 */
export function familyLines(info, splitTwoLines) {
  if (!info || !info.text) return [];
  if (!info.line) return [[info.text.trim()]];
  const { lead, names } = info.line;
  const pieces = [lead, `${names[0]} ${info.joiner}`, names[1]];
  if (!splitTwoLines || names.length < 2) return [pieces];
  return [pieces.slice(0, -1), pieces.slice(-1)];
}

export const linesToStrings = (lines) => lines.map((l) => l.join(" "));
