import { mulberry32 } from "../../utils/seeded";

/** 40 deterministic twinkling stars (same sky on every load). */
const rand = mulberry32(0x1352901);

export const STARS = Array.from({ length: 40 }, () => {
  const dur = 2.6 + 4.2 * rand();
  return {
    x: 3 + 94 * rand(),
    y: 1.5 + 31 * Math.pow(rand(), 1.35),
    size: 1 + 1.6 * rand(),
    dur,
    delay: -rand() * dur,
    bright: rand() > 0.82,
  };
});

/** Horizontal slots (in %) where wish lanterns launch from. */
export const LANTERN_LANES = [50, 27, 73];
