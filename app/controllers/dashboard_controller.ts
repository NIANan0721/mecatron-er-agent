import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  /**
   * Email cases from the v_case_dashboard view (mecatron-er-db/sql/03_views.sql)
   */
  async show({ inertia }: HttpContext) {
    const rows = await db
      .from('v_case_dashboard')
      .select(
        'case_code',
        'title',
        'current_subject',
        'sponsor_name',
        'initiated_by',
        'assigned_sender',
        'status',
        'approval_progress',
        'updated_at'
      )

    const cases = rows.map((row) => ({
      caseCode: row.case_code,
      title: row.title,
      currentSubject: row.current_subject,
      sponsorName: row.sponsor_name,
      initiatedBy: row.initiated_by,
      assignedSender: row.assigned_sender,
      status: row.status,
      approvalProgress: row.approval_progress,
      updatedAt: new Date(row.updated_at).toISOString(),
    }))

    return inertia.render('dashboard', { cases })
  }
}
