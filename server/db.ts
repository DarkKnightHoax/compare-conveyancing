import { eq, desc, count, gte, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql2 from "mysql2";
import {
  InsertUser, users,
  lawFirms, InsertLawFirm,
  leads, InsertLead,
  callbackRequests, InsertCallbackRequest,
  instructRequests, InsertInstructRequest,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const pool = mysql2.createPool({
        uri: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectTimeout: 15000,
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0,
      });
      _db = drizzle(pool);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── USERS ────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── LAW FIRMS ────────────────────────────────────────────────────────────────
export async function getAllLawFirms() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lawFirms).where(eq(lawFirms.isActive, true)).orderBy(desc(lawFirms.rating));
}

export async function getAllLawFirmsAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lawFirms).orderBy(desc(lawFirms.createdAt));
}

export async function createLawFirm(data: InsertLawFirm) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(lawFirms).values(data);
}

export async function updateLawFirm(id: number, data: Partial<InsertLawFirm>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(lawFirms).set(data).where(eq(lawFirms.id, id));
}

export async function deleteLawFirm(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(lawFirms).set({ isActive: false }).where(eq(lawFirms.id, id));
}

// ─── LEADS ────────────────────────────────────────────────────────────────────
export async function createLead(data: InsertLead) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Generate unique reference number: CCM-YYYY-NNNNN
  const year = new Date().getFullYear();
  const countResult = await db.select().from(leads);
  const seq = String(countResult.length + 1).padStart(5, '0');
  const referenceNumber = `CCM-${year}-${seq}`;
  const result = await db.insert(leads).values({ ...data, referenceNumber });
  const leadId = (result[0] as any).insertId as number;
  return { id: leadId, referenceNumber };
}

export async function getAllLeads(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leads).orderBy(desc(leads.createdAt)).limit(limit).offset(offset);
}

export async function getLeadById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return result[0];
}
export async function getLeadByRef(referenceNumber: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(leads).where(eq(leads.referenceNumber, referenceNumber)).limit(1);
  return result[0];
}

export async function updateLeadStatus(id: number, status: "new" | "contacted" | "instructed" | "lost", notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: Partial<InsertLead> = { status };
  if (notes !== undefined) updateData.adminNotes = notes;
  await db.update(leads).set(updateData).where(eq(leads.id, id));
}

export async function updateLeadContactStatus(id: number, field: "contactedViaEmail" | "contactedViaPhone", value: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(leads).set({ [field]: value }).where(eq(leads.id, id));
}

export async function updateLeadSnapshot(referenceNumber: string, quoteSnapshot: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(leads).set({ quoteSnapshot }).where(eq(leads.referenceNumber, referenceNumber));
}

export async function deleteLeadById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(leads).where(eq(leads.id, id));
}

export async function getLeadsStats() {
  const db = await getDb();
  if (!db) return { total: 0, new: 0, contacted: 0, instructed: 0, lost: 0, todayCount: 0, weekCount: 0 };
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);
  const [totalResult, newResult, contactedResult, instructedResult, lostResult, todayResult, weekResult] = await Promise.all([
    db.select({ count: count() }).from(leads),
    db.select({ count: count() }).from(leads).where(eq(leads.status, "new")),
    db.select({ count: count() }).from(leads).where(eq(leads.status, "contacted")),
    db.select({ count: count() }).from(leads).where(eq(leads.status, "instructed")),
    db.select({ count: count() }).from(leads).where(eq(leads.status, "lost")),
    db.select({ count: count() }).from(leads).where(gte(leads.createdAt, today)),
    db.select({ count: count() }).from(leads).where(gte(leads.createdAt, weekAgo)),
  ]);
  return {
    total: totalResult[0]?.count ?? 0,
    new: newResult[0]?.count ?? 0,
    contacted: contactedResult[0]?.count ?? 0,
    instructed: instructedResult[0]?.count ?? 0,
    lost: lostResult[0]?.count ?? 0,
    todayCount: todayResult[0]?.count ?? 0,
    weekCount: weekResult[0]?.count ?? 0,
  };
}

