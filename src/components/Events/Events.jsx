import { useEffect, useRef } from "react";
import { ASSETS, EVENT_CARD_ART, SIDE_PICKER_ART } from "../../config/assets";
import { cx, firstText, hasText, maxLen } from "../../utils/text";
import WordReveal from "../common/WordReveal";
import EventCard from "./EventCard";
import SidePicker from "./SidePicker";
import { useEventsScroll } from "./useEventsScroll";
import "./Events.css";

/** All the artwork-measured CSS variables the stylesheet needs. */
const cssVars = (screens) => ({
  "--rp-ev-screens": String(screens),
  "--rp-card-art": `url("${ASSETS.eventCard}")`,
  "--rp-card-ratio": String(EVENT_CARD_ART.ratio),
  "--rp-card-top": String(EVENT_CARD_ART.top),
  "--rp-card-bottom": String(EVENT_CARD_ART.bottom),
  "--rp-card-inline": `${100 * EVENT_CARD_ART.inline}%`,
  "--rp-pick-ratio": String(SIDE_PICKER_ART.ratio),
  "--rp-plaque-top": `${100 * SIDE_PICKER_ART.plaqueTop}%`,
  "--rp-plaque-h": `${100 * SIDE_PICKER_ART.plaqueHeight}%`,
  "--rp-plaque-inline": `${100 * SIDE_PICKER_ART.plaqueInline}%`,
  "--rp-photo-left": `${100 * SIDE_PICKER_ART.photoLeft}%`,
  "--rp-photo-top": `${100 * SIDE_PICKER_ART.photoTop}%`,
  "--rp-photo-w": `${100 * SIDE_PICKER_ART.photoWidth}%`,
  "--rp-photo-h": `${100 * SIDE_PICKER_ART.photoHeight}%`,
});

/**
 * "Wedding Festivities". A tall, pinned section: the title + side picker and
 * every event card ride on a rail that scrolls upward as the page scrolls.
 */
export default function Events({ data, schedule, onSide, names }) {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const railRef = useRef(null);
  const windowRef = useRef(null);

  const { both, side, items } = schedule;
  const hasTitle = both || hasText(data.heading);
  const count = Math.max(1, items.length);

  useEventsScroll({
    sectionRef,
    railRef,
    windowRef,
    count,
    hasTitle,
    deps: [side],
  });

  // Plain (non-split) mode: shrink a long heading so it never overflows.
  useEffect(() => {
    const el = headingRef.current;
    if (!el || both) return;
    let raf = 0;
    const fit = () => {
      el.style.removeProperty("--rp-ev-fit");
      const ratio = el.scrollWidth / Math.max(1, el.clientWidth);
      if (ratio > 1.005) el.style.setProperty("--rp-ev-fit", String(Math.floor((0.97 / ratio) * 1000) / 1000));
    };
    const schedule_ = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    };
    schedule_();
    document.fonts?.ready.then(schedule_).catch(() => {});
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule_);
    ro?.observe(el.parentElement ?? el);
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      el.style.removeProperty("--rp-ev-fit");
    };
  }, [both, data.heading]);

  const labels = {
    one: firstText(data.one.label, names.one, "Partner 1"),
    two: firstText(data.two.label, names.two, "Partner 2"),
  };

  const pickSide = (key) => {
    if (key === side) return;
    onSide(key);
    // if the section is already scrolled past its top, bring it back to the start
    const section = sectionRef.current;
    if (section && section.getBoundingClientRect().top < -2) {
      window.scrollTo({ top: window.scrollY + section.getBoundingClientRect().top, behavior: "smooth" });
    }
  };

  return (
    <section
      className="rp-section rp-events"
      ref={sectionRef}
      style={cssVars(count + (hasTitle ? 1 : 0) + 0.25)}
    >
      <div className="rp-events__pin">
        <img className="rp-events__sky" src={ASSETS.eventsSky} alt="" loading="lazy" decoding="async" draggable={false} />

        <div className="rp-events__window" ref={windowRef}>
          <div className="rp-events__rail" ref={railRef}>
            {hasTitle && (
              <div className={cx("rp-events__panel is-title", !both && "is-plain")}>
                <div className="rp-events__title">
                  {hasText(data.heading) && (
                    <h2
                      ref={headingRef}
                      className="rp-heading rp-events__heading"
                      style={{ "--rp-ev-word": String(maxLen(6, ...data.heading.split(/\s+/))) }}
                    >
                      <WordReveal text={data.heading} step={90} />
                    </h2>
                  )}
                  {both && <SidePicker data={data} side={side} labels={labels} onPick={pickSide} />}
                </div>
              </div>
            )}

            {/* key = side, so the cards remount (and re-animate) when the side changes */}
            <ol
              key={both ? side : "all"}
              className="rp-events__list"
              role={both ? "tabpanel" : undefined}
              aria-label={both ? labels[side] : undefined}
            >
              {items.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  directionsLabel={data.directionsLabel}
                  calendarLabel={data.calendarLabel}
                />
              ))}
            </ol>
          </div>
        </div>

        <img className="rp-events__plate is-top" src={ASSETS.eventsTop} alt="" loading="lazy" decoding="async" draggable={false} />
        <img className="rp-events__plate is-bottom" src={ASSETS.eventsBottom} alt="" loading="lazy" decoding="async" draggable={false} />
      </div>
    </section>
  );
}
