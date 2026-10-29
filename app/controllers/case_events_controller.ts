import CaseEvent from '#models/case_event'
import EmailCase from '#models/email_case'
import Member from '#models/member'
import { caseEventResource } from '#resources/case_events'
import { caseEventValidator } from '#validators/case_event'
import { friendlyDbError } from '#services/db_errors'
import type { HttpContext } from '@adonisjs/core/http'

const SORTABLE = ['createdAt', 'caseId', 'eventType', 'actorId'] as const

export default class CaseEventsController {
  /**
   * GET /data/case_events?q=&sort=&dir=&page=   Newest first by default
   */
  async index({ request, inertia }: HttpContext) {
    const q = String(request.input('q', '')).trim()
    const sort = SORTABLE.find((column) => column === request.input('sort')) ?? 'createdAt'
    const dir = request.input('dir') === 'asc' ? 'asc' : 'desc'

    const page = await CaseEvent.query()
      .preload('emailCase')
      .preload('actor')
      .if(q, (query) =>
        query.where((w) => w.whereILike('event_type', `%${q}%`).orWhereILike('details', `%${q}%`))
      )
      .orderBy(CaseEvent.$getColumn(sort)!.columnName, dir)
      .paginate(request.input('page', 1), 20)

    return inertia.render('data/table', {
      resource: caseEventResource,
      rows: page.all().map((event) => event.serialize()),
      meta: page.getMeta(),
      filters: { q, sort, dir },
    })
  }

  /**
   * GET /data/case_events/:id
   */
  async show({ params, inertia }: HttpContext) {
    const event = await CaseEvent.query()
      .where('id', params.id)
      .preload('emailCase')
      .preload('actor')
      .firstOrFail()

    return inertia.render('data/record', { resource: caseEventResource, record: event.serialize() })
  }

  /**
   * GET /data/case_events/create
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('data/form', {
      resource: caseEventResource,
      record: null,
      options: await this.options(),
    })
  }

  /**
   * POST /data/case_events   An empty "When" means now
   */
  async store({ request, response, session }: HttpContext) {
    const { createdAt, ...data } = await request.validateUsing(caseEventValidator)
    try {
      const event = await CaseEvent.create({ ...data, ...(createdAt ? { createdAt } : {}) })
      session.flash('success', 'Event logged')
      return response.redirect().toRoute('data.case_events.show', { id: event.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * GET /data/case_events/:id/edit
   */
  async edit({ params, inertia }: HttpContext) {
    const event = await CaseEvent.findOrFail(params.id)
    return inertia.render('data/form', {
      resource: caseEventResource,
      record: event.serialize(),
      options: await this.options(),
    })
  }

  /**
   * PUT /data/case_events/:id   An empty "When" keeps the existing time
   */
  async update({ params, request, response, session }: HttpContext) {
    const event = await CaseEvent.findOrFail(params.id)
    const { createdAt, ...data } = await request.validateUsing(caseEventValidator)
    try {
      await event.merge({ ...data, ...(createdAt ? { createdAt } : {}) }).save()
      session.flash('success', 'Changes saved')
      return response.redirect().toRoute('data.case_events.show', { id: event.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * DELETE /data/case_events/:id
   */
  async destroy({ params, response, session }: HttpContext) {
    const event = await CaseEvent.findOrFail(params.id)
    try {
      await event.delete()
      session.flash('success', 'Event deleted')
      return response.redirect().toRoute('data.case_events.index')
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * Choices for the Case and Actor dropdowns
   */
  private async options() {
    const [cases, members] = await Promise.all([
      EmailCase.query().select('id', 'case_code', 'title').orderBy('case_code'),
      Member.query().select('id', 'name').orderBy('name'),
    ])
    return {
      email_cases: cases.map((c) => ({ value: c.id, label: `${c.caseCode} · ${c.title}` })),
      members: members.map((m) => ({ value: m.id, label: m.name })),
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
