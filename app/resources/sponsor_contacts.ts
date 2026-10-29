import type { Resource } from '#resources/types'

export const sponsorContactResource: Resource = {
  key: 'sponsor_contacts',
  label: 'Sponsor contacts',
  singular: 'Contact',
  titleField: 'name',
  lane: 'knowledge',
  icon: 'Contact',
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
    { name: 'name', label: 'Name', type: 'text', required: true, list: true },
    { name: 'jobTitle', label: 'Job title', type: 'text', list: true },
    { name: 'email', label: 'Email', type: 'email', required: true, list: true },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'isPrimary', label: 'Primary', type: 'boolean', list: true },
    { name: 'defaultCc', label: 'Default CC', type: 'boolean' },
    { name: 'notes', label: 'Notes', type: 'textarea' },
  ],
  hasMany: [],
}
