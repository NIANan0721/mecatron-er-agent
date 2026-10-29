/**
 * Describes a table for the data console UI: which fields to show, how to
 * edit them and how the table relates to others. Controllers pass these to
 * the shared React pages in inertia/pages/data/.
 */
export type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'url'
  | 'number'
  | 'money'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'enum'
  | 'belongsTo'
  | 'json'

export type Field = {
  /** Model property, e.g. 'relationshipOwnerId' */
  name: string
  label: string
  type: FieldType
  /** For enum (a plain array: page props must be JSON, so no readonly tuples) */
  options?: string[]
  /** For belongsTo: which table it points to */
  resource?: string
  /** For belongsTo: model relation to preload, e.g. 'owner' */
  relation?: string
  required?: boolean
  /** Show as a column in the table view */
  list?: boolean
}

export type Resource = {
  /** URL segment and table name, e.g. 'sponsors' */
  key: string
  label: string
  singular: string
  /** Which field names a record, e.g. 'name' */
  titleField: string
  lane: 'people' | 'knowledge' | 'cases'
  /** lucide-react icon name */
  icon: string
  fields: Field[]
  hasMany: { relation: string; resource: string; label: string }[]
}

/**
 * Choices for belongsTo dropdowns, keyed by resource
 */
export type Options = Record<string, { value: number; label: string }[]>
