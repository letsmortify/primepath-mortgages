// ─── BANK RATES & POLICIES ───────────────────────────────────────────────────
// To update rates: ONLY edit this file. Nothing else needs to change.
// Last updated: March 2026 (Source: LiveMint, Goodreturns, Bank websites)

export const BANK_POLICIES = {
  sbi: {
    name: 'State Bank of India', shortName: 'SBI', category: 'Government',
    ltvHL: 0.80, ltvLAP: 0.70, maxDBR: 0.50,
    rateByClBIL: { excellent: 7.25, good: 7.75, fair: 8.25 },
    rateHL: 7.25, rateLAP: 8.50,
    processingFee: 0.35, processingFeeCap: 10000, processingFeeMin: 2000,
    legalFee: 5000, minCIBIL: 650, speedDays: '25-35',
    strengths: [
      'Lowest rate (7.25% for CIBIL 750+)',
      'Processing capped at ₹10,000 — saves ₹20K+ vs private banks on large loans',
      'Every RBI rate cut reflects in your EMI automatically (EBLR-linked)',
      'PMAY subsidy eligible for first-time buyers — additional ₹2.67L benefit',
    ],
  },
  pnb: {
    name: 'Punjab National Bank', shortName: 'PNB', category: 'Government',
    ltvHL: 0.80, ltvLAP: 0.65, maxDBR: 0.60,
    rateByClBIL: { excellent: 7.20, good: 7.65, fair: 8.10 },
    rateHL: 7.20, rateLAP: 8.25,
    processingFee: 0.35, processingFeeCap: null, processingFeeMin: 2500,
    legalFee: 4500, minCIBIL: 650, speedDays: '25-40',
    strengths: [
      'Lowest rate overall (7.20%) + highest repayment flexibility (60% cap)',
      'Preferred bank for Govt/PSU employees — dedicated schemes with lower rates',
      'PNB Pride scheme: pre-approved for salary account holders',
      'Lowest processing fee percentage (0.35%) among all banks',
    ],
  },
  canara: {
    name: 'Canara Bank', shortName: 'Canara', category: 'Government',
    ltvHL: 0.85, ltvLAP: 0.70, maxDBR: 0.50,
    rateByClBIL: { excellent: 7.15, good: 7.65, fair: 8.20 },
    rateHL: 7.15, rateLAP: 8.25,
    processingFee: 0.50, processingFeeCap: null, processingFeeMin: 1500,
    legalFee: 5000, minCIBIL: 650, speedDays: '25-35',
    strengths: [
      'Absolute lowest rate of all banks (7.15%) + highest LTV (85%)',
      'Women co-borrower: additional 0.05% rate discount',
      'Repo-linked — every future RBI rate cut reflects immediately',
      'Borrow the most at the lowest rate — best overall combination',
    ],
  },
  hdfc: {
    name: 'HDFC Bank', shortName: 'HDFC', category: 'Private',
    ltvHL: 0.90, ltvLAP: 0.70, maxDBR: 0.75,
    rateByClBIL: { excellent: 7.90, good: 8.30, fair: 8.70 },
    rateHL: 7.90, rateLAP: 9.25,
    processingFee: 0.50, processingFeeCap: null, processingFeeMin: 3000,
    legalFee: 7500, minCIBIL: 700, speedDays: '10-18',
    strengths: [
      'Fastest disbursal in India: 10–18 days from document submission',
      'Highest LTV at 90% — minimum down payment needed',
      'Largest APF builder network in NCR — your project likely pre-vetted',
      'Full digital process — minimal branch visits required',
    ],
  },
  icici: {
    name: 'ICICI Bank', shortName: 'ICICI', category: 'Private',
    ltvHL: 0.90, ltvLAP: 0.65, maxDBR: 0.75,
    rateByClBIL: { excellent: 7.45, good: 8.05, fair: 8.50 },
    rateHL: 7.45, rateLAP: 9.10,
    processingFee: 0.50, processingFeeCap: null, processingFeeMin: 3000,
    legalFee: 7000, minCIBIL: 700, speedDays: '12-20',
    strengths: [
      'Best private bank rate at 7.45% (CIBIL 750+, pre-approved)',
      'Step-up EMI: lower payments in early years, higher as income grows',
      'Pre-approved offers for ICICI salary account holders',
      'Best self-employed underwriting — ITR averaged over 2 years',
    ],
  },
  hsbc: {
    name: 'HSBC', shortName: 'HSBC', category: 'Multinational',
    ltvHL: 0.80, ltvLAP: 0.60, maxDBR: 0.40,
    rateByClBIL: { excellent: 8.50, good: 8.85, fair: null },
    rateHL: 8.50, rateLAP: 9.50,
    processingFee: 0.50, processingFeeCap: null, processingFeeMin: 10000,
    legalFee: 10000, minCIBIL: 750, speedDays: '15-25',
    strengths: [
      'Premium relationship banking — dedicated RM from day one',
      'NRI/foreign income acceptance — unique among banks listed',
      'Global account integration for overseas fund transfers',
    ],
  },
  standard: {
    name: 'Standard Chartered', shortName: 'StanChart', category: 'Multinational',
    ltvHL: 0.80, ltvLAP: 0.60, maxDBR: 0.40,
    rateByClBIL: { excellent: 8.60, good: 9.00, fair: null },
    rateHL: 8.60, rateLAP: 9.60,
    processingFee: 0.50, processingFeeCap: null, processingFeeMin: 10000,
    legalFee: 10000, minCIBIL: 750, speedDays: '15-25',
    strengths: [
      'Premium HNI banking — Gold/Platinum account holders get fastest track',
      'International recognition for NRI and global property portfolios',
      'Dedicated priority processing for top executive profiles',
    ],
  },
};

