/**
 * QUOTE WIZARD PAGE
 * Design: British Legal Prestige — Navy + Gold + Parchment
 * 3-step grouped wizard:
 *   Step 1: Transaction type + Property details
 *   Step 2: Your situation (conditional questions)
 *   Step 3: Contact details + submit
 */

import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { ChevronLeft, ChevronRight, Scale, HelpCircle, MapPin, X } from "lucide-react";
import type { WizardAnswers } from "../lib/feeEngine";

// ─── TOOLTIP ─────────────────────────────────────────────────────────────────
function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block ml-1">
      <HelpCircle
        size={14}
        className="cursor-pointer"
        style={{ color: "oklch(0.72 0.12 75)" }}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      />
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 tooltip-gold text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent" style={{ borderTopColor: "oklch(0.18 0.06 250)" }} />
        </div>
      )}
    </div>
  );
}

// ─── OPTION BUTTON ────────────────────────────────────────────────────────────
function OptionBtn({
  label,
  selected,
  onClick,
  icon,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="wizard-option rounded-xl px-5 py-3.5 text-sm font-medium flex items-center gap-2 transition-all"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        ...(selected
          ? { background: "oklch(0.18 0.06 250)", borderColor: "oklch(0.18 0.06 250)", color: "white" }
          : {}),
      }}
    >
      {icon && <span style={{ color: selected ? "oklch(0.72 0.12 75)" : "oklch(0.45 0.04 250)" }}>{icon}</span>}
      {label}
    </button>
  );
}

