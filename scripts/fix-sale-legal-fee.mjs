/**
 * Populate saleLegalFee for all sale_purchase fee bands.
 * The saleLegalFee is the sale-leg legal fee (from the 'sale' transaction type rows).
 * The existing legalFee column in sale_purchase rows = purchase leg legal fee.
 * Also fixes TQ Law row 60069 which has legalFee = 39900 (should be 399).
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Firm-specific sale legal fees by value band (from the 'sale' rows in the DB)
// Format: firmId -> array of { minValue, maxValue, saleLegalFee }
const saleFeesByFirm = {
  // Burtons Legal Group (id 60001) — flat £1400 for all bands
  60001: [
    { min: 0,       max: 80000,   fee: 1400 },
    { min: 80001,   max: 100000,  fee: 1400 },
    { min: 100001,  max: 200000,  fee: 1400 },
    { min: 200001,  max: 300000,  fee: 1400 },
    { min: 300001,  max: 500000,  fee: 1400 },
    { min: 500001,  max: 600000,  fee: 1400 },
    { min: 600001,  max: 1000000, fee: 1400 },
    { min: 1000001, max: 9999999, fee: 1400 },
  ],
  // Easy Choice Conveyancing — flat £1200 for all bands
  // (Easy Choice has firmId — need to look up)
  // PCS Legal — tiered sale fees
  // TQ Law — tiered sale fees
};

// Get firm IDs
const [firms] = await conn.execute("SELECT id, name FROM law_firms WHERE isActive = 1");
const firmMap = {};
firms.forEach(f => { firmMap[f.name.toLowerCase()] = f.id; });

console.log('Firm IDs:', firmMap);

// Get all sale_purchase rows
const [spRows] = await conn.execute(
  "SELECT fs.id, f.id as firmId, f.name, fs.minValue, fs.maxValue FROM firm_fee_structures fs JOIN law_firms f ON f.id = fs.firmId WHERE fs.transactionType = 'sale_purchase' ORDER BY f.name, fs.minValue"
);

// Get all sale rows to build a lookup
const [saleRows] = await conn.execute(
  "SELECT f.id as firmId, fs.minValue, fs.maxValue, fs.legalFee FROM firm_fee_structures fs JOIN law_firms f ON f.id = fs.firmId WHERE fs.transactionType = 'sale' ORDER BY f.id, fs.minValue"
);

// Build sale fee lookup: firmId -> sorted bands
const saleLookup = {};
for (const row of saleRows) {
  if (!saleLookup[row.firmId]) saleLookup[row.firmId] = [];
  saleLookup[row.firmId].push({ min: row.minValue, max: row.maxValue, fee: Number(row.legalFee) });
}

console.log('Sale lookup:', JSON.stringify(saleLookup, null, 2));

// For each sale_purchase row, find the matching sale fee
// We match by the sale property value band — but since we don't know the sale price at this point,
// we use the purchase price band as a proxy (same band structure).
// The actual sale leg will be computed dynamically at quote time using the real sale price.
// Here we just need a reasonable default for the saleLegalFee column.
// We'll use the sale fee for the SAME value band (minValue/maxValue).

let updated = 0;
let errors = 0;

for (const sp of spRows) {
  const saleBands = saleLookup[sp.firmId];
  if (!saleBands || saleBands.length === 0) {
    console.warn(`No sale bands for firm ${sp.name} (${sp.firmId})`);
    errors++;
    continue;
  }
  
  // Find the sale band that overlaps with this purchase band's midpoint
  const midValue = Math.floor((sp.minValue + Math.min(sp.maxValue, 9999999)) / 2);
  let saleFee = saleBands[saleBands.length - 1].fee; // fallback to highest
  for (const band of saleBands) {
    if (midValue >= band.min && midValue <= band.max) {
      saleFee = band.fee;
      break;
    }
  }
  
  await conn.execute(
    "UPDATE firm_fee_structures SET saleLegalFee = ? WHERE id = ?",
    [saleFee, sp.id]
  );
  console.log(`Updated id ${sp.id} (${sp.name} ${sp.minValue}-${sp.maxValue}): saleLegalFee = ${saleFee}`);
  updated++;
}

// Fix TQ Law row 60069 which has legalFee = 39900 (should be 399)
const [tqFix] = await conn.execute(
  "UPDATE firm_fee_structures SET legalFee = 399 WHERE id = 60069 AND legalFee > 10000"
);
if (tqFix.affectedRows > 0) {
  console.log('Fixed TQ Law row 60069: legalFee corrected from 39900 to 399');
}

console.log(`\nDone: ${updated} rows updated, ${errors} errors`);
await conn.end();
