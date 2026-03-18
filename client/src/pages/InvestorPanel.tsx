/**
 * INVESTOR ADMIN PANEL
 * Route: /investor
 * Access: admin role only (redirects to login if unauthenticated)
 * Design: Dark navy sidebar + parchment content area — British Legal Prestige
 *
 * Tabs:
 *   1. Overview  — revenue stats, firm summary table
 *   2. Firms     — list of all law firms with quick-edit
 *   3. Fee Editor — per-firm, per-transaction-type fee bands
 *   4. Notes     — investor notes per firm
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  BarChart3, Building2, DollarSign, FileText, LogOut,
  Plus, Trash2, Edit3, Save, X, ChevronDown, ChevronRight,
  Scale, AlertCircle, CheckCircle, StickyNote, Settings,
} from "lucide-react";
import { toast } from "sonner";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Tab = "overview" | "firms" | "fees" | "notes";
type TransactionType = "purchase" | "sale" | "sale_purchase" | "remortgage";

const TX_LABELS: Record<TransactionType, string> = {
  purchase: "Purchase",
  sale: "Sale",
  sale_purchase: "Sale & Purchase",
  remortgage: "Remortgage",
};

const FEE_FIELDS: { key: string; label: string; placeholder: string }[] = [
  { key: "legalFee", label: "Legal Fee (excl. VAT)", placeholder: "e.g. 850" },
  { key: "searchFee", label: "Search Fee", placeholder: "e.g. 250" },
  { key: "landRegistryFee", label: "Land Registry Fee", placeholder: "e.g. 270" },
  { key: "electronicTransferFee", label: "Electronic Transfer Fee", placeholder: "e.g. 30" },
  { key: "bankTransferFee", label: "Bank Transfer Fee", placeholder: "e.g. 0" },
  { key: "antiMoneyLaunderingFee", label: "AML Fee (per person)", placeholder: "e.g. 6" },
  { key: "officialCopiesFee", label: "Official Copies Fee", placeholder: "e.g. 0" },
  { key: "leaseholdSupplement", label: "Leasehold Supplement", placeholder: "e.g. 250" },
  { key: "newBuildSupplement", label: "New Build Supplement", placeholder: "e.g. 300" },
  { key: "sharedOwnershipSupplement", label: "Shared Ownership Supplement", placeholder: "e.g. 200" },
  { key: "giftedDepositSupplement", label: "Gifted Deposit Supplement", placeholder: "e.g. 100" },
  { key: "platformCommission", label: "Platform Commission (£)", placeholder: "e.g. 50" },
];

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const { data: stats } = trpc.investor.stats.useQuery();
  const { data: firms } = trpc.firms.listAdmin.useQuery();

  const statCards = [
    { label: "Total Firms", value: stats?.totalFirms ?? 0, icon: Building2, color: "oklch(0.72 0.12 75)" },
    { label: "Active Firms", value: stats?.activeFirms ?? 0, icon: CheckCircle, color: "oklch(0.55 0.18 145)" },
    { label: "Total Leads", value: stats?.totalLeads ?? 0, icon: BarChart3, color: "oklch(0.55 0.15 250)" },
    { label: "Completed Instructions", value: stats?.totalInstructions ?? 0, icon: DollarSign, color: "oklch(0.72 0.12 75)" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
          Investor Overview
        </h2>
        <p className="text-sm" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
          Platform performance and firm management summary
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-5 shadow-sm" style={{ border: "1px solid oklch(0.90 0.012 80)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={15} style={{ color }} />
              </div>
            </div>
            <div className="text-3xl font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
              {value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Firm summary table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: "1px solid oklch(0.90 0.012 80)" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid oklch(0.92 0.012 80)" }}>
          <h3 className="text-base font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>Law Firm Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "oklch(0.97 0.008 80)" }}>
                {["Firm Name", "Regulator", "SRA/CLC No.", "Rating", "Status"].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-semibold" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(firms ?? []).map((firm, i) => (
                <tr key={firm.id} style={{ borderTop: i > 0 ? "1px solid oklch(0.94 0.008 80)" : undefined }}>
                  <td className="px-5 py-3 font-medium" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>{firm.name}</td>
                  <td className="px-5 py-3" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ background: "oklch(0.18 0.06 250 / 0.08)", color: "oklch(0.18 0.06 250)" }}>
                      {firm.regulatoryBody}
                    </span>
                  </td>
                  <td className="px-5 py-3" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{firm.sraNumber ?? "—"}</td>
                  <td className="px-5 py-3" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{firm.rating ?? "—"} ★</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: firm.isActive ? "oklch(0.55 0.18 145 / 0.12)" : "oklch(0.55 0.15 30 / 0.12)", color: firm.isActive ? "oklch(0.40 0.18 145)" : "oklch(0.45 0.15 30)" }}>
                      {firm.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
              {!firms?.length && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-sm" style={{ color: "oklch(0.65 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>No firms added yet. Add firms in the Firms tab.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── FIRMS TAB ────────────────────────────────────────────────────────────────
function FirmsTab({ onSelectFirm }: { onSelectFirm: (id: number, name: string) => void }) {
  const utils = trpc.useUtils();
  const { data: firms, isLoading } = trpc.firms.listAdmin.useQuery();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", phone: "", email: "", website: "", regulatoryBody: "SRA" as "SRA" | "CLC", sraNumber: "", rating: "4.50", reviewCount: 0, isActive: true });

  const createFirm = trpc.firms.create.useMutation({
    onSuccess: () => { utils.firms.listAdmin.invalidate(); setShowAdd(false); setForm({ name: "", location: "", phone: "", email: "", website: "", regulatoryBody: "SRA", sraNumber: "", rating: "4.50", reviewCount: 0, isActive: true }); toast.success("Firm added"); },
    onError: () => toast.error("Failed to add firm"),
  });
  const toggleFirm = trpc.firms.update.useMutation({ onSuccess: () => utils.firms.listAdmin.invalidate() });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>Law Firms</h2>
          <p className="text-sm" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Manage your panel of regulated conveyancing firms</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold btn-gold">
          <Plus size={15} /> Add Firm
        </button>
      </div>

      {/* Add firm form */}
      {showAdd && (
        <div className="bg-white rounded-xl p-6 shadow-sm" style={{ border: "1px solid oklch(0.72 0.12 75 / 0.3)" }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>New Law Firm</h3>
            <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none" }}><X size={16} style={{ color: "oklch(0.55 0.04 250)" }} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { key: "name", label: "Firm Name *", placeholder: "e.g. Smith & Jones Solicitors" },
              { key: "location", label: "Location", placeholder: "e.g. London" },
              { key: "phone", label: "Phone", placeholder: "e.g. 020 7123 4567" },
              { key: "email", label: "Email", placeholder: "e.g. conveyancing@firm.co.uk" },
              { key: "website", label: "Website", placeholder: "e.g. https://firm.co.uk" },
              { key: "sraNumber", label: "SRA / CLC Number", placeholder: "e.g. 123456" },
              { key: "rating", label: "Rating (0–5)", placeholder: "e.g. 4.80" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{label}</label>
                <input
                  value={(form as any)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{ border: "1px solid oklch(0.88 0.012 80)", fontFamily: "'DM Sans', sans-serif", color: "oklch(0.18 0.06 250)" }}
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Regulator</label>
              <select value={form.regulatoryBody} onChange={e => setForm(f => ({ ...f, regulatoryBody: e.target.value as "SRA" | "CLC" }))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1px solid oklch(0.88 0.012 80)", fontFamily: "'DM Sans', sans-serif", color: "oklch(0.18 0.06 250)" }}>
                <option value="SRA">SRA</option>
                <option value="CLC">CLC</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-5">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ border: "1px solid oklch(0.88 0.012 80)", background: "none", color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
            <button onClick={() => createFirm.mutate(form)} disabled={!form.name || createFirm.isPending} className="btn-gold px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
              <Save size={14} /> {createFirm.isPending ? "Saving…" : "Save Firm"}
            </button>
          </div>
        </div>
      )}

      {/* Firms list */}
      <div className="space-y-3">
        {isLoading && <div className="text-sm text-center py-8" style={{ color: "oklch(0.65 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Loading firms…</div>}
        {(firms ?? []).map(firm => (
          <div key={firm.id} className="bg-white rounded-xl px-5 py-4 shadow-sm flex items-center justify-between gap-4" style={{ border: "1px solid oklch(0.90 0.012 80)" }}>
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.18 0.06 250)" }}>
                <Building2 size={15} style={{ color: "oklch(0.72 0.12 75)" }} />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>{firm.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                  {firm.regulatoryBody} {firm.sraNumber ? `· ${firm.sraNumber}` : ""} {firm.location ? `· ${firm.location}` : ""}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: firm.isActive ? "oklch(0.55 0.18 145 / 0.12)" : "oklch(0.55 0.15 30 / 0.12)", color: firm.isActive ? "oklch(0.40 0.18 145)" : "oklch(0.45 0.15 30)" }}>
                {firm.isActive ? "Active" : "Inactive"}
              </span>
              <button
                onClick={() => toggleFirm.mutate({ id: firm.id, isActive: !firm.isActive })}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                style={{ border: "1px solid oklch(0.88 0.012 80)", background: "none", color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                {firm.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={() => onSelectFirm(firm.id, firm.name)}
                className="btn-gold px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1">
                <Settings size={12} /> Manage Fees
              </button>
            </div>
          </div>
        ))}
        {!isLoading && !firms?.length && (
          <div className="text-center py-12 text-sm" style={{ color: "oklch(0.65 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
            No firms yet. Click "Add Firm" to get started.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FEE BAND ROW ─────────────────────────────────────────────────────────────
function FeeBandRow({ band, firmId, onSaved, onDeleted }: { band: any; firmId: number; onSaved: () => void; onDeleted: () => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const upsert = trpc.investor.upsertFeeStructure.useMutation({
    onSuccess: () => { setEditing(false); onSaved(); toast.success("Fee band saved"); },
    onError: () => toast.error("Failed to save fee band"),
  });
  const deleteBand = trpc.investor.deleteFeeStructure.useMutation({
    onSuccess: () => { onDeleted(); toast.success("Fee band deleted"); },
    onError: () => toast.error("Failed to delete"),
  });

  const startEdit = () => {
    const f: Record<string, string> = {};
    FEE_FIELDS.forEach(({ key }) => { f[key] = band[key] ?? "0"; });
    f.minValue = String(band.minValue);
    f.maxValue = String(band.maxValue);
    setForm(f);
    setEditing(true);
  };

  const save = () => {
    upsert.mutate({
      id: band.id,
      firmId,
      transactionType: band.transactionType,
      minValue: Number(form.minValue),
      maxValue: Number(form.maxValue),
      legalFee: form.legalFee,
      searchFee: form.searchFee,
      landRegistryFee: form.landRegistryFee,
      electronicTransferFee: form.electronicTransferFee,
      bankTransferFee: form.bankTransferFee,
      antiMoneyLaunderingFee: form.antiMoneyLaunderingFee,
      officialCopiesFee: form.officialCopiesFee,
      leaseholdSupplement: form.leaseholdSupplement,
      newBuildSupplement: form.newBuildSupplement,
      sharedOwnershipSupplement: form.sharedOwnershipSupplement,
      giftedDepositSupplement: form.giftedDepositSupplement,
      platformCommission: form.platformCommission,
    });
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid oklch(0.90 0.012 80)" }}>
      {/* Band header */}
      <div className="flex items-center justify-between px-5 py-3" style={{ background: "oklch(0.97 0.008 80)" }}>
        <div className="text-sm font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>
          £{Number(band.minValue).toLocaleString()} – £{Number(band.maxValue).toLocaleString()}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>
            Legal fee: £{Number(band.legalFee).toLocaleString()}
          </span>
          {!editing && (
            <>
              <button onClick={startEdit} className="p-1.5 rounded-lg transition-colors" style={{ background: "none", border: "1px solid oklch(0.88 0.012 80)" }}>
                <Edit3 size={12} style={{ color: "oklch(0.55 0.04 250)" }} />
              </button>
              <button onClick={() => deleteBand.mutate({ id: band.id })} className="p-1.5 rounded-lg transition-colors" style={{ background: "none", border: "1px solid oklch(0.88 0.012 80)" }}>
                <Trash2 size={12} style={{ color: "oklch(0.55 0.15 30)" }} />
              </button>
            </>
          )}
          {editing && (
            <>
              <button onClick={save} disabled={upsert.isPending} className="btn-gold px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                <Save size={11} /> Save
              </button>
              <button onClick={() => setEditing(false)} className="p-1.5 rounded-lg" style={{ background: "none", border: "1px solid oklch(0.88 0.012 80)" }}>
                <X size={12} style={{ color: "oklch(0.55 0.04 250)" }} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="p-5 bg-white">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Min Value (£)</label>
              <input type="number" value={form.minValue} onChange={e => setForm(f => ({ ...f, minValue: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ border: "1px solid oklch(0.88 0.012 80)", fontFamily: "'DM Sans', sans-serif" }} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Max Value (£)</label>
              <input type="number" value={form.maxValue} onChange={e => setForm(f => ({ ...f, maxValue: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ border: "1px solid oklch(0.88 0.012 80)", fontFamily: "'DM Sans', sans-serif" }} />
            </div>
            {FEE_FIELDS.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{label} (£)</label>
                <input type="number" step="0.01" value={form[key] ?? "0"} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ border: "1px solid oklch(0.88 0.012 80)", fontFamily: "'DM Sans', sans-serif" }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Read-only summary */}
      {!editing && (
        <div className="px-5 py-3 bg-white grid grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-1">
          {FEE_FIELDS.filter(f => Number(band[f.key]) > 0).map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between text-xs py-0.5">
              <span style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
              <span className="font-semibold ml-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>£{Number(band[key]).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── FEE EDITOR TAB ───────────────────────────────────────────────────────────
function FeeEditorTab({ selectedFirmId, selectedFirmName }: { selectedFirmId: number | null; selectedFirmName: string }) {
  const utils = trpc.useUtils();
  const { data: firms } = trpc.firms.listAdmin.useQuery();
  const [firmId, setFirmId] = useState<number | null>(selectedFirmId);
  const [firmName, setFirmName] = useState(selectedFirmName);
  const [activeTx, setActiveTx] = useState<TransactionType>("purchase");
  const [showAddBand, setShowAddBand] = useState(false);
  const [newBandForm, setNewBandForm] = useState<Record<string, string>>({
    minValue: "0", maxValue: "500000", legalFee: "850",
    searchFee: "250", landRegistryFee: "270", electronicTransferFee: "30",
    bankTransferFee: "0", antiMoneyLaunderingFee: "6", officialCopiesFee: "0",
    leaseholdSupplement: "0", newBuildSupplement: "0", sharedOwnershipSupplement: "0",
    giftedDepositSupplement: "0", platformCommission: "50",
  });

  const { data: bands, refetch } = trpc.investor.feeStructures.useQuery(
    { firmId: firmId! },
    { enabled: !!firmId }
  );

  const addBand = trpc.investor.upsertFeeStructure.useMutation({
    onSuccess: () => { refetch(); setShowAddBand(false); toast.success("Fee band added"); },
    onError: () => toast.error("Failed to add fee band"),
  });

  const filteredBands = (bands ?? []).filter(b => b.transactionType === activeTx);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>Fee Editor</h2>
        <p className="text-sm" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
          Configure per-firm fee bands by property value range and transaction type
        </p>
      </div>

      {/* Firm selector */}
      <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: "1px solid oklch(0.90 0.012 80)" }}>
        <label className="block text-xs font-semibold mb-2" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Select Law Firm</label>
        <select
          value={firmId ?? ""}
          onChange={e => { const id = Number(e.target.value); setFirmId(id || null); setFirmName(firms?.find(f => f.id === id)?.name ?? ""); }}
          className="w-full max-w-sm px-3 py-2.5 rounded-lg text-sm outline-none"
          style={{ border: "1px solid oklch(0.88 0.012 80)", fontFamily: "'DM Sans', sans-serif", color: "oklch(0.18 0.06 250)" }}>
          <option value="">— Choose a firm —</option>
          {(firms ?? []).map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </div>

      {firmId && (
        <>
          {/* Transaction type tabs */}
          <div className="flex gap-2 flex-wrap">
            {(Object.entries(TX_LABELS) as [TransactionType, string][]).map(([tx, label]) => (
              <button key={tx} onClick={() => setActiveTx(tx)}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: activeTx === tx ? "oklch(0.18 0.06 250)" : "white",
                  color: activeTx === tx ? "white" : "oklch(0.45 0.04 250)",
                  border: `1px solid ${activeTx === tx ? "oklch(0.18 0.06 250)" : "oklch(0.88 0.012 80)"}`,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Fee bands */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
                {TX_LABELS[activeTx]} — {firmName}
              </h3>
              <button onClick={() => setShowAddBand(true)} className="btn-gold px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                <Plus size={14} /> Add Fee Band
              </button>
            </div>

            {/* Add band form */}
            {showAddBand && (
              <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: "1px solid oklch(0.72 0.12 75 / 0.3)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-sm" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>New Fee Band — {TX_LABELS[activeTx]}</h4>
                  <button onClick={() => setShowAddBand(false)} style={{ background: "none", border: "none" }}><X size={15} style={{ color: "oklch(0.55 0.04 250)" }} /></button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Min Value (£)</label>
                    <input type="number" value={newBandForm.minValue} onChange={e => setNewBandForm(f => ({ ...f, minValue: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ border: "1px solid oklch(0.88 0.012 80)", fontFamily: "'DM Sans', sans-serif" }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Max Value (£)</label>
                    <input type="number" value={newBandForm.maxValue} onChange={e => setNewBandForm(f => ({ ...f, maxValue: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ border: "1px solid oklch(0.88 0.012 80)", fontFamily: "'DM Sans', sans-serif" }} />
                  </div>
                  {FEE_FIELDS.map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold mb-1" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{label} (£)</label>
                      <input type="number" step="0.01" value={newBandForm[key] ?? "0"} onChange={e => setNewBandForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ border: "1px solid oklch(0.88 0.012 80)", fontFamily: "'DM Sans', sans-serif" }} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={() => setShowAddBand(false)} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ border: "1px solid oklch(0.88 0.012 80)", background: "none", color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Cancel</button>
                  <button
                    onClick={() => addBand.mutate({
                      firmId: firmId!,
                      transactionType: activeTx,
                      minValue: Number(newBandForm.minValue),
                      maxValue: Number(newBandForm.maxValue),
                      legalFee: newBandForm.legalFee,
                      searchFee: newBandForm.searchFee,
                      landRegistryFee: newBandForm.landRegistryFee,
                      electronicTransferFee: newBandForm.electronicTransferFee,
                      bankTransferFee: newBandForm.bankTransferFee,
                      antiMoneyLaunderingFee: newBandForm.antiMoneyLaunderingFee,
                      officialCopiesFee: newBandForm.officialCopiesFee,
                      leaseholdSupplement: newBandForm.leaseholdSupplement,
                      newBuildSupplement: newBandForm.newBuildSupplement,
                      sharedOwnershipSupplement: newBandForm.sharedOwnershipSupplement,
                      giftedDepositSupplement: newBandForm.giftedDepositSupplement,
                      platformCommission: newBandForm.platformCommission,
                    })}
                    disabled={addBand.isPending}
                    className="btn-gold px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                    <Save size={14} /> {addBand.isPending ? "Saving…" : "Save Band"}
                  </button>
                </div>
              </div>
            )}

            {filteredBands.map(band => (
              <FeeBandRow key={band.id} band={band} firmId={firmId!} onSaved={() => refetch()} onDeleted={() => refetch()} />
            ))}

            {!filteredBands.length && !showAddBand && (
              <div className="text-center py-10 rounded-xl text-sm" style={{ background: "oklch(0.97 0.008 80)", color: "oklch(0.65 0.04 250)", fontFamily: "'DM Sans', sans-serif", border: "1px dashed oklch(0.85 0.012 80)" }}>
                No fee bands configured for {TX_LABELS[activeTx]} yet. Click "Add Fee Band" to create one.
              </div>
            )}
          </div>
        </>
      )}

      {!firmId && (
        <div className="text-center py-16 rounded-xl text-sm" style={{ background: "oklch(0.97 0.008 80)", color: "oklch(0.65 0.04 250)", fontFamily: "'DM Sans', sans-serif", border: "1px dashed oklch(0.85 0.012 80)" }}>
          Select a firm above to view and edit its fee structure.
        </div>
      )}
    </div>
  );
}

// ─── NOTES TAB ────────────────────────────────────────────────────────────────
function NotesTab() {
  const { data: firms } = trpc.firms.listAdmin.useQuery();
  const [firmId, setFirmId] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

  const { data: notes, refetch } = trpc.investor.notes.useQuery(
    { firmId: firmId! },
    { enabled: !!firmId }
  );

  const addNote = trpc.investor.addNote.useMutation({
    onSuccess: () => { refetch(); setNoteText(""); toast.success("Note added"); },
    onError: () => toast.error("Failed to add note"),
  });

  const deleteNote = trpc.investor.deleteNote.useMutation({
    onSuccess: () => { refetch(); toast.success("Note deleted"); },
    onError: () => toast.error("Failed to delete note"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>Firm Notes</h2>
        <p className="text-sm" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
          Private investor notes for each firm — contract terms, contact history, performance observations
        </p>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: "1px solid oklch(0.90 0.012 80)" }}>
        <label className="block text-xs font-semibold mb-2" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Select Law Firm</label>
        <select
          value={firmId ?? ""}
          onChange={e => setFirmId(Number(e.target.value) || null)}
          className="w-full max-w-sm px-3 py-2.5 rounded-lg text-sm outline-none"
          style={{ border: "1px solid oklch(0.88 0.012 80)", fontFamily: "'DM Sans', sans-serif", color: "oklch(0.18 0.06 250)" }}>
          <option value="">— Choose a firm —</option>
          {(firms ?? []).map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </div>

      {firmId && (
        <>
          {/* Add note */}
          <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: "1px solid oklch(0.90 0.012 80)" }}>
            <label className="block text-xs font-semibold mb-2" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Add Note</label>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              rows={3}
              placeholder="e.g. Agreed 3% commission rate. Contact: James Smith, 020 7123 4567. Contract renewal due March 2026."
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
              style={{ border: "1px solid oklch(0.88 0.012 80)", fontFamily: "'DM Sans', sans-serif", color: "oklch(0.18 0.06 250)" }}
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={() => addNote.mutate({ firmId: firmId!, content: noteText })}
                disabled={!noteText.trim() || addNote.isPending}
                className="btn-gold px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                <Plus size={14} /> {addNote.isPending ? "Adding…" : "Add Note"}
              </button>
            </div>
          </div>

          {/* Notes list */}
          <div className="space-y-3">
            {(notes ?? []).map(note => (
              <div key={note.id} className="bg-white rounded-xl p-5 shadow-sm" style={{ border: "1px solid oklch(0.90 0.012 80)" }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-relaxed" style={{ color: "oklch(0.25 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>{note.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: "oklch(0.65 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                      <span>{note.authorName ?? "Admin"}</span>
                      <span>·</span>
                      <span>{new Date(note.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteNote.mutate({ id: note.id })} className="p-1.5 rounded-lg flex-shrink-0" style={{ background: "none", border: "1px solid oklch(0.88 0.012 80)" }}>
                    <Trash2 size={13} style={{ color: "oklch(0.55 0.15 30)" }} />
                  </button>
                </div>
              </div>
            ))}
            {!notes?.length && (
              <div className="text-center py-10 rounded-xl text-sm" style={{ background: "oklch(0.97 0.008 80)", color: "oklch(0.65 0.04 250)", fontFamily: "'DM Sans', sans-serif", border: "1px dashed oklch(0.85 0.012 80)" }}>
                No notes yet for this firm.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── MAIN INVESTOR PANEL ──────────────────────────────────────────────────────
export default function InvestorPanel() {
  const [, navigate] = useLocation();
  const { user, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [selectedFirmId, setSelectedFirmId] = useState<number | null>(null);
  const [selectedFirmName, setSelectedFirmName] = useState("");

  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => navigate("/"),
  });

  // Auth guard
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.975 0.008 80)" }}>
        <div className="text-sm" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>Loading…</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "oklch(0.975 0.008 80)" }}>
        <div className="text-center max-w-sm">
          <AlertCircle size={40} className="mx-auto mb-4" style={{ color: "oklch(0.55 0.15 30)" }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>Access Restricted</h2>
          <p className="text-sm mb-5" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
            This panel is only accessible to admin accounts. Please contact the site owner to have your account promoted.
          </p>
          <button onClick={() => navigate("/")} className="btn-gold px-6 py-2.5 rounded-lg text-sm font-semibold">Back to Homepage</button>
        </div>
      </div>
    );
  }

  const NAV_ITEMS: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "firms", label: "Law Firms", icon: Building2 },
    { id: "fees", label: "Fee Editor", icon: DollarSign },
    { id: "notes", label: "Firm Notes", icon: StickyNote },
  ];

  const handleSelectFirm = (id: number, name: string) => {
    setSelectedFirmId(id);
    setSelectedFirmName(name);
    setActiveTab("fees");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "oklch(0.975 0.008 80)" }}>
      {/* ── SIDEBAR ── */}
      <aside className="w-64 flex-shrink-0 flex flex-col" style={{ background: "oklch(0.12 0.05 250)", minHeight: "100vh" }}>
        {/* Logo */}
        <div className="px-6 py-6" style={{ borderBottom: "1px solid oklch(0.72 0.12 75 / 0.15)" }}>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/109506846/5ZpoxzgLM5cycU3sThccK4/favicon-logo-v1_d30bdc70.png" alt="CC Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-xs font-bold leading-tight" style={{ color: "white", fontFamily: "'Playfair Display', serif" }}>Investor Panel</div>
              <div className="text-xs leading-tight" style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>Fee Management</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left"
              style={{
                background: activeTab === id ? "oklch(0.72 0.12 75 / 0.15)" : "none",
                color: activeTab === id ? "oklch(0.82 0.10 75)" : "oklch(0.975 0.008 80 / 0.6)",
                border: "none",
                fontFamily: "'DM Sans', sans-serif",
              }}>
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-4 py-4" style={{ borderTop: "1px solid oklch(0.72 0.12 75 / 0.15)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "oklch(0.72 0.12 75 / 0.2)", color: "oklch(0.82 0.10 75)" }}>
              {user?.name?.charAt(0) ?? "A"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate" style={{ color: "white", fontFamily: "'DM Sans', sans-serif" }}>{user?.name ?? "Admin"}</div>
              <div className="text-xs truncate" style={{ color: "oklch(0.975 0.008 80 / 0.4)", fontFamily: "'DM Sans', sans-serif" }}>{user?.email ?? ""}</div>
            </div>
          </div>
          <button
            onClick={() => logout.mutate()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
            style={{ background: "none", border: "1px solid oklch(0.72 0.12 75 / 0.2)", color: "oklch(0.975 0.008 80 / 0.5)", fontFamily: "'DM Sans', sans-serif" }}>
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 px-8 py-4 flex items-center justify-between" style={{ background: "oklch(0.975 0.008 80 / 0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid oklch(0.90 0.012 80)" }}>
          <div className="text-sm font-semibold" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
            {NAV_ITEMS.find(n => n.id === activeTab)?.label}
          </div>
          <button onClick={() => navigate("/admin")} className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            style={{ border: "1px solid oklch(0.88 0.012 80)", background: "none", color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
            Switch to Operations Panel
          </button>
        </div>

        <div className="px-8 py-8">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "firms" && <FirmsTab onSelectFirm={handleSelectFirm} />}
          {activeTab === "fees" && <FeeEditorTab selectedFirmId={selectedFirmId} selectedFirmName={selectedFirmName} />}
          {activeTab === "notes" && <NotesTab />}
        </div>
      </main>
    </div>
  );
}
