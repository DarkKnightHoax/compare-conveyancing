/**
 * FEE CALCULATION ENGINE
 * All fees in GBP (£)
 *
 * Firms: Easy Choice Conveyancing, PCS Legal, Burtons Legal Group part of David J. Fosters & Co (Solicitors), TQ Law
 *
 * Rules:
 * - Purchase fees (base + opening) are shared flat rates across all firms
 * - Sale fees (base + opening) are firm-specific flat rates
 * - Search Pack is purchase-only (not included for sale)
 * - Mortgage Redemption fee (sale, has mortgage on property) is fixed at £100
 * - TQ Law: excluded for new build only (leasehold purchase now included)
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
  isMovingHome?: boolean;
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

export interface LegBreakdown {
  legalFee: number;
  supplements: SupplementItem[];
  disbursements: DisbursementItem[];
  totalExVat: number;
  vat: number;
  totalIncVat: number;
  sdlt: number;
  landRegistryFee: number;
  subtotal: number;
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
  // For sale_purchase: separate breakdowns per leg
  purchaseBreakdown?: LegBreakdown;
  saleBreakdown?: LegBreakdown;
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

// ─── SHARED PURCHASE BASE FEE (flat rate, same for all firms) ─────────────────
const SHARED_PURCHASE_BASE_FEE = 999;

// ─── SHARED PURCHASE OPENING FEE (flat rate, same for all firms) ─────────────
const SHARED_PURCHASE_OPENING_FEE = 0; // No separate opening fee for purchase

// ─── REMORTGAGE BASE FEES ────────────────────────────────────────────────────
const REMORTGAGE_BASE_FEES = [
  { from: 0, to: 250000, fee: 349 },
  { from: 250001, to: 500000, fee: 449 },
  { from: 500001, to: Infinity, fee: 599 },
];

// ─── PURCHASE SUPPLEMENTS (ex. VAT) ─────────────────────────────────────────
const PURCHASE_SUPPLEMENTS = {
  leasehold: { name: 'Leasehold Supplement', price: 249 },
  mortgage: { name: 'Mortgage / Re-mortgage', price: 100 },
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
  leasehold: { name: 'Leasehold Supplement', price: 249 },
  mortgagedProperty: { name: 'Mortgage Redemption', price: 100 }, // Fixed at £100
};

// ─── DISBURSEMENTS (inc. VAT) ────────────────────────────────────────────────
const PURCHASE_DISBURSEMENTS: DisbursementItem[] = [
  { name: 'Anti-Money Laundering (AML) Check', price: 49, includesVat: true },
  { name: 'Search Pack (Local, Drainage & Environmental)', price: 349, includesVat: true },
  { name: 'Land Registry Searches', price: 3, includesVat: true },
  { name: 'Bankruptcy Search', price: 4, includesVat: true },
  { name: 'Electronic Transfer Fee (CHAPS)', price: 35, includesVat: true },
];

// Sale has NO Search Pack
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

// Land Registry Scale 1
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
// saleBaseFee: firm-specific flat base legal fee for sale
// saleOpeningFee: firm-specific opening fee for sale (added as a disbursement)
// purchaseBaseFee: shared flat rate (SHARED_PURCHASE_BASE_FEE) — same for all firms
// purchaseOpeningFee: shared flat rate — same for all firms (currently 0)
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
    saleBaseFee: 1200,
    saleOpeningFee: 0,
    purchaseBaseFee: 999,
    purchaseOpeningFee: 0,
    excludeLeaseholdPurchase: false,
    excludeNewBuild: false,
    // Easy Choice: left unchanged — no lender panel restriction
    lenderPanel: null as string[] | null,
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
    excludeNewBuild: false,
    saleBaseFee: 560,
    saleOpeningFee: 119,
    purchaseBaseFee: 999,
    purchaseOpeningFee: 0,
    lenderPanel: [
      'accord mortgages', 'accord buy to let', 'aldermore', 'alliance & leicester',
      'allica bank', 'april mortgages', 'atom bank', 'bank of china', 'bank of cyprus',
      'bank of scotland', 'bank of ireland', 'barclays bank uk plc', 'barnsley building society',
      'bluestone mortgages', 'bradford & bingley / mortgage express', 'buckinghamshire bs',
      'cambridge bs', 'canada life', 'chelsea bs', 'co-operative bank', 'cynergy bank',
      'danske bank', 'darlington bs', 'dudley bs', 'earl shilton bs', 'ecology bs',
      'family bs', 'furness bs', 'gatehouse bank', 'generation home loans', 'habito',
      'halifax', 'hinckley & rugby bs', 'hodge bank', 'ing', 'help to buy isa',
      'intelligent finance', 'ipswich bs', 'itl', 'landmark mortgages', 'leek united bs',
      'livemore capital', 'lloyds banking group', 'marsden bs', 'marks & spencer',
      'melton mowbray bs', 'metro bank', 'mqube', 'national counties bs', 'nationwide',
      'natwest', 'natwest international', 'newbury bs', 'nomo', 'norwich & peterborough',
      'penrith bs', 'perenna', 'pepper money', 'platform home loans', 'portman bs',
      'precise mortgages', 'principality', 'reliance bank', 'royal bank of scotland',
      'saffron bs', "sainsbury's bank", 'santander', 'scottish widows', 'skipton bs',
      'stafford railway bs', 'suffolk bs', 'tipton & coseley bs', 'the loughborough',
      'tsb', 'vida homeloans', 'vernon', 'west bromwich bs', 'woolwich / barclays',
      'yorkshire bs',
    ] as string[],
  },
  {
    id: 3,
    firmName: 'Burtons Legal Group part of David J. Fosters & Co (Solicitors)',
    firmLocation: 'London, EC2',
    rating: 4.8,
    reviewCount: 541,
    sraNumber: '11223344',
    regulated: 'SRA' as const,
    speciality: 'New Build & Leasehold Specialists',
    yearsEstablished: 22,
    accreditations: ['Law Society Conveyancing Quality Scheme', 'Lexcel Accredited', 'ISO 9001:2015'],
    saleBaseFee: 1400,
    saleOpeningFee: 550,
    purchaseBaseFee: 895,
    purchaseOpeningFee: 0,
    excludeNewBuild: false,
    lenderPanel: [
      'lloyds banking group', 'co-operative bank', 'atom bank', 'better homeownership',
      'bluestone mortgages', 'buckinghamshire bs', 'clydesdale & yorkshire bank',
      'cynergy bank', 'danske bank', 'darlington bs', 'dudley bs', 'ecology bs',
      'generation home loans', 'hanley economic building society', 'hinckley & rugby bs',
      'hsbc', 'livemore capital', 'marsden bs', 'monmouthshire bs', 'national counties bs',
      'skipton bs', 'stafford railway bs', 'tandem', 'tipton & coseley bs',
      'harpenden bs', 'moda mortgages', 'scottish building society',
    ] as string[],
  },
  {
    id: 4,
    firmName: 'TQ Law',
    firmLocation: 'Torquay, Devon',
    rating: 4.5,
    reviewCount: 97,
    sraNumber: '55667788',
    regulated: 'SRA' as const,
    speciality: 'Residential Conveyancing',
    yearsEstablished: 5,
    accreditations: ['Law Society Conveyancing Quality Scheme'],
    saleBaseFee: 499,
    saleOpeningFee: 394,
    purchaseBaseFee: 999,
    purchaseOpeningFee: 0,
    excludeLeaseholdPurchase: false,
    excludeNewBuild: true,
    lenderPanel: [
      'accord mortgages', 'aldermore', 'alliance & leicester', 'atom bank',
      'bank of china', 'bank of cyprus', 'barclays bank uk plc', 'barnsley building society',
      'bluestone mortgages', 'britannia', 'buckinghamshire bs', 'cambridge bs',
      'chelsea bs', 'chl mortgages', 'chorley bs', 'clydesdale & yorkshire bank',
      'co-operative bank', 'coventry bs', 'cumberland bs', 'cynergy bank',
      'darlington bs', 'digital bs', 'dudley bs', 'esbs', 'first direct',
      'fleet mortgages', 'foundation home loans', 'furness bs', 'generation home loans',
      'godiva', 'habito', 'hanley economic building society', 'help to buy isa',
      'hinckley & rugby bs', 'hodge bank', 'hsbc', 'ing', 'ipswich bs',
      'kent reliance', 'kensington', 'leeds bs', 'leek united bs', 'm&s bank',
      'market harborough bs', 'marsden bs', 'mansfield bs', 'melton mowbray bs',
      'metro bank', 'monmouthshire bs', 'mortgage works uk', 'mpowered',
      'national counties bs', 'nationwide', 'natwest', 'newbury bs',
      'norwich & peterborough', 'nottingham bs', 'perenna', 'precise mortgages',
      'principality', 'platform home loans', 'royal bank of scotland', 'saffron bs',
      "sainsbury's bank", 'santander', 'skipton bs', 'smile', 'suffolk bs',
      'teachers bs', 'tesco bank', 'the bank of east asia', 'the hanley',
      'the loughborough', 'the melton', 'the mortgage lender', 'tipton & coseley bs',
      'vernon', 'vida homeloans', 'virgin money', 'west bromwich bs',
      'woolwich / barclays', 'yorkshire bs', 'yorkshire bank',
    ] as string[],
  },
];

// ─── MAIN QUOTE CALCULATOR ───────────────────────────────────────────────────
export function calculateQuotes(answers: WizardAnswers): FirmQuote[] {
  const { transactionType, propertyValue } = answers;
  const value = propertyValue || 0;
  const buyerCount = answers.buyerCount || 1;
  const giftCount = answers.giftCount || 0;

  // Determine effective tenure for sale and purchase legs
  const saleTenure = answers.saleTenure ?? answers.tenure;
  const purchaseTenure = answers.purchaseTenure ?? answers.tenure;

  // Normalise the chosen lender for panel matching
  const chosenLender = (answers.mortgageLender ?? '').toLowerCase().trim();

  return LAW_FIRMS.filter((firm) => {
    // TQ Law: exclude only for new build (leasehold purchase is now allowed)
    if (firm.excludeNewBuild && answers.isNewBuild) return false;
    // Lender panel filtering removed — all 4 firms always show regardless of lender
    return true;
  }).map((firm) => {
    let baseFee = 0;
    const supplements: SupplementItem[] = [];
    let disbursements: DisbursementItem[] = [];

    // ── BASE FEE ──
    if (transactionType === 'purchase') {
      baseFee = firm.purchaseBaseFee;
    } else if (transactionType === 'sale') {
      baseFee = firm.saleBaseFee;
    } else if (transactionType === 'sale_purchase') {
      baseFee = firm.saleBaseFee + firm.purchaseBaseFee;
    } else if (transactionType === 'remortgage') {
      const remortgageValue = answers.newMortgageValue || value;
      baseFee = getBaseFee(remortgageValue, REMORTGAGE_BASE_FEES);
    }

    // ── OPENING FEE (added as a disbursement line) ──
    if (transactionType === 'sale' && firm.saleOpeningFee > 0) {
      disbursements.push({ name: 'File Opening Fee', price: firm.saleOpeningFee, includesVat: false });
    }
    if (transactionType === 'purchase' && firm.purchaseOpeningFee > 0) {
      disbursements.push({ name: 'File Opening Fee', price: firm.purchaseOpeningFee, includesVat: false });
    }
    if (transactionType === 'sale_purchase') {
      const totalOpeningFee = firm.saleOpeningFee + firm.purchaseOpeningFee;
      if (totalOpeningFee > 0) {
        disbursements.push({ name: 'File Opening Fee', price: totalOpeningFee, includesVat: false });
      }
    }

    // ── SUPPLEMENTS ──
    if (transactionType === 'purchase' || transactionType === 'sale_purchase') {
      const pTenure = transactionType === 'sale_purchase' ? purchaseTenure : answers.tenure;
      if (pTenure === 'leasehold') supplements.push({ ...PURCHASE_SUPPLEMENTS.leasehold });
      if (answers.hasMortgage) supplements.push({ ...PURCHASE_SUPPLEMENTS.mortgage });
      if (answers.isNewBuild) supplements.push({ ...PURCHASE_SUPPLEMENTS.newBuild });
      if (answers.isSharedOwnership) supplements.push({ ...PURCHASE_SUPPLEMENTS.sharedOwnership });
      if (answers.hasGiftedDeposit) {
        const count = Math.max(1, giftCount);
        supplements.push({ ...PURCHASE_SUPPLEMENTS.giftedDeposit, name: `Gifted Deposit${count > 1 ? ` (x${count})` : ''}`, price: PURCHASE_SUPPLEMENTS.giftedDeposit.price * count });
      }
      if (answers.hasHelpToBuyISA) supplements.push({ ...PURCHASE_SUPPLEMENTS.helpToBuyISA });
      if (answers.isRightToBuy) supplements.push({ ...PURCHASE_SUPPLEMENTS.rightToBuy });
      if (answers.isBuyToLet) supplements.push({ ...PURCHASE_SUPPLEMENTS.buyToLet });
      if (answers.isSecondHome) supplements.push({ ...PURCHASE_SUPPLEMENTS.secondHome });
    }

    if (transactionType === 'sale' || transactionType === 'sale_purchase') {
      const sTenure = transactionType === 'sale_purchase' ? saleTenure : answers.tenure;
      if (sTenure === 'leasehold') supplements.push({ ...SALE_SUPPLEMENTS.leasehold });
      if (answers.hasMortgageOnProperty) supplements.push({ ...SALE_SUPPLEMENTS.mortgagedProperty });
    }

    // ── DISBURSEMENTS ──
    if (transactionType === 'purchase' || transactionType === 'sale_purchase') {
      const purchaseDisbursements = PURCHASE_DISBURSEMENTS.map(d => {
        if (d.name === 'Anti-Money Laundering (AML) Check') {
          return { ...d, name: `AML Check${buyerCount > 1 ? ` (x${buyerCount})` : ''}`, price: d.price * buyerCount };
        }
        if (d.name === 'Bankruptcy Search') {
          return { ...d, name: `Bankruptcy Search${buyerCount > 1 ? ` (x${buyerCount})` : ''}`, price: d.price * buyerCount };
        }
        return { ...d };
      });
      disbursements = [...disbursements, ...purchaseDisbursements];
    }

    if (transactionType === 'sale') {
      const saleDisbursements = SALE_DISBURSEMENTS.map(d => {
        if (d.name === 'Anti-Money Laundering (AML) Check') {
          return { ...d, name: `AML Check${buyerCount > 1 ? ` (x${buyerCount})` : ''}`, price: d.price * buyerCount };
        }
        return { ...d };
      });
      disbursements = [...disbursements, ...saleDisbursements];
    }

    if (transactionType === 'remortgage') {
      const remortgageDisbursements = REMORTGAGE_DISBURSEMENTS.map(d => {
        if (d.name === 'Anti-Money Laundering (AML) Check') {
          return { ...d, name: `AML Check${buyerCount > 1 ? ` (x${buyerCount})` : ''}`, price: d.price * buyerCount };
        }
        return { ...d };
      });
      disbursements = [...disbursements, ...remortgageDisbursements];
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

    // LR fee: per transaction, NOT per buyer
    const landRegistryFee = (transactionType === 'purchase' || transactionType === 'sale_purchase')
      ? calculateLandRegistryFee(value)
      : 0;

    const grandTotal = totalIncVat + disbursementTotal + sdlt + landRegistryFee;

    // ── SALE_PURCHASE: build separate per-leg breakdowns for display ──
    let purchaseBreakdown: LegBreakdown | undefined;
    let saleBreakdown: LegBreakdown | undefined;

    if (transactionType === 'sale_purchase') {
      // Purchase leg
      const pSupplements: SupplementItem[] = [];
      if (purchaseTenure === 'leasehold') pSupplements.push({ ...PURCHASE_SUPPLEMENTS.leasehold });
      if (answers.hasMortgage) pSupplements.push({ ...PURCHASE_SUPPLEMENTS.mortgage });
      if (answers.isNewBuild) pSupplements.push({ ...PURCHASE_SUPPLEMENTS.newBuild });
      if (answers.isSharedOwnership) pSupplements.push({ ...PURCHASE_SUPPLEMENTS.sharedOwnership });
      if (answers.hasGiftedDeposit) {
        const count = Math.max(1, giftCount);
        pSupplements.push({ ...PURCHASE_SUPPLEMENTS.giftedDeposit, name: `Gifted Deposit${count > 1 ? ` (x${count})` : ''}`, price: PURCHASE_SUPPLEMENTS.giftedDeposit.price * count });
      }
      if (answers.hasHelpToBuyISA) pSupplements.push({ ...PURCHASE_SUPPLEMENTS.helpToBuyISA });
      if (answers.isRightToBuy) pSupplements.push({ ...PURCHASE_SUPPLEMENTS.rightToBuy });
      if (answers.isBuyToLet) pSupplements.push({ ...PURCHASE_SUPPLEMENTS.buyToLet });
      if (answers.isSecondHome) pSupplements.push({ ...PURCHASE_SUPPLEMENTS.secondHome });

      const pDisbursements: DisbursementItem[] = PURCHASE_DISBURSEMENTS.map(d => {
        if (d.name === 'Anti-Money Laundering (AML) Check') return { ...d, name: `AML Check${buyerCount > 1 ? ` (x${buyerCount})` : ''}`, price: d.price * buyerCount };
        if (d.name === 'Bankruptcy Search') return { ...d, name: `Bankruptcy Search${buyerCount > 1 ? ` (x${buyerCount})` : ''}`, price: d.price * buyerCount };
        return { ...d };
      });
      if (firm.purchaseOpeningFee > 0) pDisbursements.unshift({ name: 'File Opening Fee', price: firm.purchaseOpeningFee, includesVat: false });

      const pLegalFee = firm.purchaseBaseFee;
      const pSupplementTotal = pSupplements.reduce((s, x) => s + x.price, 0);
      const pDisbursementTotal = pDisbursements.reduce((s, x) => s + x.price, 0);
      const pTotalExVat = pLegalFee + pSupplementTotal;
      const pVat = Math.round(pTotalExVat * 0.20);
      const pTotalIncVat = pTotalExVat + pVat;
      const pSdlt = calculateSDLT(value, answers.isFirstTimeBuyer, answers.isSecondHome, answers.isBuyToLet);
      const pLrFee = calculateLandRegistryFee(value);
      purchaseBreakdown = { legalFee: pLegalFee, supplements: pSupplements, disbursements: pDisbursements, totalExVat: pTotalExVat, vat: pVat, totalIncVat: pTotalIncVat, sdlt: pSdlt, landRegistryFee: pLrFee, subtotal: pTotalIncVat + pDisbursementTotal + pSdlt + pLrFee };

      // Sale leg
      const saleValue = answers.salePrice || value;
      const sSupplements: SupplementItem[] = [];
      if (saleTenure === 'leasehold') sSupplements.push({ ...SALE_SUPPLEMENTS.leasehold });
      if (answers.hasMortgageOnProperty) sSupplements.push({ ...SALE_SUPPLEMENTS.mortgagedProperty });

      const sDisbursements: DisbursementItem[] = SALE_DISBURSEMENTS.map(d => {
        if (d.name === 'Anti-Money Laundering (AML) Check') return { ...d, name: `AML Check${buyerCount > 1 ? ` (x${buyerCount})` : ''}`, price: d.price * buyerCount };
        return { ...d };
      });
      if (firm.saleOpeningFee > 0) sDisbursements.unshift({ name: 'File Opening Fee', price: firm.saleOpeningFee, includesVat: false });

      const sLegalFee = firm.saleBaseFee;
      const sSupplementTotal = sSupplements.reduce((s, x) => s + x.price, 0);
      const sDisbursementTotal = sDisbursements.reduce((s, x) => s + x.price, 0);
      const sTotalExVat = sLegalFee + sSupplementTotal;
      const sVat = Math.round(sTotalExVat * 0.20);
      const sTotalIncVat = sTotalExVat + sVat;
      saleBreakdown = { legalFee: sLegalFee, supplements: sSupplements, disbursements: sDisbursements, totalExVat: sTotalExVat, vat: sVat, totalIncVat: sTotalIncVat, sdlt: 0, landRegistryFee: 0, subtotal: sTotalIncVat + sDisbursementTotal };
    }

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
      purchaseBreakdown,
      saleBreakdown,
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
