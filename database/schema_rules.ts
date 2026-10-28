import { type SchemaRules } from '@adonisjs/lucid/types/schema_generator'

export default {
  tables: {
    /**
     * Generated columns that only back "one current / one primary" UNIQUE
     * keys (see mecatron-er-db/sql/01_schema.sql). MySQL rejects writes to
     * them, so they are kept off the models.
     */
    case_drafts: { skipColumns: ['current_flag'] },
    sponsor_contacts: { skipColumns: ['primary_flag'] },
  },
} satisfies SchemaRules
