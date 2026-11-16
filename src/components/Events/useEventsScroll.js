import { useEffect } from "react";
import { prefersReducedMotion } from "../../hooks/useReducedMotion";

/**
 * Drives the signature "pinned" scroll of the events section.
 *
 * The section is made tall (min-height); inside it the .rp-events__pin stays
 * sticky while the vertical scroll distance is mapped onto a translateY of the
 * rail that holds the title + all event cards, so the cards glide upward
 * through a fixed window.
 */
export function useEventsScroll({ sectionRef, railRef, windowRef, count, hasTitle, deps }) {
  useEffect(() => {
    const section = sectionRef.current;
    const rail = railRef.current;
    const win = windowRef.current;
    if (!section || !rail || !win || prefersReducedMotion()) return;

    let raf = 0;
    let visible = false;
    let lastY = NaN;
    const m = { frameH: 1, winH: 1, end: 0, scroll: 1 };

    const measure = () => {
      const pin = section.firstElementChild instanceof HTMLElement ? section.firstElementChild : null;
      m.frameH = pin?.clientHeight || window.innerHeight || 1;
      m.winH = win.clientHeight || 1;
      const titlePanel = hasTitle && rail.firstElementChild instanceof HTMLElement ? rail.firstElementChild : null;
      m.end = (titlePanel ? titlePanel.offsetHeight : 0) + (count - 1) * m.winH;
      m.scroll = (count - (titlePanel ? 0 : 1) + 0.3) * m.frameH;
      const tail = 0.22 * m.frameH;
      section.style.minHeight = `${Math.ceil(m.frameH + m.scroll + tail)}px`;
      lastY = NaN;
    };
    measure();

    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    ro?.observe(rail);
    ro?.observe(win);

    const frame = () => {
      const scrolled = Math.max(0, -section.getBoundingClientRect().top);
      const y = Math.round(10 * Math.min(m.end, (scrolled * m.end) / m.scroll)) / 10;
      if (y !== lastY) {
        lastY = y;
        rail.style.transform = `translate3d(0, ${-y}px, 0)`;
      }
      raf = visible ? requestAnimationFrame(frame) : 0;
    };

    // only run the rAF loop while the section is near the viewport
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(frame);
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(section);

    return () => {
      io.disconnect();
      ro?.disconnect();
      if (raf) cancelAnimationFrame(raf);
      rail.style.transform = "";
      section.style.minHeight = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, hasTitle, ...deps]);
}
