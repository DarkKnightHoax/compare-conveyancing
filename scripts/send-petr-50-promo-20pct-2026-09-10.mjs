import "dotenv/config";
import fs from "node:fs/promises";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const selection = JSON.parse(await fs.readFile("/tmp/petr-50-promo-selection.json", "utf8"));
const deadline = "10 September 2026";
const from = "James Fellows <noreply@comparetheconveyancingmarket.co.uk>";
const internalEmail = "info@comparetheconveyancingmarket.co.uk";

function emailText(lead) {
  const quoteLink = `https://www.comparetheconveyancingmarket.co.uk/quote/${encodeURIComponent(lead.referenceNumber)}`;
  return `Hello ${lead.firstName},

Your personal 20% saving on conveyancing is ready.

We have reserved an exclusive 20% discount on your conveyancing legal fee when you instruct through Compare the Conveyancing Market by 11:59pm on ${deadline}.

This is our strongest current saving and it is linked to your quote reference ${lead.referenceNumber}. Once the offer closes, we cannot guarantee that the same reduction will be available.

View your quote: ${quoteLink}

How to claim your 20% discount:
1. Open your personalised quote using the link above.
2. Email ${internalEmail} before ${deadline}, quoting ${lead.referenceNumber}.
3. We will send the discount code to use when you instruct.

Why act now? Your quote was prepared for your specific transaction details. Securing the offer now means you can move forward with a regulated conveyancing firm at a reduced legal fee, while the discount is still available.

This is a limited-time offer and expires at 11:59pm on ${deadline}. If your circumstances have changed or you no longer need a quote, please reply and we will update our records.

Kind regards,
James Fellows
Compare the Conveyancing Market
${internalEmail}`;
}

function emailHtml(lead) {
  const quoteLink = `https://www.comparetheconveyancingmarket.co.uk/quote/${encodeURIComponent(lead.referenceNumber)}`;
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f1eb;font-family:Arial,Helvetica,sans-serif;color:#192b46">
  <div style="max-width:640px;margin:0 auto;padding:26px 14px">
    <div style="background:#0b1d39;border-radius:14px 14px 0 0;padding:28px 32px;text-align:center">
      <div style="color:#d7b45b;font:700 12px/1.2 Arial,sans-serif;letter-spacing:1.8px;text-transform:uppercase">Compare the Conveyancing Market</div>
      <h1 style="margin:14px 0 0;color:#fff;font:700 31px/1.18 Georgia,serif">Your 20% Saving Is Ready</h1>
    </div>
    <div style="background:#ffffff;padding:32px;border:1px solid #e6dfd2;border-top:0">
      <div style="margin:0 0 24px;padding:12px 16px;background:#f7edce;border-left:4px solid #c69b35;border-radius:4px;color:#5a4312;font-size:14px;font-weight:700;text-align:center">LIMITED TIME: Claim by 11:59pm on ${deadline}</div>
      <p style="margin:0 0 18px;font-size:16px;line-height:1.65">Hello ${lead.firstName},</p>
      <p style="margin:0 0 18px;font-size:17px;line-height:1.65"><strong>Your personal 20% saving on conveyancing is ready.</strong></p>
      <p style="margin:0 0 18px;font-size:16px;line-height:1.65">We have reserved an exclusive <strong style="color:#9b6f12">20% discount on your conveyancing legal fee</strong> when you instruct through Compare the Conveyancing Market by <strong>${deadline}</strong>.</p>
      <div style="margin:24px 0;padding:20px;background:#f8fafc;border:1px solid #dde5ee;border-radius:8px;text-align:center">
        <div style="margin-bottom:8px;color:#607089;font-size:12px;letter-spacing:.8px;text-transform:uppercase">Your Quote Reference</div>
        <div style="color:#0b1d39;font-size:19px;font-weight:700">${lead.referenceNumber}</div>
      </div>
      <p style="margin:0 0 22px;text-align:center"><a href="${quoteLink}" style="display:inline-block;background:#c69b35;color:#0b1d39;padding:15px 25px;border-radius:7px;text-decoration:none;font-size:16px;font-weight:700">View My Personalised Quote</a></p>
      <h2 style="margin:26px 0 12px;color:#0b1d39;font:700 21px/1.25 Georgia,serif">How to claim the 20% saving</h2>
      <ol style="margin:0 0 20px;padding-left:22px;color:#334862;font-size:15px;line-height:1.75">
        <li>Open your personalised quote using the button above.</li>
        <li>Email <a href="mailto:${internalEmail}" style="color:#9b6f12">${internalEmail}</a> before ${deadline}, quoting <strong>${lead.referenceNumber}</strong>.</li>
        <li>We will send the discount code to use when you instruct.</li>
      </ol>
      <p style="margin:0 0 14px;color:#334862;font-size:15px;line-height:1.65">Your quote was prepared using your transaction details. Securing this offer now gives you time to move forward with a regulated conveyancing firm while the reduced legal fee is available.</p>
      <p style="margin:0;color:#7a5b15;font-size:14px;line-height:1.6"><strong>Important:</strong> this offer expires at 11:59pm on ${deadline}. Once it closes, the same reduction may no longer be available.</p>
    </div>
    <div style="padding:20px 26px;background:#eae4d9;border-radius:0 0 14px 14px;color:#526174;font-size:12px;line-height:1.55;text-align:center">If your circumstances have changed or you no longer need a quote, simply reply to this email and we will update our records.<br><br><strong style="color:#192b46">James Fellows</strong><br>Compare the Conveyancing Market</div>
  </div>
</body></html>`;
}

const results = [];
for (const lead of selection.recipients) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [lead.email],
      cc: [internalEmail],
      replyTo: internalEmail,
      subject: `Your exclusive 20% conveyancing saving ends ${deadline} (REF: ${lead.referenceNumber})`,
      text: emailText(lead),
      html: emailHtml(lead),
      tags: [{ name: "campaign", value: "petr-downward-50-20pct-september-2026" }],
    });
    if (error) throw new Error(error.message);
    results.push({ name: lead.fullName, email: lead.email, referenceNumber: lead.referenceNumber, status: "sent", id: data?.id ?? "unknown" });
  } catch (error) {
    results.push({ name: lead.fullName, email: lead.email, referenceNumber: lead.referenceNumber, status: "failed", error: error instanceof Error ? error.message : String(error) });
  }
}

await fs.writeFile("/tmp/petr-50-promo-send-results.json", JSON.stringify({
  campaign: selection.campaign,
  sentAt: new Date().toISOString(),
  deadline,
  results,
  excluded: selection.excluded,
}, null, 2));

console.log(JSON.stringify({
  sent: results.filter((result) => result.status === "sent").length,
  failed: results.filter((result) => result.status === "failed").length,
  results,
}, null, 2));

if (results.some((result) => result.status === "failed")) process.exitCode = 1;
