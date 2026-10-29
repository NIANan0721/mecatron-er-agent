import EmailCase from '#models/email_case'
import Sponsor from '#models/sponsor'
import SponsorContact from '#models/sponsor_contact'
import EmailTemplate from '#models/email_template'
import Member from '#models/member'
import { emailCaseResource } from '#resources/email_cases'
import { emailCaseValidator } from '#validators/email_case'
import { friendlyDbError } from '#services/db_errors'
import type { HttpContext } from '@adonisjs/core/http'

const SORTABLE = [
  'caseCode',
  'title',
  'status',
  'sponsorId',
  'assignedSenderId',
  'updatedAt',
] as const

export default class EmailCasesController {
  /**
   * GET /data/email_cases?q=&sort=&dir=&page=
   */
  async index({ request, inertia }: HttpContext) {
    const q = String(request.input('q', '')).trim()
    const sort = SORTABLE.find((column) => column === request.input('sort')) ?? 'caseCode'
    const dir = request.input('dir') === 'desc' ? 'desc' : 'asc'

    const page = await EmailCase.query()
      .preload('sponsor')
      .preload('assignedSender')
      .if(q, (query) =>
        query.where((w) =>
          w
            .whereILike('case_code', `%${q}%`)
            .orWhereILike('title', `%${q}%`)
            .orWhereILike('purpose', `%${q}%`)
            .orWhereILike('desired_outcome', `%${q}%`)
            .orWhereILike('status', `%${q}%`)
        )
      )
      .orderBy(EmailCase.$getColumn(sort)!.columnName, dir)
      .paginate(request.input('page', 1), 20)

    return inertia.render('data/table', {
      resource: emailCaseResource,
      rows: page.all().map((emailCase) => emailCase.serialize()),
      meta: page.getMeta(),
      filters: { q, sort, dir },
    })
  }

  /**
   * GET /data/email_cases/:id
   */
  async show({ params, inertia }: HttpContext) {
    const emailCase = await EmailCase.query()
      .where('id', params.id)
      .preload('sponsor')
      .preload('primaryContact')
      .preload('template')
      .preload('initiator')
      .preload('assignedSender')
      .preload('completer')
      .preload('drafts', (q) => q.orderBy('version_no'))
      .preload('recipients')
      .preload('approvers')
      .preload('events', (q) => q.orderBy('created_at'))
      .firstOrFail()

    return inertia.render('data/record', {
      resource: emailCaseResource,
      record: emailCase.serialize(),
    })
  }

  /**
   * GET /data/email_cases/create
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('data/form', {
      resource: emailCaseResource,
      record: null,
      options: await this.options(),
    })
  }

  /**
   * POST /data/email_cases
   */
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(emailCaseValidator)
    try {
      const emailCase = await EmailCase.create(data)
      session.flash('success', `Case ${emailCase.caseCode} created`)
      return response.redirect().toRoute('data.email_cases.show', { id: emailCase.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * GET /data/email_cases/:id/edit
   */
  async edit({ params, inertia }: HttpContext) {
    const emailCase = await EmailCase.findOrFail(params.id)
    return inertia.render('data/form', {
      resource: emailCaseResource,
      record: emailCase.serialize(),
      options: await this.options(),
    })
  }

  /**
   * PUT /data/email_cases/:id
   */
  async update({ params, request, response, session }: HttpContext) {
    const emailCase = await EmailCase.findOrFail(params.id)
    const data = await request.validateUsing(emailCaseValidator)
    try {
      await emailCase.merge(data).save()
      session.flash('success', 'Changes saved')
      return response.redirect().toRoute('data.email_cases.show', { id: emailCase.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * DELETE /data/email_cases/:id   Also deletes its drafts, recipients, approvals and events
   */
  async destroy({ params, response, session }: HttpContext) {
    const emailCase = await EmailCase.findOrFail(params.id)
    try {
      await emailCase.delete()
      session.flash('success', `Case ${emailCase.caseCode} deleted`)
      return response.redirect().toRoute('data.email_cases.index')
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * Choices for the Sponsor, Contact, Template and Member dropdowns.
   * Leads are marked so it's clear who can be the assigned sender.
   */
  private async options() {
    const [sponsors, contacts, templates, members] = await Promise.all([
      Sponsor.query().select('id', 'name').orderBy('name'),
      SponsorContact.query().preload('sponsor').orderBy('name'),
      EmailTemplate.query().select('id', 'name').orderBy('name'),
      Member.query().select('id', 'name', 'is_lead').orderBy('name'),
    ])
    return {
      sponsors: sponsors.map((s) => ({ value: s.id, label: s.name })),
      sponsor_contacts: contacts.map((c) => ({
        value: c.id,
        label: `${c.name} (${c.sponsor.name})`,
      })),
      email_templates: templates.map((t) => ({ value: t.id, label: t.name })),
      members: members.map((m) => ({ value: m.id, label: m.isLead ? `${m.name} · lead` : m.name })),
    }
  }

  /**
   * Show a database rule error as a toast and go back; re-throw anything unexpected
   */
  private fail(error: unknown, response: HttpContext['response'], session: HttpContext['session']) {
    const message = friendlyDbError(error)
    if (!message) throw error
    session.flash('error', message)
    return response.redirect().back()
  }
}
