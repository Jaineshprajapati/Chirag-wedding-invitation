import React from "react";
import { createRoot } from "react-dom/client";

// Web fonts (bundled locally via @fontsource – no Google Fonts request needed)
import "@fontsource/allura/400.css"; //            "RP Script"  – script accents
import "@fontsource/pinyon-script/400.css"; //     "RP Closing" – thank-you signature
import "@fontsource/cinzel/400.css"; //            "RP Caps"    – headings / labels
import "@fontsource/cinzel/500.css";
import "@fontsource/cinzel/600.css";
import "@fontsource/cinzel/700.css";
import "@fontsource/cormorant-garamond/400.css"; // "RP Body"   – body copy
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/eb-garamond/400-italic.css"; // "RP Italic" – italic notes

import "./styles/global.css";
import "./styles/base.css";
import App from "./App";

// A scrolled-down reload would land mid-page; always start at the cover.
try {
  if ("scrollRestoration" in history && !location.hash) {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }
} catch {
  /* ignore */
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
