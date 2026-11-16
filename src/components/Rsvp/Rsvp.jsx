import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ASSETS, RSVP_SCROLL_ART } from "../../config/assets";
import { useInView } from "../../hooks/useInView";
import { prefersReducedMotion, useMotionOk } from "../../hooks/useReducedMotion";
import { useRsvp } from "../../hooks/useRsvp";
import { cx, firstText, hasText } from "../../utils/text";
import Petals from "../common/Petals";
import "./Rsvp.css";

const NAME_MAX = 80;
const PHONE_MAX = 10;
const NOTE_MAX = 600;

const digitsOnly = (v, max) => v.replace(/\D/g, "").slice(0, max);

/** Little "12/80" counter under each field. */
const Count = ({ value, max }) => (
  <p className="rp-field__count" aria-live="polite">
    {[...value].length}/{max}
  </p>
);

/**
 * RSVP: a parchment scroll that unrolls when it comes into view, with a
 * name / phone / attendance / note form. After sending, the scroll shows a
 * thank-you seal and the page glides back to the top of the section.
 */
export default function Rsvp({ data }) {
  const sectionRef = useRef(null);
  const scrollRef = useRef(null);
  const paperRef = useRef(null);
  const bottomRef = useRef(null);

  const motionOk = useMotionOk();
  const unrolled = useInView(sectionRef, "0px 0px -65% 0px");
  const submit = useRsvp();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attendance, setAttendance] = useState(""); // "attending" | "declined"
  const [note, setNote] = useState("");
  const [missing, setMissing] = useState([]); // keys that failed client validation
  const [serverErrors, setServerErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState(null);
  const [sent, setSent] = useState(false);

  // Distance the scroll's bottom roller travels when unrolling (CSS var --rp-roll)
  useLayoutEffect(() => {
    const scroll = scrollRef.current;
    const paper = paperRef.current;
    const bottom = bottomRef.current;
    if (!motionOk || !scroll || !paper || !bottom) return;
    const measure = () => {
      const roll = bottom.offsetTop + bottom.offsetWidth * RSVP_SCROLL_ART.rodTop * 0.85 - paper.offsetTop;
      scroll.style.setProperty("--rp-roll", `${Math.max(0, Math.round(roll))}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(paper);
    ro.observe(bottom);
    return () => ro.disconnect();
  }, [motionOk]);

  // After a successful send, bring the section back into view
  useEffect(() => {
    if (!sent) return;
    const smooth = !prefersReducedMotion();
    const t1 = window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    }, 80);
    const t2 = window.setTimeout(
      () => {
        const el = sectionRef.current;
        if (el && Math.abs(el.getBoundingClientRect().top) > 4) el.scrollIntoView({ behavior: "auto", block: "start" });
      },
      smooth ? 1100 : 160,
    );
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [sent]);

  const clearServerError = (key) =>
    setServerErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });

  async function onSubmit(e) {
    e.preventDefault();
    if (sending) return;

    const trimmedName = name.trim();
    if (!trimmedName) return setFormError("Please add your name.");

    const absent = [];
    if (phone.length !== PHONE_MAX) absent.push("phone");
    if (!attendance) absent.push("attendance");
    setMissing(absent);
    if (absent.length) return setFormError("A few answers are still needed.");

    setSending(true);
    setFormError(null);
    setServerErrors({});
    const result = await submit({
      displayName: trimmedName,
      answers: [
        { question_key: "phone", answer: phone },
        { question_key: "attendance", answer: attendance },
        ...(note.trim() ? [{ question_key: "note", answer: note.trim() }] : []),
      ],
    });
    setSending(false);

    if (result.ok) {
      setSent(true);
    } else if (result.fields && Object.keys(result.fields).length) {
      setServerErrors(result.fields);
    } else {
      setFormError(result.message || "We could not send your reply. Please try again.");
    }
  }

  const declined = attendance === "declined";
  const heading = sent
    ? declined
      ? firstText(data.sentNoHeading, "You Will Be Missed")
      : firstText(data.sentYesHeading, "See You There!")
    : data.heading;
  const thanks = declined
    ? firstText(data.thankYouDecline, "Thank you for letting us know. You will be missed.")
    : firstText(data.thankYouAccept, "Thank you. We cannot wait to celebrate with you.");

  const fieldError = (key, fallback) =>
    serverErrors[key] || missing.includes(key) ? (
      <p className="rp-field__error" role="alert">
        {serverErrors[key] ?? fallback}
      </p>
    ) : null;

  return (
    <section className="rp-section rp-rsvp" id="rp-rsvp" ref={sectionRef}>
      <div className="rp-rsvp__layer is-back" aria-hidden="true">
        <div className="rp-rsvp__pin">
          <img className="rp-rsvp__plate" src={ASSETS.rsvpSky} alt="" loading="lazy" decoding="async" draggable={false} />
          <Petals count={20} />
        </div>
      </div>

      <div className="rp-rsvp__layer is-front" aria-hidden="true">
        <div className="rp-rsvp__pin">
          <img className="rp-rsvp__plate" src={ASSETS.rsvpFront} alt="" loading="lazy" decoding="async" draggable={false} />
        </div>
      </div>

      <div className="rp-rsvp__stage">
        <div ref={scrollRef} className={cx("rp-scroll", motionOk && "is-armed", unrolled && "is-open")}>
          <img
            className="rp-scroll__top"
            src={ASSETS.rsvpScrollTop}
            width={1000}
            height={732}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
          />

          <div ref={paperRef} className="rp-scroll__paper" style={{ "--rp-paper-art": `url("${ASSETS.rsvpPaper}")` }}>
            <p className="rp-rsvp__kicker" aria-hidden="true">
              <span>{firstText(data.kicker, "RSVP")}</span>
            </p>

            {hasText(heading) && <h2 className="rp-rsvp__heading">{heading}</h2>}
            <span className="rp-rsvp__rule" aria-hidden="true" />

            {sent ? (
              <p className="rp-rsvp__note is-sent">{firstText(data.sentNote, "Your reply has reached the family.")}</p>
            ) : (
              hasText(data.note) && <p className="rp-rsvp__note">{data.note}</p>
            )}

            {sent ? (
              <div className="rp-rsvp__thanks" role="status">
                <span className="rp-rsvp__seal" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="m6.5 12.5 3.6 3.6 7.4-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p className="rp-rsvp__thanks-text">{thanks}</p>
              </div>
            ) : (
              <form className="rp-rsvp__form" onSubmit={onSubmit} noValidate>
                {/* name */}
                <div className="rp-field">
                  <label className="rp-label" htmlFor="rp-rsvp-name">
                    {firstText(data.nameLabel, "Full name")}
                  </label>
                  <input
                    id="rp-rsvp-name"
                    className="rp-input"
                    type="text"
                    autoComplete="name"
                    maxLength={NAME_MAX}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      clearServerError("display_name");
                    }}
                  />
                  <Count value={name} max={NAME_MAX} />
                  {serverErrors.display_name && (
                    <p className="rp-field__error" role="alert">
                      {serverErrors.display_name}
                    </p>
                  )}
                </div>

                {/* phone */}
                <div className="rp-field">
                  <label className="rp-label" htmlFor="rp-rsvp-phone">
                    {firstText(data.phoneLabel, "Phone number")} *
                  </label>
                  <input
                    id="rp-rsvp-phone"
                    className="rp-input"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="tel-national"
                    maxLength={PHONE_MAX}
                    value={phone}
                    onChange={(e) => {
                      setPhone(digitsOnly(e.target.value, PHONE_MAX));
                      clearServerError("phone");
                    }}
                  />
                  <Count value={phone} max={PHONE_MAX} />
                  {fieldError("phone", "Please enter a 10-digit phone number.")}
                </div>

                {/* attendance */}
                <div className="rp-field">
                  <span className="rp-label">{firstText(data.attendanceLabel, "Will you be attending?")} *</span>
                  <div className="rp-attend">
                    {[
                      ["attending", firstText(data.acceptLabel, "Joyfully Accept")],
                      ["declined", firstText(data.declineLabel, "Regretfully Decline")],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        className={cx("rp-attend__btn", attendance === value && "is-on")}
                        aria-pressed={attendance === value}
                        onClick={() => {
                          setAttendance(value);
                          clearServerError("attendance");
                        }}
                      >
                        <span className="rp-attend__box" aria-hidden="true" />
                        {label}
                      </button>
                    ))}
                  </div>
                  {fieldError("attendance", "This one is needed.")}
                </div>

                {/* note */}
                <div className="rp-field">
                  <label className="rp-label" htmlFor="rp-rsvp-note">
                    {firstText(data.noteLabel, "A note for the couple")}
                  </label>
                  <textarea
                    id="rp-rsvp-note"
                    className="rp-input rp-input--area"
                    rows={3}
                    maxLength={NOTE_MAX}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <Count value={note} max={NOTE_MAX} />
                </div>

                <button type="submit" className="rp-submit" disabled={sending}>
                  <span className="rp-submit__label">
                    {sending ? "Sending…" : firstText(data.submitLabel, "Send reply")}
                  </span>
                </button>

                {formError && (
                  <p className="rp-field__error is-center" role="alert">
                    {formError}
                  </p>
                )}
              </form>
            )}
          </div>

          <img
            ref={bottomRef}
            className="rp-scroll__bottom"
            src={ASSETS.rsvpScrollBottom}
            width={1000}
            height={155}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}
