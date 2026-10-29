import vine from '@vinejs/vine'
import { jsonField } from '#validators/helpers'

/**
 * Used for both create and update. The database allows only one current
 * draft per case and one row per (case, version).
 */
export const caseDraftValidator = vine.create({
  caseId: vine.number().exists({ table: 'email_cases', column: 'id' }),
  versionNo: vine.number().withoutDecimals().min(1),
  subject: vine.string().trim().minLength(1).maxLength(255),
  body: vine.string().minLength(1),
  retrievedContext: jsonField().nullable(),
  missingInfoFlags: jsonField().nullable(),
  createdBy: vine.number().exists({ table: 'members', column: 'id' }),
  isCurrent: vine.boolean(),
})
