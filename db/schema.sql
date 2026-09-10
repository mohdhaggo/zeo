-- Cloudflare D1 schema. Replaces the two DynamoDB tables.
--
-- Column names are snake_case here and mapped to the camelCase the UI expects
-- in functions/lib/db.ts, so the SQL stays idiomatic without churning the
-- frontend.

CREATE TABLE IF NOT EXISTS warranties (
  id                TEXT PRIMARY KEY,
  -- COLLATE NOCASE is load-bearing. Every query compares this column with
  -- COLLATE NOCASE, and SQLite will only use an index when the comparison
  -- collation matches the index collation - so without this the index below
  -- was never used and every lookup scanned the whole table.
  warranty_number   TEXT NOT NULL UNIQUE COLLATE NOCASE,
  product_name      TEXT NOT NULL,
  manufacture_date  TEXT,
  status            TEXT NOT NULL DEFAULT 'UNREGISTERED',
  registration_date TEXT,
  customer_name     TEXT,
  phone             TEXT,
  email             TEXT,
  purchase_date     TEXT,
  purchase_country  TEXT,
  created_at        TEXT NOT NULL
);

-- Public lookup is by warranty number, so index it rather than scanning.
CREATE INDEX IF NOT EXISTS idx_warranties_number ON warranties (warranty_number COLLATE NOCASE);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  region     TEXT NOT NULL,
  interest   TEXT NOT NULL,
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'PENDING',
  created_at TEXT NOT NULL
);

-- The dashboard lists newest first.
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contact_submissions (created_at DESC);
