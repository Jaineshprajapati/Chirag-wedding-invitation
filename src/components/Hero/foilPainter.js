/**
 * Paints the gold "scratch" foil onto a canvas 2D context.
 * Pure drawing code – no React in here.
 */
const CAPS = '"Cinzel", Georgia, serif';
const BODY = '"Cormorant Garamond", Georgia, serif';

// cheap deterministic noise so the foil looks identical on every render
const noise = (n) => {
  const r = 43758.5453 * Math.sin(127.1 * n);
  return r - Math.floor(r);
};

export function paintFoil(ctx, w, h, kicker, title, hint) {
  // base gold gradient
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#9c7424");
  g.addColorStop(0.22, "#e9cd7c");
  g.addColorStop(0.42, "#fff1bf");
  g.addColorStop(0.6, "#d8b158");
  g.addColorStop(0.82, "#b88a34");
  g.addColorStop(1, "#7f5a1a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // grain
  const grains = Math.min(1400, Math.round((w * h) / 70));
  for (let i = 0; i < grains; i++) {
    ctx.fillStyle = i % 3 === 0 ? "rgba(90,58,10,0.16)" : "rgba(255,248,220,0.32)";
    ctx.fillRect(noise(i + 1) * w, noise(i + 7.3) * h, 0.6 + 1.4 * noise(i + 3.1), 0.6);
  }
  // glints
  for (let i = 0; i < 22; i++) {
    const x = noise(i + 41) * w;
    const y = noise(i + 97) * h;
    const s = 1.4 + 2.6 * noise(i + 13);
    ctx.fillStyle = "rgba(255,255,240,0.85)";
    ctx.beginPath();
    ctx.arc(x, y, 0.35 * s, 0, 2 * Math.PI);
    ctx.fill();
  }

  // double border
  ctx.strokeStyle = "rgba(255,244,205,0.75)";
  ctx.lineWidth = 1;
  ctx.strokeRect(8.5, 8.5, w - 17, h - 17);
  ctx.strokeStyle = "rgba(110,72,14,0.35)";
  ctx.strokeRect(11.5, 11.5, w - 23, h - 23);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  const centerX = (text) => (w - ctx.measureText(text).width) / 2;
  const hasSpacing = "letterSpacing" in ctx;

  const stamp = (text, y, size, weight, spacing) => {
    ctx.font = `${weight} ${size}px ${CAPS}`;
    const sp = /[\u0900-\u097F]/.test(text) ? 0 : spacing; // no tracking on Devanagari
    if (hasSpacing) ctx.letterSpacing = `${(size * sp).toFixed(1)}px`;
    const x = centerX(text) + (sp && hasSpacing ? (size * sp) / 2 : 0);
    ctx.fillStyle = "rgba(255,246,214,0.55)"; // emboss highlight
    ctx.fillText(text, x, y + 1);
    ctx.fillStyle = "#4a2f06";
    ctx.fillText(text, x, y);
    if (hasSpacing) ctx.letterSpacing = "0px";
  };

  const kickerSize = Math.max(10, Math.min(0.034 * w, 0.07 * h));
  const titleSize = Math.max(14, Math.min(0.072 * w, 0.14 * h));
  const kickerY = 0.33 * h;
  const titleY = 0.5 * h;

  // small diamond ornament with side lines
  {
    const r = Math.max(3, 0.022 * h);
    const y = 0.19 * h;
    ctx.fillStyle = "rgba(74,47,6,0.75)";
    ctx.beginPath();
    ctx.moveTo(w / 2, y - r);
    ctx.lineTo(w / 2 + r, y);
    ctx.lineTo(w / 2, y + r);
    ctx.lineTo(w / 2 - r, y);
    ctx.fill();
    ctx.strokeStyle = "rgba(74,47,6,0.45)";
    ctx.lineWidth = 1;
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(w / 2 + dir * r * 2.2, y);
      ctx.lineTo(w / 2 + dir * w * 0.09, y);
      ctx.stroke();
    }
  }

  stamp(kicker, kickerY, kickerSize, 600, 0.28);
  stamp(title, titleY, titleSize, 700, 0.06);

  // rule + diamond either side of the title
  ctx.font = `700 ${titleSize}px ${CAPS}`;
  const titleW = ctx.measureText(title).width;
  const gap = 0.6 * titleSize;
  const len = Math.min(0.12 * w, (w - titleW) / 2 - gap - 22);
  if (len > 8) {
    for (const dir of [-1, 1]) {
      const from = w / 2 + dir * (titleW / 2 + gap);
      const to = from + dir * len;
      ctx.strokeStyle = "rgba(74,47,6,0.7)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(from, titleY);
      ctx.lineTo(to, titleY);
      ctx.stroke();
      ctx.fillStyle = "#4a2f06";
      ctx.beginPath();
      const d = 0.12 * titleSize;
      ctx.moveTo(to, titleY - d);
      ctx.lineTo(to + dir * d, titleY);
      ctx.lineTo(to, titleY + d);
      ctx.lineTo(to - dir * d, titleY);
      ctx.fill();
    }
  }

  // hint pill
  const hintSize = Math.max(10, Math.min(0.036 * w, 0.085 * h));
  ctx.font = `500 ${hintSize}px ${BODY}`;
  const pillW = ctx.measureText(hint).width + 2.4 * hintSize;
  const pillH = 2.1 * hintSize;
  const px = (w - pillW) / 2;
  const py = 0.765 * h - pillH / 2;
  const rad = pillH / 2;
  ctx.fillStyle = "rgba(43,24,6,0.82)";
  ctx.beginPath();
  ctx.moveTo(px + rad, py);
  ctx.arcTo(px + pillW, py, px + pillW, py + pillH, rad);
  ctx.arcTo(px + pillW, py + pillH, px, py + pillH, rad);
  ctx.arcTo(px, py + pillH, px, py, rad);
  ctx.arcTo(px, py, px + pillW, py, rad);
  ctx.fill();
  ctx.strokeStyle = "rgba(233,205,124,0.7)";
  ctx.stroke();
  ctx.fillStyle = "#f6e3a8";
  ctx.fillText(hint, centerX(hint), py + pillH / 2 + 1);
}
