import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Module 1: links to proposals, contracts, decks, reports and logos
 */
export default class extends BaseSchema {
  protected tableName = 'documents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      // NULL = general team document
      table.integer('sponsor_id').unsigned().nullable()
      table.string('title', 255).notNullable()
      table
        .enum('doc_type', [
          'proposal',
          'contract',
          'deck',
          'report',
          'email_thread',
          'logo',
          'other',
        ])
        .notNullable()
      table.string('url_or_path', 1000).notNullable()
      table.integer('uploaded_by').unsigned().notNullable()
      table.dateTime('created_at').notNullable().defaultTo(this.now())
      table
        .dateTime('updated_at')
        .notNullable()
        .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

      table.index(['doc_type'], 'idx_documents_type')
      table
        .foreign('sponsor_id', 'fk_documents_sponsor')
        .references('id')
        .inTable('sponsors')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
      table
        .foreign('uploaded_by', 'fk_documents_uploaded_by')
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
