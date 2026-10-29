import Sponsor from '#models/sponsor'
import Member from '#models/member'
import { sponsorResource } from '#resources/sponsors'
import { sponsorValidator } from '#validators/sponsor'
import { friendlyDbError } from '#services/db_errors'
import type { HttpContext } from '@adonisjs/core/http'

const SORTABLE = [
  'name',
  'industry',
  'sponsorType',
  'tier',
  'relationshipStatus',
  'firstContactDate',
] as const

export default class SponsorsController {
  /**
   * GET /data/sponsors?q=&sort=&dir=&page=   List with search, sort and paging
   */
  async index({ request, inertia }: HttpContext) {
    const q = String(request.input('q', '')).trim()
    const sort = SORTABLE.find((column) => column === request.input('sort')) ?? 'name'
    const dir = request.input('dir') === 'desc' ? 'desc' : 'asc'

    const page = await Sponsor.query()
      .preload('owner')
      .if(q, (query) =>
        query.where((w) =>
          w
            .whereILike('name', `%${q}%`)
            .orWhereILike('industry', `%${q}%`)
            .orWhereILike('website', `%${q}%`)
            .orWhereILike('sponsor_type', `%${q}%`)
            .orWhereILike('tier', `%${q}%`)
            .orWhereILike('relationship_status', `%${q}%`)
            .orWhereILike('notes', `%${q}%`)
        )
      )
      // the URL uses the model property (sponsorType); SQL needs the column (sponsor_type)
      .orderBy(Sponsor.$getColumn(sort)!.columnName, dir)
      .paginate(request.input('page', 1), 20)

    return inertia.render('data/table', {
      resource: sponsorResource,
      rows: page.all().map((sponsor) => sponsor.serialize()),
      meta: page.getMeta(),
      filters: { q, sort, dir },
    })
  }

  /**
   * GET /data/sponsors/:id   One sponsor with its parents and children
   */
  async show({ params, inertia }: HttpContext) {
    const sponsor = await Sponsor.query()
      .where('id', params.id)
      .preload('owner')
      .preload('contacts')
      .preload('commitments')
      .preload('interactions', (q) => q.orderBy('occurred_at', 'desc'))
      .preload('followUpTasks')
      .preload('documents')
      .preload('emailCases')
      .firstOrFail()

    return inertia.render('data/record', { resource: sponsorResource, record: sponsor.serialize() })
  }

  /**
   * GET /data/sponsors/create   Empty form
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('data/form', {
      resource: sponsorResource,
      record: null,
      options: await this.options(),
    })
  }

  /**
   * POST /data/sponsors   Save a new sponsor
   */
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(sponsorValidator)
    try {
      const sponsor = await Sponsor.create(data)
      session.flash('success', `Sponsor "${sponsor.name}" created`)
      return response.redirect().toRoute('data.sponsors.show', { id: sponsor.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * GET /data/sponsors/:id/edit   Pre-filled form
   */
  async edit({ params, inertia }: HttpContext) {
    const sponsor = await Sponsor.findOrFail(params.id)
    return inertia.render('data/form', {
      resource: sponsorResource,
      record: sponsor.serialize(),
      options: await this.options(),
    })
  }

  /**
   * PUT /data/sponsors/:id   Save changes
   */
  async update({ params, request, response, session }: HttpContext) {
    const sponsor = await Sponsor.findOrFail(params.id)
    const data = await request.validateUsing(sponsorValidator)
    try {
      await sponsor.merge(data).save()
      session.flash('success', 'Changes saved')
      return response.redirect().toRoute('data.sponsors.show', { id: sponsor.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * DELETE /data/sponsors/:id   Delete (blocked by the database if email cases still point to it)
   */
  async destroy({ params, response, session }: HttpContext) {
    const sponsor = await Sponsor.findOrFail(params.id)
    try {
      await sponsor.delete()
      session.flash('success', `Sponsor "${sponsor.name}" deleted`)
      return response.redirect().toRoute('data.sponsors.index')
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * Choices for the "Owner" dropdown
   */
  private async options() {
    const members = await Member.query().select('id', 'name').orderBy('name')
    return { members: members.map((m) => ({ value: m.id, label: m.name })) }
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
