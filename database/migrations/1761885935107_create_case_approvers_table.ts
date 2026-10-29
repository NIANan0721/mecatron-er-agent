import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Module 3: approval decisions, tied to one specific draft version
 */
export default class extends BaseSchema {
  protected tableName = 'case_approvers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('case_id').unsigned().notNullable()
      table.integer('draft_id').unsigned().notNullable()
      table.integer('approver_id').unsigned().notNullable()
      table
        .enum('decision', ['pending', 'approved', 'changes_requested'])
        .notNullable()
        .defaultTo('pending')
      table.text('comment').nullable()
      table.dateTime('decided_at').nullable()
      table.dateTime('created_at').notNullable().defaultTo(this.now())
      table
        .dateTime('updated_at')
        .notNullable()
        .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

      table.unique(['draft_id', 'approver_id'], { indexName: 'uq_approvers_draft_approver' })
      table.index(['draft_id', 'case_id'], 'idx_approvers_draft_case')
      table.index(['approver_id', 'decision'], 'idx_approvers_approver_decision')
      table.check("(decision = 'pending') = (decided_at IS NULL)", [], 'chk_approvers_decided')

      table
        .foreign('case_id', 'fk_approvers_case')
        .references('id')
        .inTable('email_cases')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      // composite FK guarantees the draft belongs to the same case
      table
        .foreign(['draft_id', 'case_id'], 'fk_approvers_draft')
        .references(['id', 'case_id'])
        .inTable('case_drafts')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .foreign('approver_id', 'fk_approvers_member')
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
