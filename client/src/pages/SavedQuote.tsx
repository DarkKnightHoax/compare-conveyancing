/*
 * SAVED QUOTE PAGE — /quote/:ref
 * Shows a customer's personalised conveyancing quote by reference number.
 * Linked from the confirmation email sent after completing the wizard.
 */

import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Scale, ArrowLeft, Phone, Mail, Copy, CheckCircle, Loader2, AlertCircle, Star } from "lucide-react";
import { useState } from "react";

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

interface QuoteSnapshotItem {
  firmName: string;
  firmLocation?: string;
  rating?: number;
  legalFee: number;
  supplements?: { name: string; price: number }[];
  vat: number;
  totalIncVat: number;
  disbursements?: { name: string; price: number; includesVat?: boolean }[];
  sdlt: number;
  landRegistry: number;
  total: number;
}

function FeeBreakdownTable({ snapshot }: { snapshot: QuoteSnapshotItem[] }) {
  const sorted = [...snapshot].sort((a, b) => a.total - b.total);
  return (
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
              <div className="flex items-center justify-between px-4 py-3" style={{ background: i === 0 ? "oklch(0.18 0.06 250)" : "oklch(0.975 0.008 80)", borderBottom: "1px solid oklch(0.93 0.01 80)" }}>
                <div>
                  <span className="font-bold text-sm" style={{ color: i === 0 ? "white" : "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>{q.firmName}</span>
                  {q.firmLocation && <span className="text-xs ml-2" style={{ color: i === 0 ? "oklch(0.72 0.12 75)" : "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{q.firmLocation}</span>}
                </div>
                {i === 0 && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "oklch(0.72 0.12 75)", color: "oklch(0.12 0.05 250)", fontFamily: "'DM Sans', sans-serif" }}>★ Best Value</span>
                )}
              </div>

              <div className="p-4 space-y-3">
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
                {(q.sdlt > 0 || q.landRegistry > 0) && (
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Government Fees</div>
                    <div className="space-y-1">
                      {q.sdlt > 0 && (
                        <div className="flex justify-between text-sm">
                          <span style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Stamp Duty Land Tax (SDLT)</span>
                          <span className="font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(q.sdlt)}</span>
                        </div>
                      )}
                      {q.landRegistry > 0 && (
                        <div className="flex justify-between text-sm">
                          <span style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Land Registry Fee</span>
                          <span className="font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'JetBrains Mono', monospace" }}>{formatCurrency(q.landRegistry)}</span>
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
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs mt-4" style={{ color: "oklch(0.65 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
        Quotes are indicative and based on the information provided at the time of your enquiry. Final fees may vary depending on the complexity of your transaction. All firms are regulated by the SRA or CLC.
      </p>
    </div>
  );
}

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
              className="btn-gold px-6 py-3 rounded-xl text-sm font-semibold mt-2"
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

            {/* Fee breakdown from snapshot */}
            {quoteSnapshot && quoteSnapshot.length > 0 && (
              <FeeBreakdownTable snapshot={quoteSnapshot} />
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

            {/* CTA — only show if no snapshot (quote expired or not yet loaded) */}
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

            {/* New quote CTA when snapshot is shown */}
            {quoteSnapshot && (
              <div className="rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: "oklch(0.18 0.06 250 / 0.05)", border: "1px solid oklch(0.88 0.015 80)" }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Ready to instruct?</p>
                  <p className="text-xs" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Call us or start a new quote to proceed.</p>
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
