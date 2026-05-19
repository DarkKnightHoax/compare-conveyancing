import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  LayoutDashboard, Users, Phone, Building2, FileCheck,
  LogOut, Scale, ChevronDown, CheckCircle, XCircle,
  Clock, AlertCircle, TrendingUp, RefreshCw,
  DollarSign, StickyNote, Plus, Trash2, Edit3, Save, Loader2, Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type AdminTab = "dashboard" | "leads" | "callbacks" | "instructions" | "firms" | "fees" | "notes";

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    new:          { bg: "oklch(0.95 0.05 145)", text: "oklch(0.25 0.12 145)", label: "New" },
    contacted:    { bg: "oklch(0.95 0.05 230)", text: "oklch(0.25 0.12 230)", label: "Contacted" },
    instructed:   { bg: "oklch(0.95 0.08 75)",  text: "oklch(0.35 0.15 75)",  label: "Instructed" },
    lost:         { bg: "oklch(0.95 0.03 15)",  text: "oklch(0.40 0.12 15)",  label: "Lost" },
    pending:      { bg: "oklch(0.95 0.05 60)",  text: "oklch(0.35 0.12 60)",  label: "Pending" },
    called:       { bg: "oklch(0.95 0.05 145)", text: "oklch(0.25 0.12 145)", label: "Called" },
    no_answer:    { bg: "oklch(0.95 0.03 15)",  text: "oklch(0.40 0.12 15)",  label: "No Answer" },
    resolved:     { bg: "oklch(0.95 0.08 75)",  text: "oklch(0.35 0.15 75)",  label: "Resolved" },
    submitted:    { bg: "oklch(0.95 0.05 230)", text: "oklch(0.25 0.12 230)", label: "Submitted" },
    confirmed:    { bg: "oklch(0.95 0.05 145)", text: "oklch(0.25 0.12 145)", label: "Confirmed" },
    in_progress:  { bg: "oklch(0.95 0.05 60)",  text: "oklch(0.35 0.12 60)",  label: "In Progress" },
    completed:    { bg: "oklch(0.95 0.08 75)",  text: "oklch(0.35 0.15 75)",  label: "Completed" },
    cancelled:    { bg: "oklch(0.95 0.03 15)",  text: "oklch(0.40 0.12 15)",  label: "Cancelled" },
  };
  const s = map[status] ?? { bg: "oklch(0.95 0.02 250)", text: "oklch(0.4 0.04 250)", label: status };
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: number | string; sub?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div className="text-3xl font-bold mb-1" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
        {value}
      </div>
      <div className="text-sm font-medium" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </div>
      {sub && <div className="text-xs mt-1" style={{ color: "oklch(0.6 0.03 250)", fontFamily: "'DM Sans', sans-serif" }}>{sub}</div>}
    </div>
  );
}

