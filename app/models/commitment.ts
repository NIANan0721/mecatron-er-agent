import { CommitmentSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Sponsor from '#models/sponsor'
import Member from '#models/member'
import FollowUpTask from '#models/follow_up_task'

export default class Commitment extends CommitmentSchema {
  @belongsTo(() => Sponsor)
  declare sponsor: BelongsTo<typeof Sponsor>

  @belongsTo(() => Member, { foreignKey: 'ownerMemberId' })
  declare owner: BelongsTo<typeof Member>

  @hasMany(() => FollowUpTask)
  declare followUpTasks: HasMany<typeof FollowUpTask>
}
