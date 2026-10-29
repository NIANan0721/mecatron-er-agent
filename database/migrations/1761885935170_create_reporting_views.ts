import { BaseSchema } from '@adonisjs/lucid/schema'

/**
 * Reporting views used by the dashboard and as context for the drafting agent
 */
const views: Record<string, string> = {
  /**
   * One row per sponsor with owner, primary contact and activity counts
   */
  v_sponsor_overview: `
    SELECT
      s.id                               AS sponsor_id,
      s.name                             AS sponsor_name,
      s.sponsor_type,
      s.tier,
      s.relationship_status,
      owner.name                         AS owner_name,
      pc.name                            AS primary_contact_name,
      pc.email                           AS primary_contact_email,
      COALESCE(cm.active_commitments, 0) AS active_commitments,
      COALESCE(t.open_tasks, 0)          AS open_tasks,
      COALESCE(t.overdue_tasks, 0)       AS overdue_tasks,
      li.last_interaction_at
    FROM sponsors s
    LEFT JOIN members owner       ON owner.id = s.relationship_owner_id
    LEFT JOIN sponsor_contacts pc ON pc.sponsor_id = s.id AND pc.is_primary = TRUE
    LEFT JOIN (
      SELECT sponsor_id, COUNT(*) AS active_commitments
      FROM commitments
      WHERE status IN ('promised', 'in_progress')
      GROUP BY sponsor_id
    ) cm ON cm.sponsor_id = s.id
    LEFT JOIN (
      SELECT sponsor_id,
             COUNT(*)                     AS open_tasks,
             SUM(due_date < CURRENT_DATE) AS overdue_tasks
      FROM follow_up_tasks
      WHERE status IN ('open', 'in_progress')
      GROUP BY sponsor_id
    ) t ON t.sponsor_id = s.id
    LEFT JOIN (
      SELECT sponsor_id, MAX(occurred_at) AS last_interaction_at
      FROM interactions
      GROUP BY sponsor_id
    ) li ON li.sponsor_id = s.id`,

  /**
   * Open / in-progress follow-ups, soonest (or most overdue) first
   */
  v_open_tasks: `
    SELECT
      t.id                               AS task_id,
      t.due_date,
      (t.due_date < CURRENT_DATE)        AS is_overdue,
      DATEDIFF(CURRENT_DATE, t.due_date) AS days_overdue,
      t.priority,
      t.status,
      t.description,
      s.name                             AS sponsor_name,
      m.name                             AS assignee_name,
      c.description                      AS related_commitment,
      i.subject                          AS related_interaction
    FROM follow_up_tasks t
    JOIN sponsors s          ON s.id = t.sponsor_id
    JOIN members m           ON m.id = t.assigned_member_id
    LEFT JOIN commitments c  ON c.id = t.commitment_id
    LEFT JOIN interactions i ON i.id = t.interaction_id
    WHERE t.status IN ('open', 'in_progress')
    ORDER BY t.due_date IS NULL, t.due_date, FIELD(t.priority, 'high', 'medium', 'low')`,

  /**
   * Case dashboard. Approval progress is for the latest submitted draft; if
   * the current draft is newer (not yet resubmitted) the version is noted.
   */
  v_case_dashboard: `
    SELECT
      c.case_code,
      c.title,
      cur.version_no AS current_version,
      cur.subject    AS current_subject,
      s.name         AS sponsor_name,
      ini.name       AS initiated_by,
      snd.name       AS assigned_sender,
      c.status,
      CASE
        WHEN a.total IS NULL THEN 'not submitted'
        ELSE CONCAT(a.approved, '/', a.total, ' approved',
                    IF(a.changes_requested > 0, CONCAT(', ', a.changes_requested, ' changes requested'), ''),
                    IF(a.version_no <> cur.version_no, CONCAT(' (on v', a.version_no, ')'), ''))
      END            AS approval_progress,
      cmp.name       AS completed_by,
      c.completed_at,
      c.created_at,
      c.updated_at
    FROM email_cases c
    JOIN sponsors s           ON s.id   = c.sponsor_id
    JOIN members ini          ON ini.id = c.initiated_by
    JOIN members snd          ON snd.id = c.assigned_sender_id
    LEFT JOIN members cmp     ON cmp.id = c.completed_by
    LEFT JOIN case_drafts cur ON cur.case_id = c.id AND cur.is_current = TRUE
    LEFT JOIN (
      SELECT d.case_id,
             d.version_no,
             SUM(ca.decision = 'approved')          AS approved,
             SUM(ca.decision = 'changes_requested') AS changes_requested,
             COUNT(*)                               AS total
      FROM case_approvers ca
      JOIN case_drafts d ON d.id = ca.draft_id
      GROUP BY d.case_id, d.version_no
    ) a ON a.case_id = c.id
       AND a.version_no = (SELECT MAX(d2.version_no)
                           FROM case_drafts d2
                           JOIN case_approvers ca2 ON ca2.draft_id = d2.id
                           WHERE d2.case_id = c.id)
    ORDER BY c.case_code`,

  /**
   * Interactions + commitments merged chronologically per sponsor
   * (context feed for the drafting agent)
   */
  v_sponsor_timeline: `
    SELECT
      i.sponsor_id,
      s.name                                AS sponsor_name,
      i.occurred_at                         AS event_at,
      'interaction'                         AS entry_type,
      CONCAT(i.channel, ' / ', i.direction) AS category,
      i.subject                             AS title,
      i.summary                             AS details,
      i.key_decisions,
      m.name                                AS member_name,
      sc.name                               AS contact_name,
      ec.case_code
    FROM interactions i
    JOIN sponsors s               ON s.id = i.sponsor_id
    JOIN members m                ON m.id = i.member_id
    LEFT JOIN sponsor_contacts sc ON sc.id = i.contact_id
    LEFT JOIN email_cases ec      ON ec.id = i.case_id
    UNION ALL
    SELECT
      c.sponsor_id,
      s.name,
      CAST(COALESCE(c.due_date, DATE(c.created_at)) AS DATETIME),
      'commitment',
      CONCAT(c.direction, ' / ', c.type),
      c.description,
      CONCAT('Status: ', c.status,
             IF(c.due_date IS NULL, ' (ongoing)', ''),
             IFNULL(CONCAT('; S$', FORMAT(c.amount_sgd, 2)), '')),
      NULL,
      m.name,
      NULL,
      NULL
    FROM commitments c
    JOIN sponsors s     ON s.id = c.sponsor_id
    LEFT JOIN members m ON m.id = c.owner_member_id
    ORDER BY sponsor_name, event_at`,
}

export default class extends BaseSchema {
  async up() {
    for (const [name, sql] of Object.entries(views)) {
      this.schema.raw(`CREATE OR REPLACE VIEW ${name} AS ${sql}`)
    }
  }

  async down() {
    for (const name of Object.keys(views).reverse()) {
      this.schema.raw(`DROP VIEW IF EXISTS ${name}`)
    }
  }
}
