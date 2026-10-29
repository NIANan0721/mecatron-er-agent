import mysql from 'mysql2/promise'
import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

/**
 * One-command database setup:
 *
 *   node ace db:setup
 *
 * Creates the database if it does not exist, drops everything in it, runs
 * all migrations (tables, triggers, views) and seeds the demo data.
 */
export default class DbSetup extends BaseCommand {
  static commandName = 'db:setup'
  static description =
    'Create the database, run all migrations and seed demo data (wipes existing data)'
  static options: CommandOptions = { startApp: true }

  @flags.boolean({ description: 'Skip the confirmation prompt (and allow running in production)' })
  declare force: boolean

  @flags.boolean({ default: true, description: 'Seed demo data (use --no-seed for tables only)' })
  declare seed: boolean

  async run() {
    if (this.app.inProduction && !this.force) {
      this.logger.error(
        'Refusing to wipe the database in production. Pass --force if you really mean it.'
      )
      this.exitCode = 1
      return
    }

    const { default: env } = await import('#start/env')
    const database = env.get('DB_DATABASE')
    const existing = await this.ensureDatabase(env, database)

    if (existing.tables > 0 && !this.force) {
      const confirmed = await this.prompt.confirm(
        `"${database}" already has ${existing.tables} tables. Delete ALL its data and rebuild it?`
      )
      if (!confirmed) {
        this.logger.info('Cancelled. Nothing was changed.')
        return
      }
    }

    /**
     * Lucid sends an empty "DROP VIEW ;" when there are no views to drop
     */
    const args = existing.views > 0 ? ['--drop-views'] : []
    if (this.seed) args.push('--seed')
    if (this.app.inProduction) args.push('--force')

    const fresh = await this.kernel.exec('migration:fresh', args)
    if (fresh.exitCode) {
      this.exitCode = fresh.exitCode
      return
    }

    await this.printRowCounts()
    this.logger.success(`Database "${database}" is ready`)
  }

  /**
   * Connects without selecting a database, creates it when missing and
   * returns how many tables and views it already contains.
   */
  private async ensureDatabase(env: typeof import('#start/env').default, database: string) {
    const connection = await mysql.createConnection({
      host: env.get('DB_HOST'),
      port: env.get('DB_PORT'),
      user: env.get('DB_USER'),
      password: env.get('DB_PASSWORD'),
    })

    try {
      const name = database.replaceAll('`', '``')
      await connection.query(
        `CREATE DATABASE IF NOT EXISTS \`${name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`
      )
      const [rows] = await connection.query<mysql.RowDataPacket[]>(
        `SELECT SUM(table_type = 'BASE TABLE') AS tables, SUM(table_type = 'VIEW') AS views
         FROM information_schema.tables WHERE table_schema = ?`,
        [database]
      )
      return { tables: Number(rows[0].tables ?? 0), views: Number(rows[0].views ?? 0) }
    } finally {
      await connection.end()
    }
  }

  private async printRowCounts() {
    const { default: db } = await import('@adonisjs/lucid/services/db')
    const objects = await db
      .from('information_schema.tables')
      .select('table_name as name', 'table_type as type')
      .whereRaw('table_schema = database()')
      .orderBy([
        { column: 'table_type', order: 'asc' },
        { column: 'table_name', order: 'asc' },
      ])

    const table = this.ui.table()
    table.head(['Name', 'Type', 'Rows'])
    for (const { name, type } of objects) {
      const [{ total }] = await db.from(name).count('* as total')
      table.row([name, type === 'VIEW' ? 'view' : 'table', String(total)])
    }
    table.render()
  }
}
