import Commitment from '#models/commitment'
import Sponsor from '#models/sponsor'
import Member from '#models/member'
import { commitmentResource } from '#resources/commitments'
import { commitmentValidator } from '#validators/commitment'
import { friendlyDbError } from '#services/db_errors'
import type { HttpContext } from '@adonisjs/core/http'

const SORTABLE = [
  'dueDate',
  'description',
  'direction',
  'type',
  'amountSgd',
  'status',
  'sponsorId',
] as const

export default class CommitmentsController {
  /**
   * GET /data/commitments?q=&sort=&dir=&page=
   */
  async index({ request, inertia }: HttpContext) {
    const q = String(request.input('q', '')).trim()
    const sort = SORTABLE.find((column) => column === request.input('sort')) ?? 'dueDate'
    const dir = request.input('dir') === 'desc' ? 'desc' : 'asc'

    const page = await Commitment.query()
      .preload('sponsor')
      .if(q, (query) =>
        query.where((w) =>
          w
            .whereILike('description', `%${q}%`)
            .orWhereILike('direction', `%${q}%`)
            .orWhereILike('type', `%${q}%`)
            .orWhereILike('status', `%${q}%`)
        )
      )
      .orderBy(Commitment.$getColumn(sort)!.columnName, dir)
      .paginate(request.input('page', 1), 20)

    return inertia.render('data/table', {
      resource: commitmentResource,
      rows: page.all().map((commitment) => commitment.serialize()),
      meta: page.getMeta(),
      filters: { q, sort, dir },
    })
  }

  /**
   * GET /data/commitments/:id
   */
  async show({ params, inertia }: HttpContext) {
    const commitment = await Commitment.query()
      .where('id', params.id)
      .preload('sponsor')
      .preload('owner')
      .preload('followUpTasks')
      .firstOrFail()

    return inertia.render('data/record', {
      resource: commitmentResource,
      record: commitment.serialize(),
    })
  }

  /**
   * GET /data/commitments/create
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('data/form', {
      resource: commitmentResource,
      record: null,
      options: await this.options(),
    })
  }

  /**
   * POST /data/commitments
   */
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(commitmentValidator)
    try {
      const commitment = await Commitment.create(data)
      session.flash('success', 'Commitment created')
      return response.redirect().toRoute('data.commitments.show', { id: commitment.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * GET /data/commitments/:id/edit
   */
  async edit({ params, inertia }: HttpContext) {
    const commitment = await Commitment.findOrFail(params.id)
    return inertia.render('data/form', {
      resource: commitmentResource,
      record: commitment.serialize(),
      options: await this.options(),
    })
  }

  /**
   * PUT /data/commitments/:id
   */
  async update({ params, request, response, session }: HttpContext) {
    const commitment = await Commitment.findOrFail(params.id)
    const data = await request.validateUsing(commitmentValidator)
    try {
      await commitment.merge(data).save()
      session.flash('success', 'Changes saved')
      return response.redirect().toRoute('data.commitments.show', { id: commitment.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * DELETE /data/commitments/:id   Linked follow-up tasks keep existing (their link is cleared)
   */
  async destroy({ params, response, session }: HttpContext) {
    const commitment = await Commitment.findOrFail(params.id)
    try {
      await commitment.delete()
      session.flash('success', 'Commitment deleted')
      return response.redirect().toRoute('data.commitments.index')
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * Choices for the "Sponsor" and "Owner" dropdowns
   */
  private async options() {
    const [sponsors, members] = await Promise.all([
      Sponsor.query().select('id', 'name').orderBy('name'),
      Member.query().select('id', 'name').orderBy('name'),
    ])
    return {
      sponsors: sponsors.map((s) => ({ value: s.id, label: s.name })),
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
