import { ArrowRight, BadgePoundSterling, BookOpenCheck, ExternalLink, Landmark, Scale, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";
import SEOHead from "@/components/SEOHead";

const officialSources = [
  {
    name: "GOV.UK: Buying and selling a home",
    description: "A practical overview of the main steps when selling property in England and Wales, including choosing a solicitor or conveyancer, exchange and completion.",
    href: "https://www.gov.uk/selling-a-home",
  },
  {
    name: "HMRC: Stamp Duty Land Tax",
    description: "Current residential SDLT rates, relief information and HMRC’s official calculator for property purchases in England and Northern Ireland.",
    href: "https://www.gov.uk/stamp-duty-land-tax/residential-property-rates",
  },
  {
    name: "HM Land Registry: Registration Services fees",
    description: "Official fee scales and the Land Registry fee calculator for registration applications in England and Wales.",
    href: "https://www.gov.uk/guidance/hm-land-registry-registration-services-fees",
  },
  {
    name: "Citizens Advice: Buying a home",
    description: "Independent consumer guidance on budgeting, surveys, offers, searches and choosing legal help when buying a home.",
    href: "https://www.citizensadvice.org.uk/housing/buying-and-selling-a-home/buying-a-home/",
  },
];

const faqs = [
  {
    question: "What should a conveyancing quote include?",
    answer: "A useful quote should separate the legal fee, VAT and third-party disbursements. For a purchase, ask whether searches, Land Registry fees, bank-transfer fees and any SDLT work are shown separately, and whether your circumstances could add a supplement.",
  },
  {
    question: "Why do conveyancing costs vary?",
    answer: "Costs depend on the transaction type, property value, tenure, lender requirements and complexity. Leasehold, new-build, gifted-deposit and shared-ownership matters can require additional legal work. Government charges and search costs are not set by a comparison website.",
  },
  {
    question: "How do I check Stamp Duty Land Tax?",
    answer: "Use HMRC’s official SDLT calculator and guidance. The amount can depend on the purchase price, whether you are a first-time buyer, whether the purchase is an additional property, and residency status.",
  },
  {
    question: "Can I choose a solicitor or licensed conveyancer?",
    answer: "Yes. In England and Wales, solicitors are regulated by the Solicitors Regulation Authority and licensed conveyancers are regulated by the Council for Licensed Conveyancers. Confirm that the firm is appropriately regulated and that it can act for your mortgage lender before instructing it.",
  },
];

export default function UKConveyancingCostGuide() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.975 0.008 80)" }}>
      <SEOHead
        title="UK Conveyancing Costs & Process Guide (2026) | Compare the Conveyancing Market"
        description="A plain-English UK conveyancing cost and process guide, with official HMRC, HM Land Registry, GOV.UK and Citizens Advice sources for buyers and sellers."
        canonicalPath="/uk-conveyancing-cost-guide"
        schema={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              "headline": "UK Conveyancing Costs & Process Guide (2026)",
              "description": "A plain-English reference guide to conveyancing costs, process stages and official UK resources for property buyers and sellers.",
              "datePublished": "2026-08-31",
              "dateModified": "2026-08-31",
              "mainEntityOfPage": "https://www.comparetheconveyancingmarket.co.uk/uk-conveyancing-cost-guide",
              "author": { "@type": "Organization", "name": "Compare the Conveyancing Market" },
              "publisher": { "@type": "Organization", "name": "Compare the Conveyancing Market" },
            },
            {
              "@type": "FAQPage",
              "mainEntity": faqs.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
              })),
            },
          ],
        }}
      />

      <nav className="sticky top-0 z-50" style={{ background: "oklch(0.18 0.06 250)", borderBottom: "1px solid oklch(0.72 0.12 75 / 0.2)" }}>
        <div className="container flex items-center justify-between py-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 text-left" style={{ background: "none", border: "none" }}>
            <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/109506846/5ZpoxzgLM5cycU3sThccK4/favicon-logo-v2-VpvW9vnDQBVjC9fgzHCMg6.png" alt="Compare the Conveyancing Market" className="w-full h-full object-cover" />
            </div>
            <span className="font-semibold text-sm" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>Compare the Conveyancing Market</span>
          </button>
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => navigate("/compare-conveyancing-fees")} className="text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.75)", background: "none", border: "none" }}>Fees</button>
            <button onClick={() => navigate("/blog")} className="text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.75)", background: "none", border: "none" }}>Guides</button>
          </div>
          <button onClick={() => navigate("/get-quote")} className="btn-gold px-5 py-2.5 rounded-lg text-sm font-semibold">Get Free Quotes</button>
        </div>
      </nav>

      <main>
        <section className="py-16 md:py-20" style={{ background: "linear-gradient(135deg, oklch(0.12 0.05 250), oklch(0.24 0.07 250))" }}>
          <div className="container max-w-5xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6" style={{ background: "oklch(0.72 0.12 75 / 0.16)", color: "oklch(0.84 0.10 75)", border: "1px solid oklch(0.72 0.12 75 / 0.35)" }}>
              <BookOpenCheck size={14} /> Independent planning resource
            </div>
            <h1 className="max-w-4xl text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
              UK Conveyancing Costs &amp; Process Guide <em style={{ color: "oklch(0.82 0.10 75)" }}>(2026)</em>
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed" style={{ color: "oklch(0.975 0.008 80 / 0.76)", fontFamily: "'DM Sans', sans-serif" }}>
              A practical starting point for buyers and sellers in England and Wales. Use it to understand the moving process, compare quotes on a like-for-like basis, and find the official sources behind the figures.
            </p>
            <p className="text-xs mt-6" style={{ color: "oklch(0.975 0.008 80 / 0.48)", fontFamily: "'DM Sans', sans-serif" }}>Updated 31 August 2026 · General information, not legal or tax advice</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container max-w-5xl">
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: BadgePoundSterling, title: "1. Compare the full cost", text: "Look beyond a headline legal fee. Check VAT, searches, registration fees and any transaction-specific supplements." },
                { icon: Scale, title: "2. Understand the legal stages", text: "Instruction, contract work, searches, enquiries, exchange and completion each have a separate purpose." },
                { icon: ShieldCheck, title: "3. Verify the provider", text: "Confirm the firm’s regulation and lender-panel eligibility before you choose it." },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl p-6 bg-white" style={{ border: "1px solid oklch(0.88 0.015 80)", boxShadow: "0 2px 12px oklch(0.18 0.06 250 / 0.05)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "oklch(0.18 0.06 250)" }}><Icon size={19} style={{ color: "oklch(0.72 0.12 75)" }} /></div>
                  <h2 className="text-lg font-bold mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>{title}</h2>
                  <p className="text-sm leading-relaxed" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-14">
          <div className="container max-w-5xl grid lg:grid-cols-[1.35fr_0.65fr] gap-10">
            <article className="rounded-2xl p-7 md:p-10 bg-white" style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
              <h2 className="text-3xl font-bold mb-5" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>What to budget for before you compare</h2>
              <div className="space-y-6 text-[0.98rem] leading-relaxed" style={{ color: "oklch(0.36 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                <p>Conveyancing pricing normally combines the firm’s legal fee, VAT and disbursements—costs that a conveyancer pays to a third party for your transaction. Your position can also change the work involved: for example, whether you are buying, selling, remortgaging, purchasing leasehold property, using a mortgage, or receiving a gifted deposit.</p>
                <p>When you compare, ask for an itemised view rather than relying on one total. Buyers should also plan for matters outside the conveyancer’s fee, such as survey and valuation costs, lender charges, moving expenses, and any relevant property tax. Citizens Advice provides an independent list of the cost categories worth considering before purchase.</p>
                <p>Stamp Duty Land Tax can depend on the purchase price, first-time-buyer status, additional-property status and residency. Rather than relying on generic examples, check the current rules and calculate your position directly through HMRC before committing to a budget.</p>
                <p>Land-registration fees are government charges that vary by application type, property value and how the application is lodged. Use the official HM Land Registry fee calculator for the most current figure; a conveyancer can then explain which application is expected for your matter.</p>
              </div>

              <div className="mt-9 p-6 rounded-xl" style={{ background: "oklch(0.18 0.06 250 / 0.055)", borderLeft: "4px solid oklch(0.72 0.12 75)" }}>
                <h3 className="font-bold mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>A useful quote checklist</h3>
                <ul className="space-y-2 text-sm" style={{ color: "oklch(0.40 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                  <li>Is the legal fee clear, and is VAT shown separately?</li>
                  <li>Which searches and third-party charges are included or estimated?</li>
                  <li>Are leasehold, new-build, gifted-deposit or lender-related supplements explained?</li>
                  <li>Can the firm act for your mortgage lender?</li>
                  <li>What happens if the transaction does not reach completion?</li>
                </ul>
              </div>
            </article>

            <aside className="space-y-5">
              <div className="rounded-2xl p-6" style={{ background: "oklch(0.18 0.06 250)", color: "white" }}>
                <Landmark size={22} style={{ color: "oklch(0.82 0.10 75)" }} />
                <h2 className="text-xl font-bold mt-4 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Use the official sources</h2>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>Government and consumer guidance is the right source for current tax, registration fees and process information.</p>
              </div>
              {officialSources.map((source) => (
                <a key={source.name} href={source.href} target="_blank" rel="noreferrer" className="block rounded-xl p-5 bg-white transition-transform hover:-translate-y-0.5" style={{ border: "1px solid oklch(0.88 0.015 80)", boxShadow: "0 2px 10px oklch(0.18 0.06 250 / 0.04)" }}>
                  <div className="flex justify-between gap-3"><span className="text-sm font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>{source.name}</span><ExternalLink size={15} style={{ color: "oklch(0.65 0.12 75)", flexShrink: 0 }} /></div>
                  <p className="text-xs leading-relaxed mt-2" style={{ color: "oklch(0.52 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{source.description}</p>
                </a>
              ))}
            </aside>
          </div>
        </section>

        <section className="py-14" style={{ background: "oklch(0.18 0.06 250)" }}>
          <div className="container max-w-5xl grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-start">
            <div>
              <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: "oklch(0.82 0.10 75)" }}>Common questions</div>
              <h2 className="text-3xl md:text-4xl font-bold mt-3" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>Compare with context, not guesswork.</h2>
              <button onClick={() => navigate("/get-quote")} className="btn-gold mt-7 px-6 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2">Get itemised quotes <ArrowRight size={16} /></button>
            </div>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-xl p-5" style={{ background: "oklch(1 0 0 / 0.07)", border: "1px solid oklch(0.72 0.12 75 / 0.22)" }}>
                  <h3 className="font-semibold text-sm mb-2" style={{ color: "oklch(0.90 0.09 75)", fontFamily: "'DM Sans', sans-serif" }}>{faq.question}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center" style={{ background: "oklch(0.12 0.05 250)" }}>
        <button onClick={() => navigate("/")} className="text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.62)", background: "none", border: "none" }}>© {new Date().getFullYear()} Compare the Conveyancing Market</button>
      </footer>
    </div>
  );
}
