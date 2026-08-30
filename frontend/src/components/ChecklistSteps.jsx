/**
 * Renders the fixed checklist as checkboxes. Purely presentational - the
 * parent owns the state and decides what happens when a box is toggled.
 * @param {{steps: Array<{key: string, label: string, completed: boolean}>, onToggle: (key: string, completed: boolean) => void, disabled?: boolean}} props
 */
export default function ChecklistSteps({ steps, onToggle, disabled }) {
  return (
    <ul className="checklist">
      {steps.map((step) => (
        <li key={step.key}>
          <label>
            <input
              type="checkbox"
              checked={step.completed}
              disabled={disabled}
              onChange={(e) => onToggle(step.key, e.target.checked)}
            />
            {step.label}
          </label>
        </li>
      ))}
    </ul>
  );
}
