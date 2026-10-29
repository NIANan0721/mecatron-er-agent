import vine from '@vinejs/vine'

/**
 * Used for both create and update. The database allows only one primary
 * contact per sponsor and reports a duplicate if a second one is marked.
 */
export const sponsorContactValidator = vine.create({
  sponsorId: vine.number().exists({ table: 'sponsors', column: 'id' }),
  name: vine.string().trim().minLength(1).maxLength(120),
  jobTitle: vine.string().trim().maxLength(150).nullable(),
  email: vine.string().trim().email().maxLength(255),
  phone: vine.string().trim().maxLength(40).nullable(),
  isPrimary: vine.boolean(),
  defaultCc: vine.boolean(),
  notes: vine.string().trim().nullable(),
})
