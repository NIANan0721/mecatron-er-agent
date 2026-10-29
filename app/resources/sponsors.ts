import type { Resource } from '#resources/types'

export const SPONSOR_TYPES = [
  'corporate',
  'university',
  'foundation',
  'government',
  'other',
] as const
export const SPONSOR_TIERS = [
  'platinum',
  'gold',
  'silver',
  'bronze',
  'in_kind',
  'prospect',
] as const
export const RELATIONSHIP_STATUSES = [
  'prospect',
  'contacted',
  'active',
  'lapsed',
  'declined',
] as const

export const sponsorResource: Resource = {
  key: 'sponsors',
  label: 'Sponsors',
  singular: 'Sponsor',
  titleField: 'name',
  lane: 'knowledge',
  icon: 'Building2',
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true, list: true },
    { name: 'industry', label: 'Industry', type: 'text', list: true },
    { name: 'website', label: 'Website', type: 'url' },
    {
      name: 'sponsorType',
      label: 'Type',
      type: 'enum',
      options: [...SPONSOR_TYPES],
      required: true,
      list: true,
    },
    {
      name: 'tier',
      label: 'Tier',
      type: 'enum',
      options: [...SPONSOR_TIERS],
      required: true,
      list: true,
    },
    {
      name: 'relationshipStatus',
      label: 'Status',
      type: 'enum',
      options: [...RELATIONSHIP_STATUSES],
      required: true,
      list: true,
    },
    {
      name: 'relationshipOwnerId',
      label: 'Owner',
      type: 'belongsTo',
      resource: 'members',
      relation: 'owner',
      list: true,
    },
    { name: 'firstContactDate', label: 'First contact', type: 'date' },
    { name: 'notes', label: 'Notes', type: 'textarea' },
  ],
  hasMany: [
    { relation: 'contacts', resource: 'sponsor_contacts', label: 'Contacts' },
    { relation: 'commitments', resource: 'commitments', label: 'Commitments' },
    { relation: 'interactions', resource: 'interactions', label: 'Interactions' },
    { relation: 'followUpTasks', resource: 'follow_up_tasks', label: 'Follow-up tasks' },
    { relation: 'documents', resource: 'documents', label: 'Documents' },
    { relation: 'emailCases', resource: 'email_cases', label: 'Email cases' },
  ],
}
