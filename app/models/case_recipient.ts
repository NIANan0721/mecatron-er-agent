import { CaseRecipientSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import EmailCase from '#models/email_case'
import SponsorContact from '#models/sponsor_contact'

export default class CaseRecipient extends CaseRecipientSchema {
  @belongsTo(() => EmailCase, { foreignKey: 'caseId' })
  declare emailCase: BelongsTo<typeof EmailCase>

  @belongsTo(() => SponsorContact, { foreignKey: 'contactId' })
  declare contact: BelongsTo<typeof SponsorContact>
}
