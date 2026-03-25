/*
 * SAVED QUOTE PAGE — /quote/:ref
 * Shows a customer's personalised conveyancing quote by reference number.
 * Linked from the confirmation email sent after completing the wizard.
 */

import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Scale, ArrowLeft, Phone, Mail, Copy, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";

const TX_LABELS: Record<string, string> = {
  purchase: "Property Purchase",
  sale: "Property Sale",
  sale_purchase: "Sale & Purchase",
  remortgage: "Remortgage",
};

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <tr>
      <td style={{ padding: "8px 12px", color: "#6b7280", fontSize: 13, fontFamily: "'DM Sans', sans-serif", width: "45%", borderBottom: "1px solid oklch(0.93 0.01 80)" }}>{label}</td>
      <td style={{ padding: "8px 12px", color: "oklch(0.18 0.06 250)", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, borderBottom: "1px solid oklch(0.93 0.01 80)" }}>{value}</td>
    </tr>
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

            {/* CTA */}
            <div className="rounded-2xl p-6 mb-6 text-center" style={{ background: "white", border: "1px solid oklch(0.93 0.01 80)" }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
                Ready to see your quotes?
              </h3>
              <p className="text-sm mb-5" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                Your personalised quotes from regulated UK conveyancers are waiting. Complete a new quote to see live pricing.
              </p>
              <button
                onClick={() => navigate("/get-quote")}
                className="btn-gold px-8 py-3.5 rounded-xl text-sm font-bold"
              >
                Get New Quotes →
              </button>
            </div>

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
