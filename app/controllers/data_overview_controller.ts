import db from '@adonisjs/lucid/services/db'
import { resources } from '#resources/index'
import type { HttpContext } from '@adonisjs/core/http'

const VIEWS = ['v_case_dashboard', 'v_open_tasks', 'v_sponsor_overview', 'v_sponsor_timeline']

export default class DataOverviewController {
  /**
   * GET /data   Relationship map of every table, built from the live schema
   */
  async show({ inertia }: HttpContext) {
    const keys = resources.map((resource) => resource.key)

    const [columns, foreignKeys] = await Promise.all([
      db
        .from('information_schema.columns')
        .select(
          'table_name as tableName',
          'column_name as name',
          'column_type as type',
          'column_key as columnKey'
        )
        .whereRaw('table_schema = database()')
        .whereIn('table_name', keys)
        // generated helper columns (current_flag, primary_flag) aren't real data
        .whereNot('extra', 'like', '%GENERATED%')
        .orderBy('ordinal_position'),
      db
        .from('information_schema.key_column_usage as k')
        .join('information_schema.referential_constraints as r', (join) => {
          join
            .on('r.constraint_name', 'k.constraint_name')
            .andOn('r.constraint_schema', 'k.constraint_schema')
        })
        .select(
          'k.constraint_name as name',
          'k.table_name as source',
          'k.column_name as column',
          'k.referenced_table_name as target',
          'r.delete_rule as deleteRule'
        )
        .whereRaw('k.table_schema = database()')
        .whereIn('k.table_name', keys)
        .whereIn('k.referenced_table_name', keys)
        .orderBy('k.ordinal_position'),
    ])

    /**
     * One edge per FK constraint; composite keys list several columns
     */
    const edges = new Map<
      string,
      { id: string; source: string; target: string; columns: string[]; deleteRule: string }
    >()
    for (const fk of foreignKeys) {
      const edge = edges.get(fk.name) ?? {
        id: fk.name,
        source: fk.source,
        target: fk.target,
        columns: [] as string[],
        deleteRule: fk.deleteRule,
      }
      edge.columns.push(fk.column)
      edges.set(fk.name, edge)
    }
    const fkColumns = new Set(foreignKeys.map((fk) => `${fk.source}.${fk.column}`))

    const tables = await Promise.all(
      resources.map(async (resource) => {
        const [{ total }] = await db.from(resource.key).count('* as total')
        return {
          key: resource.key,
          label: resource.label,
          icon: resource.icon,
          lane: resource.lane,
          rows: Number(total),
          columns: columns
            .filter((column) => column.tableName === resource.key)
            .map((column) => ({
              name: column.name as string,
              type: column.type as string,
              pk: column.columnKey === 'PRI',
              fk: fkColumns.has(`${resource.key}.${column.name}`),
            })),
        }
      })
    )

    const views = await Promise.all(
      VIEWS.map(async (name) => {
        const [{ total }] = await db.from(name).count('* as total')
        return { name, rows: Number(total) }
      })
    )

    return inertia.render('data/index', { tables, edges: [...edges.values()], views })
  }
}
