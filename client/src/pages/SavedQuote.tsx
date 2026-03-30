/*
 * SAVED QUOTE PAGE — /quote/:ref
 * Shows a customer's personalised conveyancing quote by reference number.
 * Each firm card has an "Instruct Directly" button that opens a full modal
 * with the complete onboarding form and Stripe payment on account.
 */

import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft, Phone, Mail, Copy, CheckCircle, Loader2, AlertCircle,
  Star, X, CreditCard,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TX_LABELS: Record<string, string> = {
  purchase: "Property Purchase",
  sale: "Property Sale",
  sale_purchase: "Sale & Purchase",
  remortgage: "Remortgage",
};

function formatCurrency(n: number) {
  return `£${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <tr>
      <td style={{ padding: "8px 12px", color: "#6b7280", fontSize: 13, fontFamily: "'DM Sans', sans-serif", width: "45%", borderBottom: "1px solid oklch(0.93 0.01 80)" }}>{label}</td>
      <td style={{ padding: "8px 12px", color: "oklch(0.18 0.06 250)", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, borderBottom: "1px solid oklch(0.93 0.01 80)" }}>{value}</td>
    </tr>
  );
}

interface LegBreakdown {
  label: string;
  propertyValue: number;
  legalFee: number;
  supplements: { name: string; price: number }[];
  disbursements: { name: string; price: number; includesVat: boolean }[];
  vat: number;
  totalIncVat: number;
  sdlt: number;
  landRegistryFee: number;
  fileOpeningFee: number;
  grandTotal: number;
}

interface QuoteSnapshotItem {
  firmId?: number;
  firmName: string;
  firmLocation?: string;
  logoUrl?: string | null;
  rating?: number;
  legalFee: number;
  supplements?: { name: string; price: number }[];
  disbursements?: { name: string; price: number; includesVat?: boolean }[];
  fileOpeningFee?: number;
  vat: number;
  totalIncVat: number;
  sdlt: number;
  landRegistry?: number;
  landRegistryFee?: number;
  total: number;
  purchaseBreakdown?: LegBreakdown;
  saleBreakdown?: LegBreakdown;
}

// ─── INSTRUCT DIRECTLY MODAL ──────────────────────────────────────────────────
function InstructModal({
  firm,
  transactionType,
  contactDetails,
  onClose,
}: {
  firm: QuoteSnapshotItem;
  transactionType: string;
  contactDetails: { firstName: string; lastName: string; email: string; phone: string };
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);

  const isSale = transactionType === 'sale';
  const isPurchaseOrMoving = transactionType === 'purchase' || transactionType === 'sale_purchase';
  const searchPack = (firm.disbursements || []).find(d => d.name.includes('Search Pack'));
  const amlChecks = (firm.disbursements || []).filter(d => d.name.includes('AML') || d.name.includes('Anti-Money'));
  const amlTotal = amlChecks.reduce((sum, d) => sum + d.price, 0);
  // Fixed £150 file opening fee for purchase/sale_purchase; use DB value for sale only
  const PURCHASE_FILE_OPENING_FEE = 150;
  const fileOpeningFeeForPayment = isSale ? (firm.fileOpeningFee || 0) : (isPurchaseOrMoving ? PURCHASE_FILE_OPENING_FEE : 0);
  const searchPackFee = (!isSale && searchPack) ? searchPack.price : 0;
  const initialPayment = searchPackFee + amlTotal + fileOpeningFeeForPayment;

  const breakdownParts: string[] = [];
  if (!isSale && searchPack) breakdownParts.push(`Search Pack (${formatCurrency(searchPack.price)})`);
  if (amlTotal > 0) breakdownParts.push('AML checks');
  const breakdownLabel = breakdownParts.join(' + ');

  const propertyAddressLabel = isSale ? 'Property address being sold' : 'Property address being purchased';

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
    const result = await createInstruct.mutateAsync({
      firmId: firm.firmId ?? 0,
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

    const amountPence = Math.round(initialPayment * 100);
    if (amountPence < 50) {
      setSubmitted(true);
      return;
    }

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
        window.location.href = checkoutUrl;
      }
    } catch (err) {
      if (paymentTab) paymentTab.close();
      throw err;
    }
    setSubmitted(true);
  };

  const isLoading = createInstruct.isPending || createCheckout.isPending;

  const inputStyle = {
    fontFamily: "'DM Sans', sans-serif",
    borderColor: "oklch(0.88 0.015 80)",
    color: "oklch(0.18 0.06 250)",
  };

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
                <span className="font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(firm.total)}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Initial payment on account</span>
                <span className="font-semibold" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(initialPayment)}</span>
              </div>
              <div className="text-xs mt-1" style={{ color: "oklch(0.65 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                {breakdownLabel ? `Includes: ${breakdownLabel}` : 'AML checks included'}
              </div>
              {/* File opening fee line — purchase/sale_purchase only */}
              {isPurchaseOrMoving && (
                <div className="mt-2 pt-2" style={{ borderTop: "1px dashed oklch(0.85 0.015 80)" }}>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>File Opening Fee</span>
                    <span className="font-semibold" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(PURCHASE_FILE_OPENING_FEE)}</span>
                  </div>
                  <div className="text-xs mt-0.5 italic" style={{ color: "oklch(0.60 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                    This fee is non-refundable
                  </div>
                </div>
              )}
              <div className="text-xs mt-2 italic" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                This payment is deducted from the final sum on completion
              </div>
            </div>

            {/* Name row */}
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
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
                  />
                </div>
              ))}
            </div>

            {/* Email & phone */}
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
                  style={inputStyle}
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
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
              />
            </div>

            {/* Current address */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Current residential address</label>
              <textarea
                required
                rows={3}
                value={form.currentAddress}
                onChange={(e) => setForm((p) => ({ ...p, currentAddress: e.target.value }))}
                placeholder="Enter your full current address"
                className="w-full px-3 py-2.5 rounded-lg text-sm border-2 outline-none resize-none"
                style={inputStyle}
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
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
              />
            </div>

            {/* Payment notice */}
            <div style={{ borderTop: "1px solid oklch(0.88 0.015 80)", paddingTop: "1rem" }}>
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={15} style={{ color: "oklch(0.72 0.12 75)" }} />
                <span className="text-sm font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>
                  Initial Payment on Account — {formatCurrency(initialPayment)}
                </span>
              </div>
              <div className="rounded-lg p-3 text-xs" style={{ background: "oklch(0.97 0.008 80)", border: "1px solid oklch(0.88 0.015 80)", color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
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

// ─── FEE BREAKDOWN TABLE WITH INSTRUCT BUTTONS ────────────────────────────────
function FeeBreakdownTable({
  snapshot,
  transactionType,
  contactDetails,
}: {
  snapshot: QuoteSnapshotItem[];
  transactionType: string;
  contactDetails: { firstName: string; lastName: string; email: string; phone: string };
}) {
  const [instructingFirm, setInstructingFirm] = useState<QuoteSnapshotItem | null>(null);
  const sorted = [...snapshot].sort((a, b) => a.total - b.total);

  return (
    <>
      {instructingFirm && (
        <InstructModal
          firm={instructingFirm}
          transactionType={transactionType}
          contactDetails={contactDetails}
          onClose={() => setInstructingFirm(null)}
        />
      )}

      <div className="rounded-2xl bg-white shadow-sm p-6 mb-6" style={{ border: "1px solid oklch(0.93 0.01 80)" }}>
        <h3 className="text-base font-bold mb-1" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
          Your Conveyancing Quotes
        </h3>
        <p className="text-xs mb-5" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
          {sorted.length} regulated firms · Sorted by total cost
        </p>

        <div className="space-y-5">
          {sorted.map((q, i) => {
            const disbTotal = (q.disbursements || []).reduce((s, d) => s + d.price, 0);
            const lrFee = q.landRegistryFee ?? q.landRegistry ?? 0;
            return (
              <div
                key={q.firmName}
                className="rounded-xl overflow-hidden"
                style={{
                  border: i === 0 ? "2px solid oklch(0.72 0.12 75)" : "1px solid oklch(0.88 0.015 80)",
                  boxShadow: i === 0 ? "0 4px 16px oklch(0.72 0.12 75 / 0.12)" : "none",
                }}
              >
                {/* Firm header */}
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    background: i === 0 ? "oklch(0.18 0.06 250)" : "oklch(0.975 0.008 80)",
                    borderBottom: "1px solid oklch(0.93 0.01 80)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    {q.logoUrl && (
                      <img src={q.logoUrl} alt={q.firmName} className="w-8 h-8 rounded object-contain" style={{ background: "white", padding: 2 }} />
                    )}
                    <div>
                      <span className="font-bold text-sm" style={{ color: i === 0 ? "white" : "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>{q.firmName}</span>
                      {q.firmLocation && (
                        <span className="text-xs ml-2" style={{ color: i === 0 ? "oklch(0.72 0.12 75)" : "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{q.firmLocation}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {i === 0 && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "oklch(0.72 0.12 75)", color: "oklch(0.12 0.05 250)", fontFamily: "'DM Sans', sans-serif" }}>★ Best Value</span>
                    )}
                    {q.rating && (
                      <div className="flex items-center gap-1">
                        <Star size={12} fill="oklch(0.72 0.12 75)" style={{ color: "oklch(0.72 0.12 75)" }} />
                        <span className="text-xs font-semibold" style={{ color: i === 0 ? "white" : "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>{q.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {/* ── SALE & PURCHASE: two separate leg panels (same layout as results page) ── */}
                  {q.purchaseBreakdown && q.saleBreakdown ? (
                    <>
                      {([q.purchaseBreakdown, q.saleBreakdown] as LegBreakdown[]).map((leg) => (
                        <div key={leg.label} className="rounded-xl overflow-hidden" style={{ border: '1px solid oklch(0.88 0.015 80)' }}>
                          {/* Leg header */}
                          <div className="px-4 py-2 text-xs font-bold uppercase tracking-wide" style={{ background: 'oklch(0.18 0.06 250)', color: 'oklch(0.72 0.12 75)', fontFamily: "'DM Sans', sans-serif" }}>
                            {leg.label} — {formatCurrency(leg.propertyValue)}
                          </div>
                          <div className="p-4 space-y-1">
                            <div className="flex justify-between text-sm">
                              <span style={{ color: 'oklch(0.45 0.04 250)', fontFamily: "'DM Sans', sans-serif" }}>Base legal fee</span>
                              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'oklch(0.18 0.06 250)' }}>{formatCurrency(leg.legalFee)}</span>
                            </div>
                            {leg.supplements.map(s => (
                              <div key={s.name} className="flex justify-between text-sm">
                                <span style={{ color: 'oklch(0.45 0.04 250)', fontFamily: "'DM Sans', sans-serif" }}>{s.name}</span>
                                <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'oklch(0.18 0.06 250)' }}>+{formatCurrency(s.price)}</span>
                              </div>
                            ))}
                            <div className="flex justify-between text-sm" style={{ borderTop: '1px solid oklch(0.88 0.015 80)', paddingTop: '4px' }}>
                              <span style={{ color: 'oklch(0.45 0.04 250)', fontFamily: "'DM Sans', sans-serif" }}>VAT (20%)</span>
                              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'oklch(0.18 0.06 250)' }}>{formatCurrency(leg.vat)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold">
                              <span style={{ color: 'oklch(0.18 0.06 250)', fontFamily: "'DM Sans', sans-serif" }}>Legal fees (inc. VAT)</span>
                              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'oklch(0.18 0.06 250)' }}>{formatCurrency(leg.totalIncVat)}</span>
                            </div>
                            {leg.disbursements.length > 0 && (
                              <>
                                <div className="text-xs font-bold mt-2 uppercase tracking-wide" style={{ color: 'oklch(0.55 0.04 250)', fontFamily: "'DM Sans', sans-serif" }}>Disbursements</div>
                                {leg.disbursements.map(d => (
                                  <div key={d.name} className="flex justify-between text-sm">
                                    <span style={{ color: 'oklch(0.45 0.04 250)', fontFamily: "'DM Sans', sans-serif" }}>{d.name}</span>
                                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'oklch(0.18 0.06 250)' }}>{formatCurrency(d.price)}</span>
                                  </div>
                                ))}
                              </>
                            )}
                            {(leg.sdlt > 0 || leg.landRegistryFee > 0) && (
                              <>
                                <div className="text-xs font-bold mt-2 uppercase tracking-wide" style={{ color: 'oklch(0.55 0.04 250)', fontFamily: "'DM Sans', sans-serif" }}>Government Fees</div>
                                {leg.sdlt > 0 && (
                                  <div className="flex justify-between text-sm">
                                    <span style={{ color: 'oklch(0.45 0.04 250)', fontFamily: "'DM Sans', sans-serif" }}>Stamp Duty Land Tax (SDLT)</span>
                                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'oklch(0.18 0.06 250)' }}>{formatCurrency(leg.sdlt)}</span>
                                  </div>
                                )}
                                {leg.landRegistryFee > 0 && (
                                  <div className="flex justify-between text-sm">
                                    <span style={{ color: 'oklch(0.45 0.04 250)', fontFamily: "'DM Sans', sans-serif" }}>Land Registry Fee</span>
                                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'oklch(0.18 0.06 250)' }}>{formatCurrency(leg.landRegistryFee)}</span>
                                  </div>
                                )}
                              </>
                            )}
                            <div className="flex justify-between text-sm font-bold pt-1" style={{ borderTop: '1px solid oklch(0.88 0.015 80)' }}>
                              <span style={{ color: 'oklch(0.18 0.06 250)', fontFamily: "'DM Sans', sans-serif" }}>{leg.label} Subtotal</span>
                              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'oklch(0.72 0.12 75)' }}>{formatCurrency(leg.grandTotal)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {/* Combined Grand Total */}
                      <div className="rounded-xl overflow-hidden" style={{ background: 'oklch(0.18 0.06 250)' }}>
                        <div className="flex justify-between items-center px-4 py-3">
                          <span className="text-sm font-bold" style={{ color: 'white', fontFamily: "'DM Sans', sans-serif" }}>Grand Total (Sale + Purchase)</span>
                          <span className="text-lg font-bold" style={{ color: 'oklch(0.72 0.12 75)', fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(q.total)}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Single transaction breakdown (purchase / sale / remortgage) */}
                      {/* Legal Fees */}
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Legal Fees</div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Base legal fee</span>
                            <span className="font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(q.legalFee)}</span>
                          </div>
                          {(q.supplements || []).map(s => (
                            <div key={s.name} className="flex justify-between text-sm">
                              <span style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>+ {s.name}</span>
                              <span className="font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'JetBrains Mono', monospace" }}>+{formatCurrency(s.price)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between text-sm" style={{ borderTop: "1px solid oklch(0.93 0.01 80)", paddingTop: 4 }}>
                            <span style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>VAT (20%)</span>
                            <span className="font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(q.vat)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-bold">
                            <span style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Total legal fees (inc. VAT)</span>
                            <span style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(q.totalIncVat)}</span>
                          </div>
                        </div>
                      </div>
                      {/* Disbursements */}
                      {(q.disbursements || []).length > 0 && (
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Disbursements</div>
                          <div className="space-y-1">
                            {(q.disbursements || []).map(d => (
                              <div key={d.name} className="flex justify-between text-sm">
                                <span style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{d.name}</span>
                                <span className="font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(d.price)}</span>
                              </div>
                            ))}
                            <div className="flex justify-between text-sm font-bold" style={{ borderTop: "1px solid oklch(0.93 0.01 80)", paddingTop: 4 }}>
                              <span style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Legal Fees + Disbursements</span>
                              <span style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(q.totalIncVat + disbTotal)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Government Fees */}
                      {(q.sdlt > 0 || lrFee > 0) && (
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Government Fees</div>
                          <div className="space-y-1">
                            {q.sdlt > 0 && (
                              <div className="flex justify-between text-sm">
                                <span style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Stamp Duty Land Tax (SDLT)</span>
                                <span className="font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(q.sdlt)}</span>
                              </div>
                            )}
                            {lrFee > 0 && (
                              <div className="flex justify-between text-sm">
                                <span style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Land Registry Fee</span>
                                <span className="font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(lrFee)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {/* Grand Total */}
                      <div className="rounded-xl overflow-hidden" style={{ background: "oklch(0.18 0.06 250)" }}>
                        {disbTotal > 0 && (
                          <div className="flex justify-between items-center px-3 pt-3 pb-2" style={{ borderBottom: "1px solid oklch(0.975 0.008 80 / 0.15)" }}>
                            <span className="text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.75)", fontFamily: "'DM Sans', sans-serif" }}>Legal Fees Total (inc. VAT + Disbursements)</span>
                            <span className="text-sm font-semibold" style={{ color: "oklch(0.975 0.008 80 / 0.9)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(q.totalIncVat + disbTotal)}</span>
                          </div>
                        )}
                        {q.sdlt > 0 && (
                          <div className="flex justify-between items-center px-3 py-2" style={{ borderBottom: "1px solid oklch(0.975 0.008 80 / 0.15)" }}>
                            <span className="text-sm" style={{ color: "oklch(0.975 0.008 80 / 0.75)", fontFamily: "'DM Sans', sans-serif" }}>Stamp Duty Land Tax (SDLT)</span>
                            <span className="text-sm font-semibold" style={{ color: "oklch(0.975 0.008 80 / 0.9)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(q.sdlt)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center px-3 pt-2 pb-3">
                          <span className="text-sm font-bold" style={{ color: "white", fontFamily: "'DM Sans', sans-serif" }}>Grand Total</span>
                          <span className="text-lg font-bold" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(q.total)}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Instruct Directly button */}
                  <button
                    onClick={() => setInstructingFirm(q)}
                    className="btn-gold w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mt-1"
                  >
                    <CheckCircle size={15} />
                    Instruct {q.firmName} Directly
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs mt-4" style={{ color: "oklch(0.65 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
          Quotes are indicative and based on the information provided at the time of your enquiry. Final fees may vary depending on the complexity of your transaction. All firms are regulated by the SRA or CLC.
        </p>
      </div>
    </>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function SavedQuote() {
  const params = useParams<{ ref: string }>();
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);
  const ref = params.ref || "";

  const { data: lead, isLoading, error } = trpc.leads.getByRef.useQuery(
    { referenceNumber: ref },
    { enabled: !!ref, retry: 1 }
  );

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parse quote snapshot if available
  let quoteSnapshot: QuoteSnapshotItem[] | null = null;
  if (lead?.quoteSnapshot) {
    try {
      quoteSnapshot = JSON.parse(lead.quoteSnapshot as string);
    } catch {
      quoteSnapshot = null;
    }
  }

  // Build contact details from lead for pre-filling the instruct form
  const contactDetails = {
    firstName: lead?.firstName ?? "",
    lastName: lead?.lastName ?? "",
    email: lead?.email ?? "",
    phone: lead?.phone ?? "",
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.975 0.008 80)" }}>
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
            <ArrowLeft size={14} className="mr-1" /> New Quote
          </button>
        </div>
      </div>

      <div className="container py-10 max-w-3xl mx-auto">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={36} className="animate-spin" style={{ color: "oklch(0.72 0.12 75)" }} />
            <p style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Loading your saved quote…</p>
          </div>
        )}

        {/* Not found */}
        {!isLoading && (!lead || error) && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <AlertCircle size={40} style={{ color: "oklch(0.55 0.12 30)" }} />
            <h2 className="text-xl font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>Quote Not Found</h2>
            <p style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif", maxWidth: 400 }}>
              We couldn't find a quote with reference <strong>{ref}</strong>. Please check the link in your email or start a new quote.
            </p>
            <button
              onClick={() => navigate("/get-quote")}
              className="btn-gold px-6 py-3 rounded-xl text-sm font-bold mt-2"
            >
              Get a New Quote
            </button>
          </div>
        )}

        {/* Quote found */}
        {!isLoading && lead && (
          <>
            {/* Reference banner */}
            <div className="rounded-2xl p-6 mb-6 text-center" style={{ background: "oklch(0.18 0.06 250)" }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>
                Your Quote Reference
              </p>
              <p className="text-3xl font-bold tracking-widest mb-3" style={{ color: "white", fontFamily: "monospace" }}>
                {lead.referenceNumber}
              </p>
              <p className="text-sm mb-4" style={{ color: "oklch(0.975 0.008 80 / 0.6)", fontFamily: "'DM Sans', sans-serif" }}>
                Saved on {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—"}
              </p>
              <button
                onClick={copyUrl}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: "oklch(0.72 0.12 75 / 0.15)", border: "1px solid oklch(0.72 0.12 75 / 0.4)", color: "oklch(0.82 0.10 75)", fontFamily: "'DM Sans', sans-serif" }}
              >
                {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                {copied ? "Link copied!" : "Copy quote link"}
              </button>
            </div>

            {/* Fee breakdown with Instruct Directly buttons */}
            {quoteSnapshot && quoteSnapshot.length > 0 && (
              <FeeBreakdownTable
                snapshot={quoteSnapshot}
                transactionType={lead.transactionType ?? "purchase"}
                contactDetails={contactDetails}
              />
            )}

            {/* Property details */}
            <div className="rounded-2xl bg-white shadow-sm p-6 mb-6" style={{ border: "1px solid oklch(0.93 0.01 80)" }}>
              <h3 className="text-base font-bold mb-4" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
                Property Details
              </h3>
              <table width="100%" cellPadding={0} cellSpacing={0}>
                <tbody>
                  <InfoRow label="Transaction Type" value={TX_LABELS[lead.transactionType] ?? lead.transactionType} />
                  <InfoRow label="Property Value" value={lead.propertyValue ? `£${Number(lead.propertyValue).toLocaleString()}` : undefined} />
                  <InfoRow label="Postcode" value={lead.postcode} />
                  <InfoRow label="Tenure" value={lead.propertyTenure ? (lead.propertyTenure.charAt(0).toUpperCase() + lead.propertyTenure.slice(1)) : undefined} />
                  <InfoRow label="New Build" value={lead.isNewBuild ? "Yes" : lead.isNewBuild === false ? "No" : undefined} />
                  <InfoRow label="First Time Buyer" value={lead.isFirstTimeBuyer ? "Yes" : lead.isFirstTimeBuyer === false ? "No" : undefined} />
                  <InfoRow label="Has Mortgage" value={lead.hasMortgage ? "Yes" : lead.hasMortgage === false ? "No" : undefined} />
                  <InfoRow label="Mortgage Lender" value={lead.mortgageLender} />
                  <InfoRow label="Completion Timeline" value={lead.movingTimeline} />
                </tbody>
              </table>
            </div>

            {/* No snapshot fallback */}
            {!quoteSnapshot && (
              <div className="rounded-2xl p-6 mb-6 text-center" style={{ background: "white", border: "1px solid oklch(0.93 0.01 80)" }}>
                <h3 className="text-lg font-bold mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
                  Want fresh quotes?
                </h3>
                <p className="text-sm mb-5" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                  Start a new quote to see the latest pricing from regulated UK conveyancers.
                </p>
                <button
                  onClick={() => navigate("/get-quote")}
                  className="btn-gold px-8 py-3.5 rounded-xl text-sm font-bold"
                >
                  Get New Quotes →
                </button>
              </div>
            )}

            {/* New quote CTA */}
            {quoteSnapshot && (
              <div className="rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: "oklch(0.18 0.06 250 / 0.05)", border: "1px solid oklch(0.88 0.015 80)" }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Need help choosing?</p>
                  <p className="text-xs" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Our team can guide you through the options.</p>
                </div>
                <div className="flex gap-3">
                  <a href="tel:03301289488" className="btn-gold px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2" style={{ textDecoration: "none" }}>
                    <Phone size={14} />
                    Call Us
                  </a>
                  <button onClick={() => navigate("/get-quote")} className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ border: "2px solid oklch(0.18 0.06 250)", color: "oklch(0.18 0.06 250)", background: "white", fontFamily: "'DM Sans', sans-serif" }}>
                    New Quote
                  </button>
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="rounded-2xl p-6" style={{ background: "oklch(0.18 0.06 250 / 0.04)", border: "1px solid oklch(0.88 0.015 80)" }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>
                Need help? Our team is here.
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="tel:03301289488" className="flex items-center gap-2 text-sm" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>
                  <Phone size={14} style={{ color: "oklch(0.72 0.12 75)" }} />
                  0330 128 9488
                </a>
                <a href="mailto:info@comparetheconveyancingmarket.co.uk" className="flex items-center gap-2 text-sm" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>
                  <Mail size={14} style={{ color: "oklch(0.72 0.12 75)" }} />
                  info@comparetheconveyancingmarket.co.uk
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
