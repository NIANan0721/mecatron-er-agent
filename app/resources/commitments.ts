import type { Resource } from '#resources/types'

export const COMMITMENT_DIRECTIONS = ['sponsor_to_mecatron', 'mecatron_to_sponsor'] as const
export const COMMITMENT_TYPES = [
  'cash',
  'in_kind',
  'logo_placement',
  'report',
  'event',
  'other',
] as const
export const COMMITMENT_STATUSES = ['promised', 'in_progress', 'fulfilled', 'cancelled'] as const

export const commitmentResource: Resource = {
  key: 'commitments',
  label: 'Commitments',
  singular: 'Commitment',
  titleField: 'description',
  lane: 'knowledge',
  icon: 'Handshake',
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
      name: 'direction',
      label: 'Direction',
      type: 'enum',
      options: [...COMMITMENT_DIRECTIONS],
      required: true,
      list: true,
    },
    {
      name: 'type',
      label: 'Type',
      type: 'enum',
      options: [...COMMITMENT_TYPES],
      required: true,
      list: true,
    },
    { name: 'description', label: 'Description', type: 'text', required: true, list: true },
    { name: 'amountSgd', label: 'Amount (S$)', type: 'money', list: true },
    { name: 'dueDate', label: 'Due', type: 'date', list: true },
    {
      name: 'status',
      label: 'Status',
      type: 'enum',
      options: [...COMMITMENT_STATUSES],
      required: true,
      list: true,
    },
    {
      name: 'ownerMemberId',
      label: 'Owner',
      type: 'belongsTo',
      resource: 'members',
      relation: 'owner',
    },
  ],
  hasMany: [{ relation: 'followUpTasks', resource: 'follow_up_tasks', label: 'Follow-up tasks' }],
}
