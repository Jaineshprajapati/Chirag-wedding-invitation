# Wedding Invite – Rajasthan Palace (React + Vite)

React version of the digitalinvite.in "Rajasthan Palace" wedding invitation, split into
one component per section. Visuals, CSS and animations are carried over 1:1 from the original.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in /dist
npm run preview
```

## Structure

```
src/
  App.jsx                      page shell: intro gate + sections + music button
  data/inviteData.js           ALL names, dates, events, photos, texts  <-- edit this
  config/assets.js             image URLs + artwork measurements
  components/
    Intro/        Intro.jsx            tap-to-open gate (fade, or video if provided)
    Hero/         Hero.jsx, ScratchCard.jsx, foilPainter.js, Countdown.jsx
    Families/     Families.jsx
    Events/       Events.jsx, SidePicker.jsx, EventCard.jsx, useEventsScroll.js
    Gallery/      Gallery.jsx          swipeable polaroid stack
    Rsvp/         Rsvp.jsx             unrolling scroll + form
    Footer/       Footer.jsx, useWishLanterns.js, useShootingStar.js, stars.js
    MusicButton/  MusicButton.jsx
    common/       Reveal.jsx, WordReveal.jsx, Petals.jsx
  hooks/          useInView, useCountdown, useMusic, useRsvp, useReducedMotion
  utils/          date, calendar (.ics), families, text, seeded PRNG
  styles/         base.css (theme + shared), global.css
  components/*/*.css   each section's own stylesheet
```

## What each section does (same as the original)

| Section  | Behaviour |
|----------|-----------|
| Intro    | Full-screen gate. Tap to open -> fades out, starts hero entrance, starts music (if set). Locks page scroll while visible. |
| Hero     | Sky + palace layers (parallax), drifting petals, staggered text entrance, gold **scratch-to-reveal** date card (canvas; auto-opens at 50 %, Enter/Space also opens), live **countdown**. |
| Families | Word-by-word heading reveal, rise/zoom reveals on scroll. |
| Events   | **Pinned scroll**: cards glide up through a fixed window as you scroll. Groom/Bride window picker (remembered in localStorage). Each card has **Add to Calendar (.ics)** and **Get Directions**. |
| Gallery  | Stacked polaroids; arrows, dots, and swipe. |
| RSVP     | Scroll that unrolls when in view; validated name / 10-digit phone / attend-decline / note form with counters; thank-you seal after sending. |
| Footer   | Twinkling stars, random shooting stars, **Send a Wish Lantern** button. |

`prefers-reduced-motion` is respected everywhere (animations switch off, content shows immediately).

## Customising

* Change names, dates, venues, events, photos, wording -> `src/data/inviteData.js`.
* **Music**: put an mp3 in `public/assets/audio/` and set `music.src` in `inviteData.js`
  (e.g. `"/assets/audio/folk.mp3"`). With no `src`, the music button is hidden.
* **RSVP**: set `VITE_RSVP_ENDPOINT` (see `.env.example`). The form POSTs
  `{ displayName, answers: [{ question_key, answer }] }`. Return 2xx for success, or
  `{ message, fields: { phone: "..." } }` with a non-2xx status to show errors.
* **Intro video**: pass `videoSrc="/assets/intro.mp4"` to `<Intro />` in `App.jsx`.
  Without it the gate uses the fade-open.

## Assets that were not in the zip

These load from the original CDN (`config/assets.js`, `illustrationUrl`). Download them into
`public/assets/` (same folder structure) and switch `cdn(...)` to `local(...)` for a fully offline site:

* `templates/royal-rajasthan/v1/intro-poster.webp`, `footer-lantern.webp`
* `illustrations/lagun-1.webp`, `sangeet-2.webp`, `wedding-1.webp` (bride-side event cards)

Fonts (Allura, Pinyon Script, Cinzel, Cormorant Garamond, EB Garamond) are bundled through
`@fontsource`, because the font files in the zip were empty placeholders.
