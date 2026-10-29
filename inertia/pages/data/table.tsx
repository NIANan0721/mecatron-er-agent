import { useEffect, useRef, useState } from 'react'
import { Link } from '@adonisjs/inertia/react'
import { router } from '@inertiajs/react'
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import Cell from '~/components/data/cell'
import DataShell from '~/components/data/data_shell'
import ResourceIcon from '~/components/data/resource_icon'
import { type InertiaProps } from '~/types'
import { recordUrl, tableUrl, titleOf, type Resource, type Row } from '~/components/data/util'

type Meta = { total: number; perPage: number; currentPage: number; lastPage: number }
type Filters = { q: string; sort: string; dir: 'asc' | 'desc' }

export default function DataTable({
  resource,
  rows,
  meta,
  filters,
}: InertiaProps<{ resource: Resource; rows: Row[]; meta: Meta; filters: Filters }>) {
  const [q, setQ] = useState(filters.q)
  const first = useRef(true)
  const columns = resource.fields.filter((field) => field.list)

  const visit = (params: Partial<Filters & { page: number }>) => {
    router.get(
      tableUrl(resource.key),
      { q: filters.q || undefined, sort: filters.sort, dir: filters.dir, ...params },
      { preserveState: true, preserveScroll: true, replace: true }
    )
  }

  /**
   * Filter as you type (debounced)
   */
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const timer = setTimeout(() => visit({ q: q || undefined, page: 1 }), 250)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const sortBy = (name: string) => {
    const dir = filters.sort === name && filters.dir === 'asc' ? 'desc' : 'asc'
    visit({ sort: name, dir, page: 1 })
  }

  const destroy = (row: Row) => {
    if (!confirm(`Delete ${resource.singular.toLowerCase()} "${titleOf(resource, row)}"?`)) return
    router.delete(recordUrl(resource.key, row.id), { preserveScroll: true })
  }

  return (
    <DataShell active={resource.key}>
      <Page title={resource.label} hideTitle>
        <header className="c-head">
          <div className="c-head__main">
            <span className="c-tile">
              <ResourceIcon name={resource.icon} size={20} />
            </span>
            <div>
              <div className="c-eyebrow mono">/data/{resource.key}</div>
              <h1 className="c-title">{resource.label}</h1>
            </div>
            <span className="c-count mono">{meta.total} rows</span>
          </div>
          <Link href={`${tableUrl(resource.key)}/create`} className="btn btn--primary btn--sm">
            <Plus size={15} /> New {resource.singular.toLowerCase()}
          </Link>
        </header>

        <div className="c-toolbar">
          <label className="c-filter">
            <Search size={15} />
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder={`Filter ${resource.label.toLowerCase()}…`}
            />
          </label>
          {filters.q && (
            <span className="c-toolbar__note">
              {meta.total} match{meta.total === 1 ? '' : 'es'} for “{filters.q}”
            </span>
          )}
        </div>

        <div className="c-panel c-table-wrap">
          <table className="c-table">
            <thead>
              <tr>
                <th className="c-table__id mono">#</th>
                {columns.map((field) => (
                  <th key={field.name}>
                    <button type="button" className="c-sort" onClick={() => sortBy(field.name)}>
                      {field.label}
                      {filters.sort === field.name &&
                        (filters.dir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                    </button>
                  </th>
                ))}
                <th className="c-table__actions" />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 2} className="c-empty-row">
                    {filters.q ? 'Nothing matches that filter.' : 'No rows yet.'}
                  </td>
                </tr>
              )}
              {rows.map((row, i) => (
                <tr
                  key={row.id}
                  className="c-row"
                  style={{ animationDelay: `${Math.min(i, 12) * 18}ms` }}
                  onClick={() => router.visit(recordUrl(resource.key, row.id))}
                >
                  <td className="c-table__id mono">{row.id}</td>
                  {columns.map((field) => (
                    <td key={field.name}>
                      <Cell field={field} row={row} query={filters.q} />
                    </td>
                  ))}
                  <td className="c-table__actions" onClick={(event) => event.stopPropagation()}>
                    <Link
                      href={`${recordUrl(resource.key, row.id)}/edit`}
                      className="iconbtn"
                      aria-label="Edit"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      type="button"
                      className="iconbtn c-danger"
                      aria-label="Delete"
                      title="Delete"
                      onClick={() => destroy(row)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {meta.lastPage > 1 && (
          <nav className="c-pager mono">
            <button
              type="button"
              className="iconbtn"
              disabled={meta.currentPage <= 1}
              onClick={() => visit({ page: meta.currentPage - 1 })}
              aria-label="Previous page"
            >
              <ChevronLeft size={15} />
            </button>
            page {meta.currentPage} / {meta.lastPage}
            <button
              type="button"
              className="iconbtn"
              disabled={meta.currentPage >= meta.lastPage}
              onClick={() => visit({ page: meta.currentPage + 1 })}
              aria-label="Next page"
            >
              <ChevronRight size={15} />
            </button>
          </nav>
        )}
      </Page>
    </DataShell>
  )
}

DataTable.layout = [AppLayout]
