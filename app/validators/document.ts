import vine from '@vinejs/vine'
import { DOCUMENT_TYPES } from '#resources/documents'

export const documentValidator = vine.create({
  sponsorId: vine.number().exists({ table: 'sponsors', column: 'id' }).nullable(),
  title: vine.string().trim().minLength(1).maxLength(255),
  docType: vine.enum(DOCUMENT_TYPES),
  urlOrPath: vine.string().trim().minLength(1).maxLength(1000),
  uploadedBy: vine.number().exists({ table: 'members', column: 'id' }),
})
