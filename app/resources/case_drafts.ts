import type { Resource } from '#resources/types'

export const caseDraftResource: Resource = {
  key: 'case_drafts',
  label: 'Case drafts',
  singular: 'Draft',
  titleField: 'subject',
  lane: 'cases',
  icon: 'FilePen',
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
    { name: 'versionNo', label: 'Version', type: 'number', required: true, list: true },
    { name: 'subject', label: 'Subject', type: 'text', required: true, list: true },
    { name: 'body', label: 'Body', type: 'textarea', required: true },
    { name: 'retrievedContext', label: 'Retrieved context (JSON)', type: 'json' },
    { name: 'missingInfoFlags', label: 'Missing info flags (JSON)', type: 'json' },
    {
      name: 'createdBy',
      label: 'Created by',
      type: 'belongsTo',
      resource: 'members',
      relation: 'author',
      required: true,
      list: true,
    },
    { name: 'isCurrent', label: 'Current', type: 'boolean', list: true },
  ],
  hasMany: [{ relation: 'approvals', resource: 'case_approvers', label: 'Approvals' }],
}
