import SelectSearch from '~/components/data/select_search'
import { humanize, type Field, type Options } from '~/components/data/util'

/**
 * The right input for a field type, wired to a value + onChange
 */
export default function FieldInput({
  field,
  value,
  onChange,
  options,
  error,
}: {
  field: Field
  value: string | boolean
  onChange: (value: string | boolean) => void
  options: Options
  error?: string
}) {
  const id = `field-${field.name}`
  const invalid = error ? 'true' : undefined
  const text = typeof value === 'string' ? value : ''

  const control = (() => {
    switch (field.type) {
      case 'boolean':
        return (
          <button
            id={id}
            type="button"
            role="switch"
            aria-checked={Boolean(value)}
            className={`c-toggle ${value ? 'c-toggle--on' : ''}`}
            onClick={() => onChange(!value)}
          >
            <span className="c-toggle__knob" />
            <span className="c-toggle__text">{value ? 'Yes' : 'No'}</span>
          </button>
        )
      case 'enum':
        return (
          <select
            id={id}
            className="field__input"
            value={text}
            data-invalid={invalid}
            onChange={(event) => onChange(event.target.value)}
          >
            <option value="">Choose…</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {humanize(option)}
              </option>
            ))}
          </select>
        )
      case 'belongsTo':
        return (
          <SelectSearch
            id={id}
            value={text}
            options={options[field.resource!] ?? []}
            onChange={onChange}
            invalid={Boolean(error)}
            required={field.required}
          />
        )
      case 'textarea':
      case 'json':
        return (
          <textarea
            id={id}
            className={`field__input c-textarea ${field.type === 'json' ? 'mono' : ''}`}
            rows={field.type === 'json' ? 8 : 5}
            value={text}
            data-invalid={invalid}
            onChange={(event) => onChange(event.target.value)}
          />
        )
      default: {
        const type = {
          email: 'email',
          url: 'url',
          number: 'number',
          money: 'number',
          date: 'date',
          datetime: 'datetime-local',
        }[field.type as string]
        return (
          <input
            id={id}
            className="field__input"
            type={type ?? 'text'}
            step={field.type === 'money' ? '0.01' : undefined}
            value={text}
            data-invalid={invalid}
            onChange={(event) => onChange(event.target.value)}
          />
        )
      }
    }
  })()

  const wide = ['textarea', 'json'].includes(field.type)
  return (
    <div className={`field ${wide ? 'c-form__wide' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {field.label}
        {field.required && <span className="c-req">*</span>}
      </label>
      {control}
      {error && <span className="field__error">{error}</span>}
    </div>
  )
}
