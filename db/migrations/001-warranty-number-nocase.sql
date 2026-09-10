-- Makes the warranty_number index usable.
--
-- WHY: db/schema.sql declared warranty_number with the default BINARY
-- collation, while every query in functions/ compares it with COLLATE NOCASE.
-- SQLite only uses an index for an equality test when the comparison's
-- collation matches the index's, so idx_warranties_number was never used and
-- every public lookup and every registration scanned the whole table. On D1
-- that is billed per row read, so an enumeration flood against the lookup
-- endpoint burned the free daily allowance far faster than it should have.
--
-- SQLite cannot alter a column's collation in place, so the table is rebuilt.
--
-- HOW TO RUN (from the zeo/zeo directory):
--   npx wrangler d1 execute zeoshields --remote --file db/migrations/001-warranty-number-nocase.sql
--
-- Take a backup first:
--   npx wrangler d1 export zeoshields --remote --output backup-before-001.sql
--
-- This is safe to run twice: the second run finds warranties_new missing and
-- the rename already done, and fails on the CREATE rather than losing data.

PRAGMA foreign_keys = OFF;

BEGIN TRANSACTION;

CREATE TABLE warranties_new (
  id                TEXT PRIMARY KEY,
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

INSERT INTO warranties_new
SELECT id, warranty_number, product_name, manufacture_date, status,
       registration_date, customer_name, phone, email, purchase_date,
       purchase_country, created_at
  FROM warranties;

DROP TABLE warranties;

ALTER TABLE warranties_new RENAME TO warranties;

CREATE INDEX IF NOT EXISTS idx_warranties_number
  ON warranties (warranty_number COLLATE NOCASE);

COMMIT;

PRAGMA foreign_keys = ON;

-- Verify afterwards. The plan should say SEARCH using idx_warranties_number,
-- not SCAN:
--   npx wrangler d1 execute zeoshields --remote --command \
--     "EXPLAIN QUERY PLAN SELECT 1 FROM warranties WHERE warranty_number = 'X' COLLATE NOCASE"
