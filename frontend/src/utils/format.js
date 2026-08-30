const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

/**
 * Format an ISO date string as "Month D, YYYY" (matches the mockup, e.g. "September 20, 2022").
 * @param {string} isoDate
 * @returns {string}
 */
export function formatDate(isoDate) {
  return DATE_FORMATTER.format(new Date(isoDate));
}

/**
 * Human-readable label for a release status.
 * @param {"planned"|"ongoing"|"done"} status
 * @returns {string}
 */
export function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

/**
 * Convert an ISO date string to the value format `<input type="datetime-local">`
 * expects ("YYYY-MM-DDTHH:mm", in local time).
 * @param {string} isoDate
 * @returns {string}
 */
export function toDateTimeLocalValue(isoDate) {
  const date = new Date(isoDate);
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
