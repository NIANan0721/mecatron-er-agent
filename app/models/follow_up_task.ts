import { FollowUpTaskSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Sponsor from '#models/sponsor'
import Interaction from '#models/interaction'
import Commitment from '#models/commitment'
import Member from '#models/member'

export default class FollowUpTask extends FollowUpTaskSchema {
  @belongsTo(() => Sponsor)
  declare sponsor: BelongsTo<typeof Sponsor>

  @belongsTo(() => Interaction)
  declare interaction: BelongsTo<typeof Interaction>

  @belongsTo(() => Commitment)
  declare commitment: BelongsTo<typeof Commitment>

  @belongsTo(() => Member, { foreignKey: 'assignedMemberId' })
  declare assignee: BelongsTo<typeof Member>
}
