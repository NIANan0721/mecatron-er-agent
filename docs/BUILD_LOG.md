# Build log: how this project was set up

This is a step-by-step record of everything done to build the Mecatron External Relations Agent database and connect it to the app, including every command used and why. It's written so you can follow the reasoning and reuse the techniques.

Commands are shown for **Windows PowerShell** unless marked otherwise.

---

## Part 1: Checking the machine before building anything

Before writing code, check what's installed so you don't build on wrong assumptions.

| Command | Why |
|---|---|
| `Get-ChildItem -Force` | List the project folder, including hidden files like `.env`. |
| `python --version` | Is Python installed and on the PATH? (It wasn't: Windows opened the Store alias instead.) |
| `& "$env:LOCALAPPDATA\Programs\Python\Python313\python.exe" --version` | Python 3.13 *was* installed, just not on the PATH, so call it by full path. |
| `Get-Command mysql` | Is the MySQL client available? |
| `Get-NetTCPConnection -LocalPort 3306 -State Listen` | Is anything listening on MySQL's default port? (Nothing was, at first.) |
| `Get-Service *mysql*` | Is MySQL installed as a Windows service? |

**Lesson:** "Not on PATH" and "not installed" are different problems. Check both.

---

## Part 2: The SQL database kit (`mecatron-er-db/`)

Files written:

| File | Purpose |
|---|---|
| `sql/01_schema.sql` | `DROP DATABASE` / `CREATE DATABASE`, the 13 tables, keys, constraints and 2 triggers |
| `sql/02_seed.sql` | Demo data, inserted parent tables first so foreign keys are satisfied |
| `sql/03_views.sql` | 4 reporting views |
| `setup_db.py` | Reads `.env`, runs the 3 SQL files, prints row counts |
| `.env.example`, `.gitignore`, `requirements.txt`, `README.md` | Config template, git ignores, Python dependencies, docs |

**Key design ideas used in the schema**

- **Foreign keys with deliberate delete rules.**
  - `CASCADE` for child records: deleting a sponsor deletes its contacts.
  - `RESTRICT` for history you must not lose: a member who appears in old records can't be deleted.
  - `SET NULL` for optional links.
- **Composite foreign keys** to enforce "belongs to the same parent". `(primary_contact_id, sponsor_id) → sponsor_contacts(id, sponsor_id)` guarantees a case's contact works at that case's sponsor.
- **The "only one current draft" trick.** A generated column `current_flag = IF(is_current, 1, NULL)` plus `UNIQUE(case_id, current_flag)`. MySQL lets a UNIQUE key hold many NULLs but only one `1`.
- **CHECK constraints** for rules within one row, e.g. "completed cases must have `completed_at`".
- **Triggers** for rules that need *another* table, e.g. "the assigned sender must be a lead". CHECK constraints can't look at other tables.
- **Views** to save complex queries under a name, e.g. the case dashboard's "2/4 approved".

**Testing the SQL splitter without a database.** `setup_db.py` splits each SQL file into statements, handling quotes, comments and `DELIMITER` blocks. I tested it offline by stubbing out the MySQL module and printing every statement it found.

**The Python virtual environment**

```powershell
& "$env:LOCALAPPDATA\Programs\Python\Python313\python.exe" -m venv venv   # isolated Python for this folder
.\venv\Scripts\python.exe -m pip install -r requirements.txt              # install mysql-connector + dotenv into it
```

**Why a venv:** packages install into `mecatron-er-db/venv` instead of system-wide, so projects don't conflict.

---

## Part 3: Getting a MySQL server (what went wrong, and what we learned)

| Step | Command | Result |
|---|---|---|
| 1 | `winget install --id Oracle.MySQL --version 8.4.9 --exact --silent` | ❌ Exit 1603. Found the cause in the installer log: **Error 1307, not enough disk space** on C:. |
| 2 | `Get-PSDrive -PSProvider FileSystem` | Showed only **1 GB free on C:**, 94 GB on D:. |
| 3 | `Invoke-WebRequest -Method Head <url>` against 3 URLs | Found which download URL actually exists (`cdn.mysql.com/archives/...`). The others returned 404/403. |
| 4 | `Invoke-WebRequest ... -OutFile D:\MySQL\download\...zip` | Downloaded the no-install ZIP build onto D:. |
| 5 | `tar -xf <zip> -C D:\MySQL` | Extracted it. Windows' `tar` is faster than `Expand-Archive`. |
| 6 | `mysqld --defaults-file=D:\MySQL\my.ini --initialize-insecure` | ❌ Crashed allocating memory, likely because Windows couldn't grow its page file on the full C:. |
| 7 | `Get-CimInstance Win32_Process -Filter "Name='mysqld.exe'"` | Revealed **Laragon's MySQL 8.4.3 already running**. This was the real answer. |
| 8 | `Get-NetTCPConnection -State Listen -OwningProcess <pid>` | Confirmed Laragon listens on port 3306. |

**Lessons**
- When an installer fails, **read its log file**. "1603" is generic; the log said exactly what was wrong.
- Check what's already running before installing something new.
- A full system drive breaks things in surprising ways, even memory allocation.

---

## Part 4: Building and verifying the database

```powershell
.\venv\Scripts\python.exe setup_db.py
```

The first run failed with **MySQL error 3823**: a column used in a CHECK constraint can't also have `ON UPDATE CASCADE` on its foreign key. I changed that one foreign key (`completed_by`) to `ON UPDATE RESTRICT` and re-ran. It succeeded.

Then a verification script ran:
- **Sample queries:** GPS Lands' full profile, everything overdue, the case dashboard.
- **Constraint tests.** Each of these tried to insert bad data inside a transaction and then rolled it back:
  - a non-lead as sender
  - a contact from the wrong sponsor
  - a second current draft
  - a bad case code
  - deleting a sponsor that has cases

All were correctly blocked.

**Lesson:** a constraint you haven't tried to break is a constraint you haven't tested. Also, run setup scripts twice to prove they're re-runnable.

---

## Part 5: Connecting the AdonisJS app

| Command / change | Why |
|---|---|
| Edit `.env`: `DB_DATABASE=mecatron_er` | Point the app at the new database. (The old one was checked first and was empty.) |
| New migration: add `member_id` to `users` | Link each app login to a Mecatron member. |
| `node ace migration:run` | Create `users`. Lucid also **auto-generates `database/schema.ts`** by scanning every table. |
| `database/schema_rules.ts`: `skipColumns` | Keep the generated helper columns (`current_flag`, `primary_flag`) out of the models, because MySQL rejects writes to them. |
| `node ace schema:generate` | Regenerate the types after changing the rules. |
| `config/database.ts`: `typeCast` | MySQL `BOOLEAN` is really `TINYINT(1)`, and mysql2 returns `1`/`0`. This converts them to `true`/`false`. |
| 13 model files in `app/models/` | Each extends its generated schema class and adds relationships (`hasMany`, `belongsTo`, `hasOne`). |
| `DashboardController` + `dashboard.tsx` + CSS | Show the `v_case_dashboard` view on the dashboard. |
| `node ace serve --hmr` (background) | Start the dev server. This also regenerates the controller registry. |
| `node node_modules\typescript\bin\tsc --noEmit` | Type-check. `npm run typecheck` failed with a Windows process-launch error, so I called `tsc` directly. |
| `node node_modules\eslint\bin\eslint.js --fix <files>` | Lint and auto-format with the project's Prettier rules. |

**End-to-end test:** a PowerShell script fetched the signup page to get the CSRF cookie, signed up as `timothy@example.com`, and loaded `/dashboard` as an Inertia request. It confirmed `memberId: 1` and all 6 cases came back. Then I deleted the test user.

- **Gotcha:** the first delete wasn't committed, because the Python connector doesn't autocommit by default. I re-ran it with `COMMIT` and checked from a new connection.

**Model check:** a temporary `node ace` command loaded relationships (sponsor → owner/contacts, case → drafts → approvals → approver) to prove they work. Then I deleted it.

---

## Part 6: Documentation and GitHub

| Command | Why |
|---|---|
| `Move-Item README.md docs\adonis-starter-kit.md` | Keep the starter-kit guide, but make room for a project README. |
| `git init -b main` | Make the folder a git repository with a `main` branch. |
| `git add -A --dry-run` | **Preview** exactly which files would be committed, before committing anything. |
| `Select-String -Path <files> -Pattern "PASSWORD=\S\|sk-...\|ghp_..."` | Scan those files for secrets. Only placeholders were found. |
| `winget install --id GitHub.cli` | Install the GitHub CLI (`gh`). |
| `gh auth login --hostname github.com --git-protocol https --web` | Sign in through the browser with a one-time code, so no password is typed in the terminal. |
| `git config --global user.name/user.email` | Set who commits are attributed to. |
| `gh auth setup-git` | Let `git push` use the `gh` login. |
| `git commit -F <message-file>` | Commit using a message file. PowerShell 5.1 can't pipe here-strings into `git commit -F -`. |
| `gh repo create mecatron-er-agent --public --source . --remote origin --push` | Create the GitHub repo, connect it as `origin`, and push, all in one step. |
| `git ls-files \| Select-String "\.env$\|venv/"` | Final proof that no secrets or environments are tracked. |

**Lesson:** always dry-run and scan before your first push. Anything pushed to a public repo should be treated as public forever.

---

## Part 7: One-command database setup (`node ace db:setup`)

**Goal:** a teammate runs one command and gets the full database, with no Python and no second `.env`.

**Research first.** I read Lucid's source in `node_modules` to learn how `migration:fresh`, the seeders and nested commands behave:

| What I checked | What I found |
|---|---|
| `fresh.js` | It runs `db:wipe` → `migration:run` → `db:seed`, and has a `--drop-views` flag. |
| `dialects/mysql.js` | It drops only base tables unless told to drop views. |
| `seeders/source.js` | It loads seeders recursively, so the data files must live **outside** `database/seeders/`. |

**What was written**
- **14 migrations:** one per table, plus `create_reporting_views`.
  - They're numbered `…100`–`…112` so they run before the existing `users` migrations, which need `members` to exist.
  - Each uses Knex's schema builder: `table.enum`, `table.foreign(...).onDelete(...)`, `table.check(...)`, `table.specificType(...)` for generated columns, and `this.schema.raw(...)` for triggers and views.
- **`database/seed_data/*.ts`:** generated from the live database by a script (`export_seed.py`). This avoided hand-copying about 200 rows, which would have risked typos. Prettier formatted the result.
- **`database/seeders/main_seeder.ts`:** inserts all rows in foreign-key order inside **one transaction**, so it's all or nothing. `static environment = ['development', 'test']` stops it running in production.
- **`commands/db_setup.ts`:**
  1. creates the database if it's missing (Lucid can't create databases)
  2. asks before wiping existing data
  3. runs `migration:fresh --seed`
  4. prints the row counts

