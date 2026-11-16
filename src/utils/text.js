/** Small string helpers. */
export const hasText = (v) => typeof v === "string" && v.trim() !== "";

export const firstText = (...values) => {
  for (const v of values) if (hasText(v)) return v.trim();
  return "";
};

export const cx = (...parts) => parts.filter(Boolean).join(" ");

export const firstWord = (s) => s.trim().split(/\s+/)[0] ?? "";

/** max(floor, longest string length) – used for CSS length-based sizing vars. */
export const maxLen = (floor, ...strings) => {
  let max = floor;
  for (const s of strings) {
    if (typeof s !== "string") continue;
    const len = [...s.trim()].length;
    if (len > max) max = len;
  }
  return max;
};

// Advance widths (per 1000 em) of printable ASCII 32..126, used to estimate how
// wide the blessing line is so CSS can scale it to fit on one line.
const ASCII_WIDTHS = [250,230,315,536,469,684,646,170,338,338,386,481,185,380,179,406,596,344,553,503,583,498,560,502,552,560,179,185,481,481,481,413,977,712,586,760,807,577,541,798,813,338,324,657,562,931,841,838,577,837,677,475,618,785,740,982,662,661,651,332,406,332,523,500,439,663,570,705,760,546,523,742,746,336,309,624,536,878,779,774,553,777,627,462,578,700,663,899,626,640,608,337,245,337,493];

export function blessingEm(text) {
  let total = 0;
  for (const ch of text.trim()) {
    const code = ch.codePointAt(0);
    total += (code >= 32 && code <= 126 ? ASCII_WIDTHS[code - 32] / 1000 : 0.6) + 0.04;
  }
  return Math.max(6, Math.round(total * 100) / 100);
}
