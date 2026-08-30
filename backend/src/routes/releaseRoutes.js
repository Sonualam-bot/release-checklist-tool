const { Router } = require("express");
const service = require("../services/releaseService");
const { STEPS } = require("../constants/steps");
const asyncHandler = require("../middleware/asyncHandler");

const router = Router();

/**
 * GET /api/steps
 * Returns the fixed, ordered checklist step definitions (key + label).
 * Lets the frontend render the checklist without hardcoding step labels.
 */
router.get(
  "/steps",
  asyncHandler(async (req, res) => {
    res.json(STEPS);
  }),
);

/**
 * GET /api/releases
 * List all releases with their computed status and full step state.
 */
router.get(
  "/releases",
  asyncHandler(async (req, res) => {
    const releases = await service.listReleases();
    res.json(releases);
  }),
);

/**
 * POST /api/releases
 * Create a release. Body: { name, releaseDate, additionalInfo? }.
 */
router.post(
  "/releases",
  asyncHandler(async (req, res) => {
    const { name, releaseDate, additionalInfo } = req.body;
    const release = await service.createRelease({ name, releaseDate, additionalInfo });
    res.status(201).json(release);
  }),
);

/**
 * GET /api/releases/:id
 * Fetch a single release by id.
 */
router.get(
  "/releases/:id",
  asyncHandler(async (req, res) => {
    const release = await service.getRelease(req.params.id);
    res.json(release);
  }),
);

/**
 * PATCH /api/releases/:id
 * Update a release's additional info. Body: { additionalInfo }.
 */
router.patch(
  "/releases/:id",
  asyncHandler(async (req, res) => {
    const release = await service.updateAdditionalInfo(req.params.id, req.body.additionalInfo);
    res.json(release);
  }),
);

/**
 * PATCH /api/releases/:id/steps/:stepKey
 * Check or uncheck a single checklist step. Body: { completed }.
 */
router.patch(
  "/releases/:id/steps/:stepKey",
  asyncHandler(async (req, res) => {
    const release = await service.setStepCompleted(
      req.params.id,
      req.params.stepKey,
      req.body.completed,
    );
    res.json(release);
  }),
);

/**
 * DELETE /api/releases/:id
 * Delete a release.
 */
router.delete(
  "/releases/:id",
  asyncHandler(async (req, res) => {
    await service.deleteRelease(req.params.id);
    res.status(204).send();
  }),
);

module.exports = router;
