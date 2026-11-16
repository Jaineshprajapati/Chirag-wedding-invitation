const pad = (n) => String(n).padStart(2, "0");

const toICSDate = (d) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
  `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

const escapeICS = (s) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

function buildICS({ name, date, time, venue, address }) {
  const [hh, mm] = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time)?.slice(1) ?? ["09", "00"];
  const start = new Date(`${date}T${hh}:${mm}:00Z`);
  start.setUTCMinutes(start.getUTCMinutes() - 330); // IST -> UTC
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 h event
  const uid = `${date}-${Math.random().toString(36).slice(2, 10)}@wedding-invite`;
  const place = [venue, address].filter(Boolean).join(", ");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invite//Rajasthan Palace//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${escapeICS(name || "Wedding celebration")}`,
    place ? `LOCATION:${escapeICS(place)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

/** Downloads an .ics file. Returns true on success. */
export function downloadICS(event) {
  try {
    const blob = new Blob([buildICS(event)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(event.name || "event").replace(/[^\w\s-]/g, "").trim() || "event"}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch {
    return false;
  }
}

/** Safe maps URL: explicit http(s) link if valid, else a Google Maps search. */
export function directionsUrl(mapUrl, venue, address = "") {
  if (mapUrl) {
    try {
      const u = new URL(mapUrl.trim());
      if (u.protocol === "http:" || u.protocol === "https:") return u.toString();
    } catch {
      /* fall through */
    }
  }
  const q = [venue.trim(), address.trim()].filter(Boolean).join(", ");
  return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : "";
}
