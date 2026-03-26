/**
 * QUOTE RESULTS PAGE
 * Design: British Legal Prestige — Navy + Gold + Parchment
 * Features:
 *   - Staggered card entrance animation
 *   - Sort by price / rating
 *   - Full fee breakdown per card
 *   - "Instruct Directly" modal (form + payment on account)
 *   - "Request a Callback" modal
 *   - SDLT & Land Registry breakdown
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Star, Shield, Award, ChevronDown, ChevronUp, Phone, ArrowLeft,
  Scale, CheckCircle, X, CreditCard, Clock, MapPin, ArrowUpDown, Mail, Loader2
} from "lucide-react";
import { formatCurrency, type WizardAnswers } from "../lib/feeEngine";
import { trackEmailQuoteRequest, trackInstructDirectly } from "@/lib/analytics";

export interface LiveQuoteResult {
  firmId: number;
  firmName: string;
  firmLocation: string;
  logoUrl: string | null;
  rating: number;
  reviewCount: number;
  sraNumber: string;
  regulated: 'SRA' | 'CLC';
  speciality: string;
  yearsEstablished: number;
  accreditations: string[];
  legalFee: number;
  supplements: { name: string; price: number }[];
  disbursements: { name: string; price: number; includesVat: boolean }[];
  totalExVat: number;
  vat: number;
  totalIncVat: number;
  sdlt: number;
  landRegistryFee: number;
  grandTotal: number;
  fileOpeningFee: number;
}
import { trpc } from "@/lib/trpc";

// ─── STAR RATING ──────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          fill={i <= Math.round(rating) ? "oklch(0.72 0.12 75)" : "transparent"}
          style={{ color: "oklch(0.72 0.12 75)" }}
        />
      ))}
      <span className="ml-1 text-xs font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

// ─── INSTRUCT DIRECTLY MODAL ──────────────────────────────────────────────────
function InstructModal({ firm, onClose, contactDetails, transactionType }: {
  firm: LiveQuoteResult;
  onClose: () => void;
  contactDetails: { firstName: string; lastName: string; email: string; phone: string };
  transactionType: string;
}) {
  const [submitted, setSubmitted] = useState(false);

  // Calculate initial payment dynamically
  // Includes: Search Pack (purchase only) + AML checks + File Opening Fee
  const isSale = transactionType === 'sale';
  const searchPack = firm.disbursements.find(d => d.name.includes('Search Pack'));
  const amlChecks = firm.disbursements.filter(d => d.name.includes('AML') || d.name.includes('Anti-Money'));
  const amlTotal = amlChecks.reduce((sum, d) => sum + d.price, 0);
  const fileOpeningFee = firm.fileOpeningFee || 0;
  const searchPackFee = (!isSale && searchPack) ? searchPack.price : 0;
  const initialPayment = searchPackFee + amlTotal + fileOpeningFee;
  // Build breakdown label
  const breakdownParts: string[] = [];
  if (!isSale && searchPack) breakdownParts.push(`Search Pack (${formatCurrency(searchPack.price)})`);
  if (amlTotal > 0) breakdownParts.push('AML checks');
  if (fileOpeningFee > 0) breakdownParts.push(`File Opening (${formatCurrency(fileOpeningFee)})`);
  const breakdownLabel = breakdownParts.join(' + ');

  const propertyAddressLabel = transactionType === 'sale' ? 'Property address being sold' : 'Property address being purchased';

  const [form, setForm] = useState({
    firstName: contactDetails.firstName || "",
    lastName: contactDetails.lastName || "",
    email: contactDetails.email || "",
    phone: contactDetails.phone || "",
    dateOfBirth: "",
    currentAddress: "",
    propertyAddress: "",
  });
  const createInstruct = trpc.instruct.create.useMutation();
  const createCheckout = trpc.payment.createCheckoutSession.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Step 1: Create the instruction record
    const result = await createInstruct.mutateAsync({
      firmId: firm.firmId,
      firmName: firm.firmName,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      dateOfBirth: form.dateOfBirth || undefined,
      currentAddress: form.currentAddress || undefined,
      propertyAddress: form.propertyAddress || undefined,
      paymentAmount: String(initialPayment),
    });
    // Step 2: Create Stripe Checkout session and redirect
    const amountPence = Math.round(initialPayment * 100);
    if (amountPence < 50) {
      // Amount too small for Stripe — mark as submitted without payment
      setSubmitted(true);
      return;
    }
    // Open a blank tab immediately (direct user gesture) to avoid popup blockers,
    // then navigate it to the Stripe checkout URL once we have it.
    const paymentTab = window.open("", "_blank");
    toast.info("Redirecting to secure payment...");
    try {
      const { checkoutUrl } = await createCheckout.mutateAsync({
        instructRequestId: result.id,
        firmName: firm.firmName,
        amountPence,
        customerEmail: form.email,
        customerName: `${form.firstName} ${form.lastName}`,
        origin: window.location.origin,
      });
      if (paymentTab) {
        paymentTab.location.href = checkoutUrl;
      } else {
        // Fallback: navigate current tab if popup was blocked
        window.location.href = checkoutUrl;
      }
    } catch (err) {
      if (paymentTab) paymentTab.close();
      throw err;
    }
    setSubmitted(true);
  };

  const isLoading = createInstruct.isPending || createCheckout.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "oklch(0.12 0.05 250 / 0.7)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid oklch(0.88 0.015 80)" }}>
          <div>
            <h3 className="text-xl font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              Instruct {firm.firmName}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              Complete your details and make your initial payment on account
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "oklch(0.94 0.012 80)" }}>
            <X size={15} style={{ color: "oklch(0.45 0.04 250)" }} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "oklch(0.18 0.06 250)" }}>
              <CheckCircle size={32} style={{ color: "oklch(0.72 0.12 75)" }} />
            </div>
            <h4 className="text-xl font-bold mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              Instruction Confirmed
            </h4>
            <p className="text-sm mb-6" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              Thank you. {firm.firmName} will be in touch within 24 hours to begin your conveyancing. A confirmation has been sent to {form.email}.
            </p>
            <button onClick={onClose} className="btn-gold px-6 py-3 rounded-xl text-sm font-bold">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Fee summary */}
            <div className="rounded-xl p-4" style={{ background: "oklch(0.975 0.008 80)", border: "1px solid oklch(0.88 0.015 80)" }}>
              <div className="flex justify-between text-sm mb-1">
                <span style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Grand total</span>
                <span className="font-semibold font-mono-numbers" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(firm.grandTotal)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Initial payment on account</span>
                <span className="font-semibold" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(initialPayment)}</span>
              </div>
              <div className="text-xs mt-1" style={{ color: "oklch(0.65 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                {breakdownLabel ? `Includes: ${breakdownLabel}` : 'AML checks included'}
              </div>
              <div className="text-xs mt-1 italic" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                This payment is deducted from the final sum on completion
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "First name", key: "firstName", placeholder: "Jane" },
                { label: "Last name", key: "lastName", placeholder: "Smith" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>{label}</label>
                  <input
                    type="text"
                    required
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 rounded-lg text-sm border-2 outline-none"
                    style={{ fontFamily: "'DM Sans', sans-serif", borderColor: "oklch(0.88 0.015 80)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
                  />
                </div>
              ))}
            </div>

            {[
              { label: "Email address", key: "email", type: "email", placeholder: "jane.smith@email.com" },
              { label: "Phone number", key: "phone", type: "tel", placeholder: "07700 900000" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>{label}</label>
                <input
                  type={type}
                  required
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-3 py-2.5 rounded-lg text-sm border-2 outline-none"
                  style={{ fontFamily: "'DM Sans', sans-serif", borderColor: "oklch(0.88 0.015 80)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
                />
              </div>
            ))}

            {/* Date of birth */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Date of birth</label>
              <input
                type="date"
                required
                value={form.dateOfBirth}
                onChange={(e) => setForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg text-sm border-2 outline-none"
                style={{ fontFamily: "'DM Sans', sans-serif", borderColor: "oklch(0.88 0.015 80)", color: "oklch(0.18 0.06 250)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
              />
            </div>

            {/* Current residential address */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Current residential address</label>
              <textarea
                required
                rows={3}
                value={form.currentAddress}
                onChange={(e) => setForm((p) => ({ ...p, currentAddress: e.target.value }))}
                placeholder="Enter your full current address"
                className="w-full px-3 py-2.5 rounded-lg text-sm border-2 outline-none resize-none"
                style={{ fontFamily: "'DM Sans', sans-serif", borderColor: "oklch(0.88 0.015 80)", color: "oklch(0.18 0.06 250)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
              />
            </div>

            {/* Property address */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>{propertyAddressLabel}</label>
              <textarea
                required
                rows={3}
                value={form.propertyAddress}
                onChange={(e) => setForm((p) => ({ ...p, propertyAddress: e.target.value }))}
                placeholder="Enter the full property address"
                className="w-full px-3 py-2.5 rounded-lg text-sm border-2 outline-none resize-none"
                style={{ fontFamily: "'DM Sans', sans-serif", borderColor: "oklch(0.88 0.015 80)", color: "oklch(0.18 0.06 250)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
              />
            </div>

            {/* Payment summary */}
            <div style={{ borderTop: "1px solid oklch(0.88 0.015 80)", paddingTop: "1rem" }}>
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={15} style={{ color: "oklch(0.72 0.12 75)" }} />
                <span className="text-sm font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>
                  Initial Payment on Account — {formatCurrency(initialPayment)}
                </span>
              </div>
              <div
                className="rounded-lg p-3 text-xs"
                style={{ background: "oklch(0.97 0.008 80)", border: "1px solid oklch(0.88 0.015 80)", color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}
              >
                You will be securely redirected to Stripe to complete your payment. No card details are stored on this site.
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-gold w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin" /> Processing...</>
              ) : (
                <><CheckCircle size={16} /> Confirm & Pay {formatCurrency(initialPayment)}</>
              )}
            </button>

            <p className="text-xs text-center" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              Powered by Stripe · Encrypted & secure · Cancel anytime before work begins
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── CALLBACK MODAL ───────────────────────────────────────────────────────────
function CallbackModal({ firm, onClose, contactDetails }: {
  firm: LiveQuoteResult;
  onClose: () => void;
  contactDetails: { firstName: string; lastName: string; email: string; phone: string };
}) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: `${contactDetails.firstName} ${contactDetails.lastName}`.trim() || "",
    phone: contactDetails.phone || "",
    preferredTime: "",
  });
  const createCallback = trpc.callbacks.create.useMutation();

  const times = ["Morning (9am–12pm)", "Afternoon (12pm–5pm)", "Evening (5pm–7pm)", "Any time"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCallback.mutate({
      name: form.name,
      phone: form.phone,
      email: contactDetails.email || undefined,
      preferredTime: form.preferredTime || undefined,
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "oklch(0.12 0.05 250 / 0.7)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
        <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid oklch(0.88 0.015 80)" }}>
          <div>
            <h3 className="text-xl font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              Request a Callback
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              One of our advisers will call you back
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "oklch(0.94 0.012 80)" }}>
            <X size={15} style={{ color: "oklch(0.45 0.04 250)" }} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "oklch(0.18 0.06 250)" }}>
              <Phone size={28} style={{ color: "oklch(0.72 0.12 75)" }} />
            </div>
            <h4 className="text-xl font-bold mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              Callback Requested
            </h4>
            <p className="text-sm" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              One of our advisers will call you on <strong>{form.phone}</strong> during your preferred time. We look forward to speaking with you.
            </p>
            <button onClick={onClose} className="btn-gold mt-6 px-6 py-3 rounded-xl text-sm font-bold">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Your name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Jane Smith"
                className="w-full px-3 py-2.5 rounded-lg text-sm border-2 outline-none"
                style={{ fontFamily: "'DM Sans', sans-serif", borderColor: "oklch(0.88 0.015 80)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Phone number</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="07700 900000"
                className="w-full px-3 py-2.5 rounded-lg text-sm border-2 outline-none"
                style={{ fontFamily: "'DM Sans', sans-serif", borderColor: "oklch(0.88 0.015 80)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Preferred call time</label>
              <div className="grid grid-cols-2 gap-2">
                {times.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, preferredTime: t }))}
                    className="px-3 py-2 rounded-lg text-xs font-medium border-2 transition-all"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      ...(form.preferredTime === t
                        ? { background: "oklch(0.18 0.06 250)", borderColor: "oklch(0.18 0.06 250)", color: "white" }
                        : { background: "white", borderColor: "oklch(0.88 0.015 80)", color: "oklch(0.45 0.04 250)" }),
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-gold w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
              <Phone size={15} />
              Request My Callback
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── EMAIL QUOTE MODAL ──────────────────────────────────────────────────────
function EmailQuoteModal({ firm, onClose, contactDetails, answers }: {
  firm: LiveQuoteResult;
  onClose: () => void;
  contactDetails: { firstName: string; lastName: string; email: string; phone: string };
  answers: Partial<WizardAnswers>;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState(contactDetails.email || "");
  const emailQuote = trpc.quotes.emailQuote.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    emailQuote.mutate({
      recipientEmail: email,
      firmName: firm.firmName,
      firmLocation: firm.firmLocation,
      legalFee: firm.legalFee,
      totalIncVat: firm.totalIncVat,
      sdlt: firm.sdlt,
      landRegistryFee: firm.landRegistryFee,
      grandTotal: firm.grandTotal,
      propertyValue: (answers.propertyValue as number) ?? 0,
      transactionType: (answers.transactionType as string) ?? 'purchase',
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "oklch(0.12 0.05 250 / 0.7)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
        <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid oklch(0.88 0.015 80)" }}>
          <div>
            <h3 className="text-xl font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              Email Me This Quote
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              Receive a full quote summary from {firm.firmName}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "oklch(0.94 0.012 80)" }}>
            <X size={15} style={{ color: "oklch(0.45 0.04 250)" }} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "oklch(0.18 0.06 250)" }}>
              <Mail size={28} style={{ color: "oklch(0.72 0.12 75)" }} />
            </div>
            <h4 className="text-xl font-bold mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              Quote Sent!
            </h4>
            <p className="text-sm mb-6" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              Your quote from {firm.firmName} has been sent to <strong>{email}</strong>. Check your inbox — it should arrive within a few minutes.
            </p>
            <button onClick={onClose} className="btn-gold px-6 py-3 rounded-xl text-sm font-bold">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Quote summary */}
            <div className="rounded-xl p-4 space-y-1" style={{ background: "oklch(0.975 0.008 80)", border: "1px solid oklch(0.88 0.015 80)" }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Legal fees (inc. VAT)</span>
                <span className="font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(firm.totalIncVat)}</span>
              </div>
              {firm.sdlt > 0 && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Stamp Duty (SDLT)</span>
                  <span style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(firm.sdlt)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Land Registry</span>
                <span style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(firm.landRegistryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-1" style={{ borderTop: "1px solid oklch(0.88 0.015 80)" }}>
                <span style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Grand Total</span>
                <span style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(firm.grandTotal)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Your email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane.smith@email.com"
                className="w-full px-3 py-2.5 rounded-lg text-sm border-2 outline-none"
                style={{ fontFamily: "'DM Sans', sans-serif", borderColor: "oklch(0.88 0.015 80)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
              />
            </div>

            <button type="submit" disabled={emailQuote.isPending} className="btn-gold w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
              <Mail size={16} />
              {emailQuote.isPending ? 'Sending...' : 'Send Me This Quote'}
            </button>

            <p className="text-xs text-center" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              We will only use your email to send this quote. No spam, ever.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── QUOTE CARD ───────────────────────────────────────────────────────────────
function QuoteCard({
  quote,
  rank,
  onInstruct,
  onCallback,
  onEmail,
}: {
  quote: LiveQuoteResult;
  rank: number;
  onInstruct: () => void;
  onCallback: () => void;
  onEmail: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="card-stagger bg-white rounded-2xl overflow-hidden"
      style={{
        border: rank === 1 ? "2px solid oklch(0.72 0.12 75)" : "1px solid oklch(0.88 0.015 80)",
        boxShadow: rank === 1 ? "0 8px 30px oklch(0.72 0.12 75 / 0.15)" : "0 2px 12px oklch(0.18 0.06 250 / 0.06)",
      }}
    >
      {/* Best Value badge */}
      {rank === 1 && (
        <div className="px-4 py-1.5 text-xs font-bold text-center" style={{ background: "oklch(0.72 0.12 75)", color: "oklch(0.12 0.05 250)", fontFamily: "'DM Sans', sans-serif" }}>
          ★ Best Value
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          {/* Firm info */}
          <div className="flex-1">
            {/* Logo */}
            {quote.logoUrl && (
              <div className="mb-2">
                <img
                  src={quote.logoUrl}
                  alt={`${quote.firmName} logo`}
                  className="h-10 w-auto object-contain"
                  style={{ maxWidth: '140px' }}
                />
              </div>
            )}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
                {quote.firmName}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-xs mb-1" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              <MapPin size={11} />
              {quote.firmLocation}
            </div>
            <StarRating rating={quote.rating} />
            <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              {quote.reviewCount} reviews · Est. {quote.yearsEstablished}
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="text-xs mb-0.5" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              Legal fees (inc. VAT)
            </div>
            <div className="text-2xl font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'JetBrains Mono', monospace" }}>
              {formatCurrency(quote.totalIncVat)}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              Grand total: <span className="font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(quote.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Speciality */}
        <div className="text-xs mb-4 px-3 py-2 rounded-lg" style={{ background: "oklch(0.975 0.008 80)", color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
          {quote.speciality}
        </div>

        {/* Accreditations */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {quote.accreditations.map((a) => (
            <span key={a} className="flex items-center gap-1 px-2 py-1 rounded text-xs" style={{ background: "oklch(0.18 0.06 250 / 0.05)", color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>
              <Award size={10} style={{ color: "oklch(0.72 0.12 75)" }} />
              {a}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={onInstruct}
            className="btn-gold flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          >
            <CheckCircle size={15} />
            Instruct Directly
          </button>
          <button
            onClick={onCallback}
            className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            style={{ border: "2px solid oklch(0.18 0.06 250)", color: "oklch(0.18 0.06 250)", background: "white", fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "oklch(0.18 0.06 250)"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "oklch(0.18 0.06 250)"; }}
          >
            <Phone size={15} />
            Request Callback
          </button>
        </div>
        {/* Email me the quote */}
        <div className="mb-4">
          <button
            onClick={onEmail}
            className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            style={{ border: "1.5px solid oklch(0.72 0.12 75 / 0.5)", color: "oklch(0.58 0.14 75)", background: "oklch(0.72 0.12 75 / 0.06)", fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "oklch(0.72 0.12 75 / 0.12)"; e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "oklch(0.72 0.12 75 / 0.06)"; e.currentTarget.style.borderColor = "oklch(0.72 0.12 75 / 0.5)"; }}
          >
            <Mail size={14} />
            Email Me This Quote
          </button>
        </div>

        {/* Expand fee breakdown */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg transition-all"
          style={{ color: "oklch(0.45 0.04 250)", background: "oklch(0.975 0.008 80)", fontFamily: "'DM Sans', sans-serif" }}
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expanded ? "Hide" : "View"} full fee breakdown
        </button>

        {/* Fee Breakdown */}
        {expanded && (
          <div className="mt-4 space-y-3 animate-fade-in">
            {/* Legal Fees */}
            <div>
              <div className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>
                Legal Fees
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Base legal fee</span>
                  <span className="font-mono-numbers" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.18 0.06 250)" }}>{formatCurrency(quote.legalFee)}</span>
                </div>
                {quote.supplements.map((s) => (
                  <div key={s.name} className="flex justify-between text-sm">
                    <span style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{s.name}</span>
                    <span className="font-mono-numbers" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.18 0.06 250)" }}>+{formatCurrency(s.price)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm" style={{ borderTop: "1px solid oklch(0.88 0.015 80)", paddingTop: "4px" }}>
                  <span style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>VAT (20%)</span>
                  <span className="font-mono-numbers" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.18 0.06 250)" }}>{formatCurrency(quote.vat)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Total legal fees (inc. VAT)</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.18 0.06 250)" }}>{formatCurrency(quote.totalIncVat)}</span>
                </div>
              </div>
            </div>

            {/* Disbursements */}
            <div>
              <div className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>
                Disbursements
              </div>
              <div className="space-y-1">
                {quote.disbursements.map((d) => (
                  <div key={d.name} className="flex justify-between text-sm">
                    <span style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{d.name}</span>
                    <span className="font-mono-numbers" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.18 0.06 250)" }}>{formatCurrency(d.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Government Fees */}
            {(quote.sdlt > 0 || quote.landRegistryFee > 0) && (
              <div>
                <div className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>
                  Government Fees
                </div>
                <div className="space-y-1">
                  {quote.sdlt > 0 && (
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Stamp Duty Land Tax (SDLT)</span>
                      <span className="font-mono-numbers" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.18 0.06 250)" }}>{formatCurrency(quote.sdlt)}</span>
                    </div>
                  )}
                  {quote.landRegistryFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Land Registry Fee</span>
                      <span className="font-mono-numbers" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.18 0.06 250)" }}>{formatCurrency(quote.landRegistryFee)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Grand Total */}
            <div className="rounded-xl overflow-hidden" style={{ background: "oklch(0.18 0.06 250)" }}>
              {/* Legal Fees Total row */}
              <div className="flex justify-between items-center px-3 pt-3 pb-2" style={{ borderBottom: "1px solid oklch(0.975 0.008 80 / 0.15)" }}>
                <span className="text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.75)", fontFamily: "'DM Sans', sans-serif" }}>Legal Fees Total (inc. VAT + Disbursements)</span>
                <span className="text-sm font-semibold" style={{ color: "oklch(0.975 0.008 80 / 0.9)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(quote.totalIncVat + quote.disbursements.reduce((s, d) => s + d.price, 0))}</span>
              </div>
              {/* SDLT row */}
              {quote.sdlt > 0 && (
                <div className="flex justify-between items-center px-3 py-2" style={{ borderBottom: "1px solid oklch(0.975 0.008 80 / 0.15)" }}>
                  <span className="text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.75)", fontFamily: "'DM Sans', sans-serif" }}>Stamp Duty Land Tax (SDLT)</span>
                  <span className="text-sm font-semibold" style={{ color: "oklch(0.975 0.008 80 / 0.9)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(quote.sdlt)}</span>
                </div>
              )}
              {/* Grand Total row */}
              <div className="flex justify-between items-center px-3 pt-2 pb-3">
                <span className="text-sm font-bold" style={{ color: "white", fontFamily: "'DM Sans', sans-serif" }}>Grand Total</span>
                <span className="text-lg font-bold" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(quote.grandTotal)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── EXCLUSIVE PRICING POPUP ─────────────────────────────────────────────────
function ExclusivePricingPopup({ onClose }: { onClose: () => void }) {
  const [tick, setTick] = useState(0);

  // Animate the warning banner: cycles forward and backward
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60);
    return () => clearInterval(id);
  }, []);

  // Oscillate between 0 and 1 using a sine wave for smooth back-and-forth
  const progress = (Math.sin(tick * 0.05) + 1) / 2; // 0..1
  const bannerOffset = progress * -60; // slides -60px to 0px

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "oklch(0.12 0.05 250 / 0.75)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        style={{ border: "2px solid oklch(0.72 0.12 75 / 0.4)" }}
      >
        {/* Animated warning banner — slides back and forth */}
        <div
          className="overflow-hidden"
          style={{
            background: "oklch(0.45 0.22 25)",
            padding: "0.6rem 2rem",
          }}
        >
          <div
            style={{
              transform: `translateX(${bannerOffset}px)`,
              whiteSpace: "nowrap",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "white",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            ⚠ EXCLUSIVE RATES — Available only through Compare the Conveyancing Market &nbsp;&nbsp;&nbsp; ⚠ EXCLUSIVE RATES — Available only through Compare the Conveyancing Market
          </div>
        </div>

        {/* Navy header */}
        <div className="px-8 py-5" style={{ background: "oklch(0.18 0.06 250)" }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.72 0.12 75)" }}>
              <Shield size={18} style={{ color: "oklch(0.12 0.05 250)" }} />
            </div>
            <h3 className="text-xl font-bold" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
              Exclusive Member Pricing
            </h3>
          </div>
          <p className="text-xs" style={{ color: "oklch(0.975 0.008 80 / 0.6)", fontFamily: "'DM Sans', sans-serif", paddingLeft: "3rem" }}>
            Important notice regarding your quoted fees
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          <p className="text-base font-bold leading-relaxed mb-5" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>
            The fees displayed on this page represent exclusive rates negotiated solely for clients who instruct through Compare the Conveyancing Market. These prices are not available if you approach the law firm directly.
          </p>
          <div className="rounded-xl p-4 mb-5" style={{ background: "oklch(0.98 0.01 25)", border: "2px solid oklch(0.55 0.22 25 / 0.4)" }}>
            <p className="text-sm font-bold mb-2" style={{ color: "oklch(0.40 0.22 25)", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>⚠ Legal Notice</p>
            <p className="text-sm font-bold" style={{ color: "oklch(0.35 0.22 25)", fontFamily: "'DM Sans', sans-serif", lineHeight: "1.6" }}>
              These quoted fees are conditional upon instruction being placed via Compare the Conveyancing Market. Direct instruction to any firm listed herein will not entitle you to the rates shown. Compare the Conveyancing Market acts as an introducer only and does not provide legal advice. All firms are independently regulated by the Solicitors Regulation Authority (SRA) or the Council for Licensed Conveyancers (CLC).
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-gold w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} />
            I Understand — Show My Quotes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN RESULTS PAGE ────────────────────────────────────────────────────────
export default function QuoteResults() {
  const [, navigate] = useLocation();
  const [sortBy, setSortBy] = useState<"price" | "rating">("price");
  const [instructFirm, setInstructFirm] = useState<LiveQuoteResult | null>(null);
  const [callbackFirm, setCallbackFirm] = useState<LiveQuoteResult | null>(null);
  const [emailFirm, setEmailFirm] = useState<LiveQuoteResult | null>(null);
  const [answers, setAnswers] = useState<Partial<WizardAnswers>>({});
  const [contactDetails, setContactDetails] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [showExclusivePopup, setShowExclusivePopup] = useState(false);
  const [quoteRef, setQuoteRef] = useState<string | null>(null);
  const [quoteUrl, setQuoteUrl] = useState<string | null>(null);
  const [snapshotSaved, setSnapshotSaved] = useState(false);
  const saveSnapshot = trpc.leads.saveSnapshot.useMutation();
  const [queryInput, setQueryInput] = useState<{
    transactionType: "purchase" | "sale" | "sale_purchase" | "remortgage";
    propertyValue: number;
    tenure: "freehold" | "leasehold";
    hasMortgage: boolean;
    isFirstTimeBuyer: boolean;
    isNewBuild: boolean;
    isSharedOwnership: boolean;
    hasGiftedDeposit: boolean;
    giftCount?: number;
    isBuyToLet: boolean;
    isSecondHome: boolean;
    hasMortgageOnProperty?: boolean;
    newMortgageValue?: number;
    buyerCount?: number;
    mortgageLender?: string;
  } | null>(null);

  const { data: liveQuotes, isLoading: quotesLoading } = trpc.quotes.getLive.useQuery(
    queryInput!,
    { enabled: queryInput !== null }
  );

  // Once quotes load AND contact details are available, save the snapshot and send emails with fee breakdown
  useEffect(() => {
    if (!liveQuotes || liveQuotes.length === 0 || snapshotSaved || !quoteRef) return;
    // Wait until contactDetails has been loaded from sessionStorage (email must be present)
    if (!contactDetails.email || !contactDetails.firstName) return;
    const snapshot = liveQuotes.map(q => ({
      firmId: q.firmId,
      firmName: q.firmName,
      firmLocation: q.firmLocation,
      logoUrl: q.logoUrl,
      rating: q.rating,
      // Legal fees breakdown
      legalFee: q.legalFee,
      supplements: q.supplements,
      vat: q.vat,
      totalIncVat: q.totalIncVat,
      // Disbursements (AML, bankruptcy, search pack, bank transfer, etc.)
      disbursements: q.disbursements,
      // File opening fee (used for initial payment on account in Instruct modal)
      fileOpeningFee: q.fileOpeningFee,
      // Government fees
      sdlt: q.sdlt,
      landRegistry: q.landRegistryFee,
      // Grand total
      total: q.grandTotal,
    }));
    setSnapshotSaved(true);
    saveSnapshot.mutate({
      referenceNumber: quoteRef,
      quoteSnapshot: JSON.stringify(snapshot),
      name: `${contactDetails.firstName} ${contactDetails.lastName}`.trim(),
      email: contactDetails.email,
      phone: contactDetails.phone || undefined,
      transactionType: answers.transactionType || 'purchase',
      propertyValue: answers.propertyValue || 0,
      postcode: answers.postcode || '',
      mortgageLender: (contactDetails as any).mortgageLender || undefined,
      hasMortgage: answers.hasMortgage,
      isFirstTimeBuyer: answers.isFirstTimeBuyer,
      quoteUrl: quoteUrl || undefined,
      origin: window.location.origin,
    });
  }, [liveQuotes, quoteRef, snapshotSaved, contactDetails, answers, quoteUrl]);

  useEffect(() => {
    const savedAnswers = sessionStorage.getItem("quoteAnswers");
    const savedContact = sessionStorage.getItem("contactDetails");

    let parsedAnswers: Partial<WizardAnswers> = {
      transactionType: "purchase",
      tenure: "freehold",
      hasMortgage: false,
      isFirstTimeBuyer: true,
      isNewBuild: false,
      isSharedOwnership: false,
      hasGiftedDeposit: false,
      hasHelpToBuyISA: false,
      isRightToBuy: false,
      isBuyToLet: false,
      isSecondHome: false,
      hasMortgageOnProperty: false,
      buyerCount: 1,
      propertyValue: 350000,
      postcode: "SW1A 1AA",
      completionTimeline: "Within 1 month",
    };

    let parsedContact: { mortgageLender?: string } = {};
    if (savedAnswers) {
      try { parsedAnswers = JSON.parse(savedAnswers); } catch { /* use defaults */ }
    }
    if (savedContact) {
      try { const cd = JSON.parse(savedContact); setContactDetails(cd); parsedContact = cd; } catch { /* use defaults */ }
    }

    setAnswers(parsedAnswers);
    // For sale_purchase: use purchasePrice for SDLT/LR calculation (purchase side drives SDLT)
    const isSalePurchase = parsedAnswers.transactionType === "sale_purchase";
    const effectivePropertyValue = isSalePurchase
      ? ((parsedAnswers as any).purchasePrice ?? parsedAnswers.propertyValue ?? 350000)
      : (parsedAnswers.propertyValue ?? 350000);
    // For sale_purchase: use purchaseTenure for the purchase side (affects leasehold supplement)
    const effectiveTenure = isSalePurchase
      ? (((parsedAnswers as any).purchaseTenure ?? parsedAnswers.tenure ?? "freehold") as "freehold" | "leasehold")
      : ((parsedAnswers.tenure ?? "freehold") as "freehold" | "leasehold");
    setQueryInput({
      transactionType: (parsedAnswers.transactionType ?? "purchase") as "purchase" | "sale" | "sale_purchase" | "remortgage",
      propertyValue: effectivePropertyValue,
      tenure: effectiveTenure,
      hasMortgage: parsedAnswers.hasMortgage ?? false,
      isFirstTimeBuyer: parsedAnswers.isFirstTimeBuyer ?? false,
      isNewBuild: parsedAnswers.isNewBuild ?? false,
      isSharedOwnership: parsedAnswers.isSharedOwnership ?? false,
      hasGiftedDeposit: parsedAnswers.hasGiftedDeposit ?? false,
      giftCount: parsedAnswers.giftCount ?? 0,
      isBuyToLet: parsedAnswers.isBuyToLet ?? false,
      isSecondHome: parsedAnswers.isSecondHome ?? false,
      hasMortgageOnProperty: parsedAnswers.hasMortgageOnProperty,
      buyerCount: parsedAnswers.buyerCount ?? 1,
      mortgageLender: parsedContact.mortgageLender || undefined,
    });
    // Read reference number if lead was saved
    const savedRef = sessionStorage.getItem('quoteRef');
    const savedUrl = sessionStorage.getItem('quoteUrl');
    if (savedRef) setQuoteRef(savedRef);
    if (savedUrl) setQuoteUrl(savedUrl);
    // Show the exclusive pricing popup after a short delay for dramatic effect
    setTimeout(() => setShowExclusivePopup(true), 800);
  }, []);

  const quotes = liveQuotes ?? [];
  const sorted = [...quotes].sort((a, b) =>
    sortBy === "price" ? a.totalIncVat - b.totalIncVat : b.rating - a.rating
  );

  const transactionLabels: Record<string, string> = {
    purchase: "Property Purchase",
    sale: "Property Sale",
    sale_purchase: "Sale & Purchase",
    remortgage: "Remortgage",
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.975 0.008 80)" }}>
      {/* Exclusive Pricing Popup */}
      {showExclusivePopup && <ExclusivePricingPopup onClose={() => setShowExclusivePopup(false)} />}

      {/* Header */}
      <div style={{ background: "oklch(0.18 0.06 250)", borderBottom: "1px solid oklch(0.72 0.12 75 / 0.2)" }}>
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/109506846/5ZpoxzgLM5cycU3sThccK4/favicon-logo-v2-VpvW9vnDQBVjC9fgzHCMg6.png" alt="CC Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-semibold" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
              Compare the Conveyancing Market
            </span>
          </div>
          <button
            onClick={() => navigate("/get-quote")}
            className="text-sm flex items-center gap-1 transition-colors"
            style={{ color: "oklch(0.975 0.008 80 / 0.6)", fontFamily: "'DM Sans', sans-serif" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.72 0.12 75)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.975 0.008 80 / 0.6)")}
          >
            <ArrowLeft size={14} /> Amend Quote
          </button>
        </div>
      </div>

      <div className="container py-10 max-w-3xl mx-auto">
        {/* Summary bar */}
        <div className="rounded-2xl p-5 mb-8" style={{ background: "oklch(0.18 0.06 250)", border: "1px solid oklch(0.72 0.12 75 / 0.2)" }}>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <div className="text-xs mb-1" style={{ color: "oklch(0.975 0.008 80 / 0.5)", fontFamily: "'DM Sans', sans-serif" }}>Your quote summary</div>
              <div className="text-lg font-bold" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>
                {transactionLabels[answers.transactionType || "purchase"]} · {formatCurrency(answers.propertyValue || 0)}
              </div>
              <div className="flex flex-wrap gap-3 mt-1">
                {[
                  answers.postcode,
                  answers.tenure === "leasehold" ? "Leasehold" : "Freehold",
                  answers.isFirstTimeBuyer ? "First-Time Buyer" : null,
                  answers.hasMortgage ? "With Mortgage" : "Cash Buyer",
                  answers.isNewBuild ? "New Build" : null,
                ].filter(Boolean).map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.72 0.12 75 / 0.15)", color: "oklch(0.82 0.10 75)", fontFamily: "'DM Sans', sans-serif" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <Shield size={14} style={{ color: "oklch(0.72 0.12 75)" }} />
                <span className="text-xs" style={{ color: "oklch(0.975 0.008 80 / 0.6)", fontFamily: "'DM Sans', sans-serif" }}>
                  All firms regulated
                </span>
              </div>
              {quoteRef && (
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: "oklch(0.975 0.008 80 / 0.5)", fontFamily: "'DM Sans', sans-serif" }}>Ref:</span>
                  <a
                    href={quoteUrl || '#'}
                    className="text-xs font-bold tracking-wider font-mono"
                    style={{ color: "oklch(0.82 0.10 75)", fontFamily: "monospace", textDecoration: "none" }}
                    title="Your unique quote link — click to share or bookmark"
                  >
                    {quoteRef}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              Your Quotes
            </h1>
            <p className="text-sm" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              {sorted.length} regulated firms found · All fees fully itemised
            </p>
            {queryInput?.mortgageLender && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: "oklch(0.55 0.18 145 / 0.12)", color: "oklch(0.35 0.18 145)", fontFamily: "'DM Sans', sans-serif", border: "1px solid oklch(0.55 0.18 145 / 0.3)" }}>
                  ✓ Lender panel approved: {queryInput.mortgageLender}
                </span>
              </div>
            )}
          </div>

          {/* Sort control */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} style={{ color: "oklch(0.55 0.04 250)" }} />
            <span className="text-xs" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Sort by:</span>
            <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
              {(["price", "rating"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className="px-3 py-1.5 text-xs font-medium transition-all capitalize"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    ...(sortBy === s
                      ? { background: "oklch(0.18 0.06 250)", color: "white" }
                      : { background: "white", color: "oklch(0.45 0.04 250)" }),
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quote Cards */}
        <div className="space-y-5">
          {quotesLoading && (
            <div className="space-y-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="rounded-2xl p-6 animate-pulse" style={{ background: "white", border: "1px solid oklch(0.88 0.015 80)" }}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="h-5 w-48 rounded" style={{ background: "oklch(0.92 0.01 80)" }} />
                      <div className="h-3 w-32 rounded" style={{ background: "oklch(0.92 0.01 80)" }} />
                      <div className="h-3 w-24 rounded" style={{ background: "oklch(0.92 0.01 80)" }} />
                    </div>
                    <div className="text-right space-y-2">
                      <div className="h-8 w-28 rounded" style={{ background: "oklch(0.92 0.01 80)" }} />
                      <div className="h-3 w-20 rounded ml-auto" style={{ background: "oklch(0.92 0.01 80)" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!quotesLoading && sorted.map((quote, i) => (
            <QuoteCard
              key={quote.firmId}
              quote={quote}
              rank={i + 1}
              onInstruct={() => { setInstructFirm(quote); trackInstructDirectly({ firmName: quote.firmName }); }}
              onCallback={() => setCallbackFirm(quote)}
              onEmail={() => { setEmailFirm(quote); trackEmailQuoteRequest({ firmName: quote.firmName }); }}
            />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-8 rounded-xl p-4 text-xs" style={{ background: "white", border: "1px solid oklch(0.88 0.015 80)", color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
          <div className="flex items-start gap-2">
            <Clock size={13} className="mt-0.5 flex-shrink-0" style={{ color: "oklch(0.72 0.12 75)" }} />
            <span>
              Quotes are indicative and based on the information you provided. Final fees may vary depending on the complexity of your transaction. All firms are regulated by the SRA or CLC. SDLT is calculated using current HMRC rates and is subject to change.
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      {instructFirm && (
        <InstructModal
          firm={instructFirm}
          onClose={() => setInstructFirm(null)}
          contactDetails={contactDetails}
          transactionType={answers.transactionType || 'purchase'}
        />
      )}
      {callbackFirm && (
        <CallbackModal
          firm={callbackFirm}
          onClose={() => setCallbackFirm(null)}
          contactDetails={contactDetails}
        />
      )}
      {emailFirm && (
        <EmailQuoteModal
          firm={emailFirm}
          onClose={() => setEmailFirm(null)}
          contactDetails={contactDetails}
          answers={answers}
        />
      )}
    </div>
  );
}
