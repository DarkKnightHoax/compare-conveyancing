import 'dotenv/config';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const SITE_BASE = 'https://www.comparetheconveyancingmarket.co.uk';

// Sharon Scott has two refs (00326, 00327) — same email, send once with the later ref
const targets = [
  { ref: 'CCM-2026-00327', firstName: 'Sharon',  lastName: 'Scott',   email: 'Sharon2premier@hotmail.co.uk' },
  { ref: 'CCM-2026-00328', firstName: 'Chris',   lastName: 'Davies',  email: 'chrisd0924@gmail.com' },
  { ref: 'CCM-2026-00330', firstName: 'Sarah',   lastName: 'Lauwers', email: 'lauwerssarah@hotmail.com' },
  { ref: 'CCM-2026-00332', firstName: 'Richard', lastName: 'Swan',    email: 'rswan11@btinternet.com' },
  { ref: 'CCM-2026-00333', firstName: 'Gall',    lastName: 'Sworn',   email: 'gall.sworn_0f@icloud.com' },
  { ref: 'CCM-2026-00335', firstName: 'John',    lastName: 'Black',   email: 'tsherwood@sky.com' },
];

console.log(`Sending 10% promo (valid until 2 June 2025) to ${targets.length} leads:`);
targets.forEach((r, i) => console.log(`  ${i+1}. ${r.ref} | ${r.firstName} ${r.lastName} | ${r.email}`));
console.log('');

let sent = 0, failed = 0;

