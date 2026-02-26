import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { parse as parseCookieHeader } from "cookie";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { SignJWT, jwtVerify } from "jose";
import * as bcrypt from "bcryptjs";
import { ENV } from "./_core/env";
import {

  getAllLawFirms, getAllLawFirmsAdmin, createLawFirm, updateLawFirm, deleteLawFirm,
  createLead, getAllLeads, getLeadById, updateLeadStatus, getLeadsStats,
  createCallbackRequest, getAllCallbacks, updateCallbackStatus, getPendingCallbacksCount,
  createInstructRequest, getAllInstructRequests, updateInstructStatus,
  getFeeStructuresForFirm, getAllFeeStructures, upsertFeeStructure, deleteFeeStructure,
  getNotesForFirm, createFirmNote, deleteFirmNote, getInvestorStats,
  calculateLiveQuotes,
} from "./db";
import { notifyOwner } from "./_core/notification";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

const ADMIN_COOKIE = "admin_session";
const ADMIN_JWT_EXPIRY = "12h";

async function signAdminToken(username: string): Promise<string> {
  const secret = new TextEncoder().encode(ENV.cookieSecret || "admin-fallback-secret");
  return new SignJWT({ sub: username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ADMIN_JWT_EXPIRY)
    .sign(secret);
}

async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(ENV.cookieSecret || "admin-fallback-secret");
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "admin";
  } catch (e) {
    console.error("[AdminAuth] JWT verify failed:", (e as Error).message);
    return false;
  }
}

// Helper to read admin cookie from raw header (no cookie-parser middleware needed)
function getAdminCookie(req: { headers: { cookie?: string } }): string | undefined {
  const cookies = parseCookieHeader(req.headers.cookie || "");
  return cookies[ADMIN_COOKIE];
}

