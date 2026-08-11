/**
 * LANDING PAGE: Sale & Purchase Conveyancing (Moving Home)
 * Route: /sale-and-purchase-conveyancing
 * Target keywords: "sale and purchase conveyancing", "moving home conveyancing quotes",
 *                  "conveyancing when selling and buying", "home mover conveyancing"
 * Design: British Legal Prestige — Navy + Gold + Parchment
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  CheckCircle, ChevronRight, Shield, Star, Clock, Home,
  FileText, Key, HelpCircle, ArrowRight, Phone, ArrowLeftRight, TrendingDown,
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
        <button onClick={() => navigate("/get-quote?type=sale_purchase")} className="btn-gold px-5 py-2.5 rounded-lg text-sm font-semibold">
          Get Free Quotes
        </button>
      </div>
    </nav>
  );
}

const steps = [
  { icon: FileText, title: "1. Tell Us About Your Move", desc: "Enter your sale price, purchase price, and postcodes. It takes under 2 minutes and is completely free." },
  { icon: Star, title: "2. Compare Instant Quotes", desc: "Receive transparent, itemised quotes from SRA & CLC regulated conveyancers — covering both your sale and purchase in one fixed fee." },
  { icon: Key, title: "3. Instruct & Move", desc: "Choose the firm that suits you and instruct them directly. One solicitor handles both transactions, keeping your chain moving." },
];

const faqs = [
  {
    q: "Can one solicitor handle both my sale and purchase?",
    a: "Yes — and it is strongly recommended. Using a single solicitor for your sale and purchase means they can coordinate both transactions simultaneously, keep your chain informed, and ensure exchange and completion happen on the same day. It is also more cost-effective than instructing two separate firms.",
  },
  {
    q: "How much does sale and purchase conveyancing cost?",
    a: "For a combined sale and purchase, conveyancing fees typically range from £1,500 to £3,000 including searches, disbursements, and VAT. The exact cost depends on the sale and purchase prices, whether either property is leasehold, and whether you have a mortgage. Our comparison tool shows you fully itemised quotes from all firms.",
  },
  {
    q: "How long does conveyancing take when moving home?",
    a: "Moving home typically takes 10–16 weeks from offer accepted to completion, depending on the length of your chain. A chain of three or more properties can take longer. Instructing a proactive solicitor early and responding quickly to enquiries is the most effective way to speed up the process.",
  },
  {
    q: "What is a property chain and how does it affect my move?",
    a: "A property chain forms when multiple buyers and sellers are linked — your purchase depends on your buyer completing, and your sale depends on the property you are buying being vacated. Your solicitor manages the chain on your behalf, coordinating exchange and completion dates across all parties.",
  },
  {
    q: "Do I pay Stamp Duty when moving home?",
    a: "If you are selling your main residence and buying another, standard Stamp Duty rates apply on the purchase price. You will not pay the 5% additional property surcharge as long as you are replacing your main home. Our quote tool calculates your exact Stamp Duty liability automatically.",
  },
];

import SEOHead from "@/components/SEOHead";

export default function SaleAndPurchaseConveyancing() {
  const [, navigate] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // SEO & Google Ads meta tags — optimised for Quality Score
    document.title = "Moving Home Conveyancing Quotes | Compare Sale & Purchase Solicitors";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Compare instant sale and purchase conveyancing quotes from regulated UK solicitors. One fixed fee covers both your sale and purchase. Free, no-obligation quotes in under 2 minutes.");
    // Open Graph for social sharing
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) { ogTitle = document.createElement('meta'); (ogTitle as HTMLMetaElement).setAttribute('property', 'og:title'); document.head.appendChild(ogTitle); }
    ogTitle.setAttribute('content', 'Moving Home? Compare Sale & Purchase Conveyancing Quotes');
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) { ogDesc = document.createElement('meta'); (ogDesc as HTMLMetaElement).setAttribute('property', 'og:description'); document.head.appendChild(ogDesc); }
    ogDesc.setAttribute('content', 'Get instant, fixed-fee quotes from SRA & CLC regulated conveyancers for your sale and purchase. One solicitor, both transactions, no hidden fees.');
    // JSON-LD Service schema — improves Google Ads Quality Score by confirming page relevance
    const schema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Sale and Purchase Conveyancing Quotes",
      "description": "Compare instant, fixed-fee sale and purchase conveyancing quotes from SRA and CLC regulated UK solicitors. One solicitor handles both your sale and purchase.",
      "provider": {
        "@type": "Organization",
        "name": "Compare the Conveyancing Market",
        "url": "https://www.comparetheconveyancingmarket.co.uk"
      },
      "areaServed": { "@type": "Country", "name": "United Kingdom" },
      "serviceType": "Conveyancing",
      "offers": {
        "@type": "Offer",
        "description": "Free, no-obligation sale and purchase conveyancing quotes",
        "price": "0",
        "priceCurrency": "GBP"
      },
      "keywords": "moving home conveyancing, sale and purchase conveyancing, conveyancing when selling and buying, home mover conveyancing quotes"
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'service-schema-sp';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => {
      document.title = "Compare the Conveyancing Market | Free Conveyancing Quotes";
      if (metaDesc) metaDesc.setAttribute("content", "Compare instant conveyancing quotes from SRA & CLC regulated UK solicitors. Free, no-obligation quotes in under 2 minutes.");
      document.getElementById('service-schema-sp')?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.975 0.008 80)" }}>
      <SEOHead
        title="Moving Home Conveyancing Quotes | Compare Sale & Purchase Solicitors"
        description="Compare instant sale and purchase conveyancing quotes from regulated UK solicitors. One fixed fee covers both your sale and purchase. Free, no-obligation quotes in under 2 minutes."
        canonicalPath="/sale-and-purchase-conveyancing"
        schema={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.comparetheconveyancingmarket.co.uk/" },
            { "@type": "ListItem", "position": 2, "name": "Sale and Purchase Conveyancing", "item": "https://www.comparetheconveyancingmarket.co.uk/sale-and-purchase-conveyancing" }
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
                Moving Home?
                <span className="block italic" style={{ color: "oklch(0.82 0.10 75)" }}>Compare Sale & Purchase Quotes</span>
              </h1>
              <p className="text-base mb-8 leading-relaxed" style={{ color: "oklch(0.975 0.008 80 / 0.75)", fontFamily: "'DM Sans', sans-serif" }}>
                Selling and buying at the same time is the most complex conveyancing transaction — and the most important one to get right. Compare instant, fixed-fee quotes from regulated UK solicitors who handle both sides of your move in one seamless transaction.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {["One solicitor, both transactions", "Fixed fees, no surprises", "Instant results", "No obligation"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.8)", fontFamily: "'DM Sans', sans-serif" }}>
                    <CheckCircle size={14} style={{ color: "oklch(0.72 0.12 75)" }} />
                    {item}
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/get-quote?type=sale_purchase")}
                className="btn-gold px-8 py-4 rounded-xl text-base font-bold flex items-center gap-3"
              >
                Get My Moving Home Quote <ChevronRight size={18} />
              </button>
              <button
                onClick={() => navigate("/blog/selling-and-buying-at-the-same-time")}
                className="mt-4 flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ background: "none", border: "none", color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.82 0.10 75)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.72 0.12 75)")}
              >
                Learn more about moving home <ArrowRight size={14} />
              </button>
            </div>

            {/* Cost card */}
            <div className="rounded-2xl p-8" style={{ background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(0.72 0.12 75 / 0.3)" }}>
              <h3 className="text-lg font-semibold mb-6" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
                Typical costs when moving home
              </h3>
              {[
                { label: "Legal fees — sale (inc. VAT)", value: "£700 – £1,200" },
                { label: "Legal fees — purchase (inc. VAT)", value: "£850 – £1,500" },
                { label: "Search pack (purchase)", value: "£250 – £400" },
                { label: "Land Registry fee", value: "£20 – £500" },
                { label: "Average saving vs. high street", value: "Up to £600" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-3" style={{ borderBottom: "1px solid oklch(0.975 0.008 80 / 0.1)" }}>
                  <span className="text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                  <span className="text-sm font-bold" style={{ color: "oklch(0.82 0.10 75)", fontFamily: "'DM Sans', sans-serif" }}>{value}</span>
                </div>
              ))}
              <p className="text-xs mt-4" style={{ color: "oklch(0.975 0.008 80 / 0.4)", fontFamily: "'DM Sans', sans-serif" }}>
                Indicative figures. Actual costs depend on property values and complexity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY ONE SOLICITOR ── */}
      <section className="py-20 bg-white">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              Why Use One Solicitor for Both Transactions?
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              All firms on our panel handle sale and purchase transactions together — saving you money and keeping your chain moving faster.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: ArrowLeftRight, title: "Coordinated Chain Management", desc: "Your solicitor manages both sides simultaneously, reducing delays and keeping all parties aligned on exchange and completion dates." },
              { icon: TrendingDown, title: "Lower Combined Fees", desc: "Instructing one firm for both transactions is significantly cheaper than using two separate solicitors. Our panel offers exclusive combined rates." },
              { icon: Clock, title: "Faster Completion", desc: "With one point of contact managing your sale and purchase, communication is streamlined and nothing falls through the cracks." },
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

      {/* ── HOW IT WORKS ── */}
      <section className="py-20" style={{ background: "oklch(0.975 0.008 80)" }}>
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              How It Works
            </h2>
            <p className="text-base" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              Three simple steps to compare moving home conveyancing quotes
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-8 rounded-2xl bg-white" style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
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

      {/* ── PROCESS TIMELINE ── */}
      <section className="py-20 bg-white">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              The Sale & Purchase Conveyancing Process
            </h2>
            <p className="text-base" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              What happens from offer accepted to moving day
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Home, title: "Offers Accepted on Both Properties", desc: "Once your sale and purchase offers are accepted, instruct your solicitor immediately. They will open both files and begin work in parallel." },
              { icon: FileText, title: "Searches, Enquiries & Mortgage Offer", desc: "Searches are ordered on your purchase. Enquiries are raised and answered on both properties. Your lender issues a formal mortgage offer." },
              { icon: Shield, title: "Contracts Approved & Chain Confirmed", desc: "Your solicitor reviews contracts on both sides, confirms the chain is ready, and agrees a simultaneous exchange and completion date." },
              { icon: Key, title: "Exchange & Completion on the Same Day", desc: "Contracts are exchanged across the whole chain. On completion day, your sale completes, funds transfer, and you collect the keys to your new home." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 rounded-2xl" style={{ background: "oklch(0.975 0.008 80)", border: "1px solid oklch(0.88 0.015 80)" }}>
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
      <section className="py-20" style={{ background: "oklch(0.975 0.008 80)" }}>
        <div className="container max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              Moving Home Conveyancing FAQs
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
                  <div className="px-6 pb-5 bg-white">
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
            Ready to Compare Moving Home Conveyancing Quotes?
          </h2>
          <p className="text-base mb-8" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>
            Free, instant, no obligation. Compare regulated UK conveyancers for your sale and purchase in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/get-quote?type=sale_purchase")}
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
