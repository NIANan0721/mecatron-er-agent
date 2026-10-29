import { Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import Highlight from '~/components/data/highlight'
import ResourceIcon from '~/components/data/resource_icon'
import {
  findResource,
  formatValue,
  humanize,
  recordUrl,
  titleOf,
  tone,
  type Field,
  type Row,
} from '~/components/data/util'

/**
 * A link chip to the record a foreign key points at, e.g. [Rachel Ong]
 */
export function RelationChip({ field, row }: { field: Field; row: Row }) {
  const { resources } = usePage().props
  const id = row[field.name]
  if (id === null || id === undefined) return <span className="c-null">—</span>

  const target = findResource(resources, field.resource)
  const related = field.relation ? row[field.relation] : undefined
  const label = related ? titleOf(target, related) : `#${id}`

  return (
    <Link
      href={recordUrl(field.resource!, id)}
      className="c-chip"
      onClick={(event) => event.stopPropagation()}
    >
      <ResourceIcon name={target?.icon ?? 'Database'} size={12} />
      {label}
    </Link>
  )
}

/**
 * One value, rendered for its field type
 */
export default function Cell({ field, row, query }: { field: Field; row: Row; query?: string }) {
  const value = row[field.name]

  if (field.type === 'belongsTo') return <RelationChip field={field} row={row} />

  if (value === null || value === undefined || value === '') {
    return <span className="c-null">—</span>
  }

  if (field.type === 'enum') {
    return (
      <span className={`c-badge c-badge--${tone(String(value))}`}>
        <Highlight text={humanize(String(value))} query={query} />
      </span>
    )
  }

  if (field.type === 'boolean') {
    return <span className={`c-bool ${value ? 'c-bool--on' : ''}`}>{value ? 'Yes' : 'No'}</span>
  }

  if (field.type === 'url') {
    return (
      <a
        href={String(value)}
        target="_blank"
        rel="noreferrer"
        className="c-link"
        onClick={(event) => event.stopPropagation()}
      >
        <Highlight text={String(value)} query={query} />
      </a>
    )
  }

  const text = formatValue(field, value)
  const isMono = ['date', 'datetime', 'money', 'number'].includes(field.type)
  return (
    <span className={isMono ? 'mono' : undefined}>
      <Highlight text={text} query={query} />
    </span>
  )
}