// ─── CALLBACK REQUESTS ────────────────────────────────────────────────────────
export async function createCallbackRequest(data: InsertCallbackRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(callbackRequests).values(data);
  return (result[0] as any).insertId as number;
}

export async function getAllCallbacks(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(callbackRequests).orderBy(desc(callbackRequests.createdAt)).limit(limit).offset(offset);
}

export async function updateCallbackStatus(id: number, status: "pending" | "called" | "no_answer" | "resolved", assignedTo?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: Partial<InsertCallbackRequest> = { status };
  if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
  await db.update(callbackRequests).set(updateData).where(eq(callbackRequests.id, id));
}

export async function getPendingCallbacksCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: count() }).from(callbackRequests).where(eq(callbackRequests.status, "pending"));
  return result[0]?.count ?? 0;
}

// ─── INSTRUCT REQUESTS ────────────────────────────────────────────────────────
export async function createInstructRequest(data: InsertInstructRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(instructRequests).values(data);
  return (result[0] as any).insertId as number;
}

export async function getAllInstructRequests(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(instructRequests).orderBy(desc(instructRequests.createdAt)).limit(limit).offset(offset);
}

export async function updateInstructStatus(id: number, status: "submitted" | "confirmed" | "in_progress" | "completed" | "cancelled") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(instructRequests).set({ status }).where(eq(instructRequests.id, id));
}

// ─── FIRM FEE STRUCTURES ──────────────────────────────────────────────────────
import {
  firmFeeStructures, InsertFirmFeeStructure,
  firmNotes, InsertFirmNote,
  firmLenderPanels,
} from "../drizzle/schema";

export async function getFeeStructuresForFirm(firmId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(firmFeeStructures)
    .where(eq(firmFeeStructures.firmId, firmId))
    .orderBy(firmFeeStructures.transactionType, firmFeeStructures.minValue);
}

export async function getAllFeeStructures() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(firmFeeStructures)
    .orderBy(firmFeeStructures.firmId, firmFeeStructures.transactionType, firmFeeStructures.minValue);
}

export async function upsertFeeStructure(data: InsertFirmFeeStructure) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (data.id) {
    const { id, ...rest } = data as any;
    await db.update(firmFeeStructures).set(rest).where(eq(firmFeeStructures.id, id));
    return id as number;
  }
  const result = await db.insert(firmFeeStructures).values(data);
  return (result[0] as any).insertId as number;
}

export async function deleteFeeStructure(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(firmFeeStructures).where(eq(firmFeeStructures.id, id));
}

// ─── FIRM NOTES ───────────────────────────────────────────────────────────────
export async function getNotesForFirm(firmId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(firmNotes)
    .where(eq(firmNotes.firmId, firmId))
    .orderBy(desc(firmNotes.createdAt));
}

export async function createFirmNote(data: InsertFirmNote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(firmNotes).values(data);
  return (result[0] as any).insertId as number;
}

export async function deleteFirmNote(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(firmNotes).where(eq(firmNotes.id, id));
}

// ─── INVESTOR REVENUE STATS ───────────────────────────────────────────────────
export async function getInvestorStats() {
  const db = await getDb();
  if (!db) return { totalFirms: 0, activeFirms: 0, totalLeads: 0, totalInstructions: 0, totalCommissionEstimate: 0 };
  const [firmsTotal, firmsActive, leadsTotal, instructionsTotal] = await Promise.all([
    db.select({ count: count() }).from(lawFirms),
    db.select({ count: count() }).from(lawFirms).where(eq(lawFirms.isActive, true)),
    db.select({ count: count() }).from(leads),
    db.select({ count: count() }).from(instructRequests).where(eq(instructRequests.status, "completed")),
  ]);
  return {
    totalFirms: firmsTotal[0]?.count ?? 0,
    activeFirms: firmsActive[0]?.count ?? 0,
    totalLeads: leadsTotal[0]?.count ?? 0,
    totalInstructions: instructionsTotal[0]?.count ?? 0,
  };
}

// ─── LIVE QUOTE CALCULATION ───────────────────────────────────────────────────
// Reads fee structures from the database and computes quotes for all active firms.
// This is the server-side equivalent of the static feeEngine.ts on the frontend.

