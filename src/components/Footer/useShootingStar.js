import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../../hooks/useReducedMotion";
import { STARS } from "./stars";

/**
 * Every few seconds, while the footer is on screen, one random star
 * streaks across the sky.
 */
export function useShootingStar(ref) {
  const [shot, setShot] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    let visible = false;
    let timer = 0;

    const schedule = () => {
      window.clearTimeout(timer);
      if (!visible) return;
      timer = window.setTimeout(() => {
        if (!visible) return;
        const star = Math.floor(Math.random() * STARS.length);
        const rightSide = STARS[star].x > 50;
        const base = 18 + 16 * Math.random();
        setShot({
          id: Date.now(),
          star,
          angle: rightSide ? 180 - base : base, // always shoot toward the middle
          len: 22 + 16 * Math.random(),
        });
        timer = window.setTimeout(() => {
          setShot(null);
          schedule();
        }, 3000);
      }, 3000 + 5000 * Math.random());
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      if (visible) schedule();
      else window.clearTimeout(timer);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [ref]);

  return shot;
}