// ─── POSTCODE AUTOCOMPLETE ────────────────────────────────────────────────────
function PostcodeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const clean = value.replace(/\s/g, "").toUpperCase();
    if (clean.length < 3) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(clean)}/autocomplete`);
        const data = await res.json();
        setSuggestions(data.result || []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="relative">
      <div className="relative">
        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "oklch(0.72 0.12 75)" }} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder="e.g. SW1A 1AA"
          maxLength={8}
          className="w-full pl-9 pr-4 py-3 rounded-xl text-sm border-2 outline-none transition-all"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            borderColor: "oklch(0.88 0.015 80)",
            background: "white",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 rounded-full animate-spin"
            style={{ borderColor: "oklch(0.72 0.12 75)", borderTopColor: "transparent" }} />
        )}
      </div>
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border z-50 overflow-hidden"
          style={{ borderColor: "oklch(0.88 0.015 80)" }}>
          {suggestions.slice(0, 5).map((s) => (
            <button
              key={s}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "oklch(0.18 0.06 250)" }}
              onMouseDown={() => { onChange(s); setSuggestions([]); }}
            >
              <MapPin size={13} style={{ color: "oklch(0.72 0.12 75)" }} />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = ((step - 1) / (total - 1)) * 100;
  const labels = ["Property Details", "Your Situation", "Your Contact Details"];
  return (
    <div className="mb-10">
      <div className="flex justify-between mb-3">
        {labels.map((label, i) => (
          <div key={label} className="flex flex-col items-center" style={{ width: `${100 / total}%` }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all duration-300"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: i + 1 <= step ? "oklch(0.18 0.06 250)" : "oklch(0.88 0.015 80)",
                color: i + 1 <= step ? "white" : "oklch(0.55 0.04 250)",
                boxShadow: i + 1 === step ? "0 0 0 4px oklch(0.72 0.12 75 / 0.3)" : "none",
              }}
            >
              {i + 1 < step ? "✓" : i + 1}
            </div>
            <span
              className="text-xs text-center hidden md:block"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: i + 1 <= step ? "oklch(0.18 0.06 250)" : "oklch(0.55 0.04 250)",
                fontWeight: i + 1 === step ? 600 : 400,
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="h-2 rounded-full" style={{ background: "oklch(0.88 0.015 80)" }}>
        <div className="h-2 rounded-full progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-right mt-1 text-xs" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
        Step {step} of {total}
      </div>
    </div>
  );
}

// ─── QUESTION LABEL ───────────────────────────────────────────────────────────
function QLabel({ children, tooltip }: { children: React.ReactNode; tooltip?: string }) {
  return (
    <label className="flex items-center text-sm font-semibold mb-3" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>
      {children}
      {tooltip && <Tooltip text={tooltip} />}
    </label>
  );
}

// ─── MAIN WIZARD ──────────────────────────────────────────────────────────────
const TIMELINES = ["As soon as possible", "Within 1 month", "1–3 months", "3–6 months", "Not yet decided"];
const MORTGAGE_LENDERS = [
  "Barclays", "Halifax", "HSBC", "Lloyds Bank", "Nationwide", "NatWest", "Santander",
  "Virgin Money", "Yorkshire Building Society", "Coventry Building Society",
  "Leeds Building Society", "West Bromwich Building Society", "Skipton Building Society",
  "TSB", "Metro Bank", "Aldermore", "Accord Mortgages", "BM Solutions",
  "Birmingham Midshires", "Clydesdale Bank", "First Direct", "Godiva Mortgages",
  "Kensington Mortgages", "Kent Reliance", "Leek United Building Society",
  "Mansfield Building Society", "Melton Building Society", "Monmouthshire Building Society",
  "Newbury Building Society", "Nottingham Building Society", "Paragon Bank",
  "Pepper Money", "Platform", "Post Office Money", "Principality Building Society",
  "Precise Mortgages", "Royal Bank of Scotland", "Scottish Building Society",
  "Scottish Widows Bank", "Shawbrook Bank", "Stafford Railway Building Society",
  "Swansea Building Society", "The Mortgage Works", "Together Money",
  "Tipton & Coseley Building Society", "Vernon Building Society", "Other Lender",
];

export default function QuoteWizard() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialType = (params.get("type") as WizardAnswers["transactionType"]) || "purchase";

  const [step, setStep] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [answers, setAnswers] = useState<Partial<WizardAnswers>>({
    transactionType: initialType,
    tenure: "freehold",
    hasMortgage: false,
    isFirstTimeBuyer: false,
    isNewBuild: false,
    isSharedOwnership: false,
    hasGiftedDeposit: false,
    hasHelpToBuyISA: false,
    isRightToBuy: false,
    isBuyToLet: false,
    isSecondHome: false,
    hasMortgageOnProperty: false,
    buyerCount: 1,
    propertyValue: 0,
    postcode: "",
    completionTimeline: "",
  });

  const [contactDetails, setContactDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    mortgageLender: "",
  });

  const set = (key: keyof WizardAnswers, value: unknown) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const goNext = () => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!answers.propertyValue || answers.propertyValue < 10000) errs.propertyValue = "Please enter a valid property value (minimum £10,000)";
      if (!answers.postcode || answers.postcode.length < 5) errs.postcode = "Please enter a valid UK postcode";
      if (!answers.completionTimeline) errs.completionTimeline = "Please select a timeline";
    }

    if (step === 3) {
      if (!contactDetails.firstName.trim()) errs.firstName = "First name is required";
      if (!contactDetails.lastName.trim()) errs.lastName = "Last name is required";
      if (!contactDetails.email.includes("@")) errs.email = "Please enter a valid email address";
      if (!contactDetails.phone.trim() || contactDetails.phone.length < 10) errs.phone = "Please enter a valid phone number";
    }

    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    if (step === 3) {
      // Save to sessionStorage and navigate to results
      sessionStorage.setItem("quoteAnswers", JSON.stringify(answers));
      sessionStorage.setItem("contactDetails", JSON.stringify(contactDetails));
      navigate("/results");
      return;
    }

    setAnimating(true);
    setTimeout(() => { setStep((s) => s + 1); setAnimating(false); }, 200);
  };

  const goBack = () => {
    if (step === 1) { navigate("/"); return; }
    setAnimating(true);
    setTimeout(() => { setStep((s) => s - 1); setAnimating(false); }, 200);
  };

  const isSale = answers.transactionType === "sale" || answers.transactionType === "sale_purchase";
  const isPurchase = answers.transactionType === "purchase" || answers.transactionType === "sale_purchase";

  const transactionLabels: Record<string, string> = {
    purchase: "Property Purchase",
    sale: "Property Sale",
    sale_purchase: "Sale & Purchase",
    remortgage: "Remortgage",
  };

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
          <button onClick={() => navigate("/")} className="text-sm flex items-center gap-1" style={{ color: "oklch(0.975 0.008 80 / 0.5)", fontFamily: "'DM Sans', sans-serif" }}>
            <X size={14} /> Cancel
          </button>
        </div>
      </div>

      <div className="container py-12 max-w-2xl mx-auto">
        {/* Transaction type badge */}
        <div className="flex items-center justify-center mb-6">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: "oklch(0.18 0.06 250 / 0.08)", color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif", border: "1px solid oklch(0.18 0.06 250 / 0.15)" }}>
            {transactionLabels[answers.transactionType || "purchase"]}
          </span>
        </div>

        <ProgressBar step={step} total={3} />

        {/* Card */}
        <div
          className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-200"
          style={{
            border: "1px solid oklch(0.88 0.015 80)",
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(8px)" : "translateY(0)",
          }}
        >
          {/* ── STEP 1: Property Details ── */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
                Property Details
              </h2>
              <p className="text-sm mb-8" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                Tell us about the property and your transaction.
              </p>

              {/* Transaction Type */}
              <div className="mb-6">
                <QLabel>What type of transaction is this?</QLabel>
                <div className="flex flex-wrap gap-2">
                  {(["purchase", "sale", "sale_purchase", "remortgage"] as const).map((t) => (
                    <OptionBtn
                      key={t}
                      label={transactionLabels[t]}
                      selected={answers.transactionType === t}
                      onClick={() => set("transactionType", t)}
                    />
                  ))}
                </div>
              </div>

              {/* Tenure */}
              {answers.transactionType !== "remortgage" && (
                <div className="mb-6">
                  <QLabel tooltip="Freehold means you own the property and land outright. Leasehold means you own the property for a fixed term but not the land.">
                    What is the property tenure?
                  </QLabel>
                  <div className="flex gap-2">
                    <OptionBtn label="Freehold" selected={answers.tenure === "freehold"} onClick={() => set("tenure", "freehold")} />
                    <OptionBtn label="Leasehold" selected={answers.tenure === "leasehold"} onClick={() => set("tenure", "leasehold")} />
                  </div>
                </div>
              )}

              {/* Property Value */}
              <div className="mb-6">
                <QLabel>
                  {answers.transactionType === "remortgage" ? "Current property value (£)" : "Property value (£)"}
                </QLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'JetBrains Mono', monospace" }}>£</span>
                  <input
                    type="number"
                    value={answers.propertyValue || ""}
                    onChange={(e) => set("propertyValue", Number(e.target.value))}
                    placeholder="350000"
                    className="w-full pl-7 pr-4 py-3 rounded-xl text-sm border-2 outline-none transition-all"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      borderColor: errors.propertyValue ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = errors.propertyValue ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)")}
                  />
                </div>
                {errors.propertyValue && <p className="text-xs mt-1" style={{ color: "oklch(0.577 0.245 27.325)", fontFamily: "'DM Sans', sans-serif" }}>{errors.propertyValue}</p>}
              </div>

              {/* Postcode */}
              <div className="mb-6">
                <QLabel>Property postcode</QLabel>
                <PostcodeInput value={answers.postcode || ""} onChange={(v) => set("postcode", v)} />
                {errors.postcode && <p className="text-xs mt-1" style={{ color: "oklch(0.577 0.245 27.325)", fontFamily: "'DM Sans', sans-serif" }}>{errors.postcode}</p>}
              </div>

              {/* Timeline */}
              <div className="mb-2">
                <QLabel>When do you expect to complete?</QLabel>
                <div className="flex flex-wrap gap-2">
                  {TIMELINES.map((t) => (
                    <OptionBtn key={t} label={t} selected={answers.completionTimeline === t} onClick={() => set("completionTimeline", t)} />
                  ))}
                </div>
                {errors.completionTimeline && <p className="text-xs mt-2" style={{ color: "oklch(0.577 0.245 27.325)", fontFamily: "'DM Sans', sans-serif" }}>{errors.completionTimeline}</p>}
              </div>
            </div>
          )}

          {/* ── STEP 2: Your Situation ── */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
                Your Situation
              </h2>
              <p className="text-sm mb-8" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                These details help us calculate your accurate quote. Only answer what applies to you.
              </p>

              {/* PURCHASE-SPECIFIC QUESTIONS */}
              {isPurchase && (
                <>
                  {/* Mortgage */}
                  <div className="mb-6">
                    <QLabel tooltip="If you are using a mortgage to fund the purchase, your conveyancer will need to act for the lender too, which incurs an additional fee.">
                      Are you using a mortgage to fund the purchase?
                    </QLabel>
                    <div className="flex gap-2">
                      <OptionBtn label="Yes" selected={answers.hasMortgage === true} onClick={() => set("hasMortgage", true)} />
                      <OptionBtn label="No (Cash Buyer)" selected={answers.hasMortgage === false} onClick={() => set("hasMortgage", false)} />
                    </div>
                  </div>

                  {/* Mortgage lender dropdown — only if using mortgage */}
                  {answers.hasMortgage && (
                    <div className="mb-6 pl-4" style={{ borderLeft: "3px solid oklch(0.72 0.12 75 / 0.3)" }}>
                      <QLabel>Which lender are you using?</QLabel>
                      <select
                        value={contactDetails.mortgageLender}
                        onChange={(e) => setContactDetails((prev) => ({ ...prev, mortgageLender: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none transition-all bg-white"
                        style={{ fontFamily: "'DM Sans', sans-serif", borderColor: "oklch(0.88 0.015 80)" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
                      >
                        <option value="">Select your lender...</option>
                        {MORTGAGE_LENDERS.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  )}

                  {/* First Time Buyer */}
                  <div className="mb-6">
                    <QLabel tooltip="First-time buyers may be eligible for Stamp Duty Land Tax (SDLT) relief on properties up to £625,000.">
                      Are you a first-time buyer?
                    </QLabel>
                    <div className="flex gap-2">
                      <OptionBtn label="Yes" selected={answers.isFirstTimeBuyer === true} onClick={() => { set("isFirstTimeBuyer", true); set("isBuyToLet", false); set("isSecondHome", false); }} />
                      <OptionBtn label="No" selected={answers.isFirstTimeBuyer === false} onClick={() => set("isFirstTimeBuyer", false)} />
                    </div>
                  </div>

                  {/* If NOT first time buyer — show second home / buy to let */}
                  {answers.isFirstTimeBuyer === false && (
                    <>
                      <div className="mb-6 pl-4" style={{ borderLeft: "3px solid oklch(0.72 0.12 75 / 0.3)" }}>
                        <QLabel tooltip="A 3% SDLT surcharge applies if you already own a property and are buying an additional one.">
                          Is this a second home or additional property?
                        </QLabel>
                        <div className="flex gap-2">
                          <OptionBtn label="Yes" selected={answers.isSecondHome === true} onClick={() => set("isSecondHome", true)} />
                          <OptionBtn label="No" selected={answers.isSecondHome === false} onClick={() => set("isSecondHome", false)} />
                        </div>
                      </div>
                      <div className="mb-6 pl-4" style={{ borderLeft: "3px solid oklch(0.72 0.12 75 / 0.3)" }}>
                        <QLabel tooltip="Buy-to-let properties are subject to the 3% SDLT surcharge and require specialist conveyancing.">
                          Is this a buy-to-let investment property?
                        </QLabel>
                        <div className="flex gap-2">
                          <OptionBtn label="Yes" selected={answers.isBuyToLet === true} onClick={() => set("isBuyToLet", true)} />
                          <OptionBtn label="No" selected={answers.isBuyToLet === false} onClick={() => set("isBuyToLet", false)} />
                        </div>
                      </div>
                    </>
                  )}

                  {/* New Build */}
                  <div className="mb-6">
                    <QLabel tooltip="New build properties require additional legal work, including reviewing the developer's contract pack and liaising with the developer's solicitors.">
                      Is this a new build property?
                    </QLabel>
                    <div className="flex gap-2">
                      <OptionBtn label="Yes" selected={answers.isNewBuild === true} onClick={() => set("isNewBuild", true)} />
                      <OptionBtn label="No" selected={answers.isNewBuild === false} onClick={() => set("isNewBuild", false)} />
                    </div>
                  </div>

                  {/* Shared Ownership */}
                  <div className="mb-6">
                    <QLabel tooltip="Shared ownership means you buy a share of the property (usually 25–75%) and pay rent on the remaining share. This requires specialist legal work.">
                      Is this a shared ownership purchase?
                    </QLabel>
                    <div className="flex gap-2">
                      <OptionBtn label="Yes" selected={answers.isSharedOwnership === true} onClick={() => set("isSharedOwnership", true)} />
                      <OptionBtn label="No" selected={answers.isSharedOwnership === false} onClick={() => set("isSharedOwnership", false)} />
                    </div>
                  </div>

                  {/* Gifted Deposit */}
                  <div className="mb-6">
                    <QLabel tooltip="If part of your deposit is a gift (e.g. from a family member), your conveyancer will need to verify the source of funds.">
                      Are you using a gifted deposit?
                    </QLabel>
                    <div className="flex gap-2">
                      <OptionBtn label="Yes" selected={answers.hasGiftedDeposit === true} onClick={() => set("hasGiftedDeposit", true)} />
                      <OptionBtn label="No" selected={answers.hasGiftedDeposit === false} onClick={() => set("hasGiftedDeposit", false)} />
                    </div>
                  </div>

                  {/* Help to Buy ISA */}
                  <div className="mb-6">
                    <QLabel tooltip="If you have a Help to Buy ISA, your conveyancer will need to claim the government bonus on your behalf at completion.">
                      Are you using a Help to Buy ISA?
                    </QLabel>
                    <div className="flex gap-2">
                      <OptionBtn label="Yes" selected={answers.hasHelpToBuyISA === true} onClick={() => set("hasHelpToBuyISA", true)} />
                      <OptionBtn label="No" selected={answers.hasHelpToBuyISA === false} onClick={() => set("hasHelpToBuyISA", false)} />
                    </div>
                  </div>

                  {/* Right to Buy */}
                  <div className="mb-6">
                    <QLabel tooltip="Right to Buy allows council and housing association tenants to purchase their home at a discount. This requires specialist legal work.">
                      Is this a Right to Buy purchase?
                    </QLabel>
                    <div className="flex gap-2">
                      <OptionBtn label="Yes" selected={answers.isRightToBuy === true} onClick={() => set("isRightToBuy", true)} />
                      <OptionBtn label="No" selected={answers.isRightToBuy === false} onClick={() => set("isRightToBuy", false)} />
                    </div>
                  </div>

                  {/* Number of buyers */}
                  <div className="mb-2">
                    <QLabel>How many people are purchasing?</QLabel>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((n) => (
                        <OptionBtn key={n} label={n === 1 ? "Just me" : n === 2 ? "Two buyers" : "Three or more"} selected={answers.buyerCount === n} onClick={() => set("buyerCount", n)} />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* SALE-SPECIFIC QUESTIONS */}
              {isSale && !isPurchase && (
                <>
                  <div className="mb-6">
                    <QLabel tooltip="If there is an outstanding mortgage on the property being sold, your conveyancer will need to redeem it at completion.">
                      Is there a mortgage on the property you are selling?
                    </QLabel>
                    <div className="flex gap-2">
                      <OptionBtn label="Yes" selected={answers.hasMortgageOnProperty === true} onClick={() => set("hasMortgageOnProperty", true)} />
                      <OptionBtn label="No" selected={answers.hasMortgageOnProperty === false} onClick={() => set("hasMortgageOnProperty", false)} />
                    </div>
                  </div>
                </>
              )}

              {/* REMORTGAGE QUESTIONS */}
              {answers.transactionType === "remortgage" && (
                <>
                  <div className="mb-6">
                    <QLabel>What is the value of the new mortgage?</QLabel>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'JetBrains Mono', monospace" }}>£</span>
                      <input
                        type="number"
                        value={answers.newMortgageValue || ""}
                        onChange={(e) => set("newMortgageValue", Number(e.target.value))}
                        placeholder="200000"
                        className="w-full pl-7 pr-4 py-3 rounded-xl text-sm border-2 outline-none transition-all"
                        style={{ fontFamily: "'JetBrains Mono', monospace", borderColor: "oklch(0.88 0.015 80)" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <QLabel tooltip="Leasehold remortgages require additional legal work to obtain the freeholder's consent.">
                      Is the property freehold or leasehold?
                    </QLabel>
                    <div className="flex gap-2">
                      <OptionBtn label="Freehold" selected={answers.tenure === "freehold"} onClick={() => set("tenure", "freehold")} />
                      <OptionBtn label="Leasehold" selected={answers.tenure === "leasehold"} onClick={() => set("tenure", "leasehold")} />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── STEP 3: Contact Details ── */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
                Your Contact Details
              </h2>
              <p className="text-sm mb-8" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                We will use these details to send you your quotes and allow firms to contact you.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <QLabel>First name</QLabel>
                  <input
                    type="text"
                    value={contactDetails.firstName}
                    onChange={(e) => setContactDetails((p) => ({ ...p, firstName: e.target.value }))}
                    placeholder="Jane"
                    className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none transition-all"
                    style={{ fontFamily: "'DM Sans', sans-serif", borderColor: errors.firstName ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = errors.firstName ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)")}
                  />
                  {errors.firstName && <p className="text-xs mt-1" style={{ color: "oklch(0.577 0.245 27.325)", fontFamily: "'DM Sans', sans-serif" }}>{errors.firstName}</p>}
                </div>
                <div>
                  <QLabel>Last name</QLabel>
                  <input
                    type="text"
                    value={contactDetails.lastName}
                    onChange={(e) => setContactDetails((p) => ({ ...p, lastName: e.target.value }))}
                    placeholder="Smith"
                    className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none transition-all"
                    style={{ fontFamily: "'DM Sans', sans-serif", borderColor: errors.lastName ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = errors.lastName ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)")}
                  />
                  {errors.lastName && <p className="text-xs mt-1" style={{ color: "oklch(0.577 0.245 27.325)", fontFamily: "'DM Sans', sans-serif" }}>{errors.lastName}</p>}
                </div>
              </div>

              <div className="mb-4">
                <QLabel>Email address</QLabel>
                <input
                  type="email"
                  value={contactDetails.email}
                  onChange={(e) => setContactDetails((p) => ({ ...p, email: e.target.value }))}
                  placeholder="jane.smith@email.com"
                  className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none transition-all"
                  style={{ fontFamily: "'DM Sans', sans-serif", borderColor: errors.email ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = errors.email ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)")}
                />
                {errors.email && <p className="text-xs mt-1" style={{ color: "oklch(0.577 0.245 27.325)", fontFamily: "'DM Sans', sans-serif" }}>{errors.email}</p>}
              </div>

              <div className="mb-6">
                <QLabel>Phone number</QLabel>
                <input
                  type="tel"
                  value={contactDetails.phone}
                  onChange={(e) => setContactDetails((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="07700 900000"
                  className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none transition-all"
                  style={{ fontFamily: "'DM Sans', sans-serif", borderColor: errors.phone ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = errors.phone ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)")}
                />
                {errors.phone && <p className="text-xs mt-1" style={{ color: "oklch(0.577 0.245 27.325)", fontFamily: "'DM Sans', sans-serif" }}>{errors.phone}</p>}
              </div>

              <div className="rounded-xl p-4 text-xs" style={{ background: "oklch(0.975 0.008 80)", border: "1px solid oklch(0.88 0.015 80)", color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                By clicking "Show My Quotes" you agree to our Terms & Conditions and Privacy Policy. Your details will be shared with the conveyancing firms you choose to instruct.
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all"
            style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif", border: "1px solid oklch(0.88 0.015 80)", background: "white" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "oklch(0.18 0.06 250)"; e.currentTarget.style.color = "oklch(0.18 0.06 250)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)"; e.currentTarget.style.color = "oklch(0.45 0.04 250)"; }}
          >
            <ChevronLeft size={16} />
            Back
          </button>

          <button
            onClick={goNext}
            className="btn-gold flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold"
          >
            {step === 3 ? "Show My Quotes" : "Continue"}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
