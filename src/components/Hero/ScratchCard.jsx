import { useCallback, useEffect, useRef, useState } from "react";
import { cx } from "../../utils/text";
import { prefersReducedMotion } from "../../hooks/useReducedMotion";
import { paintFoil } from "./foilPainter";

const COLS = 20;
const ROWS = 11;
const CELLS = COLS * ROWS;
const REVEAL_AT = 0.5; // auto-reveal once half the foil is scratched

/**
 * "Scratch to unlock" card. The date (children) sits underneath a gold canvas
 * foil which the guest rubs away with a finger / mouse (or opens with Enter).
 */
export default function ScratchCard({ children, kicker, title, hint, onOpen }) {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const scratched = useRef(new Uint8Array(CELLS)); // which grid cells are cleared
  const count = useRef(0);
  const last = useRef(null);
  const [live, setLive] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setLive(true), []);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;
    const w = card.clientWidth;
    const h = card.clientHeight;
    if (w < 2 || h < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    paintFoil(ctx, w, h, kicker, title, hint);

    // re-apply already-scratched cells after a resize
    ctx.globalCompositeOperation = "destination-out";
    const cw = w / COLS;
    const ch = h / ROWS;
    for (let row = 0; row < ROWS; row++)
      for (let col = 0; col < COLS; col++)
        if (scratched.current[COLS * row + col]) ctx.fillRect(col * cw - 1, row * ch - 1, cw + 2, ch + 2);
    ctx.globalCompositeOperation = "source-over";
  }, [kicker, title, hint]);

  useEffect(() => {
    if (!live) return;
    paint();
    // web fonts must be ready before measuring/drawing text on the canvas
    const fonts = document.fonts;
    if (fonts?.load) {
      Promise.all([
        fonts.load('600 16px "Cinzel"'),
        fonts.load('700 16px "Cinzel"'),
        fonts.load('500 16px "Cormorant Garamond"'),
      ])
        .then(() => paint())
        .catch(() => {});
    }
    const el = cardRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => paint());
    ro.observe(el);
    return () => ro.disconnect();
  }, [live, paint]);

  const reveal = useCallback(() => {
    if (open) return;
    setOpen(true);
    onOpen?.();
  }, [open, onOpen]);

  const scratchAt = (x, y) => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card || open) return;
    const w = card.clientWidth;
    const h = card.clientHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const radius = 0.07 * w;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineWidth = 2 * radius;
    const prev = last.current;
    ctx.beginPath();
    if (prev) {
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    last.current = { x, y };

    // remember which grid cells were touched along the stroke
    const steps = prev ? Math.ceil(Math.hypot(x - prev.x, y - prev.y) / (0.6 * radius)) : 0;
    for (let i = 0; i <= steps; i++) {
      const px = prev ? prev.x + ((x - prev.x) * i) / Math.max(steps, 1) : x;
      const py = prev ? prev.y + ((y - prev.y) * i) / Math.max(steps, 1) : y;
      const c0 = Math.floor(((px - radius) / w) * COLS);
      const c1 = Math.floor(((px + radius) / w) * COLS);
      const r0 = Math.floor(((py - radius) / h) * ROWS);
      const r1 = Math.floor(((py + radius) / h) * ROWS);
      for (let r = Math.max(0, r0); r <= Math.min(ROWS - 1, r1); r++)
        for (let c = Math.max(0, c0); c <= Math.min(COLS - 1, c1); c++) {
          const idx = COLS * r + c;
          if (!scratched.current[idx]) {
            scratched.current[idx] = 1;
            count.current++;
          }
        }
    }
    if (count.current / CELLS >= REVEAL_AT) reveal();
  };

  // pointer position in canvas CSS pixels (robust to CSS transforms)
  const localPoint = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return null;
    return {
      x: ((e.clientX - rect.left) / rect.width) * el.clientWidth,
      y: ((e.clientY - rect.top) / rect.height) * el.clientHeight,
    };
  };

  return (
    <div className={cx("rp-scratch", open && "is-open", live && "is-live")}>
      <div
        className="rp-scratch__card"
        ref={cardRef}
        tabIndex={live && !open ? 0 : undefined}
        aria-label={live && !open ? title : undefined}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            reveal();
          }
        }}
      >
        <div className="rp-scratch__under">{children}</div>

        {live && (
          <canvas
            className={cx("rp-scratch__foil", prefersReducedMotion() && "is-still")}
            ref={canvasRef}
            aria-hidden="true"
            onPointerDown={(e) => {
              e.preventDefault();
              const p = localPoint(e);
              if (!p) return;
              last.current = null;
              e.currentTarget.setPointerCapture(e.pointerId);
              scratchAt(p.x, p.y);
            }}
            onPointerMove={(e) => {
              if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
              const p = localPoint(e);
              if (p) scratchAt(p.x, p.y);
            }}
            onPointerUp={() => (last.current = null)}
            onPointerCancel={() => (last.current = null)}
          />
        )}

        {open && (
          <span className="rp-scratch__burst" aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => (
              <i key={i} style={{ "--a": `${36 * i}deg`, "--d": `${(i % 3) * 60}ms` }} />
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
