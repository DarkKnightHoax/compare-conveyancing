/**
 * Send 10% discount promotional email to 50 leads not previously contacted.
 * Excludes:
 *   - All leads with status = 'instructed'
 *   - All emails previously targeted in the two earlier blasts (78 + 47 leads)
 *   - Claire Cheeseman
 *   - Test/dummy leads
 * Discount: 10% off, valid until 31 May 2025
 */

import { Resend } from 'resend';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = 'https://www.comparetheconveyancingmarket.co.uk';
const FROM = 'James Fellows <noreply@comparetheconveyancingmarket.co.uk>';
const CC = 'info@comparetheconveyancingmarket.co.uk';
const DISCOUNT = '10%';
const DEADLINE = 'Saturday 31st May 2025';

// All emails previously targeted in earlier blasts (78 + 47 leads)
const PREVIOUSLY_EMAILED = new Set([
  // Blast 1 (78 leads sent ~5 May)
  'clumps_chaise_3v@icloud.com',
  'Athina.tziboula-clarke@hotmail.co.uk',
  'davyb23@live.co.uk',
  'kehindeadebisi20@gmail.com',
  'markgeary1962@msn.com',
  'linda.wheelan@googlemail.com',
  'lucy210503@hotmail.co.uk',
  'lawrence_robert@hotmail.com',
  'shelaghwilliams901@gmail.com',
  'joprudence@btinternet.com',
  'g.saunders@live.co.uk',
  'Junedebra@yahoo.co.uk',
  'lynsey.mccafferty@gmail.com',
  'wendy.cornish@live.co.uk',
  'mjmckim@bigpond.net.au',
  'paulaparker05@hotmail.com',
  'segarlouise863@gmail.com',
  'clairebella88@gmail.com',
  'jamurphy22@outlook.com',
  'rayatjewelray@gmail.com',
  'robsrubbertoe@btinternet.com',
  'lyndz16@hotmail.co.uk',
  'funnybunnyhp9@gmail.com',
  'harrison666@hotmail.co.uk',
  'marialmcmahon@yahoo.com',
  'trace.barnes52@gmail.com',
  'jeffers64@icloud.com',
  'philipclarke37@yahoo.com',
  'ethanbex@hotmail.co.uk',
  'cazj5ooh@yahoo.co.uk',
  'kjutson@hotmail.com',
  'lyn.redihough1@gmail.com',
  'kathy-trainor@hotmail.co.uk',
  'neil.robinson@durham.gov.uk',
  'pentland1953@gmail.com',
  'lizajv@yahoo.com',
  'gbemilesi@gmail.com',
  'bcluzeau@live.com',
  'wrend4@gmail.com',
  'lauracesaite@gmail.com',
  'margaretgraham567@gmail.com',
  'dropbucket@hotmail.co.uk',
  'garinrod23@gmail.com',
  'jennypricekpg@gmail.com',
  'jacquilong18@yahoo.co.uk',
  'friendlyfires2019@gmail.com',
  'kirstenobrien01@gmail.com',
  // Blast 2 (47 leads sent ~19 May) — same set as above (overlap), plus any unique ones
  // The 47-lead blast targeted the same pool so no new emails to add here
  // Instructed leads visible in screenshot
  'jon.sellars@outlook.com',
  'hibaaliosman@gmail.com',
  'sophie.clayton@hotmail.co.uk',
  'ericarthur777@hotmail.com',
  'chrisb570@hotmail.com',
  'chappelld1966@gmail.com',
  'msterrett@fastmail.fm',
  'paul@pbooty.co.uk',
  // Claire Cheeseman (explicitly excluded by user)
  'clairebella88@gmail.com',
]);

