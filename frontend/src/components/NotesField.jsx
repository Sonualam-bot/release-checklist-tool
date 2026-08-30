/**
 * Labelled textarea for a release's free-text "additional info" notes.
 * @param {{value: string, onChange: (value: string) => void}} props
 */
export default function NotesField({ value, onChange }) {
  return (
    <div className="field">
      <label htmlFor="additional-info">Additional remarks / tasks</label>
      <textarea
        id="additional-info"
        rows={4}
        placeholder="Please enter any other important notes for the release"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
