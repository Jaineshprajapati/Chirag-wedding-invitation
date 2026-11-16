import { useRef } from "react";
import { useInView } from "../../hooks/useInView";
import { cx } from "../../utils/text";

/** Heading text whose words rise in one after another when scrolled into view. */
export default function WordReveal({ text, className, step = 70, delay = 0 }) {
  const ref = useRef(null);
  const seen = useInView(ref, "0px 0px -10% 0px");
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <span ref={ref} className={cx("rp-words", seen && "is-in", className)}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="rp-words__w"
          style={{ transitionDelay: `${delay + i * step}ms` }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
