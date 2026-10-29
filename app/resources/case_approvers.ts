import type { Resource } from '#resources/types'

export const APPROVAL_DECISIONS = ['pending', 'approved', 'changes_requested'] as const

export const caseApproverResource: Resource = {
  key: 'case_approvers',
  label: 'Case approvals',
  singular: 'Approval',
  titleField: 'decision',
  lane: 'cases',
  icon: 'BadgeCheck',
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
      name: 'draftId',
      label: 'Draft',
      type: 'belongsTo',
      resource: 'case_drafts',
      relation: 'draft',
      required: true,
      list: true,
    },
    {
      name: 'approverId',
      label: 'Approver',
      type: 'belongsTo',
      resource: 'members',
      relation: 'approver',
      required: true,
      list: true,
    },
    {
      name: 'decision',
      label: 'Decision',
      type: 'enum',
      options: [...APPROVAL_DECISIONS],
      required: true,
      list: true,
    },
    { name: 'comment', label: 'Comment', type: 'textarea' },
    { name: 'decidedAt', label: 'Decided at', type: 'datetime', list: true },
  ],
  hasMany: [],
}
