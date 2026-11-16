import { cx } from "../../utils/text";
import "./MusicButton.css";

/** Floating play / pause button with an animated equaliser while playing. */
export default function MusicButton({ music }) {
  if (!music?.available) return null;
  const { isPlaying, toggle, label, credit } = music;
  const action = isPlaying ? "Pause music" : "Play music";
  return (
    <button
      type="button"
      className={cx("rp-music", isPlaying && "is-playing")}
      onClick={toggle}
      aria-pressed={isPlaying}
      aria-label={label ? `${action} (${label})` : action}
      title={credit ? `${action}. ${credit}` : action}
    >
      <span className="rp-music__eq" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <svg className="rp-music__play" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 5v14l11-7z" fill="currentColor" />
      </svg>
    </button>
  );
}
