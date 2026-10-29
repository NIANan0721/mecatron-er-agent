import { useEffect, useMemo, useRef, useState } from 'react'
import { router } from '@inertiajs/react'
import { ArrowRight, CornerDownLeft, LoaderCircle, Search } from 'lucide-react'
import Highlight from '~/components/data/highlight'
import ResourceIcon from '~/components/data/resource_icon'
import { recordUrl, tableUrl } from '~/components/data/util'

/**
 * Fired with the matching table keys, so the relationship map can light them up
 */
export const SEARCH_EVENT = 'data-search'

type Hit = { id: number; title: string; field: string; snippet: string }
type Group = { key: string; label: string; icon: string; total: number; hits: Hit[] }
type Results = { q: string; total: number; groups: Group[] }

export default function GlobalSearch() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<Results | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  const announce = (keys: string[]) =>
    window.dispatchEvent(new CustomEvent(SEARCH_EVENT, { detail: keys }))

  /**
   * Ctrl+K / Cmd+K focuses the search bar from anywhere
   */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        input.current?.focus()
        input.current?.select()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /**
   * Live search, debounced; a newer keystroke cancels the older request
   */
  useEffect(() => {
    const term = q.trim()
    if (term.length < 2) {
      // too short to search: the panel hides itself, just clear the map highlight
      announce([])
      return
    }
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await fetch(`/search?q=${encodeURIComponent(term)}`, {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        })
        const data: Results = await response.json()
        setResults(data)
        setActive(0)
        announce(data.groups.map((group) => group.key))
      } catch {
        // aborted or offline: keep the previous results
      } finally {
        setLoading(false)
      }
    }, 180)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [q])

  useEffect(() => router.on('navigate', () => setOpen(false)), [])

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  /**
   * Each table row and hit gets a position in display order, so arrow keys
   * can move through all of them
   */
  const { sections, items } = useMemo(() => {
    const flat: { href: string }[] = []
    const add = (href: string) => flat.push({ href }) - 1
    const grouped = (results?.groups ?? []).map((group) => ({
      group,
      index: add(`${tableUrl(group.key)}?q=${encodeURIComponent(results!.q)}`),
      hits: group.hits.map((hit) => ({ hit, index: add(recordUrl(group.key, hit.id)) })),
    }))
    return { sections: grouped, items: flat }
  }, [results])

  const go = (href: string) => {
    setOpen(false)
    input.current?.blur()
    router.visit(href)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActive((i) => Math.min(i + 1, items.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (event.key === 'Enter' && items[active]) {
      event.preventDefault()
      go(items[active].href)
    } else if (event.key === 'Escape') {
      setOpen(false)
      input.current?.blur()
    }
  }

  const showPanel = open && q.trim().length >= 2 && results

  return (
    <div className="c-search" ref={root}>
      <label className={`c-search__box ${open ? 'is-open' : ''}`}>
        <Search size={15} />
        <input
          ref={input}
          value={q}
          placeholder="Search every table…"
          onChange={(event) => {
            setQ(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          aria-label="Search all tables"
        />
        {loading ? (
          <LoaderCircle size={14} className="c-spin" />
        ) : (
          <kbd className="kbd c-search__kbd">Ctrl K</kbd>
        )}
      </label>

      {showPanel && (
        <div className="c-search__panel">
          <div className="c-search__summary mono">
            {results.total === 0
              ? `no matches for “${results.q}”`
              : `${results.total} match${results.total === 1 ? '' : 'es'} in ${results.groups.length} table${results.groups.length === 1 ? '' : 's'}`}
          </div>
          {sections.map(({ group, index: groupIndex, hits }) => (
            <div key={group.key} className="c-search__group">
              <button
                type="button"
                className={`c-search__table ${active === groupIndex ? 'is-active' : ''}`}
                onMouseEnter={() => setActive(groupIndex)}
                onClick={() => go(items[groupIndex].href)}
              >
                <ResourceIcon name={group.icon} size={14} />
                <span>{group.label}</span>
                <span className="c-search__count mono">{group.total}</span>
                <span className="c-search__open">
                  open table <ArrowRight size={12} />
                </span>
              </button>
              {hits.map(({ hit, index: hitIndex }) => (
                <button
                  key={hit.id}
                  type="button"
                  className={`c-search__hit ${active === hitIndex ? 'is-active' : ''}`}
                  onMouseEnter={() => setActive(hitIndex)}
                  onClick={() => go(items[hitIndex].href)}
                >
                  <span className="c-search__title">
                    <Highlight text={hit.title} query={results.q} />
                  </span>
                  <span className="c-search__snippet">
                    <span className="c-search__field">{hit.field}</span>
                    <Highlight text={hit.snippet} query={results.q} />
                  </span>
                  {active === hitIndex && <CornerDownLeft size={12} className="c-search__enter" />}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
