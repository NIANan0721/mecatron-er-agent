import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Module 1: timeline of every email, meeting, call and event with a sponsor
 */
export default class extends BaseSchema {
  protected tableName = 'interactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('sponsor_id').unsigned().notNullable()
      table.integer('contact_id').unsigned().nullable()
      table.integer('member_id').unsigned().notNullable()
      table.integer('case_id').unsigned().nullable()
      table.enum('channel', ['email', 'meeting', 'call', 'event', 'other']).notNullable()
      table.enum('direction', ['inbound', 'outbound', 'internal_note']).notNullable()
      table.dateTime('occurred_at').notNullable()
      table.string('subject', 255).notNullable()
      table.text('summary').nullable()
      table.text('key_decisions').nullable()
      table.dateTime('created_at').notNullable().defaultTo(this.now())
      table
        .dateTime('updated_at')
        .notNullable()
        .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

      table.index(['sponsor_id', 'occurred_at'], 'idx_interactions_sponsor_time')
      table.index(['occurred_at'], 'idx_interactions_time')

      table
        .foreign('sponsor_id', 'fk_interactions_sponsor')
        .references('id')
        .inTable('sponsors')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .foreign('contact_id', 'fk_interactions_contact')
        .references('id')
        .inTable('sponsor_contacts')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
      table
        .foreign('member_id', 'fk_interactions_member')
        .references('id')
        .inTable('members')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')
      table
        .foreign('case_id', 'fk_interactions_case')
        .references('id')
        .inTable('email_cases')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