**Bugs found while testing, and the fixes**

| Bug | Cause | Fix |
|---|---|---|
| `DROP VIEW ;` syntax error | Lucid builds an empty `DROP VIEW` when there are no views. | Pass `--drop-views` only when views exist. |
| `Illegal mix of collations for operation 'UNION'` in `v_sponsor_timeline` | mysql2 connects with `utf8mb4_unicode_ci`, but the tables use `utf8mb4_0900_ai_ci`. | **First try:** `charset: 'utf8mb4_0900_ai_ci'`. ❌ Knex used it as the table *character set*. **Real fix:** a pool `afterCreate` hook runs `SET NAMES utf8mb4 COLLATE utf8mb4_0900_ai_ci` on every new connection. |

**Verification**

```powershell
# drop everything (it only held seed data), then build from nothing
python inspect_db.py "DROP DATABASE IF EXISTS mecatron_er"
node ace db:setup
```

- **Row counts:** they matched the SQL kit exactly.
- **Rules:** the same 2 triggers, 30 foreign keys and 6 CHECK constraints, and every constraint test still blocked.
- **Prompt:** with no answer it defaults to "No" and changes nothing.
- **`--no-seed` then `node ace db:seed`:** also works.

**Lesson:** the collation bug existed in the original SQL kit too. It only showed up when the view was queried *from the app's connection*, so test from the same client your users will use.

