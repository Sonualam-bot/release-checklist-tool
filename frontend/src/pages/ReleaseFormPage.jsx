import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import ChecklistSteps from "../components/ChecklistSteps";
import NotesField from "../components/NotesField";
import ConfirmDialog from "../components/ConfirmDialog";
import { CheckIcon, TrashIcon } from "../components/Icons";
import { createRelease, deleteRelease, getRelease, setStepCompleted, updateAdditionalInfo } from "../api/releases";
import { toDateTimeLocalValue } from "../utils/format";

/**
 * Combined create/edit page for a single release.
 * With no :id in the route it's the "new release" form (name + date +
 * optional notes, no checklist yet - steps only exist once the release is
 * created). With an :id it loads the existing release and lets the user
 * check/uncheck steps and update the notes.
 */
export default function ReleaseFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [name, setName] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getRelease(id)
      .then((release) => {
        setName(release.name);
        setReleaseDate(toDateTimeLocalValue(release.releaseDate));
        setAdditionalInfo(release.additionalInfo || "");
        setSteps(release.steps);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  /**
   * Toggle a checklist step, optimistically updating the UI and rolling
   * back if the request fails.
   * @param {string} key
   * @param {boolean} completed
   */
  async function handleToggleStep(key, completed) {
    setSteps((prev) => prev.map((s) => (s.key === key ? { ...s, completed } : s)));
    try {
      const updated = await setStepCompleted(id, key, completed);
      setSteps(updated.steps);
    } catch (err) {
      setError(err.message);
      setSteps((prev) => prev.map((s) => (s.key === key ? { ...s, completed: !completed } : s)));
    }
  }

  /**
   * Save the form: creates a new release (then navigates to its detail
   * page) or persists the notes on an existing one.
   */
  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const created = await createRelease({ name, releaseDate, additionalInfo });
        navigate(`/releases/${created.id}`);
      } else {
        const updated = await updateAdditionalInfo(id, additionalInfo);
        setAdditionalInfo(updated.additionalInfo || "");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  /** Delete the release the user confirmed in the dialog, then return to the list. */
  async function confirmDelete() {
    setConfirmingDelete(false);
    try {
      await deleteRelease(id);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <Layout toolbar={<Breadcrumb name={name} />}>
        <p className="empty-state">Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout
      toolbar={
        <>
          <Breadcrumb name={isNew ? "New release" : name} />
          {!isNew && (
            <button className="btn-danger" onClick={() => setConfirmingDelete(true)}>
              Delete <TrashIcon />
            </button>
          )}
        </>
      }
    >
      {error && <div className="error-banner">{error}</div>}

      <div className="field-row">
        <div className="field">
          <label htmlFor="release-name">Release</label>
          <input id="release-name" type="text" value={name} disabled={!isNew} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="release-date">Date</label>
          <input
            id="release-date"
            type="datetime-local"
            value={releaseDate}
            disabled={!isNew}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </div>
      </div>

      {!isNew && <ChecklistSteps steps={steps} onToggle={handleToggleStep} />}

      <NotesField value={additionalInfo} onChange={setAdditionalInfo} />

      <div className="form-footer">
        <button className="btn-primary" onClick={handleSave} disabled={saving || (isNew && (!name || !releaseDate))}>
          Save <CheckIcon />
        </button>
      </div>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete release"
        message={`Delete release "${name}"? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </Layout>
  );
}

/**
 * Breadcrumb trail: "All releases" (link) followed by the current page name.
 * @param {{name: string}} props
 */
function Breadcrumb({ name }) {
  return (
    <span className="breadcrumb">
      <Link to="/">All releases</Link>
      <span className="breadcrumb-sep">{">"}</span>
      <span className="breadcrumb-current">{name}</span>
    </span>
  );
}
