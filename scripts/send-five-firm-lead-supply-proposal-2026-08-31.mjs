import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = "James Fellows <noreply@comparetheconveyancingmarket.co.uk>";
const replyTo = "info@comparetheconveyancingmarket.co.uk";
const cc = "info@comparetheconveyancingmarket.co.uk";
const site = "https://www.comparetheconveyancingmarket.co.uk";

const firms = [
  { name: "AMB Legal", email: "enquiries@amb-legal.co.uk", detail: "your published property introducer partnership programme" },
  { name: "JP Goldman", email: "enquiries@jpgoldman.co.uk", detail: "your published conveyancing introducer programme" },
  { name: "EMG Solicitors", email: "enquiry@emgsolicitors.com", detail: "your published conveyancing introducer scheme" },
  { name: "JS Law", email: "enquiries@js-law.co.uk", detail: "your published introducer support and eWay programme" },
  { name: "MG Legal Solicitors", email: "enquiries@mglegal.co.uk", detail: "your published conveyancing referral-fee information" },
];

const subject = "Partnership proposal: up to 450 recent conveyancing enquiries at £9 per lead";

function textFor(firm) {
  return `Hello ${firm.name} team,

I am contacting you from Compare the Conveyancing Market after seeing ${firm.detail}.

We are exploring a referral partnership with a suitable UK conveyancing practice. We currently have capacity for up to 450 recent conveyancing enquiries, generated during the preceding two months, at £9 per lead.

The enquiries are from customers who have expressly consented to their details being shared with suitable regulated UK conveyancers. No customer data or lead list is attached to this email. We would share any individual’s details only after completing appropriate due diligence and a written agreement covering the permitted purpose, security, retention, suppression process and each party’s data-protection responsibilities.

The initial allocation would be tailored to your geographic coverage, matter types, lender-panel capability and operational capacity. We do not guarantee that any enquiry will instruct or complete; we are offering a recent enquiry source for firms that can follow up promptly and compliantly.

If this is of interest, please reply to arrange a short discussion. We can then provide anonymised lead criteria and discuss a suitable pilot or allocation structure.

Kind regards,
James Fellows
Compare the Conveyancing Market
${site}

If this is not relevant to your business, please let us know and we will not follow up.`;
}

function htmlFor(text) {
  const paragraphs = text.split("\n\n").map((paragraph) => paragraph
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#b8862f;text-decoration:underline">$1</a>'));
  return `<div style="max-width:620px;margin:0 auto;padding:32px;background:#fbfaf7;border-top:5px solid #c9a84c"><div style="font:15px/1.6 Arial,sans-serif;color:#27364b">${paragraphs.map((paragraph) => `<p style="margin:0 0 16px">${paragraph.replaceAll("\n", "<br>")}</p>`).join("")}</div></div>`;
}

const results = [];
for (const firm of firms) {
  const text = textFor(firm);
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [firm.email],
      cc: [cc],
      replyTo,
      subject,
      text,
      html: htmlFor(text),
      tags: [{ name: "campaign", value: "firm-lead-supply-proposal-2026-08-31" }],
    });
    if (error) throw new Error(error.message);
    results.push({ firm: firm.name, email: firm.email, status: "sent", id: data?.id ?? "unknown" });
  } catch (error) {
    results.push({ firm: firm.name, email: firm.email, status: "failed", error: error instanceof Error ? error.message : String(error) });
  }
}

console.table(results);
if (results.some((result) => result.status === "failed")) process.exitCode = 1;
