import vine from '@vinejs/vine'
import { INTERACTION_CHANNELS, INTERACTION_DIRECTIONS } from '#resources/interactions'
import { dateTimeField } from '#validators/helpers'

export const interactionValidator = vine.create({
  sponsorId: vine.number().exists({ table: 'sponsors', column: 'id' }),
  contactId: vine.number().exists({ table: 'sponsor_contacts', column: 'id' }).nullable(),
  memberId: vine.number().exists({ table: 'members', column: 'id' }),
  caseId: vine.number().exists({ table: 'email_cases', column: 'id' }).nullable(),
  channel: vine.enum(INTERACTION_CHANNELS),
  direction: vine.enum(INTERACTION_DIRECTIONS),
  occurredAt: dateTimeField(),
  subject: vine.string().trim().minLength(1).maxLength(255),
  summary: vine.string().trim().nullable(),
  keyDecisions: vine.string().trim().nullable(),
})
