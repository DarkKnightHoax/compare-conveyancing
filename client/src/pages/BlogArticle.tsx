/**
 * BLOG ARTICLE PAGE
 * Design: British Legal Prestige — Navy + Gold + Parchment
 * SEO: Article JSON-LD schema + per-article meta tags injected on mount
 */

import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Scale, ArrowLeft, Clock, ArrowRight, Tag } from "lucide-react";
import { BLOG_ARTICLES } from "../lib/blogData";

export default function BlogArticle() {
  const [, navigate] = useLocation();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const article = BLOG_ARTICLES.find((a) => a.slug === slug);
  const related = article
    ? BLOG_ARTICLES.filter((a) => article.relatedSlugs.includes(a.slug))
    : [];

  // Inject Article JSON-LD schema and per-article meta tags
  useEffect(() => {
    if (!article) return;

    document.title = article.metaTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", article.metaDescription);

    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.metaDescription,
      datePublished: article.publishDate,
      author: {
        "@type": "Organization",
        name: "Compare the Conveyancing Market",
      },
      publisher: {
        "@type": "Organization",
        name: "Compare the Conveyancing Market",
      },
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "article-schema";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.getElementById("article-schema")?.remove();
      // Restore homepage meta
      document.title = "Compare the Conveyancing Market | Free Conveyancing Quotes";
      if (metaDesc) metaDesc.setAttribute("content", "Compare instant conveyancing quotes from SRA & CLC regulated UK solicitors. Free, no-obligation quotes in under 2 minutes.");
    };
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.975 0.008 80)" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-3" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>Article Not Found</h1>
          <button onClick={() => navigate("/blog")} className="btn-gold px-6 py-3 rounded-xl text-sm font-bold">Back to Blog</button>
        </div>
      </div>
    );
  }

  const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
    "Costs & Fees":        { bg: "oklch(0.72 0.12 75 / 0.12)", text: "oklch(0.58 0.14 75)" },
    "Conveyancing Basics": { bg: "oklch(0.18 0.06 250 / 0.08)", text: "oklch(0.18 0.06 250)" },
    "First-Time Buyers":   { bg: "oklch(0.55 0.18 145 / 0.10)", text: "oklch(0.40 0.18 145)" },
    "Property Law":        { bg: "oklch(0.55 0.15 30 / 0.10)", text: "oklch(0.45 0.15 30)" },
  };

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
                style={{ color: "oklch(0.975 0.008 80 / 0.8)", fontFamily: "'DM Sans', sans-serif", background: "none", border: "none" }}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={() => navigate("/get-quote")} className="btn-gold px-5 py-2.5 rounded-lg text-sm font-semibold">
            Get Free Quotes
          </button>
        </div>
      </nav>

      {/* ── ARTICLE HERO ── */}
      <section className="py-14" style={{ background: "oklch(0.18 0.06 250)" }}>
        <div className="container max-w-3xl mx-auto">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-xs mb-6 transition-colors"
            style={{ color: "oklch(0.975 0.008 80 / 0.5)", fontFamily: "'DM Sans', sans-serif", background: "none", border: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.72 0.12 75)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.975 0.008 80 / 0.5)")}
          >
            <ArrowLeft size={13} /> Back to Blog
          </button>

          <div className="flex items-center gap-3 mb-5">
            <span className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "oklch(0.72 0.12 75 / 0.15)", color: "oklch(0.82 0.10 75)", fontFamily: "'DM Sans', sans-serif" }}>
              <Tag size={10} className="inline mr-1" />{article.category}
            </span>
            <span className="text-xs flex items-center gap-1" style={{ color: "oklch(0.975 0.008 80 / 0.5)", fontFamily: "'DM Sans', sans-serif" }}>
              <Clock size={11} /> {article.readTime}
            </span>
            <span className="text-xs" style={{ color: "oklch(0.975 0.008 80 / 0.4)", fontFamily: "'DM Sans', sans-serif" }}>
              {article.publishDate}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
            {article.title}
          </h1>
          <div className="w-16 h-0.5 mb-5" style={{ background: "oklch(0.72 0.12 75)" }} />
          <p className="text-base leading-relaxed" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>
            {article.excerpt}
          </p>
        </div>
      </section>

      {/* ── ARTICLE BODY ── */}
      <section className="py-12">
        <div className="container max-w-3xl mx-auto">
          {/* Table of contents */}
          <div className="rounded-xl p-5 mb-10" style={{ background: "white", border: "1px solid oklch(0.88 0.015 80)" }}>
            <h2 className="text-sm font-bold mb-3" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>In this article</h2>
            <ol className="space-y-1.5">
              {article.sections.map((section, i) => (
                <li key={i}>
                  <a
                    href={`#section-${i}`}
                    className="text-sm transition-colors"
                    style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.72 0.12 75)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.55 0.04 250)")}
                  >
                    {i + 1}. {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {article.sections.map((section, i) => (
              <div key={i} id={`section-${i}`}>
                <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
                  {section.heading}
                </h2>
                <div className="w-8 h-0.5 mb-4" style={{ background: "oklch(0.72 0.12 75)" }} />
                <p className="text-base leading-relaxed" style={{ color: "oklch(0.35 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          {/* Mid-article CTA */}
          <div className="my-12 rounded-2xl p-7 flex flex-col md:flex-row items-center justify-between gap-5"
            style={{ background: "oklch(0.18 0.06 250)", border: "1px solid oklch(0.72 0.12 75 / 0.3)" }}>
            <div>
              <h3 className="text-lg font-bold mb-1" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
                Compare Conveyancing Quotes Now
              </h3>
              <p className="text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>
                Free, instant quotes from SRA & CLC regulated firms. No obligation.
              </p>
            </div>
            <button onClick={() => navigate("/get-quote")} className="btn-gold px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap flex items-center gap-2">
              Get Free Quotes <ArrowRight size={14} />
            </button>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-6" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
                Related Articles
              </h3>
              <div className="grid md:grid-cols-2 gap-5">
                {related.map((rel) => (
                  <div
                    key={rel.slug}
                    className="bg-white rounded-xl p-5 cursor-pointer group transition-all"
                    style={{ border: "1px solid oklch(0.88 0.015 80)" }}
                    onClick={() => navigate(`/blog/${rel.slug}`)}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75 / 0.5)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
                  >
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold mb-3 inline-block"
                      style={{ background: CATEGORY_COLORS[rel.category]?.bg || "oklch(0.94 0.012 80)", color: CATEGORY_COLORS[rel.category]?.text || "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                      {rel.category}
                    </span>
                    <h4 className="text-base font-bold mb-2 group-hover:underline" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif", textDecorationColor: "oklch(0.72 0.12 75)" }}>
                      {rel.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>
                      Read article <ArrowRight size={12} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
