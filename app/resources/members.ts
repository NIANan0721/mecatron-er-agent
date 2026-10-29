import type { Resource } from '#resources/types'

export const SUB_TEAMS = ['Mechanical', 'Electrical', 'Software', 'Business/ER'] as const

export const memberResource: Resource = {
  key: 'members',
  label: 'Members',
  singular: 'Member',
  titleField: 'name',
  lane: 'people',
  icon: 'Users',
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true, list: true },
    { name: 'email', label: 'Email', type: 'email', required: true, list: true },
    { name: 'roleTitle', label: 'Role', type: 'text', required: true, list: true },
    {
      name: 'subTeam',
      label: 'Sub-team',
      type: 'enum',
      options: [...SUB_TEAMS],
      required: true,
      list: true,
    },
    { name: 'isLead', label: 'Lead', type: 'boolean', list: true },
    { name: 'isActive', label: 'Active', type: 'boolean', list: true },
  ],
  hasMany: [
    { relation: 'ownedSponsors', resource: 'sponsors', label: 'Sponsors owned' },
    { relation: 'assignedTasks', resource: 'follow_up_tasks', label: 'Assigned tasks' },
    { relation: 'approvals', resource: 'case_approvers', label: 'Approvals' },
  ],
}
