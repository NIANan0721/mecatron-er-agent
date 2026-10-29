type DbError = { errno?: number; sqlMessage?: string }

/**
 * Turns a MySQL error into a sentence for the user, or returns null if it
 * isn't one of the rule errors we expect (those are re-thrown as real bugs).
 */
export function friendlyDbError(error: unknown): string | null {
  const { errno, sqlMessage = '' } = (error ?? {}) as DbError
  switch (errno) {
    case 1451:
      return "Can't delete this record: other records still point to it. Delete or re-link those first."
    case 1452:
      return "One of the linked records doesn't exist."
    case 1062:
      return 'That value is already used and must be unique.'
    case 3819:
      return `A database rule was broken (${sqlMessage.match(/'(.+?)'/)?.[1] ?? 'check constraint'}).`
    case 1644:
      // message from our triggers, e.g. "assigned sender must be a lead"
      return sqlMessage
    default:
      return null
  }
}
