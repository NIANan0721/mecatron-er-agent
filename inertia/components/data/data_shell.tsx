import { type ReactNode } from 'react'
import { Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import { Network } from 'lucide-react'
import ResourceIcon from '~/components/data/resource_icon'
import { tableUrl } from '~/components/data/util'

const LANES = [
  { key: 'people', label: 'People' },
  { key: 'knowledge', label: 'Sponsor knowledge base' },
  { key: 'cases', label: 'Email cases' },
] as const

/**
 * Sidebar of every table (grouped like the relationship map) + page content
 */
export default function DataShell({ active, children }: { active?: string; children: ReactNode }) {
  const { resources } = usePage().props

  return (
    <div className="c-shell">
      <aside className="c-side">
        <Link href="/data" className="c-side__item c-side__item--map">
          <Network size={15} strokeWidth={1.8} />
          Relationship map
        </Link>
        {LANES.map((lane) => (
          <div key={lane.key} className="c-side__group">
            <div className="c-side__label">{lane.label}</div>
            {resources
              .filter((resource) => resource.lane === lane.key)
              .map((resource) => (
                <Link
                  key={resource.key}
                  href={tableUrl(resource.key)}
                  className="c-side__item"
                  aria-current={active === resource.key ? 'page' : undefined}
                >
                  <ResourceIcon name={resource.icon} size={15} />
                  {resource.label}
                </Link>
              ))}
          </div>
        ))}
      </aside>
      <div className="c-content">{children}</div>
    </div>
  )
}
