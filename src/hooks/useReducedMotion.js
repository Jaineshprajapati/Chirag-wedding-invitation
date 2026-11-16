import { useEffect, useState } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** true once mounted AND the visitor has not asked for reduced motion. */
export function useMotionOk() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!prefersReducedMotion()) setOk(true);
  }, []);
  return ok;
}
