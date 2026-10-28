import { InteractionSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Sponsor from '#models/sponsor'
import SponsorContact from '#models/sponsor_contact'
import Member from '#models/member'
import EmailCase from '#models/email_case'
import FollowUpTask from '#models/follow_up_task'

export default class Interaction extends InteractionSchema {
  @belongsTo(() => Sponsor)
  declare sponsor: BelongsTo<typeof Sponsor>

  @belongsTo(() => SponsorContact, { foreignKey: 'contactId' })
  declare contact: BelongsTo<typeof SponsorContact>

  @belongsTo(() => Member)
  declare member: BelongsTo<typeof Member>

  @belongsTo(() => EmailCase, { foreignKey: 'caseId' })
  declare emailCase: BelongsTo<typeof EmailCase>

  @hasMany(() => FollowUpTask)
  declare followUpTasks: HasMany<typeof FollowUpTask>
}
