/**
 * Tests: Fee linking between admin fee editor, fee breakdown, and Instruct Directly modal.
 * Verifies that:
 * 1. computeLeg uses band.searchFee from DB (not hardcoded 349)
 * 2. computeLeg uses band.saleLegalFee for the sale leg of sale_purchase
 * 3. The single-leg purchase path also uses band.searchFee
 */
import { describe, it, expect } from "vitest";
import { computeLeg } from "./db";

// Mock a fee band with custom search fee and saleLegalFee
const mockBand: any = {
  id: 1,
  firmId: 1,
  transactionType: "sale_purchase",
  minValue: 0,
  maxValue: 500000,
  legalFee: "1000",       // purchase legal fee
  saleLegalFee: "650",    // sale legal fee
  searchFee: "375",       // custom search pack fee (not the default 349)
  landRegistryFee: "150",
  electronicTransferFee: "30",
  bankTransferFee: "0",
  antiMoneyLaunderingFee: "49",
  officialCopiesFee: "0",
  leaseholdSupplement: "249",
  saleLeaseholdSupplement: "149",
  newBuildSupplement: "350",
  sharedOwnershipSupplement: "350",
  giftedDepositSupplement: "150",
  platformCommission: "0",
  fileOpeningFee: "150",
  isActive: true,
};

const baseInput = {
  transactionType: "sale_purchase" as const,
  purchasePrice: 300000,
  salePrice: 250000,
  purchaseTenure: "freehold" as const,
  saleTenure: "freehold" as const,
  buyerCount: 1,
  isFirstTimeBuyer: false,
  isAdditionalProperty: false,
  isMovingHome: false,
  hasHelpToBuyIsa: false,
  hasLifetimeIsa: false,
  isNewBuild: false,
  isSharedOwnership: false,
  hasGiftedDeposit: false,
  giftedDepositCount: 0,
  isAuction: false,
  isLimitedCompany: false,
};

describe("Fee linking: computeLeg uses DB search fee and saleLegalFee", () => {
  it("purchase leg uses band.searchFee (375) not hardcoded 349", () => {
    const result = computeLeg(mockBand, "purchase", 300000, "freehold", baseInput);
    const searchPack = result.disbursements.find(d => d.name.includes("Search Pack"));
    expect(searchPack).toBeDefined();
    expect(searchPack!.price).toBe(375);
  });

  it("purchase leg uses band.legalFee (1000) not saleLegalFee", () => {
    const result = computeLeg(mockBand, "purchase", 300000, "freehold", baseInput);
    expect(result.legalFee).toBe(1000);
  });

  it("sale leg uses band.saleLegalFee (650) not legalFee (1000)", () => {
    const result = computeLeg(mockBand, "sale", 250000, "freehold", baseInput);
    expect(result.legalFee).toBe(650);
  });

  it("sale leg does NOT include Search Pack disbursement", () => {
    const result = computeLeg(mockBand, "sale", 250000, "freehold", baseInput);
    const searchPack = result.disbursements.find(d => d.name.includes("Search Pack"));
    expect(searchPack).toBeUndefined();
  });

  it("sale leg includes AML check disbursement", () => {
    const result = computeLeg(mockBand, "sale", 250000, "freehold", baseInput);
    const aml = result.disbursements.find(d => d.name.includes("Anti-Money Laundering") || d.name.includes("AML"));
    expect(aml).toBeDefined();
    expect(aml!.price).toBe(49);
  });

  it("falls back to 349 when band.searchFee is 0 or null", () => {
    const bandNoSearch = { ...mockBand, searchFee: "0" };
    const result = computeLeg(bandNoSearch, "purchase", 300000, "freehold", baseInput);
    const searchPack = result.disbursements.find(d => d.name.includes("Search Pack"));
    expect(searchPack).toBeDefined();
    expect(searchPack!.price).toBe(349);
  });

  it("falls back to legalFee when saleLegalFee is 0 for sale leg", () => {
    const bandNoSaleFee = { ...mockBand, saleLegalFee: "0" };
    const result = computeLeg(bandNoSaleFee, "sale", 250000, "freehold", baseInput);
    // Should fall back to legalFee (1000)
    expect(result.legalFee).toBe(1000);
  });
});
