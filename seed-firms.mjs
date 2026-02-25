/**
 * Seed script: inserts the 5 law firms and their fee structures into the database.
 * Run with: node seed-firms.mjs
 *
 * Fee multipliers per firm (from feeEngine.ts):
 *   Easy Choice Conveyancing  → 1.00
 *   PCS Legal                 → 0.95
 *   Premier Property Law      → 1.12
 *   Clarity Conveyancing      → 0.88
 *   Meridian Law              → 1.05
 *
 * Base fees (from feeEngine.ts):
 *   Purchase: 0–300k=525, 300k–600k=599, 600k–1M=750, 1M+=1250
 *   Sale:     0–300k=499, 300k–600k=599, 600k+=750
 *   Remortgage: 0–250k=349, 250k–500k=449, 500k+=599
 *   Sale+Purchase = sale + purchase combined
 */

import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ── FIRMS ─────────────────────────────────────────────────────────────────────
const firms = [
  { name: 'Easy Choice Conveyancing', location: 'Basildon, Essex', regulatoryBody: 'SRA', sraNumber: '12345678', rating: '4.80', reviewCount: 312, multiplier: 1.00 },
  { name: 'PCS Legal',                location: 'Basildon, Essex', regulatoryBody: 'SRA', sraNumber: '87654321', rating: '4.60', reviewCount: 189, multiplier: 0.95 },
  { name: 'Premier Property Law',     location: 'London, EC2',     regulatoryBody: 'SRA', sraNumber: '11223344', rating: '4.90', reviewCount: 541, multiplier: 1.12 },
  { name: 'Clarity Conveyancing',     location: 'Birmingham, B1',  regulatoryBody: 'CLC', sraNumber: '55667788', rating: '4.50', reviewCount: 97,  multiplier: 0.88 },
  { name: 'Meridian Law',             location: 'Manchester, M1',  regulatoryBody: 'SRA', sraNumber: '99887766', rating: '4.70', reviewCount: 228, multiplier: 1.05 },
];

// ── BASE FEE TABLES ───────────────────────────────────────────────────────────
const PURCHASE_BANDS = [
  { minValue: 0,       maxValue: 300000,  baseFee: 525 },
  { minValue: 300001,  maxValue: 600000,  baseFee: 599 },
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

// Disbursements per transaction type (fixed, not multiplied)
const PURCHASE_DISBURSEMENTS = { searchFee: 349, antiMoneyLaunderingFee: 49, electronicTransferFee: 35 };
const SALE_DISBURSEMENTS     = { officialCopiesFee: 12, antiMoneyLaunderingFee: 49, electronicTransferFee: 35 };
const REMORTGAGE_DISBURSEMENTS = { antiMoneyLaunderingFee: 49, electronicTransferFee: 35 };

// Supplements (multiplied by firm multiplier)
const PURCHASE_SUPPLEMENTS = {
  leaseholdSupplement: 149,
  newBuildSupplement: 149,
  sharedOwnershipSupplement: 249,
  giftedDepositSupplement: 49,
};

const SALE_SUPPLEMENTS = {
  leaseholdSupplement: 149,
};

async function seed() {
  // Clear existing data
  await conn.execute('DELETE FROM firm_fee_structures');
  await conn.execute('DELETE FROM firm_notes');
  await conn.execute('DELETE FROM law_firms');
  await conn.execute('ALTER TABLE law_firms AUTO_INCREMENT = 1');
  console.log('Cleared existing firm data.');

  for (const firm of firms) {
    // Insert firm
    const [result] = await conn.execute(
      `INSERT INTO law_firms (name, location, regulatoryBody, sraNumber, rating, reviewCount, isActive)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [firm.name, firm.location, firm.regulatoryBody, firm.sraNumber, firm.rating, firm.reviewCount]
    );
    const firmId = result.insertId;
    console.log(`Inserted firm: ${firm.name} (id=${firmId})`);

    const m = firm.multiplier;

    // ── PURCHASE fee bands ──
    for (const band of PURCHASE_BANDS) {
      const legalFee = Math.round(band.baseFee * m);
      await conn.execute(
        `INSERT INTO firm_fee_structures
           (\`firmId\`, \`transactionType\`, \`minValue\`, \`maxValue\`, \`legalFee\`,
            \`searchFee\`, \`antiMoneyLaunderingFee\`, \`electronicTransferFee\`,
            \`leaseholdSupplement\`, \`newBuildSupplement\`, \`sharedOwnershipSupplement\`, \`giftedDepositSupplement\`,
            \`platformCommission\`, \`isActive\`)
         VALUES (?, 'purchase', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1)`,
        [
          firmId, band.minValue, band.maxValue, legalFee,
          PURCHASE_DISBURSEMENTS.searchFee,
          PURCHASE_DISBURSEMENTS.antiMoneyLaunderingFee,
          PURCHASE_DISBURSEMENTS.electronicTransferFee,
          Math.round(PURCHASE_SUPPLEMENTS.leaseholdSupplement * m),
          Math.round(PURCHASE_SUPPLEMENTS.newBuildSupplement * m),
          Math.round(PURCHASE_SUPPLEMENTS.sharedOwnershipSupplement * m),
          Math.round(PURCHASE_SUPPLEMENTS.giftedDepositSupplement * m),
        ]
      );
    }

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

    // ── SALE_PURCHASE: use purchase bands (sale+purchase combined handled in engine) ──
    for (const band of PURCHASE_BANDS) {
      const purchaseFee = Math.round(band.baseFee * m);
      // Find matching sale band
      const saleBand = SALE_BANDS.find(s => band.minValue >= s.minValue && band.minValue <= s.maxValue)
        || SALE_BANDS[SALE_BANDS.length - 1];
      const saleFee = Math.round(saleBand.baseFee * m);
      const legalFee = purchaseFee + saleFee;
      await conn.execute(
        `INSERT INTO firm_fee_structures
           (\`firmId\`, \`transactionType\`, \`minValue\`, \`maxValue\`, \`legalFee\`,
            \`searchFee\`, \`antiMoneyLaunderingFee\`, \`electronicTransferFee\`, \`officialCopiesFee\`,
            \`leaseholdSupplement\`, \`newBuildSupplement\`, \`sharedOwnershipSupplement\`, \`giftedDepositSupplement\`,
            \`platformCommission\`, \`isActive\`)
         VALUES (?, 'sale_purchase', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1)`,
        [
          firmId, band.minValue, band.maxValue, legalFee,
          PURCHASE_DISBURSEMENTS.searchFee,
          PURCHASE_DISBURSEMENTS.antiMoneyLaunderingFee,
          PURCHASE_DISBURSEMENTS.electronicTransferFee,
          SALE_DISBURSEMENTS.officialCopiesFee,
          Math.round(PURCHASE_SUPPLEMENTS.leaseholdSupplement * m),
          Math.round(PURCHASE_SUPPLEMENTS.newBuildSupplement * m),
          Math.round(PURCHASE_SUPPLEMENTS.sharedOwnershipSupplement * m),
          Math.round(PURCHASE_SUPPLEMENTS.giftedDepositSupplement * m),
        ]
      );
    }

    console.log(`  → Inserted fee bands for ${firm.name}`);
  }

  console.log('\nSeed complete! 5 firms and all fee bands inserted.');
  await conn.end();
}

seed().catch(e => { console.error(e); process.exit(1); });
