import { useState } from 'react'
import { Link } from '@adonisjs/inertia/react'
import { router, usePage } from '@inertiajs/react'
import { ArrowLeft, ArrowUpRight, GitBranch, Pencil, Plus, Trash2 } from 'lucide-react'
import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import Cell, { RelationChip } from '~/components/data/cell'
import DataShell from '~/components/data/data_shell'
import ResourceIcon from '~/components/data/resource_icon'
import { type InertiaProps } from '~/types'
import {
  findResource,
  recordUrl,
  tableUrl,
  titleOf,
  type Resource,
  type Row,
} from '~/components/data/util'

export default function DataRecord({
  resource,
  record,
}: InertiaProps<{ resource: Resource; record: Row }>) {
  const { resources } = usePage().props
  const [tab, setTab] = useState(resource.hasMany[0]?.relation)

  const parents = resource.fields.filter((field) => field.type === 'belongsTo')
  const details = resource.fields.filter((field) => field.type !== 'belongsTo')
  const title = titleOf(resource, record)

  const destroy = () => {
    if (!confirm(`Delete ${resource.singular.toLowerCase()} "${title}"?`)) return
    router.delete(recordUrl(resource.key, record.id))
  }

  const current = resource.hasMany.find((child) => child.relation === tab)
  const childResource = findResource(resources, current?.resource)
  const childRows: Row[] = current ? (record[current.relation] ?? []) : []
  // the column linking children back to this record (e.g. sponsorId), used to pre-fill "Add"
  const backLink = childResource?.fields.find(
    (field) => field.type === 'belongsTo' && field.resource === resource.key
  )
  const childColumns = (childResource?.fields ?? []).filter(
    (field) => field.list && field.type !== 'belongsTo'
  )

  return (
    <DataShell active={resource.key}>
      <Page title={`${title} · ${resource.singular}`} hideTitle>
        <Link href={tableUrl(resource.key)} className="c-back">
          <ArrowLeft size={14} /> {resource.label}
        </Link>

        <header className="c-head">
          <div className="c-head__main">
            <span className="c-tile">
              <ResourceIcon name={resource.icon} size={20} />
            </span>
            <div>
              <div className="c-eyebrow mono">
                {resource.singular} · #{record.id}
              </div>
              <h1 className="c-title">{title}</h1>
            </div>
          </div>
          <div className="c-head__actions">
            <Link
              href={`${recordUrl(resource.key, record.id)}/edit`}
              className="btn btn--secondary btn--sm"
            >
              <Pencil size={14} /> Edit
            </Link>
            <button type="button" className="btn btn--secondary btn--sm c-danger" onClick={destroy}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </header>

        <div className="c-record">
          <section className="c-panel c-details">
            <h2 className="c-section-title">Details</h2>
            <dl className="c-dl">
              {details.map((field) => (
                <div
                  key={field.name}
                  className={['textarea', 'json'].includes(field.type) ? 'c-dl__wide' : ''}
                >
                  <dt>{field.label}</dt>
                  <dd className={field.type === 'textarea' ? 'c-prose' : undefined}>
                    <Cell field={field} row={record} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="c-panel c-relations">
            <h2 className="c-section-title">
              <GitBranch size={14} /> Belongs to
            </h2>
            {parents.length === 0 && <p className="c-muted">This table has no parent tables.</p>}
            <ul className="c-parents">
              {parents.map((field) => (
                <li key={field.name}>
                  <span className="c-parents__label">{field.label}</span>
                  <RelationChip field={field} row={record} />
                </li>
              ))}
            </ul>
          </section>
        </div>

        {resource.hasMany.length > 0 && (
          <section className="c-panel c-children">
            <div className="c-tabs" role="tablist">
              {resource.hasMany.map((child) => {
                const target = findResource(resources, child.resource)
                const count = (record[child.relation] ?? []).length
                return (
                  <button
                    key={child.relation}
                    type="button"
                    role="tab"
                    aria-selected={tab === child.relation}
                    className="c-tab"
                    onClick={() => setTab(child.relation)}
                  >
                    <ResourceIcon name={target?.icon ?? 'Database'} size={14} />
                    {child.label}
                    <span className="c-tab__count mono">{count}</span>
                  </button>
                )
              })}
            </div>

            {current && childResource && (
              <div className="c-children__body" key={current.relation}>
                <div className="c-children__bar">
                  <span className="c-muted">
                    {childRows.length} {childResource.label.toLowerCase()} linked to this{' '}
                    {resource.singular.toLowerCase()}
                  </span>
                  {backLink && (
                    <Link
                      href={`${tableUrl(childResource.key)}/create?${backLink.name}=${record.id}`}
                      className="btn btn--secondary btn--sm"
                    >
                      <Plus size={14} /> Add {childResource.singular.toLowerCase()}
                    </Link>
                  )}
                </div>
                {childRows.length === 0 ? (
                  <p className="c-empty-row">Nothing linked yet.</p>
                ) : (
                  <table className="c-table c-table--compact">
                    <thead>
                      <tr>
                        <th className="c-table__id mono">#</th>
                        {childColumns.map((field) => (
                          <th key={field.name}>{field.label}</th>
                        ))}
                        <th className="c-table__actions" />
                      </tr>
                    </thead>
                    <tbody>
                      {childRows.map((row) => (
                        <tr
                          key={row.id}
                          className="c-row"
                          onClick={() => router.visit(recordUrl(childResource.key, row.id))}
                        >
                          <td className="c-table__id mono">{row.id}</td>
                          {childColumns.map((field) => (
                            <td key={field.name}>
                              <Cell field={field} row={row} />
                            </td>
                          ))}
                          <td className="c-table__actions">
                            <ArrowUpRight size={14} className="c-muted" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </section>
        )}
      </Page>
    </DataShell>
  )
}

DataRecord.layout = [AppLayout]
