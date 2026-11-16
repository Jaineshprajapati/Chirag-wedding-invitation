import { useRef, useState } from "react";
import { ASSETS } from "../../config/assets";
import { cx, hasText } from "../../utils/text";
import Reveal from "../common/Reveal";
import WordReveal from "../common/WordReveal";
import "./Gallery.css";

/** "Our Moments" – a stack of pinned polaroids; swipe, tap arrows or dots. */
export default function Gallery({ data }) {
  const photos = data.photos;
  const total = photos.length;
  const canNavigate = total > 1;
  const [index, setIndex] = useState(0);
  const touchStart = useRef(null);

  const go = (delta) => setIndex((i) => (i + delta + total) % total);

  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = t ? { x: t.clientX, y: t.clientY } : null;
  };
  const onTouchEnd = (e) => {
    const start = touchStart.current;
    const t = e.changedTouches[0];
    touchStart.current = null;
    if (!start || !t || !canNavigate) return;
    const dx = t.clientX - start.x;
    // only a clear horizontal swipe counts
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(t.clientY - start.y)) go(dx < 0 ? 1 : -1);
  };

  return (
    <section className="rp-section rp-gallery">
      <img className="rp-art" src={ASSETS.galleryBg} alt="" loading="lazy" decoding="async" draggable={false} />

      {(hasText(data.heading) || hasText(data.subtitle)) && (
        <div className="rp-gallery__plaque">
          {hasText(data.heading) && (
            <h2 className="rp-heading rp-gallery__heading">
              <WordReveal text={data.heading} step={100} />
            </h2>
          )}
          {hasText(data.subtitle) && <p className="rp-gallery__sub">{data.subtitle}</p>}
        </div>
      )}

      <div className="rp-gallery__panel">
        <Reveal kind="zoom" delay={120} className="rp-gal">
          <div className="rp-gal__stack" aria-live="polite" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            {photos.map((photo, i) => {
              // position of this card relative to the active one
              const pos = (i - index + total) % total;
              const state =
                pos === 0 ? "active" : pos === 1 ? "next" : pos === total - 1 && total > 2 ? "prev" : "back";
              return (
                <div
                  key={photo.id}
                  className={`rp-gal__card is-${state}`}
                  style={{ "--j": String((i % 3) - 1) }} // slight alternating tilt
                  aria-hidden={pos !== 0 || undefined}
                >
                  <span className="rp-gal__pin" aria-hidden="true" />
                  <div
                    className="rp-gal__photo"
                    style={{ backgroundImage: `url(${photo.src})` }}
                    role="img"
                    aria-label={pos === 0 ? `Photo ${index + 1} of ${total}` : undefined}
                  />
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>

      {canNavigate && (
        <>
          <button type="button" className="rp-gal__arrow is-prev" onClick={() => go(-1)} aria-label="Previous photo">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="rp-gal__arrow is-next" onClick={() => go(1)} aria-label="Next photo">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="rp-gal__dots">
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                className={cx("rp-gal__dot", i === index && "is-on")}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
