import vine from '@vinejs/vine'
import { TEMPLATE_SCENARIOS } from '#resources/email_templates'

export const emailTemplateValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(150),
  scenario: vine.enum(TEMPLATE_SCENARIOS),
  subjectTemplate: vine.string().trim().minLength(1).maxLength(255),
  bodyTemplate: vine.string().minLength(1),
  isActive: vine.boolean(),
})
