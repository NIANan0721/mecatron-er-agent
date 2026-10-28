# Mecatron External Relations Agent

This is the internal sponsor-relations tool for **Mecatron**, NTU Singapore's student marine-robotics team. It works like a support-ticket system for sponsors:

- Every sponsor has one central record of contacts, interactions, commitments and follow-up tasks.
- Every outgoing email is an **Email Case**. It is drafted with AI, approved by the leads, and then **sent manually** by the assigned lead. The system never sends external email itself.

The app is built with AdonisJS 7 (backend), React and Inertia.js (frontend), and MySQL 8 (database).

---

## Contents

1. [What you need](#1-what-you-need)
2. [Set up MySQL](#2-set-up-mysql)
3. [Get the code and install dependencies](#3-get-the-code-and-install-dependencies)
4. [Configure the two `.env` files](#4-configure-the-two-env-files)
5. [Build the database](#5-build-the-database)
6. [Run the app](#6-run-the-app)
7. [Day-to-day commands](#7-day-to-day-commands)
8. [Project layout](#8-project-layout)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. What you need

| Tool | Version | Check with |
|---|---|---|
| [Node.js](https://nodejs.org) | **24 or newer** | `node --version` |
| [Python](https://www.python.org/downloads/) | 3.9 or newer | `python --version` (Windows: `py --version`) |
| MySQL Server | **8.0.16 or newer** (8.4 LTS recommended) | see step 2 |
| [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) | optional | for browsing data and the ER diagram |

> **MariaDB will not work. Use MySQL.** XAMPP and some other bundles ship MariaDB, which doesn't support the `utf8mb4_0900_ai_ci` collation this schema uses.

---

## 2. Set up MySQL

Pick **one** of the options below. Whichever you choose, write down the **host, port, username and password**, because you'll need them in step 4.

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

## 3. Get the code and install dependencies

```bash
git clone https://github.com/NIANan0721/mecatron-er-agent.git
cd mecatron-er-agent

# JavaScript dependencies (backend + frontend)
npm install
```

Then create the Python environment that builds the database:

**Windows (PowerShell)**
```powershell
cd mecatron-er-db
py -m venv venv                  # or: python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd ..
```

If PowerShell refuses to run `Activate.ps1`, run this once and try again: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

**macOS / Linux**
```bash
cd mecatron-er-db
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..
```

---

## 4. Configure the two `.env` files

There are **two** environment files: one for the app and one for the database scripts. **Both must contain the same MySQL details.** Neither file is committed to git, so each person creates their own.

**4a. The app: `.env` in the project root**

```bash
cp .env.example .env             # Windows PowerShell: copy .env.example .env
node ace generate:key            # fills in APP_KEY
```

Then open `.env` and check the database section:

```ini
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=                     # your MySQL password (leave empty for Laragon's default)
DB_DATABASE=mecatron_er
```

**4b. The database scripts: `mecatron-er-db/.env`**

```bash
cp mecatron-er-db/.env.example mecatron-er-db/.env     # Windows: copy mecatron-er-db\.env.example mecatron-er-db\.env
```

```ini
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=                  # same password as DB_PASSWORD above
MYSQL_DB=mecatron_er
```

---

## 5. Build the database

Run these two commands **in this order**:

```bash
# 1) Create the mecatron_er database: 13 tables, 4 views and seed data
cd mecatron-er-db
python setup_db.py               # use the venv's Python (activate it first, see step 3)
cd ..

# 2) Create the app's login table (users) and regenerate the model types
node ace migration:run
```

`setup_db.py` ends by printing the row count of every table. You should see something like this:

```
  members                table     12
  sponsors               table     10
  email_cases            table      6
  v_case_dashboard       view       6
  ...
```

> ⚠️ `setup_db.py` **drops and rebuilds** the whole `mecatron_er` database, and that includes the app's `users` table. Run `node ace migration:run` again every time you rebuild, and expect to sign up again.

To browse the data or generate the ER diagram in MySQL Workbench, see [mecatron-er-db/README.md](mecatron-er-db/README.md#viewing-in-mysql-workbench).

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

> The seed data uses **placeholder people only** (`@example.com` emails, `+65 0000 xxxx` phones). Please **don't commit real sponsor contact details** to this repository.

---

## 7. Day-to-day commands

| Task | Command |
|---|---|
| Start the dev server (hot reload) | `node ace serve --hmr` |
| Reset the database to fresh seed data (macOS / Linux / Git Bash) | `cd mecatron-er-db && python setup_db.py && cd .. && node ace migration:run` |
| Reset the database (Windows PowerShell) | `cd mecatron-er-db; .\venv\Scripts\python.exe setup_db.py; cd ..; node ace migration:run` |
| Regenerate model types after a schema change | `node ace schema:generate` |
| Type check | `npm run typecheck` |
| Lint / format | `npm run lint` / `npm run format` |
| Run tests | `node ace test` |
| Production build | `npm run build`, then `npm start` |

**Changing the database schema**
- To add or change domain tables (sponsors, cases and so on), edit `mecatron-er-db/sql/*.sql`. Then rebuild the database and run `node ace schema:generate`.
- To change app-only tables (`users`, sessions), use Adonis migrations: `node ace make:migration`.

---

## 8. Project layout

```
mecatron-er-agent/
├── app/
│   ├── controllers/        # HTTP controllers (dashboard, signup, login)
│   └── models/             # Lucid models with relationships, one per table
├── config/database.ts      # MySQL connection (converts BOOLEAN columns to true/false)
├── database/
│   ├── migrations/         # App-owned tables: users (+ member_id link)
│   ├── schema.ts           # AUTO-GENERATED column types, do not edit by hand
│   └── schema_rules.ts     # Rules for the schema generator
├── inertia/                # React frontend (pages, layouts, components, CSS)
├── start/routes.ts         # Routes
├── mecatron-er-db/         # Database build kit
│   ├── sql/01_schema.sql   # Tables, keys, constraints, triggers
│   ├── sql/02_seed.sql     # Seed data
│   ├── sql/03_views.sql    # Reporting views (case dashboard, timelines, tasks)
│   ├── setup_db.py         # Runs the three SQL files and prints row counts
│   └── README.md           # Schema details + MySQL Workbench guide
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

---

## 9. Troubleshooting

| Symptom | Fix |
|---|---|
| `Access denied for user 'root'` | The password in `.env` or `mecatron-er-db/.env` is wrong. Check that both files match your MySQL password. |
| `Can't connect to MySQL server on '127.0.0.1'` | MySQL isn't running. Start Laragon, the MySQL service, or `docker start mecatron-mysql`. |
| `Unknown collation: 'utf8mb4_0900_ai_ci'` | You're on MariaDB or MySQL 5.7. Install MySQL 8 (step 2). |
| `Table 'mecatron_er.users' doesn't exist` | Run `node ace migration:run` after `setup_db.py`. |
| `Failed to open the referenced table 'members'` during migration | `setup_db.py` hasn't been run yet. Run it first. |
| `Missing .env - copy .env.example to .env` | Create `mecatron-er-db/.env` (step 4b). |
| `E_MISSING_APP_KEY` or an app-key error on start | Run `node ace generate:key`. |
| `You do not have the SUPER privilege and binary logging is enabled` | Run `setup_db.py` as `root`, or run `SET GLOBAL log_bin_trust_function_creators = 1;` once. The schema creates triggers, which need this. |
| `ModuleNotFoundError: No module named 'mysql'` | The virtual environment isn't active. Activate it (step 3) and run `pip install -r requirements.txt`. |
| You can't log in after resetting the database | A reset wipes `users`. Sign up again. |
| MySQL installer fails with Error 1307 / 1603 | Your C: drive is full. Free up 1–2 GB, or use Laragon or Docker instead. |
