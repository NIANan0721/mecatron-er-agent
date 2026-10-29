import Interaction from '#models/interaction'
import Sponsor from '#models/sponsor'
import SponsorContact from '#models/sponsor_contact'
import Member from '#models/member'
import EmailCase from '#models/email_case'
import { interactionResource } from '#resources/interactions'
import { interactionValidator } from '#validators/interaction'
import { friendlyDbError } from '#services/db_errors'
import type { HttpContext } from '@adonisjs/core/http'

const SORTABLE = ['occurredAt', 'subject', 'channel', 'direction', 'sponsorId', 'memberId'] as const

export default class InteractionsController {
  /**
   * GET /data/interactions?q=&sort=&dir=&page=   Newest first by default
   */
  async index({ request, inertia }: HttpContext) {
    const q = String(request.input('q', '')).trim()
    const sort = SORTABLE.find((column) => column === request.input('sort')) ?? 'occurredAt'
    const dir = request.input('dir') === 'asc' ? 'asc' : 'desc'

    const page = await Interaction.query()
      .preload('sponsor')
      .preload('member')
      .if(q, (query) =>
        query.where((w) =>
          w
            .whereILike('subject', `%${q}%`)
            .orWhereILike('summary', `%${q}%`)
            .orWhereILike('key_decisions', `%${q}%`)
            .orWhereILike('channel', `%${q}%`)
            .orWhereILike('direction', `%${q}%`)
        )
      )
      .orderBy(Interaction.$getColumn(sort)!.columnName, dir)
      .paginate(request.input('page', 1), 20)

    return inertia.render('data/table', {
      resource: interactionResource,
      rows: page.all().map((interaction) => interaction.serialize()),
      meta: page.getMeta(),
      filters: { q, sort, dir },
    })
  }

  /**
   * GET /data/interactions/:id
   */
  async show({ params, inertia }: HttpContext) {
    const interaction = await Interaction.query()
      .where('id', params.id)
      .preload('sponsor')
      .preload('contact')
      .preload('member')
      .preload('emailCase')
      .preload('followUpTasks')
      .firstOrFail()

    return inertia.render('data/record', {
      resource: interactionResource,
      record: interaction.serialize(),
    })
  }

  /**
   * GET /data/interactions/create
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('data/form', {
      resource: interactionResource,
      record: null,
      options: await this.options(),
    })
  }

  /**
   * POST /data/interactions
   */
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(interactionValidator)
    try {
      const interaction = await Interaction.create(data)
      session.flash('success', 'Interaction logged')
      return response.redirect().toRoute('data.interactions.show', { id: interaction.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * GET /data/interactions/:id/edit
   */
  async edit({ params, inertia }: HttpContext) {
    const interaction = await Interaction.findOrFail(params.id)
    return inertia.render('data/form', {
      resource: interactionResource,
      record: interaction.serialize(),
      options: await this.options(),
    })
  }

  /**
   * PUT /data/interactions/:id
   */
  async update({ params, request, response, session }: HttpContext) {
    const interaction = await Interaction.findOrFail(params.id)
    const data = await request.validateUsing(interactionValidator)
    try {
      await interaction.merge(data).save()
      session.flash('success', 'Changes saved')
      return response.redirect().toRoute('data.interactions.show', { id: interaction.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * DELETE /data/interactions/:id
   */
  async destroy({ params, response, session }: HttpContext) {
    const interaction = await Interaction.findOrFail(params.id)
    try {
      await interaction.delete()
      session.flash('success', 'Interaction deleted')
      return response.redirect().toRoute('data.interactions.index')
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * Choices for the Sponsor, Contact, Member and Email case dropdowns
   */
  private async options() {
    const [sponsors, contacts, members, cases] = await Promise.all([
      Sponsor.query().select('id', 'name').orderBy('name'),
      SponsorContact.query().preload('sponsor').orderBy('name'),
      Member.query().select('id', 'name').orderBy('name'),
      EmailCase.query().select('id', 'case_code', 'title').orderBy('case_code'),
    ])
    return {
      sponsors: sponsors.map((s) => ({ value: s.id, label: s.name })),
      sponsor_contacts: contacts.map((c) => ({
        value: c.id,
        label: `${c.name} (${c.sponsor.name})`,
      })),
      members: members.map((m) => ({ value: m.id, label: m.name })),
      email_cases: cases.map((c) => ({ value: c.id, label: `${c.caseCode} · ${c.title}` })),
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
