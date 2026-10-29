import SponsorContact from '#models/sponsor_contact'
import Sponsor from '#models/sponsor'
import { sponsorContactResource } from '#resources/sponsor_contacts'
import { sponsorContactValidator } from '#validators/sponsor_contact'
import { friendlyDbError } from '#services/db_errors'
import type { HttpContext } from '@adonisjs/core/http'

const SORTABLE = ['name', 'jobTitle', 'email', 'sponsorId', 'isPrimary'] as const

export default class SponsorContactsController {
  /**
   * GET /data/sponsor_contacts?q=&sort=&dir=&page=
   */
  async index({ request, inertia }: HttpContext) {
    const q = String(request.input('q', '')).trim()
    const sort = SORTABLE.find((column) => column === request.input('sort')) ?? 'name'
    const dir = request.input('dir') === 'desc' ? 'desc' : 'asc'

    const page = await SponsorContact.query()
      .preload('sponsor')
      .if(q, (query) =>
        query.where((w) =>
          w
            .whereILike('name', `%${q}%`)
            .orWhereILike('job_title', `%${q}%`)
            .orWhereILike('email', `%${q}%`)
            .orWhereILike('phone', `%${q}%`)
            .orWhereILike('notes', `%${q}%`)
        )
      )
      .orderBy(SponsorContact.$getColumn(sort)!.columnName, dir)
      .paginate(request.input('page', 1), 20)

    return inertia.render('data/table', {
      resource: sponsorContactResource,
      rows: page.all().map((contact) => contact.serialize()),
      meta: page.getMeta(),
      filters: { q, sort, dir },
    })
  }

  /**
   * GET /data/sponsor_contacts/:id
   */
  async show({ params, inertia }: HttpContext) {
    const contact = await SponsorContact.query()
      .where('id', params.id)
      .preload('sponsor')
      .firstOrFail()

    return inertia.render('data/record', {
      resource: sponsorContactResource,
      record: contact.serialize(),
    })
  }

  /**
   * GET /data/sponsor_contacts/create
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('data/form', {
      resource: sponsorContactResource,
      record: null,
      options: await this.options(),
    })
  }

  /**
   * POST /data/sponsor_contacts
   */
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(sponsorContactValidator)
    try {
      const contact = await SponsorContact.create(data)
      session.flash('success', `Contact "${contact.name}" created`)
      return response.redirect().toRoute('data.sponsor_contacts.show', { id: contact.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * GET /data/sponsor_contacts/:id/edit
   */
  async edit({ params, inertia }: HttpContext) {
    const contact = await SponsorContact.findOrFail(params.id)
    return inertia.render('data/form', {
      resource: sponsorContactResource,
      record: contact.serialize(),
      options: await this.options(),
    })
  }

  /**
   * PUT /data/sponsor_contacts/:id
   */
  async update({ params, request, response, session }: HttpContext) {
    const contact = await SponsorContact.findOrFail(params.id)
    const data = await request.validateUsing(sponsorContactValidator)
    try {
      await contact.merge(data).save()
      session.flash('success', 'Changes saved')
      return response.redirect().toRoute('data.sponsor_contacts.show', { id: contact.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * DELETE /data/sponsor_contacts/:id   Blocked while an email case uses this contact
   */
  async destroy({ params, response, session }: HttpContext) {
    const contact = await SponsorContact.findOrFail(params.id)
    try {
      await contact.delete()
      session.flash('success', `Contact "${contact.name}" deleted`)
      return response.redirect().toRoute('data.sponsor_contacts.index')
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * Choices for the "Sponsor" dropdown
   */
  private async options() {
    const sponsors = await Sponsor.query().select('id', 'name').orderBy('name')
    return { sponsors: sponsors.map((s) => ({ value: s.id, label: s.name })) }
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
