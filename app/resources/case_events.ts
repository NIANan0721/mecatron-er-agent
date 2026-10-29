import type { Resource } from '#resources/types'

export const CASE_EVENT_TYPES = [
  'created',
  'draft_generated',
  'draft_edited',
  'submitted',
  'approved',
  'changes_requested',
  'notified',
  'marked_done',
  'cancelled',
  'recipients_updated',
  'note',
] as const

export const caseEventResource: Resource = {
  key: 'case_events',
  label: 'Case events',
  singular: 'Event',
  titleField: 'eventType',
  lane: 'cases',
  icon: 'History',
  fields: [
    {
      name: 'caseId',
      label: 'Case',
      type: 'belongsTo',
      resource: 'email_cases',
      relation: 'emailCase',
      required: true,
      list: true,
    },
    {
      name: 'actorId',
      label: 'Actor',
      type: 'belongsTo',
      resource: 'members',
      relation: 'actor',
      list: true,
    },
    {
      name: 'eventType',
      label: 'Event',
      type: 'enum',
      options: [...CASE_EVENT_TYPES],
      required: true,
      list: true,
    },
    { name: 'details', label: 'Details', type: 'textarea', list: true },
    { name: 'createdAt', label: 'When', type: 'datetime', list: true },
  ],
  hasMany: [],
}
