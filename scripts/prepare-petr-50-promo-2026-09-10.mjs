import "dotenv/config";
import fs from "node:fs/promises";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(`
  WITH petr AS (
    SELECT id
    FROM leads
    WHERE TRIM(firstName) = 'Petr' AND TRIM(lastName) = 'Vasilyev'
    ORDER BY id DESC
    LIMIT 1
  )
  SELECT id, firstName, lastName, email, referenceNumber, status, createdAt
  FROM leads
  WHERE id <= (SELECT id FROM petr)
  ORDER BY id DESC
  LIMIT 50
`);

const protectedNames = new Set(["claire cheeseman", "jane smith", "b bbbb"]);
const junkPatterns = [
  /^test@/i,
  /^jane\.smith@gmail\.com$/i,
  /^brandon@gmail\.com$/i,
  /^ghgdhgdhgdhgdhgdh@gmail\.com$/i,
];

const seenEmails = new Set();
const recipients = [];
const excluded = [];

for (const row of rows) {
  const firstName = String(row.firstName ?? "").trim();
  const lastName = String(row.lastName ?? "").trim();
  const fullName = `${firstName} ${lastName}`.replace(/\s+/g, " ").trim();
  const email = String(row.email ?? "").trim().toLowerCase();
  const status = String(row.status ?? "").trim().toLowerCase();
  let reason = "";

  if (status === "instructed") reason = "instructed";
  else if (protectedNames.has(fullName.toLowerCase())) reason = "protected contact";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) reason = "invalid email";
  else if (junkPatterns.some((pattern) => pattern.test(email)) || /^(test|john do)$/i.test(fullName)) reason = "test or junk entry";
  else if (seenEmails.has(email)) reason = "duplicate email in batch";

  if (reason) {
    excluded.push({ fullName, email, referenceNumber: row.referenceNumber, status, reason });
    continue;
  }

  seenEmails.add(email);
  recipients.push({
    firstName: firstName || "there",
    lastName,
    fullName,
    email,
    referenceNumber: row.referenceNumber,
    status,
  });
}

const output = {
  campaign: "petr-vasilyev-downward-50-20pct-2026-09-10",
  generatedAt: new Date().toISOString(),
  range: {
    start: rows[0]?.referenceNumber ?? null,
    end: rows.at(-1)?.referenceNumber ?? null,
    sourceRows: rows.length,
  },
  recipients,
  excluded,
};

await fs.writeFile("/tmp/petr-50-promo-selection.json", JSON.stringify(output, null, 2));
console.log(JSON.stringify({
  sourceRows: output.range.sourceRows,
  recipients: recipients.length,
  excluded,
  firstReference: output.range.start,
  lastReference: output.range.end,
}, null, 2));

await connection.end();
