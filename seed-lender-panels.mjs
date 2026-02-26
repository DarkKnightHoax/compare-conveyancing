/**
 * Seed firm_lender_panels table.
 *
 * - Burtons Solicitors (id 60001): only the 27 lenders from the
 *   "David J Foster & Co - London" column of the Excel panel spreadsheet.
 * - PCS Legal (30002), Easy Choice Conveyancing (30001), TQ Law (30006):
 *   the full standard lender list used in the wizard.
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// ── Burtons Solicitors panel (David J Foster & Co - London column) ─────────────
const BURTONS_LENDERS = [
  "Lloyds Banking Group",
  "Co-op Panel",
  "Atom Bank",
  "Better Homeownership",
  "Bluestone Mortgages",
  "Buckinghamshire Building Society",
  "Clydesdale Bank & Yorkshire Bank",
  "Cynergy Bank",
  "Danske Bank England & Wales",
  "Darlington Building Society",
  "Dudley Building Society",
  "Ecology Building Society",
  "Gen H",
  "Hanley Economic Building Society",
  "Harpenden Building Society",
  "Hinckley & Rugby Building Society",
  "HSBC UK",
  "LiveMore Capital",
  "Marsden Building Society",
  "Moda Mortgages",
  "Monmouthshire Building Society",
  "National Counties Building Society and Family Building Society",
  "Scottish Building Society",
  "Skipton Building Society",
  "Stafford Railway Building Society",
  "Tandem",
  "Tipton & Coseley Building Society",
];

// ── Full standard lender list (matches the wizard dropdown) ────────────────────
const STANDARD_LENDERS = [
  "Accord Mortgages",
  "Accord Buy to Let",
  "Aldermore",
  "Alliance & Leicester",
  "Allica Bank",
  "April Mortgages",
  "Atom Bank",
  "Bank of China",
  "Bank of Cyprus",
  "Bank of Ireland",
  "Bank of Scotland",
  "Barclays Bank UK PLC",
  "Barnsley Building Society",
  "Bluestone Mortgages",
  "Bradford & Bingley / Mortgage Express",
  "Britannia",
  "Buckinghamshire BS",
  "Cambridge BS",
  "Canada Life",
  "Chelsea BS",
  "CHL Mortgages",
  "Chorley BS",
  "Clydesdale & Yorkshire Bank",
  "Co-operative Bank",
  "Coventry BS",
  "Cumberland BS",
  "Cynergy Bank",
  "Danske Bank",
  "Darlington BS",
  "Digital BS",
  "Dudley BS",
  "Earl Shilton BS",
  "Ecology BS",
  "ESBS",
  "Family BS",
  "First Direct",
  "Fleet Mortgages",
  "Foundation Home Loans",
  "Furness BS",
  "Gatehouse Bank",
  "Generation Home Loans",
  "Godiva",
  "Habito",
  "Halifax",
  "Hanley Economic Building Society",
  "Help to Buy ISA",
  "Hinckley & Rugby BS",
  "Hodge Bank",
  "HSBC",
  "ING",
  "Intelligent Finance",
  "Ipswich BS",
  "ITL",
  "Kent Reliance",
  "Kensington",
  "Landmark Mortgages",
  "Leeds BS",
  "Leek United BS",
  "LiveMore Capital",
  "Lloyds Banking Group",
  "M&S Bank",
  "Mansfield BS",
  "Market Harborough BS",
  "Marsden BS",
  "Marks & Spencer",
  "Melton Mowbray BS",
  "Metro Bank",
  "Monmouthshire BS",
  "Mortgage Works UK",
  "MQUBE",
  "Mpowered",
  "National Counties BS",
  "Nationwide",
  "Natwest",
  "Natwest International",
  "Newbury BS",
  "NOMO",
  "Norwich & Peterborough",
  "Nottingham BS",
  "Pepper Money",
  "Perenna",
  "Platform Home Loans",
  "Portman BS",
  "Precise Mortgages",
  "Principality",
  "Royal Bank of Scotland",
  "Reliance Bank",
  "Saffron BS",
  "Sainsbury's Bank",
  "Santander",
  "Scottish Widows",
  "Skipton BS",
  "Smile",
  "Stafford Railway BS",
  "Suffolk BS",
  "Teachers BS",
  "Tesco Bank",
  "The Bank of East Asia",
  "The Hanley",
  "The Loughborough",
  "The Melton",
  "The Mortgage Lender",
  "Tipton & Coseley BS",
  "TSB",
  "Vernon",
  "Vida Homeloans",
  "Virgin Money",
  "West Bromwich BS",
  "Woolwich / Barclays",
  "Yorkshire BS",
  "Yorkshire Bank",
  "Other Lender",
];

const FIRM_PANELS = [
  { firmId: 30001, lenders: STANDARD_LENDERS }, // Easy Choice Conveyancing
  { firmId: 30002, lenders: STANDARD_LENDERS }, // PCS Legal
  { firmId: 30006, lenders: STANDARD_LENDERS }, // TQ Law
  { firmId: 60001, lenders: BURTONS_LENDERS },  // Burtons Solicitors
];

// Clear existing panel entries
await conn.query("DELETE FROM firm_lender_panels");
console.log("Cleared existing firm_lender_panels rows.");

let totalInserted = 0;
for (const { firmId, lenders } of FIRM_PANELS) {
  for (const lenderName of lenders) {
    await conn.query(
      "INSERT INTO firm_lender_panels (firmId, lenderName) VALUES (?, ?)",
      [firmId, lenderName]
    );
    totalInserted++;
  }
  console.log(`Seeded ${lenders.length} lenders for firmId ${firmId}`);
}

console.log(`Done — ${totalInserted} rows inserted.`);
await conn.end();
