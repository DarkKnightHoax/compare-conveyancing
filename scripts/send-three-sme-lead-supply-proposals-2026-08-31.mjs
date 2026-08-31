import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = "James Fellows <noreply@comparetheconveyancingmarket.co.uk>";
const internalEmail = "info@comparetheconveyancingmarket.co.uk";
const firms = [
  {
    name: "The Partnership",
    email: "info@thepartnership.legal",
    subject: "Partnership enquiry — recent conveyancing enquiries at £9 per lead",
    opening: "after seeing your dedicated pathway for agents and referrers and your specialist property-law focus",
  },
  {
    name: "Juno Legal",
    email: "partnerships@juno.legal",
    subject: "Partnership enquiry — recent consented conveyancing leads",
    opening: "after seeing your dedicated partnerships route for estate-agent referrals",
  },
  {
    name: "Independent Property Lawyers",
    email: "enquiries@ipl-ltd.co.uk",
    subject: "Partnership enquiry — recent conveyancing enquiries at £9 per lead",
    opening: "after learning about your independent, relationship-led property practice and local estate-agent referrals",
  },
];

function textFor(firm) {
  return `Hello ${firm.name} team,

I am contacting you from Compare the Conveyancing Market ${firm.opening}.

We are exploring a referral partnership with a responsive UK conveyancing practice. We have capacity for up to 450 recent, consented conveyancing enquiries generated during the preceding two months, available at £9 per lead.

No customer information is attached to this email. We have been advised that each relevant customer has expressly consented to their enquiry being shared with suitable UK conveyancers. Before sharing any individual’s details, we would complete mutual due diligence and agree in writing the permitted purpose, data-security controls, retention period and suppression process.

We can begin with anonymised lead criteria and a small controlled pilot aligned to your location and matter-type coverage. We do not guarantee instructions or completions; the proposal is for recent enquiries for firms that can follow up promptly and compliantly.

If this could fit your current capacity, I would be pleased to arrange a brief discussion.

Kind regards,
James Fellows
Compare the Conveyancing Market
https://www.comparetheconveyancingmarket.co.uk

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
      cc: [internalEmail],
      replyTo: internalEmail,
      subject: firm.subject,
      text,
      html: htmlFor(text),
      tags: [{ name: "campaign", value: "sme-lead-supply-proposal-2026-08-31" }],
    });
    if (error) throw new Error(error.message);
    results.push({ firm: firm.name, email: firm.email, status: "sent", id: data?.id ?? "unknown" });
  } catch (error) {
    results.push({ firm: firm.name, email: firm.email, status: "failed", error: error instanceof Error ? error.message : String(error) });
  }
}

console.table(results);
if (results.some((result) => result.status === "failed")) process.exitCode = 1;
