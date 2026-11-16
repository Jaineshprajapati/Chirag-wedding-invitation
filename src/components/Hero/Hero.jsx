import { useEffect, useState } from "react";
import { ASSETS } from "../../config/assets";
import { blessingEm, cx, firstText, hasText, maxLen } from "../../utils/text";
import { formatDateParts, formatTime, weekdayName } from "../../utils/date";
import Petals from "../common/Petals";
import ScratchCard from "./ScratchCard";
import Countdown from "./Countdown";
import "./Hero.css";

/**
 * First screen: sky + palace layers (parallax via CSS), Ganesh, names,
 * "Save the Date" scratch card and the countdown.
 * `open` = intro gate has been tapped, `over` = intro still fading out.
 */
export default function Hero({ data, open, over = false }) {
  const [scrolled, setScrolled] = useState(false);

  // hide the "Scroll down" cue after the first scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const iso = data.weddingDateISO;
  const ymd = iso.slice(0, 10);
  const parts = formatDateParts(ymd, true);
  const weekday = parts ? weekdayName(ymd) : "";
  const time = formatTime(iso.slice(11, 16));
  const hasBoth = hasText(data.partnerOne) && hasText(data.partnerTwo);

  // staggered entrance delay for each item, in order
  let step = 0;
  const item = (extra) => ({
    className: cx("rp-hero__item", extra),
    style: { "--d": `${120 + 150 * step++}ms` },
  });

  const deity = data.showDeity ? item("rp-hero__deity") : null;
  const blessing = hasText(data.blessing) ? item("rp-hero__blessing") : null;
  const intro = hasText(data.introLine) ? item("rp-hero__intro") : null;
  const names = item("rp-hero__names");

  return (
    <section
      className={cx("rp-hero", open ? "is-open" : "is-held", over && "is-over")}
      aria-label="Invitation"
    >
      <div className="rp-hero__layer is-back" aria-hidden="true">
        <div className="rp-hero__pin">
          <img className="rp-hero__plate" src={ASSETS.heroSky} alt="" draggable={false} fetchpriority="high" />
          <Petals />
        </div>
      </div>

      <div className="rp-hero__layer is-front" aria-hidden="true">
        <div className="rp-hero__pin">
          <img className="rp-hero__plate" src={ASSETS.heroFront} alt="" draggable={false} fetchpriority="high" />
        </div>
      </div>

      <p className={cx("rp-hero__cue", scrolled && "is-gone")} aria-hidden="true">
        <span>{firstText(data.scrollHint, "Scroll down")}</span>
        <svg className="rp-hero__chev" viewBox="0 0 16 22">
          <path d="M3 3l5 4.2L13 3" />
          <path d="M3 9.2l5 4.2 5-4.2" />
          <path d="M3 15.4l5 4.2 5-4.2" />
        </svg>
      </p>

      <div className="rp-hero__content">
        <div className="rp-hero__lead">
          {deity && (
            <div {...deity}>
              <span className="rp-hero__glow" aria-hidden="true" />
              <img
                className="rp-ganesh"
                src={ASSETS.ganesh}
                alt="Shri Ganesh"
                width={360}
                height={466}
                draggable={false}
                decoding="async"
                fetchpriority="high"
              />
            </div>
          )}

          {blessing && (
            <p {...blessing} style={{ ...blessing.style, "--rp-bless-em": String(blessingEm(data.blessing)) }}>
              {data.blessing}
            </p>
          )}

          {intro && <p {...intro}>{data.introLine}</p>}

          <h1
            className={names.className}
            aria-label={hasBoth ? `${data.partnerOne} ${data.partnerJoiner} ${data.partnerTwo}` : undefined}
            style={{ ...names.style, "--rp-name-len": String(maxLen(6, data.partnerOne, data.partnerTwo)) }}
          >
            <span className="rp-hero__name">{data.partnerOne}</span>
            {hasBoth && (
              <span className="rp-hero__amp" aria-hidden="true">
                {data.partnerJoiner}
              </span>
            )}
            <span className="rp-hero__name">{data.partnerTwo}</span>
          </h1>
        </div>

        {parts && (
          <>
            <p className="rp-hero__save">{firstText(data.saveHeading, "Save the Date")}</p>

            <ScratchCard
              kicker={firstText(data.scratchKicker, "SCRATCH TO UNLOCK")}
              title={firstText(data.scratchTitle, "THE DATE")}
              hint={firstText(data.scratchHint, "Rub the gold with your finger")}
            >
              <span className="rp-date">
                {hasText(weekday) && <span className="rp-date__weekday">{weekday}</span>}
                <span className="rp-date__day">{parts.day}</span>
                <span className="rp-date__my">
                  {parts.month} {parts.year}
                </span>
                {hasText(time) && <span className="rp-date__time">{time}</span>}
              </span>
            </ScratchCard>

            <Countdown iso={iso} />
          </>
        )}
      </div>
    </section>
  );
}
