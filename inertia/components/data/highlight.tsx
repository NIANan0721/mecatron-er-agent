/**
 * Wraps every occurrence of `query` in <mark>, ignoring case
 */
export default function Highlight({ text, query }: { text: string; query?: string }) {
  const q = query?.trim()
  if (!q) return <>{text}</>

  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="c-mark">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}
