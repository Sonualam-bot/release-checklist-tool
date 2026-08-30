import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { EyeIcon, TrashIcon } from "./Icons";
import { formatDate } from "../utils/format";

/**
 * Table listing all releases, with View/Delete actions per row.
 * @param {{releases: Array<Object>, onDelete: (id: string) => void}} props
 */
export default function ReleaseTable({ releases, onDelete }) {
  if (releases.length === 0) {
    return <p className="empty-state">No releases yet. Create one to get started.</p>;
  }

  return (
    <table className="release-table">
      <thead>
        <tr>
          <th>Release</th>
          <th>Date</th>
          <th>Status</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {releases.map((release) => (
          <tr key={release.id}>
            <td>{release.name}</td>
            <td>{formatDate(release.releaseDate)}</td>
            <td>
              <StatusBadge status={release.status} />
            </td>
            <td>
              <Link className="link-action" to={`/releases/${release.id}`}>
                View <EyeIcon />
              </Link>
            </td>
            <td>
              <button className="link-action link-action-danger" onClick={() => onDelete(release.id)}>
                Delete <TrashIcon />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
