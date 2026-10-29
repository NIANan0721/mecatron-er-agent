import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Mecatron members and leads
 */
export default class extends BaseSchema {
  protected tableName = 'members'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 120).notNullable()
      table.string('email', 255).notNullable()
      table.string('role_title', 120).notNullable()
      table.enum('sub_team', ['Mechanical', 'Electrical', 'Software', 'Business/ER']).notNullable()
      table.boolean('is_lead').notNullable().defaultTo(false)
      table.boolean('is_active').notNullable().defaultTo(true)
      table.dateTime('created_at').notNullable().defaultTo(this.now())
      table
        .dateTime('updated_at')
        .notNullable()
        .defaultTo(this.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

      table.unique(['email'], { indexName: 'uq_members_email' })
      table.index(['sub_team'], 'idx_members_sub_team')
      table.index(['is_lead', 'is_active'], 'idx_members_lead_active')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
