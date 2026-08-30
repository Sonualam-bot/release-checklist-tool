/**
 * Small modal confirmation dialog, used in place of window.confirm() for
 * destructive actions (e.g. deleting a release) so the UI stays in our own
 * styling instead of a native browser prompt.
 * @param {{open: boolean, title: string, message: string, onConfirm: () => void, onCancel: () => void}} props
 */
export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog" role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="dialog-actions">
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
