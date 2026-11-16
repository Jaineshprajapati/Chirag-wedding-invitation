import { useRef } from "react";
import { ASSETS } from "../../config/assets";
import { cx, firstText, hasText } from "../../utils/text";
import Reveal from "../common/Reveal";
import WordReveal from "../common/WordReveal";
import { STARS } from "./stars";
import { useShootingStar } from "./useShootingStar";
import { useWishLanterns } from "./useWishLanterns";
import "./Footer.css";

/** "Thank You" – starry sky, shooting stars and tap-to-launch wish lanterns. */
export default function Footer({ data }) {
  const sectionRef = useRef(null);
  const shot = useShootingStar(sectionRef);
  const { lanterns, said, launch } = useWishLanterns(data.wishes);

  return (
    <section className="rp-section rp-footer" ref={sectionRef}>
      <img className="rp-footer__sky" src={ASSETS.footerSky} alt="" loading="lazy" decoding="async" draggable={false} />

      <span className="rp-footer__stars" aria-hidden="true">
        {STARS.map((s, i) => (
          <i
            key={i}
            className={cx(s.bright && "is-bright", shot?.star === i && "is-shot")}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              "--dur": `${s.dur.toFixed(2)}s`,
              "--delay": `${s.delay.toFixed(2)}s`,
            }}
          />
        ))}
        {shot && (
          <span
            key={shot.id}
            className="rp-footer__shoot"
            style={{
              left: `${STARS[shot.star].x}%`,
              top: `${STARS[shot.star].y}%`,
              "--ang": `${shot.angle.toFixed(1)}deg`,
              "--len": String(shot.len.toFixed(1)),
            }}
          />
        )}
      </span>

      <span className="rp-footer__lanterns" aria-hidden="true">
        {lanterns.map((l) => (
          <span
            key={l.id}
            className="rp-lantern"
            style={{
              left: `${l.x}%`,
              "--dx": String(l.dx.toFixed(1)),
              "--dur": `${l.dur.toFixed(2)}s`,
              "--delay": `${l.delay.toFixed(2)}s`,
              "--s": String(l.scale.toFixed(2)),
            }}
          >
            <span className="rp-lantern__sway">
              <span className="rp-lantern__glow" />
              <img className="rp-lantern__art" src={ASSETS.footerLantern} alt="" draggable={false} decoding="async" />
              {hasText(l.wish) && <span className="rp-lantern__wish">{l.wish}</span>}
            </span>
          </span>
        ))}
      </span>

      <img className="rp-footer__front" src={ASSETS.footerFront} alt="" loading="lazy" decoding="async" draggable={false} />

      <div className="rp-footer__inner">
        {hasText(data.heading) && (
          <h2 className="rp-footer__heading">
            <WordReveal text={data.heading} step={140} />
          </h2>
        )}

        {hasText(data.message) && (
          <Reveal kind="fade" delay={200}>
            <p className="rp-footer__message">{data.message}</p>
          </Reveal>
        )}

        {(hasText(data.signoff) || hasText(data.signed)) && (
          <Reveal kind="rise" delay={320} className="rp-footer__sign">
            {hasText(data.signoff) && <span className="rp-footer__signoff">{data.signoff}</span>}
            {hasText(data.signed) && <span className="rp-footer__signed">{data.signed}</span>}
          </Reveal>
        )}

        {hasText(data.hashtag) && <p className="rp-footer__tag">{data.hashtag}</p>}

        <Reveal kind="rise" delay={460}>
          <button type="button" className="rp-footer__wish" onClick={launch}>
            <span className="rp-footer__wish-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 2.5v1.6M8.4 5.2h7.2l1.6 2.2c1.3 1.9 1.6 4.6.9 7.4l-.9 3.4H6.8l-.9-3.4c-.7-2.8-.4-5.5.9-7.4l1.6-2.2Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path d="M7.6 18.2h8.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path
                  className="rp-footer__wish-flame"
                  d="M12 15.4c-1 0-1.6-.8-1.6-1.6 0-1.1 1.6-2.4 1.6-2.4s1.6 1.3 1.6 2.4c0 .8-.6 1.6-1.6 1.6Z"
                />
              </svg>
            </span>
            <span className="rp-footer__wish-text">{firstText(data.button, "Send a Wish Lantern")}</span>
          </button>
        </Reveal>

        <p className="rp-footer__said" role="status" aria-live="polite">
          {said}
        </p>
      </div>
    </section>
  );
}
