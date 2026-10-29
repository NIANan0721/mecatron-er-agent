import vine from '@vinejs/vine'
import {
  COMMITMENT_DIRECTIONS,
  COMMITMENT_TYPES,
  COMMITMENT_STATUSES,
} from '#resources/commitments'
import { dateField } from '#validators/helpers'

export const commitmentValidator = vine.create({
  sponsorId: vine.number().exists({ table: 'sponsors', column: 'id' }),
  direction: vine.enum(COMMITMENT_DIRECTIONS),
  type: vine.enum(COMMITMENT_TYPES),
  description: vine.string().trim().minLength(1).maxLength(500),
  // DECIMAL(12,2) is stored and read as a string, e.g. "15000.00"
  amountSgd: vine
    .number()
    .min(0)
    .max(9999999999.99)
    .transform((amount) => amount.toFixed(2))
    .nullable(),
  dueDate: dateField().nullable(),
  status: vine.enum(COMMITMENT_STATUSES),
  ownerMemberId: vine.number().exists({ table: 'members', column: 'id' }).nullable(),
})
