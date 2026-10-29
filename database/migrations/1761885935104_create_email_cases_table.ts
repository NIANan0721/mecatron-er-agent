import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Module 3: one row per outgoing sponsor email (ER-001, ER-002, ...)
 */
export default class extends BaseSchema {
  protected tableName = 'email_cases'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('case_code', 12).notNullable()
      table.string('title', 200).notNullable()
      table.integer('sponsor_id').unsigned().notNullable()
      table.integer('primary_contact_id').unsigned().notNullable()
      table.integer('template_id').unsigned().nullable()
      table.integer('initiated_by').unsigned().notNullable()
      // must be a lead (enforced by the triggers below)
      table.integer('assigned_sender_id').unsigned().notNullable()
      table.text('purpose').notNullable()
      table.text('desired_outcome').nullable()
      table
        .enum('status', [
          'draft',
          'awaiting_approval',
          'changes_requested',
          'approved_ready_to_send',
          'completed',
          'cancelled',
        ])
        .notNullable()
        .defaultTo('draft')
      table.integer('completed_by').unsigned().nullable()
      table.dateTime('completed_at').nullable()
      table.dateTime('created_at').notNullable().defaultTo(this.now())
      table
        .dateTime('updated_at')
        .notNullable()
        .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

      table.unique(['case_code'], { indexName: 'uq_cases_code' })
      table.index(['status'], 'idx_cases_status')
      table.index(['primary_contact_id', 'sponsor_id'], 'idx_cases_contact_sponsor')

      table.check(`case_code REGEXP '^ER-[0-9]{3,}$'`, [], 'chk_cases_code')
      table.check(
        `(status = 'completed' AND completed_by IS NOT NULL AND completed_at IS NOT NULL) OR
         (status <> 'completed' AND completed_by IS NULL AND completed_at IS NULL)`,
        [],
        'chk_cases_completion'
      )

      table
        .foreign('sponsor_id', 'fk_cases_sponsor')
        .references('id')
        .inTable('sponsors')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')
      // composite FK guarantees the primary contact belongs to the case's sponsor
      table
        .foreign(['primary_contact_id', 'sponsor_id'], 'fk_cases_primary_contact')
        .references(['id', 'sponsor_id'])
        .inTable('sponsor_contacts')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')
      table
        .foreign('template_id', 'fk_cases_template')
        .references('id')
        .inTable('email_templates')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
      table
        .foreign('initiated_by', 'fk_cases_initiated_by')
        .references('id')
        .inTable('members')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')
      table
        .foreign('assigned_sender_id', 'fk_cases_sender')
        .references('id')
        .inTable('members')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')
      // no CASCADE: completed_by is used in chk_cases_completion
      table
        .foreign('completed_by', 'fk_cases_completed_by')
        .references('id')
        .inTable('members')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT')
    })

    for (const event of ['INSERT', 'UPDATE'] as const) {
      const suffix = event === 'INSERT' ? 'bi' : 'bu'
      const changed =
        event === 'UPDATE' ? 'NEW.assigned_sender_id <> OLD.assigned_sender_id AND' : ''

      this.schema.raw(`
        CREATE TRIGGER trg_email_cases_sender_is_lead_${suffix}
        BEFORE ${event} ON email_cases
        FOR EACH ROW
        BEGIN
          IF ${changed} NOT EXISTS (
            SELECT 1 FROM members WHERE id = NEW.assigned_sender_id AND is_lead = TRUE
          ) THEN
            SIGNAL SQLSTATE '45000'
              SET MESSAGE_TEXT = 'email_cases.assigned_sender_id must reference a member with is_lead = TRUE';
          END IF;
        END
      `)
    }
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
