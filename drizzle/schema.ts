import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── LAW FIRMS ────────────────────────────────────────────────────────────────
export const lawFirms = mysqlTable("law_firms", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }),
  website: varchar("website", { length: 500 }),
  regulatoryBody: mysqlEnum("regulatoryBody", ["SRA", "CLC"]).default("SRA").notNull(),
  sraNumber: varchar("sraNumber", { length: 50 }),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("4.50"),
  reviewCount: int("reviewCount").default(0),
  speciality: varchar("speciality", { length: 255 }),
  yearsEstablished: int("yearsEstablished").default(0),
  accreditations: text("accreditations"), // JSON array stored as text
  logoUrl: varchar("logoUrl", { length: 1000 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LawFirm = typeof lawFirms.$inferSelect;
export type InsertLawFirm = typeof lawFirms.$inferInsert;

// ─── LEADS ────────────────────────────────────────────────────────────────────
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  // Contact details
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  // Transaction details
  transactionType: mysqlEnum("transactionType", ["purchase", "sale", "sale_purchase", "remortgage"]).notNull(),
  propertyValue: int("propertyValue").notNull(),
  postcode: varchar("postcode", { length: 10 }).notNull(),
  propertyTenure: mysqlEnum("propertyTenure", ["freehold", "leasehold"]).default("freehold"),
  // Flags
  isFirstTimeBuyer: boolean("isFirstTimeBuyer").default(false),
  hasMortgage: boolean("hasMortgage").default(false),
  mortgageLender: varchar("mortgageLender", { length: 100 }),
  isNewBuild: boolean("isNewBuild").default(false),
  isSharedOwnership: boolean("isSharedOwnership").default(false),
  isGiftedDeposit: boolean("isGiftedDeposit").default(false),
  hasHelpToBuyIsa: boolean("hasHelpToBuyIsa").default(false),
  isRightToBuy: boolean("isRightToBuy").default(false),
  isBuyToLet: boolean("isBuyToLet").default(false),
  isSecondHome: boolean("isSecondHome").default(false),
  numberOfBuyers: int("numberOfBuyers").default(1),
  // Sale-specific
  hasMortgageOnSale: boolean("hasMortgageOnSale").default(false),
  // Remortgage-specific
  isTransferOfEquity: boolean("isTransferOfEquity").default(false),
  // Timeline
  movingTimeline: varchar("movingTimeline", { length: 100 }),
  // Status tracking
  status: mysqlEnum("status", ["new", "contacted", "instructed", "lost"]).default("new").notNull(),
  actionTaken: mysqlEnum("actionTaken", ["browsed", "callback_requested", "instructed"]).default("browsed"),
  selectedFirmId: int("selectedFirmId"),
  // Calculated totals shown to user
  quotedLegalFee: decimal("quotedLegalFee", { precision: 10, scale: 2 }),
  quotedTotal: decimal("quotedTotal", { precision: 10, scale: 2 }),
  // Unique reference number (e.g. CCM-2026-00042)
  referenceNumber: varchar("referenceNumber", { length: 30 }).unique(),
  // Snapshot of the full quote results (JSON) for the saved quote page
  quoteSnapshot: text("quoteSnapshot"),
  // Admin notes
  adminNotes: text("adminNotes"),
  // Source / attribution tracking
  utmSource: varchar("utmSource", { length: 100 }),      // e.g. "google", "facebook", "email"
  utmMedium: varchar("utmMedium", { length: 100 }),      // e.g. "cpc", "organic", "referral"
  utmCampaign: varchar("utmCampaign", { length: 255 }),  // e.g. "first-time-buyer-ads"
  utmContent: varchar("utmContent", { length: 255 }),    // e.g. ad variant
  utmTerm: varchar("utmTerm", { length: 255 }),          // e.g. keyword that triggered the ad
  referrerUrl: varchar("referrerUrl", { length: 1000 }), // full document.referrer
  landingPage: varchar("landingPage", { length: 500 }),  // first page user landed on
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// ─── CALLBACK REQUESTS ────────────────────────────────────────────────────────
export const callbackRequests = mysqlTable("callback_requests", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId"),
  name: varchar("name", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 320 }),
  preferredTime: varchar("preferredTime", { length: 100 }),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "called", "no_answer", "resolved"]).default("pending").notNull(),
  assignedTo: varchar("assignedTo", { length: 200 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CallbackRequest = typeof callbackRequests.$inferSelect;
export type InsertCallbackRequest = typeof callbackRequests.$inferInsert;

// ─── INSTRUCT REQUESTS ────────────────────────────────────────────────────────
export const instructRequests = mysqlTable("instruct_requests", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId"),
  firmId: int("firmId").notNull(),
  firmName: varchar("firmName", { length: 255 }).notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  dateOfBirth: varchar("dateOfBirth", { length: 20 }),
  currentAddress: text("currentAddress"),
  propertyAddress: text("propertyAddress"),
  paymentAmount: decimal("paymentAmount", { precision: 10, scale: 2 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed"]).default("pending").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  status: mysqlEnum("status", ["submitted", "confirmed", "in_progress", "completed", "cancelled"]).default("submitted").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InstructRequest = typeof instructRequests.$inferSelect;
export type InsertInstructRequest = typeof instructRequests.$inferInsert;

// ─── FIRM FEE STRUCTURES ─────────────────────────────────────────────────────
// Each row is one fee band for a given firm + transaction type combination.
// The fee engine picks the band where propertyValue falls within minValue..maxValue.
export const firmFeeStructures = mysqlTable("firm_fee_structures", {
  id: int("id").autoincrement().primaryKey(),
  firmId: int("firmId").notNull(),
  transactionType: mysqlEnum("transactionType", ["purchase", "sale", "sale_purchase", "remortgage"]).notNull(),
  // Property value band (inclusive)
  minValue: int("minValue").notNull().default(0),
  maxValue: int("maxValue").notNull().default(9999999),
  // Core legal fee (excl. VAT)
  legalFee: decimal("legalFee", { precision: 10, scale: 2 }).notNull().default("0"),
  // Disbursements
  searchFee: decimal("searchFee", { precision: 10, scale: 2 }).default("0"),
  landRegistryFee: decimal("landRegistryFee", { precision: 10, scale: 2 }).default("0"),
  electronicTransferFee: decimal("electronicTransferFee", { precision: 10, scale: 2 }).default("30"),
  bankTransferFee: decimal("bankTransferFee", { precision: 10, scale: 2 }).default("0"),
  antiMoneyLaunderingFee: decimal("antiMoneyLaunderingFee", { precision: 10, scale: 2 }).default("6"),
  officialCopiesFee: decimal("officialCopiesFee", { precision: 10, scale: 2 }).default("0"),
  // Leasehold supplement
  leaseholdSupplement: decimal("leaseholdSupplement", { precision: 10, scale: 2 }).default("0"),
  // New build supplement
  newBuildSupplement: decimal("newBuildSupplement", { precision: 10, scale: 2 }).default("0"),
  // Shared ownership supplement
  sharedOwnershipSupplement: decimal("sharedOwnershipSupplement", { precision: 10, scale: 2 }).default("0"),
  // Gifted deposit supplement
  giftedDepositSupplement: decimal("giftedDepositSupplement", { precision: 10, scale: 2 }).default("0"),
  // File opening fee (disbursement, ex. VAT) — firm-specific
  fileOpeningFee: decimal("fileOpeningFee", { precision: 10, scale: 2 }).default("0"),
  // Margin / commission earned by the platform (£)
  platformCommission: decimal("platformCommission", { precision: 10, scale: 2 }).default("0"),
  // Whether this band is currently active
  logoUrl: varchar("logoUrl", { length: 1000 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FirmFeeStructure = typeof firmFeeStructures.$inferSelect;
export type InsertFirmFeeStructure = typeof firmFeeStructures.$inferInsert;

// ─── FIRM NOTES ───────────────────────────────────────────────────────────────
// Investor notes attached to a law firm (e.g. contract terms, contact history)
export const firmNotes = mysqlTable("firm_notes", {
  id: int("id").autoincrement().primaryKey(),
  firmId: int("firmId").notNull(),
  authorId: int("authorId"),
  authorName: varchar("authorName", { length: 200 }),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FirmNote = typeof firmNotes.$inferSelect;
export type InsertFirmNote = typeof firmNotes.$inferInsert;

// ─── FIRM LENDER PANELS ───────────────────────────────────────────────────────
// Which mortgage lenders each firm is approved to act for
export const firmLenderPanels = mysqlTable("firm_lender_panels", {
  id: int("id").autoincrement().primaryKey(),
  firmId: int("firmId").notNull(),
  lenderName: varchar("lenderName", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type FirmLenderPanel = typeof firmLenderPanels.$inferSelect;
export type InsertFirmLenderPanel = typeof firmLenderPanels.$inferInsert;