// ─── DASHBOARD TAB ────────────────────────────────────────────────────────────
function DashboardTab() {
  const { data: stats } = trpc.leads.stats.useQuery();
  const { data: pendingCallbacks } = trpc.callbacks.pendingCount.useQuery();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
        Overview
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={TrendingUp} label="Total Leads" value={stats?.total ?? 0} sub={`${stats?.todayCount ?? 0} today`} color="oklch(0.55 0.18 250)" />
        <StatCard icon={AlertCircle} label="New Leads" value={stats?.new ?? 0} sub="Awaiting contact" color="oklch(0.55 0.18 145)" />
        <StatCard icon={CheckCircle} label="Instructed" value={stats?.instructed ?? 0} sub="Converted" color="oklch(0.55 0.18 75)" />
        <StatCard icon={Phone} label="Pending Callbacks" value={pendingCallbacks ?? 0} sub="Awaiting call" color="oklch(0.55 0.18 30)" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
            Lead Status Breakdown
          </h3>
          {stats && (
            <div className="space-y-3">
              {[
                { label: "New", value: stats.new, total: stats.total, color: "oklch(0.55 0.18 145)" },
                { label: "Contacted", value: stats.contacted, total: stats.total, color: "oklch(0.55 0.18 230)" },
                { label: "Instructed", value: stats.instructed, total: stats.total, color: "oklch(0.55 0.18 75)" },
                { label: "Lost", value: stats.lost, total: stats.total, color: "oklch(0.55 0.18 15)" },
              ].map(({ label, value, total, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    <span style={{ color: "oklch(0.35 0.04 250)" }}>{label}</span>
                    <span style={{ color: "oklch(0.18 0.06 250)", fontWeight: 600 }}>{value}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "oklch(0.94 0.01 250)" }}>
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ width: total > 0 ? `${(value / total) * 100}%` : "0%", background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
            Quick Stats
          </h3>
          <div className="space-y-4">
            {[
              { label: "Leads this week", value: stats?.weekCount ?? 0 },
              { label: "Leads today", value: stats?.todayCount ?? 0 },
              { label: "Conversion rate", value: stats && stats.total > 0 ? `${Math.round((stats.instructed / stats.total) * 100)}%` : "0%" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid oklch(0.95 0.01 250)" }}>
                <span className="text-sm" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                <span className="text-sm font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LEADS TAB ────────────────────────────────────────────────────────────────
const LEADS_PER_PAGE = 10;

function LeadsTab() {
  const [page, setPage] = useState(1);
  const { data: leads, refetch } = trpc.leads.list.useQuery({ limit: 1000 });
  const updateStatus = trpc.leads.updateStatus.useMutation({ onSuccess: () => refetch() });
  const markContacted = trpc.leads.markContacted.useMutation({ onSuccess: () => refetch() });
  const deleteLead = trpc.leads.delete.useMutation({
    onSuccess: () => { refetch(); toast.success('Lead deleted'); },
    onError: () => toast.error('Failed to delete lead'),
  });
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const txLabel: Record<string, string> = {
    purchase: "Purchase", sale: "Sale", sale_purchase: "Sale & Purchase", remortgage: "Remortgage"
  };

  const totalLeads = leads?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalLeads / LEADS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pagedLeads = (leads ?? []).slice((safePage - 1) * LEADS_PER_PAGE, safePage * LEADS_PER_PAGE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
            All Leads
          </h2>
          {totalLeads > 0 && (
            <p className="text-sm mt-0.5" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              {totalLeads} total &mdash; page {safePage} of {totalPages}
            </p>
          )}
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg" style={{ background: "oklch(0.18 0.06 250)", color: "white", fontFamily: "'DM Sans', sans-serif" }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {!leads || leads.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>
          <Users size={40} className="mx-auto mb-3" style={{ color: "oklch(0.72 0.12 75)" }} />
          <p className="text-lg font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>No leads yet</p>
          <p className="text-sm mt-1" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Leads will appear here once customers complete the quote wizard.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pagedLeads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>
              {/* ── CONFIRM DELETE OVERLAY ── */}
              {confirmDeleteId === lead.id && (
                <div className="p-4 flex items-center justify-between" style={{ background: "oklch(0.97 0.02 25)", borderBottom: "1px solid oklch(0.90 0.04 25)" }}>
                  <span className="text-sm font-semibold" style={{ color: "oklch(0.35 0.08 25)", fontFamily: "'DM Sans', sans-serif" }}>
                    Delete {lead.firstName} {lead.lastName}? This cannot be undone.
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ background: "oklch(0.93 0.01 250)", color: "oklch(0.35 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}
                    >Cancel</button>
                    <button
                      onClick={() => { deleteLead.mutate({ id: lead.id }); setConfirmDeleteId(null); setExpandedId(null); }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ background: "oklch(0.50 0.18 25)", color: "white", fontFamily: "'DM Sans', sans-serif" }}
                    >Yes, Delete</button>
                  </div>
                </div>
              )}
              <div
                className="p-5 cursor-pointer flex items-center justify-between"
                onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "oklch(0.18 0.06 250)", color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>
                    {lead.firstName[0]}{lead.lastName[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>
                      {lead.firstName} {lead.lastName}
                    </div>
                    <div className="text-xs" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                      {lead.email} · {txLabel[lead.transactionType]} · £{Number(lead.propertyValue).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={lead.status} />
                  <span className="text-xs" style={{ color: "oklch(0.6 0.03 250)", fontFamily: "'DM Sans', sans-serif" }}>
                    {new Date(lead.createdAt).toLocaleDateString("en-GB")}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(confirmDeleteId === lead.id ? null : lead.id); }}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: "oklch(0.55 0.15 25)", background: "oklch(0.96 0.02 25)" }}
                    title="Delete lead"
                  >
                    <Trash2 size={14} />
                  </button>
                  <ChevronDown size={16} style={{ color: "oklch(0.6 0.03 250)", transform: expandedId === lead.id ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </div>
              </div>

              {expandedId === lead.id && (
                <div className="px-5 pb-5 pt-0" style={{ borderTop: "1px solid oklch(0.95 0.01 250)" }}>

                  {/* ── CONTACT DETAILS ── */}
                  <div className="mt-4 mb-3">
                    <div className="text-xs font-bold mb-2" style={{ color: "oklch(0.45 0.05 250)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Contact Details</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Phone", value: lead.phone },
                        { label: "Email", value: lead.email },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <div className="text-xs font-semibold mb-0.5" style={{ color: "oklch(0.6 0.03 250)", fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
                          <div className="text-sm break-all" style={{ color: "oklch(0.25 0.05 250)", fontFamily: "'DM Sans', sans-serif" }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── PROPERTY DETAILS ── */}
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid oklch(0.93 0.01 250)" }}>
                    <div className="text-xs font-bold mb-2" style={{ color: "oklch(0.45 0.05 250)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Property Details</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Transaction", value: { purchase: "Purchase", sale: "Sale", sale_purchase: "Sale & Purchase", remortgage: "Remortgage" }[lead.transactionType] ?? lead.transactionType },
                        // For sale_purchase: show both sale and purchase prices
                        ...(lead.transactionType === 'sale_purchase' ? [
                          { label: "Purchase Price", value: `£${Number(lead.propertyValue).toLocaleString('en-GB')}` },
                          { label: "Sale Price", value: (lead as any).salePropertyValue ? `£${Number((lead as any).salePropertyValue).toLocaleString('en-GB')}` : "—" },
                          { label: "Purchase Postcode", value: (lead as any).purchasePostcode || lead.postcode || "—" },
                          { label: "Sale Postcode", value: (lead as any).salePostcode || "—" },
                          { label: "Purchase Tenure", value: (lead as any).purchaseTenure ? ((lead as any).purchaseTenure as string).charAt(0).toUpperCase() + ((lead as any).purchaseTenure as string).slice(1) : "—" },
                          { label: "Sale Tenure", value: (lead as any).saleTenure ? ((lead as any).saleTenure as string).charAt(0).toUpperCase() + ((lead as any).saleTenure as string).slice(1) : "—" },
                        ] : [
                          { label: "Property Value", value: `£${Number(lead.propertyValue).toLocaleString('en-GB')}` },
                          { label: "Postcode", value: lead.postcode },
                          { label: "Tenure", value: lead.propertyTenure ? lead.propertyTenure.charAt(0).toUpperCase() + lead.propertyTenure.slice(1) : "—" },
                        ]),
                        { label: "Timeline", value: lead.movingTimeline ?? "—" },
                        { label: "Number of Buyers", value: String(lead.numberOfBuyers ?? 1) },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <div className="text-xs font-semibold mb-0.5" style={{ color: "oklch(0.6 0.03 250)", fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
                          <div className="text-sm" style={{ color: "oklch(0.25 0.05 250)", fontFamily: "'DM Sans', sans-serif" }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── BUYER SITUATION FLAGS ── */}
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid oklch(0.93 0.01 250)" }}>
                    <div className="text-xs font-bold mb-2" style={{ color: "oklch(0.45 0.05 250)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Buyer Situation</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "First Time Buyer", value: lead.isFirstTimeBuyer ? "✅ Yes" : "No" },
                        { label: "Has Mortgage", value: lead.hasMortgage ? `✅ Yes${lead.mortgageLender ? ` — ${lead.mortgageLender}` : ''}` : "No" },
                        { label: "New Build", value: lead.isNewBuild ? "✅ Yes" : "No" },
                        { label: "Shared Ownership", value: lead.isSharedOwnership ? "✅ Yes" : "No" },
                        { label: "Gifted Deposit", value: lead.isGiftedDeposit ? "✅ Yes" : "No" },
                        { label: "Help to Buy ISA", value: lead.hasHelpToBuyIsa ? "✅ Yes" : "No" },
                        { label: "Right to Buy", value: lead.isRightToBuy ? "✅ Yes" : "No" },
                        { label: "Buy to Let", value: lead.isBuyToLet ? "✅ Yes" : "No" },
                        { label: "Additional Property", value: lead.isSecondHome ? "✅ Yes" : "No" },
                        { label: "Mortgage on Sale", value: lead.hasMortgageOnSale ? "✅ Yes" : "No" },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <div className="text-xs font-semibold mb-0.5" style={{ color: "oklch(0.6 0.03 250)", fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
                          <div className="text-sm" style={{ color: "oklch(0.25 0.05 250)", fontFamily: "'DM Sans', sans-serif" }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── QUOTED FEES ── */}
                  {(lead.quotedLegalFee || lead.quotedTotal || lead.actionTaken) && (
                    <div className="mt-3 pt-3" style={{ borderTop: "1px solid oklch(0.93 0.01 250)" }}>
                      <div className="text-xs font-bold mb-2" style={{ color: "oklch(0.45 0.05 250)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Quoted Fees & Action</div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: "Legal Fee (inc. VAT)", value: lead.quotedLegalFee ? `£${Number(lead.quotedLegalFee).toLocaleString('en-GB', { minimumFractionDigits: 2 })}` : "—" },
                          { label: "Grand Total", value: lead.quotedTotal ? `£${Number(lead.quotedTotal).toLocaleString('en-GB', { minimumFractionDigits: 2 })}` : "—" },
                          { label: "Action Taken", value: lead.actionTaken ? lead.actionTaken.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : "—" },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <div className="text-xs font-semibold mb-0.5" style={{ color: "oklch(0.6 0.03 250)", fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
                            <div className="text-sm" style={{ color: "oklch(0.25 0.05 250)", fontFamily: "'DM Sans', sans-serif" }}>{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-4" />
                  {/* Traffic Source / Attribution */}
                  {(lead.utmSource || lead.utmMedium || lead.utmCampaign || lead.utmTerm || lead.referrerUrl || lead.landingPage) && (
                    <div className="mt-4 pt-3" style={{ borderTop: "1px solid oklch(0.93 0.01 250)" }}>
                      <div className="text-xs font-bold mb-2" style={{ color: "oklch(0.45 0.05 250)", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>Traffic Source</div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { label: "Source", value: lead.utmSource },
                          { label: "Medium", value: lead.utmMedium },
                          { label: "Campaign", value: lead.utmCampaign },
                          { label: "Keyword", value: lead.utmTerm },
                          { label: "Landing Page", value: lead.landingPage },
                          { label: "Referrer", value: lead.referrerUrl },
                        ].filter(f => f.value).map(({ label, value }) => (
                          <div key={label}>
                            <div className="text-xs font-semibold mb-0.5" style={{ color: "oklch(0.6 0.03 250)", fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
                            <div className="text-xs break-all" style={{ color: "oklch(0.25 0.05 250)", fontFamily: "'DM Sans', sans-serif" }}>{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* ── STATUS BUTTONS ── */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(["new", "contacted", "instructed", "lost"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus.mutate({ id: lead.id, status: s })}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          background: lead.status === s ? "oklch(0.18 0.06 250)" : "oklch(0.96 0.01 250)",
                          color: lead.status === s ? "white" : "oklch(0.35 0.04 250)",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        Mark as {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* ── CONTACT TRACKING BUTTONS ── */}
                  <div className="flex flex-wrap gap-2 mt-2 pt-2" style={{ borderTop: "1px solid oklch(0.93 0.01 250)" }}>
                    <button
                      onClick={() => markContacted.mutate({ id: lead.id, field: "contactedViaEmail", value: !(lead as any).contactedViaEmail })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background: (lead as any).contactedViaEmail ? "oklch(0.55 0.15 145)" : "oklch(0.96 0.01 250)",
                        color: (lead as any).contactedViaEmail ? "white" : "oklch(0.35 0.04 250)",
                        fontFamily: "'DM Sans', sans-serif",
                        border: (lead as any).contactedViaEmail ? "none" : "1px solid oklch(0.88 0.01 250)",
                      }}
                      title={(lead as any).contactedViaEmail ? "Click to undo" : "Mark as contacted via email"}
                    >
                      ✉ {(lead as any).contactedViaEmail ? "✓ Contacted via Email" : "Mark as Contacted via Email"}
                    </button>
                    <button
                      onClick={() => markContacted.mutate({ id: lead.id, field: "contactedViaPhone", value: !(lead as any).contactedViaPhone })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background: (lead as any).contactedViaPhone ? "oklch(0.55 0.15 145)" : "oklch(0.96 0.01 250)",
                        color: (lead as any).contactedViaPhone ? "white" : "oklch(0.35 0.04 250)",
                        fontFamily: "'DM Sans', sans-serif",
                        border: (lead as any).contactedViaPhone ? "none" : "1px solid oklch(0.88 0.01 250)",
                      }}
                      title={(lead as any).contactedViaPhone ? "Click to undo" : "Mark as contacted via phone"}
                    >
                      📞 {(lead as any).contactedViaPhone ? "✓ Contacted via Phone" : "Mark as Contacted via Phone"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(1)}
                disabled={safePage === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
                style={{ background: "oklch(0.93 0.01 250)", color: "oklch(0.35 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}
              >« First</button>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
                style={{ background: "oklch(0.93 0.01 250)", color: "oklch(0.35 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}
              >‹ Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => Math.abs(p - safePage) <= 2)
                .map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-8 h-8 rounded-lg text-xs font-semibold"
                    style={{
                      background: p === safePage ? "oklch(0.18 0.06 250)" : "oklch(0.93 0.01 250)",
                      color: p === safePage ? "white" : "oklch(0.35 0.04 250)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >{p}</button>
                ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
                style={{ background: "oklch(0.93 0.01 250)", color: "oklch(0.35 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}
              >Next ›</button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={safePage === totalPages}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40"
                style={{ background: "oklch(0.93 0.01 250)", color: "oklch(0.35 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}
              >Last »</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── CALLBACKS TAB ────────────────────────────────────────────────────────────
function CallbacksTab() {
  const { data: callbacks, refetch } = trpc.callbacks.list.useQuery({ limit: 100 });
  const updateStatus = trpc.callbacks.updateStatus.useMutation({ onSuccess: () => refetch() });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
          Callback Queue
        </h2>
        <button onClick={() => refetch()} className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg" style={{ background: "oklch(0.18 0.06 250)", color: "white", fontFamily: "'DM Sans', sans-serif" }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {!callbacks || callbacks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>
          <Phone size={40} className="mx-auto mb-3" style={{ color: "oklch(0.72 0.12 75)" }} />
          <p className="text-lg font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>No callback requests yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {callbacks.map((cb) => (
            <div key={cb.id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "oklch(0.95 0.05 30)", color: "oklch(0.45 0.15 30)" }}>
                  <Phone size={16} />
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>{cb.name}</div>
                  <div className="text-xs" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                    {cb.phone} {cb.preferredTime ? `· Best time: ${cb.preferredTime}` : ""} {cb.email ? `· ${cb.email}` : ""}
                  </div>
                  {cb.message && <div className="text-xs mt-0.5 italic" style={{ color: "oklch(0.6 0.03 250)", fontFamily: "'DM Sans', sans-serif" }}>"{cb.message}"</div>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={cb.status} />
                <select
                  value={cb.status}
                  onChange={(e) => updateStatus.mutate({ id: cb.id, status: e.target.value as any })}
                  className="text-xs px-2 py-1.5 rounded-lg"
                  style={{ border: "1px solid oklch(0.88 0.02 250)", fontFamily: "'DM Sans', sans-serif", color: "oklch(0.25 0.05 250)" }}
                >
                  <option value="pending">Pending</option>
                  <option value="called">Called</option>
                  <option value="no_answer">No Answer</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── INSTRUCTIONS TAB ─────────────────────────────────────────────────────────
function InstructionsTab() {
  const { data: instructions, refetch } = trpc.instruct.list.useQuery({ limit: 100 });
  const updateStatus = trpc.instruct.updateStatus.useMutation({ onSuccess: () => refetch() });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const paymentStatusColor = (s: string) => {
    if (s === 'paid')   return { bg: 'oklch(0.93 0.08 145)', text: 'oklch(0.28 0.14 145)' };
    if (s === 'failed') return { bg: 'oklch(0.93 0.06 25)',  text: 'oklch(0.38 0.18 25)'  };
    return                     { bg: 'oklch(0.95 0.06 75)',  text: 'oklch(0.40 0.15 75)'  };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
          Instructions
        </h2>
        <button onClick={() => refetch()} className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg" style={{ background: "oklch(0.18 0.06 250)", color: "white", fontFamily: "'DM Sans', sans-serif" }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {!instructions || instructions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>
          <FileCheck size={40} className="mx-auto mb-3" style={{ color: "oklch(0.72 0.12 75)" }} />
          <p className="text-lg font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>No instructions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {instructions.map((inst) => {
            const isExpanded = expandedId === inst.id;
            const pColor = paymentStatusColor(inst.paymentStatus);
            return (
              <div key={inst.id} className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>

                {/* ── Summary row (always visible, click to expand) ── */}
                <div
                  className="p-5 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : inst.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.95 0.08 75)", color: "oklch(0.35 0.15 75)" }}>
                      <FileCheck size={16} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>
                        {inst.firstName} {inst.lastName} → {inst.firmName}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                        {inst.email} · {inst.phone} · {new Date(inst.createdAt).toLocaleDateString("en-GB")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: pColor.bg, color: pColor.text, fontFamily: "'DM Sans', sans-serif" }}>
                      {inst.paymentStatus === 'paid' ? '✓ Paid' : inst.paymentStatus === 'failed' ? '✗ Failed' : '⏳ Pending payment'}
                    </span>
                    {inst.paymentAmount && (
                      <span className="text-xs font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'JetBrains Mono', monospace" }}>
                        £{Number(inst.paymentAmount).toFixed(2)}
                      </span>
                    )}
                    <StatusBadge status={inst.status} />
                    <ChevronDown size={16} style={{ color: "oklch(0.55 0.04 250)", transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>
                </div>

                {/* ── Expanded detail panel ── */}
                {isExpanded && (
                  <div className="px-5 pb-6" style={{ borderTop: "1px solid oklch(0.93 0.01 250)" }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">

                      {/* Left: personal details */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Personal Details</h4>
                        <div className="space-y-2.5">
                          {([
                            { label: 'Full Name',           value: `${inst.firstName} ${inst.lastName}` },
                            { label: 'Email',               value: inst.email },
                            { label: 'Phone',               value: inst.phone },
                            { label: 'Date of Birth',       value: inst.dateOfBirth || '—' },
                            { label: 'No. of Applicants',   value: inst.applicantCount ? String(inst.applicantCount) : '1' },
                          ] as { label: string; value: string }[]).map(({ label, value }) => (
                            <div key={label} className="flex gap-3">
                              <span className="text-xs flex-shrink-0 w-36" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                              <span className="text-xs font-semibold break-all" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>{value}</span>
                            </div>
                          ))}
                        </div>

                        {inst.currentAddress && (
                          <div>
                            <div className="text-xs mb-1.5" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Current Residential Address</div>
                            <div className="text-xs font-semibold p-3 rounded-xl" style={{ background: "oklch(0.975 0.008 80)", border: "1px solid oklch(0.90 0.01 80)", color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif", whiteSpace: 'pre-wrap' }}>{inst.currentAddress}</div>
                          </div>
                        )}

                        {inst.propertyAddress && (
                          <div>
                            <div className="text-xs mb-1.5" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Property Address</div>
                            <div className="text-xs font-semibold p-3 rounded-xl" style={{ background: "oklch(0.975 0.008 80)", border: "1px solid oklch(0.90 0.01 80)", color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif", whiteSpace: 'pre-wrap' }}>{inst.propertyAddress}</div>
                          </div>
                        )}
                      </div>

                      {/* Right: instruction & payment details */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Instruction & Payment</h4>
                        <div className="space-y-2.5">
                          {([
                            { label: 'Firm',            value: inst.firmName },
                            { label: 'Submitted',       value: new Date(inst.createdAt).toLocaleString('en-GB') },
                            { label: 'Payment Amount',  value: inst.paymentAmount ? `£${Number(inst.paymentAmount).toFixed(2)}` : '—' },
                            { label: 'Payment Status',  value: inst.paymentStatus.charAt(0).toUpperCase() + inst.paymentStatus.slice(1) },
                            { label: 'Stripe ID',       value: inst.stripePaymentIntentId || '—' },
                          ] as { label: string; value: string }[]).map(({ label, value }) => (
                            <div key={label} className="flex gap-3">
                              <span className="text-xs flex-shrink-0 w-36" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                              <span className="text-xs font-semibold break-all" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>{value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Status update dropdown */}
                        <div className="pt-2">
                          <div className="text-xs mb-1.5" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Update Status</div>
                          <select
                            value={inst.status}
                            onChange={(e) => updateStatus.mutate({ id: inst.id, status: e.target.value as any })}
                            className="text-xs px-3 py-2 rounded-xl w-full"
                            style={{ border: "1px solid oklch(0.88 0.02 250)", fontFamily: "'DM Sans', sans-serif", color: "oklch(0.25 0.05 250)" }}
                          >
                            <option value="submitted">Submitted</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── FIRMS TAB ────────────────────────────────────────────────────────────────
function FirmsTab({ onGoToFees }: { onGoToFees: (id: number) => void }) {
  const { data: firms, refetch } = trpc.firms.listAdmin.useQuery();
  const deleteFirm = trpc.firms.delete.useMutation({ onSuccess: () => refetch() });
  const updateFirm = trpc.firms.update.useMutation({ onSuccess: () => refetch() });
  const createFirm = trpc.firms.create.useMutation({
    onSuccess: () => {
      refetch();
      setShowAdd(false);
      setNewFirm({ name: "", location: "", phone: "", email: "", regulatoryBody: "SRA", sraNumber: "", rating: "4.50", reviewCount: 0 });
      toast.success("Firm added");
    },
    onError: (e) => toast.error(e.message),
  });
  const [showAdd, setShowAdd] = useState(false);
  const [newFirm, setNewFirm] = useState({ name: "", location: "", phone: "", email: "", regulatoryBody: "SRA" as "SRA" | "CLC", sraNumber: "", rating: "4.50", reviewCount: 0 });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
          Law Firms
        </h2>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg" style={{ background: "oklch(0.72 0.12 75)", color: "oklch(0.12 0.05 250)", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
          + Add Firm
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm" style={{ border: "1px solid oklch(0.88 0.02 250)" }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>Add New Firm</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "name", label: "Firm Name *", placeholder: "e.g. Smith & Co Solicitors" },
              { key: "location", label: "Location", placeholder: "e.g. London, EC1A 1BB" },
              { key: "phone", label: "Phone", placeholder: "e.g. 020 7946 0000" },
              { key: "email", label: "Email", placeholder: "e.g. info@smithco.co.uk" },
              { key: "sraNumber", label: "SRA/CLC Number", placeholder: "e.g. 123456" },
              { key: "rating", label: "Rating (0-5)", placeholder: "e.g. 4.75" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{label}</label>
                <input
                  value={(newFirm as any)[key]}
                  onChange={(e) => setNewFirm(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ border: "1px solid oklch(0.88 0.02 250)", fontFamily: "'DM Sans', sans-serif", color: "oklch(0.18 0.06 250)" }}
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Regulatory Body</label>
              <select
                value={newFirm.regulatoryBody}
                onChange={(e) => setNewFirm(prev => ({ ...prev, regulatoryBody: e.target.value as "SRA" | "CLC" }))}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{ border: "1px solid oklch(0.88 0.02 250)", fontFamily: "'DM Sans', sans-serif", color: "oklch(0.18 0.06 250)" }}
              >
                <option value="SRA">SRA</option>
                <option value="CLC">CLC</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => createFirm.mutate(newFirm)}
              disabled={!newFirm.name || createFirm.isPending}
              className="px-5 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "oklch(0.18 0.06 250)", color: "white", fontFamily: "'DM Sans', sans-serif" }}
            >
              {createFirm.isPending ? "Adding..." : "Add Firm"}
            </button>
            <button onClick={() => setShowAdd(false)} className="px-5 py-2 rounded-lg text-sm" style={{ background: "oklch(0.96 0.01 250)", color: "oklch(0.35 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {!firms || firms.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>
          <Building2 size={40} className="mx-auto mb-3" style={{ color: "oklch(0.72 0.12 75)" }} />
          <p className="text-lg font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>No firms added yet</p>
          <p className="text-sm mt-1" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Click "Add Firm" to add your first law firm to the panel.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {firms.map((firm) => (
            <div key={firm.id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "oklch(0.18 0.06 250)", color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>
                  {firm.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-sm flex items-center gap-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>
                    {firm.name}
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "oklch(0.95 0.05 230)", color: "oklch(0.25 0.12 230)" }}>{firm.regulatoryBody}</span>
                  </div>
                  <div className="text-xs" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                    {firm.location ?? "Location not set"} · ★ {firm.rating} · {firm.reviewCount} reviews
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateFirm.mutate({ id: firm.id, isActive: !firm.isActive })}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: firm.isActive ? "oklch(0.95 0.05 145)" : "oklch(0.95 0.03 15)", color: firm.isActive ? "oklch(0.25 0.12 145)" : "oklch(0.40 0.12 15)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  {firm.isActive ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={() => onGoToFees(firm.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1"
                  style={{ background: "oklch(0.95 0.08 75)", color: "oklch(0.35 0.15 75)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  <DollarSign size={11} /> Fees
                </button>
                <button
                  onClick={() => { if (confirm(`Remove ${firm.name} from the panel?`)) deleteFirm.mutate({ id: firm.id }); }}
                  className="px-3 py-1.5 rounded-lg text-xs"
                  style={{ background: "oklch(0.95 0.03 15)", color: "oklch(0.40 0.12 15)", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── FEE EDITOR TAB ───────────────────────────────────────────────────────────
function FeesTab({ initialFirmId }: { initialFirmId: number | null }) {
  const utils = trpc.useUtils();
  const { data: firms } = trpc.firms.listAdmin.useQuery();
  const [firmId, setFirmId] = useState<number | null>(initialFirmId);
  const [txType, setTxType] = useState<"purchase" | "sale" | "sale_purchase" | "remortgage">("purchase");
  const [editingId, setEditingId] = useState<number | "new" | null>(null);

  useEffect(() => { if (initialFirmId) setFirmId(initialFirmId); }, [initialFirmId]);

  const { data: bands, isLoading } = trpc.investor.feeStructures.useQuery(
    { firmId: firmId! },
    { enabled: !!firmId }
  );

  const upsert = trpc.investor.upsertFeeStructure.useMutation({
    onSuccess: () => { utils.investor.feeStructures.invalidate(); setEditingId(null); toast.success("Fee band saved"); },
    onError: (e) => toast.error(e.message),
  });
  const deleteBand = trpc.investor.deleteFeeStructure.useMutation({
    onSuccess: () => { utils.investor.feeStructures.invalidate(); toast.success("Fee band deleted"); },
    onError: (e) => toast.error(e.message),
  });

  const emptyForm = { firmId: firmId ?? 0, transactionType: txType, minValue: 0, maxValue: 500000, legalFee: "", saleLegalFee: "", searchFee: "", landRegistryFee: "", electronicTransferFee: "", bankTransferFee: "", antiMoneyLaunderingFee: "", platformCommission: "", isActive: true };
  const [form, setForm] = useState<any>(emptyForm);

  const filteredBands = bands?.filter((b: any) => b.transactionType === txType) ?? [];

  // For sale_purchase: split fields into purchase leg and sale leg sections
  const isSalePurchase = txType === 'sale_purchase';

  // Purchase leg fields (used for all transaction types)
  const purchaseFeeFields = [
    { key: "legalFee", label: isSalePurchase ? "Purchase Legal Fee *" : "Legal Fee *" },
    { key: "fileOpeningFee", label: "File Opening Fee" },
    { key: "searchFee", label: "Search Pack Fee" },
    { key: "landRegistryFee", label: "Land Registry Fee" },
    { key: "electronicTransferFee", label: "Electronic Transfer" },
    { key: "bankTransferFee", label: "Bank Transfer Fee" },
    { key: "antiMoneyLaunderingFee", label: "AML Fee (per person)" },
    { key: "platformCommission", label: "Platform Commission" },
  ];

  // Sale leg fields (only shown for sale_purchase)
  const saleFeeFields = [
    { key: "saleLegalFee", label: "Sale Legal Fee *" },
  ];

  // For non-sale_purchase, use the same fields as before
  const feeFields = purchaseFeeFields;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
        Fee Editor
      </h2>

      <PlatformSettingsSection />

      <div className="flex gap-4 mb-6 flex-wrap">
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Select Firm</label>
          <select
            value={firmId ?? ""}
            onChange={(e) => { setFirmId(Number(e.target.value)); setEditingId(null); }}
            className="px-3 py-2 rounded-lg text-sm min-w-52"
            style={{ border: "1px solid oklch(0.88 0.02 250)", fontFamily: "'DM Sans', sans-serif", color: "oklch(0.18 0.06 250)" }}
          >
            <option value="">— Choose a firm —</option>
            {firms?.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Transaction Type</label>
          <select
            value={txType}
            onChange={(e) => { setTxType(e.target.value as any); setEditingId(null); }}
            className="px-3 py-2 rounded-lg text-sm"
            style={{ border: "1px solid oklch(0.88 0.02 250)", fontFamily: "'DM Sans', sans-serif", color: "oklch(0.18 0.06 250)" }}
          >
            <option value="purchase">Purchase</option>
            <option value="sale">Sale</option>
            <option value="sale_purchase">Sale & Purchase</option>
            <option value="remortgage">Remortgage</option>
          </select>
        </div>
      </div>

      {!firmId ? (
        <div className="text-center py-16 bg-white rounded-2xl" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>
          <DollarSign size={40} className="mx-auto mb-3" style={{ color: "oklch(0.72 0.12 75)" }} />
          <p className="text-lg font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>Select a firm to manage fees</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin" style={{ color: "oklch(0.72 0.12 75)" }} /></div>
      ) : (
        <div className="space-y-3">
          {filteredBands.map((band: any) => (
            <div key={band.id} className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>
              {editingId === band.id ? (
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs mb-1 block" style={{ color: "oklch(0.45 0.04 250)" }}>Min Value (£)</Label>
                      <Input type="number" value={form.minValue} onChange={(e) => setForm((p: any) => ({ ...p, minValue: Number(e.target.value) }))} style={{ fontFamily: "'DM Sans', sans-serif" }} />
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block" style={{ color: "oklch(0.45 0.04 250)" }}>Max Value (£)</Label>
                      <Input type="number" value={form.maxValue} onChange={(e) => setForm((p: any) => ({ ...p, maxValue: Number(e.target.value) }))} style={{ fontFamily: "'DM Sans', sans-serif" }} />
                    </div>
                  </div>
                  {isSalePurchase ? (
                    <div className="space-y-3">
                      <div className="rounded-lg p-3" style={{ background: "oklch(0.97 0.01 250)", border: "1px solid oklch(0.88 0.02 250)" }}>
                        <div className="text-xs font-bold mb-2" style={{ color: "oklch(0.25 0.10 230)", fontFamily: "'DM Sans', sans-serif" }}>Purchase Leg Fees</div>
                        <div className="grid grid-cols-2 gap-3">
                          {purchaseFeeFields.map(({ key, label }) => (
                            <div key={key}>
                              <Label className="text-xs mb-1 block" style={{ color: "oklch(0.45 0.04 250)" }}>{label}</Label>
                              <Input value={form[key] ?? ""} onChange={(e) => setForm((p: any) => ({ ...p, [key]: e.target.value }))} placeholder="e.g. 850" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-lg p-3" style={{ background: "oklch(0.97 0.03 75)", border: "1px solid oklch(0.88 0.05 75)" }}>
                        <div className="text-xs font-bold mb-2" style={{ color: "oklch(0.35 0.15 75)", fontFamily: "'DM Sans', sans-serif" }}>Sale Leg Fees</div>
                        <div className="grid grid-cols-2 gap-3">
                          {saleFeeFields.map(({ key, label }) => (
                            <div key={key}>
                              <Label className="text-xs mb-1 block" style={{ color: "oklch(0.45 0.04 250)" }}>{label}</Label>
                              <Input value={form[key] ?? ""} onChange={(e) => setForm((p: any) => ({ ...p, [key]: e.target.value }))} placeholder="e.g. 650" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                            </div>
                          ))}
                          <div className="col-span-2 text-xs" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                            Note: AML, File Opening, Search Pack, and other shared fees above also apply to the sale leg.
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {feeFields.map(({ key, label }) => (
                        <div key={key}>
                          <Label className="text-xs mb-1 block" style={{ color: "oklch(0.45 0.04 250)" }}>{label}</Label>
                          <Input value={form[key] ?? ""} onChange={(e) => setForm((p: any) => ({ ...p, [key]: e.target.value }))} placeholder="e.g. 850" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => upsert.mutate({ ...form, firmId: firmId! })} disabled={upsert.isPending} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: "oklch(0.18 0.06 250)", color: "white", fontFamily: "'DM Sans', sans-serif" }}>
                      <Save size={13} /> Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded-lg text-sm" style={{ background: "oklch(0.96 0.01 250)", color: "oklch(0.35 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>
                      £{Number(band.minValue).toLocaleString()} – £{Number(band.maxValue).toLocaleString()}
                    </div>
                    <div className="text-xs mt-1 flex gap-4 flex-wrap" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                      {isSalePurchase ? (
                        <>
                          <span>Purchase Legal: <strong style={{ color: "oklch(0.18 0.06 250)" }}>£{band.legalFee}</strong></span>
                          <span>Sale Legal: <strong style={{ color: "oklch(0.35 0.15 75)" }}>£{band.saleLegalFee || '—'}</strong></span>
                        </>
                      ) : (
                        <span>Legal: <strong style={{ color: "oklch(0.18 0.06 250)" }}>£{band.legalFee}</strong></span>
                      )}
                      {band.searchFee && <span>Search Pack: £{band.searchFee}</span>}
                      {band.antiMoneyLaunderingFee && <span>AML: £{band.antiMoneyLaunderingFee}</span>}
                      {band.platformCommission && <span>Commission: £{band.platformCommission}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setForm({ ...band }); setEditingId(band.id); }} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.95 0.05 230)", color: "oklch(0.25 0.12 230)" }}>
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => { if (confirm("Delete this fee band?")) deleteBand.mutate({ id: band.id }); }} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.95 0.03 15)", color: "oklch(0.40 0.12 15)" }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {editingId === "new" && (
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4" style={{ border: "1px solid oklch(0.72 0.12 75 / 0.3)" }}>
              <h4 className="font-semibold text-sm" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>New Fee Band</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs mb-1 block" style={{ color: "oklch(0.45 0.04 250)" }}>Min Value (£)</Label>
                  <Input type="number" value={form.minValue} onChange={(e) => setForm((p: any) => ({ ...p, minValue: Number(e.target.value) }))} style={{ fontFamily: "'DM Sans', sans-serif" }} />
                </div>
                <div>
                  <Label className="text-xs mb-1 block" style={{ color: "oklch(0.45 0.04 250)" }}>Max Value (£)</Label>
                  <Input type="number" value={form.maxValue} onChange={(e) => setForm((p: any) => ({ ...p, maxValue: Number(e.target.value) }))} style={{ fontFamily: "'DM Sans', sans-serif" }} />
                </div>
              </div>
              {isSalePurchase ? (
                <div className="space-y-3">
                  <div className="rounded-lg p-3" style={{ background: "oklch(0.97 0.01 250)", border: "1px solid oklch(0.88 0.02 250)" }}>
                    <div className="text-xs font-bold mb-2" style={{ color: "oklch(0.25 0.10 230)", fontFamily: "'DM Sans', sans-serif" }}>Purchase Leg Fees</div>
                    <div className="grid grid-cols-2 gap-3">
                      {purchaseFeeFields.map(({ key, label }) => (
                        <div key={key}>
                          <Label className="text-xs mb-1 block" style={{ color: "oklch(0.45 0.04 250)" }}>{label}</Label>
                          <Input value={form[key] ?? ""} onChange={(e) => setForm((p: any) => ({ ...p, [key]: e.target.value }))} placeholder="e.g. 850" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: "oklch(0.97 0.03 75)", border: "1px solid oklch(0.88 0.05 75)" }}>
                    <div className="text-xs font-bold mb-2" style={{ color: "oklch(0.35 0.15 75)", fontFamily: "'DM Sans', sans-serif" }}>Sale Leg Fees</div>
                    <div className="grid grid-cols-2 gap-3">
                      {saleFeeFields.map(({ key, label }) => (
                        <div key={key}>
                          <Label className="text-xs mb-1 block" style={{ color: "oklch(0.45 0.04 250)" }}>{label}</Label>
                          <Input value={form[key] ?? ""} onChange={(e) => setForm((p: any) => ({ ...p, [key]: e.target.value }))} placeholder="e.g. 650" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                        </div>
                      ))}
                      <div className="col-span-2 text-xs" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                        Note: AML, File Opening, Search Pack, and other shared fees above also apply to the sale leg.
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {feeFields.map(({ key, label }) => (
                    <div key={key}>
                      <Label className="text-xs mb-1 block" style={{ color: "oklch(0.45 0.04 250)" }}>{label}</Label>
                      <Input value={form[key] ?? ""} onChange={(e) => setForm((p: any) => ({ ...p, [key]: e.target.value }))} placeholder="e.g. 850" style={{ fontFamily: "'DM Sans', sans-serif" }} />
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => upsert.mutate({ ...form, firmId: firmId!, transactionType: txType })} disabled={upsert.isPending} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: "oklch(0.18 0.06 250)", color: "white", fontFamily: "'DM Sans', sans-serif" }}>
                  <Save size={13} /> Save Band
                </button>
                <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded-lg text-sm" style={{ background: "oklch(0.96 0.01 250)", color: "oklch(0.35 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
              </div>
            </div>
          )}

          {editingId !== "new" && (
            <button
              onClick={() => { setForm({ ...emptyForm, firmId: firmId!, transactionType: txType }); setEditingId("new"); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "oklch(0.95 0.08 75)", color: "oklch(0.35 0.15 75)", fontFamily: "'DM Sans', sans-serif" }}
            >
              <Plus size={14} /> Add Fee Band
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PLATFORM SETTINGS SECTION ──────────────────────────────────────────────────────────────────────────────────
function PlatformSettingsSection() {
  const utils = trpc.useUtils();
  const { data: settings, isLoading } = trpc.platform.getSettings.useQuery();
  const [remortgageFee, setRemortgageFee] = useState<string>("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (settings && !editing) setRemortgageFee(String(settings.remortgageLegalFee));
  }, [settings, editing]);

  const updateSettings = trpc.platform.updateSettings.useMutation({
    onSuccess: () => {
      utils.platform.getSettings.invalidate();
      setEditing(false);
      toast.success("Platform fee settings saved");
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSave = () => {
    const val = parseFloat(remortgageFee);
    if (isNaN(val) || val < 0) { toast.error("Please enter a valid fee"); return; }
    updateSettings.mutate({ remortgageLegalFee: val });
  };

  return (
    <div className="rounded-xl border p-5 mb-6" style={{ background: "oklch(0.98 0.005 250)", borderColor: "oklch(0.88 0.03 250)" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-sm" style={{ color: "oklch(0.25 0.05 250)", fontFamily: "'DM Sans', sans-serif" }}>Platform Fee Constants</h3>
          <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.03 250)" }}>Fixed fees applied platform-wide across all firms</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "oklch(0.95 0.08 75)", color: "oklch(0.35 0.15 75)" }}>
            <Pencil size={12} /> Edit
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-xs" style={{ color: "oklch(0.55 0.03 250)" }}>Loading…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Remortgage Legal Fee — editable */}
          <div className="rounded-lg p-3" style={{ background: "white", border: "1px solid oklch(0.88 0.03 250)" }}>
            <div className="text-xs font-medium mb-1" style={{ color: "oklch(0.45 0.05 250)" }}>Remortgage Legal Fee (ex. VAT)</div>
            {editing ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold" style={{ color: "oklch(0.35 0.05 250)" }}>£</span>
                <input
                  type="number"
                  value={remortgageFee}
                  onChange={(e) => setRemortgageFee(e.target.value)}
                  className="w-24 px-2 py-1 rounded border text-sm"
                  style={{ borderColor: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>
            ) : (
              <div className="text-lg font-bold" style={{ color: "oklch(0.35 0.05 250)", fontFamily: "'DM Sans', sans-serif" }}>
                £{settings?.remortgageLegalFee ?? 150}
                <span className="text-xs font-normal ml-1" style={{ color: "oklch(0.55 0.03 250)" }}>+ VAT</span>
              </div>
            )}
          </div>
          {/* Search Pack — read-only */}
          <div className="rounded-lg p-3" style={{ background: "white", border: "1px solid oklch(0.88 0.03 250)" }}>
            <div className="text-xs font-medium mb-1" style={{ color: "oklch(0.45 0.05 250)" }}>Search Pack (fixed)</div>
            <div className="text-lg font-bold" style={{ color: "oklch(0.35 0.05 250)", fontFamily: "'DM Sans', sans-serif" }}>
              £349 <span className="text-xs font-normal" style={{ color: "oklch(0.55 0.03 250)" }}>inc. VAT</span>
            </div>
          </div>
          {/* AML — read-only */}
          <div className="rounded-lg p-3" style={{ background: "white", border: "1px solid oklch(0.88 0.03 250)" }}>
            <div className="text-xs font-medium mb-1" style={{ color: "oklch(0.45 0.05 250)" }}>AML Check (per person)</div>
            <div className="text-lg font-bold" style={{ color: "oklch(0.35 0.05 250)", fontFamily: "'DM Sans', sans-serif" }}>
              £49 <span className="text-xs font-normal" style={{ color: "oklch(0.55 0.03 250)" }}>inc. VAT</span>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="flex gap-2 mt-4">
          <button onClick={handleSave} disabled={updateSettings.isPending} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: "oklch(0.72 0.12 75)", color: "white" }}>
            {updateSettings.isPending ? "Saving…" : "Save Changes"}
          </button>
          <button onClick={() => { setEditing(false); setRemortgageFee(String(settings?.remortgageLegalFee ?? 150)); }} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: "oklch(0.93 0.01 250)", color: "oklch(0.35 0.05 250)" }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

// ─── NOTES TAB ──────────────────────────────────────────────────────────────────────────────────
function NotesTab() {
  const utils = trpc.useUtils();
  const { data: firms } = trpc.firms.listAdmin.useQuery();
  const [firmId, setFirmId] = useState<number | null>(null);
  const [newNote, setNewNote] = useState("");

  const { data: notes, isLoading } = trpc.investor.notes.useQuery(
    { firmId: firmId! },
    { enabled: !!firmId }
  );
  const addNote = trpc.investor.addNote.useMutation({
    onSuccess: () => { utils.investor.notes.invalidate(); setNewNote(""); toast.success("Note added"); },
    onError: (e) => toast.error(e.message),
  });
  const deleteNote = trpc.investor.deleteNote.useMutation({
    onSuccess: () => { utils.investor.notes.invalidate(); toast.success("Note deleted"); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
        Firm Notes
      </h2>
      <div className="mb-5">
        <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Select Firm</label>
        <select
          value={firmId ?? ""}
          onChange={(e) => setFirmId(Number(e.target.value))}
          className="px-3 py-2 rounded-lg text-sm min-w-52"
          style={{ border: "1px solid oklch(0.88 0.02 250)", fontFamily: "'DM Sans', sans-serif", color: "oklch(0.18 0.06 250)" }}
        >
          <option value="">— Choose a firm —</option>
          {firms?.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </div>

      {firmId && (
        <>
          <div className="flex gap-2 mb-5">
            <input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note about this firm…"
              onKeyDown={(e) => { if (e.key === "Enter" && newNote.trim()) addNote.mutate({ firmId, content: newNote.trim() }); }}
              className="flex-1 px-3 py-2 rounded-lg text-sm"
              style={{ border: "1px solid oklch(0.88 0.02 250)", fontFamily: "'DM Sans', sans-serif", color: "oklch(0.18 0.06 250)" }}
            />
            <button
              onClick={() => { if (newNote.trim()) addNote.mutate({ firmId, content: newNote.trim() }); }}
              disabled={!newNote.trim() || addNote.isPending}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "oklch(0.72 0.12 75)", color: "oklch(0.12 0.05 250)", fontFamily: "'DM Sans', sans-serif" }}
            >
              <Plus size={14} />
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-6"><Loader2 className="animate-spin" style={{ color: "oklch(0.72 0.12 75)" }} /></div>
          ) : !notes || notes.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>
              <StickyNote size={32} className="mx-auto mb-2" style={{ color: "oklch(0.72 0.12 75)" }} />
              <p className="text-sm" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>No notes for this firm yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note: any) => (
                <div key={note.id} className="bg-white rounded-2xl p-5 shadow-sm flex items-start justify-between gap-3" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>
                  <div>
                    <p className="text-sm" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>{note.content}</p>
                    <p className="text-xs mt-1" style={{ color: "oklch(0.6 0.03 250)", fontFamily: "'DM Sans', sans-serif" }}>
                      {note.authorName} · {new Date(note.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <button
                    onClick={() => { if (confirm("Delete this note?")) deleteNote.mutate({ id: note.id }); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.95 0.03 15)", color: "oklch(0.40 0.12 15)" }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── MAIN ADMIN PAGE ──────────────────────────────────────────────────────────
export default function Admin() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [feesFirmId, setFeesFirmId] = useState<number | null>(null);

  // Standalone admin session check
  const { data: authCheck, isLoading: authLoading } = trpc.adminAuth.check.useQuery();
  const logoutMutation = trpc.adminAuth.logout.useMutation({
    onSuccess: () => navigate("/admin/login"),
  });

  const { data: pendingCallbacks } = trpc.callbacks.pendingCount.useQuery(
    undefined,
    { enabled: authCheck?.authenticated === true }
  );

  useEffect(() => {
    // Only redirect once the check query has fully resolved (not while loading)
    if (!authLoading && authCheck !== undefined && !authCheck?.authenticated) {
      window.location.href = "/admin/login";
    }
  }, [authLoading, authCheck]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.975 0.008 80)" }}>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3" style={{ borderColor: "oklch(0.72 0.12 75)", borderTopColor: "transparent" }} />
          <p className="text-sm" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!authCheck?.authenticated) return null;

  const navItems: { id: AdminTab; label: string; icon: any; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "leads", label: "Leads", icon: Users },
    { id: "callbacks", label: "Callbacks", icon: Phone, badge: pendingCallbacks ?? 0 },
    { id: "instructions", label: "Instructions", icon: FileCheck },
    { id: "firms", label: "Law Firms", icon: Building2 },
    { id: "fees", label: "Fee Editor", icon: DollarSign },
    { id: "notes", label: "Firm Notes", icon: StickyNote },
  ];

  const handleGoToFees = (firmId: number) => {
    setFeesFirmId(firmId);
    setActiveTab("fees");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "oklch(0.975 0.008 80)" }}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col" style={{ background: "oklch(0.12 0.05 250)", minHeight: "100vh" }}>
        <div className="p-6 flex items-center gap-3" style={{ borderBottom: "1px solid oklch(0.72 0.12 75 / 0.15)" }}>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.72 0.12 75)" }}>
            <Scale size={18} style={{ color: "oklch(0.12 0.05 250)" }} />
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>Admin Panel</div>
            <div className="text-xs" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>Compare the Conveyancing Market</div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: activeTab === id ? "oklch(0.72 0.12 75 / 0.15)" : "transparent",
                color: activeTab === id ? "oklch(0.82 0.10 75)" : "oklch(0.975 0.008 80 / 0.6)",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} />
                {label}
              </div>
              {badge != null && badge > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "oklch(0.55 0.18 30)", color: "white" }}>{badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4" style={{ borderTop: "1px solid oklch(0.72 0.12 75 / 0.15)" }}>
          <button
            onClick={() => logoutMutation.mutate()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{ color: "oklch(0.975 0.008 80 / 0.4)", fontFamily: "'DM Sans', sans-serif", background: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "oklch(0.65 0.15 25)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "oklch(0.975 0.008 80 / 0.4)")}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "leads" && <LeadsTab />}
        {activeTab === "callbacks" && <CallbacksTab />}
        {activeTab === "instructions" && <InstructionsTab />}
        {activeTab === "firms" && <FirmsTab onGoToFees={handleGoToFees} />}
        {activeTab === "fees" && <FeesTab initialFirmId={feesFirmId} />}
        {activeTab === "notes" && <NotesTab />}
      </main>
    </div>
  );
}
