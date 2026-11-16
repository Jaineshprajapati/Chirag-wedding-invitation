import { useRef } from "react";
import { useInView } from "../../hooks/useInView";
import { cx } from "../../utils/text";

/**
 * Scroll-reveal wrapper. kind: "rise" | "zoom" | "fade".
 * Adds `is-in` once visible; the animation itself is pure CSS (.rp-reveal).
 */
export default function Reveal({ children, kind = "rise", delay = 0, className }) {
  const ref = useRef(null);
  const seen = useInView(ref, "0px 0px -12% 0px");
  return (
    <div
      ref={ref}
      className={cx("rp-reveal", `is-${kind}`, seen && "is-in", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
