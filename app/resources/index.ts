import type { Resource } from '#resources/types'
import { memberResource } from '#resources/members'
import { sponsorResource } from '#resources/sponsors'
import { sponsorContactResource } from '#resources/sponsor_contacts'
import { commitmentResource } from '#resources/commitments'
import { interactionResource } from '#resources/interactions'
import { followUpTaskResource } from '#resources/follow_up_tasks'
import { documentResource } from '#resources/documents'
import { emailTemplateResource } from '#resources/email_templates'
import { emailCaseResource } from '#resources/email_cases'
import { caseDraftResource } from '#resources/case_drafts'
import { caseRecipientResource } from '#resources/case_recipients'
import { caseApproverResource } from '#resources/case_approvers'
import { caseEventResource } from '#resources/case_events'

/**
 * Every table exposed in the data console, in display order. Tables not
 * listed here (users, adonis_schema) are never reachable from the UI.
 */
export const resources: Resource[] = [
  memberResource,
  sponsorResource,
  sponsorContactResource,
  commitmentResource,
  interactionResource,
  followUpTaskResource,
  documentResource,
  emailTemplateResource,
  emailCaseResource,
  caseDraftResource,
  caseRecipientResource,
  caseApproverResource,
  caseEventResource,
]

export const resourcesByKey: Record<string, Resource> = Object.fromEntries(
  resources.map((resource) => [resource.key, resource])
)
