import { useState } from "react";
import { illustrationUrl } from "../../config/assets";
import { downloadICS, directionsUrl } from "../../utils/calendar";
import { formatDateParts, formatTime, weekdayName } from "../../utils/date";
import { firstText, hasText } from "../../utils/text";

/** One festival card: illustration, date stamp, venue, calendar + directions. */
export default function EventCard({ event, directionsLabel, calendarLabel }) {
  const [calState, setCalState] = useState("idle"); // idle | done | failed

  const pic = illustrationUrl(event.illustration);
  const parts = formatDateParts(event.date);
  const weekday = parts ? weekdayName(event.date) : "";
  const time = formatTime(event.time);
  const mapHref = directionsUrl(event.mapUrl, event.venue, event.address);
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(event.date);

  const addToCalendar = () => {
    const ok = downloadICS({
      name: event.name,
      date: event.date,
      time: event.time,
      venue: event.venue,
      address: event.address,
    });
    setCalState(ok ? "done" : "failed");
    window.setTimeout(() => setCalState("idle"), 2600);
  };

  return (
    <li className="rp-ev">
      <div className="rp-ev__frame">
        <span className="rp-ev__shadow" aria-hidden="true" />
        <article className="rp-card">
          <div className="rp-card__body">
            <div className="rp-card__head">
              {pic && (
                <span className="rp-card__pic">
                  <img
                    src={pic}
                    alt=""
                    loading="eager"
                    decoding="async"
                    draggable={false}
                    onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                  />
                </span>
              )}

              {parts && (
                <p className="rp-card__stamp">
                  <span className="rp-card__day">{parts.day}</span>
                  <span className="rp-card__my">
                    <span>{parts.month}</span>
                    <span>{parts.year}</span>
                  </span>
                </p>
              )}

              {hasText(event.name) && <h3 className="rp-card__name">{event.name}</h3>}

              {(hasText(weekday) || hasText(time)) && (
                <p className="rp-card__when">
                  {hasText(weekday) && <span>{weekday}</span>}
                  {hasText(weekday) && hasText(time) && <span className="rp-card__dot" aria-hidden="true" />}
                  {hasText(time) && <span>{time}</span>}
                </p>
              )}
            </div>

            {(hasText(event.venue) || hasText(event.address)) && (
              <p className="rp-card__place">
                {hasText(event.venue) && <span className="rp-card__venue">{event.venue}</span>}
                {hasText(event.address) && <span className="rp-card__address">{event.address}</span>}
              </p>
            )}

            {validDate && (
              <div className="rp-card__actions">
                <button type="button" className="rp-btn is-primary" onClick={addToCalendar}>
                  <svg className="rp-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3.5" y="5" width="17" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3.5 10h17M8 3.5v3M16 3.5v3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  {calState === "done" ? "Saved" : calState === "failed" ? "Try again" : firstText(calendarLabel, "Add to Calendar")}
                </button>
              </div>
            )}

            {calState === "failed" && (
              <p className="rp-card__feedback" role="status">
                Your browser blocked the download. Please allow it and try again.
              </p>
            )}

            {hasText(mapHref) && (
              <a className="rp-card__link" href={mapHref} target="_blank" rel="noopener noreferrer">
                <svg className="rp-card__link-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <span className="rp-card__link-text">{firstText(directionsLabel, "Get Directions")}</span>
              </a>
            )}
          </div>
        </article>
      </div>
    </li>
  );
}
