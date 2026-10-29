import Member from '#models/member'
import { memberResource } from '#resources/members'
import { memberValidator } from '#validators/member'
import { friendlyDbError } from '#services/db_errors'
import type { HttpContext } from '@adonisjs/core/http'

const SORTABLE = ['name', 'email', 'roleTitle', 'subTeam', 'isLead', 'isActive'] as const

export default class MembersController {
  /**
   * GET /data/members?q=&sort=&dir=&page=
   */
  async index({ request, inertia }: HttpContext) {
    const q = String(request.input('q', '')).trim()
    const sort = SORTABLE.find((column) => column === request.input('sort')) ?? 'name'
    const dir = request.input('dir') === 'desc' ? 'desc' : 'asc'

    const page = await Member.query()
      .if(q, (query) =>
        query.where((w) =>
          w
            .whereILike('name', `%${q}%`)
            .orWhereILike('email', `%${q}%`)
            .orWhereILike('role_title', `%${q}%`)
            .orWhereILike('sub_team', `%${q}%`)
        )
      )
      .orderBy(Member.$getColumn(sort)!.columnName, dir)
      .paginate(request.input('page', 1), 20)

    return inertia.render('data/table', {
      resource: memberResource,
      rows: page.all().map((member) => member.serialize()),
      meta: page.getMeta(),
      filters: { q, sort, dir },
    })
  }

  /**
   * GET /data/members/:id
   */
  async show({ params, inertia }: HttpContext) {
    const member = await Member.query()
      .where('id', params.id)
      .preload('ownedSponsors')
      .preload('assignedTasks')
      .preload('approvals')
      .firstOrFail()

    return inertia.render('data/record', { resource: memberResource, record: member.serialize() })
  }

  /**
   * GET /data/members/create
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('data/form', { resource: memberResource, record: null, options: {} })
  }

  /**
   * POST /data/members
   */
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(memberValidator)
    try {
      const member = await Member.create(data)
      session.flash('success', `Member "${member.name}" created`)
      return response.redirect().toRoute('data.members.show', { id: member.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * GET /data/members/:id/edit
   */
  async edit({ params, inertia }: HttpContext) {
    const member = await Member.findOrFail(params.id)
    return inertia.render('data/form', {
      resource: memberResource,
      record: member.serialize(),
      options: {},
    })
  }

  /**
   * PUT /data/members/:id
   */
  async update({ params, request, response, session }: HttpContext) {
    const member = await Member.findOrFail(params.id)
    const data = await request.validateUsing(memberValidator)
    try {
      await member.merge(data).save()
      session.flash('success', 'Changes saved')
      return response.redirect().toRoute('data.members.show', { id: member.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * DELETE /data/members/:id   Blocked while the member appears in historical records
   */
  async destroy({ params, response, session }: HttpContext) {
    const member = await Member.findOrFail(params.id)
    try {
      await member.delete()
      session.flash('success', `Member "${member.name}" deleted`)
      return response.redirect().toRoute('data.members.index')
    } catch (error) {
      return this.fail(error, response, session)
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
