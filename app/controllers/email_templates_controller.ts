import EmailTemplate from '#models/email_template'
import { emailTemplateResource } from '#resources/email_templates'
import { emailTemplateValidator } from '#validators/email_template'
import { friendlyDbError } from '#services/db_errors'
import type { HttpContext } from '@adonisjs/core/http'

const SORTABLE = ['name', 'scenario', 'subjectTemplate', 'isActive'] as const

export default class EmailTemplatesController {
  /**
   * GET /data/email_templates?q=&sort=&dir=&page=
   */
  async index({ request, inertia }: HttpContext) {
    const q = String(request.input('q', '')).trim()
    const sort = SORTABLE.find((column) => column === request.input('sort')) ?? 'name'
    const dir = request.input('dir') === 'desc' ? 'desc' : 'asc'

    const page = await EmailTemplate.query()
      .if(q, (query) =>
        query.where((w) =>
          w
            .whereILike('name', `%${q}%`)
            .orWhereILike('scenario', `%${q}%`)
            .orWhereILike('subject_template', `%${q}%`)
            .orWhereILike('body_template', `%${q}%`)
        )
      )
      .orderBy(EmailTemplate.$getColumn(sort)!.columnName, dir)
      .paginate(request.input('page', 1), 20)

    return inertia.render('data/table', {
      resource: emailTemplateResource,
      rows: page.all().map((template) => template.serialize()),
      meta: page.getMeta(),
      filters: { q, sort, dir },
    })
  }

  /**
   * GET /data/email_templates/:id
   */
  async show({ params, inertia }: HttpContext) {
    const template = await EmailTemplate.query()
      .where('id', params.id)
      .preload('emailCases')
      .firstOrFail()

    return inertia.render('data/record', {
      resource: emailTemplateResource,
      record: template.serialize(),
    })
  }

  /**
   * GET /data/email_templates/create
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('data/form', {
      resource: emailTemplateResource,
      record: null,
      options: {},
    })
  }

  /**
   * POST /data/email_templates
   */
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(emailTemplateValidator)
    try {
      const template = await EmailTemplate.create(data)
      session.flash('success', `Template "${template.name}" created`)
      return response.redirect().toRoute('data.email_templates.show', { id: template.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * GET /data/email_templates/:id/edit
   */
  async edit({ params, inertia }: HttpContext) {
    const template = await EmailTemplate.findOrFail(params.id)
    return inertia.render('data/form', {
      resource: emailTemplateResource,
      record: template.serialize(),
      options: {},
    })
  }

  /**
   * PUT /data/email_templates/:id
   */
  async update({ params, request, response, session }: HttpContext) {
    const template = await EmailTemplate.findOrFail(params.id)
    const data = await request.validateUsing(emailTemplateValidator)
    try {
      await template.merge(data).save()
      session.flash('success', 'Changes saved')
      return response.redirect().toRoute('data.email_templates.show', { id: template.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * DELETE /data/email_templates/:id   Cases using it keep existing (their link is cleared)
   */
  async destroy({ params, response, session }: HttpContext) {
    const template = await EmailTemplate.findOrFail(params.id)
    try {
      await template.delete()
      session.flash('success', `Template "${template.name}" deleted`)
      return response.redirect().toRoute('data.email_templates.index')
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
