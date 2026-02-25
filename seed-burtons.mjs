/**
 * Seed script: inserts Burtons Solicitors with fee structures.
 * Run with: node seed-burtons.mjs
 * Multiplier: 1.03 (slightly above base)
 * Land Registry fees: portal column values
 */

import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Portal Land Registry fee lookup by property value
function getLandRegistryFee(propertyValue) {
  if (propertyValue <= 80000) return 20;
  if (propertyValue <= 100000) return 40;
  if (propertyValue <= 200000) return 100;
  if (propertyValue <= 500000) return 150;
  if (propertyValue <= 1000000) return 295;
  return 500;
}

const MULTIPLIER = 1.03;

const PURCHASE_BANDS = [
  { minValue: 0,       maxValue: 80000,   baseFee: 525 },
  { minValue: 80001,   maxValue: 100000,  baseFee: 525 },
  { minValue: 100001,  maxValue: 200000,  baseFee: 525 },
  { minValue: 200001,  maxValue: 300000,  baseFee: 525 },
  { minValue: 300001,  maxValue: 500000,  baseFee: 599 },
  { minValue: 500001,  maxValue: 600000,  baseFee: 599 },
  { minValue: 600001,  maxValue: 1000000, baseFee: 750 },
  { minValue: 1000001, maxValue: 9999999, baseFee: 1250 },
];

const SALE_BANDS = [
  { minValue: 0,       maxValue: 300000,  baseFee: 499 },
  { minValue: 300001,  maxValue: 600000,  baseFee: 599 },
  { minValue: 600001,  maxValue: 9999999, baseFee: 750 },
];

const REMORTGAGE_BANDS = [
  { minValue: 0,       maxValue: 250000,  baseFee: 349 },
  { minValue: 250001,  maxValue: 500000,  baseFee: 449 },
  { minValue: 500001,  maxValue: 9999999, baseFee: 599 },
];

const PURCHASE_DISBURSEMENTS = { searchFee: 349, antiMoneyLaunderingFee: 49, electronicTransferFee: 35 };
const SALE_DISBURSEMENTS     = { officialCopiesFee: 12, antiMoneyLaunderingFee: 49, electronicTransferFee: 35 };
const REMORTGAGE_DISBURSEMENTS = { antiMoneyLaunderingFee: 49, electronicTransferFee: 35 };

const PURCHASE_SUPPLEMENTS = {
  leaseholdSupplement: 149,
  newBuildSupplement: 149,
  sharedOwnershipSupplement: 249,
  giftedDepositSupplement: 49,
};

const SALE_SUPPLEMENTS = { leaseholdSupplement: 149 };

