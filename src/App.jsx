import { useCallback, useEffect, useState } from "react";
import { inviteData, getSchedule } from "./data/inviteData";
import { PRELOAD, ASSETS } from "./config/assets";
import { useMotionOk } from "./hooks/useReducedMotion";
import { useMusic } from "./hooks/useMusic";
import { cx, firstWord, hasText } from "./utils/text";

import Intro from "./components/Intro/Intro";
import Hero from "./components/Hero/Hero";
import Families from "./components/Families/Families";
import Events from "./components/Events/Events";
import Gallery from "./components/Gallery/Gallery";
import Rsvp from "./components/Rsvp/Rsvp";
import Footer from "./components/Footer/Footer";
import MusicButton from "./components/MusicButton/MusicButton";

const sideKey = () => `rp-side:${window.location.pathname}`;

export default function App() {
  const data = inviteData;
  const motionOk = useMotionOk();
  const music = useMusic(data.music);

  // Intro gate: `open` starts the hero animation, `gone` = gate fully removed
  const hasIntro = data.intro.enabled;
  const [open, setOpen] = useState(!hasIntro);
  const [gone, setGone] = useState(!hasIntro);
  const onReveal = useCallback(() => setOpen(true), []);
  const onGone = useCallback(() => setGone(true), []);

  // Which side (groom / bride) the guest picked – remembered between visits
  const [side, setSide] = useState("one");
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(sideKey());
        if (saved === "one" || saved === "two") setSide(saved);
      } catch {
        /* storage unavailable */
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  const pickSide = useCallback((next) => {
    setSide(next);
    try {
      window.localStorage.setItem(sideKey(), next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Warm the cache with the above-the-fold images
  useEffect(() => {
    const urls = hasIntro ? [ASSETS.introPoster, ...PRELOAD] : PRELOAD;
    urls.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [hasIntro]);

  const { families, events, gallery, rsvp, footer, hero } = data;
  const showFamilies = [
    families.heading,
    families.one.name,
    families.one.parents.text,
    families.two.name,
    families.two.parents.text,
  ].some(hasText);
  const showEvents = events.one.items.length > 0 || events.two.items.length > 0;
  const showGallery = gallery.photos.length > 0;
  const showFooter = hasText(footer.heading) || hasText(footer.message) || hasText(footer.signed);

  return (
    <main
      className={cx("rajasthan-palace", motionOk && "rp-motion")}
      // protect artwork from long-press / right-click save, but keep form fields usable
      onContextMenu={(e) => {
        if (!e.target?.closest?.("input, textarea")) e.preventDefault();
      }}
    >
      <div className="rp-stage">
        <Hero data={hero} open={open} over={open && !gone} />
        {showFamilies && <Families data={families} />}
        {showEvents && (
          <Events
            data={events}
            schedule={getSchedule(events, side)}
            onSide={pickSide}
            names={{ one: firstWord(hero.partnerOne), two: firstWord(hero.partnerTwo) }}
          />
        )}
        {showGallery && <Gallery data={gallery} />}
        <Rsvp data={rsvp} />
        {showFooter && <Footer data={footer} />}
      </div>

      {hasIntro && <Intro label={data.intro.unlockLabel} music={music} videoSrc={ASSETS.introVideo} onReveal={onReveal} onGone={onGone} />}
      <MusicButton music={music} />
    </main>
  );
}
