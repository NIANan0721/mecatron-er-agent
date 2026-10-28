import { DocumentSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Sponsor from '#models/sponsor'
import Member from '#models/member'

export default class Document extends DocumentSchema {
  @belongsTo(() => Sponsor)
  declare sponsor: BelongsTo<typeof Sponsor>

  @belongsTo(() => Member, { foreignKey: 'uploadedBy' })
  declare uploader: BelongsTo<typeof Member>
}
