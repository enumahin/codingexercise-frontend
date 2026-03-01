/**
 * Package name and description fields for create/edit package form.
 */
export function PackageDetailsForm({ packageName, packageDescription, onNameChange, onDescriptionChange }) {
  return (
    <>
      <label>
        Name *
        <input
          value={packageName}
          onChange={(e) => onNameChange(e.target.value)}
          required
        />
      </label>
      <label>
        Description
        <input
          value={packageDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </label>
    </>
  )
}
