import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Module 1: actionable next steps for each sponsor
 */
export default class extends BaseSchema {
  protected tableName = 'follow_up_tasks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('sponsor_id').unsigned().notNullable()
      table.integer('interaction_id').unsigned().nullable()
      table.integer('commitment_id').unsigned().nullable()
      table.integer('assigned_member_id').unsigned().notNullable()
      table.string('description', 500).notNullable()
      table.enum('priority', ['low', 'medium', 'high']).notNullable().defaultTo('medium')
      table.date('due_date').nullable()
      table
        .enum('status', ['open', 'in_progress', 'done', 'cancelled'])
        .notNullable()
        .defaultTo('open')
      table.dateTime('completed_at').nullable()
      table.dateTime('created_at').notNullable().defaultTo(this.now())
      table
        .dateTime('updated_at')
        .notNullable()
        .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

      table.index(['status', 'due_date'], 'idx_tasks_status_due')
      table.index(['due_date'], 'idx_tasks_due')
      table.check("(status = 'done') = (completed_at IS NOT NULL)", [], 'chk_tasks_completed')

      table
        .foreign('sponsor_id', 'fk_tasks_sponsor')
        .references('id')
        .inTable('sponsors')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .foreign('interaction_id', 'fk_tasks_interaction')
        .references('id')
        .inTable('interactions')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
      table
        .foreign('commitment_id', 'fk_tasks_commitment')
        .references('id')
        .inTable('commitments')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
      table
        .foreign('assigned_member_id', 'fk_tasks_assignee')
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
