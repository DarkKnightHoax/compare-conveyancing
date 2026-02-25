import { eq, desc, count, gte } from "drizzle-orm";
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
