import { EmailCaseSchema } from '#database/schema'
import { belongsTo, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Sponsor from '#models/sponsor'
import SponsorContact from '#models/sponsor_contact'
import EmailTemplate from '#models/email_template'
import Member from '#models/member'
import CaseDraft from '#models/case_draft'
import CaseRecipient from '#models/case_recipient'
import CaseApprover from '#models/case_approver'
import CaseEvent from '#models/case_event'

export default class EmailCase extends EmailCaseSchema {
  @belongsTo(() => Sponsor)
  declare sponsor: BelongsTo<typeof Sponsor>

  @belongsTo(() => SponsorContact, { foreignKey: 'primaryContactId' })
  declare primaryContact: BelongsTo<typeof SponsorContact>

  @belongsTo(() => EmailTemplate, { foreignKey: 'templateId' })
  declare template: BelongsTo<typeof EmailTemplate>

  @belongsTo(() => Member, { foreignKey: 'initiatedBy' })
  declare initiator: BelongsTo<typeof Member>

  /**
   * The lead who sends the approved email manually
   */
  @belongsTo(() => Member, { foreignKey: 'assignedSenderId' })
  declare assignedSender: BelongsTo<typeof Member>

  @belongsTo(() => Member, { foreignKey: 'completedBy' })
  declare completer: BelongsTo<typeof Member>

  @hasMany(() => CaseDraft, { foreignKey: 'caseId' })
  declare drafts: HasMany<typeof CaseDraft>

  @hasOne(() => CaseDraft, {
    foreignKey: 'caseId',
    onQuery: (query) => query.where('is_current', true),
  })
  declare currentDraft: HasOne<typeof CaseDraft>

  @hasMany(() => CaseRecipient, { foreignKey: 'caseId' })
  declare recipients: HasMany<typeof CaseRecipient>

  @hasMany(() => CaseApprover, { foreignKey: 'caseId' })
  declare approvers: HasMany<typeof CaseApprover>

  @hasMany(() => CaseEvent, { foreignKey: 'caseId' })
  declare events: HasMany<typeof CaseEvent>
}
