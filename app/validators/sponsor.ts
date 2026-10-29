import vine from '@vinejs/vine'
import { SPONSOR_TYPES, SPONSOR_TIERS, RELATIONSHIP_STATUSES } from '#resources/sponsors'

/**
 * Used for both create and update. The database's UNIQUE key on `name`
 * catches duplicates and is turned into a friendly message.
 */
export const sponsorValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(200),
  industry: vine.string().trim().maxLength(150).nullable(),
  website: vine.string().trim().url().maxLength(255).nullable(),
  sponsorType: vine.enum(SPONSOR_TYPES),
  tier: vine.enum(SPONSOR_TIERS),
  relationshipStatus: vine.enum(RELATIONSHIP_STATUSES),
  relationshipOwnerId: vine.number().exists({ table: 'members', column: 'id' }).nullable(),
  // vine.date() already returns a luxon DateTime in AdonisJS
  firstContactDate: vine.date().nullable(),
  notes: vine.string().trim().nullable(),
})
