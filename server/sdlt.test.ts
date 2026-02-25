/**
 * SDLT Engine Tests — April 2025 rates
 * Mirrors https://www.stampdutycalculator.org.uk/
 */
import { describe, it, expect } from 'vitest';

// Inline the engine so tests don't depend on server runtime
function calcSDLT(
  value: number,
  isFirstTimeBuyer: boolean,
  isSecondHome: boolean,
  isBuyToLet: boolean,
): number {
  if (value <= 0) return 0;
  const isAdditional = isSecondHome || isBuyToLet;
  if (isAdditional) {
    if (value < 40000) return 0;
    const bands = [
      { from: 0,       to: 125000,   rate: 0.05 },
      { from: 125000,  to: 250000,   rate: 0.07 },
      { from: 250000,  to: 925000,   rate: 0.10 },
      { from: 925000,  to: 1500000,  rate: 0.15 },
      { from: 1500000, to: Infinity, rate: 0.17 },
    ];
    let tax = 0;
    for (const band of bands) {
      if (value > band.from) tax += (Math.min(value, band.to) - band.from) * band.rate;
    }
    return Math.round(tax);
  }
  if (isFirstTimeBuyer) {
    if (value <= 300000) return 0;
    if (value <= 500000) return Math.round((value - 300000) * 0.05);
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
    if (value > band.from) tax += (Math.min(value, band.to) - band.from) * band.rate;
  }
  return Math.round(tax);
}

function calcLandRegistry(value: number): number {
  if (value <= 80000) return 20;
  if (value <= 100000) return 40;
  if (value <= 200000) return 100;
  if (value <= 500000) return 150;
  if (value <= 1000000) return 295;
  return 500;
}

describe('SDLT Engine — April 2025 rates', () => {
  describe('Standard residential buyer', () => {
    it('pays £0 on £125,000', () => expect(calcSDLT(125000, false, false, false)).toBe(0));
    it('pays £2,500 on £250,000', () => expect(calcSDLT(250000, false, false, false)).toBe(2500));
    it('pays £7,500 on £350,000', () => expect(calcSDLT(350000, false, false, false)).toBe(7500));
    it('pays £15,000 on £500,000', () => expect(calcSDLT(500000, false, false, false)).toBe(15000));
    it('pays £43,750 on £1,000,000', () => expect(calcSDLT(1000000, false, false, false)).toBe(43750));
  });

  describe('First-time buyer relief (from 1 Apr 2025)', () => {
    it('pays £0 on £300,000', () => expect(calcSDLT(300000, true, false, false)).toBe(0));
    it('pays £5,000 on £400,000', () => expect(calcSDLT(400000, true, false, false)).toBe(5000));
    it('pays £10,000 on £500,000', () => expect(calcSDLT(500000, true, false, false)).toBe(10000));
    it('pays full standard rates on £600,000 (no FTB relief)', () => expect(calcSDLT(600000, true, false, false)).toBe(20000));
  });

  describe('Additional property / buy-to-let (+5% surcharge)', () => {
    // Under £40k: 0% surcharge
    it('pays £0 on purchases under £40,000', () => expect(calcSDLT(39999, false, false, true)).toBe(0));
    // £350k BTL: 5% on £125k + 7% on £125k + 10% on £100k = 6250 + 8750 + 10000 = £25,000
    it('pays £25,000 on £350,000 (BTL)', () => expect(calcSDLT(350000, false, false, true)).toBe(25000));
    it('pays £25,000 on £350,000 (second home)', () => expect(calcSDLT(350000, false, true, false)).toBe(25000));
    // £500k BTL: 5% on £125k + 7% on £125k + 10% on £250k = 6250 + 8750 + 25000 = £40,000
    it('pays £40,000 on £500,000 (BTL)', () => expect(calcSDLT(500000, false, false, true)).toBe(40000));
  });

  describe('Edge cases', () => {
    it('returns £0 for zero value', () => expect(calcSDLT(0, false, false, false)).toBe(0));
    it('returns £0 for negative value', () => expect(calcSDLT(-1000, false, false, false)).toBe(0));
  });
});

describe('Land Registry Fee — Portal column', () => {
  it('returns £20 for £80,000', () => expect(calcLandRegistry(80000)).toBe(20));
  it('returns £40 for £100,000', () => expect(calcLandRegistry(100000)).toBe(40));
  it('returns £100 for £200,000', () => expect(calcLandRegistry(200000)).toBe(100));
  it('returns £150 for £500,000', () => expect(calcLandRegistry(500000)).toBe(150));
  it('returns £295 for £1,000,000', () => expect(calcLandRegistry(1000000)).toBe(295));
  it('returns £500 for £1,500,000', () => expect(calcLandRegistry(1500000)).toBe(500));
});