export interface LiveQuoteInput {
  transactionType: 'purchase' | 'sale' | 'sale_purchase' | 'remortgage';
  propertyValue: number; // For sale_purchase: this is the PURCHASE price
  tenure: 'freehold' | 'leasehold'; // For sale_purchase: this is the PURCHASE tenure
  // For sale_purchase: separate sale-side values
  salePropertyValue?: number;
  saleTenure?: 'freehold' | 'leasehold';
  hasMortgage: boolean;
  isFirstTimeBuyer: boolean;
  isNewBuild: boolean;
  isSharedOwnership: boolean;
  hasGiftedDeposit: boolean;
  giftCount?: number;
  isBuyToLet: boolean;
  isSecondHome: boolean;
  hasMortgageOnProperty?: boolean;
  newMortgageValue?: number;
  buyerCount?: number;
  mortgageLender?: string;
}

export interface LegBreakdown {
  label: string;
  propertyValue: number;
  legalFee: number;
  supplements: { name: string; price: number }[];
  disbursements: { name: string; price: number; includesVat: boolean }[];
  totalExVat: number;
  vat: number;
  totalIncVat: number;
  sdlt: number;
  landRegistryFee: number;
  fileOpeningFee: number;
  grandTotal: number;
  subtotal: number;
}

export interface LiveQuoteResult {
  firmId: number;
  firmName: string;
  firmLocation: string;
  logoUrl: string | null;
  rating: number;
  reviewCount: number;
  sraNumber: string;
  regulated: 'SRA' | 'CLC';
  speciality: string;
  yearsEstablished: number;
  accreditations: string[];
  legalFee: number;
  supplements: { name: string; price: number }[];
  disbursements: { name: string; price: number; includesVat: boolean }[];
  totalExVat: number;
  vat: number;
  totalIncVat: number;
  sdlt: number;
  landRegistryFee: number;
  grandTotal: number;
  fileOpeningFee: number;
  // For sale_purchase: separate per-leg breakdowns
  purchaseBreakdown?: LegBreakdown;
  saleBreakdown?: LegBreakdown;
}

/**
 * SDLT engine — rates effective 1 April 2025 (reversion to pre-Sep-2022 thresholds)
 * Mirrors the logic at https://www.stampdutycalculator.org.uk/
 *
 * Standard bands (from 1 Apr 2025):
 *   £0–£125k        → 0%
 *   £125k–£250k     → 2%
 *   £250k–£925k     → 5%
 *   £925k–£1.5m     → 10%
 *   Over £1.5m      → 12%
 *
 * Additional property surcharge (buy-to-let / second home): +5% on every band
 *   (surcharge increased from 3% to 5% on 31 Oct 2024)
 *   Exception: purchases under £40k attract 0% surcharge.
 *
 * First-time buyer relief (from 1 Apr 2025):
 *   £0–£300k        → 0%
 *   £300k–£500k     → 5% on the portion above £300k
 *   Over £500k      → full standard rates apply (no relief)
 *
 * New build: same rate bands as standard / FTB — no separate rate schedule.
 * The isNewBuild flag affects the FTB threshold (still £300k/£500k).
 */
