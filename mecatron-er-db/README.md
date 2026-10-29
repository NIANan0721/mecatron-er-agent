# Mecatron External Relations – Database (`mecatron_er`)

> **Most people don't need this folder.** The app builds the same database with one command, `node ace db:setup` (see the [main README](../README.md)). This kit is an **alternative** for loading the database from plain SQL, for example straight into MySQL Workbench without Node.
>
> The TypeScript migrations and seeders in `database/` are the main source of truth. When you change the schema or the demo data there, update `sql/01_schema.sql`, `02_seed.sql` and `03_views.sql` to match.

MySQL 8 database for the Mecatron External Relations Agent:

- **Module 1:** the sponsor knowledge base (sponsors, contacts, commitments, interactions, follow-up tasks, documents)
- **Module 2:** email templates for drafting
- **Module 3:** the email case workflow (cases, versioned drafts, recipients, per-draft approvals, audit events)

The system never sends email itself. A case moves through approval, and then the assigned lead sends the email by hand and marks the case done.

## Requirements

- MySQL Server **8.0.16 or newer** (CHECK constraints are only enforced from 8.0.16)
- Python 3.9+
- MySQL Workbench 8.0 (optional, for browsing and the EER diagram)

## Setup

```powershell
cd mecatron-er-db
python -m venv venv
.\venv\Scripts\Activate.ps1          # macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
copy .env.example .env               # then edit .env with your credentials
python setup_db.py
```

`setup_db.py` runs `sql/01_schema.sql`, `sql/02_seed.sql` and `sql/03_views.sql` in that order, then prints the row count of every table and view. You can re-run it at any time: it drops `mecatron_er` and rebuilds it, so **any manual changes are lost**.

If you set `MYSQL_DB` to a name other than `mecatron_er`, the script swaps that name into the SQL before running it. The SQL files themselves always use `mecatron_er`.

### Running the SQL files directly in Workbench instead

Open each file (**File → Open SQL Script**) in order 01 → 02 → 03 and run it with **Query → Execute (All or Selection)** (Ctrl+Shift+Enter). The `DELIMITER` blocks in `01_schema.sql` are supported by Workbench.

## Using it with the AdonisJS app

The app in the parent folder uses `mecatron_er` as its database (`DB_DATABASE` in `../.env`).

**Who owns which tables**
- These SQL scripts own the 13 domain tables and the views.
- Adonis migrations own `users`, which links logins to members through `member_id`.
- When someone signs up with a member's email, their account is linked to that member automatically.

**After every `setup_db.py` run**, re-apply the app's migrations from the project root:

```powershell
python setup_db.py          # drops and rebuilds mecatron_er (this also wipes users)
cd ..
node ace migration:run      # recreates users and regenerates database/schema.ts
```

The Lucid models live in `app/models/`. Each one extends its generated class in `database/schema.ts`, so after a schema change run `node ace schema:generate`.

## Viewing in MySQL Workbench

**Connect**
1. On the Workbench home screen, click **⊕** next to *MySQL Connections*.
2. Fill in *Connection Name* (`Mecatron ER`), *Hostname*, *Port* and *Username* using the same values as your `.env`.
3. Click **Store in Vault…** to save the password, then **Test Connection** → **OK**.
4. Open the connection. In the *Navigator → Schemas* panel, click the refresh icon if `mecatron_er` isn't listed. Then expand it to see the Tables and Views.
5. To browse a table, right-click it and choose **Select Rows – Limit 1000**. Or run a query such as `SELECT * FROM mecatron_er.v_case_dashboard;`.

**Generate the EER diagram (Reverse Engineer)**
1. From the menu, choose **Database → Reverse Engineer…** (Ctrl+R).
2. Select your stored connection and click **Next** twice. Workbench connects and fetches the schema list.
3. Tick **`mecatron_er`**, then click **Next** → **Next**.
4. On *Select Objects*, keep **Import MySQL Table Objects** (and Views if you want them) ticked, then click **Execute** → **Next** → **Finish**.
5. Workbench opens the EER diagram with every table and its FK relationships. Use **Arrange → Autolayout** to tidy it up, then **File → Export → Export as PNG/PDF** to share it.

