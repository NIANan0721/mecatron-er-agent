"""Build the mecatron_er MySQL database from the SQL files in ./sql.

Reads connection settings from .env (see .env.example), runs
01_schema.sql, 02_seed.sql and 03_views.sql in order, then prints the
row count of every table and view. Safe to re-run: the schema file drops
and recreates the database.

Usage:
    python setup_db.py
"""

import os
import re
import sys
from pathlib import Path

import mysql.connector
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
SQL_FILES = ["01_schema.sql", "02_seed.sql", "03_views.sql"]
DEFAULT_DB = "mecatron_er"


def split_sql(text):
    """Split a SQL script into statements.

    Handles quoted strings, -- / # / block comments, and the client-side
    DELIMITER directive used for trigger bodies (as in MySQL Workbench).
    """
    statements = []
    buf = []
    delimiter = ";"
    quote = None
    i, n = 0, len(text)

    while i < n:
        ch = text[i]

        if quote:
            buf.append(ch)
            if ch == "\\" and quote != "`" and i + 1 < n:
                buf.append(text[i + 1])
                i += 2
                continue
            if ch == quote:
                if i + 1 < n and text[i + 1] == quote:  # doubled quote escape
                    buf.append(text[i + 1])
                    i += 2
                    continue
                quote = None
            i += 1
            continue

        if i == 0 or text[i - 1] == "\n":
            m = re.match(r"[ \t]*DELIMITER[ \t]+(\S+)[ \t]*(?:\r?\n|$)", text[i:], re.IGNORECASE)
            if m:
                delimiter = m.group(1)
                i += m.end()
                continue

        if ch == "#" or (text.startswith("--", i) and (i + 2 >= n or text[i + 2].isspace())):
            end = text.find("\n", i)
            i = n if end == -1 else end
            continue

        if text.startswith("/*", i):
            end = text.find("*/", i + 2)
            i = n if end == -1 else end + 2
            continue

        if text.startswith(delimiter, i):
            stmt = "".join(buf).strip()
            if stmt:
                statements.append(stmt)
            buf = []
            i += len(delimiter)
            continue

        if ch in ("'", '"', "`"):
            quote = ch
        buf.append(ch)
        i += 1

    tail = "".join(buf).strip()
    if tail:
        statements.append(tail)
    return statements


def load_config():
    env_path = BASE_DIR / ".env"
    if not env_path.exists():
        sys.exit("Missing .env - copy .env.example to .env and fill in your MySQL credentials.")
    load_dotenv(env_path)

    missing = [k for k in ("MYSQL_HOST", "MYSQL_USER", "MYSQL_PASSWORD") if os.getenv(k) is None]
    if missing:
        sys.exit(f".env is missing: {', '.join(missing)}")

    return {
        "host": os.getenv("MYSQL_HOST"),
        "port": int(os.getenv("MYSQL_PORT", "3306")),
        "user": os.getenv("MYSQL_USER"),
        "password": os.getenv("MYSQL_PASSWORD"),
    }, os.getenv("MYSQL_DB", DEFAULT_DB)


def run_file(cursor, path, db_name):
    text = path.read_text(encoding="utf-8")
    if db_name != DEFAULT_DB:
        text = re.sub(rf"\b{DEFAULT_DB}\b", db_name, text)

    statements = split_sql(text)
    for stmt in statements:
        try:
            cursor.execute(stmt)
            if cursor.with_rows:
                cursor.fetchall()
        except mysql.connector.Error as err:
            preview = " ".join(stmt.split())[:300]
            sys.exit(f"\nError in {path.name}: {err}\nStatement: {preview}...")
    print(f"  {path.name}: {len(statements)} statements OK")


def print_counts(cursor, db_name):
    cursor.execute(
        "SELECT table_name, table_type FROM information_schema.tables "
        "WHERE table_schema = %s ORDER BY table_type, table_name",
        (db_name,),
    )
    objects = cursor.fetchall()

    print(f"\nRow counts in `{db_name}`:")
    print(f"  {'name':<22} {'type':<6} {'rows':>5}")
    print(f"  {'-' * 22} {'-' * 6} {'-' * 5}")
    for name, table_type in objects:
        cursor.execute(f"SELECT COUNT(*) FROM `{db_name}`.`{name}`")
        (count,) = cursor.fetchone()
        kind = "view" if table_type == "VIEW" else "table"
        print(f"  {name:<22} {kind:<6} {count:>5}")


def main():
    config, db_name = load_config()
    print(f"Connecting to {config['user']}@{config['host']}:{config['port']} ...")
    try:
        conn = mysql.connector.connect(
            **config, charset="utf8mb4", collation="utf8mb4_0900_ai_ci", autocommit=True
        )
    except mysql.connector.Error as err:
        sys.exit(f"Could not connect: {err}")

    try:
        cursor = conn.cursor()
        print(f"Building database `{db_name}`:")
        for name in SQL_FILES:
            run_file(cursor, BASE_DIR / "sql" / name, db_name)
        print_counts(cursor, db_name)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
