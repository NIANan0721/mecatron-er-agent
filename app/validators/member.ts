import vine from '@vinejs/vine'
import { SUB_TEAMS } from '#resources/members'

/**
 * Used for both create and update. The UNIQUE key on `email` catches duplicates.
 */
export const memberValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(120),
  email: vine.string().trim().email().maxLength(255),
  roleTitle: vine.string().trim().minLength(1).maxLength(120),
  subTeam: vine.enum(SUB_TEAMS),
  isLead: vine.boolean(),
  isActive: vine.boolean(),
})
