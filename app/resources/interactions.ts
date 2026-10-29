import type { Resource } from '#resources/types'

export const INTERACTION_CHANNELS = ['email', 'meeting', 'call', 'event', 'other'] as const
export const INTERACTION_DIRECTIONS = ['inbound', 'outbound', 'internal_note'] as const

export const interactionResource: Resource = {
  key: 'interactions',
  label: 'Interactions',
  singular: 'Interaction',
  titleField: 'subject',
  lane: 'knowledge',
  icon: 'MessagesSquare',
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
      name: 'contactId',
      label: 'Contact',
      type: 'belongsTo',
      resource: 'sponsor_contacts',
      relation: 'contact',
    },
    {
      name: 'memberId',
      label: 'Member',
      type: 'belongsTo',
      resource: 'members',
      relation: 'member',
      required: true,
      list: true,
    },
    {
      name: 'caseId',
      label: 'Email case',
      type: 'belongsTo',
      resource: 'email_cases',
      relation: 'emailCase',
    },
    {
      name: 'channel',
      label: 'Channel',
      type: 'enum',
      options: [...INTERACTION_CHANNELS],
      required: true,
      list: true,
    },
    {
      name: 'direction',
      label: 'Direction',
      type: 'enum',
      options: [...INTERACTION_DIRECTIONS],
      required: true,
    },
    { name: 'occurredAt', label: 'When', type: 'datetime', required: true, list: true },
    { name: 'subject', label: 'Subject', type: 'text', required: true, list: true },
    { name: 'summary', label: 'Summary', type: 'textarea' },
    { name: 'keyDecisions', label: 'Key decisions', type: 'textarea' },
  ],
  hasMany: [{ relation: 'followUpTasks', resource: 'follow_up_tasks', label: 'Follow-up tasks' }],
}
