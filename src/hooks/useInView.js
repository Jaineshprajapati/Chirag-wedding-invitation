import { useEffect, useState } from "react";
import { prefersReducedMotion } from "./useReducedMotion";

/** Becomes true (once) when `ref` scrolls into view. */
export function useInView(ref, rootMargin = "-10% 0px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      }
    }, { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}
