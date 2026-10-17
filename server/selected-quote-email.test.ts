import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";
const mocks = vi.hoisted(() => ({ send: vi.fn(), notify: vi.fn() }));
vi.mock("./email", () => ({ sendSelectedQuoteEmail: mocks.send }));
vi.mock("./_core/notification", () => ({ notifyOwner: mocks.notify }));
import { appRouter } from "./routers";
const caller = appRouter.createCaller({ user: null, req: {}, res: {} } as TrpcContext);
const input = {
  recipientEmail: "customer@example.com", firmName: "Example Solicitors", firmLocation: "London",
  legalFee: 500, totalIncVat: 600, sdlt: 2500, landRegistryFee: 150,
  grandTotal: 3600, propertyValue: 300000, transactionType: "purchase",
};
beforeEach(() => {
  vi.resetAllMocks();
  mocks.send.mockResolvedValue({ data: { id: "accepted-email" }, error: null });
  mocks.notify.mockResolvedValue(true);
});
describe("selected quote email endpoint", () => {
  it("sends the selected quote to the requested recipient before reporting success", async () => {
    const result = await caller.quotes.emailQuote(input);
    expect(result.success).toBe(true);
    expect(mocks.send).toHaveBeenCalledTimes(1);
    expect(mocks.send).toHaveBeenCalledWith({
      email: input.recipientEmail, firmName: input.firmName, text: result.quoteText,
    });
    expect(result.quoteText).toContain("GRAND TOTAL: £3,600.00");
    expect(result.quoteText).toContain("Stamp Duty Land Tax (SDLT): £2,500.00");
    expect(mocks.send.mock.invocationCallOrder[0]).toBeLessThan(mocks.notify.mock.invocationCallOrder[0]);
  });
  it.each([
    { data: null, error: { message: "rejected" } },
    { data: null, error: null },
  ])("rejects unconfirmed sends and does not announce an email was sent", async response => {
    mocks.send.mockResolvedValue(response);
    await expect(caller.quotes.emailQuote(input)).rejects.toThrow("We couldn't send your quote");
    expect(mocks.notify).not.toHaveBeenCalled();
  });
  it("handles a provider network error without claiming success", async () => {
    mocks.send.mockRejectedValue(new Error("network failure"));
    await expect(caller.quotes.emailQuote(input)).rejects.toThrow("We couldn't send your quote");
    expect(mocks.notify).not.toHaveBeenCalled();
  });
  it("does not fail an accepted customer email when owner notification fails", async () => {
    mocks.notify.mockRejectedValue(new Error("notification failed"));
    await expect(caller.quotes.emailQuote(input)).resolves.toMatchObject({ success: true });
  });
  it("rejects invalid recipients before sending", async () => {
    await expect(caller.quotes.emailQuote({ ...input, recipientEmail: "invalid" })).rejects.toThrow();
    expect(mocks.send).not.toHaveBeenCalled();
  });
});
