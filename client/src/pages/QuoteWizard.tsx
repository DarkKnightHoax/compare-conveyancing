/*
 * QUOTE WIZARD PAGE
 * Design: British Legal Prestige — Navy + Gold + Parchment
 * Structure: 3 high-level steps (progress bar tabs)
 *   Step 1: Property Details — questions slide in one-by-one
 *   Step 2: Your Situation — questions slide in one-by-one (conditional)
 *   Step 3: Contact Details — single screen
 * Animation: each question slides in from the right, exits to the left
 */

import { useState, useEffect, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { ChevronLeft, ChevronRight, Scale, HelpCircle, MapPin, X, Check } from "lucide-react";
import type { WizardAnswers } from "../lib/feeEngine";
import { trpc } from "@/lib/trpc";

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
  label, selected, onClick, icon, fullWidth = false,
}: {
  label: string; selected: boolean; onClick: () => void; icon?: React.ReactNode; fullWidth?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`wizard-option rounded-xl px-5 py-3.5 text-sm font-medium flex items-center gap-2 transition-all ${fullWidth ? "w-full justify-between" : ""}`}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        ...(selected
          ? { background: "oklch(0.18 0.06 250)", borderColor: "oklch(0.18 0.06 250)", color: "white" }
          : {}),
      }}
    >
      <span className="flex items-center gap-2">
        {icon && <span style={{ color: selected ? "oklch(0.72 0.12 75)" : "oklch(0.45 0.04 250)" }}>{icon}</span>}
        {label}
      </span>
      {selected && <Check size={14} style={{ color: "oklch(0.72 0.12 75)", flexShrink: 0 }} />}
    </button>
  );
}

// ─── POSTCODE AUTOCOMPLETE ────────────────────────────────────────────────────
function PostcodeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
      } catch { setSuggestions([]); }
      finally { setLoading(false); }
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
          className="w-full pl-9 pr-4 py-3.5 rounded-xl text-sm border-2 outline-none transition-all"
          style={{ fontFamily: "'DM Sans', sans-serif", borderColor: "oklch(0.88 0.015 80)", background: "white" }}
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
            <button key={s} className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2"
              style={{ fontFamily: "'DM Sans', sans-serif", color: "oklch(0.18 0.06 250)" }}
              onMouseDown={() => { onChange(s); setSuggestions([]); }}>
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
function ProgressBar({ step }: { step: number }) {
  const labels = ["Property Details", "Your Situation", "Contact Details"];
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute left-0 right-0 top-4 h-0.5" style={{ background: "oklch(0.88 0.015 80)", zIndex: 0 }} />
        <div
          className="absolute left-0 top-4 h-0.5 transition-all duration-500"
          style={{
            width: step === 1 ? "0%" : step === 2 ? "50%" : "100%",
            background: "linear-gradient(90deg, oklch(0.18 0.06 250), oklch(0.72 0.12 75))",
            zIndex: 1,
          }}
        />
        {labels.map((label, i) => (
          <div key={label} className="flex flex-col items-center relative z-10">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all duration-300"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: i + 1 <= step ? "oklch(0.18 0.06 250)" : "white",
                color: i + 1 <= step ? "white" : "oklch(0.55 0.04 250)",
                border: `2px solid ${i + 1 <= step ? "oklch(0.18 0.06 250)" : "oklch(0.88 0.015 80)"}`,
                boxShadow: i + 1 === step ? "0 0 0 4px oklch(0.72 0.12 75 / 0.25)" : "none",
              }}
            >
              {i + 1 < step ? <Check size={14} /> : i + 1}
            </div>
            <span className="text-xs text-center hidden md:block"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                color: i + 1 <= step ? "oklch(0.18 0.06 250)" : "oklch(0.65 0.04 250)",
                fontWeight: i + 1 === step ? 600 : 400,
              }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ANIMATED QUESTION WRAPPER ────────────────────────────────────────────────
function QuestionSlide({
  children, direction, questionKey,
}: {
  children: React.ReactNode; direction: "forward" | "backward"; questionKey: string;
}) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    setMounted(true);
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, [questionKey]);

  const fromX = direction === "forward" ? "40px" : "-40px";

  return (
    <div
      style={{
        transition: "opacity 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : `translateX(${fromX})`,
      }}
    >
      {children}
    </div>
  );
}

