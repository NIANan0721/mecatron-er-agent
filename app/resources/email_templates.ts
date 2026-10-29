import type { Resource } from '#resources/types'

export const TEMPLATE_SCENARIOS = [
  'sponsorship_request',
  'thank_you',
  'follow_up',
  'logo_request',
  'event_coordination',
  'funding_update',
  'report_submission',
] as const

export const emailTemplateResource: Resource = {
  key: 'email_templates',
  label: 'Email templates',
  singular: 'Template',
  titleField: 'name',
  lane: 'cases',
  icon: 'FileText',
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true, list: true },
    {
      name: 'scenario',
      label: 'Scenario',
      type: 'enum',
      options: [...TEMPLATE_SCENARIOS],
      required: true,
      list: true,
    },
    { name: 'subjectTemplate', label: 'Subject', type: 'text', required: true, list: true },
    { name: 'bodyTemplate', label: 'Body', type: 'textarea', required: true },
    { name: 'isActive', label: 'Active', type: 'boolean', list: true },
  ],
  hasMany: [{ relation: 'emailCases', resource: 'email_cases', label: 'Email cases' }],
}
