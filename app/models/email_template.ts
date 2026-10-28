import { EmailTemplateSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import EmailCase from '#models/email_case'

export default class EmailTemplate extends EmailTemplateSchema {
  @hasMany(() => EmailCase, { foreignKey: 'templateId' })
  declare emailCases: HasMany<typeof EmailCase>
}
