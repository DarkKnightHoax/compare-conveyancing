import { ArrowRight, CheckCircle2, ClipboardList, ExternalLink, FileCheck2, Home, Scale, ShieldAlert } from "lucide-react";
import { useLocation } from "wouter";
import SEOHead from "@/components/SEOHead";

const checklist = [
  {
    title: "Before you market the property",
    items: [
      "Check your mortgage balance and ask your lender about the process for redeeming the loan on completion.",
      "Locate your Energy Performance Certificate or arrange a new one if necessary.",
      "Gather documents that may be needed early, such as planning permissions, building-regulation certificates, warranties, guarantees and FENSA certificates.",
      "If the property is leasehold, begin collecting information on ground rent, service charges, buildings insurance and the managing agent or freeholder.",
    ],
  },
  {
    title: "When you choose a conveyancer",
    items: [
      "Check whether the firm is a regulated solicitor or licensed conveyancer, and ask for an itemised estimate rather than a single headline figure.",
      "Confirm what the estimate includes, what is a third-party disbursement, and which circumstances may result in extra legal work.",
      "Tell the firm at the outset if the property is leasehold, shared ownership, a new build, has a Help to Buy or equity-loan element, or involves probate, a gift, a trust or a power of attorney.",
      "Ask what information they would like before a buyer is found so that the contract pack can be prepared promptly once a sale is agreed.",
    ],
  },
  {
    title: "Once you accept an offer",
    items: [
      "Respond accurately and promptly to the seller’s property information and fittings-and-contents forms supplied by your conveyancer.",
      "Provide the contract documents, title information and any requested evidence so your conveyancer can issue the contract pack to the buyer’s legal representative.",
      "Keep your estate agent and conveyancer updated about the chain, mortgage position and any proposed completion-date changes.",
      "Do not commit to removals or final arrangements until contracts have been exchanged and the completion date is legally agreed.",
    ],
  },
];

const faqs = [
  {
    question: "What is a seller’s conveyancing pack?",
    answer: "It is the initial set of legal and property information your conveyancer provides to the buyer’s legal representative. It usually includes the draft contract, title documents and completed property information forms, with additional material where relevant.",
  },
  {
    question: "Why should I prepare property information early?",
    answer: "Missing or inconsistent information can lead to further enquiries after a buyer is found. Preparing documents early helps you and your conveyancer identify gaps before they become avoidable delays.",
  },
  {
    question: "Do sellers pay conveyancing fees?",
    answer: "Yes. A seller normally pays their own legal fee and any applicable disbursements. The final cost depends on the property and transaction; obtain an itemised estimate and ask about any potential additional work.",
  },
];

