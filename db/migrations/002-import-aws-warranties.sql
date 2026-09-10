-- Warranty records recovered from the retired DynamoDB table
-- Warranty-lnhqga4gaja5zk3whivrqqsgay-NONE, which the original move to D1
-- missed: it seeded from a sandbox table instead, so the live lookup held
-- three test numbers while these seven sat only in AWS.
--
-- INSERT OR IGNORE, so running this twice changes nothing and it cannot
-- overwrite a record someone has since registered.
--
-- HELD BACK, needing a decision:
--   PPF-002-1013 (TITAN PPF)
--   PPF-002-1013 (ULTRA PPF)
-- That number exists twice in the source data under two different products.
-- The schema requires warranty numbers to be unique, and nothing in the data
-- says which product is correct.
--
-- Run with:
--   npx wrangler d1 execute zeoshields --remote --file db/migrations/002-import-aws-warranties.sql

INSERT OR IGNORE INTO warranties
  (id, warranty_number, product_name, manufacture_date, status,
   registration_date, customer_name, phone, email, purchase_date,
   purchase_country, created_at)
VALUES
  ('80b4f7de-409d-4c85-88b7-bc85ca2a4bbd', 'PPF-002-1012', 'TITAN PPF', '2026-02-03', 'UNREGISTERED', NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-18T19:08:01.734Z'),
  ('630aa1e1-2318-4d57-907f-5070c1a77178', 'PPF-002-1014', 'TITAN SATIN PPF', '2026-05-01', 'UNREGISTERED', NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-18T19:10:13.067Z'),
  ('5d875a35-73c9-4469-83bd-28130f99ae10', 'PPF-001-ID', 'TITAN PPF', '2026-05-04', 'ACTIVE', '2026-05-18T18:56:53.687Z', 'Mohamed Haggo', '+97466668795', 'mohd.haggo@gmail.com', '2026-05-11', 'Qatar', '2026-05-18T18:44:56.318Z'),
  ('48b3f9b4-7a3f-4116-95c3-7e60a74b672c', 'PPF-002-1010', 'TITAN SATIN PPF', '2026-05-01', 'UNREGISTERED', NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-18T18:57:57.404Z'),
  ('52022d65-79d5-4bcc-8095-a442266b860a', 'ppf-test', 'TITAN PPF', '2026-05-02', 'UNREGISTERED', NULL, NULL, NULL, NULL, NULL, NULL, '2026-05-18T19:16:39.704Z');
