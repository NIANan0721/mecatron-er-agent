import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'data.index': { paramsTuple?: []; params?: {} }
    'data.members.index': { paramsTuple?: []; params?: {} }
    'data.members.create': { paramsTuple?: []; params?: {} }
    'data.members.store': { paramsTuple?: []; params?: {} }
    'data.members.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.members.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.members.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.members.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsors.index': { paramsTuple?: []; params?: {} }
    'data.sponsors.create': { paramsTuple?: []; params?: {} }
    'data.sponsors.store': { paramsTuple?: []; params?: {} }
    'data.sponsors.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsors.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsors.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsors.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsor_contacts.index': { paramsTuple?: []; params?: {} }
    'data.sponsor_contacts.create': { paramsTuple?: []; params?: {} }
    'data.sponsor_contacts.store': { paramsTuple?: []; params?: {} }
    'data.sponsor_contacts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsor_contacts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsor_contacts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsor_contacts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.commitments.index': { paramsTuple?: []; params?: {} }
    'data.commitments.create': { paramsTuple?: []; params?: {} }
    'data.commitments.store': { paramsTuple?: []; params?: {} }
    'data.commitments.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.commitments.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.commitments.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.commitments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.interactions.index': { paramsTuple?: []; params?: {} }
    'data.interactions.create': { paramsTuple?: []; params?: {} }
    'data.interactions.store': { paramsTuple?: []; params?: {} }
    'data.interactions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.interactions.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.interactions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.interactions.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.follow_up_tasks.index': { paramsTuple?: []; params?: {} }
    'data.follow_up_tasks.create': { paramsTuple?: []; params?: {} }
    'data.follow_up_tasks.store': { paramsTuple?: []; params?: {} }
    'data.follow_up_tasks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.follow_up_tasks.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.follow_up_tasks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.follow_up_tasks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.documents.index': { paramsTuple?: []; params?: {} }
    'data.documents.create': { paramsTuple?: []; params?: {} }
    'data.documents.store': { paramsTuple?: []; params?: {} }
    'data.documents.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.documents.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.documents.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.documents.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_templates.index': { paramsTuple?: []; params?: {} }
    'data.email_templates.create': { paramsTuple?: []; params?: {} }
    'data.email_templates.store': { paramsTuple?: []; params?: {} }
    'data.email_templates.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_templates.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_templates.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_templates.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_cases.index': { paramsTuple?: []; params?: {} }
    'data.email_cases.create': { paramsTuple?: []; params?: {} }
    'data.email_cases.store': { paramsTuple?: []; params?: {} }
    'data.email_cases.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_cases.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_cases.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_cases.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_drafts.index': { paramsTuple?: []; params?: {} }
    'data.case_drafts.create': { paramsTuple?: []; params?: {} }
    'data.case_drafts.store': { paramsTuple?: []; params?: {} }
    'data.case_drafts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_drafts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_drafts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_drafts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_recipients.index': { paramsTuple?: []; params?: {} }
    'data.case_recipients.create': { paramsTuple?: []; params?: {} }
    'data.case_recipients.store': { paramsTuple?: []; params?: {} }
    'data.case_recipients.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_recipients.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_recipients.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_recipients.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_approvers.index': { paramsTuple?: []; params?: {} }
    'data.case_approvers.create': { paramsTuple?: []; params?: {} }
    'data.case_approvers.store': { paramsTuple?: []; params?: {} }
    'data.case_approvers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_approvers.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_approvers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_approvers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_events.index': { paramsTuple?: []; params?: {} }
    'data.case_events.create': { paramsTuple?: []; params?: {} }
    'data.case_events.store': { paramsTuple?: []; params?: {} }
    'data.case_events.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_events.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_events.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_events.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'search': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'data.index': { paramsTuple?: []; params?: {} }
    'data.members.index': { paramsTuple?: []; params?: {} }
    'data.members.create': { paramsTuple?: []; params?: {} }
    'data.members.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.members.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsors.index': { paramsTuple?: []; params?: {} }
    'data.sponsors.create': { paramsTuple?: []; params?: {} }
    'data.sponsors.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsors.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsor_contacts.index': { paramsTuple?: []; params?: {} }
    'data.sponsor_contacts.create': { paramsTuple?: []; params?: {} }
    'data.sponsor_contacts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsor_contacts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.commitments.index': { paramsTuple?: []; params?: {} }
    'data.commitments.create': { paramsTuple?: []; params?: {} }
    'data.commitments.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.commitments.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.interactions.index': { paramsTuple?: []; params?: {} }
    'data.interactions.create': { paramsTuple?: []; params?: {} }
    'data.interactions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.interactions.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.follow_up_tasks.index': { paramsTuple?: []; params?: {} }
    'data.follow_up_tasks.create': { paramsTuple?: []; params?: {} }
    'data.follow_up_tasks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.follow_up_tasks.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.documents.index': { paramsTuple?: []; params?: {} }
    'data.documents.create': { paramsTuple?: []; params?: {} }
    'data.documents.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.documents.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_templates.index': { paramsTuple?: []; params?: {} }
    'data.email_templates.create': { paramsTuple?: []; params?: {} }
    'data.email_templates.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_templates.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_cases.index': { paramsTuple?: []; params?: {} }
    'data.email_cases.create': { paramsTuple?: []; params?: {} }
    'data.email_cases.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_cases.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_drafts.index': { paramsTuple?: []; params?: {} }
    'data.case_drafts.create': { paramsTuple?: []; params?: {} }
    'data.case_drafts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_drafts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_recipients.index': { paramsTuple?: []; params?: {} }
    'data.case_recipients.create': { paramsTuple?: []; params?: {} }
    'data.case_recipients.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_recipients.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_approvers.index': { paramsTuple?: []; params?: {} }
    'data.case_approvers.create': { paramsTuple?: []; params?: {} }
    'data.case_approvers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_approvers.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_events.index': { paramsTuple?: []; params?: {} }
    'data.case_events.create': { paramsTuple?: []; params?: {} }
    'data.case_events.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_events.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'search': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'data.index': { paramsTuple?: []; params?: {} }
    'data.members.index': { paramsTuple?: []; params?: {} }
    'data.members.create': { paramsTuple?: []; params?: {} }
    'data.members.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.members.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsors.index': { paramsTuple?: []; params?: {} }
    'data.sponsors.create': { paramsTuple?: []; params?: {} }
    'data.sponsors.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsors.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsor_contacts.index': { paramsTuple?: []; params?: {} }
    'data.sponsor_contacts.create': { paramsTuple?: []; params?: {} }
    'data.sponsor_contacts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsor_contacts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.commitments.index': { paramsTuple?: []; params?: {} }
    'data.commitments.create': { paramsTuple?: []; params?: {} }
    'data.commitments.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.commitments.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.interactions.index': { paramsTuple?: []; params?: {} }
    'data.interactions.create': { paramsTuple?: []; params?: {} }
    'data.interactions.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.interactions.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.follow_up_tasks.index': { paramsTuple?: []; params?: {} }
    'data.follow_up_tasks.create': { paramsTuple?: []; params?: {} }
    'data.follow_up_tasks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.follow_up_tasks.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.documents.index': { paramsTuple?: []; params?: {} }
    'data.documents.create': { paramsTuple?: []; params?: {} }
    'data.documents.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.documents.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_templates.index': { paramsTuple?: []; params?: {} }
    'data.email_templates.create': { paramsTuple?: []; params?: {} }
    'data.email_templates.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_templates.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_cases.index': { paramsTuple?: []; params?: {} }
    'data.email_cases.create': { paramsTuple?: []; params?: {} }
    'data.email_cases.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_cases.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_drafts.index': { paramsTuple?: []; params?: {} }
    'data.case_drafts.create': { paramsTuple?: []; params?: {} }
    'data.case_drafts.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_drafts.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_recipients.index': { paramsTuple?: []; params?: {} }
    'data.case_recipients.create': { paramsTuple?: []; params?: {} }
    'data.case_recipients.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_recipients.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_approvers.index': { paramsTuple?: []; params?: {} }
    'data.case_approvers.create': { paramsTuple?: []; params?: {} }
    'data.case_approvers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_approvers.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_events.index': { paramsTuple?: []; params?: {} }
    'data.case_events.create': { paramsTuple?: []; params?: {} }
    'data.case_events.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_events.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'search': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'data.members.store': { paramsTuple?: []; params?: {} }
    'data.sponsors.store': { paramsTuple?: []; params?: {} }
    'data.sponsor_contacts.store': { paramsTuple?: []; params?: {} }
    'data.commitments.store': { paramsTuple?: []; params?: {} }
    'data.interactions.store': { paramsTuple?: []; params?: {} }
    'data.follow_up_tasks.store': { paramsTuple?: []; params?: {} }
    'data.documents.store': { paramsTuple?: []; params?: {} }
    'data.email_templates.store': { paramsTuple?: []; params?: {} }
    'data.email_cases.store': { paramsTuple?: []; params?: {} }
    'data.case_drafts.store': { paramsTuple?: []; params?: {} }
    'data.case_recipients.store': { paramsTuple?: []; params?: {} }
    'data.case_approvers.store': { paramsTuple?: []; params?: {} }
    'data.case_events.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'data.members.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsors.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsor_contacts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.commitments.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.interactions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.follow_up_tasks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.documents.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_templates.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_cases.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_drafts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_recipients.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_approvers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_events.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'data.members.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsors.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsor_contacts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.commitments.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.interactions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.follow_up_tasks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.documents.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_templates.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_cases.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_drafts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_recipients.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_approvers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_events.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'data.members.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsors.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.sponsor_contacts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.commitments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.interactions.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.follow_up_tasks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.documents.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_templates.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.email_cases.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_drafts.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_recipients.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_approvers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'data.case_events.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}