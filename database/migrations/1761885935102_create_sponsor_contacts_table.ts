import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Module 1: people we talk to at each sponsor
 */
export default class extends BaseSchema {
  protected tableName = 'sponsor_contacts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('sponsor_id').unsigned().notNullable()
      table.string('name', 120).notNullable()
      table.string('job_title', 150).nullable()
      table.string('email', 255).notNullable()
      table.string('phone', 40).nullable()
      table.boolean('is_primary').notNullable().defaultTo(false)
      table.boolean('default_cc').notNullable().defaultTo(false)
      table.text('notes').nullable()
      // 1 when primary, NULL otherwise: lets a UNIQUE key allow only one primary per sponsor
      table.specificType(
        'primary_flag',
        'TINYINT GENERATED ALWAYS AS (IF(is_primary, 1, NULL)) STORED'
      )
      table.dateTime('created_at').notNullable().defaultTo(this.now())
      table
        .dateTime('updated_at')
        .notNullable()
        .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

      table.unique(['sponsor_id', 'email'], { indexName: 'uq_contacts_sponsor_email' })
      table.unique(['sponsor_id', 'primary_flag'], { indexName: 'uq_contacts_one_primary' })
      // target of the composite FK from email_cases
      table.unique(['id', 'sponsor_id'], { indexName: 'uq_contacts_id_sponsor' })
      table.index(['email'], 'idx_contacts_email')
      table
        .foreign('sponsor_id', 'fk_contacts_sponsor')
        .references('id')
        .inTable('sponsors')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
