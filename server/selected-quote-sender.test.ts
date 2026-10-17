import { expect, it, vi } from "vitest";
const send = vi.hoisted(() => vi.fn().mockResolvedValue({ data: { id: "accepted" }, error: null }));
vi.mock("resend", () => ({ Resend: class { emails = { send }; } }));
import { sendSelectedQuoteEmail } from "./email";
it("uses the existing verified sender and sends the quote as text to the customer", async () => {
  const text = "Firm: Example Solicitors\nGRAND TOTAL: £1,234.56";
  await expect(sendSelectedQuoteEmail({ email: "customer@example.com", firmName: "Example Solicitors", text }))
    .resolves.toMatchObject({ data: { id: "accepted" } });
  expect(send).toHaveBeenCalledWith({
    from: "noreply@comparetheconveyancingmarket.co.uk",
    to: "customer@example.com",
    replyTo: "info@comparetheconveyancingmarket.co.uk",
    subject: "Your Conveyancing Quote — Example Solicitors",
    text,
  });
});
