import { Fragment } from "react";
import { ASSETS } from "../../config/assets";
import { hasText, maxLen } from "../../utils/text";
import { familyLines, linesToStrings } from "../../utils/families";
import Reveal from "../common/Reveal";
import WordReveal from "../common/WordReveal";
import "./Families.css";

/** One block of wrapped lines ("Son of / Mr. X &  / Mrs. Y"). */
function Lines({ className, lines }) {
  return (
    <p className={className}>
      {lines.map((line, i) => (
        <span className="rp-fam__line" key={i}>
          {line.length === 1
            ? line[0]
            : line.map((piece, j) => (
                <Fragment key={j}>
                  {j > 0 && " "}
                  <span className="rp-fam__piece">{piece}</span>
                </Fragment>
              ))}
        </span>
      ))}
    </p>
  );
}

function Side({ side, parentLines, delay }) {
  const extraLines = familyLines(side.extra, true);
  return (
    <Reveal kind="rise" delay={delay} className="rp-fam__side">
      {hasText(side.name) && <p className="rp-fam__name">{side.name}</p>}
      {parentLines.length > 0 && <Lines className="rp-fam__parents" lines={parentLines} />}
      {extraLines.length > 0 && <Lines className="rp-fam__extra" lines={extraLines} />}
    </Reveal>
  );
}

/** "The Families" – groom's family, an ampersand divider, bride's family. */
export default function Families({ data }) {
  const { one, two } = data;
  const hasOne = hasText(one.name) || hasText(one.parents.text) || hasText(one.extra.text);
  const hasTwo = hasText(two.name) || hasText(two.parents.text) || hasText(two.extra.text);

  // if either parents line is long, wrap each onto two lines
  const split = maxLen(0, one.parents.text, two.parents.text) > 51;
  const parents1 = familyLines(one.parents, split);
  const parents2 = familyLines(two.parents, split);

  const extra1 = linesToStrings(familyLines(one.extra, true));
  const extra2 = linesToStrings(familyLines(two.extra, true));

  return (
    <section className="rp-section rp-families">
      <img className="rp-art" src={ASSETS.familiesBg} alt="" loading="lazy" decoding="async" draggable={false} />

      <div
        className="rp-families__inner"
        style={{
          "--rp-name-len": String(maxLen(10, one.name, two.name)),
          "--rp-parents-len": String(maxLen(30, ...linesToStrings(parents1), ...linesToStrings(parents2))),
          "--rp-extra-len": String(maxLen(24, ...extra1, ...extra2)),
        }}
      >
        {hasText(data.heading) && (
          <h2 className="rp-heading rp-families__heading">
            <WordReveal text={data.heading} step={90} />
          </h2>
        )}

        {hasOne && <Side side={one} parentLines={parents1} delay={80} />}

        {hasOne && hasTwo && (
          <Reveal kind="zoom" delay={200} className="rp-fam__divider">
            <span aria-hidden="true">
              <i />
              <b>&amp;</b>
              <i />
            </span>
          </Reveal>
        )}

        {hasTwo && <Side side={two} parentLines={parents2} delay={300} />}
      </div>
    </section>
  );
}
