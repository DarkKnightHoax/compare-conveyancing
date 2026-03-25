import { describe, it, expect } from "vitest";
import { Resend } from "resend";

describe("Resend API key validation", () => {
  it("should successfully send a test email using the Resend API key", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(apiKey, "RESEND_API_KEY must be set").toBeTruthy();

    const resend = new Resend(apiKey);
    // Send a real test email to validate the key works
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "info@comparetheconveyancingmarket.co.uk",
      subject: "✅ Resend Integration Test — Compare the Conveyancing Market",
      html: "<p>This is an automated test confirming that the Resend email integration is working correctly for <strong>Compare the Conveyancing Market</strong>.</p>",
    });
    expect(error, `Resend send error: ${JSON.stringify(error)}`).toBeNull();
    expect(data?.id, "Should return an email ID").toBeTruthy();
  }, 15000);
});
