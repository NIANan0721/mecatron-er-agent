import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronsUpDown, Search, X } from 'lucide-react'

type Option = { value: number; label: string }

/**
 * A dropdown you can type into, for picking a linked record by name
 */
export default function SelectSearch({
  id,
  value,
  options,
  onChange,
  invalid,
  required,
}: {
  id: string
  value: string
  options: Option[]
  onChange: (value: string) => void
  invalid?: boolean
  required?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)

  const selected = options.find((option) => String(option.value) === value)
  const visible = useMemo(
    () => options.filter((option) => option.label.toLowerCase().includes(filter.toLowerCase())),
    [options, filter]
  )

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const pick = (option: Option) => {
    onChange(String(option.value))
    setOpen(false)
    setFilter('')
  }

  return (
    <div className="c-combo" ref={root}>
      <button
        id={id}
        type="button"
        className="field__input c-combo__button"
        data-invalid={invalid ? 'true' : undefined}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? '' : 'c-null'}>{selected?.label ?? 'Choose…'}</span>
        <ChevronsUpDown size={14} />
      </button>
      {selected && !required && (
        <button
          type="button"
          className="c-combo__clear"
          aria-label="Clear"
          onClick={() => onChange('')}
        >
          <X size={13} />
        </button>
      )}
      {open && (
        <div className="c-combo__panel" role="listbox">
          <label className="c-combo__filter">
            <Search size={14} />
            <input
              autoFocus
              value={filter}
              placeholder="Type to filter…"
              onChange={(event) => {
                setFilter(event.target.value)
                setActive(0)
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault()
                  setActive((i) => Math.min(i + 1, visible.length - 1))
                } else if (event.key === 'ArrowUp') {
                  event.preventDefault()
                  setActive((i) => Math.max(i - 1, 0))
                } else if (event.key === 'Enter' && visible[active]) {
                  event.preventDefault()
                  pick(visible[active])
                } else if (event.key === 'Escape') {
                  setOpen(false)
                }
              }}
            />
          </label>
          <div className="c-combo__list">
            {visible.length === 0 && <div className="c-combo__empty">No matches</div>}
            {visible.map((option, i) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={String(option.value) === value}
                className={`c-combo__option ${i === active ? 'is-active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
