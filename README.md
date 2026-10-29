# Mecatron External Relations Agent

This is the internal sponsor-relations tool for **Mecatron**, NTU Singapore's student marine-robotics team. It works like a support-ticket system for sponsors:

- Every sponsor has one central record of contacts, interactions, commitments and follow-up tasks.
- Every outgoing email is an **Email Case**. It is drafted with AI, approved by the leads, and then **sent manually** by the assigned lead. The system never sends external email itself.

The app is built with AdonisJS 7 (backend), React and Inertia.js (frontend), and MySQL 8 (database).

---

## Quick start

Once MySQL is running (see step 2), this is the whole setup:

```bash
git clone https://github.com/NIANan0721/mecatron-er-agent.git
cd mecatron-er-agent
npm install
cp .env.example .env          # Windows PowerShell: copy .env.example .env
node ace generate:key
node ace db:setup             # creates the database, all tables and views, plus the demo data
node ace serve --hmr
```

The sections below go through each step in detail.

---

## Contents

1. [What you need](#1-what-you-need)
2. [Set up MySQL](#2-set-up-mysql)
3. [Get the code](#3-get-the-code)
4. [Configure `.env`](#4-configure-env)
5. [Build the database](#5-build-the-database)
6. [Run the app](#6-run-the-app)
7. [Day-to-day commands](#7-day-to-day-commands)
8. [Project layout](#8-project-layout)
9. [Browsing the data in MySQL Workbench](#9-browsing-the-data-in-mysql-workbench)
10. [Alternative: SQL-only setup (no Node)](#10-alternative-sql-only-setup-no-node)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. What you need

| Tool | Version | Check with |
|---|---|---|
| [Node.js](https://nodejs.org) | **24 or newer** | `node --version` |
| MySQL Server | **8.0.16 or newer** (8.4 LTS recommended) | see step 2 |
| [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) | optional | for browsing the data and the ER diagram |

> **MariaDB will not work. Use MySQL.** XAMPP and some other bundles ship MariaDB, which doesn't support the `utf8mb4_0900_ai_ci` collation this schema uses.

---

## 2. Set up MySQL

Pick **one** of the options below. Whichever you choose, write down the **host, port, username and password**, because you'll need them in step 4. You **don't** need to create a database yourself: `node ace db:setup` does that.

<details open>
<summary><strong>Option A: Laragon (Windows, easiest)</strong></summary>

1. Install [Laragon](https://laragon.org/download/). It includes MySQL 8.4.
2. Open Laragon and click **Start All**.
3. MySQL now runs on `127.0.0.1:3306`, with user `root` and an **empty password**.

Laragon must be running whenever you use the app.
</details>

<details>
<summary><strong>Option B: MySQL Community Server installer (Windows / macOS)</strong></summary>

1. Download **MySQL Community Server 8.4 LTS** from <https://dev.mysql.com/downloads/mysql/>.
2. Run the installer. When MySQL Configurator opens:
   - Keep port **3306**.
   - Set a **root password** and note it down.
   - Choose to run MySQL as a Windows service, or a macOS launch daemon, that starts automatically.

The installer needs about **1–2 GB free on your system drive (C:)**. If there isn't enough space, it fails with *Error 1307 / exit code 1603*.
</details>

<details>
<summary><strong>Option C: Docker (any OS)</strong></summary>

```bash
docker run --name mecatron-mysql -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=choose-a-password mysql:8.4
```

Your user is `root` and the password is the one you chose. Start the container again later with `docker start mecatron-mysql`.
</details>

---

## 3. Get the code

```bash
git clone https://github.com/NIANan0721/mecatron-er-agent.git
cd mecatron-er-agent
npm install
```

---

## 4. Configure `.env`

```bash
cp .env.example .env             # Windows PowerShell: copy .env.example .env
node ace generate:key            # fills in APP_KEY
```

Then open `.env` and fill in the database section with your MySQL details from step 2:

```ini
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=                     # your MySQL password (leave empty for Laragon's default)
DB_DATABASE=mecatron_er          # created automatically by db:setup
```

`.env` is not committed to git, so each person creates their own.

---

## 5. Build the database

```bash
node ace db:setup
```

This one command:

1. **Creates the `mecatron_er` database** if it doesn't exist yet.
2. **Runs every migration**, which builds:
   - the 13 domain tables, with their keys, constraints and triggers
   - the `users` login table
   - the 4 reporting views
3. **Seeds the demo data**: 12 members, 10 sponsors, 6 email cases and more.
4. **Prints a row count** for every table and view.

When it finishes you should see:

```
│  members                 │  table  │  12  │
│  sponsors                │  table  │  10  │
│  email_cases             │  table  │   6  │
│  v_case_dashboard        │  view   │   6  │
...
[ success ] Database "mecatron_er" is ready
```

> ⚠️ `db:setup` **wipes and rebuilds** the database every time. If the database already has tables, it asks for confirmation first. Login accounts are wiped too, so sign up again afterwards.

| Option | What it does |
|---|---|
| `node ace db:setup --force` | Skip the confirmation prompt |
| `node ace db:setup --no-seed` | Build the tables and views only, with no demo data |

The demo seeder only runs when `NODE_ENV` is `development` or `test`, so placeholder data can never end up in production.

---

## 6. Run the app

```bash
node ace serve --hmr
```

Open the URL printed in the terminal, which is usually <http://localhost:3333>. Then:

1. Click **Sign up**.
2. Use one of the seeded member emails below and choose any password. Your login is **automatically linked to that member**.

| Member | Email | Lead? |
|---|---|---|
| Timothy | `timothy@example.com` | ✅ |
| Scott | `scott@example.com` | ✅ |
| Poh Hian | `pohhian@example.com` | ✅ |
| Zi Xuan | `zixuan@example.com` | ✅ |
| Rachel Ong (ER) | `rachel.ong@example.com` | |
| Marcus Tay (ER) | `marcus.tay@example.com` | |

After signing up you land on the **Email cases** dashboard, which shows the 6 seeded cases (ER-001 to ER-006).

### The data console

Click **Data** in the navigation bar to open the data console.

| Page | What you can do |
|---|---|
| **Relationship map** (`/data`) | See every table as a card with its columns (🔑 primary key, 🔗 foreign key) and lines for every foreign key. The line colour shows the delete rule: cyan = cascade, amber = restrict, grey = set null. Hover a table to trace its links, click it to open it, and drag or scroll to move around. |
| **Table** (`/data/sponsors`, …) | Browse rows 20 at a time, filter as you type, and click a column header to sort. Linked records show as chips you can click. |
| **Record** (`/data/sponsors/4`) | See all fields, the records it **belongs to**, and tabs of the records that **point at it**. Each tab has an **Add** button with the link pre-filled. |
| **New / Edit** | A form built from the table's columns: dropdowns for fixed choices, a searchable picker for linked records, toggles, and date pickers. |

**Search:** the bar at the top of every page searches the text of **every table** at once. Press **Ctrl+K** (⌘K on Mac) to jump to it. Results are grouped by table, with the keyword highlighted:
- **Click a table** to open it filtered to your keyword.
- **Click a row** to open that record.
- **Use ↑ ↓ and Enter** to choose a result from the keyboard.
- **On the relationship map,** tables containing the keyword pulse.

**The database's rules still apply,** and their errors appear as friendly messages. For example:
- you can't delete a sponsor that has email cases
- a case's assigned sender must be a lead
- a task marked "done" needs a completion time

The `users` table (password hashes) is not shown in the console.

> The seed data uses **placeholder people only** (`@example.com` emails, `+65 0000 xxxx` phones). Please **don't commit real sponsor contact details** to this repository.

---

## 7. Day-to-day commands

| Task | Command |
|---|---|
| Start the dev server (hot reload) | `node ace serve --hmr` |
| Reset the database to fresh demo data | `node ace db:setup` |
| Apply new migrations without wiping data | `node ace migration:run` |
| Re-run only the seeders | `node ace db:seed` (on an empty database) |
| Regenerate model types | `node ace schema:generate` |
| Type check | `npm run typecheck` |
| Lint / format | `npm run lint` / `npm run format` |
| Run tests | `node ace test` |
| Production build | `npm run build`, then `npm start` |

**Changing the database**

| To change… | Edit |
|---|---|
| a table | its migration in `database/migrations/` (or add a new one with `node ace make:migration`) |
| a view | `database/migrations/1761885935170_create_reporting_views.ts` |
| the demo data | the files in `database/seed_data/` |

Then run `node ace db:setup`. If you also keep the SQL-only kit (section 10), update `mecatron-er-db/sql/` to match.

---

## 8. Project layout

```
mecatron-er-agent/
├── app/
│   ├── controllers/            # One CRUD controller per table + dashboard, overview, search, login
│   ├── models/                 # Lucid models with relationships, one per table
│   ├── resources/              # Per-table field descriptions for the data console UI
│   ├── validators/             # One VineJS validator per table (input rules)
│   └── services/db_errors.ts   # Turns database rule errors into friendly messages
├── commands/db_setup.ts        # `node ace db:setup`
├── config/database.ts          # MySQL connection (true/false booleans, collation)
├── database/
│   ├── migrations/             # All tables, triggers and views, in run order
│   ├── seeders/main_seeder.ts  # Inserts the demo data in foreign-key order
│   ├── seed_data/              # The demo data itself (members, sponsors, cases...)
│   ├── schema.ts               # AUTO-GENERATED column types, do not edit by hand
│   └── schema_rules.ts         # Rules for the schema generator
├── inertia/                    # React frontend
│   ├── pages/data/             # Console pages: index (map), table, record, form
│   ├── components/data/        # Graph, cells, inputs, sidebar
│   ├── components/global_search.tsx
│   └── css/console.css         # The console theme (light + dark)
├── start/routes.ts             # Routes
├── mecatron-er-db/             # Optional SQL-only kit (see section 10)
└── docs/
    └── adonis-starter-kit.md   # Original starter-kit guide (adding pages, layouts)
```

**Database at a glance**

| Area | Tables |
|---|---|
| People | `members` (team members and leads), `users` (app logins, linked by `member_id`) |
| Sponsor knowledge base | `sponsors`, `sponsor_contacts`, `commitments`, `interactions`, `follow_up_tasks`, `documents` |
| Drafting | `email_templates` |
| Email cases and approvals | `email_cases`, `case_drafts`, `case_recipients`, `case_approvers`, `case_events` |
| Views | `v_sponsor_overview`, `v_open_tasks`, `v_case_dashboard`, `v_sponsor_timeline` |

**Rules the database enforces**

- The assigned sender of a case must be a lead (enforced by a trigger).
- A case's contact must belong to that case's sponsor.
- An approval must point at a draft of the same case.
- Each case has one current draft, and each sponsor has one primary contact.
- A completed case must record who completed it and when.
- Case codes look like `ER-001`.

---

## 9. Browsing the data in MySQL Workbench

1. On the Workbench home screen, click **⊕** next to *MySQL Connections*.
2. Enter your host, port and user from `.env`. Click **Store in Vault…** to save the password, then **Test Connection** → **OK**.
3. Open the connection and expand `mecatron_er` under *Schemas* (click refresh if it isn't listed). To browse a table, right-click it and choose **Select Rows**.
4. For the ER diagram:
   - Choose **Database → Reverse Engineer…** (Ctrl+R) and pick your connection.
   - Tick `mecatron_er`, then **Execute** → **Finish**.
   - Tidy it with **Arrange → Autolayout**.

---

## 10. Alternative: SQL-only setup (no Node)

`mecatron-er-db/` builds the same database with plain SQL files. This is useful if you only want to explore the data in MySQL Workbench without installing Node. There are two ways to use it:

- **In Workbench:** open and run `sql/01_schema.sql`, `02_seed.sql` and `03_views.sql`, in that order.
- **With Python:** follow [mecatron-er-db/README.md](mecatron-er-db/README.md) to run `setup_db.py`.

> The **TypeScript migrations and seeders are the main source of truth**. The SQL kit is a second copy, so update both when the schema or demo data changes. The SQL kit doesn't create the app's `users` table, so to use the app afterwards run `node ace migration:run`.

---

## 11. Troubleshooting

| Symptom | Fix |
|---|---|
| `Access denied for user 'root'` | `DB_USER` or `DB_PASSWORD` in `.env` is wrong. |
| `connect ECONNREFUSED 127.0.0.1:3306` | MySQL isn't running. Start Laragon, the MySQL service, or `docker start mecatron-mysql`. |
| `Unknown collation: 'utf8mb4_0900_ai_ci'` | You're on MariaDB or MySQL 5.7. Install MySQL 8 (step 2). |
| `E_MISSING_APP_KEY` or an app-key error on start | Run `node ace generate:key`. |
| `You do not have the SUPER privilege and binary logging is enabled` | The migrations create triggers. Run as `root`, or run `SET GLOBAL log_bin_trust_function_creators = 1;` once. |
| `Illegal mix of collations` when querying a view | You queried from a session that isn't using `utf8mb4_0900_ai_ci`. The app sets this automatically. In other clients, run `SET NAMES utf8mb4 COLLATE utf8mb4_0900_ai_ci;` first. |
| `db:setup` seems to hang | It's waiting for you to confirm the wipe. Type `y`, or use `--force`. |
| No demo data after `db:setup` | `NODE_ENV` isn't `development`. Check `.env`. |
| You can't log in after resetting the database | A reset wipes `users`. Sign up again. |
| MySQL installer fails with Error 1307 / 1603 | Your C: drive is full. Free up 1–2 GB, or use Laragon or Docker instead. |
