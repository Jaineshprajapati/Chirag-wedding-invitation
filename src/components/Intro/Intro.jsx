import { useCallback, useEffect, useRef, useState } from "react";
import { ASSETS } from "../../config/assets";
import { prefersReducedMotion } from "../../hooks/useReducedMotion";
import { cx } from "../../utils/text";
import "./Intro.css";

/**
 * Full-screen "gate" shown before the invitation. The guest taps to open it:
 *   - with `videoSrc`: the gate video plays, then cross-fades into the hero
 *   - without it (or on slow / data-saver / reduced-motion): a simple fade
 * Music (if configured) starts on this tap, which also satisfies the browser's
 * autoplay-needs-a-gesture rule.
 *
 * onReveal -> hero should start its entrance animation
 * onGone   -> gate is fully removed
 */
export default function Intro({ label, music, videoSrc, onReveal, onGone }) {
  const [phase, setPhase] = useState("closed"); // closed | playing | fading | gone
  const [ready, setReady] = useState(false);

  const mode = useRef("fade"); // "fade" | "video"
  const videoRef = useRef(null);
  const pillRef = useRef(null);
  const tapped = useRef(false);
  const finished = useRef(false);
  const revealed = useRef(false);
  const timers = useRef([]);

  const reveal = useCallback(() => {
    if (revealed.current) return;
    revealed.current = true;
    onReveal();
  }, [onReveal]);

  // 1. Prepare: try to load the video, otherwise fall back to the fade.
  useEffect(() => {
    const conn = navigator.connection;
    if (!videoSrc || prefersReducedMotion() || conn?.saveData === true) {
      mode.current = "fade";
      setReady(true);
      return;
    }
    const ctrl = new AbortController();
    let objectUrl = "";
    let settled = false;
    let cancelled = false;
    const fallback = () => {
      if (settled || cancelled) return;
      settled = true;
      mode.current = "fade";
      setReady(true);
    };
    // fetch() can be blocked by CORS (e.g. on localhost). <video> playback is not,
    // so try streaming the file directly before giving up on the door animation.
    const direct = () => {
      if (settled || cancelled) return;
      const v = videoRef.current;
      if (!v) return fallback();
      let done = false;
      const ok = () => {
        if (done || settled || cancelled) return;
        done = true;
        settled = true;
        window.clearTimeout(timeout);
        mode.current = "video";
        setReady(true);
      };
      v.addEventListener("canplaythrough", ok, { once: true });
      v.addEventListener("loadeddata", ok, { once: true });
      v.addEventListener("error", () => { if (!done) { done = true; fallback(); } }, { once: true });
      v.preload = "auto";
      v.src = videoSrc;
      v.load();
    };
    const timeout = window.setTimeout(() => {
      ctrl.abort();
      fallback();
    }, 12000);

    fetch(videoSrc, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
      .then((blob) => {
        if (settled || cancelled) return;
        settled = true;
        window.clearTimeout(timeout);
        objectUrl = URL.createObjectURL(blob);
        const v = videoRef.current;
        if (!v) return fallback();
        v.src = objectUrl;
        v.load();
        mode.current = "video";
        setReady(true);
      })
      .catch(() => {
        if (settled || cancelled) return;
        direct();
      });

    return () => {
      cancelled = true;
      ctrl.abort();
      window.clearTimeout(timeout);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [videoSrc]);

  // 2. Lock page scroll while the gate is up.
  useEffect(() => {
    if (phase === "gone") return;
    const html = document.documentElement;
    const prev = [html.style.overflow, document.body.style.overflow];
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev[0];
      document.body.style.overflow = prev[1];
    };
  }, [phase]);

  // 3. Focus the button, and clean timers on unmount.
  useEffect(() => {
    pillRef.current?.focus({ preventScroll: true });
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  const finish = useCallback(
    (ms) => {
      if (finished.current) return;
      finished.current = true;
      setPhase("fading");
      reveal();
      timers.current.push(
        window.setTimeout(() => {
          setPhase("gone");
          onGone();
        }, ms),
      );
    },
    [reveal, onGone],
  );

  const open = useCallback(() => {
    if (tapped.current || phase !== "closed" || !ready) return;
    tapped.current = true;
    if (music?.available && !music.isPlaying) music.toggle();

    const video = videoRef.current;
    if (mode.current === "fade" || !video) return finish(1100);

    setPhase("playing");

    // watchdog: if playback stalls for 2.5 s, just fade out
    let lastTime = -1;
    let lastChange = Date.now();
    const watchdog = window.setInterval(() => {
      if (finished.current) return window.clearInterval(watchdog);
      if (video.currentTime !== lastTime) {
        lastTime = video.currentTime;
        lastChange = Date.now();
      } else if (Date.now() - lastChange > 2500) {
        window.clearInterval(watchdog);
        finish(900);
      }
    }, 250);
    timers.current.push(watchdog);

    let furthest = 0;
    const done = () => {
      window.clearInterval(watchdog);
      video.removeEventListener("timeupdate", onTime);
      finish(900);
    };
    const onTime = () => {
      const t = video.currentTime;
      if (t + 0.3 < furthest) {
        // user scrubbed backwards / video restarted: jump to the end
        video.pause();
        try {
          if (video.duration) video.currentTime = Math.max(0, video.duration - 0.05);
        } catch {
          /* ignore */
        }
        return done();
      }
      furthest = Math.max(furthest, t);
      if (video.duration && t >= video.duration - 1.93) reveal(); // start hero just before the end
      if (video.duration && t >= video.duration - 0.83) done();
    };
    video.addEventListener("timeupdate", onTime);
    if (typeof video.requestVideoFrameCallback === "function") {
      const onFrame = (_now, meta) => {
        if (finished.current) return;
        const d = video.duration;
        if (d && meta.mediaTime >= d - 1.93) reveal();
        if (d && meta.mediaTime >= d - 0.83) return done();
        video.requestVideoFrameCallback(onFrame);
      };
      video.requestVideoFrameCallback(onFrame);
    }
    video.addEventListener("ended", done, { once: true });
    video.addEventListener(
      "webkitbeginfullscreen",
      () => {
        video.webkitExitFullscreen?.();
        video.pause();
        done();
      },
      { once: true },
    );
    video.play().catch(done);
  }, [phase, ready, music, finish, reveal]);

  if (phase === "gone") return null;

  return (
    <div
      className={cx("rp-intro", `is-${phase}`, ready && "is-ready")}
      role="dialog"
      aria-modal="true"
      aria-label="Wedding invitation. Tap to open."
      onClick={open}
    >
      <img className="rp-intro__poster" src={ASSETS.introPoster} alt="" draggable={false} decoding="async" />
      <video
        className="rp-intro__video"
        ref={videoRef}
        muted
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="rp-intro__latch">
        <button ref={pillRef} type="button" className="rp-intro__pill" aria-busy={!ready}>
          <svg className="rp-intro__key" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5" y="10.5" width="14" height="10" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 6.8-1.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="12" cy="15.2" r="1.3" fill="currentColor" />
          </svg>
          <span>{ready ? label?.trim() || "Tap to open" : "Getting ready…"}</span>
        </button>
      </div>
    </div>
  );
}
