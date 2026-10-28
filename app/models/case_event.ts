import { CaseEventSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import EmailCase from '#models/email_case'
import Member from '#models/member'

export default class CaseEvent extends CaseEventSchema {
  @belongsTo(() => EmailCase, { foreignKey: 'caseId' })
  declare emailCase: BelongsTo<typeof EmailCase>

  /**
   * NULL for system events such as automatic notifications
   */
  @belongsTo(() => Member, { foreignKey: 'actorId' })
  declare actor: BelongsTo<typeof Member>
}
