import CaseRecipient from '#models/case_recipient'
import EmailCase from '#models/email_case'
import SponsorContact from '#models/sponsor_contact'
import { caseRecipientResource } from '#resources/case_recipients'
import { caseRecipientValidator } from '#validators/case_recipient'
import { friendlyDbError } from '#services/db_errors'
import type { HttpContext } from '@adonisjs/core/http'

const SORTABLE = ['caseId', 'recipientType', 'email'] as const

export default class CaseRecipientsController {
  /**
   * GET /data/case_recipients?q=&sort=&dir=&page=
   */
  async index({ request, inertia }: HttpContext) {
    const q = String(request.input('q', '')).trim()
    const sort = SORTABLE.find((column) => column === request.input('sort')) ?? 'caseId'
    const dir = request.input('dir') === 'desc' ? 'desc' : 'asc'

    const page = await CaseRecipient.query()
      .preload('emailCase')
      .preload('contact')
      .if(q, (query) =>
        query.where((w) => w.whereILike('email', `%${q}%`).orWhereILike('recipient_type', `%${q}%`))
      )
      .orderBy(CaseRecipient.$getColumn(sort)!.columnName, dir)
      .paginate(request.input('page', 1), 20)

    return inertia.render('data/table', {
      resource: caseRecipientResource,
      rows: page.all().map((recipient) => recipient.serialize()),
      meta: page.getMeta(),
      filters: { q, sort, dir },
    })
  }

  /**
   * GET /data/case_recipients/:id
   */
  async show({ params, inertia }: HttpContext) {
    const recipient = await CaseRecipient.query()
      .where('id', params.id)
      .preload('emailCase')
      .preload('contact')
      .firstOrFail()

    return inertia.render('data/record', {
      resource: caseRecipientResource,
      record: recipient.serialize(),
    })
  }

  /**
   * GET /data/case_recipients/create
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('data/form', {
      resource: caseRecipientResource,
      record: null,
      options: await this.options(),
    })
  }

  /**
   * POST /data/case_recipients
   */
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(caseRecipientValidator)
    try {
      const recipient = await CaseRecipient.create(data)
      session.flash('success', `Recipient ${recipient.email} added`)
      return response.redirect().toRoute('data.case_recipients.show', { id: recipient.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * GET /data/case_recipients/:id/edit
   */
  async edit({ params, inertia }: HttpContext) {
    const recipient = await CaseRecipient.findOrFail(params.id)
    return inertia.render('data/form', {
      resource: caseRecipientResource,
      record: recipient.serialize(),
      options: await this.options(),
    })
  }

  /**
   * PUT /data/case_recipients/:id
   */
  async update({ params, request, response, session }: HttpContext) {
    const recipient = await CaseRecipient.findOrFail(params.id)
    const data = await request.validateUsing(caseRecipientValidator)
    try {
      await recipient.merge(data).save()
      session.flash('success', 'Changes saved')
      return response.redirect().toRoute('data.case_recipients.show', { id: recipient.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * DELETE /data/case_recipients/:id
   */
  async destroy({ params, response, session }: HttpContext) {
    const recipient = await CaseRecipient.findOrFail(params.id)
    try {
      await recipient.delete()
      session.flash('success', `Recipient ${recipient.email} removed`)
      return response.redirect().toRoute('data.case_recipients.index')
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * Choices for the Case and Contact dropdowns
   */
  private async options() {
    const [cases, contacts] = await Promise.all([
      EmailCase.query().select('id', 'case_code', 'title').orderBy('case_code'),
      SponsorContact.query().preload('sponsor').orderBy('name'),
    ])
    return {
      email_cases: cases.map((c) => ({ value: c.id, label: `${c.caseCode} · ${c.title}` })),
      sponsor_contacts: contacts.map((c) => ({
        value: c.id,
        label: `${c.name} (${c.sponsor.name})`,
      })),
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
