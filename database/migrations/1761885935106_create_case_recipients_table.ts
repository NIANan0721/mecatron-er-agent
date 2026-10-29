import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Module 3: To / CC / BCC list for each email case
 */
export default class extends BaseSchema {
  protected tableName = 'case_recipients'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('case_id').unsigned().notNullable()
      table.enum('recipient_type', ['to', 'cc', 'bcc']).notNullable()
      table.string('email', 255).notNullable()
      table.integer('contact_id').unsigned().nullable()
      table.dateTime('created_at').notNullable().defaultTo(this.now())
      table
        .dateTime('updated_at')
        .notNullable()
        .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

      table.unique(['case_id', 'email'], { indexName: 'uq_recipients_case_email' })
      table
        .foreign('case_id', 'fk_recipients_case')
        .references('id')
        .inTable('email_cases')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .foreign('contact_id', 'fk_recipients_contact')
        .references('id')
        .inTable('sponsor_contacts')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
