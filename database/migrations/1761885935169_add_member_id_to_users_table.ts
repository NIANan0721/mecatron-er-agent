import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Links an app login to a Mecatron member. The members table is owned by
 * mecatron-er-db/sql/01_schema.sql, so run setup_db.py before migrating.
 */
export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('member_id')
        .unsigned()
        .nullable()
        .unique()
        .references('id')
        .inTable('members')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['member_id'])
      table.dropColumn('member_id')
    })
  }
}
