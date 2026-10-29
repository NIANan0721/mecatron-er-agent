/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  dashboard: typeof routes['dashboard']
  data: {
    index: typeof routes['data.index']
    members: {
      index: typeof routes['data.members.index']
      create: typeof routes['data.members.create']
      store: typeof routes['data.members.store']
      show: typeof routes['data.members.show']
      edit: typeof routes['data.members.edit']
      update: typeof routes['data.members.update']
      destroy: typeof routes['data.members.destroy']
    }
    sponsors: {
      index: typeof routes['data.sponsors.index']
      create: typeof routes['data.sponsors.create']
      store: typeof routes['data.sponsors.store']
      show: typeof routes['data.sponsors.show']
      edit: typeof routes['data.sponsors.edit']
      update: typeof routes['data.sponsors.update']
      destroy: typeof routes['data.sponsors.destroy']
    }
    sponsorContacts: {
      index: typeof routes['data.sponsor_contacts.index']
      create: typeof routes['data.sponsor_contacts.create']
      store: typeof routes['data.sponsor_contacts.store']
      show: typeof routes['data.sponsor_contacts.show']
      edit: typeof routes['data.sponsor_contacts.edit']
      update: typeof routes['data.sponsor_contacts.update']
      destroy: typeof routes['data.sponsor_contacts.destroy']
    }
    commitments: {
      index: typeof routes['data.commitments.index']
      create: typeof routes['data.commitments.create']
      store: typeof routes['data.commitments.store']
      show: typeof routes['data.commitments.show']
      edit: typeof routes['data.commitments.edit']
      update: typeof routes['data.commitments.update']
      destroy: typeof routes['data.commitments.destroy']
    }
    interactions: {
      index: typeof routes['data.interactions.index']
      create: typeof routes['data.interactions.create']
      store: typeof routes['data.interactions.store']
      show: typeof routes['data.interactions.show']
      edit: typeof routes['data.interactions.edit']
      update: typeof routes['data.interactions.update']
      destroy: typeof routes['data.interactions.destroy']
    }
    followUpTasks: {
      index: typeof routes['data.follow_up_tasks.index']
      create: typeof routes['data.follow_up_tasks.create']
      store: typeof routes['data.follow_up_tasks.store']
      show: typeof routes['data.follow_up_tasks.show']
      edit: typeof routes['data.follow_up_tasks.edit']
      update: typeof routes['data.follow_up_tasks.update']
      destroy: typeof routes['data.follow_up_tasks.destroy']
    }
    documents: {
      index: typeof routes['data.documents.index']
      create: typeof routes['data.documents.create']
      store: typeof routes['data.documents.store']
      show: typeof routes['data.documents.show']
      edit: typeof routes['data.documents.edit']
      update: typeof routes['data.documents.update']
      destroy: typeof routes['data.documents.destroy']
    }
    emailTemplates: {
      index: typeof routes['data.email_templates.index']
      create: typeof routes['data.email_templates.create']
      store: typeof routes['data.email_templates.store']
      show: typeof routes['data.email_templates.show']
      edit: typeof routes['data.email_templates.edit']
      update: typeof routes['data.email_templates.update']
      destroy: typeof routes['data.email_templates.destroy']
    }
    emailCases: {
      index: typeof routes['data.email_cases.index']
      create: typeof routes['data.email_cases.create']
      store: typeof routes['data.email_cases.store']
      show: typeof routes['data.email_cases.show']
      edit: typeof routes['data.email_cases.edit']
      update: typeof routes['data.email_cases.update']
      destroy: typeof routes['data.email_cases.destroy']
    }
    caseDrafts: {
      index: typeof routes['data.case_drafts.index']
      create: typeof routes['data.case_drafts.create']
      store: typeof routes['data.case_drafts.store']
      show: typeof routes['data.case_drafts.show']
      edit: typeof routes['data.case_drafts.edit']
      update: typeof routes['data.case_drafts.update']
      destroy: typeof routes['data.case_drafts.destroy']
    }
    caseRecipients: {
      index: typeof routes['data.case_recipients.index']
      create: typeof routes['data.case_recipients.create']
      store: typeof routes['data.case_recipients.store']
      show: typeof routes['data.case_recipients.show']
      edit: typeof routes['data.case_recipients.edit']
      update: typeof routes['data.case_recipients.update']
      destroy: typeof routes['data.case_recipients.destroy']
    }
    caseApprovers: {
      index: typeof routes['data.case_approvers.index']
      create: typeof routes['data.case_approvers.create']
      store: typeof routes['data.case_approvers.store']
      show: typeof routes['data.case_approvers.show']
      edit: typeof routes['data.case_approvers.edit']
      update: typeof routes['data.case_approvers.update']
      destroy: typeof routes['data.case_approvers.destroy']
    }
    caseEvents: {
      index: typeof routes['data.case_events.index']
      create: typeof routes['data.case_events.create']
      store: typeof routes['data.case_events.store']
      show: typeof routes['data.case_events.show']
      edit: typeof routes['data.case_events.edit']
      update: typeof routes['data.case_events.update']
      destroy: typeof routes['data.case_events.destroy']
    }
  }
  search: typeof routes['search']
}
