import vine from '@vinejs/vine'
import { APPROVAL_DECISIONS } from '#resources/case_approvers'
import { dateTimeField } from '#validators/helpers'

/**
 * Used for both create and update. The database also enforces that the
 * draft belongs to the case (composite FK) and that a decision other than
 * "pending" has decidedAt set (CHECK).
 */
export const caseApproverValidator = vine.create({
  caseId: vine.number().exists({ table: 'email_cases', column: 'id' }),
  draftId: vine.number().exists({ table: 'case_drafts', column: 'id' }),
  approverId: vine.number().exists({ table: 'members', column: 'id' }),
  decision: vine.enum(APPROVAL_DECISIONS),
  comment: vine.string().trim().nullable(),
  decidedAt: dateTimeField().nullable(),
})
