/**
 * FEE CALCULATION ENGINE
 * Based on Hoowla fee structure for Easy Choice Conveyancing
 * All fees in GBP (£)
 */

export interface WizardAnswers {
  transactionType: 'purchase' | 'sale' | 'sale_purchase' | 'remortgage';
  tenure: 'freehold' | 'leasehold';
  // Sale & Purchase split tenure
  saleTenure?: 'freehold' | 'leasehold';
  purchaseTenure?: 'freehold' | 'leasehold';
  hasMortgage: boolean;
  mortgageLender?: string;
  isFirstTimeBuyer: boolean;
  isNewBuild: boolean;
  isSharedOwnership: boolean;
  hasGiftedDeposit: boolean;
  giftCount?: number;
  hasHelpToBuyISA: boolean;
  hasLISA?: boolean;
  isRightToBuy: boolean;
  isBuyToLet: boolean;
  isSecondHome: boolean;
  propertyValue: number;
  postcode: string;
  // Sale & Purchase split price and postcode
  salePrice?: number;
  purchasePrice?: number;
  salePostcode?: string;
  purchasePostcode?: string;
  completionTimeline: string;
  buyerCount: number;
  // Sale-specific
  hasMortgageOnProperty?: boolean;
  isAuctionSale?: boolean;
  isLimitedCompanySale?: boolean;
  // Purchase-specific
  isAuctionPurchase?: boolean;
  isLimitedCompanyPurchase?: boolean;
  // Remortgage-specific
  newMortgageValue?: number;
}

export interface FirmQuote {
  id: number;
  firmName: string;
  firmLocation: string;
  rating: number;
  reviewCount: number;
  sraNumber: string;
  regulated: 'SRA' | 'CLC';
  legalFee: number;
  supplements: SupplementItem[];
  disbursements: DisbursementItem[];
  totalExVat: number;
  vat: number;
  totalIncVat: number;
  sdlt: number;
  landRegistryFee: number;
  grandTotal: number;
  speciality: string;
  yearsEstablished: number;
  accreditations: string[];
}

export interface SupplementItem {
  name: string;
  price: number;
}

export interface DisbursementItem {
  name: string;
  price: number;
  includesVat: boolean;
}

// ─── PURCHASE BASE FEES (from Hoowla) ───────────────────────────────────────
const PURCHASE_BASE_FEES = [
  { from: 0, to: 300000, fee: 525 },
  { from: 300001, to: 600000, fee: 599 },
  { from: 600001, to: 1000000, fee: 750 },
  { from: 1000001, to: Infinity, fee: 1250 },
];

// ─── SALE BASE FEES ──────────────────────────────────────────────────────────
const SALE_BASE_FEES = [
  { from: 0, to: 300000, fee: 499 },
  { from: 300001, to: 600000, fee: 599 },
  { from: 600001, to: Infinity, fee: 750 },
];

// ─── REMORTGAGE BASE FEES ────────────────────────────────────────────────────
const REMORTGAGE_BASE_FEES = [
  { from: 0, to: 250000, fee: 349 },
  { from: 250001, to: 500000, fee: 449 },
  { from: 500001, to: Infinity, fee: 599 },
];

// ─── PURCHASE SUPPLEMENTS (ex. VAT) ─────────────────────────────────────────
const PURCHASE_SUPPLEMENTS = {
  leasehold: { name: 'Leasehold Supplement', price: 149 },
  mortgage: { name: 'Mortgage / Re-mortgage', price: 234 },
  newBuild: { name: 'New Build Supplement', price: 149 },
  sharedOwnership: { name: 'Shared Ownership', price: 249 },
  giftedDeposit: { name: 'Gifted Deposit', price: 49 },
  helpToBuyISA: { name: 'Help to Buy ISA', price: 149 },
  rightToBuy: { name: 'Right to Buy', price: 149 },
  buyToLet: { name: 'Buy to Let Supplement', price: 99 },
  secondHome: { name: 'Second Home Supplement', price: 99 },
};

// ─── SALE SUPPLEMENTS (ex. VAT) ─────────────────────────────────────────────
const SALE_SUPPLEMENTS = {
  leasehold: { name: 'Leasehold Supplement', price: 149 },
  mortgagedProperty: { name: 'Mortgage Redemption', price: 149 },
};

// ─── DISBURSEMENTS (inc. VAT) ────────────────────────────────────────────────
const PURCHASE_DISBURSEMENTS: DisbursementItem[] = [
  { name: 'Anti-Money Laundering (AML) Check', price: 49, includesVat: true },
  { name: 'Search Pack (Local, Drainage & Environmental)', price: 349, includesVat: true },
  { name: 'Land Registry Searches', price: 3, includesVat: true },
  { name: 'Bankruptcy Search', price: 4, includesVat: true },
  { name: 'Electronic Transfer Fee (CHAPS)', price: 35, includesVat: true },
];

