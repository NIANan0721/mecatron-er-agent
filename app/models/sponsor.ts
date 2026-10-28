import { SponsorSchema } from '#database/schema'
import { belongsTo, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Member from '#models/member'
import SponsorContact from '#models/sponsor_contact'
import Commitment from '#models/commitment'
import Interaction from '#models/interaction'
import FollowUpTask from '#models/follow_up_task'
import Document from '#models/document'
import EmailCase from '#models/email_case'

export default class Sponsor extends SponsorSchema {
  @belongsTo(() => Member, { foreignKey: 'relationshipOwnerId' })
  declare owner: BelongsTo<typeof Member>

  @hasMany(() => SponsorContact)
  declare contacts: HasMany<typeof SponsorContact>

  @hasOne(() => SponsorContact, { onQuery: (query) => query.where('is_primary', true) })
  declare primaryContact: HasOne<typeof SponsorContact>

  @hasMany(() => Commitment)
  declare commitments: HasMany<typeof Commitment>

  @hasMany(() => Interaction)
  declare interactions: HasMany<typeof Interaction>

  @hasMany(() => FollowUpTask)
  declare followUpTasks: HasMany<typeof FollowUpTask>

  @hasMany(() => Document)
  declare documents: HasMany<typeof Document>

  @hasMany(() => EmailCase)
  declare emailCases: HasMany<typeof EmailCase>
}
