import Document from '#models/document'
import Sponsor from '#models/sponsor'
import Member from '#models/member'
import { documentResource } from '#resources/documents'
import { documentValidator } from '#validators/document'
import { friendlyDbError } from '#services/db_errors'
import type { HttpContext } from '@adonisjs/core/http'

const SORTABLE = ['title', 'docType', 'sponsorId', 'uploadedBy', 'createdAt'] as const

export default class DocumentsController {
  /**
   * GET /data/documents?q=&sort=&dir=&page=
   */
  async index({ request, inertia }: HttpContext) {
    const q = String(request.input('q', '')).trim()
    const sort = SORTABLE.find((column) => column === request.input('sort')) ?? 'title'
    const dir = request.input('dir') === 'desc' ? 'desc' : 'asc'

    const page = await Document.query()
      .preload('sponsor')
      .preload('uploader')
      .if(q, (query) =>
        query.where((w) =>
          w
            .whereILike('title', `%${q}%`)
            .orWhereILike('doc_type', `%${q}%`)
            .orWhereILike('url_or_path', `%${q}%`)
        )
      )
      .orderBy(Document.$getColumn(sort)!.columnName, dir)
      .paginate(request.input('page', 1), 20)

    return inertia.render('data/table', {
      resource: documentResource,
      rows: page.all().map((document) => document.serialize()),
      meta: page.getMeta(),
      filters: { q, sort, dir },
    })
  }

  /**
   * GET /data/documents/:id
   */
  async show({ params, inertia }: HttpContext) {
    const document = await Document.query()
      .where('id', params.id)
      .preload('sponsor')
      .preload('uploader')
      .firstOrFail()

    return inertia.render('data/record', {
      resource: documentResource,
      record: document.serialize(),
    })
  }

  /**
   * GET /data/documents/create
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('data/form', {
      resource: documentResource,
      record: null,
      options: await this.options(),
    })
  }

  /**
   * POST /data/documents
   */
  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(documentValidator)
    try {
      const document = await Document.create(data)
      session.flash('success', `Document "${document.title}" added`)
      return response.redirect().toRoute('data.documents.show', { id: document.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * GET /data/documents/:id/edit
   */
  async edit({ params, inertia }: HttpContext) {
    const document = await Document.findOrFail(params.id)
    return inertia.render('data/form', {
      resource: documentResource,
      record: document.serialize(),
      options: await this.options(),
    })
  }

  /**
   * PUT /data/documents/:id
   */
  async update({ params, request, response, session }: HttpContext) {
    const document = await Document.findOrFail(params.id)
    const data = await request.validateUsing(documentValidator)
    try {
      await document.merge(data).save()
      session.flash('success', 'Changes saved')
      return response.redirect().toRoute('data.documents.show', { id: document.id })
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * DELETE /data/documents/:id
   */
  async destroy({ params, response, session }: HttpContext) {
    const document = await Document.findOrFail(params.id)
    try {
      await document.delete()
      session.flash('success', `Document "${document.title}" deleted`)
      return response.redirect().toRoute('data.documents.index')
    } catch (error) {
      return this.fail(error, response, session)
    }
  }

  /**
   * Choices for the Sponsor and Uploaded by dropdowns
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
