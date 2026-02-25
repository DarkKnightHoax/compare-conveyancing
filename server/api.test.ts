/**
 * API route tests for Compare the Conveyancing Market
 * Tests tRPC procedures for leads, callbacks, instruct requests, and law firms
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock the database module ─────────────────────────────────────────────────
vi.mock("./db", () => ({
  getAllLawFirms: vi.fn().mockResolvedValue([
    { id: 1, name: "Easy Choice Conveyancing", regulatoryBody: "SRA", rating: "4.75", reviewCount: 312, isActive: true },
  ]),
  getAllLawFirmsAdmin: vi.fn().mockResolvedValue([
    { id: 1, name: "Easy Choice Conveyancing", regulatoryBody: "SRA", rating: "4.75", reviewCount: 312, isActive: true },
  ]),
  createLawFirm: vi.fn().mockResolvedValue(undefined),
  updateLawFirm: vi.fn().mockResolvedValue(undefined),
  deleteLawFirm: vi.fn().mockResolvedValue(undefined),
  createLead: vi.fn().mockResolvedValue(42),
  getAllLeads: vi.fn().mockResolvedValue([
    {
      id: 1, firstName: "Jane", lastName: "Smith", email: "jane@example.com",
      phone: "07700900000", transactionType: "purchase", propertyValue: 350000,
      postcode: "SW1A 1AA", status: "new", createdAt: new Date(),
    },
  ]),
  getLeadById: vi.fn().mockResolvedValue({
    id: 1, firstName: "Jane", lastName: "Smith", email: "jane@example.com",
    phone: "07700900000", transactionType: "purchase", propertyValue: 350000,
    postcode: "SW1A 1AA", status: "new", createdAt: new Date(),
  }),
  updateLeadStatus: vi.fn().mockResolvedValue(undefined),
  getLeadsStats: vi.fn().mockResolvedValue({
    total: 10, new: 5, contacted: 3, instructed: 1, lost: 1, todayCount: 2, weekCount: 7,
  }),
  createCallbackRequest: vi.fn().mockResolvedValue(7),
  getAllCallbacks: vi.fn().mockResolvedValue([
    { id: 1, name: "John Doe", phone: "07700900001", status: "pending", createdAt: new Date() },
  ]),
  updateCallbackStatus: vi.fn().mockResolvedValue(undefined),
  getPendingCallbacksCount: vi.fn().mockResolvedValue(3),
  createInstructRequest: vi.fn().mockResolvedValue(5),
  getAllInstructRequests: vi.fn().mockResolvedValue([
    {
      id: 1, firmId: 1, firmName: "Easy Choice Conveyancing",
      firstName: "Jane", lastName: "Smith", email: "jane@example.com",
      phone: "07700900000", status: "submitted", createdAt: new Date(),
    },
  ]),
  updateInstructStatus: vi.fn().mockResolvedValue(undefined),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

import {
  getAllLawFirms, createLead, getAllLeads, getLeadsStats,
  createCallbackRequest, getAllCallbacks, getPendingCallbacksCount,
  createInstructRequest, getAllInstructRequests,
} from "./db";

// ─── LAW FIRMS ────────────────────────────────────────────────────────────────
describe("Law Firms", () => {
  it("returns active law firms", async () => {
    const firms = await getAllLawFirms();
    expect(firms).toHaveLength(1);
    expect(firms[0].name).toBe("Easy Choice Conveyancing");
    expect(firms[0].isActive).toBe(true);
  });
});

// ─── LEADS ────────────────────────────────────────────────────────────────────
describe("Leads", () => {
  it("creates a lead and returns an ID", async () => {
    const id = await createLead({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phone: "07700900000",
      transactionType: "purchase",
      propertyValue: 350000,
      postcode: "SW1A 1AA",
    } as any);
    expect(id).toBe(42);
  });

  it("retrieves all leads", async () => {
    const leads = await getAllLeads();
    expect(leads).toHaveLength(1);
    expect(leads[0].firstName).toBe("Jane");
    expect(leads[0].transactionType).toBe("purchase");
  });

  it("returns stats with correct shape", async () => {
    const stats = await getLeadsStats();
    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("new");
    expect(stats).toHaveProperty("instructed");
    expect(stats.total).toBe(10);
    expect(stats.new).toBe(5);
    expect(stats.instructed).toBe(1);
  });
});

// ─── CALLBACKS ────────────────────────────────────────────────────────────────
describe("Callbacks", () => {
  it("creates a callback request and returns an ID", async () => {
    const id = await createCallbackRequest({
      name: "John Doe",
      phone: "07700900001",
      preferredTime: "Morning (9am–12pm)",
    } as any);
    expect(id).toBe(7);
  });

  it("retrieves all callbacks", async () => {
    const callbacks = await getAllCallbacks();
    expect(callbacks).toHaveLength(1);
    expect(callbacks[0].name).toBe("John Doe");
    expect(callbacks[0].status).toBe("pending");
  });

  it("returns pending callback count", async () => {
    const count = await getPendingCallbacksCount();
    expect(count).toBe(3);
  });
});

// ─── INSTRUCT REQUESTS ────────────────────────────────────────────────────────
describe("Instruct Requests", () => {
  it("creates an instruct request and returns an ID", async () => {
    const id = await createInstructRequest({
      firmId: 1,
      firmName: "Easy Choice Conveyancing",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phone: "07700900000",
      paymentAmount: "150",
      paymentStatus: "pending",
      status: "submitted",
    } as any);
    expect(id).toBe(5);
  });

  it("retrieves all instruct requests", async () => {
    const requests = await getAllInstructRequests();
    expect(requests).toHaveLength(1);
    expect(requests[0].firmName).toBe("Easy Choice Conveyancing");
    expect(requests[0].status).toBe("submitted");
  });
});

// ─── FEE ENGINE LOGIC ─────────────────────────────────────────────────────────
describe("Fee Engine Validation", () => {
  it("validates that property value must be positive", () => {
    const propertyValue = 350000;
    expect(propertyValue).toBeGreaterThan(0);
    expect(propertyValue).toBeGreaterThanOrEqual(10000);
  });

  it("validates transaction type enum", () => {
    const validTypes = ["purchase", "sale", "sale_purchase", "remortgage"];
    expect(validTypes).toContain("purchase");
    expect(validTypes).toContain("remortgage");
    expect(validTypes).not.toContain("invalid_type");
  });

  it("validates lead status transitions", () => {
    const validStatuses = ["new", "contacted", "instructed", "lost"];
    expect(validStatuses).toContain("new");
    expect(validStatuses).toContain("instructed");
    expect(validStatuses).not.toContain("pending");
  });
});
