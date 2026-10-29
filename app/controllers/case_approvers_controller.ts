import CaseApprover from '#models/case_approver'
import CaseDraft from '#models/case_draft'
import EmailCase from '#models/email_case'
import Member from '#models/member'
import { caseApproverResource } from '#resources/case_approvers'
import { caseApproverValidator } from '#validators/case_approver'
import { friendlyDbError } from '#services/db_errors'
import type { HttpContext } from '@adonisjs/core/http'

const SORTABLE = ['caseId', 'draftId', 'approverId', 'decision', 'decidedAt'] as const

export default class CaseApproversController {
  /**
   * GET /data/case_approvers?q=&sort=&dir=&page=
   */
  async index({ request, inertia }: HttpContext) {
    const q = String(request.input('q', '')).trim()
    const sort = SORTABLE.find((column) => column === request.input('sort')) ?? 'caseId'
    const dir = request.input('dir') === 'desc' ? 'desc' : 'asc'

    const page = await CaseApprover.query()
      .preload('emailCase')
      .preload('draft')
      .preload('approver')
      .if(q, (query) =>
        query.where((w) => w.whereILike('decision', `%${q}%`).orWhereILike('comment', `%${q}%`))
      )
      .orderBy(CaseApprover.$getColumn(sort)!.columnName, dir)
      .paginate(request.input('page', 1), 20)

    return inertia.render('data/table', {
      resource: caseApproverResource,
      rows: page.all().map((approval) => approval.serialize()),
      meta: page.getMeta(),
      filters: { q, sort, dir },
    })
  }

  /**
   * GET /data/case_approvers/:id
   */
  async show({ params, inertia }: HttpContext) {
    const approval = await CaseApprover.query()
      .where('id', params.id)
      .preload('emailCase')
      .preload('draft')
      .preload('approver')
      .firstOrFail()

    return inertia.render('data/record', {
      resource: caseApproverResource,
      record: approval.serialize(),
    })
  }

  /**
   * GET /data/case_approvers/create
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('data/form', {
      resource: caseApproverResource,
      record: null,
      options: await this.options(),
    })
  }

  /**
   * POST /data/case_approvers
   */
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(caseApproverValidator)
    try {
      const approval = await CaseApprover.create(data)
      session.flash('success', 'Approval added')
      return response.redirect().toRoute('data.case_approvers.show', { id: approval.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * GET /data/case_approvers/:id/edit
   */
  async edit({ params, inertia }: HttpContext) {
    const approval = await CaseApprover.findOrFail(params.id)
    return inertia.render('data/form', {
      resource: caseApproverResource,
      record: approval.serialize(),
      options: await this.options(),
    })
  }

  /**
   * PUT /data/case_approvers/:id
   */
  async update({ params, request, response, session }: HttpContext) {
    const approval = await CaseApprover.findOrFail(params.id)
    const data = await request.validateUsing(caseApproverValidator)
    try {
      await approval.merge(data).save()
      session.flash('success', 'Changes saved')
      return response.redirect().toRoute('data.case_approvers.show', { id: approval.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * DELETE /data/case_approvers/:id
   */
  async destroy({ params, response, session }: HttpContext) {
    const approval = await CaseApprover.findOrFail(params.id)
    try {
      await approval.delete()
      session.flash('success', 'Approval deleted')
      return response.redirect().toRoute('data.case_approvers.index')
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * Choices for the Case, Draft and Approver dropdowns
   */
  private async options() {
    const [cases, drafts, members] = await Promise.all([
      EmailCase.query().select('id', 'case_code', 'title').orderBy('case_code'),
      CaseDraft.query().preload('emailCase').orderBy('case_id').orderBy('version_no'),
      Member.query().select('id', 'name').orderBy('name'),
    ])
    return {
      email_cases: cases.map((c) => ({ value: c.id, label: `${c.caseCode} · ${c.title}` })),
      case_drafts: drafts.map((d) => ({
        value: d.id,
        label: `${d.emailCase.caseCode} v${d.versionNo} · ${d.subject}`,
      })),
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
