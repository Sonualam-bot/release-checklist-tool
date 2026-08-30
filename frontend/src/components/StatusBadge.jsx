import { formatStatus } from "../utils/format";

/**
 * Renders a release's computed status as coloured text (planned/ongoing/done).
 * @param {{status: "planned"|"ongoing"|"done"}} props
 */
export default function StatusBadge({ status }) {
  return <span className={`status status-${status}`}>{formatStatus(status)}</span>;
}
