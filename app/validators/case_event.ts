import vine from '@vinejs/vine'
import { CASE_EVENT_TYPES } from '#resources/case_events'
import { dateTimeField } from '#validators/helpers'

/**
 * createdAt is optional: leave it empty to use the current time.
 */
export const caseEventValidator = vine.create({
  caseId: vine.number().exists({ table: 'email_cases', column: 'id' }),
  actorId: vine.number().exists({ table: 'members', column: 'id' }).nullable(),
  eventType: vine.enum(CASE_EVENT_TYPES),
  details: vine.string().trim().nullable(),
  createdAt: dateTimeField().nullable(),
})