for (const lead of targets) {
  const { firstName, lastName, ref, email } = lead;
  const quoteLink = `${SITE_BASE}/quote/${ref}`;
  const subject = `Exclusive 10% Discount on Your Conveyancing — Act Before Monday 2nd June 2025 (REF: ${ref})`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a2744 0%,#243560 100%);padding:40px 40px 32px;text-align:center;">
              <div style="margin-bottom:16px;">
                <span style="color:#ffffff;font-size:20px;font-weight:700;font-family:'Playfair Display',Georgia,serif;">Compare the Conveyancing Market</span>
              </div>
              <div style="background:rgba(201,168,76,0.15);border:1px solid rgba(201,168,76,0.4);border-radius:20px;display:inline-block;padding:6px 16px;margin-top:4px;">
                <span style="color:#c9a84c;font-size:12px;font-weight:600;letter-spacing:0.5px;">&#9733; EXCLUSIVE LIMITED-TIME OFFER</span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="color:#1a2744;font-size:26px;font-weight:700;margin:0 0 16px;font-family:'Playfair Display',Georgia,serif;">
                Dear ${firstName},
              </h1>
              <p style="color:#4a5568;font-size:15px;line-height:1.7;margin:0 0 20px;">
                Thank you for using <strong>Compare the Conveyancing Market</strong> to explore your conveyancing options. We hope you found the quotes helpful.
              </p>
              <p style="color:#4a5568;font-size:15px;line-height:1.7;margin:0 0 24px;">
                As a valued visitor, we'd like to offer you an <strong style="color:#1a2744;">exclusive 10% discount</strong> on your legal fees if you instruct one of our regulated conveyancing firms directly through your personalised quote link before <strong style="color:#c9a84c;">Monday 2nd June 2025</strong>.
              </p>

              <!-- Discount badge -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:linear-gradient(135deg,#1a2744,#243560);border-radius:12px;padding:28px;text-align:center;">
                    <div style="color:#c9a84c;font-size:48px;font-weight:800;line-height:1;font-family:'Playfair Display',Georgia,serif;">10% OFF</div>
                    <div style="color:#ffffff;font-size:13px;margin-top:8px;opacity:0.85;">Your Legal Fees &mdash; Valid Until Monday 2nd June 2025</div>
                  </td>
                </tr>
              </table>

              <!-- How to claim -->
              <h2 style="color:#1a2744;font-size:17px;font-weight:700;margin:0 0 16px;font-family:'Playfair Display',Georgia,serif;">How to Claim Your Discount</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:0 0 14px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#c9a84c;color:#1a2744;font-weight:700;font-size:13px;width:28px;height:28px;border-radius:50%;text-align:center;vertical-align:middle;padding:0;min-width:28px;">1</td>
                        <td style="padding-left:12px;color:#4a5568;font-size:14px;line-height:1.6;">Visit your personalised quote page using the button below</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 14px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#c9a84c;color:#1a2744;font-weight:700;font-size:13px;width:28px;height:28px;border-radius:50%;text-align:center;vertical-align:middle;padding:0;min-width:28px;">2</td>
                        <td style="padding-left:12px;color:#4a5568;font-size:14px;line-height:1.6;">Email us at <a href="mailto:info@comparetheconveyancingmarket.co.uk" style="color:#c9a84c;font-weight:600;">info@comparetheconveyancingmarket.co.uk</a> to request your personal discount code</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 14px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#c9a84c;color:#1a2744;font-weight:700;font-size:13px;width:28px;height:28px;border-radius:50%;text-align:center;vertical-align:middle;padding:0;min-width:28px;">3</td>
                        <td style="padding-left:12px;color:#4a5568;font-size:14px;line-height:1.6;">Apply your discount code at the payment checkout when instructing your chosen firm</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${quoteLink}" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#b8962a);color:#1a2744;font-size:16px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:10px;font-family:'DM Sans',Arial,sans-serif;">
                      View My Quotes &amp; Claim Discount &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#4a5568;font-size:14px;line-height:1.7;margin:0 0 8px;">
                Your reference number: <strong style="color:#1a2744;">${ref}</strong>
              </p>
              <p style="color:#718096;font-size:13px;line-height:1.7;margin:0 0 24px;">
                This offer is valid until <strong>Monday 2nd June 2025</strong> and applies to legal fees only when instructing directly through your personalised quote link.
              </p>

              <hr style="border:none;border-top:1px solid #e2d9c8;margin:24px 0;">

              <p style="color:#4a5568;font-size:14px;line-height:1.7;margin:0;">
                Warm regards,<br>
                <strong style="color:#1a2744;">James Fellows</strong><br>
                <span style="color:#718096;">Compare the Conveyancing Market</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f5f0e8;padding:24px 40px;border-top:1px solid #e2d9c8;">
              <p style="color:#a0aec0;font-size:11px;line-height:1.6;margin:0;text-align:center;">
                <em><strong>Please do not reply directly to this email.</strong></em><br>
                For any enquiries or to claim your discount, please contact us at
                <a href="mailto:info@comparetheconveyancingmarket.co.uk" style="color:#c9a84c;">info@comparetheconveyancingmarket.co.uk</a>.<br><br>
                &copy; 2025 Compare the Conveyancing Market. All rights reserved.<br>
                Regulated firms only &middot; SRA &amp; CLC regulated &middot; comparetheconveyancingmarket.co.uk
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const result = await resend.emails.send({
      from: 'James Fellows <noreply@comparetheconveyancingmarket.co.uk>',
      to: [email],
      cc: ['info@comparetheconveyancingmarket.co.uk'],
      reply_to: 'info@comparetheconveyancingmarket.co.uk',
      subject,
      html,
    });
    if (result.error) {
      console.error(`✗ Failed ${email}: ${result.error.message}`);
      failed++;
    } else {
      console.log(`✓ Sent to ${firstName} ${lastName} <${email}> (${ref}) — ID: ${result.data?.id}`);
      sent++;
    }
  } catch (e) {
    console.error(`✗ Error ${email}: ${e.message}`);
    failed++;
  }

  // Small delay to avoid rate limiting
  await new Promise(r => setTimeout(r, 400));
}

console.log(`\n=== DONE: ${sent} sent, ${failed} failed ===`);
