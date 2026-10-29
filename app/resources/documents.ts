import type { Resource } from '#resources/types'

export const DOCUMENT_TYPES = [
  'proposal',
  'contract',
  'deck',
  'report',
  'email_thread',
  'logo',
  'other',
] as const

export const documentResource: Resource = {
  key: 'documents',
  label: 'Documents',
  singular: 'Document',
  titleField: 'title',
  lane: 'knowledge',
  icon: 'Paperclip',
  fields: [
    {
      name: 'sponsorId',
      label: 'Sponsor',
      type: 'belongsTo',
      resource: 'sponsors',
      relation: 'sponsor',
      list: true,
    },
    { name: 'title', label: 'Title', type: 'text', required: true, list: true },
    {
      name: 'docType',
      label: 'Type',
      type: 'enum',
      options: [...DOCUMENT_TYPES],
      required: true,
      list: true,
    },
    { name: 'urlOrPath', label: 'URL or path', type: 'text', required: true, list: true },
    {
      name: 'uploadedBy',
      label: 'Uploaded by',
      type: 'belongsTo',
      resource: 'members',
      relation: 'uploader',
      required: true,
      list: true,
    },
  ],
  hasMany: [],
}
