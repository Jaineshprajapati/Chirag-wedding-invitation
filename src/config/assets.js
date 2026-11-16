/**
 * Central place for every image / media URL used by the invitation.
 *
 * Files that were bundled in your zip live in /public/assets and are served
 * locally. The few that were NOT in the zip (intro poster, lantern art, three
 * event illustrations) are loaded from the original CDN. To make the site
 * fully offline, download them and drop them into /public/assets using the same
 * folder structure, then change `cdn(...)` to `local(...)` below.
 */
const CDN = "https://assets.digitalinvite.in";
const local = (path) => `/assets/${path}`;
const cdn = (path) => `${CDN}/${path}`;

const T = "templates/royal-rajasthan/v1";

export const ASSETS = {
  // Door-opening gate video. Not in the zip -> streamed from the original CDN.
  // For offline use: download it to public/assets/templates/royal-rajasthan/v1/intro-1-fast.mp4
  // and change cdn(...) to local(...).
  introVideo: cdn(`${T}/intro-1-fast.mp4`),
  heroSky: local(`${T}/hero-sky.webp`),
  heroFront: local(`${T}/hero-front-2.webp`),
  ganesh: local("templates/gopuram-grace/v1/ganesh.webp"),
  familiesBg: local(`${T}/families-bg.webp`),
  eventsSky: local(`${T}/events-sky.webp`),
  eventsTop: local(`${T}/events-top.webp`),
  eventsBottom: local(`${T}/events-bottom.webp`),
  eventCard: local(`${T}/event-card.webp`),
  sidePickerOpen: local(`${T}/side-picker-2.webp`),
  galleryBg: local(`${T}/gallery-bg-2.webp`),
  rsvpSky: local(`${T}/rsvp-sky.webp`),
  rsvpFront: local(`${T}/rsvp-front.webp`),
  rsvpScrollTop: local(`${T}/rsvp-scroll-top.webp`),
  rsvpPaper: local(`${T}/rsvp-paper-2.webp`),
  rsvpScrollBottom: local(`${T}/rsvp-scroll-bottom.webp`),
  footerSky: local(`${T}/footer-sky.webp`),
  footerFront: local(`${T}/footer-front.webp`),

  // Not in the zip -> loaded from the original CDN
  footerLantern: cdn(`${T}/footer-lantern.webp`),
  introPoster: cdn(`${T}/intro-poster.webp`),
};

/** Illustrations shown on each event card (name -> URL). */
const LOCAL_ILLUSTRATIONS = new Set([
  "haldi-1",
  "mehndi-1",
  "sangeet-1",
  "wedding-4",
  "wedding-reception-1",
]);

export function illustrationUrl(name) {
  if (!name) return "";
  const file = `illustrations/${name}.webp?v=20261105a`;
  return LOCAL_ILLUSTRATIONS.has(name) ? local(file) : cdn(file);
}

/** Layout constants measured from the artwork (fractions of image size). */
export const EVENT_CARD_ART = { ratio: 0.6857, top: 0.135, bottom: 0.205, inline: 0.11 };
export const SIDE_PICKER_ART = {
  ratio: 0.5596,
  plaqueTop: 0.731,
  plaqueHeight: 0.07,
  plaqueInline: 0.235,
  photoLeft: 0.205,
  photoTop: 0.298,
  photoWidth: 0.59,
  photoHeight: 0.432,
};
export const RSVP_SCROLL_ART = { rodTop: 0.0531 };

/** Images worth preloading as early as possible (hero + deity). */
export const PRELOAD = [ASSETS.heroSky, ASSETS.heroFront, ASSETS.ganesh];
