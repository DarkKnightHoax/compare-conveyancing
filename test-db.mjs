import mysql from 'mysql2/promise';

const url = process.env.DATABASE_URL;
console.log('DB URL exists:', !!url);
if (url) {
  try {
    const conn = await mysql.createConnection(url);
    const [rows] = await conn.query('SELECT COUNT(*) as cnt FROM law_firms');
    console.log('law_firms count:', rows[0].cnt);
    const [feeRows] = await conn.query('SELECT COUNT(*) as cnt FROM firm_fee_structures');
    console.log('firm_fee_structures count:', feeRows[0].cnt);
    await conn.end();
  } catch (e) {
    console.error('DB error:', e.message);
  }
} else {
  console.log('No DATABASE_URL found');
}
