import { ASSETS } from "../../config/assets";
import { cx, firstText, hasText } from "../../utils/text";

/** "Whose side are you on?" – two windows (groom / bride) the guest taps. */
export default function SidePicker({ data, side, labels, onPick }) {
  return (
    <>
      {hasText(data.question) && <p className="rp-pick__ask">{data.question}</p>}

      <p className="rp-pick__hint" aria-hidden="true">
        <svg className="rp-pick__arrow is-left" viewBox="0 0 40 34">
          <path d="M4 6c13-1 24 6 26 21" />
          <path d="M23.5 21.5 30 28.5l5.5-7.5" />
        </svg>
        <span className="rp-pick__hint-text">{firstText(data.sideHint, "Tap a window to see its events")}</span>
        <svg className="rp-pick__arrow is-right" viewBox="0 0 40 34">
          <path d="M4 6c13-1 24 6 26 21" />
          <path d="M23.5 21.5 30 28.5l5.5-7.5" />
        </svg>
      </p>

      <div className="rp-pick" role="tablist" aria-label={firstText(data.question, "Whose events")}>
        {["one", "two"].map((key) => {
          const photo = data[key].photo;
          const label = labels[key];
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={side === key}
              className={cx("rp-pick__opt", side === key && "is-on")}
              onClick={() => onPick(key)}
            >
              <span className="rp-pick__win">
                <span className="rp-pick__glow" aria-hidden="true" />
                {hasText(photo) && <img className="rp-pick__photo" src={photo} alt="" draggable={false} decoding="async" />}
                <img className="rp-pick__art" src={ASSETS.sidePickerOpen} alt="" draggable={false} decoding="async" />
                <span className="rp-pick__label" style={{ "--rp-len": String([...label].length) }}>
                  {label}
                </span>
              </span>
              {hasText(data[key].team) && <span className="rp-pick__team">{data[key].team}</span>}
            </button>
          );
        })}
      </div>
    </>
  );
}