---

## Part 8: The data console (CRUD frontend)

**Goal:** browse and edit every table, see how they relate, and search everything from one bar.

**Approach chosen: one controller per table** (option A). This is the standard AdonisJS pattern and easier to learn from than one generic controller.

**The three files each table gets**

| File | Job | Example |
|---|---|---|
| `app/resources/<table>.ts` | Describes the fields for the UI: label, type, enum choices, which relation to preload | `sponsorResource` |
| `app/validators/<model>.ts` | Checks input on the server before saving | `sponsorValidator` |
| `app/controllers/<table>_controller.ts` | The 7 CRUD actions: `index`, `show`, `create`, `store`, `edit`, `update`, `destroy` | `SponsorsController` |

`router.resource('sponsors', controllers.Sponsors)` creates all 7 routes in one line.

**Request flow**

```
browser → start/routes.ts → SponsorsController → sponsorValidator → Sponsor model → MySQL
                                     └→ inertia.render('data/table' | 'data/record' | 'data/form', props)
```

**Shared pieces**
- **3 React pages** (`inertia/pages/data/`) serve all 13 tables. They read the resource description to decide which inputs and columns to show.
- **`DataOverviewController`** reads foreign keys straight from MySQL's `information_schema`, so the relationship map always matches the real database.
- **`SearchController`** searches every text column in every table and returns JSON grouped by table.
- **`db_errors.ts`** maps MySQL error numbers to friendly sentences:

  | Error | Meaning |
  |---|---|
  | 1451 | delete blocked |
  | 1452 | bad link |
  | 1062 | duplicate |
  | 3819 | CHECK rule broken |
  | 1644 | trigger message |

