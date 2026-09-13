/**
 * Builds the import for warranty records that have a customer attached.
 *
 * Kept out of db/migrations/ on purpose. This repository is public, and a
 * registered warranty carries a real name, phone number and email address. An
 * earlier version of the migration had those values committed; this exists so
 * that cannot happen again.
 *
 * It reads the DynamoDB export under zeoshields-documents/ and writes
 * registered-warranties.sql, which .gitignore excludes. Run it, apply the file,
 * then delete it.
 *
 *   node scripts/import-registered-warranty.mjs
 *   npx wrangler d1 execute zeoshields --remote --file registered-warranties.sql
 *   rm registered-warranties.sql
 *
 * Warranty numbers that appear more than once in the source are skipped and
 * listed, because the schema requires them to be unique and nothing in the data
 * says which product the number really belongs to.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const EXPORT = join(
  process.cwd(),
  '..',
  '..',
  'zeoshields-documents',
  'aws-export',
  'production-lnhqga4g',
  'Warranty.json',
);

if (!existsSync(EXPORT)) {
  console.error('Export not found at ' + EXPORT);
  console.error('This script needs the local DynamoDB export, which is not in this repository.');
  process.exit(1);
}

const items = JSON.parse(readFileSync(EXPORT, 'utf8')).Items ?? [];
const val = (cell) => (!cell || cell.NULL ? null : (cell.S ?? cell.N ?? null));
const quote = (v) => (v === null ? 'NULL' : "'" + String(v).split("'").join("''") + "'");

const counts = {};
for (const it of items) {
  const n = val(it.warrantyNumber);
  counts[n] = (counts[n] || 0) + 1;
}

const rows = [];
const skipped = [];

for (const it of items) {
  const number = val(it.warrantyNumber);
  // Only the rows with a customer attached; the rest are in the migration.
  if (!val(it.customer_name) && !val(it.customerName)) continue;
  if (counts[number] > 1) {
    skipped.push(number + ' (appears ' + counts[number] + ' times)');
    continue;
  }
  rows.push(
    '  (' +
      [
        val(it.id),
        number,
        val(it.productName),
        val(it.manufactureDate),
        val(it.status) || 'ACTIVE',
        val(it.registrationDate),
        val(it.customerName),
        val(it.phone),
        val(it.email),
        val(it.purchaseDate),
        val(it.purchaseCountry),
        val(it.createdAt),
      ]
        .map(quote)
        .join(', ') +
      ')',
  );
}

if (!rows.length) {
  console.log('No registered records found in the export. Nothing to write.');
  process.exit(0);
}

const sql =
  '-- Generated locally. Contains personal data. Gitignored. Delete after use.\n\n' +
  'INSERT OR IGNORE INTO warranties\n' +
  '  (id, warranty_number, product_name, manufacture_date, status,\n' +
  '   registration_date, customer_name, phone, email, purchase_date,\n' +
  '   purchase_country, created_at)\n' +
  'VALUES\n' +
  rows.join(',\n') +
  ';\n';

writeFileSync('registered-warranties.sql', sql);
console.log('Wrote registered-warranties.sql with ' + rows.length + ' record(s).');
if (skipped.length) {
  console.log('Skipped duplicate warranty numbers: ' + skipped.join(', '));
}
console.log('\nApply with:');
console.log('  npx wrangler d1 execute zeoshields --remote --file registered-warranties.sql');
console.log('Then delete it.');
