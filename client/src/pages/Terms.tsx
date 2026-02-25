/*
 * TERMS & CONDITIONS PAGE
 * Design: British Legal Prestige — Navy + Gold + Parchment
 */

import { useLocation } from "wouter";
import { Scale } from "lucide-react";

export default function Terms() {
  const [, navigate] = useLocation();

  const sections = [
    {
      title: "1. About Us",
      content: `Compare the Conveyancing Market Ltd ("we", "us", "our", "the Company") is a company registered in England and Wales. We operate the website comparetheconveyancingmarket.co.uk (the "Website") and provide an online platform that enables consumers to obtain and compare conveyancing quotes from regulated law firms and licensed conveyancers (the "Service").

We are an introducer only. We do not provide legal advice, and we are not regulated by the Solicitors Regulation Authority (SRA) or the Council for Licensed Conveyancers (CLC). All legal services are provided directly by the law firms and conveyancers on our panel, each of which is independently regulated.`,
    },
    {
      title: "2. Acceptance of Terms",
      content: `By accessing or using our Website or Service, you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, you must not use our Website or Service.

We reserve the right to amend these Terms at any time. Continued use of the Website following any amendment constitutes your acceptance of the revised Terms.`,
    },
    {
      title: "3. The Service",
      content: `Our Service enables you to:

• Input details of your property transaction via our online quote wizard
• Receive personalised conveyancing quotes from our panel of regulated firms
• Compare quotes by price, rating, and other criteria
• Instruct a firm of your choice directly through our platform
• Request a callback from one of our advisers

The quotes provided through our Service are based on the information you supply. It is your responsibility to ensure that the information you provide is accurate and complete. We accept no liability for quotes that are inaccurate as a result of information you have provided incorrectly.`,
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
      title: "6. Payment on Account",
      content: `When you instruct a firm through our platform, you may be required to make an initial payment on account. This payment is held by the instructed firm and applied against your legal fees. The payment on account is not a fee charged by Compare the Conveyancing Market.

If you withdraw your instruction before exchange of contracts, you may be entitled to a refund of the payment on account, less any reasonable costs incurred by the firm to that point. The firm's terms of engagement will set out the precise refund policy.`,
    },
    {
      title: "7. Intellectual Property",
      content: `All content on our Website, including but not limited to text, graphics, logos, images, and software, is the property of Compare the Conveyancing Market Ltd or its content suppliers and is protected by UK and international copyright laws.

You may not reproduce, distribute, modify, or create derivative works from any content on our Website without our prior written consent.`,
    },
    {
      title: "8. Limitation of Liability",
      content: `To the fullest extent permitted by law, we exclude all liability for:

• Any loss or damage arising from your use of, or inability to use, our Website or Service
• Any inaccuracy in the quotes provided through our Service
• Any acts or omissions of the law firms or conveyancers on our panel
• Any indirect, consequential, or special loss or damage

Nothing in these Terms excludes or limits our liability for death or personal injury caused by our negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be excluded or limited by English law.`,
    },
    {
      title: "9. Governing Law",
      content: `These Terms and any dispute or claim arising out of or in connection with them shall be governed by and construed in accordance with the law of England and Wales. You agree to submit to the exclusive jurisdiction of the courts of England and Wales.`,
    },
    {
      title: "10. Contact",
      content: `If you have any questions about these Terms, please contact us at:

Email: legal@comparetheconveyancingmarket.co.uk
Post: Compare the Conveyancing Market Ltd, England & Wales`,
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.975 0.008 80)" }}>
      {/* Header */}
      <div style={{ background: "oklch(0.18 0.06 250)", borderBottom: "1px solid oklch(0.72 0.12 75 / 0.2)" }}>
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.72 0.12 75)" }}>
              <Scale size={15} style={{ color: "oklch(0.12 0.05 250)" }} />
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
            Terms & Conditions
          </h1>
          <p className="text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.55)", fontFamily: "'DM Sans', sans-serif" }}>
            Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-3xl mx-auto py-12">
        <div className="bg-white rounded-2xl p-8 md:p-12" style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
          <p className="text-sm leading-relaxed mb-8" style={{ color: "oklch(0.35 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
            Please read these Terms and Conditions carefully before using our website or services. These Terms constitute a legally binding agreement between you and Compare the Conveyancing Market Ltd.
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
        © {new Date().getFullYear()} Compare the Conveyancing Market. All rights reserved.
        <span className="mx-2">·</span>
        <button onClick={() => navigate("/privacy-policy")} className="hover:underline">Privacy Policy</button>
        <span className="mx-2">·</span>
        <button onClick={() => navigate("/contact")} className="hover:underline">Contact Us</button>
      </div>
    </div>
  );
}
