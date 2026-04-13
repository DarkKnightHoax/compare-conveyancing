import { Resend } from "resend";
import { ENV } from "./_core/env";

const resend = new Resend(ENV.resendApiKey);

const TO = "info@comparetheconveyancingmarket.co.uk";
const FROM = "noreply@comparetheconveyancingmarket.co.uk"; // Verified sending domain

// ─── Shared HTML wrapper ───────────────────────────────────────────────────────
function emailWrapper(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f1eb;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1eb;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#0f1f3d;padding:24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="color:#c9a84c;font-size:20px;font-weight:700;letter-spacing:-0.5px;">Compare</span>
                    <span style="color:#ffffff;font-size:14px;display:block;margin-top:2px;opacity:0.7;">the Conveyancing Market</span>
                  </td>
                  <td align="right">
                    <span style="background:#c9a84c;color:#0f1f3d;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;letter-spacing:0.5px;">NEW NOTIFICATION</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 8px;font-size:22px;color:#0f1f3d;font-weight:700;">${title}</h1>
              <div style="height:3px;width:48px;background:#c9a84c;border-radius:2px;margin-bottom:24px;"></div>
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f4f1eb;padding:20px 32px;border-top:1px solid #e8e3d8;">
              <p style="margin:0;font-size:12px;color:#888;text-align:center;">
                Compare the Conveyancing Market · Office 17699, 182-184 High Street North, East Ham, London E6 2JA<br/>
                <a href="https://www.comparetheconveyancingmarket.co.uk" style="color:#c9a84c;text-decoration:none;">www.comparetheconveyancingmarket.co.uk</a> · 0330 128 9488
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

function infoRow(label: string, value: string | number | undefined | null): string {
  if (!value && value !== 0) return "";
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid #f0ece4;width:40%;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;">${label}</td>
    <td style="padding:8px 0;border-bottom:1px solid #f0ece4;font-size:14px;color:#1a1a2e;font-weight:500;">${value}</td>
  </tr>`;
}

// ─── Fee Breakdown HTML helper ─────────────────────────────────────────────────
function fmt(n: number) { return '\u00a3' + (n || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

type LegBreakdownEmail = {
  label: string;
  propertyValue: number;
  legalFee: number;
  supplements: { name: string; price: number }[];
  disbursements: { name: string; price: number; includesVat: boolean }[];
  vat: number;
  totalIncVat: number;
  sdlt: number;
  landRegistryFee: number;
  grandTotal: number;
};

function buildLegHtml(leg: LegBreakdownEmail, bgColor: string): string {
  const supplementRows = (leg.supplements || []).map(s =>
    `<tr><td style="padding:4px 0;font-size:13px;color:#555;">+ ${s.name}</td><td style="padding:4px 0;font-size:13px;color:#555;text-align:right;">${fmt(s.price)}</td></tr>`
  ).join('');
  const disbRows = (leg.disbursements || []).map(d =>
    `<tr><td style="padding:4px 0;font-size:13px;color:#555;">${d.name}</td><td style="padding:4px 0;font-size:13px;color:#555;text-align:right;">${fmt(d.price)}</td></tr>`
  ).join('');
  const disbTotal = (leg.disbursements || []).reduce((s, d) => s + d.price, 0);
  return `
  <div style="background:${bgColor};border-radius:8px;padding:12px 14px;margin-bottom:10px;">
    <div style="font-size:12px;font-weight:700;color:#0f1f3d;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">${leg.label} — Property Value: ${fmt(leg.propertyValue)}</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <tr><td colspan="2" style="padding:4px 0 2px;font-size:11px;font-weight:700;color:#0f1f3d;text-transform:uppercase;letter-spacing:0.5px;">Legal Fees</td></tr>
      <tr><td style="padding:4px 0;font-size:13px;color:#555;">Base legal fee</td><td style="padding:4px 0;font-size:13px;color:#555;text-align:right;">${fmt(leg.legalFee)}</td></tr>
      ${supplementRows}
      <tr><td style="padding:4px 0;font-size:13px;color:#555;">VAT (20%)</td><td style="padding:4px 0;font-size:13px;color:#555;text-align:right;">${fmt(leg.vat)}</td></tr>
      <tr style="border-top:1px solid #ddd;"><td style="padding:6px 0 4px;font-size:13px;font-weight:700;color:#0f1f3d;">Total legal fees (inc. VAT)</td><td style="padding:6px 0 4px;font-size:13px;font-weight:700;color:#0f1f3d;text-align:right;">${fmt(leg.totalIncVat)}</td></tr>
      ${disbRows.length ? `
      <tr><td colspan="2" style="padding:10px 0 2px;font-size:11px;font-weight:700;color:#0f1f3d;text-transform:uppercase;letter-spacing:0.5px;">Disbursements</td></tr>
      ${disbRows}
      <tr style="border-top:1px solid #ddd;"><td style="padding:6px 0 4px;font-size:13px;font-weight:700;color:#0f1f3d;">Legal Fees + Disbursements</td><td style="padding:6px 0 4px;font-size:13px;font-weight:700;color:#0f1f3d;text-align:right;">${fmt(leg.totalIncVat + disbTotal)}</td></tr>` : ''}
      ${leg.sdlt > 0 ? `
      <tr><td colspan="2" style="padding:10px 0 2px;font-size:11px;font-weight:700;color:#0f1f3d;text-transform:uppercase;letter-spacing:0.5px;">Government Fees</td></tr>
      <tr><td style="padding:4px 0;font-size:13px;color:#555;">Stamp Duty Land Tax (SDLT)</td><td style="padding:4px 0;font-size:13px;color:#555;text-align:right;">${fmt(leg.sdlt)}</td></tr>
      <tr><td style="padding:4px 0;font-size:13px;color:#555;">Land Registry Fee</td><td style="padding:4px 0;font-size:13px;color:#555;text-align:right;">${fmt(leg.landRegistryFee)}</td></tr>` : ''}
      <tr style="border-top:1px solid #ddd;"><td style="padding:6px 0 4px;font-size:13px;font-weight:700;color:#0f1f3d;">Leg Grand Total</td><td style="padding:6px 0 4px;font-size:14px;font-weight:700;color:#c9a84c;text-align:right;">${fmt(leg.grandTotal)}</td></tr>
    </table>
  </div>`;
}

function buildFeeBreakdownHtml(snapshotJson: string): string {
  try {
    const quotes: Array<{
      firmName: string;
      firmLocation?: string;
      rating?: number;
      legalFee: number;
      supplements?: { name: string; price: number }[];
      vat: number;
      totalIncVat: number;
      disbursements?: { name: string; price: number; includesVat?: boolean }[];
      sdlt: number;
      landRegistry?: number;
      landRegistryFee?: number;
      total: number;
      purchaseBreakdown?: LegBreakdownEmail;
      saleBreakdown?: LegBreakdownEmail;
    }> = JSON.parse(snapshotJson);
    if (!Array.isArray(quotes) || quotes.length === 0) return "";

    const firmCards = quotes.map((q, idx) => {
      const isFirst = idx === 0;
      const lrFee = q.landRegistryFee ?? q.landRegistry ?? 0;

      // For sale_purchase: show two leg panels
      const hasTwoLegs = q.purchaseBreakdown && q.saleBreakdown;
      let feeSectionHtml = '';

      if (hasTwoLegs && q.purchaseBreakdown && q.saleBreakdown) {
        feeSectionHtml = `
          ${buildLegHtml(q.purchaseBreakdown, '#f0f4ff')}
          ${buildLegHtml(q.saleBreakdown, '#f4f8f0')}
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:4px;">
            <tr style="background:#0f1f3d;"><td style="padding:10px 12px;font-size:14px;font-weight:700;color:#ffffff;border-radius:0 0 0 6px;">Combined Grand Total</td><td style="padding:10px 12px;font-size:16px;font-weight:700;color:#c9a84c;text-align:right;border-radius:0 0 6px 0;">${fmt(q.total)}</td></tr>
          </table>`;
      } else {
        const disbTotal = (q.disbursements || []).reduce((s, d) => s + d.price, 0);
        const supplementRows = (q.supplements || []).map(s =>
          `<tr><td style="padding:4px 0;font-size:13px;color:#555;">+ ${s.name}</td><td style="padding:4px 0;font-size:13px;color:#555;text-align:right;">${fmt(s.price)}</td></tr>`
        ).join('');
        const disbRows = (q.disbursements || []).map(d =>
          `<tr><td style="padding:4px 0;font-size:13px;color:#555;">${d.name}</td><td style="padding:4px 0;font-size:13px;color:#555;text-align:right;">${fmt(d.price)}</td></tr>`
        ).join('');
        feeSectionHtml = `
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr><td colspan="2" style="padding:4px 0 2px;font-size:11px;font-weight:700;color:#0f1f3d;text-transform:uppercase;letter-spacing:0.5px;">Legal Fees</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:#555;">Base legal fee</td><td style="padding:4px 0;font-size:13px;color:#555;text-align:right;">${fmt(q.legalFee)}</td></tr>
            ${supplementRows}
            <tr><td style="padding:4px 0;font-size:13px;color:#555;">VAT (20%)</td><td style="padding:4px 0;font-size:13px;color:#555;text-align:right;">${fmt(q.vat)}</td></tr>
            <tr style="border-top:1px solid #e8e3d8;"><td style="padding:6px 0 4px;font-size:13px;font-weight:700;color:#0f1f3d;">Total legal fees (inc. VAT)</td><td style="padding:6px 0 4px;font-size:13px;font-weight:700;color:#0f1f3d;text-align:right;">${fmt(q.totalIncVat)}</td></tr>
            ${disbRows.length ? `
            <tr><td colspan="2" style="padding:10px 0 2px;font-size:11px;font-weight:700;color:#0f1f3d;text-transform:uppercase;letter-spacing:0.5px;">Disbursements</td></tr>
            ${disbRows}
            <tr style="border-top:1px solid #e8e3d8;"><td style="padding:6px 0 4px;font-size:13px;font-weight:700;color:#0f1f3d;">Legal Fees + Disbursements</td><td style="padding:6px 0 4px;font-size:13px;font-weight:700;color:#0f1f3d;text-align:right;">${fmt(q.totalIncVat + disbTotal)}</td></tr>` : ''}
            ${q.sdlt > 0 ? `
            <tr><td colspan="2" style="padding:10px 0 2px;font-size:11px;font-weight:700;color:#0f1f3d;text-transform:uppercase;letter-spacing:0.5px;">Government Fees</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:#555;">Stamp Duty Land Tax (SDLT)</td><td style="padding:4px 0;font-size:13px;color:#555;text-align:right;">${fmt(q.sdlt)}</td></tr>
            <tr><td style="padding:4px 0;font-size:13px;color:#555;">Land Registry Fee</td><td style="padding:4px 0;font-size:13px;color:#555;text-align:right;">${fmt(lrFee)}</td></tr>` : ''}
            <tr style="background:#0f1f3d;"><td style="padding:10px 12px;font-size:14px;font-weight:700;color:#ffffff;border-radius:0 0 0 6px;">Grand Total</td><td style="padding:10px 12px;font-size:16px;font-weight:700;color:#c9a84c;text-align:right;border-radius:0 0 6px 0;">${fmt(q.total)}</td></tr>
          </table>`;
      }

      return `
      <div style="margin-bottom:20px;border:${isFirst ? '2px solid #c9a84c' : '1px solid #e8e3d8'};border-radius:10px;overflow:hidden;">
        <div style="background:${isFirst ? '#0f1f3d' : '#f8f6f1'};padding:12px 16px;">
          <span style="font-size:15px;font-weight:700;color:${isFirst ? '#ffffff' : '#0f1f3d'};">${q.firmName}</span>
          ${q.firmLocation ? `<span style="font-size:12px;color:${isFirst ? '#c9a84c' : '#888'};margin-left:8px;">${q.firmLocation}</span>` : ''}
          ${isFirst ? '<span style="background:#c9a84c;color:#0f1f3d;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;margin-left:8px;">BEST VALUE</span>' : ''}
        </div>
        <div style="padding:14px 16px;">
          ${feeSectionHtml}
        </div>
      </div>`;
    }).join('');

    return `<div style="margin-top:28px;"><h3 style="margin:0 0 16px;font-size:17px;color:#0f1f3d;font-weight:700;">Your Personalised Fee Breakdown</h3>${firmCards}</div>`;
  } catch {
    return "";
  }
}

// ─── 1. New Lead (Quote Submitted) ────────────────────────────────────────────
export async function sendNewLeadEmail(lead: {
  name: string;
  email: string;
  phone?: string | null;
  transactionType: string;
  propertyValue?: number | null;
  propertyAddress?: string | null;
  mortgageLender?: string | null;
  hasMortgage?: boolean | null;
  isFirstTimeBuyer?: boolean | null;
  referenceNumber?: string | null;
  quoteUrl?: string | null;
  quoteSnapshot?: string | null;
}) {
  const body = `
    <p style="color:#555;font-size:14px;margin:0 0 20px;">A new quote request has been submitted on the website. Details below:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${lead.referenceNumber ? infoRow("Reference", lead.referenceNumber) : ""}
      ${infoRow("Name", lead.name)}
      ${infoRow("Email", lead.email)}
      ${infoRow("Phone", lead.phone)}
      ${infoRow("Transaction Type", lead.transactionType.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()))}
      ${infoRow("Property Value", lead.propertyValue ? `£${lead.propertyValue.toLocaleString()}` : null)}
      ${infoRow("Property Address", lead.propertyAddress)}
      ${infoRow("Mortgage Lender", lead.mortgageLender)}
      ${infoRow("First Time Buyer", lead.isFirstTimeBuyer ? "Yes" : lead.isFirstTimeBuyer === false ? "No" : null)}
    </table>
    ${lead.quoteUrl ? `<div style="margin-top:20px;padding:16px;background:#eff6ff;border-left:4px solid #3b82f6;border-radius:4px;"><p style="margin:0;font-size:13px;color:#1e40af;">View the customer's saved quote: <a href="${lead.quoteUrl}" style="color:#1e40af;font-weight:700;">${lead.quoteUrl}</a></p></div>` : ""}
    ${lead.quoteSnapshot ? buildFeeBreakdownHtml(lead.quoteSnapshot) : ""}
    <div style="margin-top:16px;padding:16px;background:#f0f9f4;border-left:4px solid #22c55e;border-radius:4px;">
      <p style="margin:0;font-size:13px;color:#166534;">View and manage this lead in the <a href="https://www.comparetheconveyancingmarket.co.uk/admin" style="color:#166534;font-weight:700;">Admin Panel</a>.</p>
    </div>`;

  return resend.emails.send({
    from: FROM,
    to: TO,
    subject: `🏠 New Quote Request — ${lead.name}${lead.referenceNumber ? ` [${lead.referenceNumber}]` : ""}`,
    html: emailWrapper("New Quote Request", body),
  });
}

// ─── 5. Quote Confirmation to Customer ────────────────────────────────────────
export async function sendQuoteEmail(quote: {
  name: string;
  email: string;
  referenceNumber: string;
  quoteUrl: string;
  transactionType: string;
  propertyValue: number;
  postcode: string;
  quoteSnapshot?: string | null;
}) {
  const txLabel = quote.transactionType.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const body = `
    <p style="color:#555;font-size:15px;margin:0 0 20px;">Thank you for using Compare the Conveyancing Market. Your personalised conveyancing quotes have been saved and are ready to view at any time.</p>
    <div style="margin:0 0 24px;padding:20px 24px;background:#0f1f3d;border-radius:10px;text-align:center;">
      <p style="margin:0 0 6px;font-size:12px;color:#c9a84c;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Your Reference Number</p>
      <p style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:2px;font-family:monospace;">${quote.referenceNumber}</p>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
      ${infoRow("Transaction", txLabel)}
      ${infoRow("Property Value", `£${quote.propertyValue.toLocaleString()}`)}
      ${infoRow("Postcode", quote.postcode)}
    </table>
    <div style="text-align:center;margin:28px 0;">
      <a href="${quote.quoteUrl}" style="display:inline-block;background:#c9a84c;color:#0f1f3d;font-size:15px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.3px;">View My Saved Quotes →</a>
    </div>
    ${quote.quoteSnapshot ? buildFeeBreakdownHtml(quote.quoteSnapshot) : ""}
    <p style="color:#888;font-size:13px;margin:24px 0 8px;">You can return to this link at any time to review your quotes, instruct a firm, or request a callback.</p>
    <p style="color:#888;font-size:13px;margin:0;">If you have any questions, please call us on <strong>0330 128 9488</strong> or email <a href="mailto:info@comparetheconveyancingmarket.co.uk" style="color:#c9a84c;">info@comparetheconveyancingmarket.co.uk</a>.</p>`;

  return resend.emails.send({
    from: FROM,
    to: quote.email,
    subject: `Your Conveyancing Quotes — Reference ${quote.referenceNumber}`,
    html: emailWrapper("Your Conveyancing Quotes", body),
  });
}

// ─── 2. New Callback Request ───────────────────────────────────────────────────
export async function sendNewCallbackEmail(cb: {
  name: string;
  phone: string;
  email?: string | null;
  preferredTime?: string | null;
  firmName?: string | null;
  notes?: string | null;
}) {
  const body = `
    <p style="color:#555;font-size:14px;margin:0 0 20px;">A client has requested a callback. Please contact them as soon as possible.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${infoRow("Name", cb.name)}
      ${infoRow("Phone", cb.phone)}
      ${infoRow("Email", cb.email)}
      ${infoRow("Preferred Time", cb.preferredTime)}
      ${infoRow("Firm Interested In", cb.firmName)}
      ${infoRow("Notes", cb.notes)}
    </table>
    <div style="margin-top:24px;padding:16px;background:#fff7ed;border-left:4px solid #f97316;border-radius:4px;">
      <p style="margin:0;font-size:13px;color:#9a3412;">Action required: Call <strong>${cb.name}</strong> on <strong>${cb.phone}</strong>${cb.preferredTime ? ` at their preferred time: ${cb.preferredTime}` : ""}.</p>
    </div>`;

  return resend.emails.send({
    from: FROM,
    to: TO,
    subject: `📞 Callback Request — ${cb.name}`,
    html: emailWrapper("Callback Request", body),
  });
}

// ─── 3. New Instruct Request ───────────────────────────────────────────────────
export async function sendNewInstructEmail(instr: {
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  firmName: string;
  transactionType: string;
  propertyAddress?: string | null;
  totalFee?: number | null;
  paymentOnAccount?: number | null;
}) {
  const body = `
    <p style="color:#555;font-size:14px;margin:0 0 20px;">A client has chosen to instruct a firm directly through the website.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${infoRow("Client Name", instr.clientName)}
      ${infoRow("Client Email", instr.clientEmail)}
      ${infoRow("Client Phone", instr.clientPhone)}
      ${infoRow("Firm Instructed", instr.firmName)}
      ${infoRow("Transaction Type", instr.transactionType.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()))}
      ${infoRow("Property Address", instr.propertyAddress)}
      ${infoRow("Total Quoted Fee", instr.totalFee ? `£${instr.totalFee.toLocaleString("en-GB", { minimumFractionDigits: 2 })}` : null)}
      ${infoRow("Payment on Account", instr.paymentOnAccount ? `£${instr.paymentOnAccount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}` : null)}
    </table>
    <div style="margin-top:24px;padding:16px;background:#eff6ff;border-left:4px solid #3b82f6;border-radius:4px;">
      <p style="margin:0;font-size:13px;color:#1e40af;">Please follow up with <strong>${instr.firmName}</strong> to confirm the instruction and onboard the client.</p>
    </div>`;

  return resend.emails.send({
    from: FROM,
    to: TO,
    subject: `✅ New Instruction — ${instr.clientName} → ${instr.firmName}`,
    html: emailWrapper("New Instruction Request", body),
  });
}

// ─── 4. Contact Form Submission ────────────────────────────────────────────────
export async function sendContactFormEmail(contact: {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}) {
  const body = `
    <p style="color:#555;font-size:14px;margin:0 0 20px;">A new enquiry has been submitted via the Contact Us page.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${infoRow("Name", contact.name)}
      ${infoRow("Email", contact.email)}
      ${infoRow("Phone", contact.phone)}
      ${infoRow("Subject", contact.subject)}
    </table>
    <div style="margin-top:20px;padding:16px;background:#f9f9f9;border:1px solid #e8e3d8;border-radius:8px;">
      <p style="margin:0 0 8px;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:0.4px;">Message</p>
      <p style="margin:0;font-size:14px;color:#1a1a2e;line-height:1.6;">${contact.message.replace(/\n/g, "<br/>")}</p>
    </div>
    <div style="margin-top:16px;padding:12px 16px;background:#f0f9f4;border-left:4px solid #22c55e;border-radius:4px;">
      <p style="margin:0;font-size:13px;color:#166534;">Reply directly to <a href="mailto:${contact.email}" style="color:#166534;font-weight:700;">${contact.email}</a> to respond to this enquiry.</p>
    </div>`;

  return resend.emails.send({
    from: FROM,
    to: TO,
    subject: `✉️ Contact Enquiry — ${contact.name}`,
    html: emailWrapper("New Contact Enquiry", body),
  });
}

// ─── 6. James Fellows Follow-Up Email to Customer ─────────────────────────────
export async function sendJamesFellowsFollowUpEmail(params: {
  name: string;           // e.g. "Kerry Herbert"
  email: string;
  referenceNumber: string;
  quoteUrl: string;
  transactionType: string; // 'purchase' | 'sale' | 'sale_purchase' | 'remortgage'
  propertyValue: number;   // purchase price (or single property value)
  tenure?: string;         // 'freehold' | 'leasehold'
  salePropertyValue?: number; // sale price for sale_purchase
  saleTenure?: string;        // sale tenure for sale_purchase
}) {
  const {
    name, email, referenceNumber, quoteUrl,
    transactionType, propertyValue, tenure,
    salePropertyValue, saleTenure,
  } = params;

  // Build the transaction sentence matching the email sample
  let transactionSentence = '';
  if (transactionType === 'purchase') {
    const tenureLabel = tenure === 'leasehold' ? 'leasehold' : 'freehold';
    transactionSentence = `I have noticed that you were interested to get a free conveyancing quote on the purchase of a ${tenureLabel} property for £${propertyValue.toLocaleString()}.`;
  } else if (transactionType === 'sale') {
    const tenureLabel = tenure === 'leasehold' ? 'leasehold' : 'freehold';
    transactionSentence = `I have noticed that you were interested to get a free conveyancing quote on the sale of your ${tenureLabel} property for £${propertyValue.toLocaleString()}.`;
  } else if (transactionType === 'sale_purchase') {
    const pTenure = tenure === 'leasehold' ? 'leasehold' : 'freehold';
    const sTenure = saleTenure === 'leasehold' ? 'leasehold' : 'freehold';
    const salePrice = salePropertyValue ?? propertyValue;
    transactionSentence = `I have noticed that you were interested to get a free conveyancing quote on the purchase of a ${pTenure} property for £${propertyValue.toLocaleString()} and on the sale of your ${sTenure} property for £${salePrice.toLocaleString()}.`;
  } else if (transactionType === 'remortgage') {
    transactionSentence = `I have noticed that you were interested to get a free conveyancing quote on a remortgage for £${propertyValue.toLocaleString()}.`;
  }

  const refNum = referenceNumber.replace(/^CCM-\d{4}-/, '').replace(/^0+/, '');
  const paddedRef = referenceNumber;

  const body = `
    <div style="font-family:'DM Sans',Arial,sans-serif;font-size:15px;color:#222;line-height:1.7;max-width:600px;">

      <!-- Do not reply notice -->
      <p style="margin:0 0 20px;font-size:14px;"><strong><em><u>Please do not reply to this message as this is a no-reply email address. Instead, please email us directly at <a href="mailto:info@comparetheconveyancingmarket.co.uk" style="color:#0f1f3d;">info@comparetheconveyancingmarket.co.uk</a></u></em></strong></p>

      <p style="margin:0 0 16px;">Dear ${name},<br/>I hope this email finds you well.</p>

      <p style="margin:0 0 16px;">${transactionSentence}<br/>
      May I ask if any of our listed law firms have caught your attention? Would you like to proceed to instruct with us later on?</p>

      <p style="margin:0 0 8px;">You can access your saved quote from the link provided down below as well:</p>
      <p style="margin:0 0 24px;"><a href="${quoteUrl}" style="color:#1a56db;">${quoteUrl}</a></p>

      <p style="margin:0 0 32px;">Regards,</p>

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
                  <div style="width:100px;height:100px;background:#c9a84c;border-radius:8px;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;">
                    <img src="https://d2xsxph8kpxj0f.cloudfront.net/109506846/5ZpoxzgLM5cycU3sThccK4/favicon-logo-v2-VpvW9vnDQBVjC9fgzHCMg6.png" alt="Compare the Conveyancing Market" width="100" height="100" style="border-radius:8px;display:block;object-fit:cover;" />
                  </div>
                </td>
                <td style="padding-left:20px;vertical-align:top;">
                  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                    <tr><td style="padding-bottom:6px;font-size:14px;color:#222;"><strong>Email</strong> &nbsp;|&nbsp; <a href="mailto:info@comparetheconveyancingmarket.co.uk" style="color:#222;text-decoration:none;">info@comparetheconveyancingmarket.co.uk</a></td></tr>
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

  return resend.emails.send({
    from: 'James Fellows <noreply@comparetheconveyancingmarket.co.uk>',
    to: email,
    subject: `Compare the Conveyancing Market (REF: ${paddedRef})`,
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>Compare the Conveyancing Market</title></head><body style="margin:0;padding:32px 16px;background:#ffffff;font-family:'DM Sans',Arial,sans-serif;">${body}</body></html>`,
  });
}