const SALE_DISBURSEMENTS: DisbursementItem[] = [
  { name: 'Anti-Money Laundering (AML) Check', price: 49, includesVat: true },
  { name: 'Official Copies (Title Register & Plan)', price: 12, includesVat: true },
  { name: 'Electronic Transfer Fee (CHAPS)', price: 35, includesVat: true },
];

const REMORTGAGE_DISBURSEMENTS: DisbursementItem[] = [
  { name: 'Anti-Money Laundering (AML) Check', price: 49, includesVat: true },
  { name: 'Land Registry Searches', price: 3, includesVat: true },
  { name: 'Electronic Transfer Fee (CHAPS)', price: 35, includesVat: true },
];

/**
 * SDLT engine — rates effective 1 April 2025
 * Mirrors https://www.stampdutycalculator.org.uk/
 *
 * Standard bands:
 *   £0–£125k   → 0%   |  £125k–£250k → 2%
 *   £250k–£925k → 5%  |  £925k–£1.5m → 10%  |  Over £1.5m → 12%
 *
 * Additional property (buy-to-let / second home): +5% on every band
 *   (surcharge raised from 3% to 5% on 31 Oct 2024)
 *   Exception: under £40k → 0% surcharge
 *
 * First-time buyer relief (from 1 Apr 2025):
 *   £0–£300k → 0%  |  £300k–£500k → 5% on portion above £300k
 *   Over £500k → full standard rates (no relief)
 */
export function calculateSDLT(
  propertyValue: number,
  isFirstTimeBuyer: boolean,
  isSecondHome: boolean,
  isBuyToLet: boolean
): number {
  if (propertyValue <= 0) return 0;

  const isAdditional = isSecondHome || isBuyToLet;

  if (isAdditional) {
    if (propertyValue < 40000) return 0;
    const bands = [
      { from: 0,       to: 125000,   rate: 0.05 },
      { from: 125000,  to: 250000,   rate: 0.07 },
      { from: 250000,  to: 925000,   rate: 0.10 },
      { from: 925000,  to: 1500000,  rate: 0.15 },
      { from: 1500000, to: Infinity, rate: 0.17 },
    ];
    let tax = 0;
    for (const band of bands) {
      if (propertyValue > band.from)
        tax += (Math.min(propertyValue, band.to) - band.from) * band.rate;
    }
    return Math.round(tax);
  }

  if (isFirstTimeBuyer) {
    if (propertyValue <= 300000) return 0;
    if (propertyValue <= 500000) return Math.round((propertyValue - 300000) * 0.05);
    // Over £500k: FTB relief lost — fall through to standard rates
  }

  const bands = [
    { from: 0,       to: 125000,   rate: 0.00 },
    { from: 125000,  to: 250000,   rate: 0.02 },
    { from: 250000,  to: 925000,   rate: 0.05 },
    { from: 925000,  to: 1500000,  rate: 0.10 },
    { from: 1500000, to: Infinity, rate: 0.12 },
  ];
  let tax = 0;
  for (const band of bands) {
    if (propertyValue > band.from)
      tax += (Math.min(propertyValue, band.to) - band.from) * band.rate;
  }
  return Math.round(tax);
}

// Land Registry Scale 1 — "Apply using the portal / Business Gateway" column
export function calculateLandRegistryFee(propertyValue: number): number {
  if (propertyValue <= 80000) return 20;
  if (propertyValue <= 100000) return 40;
  if (propertyValue <= 200000) return 100;
  if (propertyValue <= 500000) return 150;
  if (propertyValue <= 1000000) return 295;
  return 500;
}

// ─── BASE FEE LOOKUP ─────────────────────────────────────────────────────────
function getBaseFee(value: number, bands: { from: number; to: number; fee: number }[]): number {
  for (const band of bands) {
    if (value >= band.from && value <= band.to) return band.fee;
  }
  return bands[bands.length - 1].fee;
}