async function seed() {
  // Get the Burtons Solicitors firm ID (already inserted)
  const [rows] = await conn.execute("SELECT id FROM law_firms WHERE name = 'Burtons Solicitors'");
  if (!rows.length) {
    console.error('Burtons Solicitors not found in law_firms table!');
    process.exit(1);
  }
  const firmId = rows[0].id;
  console.log(`Found Burtons Solicitors with id=${firmId}`);

  // Remove any existing fee structures for this firm
  await conn.execute('DELETE FROM firm_fee_structures WHERE `firmId` = ?', [firmId]);
  console.log('Cleared existing fee structures for Burtons Solicitors.');

  const m = MULTIPLIER;

  // ── PURCHASE fee bands ──
  for (const band of PURCHASE_BANDS) {
    const legalFee = Math.round(band.baseFee * m);
    const lrFee = getLandRegistryFee(band.maxValue === 9999999 ? 1000001 : band.maxValue);
    await conn.execute(
      `INSERT INTO firm_fee_structures
         (\`firmId\`, \`transactionType\`, \`minValue\`, \`maxValue\`, \`legalFee\`,
          \`searchFee\`, \`antiMoneyLaunderingFee\`, \`electronicTransferFee\`, \`landRegistryFee\`,
          \`leaseholdSupplement\`, \`newBuildSupplement\`, \`sharedOwnershipSupplement\`, \`giftedDepositSupplement\`,
          \`platformCommission\`, \`isActive\`)
       VALUES (?, 'purchase', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1)`,
      [
        firmId, band.minValue, band.maxValue, legalFee,
        PURCHASE_DISBURSEMENTS.searchFee,
        PURCHASE_DISBURSEMENTS.antiMoneyLaunderingFee,
        PURCHASE_DISBURSEMENTS.electronicTransferFee,
        lrFee,
        Math.round(PURCHASE_SUPPLEMENTS.leaseholdSupplement * m),
        Math.round(PURCHASE_SUPPLEMENTS.newBuildSupplement * m),
        Math.round(PURCHASE_SUPPLEMENTS.sharedOwnershipSupplement * m),
        Math.round(PURCHASE_SUPPLEMENTS.giftedDepositSupplement * m),
      ]
    );
  }
  console.log('  → Purchase bands inserted');

  // ── SALE fee bands ──
  for (const band of SALE_BANDS) {
    const legalFee = Math.round(band.baseFee * m);
    await conn.execute(
      `INSERT INTO firm_fee_structures
         (\`firmId\`, \`transactionType\`, \`minValue\`, \`maxValue\`, \`legalFee\`,
          \`officialCopiesFee\`, \`antiMoneyLaunderingFee\`, \`electronicTransferFee\`,
          \`leaseholdSupplement\`,
          \`platformCommission\`, \`isActive\`)
       VALUES (?, 'sale', ?, ?, ?, ?, ?, ?, ?, 0, 1)`,
      [
        firmId, band.minValue, band.maxValue, legalFee,
        SALE_DISBURSEMENTS.officialCopiesFee,
        SALE_DISBURSEMENTS.antiMoneyLaunderingFee,
        SALE_DISBURSEMENTS.electronicTransferFee,
        Math.round(SALE_SUPPLEMENTS.leaseholdSupplement * m),
      ]
    );
  }
  console.log('  → Sale bands inserted');

  // ── REMORTGAGE fee bands ──
  for (const band of REMORTGAGE_BANDS) {
    const legalFee = Math.round(band.baseFee * m);
    await conn.execute(
      `INSERT INTO firm_fee_structures
         (\`firmId\`, \`transactionType\`, \`minValue\`, \`maxValue\`, \`legalFee\`,
          \`antiMoneyLaunderingFee\`, \`electronicTransferFee\`,
          \`platformCommission\`, \`isActive\`)
       VALUES (?, 'remortgage', ?, ?, ?, ?, ?, 0, 1)`,
      [
        firmId, band.minValue, band.maxValue, legalFee,
        REMORTGAGE_DISBURSEMENTS.antiMoneyLaunderingFee,
        REMORTGAGE_DISBURSEMENTS.electronicTransferFee,
      ]
    );
  }
  console.log('  → Remortgage bands inserted');

  // ── SALE_PURCHASE fee bands ──
  for (const band of PURCHASE_BANDS) {
    const purchaseFee = Math.round(band.baseFee * m);
    const saleBand = SALE_BANDS.find(s => band.minValue >= s.minValue && band.minValue <= s.maxValue)
      || SALE_BANDS[SALE_BANDS.length - 1];
    const saleFee = Math.round(saleBand.baseFee * m);
    const legalFee = purchaseFee + saleFee;
    const lrFee = getLandRegistryFee(band.maxValue === 9999999 ? 1000001 : band.maxValue);
    await conn.execute(
      `INSERT INTO firm_fee_structures
         (\`firmId\`, \`transactionType\`, \`minValue\`, \`maxValue\`, \`legalFee\`,
          \`searchFee\`, \`antiMoneyLaunderingFee\`, \`electronicTransferFee\`, \`officialCopiesFee\`, \`landRegistryFee\`,
          \`leaseholdSupplement\`, \`newBuildSupplement\`, \`sharedOwnershipSupplement\`, \`giftedDepositSupplement\`,
          \`platformCommission\`, \`isActive\`)
       VALUES (?, 'sale_purchase', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1)`,
      [
        firmId, band.minValue, band.maxValue, legalFee,
        PURCHASE_DISBURSEMENTS.searchFee,
        PURCHASE_DISBURSEMENTS.antiMoneyLaunderingFee,
        PURCHASE_DISBURSEMENTS.electronicTransferFee,
        SALE_DISBURSEMENTS.officialCopiesFee,
        lrFee,
        Math.round(PURCHASE_SUPPLEMENTS.leaseholdSupplement * m),
        Math.round(PURCHASE_SUPPLEMENTS.newBuildSupplement * m),
        Math.round(PURCHASE_SUPPLEMENTS.sharedOwnershipSupplement * m),
        Math.round(PURCHASE_SUPPLEMENTS.giftedDepositSupplement * m),
      ]
    );
  }
  console.log('  → Sale+Purchase bands inserted');

  console.log('\nBurtons Solicitors seeded successfully!');
  await conn.end();
}

seed().catch(e => { console.error(e); process.exit(1); });