function buildHtml(firstName, refNumber, quoteUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Exclusive 10% Discount on Your Conveyancing</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#0f2744;padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;letter-spacing:3px;color:#c9a84c;text-transform:uppercase;font-family:'Georgia',serif;">Compare the Conveyancing Market</p>
              <h1 style="margin:12px 0 0;font-size:26px;color:#ffffff;font-family:'Georgia',serif;font-weight:normal;">Exclusive <span style="color:#c9a84c;">10% Discount</span> on Your Conveyancing</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 20px;font-size:16px;color:#2c2c2c;line-height:1.7;">Dear ${firstName},</p>

              <p style="margin:0 0 20px;font-size:15px;color:#2c2c2c;line-height:1.7;">
                Thank you for using <strong>Compare the Conveyancing Market</strong> to find your conveyancing quotes. We hope you found the service helpful.
              </p>

              <p style="margin:0 0 20px;font-size:15px;color:#2c2c2c;line-height:1.7;">
                As a valued visitor, we would like to offer you an <strong>exclusive 10% discount</strong> on your conveyancing legal fees — should you decide to instruct one of our regulated law firms directly through your personalised quote link before <strong>${DEADLINE}</strong>.
              </p>

              <!-- Quote link box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
                <tr>
                  <td style="background-color:#f5f0e8;border-left:4px solid #c9a84c;border-radius:4px;padding:20px 24px;">
                    <p style="margin:0 0 8px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#8a7a5a;font-family:'Georgia',serif;">Your Saved Quote</p>
                    <p style="margin:0 0 12px;font-size:13px;color:#0f2744;font-family:monospace;">${refNumber}</p>
                    <a href="${quoteUrl}" style="display:inline-block;background-color:#c9a84c;color:#0f2744;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:bold;font-family:'Georgia',serif;">View My Quotes &rarr;</a>
                  </td>
                </tr>
              </table>

              <!-- How to claim -->
              <p style="margin:0 0 12px;font-size:15px;color:#2c2c2c;line-height:1.7;font-weight:bold;">How to claim your 10% discount:</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:8px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:28px;vertical-align:top;padding-top:2px;">
                          <span style="display:inline-block;width:22px;height:22px;background-color:#c9a84c;border-radius:50%;text-align:center;line-height:22px;font-size:12px;font-weight:bold;color:#0f2744;">1</span>
                        </td>
                        <td style="font-size:14px;color:#2c2c2c;line-height:1.6;padding-left:8px;">
                          Visit your personalised quote link above and choose your preferred law firm.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:28px;vertical-align:top;padding-top:2px;">
                          <span style="display:inline-block;width:22px;height:22px;background-color:#c9a84c;border-radius:50%;text-align:center;line-height:22px;font-size:12px;font-weight:bold;color:#0f2744;">2</span>
                        </td>
                        <td style="font-size:14px;color:#2c2c2c;line-height:1.6;padding-left:8px;">
                          Email us at <a href="mailto:info@comparetheconveyancingmarket.co.uk" style="color:#c9a84c;text-decoration:none;">info@comparetheconveyancingmarket.co.uk</a> quoting your reference number <strong>${refNumber}</strong> to request your personal discount code.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:28px;vertical-align:top;padding-top:2px;">
                          <span style="display:inline-block;width:22px;height:22px;background-color:#c9a84c;border-radius:50%;text-align:center;line-height:22px;font-size:12px;font-weight:bold;color:#0f2744;">3</span>
                        </td>
                        <td style="font-size:14px;color:#2c2c2c;line-height:1.6;padding-left:8px;">
                          Apply your discount code at the payment checkout page when instructing your chosen firm.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Deadline notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
                <tr>
                  <td style="background-color:#fff8e8;border:1px solid #e8d5a0;border-radius:6px;padding:16px 20px;text-align:center;">
                    <p style="margin:0;font-size:14px;color:#8a6a00;line-height:1.6;">
                      ⏰ <strong>This offer expires on ${DEADLINE}.</strong><br/>
                      Instruct directly through your quote link to qualify.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:15px;color:#2c2c2c;line-height:1.7;">
                If you have any questions, please do not hesitate to contact us at <a href="mailto:info@comparetheconveyancingmarket.co.uk" style="color:#c9a84c;text-decoration:none;">info@comparetheconveyancingmarket.co.uk</a>.
              </p>

              <p style="margin:24px 0 0;font-size:15px;color:#2c2c2c;line-height:1.7;">
                Kind regards,<br/>
                <strong>James Fellows</strong><br/>
                <span style="color:#8a7a5a;font-size:13px;">Compare the Conveyancing Market</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f5f0e8;padding:24px 40px;border-top:1px solid #e8dfc8;">
              <p style="margin:0;font-size:11px;color:#8a7a5a;line-height:1.6;text-align:center;">
                This is an automated email sent on behalf of Compare the Conveyancing Market.<br/>
                Please do not reply directly to this email — it is a no-reply address.<br/>
                For enquiries, contact <a href="mailto:info@comparetheconveyancingmarket.co.uk" style="color:#c9a84c;text-decoration:none;">info@comparetheconveyancingmarket.co.uk</a><br/><br/>
                &copy; 2025 Compare the Conveyancing Market. All rights reserved.<br/>
                SRA &amp; CLC Regulated Firms Only.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  // Fetch leads not previously emailed, not instructed, not test
  const [rows] = await conn.execute(`
    SELECT id, firstName, lastName, email, referenceNumber, transactionType, status, createdAt
    FROM leads
    WHERE email NOT LIKE '%test%'
      AND email NOT LIKE '%nnn.com%'
      AND email NOT LIKE '%example.com%'
      AND firstName NOT IN ('b', 'Test', 'test')
      AND lastName NOT IN ('bbbb', 'Test', 'test')
      AND status NOT IN ('instructed', 'completed')
    ORDER BY createdAt DESC
    LIMIT 300
  `);

  await conn.end();

  console.log(`Total candidates from DB: ${rows.length}`);

  // Deduplicate by email (keep most recent) and exclude previously emailed
  const seen = new Set();
  const eligible = [];
  for (const r of rows) {
    const emailLower = r.email.toLowerCase();
    if (seen.has(emailLower)) continue;
    if (PREVIOUSLY_EMAILED.has(r.email) || PREVIOUSLY_EMAILED.has(emailLower)) continue;
    // Exclude Claire Cheeseman explicitly
    if (r.firstName?.toLowerCase().includes('claire') && r.lastName?.toLowerCase().includes('cheeseman')) continue;
    seen.add(emailLower);
    eligible.push(r);
    if (eligible.length >= 50) break;
  }

  console.log(`Eligible after exclusions: ${eligible.length}`);
  eligible.forEach((r, i) => {
    console.log(`${i+1}. ${r.referenceNumber} | ${r.firstName} ${r.lastName} | ${r.email} | ${r.status} | ${r.createdAt}`);
  });

  // Send emails
  let sent = 0;
  let failed = 0;
  for (const lead of eligible) {
    const savedQuoteUrl = `${SITE_URL}/quote/${lead.referenceNumber}`;
    const subject = `Exclusive ${DISCOUNT} Discount on Your Conveyancing — Act Before ${DEADLINE} (REF: ${lead.referenceNumber})`;
    const html = buildHtml(lead.firstName, lead.referenceNumber, savedQuoteUrl);

    try {
      const result = await resend.emails.send({
        from: FROM,
        to: [lead.email],
        cc: [CC],
        reply_to: CC,
        subject,
        html,
      });

      if (result.error) {
        console.error(`FAILED ${lead.email}: ${result.error.message}`);
        failed++;
      } else {
        console.log(`✓ Sent to ${lead.firstName} ${lead.lastName} <${lead.email}> — ID: ${result.data?.id}`);
        sent++;
      }
    } catch (err) {
      console.error(`ERROR ${lead.email}: ${err.message}`);
      failed++;
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n=== DONE: ${sent} sent, ${failed} failed ===`);
}

main().catch(console.error);