// ─── FIRM DATA ───────────────────────────────────────────────────────────────
const LAW_FIRMS = [
  {
    id: 1,
    firmName: 'Easy Choice Conveyancing',
    firmLocation: 'Basildon, Essex',
    rating: 4.8,
    reviewCount: 312,
    sraNumber: '12345678',
    regulated: 'SRA' as const,
    speciality: 'Residential Property Specialists',
    yearsEstablished: 12,
    accreditations: ['Law Society Conveyancing Quality Scheme', 'Lexcel Accredited'],
    feeMultiplier: 1.0,
  },
  {
    id: 2,
    firmName: 'PCS Legal',
    firmLocation: 'Basildon, Essex',
    rating: 4.6,
    reviewCount: 189,
    sraNumber: '87654321',
    regulated: 'SRA' as const,
    speciality: 'First-Time Buyer Experts',
    yearsEstablished: 8,
    accreditations: ['Law Society Conveyancing Quality Scheme'],
    feeMultiplier: 0.95,
  },
  {
    id: 3,
    firmName: 'Premier Property Law',
    firmLocation: 'London, EC2',
    rating: 4.9,
    reviewCount: 541,
    sraNumber: '11223344',
    regulated: 'SRA' as const,
    speciality: 'New Build & Leasehold Specialists',
    yearsEstablished: 22,
    accreditations: ['Law Society Conveyancing Quality Scheme', 'Lexcel Accredited', 'ISO 9001:2015'],
    feeMultiplier: 1.12,
  },
  {
    id: 4,
    firmName: 'Clarity Conveyancing',
    firmLocation: 'Birmingham, B1',
    rating: 4.5,
    reviewCount: 97,
    sraNumber: '55667788',
    regulated: 'CLC' as const,
    speciality: 'Shared Ownership & Help to Buy',
    yearsEstablished: 5,
    accreditations: ['Council for Licensed Conveyancers'],
    feeMultiplier: 0.88,
  },
  {
    id: 5,
    firmName: 'Meridian Law',
    firmLocation: 'Manchester, M1',
    rating: 4.7,
    reviewCount: 228,
    sraNumber: '99887766',
    regulated: 'SRA' as const,
    speciality: 'Buy-to-Let & Investment Property',
    yearsEstablished: 15,
    accreditations: ['Law Society Conveyancing Quality Scheme', 'ARLA Propertymark'],
    feeMultiplier: 1.05,
  },
];

