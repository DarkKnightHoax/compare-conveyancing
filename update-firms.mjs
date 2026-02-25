import 'dotenv/config';
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Land Registry fees — "Apply by post" column from official PDF
function getLandRegFee(value) {
  if (value <= 80000) return 45;
  if (value <= 100000) return 95;
  if (value <= 200000) return 230;
  if (value <= 500000) return 330;
  if (value <= 1000000) return 655;
  return 1105;
}

try {
  // Insert fee structures for TQ Law (id=30006)
  const tqFees = [
    // Purchase
    { txType: 'purchase', min: 0,       max: 100000,    legal: 450,  lr: getLandRegFee(80000) },
    { txType: 'purchase', min: 100001,  max: 300000,    legal: 695,  lr: getLandRegFee(200000) },
    { txType: 'purchase', min: 300001,  max: 600000,    legal: 895,  lr: getLandRegFee(500000) },
    { txType: 'purchase', min: 600001,  max: 1000000,   legal: 1195, lr: getLandRegFee(1000000) },
    { txType: 'purchase', min: 1000001, max: 999999999, legal: 1695, lr: getLandRegFee(2000000) },
    // Sale
    { txType: 'sale', min: 0,       max: 100000,    legal: 395,  lr: 0 },
    { txType: 'sale', min: 100001,  max: 300000,    legal: 595,  lr: 0 },
    { txType: 'sale', min: 300001,  max: 600000,    legal: 795,  lr: 0 },
    { txType: 'sale', min: 600001,  max: 1000000,   legal: 995,  lr: 0 },
    { txType: 'sale', min: 1000001, max: 999999999, legal: 1395, lr: 0 },
    // Remortgage
    { txType: 'remortgage', min: 0,       max: 300000,    legal: 350, lr: 0 },
    { txType: 'remortgage', min: 300001,  max: 600000,    legal: 450, lr: 0 },
    { txType: 'remortgage', min: 600001,  max: 999999999, legal: 595, lr: 0 },
    // Sale & Purchase
    { txType: 'sale_purchase', min: 0,       max: 300000,    legal: 995,  lr: getLandRegFee(200000) },
    { txType: 'sale_purchase', min: 300001,  max: 600000,    legal: 1295, lr: getLandRegFee(500000) },
    { txType: 'sale_purchase', min: 600001,  max: 999999999, legal: 1695, lr: getLandRegFee(1000000) },
  ];

  for (const fee of tqFees) {
    await conn.execute(
      `INSERT INTO firm_fee_structures 
        (\`firmId\`, \`transactionType\`, \`minValue\`, \`maxValue\`, \`legalFee\`, \`searchFee\`, \`landRegistryFee\`, \`electronicTransferFee\`, \`bankTransferFee\`, \`antiMoneyLaunderingFee\`, \`officialCopiesFee\`, \`platformCommission\`, \`isActive\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [30006, fee.txType, fee.min, fee.max, fee.legal, 300, fee.lr, 35, 35, 30, 25, 75]
    );
  }
  console.log(`Inserted ${tqFees.length} fee bands for TQ Law`);

  // Also update ALL existing fee structures to use correct Land Registry fees (Apply by post column)
  // Update purchase bands for all firms
  const lrUpdates = [
    { min: 0,       max: 100000,    lr: 45 },
    { min: 100001,  max: 300000,    lr: 230 },
    { min: 300001,  max: 600000,    lr: 330 },
    { min: 600001,  max: 1000000,   lr: 655 },
    { min: 1000001, max: 999999999, lr: 1105 },
  ];

  for (const band of lrUpdates) {
    await conn.execute(
      `UPDATE firm_fee_structures SET \`landRegistryFee\` = ? WHERE \`transactionType\` = 'purchase' AND \`minValue\` = ? AND \`maxValue\` = ?`,
      [band.lr, band.min, band.max]
    );
    await conn.execute(
      `UPDATE firm_fee_structures SET \`landRegistryFee\` = ? WHERE \`transactionType\` = 'sale_purchase' AND \`minValue\` = ? AND \`maxValue\` = ?`,
      [band.lr, band.min, band.max]
    );
  }
  console.log('Updated Land Registry fees to "Apply by post" values');

  console.log('\nDone! Current firms:');
  const [firms] = await conn.execute('SELECT id, name FROM law_firms ORDER BY id');
  console.log(JSON.stringify(firms, null, 2));

  const [feeCount] = await conn.execute('SELECT COUNT(*) as cnt FROM firm_fee_structures');
  console.log('Total fee bands:', feeCount[0].cnt);

} catch (err) {
  console.error('Error:', err.message);
} finally {
  await conn.end();
}
