import vine from '@vinejs/vine'
import { RECIPIENT_TYPES } from '#resources/case_recipients'

export const caseRecipientValidator = vine.create({
  caseId: vine.number().exists({ table: 'email_cases', column: 'id' }),
  recipientType: vine.enum(RECIPIENT_TYPES),
  email: vine.string().trim().email().maxLength(255),
  contactId: vine.number().exists({ table: 'sponsor_contacts', column: 'id' }).nullable(),
})
