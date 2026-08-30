import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import ReleaseTable from "../components/ReleaseTable";
import ConfirmDialog from "../components/ConfirmDialog";
import { PlusCircleIcon } from "../components/Icons";
import { listReleases, deleteRelease } from "../api/releases";

/**
 * Landing page: lists every release with its computed status, and links
 * to create a new one or view/delete an existing one.
 */
export default function ReleaseListPage() {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null); // { id, name } | null

  useEffect(() => {
    listReleases()
      .then(setReleases)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  /**
   * Open the confirm dialog for deleting a release.
   * @param {string} id
   */
  function handleDelete(id) {
    const release = releases.find((r) => r.id === id);
    setPendingDelete({ id, name: release?.name });
  }

  /** Actually delete the release the user confirmed, then remove it from local state. */
  async function confirmDelete() {
    const { id } = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteRelease(id);
      setReleases((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Layout
      toolbar={
        <>
          <span className="breadcrumb-current">All releases</span>
          <Link className="btn-primary" to="/releases/new">
            New release <PlusCircleIcon />
          </Link>
        </>
      }
    >
      {error && <div className="error-banner">{error}</div>}
      {loading ? <p className="empty-state">Loading...</p> : <ReleaseTable releases={releases} onDelete={handleDelete} />}
      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete release"
        message={`Delete release "${pendingDelete?.name}"? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </Layout>
  );
}
