import CaseDraft from '#models/case_draft'
import EmailCase from '#models/email_case'
import Member from '#models/member'
import { caseDraftResource } from '#resources/case_drafts'
import { caseDraftValidator } from '#validators/case_draft'
import { friendlyDbError } from '#services/db_errors'
import type { HttpContext } from '@adonisjs/core/http'

const SORTABLE = ['caseId', 'versionNo', 'subject', 'isCurrent', 'createdAt'] as const

export default class CaseDraftsController {
  /**
   * GET /data/case_drafts?q=&sort=&dir=&page=
   */
  async index({ request, inertia }: HttpContext) {
    const q = String(request.input('q', '')).trim()
    const sort = SORTABLE.find((column) => column === request.input('sort')) ?? 'caseId'
    const dir = request.input('dir') === 'desc' ? 'desc' : 'asc'

    const page = await CaseDraft.query()
      .preload('emailCase')
      .preload('author')
      .if(q, (query) =>
        query.where((w) => w.whereILike('subject', `%${q}%`).orWhereILike('body', `%${q}%`))
      )
      .orderBy(CaseDraft.$getColumn(sort)!.columnName, dir)
      .orderBy('version_no')
      .paginate(request.input('page', 1), 20)

    return inertia.render('data/table', {
      resource: caseDraftResource,
      rows: page.all().map((draft) => draft.serialize()),
      meta: page.getMeta(),
      filters: { q, sort, dir },
    })
  }

  /**
   * GET /data/case_drafts/:id
   */
  async show({ params, inertia }: HttpContext) {
    const draft = await CaseDraft.query()
      .where('id', params.id)
      .preload('emailCase')
      .preload('author')
      .preload('approvals')
      .firstOrFail()

    return inertia.render('data/record', { resource: caseDraftResource, record: draft.serialize() })
  }

  /**
   * GET /data/case_drafts/create
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('data/form', {
      resource: caseDraftResource,
      record: null,
      options: await this.options(),
    })
  }

  /**
   * POST /data/case_drafts
   */
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(caseDraftValidator)
    try {
      const draft = await CaseDraft.create(data)
      session.flash('success', `Draft v${draft.versionNo} created`)
      return response.redirect().toRoute('data.case_drafts.show', { id: draft.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * GET /data/case_drafts/:id/edit
   */
  async edit({ params, inertia }: HttpContext) {
    const draft = await CaseDraft.findOrFail(params.id)
    return inertia.render('data/form', {
      resource: caseDraftResource,
      record: draft.serialize(),
      options: await this.options(),
    })
  }

  /**
   * PUT /data/case_drafts/:id
   */
  async update({ params, request, response, session }: HttpContext) {
    const draft = await CaseDraft.findOrFail(params.id)
    const data = await request.validateUsing(caseDraftValidator)
    try {
      await draft.merge(data).save()
      session.flash('success', 'Changes saved')
      return response.redirect().toRoute('data.case_drafts.show', { id: draft.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * DELETE /data/case_drafts/:id   Also deletes the approvals given on this draft
   */
  async destroy({ params, response, session }: HttpContext) {
    const draft = await CaseDraft.findOrFail(params.id)
    try {
      await draft.delete()
      session.flash('success', `Draft v${draft.versionNo} deleted`)
      return response.redirect().toRoute('data.case_drafts.index')
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * Choices for the Case and Created by dropdowns
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
