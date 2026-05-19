/**
 * One-time discount email blast
 * Sends a personalised 10% discount re-engagement email to the last 80 unique
 * non-test leads (most recent first), with their saved quote URL.
 * Excludes obvious test entries. Deduplicates by email.
 * CC: info@comparetheconveyancingmarket.co.uk
 */
import { createConnection } from 'mysql2/promise';
import { Resend } from 'resend';
import { config } from 'dotenv';
config();

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = 'https://www.comparetheconveyancingmarket.co.uk';
const CC_ADDRESS = 'info@comparetheconveyancingmarket.co.uk';
const DEADLINE = 'Sunday 11th May 2025';

// Test email addresses / names to skip
const TEST_EMAILS = new Set([
  'bbbb@nnn.com',
  'jane.smith@email.com',
]);

function transactionLabel(type) {
  switch (type) {
    case 'purchase': return 'property purchase';
    case 'sale': return 'property sale';
    case 'sale_purchase': return 'sale and purchase';
    case 'remortgage': return 'remortgage';
    default: return 'property transaction';
  }
}

function buildEmail(firstName, lastName, referenceNumber, transactionType) {
  const name = [firstName, lastName].filter(Boolean).join(' ').trim();
  const displayName = name || 'there';
  const quoteUrl = `${BASE_URL}/quote/${referenceNumber}`;
  const txLabel = transactionLabel(transactionType);
  const paddedRef = referenceNumber;

  const body = `
    <div style="font-family:'DM Sans',Arial,sans-serif;font-size:15px;color:#222;line-height:1.7;max-width:600px;">
      <!-- Do not reply notice -->
      <p style="margin:0 0 20px;font-size:14px;"><strong><em><u>Please do not reply to this message as this is a no-reply email address. Instead, please email us directly at <a href="mailto:${CC_ADDRESS}" style="color:#0f1f3d;">${CC_ADDRESS}</a></u></em></strong></p>

      <p style="margin:0 0 16px;">Dear ${displayName},<br/>I hope this email finds you well.</p>

      <p style="margin:0 0 16px;">Thank you for recently using Compare the Conveyancing Market to compare conveyancing quotes for your ${txLabel}. I wanted to reach out personally to let you know that, as a valued visitor, we are offering you an exclusive <strong>10% discount</strong> on your conveyancing fees — but only if you instruct one of our regulated law firms through your unique quote link before <strong>${DEADLINE}</strong>.</p>

      <p style="margin:0 0 16px;">To claim your 10% discount, simply reply to <a href="mailto:${CC_ADDRESS}" style="color:#0f1f3d;">${CC_ADDRESS}</a> asking for your personal discount code. Once you have it, you can apply it directly at the payment checkout when you instruct your chosen firm through the link below.</p>

      <p style="margin:0 0 8px;">Your saved quote is ready and waiting for you here:</p>
      <p style="margin:0 0 8px;"><a href="${quoteUrl}" style="color:#1a56db;font-weight:600;">${quoteUrl}</a></p>

      <p style="margin:0 0 16px;font-size:13px;color:#888;"><em>This exclusive offer expires on ${DEADLINE}. Discount applies to the legal fee element only and is subject to the firm's acceptance.</em></p>

      <p style="margin:0 0 32px;">If you have any questions or would like to discuss your options, please do not hesitate to get in touch — I am always happy to help.</p>

      <p style="margin:0 0 32px;">Kind regards,</p>

      <!-- Signature block -->
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:560px;">
        <tr>
          <td style="padding-bottom:4px;">
            <span style="font-size:22px;font-weight:700;color:#0f1f3d;font-family:'Playfair Display',Georgia,serif;">James Fellows</span>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom:16px;">
            <span style="font-size:13px;font-weight:700;color:#c9a84c;letter-spacing:1px;text-transform:uppercase;">Account Manager</span>
          </td>
        </tr>
        <tr>
          <td>
            <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
              <tr>
                <td style="width:110px;padding-right:20px;vertical-align:top;border-right:3px solid #0f1f3d;">
                  <div style="width:100px;height:100px;background:#c9a84c;border-radius:8px;overflow:hidden;">
                    <img src="https://d2xsxph8kpxj0f.cloudfront.net/109506846/5ZpoxzgLM5cycU3sThccK4/favicon-logo-v2-VpvW9vnDQBVjC9fgzHCMg6.png" alt="Compare the Conveyancing Market" width="100" height="100" style="border-radius:8px;display:block;object-fit:cover;" />
                  </div>
                </td>
                <td style="padding-left:20px;vertical-align:top;">
                  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                    <tr><td style="padding-bottom:6px;font-size:14px;color:#222;"><strong>Email</strong> &nbsp;|&nbsp; <a href="mailto:${CC_ADDRESS}" style="color:#222;text-decoration:none;">${CC_ADDRESS}</a></td></tr>
                    <tr><td style="padding-bottom:6px;font-size:14px;color:#222;"><strong>Direct</strong> &nbsp;|&nbsp; 0330 128 9488</td></tr>
                    <tr><td style="padding-bottom:10px;font-size:14px;color:#222;"><strong>Web</strong> &nbsp;|&nbsp; <a href="https://www.comparetheconveyancingmarket.co.uk" style="color:#222;text-decoration:none;">www.comparetheconveyancingmarket.co.uk</a></td></tr>
                    <tr><td style="padding-bottom:2px;font-size:14px;font-weight:700;color:#0f1f3d;">Compare the Conveyancing Market Ltd</td></tr>
                    <tr><td style="font-size:13px;color:#555;font-style:italic;">Helping clients compare conveyancing options with clarity, speed and confidence.</td></tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <hr style="border:none;border-top:1px solid #ddd;margin:24px 0;" />
      <p style="font-size:11px;color:#888;margin:0 0 6px;">Please do not send bank details or payment instructions by email without verbal confirmation through a trusted contact route.</p>
      <p style="font-size:11px;color:#888;margin:0;">This email and any attachments are intended only for the named recipient and may contain confidential business information. If you received it by mistake, please reply to let us know and then delete it. Views expressed in this email are those of the sender unless clearly stated otherwise on behalf of Compare the Conveyancing Market Ltd.</p>
    </div>`;

  return {
    from: 'James Fellows <noreply@comparetheconveyancingmarket.co.uk>',
    to: [/* filled per lead */],
    cc: [CC_ADDRESS],
    subject: `Exclusive 10% Discount on Your Conveyancing — Act Before ${DEADLINE} (REF: ${paddedRef})`,
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Compare the Conveyancing Market</title></head><body style="margin:0;padding:32px 16px;background:#ffffff;font-family:'DM Sans',Arial,sans-serif;">${body}</body></html>`,
  };
}

async function main() {
  const conn = await createConnection(process.env.DATABASE_URL);

  // Fetch last 80 unique non-test leads (most recent per email address)
  const [rows] = await conn.execute(`
    SELECT l.id, l.firstName, l.lastName, l.email, l.referenceNumber, l.transactionType, l.createdAt
    FROM leads l
    INNER JOIN (
      SELECT email, MAX(createdAt) as maxDate
      FROM leads
      WHERE email IS NOT NULL
        AND email != ''
        AND email NOT LIKE '%test%'
        AND email NOT LIKE '%example%'
        AND firstName NOT LIKE '%test%'
        AND lastName NOT LIKE '%test%'
      GROUP BY email
    ) dedup ON l.email = dedup.email AND l.createdAt = dedup.maxDate
    ORDER BY l.createdAt DESC
    LIMIT 80
  `);

  await conn.end();

  // Filter out known test entries
  const leads = rows.filter(r => !TEST_EMAILS.has(r.email.toLowerCase()));

  console.log(`Sending to ${leads.length} leads...`);

  let sent = 0;
  let failed = 0;
  const failures = [];

  for (const lead of leads) {
    const emailPayload = buildEmail(lead.firstName, lead.lastName, lead.referenceNumber, lead.transactionType);
    emailPayload.to = [lead.email];

    try {
      const result = await resend.emails.send(emailPayload);
      if (result.error) {
        console.error(`FAILED [${lead.referenceNumber}] ${lead.email}: ${result.error.message}`);
        failures.push({ ref: lead.referenceNumber, email: lead.email, error: result.error.message });
        failed++;
      } else {
        console.log(`SENT [${lead.referenceNumber}] ${lead.firstName} ${lead.lastName} <${lead.email}> — id: ${result.data?.id}`);
        sent++;
      }
    } catch (err) {
      console.error(`ERROR [${lead.referenceNumber}] ${lead.email}: ${err.message}`);
      failures.push({ ref: lead.referenceNumber, email: lead.email, error: err.message });
      failed++;
    }

    // Small delay to avoid rate limits (Resend allows 2 req/s on free tier)
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`\n=== DONE ===`);
  console.log(`Sent: ${sent} | Failed: ${failed}`);
  if (failures.length > 0) {
    console.log('\nFailed sends:');
    failures.forEach(f => console.log(`  ${f.ref} ${f.email}: ${f.error}`));
  }
}

main().catch(console.error);
