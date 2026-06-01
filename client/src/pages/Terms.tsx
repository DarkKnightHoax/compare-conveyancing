/*
 * TERMS & CONDITIONS PAGE
 * Design: British Legal Prestige — Navy + Gold + Parchment
 */

import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Terms() {
  const [, navigate] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "1. About Us",
      content: `Compare the Conveyancing Market Ltd ("we", "us", "our", "the Company") is a company registered in England and Wales. We operate the website comparetheconveyancingmarket.co.uk (the "Website") and provide an online platform that enables consumers to obtain and compare conveyancing quotes from regulated law firms and licensed conveyancers (the "Service").

We are an introducer only. We do not provide legal advice, and we are not regulated by the Solicitors Regulation Authority (SRA) or the Council for Licensed Conveyancers (CLC). All legal services are provided directly by the law firms and conveyancers on our panel, each of which is independently regulated.`,
    },
    {
      title: "2. Acceptance of Terms",
      content: `By accessing or using our Website or Service, you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, you must not use our Website or Service.

These Terms constitute a legally binding contract between you and Compare the Conveyancing Market Ltd, governed by the laws of England and Wales. We reserve the right to amend these Terms at any time. Continued use of the Website following any amendment constitutes your acceptance of the revised Terms. It is your responsibility to check these Terms periodically for changes.`,
    },
    {
      title: "3. The Service",
      content: `Our Service enables you to:

• Input details of your property transaction via our online quote wizard
• Receive personalised conveyancing quotes from our panel of regulated firms
• Compare quotes by price, rating, and other criteria
• Instruct a firm of your choice directly through our platform
• Make a payment on account to initiate your instruction
• Request a callback from one of our advisers

The quotes provided through our Service are based on the information you supply. It is your responsibility to ensure that the information you provide is accurate and complete. We accept no liability for quotes that are inaccurate as a result of information you have provided incorrectly or incompletely.`,
    },
    {
      title: "4. Exclusive Pricing",
      content: `The fees displayed on our Website are exclusive rates negotiated by Compare the Conveyancing Market with our panel firms. These rates are available only to clients who instruct through our platform. They are not available if you approach a panel firm directly.

By instructing through our platform, you acknowledge that the quoted fees are conditional upon instruction being placed via Compare the Conveyancing Market. Direct instruction to any panel firm will not entitle you to the rates shown on our Website.`,
    },
    {
      title: "5. Our Role as Introducer",
      content: `We act solely as an introducer between you and the law firm or licensed conveyancer you select. Once you have instructed a firm through our platform:

• Your legal relationship is directly with that firm, not with us
• The firm is solely responsible for the legal services provided to you
• Any complaints regarding the legal services should be directed to the firm in the first instance, and thereafter to the SRA or CLC as appropriate
• We receive a referral fee from the firm you instruct, which is already included in the quoted price

We do not guarantee the quality, timeliness, or outcome of any legal services provided by panel firms.`,
    },
    {
      title: "6. Payment on Account — Terms, Conditions and Strict No-Refund Policy",
      content: `6.1 Nature of Payment on Account

When you instruct a firm through our platform, you are required to make an initial payment on account ("Payment on Account"). This payment is processed immediately upon instruction and is applied against the legal fees payable to the instructed firm. The Payment on Account is not a fee charged by Compare the Conveyancing Market; it is a payment to the instructed law firm to commence work on your behalf.

6.2 Commencement of Services

By completing payment and submitting your instruction through our platform, you expressly acknowledge and agree that:

(a) You are requesting the immediate commencement of conveyancing services by the instructed firm;

(b) The instructed firm will begin work on your matter immediately upon receipt of your instruction and payment, including but not limited to: opening your file, conducting identity and anti-money laundering (AML) checks, reviewing your matter details, and allocating a qualified fee earner to your case;

(c) Under Regulation 36 of the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 (SI 2013/3134), where a consumer requests that performance of a service contract begins during the cancellation period, and the service is fully performed, the right to cancel is extinguished. By requesting immediate commencement of services, you acknowledge that your statutory cancellation rights under these Regulations are reduced or extinguished accordingly;

(d) The Consumer Rights Act 2015 does not confer any right to a refund where services have been commenced or performed at your express request.

6.3 Absolute No-Refund Policy

ALL PAYMENTS ON ACCOUNT ARE STRICTLY NON-REFUNDABLE once your instruction has been submitted and payment has been processed. This policy applies in all circumstances, including but not limited to:

(a) Change of mind — if you decide you no longer wish to proceed with your property transaction or with the instructed firm after payment has been made;

(b) Change of circumstances — including but not limited to the sale or purchase falling through, a change in property, a change in mortgage lender, or any other change in your personal or financial circumstances;

(c) Dissatisfaction with the service — if you are dissatisfied with the service provided by the instructed firm, your remedy is a complaint to that firm and/or to the SRA or CLC, not a chargeback or refund of the Payment on Account;

(d) Failure to proceed — if you fail to provide the instructed firm with the information or documentation required to progress your matter;

(e) Duplicate or erroneous submissions — it is your responsibility to ensure you submit only one instruction. If you submit more than one instruction in error, you must contact us immediately at info@comparetheconveyancingmarket.co.uk. We will use reasonable endeavours to assist, but we cannot guarantee a refund in such circumstances.

6.4 Legal Basis for No-Refund Policy

This no-refund policy is lawful and enforceable under English law on the following grounds:

(a) Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 (SI 2013/3134), Regulation 36(1): where a consumer has expressly requested commencement of services during the cancellation period, and services have been fully performed, the right to cancel is lost;

(b) Consumer Rights Act 2015, Section 54: the right to a price reduction or refund for services arises only where the trader has breached the statutory right to perform the service with reasonable care and skill, or within a reasonable time. No such breach occurs merely because you have changed your mind or your circumstances have changed;

(c) The Payment Services Regulations 2017 (SI 2017/752): a payment transaction is authorised when you provide your consent to the payment. Once authorised, you have no automatic right to a refund of an authorised payment under these Regulations;

(d) The Financial Services (Distance Marketing) Regulations 2004 do not apply to the provision of legal services of this nature.

6.5 Chargebacks and Disputes

You agree that you will not initiate a chargeback, dispute, or reversal of any Payment on Account with your card issuer, bank, or payment processor (including but not limited to Stripe, Visa, Mastercard, or American Express) on the basis of:

(a) Change of mind;
(b) Services not received, where services have in fact been commenced;
(c) Dissatisfaction with the outcome of your property transaction;
(d) Any dispute with the instructed law firm that does not constitute a failure by Compare the Conveyancing Market to deliver the introducer service.

By making a Payment on Account, you expressly acknowledge that the payment is for services that have been or will immediately be commenced, and that initiating a chargeback in the circumstances described above would constitute a misrepresentation to your card issuer.

We reserve the right to contest any chargeback or dispute raised in contravention of this clause, and to provide your card issuer or payment processor with a full copy of these Terms, your instruction record, your payment confirmation, and evidence of the services commenced, as permitted under the Payment Services Regulations 2017 and applicable card scheme rules.

6.6 Complaints

If you have a complaint about the Payment on Account or the instruction process, you must contact us in writing at info@comparetheconveyancingmarket.co.uk before initiating any chargeback or dispute. We will acknowledge your complaint within 5 business days and endeavour to resolve it within 28 days. Failure to follow this complaints procedure before initiating a chargeback will be taken into account in any subsequent dispute resolution process.`,
    },
    {
      title: "7. Cancellation Rights",
      content: `7.1 Statutory Cancellation Period

Under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, you ordinarily have a 14-day cancellation period for distance contracts. However, by submitting your instruction and making a Payment on Account through our platform, you expressly request that services commence immediately, and you acknowledge that:

(a) If the services are fully performed within the cancellation period, your right to cancel is extinguished (Regulation 36(1));

(b) If the services are partially performed within the cancellation period and you exercise your right to cancel, you remain liable to pay for the proportion of services supplied up to the point of cancellation, which may equal or exceed the Payment on Account already made (Regulation 36(2)).

7.2 How to Cancel

If you wish to cancel your instruction before services have commenced, you must notify us immediately by email at info@comparetheconveyancingmarket.co.uk with the subject line "CANCELLATION — [Your Reference Number]". Cancellation requests are only effective from the time they are received by us. We cannot guarantee that a cancellation request will be actioned before services commence.

7.3 Effect of Cancellation

Where a valid cancellation is received before any services have commenced, we will use reasonable endeavours to facilitate a refund of the Payment on Account, less any administrative processing fees. Where services have already commenced, no refund will be due in accordance with Clause 6.3 above.`,
    },
    {
      title: "8. Intellectual Property",
      content: `All content on our Website, including but not limited to text, graphics, logos, images, and software, is the property of Compare the Conveyancing Market Ltd or its content suppliers and is protected by UK and international copyright laws under the Copyright, Designs and Patents Act 1988.

You may not reproduce, distribute, modify, or create derivative works from any content on our Website without our prior written consent.`,
    },
    {
      title: "9. Limitation of Liability",
      content: `To the fullest extent permitted by law, including the Consumer Rights Act 2015 and the Unfair Contract Terms Act 1977, we exclude all liability for:

• Any loss or damage arising from your use of, or inability to use, our Website or Service
• Any inaccuracy in the quotes provided through our Service
• Any acts or omissions of the law firms or conveyancers on our panel
• Any indirect, consequential, or special loss or damage
• Any loss arising from your property transaction not proceeding to completion

Nothing in these Terms excludes or limits our liability for death or personal injury caused by our negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be excluded or limited by English law.

Our total aggregate liability to you in connection with these Terms shall not exceed the amount of the Payment on Account made by you.`,
    },
    {
      title: "10. Data Protection",
      content: `We process your personal data in accordance with our Privacy Policy and the UK General Data Protection Regulation (UK GDPR) as retained in UK law by the European Union (Withdrawal) Act 2018, and the Data Protection Act 2018. By using our Service, you consent to the processing of your personal data as described in our Privacy Policy.

Your personal data may be shared with the instructed law firm for the purposes of providing the legal services you have requested. We will not share your data with third parties for marketing purposes without your consent.`,
    },
    {
      title: "11. Governing Law and Jurisdiction",
      content: `These Terms and any dispute or claim arising out of or in connection with them (including non-contractual disputes or claims) shall be governed by and construed in accordance with the law of England and Wales.

You agree to submit to the exclusive jurisdiction of the courts of England and Wales to settle any dispute or claim arising out of or in connection with these Terms or their subject matter or formation.

For the avoidance of doubt, any dispute regarding a Payment on Account, chargeback, or refund shall be subject to the exclusive jurisdiction of the courts of England and Wales, and the applicable law shall be English law.`,
    },
    {
      title: "12. Contact",
      content: `If you have any questions about these Terms, or wish to make a complaint or cancellation request, please contact us at:

Email: info@comparetheconveyancingmarket.co.uk
Post: Compare the Conveyancing Market Ltd, Office 17699, 182-184 High Street North, East Ham, London E6 2JA

For legal notices: legal@comparetheconveyancingmarket.co.uk`,
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.975 0.008 80)" }}>
      {/* Header */}
      <div style={{ background: "oklch(0.18 0.06 250)", borderBottom: "1px solid oklch(0.72 0.12 75 / 0.2)" }}>
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/109506846/5ZpoxzgLM5cycU3sThccK4/favicon-logo-v2-VpvW9vnDQBVjC9fgzHCMg6.png" alt="CC Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-semibold" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
              Compare the Conveyancing Market
            </span>
          </div>
          <button onClick={() => navigate("/get-quote")} className="btn-gold px-5 py-2 rounded-xl text-xs font-bold">
            Get Free Quotes
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="py-12" style={{ background: "oklch(0.18 0.06 250)" }}>
        <div className="container max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
            Terms &amp; Conditions
          </h1>
          <p className="text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.55)", fontFamily: "'DM Sans', sans-serif" }}>
            Last updated: 1 June 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-3xl mx-auto py-12">
        <div className="bg-white rounded-2xl p-8 md:p-12" style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
          <p className="text-sm leading-relaxed mb-8" style={{ color: "oklch(0.35 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
            Please read these Terms and Conditions carefully before using our website or services. These Terms constitute a legally binding agreement between you and Compare the Conveyancing Market Ltd under the laws of England and Wales.
          </p>

          <div className="space-y-8">
            {sections.map(({ title, content }) => (
              <div key={title}>
                <h2 className="text-lg font-bold mb-3" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
                  {title}
                </h2>
                <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "oklch(0.35 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                  {content}
                </div>
                <div className="mt-6" style={{ borderBottom: "1px solid oklch(0.92 0.004 286.32)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center text-xs" style={{ borderTop: "1px solid oklch(0.88 0.015 80)", color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
        © {new Date().getFullYear()} Compare the Conveyancing Market Ltd. All rights reserved.
        <span className="mx-2">·</span>
        <button onClick={() => navigate("/privacy-policy")} className="hover:underline">Privacy Policy</button>
        <span className="mx-2">·</span>
        <button onClick={() => navigate("/contact")} className="hover:underline">Contact Us</button>
      </div>
    </div>
  );
}
