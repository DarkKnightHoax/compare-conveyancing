import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = "James Fellows <noreply@comparetheconveyancingmarket.co.uk>";
const replyTo = "info@comparetheconveyancingmarket.co.uk";
const site = "https://www.comparetheconveyancingmarket.co.uk";

const messages = [
  {
    organisation: "HomeOwners Alliance",
    to: "katherine@hoa.org.uk",
    subject: "Free source-led conveyancing cost guide for your members",
    text: `Hello Katherine,

I am writing from Compare the Conveyancing Market. We have published a free, plain-English guide to help buyers and sellers understand what a conveyancing quote should include before they choose a firm.

The guide separates legal fees, VAT and third-party disbursements, and directs readers to the live GOV.UK, HMRC, HM Land Registry and Citizens Advice sources rather than repeating figures that may change. We hope it could be a useful supplementary resource for your homebuyer audience: ${site}/uk-conveyancing-cost-guide

If it is relevant to your work, we would be pleased to provide a short, non-promotional explainer or help shape a practical buyer/seller checklist. We understand that any editorial decision, including whether to reference the resource, is entirely yours.

Kind regards,
James Fellows
Compare the Conveyancing Market
${site}

If this is not relevant to your remit, please let us know and we will not follow up.`,
  },
  {
    organisation: "First Time Buyer Magazine",
    to: "sophie@firsttimebuyermag.co.uk",
    subject: "First-time buyer guide: comparing conveyancing costs without surprises",
    text: `Hello Sophie,

I am getting in touch with a practical first-time buyer content idea: how to read a conveyancing quote before instruction, including the difference between legal fees, VAT, searches, land-registration fees and Stamp Duty Land Tax.

We have created a source-led starting point that links readers to the relevant official guidance rather than presenting generic, potentially outdated pricing: ${site}/uk-conveyancing-cost-guide

If it would be useful, we can prepare a tailored, plain-English article for your readers on the questions to ask before choosing a conveyancer. It would be written for accuracy and reader value, without unsupported savings or speed claims. Naturally, we would be grateful for editorial consideration only where it is genuinely useful to your audience.

Kind regards,
James Fellows
Compare the Conveyancing Market
${site}

If this is not relevant to your remit, please let us know and we will not follow up.`,
  },
  {
    organisation: "Property Industry Eye",
    to: "editor@propertyindustryeye.com",
    subject: "Comment: helping sellers prepare earlier as home-buying reforms progress",
    text: `Hello Marc,

With the current focus on earlier property information, clearer consumer expectations and reducing avoidable delays in the home-moving process, Compare the Conveyancing Market has prepared a practical seller-side checklist for England and Wales.

It covers the documents, leasehold information and early conversations that can help a seller prepare before a buyer is found, and links to the live government and Law Society context: ${site}/seller-conveyancing-checklist

If you are covering the home-buying and selling reform roadmap, we would be happy to provide a concise, attributable comment on the practical value of clear upfront information and transparent quote explanations for sellers, buyers and estate agents. We appreciate that coverage and any reference to the resource are entirely editorial decisions.

Kind regards,
James Fellows
Compare the Conveyancing Market
${site}

If this is not relevant to your remit, please let us know and we will not follow up.`,
  },
];

const toHtml = (text) => text.split("\n\n").map((paragraph) => `<p style="margin:0 0 16px;color:#27364b;font:15px/1.6 Arial,sans-serif">${paragraph.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#b8862f">$1</a>')}</p>`).join("");

const results = [];
for (const message of messages) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [message.to],
      replyTo,
      subject: message.subject,
      text: message.text,
      html: `<div style="max-width:620px;margin:0 auto;padding:28px;background:#fbfaf7;border-top:5px solid #c9a84c">${toHtml(message.text)}</div>`,
      tags: [{ name: "campaign", value: "authority-outreach-2026-08-31" }],
    });

    if (error) throw new Error(error.message);
    results.push({ organisation: message.organisation, email: message.to, status: "sent", id: data?.id ?? "unknown" });
  } catch (error) {
    results.push({ organisation: message.organisation, email: message.to, status: "failed", error: error instanceof Error ? error.message : String(error) });
  }
}

console.table(results);
const failures = results.filter((result) => result.status === "failed");
if (failures.length) process.exitCode = 1;
