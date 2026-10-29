import vine from '@vinejs/vine'

/**
 * A date-time from an <input type="datetime-local"> (e.g. 2026-10-29T14:30).
 * In AdonisJS, vine.date() already returns the luxon DateTime Lucid expects.
 */
export const dateTimeField = () =>
  vine.date({ formats: ['YYYY-MM-DDTHH:mm', 'YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DD HH:mm:ss'] })

/**
 * A date from an <input type="date"> (e.g. 2026-10-29)
 */
export const dateField = () => vine.date({ formats: ['YYYY-MM-DD'] })

/**
 * Text that must parse as JSON. Kept as a string because MySQL stores it
 * as-is in JSON columns.
 */
const validJson = vine.createRule((value, _options, field) => {
  if (typeof value !== 'string') return
  try {
    JSON.parse(value)
  } catch {
    field.report('The {{ field }} field must be valid JSON', 'json', field)
  }
})

export const jsonField = () => vine.string().use(validJson())
