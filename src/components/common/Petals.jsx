/** Drifting flower petals (used on the hero and RSVP skies). */
const PETALS = [
  { kind: "is-rose", y: 18, size: 1, dur: 15, delay: 0, drift: 22 },
  { kind: "is-marigold", y: 30, size: 0.8, dur: 18, delay: -4, drift: 14 },
  { kind: "is-rose", y: 42, size: 1.2, dur: 16, delay: -9, drift: 18 },
  { kind: "is-blush", y: 24, size: 0.7, dur: 21, delay: -13, drift: 26 },
  { kind: "is-marigold", y: 52, size: 1, dur: 14, delay: -6, drift: 12 },
  { kind: "is-rose", y: 60, size: 0.85, dur: 19, delay: -2, drift: 16 },
  { kind: "is-blush", y: 36, size: 1.1, dur: 17, delay: -11, drift: 20 },
  { kind: "is-marigold", y: 14, size: 0.75, dur: 20, delay: -15, drift: 24 },
  { kind: "is-rose", y: 48, size: 0.7, dur: 22, delay: -18, drift: 10 },
  { kind: "is-blush", y: 66, size: 0.9, dur: 16, delay: -7, drift: 8 },
  { kind: "is-marigold", y: 38, size: 1.15, dur: 18.5, delay: -16.5, drift: 15 },
  { kind: "is-rose", y: 28, size: 0.95, dur: 20.5, delay: -10, drift: 19 },
  { kind: "is-rose", y: 72, size: 0.9, dur: 13, delay: -3, drift: 14 },
  { kind: "is-marigold", y: 80, size: 0.8, dur: 15.5, delay: -8, drift: 10 },
  { kind: "is-blush", y: 56, size: 1, dur: 12.5, delay: -5.5, drift: 18 },
  { kind: "is-rose", y: 8, size: 0.75, dur: 14.5, delay: -12, drift: 20 },
  { kind: "is-marigold", y: 64, size: 1.1, dur: 16.5, delay: -1, drift: 12 },
  { kind: "is-blush", y: 86, size: 0.8, dur: 14, delay: -10.5, drift: 6 },
  { kind: "is-rose", y: 44, size: 0.8, dur: 12, delay: -7.5, drift: 16 },
  { kind: "is-marigold", y: 20, size: 0.9, dur: 13.5, delay: -2.5, drift: 22 },
];

export default function Petals({ count = 12 }) {
  return (
    <span className="rp-petals" aria-hidden="true">
      {PETALS.slice(0, count).map((p, i) => (
        <i
          key={i}
          className={p.kind}
          style={{
            "--y": `${p.y}%`,
            "--s": String(p.size),
            "--dur": `${p.dur}s`,
            "--delay": `${p.delay}s`,
            "--drift-f": String(p.drift / 400),
          }}
        />
      ))}
    </span>
  );
}
