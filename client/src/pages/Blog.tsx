/**
 * BLOG INDEX PAGE
 * Design: British Legal Prestige — Navy + Gold + Parchment
 * SEO: per-page meta title/description injected on mount
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Scale, ArrowRight, Clock, Tag } from "lucide-react";
import { BLOG_ARTICLES } from "../lib/blogData";

const CATEGORIES = ["All", ...Array.from(new Set(BLOG_ARTICLES.map((a) => a.category)))];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "Costs & Fees":       { bg: "oklch(0.72 0.12 75 / 0.12)", text: "oklch(0.58 0.14 75)" },
  "Conveyancing Basics":{ bg: "oklch(0.18 0.06 250 / 0.08)", text: "oklch(0.18 0.06 250)" },
  "First-Time Buyers":  { bg: "oklch(0.55 0.18 145 / 0.10)", text: "oklch(0.40 0.18 145)" },
  "Property Law":       { bg: "oklch(0.55 0.15 30 / 0.10)", text: "oklch(0.45 0.15 30)" },
};

export default function Blog() {
  const [, navigate] = useLocation();
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    document.title = "Conveyancing Blog | Compare the Conveyancing Market";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Expert conveyancing guides and advice — costs, timelines, leasehold, first-time buyers, and more from Compare the Conveyancing Market.");
  }, []);

  const filtered = activeCategory === "All"
    ? BLOG_ARTICLES
    : BLOG_ARTICLES.filter((a) => a.category === activeCategory);

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.975 0.008 80)" }}>
      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50" style={{ background: "oklch(0.18 0.06 250)", borderBottom: "1px solid oklch(0.72 0.12 75 / 0.2)" }}>
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.72 0.12 75)" }}>
              <Scale size={15} style={{ color: "oklch(0.12 0.05 250)" }} />
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
              <button key={label} onClick={() => navigate(path)}
                className="text-sm font-medium transition-colors"
                style={{ color: label === "Blog" ? "oklch(0.72 0.12 75)" : "oklch(0.975 0.008 80 / 0.8)", fontFamily: "'DM Sans', sans-serif", background: "none", border: "none" }}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={() => navigate("/get-quote")} className="btn-gold px-5 py-2.5 rounded-lg text-sm font-semibold">
            Get Free Quotes
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="py-14" style={{ background: "oklch(0.18 0.06 250)" }}>
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-5"
            style={{ background: "oklch(0.72 0.12 75 / 0.15)", border: "1px solid oklch(0.72 0.12 75 / 0.4)", color: "oklch(0.82 0.10 75)", fontFamily: "'DM Sans', sans-serif" }}>
            <Tag size={12} /> Conveyancing Guides & Advice
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
            The Conveyancing <em style={{ color: "oklch(0.82 0.10 75)" }}>Blog</em>
          </h1>
          <div className="w-16 h-0.5 mx-auto mb-5" style={{ background: "oklch(0.72 0.12 75)" }} />
          <p className="text-base max-w-xl mx-auto" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>
            Expert guides to help you navigate the conveyancing process with confidence — from costs and timelines to leasehold law and first-time buyer tips.
          </p>
        </div>
      </section>

      {/* ── CATEGORY FILTERS ── */}
      <div className="py-4" style={{ borderBottom: "1px solid oklch(0.88 0.015 80)" }}>
        <div className="container">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  ...(activeCategory === cat
                    ? { background: "oklch(0.18 0.06 250)", color: "white" }
                    : { background: "white", color: "oklch(0.45 0.04 250)", border: "1px solid oklch(0.88 0.015 80)" }),
                }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-12">
        <div className="container">
          {filtered.length === 0 ? (
            <p className="text-center py-16" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>No articles in this category yet.</p>
          ) : (
            <>
              {/* Featured article */}
              {featured && (
                <div
                  className="rounded-2xl overflow-hidden mb-10 cursor-pointer group"
                  style={{ border: "1px solid oklch(0.88 0.015 80)", background: "white", boxShadow: "0 4px 20px oklch(0.18 0.06 250 / 0.07)" }}
                  onClick={() => navigate(`/blog/${featured.slug}`)}
                >
                  <div className="grid md:grid-cols-2">
                    <div className="p-8 md:p-10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{ background: CATEGORY_COLORS[featured.category]?.bg || "oklch(0.94 0.012 80)", color: CATEGORY_COLORS[featured.category]?.text || "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                            {featured.category}
                          </span>
                          <span className="text-xs flex items-center gap-1" style={{ color: "oklch(0.65 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                            <Clock size={11} /> {featured.readTime}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold mb-3 group-hover:underline" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif", textDecorationColor: "oklch(0.72 0.12 75)" }}>
                          {featured.title}
                        </h2>
                        <p className="text-sm leading-relaxed mb-6" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                          {featured.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>
                        Read article <ArrowRight size={15} />
                      </div>
                    </div>
                    <div className="hidden md:flex items-center justify-center p-10"
                      style={{ background: "linear-gradient(135deg, oklch(0.18 0.06 250), oklch(0.25 0.07 250))" }}>
                      <div className="text-center">
                        <div className="text-6xl font-bold mb-2" style={{ color: "oklch(0.72 0.12 75 / 0.3)", fontFamily: "'Playfair Display', serif" }}>
                          {featured.sections.length}
                        </div>
                        <div className="text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.6)", fontFamily: "'DM Sans', sans-serif" }}>sections</div>
                        <div className="mt-6 text-xs px-4 py-2 rounded-full" style={{ background: "oklch(0.72 0.12 75 / 0.15)", color: "oklch(0.82 0.10 75)", fontFamily: "'DM Sans', sans-serif" }}>
                          {featured.readTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Article grid */}
              {rest.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((article) => (
                    <div
                      key={article.slug}
                      className="bg-white rounded-2xl overflow-hidden cursor-pointer group transition-all duration-200"
                      style={{ border: "1px solid oklch(0.88 0.015 80)", boxShadow: "0 2px 12px oklch(0.18 0.06 250 / 0.05)" }}
                      onClick={() => navigate(`/blog/${article.slug}`)}
                      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 24px oklch(0.18 0.06 250 / 0.12)")}
                      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 12px oklch(0.18 0.06 250 / 0.05)")}
                    >
                      <div className="h-2" style={{ background: "linear-gradient(90deg, oklch(0.18 0.06 250), oklch(0.72 0.12 75))" }} />
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={{ background: CATEGORY_COLORS[article.category]?.bg || "oklch(0.94 0.012 80)", color: CATEGORY_COLORS[article.category]?.text || "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                            {article.category}
                          </span>
                          <span className="text-xs flex items-center gap-1" style={{ color: "oklch(0.65 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                            <Clock size={10} /> {article.readTime}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 group-hover:underline" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif", textDecorationColor: "oklch(0.72 0.12 75)" }}>
                          {article.title}
                        </h3>
                        <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>
                          Read more <ArrowRight size={13} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* CTA */}
          <div className="mt-14 rounded-2xl p-8 text-center" style={{ background: "oklch(0.18 0.06 250)" }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
              Ready to Compare Conveyancing Quotes?
            </h3>
            <p className="text-sm mb-5" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>
              Get free, instant quotes from SRA and CLC regulated conveyancers. No obligation. Results in under 2 minutes.
            </p>
            <button onClick={() => navigate("/get-quote")} className="btn-gold px-8 py-3.5 rounded-xl text-sm font-bold inline-flex items-center gap-2">
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
              <span className="text-sm font-semibold" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>Compare the Conveyancing Market</span>
            </div>
            <div className="flex gap-6 text-xs" style={{ color: "oklch(0.975 0.008 80 / 0.4)", fontFamily: "'DM Sans', sans-serif" }}>
              {[
                { label: "Terms & Conditions", path: "/terms" },
                { label: "Privacy Policy", path: "/privacy-policy" },
                { label: "Contact Us", path: "/contact" },
                { label: "FAQs", path: "/faq" },
                { label: "Blog", path: "/blog" },
              ].map(({ label, path }) => (
                <button key={label} onClick={() => navigate(path)} className="hover:text-white transition-colors" style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>{label}</button>
              ))}
            </div>
            <div className="text-xs" style={{ color: "oklch(0.975 0.008 80 / 0.3)", fontFamily: "'DM Sans', sans-serif" }}>
              © {new Date().getFullYear()} Compare the Conveyancing Market
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