function calcSDLT(
  value: number,
  isFirstTimeBuyer: boolean,
  isSecondHome: boolean,
  isBuyToLet: boolean,
): number {
  if (value <= 0) return 0;

  const isAdditional = isSecondHome || isBuyToLet;

  // Additional property — surcharge of 5% on top of standard rates.
  // Purchases under £40k: 0% (no surcharge).
  if (isAdditional) {
    if (value < 40000) return 0;
    // Apply standard bands + 5% surcharge on each band
    const bands = [
      { from: 0,       to: 125000,   rate: 0.00 + 0.05 },
      { from: 125000,  to: 250000,   rate: 0.02 + 0.05 },
      { from: 250000,  to: 925000,   rate: 0.05 + 0.05 },
      { from: 925000,  to: 1500000,  rate: 0.10 + 0.05 },
      { from: 1500000, to: Infinity, rate: 0.12 + 0.05 },
    ];
    let tax = 0;
    for (const band of bands) {
      if (value > band.from) {
        tax += (Math.min(value, band.to) - band.from) * band.rate;
      }
    }
    return Math.round(tax);
  }

  // First-time buyer relief
  if (isFirstTimeBuyer) {
    if (value <= 300000) return 0;
    if (value <= 500000) {
      // 0% on first £300k, 5% on £300k–£500k portion
      return Math.round((value - 300000) * 0.05);
    }
    // Over £500k: FTB relief lost entirely — standard rates apply
  }

  // Standard residential rates (1 Apr 2025)
  const bands = [
    { from: 0,       to: 125000,   rate: 0.00 },
    { from: 125000,  to: 250000,   rate: 0.02 },
    { from: 250000,  to: 925000,   rate: 0.05 },
    { from: 925000,  to: 1500000,  rate: 0.10 },
    { from: 1500000, to: Infinity, rate: 0.12 },
  ];
  let tax = 0;
  for (const band of bands) {
    if (value > band.from) {
      tax += (Math.min(value, band.to) - band.from) * band.rate;
    }
  }
  return Math.round(tax);
}

// Land Registry Scale 1 fees — "Apply using the portal / Business Gateway" column
// (transfers or surrenders affecting the whole of a registered title)
function calcLandRegistry(value: number): number {
  if (value <= 80000) return 20;
  if (value <= 100000) return 40;
  if (value <= 200000) return 100;
  if (value <= 500000) return 150;
  if (value <= 1000000) return 295;
  return 500;
}

