/**
 *  Single source of truth for the release checklist steps
 * Steps are identical for every release (per spec), so they live in code,
 * not in a database table. `key` is the stable identifier stored in
 * release_steps.step_key - never rename an existing key without a migration.
 */
const STEPS = [
  {
    key: "prs-merged",
    label: "All relevant GitHub pull requests have been merged",
    order: 1,
  },
  {
    key: "changelog-updated",
    label: "CHANGELOG.md files have been updated",
    order: 2,
  },
  { key: "tests-passing", label: "All tests are passing", order: 3 },
  {
    key: "github-release-created",
    label: "Releases in Github created",
    order: 4,
  },
  { key: "deployed-demo", label: "Deployed in demo", order: 5 },
  { key: "tested-demo", label: "Tested thoroughly in demo", order: 6 },
  { key: "deployed-production", label: "Deployed in production", order: 7 },
];

const STEP_KEYS = STEPS.map((s) => s.key);

module.exports = { STEPS, STEP_KEYS };
