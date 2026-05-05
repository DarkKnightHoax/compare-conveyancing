import { createConnection } from 'mysql2/promise';
import { config } from 'dotenv';
config();

const conn = await createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute(
  `SELECT id, first_name, last_name, email, phone, transaction_type, property_value, created_at 
   FROM leads 
   ORDER BY created_at DESC 
   LIMIT 50`
);
console.log(`Total recent leads found: ${rows.length}`);
console.log('');
rows.forEach(r => {
  console.log(`[${r.id}] ${r.first_name} ${r.last_name} | ${r.email} | ${r.transaction_type} | £${Number(r.property_value).toLocaleString()} | ${new Date(r.created_at).toISOString()}`);
});
await conn.end();
