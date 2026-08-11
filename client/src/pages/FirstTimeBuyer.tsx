/*
 * LANDING PAGE: First Time Buyer Conveyancing
 * Target keyword: "conveyancing for first time buyers"
 * Design: British Legal Prestige — Navy + Gold + Parchment
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  CheckCircle, ChevronRight, Shield, Star, Clock, Home,
  FileText, Key, HelpCircle, ArrowRight, Phone,
} from "lucide-react";

const LOGO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/109506846/5ZpoxzgLM5cycU3sThccK4/favicon-logo-v2-VpvW9vnDQBVjC9fgzHCMg6.png";

function Navbar() {
  const [, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "oklch(0.12 0.05 250 / 0.97)" : "oklch(0.18 0.06 250)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: "1px solid oklch(0.72 0.12 75 / 0.2)",
        boxShadow: scrolled ? "0 4px 20px oklch(0.12 0.05 250 / 0.3)" : "none",
      }}
    >
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center">
            <img src={LOGO_URL} alt="CC Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-bold text-sm leading-tight" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>Compare</div>
            <div className="text-xs leading-tight" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>the Conveyancing Market</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {([
            { label: "How It Works", path: "/how-it-works" },
            { label: "FAQs", path: "/faq" },
            { label: "Blog", path: "/blog" },
            { label: "Contact", path: "/contact" },
          ] as { label: string; path: string }[]).map(({ label, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="text-sm font-medium transition-colors"
              style={{ color: "oklch(0.975 0.008 80 / 0.8)", fontFamily: "'DM Sans', sans-serif", background: "none", border: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.72 0.12 75)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.975 0.008 80 / 0.8)")}
            >
              {label}
            </button>
          ))}
        </div>
        <button onClick={() => navigate("/get-quote?type=purchase")} className="btn-gold px-5 py-2.5 rounded-lg text-sm font-semibold">
          Get Free Quotes
        </button>
      </div>
    </nav>
  );
}

const steps = [
  { icon: FileText, title: "1. Tell Us About Your Property", desc: "Enter your property details and postcode. It takes under 2 minutes and is completely free." },
  { icon: Star, title: "2. Compare Instant Quotes", desc: "Receive transparent, itemised quotes from SRA & CLC regulated conveyancers — no hidden fees." },
  { icon: Key, title: "3. Instruct Your Solicitor", desc: "Choose the firm that suits you and instruct them directly. We handle the introduction." },
];

const faqs = [
  {
    q: "How much does conveyancing cost for a first time buyer?",
    a: "For a first time buyer purchasing a property, conveyancing fees typically range from £850 to £1,800 including searches and disbursements. The exact cost depends on the property value, whether it is freehold or leasehold, and whether you have a mortgage.",
  },
  {
    q: "Do I need a solicitor as a first time buyer?",
    a: "Yes. You are legally required to use a solicitor or licensed conveyancer when buying a property in England and Wales. They handle the legal transfer of ownership, carry out searches, and liaise with your mortgage lender.",
  },
  {
    q: "What is Stamp Duty Land Tax (SDLT) for first time buyers?",
    a: "As a first time buyer in England, you pay no Stamp Duty on properties up to £425,000. Between £425,001 and £625,000 you pay 5% on the portion above £425,000. Properties above £625,000 do not qualify for first time buyer relief.",
  },
  {
    q: "How long does conveyancing take for a first time buyer?",
    a: "On average, conveyancing takes 8–12 weeks from offer accepted to completion. The timeline can be shorter if you are a cash buyer or longer in a chain. Using an efficient, responsive solicitor is key to a fast completion.",
  },
  {
    q: "What is a Help to Buy ISA and how does it affect conveyancing?",
    a: "A Help to Buy ISA (now closed to new applicants) or Lifetime ISA (LISA) gives first time buyers a government bonus on their savings. Your solicitor will claim the bonus on your behalf as part of the conveyancing process — make sure to tell them you have one.",
  },
];

import SEOHead from "@/components/SEOHead";

export default function FirstTimeBuyer() {
  const [, navigate] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "First Time Buyer Conveyancing Quotes | Compare Regulated Solicitors";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Compare first time buyer conveyancing quotes from SRA & CLC regulated UK solicitors. Fixed fees, no hidden costs, instant results. Save up to £500 on your solicitor fees.");
    return () => {
      document.title = "Compare the Conveyancing Market | Free Conveyancing Quotes";
      if (metaDesc) metaDesc.setAttribute("content", "Compare instant conveyancing quotes from SRA & CLC regulated UK solicitors. Free, no-obligation quotes in under 2 minutes.");
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.975 0.008 80)" }}>
      <SEOHead
        title="First-Time Buyer Conveyancing Quotes & Fees | Compare the Conveyancing Market"
        description="Compare fixed-fee conveyancing quotes for first-time buyers from SRA & CLC regulated solicitors. No hidden extras, clear disbursements, and expert guidance."
        canonicalPath="/first-time-buyer-conveyancing"
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.comparetheconveyancingmarket.co.uk/" },
            { "@type": "ListItem", "position": 2, "name": "First Time Buyer Conveyancing", "item": "https://www.comparetheconveyancingmarket.co.uk/first-time-buyer-conveyancing" }
          ]
        }}
      />
      <Navbar />

      {/* ── HERO ── */}
      <section className="pt-32 pb-20" style={{ background: "linear-gradient(135deg, oklch(0.12 0.05 250) 0%, oklch(0.20 0.07 250) 100%)" }}>
        <div className="container max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
                style={{ background: "oklch(0.72 0.12 75 / 0.15)", border: "1px solid oklch(0.72 0.12 75 / 0.4)", color: "oklch(0.82 0.10 75)", fontFamily: "'DM Sans', sans-serif" }}
              >
                <Shield size={12} /> SRA & CLC Regulated Firms Only
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-5" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
                First Time Buyer
                <span className="block italic" style={{ color: "oklch(0.82 0.10 75)" }}>Conveyancing Quotes</span>
              </h1>
              <p className="text-base mb-8 leading-relaxed" style={{ color: "oklch(0.975 0.008 80 / 0.75)", fontFamily: "'DM Sans', sans-serif" }}>
                Buying your first home is exciting — but the legal process can feel overwhelming. We make it simple. Compare instant, transparent quotes from regulated UK conveyancers and save up to £500 on your solicitor fees.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {["Free to use", "No hidden fees", "Instant results", "No obligation"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.8)", fontFamily: "'DM Sans', sans-serif" }}>
                    <CheckCircle size={14} style={{ color: "oklch(0.72 0.12 75)" }} />
                    {item}
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/get-quote?type=purchase")}
                className="btn-gold px-8 py-4 rounded-xl text-base font-bold flex items-center gap-3"
              >
                Get My First Time Buyer Quote <ChevronRight size={18} />
              </button>
            </div>

            {/* Stats card */}
            <div className="rounded-2xl p-8" style={{ background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(0.72 0.12 75 / 0.3)" }}>
              <h3 className="text-lg font-semibold mb-6" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
                What first time buyers typically pay
              </h3>
              {[
                { label: "Legal fees (inc. VAT)", value: "£850 – £1,500" },
                { label: "Searches", value: "£250 – £400" },
                { label: "Land Registry fee", value: "£20 – £500" },
                { label: "Stamp Duty (up to £425k)", value: "£0" },
                { label: "Average saving vs. high street", value: "Up to £500" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-3" style={{ borderBottom: "1px solid oklch(0.975 0.008 80 / 0.1)" }}>
                  <span className="text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                  <span className="text-sm font-bold" style={{ color: "oklch(0.82 0.10 75)", fontFamily: "'DM Sans', sans-serif" }}>{value}</span>
                </div>
              ))}
              <p className="text-xs mt-4" style={{ color: "oklch(0.975 0.008 80 / 0.4)", fontFamily: "'DM Sans', sans-serif" }}>
                Indicative figures. Actual costs depend on property value and complexity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-white">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              How It Works
            </h2>
            <p className="text-base" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              Three simple steps to find your perfect conveyancer
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-8 rounded-2xl" style={{ background: "oklch(0.975 0.008 80)", border: "1px solid oklch(0.88 0.015 80)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "oklch(0.18 0.06 250)" }}>
                  <Icon size={24} style={{ color: "oklch(0.72 0.12 75)" }} />
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FIRST TIME BUYER GUIDE ── */}
      <section className="py-20" style={{ background: "oklch(0.975 0.008 80)" }}>
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              First Time Buyer Conveyancing: What to Expect
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Home, title: "Offer Accepted", desc: "Once your offer is accepted, instruct your solicitor immediately. The sooner they start, the faster your completion." },
              { icon: FileText, title: "Searches & Enquiries", desc: "Your solicitor carries out local authority, drainage, and environmental searches. They also raise enquiries with the seller's solicitor." },
              { icon: Shield, title: "Mortgage Offer", desc: "Your lender will instruct a valuation. Once satisfied, they issue a formal mortgage offer. Your solicitor reviews the conditions." },
              { icon: Key, title: "Exchange & Completion", desc: "Contracts are exchanged — you are now legally committed. Completion day is when you get the keys to your new home." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 rounded-2xl bg-white" style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.18 0.06 250)" }}>
                  <Icon size={18} style={{ color: "oklch(0.72 0.12 75)" }} />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>{title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-white">
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              First Time Buyer Conveyancing FAQs
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  style={{ background: openFaq === i ? "oklch(0.18 0.06 250)" : "white" }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-sm font-semibold pr-4" style={{ color: openFaq === i ? "white" : "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>{q}</span>
                  <HelpCircle size={16} style={{ color: openFaq === i ? "oklch(0.72 0.12 75)" : "oklch(0.55 0.04 250)", flexShrink: 0 }} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5" style={{ background: "oklch(0.975 0.008 80)" }}>
                    <p className="text-sm leading-relaxed" style={{ color: "oklch(0.35 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20" style={{ background: "oklch(0.18 0.06 250)" }}>
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
            Ready to Compare First Time Buyer Conveyancing Quotes?
          </h2>
          <p className="text-base mb-8" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>
            Free, instant, no obligation. Compare regulated UK conveyancers in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/get-quote?type=purchase")}
              className="btn-gold px-8 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-3"
            >
              Get My Free Quote <ArrowRight size={18} />
            </button>
            <a
              href="tel:03301289488"
              className="px-8 py-4 rounded-xl text-base font-semibold flex items-center justify-center gap-3 transition-all"
              style={{ background: "oklch(1 0 0 / 0.08)", border: "1px solid oklch(0.975 0.008 80 / 0.3)", color: "white", fontFamily: "'DM Sans', sans-serif" }}
            >
              <Phone size={18} /> 0330 128 9488
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8" style={{ background: "oklch(0.10 0.04 250)", borderTop: "1px solid oklch(0.72 0.12 75 / 0.15)" }}>
        <div className="container text-center">
          <p className="text-xs" style={{ color: "oklch(0.975 0.008 80 / 0.4)", fontFamily: "'DM Sans', sans-serif" }}>
            © {new Date().getFullYear()} ComparetheConveyancingMarket Ltd — Office 17699, 182-184 High Street North, East Ham, London E6 2JA — Registered in England & Wales
          </p>
        </div>
      </footer>
    </div>
  );
}
