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
  // Admin notes
  adminNotes: text("adminNotes"),
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
  paymentAmount: decimal("paymentAmount", { precision: 10, scale: 2 }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed"]).default("pending").notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  status: mysqlEnum("status", ["submitted", "confirmed", "in_progress", "completed", "cancelled"]).default("submitted").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InstructRequest = typeof instructRequests.$inferSelect;
export type InsertInstructRequest = typeof instructRequests.$inferInsert;
