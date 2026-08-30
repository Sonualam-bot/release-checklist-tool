const prisma = require("../db");
const { STEP_KEYS } = require("../constants/steps");

// Only layer allowed to talk to Prisma/Postgres. Returns raw DB rows -
// shaping/business logic (like status) belongs in the service layer.

/**
 * Fetch all releases with their step rows, newest release date first.
 * @returns {Promise<Array<Object>>} Raw Prisma Release rows (with `steps` included).
 */
async function findAll() {
  return prisma.release.findMany({
    include: { steps: true },
    orderBy: { releaseDate: "desc" },
  });
}

/**
 * Fetch a single release by id, including its step rows.
 * @param {string} id - Release UUID.
 * @returns {Promise<Object|null>} Raw Prisma Release row, or null if not found.
 */
async function findById(id) {
  return prisma.release.findUnique({
    where: { id },
    include: { steps: true },
  });
}

/**
 * Create a new release and seed it with every checklist step, all unchecked.
 * @param {Object} data
 * @param {string} data.name - Release name.
 * @param {Date} data.releaseDate - Release date/time.
 * @param {string|null} [data.additionalInfo] - Optional free-text notes.
 * @returns {Promise<Object>} The created Release row (with `steps` included).
 */
async function create({ name, releaseDate, additionalInfo }) {
  return prisma.release.create({
    data: {
      name,
      releaseDate,
      additionalInfo: additionalInfo ?? null,
      // Every release starts with all checklist steps present but unchecked.
      steps: {
        create: STEP_KEYS.map((stepKey) => ({ stepKey, completed: false })),
      },
    },
    include: { steps: true },
  });
}

/**
 * Overwrite a release's free-text additional info.
 * @param {string} id - Release UUID.
 * @param {string|null} additionalInfo - New notes value.
 * @returns {Promise<Object>} The updated Release row (with `steps` included).
 */
async function updateAdditionalInfo(id, additionalInfo) {
  return prisma.release.update({
    where: { id },
    data: { additionalInfo },
    include: { steps: true },
  });
}

/**
 * Toggle a single checklist step's completed flag for a release.
 * @param {string} releaseId - Release UUID.
 * @param {string} stepKey - One of the fixed step keys from constants/steps.js.
 * @param {boolean} completed - New completed state.
 * @returns {Promise<Object>} The updated ReleaseStep row.
 */
async function setStepCompleted(releaseId, stepKey, completed) {
  return prisma.releaseStep.update({
    where: { releaseId_stepKey: { releaseId, stepKey } },
    data: { completed },
  });
}

/**
 * Delete a release and its step rows (cascades via FK).
 * @param {string} id - Release UUID.
 * @returns {Promise<Object>} The deleted Release row.
 */
async function remove(id) {
  return prisma.release.delete({ where: { id } });
}

module.exports = {
  findAll,
  findById,
  create,
  updateAdditionalInfo,
  setStepCompleted,
  remove,
};
