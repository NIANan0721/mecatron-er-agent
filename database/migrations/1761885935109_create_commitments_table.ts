import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Module 1: what each side has promised (cash, in-kind, logo placement, reports...)
 */
export default class extends BaseSchema {
  protected tableName = 'commitments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('sponsor_id').unsigned().notNullable()
      table.enum('direction', ['sponsor_to_mecatron', 'mecatron_to_sponsor']).notNullable()
      table
        .enum('type', ['cash', 'in_kind', 'logo_placement', 'report', 'event', 'other'])
        .notNullable()
      table.string('description', 500).notNullable()
      table.decimal('amount_sgd', 12, 2).nullable()
      table.date('due_date').nullable()
      table
        .enum('status', ['promised', 'in_progress', 'fulfilled', 'cancelled'])
        .notNullable()
        .defaultTo('promised')
      table.integer('owner_member_id').unsigned().nullable()
      table.dateTime('created_at').notNullable().defaultTo(this.now())
      table
        .dateTime('updated_at')
        .notNullable()
        .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

      table.index(['status', 'due_date'], 'idx_commitments_status_due')
      table.index(['due_date'], 'idx_commitments_due')
      table.check('amount_sgd IS NULL OR amount_sgd >= 0', [], 'chk_commitments_amount')

      table
        .foreign('sponsor_id', 'fk_commitments_sponsor')
        .references('id')
        .inTable('sponsors')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .foreign('owner_member_id', 'fk_commitments_owner')
        .references('id')
        .inTable('members')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