export const NBFC_POLICIES = {
  lic_hfl: {
    name: 'LIC Housing Finance', shortName: 'LIC HFL', category: 'NBFC-HFC',
    ltvHL: 0.75, ltvLAP: 0.60, maxDBR: 0.55,
    rateByClBIL: { excellent: 8.50, good: 8.85, fair: 9.10 },
    rateHL: 8.50, rateLAP: 10.00,
    processingFee: 0.25, processingFeeCap: null, processingFeeMin: 2500,
    legalFee: 5000, minCIBIL: 550, speedDays: '20-30',
    strengths: [
      'Accepts CIBIL from 550 — broadest eligibility of all lenders',
      'Government-backed safety — most trusted HFC in India',
      'Lowest processing fee (0.25%) among all NBFCs',
    ],
  },
  pnb_hfl: {
    name: 'PNB Housing Finance', shortName: 'PNB HFL', category: 'NBFC-HFC',
    ltvHL: 0.80, ltvLAP: 0.65, maxDBR: 0.60,
    rateByClBIL: { excellent: 8.75, good: 9.10, fair: 9.50 },
    rateHL: 8.75, rateLAP: 10.25,
    processingFee: 0.50, processingFeeCap: null, processingFeeMin: 3000,
    legalFee: 6000, minCIBIL: 611, speedDays: '15-25',
    strengths: [
      'More flexible income assessment than banks',
      'Accepts CIBIL 611+ with compensating factors',
      'Strong for self-employed — ITR + bank statement underwriting',
    ],
  },
  bajaj_hfl: {
    name: 'Bajaj Housing Finance', shortName: 'Bajaj HFL', category: 'NBFC-HFC',
    ltvHL: 0.80, ltvLAP: 0.65, maxDBR: 0.65,
    rateByClBIL: { excellent: 8.85, good: 9.25, fair: 9.75 },
    rateHL: 8.85, rateLAP: 10.50,
    processingFee: 0.40, processingFeeCap: null, processingFeeMin: 3000,
    legalFee: 6500, minCIBIL: 600, speedDays: '10-18',
    strengths: [
      'Fastest NBFC processing (10–18 days) — near-bank speed',
      'Highest repayment flexibility at 65% — good for higher obligations',
      'Strong digital journey with minimal document handling',
    ],
  },
};
