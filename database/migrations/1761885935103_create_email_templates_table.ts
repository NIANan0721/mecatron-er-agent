import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Module 2: drafting templates with {{placeholders}}
 */
export default class extends BaseSchema {
  protected tableName = 'email_templates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 150).notNullable()
      table
        .enum('scenario', [
          'sponsorship_request',
          'thank_you',
          'follow_up',
          'logo_request',
          'event_coordination',
          'funding_update',
          'report_submission',
        ])
        .notNullable()
      table.string('subject_template', 255).notNullable()
      table.text('body_template').notNullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.dateTime('created_at').notNullable().defaultTo(this.now())
      table
        .dateTime('updated_at')
        .notNullable()
        .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

      table.unique(['name'], { indexName: 'uq_templates_name' })
      table.index(['scenario', 'is_active'], 'idx_templates_scenario')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