export default function SellerConveyancingChecklist() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.975 0.008 80)" }}>
      <SEOHead
        title="Seller Conveyancing Checklist (2026) | England & Wales"
        description="An original seller conveyancing checklist for England and Wales: documents to prepare, questions to ask, and what happens after you accept an offer."
        canonicalPath="/seller-conveyancing-checklist"
        schema={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              "headline": "Seller Conveyancing Checklist (2026)",
              "description": "A practical seller-side conveyancing checklist for England and Wales, covering preparation, quote comparison and next steps after accepting an offer.",
              "datePublished": "2026-08-31",
              "dateModified": "2026-08-31",
              "mainEntityOfPage": "https://www.comparetheconveyancingmarket.co.uk/seller-conveyancing-checklist",
              "author": { "@type": "Organization", "name": "Compare the Conveyancing Market" },
              "publisher": { "@type": "Organization", "name": "Compare the Conveyancing Market" },
              "about": "Residential property selling and conveyancing in England and Wales",
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
            <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center"><img src="https://d2xsxph8kpxj0f.cloudfront.net/109506846/5ZpoxzgLM5cycU3sThccK4/favicon-logo-v2-VpvW9vnDQBVjC9fgzHCMg6.png" alt="Compare the Conveyancing Market" className="w-full h-full object-cover" /></div>
            <span className="font-semibold text-sm" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>Compare the Conveyancing Market</span>
          </button>
          <button onClick={() => navigate("/get-quote?type=sale")} className="btn-gold px-5 py-2.5 rounded-lg text-sm font-semibold">Compare sale quotes</button>
        </div>
      </nav>

      <main>
        <section className="py-16 md:py-20" style={{ background: "linear-gradient(135deg, oklch(0.12 0.05 250), oklch(0.24 0.07 250))" }}>
          <div className="container max-w-5xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6" style={{ background: "oklch(0.72 0.12 75 / 0.16)", color: "oklch(0.84 0.10 75)", border: "1px solid oklch(0.72 0.12 75 / 0.35)" }}><ClipboardList size={14} /> England &amp; Wales seller resource</div>
            <h1 className="max-w-4xl text-4xl md:text-6xl font-bold leading-tight mb-6" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>Seller Conveyancing <em style={{ color: "oklch(0.82 0.10 75)" }}>Checklist</em></h1>
            <p className="max-w-3xl text-lg leading-relaxed" style={{ color: "oklch(0.975 0.008 80 / 0.76)", fontFamily: "'DM Sans', sans-serif" }}>Prepare the information that matters, understand the legal stages, and compare a sale quote with the right questions in mind.</p>
            <p className="text-xs mt-6" style={{ color: "oklch(0.975 0.008 80 / 0.48)", fontFamily: "'DM Sans', sans-serif" }}>Updated 31 August 2026 · General information, not legal or tax advice</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container max-w-5xl grid md:grid-cols-3 gap-5">
            {[
              { icon: FileCheck2, title: "Prepare the basics", text: "Title documents, certificates and accurate property information help your legal work begin on a sound footing." },
              { icon: Scale, title: "Compare the full quote", text: "A sale quote should help you distinguish the legal fee, VAT, disbursements and any matter-specific work." },
              { icon: Home, title: "Keep the chain informed", text: "Your agent and conveyancer need prompt, consistent updates when dates or circumstances change." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl p-6 bg-white" style={{ border: "1px solid oklch(0.88 0.015 80)", boxShadow: "0 2px 12px oklch(0.18 0.06 250 / 0.05)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "oklch(0.18 0.06 250)" }}><Icon size={19} style={{ color: "oklch(0.72 0.12 75)" }} /></div>
                <h2 className="text-lg font-bold mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>{title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-14">
          <div className="container max-w-5xl grid lg:grid-cols-[1.35fr_0.65fr] gap-10 items-start">
            <div className="space-y-6">
              {checklist.map((section, index) => (
                <article key={section.title} className="rounded-2xl p-7 md:p-8 bg-white" style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
                  <div className="flex items-center gap-4 mb-5"><div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "oklch(0.18 0.06 250)", color: "oklch(0.82 0.10 75)" }}>0{index + 1}</div><h2 className="text-2xl font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>{section.title}</h2></div>
                  <ul className="space-y-4">
                    {section.items.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed" style={{ color: "oklch(0.40 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}><CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" style={{ color: "oklch(0.65 0.12 75)" }} />{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24">
              <div className="rounded-2xl p-6" style={{ background: "oklch(0.18 0.06 250)" }}>
                <ShieldAlert size={22} style={{ color: "oklch(0.82 0.10 75)" }} />
                <h2 className="text-xl font-bold mt-4 mb-2" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>Use official guidance for current rules</h2>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>Government policy and process requirements can change. Use the live official sources below for the latest information.</p>
              </div>
              <a href="https://www.gov.uk/selling-a-home" target="_blank" rel="noreferrer" className="block rounded-xl p-5 bg-white" style={{ border: "1px solid oklch(0.88 0.015 80)" }}><div className="flex gap-3 justify-between"><span className="text-sm font-bold" style={{ color: "oklch(0.18 0.06 250)" }}>GOV.UK: Selling a home</span><ExternalLink size={15} style={{ color: "oklch(0.65 0.12 75)" }} /></div><p className="text-xs mt-2 leading-relaxed" style={{ color: "oklch(0.52 0.04 250)" }}>Official England and Wales guide to preparing, marketing and completing a sale.</p></a>
              <a href="https://www.gov.uk/government/consultations/home-buying-and-selling-reform/outcome/home-buying-and-selling-reform-roadmap" target="_blank" rel="noreferrer" className="block rounded-xl p-5 bg-white" style={{ border: "1px solid oklch(0.88 0.015 80)" }}><div className="flex gap-3 justify-between"><span className="text-sm font-bold" style={{ color: "oklch(0.18 0.06 250)" }}>GOV.UK: Homebuying reform roadmap</span><ExternalLink size={15} style={{ color: "oklch(0.65 0.12 75)" }} /></div><p className="text-xs mt-2 leading-relaxed" style={{ color: "oklch(0.52 0.04 250)" }}>Government roadmap on improving upfront property information and reducing delays.</p></a>
              <a href="https://www.lawsociety.org.uk/topics/property/home-buying-selling-reforms" target="_blank" rel="noreferrer" className="block rounded-xl p-5 bg-white" style={{ border: "1px solid oklch(0.88 0.015 80)" }}><div className="flex gap-3 justify-between"><span className="text-sm font-bold" style={{ color: "oklch(0.18 0.06 250)" }}>Law Society: Home buying &amp; selling reforms</span><ExternalLink size={15} style={{ color: "oklch(0.65 0.12 75)" }} /></div><p className="text-xs mt-2 leading-relaxed" style={{ color: "oklch(0.52 0.04 250)" }}>Professional context on the proposed changes and their implementation.</p></a>
            </aside>
          </div>
        </section>

        <section className="py-14" style={{ background: "oklch(0.18 0.06 250)" }}>
          <div className="container max-w-5xl grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-start">
            <div><div className="text-xs uppercase tracking-widest font-semibold" style={{ color: "oklch(0.82 0.10 75)" }}>Questions before you sell</div><h2 className="text-3xl md:text-4xl font-bold mt-3" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>Compare the legal work with clarity.</h2><button onClick={() => navigate("/get-quote?type=sale")} className="btn-gold mt-7 px-6 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2">Compare sale quotes <ArrowRight size={16} /></button></div>
            <div className="space-y-3">{faqs.map((faq) => <div key={faq.question} className="rounded-xl p-5" style={{ background: "oklch(1 0 0 / 0.07)", border: "1px solid oklch(0.72 0.12 75 / 0.22)" }}><h3 className="font-semibold text-sm mb-2" style={{ color: "oklch(0.90 0.09 75)", fontFamily: "'DM Sans', sans-serif" }}>{faq.question}</h3><p className="text-sm leading-relaxed" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>{faq.answer}</p></div>)}</div>
          </div>
        </section>
      </main>
    </div>
  );
}
