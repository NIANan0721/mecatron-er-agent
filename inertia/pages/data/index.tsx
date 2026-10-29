import { Link } from '@adonisjs/inertia/react'
import { Eye, KeyRound, Link2, MousePointerClick, Network } from 'lucide-react'
import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import ResourceIcon from '~/components/data/resource_icon'
import SchemaGraph, {
  RULE_COLORS,
  type GraphEdge,
  type GraphTable,
} from '~/components/data/schema_graph'
import { tableUrl } from '~/components/data/util'
import { type InertiaProps } from '~/types'

const LANES = [
  { key: 'people', label: 'People' },
  { key: 'knowledge', label: 'Sponsor knowledge base' },
  { key: 'cases', label: 'Email cases' },
] as const

const RULES = [
  { rule: 'CASCADE', label: 'cascade', hint: 'children are deleted with the parent' },
  { rule: 'RESTRICT', label: 'restrict', hint: 'delete is blocked while children exist' },
  { rule: 'SET NULL', label: 'set null', hint: 'children keep existing, link is cleared' },
]

export default function DataOverview({
  tables,
  edges,
  views,
}: InertiaProps<{
  tables: GraphTable[]
  edges: GraphEdge[]
  views: { name: string; rows: number }[]
}>) {
  const totalRows = tables.reduce((sum, table) => sum + table.rows, 0)
  const linkCount = (key: string) =>
    edges.filter((edge) => edge.source === key || edge.target === key).length

  return (
    <Page title="Relationship map" hideTitle>
      <div className="c-wide">
        <header className="c-head">
          <div className="c-head__main">
            <span className="c-tile">
              <Network size={20} strokeWidth={1.8} />
            </span>
            <div>
              <div className="c-eyebrow mono">mecatron_er · live schema</div>
              <h1 className="c-title">Relationship map</h1>
            </div>
          </div>
          <div className="c-stats mono">
            <span>
              <b>{tables.length}</b> tables
            </span>
            <span>
              <b>{totalRows}</b> rows
            </span>
            <span>
              <b>{edges.length}</b> links
            </span>
          </div>
        </header>

        <div className="c-legend">
          {RULES.map(({ rule, label, hint }) => (
            <span key={rule} className="c-legend__item" title={hint}>
              <i className="c-legend__line" style={{ background: RULE_COLORS[rule] }} />
              {label}
            </span>
          ))}
          <span className="c-legend__item">
            <KeyRound size={12} /> primary key
          </span>
          <span className="c-legend__item">
            <Link2 size={12} /> foreign key
          </span>
          <span className="c-legend__hint">
            <MousePointerClick size={13} /> hover a table to trace its links · click to open · drag,
            scroll to zoom
          </span>
        </div>

        <div className="c-panel c-graph">
          <SchemaGraph tables={tables} edges={edges} />
        </div>

        {LANES.map((lane) => (
          <section key={lane.key} className="c-lane">
            <h2 className="c-section-title">{lane.label}</h2>
            <div className="c-cards">
              {tables
                .filter((table) => table.lane === lane.key)
                .map((table) => (
                  <Link key={table.key} href={tableUrl(table.key)} className="c-panel c-card">
                    <span className="c-tile c-tile--sm">
                      <ResourceIcon name={table.icon} size={16} />
                    </span>
                    <span className="c-card__body">
                      <span className="c-card__label">{table.label}</span>
                      <span className="c-card__meta mono">
                        {table.rows} rows · {linkCount(table.key)} links
                      </span>
                    </span>
                  </Link>
                ))}
            </div>
          </section>
        ))}

        <section className="c-lane">
          <h2 className="c-section-title">
            <Eye size={14} /> Views (read-only)
          </h2>
          <div className="c-cards">
            {views.map((view) => (
              <div key={view.name} className="c-panel c-card c-card--static">
                <span className="c-card__body">
                  <span className="c-card__label mono">{view.name}</span>
                  <span className="c-card__meta mono">{view.rows} rows</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Page>
  )
}

DataOverview.layout = [AppLayout]
