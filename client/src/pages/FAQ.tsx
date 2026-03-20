/**
 * FAQ PAGE
 * Design: British Legal Prestige — Navy + Gold + Parchment
 * SEO: FAQPage JSON-LD schema injected via Helmet-style script tag
 * 20 questions across 4 categories
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ChevronDown, Scale, HelpCircle, ArrowRight } from "lucide-react";

// ─── FAQ DATA ─────────────────────────────────────────────────────────────────
const FAQ_CATEGORIES = [
  {
    category: "Conveyancing Basics",
    questions: [
      {
        q: "What is conveyancing?",
        a: "Conveyancing is the legal process of transferring ownership of a property from one person to another. It covers everything from reviewing the contract of sale and conducting property searches, to exchanging contracts and completing the transaction. A licensed conveyancer or solicitor handles this work on your behalf.",
      },
      {
        q: "How long does conveyancing take?",
        a: "The average conveyancing transaction takes between 8 and 12 weeks from the point an offer is accepted to completion. However, this can vary significantly depending on the complexity of the chain, the speed of local authority searches, and whether any legal issues arise with the title.",
      },
      {
        q: "What is the difference between a solicitor and a licensed conveyancer?",
        a: "A solicitor is a fully qualified lawyer regulated by the Solicitors Regulation Authority (SRA) who can handle all types of legal work, including conveyancing. A licensed conveyancer is a specialist in property law regulated by the Council for Licensed Conveyancers (CLC). Both are equally qualified to handle residential conveyancing — all firms on our panel are regulated by either the SRA or CLC.",
      },
      {
        q: "Do I need a conveyancer if I am buying with a mortgage?",
        a: "Yes. If you are purchasing with a mortgage, your lender will require a solicitor or licensed conveyancer to act on their behalf as well as yours. In most cases, the same firm can act for both you and the lender, which keeps costs down.",
      },
      {
        q: "Can I do my own conveyancing?",
        a: "Technically, you can handle your own conveyancing if you are a cash buyer, but it is strongly inadvisable. Most mortgage lenders will not allow it, and the risks of missing legal issues — such as restrictive covenants, boundary disputes, or title defects — are significant. Using a regulated professional protects you.",
      },
    ],
  },
  {
    category: "Costs & Fees",
    questions: [
      {
        q: "How much does conveyancing cost?",
        a: "Conveyancing costs vary depending on the property value, transaction type, and complexity. For a straightforward freehold purchase at £300,000, you can typically expect to pay between £800 and £1,500 in legal fees (including VAT), plus disbursements such as Land Registry fees and search fees. Use our free quote tool to get accurate, itemised quotes from regulated firms in under 2 minutes.",
      },
      {
        q: "What are disbursements?",
        a: "Disbursements are third-party costs that your conveyancer pays on your behalf and then recharges to you. Common disbursements include local authority searches (typically £100–£300), Land Registry registration fees (£20–£910 depending on property value), electronic transfer fees (around £30), and bankruptcy searches (around £4 per person).",
      },
      {
        q: "What is Stamp Duty Land Tax (SDLT)?",
        a: "Stamp Duty Land Tax (SDLT) is a government tax payable when you purchase a property in England or Northern Ireland above certain thresholds. The rate depends on the purchase price, whether you are a first-time buyer, and whether you already own property. Your conveyancer will calculate and pay SDLT to HMRC on your behalf at completion.",
      },
      {
        q: "Are there extra costs for leasehold properties?",
        a: "Yes. Leasehold transactions typically attract additional legal fees because your solicitor must review the lease, obtain management information from the freeholder or managing agent, and deal with notice of assignment and charge. Expect to pay an additional £150–£350 for leasehold work.",
      },
      {
        q: "What is a no-completion, no-fee policy?",
        a: "Many conveyancers offer a 'no completion, no fee' or 'no sale, no fee' guarantee, meaning that if your transaction falls through before exchange of contracts, you will not be charged their legal fees. You may still be liable for disbursements already incurred, such as search fees. Always check the terms before instructing.",
      },
    ],
  },
  {
    category: "The Process",
    questions: [
      {
        q: "What happens after I instruct a conveyancer?",
        a: "Once you instruct a conveyancer, they will send you a client care letter and ID verification request. They will then obtain the draft contract from the seller's solicitor, raise enquiries, order property searches, and review the title. Once all enquiries are resolved and your mortgage offer is in place, you will exchange contracts and agree a completion date.",
      },
      {
        q: "What is the difference between exchange and completion?",
        a: "Exchange of contracts is the point at which the transaction becomes legally binding. Both parties sign identical contracts and they are 'exchanged' between solicitors. Completion is the day you actually move — the purchase price is transferred and you receive the keys. There is usually a gap of 1–4 weeks between exchange and completion.",
      },
      {
        q: "What are property searches?",
        a: "Property searches are enquiries made to various authorities to uncover information about the property and surrounding area. The standard searches are: Local Authority Search (planning history, road adoptions, enforcement notices), Drainage & Water Search (public sewers, water supply), and Environmental Search (flood risk, contaminated land). Your conveyancer will advise on which searches are required.",
      },
      {
        q: "What is a title register?",
        a: "The title register is the official record at HM Land Registry that confirms who owns a property and sets out any rights, restrictions, or charges registered against it. Your conveyancer will obtain and review the title register as part of the conveyancing process to ensure the seller has the right to sell and that there are no undisclosed issues.",
      },
      {
        q: "What is a completion statement?",
        a: "A completion statement is a financial summary prepared by your conveyancer showing all the money due on completion — including the balance of the purchase price, SDLT, Land Registry fees, and any other disbursements. You will need to transfer the total amount to your conveyancer before completion day.",
      },
    ],
  },
  {
    category: "Using Compare the Conveyancing Market",
    questions: [
      {
        q: "How does Compare the Conveyancing Market work?",
        a: "Simply answer a few questions about your property transaction — the type of transaction, property value, postcode, and your specific circumstances. We will instantly generate side-by-side quotes from our panel of SRA and CLC regulated conveyancers. You can then compare fees, ratings, and accreditations before choosing and instructing your preferred firm directly online.",
      },
      {
        q: "Is it free to use?",
        a: "Yes, our comparison service is completely free to use. There is no charge for generating quotes and no obligation to instruct any of the firms. We are paid a referral fee by the conveyancing firms when you choose to instruct through us — this does not affect the price you pay.",
      },
      {
        q: "Are the quotes accurate?",
        a: "Our quotes are calculated using the actual fee structures of each firm on our panel, based on the information you provide. The prices displayed are exclusive rates negotiated for clients who instruct through Compare the Conveyancing Market — they are not available if you approach the firm directly. Final fees may vary slightly if your circumstances change during the transaction.",
      },
      {
        q: "How are the conveyancing firms vetted?",
        a: "Every firm on our panel must be regulated by either the Solicitors Regulation Authority (SRA) or the Council for Licensed Conveyancers (CLC), hold a minimum 4.5-star customer rating, and meet our quality standards. We regularly review firm performance and remove any firm that falls below our benchmarks.",
      },
      {
        q: "What happens after I instruct a firm through your website?",
        a: "Once you instruct a firm through our platform, the conveyancing firm will contact you directly within 24 hours to begin the onboarding process. You will be asked to verify your identity and provide details of your transaction. From that point, you deal directly with your chosen firm — we are here if you need any assistance.",
      },
    ],
  },
];

// ─── ACCORDION ITEM ───────────────────────────────────────────────────────────
function AccordionItem({ q, a, isOpen, onToggle }: {
  q: string; a: string; isOpen: boolean; onToggle: () => void;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        border: isOpen ? "1px solid oklch(0.72 0.12 75 / 0.5)" : "1px solid oklch(0.88 0.015 80)",
        background: isOpen ? "oklch(0.18 0.06 250 / 0.03)" : "white",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 p-5 text-left"
      >
        <span
          className="text-sm font-semibold leading-snug"
          style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}
        >
          {q}
        </span>
        <ChevronDown
          size={18}
          className="flex-shrink-0 mt-0.5 transition-transform duration-200"
          style={{
            color: "oklch(0.72 0.12 75)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <p
            className="text-sm leading-relaxed"
            style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}
          >
            {a}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── MAIN FAQ PAGE ────────────────────────────────────────────────────────────
export default function FAQ() {
  const [, navigate] = useLocation();
  const [openItem, setOpenItem] = useState<string | null>("0-0");
  const [activeCategory, setActiveCategory] = useState(0);

  // Inject FAQPage JSON-LD schema for Google rich results
  useEffect(() => {
    const allQA = FAQ_CATEGORIES.flatMap((cat) =>
      cat.questions.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      }))
    );
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: allQA,
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "faq-schema";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    // Update page meta
    document.title = "Conveyancing FAQs | Compare the Conveyancing Market";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Answers to the most common conveyancing questions — costs, timelines, searches, SDLT, and how to compare conveyancing quotes online.");
    return () => {
      document.getElementById("faq-schema")?.remove();
    };
  }, []);

  const toggle = (key: string) => setOpenItem(openItem === key ? null : key);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.975 0.008 80)" }}>
      {/* ── NAVBAR ── */}
      <nav
        className="sticky top-0 z-50"
        style={{ background: "oklch(0.18 0.06 250)", borderBottom: "1px solid oklch(0.72 0.12 75 / 0.2)" }}
      >
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/109506846/5ZpoxzgLM5cycU3sThccK4/favicon-logo-v2-VpvW9vnDQBVjC9fgzHCMg6.png" alt="CC Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-bold text-sm leading-tight" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>Compare</div>
              <div className="text-xs leading-tight" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>the Conveyancing Market</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "How It Works", path: "/how-it-works" },
              { label: "FAQs", path: "/faq" },
              { label: "Blog", path: "/blog" },
              { label: "Contact", path: "/contact" },
            ].map(({ label, path }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="text-sm font-medium transition-colors"
                style={{ color: label === "FAQs" ? "oklch(0.72 0.12 75)" : "oklch(0.975 0.008 80 / 0.8)", fontFamily: "'DM Sans', sans-serif", background: "none", border: "none" }}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate("/get-quote")}
            className="btn-gold px-5 py-2.5 rounded-lg text-sm font-semibold"
          >
            Get Free Quotes
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="py-16" style={{ background: "oklch(0.18 0.06 250)" }}>
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-5"
            style={{ background: "oklch(0.72 0.12 75 / 0.15)", border: "1px solid oklch(0.72 0.12 75 / 0.4)", color: "oklch(0.82 0.10 75)", fontFamily: "'DM Sans', sans-serif" }}>
            <HelpCircle size={12} />
            Frequently Asked Questions
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
            Conveyancing <em style={{ color: "oklch(0.82 0.10 75)" }}>Explained</em>
          </h1>
          <div className="w-16 h-0.5 mx-auto mb-5" style={{ background: "oklch(0.72 0.12 75)" }} />
          <p className="text-base max-w-xl mx-auto" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>
            Everything you need to know about conveyancing — from costs and timelines to searches and completion.
          </p>
        </div>
      </section>

      {/* ── CATEGORY TABS ── */}
      <div className="sticky top-[65px] z-40 py-3" style={{ background: "oklch(0.975 0.008 80)", borderBottom: "1px solid oklch(0.88 0.015 80)" }}>
        <div className="container">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FAQ_CATEGORIES.map((cat, i) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(i)}
                className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  ...(activeCategory === i
                    ? { background: "oklch(0.18 0.06 250)", color: "white" }
                    : { background: "white", color: "oklch(0.45 0.04 250)", border: "1px solid oklch(0.88 0.015 80)" }),
                }}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── QUESTIONS ── */}
      <section className="py-12">
        <div className="container max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              {FAQ_CATEGORIES[activeCategory].category}
            </h2>
            <div className="w-10 h-0.5" style={{ background: "oklch(0.72 0.12 75)" }} />
          </div>
          <div className="space-y-3">
            {FAQ_CATEGORIES[activeCategory].questions.map((item, qi) => {
              const key = `${activeCategory}-${qi}`;
              return (
                <AccordionItem
                  key={key}
                  q={item.q}
                  a={item.a}
                  isOpen={openItem === key}
                  onToggle={() => toggle(key)}
                />
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl p-8 text-center" style={{ background: "oklch(0.18 0.06 250)" }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
              Ready to Compare Quotes?
            </h3>
            <p className="text-sm mb-5" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>
              Get accurate, itemised conveyancing quotes from regulated UK firms in under 2 minutes. Free and no obligation.
            </p>
            <button
              onClick={() => navigate("/get-quote")}
              className="btn-gold px-8 py-3.5 rounded-xl text-sm font-bold inline-flex items-center gap-2"
            >
              Get My Free Quotes <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8" style={{ background: "oklch(0.12 0.05 250)", borderTop: "1px solid oklch(0.72 0.12 75 / 0.2)" }}>
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.72 0.12 75)" }}>
                <Scale size={13} style={{ color: "oklch(0.12 0.05 250)" }} />
              </div>
              <span className="text-sm font-semibold" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
                Compare the Conveyancing Market
              </span>
            </div>
            <div className="flex gap-6 text-xs" style={{ color: "oklch(0.975 0.008 80 / 0.4)", fontFamily: "'DM Sans', sans-serif" }}>
              {[
                { label: "Terms & Conditions", path: "/terms" },
                { label: "Privacy Policy", path: "/privacy-policy" },
                { label: "Contact Us", path: "/contact" },
                { label: "FAQs", path: "/faq" },
                { label: "Blog", path: "/blog" },
              ].map(({ label, path }) => (
                <button key={label} onClick={() => navigate(path)} className="hover:text-white transition-colors" style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>
                  {label}
                </button>
              ))}
            </div>
            <div className="text-xs" style={{ color: "oklch(0.975 0.008 80 / 0.3)", fontFamily: "'DM Sans', sans-serif" }}>
              © {new Date().getFullYear()} ComparetheConveyancingMarket Ltd. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
