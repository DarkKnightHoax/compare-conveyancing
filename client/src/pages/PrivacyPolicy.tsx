/*
 * PRIVACY POLICY PAGE
 * Design: British Legal Prestige — Navy + Gold + Parchment
 */

import { useLocation } from "wouter";
import { Scale } from "lucide-react";

export default function PrivacyPolicy() {
  const [, navigate] = useLocation();

  const sections = [
    {
      title: "1. Who We Are",
      content: `Compare the Conveyancing Market Ltd ("we", "us", "our") operates the website comparetheconveyancingmarket.co.uk. We are the data controller responsible for your personal data. If you have any questions about this policy or our data practices, please contact us at privacy@comparetheconveyancingmarket.co.uk.`,
    },
    {
      title: "2. What Data We Collect",
      content: `We collect the following categories of personal data when you use our service:

• Identity data: first name, last name
• Contact data: email address, telephone number
• Property data: property address, postcode, property value, transaction type
• Transaction data: details of the conveyancing services you have enquired about
• Technical data: IP address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform
• Usage data: information about how you use our website
• Marketing and communications data: your preferences in receiving marketing from us

We do not collect any special categories of personal data (such as data about your race, ethnicity, religious beliefs, health, or criminal record).`,
    },
    {
      title: "3. How We Use Your Data",
      content: `We use your personal data for the following purposes:

• To provide you with conveyancing quotes from our panel of regulated firms
• To introduce you to the law firm you select and facilitate your instruction
• To respond to your enquiries and provide customer support
• To send you relevant communications about your transaction (where you have consented)
• To improve our website and services
• To comply with our legal and regulatory obligations

Our lawful basis for processing your data is: (a) the performance of a contract with you or to take steps at your request before entering into a contract; (b) compliance with a legal obligation; and (c) our legitimate interests in operating and improving our business, where these are not overridden by your interests or rights.`,
    },
    {
      title: "4. Who We Share Your Data With",
      content: `We share your personal data with the following categories of recipients:

• Regulated law firms and licensed conveyancers on our panel, for the purpose of providing you with a quote and, where you instruct, carrying out your conveyancing transaction
• Our technology and service providers who process data on our behalf under strict data processing agreements
• HM Revenue & Customs, regulators, and other authorities where required by law

We do not sell your personal data to third parties. We do not share your data with third parties for their own marketing purposes without your explicit consent.`,
    },
    {
      title: "5. Data Retention",
      content: `We retain your personal data for as long as necessary to fulfil the purposes for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements.

For enquiry data where no instruction was placed, we retain your data for 12 months from the date of your enquiry. For instructed transactions, we retain your data for 7 years from the date of completion of your transaction, in accordance with our professional obligations.`,
    },
    {
      title: "6. Your Rights",
      content: `Under UK data protection law, you have the following rights:

• The right to access your personal data
• The right to rectification of inaccurate personal data
• The right to erasure of your personal data in certain circumstances
• The right to restrict processing of your personal data
• The right to data portability
• The right to object to processing of your personal data
• Rights in relation to automated decision making and profiling

To exercise any of these rights, please contact us at privacy@comparetheconveyancingmarket.co.uk. You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk.`,
    },
    {
      title: "7. Cookies",
      content: `Our website uses cookies to distinguish you from other users and to improve your experience. We use the following types of cookies:

• Strictly necessary cookies: required for the operation of our website
• Analytical cookies: allow us to recognise and count the number of visitors and see how visitors move around our website
• Functionality cookies: used to recognise you when you return to our website

You can set your browser to refuse all or some browser cookies. However, if you disable or refuse cookies, please note that some parts of our website may become inaccessible or not function properly.`,
    },
    {
      title: "8. Security",
      content: `We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorised way, altered, or disclosed. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.`,
    },
    {
      title: "9. Changes to This Policy",
      content: `We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated effective date. We encourage you to review this policy periodically.`,
    },
    {
      title: "10. Contact Us",
      content: `If you have any questions about this privacy policy or our privacy practices, please contact our Data Protection Officer at:

Email: privacy@comparetheconveyancingmarket.co.uk
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
            Privacy Policy
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
            This privacy policy explains how Compare the Conveyancing Market Ltd collects, uses, and protects your personal data when you use our website and services. We are committed to ensuring that your privacy is protected and that we handle your data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
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
        <button onClick={() => navigate("/terms")} className="hover:underline">Terms & Conditions</button>
        <span className="mx-2">·</span>
        <button onClick={() => navigate("/contact")} className="hover:underline">Contact Us</button>
      </div>
    </div>
  );
}
