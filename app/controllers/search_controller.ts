import db from '@adonisjs/lucid/services/db'
import string from '@adonisjs/core/helpers/string'
import { resources } from '#resources/index'
import type { HttpContext } from '@adonisjs/core/http'

const TEXT_TYPES = new Set(['text', 'textarea', 'email', 'url', 'enum'])
const HITS_PER_TABLE = 5

/**
 * A short piece of text around the first match, for the results list
 */
function snippet(value: string, q: string) {
  const at = value.toLowerCase().indexOf(q.toLowerCase())
  if (at === -1) return value.slice(0, 90)
  const start = Math.max(0, at - 35)
  return `${start > 0 ? '…' : ''}${value.slice(start, at + q.length + 55)}${at + q.length + 55 < value.length ? '…' : ''}`
}

export default class SearchController {
  /**
   * GET /search?q=   Search every text column of every table. Returns JSON
   * grouped by table for the header search bar.
   */
  async index({ request, response }: HttpContext) {
    const q = String(request.input('q', '')).trim()
    if (q.length < 2) {
      return response.json({ q, total: 0, groups: [] })
    }

    // escape LIKE wildcards so "50%" searches for the literal text.
    // whereILike (not whereLike): Knex adds "COLLATE utf8_bin" to whereLike on
    // MySQL, which is invalid for utf8mb4; our *_ai_ci collation already
    // ignores case and accents.
    const like = `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`

    const groups = []
    for (const resource of resources) {
      const fields = resource.fields.filter((field) => TEXT_TYPES.has(field.type))
      if (fields.length === 0) continue

      const columns = fields.map((field) => string.snakeCase(field.name))
      const titleColumn = string.snakeCase(resource.titleField)
      const query = db
        .from(resource.key)
        .where((w) => columns.forEach((column) => w.orWhereILike(column, like)))

      const [{ total }] = await query.clone().count('* as total')
      if (Number(total) === 0) continue

      const rows = await query
        .select(['id', ...new Set([titleColumn, ...columns])])
        .orderBy('id')
        .limit(HITS_PER_TABLE)

      groups.push({
        key: resource.key,
        label: resource.label,
        icon: resource.icon,
        total: Number(total),
        hits: rows.map((row) => {
          const index = columns.findIndex((column) =>
            String(row[column] ?? '')
              .toLowerCase()
              .includes(q.toLowerCase())
          )
          const field = fields[Math.max(index, 0)]
          return {
            id: row.id as number,
            title: String(row[titleColumn] ?? `#${row.id}`),
            field: field.label,
            snippet: snippet(String(row[columns[Math.max(index, 0)]] ?? ''), q),
          }
        }),
      })
    }

    return response.json({ q, total: groups.reduce((sum, g) => sum + g.total, 0), groups })
  }
}
