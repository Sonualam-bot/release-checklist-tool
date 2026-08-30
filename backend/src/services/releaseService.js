const repo = require("../repositories/releaseRepository");
const { STEPS, STEP_KEYS } = require("../constants/steps");
const { NotFoundError, ValidationError } = require("../errors");

/**
 * Compute a release's status from its step completion state.
 * The one rule the whole assignment hinges on - kept pure and isolated here
 * (no DB, no HTTP) so it's trivial to unit test and impossible to miss.
 * @param {Array<{completed: boolean}>} steps - A release's checklist steps.
 * @returns {"planned"|"ongoing"|"done"}
 */
function computeStatus(steps) {
  const completedCount = steps.filter((s) => s.completed).length;
  if (completedCount === 0) return "planned";
  if (completedCount === steps.length) return "done";
  return "ongoing";
}

/**
 * Merge a release's DB step rows with the fixed STEPS definition so the API
 * always returns the full, ordered checklist with labels attached - the
 * frontend never needs to know the step list itself.
 * @param {Object} release - Raw Prisma Release row (with `steps` included).
 * @returns {Object} API-shaped release: DB fields + computed `status` + ordered `steps`.
 */
function shapeRelease(release) {
  const completedByKey = new Map(release.steps.map((s) => [s.stepKey, s.completed]));
  const steps = STEPS.map((def) => ({
    key: def.key,
    label: def.label,
    order: def.order,
    completed: completedByKey.get(def.key) ?? false,
  }));

  return {
    id: release.id,
    name: release.name,
    releaseDate: release.releaseDate,
    additionalInfo: release.additionalInfo,
    createdAt: release.createdAt,
    updatedAt: release.updatedAt,
    status: computeStatus(steps),
    steps,
  };
}

/**
 * Validate the payload for creating a release.
 * @param {Object} input
 * @param {string} input.name
 * @param {string} input.releaseDate - ISO-parseable date string.
 * @throws {ValidationError} If name or releaseDate is missing/invalid.
 */
function validateCreateInput({ name, releaseDate }) {
  if (!name || typeof name !== "string" || !name.trim()) {
    throw new ValidationError("name is required");
  }
  if (!releaseDate || Number.isNaN(new Date(releaseDate).getTime())) {
    throw new ValidationError("releaseDate must be a valid date");
  }
}

/**
 * List all releases, newest release date first.
 * @returns {Promise<Array<Object>>} API-shaped releases.
 */
async function listReleases() {
  const releases = await repo.findAll();
  return releases.map(shapeRelease);
}

/**
 * Get a single release by id.
 * @param {string} id - Release UUID.
 * @returns {Promise<Object>} API-shaped release.
 * @throws {NotFoundError} If no release exists with that id.
 */
async function getRelease(id) {
  const release = await repo.findById(id);
  if (!release) throw new NotFoundError("Release not found");
  return shapeRelease(release);
}

/**
 * Create a new release, seeded with all checklist steps unchecked.
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.releaseDate - ISO-parseable date string.
 * @param {string} [data.additionalInfo]
 * @returns {Promise<Object>} API-shaped release.
 * @throws {ValidationError} If name or releaseDate is missing/invalid.
 */
async function createRelease({ name, releaseDate, additionalInfo }) {
  validateCreateInput({ name, releaseDate });
  const release = await repo.create({
    name: name.trim(),
    releaseDate: new Date(releaseDate),
    additionalInfo: additionalInfo?.trim() || null,
  });
  return shapeRelease(release);
}

/**
 * Overwrite a release's free-text additional info.
 * @param {string} id - Release UUID.
 * @param {string} additionalInfo - New notes value (trimmed; empty becomes null).
 * @returns {Promise<Object>} API-shaped release.
 * @throws {NotFoundError} If no release exists with that id.
 */
async function updateAdditionalInfo(id, additionalInfo) {
  await getRelease(id); // 404s if missing
  const release = await repo.updateAdditionalInfo(id, additionalInfo?.trim() || null);
  return shapeRelease(release);
}

/**
 * Check or uncheck a single checklist step for a release.
 * @param {string} id - Release UUID.
 * @param {string} stepKey - One of the fixed step keys from constants/steps.js.
 * @param {boolean} completed - New completed state.
 * @returns {Promise<Object>} API-shaped release, reflecting the recomputed status.
 * @throws {ValidationError} If stepKey is unknown or completed isn't a boolean.
 * @throws {NotFoundError} If no release exists with that id.
 */
async function setStepCompleted(id, stepKey, completed) {
  if (!STEP_KEYS.includes(stepKey)) {
    throw new ValidationError(`Unknown step: ${stepKey}`);
  }
  if (typeof completed !== "boolean") {
    throw new ValidationError("completed must be a boolean");
  }
  await getRelease(id); // 404s if missing
  await repo.setStepCompleted(id, stepKey, completed);
  return getRelease(id);
}

/**
 * Delete a release and its checklist step state.
 * @param {string} id - Release UUID.
 * @returns {Promise<void>}
 * @throws {NotFoundError} If no release exists with that id.
 */
async function deleteRelease(id) {
  await getRelease(id); // 404s if missing
  await repo.remove(id);
}

module.exports = {
  listReleases,
  getRelease,
  createRelease,
  updateAdditionalInfo,
  setStepCompleted,
  deleteRelease,
  computeStatus, // exported for unit tests
};
