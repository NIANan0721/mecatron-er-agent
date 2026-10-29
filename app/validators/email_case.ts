import vine from '@vinejs/vine'
import { CASE_STATUSES } from '#resources/email_cases'
import { dateTimeField } from '#validators/helpers'

/**
 * Used for both create and update. The database also enforces:
 * - the primary contact belongs to the chosen sponsor (composite FK)
 * - the assigned sender is a lead (trigger)
 * - completed cases have completedBy + completedAt (CHECK)
 */
export const emailCaseValidator = vine.create({
  caseCode: vine
    .string()
    .trim()
    .regex(/^ER-\d{3,}$/)
    .maxLength(12),
  title: vine.string().trim().minLength(1).maxLength(200),
  sponsorId: vine.number().exists({ table: 'sponsors', column: 'id' }),
  primaryContactId: vine.number().exists({ table: 'sponsor_contacts', column: 'id' }),
  templateId: vine.number().exists({ table: 'email_templates', column: 'id' }).nullable(),
  initiatedBy: vine.number().exists({ table: 'members', column: 'id' }),
  assignedSenderId: vine.number().exists({ table: 'members', column: 'id' }),
  purpose: vine.string().trim().minLength(1),
  desiredOutcome: vine.string().trim().nullable(),
  status: vine.enum(CASE_STATUSES),
  completedBy: vine.number().exists({ table: 'members', column: 'id' }).nullable(),
  completedAt: dateTimeField().nullable(),
})
