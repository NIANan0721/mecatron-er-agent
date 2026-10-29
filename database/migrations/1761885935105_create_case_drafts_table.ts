import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Module 3: versioned drafts of each email case
 */
export default class extends BaseSchema {
  protected tableName = 'case_drafts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('case_id').unsigned().notNullable()
      table.smallint('version_no').unsigned().notNullable()
      table.string('subject', 255).notNullable()
      table.text('body').notNullable()
      // sponsor facts the AI used when drafting
      table.json('retrieved_context').nullable()
      // list of gaps the AI could not fill
      table.json('missing_info_flags').nullable()
      table.integer('created_by').unsigned().notNullable()
      table.boolean('is_current').notNullable().defaultTo(true)
      // 1 when current, NULL otherwise: only one current draft per case
      table.specificType(
        'current_flag',
        'TINYINT GENERATED ALWAYS AS (IF(is_current, 1, NULL)) STORED'
      )
      table.dateTime('created_at').notNullable().defaultTo(this.now())
      table
        .dateTime('updated_at')
        .notNullable()
        .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

      table.unique(['case_id', 'version_no'], { indexName: 'uq_drafts_case_version' })
      table.unique(['case_id', 'current_flag'], { indexName: 'uq_drafts_one_current' })
      // target of the composite FK from case_approvers
      table.unique(['id', 'case_id'], { indexName: 'uq_drafts_id_case' })
      table.check('version_no >= 1', [], 'chk_drafts_version')

      table
        .foreign('case_id', 'fk_drafts_case')
        .references('id')
        .inTable('email_cases')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
      table
        .foreign('created_by', 'fk_drafts_created_by')
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
