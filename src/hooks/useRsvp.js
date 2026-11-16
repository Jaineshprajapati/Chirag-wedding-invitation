import { useCallback } from "react";

/**
 * RSVP submission. By default it POSTs JSON to VITE_RSVP_ENDPOINT if that env
 * variable is set; otherwise it simulates a successful send (demo mode).
 *
 * Expected return: { ok: true } or { ok: false, message?, fields? }
 * where `fields` maps a field key (display_name / phone / attendance / note)
 * to an error message.
 */
const ENDPOINT = import.meta.env.VITE_RSVP_ENDPOINT;

export function useRsvp() {
  return useCallback(async (payload) => {
    if (!ENDPOINT) {
      await new Promise((r) => setTimeout(r, 900));
      return { ok: true };
    }
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) return { ok: true };
      let body = null;
      try {
        body = await res.json();
      } catch {
        /* ignore */
      }
      return {
        ok: false,
        message: body?.message || "We could not send your reply. Please try again.",
        fields: body?.fields,
      };
    } catch {
      return { ok: false, message: "No connection. Please check your network and try again." };
    }
  }, []);
}
