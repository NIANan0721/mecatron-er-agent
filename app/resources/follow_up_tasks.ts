import type { Resource } from '#resources/types'

export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const
export const TASK_STATUSES = ['open', 'in_progress', 'done', 'cancelled'] as const

export const followUpTaskResource: Resource = {
  key: 'follow_up_tasks',
  label: 'Follow-up tasks',
  singular: 'Task',
  titleField: 'description',
  lane: 'knowledge',
  icon: 'ListChecks',
  fields: [
    {
      name: 'sponsorId',
      label: 'Sponsor',
      type: 'belongsTo',
      resource: 'sponsors',
      relation: 'sponsor',
      required: true,
      list: true,
    },
    {
      name: 'interactionId',
      label: 'From interaction',
      type: 'belongsTo',
      resource: 'interactions',
      relation: 'interaction',
    },
    {
      name: 'commitmentId',
      label: 'For commitment',
      type: 'belongsTo',
      resource: 'commitments',
      relation: 'commitment',
    },
    {
      name: 'assignedMemberId',
      label: 'Assignee',
      type: 'belongsTo',
      resource: 'members',
      relation: 'assignee',
      required: true,
      list: true,
    },
    { name: 'description', label: 'Description', type: 'text', required: true, list: true },
    {
      name: 'priority',
      label: 'Priority',
      type: 'enum',
      options: [...TASK_PRIORITIES],
      required: true,
      list: true,
    },
    { name: 'dueDate', label: 'Due', type: 'date', list: true },
    {
      name: 'status',
      label: 'Status',
      type: 'enum',
      options: [...TASK_STATUSES],
      required: true,
      list: true,
    },
    { name: 'completedAt', label: 'Completed at', type: 'datetime' },
  ],
  hasMany: [],
}
