const IST = "Asia/Kolkata";

/** "2027-02-12" -> Date at midnight IST, or null. */
function parseISTDate(ymd) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const d = new Date(`${ymd}T00:00:00+05:30`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** { day: "12", month: "Feb"|"February", year: "2027" } */
export function formatDateParts(ymd, longMonth = false) {
  const d = parseISTDate(ymd);
  if (!d) return null;
  const fmt = (opts) =>
    new Intl.DateTimeFormat("en-IN", { timeZone: IST, numberingSystem: "latn", ...opts }).format(d);
  return {
    day: fmt({ day: "2-digit" }),
    month: fmt({ month: longMonth ? "long" : "short" }),
    year: fmt({ year: "numeric" }),
  };
}

export function weekdayName(ymd) {
  const d = parseISTDate(ymd);
  if (!d) return "";
  return new Intl.DateTimeFormat("en-IN", { timeZone: IST, weekday: "long" }).format(d);
}

/** "19:00" -> "7:00 PM" */
export function formatTime(hhmm) {
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(hhmm);
  if (!m) return "";
  const h = Number(m[1]);
  return `${h % 12 || 12}:${m[2]} ${h < 12 ? "AM" : "PM"}`;
}

/** Remaining time until an ISO string. */
export function timeLeft(iso, now = Date.now()) {
  if (!iso) return null;
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return null;
  let s = Math.floor((target - now) / 1000);
  if (s <= 0) return { arrived: true };
  const days = Math.floor(s / 86400);
  s -= days * 86400;
  const hours = Math.floor(s / 3600);
  s -= hours * 3600;
  const minutes = Math.floor(s / 60);
  return { arrived: false, days, hours, minutes, seconds: s - minutes * 60 };
}
