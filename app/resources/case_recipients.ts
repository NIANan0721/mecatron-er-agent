import type { Resource } from '#resources/types'

export const RECIPIENT_TYPES = ['to', 'cc', 'bcc'] as const

export const caseRecipientResource: Resource = {
  key: 'case_recipients',
  label: 'Case recipients',
  singular: 'Recipient',
  titleField: 'email',
  lane: 'cases',
  icon: 'AtSign',
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
      name: 'recipientType',
      label: 'Type',
      type: 'enum',
      options: [...RECIPIENT_TYPES],
      required: true,
      list: true,
    },
    { name: 'email', label: 'Email', type: 'email', required: true, list: true },
    {
      name: 'contactId',
      label: 'Contact',
      type: 'belongsTo',
      resource: 'sponsor_contacts',
      relation: 'contact',
      list: true,
    },
  ],
  hasMany: [],
}