- **`@xyflow/react@12.12.0`** (React Flow) draws the draggable, zoomable map.

| Command | Why |
|---|---|
| `npm view @xyflow/react version license` | Check the library's latest version and its licence (MIT) before adding it. |
| `npm view @xyflow/react time --json` | Check publish dates, to pin a version that's been out for a few weeks. |
| `npm install @xyflow/react@12.12.0 --save-exact` | Install that exact version. |
| `node ace serve --hmr` | Also regenerates `.adonisjs/server/controllers.ts`, so `controllers.Sponsors` exists for the routes. |
| `tsc --noEmit` (server and `inertia/` projects) | Type-check both halves. |
| `eslint --fix app start inertia` | Lint and auto-format. |
| `node console_e2e.mjs <url>` | 40 end-to-end checks: every page of every table, create / edit / delete, rule errors, data types, search, logged-out access. |
| `Invoke-WebRequest <url>/inertia/pages/data/*.tsx` | Ask Vite to compile each frontend file, to catch build errors without a browser. |
| `node ace db:setup --force` | Put the clean demo data back after testing. |

**Bugs found while building, and the fixes**

| Problem | Cause | Fix |
|---|---|---|
| `vine.date().transform(...)` didn't type-check | In AdonisJS, `vine.date()` **already returns a luxon `DateTime`**. | Removed the transform. |
| `orderBy('sponsorType')` would fail | The URL uses the model property, but SQL needs the column `sponsor_type`. | `Sponsor.$getColumn(sort).columnName` |
| Every controller failed to type-check | Page props must be plain JSON, and `as const` arrays are `readonly`. | `options: [...SPONSOR_TYPES]` |
| **Every filter and search crashed** (HTTP 500) | Knex's `whereLike()` adds `COLLATE utf8_bin` on MySQL, which is invalid for `utf8mb4`. | `whereILike()`: a plain `LIKE`, and our `*_ai_ci` collation already ignores case and accents. |
| Lint: "set state inside an effect", "reassigning a variable after render" | React-hooks rules. | Compute the search-result positions in `useMemo` instead. |
| Map showed 29 links, not 30 | Not a bug: the 30th foreign key is `users.member_id`, and `users` is deliberately hidden. | The test's expected number was corrected. |

**Lesson:** the `whereLike` crash only appeared when a test actually typed a filter. Type checks and "does the page load" checks both passed, so test the real actions users take.

---

## Concepts worth remembering

| Concept | One-line meaning |
|---|---|
| Primary key | The unique ID of a row. |
| Foreign key | A column pointing to another table's row. The database refuses links to rows that don't exist. |
| `ON DELETE CASCADE / RESTRICT / SET NULL` | What happens to children when the parent is deleted: delete them too, block the delete, or unlink them. |
| Index | A lookup structure that makes filtering on a column fast. |
| CHECK constraint | A rule each row must satisfy. |
| Trigger | Code the database runs automatically before or after an insert or update. |
| View | A saved query you can `SELECT` from like a table. |
| Collation | The rules for comparing text. Mixing two collations in one expression errors. |
| Migration | Versioned code that changes the database *structure*. |
| Seeder | Code that inserts *data*. |
| Transaction | A group of statements that all succeed or all roll back. |
| `.env` | Per-machine settings and secrets. Never committed. |
| Virtual environment (venv) | A per-project Python package folder. |
| CRUD | **C**reate, **R**ead, **U**pdate, **D**elete: the four basic things you do with records. |
| Controller | The code that handles a URL: it reads the request, talks to models and returns a page. |
| Validator | Rules that check user input before it reaches the database. |
| Resource route | One line (`router.resource`) that creates all 7 CRUD routes for a table. |
| Preload | Loading related records in the same query, e.g. a sponsor together with its contacts. |
| Inertia | Lets a server controller return a React page with data, with no separate API. |

---

## Cheat sheet: the commands you'll use most

| Task | Command |
|---|---|
| Build / reset the database | `node ace db:setup` |
| Start the app | `node ace serve --hmr` |
| Apply new migrations only | `node ace migration:run` |
| Create a migration | `node ace make:migration <name>` |
| Regenerate model types | `node ace schema:generate` |
| See what git would commit | `git status`, `git add -A --dry-run` |
| Save and upload changes | `git add -A`, `git commit -m "..."`, `git push` |
| Check free disk space | `Get-PSDrive -PSProvider FileSystem` |
| See what's on a port | `Get-NetTCPConnection -LocalPort 3306 -State Listen` |
