import 'dotenv/config';
import mysql from 'mysql2/promise';
import { writeFileSync } from 'node:fs';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await connection.execute(`
  SELECT id, referenceNumber, firstName, lastName, email, status, createdAt
  FROM leads
  ORDER BY id DESC
  LIMIT 2
`);
await connection.end();
writeFileSync('/tmp/latest2leads.json', JSON.stringify(rows, null, 2));
console.log(JSON.stringify(rows, null, 2));
console.log('Saved to /tmp/latest2leads.json');
