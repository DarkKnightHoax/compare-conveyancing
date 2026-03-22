/*
 * LANDING PAGE: Remortgage Conveyancing
 * Target keyword: "remortgage conveyancing solicitor"
 * Design: British Legal Prestige — Navy + Gold + Parchment
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  CheckCircle, ChevronRight, Shield, Clock, RefreshCw,
  FileText, Zap, HelpCircle, ArrowRight, Phone, PoundSterling,
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
        <button onClick={() => navigate("/get-quote?type=remortgage")} className="btn-gold px-5 py-2.5 rounded-lg text-sm font-semibold">
          Get Free Quotes
        </button>
      </div>
    </nav>
  );
}

const faqs = [
  {
    q: "How much does remortgage conveyancing cost?",
    a: "Remortgage conveyancing fees typically range from £300 to £900 including VAT. Many lenders offer a free legal service through their own panel solicitors, but using an independent solicitor often gives you more flexibility and can be cheaper overall.",
  },
  {
    q: "Do I need a solicitor to remortgage?",
    a: "Yes. A solicitor or licensed conveyancer is required to handle the legal work when you remortgage — they register the new mortgage with the Land Registry and deal with the redemption of your existing mortgage.",
  },
  {
    q: "How long does remortgage conveyancing take?",
    a: "Remortgage conveyancing is typically faster than a purchase — usually 4 to 8 weeks from instruction to completion. Using a responsive, efficient solicitor is the biggest factor in keeping this timeline short.",
  },
  {
    q: "Can I use my own solicitor for a remortgage?",
    a: "Yes, you can instruct your own solicitor rather than using your lender's free legal service. This gives you more control and can sometimes be faster. Compare quotes to find the best value.",
  },
  {
    q: "Is there Stamp Duty on a remortgage?",
    a: "No. Stamp Duty Land Tax (SDLT) is not payable on a remortgage because you are not purchasing a new property — you are simply changing your mortgage lender on a property you already own.",
  },
];

export default function RemortgageConveyancing() {
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
                <Zap size={12} /> Fast, Fixed-Fee Remortgage Conveyancing
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-5" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
                Remortgage
                <span className="block italic" style={{ color: "oklch(0.82 0.10 75)" }}>Conveyancing Quotes</span>
              </h1>
              <p className="text-base mb-8 leading-relaxed" style={{ color: "oklch(0.975 0.008 80 / 0.75)", fontFamily: "'DM Sans', sans-serif" }}>
                Switching your mortgage deal? Don't let slow or expensive legal work hold you back. Compare instant quotes from regulated remortgage solicitors and complete in as little as 4 weeks.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {["No Stamp Duty", "Fixed-fee quotes", "4–8 week completion", "SRA & CLC regulated"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.8)", fontFamily: "'DM Sans', sans-serif" }}>
                    <CheckCircle size={14} style={{ color: "oklch(0.72 0.12 75)" }} />
                    {item}
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/get-quote?type=remortgage")}
                className="btn-gold px-8 py-4 rounded-xl text-base font-bold flex items-center gap-3"
              >
                Compare Remortgage Quotes <ChevronRight size={18} />
              </button>
            </div>

            {/* Cost breakdown card */}
            <div className="rounded-2xl p-8" style={{ background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(0.72 0.12 75 / 0.3)" }}>
              <h3 className="text-lg font-semibold mb-6" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
                Typical remortgage conveyancing costs
              </h3>
              {[
                { label: "Legal fees (inc. VAT)", value: "£300 – £900" },
                { label: "Land Registry fee", value: "£20 – £500" },
                { label: "Bank transfer fee", value: "£20 – £50" },
                { label: "Stamp Duty Land Tax", value: "£0" },
                { label: "Average completion time", value: "4–8 weeks" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-3" style={{ borderBottom: "1px solid oklch(0.975 0.008 80 / 0.1)" }}>
                  <span className="text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                  <span className="text-sm font-bold" style={{ color: "oklch(0.82 0.10 75)", fontFamily: "'DM Sans', sans-serif" }}>{value}</span>
                </div>
              ))}
              <p className="text-xs mt-4" style={{ color: "oklch(0.975 0.008 80 / 0.4)", fontFamily: "'DM Sans', sans-serif" }}>
                Indicative figures. Actual costs depend on property value and lender requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY COMPARE ── */}
      <section className="py-20 bg-white">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              Why Compare Remortgage Solicitors?
            </h2>
            <p className="text-base" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              Your lender's free legal service isn't always the fastest or cheapest option
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: PoundSterling, title: "Save on Legal Fees", desc: "Independent solicitors often charge less than lender panel firms, especially for straightforward remortgages. Compare and save." },
              { icon: Clock, title: "Faster Completions", desc: "Specialist remortgage solicitors handle high volumes and know how to move quickly. Many complete in 4–6 weeks." },
              { icon: Shield, title: "Fully Regulated", desc: "Every firm on our panel is regulated by the SRA or CLC — fully insured and credit-checked for your protection." },
            ].map(({ icon: Icon, title, desc }) => (
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

      {/* ── PROCESS ── */}
      <section className="py-20" style={{ background: "oklch(0.975 0.008 80)" }}>
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              The Remortgage Conveyancing Process
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { step: "01", title: "Mortgage Offer Received", desc: "Your new lender issues a formal mortgage offer. Send a copy to your solicitor to begin the legal work." },
              { step: "02", title: "Title & Searches", desc: "Your solicitor reviews the title deeds and carries out any searches required by your new lender." },
              { step: "03", title: "Report on Title", desc: "Your solicitor reports to your lender confirming the property is suitable security for the mortgage." },
              { step: "04", title: "Completion", desc: "Your new mortgage funds are drawn down, your old mortgage is redeemed, and the new charge is registered at the Land Registry." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-6 p-6 rounded-2xl bg-white" style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-bold" style={{ background: "oklch(0.18 0.06 250)", color: "oklch(0.72 0.12 75)", fontFamily: "'Playfair Display', serif" }}>
                  {step}
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
              Remortgage Conveyancing FAQs
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
            Compare Remortgage Conveyancing Quotes Today
          </h2>
          <p className="text-base mb-8" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>
            Free, instant, no obligation. Takes under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/get-quote?type=remortgage")}
              className="btn-gold px-8 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-3"
            >
              Get My Remortgage Quote <ArrowRight size={18} />
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
