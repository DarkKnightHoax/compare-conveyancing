import { eq, desc, count, gte, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
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
      _db = drizzle(process.env.DATABASE_URL);
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
  const result = await db.insert(leads).values(data);
  return (result[0] as any).insertId as number;
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

export async function updateLeadStatus(id: number, status: "new" | "contacted" | "instructed" | "lost", notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updateData: Partial<InsertLead> = { status };
  if (notes !== undefined) updateData.adminNotes = notes;
  await db.update(leads).set(updateData).where(eq(leads.id, id));
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
  propertyValue: number;
  tenure: 'freehold' | 'leasehold';
  hasMortgage: boolean;
  isFirstTimeBuyer: boolean;
  isNewBuild: boolean;
  isSharedOwnership: boolean;
  hasGiftedDeposit: boolean;
  isBuyToLet: boolean;
  isSecondHome: boolean;
  hasMortgageOnProperty?: boolean;
  newMortgageValue?: number;
  buyerCount?: number;
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

export async function calculateLiveQuotes(input: LiveQuoteInput): Promise<LiveQuoteResult[]> {
  const db = await getDb();
  if (!db) return [];

  // Fetch all active firms with their fee structures for the given transaction type
  const firms = await db.select().from(lawFirms).where(eq(lawFirms.isActive, true));
  if (firms.length === 0) return [];

  const feeRows = await db.select().from(firmFeeStructures)
    .where(and(
      eq(firmFeeStructures.transactionType, input.transactionType),
      eq(firmFeeStructures.isActive, true)
    ));

  const { transactionType, propertyValue } = input;
  const value = propertyValue || 0;

  const results: LiveQuoteResult[] = [];

  for (const firm of firms) {
    // Find the matching fee band for this firm + property value
    type FeeRow = typeof feeRows[number];
    const band: FeeRow | undefined = feeRows.find((r: FeeRow) =>
      r.firmId === firm.id &&
      value >= r.minValue &&
      value <= r.maxValue
    ) || feeRows.filter((r: FeeRow) => r.firmId === firm.id).sort((a: FeeRow, b: FeeRow) => b.minValue - a.minValue)[0];

    if (!band) continue; // No fee band configured for this firm

    const legalFee = Number(band.legalFee);
    const supplements: { name: string; price: number }[] = [];
    const disbursements: { name: string; price: number; includesVat: boolean }[] = [];

    // ── SUPPLEMENTS ──
    if (transactionType === 'purchase' || transactionType === 'sale_purchase') {
      if (input.tenure === 'leasehold' && Number(band.leaseholdSupplement) > 0)
        supplements.push({ name: 'Leasehold Supplement', price: Number(band.leaseholdSupplement) });
      if (input.isNewBuild && Number(band.newBuildSupplement) > 0)
        supplements.push({ name: 'New Build Supplement', price: Number(band.newBuildSupplement) });
      if (input.isSharedOwnership && Number(band.sharedOwnershipSupplement) > 0)
        supplements.push({ name: 'Shared Ownership', price: Number(band.sharedOwnershipSupplement) });
      if (input.hasGiftedDeposit && Number(band.giftedDepositSupplement) > 0)
        supplements.push({ name: 'Gifted Deposit', price: Number(band.giftedDepositSupplement) });
      if (input.hasMortgage)
        supplements.push({ name: 'Mortgage / Re-mortgage', price: 234 });
      if (input.isBuyToLet)
        supplements.push({ name: 'Buy to Let Supplement', price: 99 });
      if (input.isSecondHome)
        supplements.push({ name: 'Second Home Supplement', price: 99 });
    }
    if (transactionType === 'sale' || transactionType === 'sale_purchase') {
      if (input.tenure === 'leasehold' && Number(band.leaseholdSupplement) > 0)
        supplements.push({ name: 'Leasehold Supplement', price: Number(band.leaseholdSupplement) });
      if (input.hasMortgageOnProperty)
        supplements.push({ name: 'Mortgage Redemption', price: 149 });
    }

    // ── DISBURSEMENTS ──
    const numBuyers = Math.max(1, input.buyerCount ?? 1);
    if (Number(band.antiMoneyLaunderingFee) > 0) {
      const amlPerPerson = Number(band.antiMoneyLaunderingFee);
      disbursements.push({
        name: numBuyers > 1
          ? `Anti-Money Laundering (AML) Check × ${numBuyers} purchasers`
          : 'Anti-Money Laundering (AML) Check',
        price: amlPerPerson * numBuyers,
        includesVat: true,
      });
    }
    if (Number(band.searchFee) > 0)
      disbursements.push({ name: 'Search Pack (Local, Drainage & Environmental)', price: Number(band.searchFee), includesVat: true });
    if (Number(band.officialCopiesFee) > 0)
      disbursements.push({ name: 'Official Copies (Title Register & Plan)', price: Number(band.officialCopiesFee), includesVat: true });
    if (Number(band.electronicTransferFee) > 0)
      disbursements.push({ name: 'Electronic Transfer Fee (CHAPS)', price: Number(band.electronicTransferFee), includesVat: true });
    // Land Registry Searches (purchase)
    if (transactionType === 'purchase' || transactionType === 'sale_purchase')
      disbursements.push({ name: 'Land Registry Searches', price: 3, includesVat: true });
    if (transactionType === 'purchase' || transactionType === 'sale_purchase')
      disbursements.push({ name: 'Bankruptcy Search', price: 4, includesVat: true });

    // ── TOTALS ──
    const supplementTotal = supplements.reduce((s, x) => s + x.price, 0);
    const disbursementTotal = disbursements.reduce((s, x) => s + x.price, 0);
    const totalExVat = legalFee + supplementTotal;
    const vat = Math.round(totalExVat * 0.20);
    const totalIncVat = totalExVat + vat;

    const sdlt = (transactionType === 'purchase' || transactionType === 'sale_purchase')
      ? calcSDLT(value, input.isFirstTimeBuyer, input.isSecondHome, input.isBuyToLet)
      : 0;
    const lrBase = (transactionType === 'purchase' || transactionType === 'sale_purchase')
      ? calcLandRegistry(value)
      : 0;
    const landRegistryFee = lrBase * numBuyers;

    const grandTotal = totalIncVat + disbursementTotal + sdlt + landRegistryFee;

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
      totalExVat,
      vat,
      totalIncVat,
      sdlt,
      landRegistryFee,
      grandTotal,
    });
  }

  // Sort by grandTotal ascending
  return results.sort((a, b) => a.grandTotal - b.grandTotal);
}
