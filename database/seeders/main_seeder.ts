import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { members } from '#database/seed_data/people'
import { sponsors, sponsorContacts } from '#database/seed_data/sponsors'
import { emailTemplates } from '#database/seed_data/templates'
import {
  emailCases,
  caseDrafts,
  caseRecipients,
  caseApprovers,
  caseEvents,
} from '#database/seed_data/email_cases'
import {
  commitments,
  interactions,
  followUpTasks,
  documents,
} from '#database/seed_data/knowledge_base'

/**
 * Demo data for the Mecatron ER agent. Every person, email and phone number
 * is a placeholder, so this seeder never runs in production.
 */
export default class MainSeeder extends BaseSeeder {
  static environment = ['development', 'test']

  async run() {
    /**
     * Tables in foreign-key order. JSON columns are stringified for MySQL.
     */
    const tables: [string, Record<string, unknown>[]][] = [
      ['members', members],
      ['sponsors', sponsors],
      ['sponsor_contacts', sponsorContacts],
      ['email_templates', emailTemplates],
      ['email_cases', emailCases],
      [
        'case_drafts',
        caseDrafts.map((draft) => ({
          ...draft,
          retrieved_context: JSON.stringify(draft.retrieved_context),
          missing_info_flags: JSON.stringify(draft.missing_info_flags),
        })),
      ],
      ['case_recipients', caseRecipients],
      ['case_approvers', caseApprovers],
      ['case_events', caseEvents],
      ['commitments', commitments],
      ['interactions', interactions],
      ['follow_up_tasks', followUpTasks],
      ['documents', documents],
    ]

    await this.client.transaction(async (trx) => {
      for (const [table, rows] of tables) {
        await trx.table(table).multiInsert(rows)
      }
    })
  }
}
