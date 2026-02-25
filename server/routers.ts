import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getAllLawFirms, getAllLawFirmsAdmin, createLawFirm, updateLawFirm, deleteLawFirm,
  createLead, getAllLeads, getLeadById, updateLeadStatus, getLeadsStats,
  createCallbackRequest, getAllCallbacks, updateCallbackStatus, getPendingCallbacksCount,
  createInstructRequest, getAllInstructRequests, updateInstructStatus,
} from "./db";
import { notifyOwner } from "./_core/notification";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
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

  firms: router({
    list: publicProcedure.query(() => getAllLawFirms()),
    listAdmin: adminProcedure.query(() => getAllLawFirmsAdmin()),
    create: adminProcedure
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
    update: adminProcedure
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
    delete: adminProcedure
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
    list: adminProcedure
      .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }))
      .query(({ input }) => getAllLeads(input.limit, input.offset)),
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getLeadById(input.id)),
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "instructed", "lost"]),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await updateLeadStatus(input.id, input.status, input.notes);
        return { success: true };
      }),
    stats: adminProcedure.query(() => getLeadsStats()),
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
    list: adminProcedure
      .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }))
      .query(({ input }) => getAllCallbacks(input.limit, input.offset)),
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "called", "no_answer", "resolved"]),
        assignedTo: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await updateCallbackStatus(input.id, input.status, input.assignedTo);
        return { success: true };
      }),
    pendingCount: adminProcedure.query(() => getPendingCallbacksCount()),
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
    list: adminProcedure
      .input(z.object({ limit: z.number().optional(), offset: z.number().optional() }))
      .query(({ input }) => getAllInstructRequests(input.limit, input.offset)),
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["submitted", "confirmed", "in_progress", "completed", "cancelled"]),
      }))
      .mutation(async ({ input }) => {
        await updateInstructStatus(input.id, input.status);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