// ── Helper: compute one leg's fees for a given property value + tenure ──
export function computeLeg(
  band: any,
  legType: 'purchase' | 'sale',
  legValue: number,
  legTenure: 'freehold' | 'leasehold',
  input: LiveQuoteInput,
): LegBreakdown {
  // For sale leg of sale_purchase, use saleLegalFee if set; otherwise fall back to legalFee
  const legalFee = legType === 'sale' && Number(band.saleLegalFee) > 0
    ? Number(band.saleLegalFee)
    : Number(band.legalFee);
  const supplements: { name: string; price: number }[] = [];
  const disbursements: { name: string; price: number; includesVat: boolean }[] = [];
  const numBuyers = Math.max(1, input.buyerCount ?? 1);

  if (legType === 'purchase') {
    if (legTenure === 'leasehold' && Number(band.leaseholdSupplement) > 0)
      supplements.push({ name: 'Leasehold Supplement', price: Number(band.leaseholdSupplement) });
    if (input.isNewBuild && Number(band.newBuildSupplement) > 0)
      supplements.push({ name: 'New Build Supplement', price: Number(band.newBuildSupplement) });
    if (input.isSharedOwnership && Number(band.sharedOwnershipSupplement) > 0)
      supplements.push({ name: 'Shared Ownership', price: Number(band.sharedOwnershipSupplement) });
    if (input.hasGiftedDeposit && Number(band.giftedDepositSupplement) > 0) {
      const giftCount = Math.max(1, input.giftCount ?? 1);
      const giftPrice = Number(band.giftedDepositSupplement) * giftCount;
      supplements.push({ name: giftCount > 1 ? `Gifted Deposit (x${giftCount})` : 'Gifted Deposit', price: giftPrice });
    }
    if (input.hasMortgage)
      supplements.push({ name: 'Mortgage / Re-mortgage', price: 100 });
    if (input.isBuyToLet)
      supplements.push({ name: 'Buy to Let Supplement', price: 99 });
    if (input.isSecondHome)
      supplements.push({ name: 'Second Home Supplement', price: 99 });
    // AML
    if (Number(band.antiMoneyLaunderingFee) > 0) {
      const amlPerPerson = Number(band.antiMoneyLaunderingFee);
      disbursements.push({
        name: numBuyers > 1 ? `Anti-Money Laundering (AML) Check × ${numBuyers} purchasers` : 'Anti-Money Laundering (AML) Check',
        price: amlPerPerson * numBuyers,
        includesVat: true,
      });
    }
    // Search Pack is always £349 (fixed across all firms)
    disbursements.push({ name: 'Search Pack (Local, Drainage & Environmental)', price: 349, includesVat: true });
    if (Number(band.officialCopiesFee) > 0)
      disbursements.push({ name: 'Official Copies (Title Register & Plan)', price: Number(band.officialCopiesFee), includesVat: true });
    if (Number(band.electronicTransferFee) > 0)
      disbursements.push({ name: 'Electronic Transfer Fee (CHAPS)', price: Number(band.electronicTransferFee), includesVat: true });
    disbursements.push({ name: 'Land Registry Searches', price: 3, includesVat: true });
    disbursements.push({ name: numBuyers > 1 ? `Bankruptcy Search (x${numBuyers})` : 'Bankruptcy Search', price: 4 * numBuyers, includesVat: true });
  } else {
    // sale leg — use saleLeaseholdSupplement (£149) instead of purchase leaseholdSupplement (£249)
    const saleLeaseholdFee = Number(band.saleLeaseholdSupplement ?? 0) > 0
      ? Number(band.saleLeaseholdSupplement)
      : Number(band.leaseholdSupplement);
    if (legTenure === 'leasehold' && saleLeaseholdFee > 0)
      supplements.push({ name: 'Leasehold Supplement', price: saleLeaseholdFee });
    if (input.hasMortgageOnProperty)
      supplements.push({ name: 'Mortgage Redemption', price: 100 });
    // AML for sale
    if (Number(band.antiMoneyLaunderingFee) > 0) {
      disbursements.push({ name: 'Anti-Money Laundering (AML) Check', price: Number(band.antiMoneyLaunderingFee), includesVat: true });
    }
    if (Number(band.officialCopiesFee) > 0)
      disbursements.push({ name: 'Official Copies (Title Register & Plan)', price: Number(band.officialCopiesFee), includesVat: true });
    if (Number(band.electronicTransferFee) > 0)
      disbursements.push({ name: 'Electronic Transfer Fee (CHAPS)', price: Number(band.electronicTransferFee), includesVat: true });
  }

  const supplementTotal = supplements.reduce((s, x) => s + x.price, 0);
  const disbursementTotal = disbursements.reduce((s, x) => s + x.price, 0);
  const totalExVat = legalFee + supplementTotal;
  const vat = Math.round(totalExVat * 0.20);
  const totalIncVat = totalExVat + vat;
  const sdlt = legType === 'purchase' ? calcSDLT(legValue, input.isFirstTimeBuyer, input.isSecondHome, input.isBuyToLet) : 0;
  const landRegistryFee = legType === 'purchase' ? calcLandRegistry(legValue) : 0;
  const fileOpeningFee = Number(band.fileOpeningFee ?? 0);
  const subtotal = totalIncVat + disbursementTotal + sdlt + landRegistryFee;
  const grandTotal = subtotal;

  return { label: legType === 'purchase' ? 'Purchase' : 'Sale', propertyValue: legValue, legalFee, supplements, disbursements, totalExVat, vat, totalIncVat, sdlt, landRegistryFee, fileOpeningFee, grandTotal, subtotal };
}