## Schema overview

| Area | Tables |
|---|---|
| People | `members` |
| Module 1 | `sponsors`, `sponsor_contacts`, `commitments`, `interactions`, `follow_up_tasks`, `documents` |
| Module 2 | `email_templates` |
| Module 3 | `email_cases`, `case_drafts`, `case_recipients`, `case_approvers`, `case_events` |

| View | Purpose |
|---|---|
| `v_sponsor_overview` | One row per sponsor: owner, primary contact, active commitments, open/overdue tasks, last interaction |
| `v_open_tasks` | Open/in-progress follow-ups, sorted by due date, with an `is_overdue` flag |
| `v_case_dashboard` | Case code, current draft subject, sponsor, initiator, sender, status, approval progress (e.g. `2/4 approved`) |
| `v_sponsor_timeline` | Interactions and commitments merged in date order per sponsor, used as RAG context for the drafting agent |

**Integrity rules built into the schema**

- **Delete behaviour**
  - Deleting a sponsor also deletes (CASCADE) its contacts, commitments, interactions and tasks.
  - A sponsor that has email cases cannot be deleted (RESTRICT).
  - Documents are kept when their sponsor is deleted: their `sponsor_id` becomes NULL.
  - Members referenced by historical records cannot be deleted (RESTRICT). Set `is_active = FALSE` instead.
- **Ownership checks (composite FKs)**
  - A case's `primary_contact_id` must belong to the case's own sponsor.
  - An approver row's `draft_id` must belong to the same case.
- **Approvals are per draft.** Each approval is tied to one draft version, so a new version needs fresh approvals. The dashboard notes this, for example `(on v1)`.
- **One flag per group.** Each case has exactly one current draft, and each sponsor has at most one primary contact. Generated columns combined with UNIQUE keys enforce this.
- **The sender must be a lead.** Triggers block an `assigned_sender_id` that doesn't point to a member with `is_lead = TRUE`.
- **CHECK constraints**
  - A completed case must have both `completed_by` and `completed_at` set. Other statuses must have neither.
  - A task marked `done` must have `completed_at` set.
  - Every non-pending approval must have `decided_at` set.
  - Case codes must look like `ER-001`.

## About the seed data

- **Real organisations:** NTU College of Engineering, James Dyson Foundation, NTU SRC Aquatic Centre and GPS Lands. Only public information is used. Their commitments, amounts and interactions are **illustrative**.
- **Fictional companies:** Abyssal Sensing, LayerForge 3D, CircuitHarbour PCB, Straits Meridian Logistics, VoltCell Energy and Kelpwave Software.
- **All people are placeholders.** Every contact person, email (`@example.com`) and phone number (`+65 0000 xxxx`) is a placeholder. The leads are Timothy, Scott, Poh Hian and Zi Xuan; their roles are placeholders, so adjust them in `02_seed.sql`.
- **Dates are written relative to late October 2026.** `v_open_tasks` and the overdue counts use `CURRENT_DATE`, so which tasks show as overdue depends on the day you run them.

## Sample queries

```sql
USE mecatron_er;

-- Full profile for one sponsor
SELECT * FROM v_sponsor_overview WHERE sponsor_name = 'GPS Lands';
SELECT name, job_title, email, is_primary, default_cc FROM sponsor_contacts
 WHERE sponsor_id = (SELECT id FROM sponsors WHERE name = 'GPS Lands');
SELECT event_at, entry_type, category, title, details FROM v_sponsor_timeline
 WHERE sponsor_name = 'GPS Lands';

-- Everything overdue
SELECT * FROM v_open_tasks WHERE is_overdue;
SELECT s.name, c.description, c.due_date, c.status FROM commitments c JOIN sponsors s ON s.id = c.sponsor_id
 WHERE c.status IN ('promised','in_progress') AND c.due_date < CURRENT_DATE;

-- Case dashboard
SELECT * FROM v_case_dashboard;
```
