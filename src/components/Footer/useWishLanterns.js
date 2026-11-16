import { useCallback, useEffect, useRef, useState } from "react";
import { LANTERN_LANES } from "./stars";

/**
 * Wish lanterns: each tap launches a lantern carrying one of the wishes.
 * Lanes are picked so lanterns never overlap, and launches are queued/skipped
 * if the sky is too busy.
 */
export function useWishLanterns(wishes) {
  const [lanterns, setLanterns] = useState([]);
  const [said, setSaid] = useState("");
  const nextId = useRef(1);
  const lastWish = useRef(-1);
  const recent = useRef([]); // { x, at } of recent launches
  const timers = useRef([]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  const launch = useCallback(() => {
    const made = [];
    const lantern = (o) => ({
      id: nextId.current++,
      x: 18 + 64 * Math.random(),
      dx: (Math.random() - 0.5) * 30,
      dur: 9 + 3 * Math.random(),
      delay: 0,
      scale: 0.85 + 0.25 * Math.random(),
      wish: "",
      ...o,
    });

    if (wishes.length > 0) {
      const now = Date.now();
      recent.current = recent.current.filter((r) => now - r.at < 15000);

      // centre lane first when the sky is empty; otherwise shuffle the side lanes
      const lanes =
        recent.current.length === 0
          ? LANTERN_LANES
          : [...LANTERN_LANES.slice(1).sort(() => Math.random() - 0.5), LANTERN_LANES[0]];

      // choose the lane that frees up soonest
      let best = lanes[0];
      let wait = Infinity;
      for (const lane of lanes) {
        const w = recent.current.reduce(
          (acc, r) => (Math.abs(r.x - lane) < 44 ? Math.max(acc, r.at + 2400 - now) : acc),
          0,
        );
        if (w < wait) {
          wait = w;
          best = lane;
        }
      }
      if (wait / 1000 > 6) return; // too busy, ignore this tap

      const delay = Math.max(0, wait) / 1000;
      const x = best + (Math.random() - 0.5) * 4;
      recent.current.push({ x, at: now + delay * 1000 });

      // never repeat the same wish twice in a row
      let pick = Math.floor(Math.random() * wishes.length);
      if (wishes.length > 1 && pick === lastWish.current) {
        pick = (pick + 1 + Math.floor(Math.random() * (wishes.length - 1))) % wishes.length;
      }
      lastWish.current = pick;

      made.push(lantern({ x, dx: (Math.random() - 0.5) * 6, delay, scale: 1, wish: wishes[pick] }));
      setSaid(wishes[pick]);
    } else {
      // no wishes configured: just release a little flock of plain lanterns
      const n = 5 + Math.floor(3 * Math.random());
      for (let i = 0; i < n; i++) {
        made.push(
          lantern({
            x: 8 + ((i + Math.random()) / n) * 84,
            delay: 1.2 * Math.random(),
            scale: 0.55 + 0.4 * Math.random(),
            dur: 9.5 + 4 * Math.random(),
          }),
        );
      }
      setSaid("Lanterns are on their way up.");
    }

    setLanterns((prev) => [...prev, ...made].slice(-14));
    for (const l of made) {
      timers.current.push(
        window.setTimeout(() => setLanterns((prev) => prev.filter((p) => p.id !== l.id)), (l.dur + l.delay) * 1000 + 400),
      );
    }
  }, [wishes]);

  return { lanterns, said, launch };
}
