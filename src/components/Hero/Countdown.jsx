import { useCountdown } from "../../hooks/useCountdown";

const two = (n) => (n === undefined ? "--" : String(n).padStart(2, "0"));

/** Live days / hours / mins / secs until the wedding. */
export default function Countdown({ iso }) {
  const state = useCountdown(iso);
  if (!iso || state === null) return null;

  if (state !== "pending" && state.arrived) {
    return <p className="rp-count__arrived">Today is the day</p>;
  }
  const t = state === "pending" ? undefined : state;
  const cells = [
    [two(t?.days), "Days"],
    [two(t?.hours), "Hours"],
    [two(t?.minutes), "Mins"],
    [two(t?.seconds), "Secs"],
  ];
  return (
    <div className="rp-count" role="timer" aria-live="off">
      {cells.map(([value, label]) => (
        <div className="rp-count__cell" key={label}>
          <span className="rp-count__value">{value}</span>
          <span className="rp-count__label">{label}</span>
        </div>
      ))}
    </div>
  );
}
