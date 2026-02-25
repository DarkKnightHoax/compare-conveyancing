import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  LayoutDashboard, Users, Phone, Building2, FileCheck,
  LogOut, Scale, ChevronDown, CheckCircle, XCircle,
  Clock, AlertCircle, TrendingUp, RefreshCw, Eye, Edit2
} from "lucide-react";

type AdminTab = "dashboard" | "leads" | "callbacks" | "instructions" | "firms";

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
function LeadsTab() {
  const { data: leads, refetch } = trpc.leads.list.useQuery({ limit: 100 });
  const updateStatus = trpc.leads.updateStatus.useMutation({ onSuccess: () => refetch() });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const txLabel: Record<string, string> = {
    purchase: "Purchase", sale: "Sale", sale_purchase: "Sale & Purchase", remortgage: "Remortgage"
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
          All Leads
        </h2>
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
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>
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
                  <ChevronDown size={16} style={{ color: "oklch(0.6 0.03 250)", transform: expandedId === lead.id ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </div>
              </div>

              {expandedId === lead.id && (
                <div className="px-5 pb-5 pt-0" style={{ borderTop: "1px solid oklch(0.95 0.01 250)" }}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 mb-4">
                    {[
                      { label: "Phone", value: lead.phone },
                      { label: "Postcode", value: lead.postcode },
                      { label: "Tenure", value: lead.propertyTenure ?? "—" },
                      { label: "Timeline", value: lead.movingTimeline ?? "—" },
                      { label: "First Time Buyer", value: lead.isFirstTimeBuyer ? "Yes" : "No" },
                      { label: "Mortgage", value: lead.hasMortgage ? lead.mortgageLender ?? "Yes" : "No" },
                      { label: "New Build", value: lead.isNewBuild ? "Yes" : "No" },
                      { label: "Shared Ownership", value: lead.isSharedOwnership ? "Yes" : "No" },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div className="text-xs font-semibold mb-0.5" style={{ color: "oklch(0.6 0.03 250)", fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
                        <div className="text-sm" style={{ color: "oklch(0.25 0.05 250)", fontFamily: "'DM Sans', sans-serif" }}>{value}</div>
                      </div>
                    ))}
                  </div>
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
                </div>
              )}
            </div>
          ))}
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
          Instruction Requests
        </h2>
        <button onClick={() => refetch()} className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg" style={{ background: "oklch(0.18 0.06 250)", color: "white", fontFamily: "'DM Sans', sans-serif" }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {!instructions || instructions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>
          <FileCheck size={40} className="mx-auto mb-3" style={{ color: "oklch(0.72 0.12 75)" }} />
          <p className="text-lg font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>No instruction requests yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {instructions.map((inst) => (
            <div key={inst.id} className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "oklch(0.95 0.08 75)", color: "oklch(0.45 0.15 75)" }}>
                  <FileCheck size={16} />
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>
                    {inst.firstName} {inst.lastName} → {inst.firmName}
                  </div>
                  <div className="text-xs" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                    {inst.email} · {inst.phone} {inst.paymentAmount ? `· Payment: £${inst.paymentAmount}` : ""}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "oklch(0.6 0.03 250)", fontFamily: "'DM Sans', sans-serif" }}>
                    {new Date(inst.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={inst.status} />
                <select
                  value={inst.status}
                  onChange={(e) => updateStatus.mutate({ id: inst.id, status: e.target.value as any })}
                  className="text-xs px-2 py-1.5 rounded-lg"
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
          ))}
        </div>
      )}
    </div>
  );
}

// ─── FIRMS TAB ────────────────────────────────────────────────────────────────
function FirmsTab() {
  const { data: firms, refetch } = trpc.firms.listAdmin.useQuery();
  const deleteFirm = trpc.firms.delete.useMutation({ onSuccess: () => refetch() });
  const updateFirm = trpc.firms.update.useMutation({ onSuccess: () => refetch() });
  const createFirm = trpc.firms.create.useMutation({ onSuccess: () => { refetch(); setShowAdd(false); setNewFirm({ name: "", location: "", phone: "", email: "", regulatoryBody: "SRA", sraNumber: "", rating: "4.50", reviewCount: 0 }); } });
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

// ─── MAIN ADMIN PAGE ──────────────────────────────────────────────────────────
export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const { data: pendingCallbacks } = trpc.callbacks.pendingCount.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.975 0.008 80)" }}>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3" style={{ borderColor: "oklch(0.72 0.12 75)", borderTopColor: "transparent" }} />
          <p className="text-sm" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.975 0.008 80)" }}>
        <div className="text-center bg-white rounded-2xl p-10 shadow-sm" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>
          <Scale size={40} className="mx-auto mb-4" style={{ color: "oklch(0.72 0.12 75)" }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>Admin Access Required</h2>
          <p className="text-sm mb-6" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Please sign in to access the admin panel.</p>
          <a href={getLoginUrl()} className="inline-block px-6 py-3 rounded-xl text-sm font-semibold" style={{ background: "oklch(0.18 0.06 250)", color: "white", fontFamily: "'DM Sans', sans-serif" }}>
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.975 0.008 80)" }}>
        <div className="text-center bg-white rounded-2xl p-10 shadow-sm" style={{ border: "1px solid oklch(0.92 0.01 250)" }}>
          <XCircle size={40} className="mx-auto mb-4" style={{ color: "oklch(0.55 0.18 15)" }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>Access Denied</h2>
          <p className="text-sm" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>You do not have admin privileges.</p>
        </div>
      </div>
    );
  }

  const navItems: { id: AdminTab; label: string; icon: any; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "leads", label: "Leads", icon: Users },
    { id: "callbacks", label: "Callbacks", icon: Phone, badge: pendingCallbacks ?? 0 },
    { id: "instructions", label: "Instructions", icon: FileCheck },
    { id: "firms", label: "Law Firms", icon: Building2 },
  ];

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
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "oklch(0.72 0.12 75 / 0.2)", color: "oklch(0.82 0.10 75)" }}>
              {user.name?.[0] ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: "white", fontFamily: "'DM Sans', sans-serif" }}>{user.name ?? "Admin"}</div>
              <div className="text-xs truncate" style={{ color: "oklch(0.975 0.008 80 / 0.4)", fontFamily: "'DM Sans', sans-serif" }}>{user.email ?? ""}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "leads" && <LeadsTab />}
        {activeTab === "callbacks" && <CallbacksTab />}
        {activeTab === "instructions" && <InstructionsTab />}
        {activeTab === "firms" && <FirmsTab />}
      </main>
    </div>
  );
}
