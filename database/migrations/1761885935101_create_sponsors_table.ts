import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Module 1: one row per sponsor organisation
 */
export default class extends BaseSchema {
  protected tableName = 'sponsors'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 200).notNullable()
      table.string('industry', 150).nullable()
      table.string('website', 255).nullable()
      table
        .enum('sponsor_type', ['corporate', 'university', 'foundation', 'government', 'other'])
        .notNullable()
      table
        .enum('tier', ['platinum', 'gold', 'silver', 'bronze', 'in_kind', 'prospect'])
        .notNullable()
        .defaultTo('prospect')
      table
        .enum('relationship_status', ['prospect', 'contacted', 'active', 'lapsed', 'declined'])
        .notNullable()
        .defaultTo('prospect')
      table.integer('relationship_owner_id').unsigned().nullable()
      table.date('first_contact_date').nullable()
      table.text('notes').nullable()
      table.dateTime('created_at').notNullable().defaultTo(this.now())
      table
        .dateTime('updated_at')
        .notNullable()
        .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

      table.unique(['name'], { indexName: 'uq_sponsors_name' })
      table.index(['relationship_status'], 'idx_sponsors_status')
      table.index(['tier'], 'idx_sponsors_tier')
      table
        .foreign('relationship_owner_id', 'fk_sponsors_owner')
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
