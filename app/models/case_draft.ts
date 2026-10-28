import { CaseDraftSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import EmailCase from '#models/email_case'
import Member from '#models/member'
import CaseApprover from '#models/case_approver'

export default class CaseDraft extends CaseDraftSchema {
  @belongsTo(() => EmailCase, { foreignKey: 'caseId' })
  declare emailCase: BelongsTo<typeof EmailCase>

  @belongsTo(() => Member, { foreignKey: 'createdBy' })
  declare author: BelongsTo<typeof Member>

  /**
   * Approvals apply to this exact version only
   */
  @hasMany(() => CaseApprover, { foreignKey: 'draftId' })
  declare approvals: HasMany<typeof CaseApprover>
}
