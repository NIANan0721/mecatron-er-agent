import { CaseApproverSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import EmailCase from '#models/email_case'
import CaseDraft from '#models/case_draft'
import Member from '#models/member'

export default class CaseApprover extends CaseApproverSchema {
  @belongsTo(() => EmailCase, { foreignKey: 'caseId' })
  declare emailCase: BelongsTo<typeof EmailCase>

  @belongsTo(() => CaseDraft, { foreignKey: 'draftId' })
  declare draft: BelongsTo<typeof CaseDraft>

  @belongsTo(() => Member, { foreignKey: 'approverId' })
  declare approver: BelongsTo<typeof Member>
}
