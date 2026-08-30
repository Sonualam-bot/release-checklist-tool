const API_BASE_URL = import.meta.env.API_URL || "http://localhost:4000/api";

/**
 * Thrown when the API responds with a non-2xx status. Carries the HTTP
 * status code so callers/UI can branch on it (e.g. 404 -> "not found").
 */
export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

/**
 * Low-level fetch wrapper: builds the full URL, sends/parses JSON, and
 * throws ApiError on failure. This is the only function in the app that
 * knows how to talk HTTP to the backend - everything else in api/ calls
 * this instead of using fetch directly.
 * @param {string} path - Path relative to API_BASE_URL, e.g. "/releases".
 * @param {RequestInit} [options]
 * @returns {Promise<any>} Parsed JSON body, or undefined for empty (204) responses.
 * @throws {ApiError}
 */
export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (res.status === 204) return undefined;

  const body = await res.json().catch(() => undefined);

  if (!res.ok) {
    throw new ApiError(body?.error || `Request failed with status ${res.status}`, res.status);
  }

  return body;
}
