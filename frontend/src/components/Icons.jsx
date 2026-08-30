/**
 * Small inline SVG icon set so the app doesn't need an icon library
 * dependency for three glyphs. Each accepts standard SVG props (className, etc).
 */

/** Eye icon, used for the "View" action on a release row. */
export function EyeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/** Trash icon, used for the "Delete" action on a release. */
export function TrashIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

/** Plus-in-circle icon, used on the "New release" button. */
export function PlusCircleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

/** Checkmark icon, used on the "Save" button. */
export function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
