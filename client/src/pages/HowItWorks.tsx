/**
 * HOW IT WORKS PAGE
 * Design: British Legal Prestige — Navy + Gold + Parchment
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Scale, Search, FileText, CheckCircle, Shield, Clock, Award, ArrowRight, Phone } from "lucide-react";

export default function HowItWorks() {
  const [, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const steps = [
    {
      number: "01",
      icon: <Search size={28} />,
      title: "Tell Us About Your Transaction",
      description:
        "Answer a short series of questions about your property and circumstances. Our intelligent wizard takes around 90 seconds to complete and covers everything from property tenure and mortgage status to first-time buyer relief and Help to Buy ISAs.",
      detail: "No jargon, no confusion — every question includes a plain-English explanation of why we are asking.",
    },
    {
      number: "02",
      icon: <FileText size={28} />,
      title: "Receive Your Personalised Quotes",
      description:
        "Within seconds, we present you with a ranked list of quotes from our panel of regulated conveyancing solicitors and licensed conveyancers. Each quote is fully itemised — legal fees, disbursements, Stamp Duty Land Tax, and Land Registry fees — so you know exactly what you will pay.",
      detail: "All prices shown are exclusive rates available only through Compare the Conveyancing Market.",
    },
    {
      number: "03",
      icon: <Shield size={28} />,
      title: "Compare and Choose with Confidence",
      description:
        "Sort by price or customer rating. View each firm's accreditations, regulatory body, years of experience, and client reviews. Every firm on our panel is independently regulated by either the Solicitors Regulation Authority (SRA) or the Council for Licensed Conveyancers (CLC).",
      detail: "We only work with firms that meet our strict quality and service standards.",
    },
    {
      number: "04",
      icon: <CheckCircle size={28} />,
      title: "Instruct Directly or Request a Callback",
      description:
        "Once you have chosen your preferred firm, you can instruct them directly through our platform — completing your details and making your initial payment on account in minutes. Alternatively, request a callback from one of our advisers who will guide you through the process.",
      detail: "Your instruction is confirmed immediately and your chosen firm will contact you within one business day.",
    },
  ];

  const faqs = [
    {
      q: "Is this service free to use?",
      a: "Yes, completely. Generating and comparing quotes through Compare the Conveyancing Market is entirely free of charge. We receive a referral fee from the law firm you choose to instruct, which is already factored into the quoted price — you never pay more than the price shown.",
    },
    {
      q: "Are the prices shown guaranteed?",
      a: "Yes. The prices displayed are fixed quotes, not estimates. The only exception is if your transaction becomes significantly more complex than originally described — in which case your solicitor is required to notify you in writing before incurring any additional costs.",
    },
    {
      q: "What is the difference between a solicitor and a licensed conveyancer?",
      a: "Both are legally qualified to carry out conveyancing. Solicitors are regulated by the Solicitors Regulation Authority (SRA) and can handle a broader range of legal matters. Licensed conveyancers are regulated by the Council for Licensed Conveyancers (CLC) and specialise exclusively in property law. Both are equally qualified to handle your transaction.",
    },
    {
      q: "How long does conveyancing take?",
      a: "The average conveyancing transaction takes 8–12 weeks from instruction to completion, though this varies significantly depending on the complexity of the transaction, the length of the chain, and the responsiveness of all parties. New builds and leasehold properties typically take longer.",
    },
    {
      q: "What is Stamp Duty Land Tax (SDLT)?",
      a: "Stamp Duty Land Tax is a government tax payable on property purchases in England and Northern Ireland. The amount depends on the purchase price, whether you are a first-time buyer, and whether you already own other property. Our quote calculator automatically calculates your SDLT liability and includes it in your total cost.",
    },
    {
      q: "Can I change my mind after instructing?",
      a: "Yes. You can withdraw your instruction at any time before exchange of contracts. If you withdraw after your solicitor has begun work, you may be liable for their reasonable costs incurred to that point. Your solicitor will confirm the terms of their engagement in their client care letter.",
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.975 0.008 80)" }}>
      {/* Sticky Navbar */}
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
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.72 0.12 75)" }}>
              <Scale size={18} style={{ color: "oklch(0.12 0.05 250)" }} />
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
                style={{
                  color: path === "/how-it-works" ? "oklch(0.82 0.10 75)" : "oklch(0.975 0.008 80 / 0.8)",
                  fontFamily: "'DM Sans', sans-serif",
                  background: "none",
                  border: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.72 0.12 75)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = path === "/how-it-works" ? "oklch(0.82 0.10 75)" : "oklch(0.975 0.008 80 / 0.8)")}
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

      {/* Hero — pt-16 accounts for fixed navbar height */}
      <div className="pt-32 pb-16" style={{ background: "oklch(0.18 0.06 250)" }}>
        <div className="container max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold"
            style={{ background: "oklch(0.72 0.12 75 / 0.15)", color: "oklch(0.72 0.12 75)", border: "1px solid oklch(0.72 0.12 75 / 0.3)", fontFamily: "'DM Sans', sans-serif" }}>
            Simple. Transparent. Free.
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "white", fontFamily: "'Playfair Display', serif", lineHeight: "1.15" }}>
            How It Works
          </h1>
          <p className="text-base" style={{ color: "oklch(0.975 0.008 80 / 0.65)", fontFamily: "'DM Sans', sans-serif", maxWidth: "520px", margin: "0 auto" }}>
            Finding the right conveyancer at the right price should not be complicated. Here is exactly how our process works.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="container max-w-3xl mx-auto py-16">
        <div className="space-y-8">
          {steps.map((step, i) => (
            <div key={step.number} className="bg-white rounded-2xl p-8 flex gap-6" style={{ border: "1px solid oklch(0.88 0.015 80)", boxShadow: "0 2px 12px oklch(0.18 0.06 250 / 0.05)" }}>
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "oklch(0.18 0.06 250)" }}>
                  <span style={{ color: "oklch(0.72 0.12 75)" }}>{step.icon}</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold tracking-widest" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>
                    STEP {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "oklch(0.35 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                  {step.description}
                </p>
                <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "oklch(0.975 0.008 80)", color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif", borderLeft: "3px solid oklch(0.72 0.12 75)" }}>
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust stats */}
        <div className="grid grid-cols-3 gap-4 my-12">
          {[
            { icon: <Clock size={20} />, stat: "90 seconds", label: "Average time to get quotes" },
            { icon: <Award size={20} />, stat: "100% regulated", label: "All firms SRA or CLC regulated" },
            { icon: <Shield size={20} />, stat: "Fixed prices", label: "No hidden fees, ever" },
          ].map(({ icon, stat, label }) => (
            <div key={label} className="bg-white rounded-2xl p-5 text-center" style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: "oklch(0.18 0.06 250 / 0.08)" }}>
                <span style={{ color: "oklch(0.18 0.06 250)" }}>{icon}</span>
              </div>
              <div className="text-lg font-bold mb-0.5" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>{stat}</div>
              <div className="text-xs" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl p-6" style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
                <h4 className="text-sm font-bold mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>{q}</h4>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl p-8 text-center" style={{ background: "oklch(0.18 0.06 250)", border: "1px solid oklch(0.72 0.12 75 / 0.2)" }}>
          <h3 className="text-2xl font-bold mb-2" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
            Ready to Get Your Free Quotes?
          </h3>
          <p className="text-sm mb-6" style={{ color: "oklch(0.975 0.008 80 / 0.6)", fontFamily: "'DM Sans', sans-serif" }}>
            It takes 90 seconds and costs nothing.
          </p>
          <button onClick={() => navigate("/get-quote")} className="btn-gold px-8 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 mx-auto">
            Compare Quotes Now
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center text-xs" style={{ borderTop: "1px solid oklch(0.88 0.015 80)", color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
        © {new Date().getFullYear()} ComparetheConveyancingMarket Ltd. All rights reserved.
        <span className="mx-2">·</span>
        <button onClick={() => navigate("/privacy-policy")} className="hover:underline">Privacy Policy</button>
        <span className="mx-2">·</span>
        <button onClick={() => navigate("/terms")} className="hover:underline">Terms & Conditions</button>
      </div>
    </div>
  );
}
