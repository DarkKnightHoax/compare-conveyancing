/*
 * CONTACT US PAGE
 * Design: British Legal Prestige — Navy + Gold + Parchment
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Scale, Phone, Mail, MapPin, Clock, CheckCircle, ArrowRight } from "lucide-react";

export default function ContactUs() {
  const [, navigate] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", subject: "", message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: <Phone size={20} />,
      label: "Telephone",
      value: "0800 000 0000",
      sub: "Monday to Friday, 9am – 6pm",
    },
    {
      icon: <Mail size={20} />,
      label: "Email",
      value: "hello@comparetheconveyancingmarket.co.uk",
      sub: "We aim to respond within 4 business hours",
    },
    {
      icon: <MapPin size={20} />,
      label: "Registered Address",
      value: "71-75 Shelton Street, Covent Garden, London WC2H 9JQ",
      sub: "ComparetheConveyancingMarket Ltd — Registered in England & Wales",
    },
    {
      icon: <Clock size={20} />,
      label: "Office Hours",
      value: "Monday – Friday: 9:00am – 6:00pm",
      sub: "Saturday: 10:00am – 2:00pm",
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.975 0.008 80)" }}>
      {/* Header */}
      <div style={{ background: "oklch(0.18 0.06 250)", borderBottom: "1px solid oklch(0.72 0.12 75 / 0.2)" }}>
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.72 0.12 75)" }}>
              <Scale size={15} style={{ color: "oklch(0.12 0.05 250)" }} />
            </div>
            <span className="text-sm font-semibold" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
              Compare the Conveyancing Market
            </span>
          </div>
          <button onClick={() => navigate("/get-quote")} className="btn-gold px-5 py-2 rounded-xl text-xs font-bold">
            Get Free Quotes
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="py-16" style={{ background: "oklch(0.18 0.06 250)" }}>
        <div className="container max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
            Get in Touch
          </h1>
          <p className="text-base" style={{ color: "oklch(0.975 0.008 80 / 0.65)", fontFamily: "'DM Sans', sans-serif" }}>
            Our team is here to help. Whether you have a question about a quote, need guidance on the conveyancing process, or want to discuss a law firm partnership, we would love to hear from you.
          </p>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto py-16">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className="md:col-span-2 space-y-4">
            {contactInfo.map(({ icon, label, value, sub }) => (
              <div key={label} className="bg-white rounded-2xl p-5" style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.18 0.06 250)" }}>
                    <span style={{ color: "oklch(0.72 0.12 75)" }}>{icon}</span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-0.5" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {label}
                    </div>
                    <div className="text-sm font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>{value}</div>
                    <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{sub}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick quote CTA */}
            <div className="rounded-2xl p-5" style={{ background: "oklch(0.18 0.06 250)", border: "1px solid oklch(0.72 0.12 75 / 0.2)" }}>
              <h4 className="text-base font-bold mb-1" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
                Need a quote quickly?
              </h4>
              <p className="text-xs mb-4" style={{ color: "oklch(0.975 0.008 80 / 0.6)", fontFamily: "'DM Sans', sans-serif" }}>
                Skip the queue — get your personalised conveyancing quotes in 90 seconds.
              </p>
              <button onClick={() => navigate("/get-quote")} className="btn-gold w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                Compare Quotes <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Contact form */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl p-8" style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "oklch(0.18 0.06 250)" }}>
                    <CheckCircle size={28} style={{ color: "oklch(0.72 0.12 75)" }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
                    Message Received
                  </h3>
                  <p className="text-sm" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                    Thank you for getting in touch. A member of our team will respond to you within 4 business hours.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
                    Send Us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {["firstName", "lastName"].map((field) => (
                        <div key={field}>
                          <label className="block text-xs font-semibold mb-1.5" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>
                            {field === "firstName" ? "First name" : "Last name"}
                          </label>
                          <input
                            type="text" required
                            value={form[field as keyof typeof form]}
                            onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                            placeholder={field === "firstName" ? "Jane" : "Smith"}
                            className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none transition-all"
                            style={{ fontFamily: "'DM Sans', sans-serif", borderColor: "oklch(0.88 0.015 80)" }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                            onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Email address</label>
                      <input
                        type="email" required
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        placeholder="jane.smith@email.com"
                        className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none transition-all"
                        style={{ fontFamily: "'DM Sans', sans-serif", borderColor: "oklch(0.88 0.015 80)" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Phone number (optional)</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="07700 900000"
                        className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none transition-all"
                        style={{ fontFamily: "'DM Sans', sans-serif", borderColor: "oklch(0.88 0.015 80)" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Subject</label>
                      <select
                        required
                        value={form.subject}
                        onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none transition-all bg-white"
                        style={{ fontFamily: "'DM Sans', sans-serif", borderColor: "oklch(0.88 0.015 80)" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
                      >
                        <option value="">Select a subject...</option>
                        <option value="quote">Question about a quote</option>
                        <option value="instruction">Help with my instruction</option>
                        <option value="firm">Law firm partnership enquiry</option>
                        <option value="complaint">Complaint or feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Your message</label>
                      <textarea
                        required rows={5}
                        value={form.message}
                        onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                        placeholder="How can we help you?"
                        className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none transition-all resize-none"
                        style={{ fontFamily: "'DM Sans', sans-serif", borderColor: "oklch(0.88 0.015 80)" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
                      />
                    </div>
                    <button type="submit" className="btn-gold w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                      <CheckCircle size={16} />
                      Send Message
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
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
