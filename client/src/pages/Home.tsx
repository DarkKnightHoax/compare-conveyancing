/**
 * HOME PAGE
 * Design: British Legal Prestige — Navy + Gold + Parchment
 * Fonts: Playfair Display (headlines) + DM Sans (body)
 * Sections: Hero (animated particles + split layout) → Stats → How It Works → Trust → CTA
 */

import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Shield, Star, Clock, ChevronRight, Award, CheckCircle, Phone, ArrowRight, Scale, Home as HomeIcon, RefreshCw } from "lucide-react";

const HERO_BG = "https://files.manuscdn.com/user_upload_by_module/session_file/109506846/AMpvREVqFOfDvSzS.jpg";
const OFFICE_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/109506846/RCqjUtvMGqsuUJBk.jpg";
const KEYS_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/109506846/ngoYOhQQNkqdGVKW.jpg";

// ─── ANIMATED PARTICLES ───────────────────────────────────────────────────────
function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; opacity: number; type: 'circle' | 'line';
      angle: number; length: number;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.4 + 0.1,
        type: Math.random() > 0.6 ? 'line' : 'circle',
        angle: Math.random() * Math.PI * 2,
        length: Math.random() * 30 + 10,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += 0.005;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.save();
        ctx.globalAlpha = p.opacity;

        if (p.type === 'circle') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201, 168, 76, ${p.opacity})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(
            p.x + Math.cos(p.angle) * p.length,
            p.y + Math.sin(p.angle) * p.length
          );
          ctx.strokeStyle = `rgba(201, 168, 76, ${p.opacity * 0.6})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        ctx.restore();
      });

      // Draw connecting lines between nearby particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(201, 168, 76, ${(1 - dist / 100) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particles-canvas"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

// ─── COUNT-UP HOOK ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);

  return count;
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ value, suffix, label, started }: { value: number; suffix: string; label: string; started: boolean }) {
  const count = useCountUp(value, 2000, started);
  return (
    <div className="text-center">
      <div className="text-4xl font-bold font-mono-numbers" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'JetBrains Mono', monospace" }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm mt-1 font-medium" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </div>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
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
        background: scrolled ? "oklch(0.12 0.05 250 / 0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid oklch(0.72 0.12 75 / 0.2)" : "none",
        boxShadow: scrolled ? "0 4px 20px oklch(0.12 0.05 250 / 0.3)" : "none",
      }}
    >
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.72 0.12 75)" }}>
            <Scale size={18} style={{ color: "oklch(0.12 0.05 250)" }} />
          </div>
          <div>
            <div className="font-bold text-sm leading-tight" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
              Compare
            </div>
            <div className="text-xs leading-tight" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>
              the Conveyancing Market
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
           {([            { label: "How It Works", path: "/how-it-works" },
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

        <button
          onClick={() => navigate("/get-quote")}
          className="btn-gold px-5 py-2.5 rounded-lg text-sm font-semibold"
        >
          Get Free Quotes
        </button>
      </div>
    </nav>
  );
}

// ─── MAIN HOME PAGE ───────────────────────────────────────────────────────────
export default function Home() {
  const [, navigate] = useLocation();
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsStarted(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const quoteTypes = [
    { icon: HomeIcon, label: "Property Purchase", desc: "Buying a home", path: "/get-quote?type=purchase" },
    { icon: ArrowRight, label: "Property Sale", desc: "Selling a home", path: "/get-quote?type=sale" },
    { icon: RefreshCw, label: "Sale & Purchase", desc: "Moving home", path: "/get-quote?type=sale_purchase" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.975 0.008 80)" }}>
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.10 0.05 250 / 0.92) 0%, oklch(0.18 0.06 250 / 0.80) 60%, oklch(0.12 0.05 250 / 0.70) 100%)" }} />

        {/* Animated particles */}
        <ParticlesCanvas />

        <div className="container relative z-10 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Headline */}
            <div className="animate-slide-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
                style={{ background: "oklch(0.72 0.12 75 / 0.15)", border: "1px solid oklch(0.72 0.12 75 / 0.4)", color: "oklch(0.82 0.10 75)", fontFamily: "'DM Sans', sans-serif" }}>
                <Shield size={12} />
                SRA & CLC Regulated Firms Only
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
                Compare
                <span className="block italic" style={{ color: "oklch(0.82 0.10 75)" }}>
                  Conveyancing
                </span>
                Quotes Instantly
              </h1>

              <p className="text-lg mb-8 leading-relaxed" style={{ color: "oklch(0.975 0.008 80 / 0.75)", fontFamily: "'DM Sans', sans-serif", maxWidth: "480px" }}>
                Get accurate, transparent quotes from regulated UK conveyancers in under 2 minutes. No hidden fees. No obligation.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                {["Free to use", "Instant results", "No obligation"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.8)", fontFamily: "'DM Sans', sans-serif" }}>
                    <CheckCircle size={14} style={{ color: "oklch(0.72 0.12 75)" }} />
                    {item}
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate("/get-quote")}
                className="btn-gold px-8 py-4 rounded-xl text-base font-bold flex items-center gap-3 animate-pulse-gold"
              >
                Get My Free Quotes
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Right: Quote type selector card */}
            <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="rounded-2xl p-8 backdrop-blur-sm"
                style={{ background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(0.72 0.12 75 / 0.25)" }}>
                <h3 className="text-xl font-semibold mb-2" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
                  What do you need?
                </h3>
                <p className="text-sm mb-6" style={{ color: "oklch(0.975 0.008 80 / 0.6)", fontFamily: "'DM Sans', sans-serif" }}>
                  Select your transaction type to get started
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {quoteTypes.map(({ icon: Icon, label, desc, path }) => (
                    <button
                      key={label}
                      onClick={() => navigate(path)}
                      className="p-4 rounded-xl text-left transition-all duration-200 group"
                      style={{ background: "oklch(0.22 0.07 250 / 0.95)", border: "1.5px solid oklch(0.72 0.12 75 / 0.7)", boxShadow: "0 2px 16px oklch(0 0 0 / 0.4), inset 0 1px 0 oklch(1 0 0 / 0.08)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "oklch(0.72 0.12 75 / 0.18)";
                        e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)";
                        e.currentTarget.style.boxShadow = "0 4px 24px oklch(0.72 0.12 75 / 0.25), inset 0 1px 0 oklch(1 0 0 / 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "oklch(0.22 0.07 250 / 0.95)";
                        e.currentTarget.style.borderColor = "oklch(0.72 0.12 75 / 0.7)";
                        e.currentTarget.style.boxShadow = "0 2px 16px oklch(0 0 0 / 0.4), inset 0 1px 0 oklch(1 0 0 / 0.08)";
                      }}
                    >
                      <Icon size={20} className="mb-2" style={{ color: "oklch(0.82 0.14 75)" }} />
                      <div className="text-sm font-semibold" style={{ color: "white", fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
                      <div className="text-xs mt-0.5" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>{desc}</div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-5" style={{ borderTop: "1px solid oklch(0.975 0.008 80 / 0.1)" }}>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: `oklch(${0.3 + i * 0.1} 0.07 250)`, border: "2px solid oklch(0.18 0.06 250)", color: "white", fontFamily: "'DM Sans', sans-serif" }}>
                          {["EC", "PC", "PP"][i - 1]}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs" style={{ color: "oklch(0.975 0.008 80 / 0.6)", fontFamily: "'DM Sans', sans-serif" }}>
                      <span style={{ color: "oklch(0.82 0.10 75)", fontWeight: 600 }}>5 regulated firms</span> ready to quote
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: "linear-gradient(to bottom, transparent, oklch(0.975 0.008 80))" }} />
      </section>

      {/* ── STATS BAR ── */}
      <section ref={statsRef} className="py-12" style={{ background: "oklch(0.18 0.06 250)" }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value={4200} suffix="+" label="Quotes Compared" started={statsStarted} />
            <StatCard value={5} suffix="" label="Regulated Firms" started={statsStarted} />
            <StatCard value={98} suffix="%" label="Customer Satisfaction" started={statsStarted} />
            <StatCard value={2} suffix=" min" label="Average Quote Time" started={statsStarted} />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24" style={{ background: "oklch(0.975 0.008 80)" }}>
        <div className="container">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>
              Simple Process
            </div>
            <h2 className="text-4xl font-bold mb-4" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              How It Works
            </h2>
            <div className="gold-rule w-24 mx-auto mb-4" />
            <p className="text-base max-w-xl mx-auto" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              Getting your conveyancing quotes takes under two minutes. Here is how the process works from start to finish.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Tell Us About Your Property",
                desc: "Answer a few straightforward questions about your transaction — property type, value, location, and your specific circumstances.",
                icon: HomeIcon,
              },
              {
                step: "02",
                title: "Compare Transparent Quotes",
                desc: "Instantly see side-by-side quotes from regulated conveyancers. Every fee is itemised — legal fees, disbursements, SDLT, and Land Registry.",
                icon: Scale,
              },
              {
                step: "03",
                title: "Instruct Your Conveyancer",
                desc: "Choose your preferred firm and instruct them directly online. Pay your initial fee on account and your conveyancer will be in touch within 24 hours.",
                icon: CheckCircle,
              },
            ].map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="card-hover-gold bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-start gap-4 mb-5">
                  <div className="text-5xl font-bold leading-none" style={{ color: "oklch(0.72 0.12 75 / 0.2)", fontFamily: "'Playfair Display', serif" }}>
                    {step}
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mt-1" style={{ background: "oklch(0.18 0.06 250)" }}>
                    <Icon size={18} style={{ color: "oklch(0.72 0.12 75)" }} />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST SECTION ── */}
      <section className="py-24 relative overflow-hidden" style={{ background: "oklch(0.18 0.06 250)" }}>
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>
                Why Choose Us
              </div>
              <h2 className="text-4xl font-bold mb-4" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
                Trusted by Thousands of<br />
                <em>UK Home Buyers</em>
              </h2>
              <div className="gold-rule w-24 mb-6" />
              <p className="text-base mb-8 leading-relaxed" style={{ color: "oklch(0.975 0.008 80 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>
                Every firm on our panel is regulated by either the Solicitors Regulation Authority (SRA) or the Council for Licensed Conveyancers (CLC). We only work with firms that meet our strict quality standards.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Shield, text: "All firms SRA or CLC regulated" },
                  { icon: Star, text: "Minimum 4.5 star rating required" },
                  { icon: Clock, text: "Quotes generated in under 2 minutes" },
                  { icon: Award, text: "Law Society Conveyancing Quality Scheme members" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.72 0.12 75 / 0.15)" }}>
                      <Icon size={15} style={{ color: "oklch(0.72 0.12 75)" }} />
                    </div>
                    <span className="text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.8)", fontFamily: "'DM Sans', sans-serif" }}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid oklch(0.72 0.12 75 / 0.2)" }}>
                <img src={OFFICE_IMG} alt="Professional solicitor's office" className="w-full h-80 object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-xl p-5 shadow-xl" style={{ background: "oklch(0.72 0.12 75)", minWidth: "200px" }}>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} fill="oklch(0.12 0.05 250)" style={{ color: "oklch(0.12 0.05 250)" }} />
                  ))}
                </div>
                <div className="text-sm font-bold" style={{ color: "oklch(0.12 0.05 250)", fontFamily: "'DM Sans', sans-serif" }}>
                  "Saved £340 on my purchase"
                </div>
                <div className="text-xs mt-1" style={{ color: "oklch(0.12 0.05 250 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>
                  — Sarah T., First-Time Buyer
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BLOG & FAQ TEASER ── */}
      <section className="py-20" style={{ background: "oklch(0.975 0.008 80)" }}>
        <div className="container">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>Resources</div>
            <h2 className="text-4xl font-bold mb-4" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>Guides & Advice</h2>
            <div className="gold-rule w-24 mx-auto mb-4" />
            <p className="text-base max-w-xl mx-auto" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              Everything you need to know about conveyancing — from costs and timelines to leasehold law and first-time buyer tips.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* FAQ card */}
            <div
              className="card-hover-gold bg-white rounded-2xl p-8 shadow-sm cursor-pointer"
              onClick={() => navigate("/faq")}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: "oklch(0.18 0.06 250)" }}>
                <CheckCircle size={18} style={{ color: "oklch(0.72 0.12 75)" }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>Conveyancing FAQs</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                Answers to the 20 most common conveyancing questions — costs, timelines, searches, SDLT, and more.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>
                Read the FAQs <ArrowRight size={14} />
              </div>
            </div>
            {/* Blog card */}
            <div
              className="card-hover-gold bg-white rounded-2xl p-8 shadow-sm cursor-pointer"
              onClick={() => navigate("/blog")}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: "oklch(0.18 0.06 250)" }}>
                <Award size={18} style={{ color: "oklch(0.72 0.12 75)" }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>Conveyancing Blog</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                In-depth guides on conveyancing costs, the buying process, leasehold vs freehold, and first-time buyer advice.
              </p>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>
                Read the Blog <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 relative overflow-hidden" style={{ background: "oklch(0.975 0.008 80)" }}>
        <div className="container text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "oklch(0.18 0.06 250)" }}>
              <img src={KEYS_IMG} alt="Keys" className="w-10 h-10 object-cover rounded-lg" />
            </div>
            <h2 className="text-4xl font-bold mb-4" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              Ready to Find Your<br />
              <em>Perfect Conveyancer?</em>
            </h2>
            <div className="gold-rule w-24 mx-auto mb-6" />
            <p className="text-base mb-8" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              Join thousands of UK home buyers who have used Compare the Conveyancing Market to find the right solicitor at the right price.
            </p>
            <button
              onClick={() => navigate("/get-quote")}
              className="btn-gold px-10 py-4 rounded-xl text-base font-bold inline-flex items-center gap-3"
            >
              Get My Free Quotes Now
              <ChevronRight size={18} />
            </button>
            <p className="text-xs mt-4" style={{ color: "oklch(0.45 0.04 250 / 0.7)", fontFamily: "'DM Sans', sans-serif" }}>
              Free to use · No obligation · Results in under 2 minutes
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10" style={{ background: "oklch(0.12 0.05 250)", borderTop: "1px solid oklch(0.72 0.12 75 / 0.2)" }}>
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.72 0.12 75)" }}>
                  <Scale size={15} style={{ color: "oklch(0.12 0.05 250)" }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
                  Compare the Conveyancing Market
                </span>
              </div>
              <div className="text-xs leading-relaxed" style={{ color: "oklch(0.975 0.008 80 / 0.45)", fontFamily: "'DM Sans', sans-serif" }}>
                <div className="font-semibold mb-0.5" style={{ color: "oklch(0.975 0.008 80 / 0.65)" }}>ComparetheConveyancingMarket Ltd</div>
                <div>71-75 Shelton Street, Covent Garden</div>
                <div>London, United Kingdom, WC2H 9JQ</div>
                <div>Registered in England &amp; Wales</div>
              </div>
            </div>
            <div className="flex gap-6 text-xs" style={{ color: "oklch(0.975 0.008 80 / 0.4)", fontFamily: "'DM Sans', sans-serif" }}>
              <button onClick={() => navigate("/terms")} className="hover:text-white transition-colors" style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>Terms & Conditions</button>
              <button onClick={() => navigate("/privacy-policy")} className="hover:text-white transition-colors" style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>Privacy Policy</button>
              <button onClick={() => navigate("/contact")} className="hover:text-white transition-colors" style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>Contact Us</button>
              <button onClick={() => navigate("/faq")} className="hover:text-white transition-colors" style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>FAQs</button>
              <button onClick={() => navigate("/blog")} className="hover:text-white transition-colors" style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>Blog</button>
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
