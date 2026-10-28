import Page from '~/components/page'
import AppLayout from '~/layouts/app'
import { type InertiaProps } from '~/types'

type CaseDashboardRow = {
  caseCode: string
  title: string
  currentSubject: string | null
  sponsorName: string
  initiatedBy: string
  assignedSender: string
  status: string
  approvalProgress: string
  updatedAt: string
}

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  awaiting_approval: 'Awaiting approval',
  changes_requested: 'Changes requested',
  approved_ready_to_send: 'Ready to send',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export default function Dashboard({ cases }: InertiaProps<{ cases: CaseDashboardRow[] }>) {
  return (
    <Page
      title="Email cases"
      description="Every outgoing sponsor email, from draft to manual send."
    >
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Case</th>
              <th>Sponsor</th>
              <th>Current subject</th>
              <th>Initiated by</th>
              <th>Sender</th>
              <th>Status</th>
              <th>Approvals</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((row) => (
              <tr key={row.caseCode}>
                <td>
                  <span className="mono">{row.caseCode}</span>
                  <div className="table__sub">{row.title}</div>
                </td>
                <td>{row.sponsorName}</td>
                <td>{row.currentSubject ?? '—'}</td>
                <td>{row.initiatedBy}</td>
                <td>{row.assignedSender}</td>
                <td>
                  <span className={`status status--${row.status}`}>
                    {statusLabels[row.status] ?? row.status}
                  </span>
                </td>
                <td>{row.approvalProgress}</td>
                <td className="mono">{row.updatedAt.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  )
}

Dashboard.layout = [AppLayout]
