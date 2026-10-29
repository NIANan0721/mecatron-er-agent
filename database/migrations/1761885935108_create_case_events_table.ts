import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Module 3: append-only audit log for each email case
 */
export default class extends BaseSchema {
  protected tableName = 'case_events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('case_id').unsigned().notNullable()
      // NULL = system (e.g. automatic notification)
      table.integer('actor_id').unsigned().nullable()
      table
        .enum('event_type', [
          'created',
          'draft_generated',
          'draft_edited',
          'submitted',
          'approved',
          'changes_requested',
          'notified',
          'marked_done',
          'cancelled',
          'recipients_updated',
          'note',
        ])
        .notNullable()
      table.text('details').nullable()
      table.dateTime('created_at').notNullable().defaultTo(this.now())

      table.index(['case_id', 'created_at'], 'idx_events_case_time')
      table.index(['event_type'], 'idx_events_type')
      table
        .foreign('case_id', 'fk_events_case')
        .references('id')
        .inTable('email_cases')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .foreign('actor_id', 'fk_events_actor')
        .references('id')
        .inTable('members')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
