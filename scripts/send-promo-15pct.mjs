import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = 'https://www.comparetheconveyancingmarket.co.uk';
const FROM = 'James Fellows <noreply@comparetheconveyancingmarket.co.uk>';
const CC = 'info@comparetheconveyancingmarket.co.uk';
const DEADLINE = 'Sunday 25th May 2025';
const DISCOUNT = '15%';

function buildHtml(firstName, refNumber, savedQuoteUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Exclusive ${DISCOUNT} Discount — Compare the Conveyancing Market</title>
  <style>
    body { margin:0; padding:0; background:#f5f0e8; font-family:'DM Sans',Arial,sans-serif; }
    .wrapper { max-width:600px; margin:32px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
    .header { background:#0f1f3d; padding:32px 40px 24px; text-align:center; }
    .header img { height:40px; }
    .header h1 { color:#fff; font-family:Georgia,serif; font-size:22px; margin:16px 0 4px; }
    .header p { color:#c9a84c; font-size:13px; margin:0; letter-spacing:0.5px; }
    .badge { background:#c9a84c; color:#0f1f3d; font-weight:700; font-size:13px; display:inline-block; padding:6px 18px; border-radius:20px; margin:20px 0 0; letter-spacing:0.5px; }
    .body { padding:36px 40px; }
    .body p { color:#2c2c2c; font-size:15px; line-height:1.7; margin:0 0 16px; }
    .highlight-box { background:#f5f0e8; border-left:4px solid #c9a84c; border-radius:6px; padding:18px 22px; margin:24px 0; }
    .highlight-box p { margin:0; font-size:14px; color:#2c2c2c; }
    .highlight-box strong { color:#0f1f3d; }
    .cta-btn { display:block; width:fit-content; margin:28px auto; background:#c9a84c; color:#0f1f3d !important; font-weight:700; font-size:15px; padding:14px 36px; border-radius:8px; text-decoration:none; letter-spacing:0.3px; }
    .steps { margin:24px 0; }
    .step { display:flex; gap:14px; align-items:flex-start; margin-bottom:14px; }
    .step-num { background:#0f1f3d; color:#c9a84c; font-weight:700; font-size:13px; border-radius:50%; width:26px; height:26px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .step-text { font-size:14px; color:#2c2c2c; line-height:1.6; padding-top:3px; }
    .divider { border:none; border-top:1px solid #e8e0d0; margin:28px 0; }
    .footer { background:#0f1f3d; padding:24px 40px; text-align:center; }
    .footer p { color:#8899aa; font-size:12px; margin:4px 0; line-height:1.6; }
    .footer a { color:#c9a84c; text-decoration:none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Compare the Conveyancing Market</h1>
      <p>SRA &amp; CLC Regulated Firms Only</p>
      <div class="badge">⭐ Exclusive ${DISCOUNT} Discount — Limited Time</div>
    </div>
    <div class="body">
      <p>Dear ${firstName},</p>
      <p>Thank you for using <strong>Compare the Conveyancing Market</strong> to explore your conveyancing options. We hope you found the quotes helpful.</p>
      <p>We wanted to reach out with an exclusive offer just for you — as a valued visitor, we are pleased to offer you a <strong>${DISCOUNT} discount</strong> on your conveyancing fees should you choose to instruct one of our regulated law firms directly through your personalised quote link.</p>

      <div class="highlight-box">
        <p><strong>🎁 Your Exclusive Offer</strong><br/>
        ${DISCOUNT} off your conveyancing legal fees when you instruct before <strong>${DEADLINE}</strong>.<br/>
        Simply email us to claim your personal discount code.</p>
      </div>

      <div class="steps">
        <div class="step">
          <div class="step-num">1</div>
          <div class="step-text">Click your personalised quote link below to view your saved quotes</div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div class="step-text">Email <a href="mailto:info@comparetheconveyancingmarket.co.uk" style="color:#0f1f3d;font-weight:600;">info@comparetheconveyancingmarket.co.uk</a> to request your ${DISCOUNT} discount code</div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div class="step-text">Enter your discount code at the payment checkout when instructing your chosen firm — saving you money from day one</div>
        </div>
      </div>

      <a href="${savedQuoteUrl}" class="cta-btn">View My Quotes &amp; Claim ${DISCOUNT} Off →</a>

      <hr class="divider"/>

      <p style="font-size:13px;color:#666;">Your quote reference: <strong>${refNumber}</strong><br/>
      This offer is valid until <strong>${DEADLINE}</strong> and applies when instructing any firm directly through your personalised link above.</p>

      <p>If you have any questions or would like to speak with our team, please do not hesitate to get in touch at <a href="mailto:info@comparetheconveyancingmarket.co.uk" style="color:#0f1f3d;font-weight:600;">info@comparetheconveyancingmarket.co.uk</a>.</p>

      <p>Warm regards,<br/><strong>James Fellows</strong><br/>Compare the Conveyancing Market</p>
    </div>
    <div class="footer">
      <p>This is an automated message — please do not reply directly to this email.</p>
      <p>To claim your discount, email <a href="mailto:info@comparetheconveyancingmarket.co.uk">info@comparetheconveyancingmarket.co.uk</a></p>
      <p style="margin-top:12px;"><a href="${SITE_URL}">comparetheconveyancingmarket.co.uk</a></p>
      <p>© 2025 Compare the Conveyancing Market. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);

  // Check distinct statuses first
  const [statuses] = await conn.execute('SELECT DISTINCT status FROM leads ORDER BY status');
  console.log('All statuses in DB:', statuses.map(s => s.status));

  // Fetch last 50 non-test, non-instructed leads (deduplicated by email)
  const [rows] = await conn.execute(`
    SELECT id, firstName, lastName, email, referenceNumber, transactionType, status, createdAt
    FROM leads
    WHERE email NOT LIKE '%test%'
      AND email NOT LIKE '%nnn.com%'
      AND email NOT LIKE '%example.com%'
      AND firstName NOT IN ('b', 'Test', 'test')
      AND lastName NOT IN ('bbbb', 'Test', 'test')
      AND status NOT IN ('instructed', 'completed', 'Instructed', 'Completed', 'instructed_directly')
    ORDER BY createdAt DESC
    LIMIT 50
  `);

  console.log(`Found ${rows.length} eligible leads`);

  // Deduplicate by email (keep most recent)
  const seen = new Set();
  const unique = [];
  for (const row of rows) {
    const emailLower = row.email.toLowerCase().trim();
    if (!seen.has(emailLower)) {
      seen.add(emailLower);
      unique.push(row);
    }
  }
  console.log(`After deduplication: ${unique.length} unique leads`);

  // Print list for review
  unique.forEach((r, i) => {
    console.log(`${i+1}. ${r.referenceNumber} | ${r.firstName} ${r.lastName} | ${r.email} | ${r.status} | ${r.createdAt}`);
  });

  // Send emails
  let sent = 0;
  let failed = 0;
  for (const lead of unique) {
    const savedQuoteUrl = `${SITE_URL}/quote/${lead.referenceNumber}`;
    const subject = `Exclusive ${DISCOUNT} Discount on Your Conveyancing — Act Before ${DEADLINE} (REF: ${lead.referenceNumber})`;
    const html = buildHtml(lead.firstName, lead.referenceNumber, savedQuoteUrl);

    try {
      const result = await resend.emails.send({
        from: FROM,
        to: lead.email.trim(),
        cc: CC,
        replyTo: CC,
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
    await new Promise(r => setTimeout(r, 200));
  }

  await conn.end();
  console.log(`\n=== DONE: ${sent} sent, ${failed} failed ===`);
}

main().catch(console.error);
