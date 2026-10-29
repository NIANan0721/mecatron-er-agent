import FollowUpTask from '#models/follow_up_task'
import Sponsor from '#models/sponsor'
import Interaction from '#models/interaction'
import Commitment from '#models/commitment'
import Member from '#models/member'
import { followUpTaskResource } from '#resources/follow_up_tasks'
import { followUpTaskValidator } from '#validators/follow_up_task'
import { friendlyDbError } from '#services/db_errors'
import type { HttpContext } from '@adonisjs/core/http'

const SORTABLE = [
  'dueDate',
  'description',
  'priority',
  'status',
  'sponsorId',
  'assignedMemberId',
] as const

export default class FollowUpTasksController {
  /**
   * GET /data/follow_up_tasks?q=&sort=&dir=&page=   Soonest due first by default
   */
  async index({ request, inertia }: HttpContext) {
    const q = String(request.input('q', '')).trim()
    const sort = SORTABLE.find((column) => column === request.input('sort')) ?? 'dueDate'
    const dir = request.input('dir') === 'desc' ? 'desc' : 'asc'

    const page = await FollowUpTask.query()
      .preload('sponsor')
      .preload('assignee')
      .if(q, (query) =>
        query.where((w) =>
          w
            .whereILike('description', `%${q}%`)
            .orWhereILike('priority', `%${q}%`)
            .orWhereILike('status', `%${q}%`)
        )
      )
      .orderBy(FollowUpTask.$getColumn(sort)!.columnName, dir)
      .paginate(request.input('page', 1), 20)

    return inertia.render('data/table', {
      resource: followUpTaskResource,
      rows: page.all().map((task) => task.serialize()),
      meta: page.getMeta(),
      filters: { q, sort, dir },
    })
  }

  /**
   * GET /data/follow_up_tasks/:id
   */
  async show({ params, inertia }: HttpContext) {
    const task = await FollowUpTask.query()
      .where('id', params.id)
      .preload('sponsor')
      .preload('interaction')
      .preload('commitment')
      .preload('assignee')
      .firstOrFail()

    return inertia.render('data/record', {
      resource: followUpTaskResource,
      record: task.serialize(),
    })
  }

  /**
   * GET /data/follow_up_tasks/create
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('data/form', {
      resource: followUpTaskResource,
      record: null,
      options: await this.options(),
    })
  }

  /**
   * POST /data/follow_up_tasks
   */
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(followUpTaskValidator)
    try {
      const task = await FollowUpTask.create(data)
      session.flash('success', 'Task created')
      return response.redirect().toRoute('data.follow_up_tasks.show', { id: task.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * GET /data/follow_up_tasks/:id/edit
   */
  async edit({ params, inertia }: HttpContext) {
    const task = await FollowUpTask.findOrFail(params.id)
    return inertia.render('data/form', {
      resource: followUpTaskResource,
      record: task.serialize(),
      options: await this.options(),
    })
  }

  /**
   * PUT /data/follow_up_tasks/:id
   */
  async update({ params, request, response, session }: HttpContext) {
    const task = await FollowUpTask.findOrFail(params.id)
    const data = await request.validateUsing(followUpTaskValidator)
    try {
      await task.merge(data).save()
      session.flash('success', 'Changes saved')
      return response.redirect().toRoute('data.follow_up_tasks.show', { id: task.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * DELETE /data/follow_up_tasks/:id
   */
  async destroy({ params, response, session }: HttpContext) {
    const task = await FollowUpTask.findOrFail(params.id)
    try {
      await task.delete()
      session.flash('success', 'Task deleted')
      return response.redirect().toRoute('data.follow_up_tasks.index')
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * Choices for the Sponsor, Interaction, Commitment and Assignee dropdowns
   */
  private async options() {
    const [sponsors, interactions, commitments, members] = await Promise.all([
      Sponsor.query().select('id', 'name').orderBy('name'),
      Interaction.query().select('id', 'subject', 'occurred_at').orderBy('occurred_at', 'desc'),
      Commitment.query().select('id', 'description').orderBy('description'),
      Member.query().select('id', 'name').orderBy('name'),
    ])
    return {
      sponsors: sponsors.map((s) => ({ value: s.id, label: s.name })),
      interactions: interactions.map((i) => ({
        value: i.id,
        label: `${i.occurredAt.toISODate()} · ${i.subject}`,
      })),
      commitments: commitments.map((c) => ({ value: c.id, label: c.description })),
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