// ─── QUESTION LABEL ───────────────────────────────────────────────────────────
function QLabel({ children, tooltip, subtitle }: { children: React.ReactNode; tooltip?: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <label className="flex items-center text-lg font-semibold" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'Playfair Display', serif" }}>
        {children}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      {subtitle && (
        <p className="text-sm mt-1" style={{ color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const TIMELINES = ["As soon as possible", "Within 1 month", "1–3 months", "3–6 months", "Not yet decided"];
const MORTGAGE_LENDERS = [
  "Accord Mortgages",
  "Accord Buy to Let",
  "Aldermore",
  "Alliance & Leicester",
  "Allica Bank",
  "April Mortgages",
  "Atom Bank",
  "Bank of China",
  "Bank of Cyprus",
  "Bank of Ireland",
  "Bank of Scotland",
  "Barclays Bank UK PLC",
  "Barnsley Building Society",
  "Bluestone Mortgages",
  "Bradford & Bingley / Mortgage Express",
  "Britannia",
  "Buckinghamshire BS",
  "Cambridge BS",
  "Canada Life",
  "Chelsea BS",
  "CHL Mortgages",
  "Chorley BS",
  "Clydesdale & Yorkshire Bank",
  "Co-operative Bank",
  "Coventry BS",
  "Cumberland BS",
  "Cynergy Bank",
  "Danske Bank",
  "Darlington BS",
  "Digital BS",
  "Dudley BS",
  "Earl Shilton BS",
  "Ecology BS",
  "ESBS",
  "Family BS",
  "First Direct",
  "Fleet Mortgages",
  "Foundation Home Loans",
  "Furness BS",
  "Gatehouse Bank",
  "Generation Home Loans",
  "Godiva",
  "Habito",
  "Halifax",
  "Hanley Economic Building Society",
  "Help to Buy ISA",
  "Hinckley & Rugby BS",
  "Hodge Bank",
  "HSBC",
  "ING",
  "Intelligent Finance",
  "Ipswich BS",
  "ITL",
  "Kent Reliance",
  "Kensington",
  "Landmark Mortgages",
  "Leeds BS",
  "Leek United BS",
  "LiveMore Capital",
  "Lloyds Banking Group",
  "M&S Bank",
  "Mansfield BS",
  "Market Harborough BS",
  "Marsden BS",
  "Marks & Spencer",
  "Melton Mowbray BS",
  "Metro Bank",
  "Monmouthshire BS",
  "Mortgage Works UK",
  "MQUBE",
  "Mpowered",
  "National Counties BS",
  "Nationwide",
  "Natwest",
  "Natwest International",
  "Newbury BS",
  "NOMO",
  "Norwich & Peterborough",
  "Nottingham BS",
  "Pepper Money",
  "Perenna",
  "Platform Home Loans",
  "Portman BS",
  "Precise Mortgages",
  "Principality",
  "Royal Bank of Scotland",
  "Reliance Bank",
  "Saffron BS",
  "Sainsbury's Bank",
  "Santander",
  "Scottish Widows",
  "Skipton BS",
  "Smile",
  "Stafford Railway BS",
  "Suffolk BS",
  "Teachers BS",
  "Tesco Bank",
  "The Bank of East Asia",
  "The Hanley",
  "The Loughborough",
  "The Melton",
  "The Mortgage Lender",
  "Tipton & Coseley BS",
  "TSB",
  "Vernon",
  "Vida Homeloans",
  "Virgin Money",
  "West Bromwich BS",
  "Woolwich / Barclays",
  "Yorkshire BS",
  "Yorkshire Bank",
  "Other Lender",
];

const transactionLabels: Record<string, string> = {
  purchase: "Property Purchase",
  sale: "Property Sale",
  sale_purchase: "Sale & Purchase",
  remortgage: "Remortgage",
};

// ─── QUESTION DEFINITIONS ─────────────────────────────────────────────────────
// Each question has an id, the step it belongs to, and a condition function
type QuestionId =
  | "transactionType"
  | "tenure"
  | "propertyValue"
  | "postcode"
  | "completionTimeline"
  | "hasMortgage"
  | "mortgageLender"
  | "isFirstTimeBuyer"
  | "isSecondHome"
  | "isBuyToLet"
  | "isNewBuild"
  | "isSharedOwnership"
  | "hasGiftedDeposit"
  | "hasHelpToBuyISA"
  | "hasLISA"
  | "isRightToBuy"
  | "buyerCount"
  | "hasMortgageOnProperty"
  | "remortgageValue"
  | "remortgageTenure";

// ─── MAIN WIZARD ──────────────────────────────────────────────────────────────
export default function QuoteWizard() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialType = (params.get("type") as WizardAnswers["transactionType"]) || "purchase";
  const createLead = trpc.leads.create.useMutation();

  // High-level step (1=Property Details, 2=Your Situation, 3=Contact)
  const [step, setStep] = useState(1);
  // Sub-question index within step 1 and step 2
  const [subQ, setSubQ] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
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
    firstName: "", lastName: "", email: "", phone: "", mortgageLender: "",
  });

  const set = (key: keyof WizardAnswers, value: unknown) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const isSale = answers.transactionType === "sale" || answers.transactionType === "sale_purchase";
  const isPurchase = answers.transactionType === "purchase" || answers.transactionType === "sale_purchase";
  const isRemortgage = answers.transactionType === "remortgage";

  // ── STEP 1 QUESTIONS ──────────────────────────────────────────────────────
  const step1Questions: Array<{ id: QuestionId; condition?: () => boolean }> = [
    { id: "transactionType" },
    { id: "tenure", condition: () => !isRemortgage },
    { id: "propertyValue" },
    { id: "postcode" },
    { id: "completionTimeline" },
  ];

  // ── STEP 2 QUESTIONS ──────────────────────────────────────────────────────
  const step2Questions: Array<{ id: QuestionId; condition?: () => boolean }> = [
    { id: "hasMortgage", condition: () => isPurchase },
    { id: "mortgageLender", condition: () => isPurchase && answers.hasMortgage === true },
    { id: "isFirstTimeBuyer", condition: () => isPurchase },
    { id: "isSecondHome", condition: () => isPurchase && answers.isFirstTimeBuyer === false },
    { id: "isNewBuild", condition: () => isPurchase },
    { id: "isSharedOwnership", condition: () => isPurchase },
    { id: "hasGiftedDeposit", condition: () => isPurchase },
    { id: "hasHelpToBuyISA", condition: () => isPurchase },
    { id: "hasLISA", condition: () => isPurchase },
    { id: "isRightToBuy", condition: () => isPurchase },
    { id: "buyerCount", condition: () => isPurchase },
    { id: "hasMortgageOnProperty", condition: () => isSale && !isPurchase },
    { id: "remortgageValue", condition: () => isRemortgage },
    { id: "remortgageTenure", condition: () => isRemortgage },
  ];

  const activeStep1Qs = step1Questions.filter((q) => !q.condition || q.condition());
  const activeStep2Qs = step2Questions.filter((q) => !q.condition || q.condition());

  const currentQuestions = step === 1 ? activeStep1Qs : step === 2 ? activeStep2Qs : [];
  const totalSubQs = currentQuestions.length;
  const currentQId = currentQuestions[subQ]?.id;

  // ── VALIDATION ────────────────────────────────────────────────────────────
  const validateCurrentQ = (): boolean => {
    const errs: Record<string, string> = {};
    if (currentQId === "propertyValue") {
      if (!answers.propertyValue || answers.propertyValue < 10000)
        errs.propertyValue = "Please enter a valid property value (minimum £10,000)";
    }
    if (currentQId === "postcode") {
      if (!answers.postcode || answers.postcode.replace(/\s/g, "").length < 5)
        errs.postcode = "Please enter a valid UK postcode";
    }
    if (currentQId === "completionTimeline") {
      if (!answers.completionTimeline)
        errs.completionTimeline = "Please select a timeline to continue";
    }
    if (step === 3) {
      if (!contactDetails.firstName.trim()) errs.firstName = "First name is required";
      if (!contactDetails.lastName.trim()) errs.lastName = "Last name is required";
      if (!contactDetails.email.includes("@")) errs.email = "Please enter a valid email address";
      if (!contactDetails.phone.trim() || contactDetails.phone.length < 10) errs.phone = "Please enter a valid phone number";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── NAVIGATION ────────────────────────────────────────────────────────────
  const goNext = () => {
    if (!validateCurrentQ()) return;

    if (step === 3) {
      sessionStorage.setItem("quoteAnswers", JSON.stringify(answers));
      sessionStorage.setItem("contactDetails", JSON.stringify(contactDetails));
      // Save lead to database (fire-and-forget — don't block navigation)
      createLead.mutate({
        firstName: contactDetails.firstName,
        lastName: contactDetails.lastName,
        email: contactDetails.email,
        phone: contactDetails.phone,
        transactionType: answers.transactionType!,
        propertyValue: answers.propertyValue!,
        postcode: answers.postcode!,
        propertyTenure: answers.tenure as any,
        isFirstTimeBuyer: answers.isFirstTimeBuyer,
        hasMortgage: answers.hasMortgage,
        mortgageLender: contactDetails.mortgageLender || undefined,
        isNewBuild: answers.isNewBuild,
        isSharedOwnership: answers.isSharedOwnership,
        isGiftedDeposit: answers.hasGiftedDeposit,
        hasHelpToBuyIsa: answers.hasHelpToBuyISA,
        isRightToBuy: answers.isRightToBuy,
        isBuyToLet: answers.isBuyToLet,
        isSecondHome: answers.isSecondHome,
        numberOfBuyers: answers.buyerCount,
        hasMortgageOnSale: answers.hasMortgageOnProperty,
        movingTimeline: answers.completionTimeline,
      });
      navigate("/results");
      return;
    }

    setDirection("forward");
    setErrors({});

    if (step < 3 && subQ < totalSubQs - 1) {
      // Move to next sub-question within same step
      setSubQ((s) => s + 1);
    } else {
      // Move to next high-level step
      setStep((s) => s + 1);
      setSubQ(0);
    }
  };

  const goBack = () => {
    setErrors({});
    setDirection("backward");

    if (step === 1 && subQ === 0) {
      navigate("/");
      return;
    }

    if (subQ > 0) {
      setSubQ((s) => s - 1);
    } else {
      // Go back to previous step, last sub-question
      const prevStep = step - 1;
      const prevQs = prevStep === 1 ? activeStep1Qs : activeStep2Qs;
      setStep(prevStep);
      setSubQ(prevQs.length - 1);
    }
  };

  // ── QUESTION RENDERER ─────────────────────────────────────────────────────
  const renderQuestion = (qId: QuestionId) => {
    switch (qId) {
      case "transactionType":
        return (
          <div>
            <QLabel subtitle="This determines which questions we ask and how your quote is calculated.">
              What type of transaction is this?
            </QLabel>
            <div className="grid grid-cols-2 gap-3">
              {(["purchase", "sale", "sale_purchase"] as const).map((t) => (
                <OptionBtn key={t} label={transactionLabels[t]} selected={answers.transactionType === t}
                  onClick={() => set("transactionType", t)} fullWidth />
              ))}
            </div>
          </div>
        );

      case "tenure":
        return (
          <div>
            <QLabel
              tooltip="Freehold means you own the property and land outright. Leasehold means you own the property for a fixed term but not the land — additional legal work is required."
              subtitle="This affects your legal fees."
            >
              What is the property tenure?
            </QLabel>
            <div className="flex flex-col gap-3">
              <OptionBtn label="Freehold" selected={answers.tenure === "freehold"} onClick={() => set("tenure", "freehold")} fullWidth />
              <OptionBtn label="Leasehold" selected={answers.tenure === "leasehold"} onClick={() => set("tenure", "leasehold")} fullWidth />
            </div>
          </div>
        );

      case "propertyValue":
        return (
          <div>
            <QLabel subtitle="Used to calculate your Stamp Duty Land Tax (SDLT) and Land Registry fee.">
              {isRemortgage ? "What is the current value of the property?" : "What is the purchase / sale price of the property?"}
            </QLabel>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold"
                style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'JetBrains Mono', monospace" }}>£</span>
              <input
                type="number"
                value={answers.propertyValue || ""}
                onChange={(e) => set("propertyValue", Number(e.target.value))}
                placeholder="350000"
                className="w-full pl-8 pr-4 py-4 rounded-xl text-lg border-2 outline-none transition-all"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  borderColor: errors.propertyValue ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = errors.propertyValue ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)")}
              />
            </div>
            {errors.propertyValue && <p className="text-xs mt-2" style={{ color: "oklch(0.577 0.245 27.325)", fontFamily: "'DM Sans', sans-serif" }}>{errors.propertyValue}</p>}
          </div>
        );

      case "postcode":
        return (
          <div>
            <QLabel subtitle="Used to match you with conveyancers who operate in your area.">
              What is the property postcode?
            </QLabel>
            <PostcodeInput value={answers.postcode || ""} onChange={(v) => set("postcode", v)} />
            {errors.postcode && <p className="text-xs mt-2" style={{ color: "oklch(0.577 0.245 27.325)", fontFamily: "'DM Sans', sans-serif" }}>{errors.postcode}</p>}
          </div>
        );

      case "completionTimeline":
        return (
          <div>
            <QLabel subtitle="This helps conveyancers understand your urgency.">
              When do you expect to complete?
            </QLabel>
            <div className="flex flex-col gap-2">
              {TIMELINES.map((t) => (
                <OptionBtn key={t} label={t} selected={answers.completionTimeline === t}
                  onClick={() => set("completionTimeline", t)} fullWidth />
              ))}
            </div>
            {errors.completionTimeline && <p className="text-xs mt-2" style={{ color: "oklch(0.577 0.245 27.325)", fontFamily: "'DM Sans', sans-serif" }}>{errors.completionTimeline}</p>}
          </div>
        );

      case "hasMortgage":
        return (
          <div>
            <QLabel
              tooltip="If you are using a mortgage, your conveyancer will also act for your lender, which incurs an additional fee."
              subtitle="This affects your legal fees."
            >
              Are you using a mortgage to fund the purchase?
            </QLabel>
            <div className="flex flex-col gap-3">
              <OptionBtn label="Yes" selected={answers.hasMortgage === true} onClick={() => set("hasMortgage", true)} fullWidth />
              <OptionBtn label="No" selected={answers.hasMortgage === false} onClick={() => set("hasMortgage", false)} fullWidth />
            </div>
          </div>
        );

      case "mortgageLender":
        return (
          <div>
            <QLabel subtitle="Your conveyancer needs to be on your lender's approved panel.">
              Which mortgage lender are you using?
            </QLabel>
            <select
              value={contactDetails.mortgageLender}
              onChange={(e) => setContactDetails((prev) => ({ ...prev, mortgageLender: e.target.value }))}
              className="w-full px-4 py-4 rounded-xl text-sm border-2 outline-none transition-all bg-white"
              style={{ fontFamily: "'DM Sans', sans-serif", borderColor: "oklch(0.88 0.015 80)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
            >
              <option value="">Select your lender...</option>
              {MORTGAGE_LENDERS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        );

      case "isFirstTimeBuyer":
        return (
          <div>
            <QLabel
              tooltip="First-time buyers may be eligible for Stamp Duty Land Tax (SDLT) relief on properties up to £625,000."
              subtitle="This affects your Stamp Duty calculation."
            >
              Are you a first-time buyer?
            </QLabel>
            <div className="flex flex-col gap-3">
              <OptionBtn label="Yes — this is my first property" selected={answers.isFirstTimeBuyer === true}
                onClick={() => { set("isFirstTimeBuyer", true); set("isBuyToLet", false); set("isSecondHome", false); }} fullWidth />
              <OptionBtn label="No — I have owned property before" selected={answers.isFirstTimeBuyer === false}
                onClick={() => set("isFirstTimeBuyer", false)} fullWidth />
            </div>
          </div>
        );

      case "isSecondHome":
        return (
          <div>
            <QLabel
              tooltip="Moving home: you are selling your current home and buying a new one — a 3% SDLT surcharge applies temporarily but may be reclaimed once your old home is sold. Additional property: you are keeping your existing home and buying another — a 5% SDLT surcharge applies."
              subtitle="Your answer determines the Stamp Duty surcharge that applies."
            >
              Are you moving home, or are you purchasing an additional property?
            </QLabel>
            <div className="flex flex-col gap-3">
              <OptionBtn
                label="Moving home"
                selected={answers.isSecondHome === true && answers.isBuyToLet !== true}
                onClick={() => { set("isSecondHome", true); set("isBuyToLet", false); }}
                fullWidth
              />
              <OptionBtn
                label="Purchasing an additional property"
                selected={answers.isBuyToLet === true}
                onClick={() => { set("isBuyToLet", true); set("isSecondHome", false); }}
                fullWidth
              />
            </div>
          </div>
        );;

      case "isNewBuild":
        return (
          <div>
            <QLabel
              tooltip="New build properties require additional legal work, including reviewing the developer's contract pack and liaising with the developer's solicitors."
              subtitle="New builds require additional legal work."
            >
              Is this a new build property?
            </QLabel>
            <div className="flex flex-col gap-3">
              <OptionBtn label="Yes — it is a new build" selected={answers.isNewBuild === true} onClick={() => set("isNewBuild", true)} fullWidth />
              <OptionBtn label="No — it is an existing property" selected={answers.isNewBuild === false} onClick={() => set("isNewBuild", false)} fullWidth />
            </div>
          </div>
        );

      case "isSharedOwnership":
        return (
          <div>
            <QLabel
              tooltip="Shared ownership means you buy a share of the property (usually 25–75%) and pay rent on the remaining share. This requires specialist legal work."
              subtitle="Specialist legal work is required for shared ownership."
            >
              Is this a shared ownership purchase?
            </QLabel>
            <div className="flex flex-col gap-3">
              <OptionBtn label="Yes — shared ownership scheme" selected={answers.isSharedOwnership === true} onClick={() => set("isSharedOwnership", true)} fullWidth />
              <OptionBtn label="No — full ownership" selected={answers.isSharedOwnership === false} onClick={() => set("isSharedOwnership", false)} fullWidth />
            </div>
          </div>
        );

      case "hasGiftedDeposit":
        return (
          <div>
            <QLabel
              tooltip="If part of your deposit is a gift (e.g. from a family member), your conveyancer will need to verify the source of funds to comply with anti-money laundering regulations."
              subtitle="Your conveyancer will need to verify the source of funds."
            >
              Are you using a gifted deposit?
            </QLabel>
            <div className="flex flex-col gap-3">
              <OptionBtn label="Yes — part of my deposit is a gift" selected={answers.hasGiftedDeposit === true} onClick={() => set("hasGiftedDeposit", true)} fullWidth />
              <OptionBtn label="No — all funds are my own" selected={answers.hasGiftedDeposit === false} onClick={() => set("hasGiftedDeposit", false)} fullWidth />
            </div>
          </div>
        );

      case "hasHelpToBuyISA":
        return (
          <div>
            <QLabel
              tooltip="If you have a Help to Buy ISA, your conveyancer will need to claim the government bonus on your behalf at completion."
              subtitle="Your conveyancer will claim the government bonus at completion."
            >
              Are you using a Help to Buy ISA?
            </QLabel>
            <div className="flex flex-col gap-3">
              <OptionBtn label="Yes" selected={answers.hasHelpToBuyISA === true} onClick={() => set("hasHelpToBuyISA", true)} fullWidth />
              <OptionBtn label="No" selected={answers.hasHelpToBuyISA === false} onClick={() => set("hasHelpToBuyISA", false)} fullWidth />
            </div>
          </div>
        );
      case "hasLISA":
        return (
          <div>
            <QLabel
              tooltip="A Lifetime ISA (LISA) can be used towards your first home purchase. Your conveyancer will need to arrange the withdrawal and claim the government bonus at completion."
              subtitle="Your conveyancer will arrange the LISA withdrawal at completion."
            >
              Are you using a Lifetime ISA (LISA)?
            </QLabel>
            <div className="flex flex-col gap-3">
              <OptionBtn label="Yes" selected={(answers as any).hasLISA === true} onClick={() => setAnswers(prev => ({ ...prev, hasLISA: true }))} fullWidth />
              <OptionBtn label="No" selected={(answers as any).hasLISA !== true} onClick={() => setAnswers(prev => ({ ...prev, hasLISA: false }))} fullWidth />
            </div>
          </div>
        );

      case "isRightToBuy":
        return (
          <div>
            <QLabel
              tooltip="Right to Buy allows council and housing association tenants to purchase their home at a discount. This requires specialist legal work."
              subtitle="Specialist legal work is required for Right to Buy."
            >
              Is this a Right to Buy purchase?
            </QLabel>
            <div className="flex flex-col gap-3">
              <OptionBtn label="Yes — Right to Buy scheme" selected={answers.isRightToBuy === true} onClick={() => set("isRightToBuy", true)} fullWidth />
              <OptionBtn label="No — standard purchase" selected={answers.isRightToBuy === false} onClick={() => set("isRightToBuy", false)} fullWidth />
            </div>
          </div>
        );

      case "buyerCount":
        return (
          <div>
            <QLabel subtitle="Joint purchases require additional identity checks for each buyer.">
              How many people are purchasing the property?
            </QLabel>
            <div className="flex flex-col gap-3">
              <select
                value={answers.buyerCount ?? 1}
                onChange={(e) => set("buyerCount", Number(e.target.value))}
                className="w-full px-4 py-3.5 rounded-xl text-sm font-medium"
                style={{
                  borderColor: "oklch(0.88 0.015 80)",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  background: "white",
                  color: "oklch(0.18 0.06 250)",
                  fontFamily: "'DM Sans', sans-serif",
                  outline: "none",
                  appearance: "auto",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
              >
                {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n === 1 ? "1 person — sole purchaser" : `${n} people`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case "hasMortgageOnProperty":
        return (
          <div>
            <QLabel
              tooltip="If there is an outstanding mortgage on the property you are selling, your conveyancer will need to redeem it at completion."
              subtitle="Your conveyancer will redeem the mortgage at completion."
            >
              Is there a mortgage on the property you are selling?
            </QLabel>
            <div className="flex flex-col gap-3">
              <OptionBtn label="Yes — there is an outstanding mortgage" selected={answers.hasMortgageOnProperty === true} onClick={() => set("hasMortgageOnProperty", true)} fullWidth />
              <OptionBtn label="No — the property is mortgage-free" selected={answers.hasMortgageOnProperty === false} onClick={() => set("hasMortgageOnProperty", false)} fullWidth />
            </div>
          </div>
        );

      case "remortgageValue":
        return (
          <div>
            <QLabel subtitle="Used to calculate your Land Registry fee.">
              What is the value of the new mortgage?
            </QLabel>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold"
                style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'JetBrains Mono', monospace" }}>£</span>
              <input
                type="number"
                value={(answers as any).newMortgageValue || ""}
                onChange={(e) => set("newMortgageValue" as any, Number(e.target.value))}
                placeholder="200000"
                className="w-full pl-8 pr-4 py-4 rounded-xl text-lg border-2 outline-none transition-all"
                style={{ fontFamily: "'JetBrains Mono', monospace", borderColor: "oklch(0.88 0.015 80)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)")}
              />
            </div>
          </div>
        );

      case "remortgageTenure":
        return (
          <div>
            <QLabel
              tooltip="Leasehold remortgages require additional legal work to obtain the freeholder's consent."
              subtitle="This affects your legal fees."
            >
              Is the property freehold or leasehold?
            </QLabel>
            <div className="flex flex-col gap-3">
              <OptionBtn label="Freehold" selected={answers.tenure === "freehold"} onClick={() => set("tenure", "freehold")} fullWidth />
              <OptionBtn label="Leasehold" selected={answers.tenure === "leasehold"} onClick={() => set("tenure", "leasehold")} fullWidth />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ── MINI PROGRESS DOTS (sub-questions) ────────────────────────────────────
  const showDots = step < 3 && totalSubQs > 1;

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
          <button onClick={() => navigate("/")} className="text-sm flex items-center gap-1"
            style={{ color: "oklch(0.975 0.008 80 / 0.5)", fontFamily: "'DM Sans', sans-serif" }}>
            <X size={14} /> Cancel
          </button>
        </div>
      </div>

      <div className="container py-12 max-w-xl mx-auto">
        {/* Transaction type badge */}
        <div className="flex items-center justify-center mb-6">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: "oklch(0.18 0.06 250 / 0.08)", color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif", border: "1px solid oklch(0.18 0.06 250 / 0.15)" }}>
            {transactionLabels[answers.transactionType || "purchase"]}
          </span>
        </div>

        <ProgressBar step={step} />

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
          {/* Gold top accent */}
          <div className="h-1" style={{ background: "linear-gradient(90deg, oklch(0.18 0.06 250), oklch(0.72 0.12 75))" }} />

          <div className="p-8">
            {/* Step header */}
            <div className="mb-6">
              <div className="text-xs font-semibold tracking-widest uppercase mb-1"
                style={{ color: "oklch(0.72 0.12 75)", fontFamily: "'DM Sans', sans-serif" }}>
                {step === 1 ? "Step 1 — Property Details" : step === 2 ? "Step 2 — Your Situation" : "Step 3 — Contact Details"}
              </div>
              {showDots && (
                <div className="flex items-center gap-1.5 mt-2">
                  {currentQuestions.map((_, i) => (
                    <div key={i} className="rounded-full transition-all duration-300"
                      style={{
                        width: i === subQ ? "20px" : "6px",
                        height: "6px",
                        background: i < subQ
                          ? "oklch(0.72 0.12 75)"
                          : i === subQ
                            ? "oklch(0.18 0.06 250)"
                            : "oklch(0.88 0.015 80)",
                      }} />
                  ))}
                  <span className="text-xs ml-1" style={{ color: "oklch(0.65 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                    {subQ + 1} of {totalSubQs}
                  </span>
                </div>
              )}
            </div>

            {/* Animated question area */}
            <div style={{ minHeight: "280px" }}>
              {step < 3 && currentQId ? (
                <QuestionSlide direction={direction} questionKey={`${step}-${subQ}-${currentQId}`}>
                  {renderQuestion(currentQId)}
                </QuestionSlide>
              ) : step === 3 ? (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>First name</label>
                      <input type="text" value={contactDetails.firstName}
                        onChange={(e) => setContactDetails((p) => ({ ...p, firstName: e.target.value }))}
                        placeholder="Jane"
                        className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none transition-all"
                        style={{ fontFamily: "'DM Sans', sans-serif", borderColor: errors.firstName ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = errors.firstName ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)")} />
                      {errors.firstName && <p className="text-xs mt-1" style={{ color: "oklch(0.577 0.245 27.325)", fontFamily: "'DM Sans', sans-serif" }}>{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Last name</label>
                      <input type="text" value={contactDetails.lastName}
                        onChange={(e) => setContactDetails((p) => ({ ...p, lastName: e.target.value }))}
                        placeholder="Smith"
                        className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none transition-all"
                        style={{ fontFamily: "'DM Sans', sans-serif", borderColor: errors.lastName ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = errors.lastName ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)")} />
                      {errors.lastName && <p className="text-xs mt-1" style={{ color: "oklch(0.577 0.245 27.325)", fontFamily: "'DM Sans', sans-serif" }}>{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-sm font-semibold mb-2 block" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Email address</label>
                    <input type="email" value={contactDetails.email}
                      onChange={(e) => setContactDetails((p) => ({ ...p, email: e.target.value }))}
                      placeholder="jane.smith@email.com"
                      className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none transition-all"
                      style={{ fontFamily: "'DM Sans', sans-serif", borderColor: errors.email ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = errors.email ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)")} />
                    {errors.email && <p className="text-xs mt-1" style={{ color: "oklch(0.577 0.245 27.325)", fontFamily: "'DM Sans', sans-serif" }}>{errors.email}</p>}
                  </div>
                  <div className="mb-6">
                    <label className="text-sm font-semibold mb-2 block" style={{ color: "oklch(0.18 0.06 250)", fontFamily: "'DM Sans', sans-serif" }}>Phone number</label>
                    <input type="tel" value={contactDetails.phone}
                      onChange={(e) => setContactDetails((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="07700 900000"
                      className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none transition-all"
                      style={{ fontFamily: "'DM Sans', sans-serif", borderColor: errors.phone ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "oklch(0.72 0.12 75)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = errors.phone ? "oklch(0.577 0.245 27.325)" : "oklch(0.88 0.015 80)")} />
                    {errors.phone && <p className="text-xs mt-1" style={{ color: "oklch(0.577 0.245 27.325)", fontFamily: "'DM Sans', sans-serif" }}>{errors.phone}</p>}
                  </div>
                  <div className="rounded-xl p-4 text-xs" style={{ background: "oklch(0.975 0.008 80)", border: "1px solid oklch(0.88 0.015 80)", color: "oklch(0.55 0.04 250)", fontFamily: "'DM Sans', sans-serif" }}>
                    By clicking "Show My Quotes" you agree to our Terms & Conditions and Privacy Policy. Your details will only be shared with the conveyancing firm you choose to instruct.
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={goBack}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all"
            style={{ color: "oklch(0.45 0.04 250)", fontFamily: "'DM Sans', sans-serif", border: "1px solid oklch(0.88 0.015 80)", background: "white" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "oklch(0.18 0.06 250)"; e.currentTarget.style.color = "oklch(0.18 0.06 250)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "oklch(0.88 0.015 80)"; e.currentTarget.style.color = "oklch(0.45 0.04 250)"; }}>
            <ChevronLeft size={16} />
            Back
          </button>

          <button onClick={goNext} className="btn-gold flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold">
            {step === 3 ? "Show My Quotes" : subQ === totalSubQs - 1 ? "Continue to Next Step" : "Next Question"}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
