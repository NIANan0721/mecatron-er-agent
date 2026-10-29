import type { Field, Resource } from '../../../app/resources/types'

export type { Field, Resource }
export type Row = Record<string, any>
export type Options = Record<string, { value: number; label: string }[]>

export const tableUrl = (key: string) => `/data/${key}`
export const recordUrl = (key: string, id: number | string) => `/data/${key}/${id}`

export function findResource(resources: Resource[], key?: string) {
  return resources.find((resource) => resource.key === key)
}

/**
 * "awaiting_approval" -> "awaiting approval"
 */
export const humanize = (value: string) => value.replace(/_/g, ' ')

/**
 * The name to show for a record, e.g. a sponsor's name or a case's code
 */
export function titleOf(resource: Resource | undefined, row: Row | null | undefined) {
  if (!row) return ''
  const value = row[resource?.titleField ?? 'id']
  if (value === null || value === undefined || value === '') return `#${row.id}`
  return resource?.fields.find((f) => f.name === resource.titleField)?.type === 'enum'
    ? humanize(String(value))
    : String(value)
}

/**
 * Read-only text for a value, based on its field type
 */
export function formatValue(field: Field, value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  switch (field.type) {
    case 'date':
      return String(value).slice(0, 10)
    case 'datetime':
      return String(value).slice(0, 16).replace('T', ' ')
    case 'money':
      return Number(value).toLocaleString('en-SG', { style: 'currency', currency: 'SGD' })
    case 'boolean':
      return value ? 'Yes' : 'No'
    case 'enum':
      return humanize(String(value))
    case 'json':
      return JSON.stringify(value)
    default:
      return String(value)
  }
}

/**
 * The value an <input> expects for a stored value
 */
export function toInputValue(field: Field, value: unknown): string | boolean {
  if (field.type === 'boolean') return Boolean(value)
  if (value === null || value === undefined) return ''
  switch (field.type) {
    case 'date':
      return String(value).slice(0, 10)
    case 'datetime':
      return String(value).slice(0, 16)
    case 'json':
      return JSON.stringify(value, null, 2)
    default:
      return String(value)
  }
}

/**
 * Colour group for enum badges
 */
export function tone(value: string) {
  if (
    /^(active|fulfilled|done|completed|approved|approved_ready_to_send|platinum|gold)$/.test(value)
  )
    return 'ok'
  if (/^(changes_requested|high|lapsed)$/.test(value)) return 'warn'
  if (/^(declined|cancelled)$/.test(value)) return 'off'
  if (/^(awaiting_approval|in_progress|pending|promised|contacted|open|medium)$/.test(value))
    return 'live'
  return 'plain'
}