// Middleware that checks the admin session cookie (independent of Manus OAuth)
const standaloneAdminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const token = getAdminCookie(ctx.req);
  if (!token) throw new TRPCError({ code: "UNAUTHORIZED", message: "Admin login required" });
  const valid = await verifyAdminToken(token);
  if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or expired admin session" });
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Standalone admin authentication (independent of Manus OAuth)
  adminAuth: router({
    login: publicProcedure
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const expectedUser = ENV.adminUsername;
        const expectedPass = ENV.adminPassword;
        if (!expectedUser || !expectedPass) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Admin credentials not configured" });
        }
        const usernameMatch = input.username === expectedUser;
        // Support both plain-text and bcrypt-hashed passwords
        const passwordMatch = expectedPass.startsWith("$2") 
          ? await bcrypt.compare(input.password, expectedPass)
          : input.password === expectedPass;
        if (!usernameMatch || !passwordMatch) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid username or password" });
        }
        const token = await signAdminToken(input.username);
        // Use getSessionCookieOptions to correctly detect HTTPS behind proxy
        const cookieOpts = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(ADMIN_COOKIE, token, {
          ...cookieOpts,
          maxAge: 12 * 60 * 60 * 1000, // 12 hours
        });
        return { success: true };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(ADMIN_COOKIE, { path: "/" });
      return { success: true };
    }),

    check: publicProcedure.query(async ({ ctx }) => {
      const token = getAdminCookie(ctx.req);
      if (!token) return { authenticated: false };
      const valid = await verifyAdminToken(token);
      return { authenticated: valid };
    }),
  }),

  firms: router({
    list: publicProcedure.query(() => getAllLawFirms()),
    listAdmin: standaloneAdminProcedure.query(() => getAllLawFirmsAdmin()),
    create: standaloneAdminProcedure
      .input(z.object({
        name: z.string().min(1),
        location: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
        website: z.string().optional(),
        regulatoryBody: z.enum(["SRA", "CLC"]).default("SRA"),
        sraNumber: z.string().optional(),
        rating: z.string().optional(),
        reviewCount: z.number().optional(),
        isActive: z.boolean().default(true),
      }))
      .mutation(async ({ input }) => {
        await createLawFirm(input as any);
        return { success: true };
      }),
    update: standaloneAdminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        location: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional().or(z.literal("")),
        website: z.string().optional(),
        regulatoryBody: z.enum(["SRA", "CLC"]).optional(),
        sraNumber: z.string().optional(),
        rating: z.string().optional(),
        reviewCount: z.number().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateLawFirm(id, data as any);
        return { success: true };
      }),
    delete: standaloneAdminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteLawFirm(input.id);
        return { success: true };
      }),
  }),

  leads: router({
    create: publicProcedure
      .input(z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        transactionType: z.enum(["purchase", "sale", "sale_purchase", "remortgage"]),
        propertyValue: z.number().min(1),
        postcode: z.string().min(1),
        propertyTenure: z.enum(["freehold", "leasehold"]).optional(),
        isFirstTimeBuyer: z.boolean().optional(),
        hasMortgage: z.boolean().optional(),
        mortgageLender: z.string().optional(),
        isNewBuild: z.boolean().optional(),
        isSharedOwnership: z.boolean().optional(),
        isGiftedDeposit: z.boolean().optional(),
        hasHelpToBuyIsa: z.boolean().optional(),
        isRightToBuy: z.boolean().optional(),
        isBuyToLet: z.boolean().optional(),
        isSecondHome: z.boolean().optional(),
        numberOfBuyers: z.number().optional(),
        hasMortgageOnSale: z.boolean().optional(),
        isTransferOfEquity: z.boolean().optional(),
        movingTimeline: z.string().optional(),
        quotedLegalFee: z.string().optional(),
        quotedTotal: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const leadId = await createLead(input as any);
        await notifyOwner({
          title: `New Quote Request — ${input.firstName} ${input.lastName}`,
          content: `Transaction: ${input.transactionType} | Property Value: £${input.propertyValue.toLocaleString()} | Postcode: ${input.postcode} | Email: ${input.email}`,
        }).catch(() => {});
        return { success: true, leadId };
      }),
    list: standaloneAdminProcedure
      .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }))
      .query(({ input }) => getAllLeads(input.limit, input.offset)),
    getById: standaloneAdminProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getLeadById(input.id)),
    updateStatus: standaloneAdminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "instructed", "lost"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await updateLeadStatus(input.id, input.status, input.notes);
        return { success: true };
      }),
    stats: standaloneAdminProcedure.query(() => getLeadsStats()),
  }),

  callbacks: router({
    create: publicProcedure
      .input(z.object({
        leadId: z.number().optional(),
        name: z.string().min(1),
        phone: z.string().min(1),
        email: z.string().email().optional().or(z.literal("")),
        preferredTime: z.string().optional(),
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await createCallbackRequest(input as any);
        await notifyOwner({
          title: `Callback Request — ${input.name}`,
          content: `Phone: ${input.phone} | Preferred time: ${input.preferredTime ?? "Any time"} | Message: ${input.message ?? "None"}`,
        }).catch(() => {});
        return { success: true, id };
      }),
    list: standaloneAdminProcedure
      .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }))
      .query(({ input }) => getAllCallbacks(input.limit, input.offset)),
    updateStatus: standaloneAdminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "called", "no_answer", "resolved"]),
        assignedTo: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await updateCallbackStatus(input.id, input.status, input.assignedTo);
        return { success: true };
      }),
    pendingCount: standaloneAdminProcedure.query(() => getPendingCallbacksCount()),
  }),

  instruct: router({
    create: publicProcedure
      .input(z.object({
        leadId: z.number().optional(),
        firmId: z.number(),
        firmName: z.string().min(1),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        paymentAmount: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await createInstructRequest({ ...input, paymentStatus: "pending", status: "submitted" } as any);
        await notifyOwner({
          title: `Instruction Request — ${input.firstName} ${input.lastName} → ${input.firmName}`,
          content: `Email: ${input.email} | Phone: ${input.phone} | Payment on account: £${input.paymentAmount ?? "TBC"}`,
        }).catch(() => {});
        return { success: true, id };
      }),
    list: standaloneAdminProcedure
      .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }))
      .query(({ input }) => getAllInstructRequests(input.limit, input.offset)),
    updateStatus: standaloneAdminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["submitted", "confirmed", "in_progress", "completed", "cancelled"]),
      }))
      .mutation(async ({ input }) => {
        await updateInstructStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  investor: router({
    // Overview stats for the investor dashboard
    stats: standaloneAdminProcedure.query(() => getInvestorStats()),

    // All fee structures across all firms
    allFeeStructures: standaloneAdminProcedure.query(() => getAllFeeStructures()),

    // Fee structures for a single firm
    feeStructures: standaloneAdminProcedure
      .input(z.object({ firmId: z.number() }))
      .query(({ input }) => getFeeStructuresForFirm(input.firmId)),

    // Create or update a fee band
    upsertFeeStructure: standaloneAdminProcedure
      .input(z.object({
        id: z.number().optional(),
        firmId: z.number(),
        transactionType: z.enum(["purchase", "sale", "sale_purchase", "remortgage"]),
        minValue: z.number().min(0).default(0),
        maxValue: z.number().min(1).default(9999999),
        legalFee: z.string(),
        searchFee: z.string().optional(),
        landRegistryFee: z.string().optional(),
        electronicTransferFee: z.string().optional(),
        bankTransferFee: z.string().optional(),
        antiMoneyLaunderingFee: z.string().optional(),
        officialCopiesFee: z.string().optional(),
        leaseholdSupplement: z.string().optional(),
        newBuildSupplement: z.string().optional(),
        sharedOwnershipSupplement: z.string().optional(),
        giftedDepositSupplement: z.string().optional(),
        platformCommission: z.string().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await upsertFeeStructure(input as any);
        return { success: true, id };
      }),

    // Delete a fee band
    deleteFeeStructure: standaloneAdminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteFeeStructure(input.id);
        return { success: true };
      }),

    // Notes for a firm
    notes: standaloneAdminProcedure
      .input(z.object({ firmId: z.number() }))
      .query(({ input }) => getNotesForFirm(input.firmId)),

    addNote: standaloneAdminProcedure
      .input(z.object({
        firmId: z.number(),
        content: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const id = await createFirmNote({
          firmId: input.firmId,
          content: input.content,
          authorName: "Admin",
        } as any);
        return { success: true, id };
      }),

    deleteNote: standaloneAdminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteFirmNote(input.id);
        return { success: true };
      }),
  }),

  // ── LIVE QUOTES (reads from DB fee structures) ──────────────────────────────
  quotes: router({
    getLive: publicProcedure
      .input(z.object({
        transactionType: z.enum(["purchase", "sale", "sale_purchase", "remortgage"]),
        propertyValue: z.number().min(0),
        tenure: z.enum(["freehold", "leasehold"]),
        hasMortgage: z.boolean().default(false),
        isFirstTimeBuyer: z.boolean().default(false),
        isNewBuild: z.boolean().default(false),
        isSharedOwnership: z.boolean().default(false),
        hasGiftedDeposit: z.boolean().default(false),
        isBuyToLet: z.boolean().default(false),
        isSecondHome: z.boolean().default(false),
        hasMortgageOnProperty: z.boolean().optional(),
        newMortgageValue: z.number().optional(),
      }))
      .query(({ input }) => calculateLiveQuotes(input)),

    emailQuote: publicProcedure
      .input(z.object({
        recipientEmail: z.string().email(),
        firmName: z.string(),
        firmLocation: z.string(),
        legalFee: z.number(),
        totalIncVat: z.number(),
        sdlt: z.number(),
        landRegistryFee: z.number(),
        grandTotal: z.number(),
        propertyValue: z.number(),
        transactionType: z.string(),
      }))
      .mutation(async ({ input }) => {
        const fmt = (n: number) => `£${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        const txLabel: Record<string, string> = {
          purchase: 'Property Purchase',
          sale: 'Property Sale',
          sale_purchase: 'Sale & Purchase',
          remortgage: 'Remortgage',
        };
        const quoteText = [
          `CONVEYANCING QUOTE`,
          `Firm: ${input.firmName} (${input.firmLocation})`,
          `Transaction: ${txLabel[input.transactionType] ?? input.transactionType}`,
          `Property Value: ${fmt(input.propertyValue)}`,
          ``,
          `Legal fees (inc. VAT): ${fmt(input.totalIncVat)}`,
          input.sdlt > 0 ? `Stamp Duty Land Tax (SDLT): ${fmt(input.sdlt)}` : null,
          `Land Registry fee: ${fmt(input.landRegistryFee)}`,
          ``,
          `GRAND TOTAL: ${fmt(input.grandTotal)}`,
          ``,
          `This quote is indicative. Final fees may vary. All firms are SRA/CLC regulated.`,
          `Compare the Conveyancing Market — 71-75 Shelton Street, Covent Garden, London WC2H 9JQ`,
        ].filter(Boolean).join('\n');

        await notifyOwner({
          title: `Quote emailed to ${input.recipientEmail}`,
          content: `${input.firmName} quote (${fmt(input.grandTotal)}) sent to ${input.recipientEmail} for ${txLabel[input.transactionType] ?? input.transactionType} at ${fmt(input.propertyValue)}.`,
        }).catch(() => {});

        return { success: true, emailedTo: input.recipientEmail, quoteText };
      }),
  }),
});

export type AppRouter = typeof appRouter;