export async function calculateLiveQuotes(input: LiveQuoteInput): Promise<LiveQuoteResult[]> {
  const db = await getDb();
  if (!db) return [];

  // Fetch all active firms with their fee structures for the given transaction type
  let firms = await db.select().from(lawFirms).where(eq(lawFirms.isActive, true));
  if (firms.length === 0) return [];

  // Lender panel filtering removed — all 4 firms always show regardless of lender selected

  const feeRows = await db.select().from(firmFeeStructures)
    .where(and(
      eq(firmFeeStructures.transactionType, input.transactionType),
      eq(firmFeeStructures.isActive, true)
    ));

  const { transactionType, propertyValue } = input;
  const value = propertyValue || 0;

  const results: LiveQuoteResult[] = [];

  for (const firm of firms) {
    // Exclude TQ Law only for new build (leasehold purchase is now allowed)
    const isTQLaw = firm.name.toLowerCase().includes('tq law');
    if (isTQLaw && input.isNewBuild) continue;

    // Find the matching fee band for this firm + property value
    type FeeRow = typeof feeRows[number];
    const band: FeeRow | undefined = feeRows.find((r: FeeRow) =>
      r.firmId === firm.id &&
      value >= r.minValue &&
      value <= r.maxValue
    ) || feeRows.filter((r: FeeRow) => r.firmId === firm.id).sort((a: FeeRow, b: FeeRow) => b.minValue - a.minValue)[0];

    if (!band) continue; // No fee band configured for this firm

    let legalFee: number;
    let supplements: { name: string; price: number }[];
    let disbursements: { name: string; price: number; includesVat: boolean }[];
    let totalExVat: number, vat: number, totalIncVat: number, sdlt: number, landRegistryFee: number, grandTotal: number;
    let purchaseBreakdown: LegBreakdown | undefined;
    let saleBreakdown: LegBreakdown | undefined;
    const fileOpeningFeeAmount = Number(band.fileOpeningFee) || 0;
    const numBuyers = Math.max(1, input.buyerCount ?? 1);

    if (transactionType === 'sale_purchase') {
      // ── SALE_PURCHASE: compute each leg separately ──
      const purchaseValue = value; // propertyValue = purchase price
      const purchaseTenure = input.tenure;
      const saleValue = input.salePropertyValue || value; // fallback to purchase price if not provided
      const saleTenure = input.saleTenure || 'freehold';

      // Find sale band for this firm (sale fee structures)
      // For sale_purchase, we use the same band (sale_purchase type) for both legs
      purchaseBreakdown = computeLeg(band, 'purchase', purchaseValue, purchaseTenure, input);
      saleBreakdown = computeLeg(band, 'sale', saleValue, saleTenure, input);

      // Combined totals
      legalFee = purchaseBreakdown.legalFee + saleBreakdown.legalFee;
      supplements = [
        ...purchaseBreakdown.supplements.map(s => ({ ...s, name: `[Purchase] ${s.name}` })),
        ...saleBreakdown.supplements.map(s => ({ ...s, name: `[Sale] ${s.name}` })),
      ];
      disbursements = [
        ...purchaseBreakdown.disbursements.map(d => ({ ...d, name: `[Purchase] ${d.name}` })),
        ...saleBreakdown.disbursements.map(d => ({ ...d, name: `[Sale] ${d.name}` })),
      ];
      totalExVat = purchaseBreakdown.totalExVat + saleBreakdown.totalExVat;
      vat = purchaseBreakdown.vat + saleBreakdown.vat;
      totalIncVat = purchaseBreakdown.totalIncVat + saleBreakdown.totalIncVat;
      sdlt = purchaseBreakdown.sdlt;
      landRegistryFee = purchaseBreakdown.landRegistryFee;
      grandTotal = purchaseBreakdown.subtotal + saleBreakdown.subtotal;
    } else {
      // ── SINGLE LEG (purchase, sale, remortgage) ──
      supplements = [];
      disbursements = [];

      if (transactionType === 'purchase' || transactionType === 'remortgage') {
        if (input.tenure === 'leasehold' && Number(band.leaseholdSupplement) > 0)
          supplements.push({ name: 'Leasehold Supplement', price: Number(band.leaseholdSupplement) });
        if (input.isNewBuild && Number(band.newBuildSupplement) > 0)
          supplements.push({ name: 'New Build Supplement', price: Number(band.newBuildSupplement) });
        if (input.isSharedOwnership && Number(band.sharedOwnershipSupplement) > 0)
          supplements.push({ name: 'Shared Ownership', price: Number(band.sharedOwnershipSupplement) });
        if (input.hasGiftedDeposit && Number(band.giftedDepositSupplement) > 0) {
          const giftCount = Math.max(1, input.giftCount ?? 1);
          const giftPrice = Number(band.giftedDepositSupplement) * giftCount;
          supplements.push({ name: giftCount > 1 ? `Gifted Deposit (x${giftCount})` : 'Gifted Deposit', price: giftPrice });
        }
        if (input.hasMortgage)
          supplements.push({ name: 'Mortgage / Re-mortgage', price: 234 });
        if (input.isBuyToLet)
          supplements.push({ name: 'Buy to Let Supplement', price: 99 });
        if (input.isSecondHome)
          supplements.push({ name: 'Second Home Supplement', price: 99 });
      }
      if (transactionType === 'sale') {
        // sale-only: use saleLeaseholdSupplement (£149)
        const saleLeaseholdFee = Number(band.saleLeaseholdSupplement ?? 0) > 0
          ? Number(band.saleLeaseholdSupplement)
          : Number(band.leaseholdSupplement);
        if (input.tenure === 'leasehold' && saleLeaseholdFee > 0)
          supplements.push({ name: 'Leasehold Supplement', price: saleLeaseholdFee });
        if (input.hasMortgageOnProperty)
          supplements.push({ name: 'Mortgage Redemption', price: 100 });
      }

      if (Number(band.antiMoneyLaunderingFee) > 0) {
        const amlPerPerson = Number(band.antiMoneyLaunderingFee);
        disbursements.push({
          name: numBuyers > 1 ? `Anti-Money Laundering (AML) Check × ${numBuyers} purchasers` : 'Anti-Money Laundering (AML) Check',
          price: amlPerPerson * numBuyers,
          includesVat: true,
        });
      }
      if (transactionType === 'purchase') {
        // Search Pack is always £349 (fixed across all firms)
        disbursements.push({ name: 'Search Pack (Local, Drainage & Environmental)', price: 349, includesVat: true });
      }
      if (Number(band.officialCopiesFee) > 0)
        disbursements.push({ name: 'Official Copies (Title Register & Plan)', price: Number(band.officialCopiesFee), includesVat: true });
      if (Number(band.electronicTransferFee) > 0)
        disbursements.push({ name: 'Electronic Transfer Fee (CHAPS)', price: Number(band.electronicTransferFee), includesVat: true });
      if (transactionType === 'purchase') {
        disbursements.push({ name: 'Land Registry Searches', price: 3, includesVat: true });
        disbursements.push({ name: numBuyers > 1 ? `Bankruptcy Search (x${numBuyers})` : 'Bankruptcy Search', price: 4 * numBuyers, includesVat: true });
      }

      legalFee = Number(band.legalFee);
      const supplementTotal = supplements.reduce((s, x) => s + x.price, 0);
      const disbursementTotal = disbursements.reduce((s, x) => s + x.price, 0);
      totalExVat = legalFee + supplementTotal;
      vat = Math.round(totalExVat * 0.20);
      totalIncVat = totalExVat + vat;
      sdlt = transactionType === 'purchase' ? calcSDLT(value, input.isFirstTimeBuyer, input.isSecondHome, input.isBuyToLet) : 0;
      landRegistryFee = transactionType === 'purchase' ? calcLandRegistry(value) : 0;
      grandTotal = totalIncVat + disbursementTotal + sdlt + landRegistryFee;
    }

    let parsedAccreditations: string[] = [];
    try { parsedAccreditations = firm.accreditations ? JSON.parse(firm.accreditations) : []; } catch { /* ignore */ }

    results.push({
      firmId: firm.id,
      firmName: firm.name,
      firmLocation: firm.location ?? '',
      logoUrl: firm.logoUrl ?? null,
      rating: Number(firm.rating),
      reviewCount: firm.reviewCount ?? 0,
      sraNumber: firm.sraNumber ?? '',
      regulated: (firm.regulatoryBody ?? 'SRA') as 'SRA' | 'CLC',
      speciality: firm.speciality ?? '',
      yearsEstablished: firm.yearsEstablished ?? 0,
      accreditations: parsedAccreditations,
      legalFee,
      supplements,
      disbursements,
      fileOpeningFee: fileOpeningFeeAmount,
      totalExVat,
      vat,
      totalIncVat,
      sdlt,
      landRegistryFee,
      grandTotal,
      purchaseBreakdown,
      saleBreakdown,
    });
  }

  // Sort by grandTotal ascending
  return results.sort((a, b) => a.grandTotal - b.grandTotal);
}