// ─── MAIN QUOTE CALCULATOR ───────────────────────────────────────────────────
export function calculateQuotes(answers: WizardAnswers): FirmQuote[] {
  const { transactionType, propertyValue } = answers;
  const value = propertyValue || 0;
  const buyerCount = answers.buyerCount || 1;
  const giftCount = answers.giftCount || 0;

  return LAW_FIRMS.map((firm) => {
    let baseFee = 0;
    const supplements: SupplementItem[] = [];
    let disbursements: DisbursementItem[] = [];

    // ── BASE FEE ──
    if (transactionType === 'purchase') {
      baseFee = Math.round(getBaseFee(value, PURCHASE_BASE_FEES) * firm.feeMultiplier);
    } else if (transactionType === 'sale') {
      baseFee = Math.round(getBaseFee(value, SALE_BASE_FEES) * firm.feeMultiplier);
    } else if (transactionType === 'sale_purchase') {
      const saleFee = Math.round(getBaseFee(value, SALE_BASE_FEES) * firm.feeMultiplier);
      const purchaseFee = Math.round(getBaseFee(value, PURCHASE_BASE_FEES) * firm.feeMultiplier);
      baseFee = saleFee + purchaseFee;
    } else if (transactionType === 'remortgage') {
      const remortgageValue = answers.newMortgageValue || value;
      baseFee = Math.round(getBaseFee(remortgageValue, REMORTGAGE_BASE_FEES) * firm.feeMultiplier);
    }

    // ── SUPPLEMENTS ──
    if (transactionType === 'purchase' || transactionType === 'sale_purchase') {
      if (answers.tenure === 'leasehold') supplements.push({ ...PURCHASE_SUPPLEMENTS.leasehold, price: Math.round(PURCHASE_SUPPLEMENTS.leasehold.price * firm.feeMultiplier) });
      if (answers.hasMortgage) supplements.push({ ...PURCHASE_SUPPLEMENTS.mortgage, price: Math.round(PURCHASE_SUPPLEMENTS.mortgage.price * firm.feeMultiplier) });
      if (answers.isNewBuild) supplements.push({ ...PURCHASE_SUPPLEMENTS.newBuild, price: Math.round(PURCHASE_SUPPLEMENTS.newBuild.price * firm.feeMultiplier) });
      if (answers.isSharedOwnership) supplements.push({ ...PURCHASE_SUPPLEMENTS.sharedOwnership, price: Math.round(PURCHASE_SUPPLEMENTS.sharedOwnership.price * firm.feeMultiplier) });
      if (answers.hasGiftedDeposit) {
        // Multiply gifted deposit fee by number of gifts (minimum 1)
        const count = Math.max(1, giftCount);
        supplements.push({ ...PURCHASE_SUPPLEMENTS.giftedDeposit, name: `Gifted Deposit${count > 1 ? ` (x${count})` : ''}`, price: Math.round(PURCHASE_SUPPLEMENTS.giftedDeposit.price * firm.feeMultiplier) * count });
      }
      if (answers.hasHelpToBuyISA) supplements.push({ ...PURCHASE_SUPPLEMENTS.helpToBuyISA, price: Math.round(PURCHASE_SUPPLEMENTS.helpToBuyISA.price * firm.feeMultiplier) });
      if (answers.isRightToBuy) supplements.push({ ...PURCHASE_SUPPLEMENTS.rightToBuy, price: Math.round(PURCHASE_SUPPLEMENTS.rightToBuy.price * firm.feeMultiplier) });
      if (answers.isBuyToLet) supplements.push({ ...PURCHASE_SUPPLEMENTS.buyToLet, price: Math.round(PURCHASE_SUPPLEMENTS.buyToLet.price * firm.feeMultiplier) });
      if (answers.isSecondHome) supplements.push({ ...PURCHASE_SUPPLEMENTS.secondHome, price: Math.round(PURCHASE_SUPPLEMENTS.secondHome.price * firm.feeMultiplier) });
    }

    if (transactionType === 'sale' || transactionType === 'sale_purchase') {
      if (answers.tenure === 'leasehold') supplements.push({ ...SALE_SUPPLEMENTS.leasehold, price: Math.round(SALE_SUPPLEMENTS.leasehold.price * firm.feeMultiplier) });
      if (answers.hasMortgageOnProperty) supplements.push({ ...SALE_SUPPLEMENTS.mortgagedProperty, price: Math.round(SALE_SUPPLEMENTS.mortgagedProperty.price * firm.feeMultiplier) });
    }

    // ── DISBURSEMENTS ──
    if (transactionType === 'purchase' || transactionType === 'sale_purchase') {
      // AML and Bankruptcy Search multiply by buyer count
      disbursements = PURCHASE_DISBURSEMENTS.map(d => {
        if (d.name === 'Anti-Money Laundering (AML) Check') {
          return { ...d, name: `AML Check${buyerCount > 1 ? ` (x${buyerCount})` : ''}`, price: d.price * buyerCount };
        }
        if (d.name === 'Bankruptcy Search') {
          return { ...d, name: `Bankruptcy Search${buyerCount > 1 ? ` (x${buyerCount})` : ''}`, price: d.price * buyerCount };
        }
        return { ...d };
      });
    } else if (transactionType === 'sale') {
      disbursements = SALE_DISBURSEMENTS.map(d => {
        if (d.name === 'Anti-Money Laundering (AML) Check') {
          return { ...d, name: `AML Check${buyerCount > 1 ? ` (x${buyerCount})` : ''}`, price: d.price * buyerCount };
        }
        return { ...d };
      });
    } else if (transactionType === 'remortgage') {
      disbursements = REMORTGAGE_DISBURSEMENTS.map(d => {
        if (d.name === 'Anti-Money Laundering (AML) Check') {
          return { ...d, name: `AML Check${buyerCount > 1 ? ` (x${buyerCount})` : ''}`, price: d.price * buyerCount };
        }
        return { ...d };
      });
    }

    // ── TOTALS ──
    const supplementTotal = supplements.reduce((sum, s) => sum + s.price, 0);
    const disbursementTotal = disbursements.reduce((sum, d) => sum + d.price, 0);
    const legalFee = baseFee;
    const totalExVat = legalFee + supplementTotal;
    const vat = Math.round(totalExVat * 0.20);
    const totalIncVat = totalExVat + vat;

    // ── SDLT & LAND REGISTRY (purchase only) ──
    const sdlt = (transactionType === 'purchase' || transactionType === 'sale_purchase')
      ? calculateSDLT(value, answers.isFirstTimeBuyer, answers.isSecondHome, answers.isBuyToLet)
      : 0;

    const landRegistryFee = (transactionType === 'purchase' || transactionType === 'sale_purchase')
      ? calculateLandRegistryFee(value) * buyerCount
      : 0;

    const grandTotal = totalIncVat + disbursementTotal + sdlt + landRegistryFee;

    return {
      id: firm.id,
      firmName: firm.firmName,
      firmLocation: firm.firmLocation,
      rating: firm.rating,
      reviewCount: firm.reviewCount,
      sraNumber: firm.sraNumber,
      regulated: firm.regulated,
      legalFee,
      supplements,
      disbursements,
      totalExVat,
      vat,
      totalIncVat,
      sdlt,
      landRegistryFee,
      grandTotal,
      speciality: firm.speciality,
      yearsEstablished: firm.yearsEstablished,
      accreditations: firm.accreditations,
    };
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
