import { Link } from '@adonisjs/inertia/react'
import { useForm } from '@inertiajs/react'
import { ArrowLeft, Save } from 'lucide-react'
import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import DataShell from '~/components/data/data_shell'
import FieldInput from '~/components/data/field_input'
import ResourceIcon from '~/components/data/resource_icon'
import { type InertiaProps } from '~/types'
import {
  recordUrl,
  tableUrl,
  titleOf,
  toInputValue,
  type Options,
  type Resource,
  type Row,
} from '~/components/data/util'

/**
 * Booleans that should start switched on for a new record
 */
const ON_BY_DEFAULT = new Set(['isActive', 'isCurrent'])

export default function DataForm({
  resource,
  record,
  options,
}: InertiaProps<{ resource: Resource; record: Row | null; options: Options }>) {
  /**
   * Edit: start from the record. New: start empty, pre-filled from the URL
   * (e.g. ?sponsorId=4 when adding a contact from a sponsor's page).
   */
  const prefill = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search)
  const initial = Object.fromEntries(
    resource.fields.map((field) => {
      if (record) return [field.name, toInputValue(field, record[field.name])]
      if (field.type === 'boolean') return [field.name, ON_BY_DEFAULT.has(field.name)]
      return [field.name, prefill.get(field.name) ?? '']
    })
  ) as Record<string, string | boolean>

  const form = useForm(initial)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (record) form.put(recordUrl(resource.key, record.id))
    else form.post(tableUrl(resource.key))
  }

  const heading = record
    ? `Edit ${titleOf(resource, record)}`
    : `New ${resource.singular.toLowerCase()}`
  const errors = form.errors as Record<string, string | undefined>

  return (
    <DataShell active={resource.key}>
      <Page title={heading} hideTitle>
        <Link
          href={record ? recordUrl(resource.key, record.id) : tableUrl(resource.key)}
          className="c-back"
        >
          <ArrowLeft size={14} /> {record ? titleOf(resource, record) : resource.label}
        </Link>

        <header className="c-head">
          <div className="c-head__main">
            <span className="c-tile">
              <ResourceIcon name={resource.icon} size={20} />
            </span>
            <div>
              <div className="c-eyebrow mono">
                {resource.singular} · {record ? `#${record.id}` : 'new'}
              </div>
              <h1 className="c-title">{heading}</h1>
            </div>
          </div>
        </header>

        <form className="c-panel c-form" onSubmit={submit}>
          {resource.fields.map((field) => (
            <FieldInput
              key={field.name}
              field={field}
              value={form.data[field.name]}
              onChange={(value) => form.setData(field.name, value)}
              options={options}
              error={errors[field.name]}
            />
          ))}

          <div className="c-form__actions">
            <Link
              href={record ? recordUrl(resource.key, record.id) : tableUrl(resource.key)}
              className="btn btn--ghost btn--sm"
            >
              Cancel
            </Link>
            <button type="submit" className="btn btn--primary btn--sm" disabled={form.processing}>
              <Save size={14} /> {form.processing ? 'Saving…' : record ? 'Save changes' : 'Create'}
            </button>
          </div>
        </form>
      </Page>
    </DataShell>
  )
}

DataForm.layout = [AppLayout]
