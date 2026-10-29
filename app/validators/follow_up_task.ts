import vine from '@vinejs/vine'
import { TASK_PRIORITIES, TASK_STATUSES } from '#resources/follow_up_tasks'
import { dateField, dateTimeField } from '#validators/helpers'

/**
 * The database requires completedAt to be set exactly when status is "done".
 */
export const followUpTaskValidator = vine.create({
  sponsorId: vine.number().exists({ table: 'sponsors', column: 'id' }),
  interactionId: vine.number().exists({ table: 'interactions', column: 'id' }).nullable(),
  commitmentId: vine.number().exists({ table: 'commitments', column: 'id' }).nullable(),
  assignedMemberId: vine.number().exists({ table: 'members', column: 'id' }),
  description: vine.string().trim().minLength(1).maxLength(500),
  priority: vine.enum(TASK_PRIORITIES),
  dueDate: dateField().nullable(),
  status: vine.enum(TASK_STATUSES),
  completedAt: dateTimeField().nullable(),
})
