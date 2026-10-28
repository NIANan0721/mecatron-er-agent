import { MemberSchema } from '#database/schema'
import { hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Sponsor from '#models/sponsor'
import FollowUpTask from '#models/follow_up_task'
import CaseApprover from '#models/case_approver'
import User from '#models/user'

export default class Member extends MemberSchema {
  @hasMany(() => Sponsor, { foreignKey: 'relationshipOwnerId' })
  declare ownedSponsors: HasMany<typeof Sponsor>

  @hasMany(() => FollowUpTask, { foreignKey: 'assignedMemberId' })
  declare assignedTasks: HasMany<typeof FollowUpTask>

  @hasMany(() => CaseApprover, { foreignKey: 'approverId' })
  declare approvals: HasMany<typeof CaseApprover>

  @hasOne(() => User)
  declare user: HasOne<typeof User>
}
