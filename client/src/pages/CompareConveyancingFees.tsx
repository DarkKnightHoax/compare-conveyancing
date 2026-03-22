/*
 * LANDING PAGE: Compare Conveyancing Fees Online
 * Target keyword: "compare conveyancing fees online"
 * Design: British Legal Prestige — Navy + Gold + Parchment
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  CheckCircle, ChevronRight, Shield, Star, BarChart2,
  HelpCircle, ArrowRight, Phone, Eye, Award, TrendingDown,
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
        <button onClick={() => navigate("/get-quote")} className="btn-gold px-5 py-2.5 rounded-lg text-sm font-semibold">
          Get Free Quotes
        </button>
      </div>
    </nav>
  );
}

const feeBreakdown = [
  { type: "Property Purchase (£250k)", low: "£850", high: "£1,500", avg: "£1,100" },
  { type: "Property Sale (£250k)", low: "£600", high: "£1,200", avg: "£850" },
  { type: "Sale & Purchase (£250k)", low: "£1,400", high: "£2,500", avg: "£1,850" },
  { type: "Remortgage (£250k)", low: "£300", high: "£900", avg: "£550" },
];

const faqs = [
  {
    q: "What is included in conveyancing fees?",
    a: "Conveyancing fees typically include the solicitor's legal fee (their professional charge), plus disbursements — third-party costs such as local authority searches, Land Registry fees, and bank transfer charges. Always ask for a fully itemised quote so you can compare like for like.",
  },
  {
    q: "Are online conveyancing quotes accurate?",
    a: "Our quotes are based on the specific details you provide — property value, location, freehold or leasehold, and mortgage status. The quotes you receive are fixed-fee, meaning the price you see is the price you pay, with no hidden extras.",
  },
  {
    q: "What is the difference between a solicitor and a licensed conveyancer?",
    a: "A solicitor is a qualified lawyer regulated by the SRA (Solicitors Regulation Authority). A licensed conveyancer is a specialist in property law regulated by the CLC (Council for Licensed Conveyancers). Both are equally qualified to handle residential conveyancing.",
  },
  {
    q: "Why do conveyancing fees vary so much?",
    a: "Fees vary based on property value, complexity (leasehold vs freehold, new build, shared ownership), the number of buyers or sellers, and whether a mortgage is involved. Online panel firms typically offer lower fees than high street solicitors due to higher volume.",
  },
  {
    q: "What does 'no sale no fee' mean?",
    a: "'No sale no fee' (or 'no move no fee') means you pay nothing if your transaction falls through before exchange of contracts. Many firms on our panel offer this guarantee — check the quote details to confirm.",
  },
];

export default function CompareConveyancingFees() {
  const [, navigate] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.975 0.008 80)" }}>
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
                <TrendingDown size={12} /> Save Up to £500 on Conveyancing Fees
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-5" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
                Compare
                <span className="block italic" style={{ color: "oklch(0.82 0.10 75)" }}>Conveyancing Fees</span>
                Online
              </h1>
              <p className="text-base mb-8 leading-relaxed" style={{ color: "oklch(0.975 0.008 80 / 0.75)", fontFamily: "'DM Sans', sans-serif" }}>
                Stop overpaying for conveyancing. Compare transparent, fixed-fee quotes from SRA & CLC regulated UK solicitors in under 2 minutes. No hidden fees. No obligation.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {["Fully itemised quotes", "Fixed-fee guarantee", "SRA & CLC regulated", "Free to compare"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.8)", fontFamily: "'DM Sans', sans-serif" }}>
                    <CheckCircle size={14} style={{ color: "oklch(0.72 0.12 75)" }} />
                    {item}
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/get-quote")}
                className="btn-gold px-8 py-4 rounded-xl text-base font-bold flex items-center gap-3"
              >
                Compare Fees Now <ChevronRight size={18} />
              </button>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, title: "SRA & CLC Only", desc: "Every firm is fully regulated and insured" },
                { icon: Eye, title: "No Hidden Fees", desc: "Fully itemised quotes — what you see is what you pay" },
                { icon: Award, title: "Fixed-Fee Guarantee", desc: "Your quote won't change unless your situation does" },
                { icon: Star, title: "No Obligation", desc: "Compare freely — instruct only when you're ready" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-5 rounded-2xl" style={{ background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(0.72 0.12 75 / 0.25)" }}>
                  <Icon size={20} className="mb-3" style={{ color: "oklch(0.72 0.12 75)" }} />
                  <div className="text-sm font-bold mb-1" style={{ color: "white", fontFamily: "'DM Sans', sans-serif" }}>{title}</div>
                  <div className="text-xs" style={{ color: "oklch(0.975 0.008 80 / 0.55)", fontFamily: "'DM Sans', sans-serif" }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEE COMPARISON TABLE ── */}
      <section className="py-20 bg-white">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              Average Conveyancing Fees in 2026
            </h2>
            <p className="text-base" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              Indicative ranges for a £250,000 property — actual quotes depend on your specific details
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
            <div className="grid grid-cols-4 px-6 py-4" style={{ background: "oklch(0.18 0.06 250)" }}>
              {["Transaction Type", "From", "Up to", "Typical Average"].map((h) => (
                <div key={h} className="text-xs font-bold uppercase tracking-wide" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>{h}</div>
              ))}
            </div>
            {feeBreakdown.map(({ type, low, high, avg }, i) => (
              <div
                key={type}
                className="grid grid-cols-4 px-6 py-5"
                style={{ background: i % 2 === 0 ? "white" : "oklch(0.975 0.008 80)", borderTop: "1px solid oklch(0.88 0.015 80)" }}
              >
                <div className="text-sm font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>{type}</div>
                <div className="text-sm" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{low}</div>
                <div className="text-sm" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{high}</div>
                <div className="text-sm font-bold" style={{ color: "oklch(0.72 0.12 75 / 0.9)", fontFamily: "'DM Sans', sans-serif" }}>{avg}</div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-4 text-center" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
            All fees include VAT and standard disbursements (searches, Land Registry, bank transfer). Leasehold and new build properties may attract additional fees.
          </p>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="py-20" style={{ background: "oklch(0.975 0.008 80)" }}>
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              What's Included in Your Quote?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "Solicitor's Legal Fee", desc: "The professional charge for handling the legal work — reviewing contracts, raising enquiries, and managing the transaction." },
              { title: "Local Authority Searches", desc: "Checks for planning permissions, road schemes, and other local authority matters that could affect the property." },
              { title: "Land Registry Fee", desc: "The official government fee for registering the change of ownership (or new mortgage) at HM Land Registry." },
              { title: "Bank Transfer (CHAPS) Fee", desc: "The charge for transferring funds electronically on completion day — typically £20–£50." },
              { title: "Drainage & Water Search", desc: "Confirms whether the property is connected to the public sewer and water supply." },
              { title: "Environmental Search", desc: "Checks for flood risk, contaminated land, and other environmental factors near the property." },
            ].map(({ title, desc }) => (
              <div key={title} className="flex gap-4 p-6 rounded-2xl bg-white" style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
                <CheckCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: "oklch(0.72 0.12 75 / 0.9)" }} />
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
              Conveyancing Fees FAQs
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

      {/* ── CTA ── */}
      <section className="py-20" style={{ background: "oklch(0.18 0.06 250)" }}>
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
            Compare Conveyancing Fees — Free & Instant
          </h2>
          <p className="text-base mb-8" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>
            Get fully itemised, fixed-fee quotes from regulated UK conveyancers in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/get-quote")}
              className="btn-gold px-8 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-3"
            >
              Compare Fees Now <ArrowRight size={18} />
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
