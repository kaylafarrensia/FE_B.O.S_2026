// ── Class name merger ──────────────────────────────────────────────────────────
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// ── Date / Time formatters ─────────────────────────────────────────────────────

/**
 * Formats an ISO date string to a readable date.
 * e.g. "Friday, August 15, 2026"
 */
export function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Formats a start+end ISO string pair to a time range.
 * e.g. "09:00 – 12:00 WIB"
 */
export function formatStartEndTime(startIso, endIso) {
  if (!startIso) return '';
  const fmt = (iso) =>
    new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    });
  return `${fmt(startIso)} – ${fmt(endIso)} WIB`;
}

/**
 * Formats an ISO date string into a Jakarta (WIB) date+time string.
 * e.g. "August 7, 2026 at 23:59 WIB"
 */
export function formatToWIB(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (!Number.isFinite(date.getTime())) return '—';

  const datePart = date.toLocaleDateString('en-US', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timePart = date.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${datePart} at ${timePart} WIB`;
}
