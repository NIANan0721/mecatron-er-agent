import { SponsorContactSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Sponsor from '#models/sponsor'

export default class SponsorContact extends SponsorContactSchema {
  @belongsTo(() => Sponsor)
  declare sponsor: BelongsTo<typeof Sponsor>
}
