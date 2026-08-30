import { apiFetch } from "./client";

/**
 * Fetch the fixed, ordered list of checklist step definitions (key + label).
 * @returns {Promise<Array<{key: string, label: string, order: number}>>}
 */
export function listSteps() {
  return apiFetch("/steps");
}

/**
 * Fetch all releases.
 * @returns {Promise<Array<Object>>}
 */
export function listReleases() {
  return apiFetch("/releases");
}

/**
 * Fetch a single release by id.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export function getRelease(id) {
  return apiFetch(`/releases/${id}`);
}

/**
 * Create a new release.
 * @param {{name: string, releaseDate: string, additionalInfo?: string}} data
 * @returns {Promise<Object>} The created release.
 */
export function createRelease(data) {
  return apiFetch("/releases", { method: "POST", body: JSON.stringify(data) });
}

/**
 * Overwrite a release's additional info notes.
 * @param {string} id
 * @param {string} additionalInfo
 * @returns {Promise<Object>} The updated release.
 */
export function updateAdditionalInfo(id, additionalInfo) {
  return apiFetch(`/releases/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ additionalInfo }),
  });
}

/**
 * Check or uncheck a single checklist step.
 * @param {string} id
 * @param {string} stepKey
 * @param {boolean} completed
 * @returns {Promise<Object>} The updated release, with recomputed status.
 */
export function setStepCompleted(id, stepKey, completed) {
  return apiFetch(`/releases/${id}/steps/${stepKey}`, {
    method: "PATCH",
    body: JSON.stringify({ completed }),
  });
}

/**
 * Delete a release.
 * @param {string} id
 * @returns {Promise<void>}
 */
export function deleteRelease(id) {
  return apiFetch(`/releases/${id}`, { method: "DELETE" });
}
