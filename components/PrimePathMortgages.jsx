import React, { useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// ─── SUPABASE (fire-and-forget — never blocks UI) ───────────────────────────
const supabaseUrl = 'https://rbbktlpaijkozfenyrsf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiYmt0bHBhaWprb3pmZW55cnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNzYxNDAsImV4cCI6MjA4Nzg1MjE0MH0.vB2LOysAyOO3u6iUg5w6pa7dmXGq0G2fwCicpWKv5w8';
let supabase = null;
try { supabase = createClient(supabaseUrl, supabaseAnonKey); } catch (e) { console.warn('Supabase init failed:', e); }

const saveLeadAsync = (payload) => {
  // Fire-and-forget: results show instantly, DB save happens in background
  if (!supabase) return;
  supabase.from('leads').insert([payload])
    .then(({ error }) => { if (error) console.warn('Lead save failed (non-critical):', error.message); else console.log('✅ Lead saved'); })
    .catch(e => console.warn('Lead save error (non-critical):', e.message));
};

// ─── APF BUILDER LIST (Tier 1 NCR builders — bank-approved projects) ────────
const APF_BUILDERS_TIER1 = [
  'dlf', 'godrej', 'tata', 'm3m', 'sobha', 'lodha', 'prestige', 'brigade',
  'shapoorji', 'puravankara', 'mahindra', 'birla', 'embassy', 'oberoi',
  'ats', 'gaurs', 'gaur', 'mahagun', 'supertech', 'ace', 'panchsheel',
  'nirala', 'ajnara', 'wave', 'gulshan', 'paras', 'antriksh', 'eldeco',
  'ansals', 'ansal', 'vatika', 'emaar', 'raheja', 'rps', 'signature global',
  'signature', 'whiteland', 'elan', 'conscient', 'bestech', 'cbey', 'cbree'
];

const FLAGGED_BUILDERS = ['unitech', 'amrapali', 'jaypee', 'jp infra', 'jp infratech'];

const checkAPFStatus = (builderName) => {
  if (!builderName) return 'unknown';
  const lower = builderName.toLowerCase();
  if (FLAGGED_BUILDERS.some(f => lower.includes(f))) return 'flagged';
  if (APF_BUILDERS_TIER1.some(b => lower.includes(b))) return 'approved';
  return 'unknown';
};

// ─── BANK POLICIES ───────────────────────────────────────────────────────────
// MNC maxDBR corrected to 0.40 (strict internal cap)
// Added legalFee (₹) and processingSpeedDays
const BANK_POLICIES = {
  sbi: {
    name:'State Bank of India', shortName:'SBI', category:'Government',
    ltvHL:0.80, ltvLAP:0.70, maxDBR:0.50,
    rateByClBIL:{ excellent:7.25, good:7.75, fair:8.25 },
    rateHL:7.25, rateLAP:8.50,
    processingFee:0.35, processingFeeCap:10000, processingFeeMin:2000,
    legalFee:5000, minCIBIL:650, speedDays:'25-35',
    strengths:['Lowest rate (7.25% for CIBIL 750+)','Processing capped at ₹10,000 — saves ₹20K+ vs private banks','Every RBI rate cut reflects in your EMI (EBLR-linked)','PMAY subsidy eligible for first-time buyers']
  },
  pnb: {
    name:'Punjab National Bank', shortName:'PNB', category:'Government',
    ltvHL:0.80, ltvLAP:0.65, maxDBR:0.60,
    rateByClBIL:{ excellent:7.20, good:7.65, fair:8.10 },
    rateHL:7.20, rateLAP:8.25,
    processingFee:0.35, processingFeeCap:null, processingFeeMin:2500,
    legalFee:4500, minCIBIL:650, speedDays:'25-40',
    strengths:['Lowest rate overall (7.20%) + highest flexibility (60% cap)','Preferred bank for Govt/PSU employees — dedicated schemes','No processing fee cap — percentage lowest at 0.35%','PNB Pride scheme: pre-approved for salary account holders']
  },
  canara: {
    name:'Canara Bank', shortName:'Canara', category:'Government',
    ltvHL:0.85, ltvLAP:0.70, maxDBR:0.50,
    rateByClBIL:{ excellent:7.15, good:7.65, fair:8.20 },
    rateHL:7.15, rateLAP:8.25,
    processingFee:0.50, processingFeeCap:null, processingFeeMin:1500,
    legalFee:5000, minCIBIL:650, speedDays:'25-35',
    strengths:['Lowest rate of all banks (7.15%) + highest LTV (85%)','Women co-borrower: additional 0.05% discount','Repo-linked — every future RBI cut reflects immediately','Borrow the most at the lowest rate — best combination']
  },
  hdfc: {
    name:'HDFC Bank', shortName:'HDFC', category:'Private',
    ltvHL:0.90, ltvLAP:0.70, maxDBR:0.75,
    rateByClBIL:{ excellent:7.90, good:8.30, fair:8.70 },
    rateHL:7.90, rateLAP:9.25,
    processingFee:0.50, processingFeeCap:null, processingFeeMin:3000,
    legalFee:7500, minCIBIL:700, speedDays:'10-18',
    strengths:['Fastest disbursal in India: 10–18 days','Highest LTV at 90% — minimum down payment needed','Largest APF builder network in NCR','Full digital process — minimal branch visits']
  },
  icici: {
    name:'ICICI Bank', shortName:'ICICI', category:'Private',
    ltvHL:0.90, ltvLAP:0.65, maxDBR:0.75,
    rateByClBIL:{ excellent:7.45, good:8.05, fair:8.50 },
    rateHL:7.45, rateLAP:9.10,
    processingFee:0.50, processingFeeCap:null, processingFeeMin:3000,
    legalFee:7000, minCIBIL:700, speedDays:'12-20',
    strengths:['Best private bank rate at 7.45% (CIBIL 750+, pre-approved)','Step-up EMI: lower payments early, higher as income grows','Pre-approved for ICICI salary account holders','Best self-employed underwriting — ITR averaged over 2 years']
  },
  hsbc: {
    name:'HSBC', shortName:'HSBC', category:'Multinational',
    ltvHL:0.80, ltvLAP:0.60, maxDBR:0.40,
    rateByClBIL:{ excellent:8.50, good:8.85, fair:null },
    rateHL:8.50, rateLAP:9.50,
    processingFee:0.50, processingFeeCap:null, processingFeeMin:10000,
    legalFee:10000, minCIBIL:750, speedDays:'15-25',
    strengths:['Premium relationship banking — dedicated RM from day one','NRI/foreign income acceptance','Global account integration for overseas fund transfers']
  },
  standard: {
    name:'Standard Chartered', shortName:'StanChart', category:'Multinational',
    ltvHL:0.80, ltvLAP:0.60, maxDBR:0.40,
    rateByClBIL:{ excellent:8.60, good:9.00, fair:null },
    rateHL:8.60, rateLAP:9.60,
    processingFee:0.50, processingFeeCap:null, processingFeeMin:10000,
    legalFee:10000, minCIBIL:750, speedDays:'15-25',
    strengths:['Premium HNI banking — Gold/Platinum holders get fastest track','International recognition for NRI and global property portfolios','Dedicated priority processing for top executive profiles']
  },
};
// ─── NBFC / HFC POLICIES (triggered when CIBIL < 650) ───────────────────────
const NBFC_POLICIES = {
  lic_hfl:   { name: 'LIC Housing Finance',   shortName: 'LIC HFL',  category: 'NBFC-HFC', ltvHL: 0.75, ltvLAP: 0.60, maxDBR: 0.55, processingFee: 0.25, legalFee: 5000,  rateHL: 9.10, rateLAP: 10.00, speedDays: '20-30', minCIBIL: 550, strengths: ['Accepts CIBIL from 550+', 'Government backed HFC', 'Long track record', 'Low processing fee'] },
  pnb_hfl:   { name: 'PNB Housing Finance',   shortName: 'PNB HFL',  category: 'NBFC-HFC', ltvHL: 0.80, ltvLAP: 0.65, maxDBR: 0.60, processingFee: 0.50, legalFee: 6000,  rateHL: 9.25, rateLAP: 10.25, speedDays: '15-25', minCIBIL: 611, strengths: ['Flexible underwriting', 'Good for self-employed', 'Accepts CIBIL 611+'] },
  bajaj_hfl: { name: 'Bajaj Housing Finance', shortName: 'Bajaj HFL', category: 'NBFC-HFC', ltvHL: 0.80, ltvLAP: 0.65, maxDBR: 0.65, processingFee: 0.40, legalFee: 6500,  rateHL: 9.35, rateLAP: 10.50, speedDays: '10-18', minCIBIL: 600, strengths: ['Fast digital processing', 'Flexible FOIR (65%)', 'Strong self-employed products'] },
};

// ─── NCR MICRO-MARKET DATA ───────────────────────────────────────────────────
const NCR_MICROMARKETS = {
  gurugram: [
    { id: 'new-gurugram', name: 'New Gurugram', sectors: 'Sectors 70-115', avgPrice: 10350, luxuryAvg: 16624, growth: '+34% YoY', temp: 'hot', rentalMin: 35000, rentalMax: 75000, rentalGrowth: '+4% YoY', rentalYield: 3.2, highlights: ['11,300+ units launched in 2024 — highest in NCR', 'Proposed Gurugram Metro Phase 5 alignment', 'Strong IT/corporate employment belt', '50% of NCR 2025 launches were in Gurugram', 'Well-planned sector roads & green spaces'] },
    { id: 'dwarka-exp', name: 'Dwarka Expressway', sectors: 'Sectors 99-113', avgPrice: 11000, luxuryAvg: 16693, growth: '+100% since 2019', temp: 'hot', rentalMin: 40000, rentalMax: 90000, rentalGrowth: '+12% YoY', rentalYield: 3.5, highlights: ['Operational 8-lane Dwarka Expressway (2024)', '15–20 min drive to IGI Airport', 'Upcoming metro connectivity', '89% ultra-luxury launches in corridor', '37% share of Gurugram H1 2025 new launches'] },
    { id: 'golf-ext', name: 'Golf Course Extension', sectors: 'Sectors 58-68', avgPrice: 19500, luxuryAvg: 26000, growth: '+21% YoY', temp: 'warm', rentalMin: 80000, rentalMax: 200000, rentalGrowth: '+8% YoY', rentalYield: 2.8, highlights: ['Premium corridor — Golf Course Road to SPR', '53% of Gurugram H1 2025 luxury launches', 'Rising HNI & NRI demand', 'Capital values: ₹26,000–₹60,000 psf'] },
    { id: 'sohna-road', name: 'Sohna Road', sectors: 'Sectors 47-49, 88', avgPrice: 17400, growth: '+30% YoY', temp: 'hot', rentalMin: 45000, rentalMax: 120000, rentalGrowth: '+6% YoY', rentalYield: 3.0, highlights: ['SPR corridor — connects Golf Course Ext to NH-48', 'Mixed-use development', 'Popular with mid-to-premium segment buyers'] },
    { id: 'old-gurugram', name: 'Old Gurugram / DLF Phases', sectors: 'DLF Phase 1-4', avgPrice: 19000, luxuryAvg: 28900, growth: '+9% YoY', temp: 'warm', rentalMin: 60000, rentalMax: 180000, rentalGrowth: '+6% YoY', rentalYield: 2.5, highlights: ['Most mature Gurugram market', 'DLF flagship projects', 'Best social infrastructure in Gurugram'] },
    { id: 'sohna', name: 'Sohna (South Gurugram)', sectors: 'Sohna town', avgPrice: 6000, growth: '+193% new launches', temp: 'hot', rentalMin: 15000, rentalMax: 35000, rentalGrowth: '+5% YoY', rentalYield: 3.8, highlights: ['Upcoming affordable-mid segment hub', 'Haryana RERA approved projects increasing', 'Best value entry point in Gurugram'] },
  ],
  noida: [
    { id: 'central-noida', name: 'Central Noida', sectors: 'Sectors 15-50', avgPrice: 16000, growth: '+9% YoY', temp: 'warm', rentalMin: 30000, rentalMax: 70000, rentalGrowth: '+3% YoY', rentalYield: 2.8, highlights: ['Established city centre', 'Noida Metro (Blue Line) full coverage', 'Top schools & hospitals nearby'] },
    { id: 'noida-sectors-51-100', name: 'Mid Noida', sectors: 'Sectors 51-100', avgPrice: 14000, growth: '+10% YoY', temp: 'warm', rentalMin: 25000, rentalMax: 60000, rentalGrowth: '+3% YoY', rentalYield: 2.9, highlights: ['Metro via Aqua Line', 'Growing IT park presence (Sec 62, 63)', 'Active resale market'] },
    { id: 'noida-exp', name: 'Noida Expressway', sectors: 'Sectors 74-137', avgPrice: 13400, growth: '+10% YoY', temp: 'warm', rentalMin: 38500, rentalMax: 69500, rentalGrowth: '+3% YoY', rentalYield: 3.1, highlights: ['IT parks, MNC offices hub', 'Aqua Line metro coverage', 'C&W avg rent ₹38,500–₹69,500/mo'] },
    { id: 'sector-150', name: 'Sector 150 Zone', sectors: 'Sectors 100-149', avgPrice: 10000, growth: '+24% YoY', temp: 'hot', rentalMin: 28000, rentalMax: 55000, rentalGrowth: '+3% YoY', rentalYield: 3.4, highlights: ['60% open space — greenest planned sector', 'Luxury projects: ATS, Godrej, Tata, Prateek', 'Savills: capital values rising 7%'] },
    { id: 'new-noida', name: 'New Noida / South', sectors: 'Sectors 150-168', avgPrice: 8450, growth: '+24% YoY', temp: 'hot', rentalMin: 20000, rentalMax: 45000, rentalGrowth: '+5% YoY', rentalYield: 3.6, highlights: ['20,000 acre new township planned', 'Jewar Airport metro connectivity upcoming', 'Best entry point in premium Noida zone'] },
    { id: 'gr-noida-west', name: 'Greater Noida West', sectors: 'Tech Zone IV, KP V', avgPrice: 8450, growth: '+150% new launches', temp: 'hot', rentalMin: 18000, rentalMax: 38000, rentalGrowth: '+5% YoY', rentalYield: 3.7, highlights: ['Highest new launch volume NCR 2024', 'Aqua Line extension proposed', 'First-time buyer & investor favourite'] },
  ],
  'greater-noida': [
    { id: 'gnw-main', name: 'Greater Noida West', sectors: 'Tech Zone IV, Knowledge Park', avgPrice: 8450, growth: '+24% YoY', temp: 'hot', rentalMin: 18000, rentalMax: 40000, rentalGrowth: '+5% YoY', rentalYield: 3.6, highlights: ['Most affordable new-launch hub NCR 2024', 'Knowledge Park proximity', 'Strong RERA compliance post-2017'] },
    { id: 'yamuna-exp', name: 'Yamuna Expressway', sectors: 'Sectors near Jewar Airport', avgPrice: 4500, growth: 'Airport impact zone', temp: 'hot', rentalMin: 12000, rentalMax: 28000, rentalGrowth: '+8% YoY', rentalYield: 4.0, highlights: ['Noida International Airport (Jewar) by 2026', 'Formula 1 circuit & film city nearby', 'Highest long-term appreciation potential NCR'] },
    { id: 'gnida-sectors', name: 'Greater Noida Central', sectors: 'Alpha, Beta, Gamma sectors', avgPrice: 7000, growth: '+8% YoY', temp: 'warm', rentalMin: 15000, rentalMax: 35000, rentalGrowth: '+4% YoY', rentalYield: 3.2, highlights: ['Established GNIDA planned sectors', 'Wide roads & green belts', 'Stable end-user driven market'] },
  ],
  delhi: [
    { id: 'south-delhi', name: 'South Delhi', sectors: 'Saket, GK 1&2, Defence Colony', avgPrice: 22000, luxuryAvg: 52500, growth: '+8% YoY', temp: 'warm', rentalMin: 159500, rentalMax: 253000, rentalGrowth: '+4% YoY', rentalYield: 2.2, highlights: ['Most prestigious belt — limited supply', 'Capital values ₹40,250–₹65,500 psf', 'HNI & NRI demand driving values'] },
    { id: 'west-delhi', name: 'West Delhi', sectors: 'Dwarka, Janakpuri, Rajouri Garden', avgPrice: 14800, growth: '+11% YoY', temp: 'warm', rentalMin: 25000, rentalMax: 60000, rentalGrowth: '+4% YoY', rentalYield: 2.8, highlights: ['Dwarka — Blue & Magenta metro lines', '15 min to IGI Airport', 'Strong middle-class demand'] },
    { id: 'north-delhi', name: 'North Delhi', sectors: 'Rohini, Pitampura, Model Town', avgPrice: 13500, growth: '+10% YoY', temp: 'warm', rentalMin: 20000, rentalMax: 50000, rentalGrowth: '+3% YoY', rentalYield: 2.6, highlights: ["Rohini — Delhi's largest planned sub-city", 'Red Line Metro entire belt', 'Affordable vs South & West Delhi'] },
    { id: 'east-delhi', name: 'East Delhi', sectors: 'Laxmi Nagar, Mayur Vihar, IP Ext', avgPrice: 12000, growth: '+9% YoY', temp: 'warm', rentalMin: 18000, rentalMax: 45000, rentalGrowth: '+3% YoY', rentalYield: 2.9, highlights: ['Most affordable Delhi zone', 'Blue Line Metro border-to-border', 'Popular with Noida IT professionals'] },
    { id: 'north-west-delhi', name: 'North-West Delhi', sectors: 'Paschim Vihar, Shalimar Bagh', avgPrice: 15000, growth: '+9% YoY', temp: 'warm', rentalMin: 22000, rentalMax: 55000, rentalGrowth: '+3% YoY', rentalYield: 2.7, highlights: ['Paschim Vihar — well-planned colony', 'Pink Line Metro — Shalimar Bagh', 'Popular with Government employees'] },
    { id: 'central-delhi', name: 'Central Delhi', sectors: 'Karol Bagh, Civil Lines, Lutyens', avgPrice: 18000, luxuryAvg: 82750, growth: '+7% YoY', temp: 'warm', rentalMin: 348500, rentalMax: 585500, rentalGrowth: '+3% YoY', rentalYield: 2.0, highlights: ['Lutyens Delhi — ultra-HNI zone', 'Capital values ₹82,750–₹1,33,500 psf', 'Strictest building bye-laws — very limited supply'] },
  ],
  ghaziabad: [
    { id: 'indirapuram', name: 'Indirapuram', sectors: 'Shakti Khand, Niti Khand', avgPrice: 7500, growth: '+8% YoY', temp: 'warm', rentalMin: 18000, rentalMax: 40000, rentalGrowth: '+4% YoY', rentalYield: 3.1, highlights: ['Most established Ghaziabad hub', 'NH-24 Bypass to Delhi & Noida', 'Active resale market'] },
    { id: 'vaishali', name: 'Vaishali / Vasundhara', sectors: 'Sectors 1-6', avgPrice: 6800, growth: '+9% YoY', temp: 'warm', rentalMin: 15000, rentalMax: 35000, rentalGrowth: '+3% YoY', rentalYield: 3.0, highlights: ['Vaishali Metro (Blue Line) — direct to Delhi', 'Affordable first-home market', 'Close to Delhi border'] },
    { id: 'raj-nagar-ext', name: 'Raj Nagar Extension', sectors: 'NH-58 corridor', avgPrice: 4500, growth: '+12% YoY', temp: 'hot', rentalMin: 10000, rentalMax: 25000, rentalGrowth: '+5% YoY', rentalYield: 3.8, highlights: ['Fastest growing affordable segment', 'Township projects by Gaurs, Mahagun, ATS', 'Best price-to-space ratio in NCR'] },
    { id: 'crossings-rep', name: 'Crossings Republik', sectors: 'NH-24 Belt', avgPrice: 5500, growth: '+14% YoY', temp: 'hot', rentalMin: 12000, rentalMax: 28000, rentalGrowth: '+5% YoY', rentalYield: 3.5, highlights: ['Integrated township — self-sufficient living', 'NH-24: direct Delhi in 40 min', 'Affordable end-user driven market'] },
    { id: 'siddharth-vihar', name: 'Siddharth Vihar / Tronica City', sectors: 'Upcoming zone', avgPrice: 4000, growth: '+18% YoY', temp: 'hot', rentalMin: 8000, rentalMax: 20000, rentalGrowth: '+6% YoY', rentalYield: 4.0, highlights: ['Emerging zone — early entry opportunity', 'Lowest price per sqft in NCR', 'Ideal 5–7 year horizon'] },
  ],
  faridabad: [
    { id: 'nhpc-nit', name: 'NIT / NHPC Area', sectors: 'Central Faridabad', avgPrice: 6800, growth: '+7% YoY', temp: 'warm', rentalMin: 15000, rentalMax: 35000, rentalGrowth: '+3% YoY', rentalYield: 3.0, highlights: ['Oldest established belt', 'Violet Line Metro connectivity', 'Government employees hub'] },
    { id: 'sector-15-21', name: 'Sectors 15-21', sectors: 'Old Faridabad', avgPrice: 7200, growth: '+6% YoY', temp: 'warm', rentalMin: 16000, rentalMax: 38000, rentalGrowth: '+3% YoY', rentalYield: 2.8, highlights: ['Well-established residential sectors', 'KMP Expressway connectivity', 'Popular with local business families'] },
    { id: 'greater-faridabad', name: 'Greater Faridabad', sectors: 'Sectors 75-89', avgPrice: 5500, growth: '+10% YoY', temp: 'warm', rentalMin: 12000, rentalMax: 28000, rentalGrowth: '+4% YoY', rentalYield: 3.3, highlights: ['New planned zone — modern infra', 'Affordable vs Gurgaon & Noida', 'KMP Expressway access'] },
    { id: 'neharpar', name: 'Neharpar / Greenfield', sectors: 'Sectors 88-96, F-G Road', avgPrice: 4500, growth: '+12% YoY', temp: 'hot', rentalMin: 10000, rentalMax: 24000, rentalGrowth: '+5% YoY', rentalYield: 3.8, highlights: ['Fastest growing zone Faridabad', 'Faridabad-Gurgaon Road — direct Gurugram access', 'Entry-level investment zone'] },
  ],
};

// ─── VALIDATION CONSTANTS ─────────────────────────────────────────────────────
const LIMITS = {
  minLoan: 3000000, maxLoan: 150000000, minIncome: 15000, maxIncome: 10000000,
  minPropertyValue: 1000000, maxPropertyValue: 500000000, minEMI: 0, maxEMI: 5000000,
};

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate DBR (Debt-Burden Ratio = existing EMI / gross income)
 */
const calcDBR = (existingEMI, income) => (parseInt(existingEMI) || 0) / parseInt(income);

/**
 * Calculate self-equity percentage silently
 */
const calcSelfEquity = (propertyValue, loanAmountNeeded) =>
  (parseInt(propertyValue) - parseInt(loanAmountNeeded)) / parseInt(propertyValue);

/**
 * Convert CIBIL range string to numeric midpoint for calculations
 */
const cibilToNum = (range) => {
  if (range === '750+') return 780;
  if (range === '700-749') return 725;
  if (range === '650-699') return 675;
  return 580; // below-650
};

/**
 * Determine profile tier: Gold / Silver / Standard
 */
const calcProfileTier = ({ currentDBR, cibilRange, employmentType, missedPayments12m, missedPayments5y, isAPFApproved, selfEquityPct }) => {
  const cibil = cibilToNum(cibilRange);
  const isSteady = employmentType === 'govt-salaried' || employmentType === 'private-salaried';
  const hasMissed = missedPayments12m === 'yes' || missedPayments5y === 'yes';
  const hasDeviation = selfEquityPct < 0.15;

  // Standard: Any hard negative
  if (currentDBR > 0.55 || hasMissed || (hasDeviation && !isAPFApproved) || cibil < 650) return 'Standard';

  // Gold: Comfortable DBR, stable employment, APF, good CIBIL
  if (currentDBR < 0.40 && cibil >= 750 && isSteady && isAPFApproved) return 'Gold';
  if (currentDBR < 0.40 && cibil >= 750 && isSteady) return 'Gold';

  // Silver: Everything in between
  return 'Silver';
};

/**
 * HARD FILTER: Returns { pass: bool, reason: string }
 * Eliminates banks where customer has ZERO chance of approval
 */
const hardFilter = (bank, { currentDBR, cibilRange, selfEquityPct, employmentType, customerAge, loanTenure }) => {
  const age = parseInt(customerAge) || 30;
  const tenure = parseInt(loanTenure) || 20;
  const isSalaried = employmentType === 'govt-salaried' || employmentType === 'private-salaried';
  const maxEndAge = isSalaried ? 60 : 70;

  // 1. Age + tenure hard stop (RBI / bank policy)
  if (age + tenure > maxEndAge) {
    return { pass: false, reason: `Age (${age}) + tenure (${tenure}yr) = ${age+tenure} exceeds max end-age ${maxEndAge} for ${isSalaried ? 'salaried' : 'self-employed'}` };
  }

  // 2. MNC banks: strict 40% DBR cap
  if (bank.category === 'Multinational' && currentDBR > 0.40) {
    return { pass: false, reason: `DBR ${(currentDBR*100).toFixed(0)}% exceeds MNC banks' strict 40% cap` };
  }

  // 3. MNC banks: self equity < 15% = deviation case
  if (bank.category === 'Multinational' && selfEquityPct < 0.15) {
    return { pass: false, reason: `Self equity ${(selfEquityPct*100).toFixed(0)}% below 15% — MNC banks classify this as a deviation case` };
  }

  // 4. CIBIL < 650: eliminate Private & MNC banks entirely
  if (cibilToNum(cibilRange) < 650 && (bank.category === 'Private' || bank.category === 'Multinational')) {
    return { pass: false, reason: `CIBIL below 650 — not eligible for ${bank.category} banks` };
  }

  // 5. General DBR exceeds bank's cap
  if (currentDBR > bank.maxDBR) {
    return { pass: false, reason: `DBR ${(currentDBR*100).toFixed(0)}% exceeds ${bank.shortName}'s ${(bank.maxDBR*100).toFixed(0)}% limit` };
  }

  return { pass: true, reason: '' };
};

/**
 * WEIGHTED MATCH SCORE
 * Score = (Rate×40%) + (Eligibility×30%) + (Cost×20%) + (Speed×10%)
 * Each component normalized 0–100 across ALL banks
 */
const calcMatchScore = (bank, profile, allBanks, loanType) => {
  const rates    = allBanks.map(b => loanType === 'HL' ? b.rateHL : b.rateLAP);
  const fees     = allBanks.map(b => b.processingFee);
  const speeds   = allBanks.map(b => parseInt(b.speedDays));

  const minRate  = Math.min(...rates);
  const maxRate  = Math.max(...rates);
  const minFee   = Math.min(...fees);
  const maxFee   = Math.max(...fees);
  const minSpeed = Math.min(...speeds);
  const maxSpeed = Math.max(...speeds);

  const bankRate  = loanType === 'HL' ? bank.rateHL : bank.rateLAP;
  const bankSpeed = parseInt(bank.speedDays);

  // Rate score: lower is better
  const rateScore = maxRate === minRate ? 100 : ((maxRate - bankRate) / (maxRate - minRate)) * 100;

  // Eligibility score: DBR headroom + CIBIL fit
  const dbrHeadroom = bank.maxDBR - profile.currentDBR;
  let eligScore = 0;
  if (dbrHeadroom > 0.25) eligScore += 55;
  else if (dbrHeadroom > 0.15) eligScore += 40;
  else if (dbrHeadroom > 0.05) eligScore += 25;
  const cibil = cibilToNum(profile.cibilRange);
  if (cibil >= 780) eligScore += 45;
  else if (cibil >= 750) eligScore += 35;
  else if (cibil >= 700) eligScore += 22;
  else if (cibil >= 650) eligScore += 10;
  eligScore = Math.min(eligScore, 100);

  // Cost score: lower fee is better
  const costScore = maxFee === minFee ? 100 : ((maxFee - bank.processingFee) / (maxFee - minFee)) * 100;

  // Speed score: lower days is better
  const speedScore = maxSpeed === minSpeed ? 100 : ((maxSpeed - bankSpeed) / (maxSpeed - minSpeed)) * 100;

  // Customer preference multiplier
  const pref = profile.customerPreference;
  let rateW = 0.40, eligW = 0.30, costW = 0.20, speedW = 0.10;
  if (pref === 'rate')    { rateW = 0.55; eligW = 0.25; costW = 0.15; speedW = 0.05; }
  if (pref === 'speed')   { speedW = 0.30; rateW = 0.30; eligW = 0.25; costW = 0.15; }
  if (pref === 'cost')    { costW = 0.35; rateW = 0.35; eligW = 0.20; speedW = 0.10; }
  if (pref === 'service') { speedW = 0.20; rateW = 0.35; eligW = 0.30; costW = 0.15; }

  return Math.round((rateScore * rateW) + (eligScore * eligW) + (costScore * costW) + (speedScore * speedW));
};

/**
 * Generate human-readable "Why matched" reason
 */
const generateMatchReason = (bank, profile, profileTier) => {
  const { employmentType, cibilRange, currentDBR, customerPreference, isAPFApproved } = profile;
  const cibil = cibilToNum(cibilRange);

  if (bank.category === 'Government' && (employmentType === 'govt-salaried')) {
    return `Matched because your Government job gives you preferred status — PSU banks offer the lowest rates to Govt employees`;
  }
  if (bank.shortName === 'PNB' && currentDBR > 0.40) {
    return `Matched because PNB allows the highest DBR (60%) among Govt banks — ideal for your income-to-EMI ratio`;
  }
  if (bank.category === 'Private' && cibil >= 750 && customerPreference === 'speed') {
    return `Matched because your CIBIL ${cibilRange} qualifies you for ${bank.shortName}'s fastest disbursement (${bank.speedDays} days)`;
  }
  if (bank.category === 'Private' && isAPFApproved) {
    return `Matched because your builder is APF-approved — ${bank.shortName} has pre-vetted this project, cutting documentation time significantly`;
  }
  if (bank.category === 'Multinational' && profileTier === 'Gold') {
    return `Matched because your Gold profile (high CIBIL + low DBR) unlocks ${bank.shortName}'s premium home loan product`;
  }
  if (bank.category === 'Multinational' && cibil >= 750 && currentDBR < 0.30) {
    return `Matched because ${bank.shortName} targets premium borrowers — your profile meets their strict eligibility floor`;
  }
  if (bank.category === 'NBFC-HFC') {
    return `Matched because ${bank.shortName} specialises in borrowers building their credit profile — more flexible underwriting than banks`;
  }
  if (customerPreference === 'rate' && bank.category === 'Government') {
    return `Matched because your priority is lowest rate — Govt banks offer rates ${(bank.rateHL).toFixed(2)}% p.a., saving lakhs over tenure`;
  }
  if (cibil >= 780) {
    return `Matched because your excellent CIBIL (750+) qualifies you for ${bank.shortName}'s best rate tier`;
  }
  return `Matched based on your overall financial profile — DBR headroom, CIBIL and property type align with ${bank.shortName}'s criteria`;
};

/**
 * Calculate total upfront cost (RBI compliant: APR disclosure)
 */
const calcUpfrontCosts = (bank, loanAmount) => {
  let processingFee = Math.round(loanAmount * bank.processingFee / 100);
  if (bank.processingFeeCap) processingFee = Math.min(processingFee, bank.processingFeeCap);
  if (bank.processingFeeMin) processingFee = Math.max(processingFee, bank.processingFeeMin);
  const gstOnFee = Math.round(processingFee * 0.18);
  const legalFee = bank.legalFee || 7500;
  const technicalFee = 3500;
  return { processingFee, gstOnFee, legalFee, technicalFee, total: processingFee + gstOnFee + legalFee + technicalFee };
};

// ─── MAIN ENGINE: matchBanks() ────────────────────────────────────────────────
const matchBanks = (layer1Data, layer2Data) => {
  const income        = parseInt(layer1Data.monthlyIncome);
  const existingEMI   = parseInt(layer1Data.existingEMIs) || 0;
  const propertyValue = parseInt(layer2Data.propertyValue);
  const loanNeeded    = parseInt(layer1Data.loanAmountNeeded);
  const loanType      = layer2Data.loanType;

  const currentDBR    = calcDBR(existingEMI, income);
  const selfEquityPct = calcSelfEquity(propertyValue, loanNeeded);

  // APF status from builder name
  const apfStatus     = layer2Data.propertyCategory === 'builder-new'
    ? checkAPFStatus(layer2Data.builderName)
    : 'n/a'; // resale / LAP — APF not applicable
  const isAPFApproved = apfStatus === 'approved';
  const isLowCIBIL    = cibilToNum(layer1Data.cibilRange) < 650;

  const profile = {
    currentDBR, selfEquityPct, isAPFApproved, apfStatus,
    cibilRange: layer1Data.cibilRange,
    employmentType: layer1Data.employmentType,
    customerPreference: layer1Data.customerPreference,
    customerAge: layer1Data.customerAge,
    loanTenure: layer1Data.loanTenure,
    missedPayments12m: layer1Data.missedPayments12m,
    missedPayments5y: layer1Data.missedPayments5y,
    loanType,
  };

  const profileTier = calcProfileTier(profile);

  // Customer repayment capacity (A)
  const maxDBRForCalc   = layer1Data.employmentType === 'govt-salaried' ? 0.60 : 0.50;
  const availForNewLoan = (income * maxDBRForCalc) - existingEMI;
  const mRate           = 8.5 / 12 / 100;
  const tenureMonths    = parseInt(layer1Data.loanTenure || 20) * 12;
  const customerCapacity = Math.max(0, Math.round(
    availForNewLoan * ((Math.pow(1+mRate, tenureMonths)-1) / (mRate * Math.pow(1+mRate, tenureMonths)))
  ));

  // Property ceiling (B) — apply 5% safety buffer on LTV
  const avgLTV         = (loanType === 'HL' ? 0.80 : 0.70) - 0.05; // 5% buffer
  const propertyCeiling = Math.round(propertyValue * avgLTV);

  const finalEligibleAmount = Math.min(customerCapacity, propertyCeiling);

  // Select pool: NBFCs for low CIBIL, regular banks otherwise
  const bankPool = isLowCIBIL
    ? Object.entries(NBFC_POLICIES)
    : Object.entries(BANK_POLICIES);

  const allBankValues = bankPool.map(([, b]) => b);

  const matched = [];
  const eliminated = [];

  bankPool.forEach(([key, bank]) => {
    const filter = hardFilter(bank, profile);

    if (!filter.pass) {
      eliminated.push({ ...bank, eliminationReason: filter.reason });
      return;
    }

    const matchScore  = calcMatchScore(bank, profile, allBankValues, loanType);
    const bankLTV     = (loanType === 'HL' ? bank.ltvHL : bank.ltvLAP) - 0.05; // 5% buffer
    const bankMaxLoan = Math.min(propertyValue * bankLTV, finalEligibleAmount);

    const bRate       = loanType === 'HL' ? bank.rateHL : bank.rateLAP;
    const bMonthly    = bRate / 12 / 100;
    const emi         = bankMaxLoan * (bMonthly * Math.pow(1+bMonthly,tenureMonths)) / (Math.pow(1+bMonthly,tenureMonths)-1);

    const costs       = calcUpfrontCosts(bank, bankMaxLoan);
    const matchReason = generateMatchReason(bank, profile, profileTier);

    // Approval probability: matchScore adjusted for hard disqualifiers
    const approvalProbability = Math.min(Math.round(matchScore * 0.95), 95);

    // APF penalty: -30 points if builder not APF approved (only for new builder HL)
    let adjustedScore = matchScore;
    if (loanType === 'HL' && layer2Data.propertyCategory === 'builder-new' && !isAPFApproved && apfStatus !== 'n/a') {
      adjustedScore = Math.max(0, matchScore - 30);
    }

    matched.push({
      ...bank, key, loanAmount: Math.round(bankMaxLoan),
      emi: Math.round(emi), interestRate: bRate,
      matchScore: adjustedScore, approvalProbability,
      costs, matchReason, isAPFApproved, apfStatus,
      ltv: (bankLTV * 100).toFixed(0),
    });
  });

  matched.sort((a, b) => b.matchScore - a.matchScore);

  return {
    customerCapacity, propertyCeiling, finalEligibleAmount,
    limitingFactor: customerCapacity < propertyCeiling ? 'income' : 'property',
    profileTier, currentDBR, selfEquityPct, isAPFApproved, apfStatus,
    isLowCIBIL, matches: matched, eliminated,
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const PrimePathMortgages = () => {
  const [currentLayer, setCurrentLayer] = useState('intro');
  const [layer1Data, setLayer1Data] = useState({
    employmentType: '', customerPreference: '', customerAge: '', loanAmountNeeded: '',
    monthlyIncome: '', loanTenure: '20', existingEMIs: '', borrowerType: '',
    missedPayments12m: '', missedPayments5y: '', cibilRange: '',
  });
  const [layer2Data, setLayer2Data] = useState({
    loanType: '', propertySubType: '', propertyUsage: '', propertyCategory: '',
    decidingDocument: '', propertyValue: '', propertyLocation: '', microMarket: '',
    buildingSocietyName: '', exactSector: '', builderName: '', bhkConfig: '',
    propertyAge: '', carpetArea: '',
  });
  const [results, setResults] = useState(null);
  const [kycData, setKycData] = useState({ name: '', phone: '', email: '', agreedToTerms: false, consentToContact: false });
  const [showKycGate, setShowKycGate] = useState(false);

  // ── Layer 1 Submit ──────────────────────────────────────────────────────────
  const handleLayer1Submit = () => {
    const required = ['employmentType','customerPreference','customerAge','loanAmountNeeded','monthlyIncome','loanTenure','existingEMIs','borrowerType','missedPayments12m','missedPayments5y','cibilRange'];
    if (!required.every(f => layer1Data[f] !== '')) { alert('❌ Please fill all fields to continue'); return; }
    const loan = parseInt(layer1Data.loanAmountNeeded);
    const income = parseInt(layer1Data.monthlyIncome);
    const emi = parseInt(layer1Data.existingEMIs) || 0;
    if (loan < LIMITS.minLoan || loan > LIMITS.maxLoan) { alert('❌ Loan amount must be between ₹30L and ₹15 Cr'); return; }
    if (income < LIMITS.minIncome || income > LIMITS.maxIncome) { alert('❌ Monthly income must be between ₹15K and ₹1 Cr/month'); return; }
    const warnings = [];
    if ((emi/income) > 0.4) warnings.push('⚠️ Existing EMIs are >40% of income — this significantly reduces eligibility');
    if (layer1Data.missedPayments12m === 'yes') warnings.push('⚠️ Recent missed payments will impact approval chances');
    if (warnings.length > 0 && !confirm(`${warnings.join('\n\n')}\n\nContinue?`)) return;
    setCurrentLayer('layer2');
  };

  // ── Layer 2 Submit ──────────────────────────────────────────────────────────
  const handleLayer2Submit = () => {
    const required = ['loanType','propertySubType','propertyCategory','decidingDocument','propertyValue','propertyLocation'];
    if (!required.every(f => layer2Data[f] !== '')) { alert('❌ Please fill all required fields'); return; }
    if (layer2Data.propertyCategory === 'resale' && !layer2Data.propertyUsage) { alert('❌ Please specify current property usage'); return; }
    const propValue = parseInt(layer2Data.propertyValue);
    if (propValue < LIMITS.minPropertyValue || propValue > LIMITS.maxPropertyValue) { alert('❌ Property value must be between ₹10L and ₹50 Cr'); return; }
    if (parseInt(layer1Data.loanAmountNeeded) > propValue) { alert('❌ Loan amount cannot exceed property value'); return; }
    // Self-equity warning
    const equity = calcSelfEquity(propValue, parseInt(layer1Data.loanAmountNeeded));
    if (equity < 0.10) { alert('❌ Self-equity below 10% — no bank can fund this loan. Please increase your down payment or reduce loan amount.'); return; }
    if (equity < 0.15 && !confirm(`⚠️ Your self-equity is only ${(equity*100).toFixed(0)}%. MNC banks will classify this as a deviation case and may not process.\n\nContinue anyway?`)) return;
    if (layer2Data.propertyUsage === 'commercial' && !confirm('⚠️ Commercial use detected — requires special bank approval. Continue?')) return;
    if (layer2Data.loanType === 'LAP') { setShowKycGate(true); }
    else if (layer2Data.microMarket) { setCurrentLayer('propertyInsights'); }
    else { setShowKycGate(true); }
  };

  // ── KYC Submit — fire-and-forget Supabase ───────────────────────────────────
  const handleKycSubmit = () => {
    if (!kycData.name || !kycData.phone || !kycData.email) { alert('❌ Please provide name, phone and email'); return; }
    if (!kycData.agreedToTerms) { alert('❌ Please agree to Terms of Service'); return; }
    if (!kycData.consentToContact) { alert('❌ Please consent to be contacted'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(kycData.email)) { alert('❌ Invalid email address'); return; }
    if (!/^[6-9]\d{9}$/.test(kycData.phone)) { alert('❌ Invalid 10-digit mobile number'); return; }

    // Calculate results IMMEDIATELY — no waiting for Supabase
    const matchResults = matchBanks(layer1Data, layer2Data);
    setResults(matchResults);
    setShowKycGate(false);
    setCurrentLayer('results');

    // Save to DB in background — user already sees results
    saveLeadAsync({
      email: kycData.email, phone: kycData.phone, name: kycData.name,
      consent_given: kycData.consentToContact,
      employment_type: layer1Data.employmentType, customer_age: parseInt(layer1Data.customerAge),
      monthly_salary: parseInt(layer1Data.monthlyIncome), loan_amount_needed: parseInt(layer1Data.loanAmountNeeded),
      loan_tenure: parseInt(layer1Data.loanTenure), current_emis: parseInt(layer1Data.existingEMIs) || 0,
      cibil_range: layer1Data.cibilRange, customer_preference: layer1Data.customerPreference,
      city: layer2Data.propertyLocation, property_type: layer2Data.propertySubType,
      property_category: layer2Data.propertyCategory, property_value: parseInt(layer2Data.propertyValue),
      micro_market: layer2Data.microMarket || null, building_name: layer2Data.buildingSocietyName || null,
      builder_name: layer2Data.builderName || null, exact_sector: layer2Data.exactSector || null,
      bhk_config: layer2Data.bhkConfig || null, carpet_area: layer2Data.carpetArea ? parseInt(layer2Data.carpetArea) : null,
      property_age: layer2Data.propertyAge || null,
      eligibility_score: matchResults.matches[0]?.matchScore || 0,
      max_loan_amount: matchResults.finalEligibleAmount,
      matched_bank: matchResults.matches[0]?.name || null,
      status: 'new',
      notes: `Tier:${matchResults.profileTier} | DBR:${(matchResults.currentDBR*100).toFixed(0)}% | APF:${matchResults.apfStatus} | Top:${matchResults.matches.slice(0,2).map(m=>`${m.shortName}(${m.matchScore})`).join(',')}`,
    });
  };

  // ── RENDER INTRO ─────────────────────────────────────────────────────────────
  const renderIntro = () => (
    <div className="intro-container"><div className="intro-content">
      <h1>Stop Trusting. Start Knowing.</h1>
      <p className="intro-subtitle">The only loan platform that shows you what banks WON'T tell you.</p>
      <div className="problem-cards">
        {[{icon:'🏦',t:'Your Bank',d:'Long process. Rigid criteria. No transparency on why you were rejected.'},
          {icon:'🤝',t:'Agents',d:'Hidden fees. Push you to banks that pay them the highest commission.'},
          {icon:'🔍',t:'Internet Search',d:"Confusing. Outdated. Can't tell you YOUR exact eligibility."}
        ].map(c=><div key={c.t} className="problem-card"><div className="problem-icon bad">{c.icon}</div><h3>{c.t}</h3><p>{c.d}</p></div>)}
      </div>
      <div className="solution-card">
        <div className="solution-icon">✨</div><h2>We Built the 4th Path</h2>
        <ul>
          <li><CheckCircle size={20}/> Know EXACT loan amount — not estimates</li>
          <li><CheckCircle size={20}/> 3-layer engine: Hard filters → Suitability → Match score</li>
          <li><CheckCircle size={20}/> Match with Govt / Private / MNC banks or NBFCs</li>
          <li><CheckCircle size={20}/> Total transparency. Zero agent tricks.</li>
        </ul>
      </div>
      <button className="cta-button" onClick={()=>setCurrentLayer('layer1')}>Start Your Assessment <ArrowRight size={20}/></button>
      <p className="trust-line">Used by 2,000+ NCR borrowers. Zero spam. No agents involved.</p>
    </div></div>
  );

  // ── RENDER LAYER 1 ───────────────────────────────────────────────────────────
  const renderLayer1 = () => {
    const radioCard = (name, val, emoji, title, desc, stateKey, state, setState) => (
      <label key={val} className="radio-card" style={{borderColor:state[stateKey]===val?'#2563eb':'#e2e8f0',background:state[stateKey]===val?'#eff6ff':'white'}}>
        <input type="radio" name={name} value={val} checked={state[stateKey]===val} onChange={e=>setState({...state,[stateKey]:e.target.value})}/>
        <div><strong>{emoji} {title}</strong><p>{desc}</p></div>
      </label>
    );
    return (
      <div className="layer-container"><div className="layer-header">
        <div className="layer-badge">Layer 1 of 2</div><h2>Your Financial Profile</h2>
        <p>We need to understand your repayment capacity first</p>
      </div><div className="form-section">
        <div className="input-group"><label>👤 What best describes your employment?</label><span className="hint">Determines which bank categories you qualify for</span>
          <div className="radio-group vertical" style={{marginTop:'8px'}}>
            {[{val:'govt-salaried',e:'🏛️',t:'Salaried — Government / PSU',d:'Central/State Govt, PSU, Defence, Railways'},
              {val:'private-salaried',e:'🏢',t:'Salaried — Private Company',d:'MNC, Indian corporate, startup employee'},
              {val:'professional',e:'🩺',t:'Self-Employed Professional',d:'Doctor, Lawyer, CA, Consultant, Architect'},
              {val:'employer',e:'🏭',t:'Self-Employed Business Owner',d:'Manufacturer, Trader, Own account worker'},
            ].map(o=>radioCard('employmentType',o.val,o.e,o.t,o.d,'employmentType',layer1Data,setLayer1Data))}
          </div>
        </div>
        <div className="input-group"><label>🎯 What matters most to you?</label><span className="hint">Adjusts the match score weighting for your priority</span>
          <div className="radio-group vertical" style={{marginTop:'8px'}}>
            {[{val:'rate',e:'💰',t:'Lowest Interest Rate',d:'Save ₹2-5L over loan tenure'},
              {val:'speed',e:'⚡',t:'Fastest Processing',d:'Disbursement in 10-18 days'},
              {val:'cost',e:'🏷️',t:'Lowest Upfront Costs',d:'Minimal processing fees & charges'},
              {val:'service',e:'🤝',t:'Premium Service',d:'Dedicated RM & relationship banking'},
            ].map(o=>radioCard('customerPreference',o.val,o.e,o.t,o.d,'customerPreference',layer1Data,setLayer1Data))}
          </div>
        </div>
        <div className="input-group"><label>👤 Your Current Age</label>
          <input type="number" placeholder="e.g., 35" min="21" max="70" value={layer1Data.customerAge} onChange={e=>setLayer1Data({...layer1Data,customerAge:e.target.value})} className="text-input" style={{padding:'12px 16px',width:'100%',border:'2px solid #e2e8f0',borderRadius:'10px'}}/>
          <span className="hint">Max tenure = {layer1Data.employmentType==='employer'||layer1Data.employmentType==='professional'?'70':'60'} minus your age (RBI / bank policy)</span>
        </div>
        <div className="input-group"><label>How much loan do you need?</label>
          <div className="currency-input"><span className="currency">₹</span><input type="number" placeholder="40,00,000" min={LIMITS.minLoan} max={LIMITS.maxLoan} value={layer1Data.loanAmountNeeded} onChange={e=>setLayer1Data({...layer1Data,loanAmountNeeded:e.target.value})}/></div>
          <span className="hint">Min: ₹30L | Max: ₹15 Cr</span>
        </div>
        <div className="input-group"><label>Monthly Net Salary (In-hand)</label>
          <div className="currency-input"><span className="currency">₹</span><input type="number" placeholder="80,000" min={LIMITS.minIncome} max={LIMITS.maxIncome} value={layer1Data.monthlyIncome} onChange={e=>setLayer1Data({...layer1Data,monthlyIncome:e.target.value})}/></div>
          <span className="hint">After all deductions (PF, tax etc.) | Min: ₹15K/month</span>
        </div>
        <div className="input-group"><label>Preferred Loan Tenure</label>
          <select value={layer1Data.loanTenure} onChange={e=>setLayer1Data({...layer1Data,loanTenure:e.target.value})} className="select-input">
            {(()=>{
              const age = parseInt(layer1Data.customerAge)||30;
              const isSe = layer1Data.employmentType==='employer'||layer1Data.employmentType==='professional';
              const maxTenure = Math.min(30, Math.max(5,(isSe?70:60)-age));
              return [5,10,15,20,25,30].filter(t=>t<=maxTenure).map(y=>(
                <option key={y} value={y}>{y} Years {y===20&&maxTenure>=20?'(Recommended)':''}{y===maxTenure&&age>40?'(Max for your age)':''}</option>
              ));
            })()}
          </select>
          <span className="hint">{layer1Data.customerAge?`Max ${Math.min(30,(layer1Data.employmentType==='employer'||layer1Data.employmentType==='professional'?70:60)-parseInt(layer1Data.customerAge))} yrs for your age & employment type`:'Longer tenure = lower EMI, higher total interest'}</span>
        </div>
        <div className="input-group"><label>Current Total Monthly EMIs</label>
          <div className="currency-input"><span className="currency">₹</span><input type="number" placeholder="0" min={0} max={LIMITS.maxEMI} value={layer1Data.existingEMIs} onChange={e=>setLayer1Data({...layer1Data,existingEMIs:e.target.value})}/></div>
          <span className="hint">Car loan + personal loan + credit cards — all combined</span>
          {layer1Data.existingEMIs && layer1Data.monthlyIncome && (
            <span style={{fontSize:'12px',color: parseInt(layer1Data.existingEMIs)/parseInt(layer1Data.monthlyIncome)>0.50?'#dc2626':'#16a34a',fontWeight:'600',marginTop:'4px',display:'block'}}>
              Current DBR: {((parseInt(layer1Data.existingEMIs)||0)/parseInt(layer1Data.monthlyIncome||1)*100).toFixed(0)}%
              {parseInt(layer1Data.existingEMIs)/parseInt(layer1Data.monthlyIncome)>0.50?' ⚠️ Above 50% — eligibility severely impacted':' ✅ Within safe range'}
            </span>
          )}
        </div>
        <div className="input-group"><label>Are you a first-time borrower?</label>
          <div className="radio-group">
            {[{val:'first-time',l:'Yes, first home loan'},{val:'repeat',l:"No, I've taken loans before"}].map(o=>(
              <label key={o.val} className="radio-option"><input type="radio" name="borrowerType" value={o.val} checked={layer1Data.borrowerType===o.val} onChange={e=>setLayer1Data({...layer1Data,borrowerType:e.target.value})}/><span>{o.l}</span></label>
            ))}
          </div>
        </div>
        <div className="input-group"><label>Any missed EMI payments in last 12 months?</label>
          <div className="radio-group">
            {[{val:'no',l:'No (clean)'},{val:'yes',l:'Yes'}].map(o=>(
              <label key={o.val} className="radio-option"><input type="radio" name="missed12m" value={o.val} checked={layer1Data.missedPayments12m===o.val} onChange={e=>setLayer1Data({...layer1Data,missedPayments12m:e.target.value})}/><span>{o.l}</span></label>
            ))}
          </div>
        </div>
        <div className="input-group"><label>Any missed EMI payments in last 5 years?</label>
          <div className="radio-group">
            {[{val:'no',l:'No (clean)'},{val:'yes',l:'Yes'}].map(o=>(
              <label key={o.val} className="radio-option"><input type="radio" name="missed5y" value={o.val} checked={layer1Data.missedPayments5y===o.val} onChange={e=>setLayer1Data({...layer1Data,missedPayments5y:e.target.value})}/><span>{o.l}</span></label>
            ))}
          </div>
        </div>
        <div className="input-group"><label>Approximate CIBIL Score</label>
          <select value={layer1Data.cibilRange} onChange={e=>setLayer1Data({...layer1Data,cibilRange:e.target.value})} className="select-input">
            <option value="">Select range</option>
            <option value="750+">750+ (Excellent — Best rates unlocked)</option>
            <option value="700-749">700-749 (Good — Most banks eligible)</option>
            <option value="650-699">650-699 (Fair — Govt banks preferred)</option>
            <option value="below-650">Below 650 (Needs improvement — NBFC route)</option>
          </select>
          {layer1Data.cibilRange==='below-650'&&<div style={{marginTop:'8px',background:'#fef9c3',border:'1px solid #f59e0b',borderRadius:'8px',padding:'10px 12px',fontSize:'13px',color:'#92400e'}}>ℹ️ CIBIL below 650 — we'll match you with NBFCs (LIC HFL, PNB Housing, Bajaj HFL) that have flexible underwriting standards.</div>}
        </div>
        <button className="btn-next" onClick={handleLayer1Submit}>Continue to Property Details <ArrowRight size={20}/></button>
      </div></div>
    );
  };

  // ── RENDER LAYER 2 ───────────────────────────────────────────────────────────
  const renderLayer2 = () => {
    const apfStatus = layer2Data.builderName ? checkAPFStatus(layer2Data.builderName) : null;
    const equity = layer2Data.propertyValue && layer1Data.loanAmountNeeded
      ? calcSelfEquity(parseInt(layer2Data.propertyValue), parseInt(layer1Data.loanAmountNeeded))
      : null;

    return (
      <div className="layer-container"><div className="layer-header">
        <div className="layer-badge">Layer 2 of 2</div><h2>Property Assessment</h2>
        <p>Now let's understand the property value ceiling</p>
      </div><div className="form-section">
        <div className="input-group"><label>What type of loan do you need?</label>
          <div className="radio-group vertical">
            {[{val:'HL',t:'Home Loan (HL)',d:'Buying a new or resale property'},{val:'LAP',t:'Loan Against Property (LAP)',d:'Borrowing against your existing property'}].map(o=>(
              <label key={o.val} className="radio-card"><input type="radio" name="loanType" value={o.val} checked={layer2Data.loanType===o.val} onChange={e=>setLayer2Data({...layer2Data,loanType:e.target.value,propertyCategory:o.val==='LAP'?'existing':'',decidingDocument:o.val==='LAP'?'property-papers':''})}/>
                <div><strong>{o.t}</strong><p>{o.d}</p></div></label>
            ))}
          </div>
        </div>

        {layer2Data.loanType && (()=>{
          const opts = layer2Data.loanType==='HL'
            ? [{val:'apartment',e:'🏢',t:'Apartment / Flat',d:'Multi-storey builder floor or society flat'},{val:'plot',e:'🌳',t:'Plot / Land',d:'Residential plot for construction'},{val:'house',e:'🏡',t:'Independent House / Villa',d:'Row house, bungalow, builder floor'}]
            : [{val:'office',e:'🏛️',t:'Commercial Space',d:'Office / shop — LAP'},{val:'apartment',e:'🏢',t:'Residential Apartment',d:'Loan against existing flat'},{val:'plot',e:'🌳',t:'Residential Plot',d:'Loan against owned plot'}];
          return (
            <div className="input-group"><label>🏠 Property Type</label>
              <div className="radio-group vertical" style={{marginTop:'8px'}}>
                {opts.map(o=>(
                  <label key={o.val} className="radio-card" style={{borderColor:layer2Data.propertySubType===o.val?'#2563eb':'#e2e8f0',background:layer2Data.propertySubType===o.val?'#eff6ff':'white'}}>
                    <input type="radio" name="propertySubType" value={o.val} checked={layer2Data.propertySubType===o.val} onChange={e=>setLayer2Data({...layer2Data,propertySubType:e.target.value})}/>
                    <div><strong>{o.e} {o.t}</strong><p>{o.d}</p></div>
                  </label>
                ))}
              </div>
            </div>
          );
        })()}

        {layer2Data.loanType==='HL' && (
          <div className="input-group"><label>Property Category</label>
            <div className="radio-group vertical">
              {[{val:'builder-new',t:'Builder — New / Under Construction',d:'Buying directly from developer'},
                {val:'resale',t:'Resale Property',d:'Buying from current owner'}].map(o=>(
                <label key={o.val} className="radio-card"><input type="radio" name="propertyCategory" value={o.val} checked={layer2Data.propertyCategory===o.val} onChange={e=>setLayer2Data({...layer2Data,propertyCategory:e.target.value,decidingDocument:o.val==='builder-new'?'booking-form':'agreement-to-sell',propertyUsage:''})}/>
                  <div><strong>{o.t}</strong><p>{o.d}</p></div></label>
              ))}
            </div>
          </div>
        )}

        {layer2Data.propertyCategory==='resale' && (
          <div className="input-group"><label>🏠 Current usage of the property?</label>
            <span className="hint">Banks verify — commercial use on a residential loan is a deviation requiring special approval</span>
            <div className="radio-group vertical" style={{marginTop:'8px'}}>
              {[{val:'residential',bc:'#2563eb',bg:'#eff6ff',i:'✅',t:'Residential Use',d:'Self-occupied or rented to family (standard case)'},
                {val:'commercial',bc:'#dc2626',bg:'#fef2f2',i:'⚠️',t:'Business / Office / Tuition',d:'Special approval needed — longer processing'},
                {val:'vacant',bc:'#2563eb',bg:'#eff6ff',i:'✅',t:'Vacant / Ready for Possession',d:'Not currently occupied (clean case)'},
              ].map(o=>(
                <label key={o.val} className="radio-card" style={{borderColor:layer2Data.propertyUsage===o.val?o.bc:'#e2e8f0',background:layer2Data.propertyUsage===o.val?o.bg:'white'}}>
                  <input type="radio" name="propertyUsage" value={o.val} checked={layer2Data.propertyUsage===o.val} onChange={e=>setLayer2Data({...layer2Data,propertyUsage:e.target.value})}/>
                  <div><strong>{o.i} {o.t}</strong><p>{o.d}</p></div>
                </label>
              ))}
            </div>
          </div>
        )}

        {layer2Data.decidingDocument && (
          <div className="deciding-doc-card">
            <h4>📄 Key Document Required:</h4>
            <p>{layer2Data.decidingDocument==='booking-form'?'Builder Booking Form / BBA Agreement':layer2Data.decidingDocument==='agreement-to-sell'?'Agreement to Sell (ATS)':'Property Ownership Papers / Valuation Report'}</p>
            <span className="doc-note">The value in this document is what banks use for LTV calculation</span>
          </div>
        )}

        <div className="input-group"><label>Property Value (As per ATS / Booking Form / Valuation)</label>
          <div className="currency-input"><span className="currency">₹</span><input type="number" placeholder="50,00,000" min={LIMITS.minPropertyValue} max={LIMITS.maxPropertyValue} value={layer2Data.propertyValue} onChange={e=>setLayer2Data({...layer2Data,propertyValue:e.target.value})}/></div>
          <span className="hint">Min: ₹10L | Max: ₹50 Cr — must match your document exactly</span>
        </div>

        {/* Self-equity indicator — live calculation */}
        {equity !== null && (
          <div style={{background: equity<0.10?'#fef2f2':equity<0.15?'#fef9c3':'#f0fdf4', border:`1px solid ${equity<0.10?'#dc2626':equity<0.15?'#f59e0b':'#16a34a'}`,borderRadius:'10px',padding:'12px 16px',marginBottom:'16px',fontSize:'13px'}}>
            <strong>Self-Equity: {(equity*100).toFixed(0)}%</strong> (₹{((parseInt(layer2Data.propertyValue)-parseInt(layer1Data.loanAmountNeeded))/100000).toFixed(1)}L own funds)
            {equity<0.10&&<span style={{color:'#dc2626',display:'block',marginTop:'4px'}}>❌ Below 10% — no bank can approve this loan. Increase down payment.</span>}
            {equity>=0.10&&equity<0.15&&<span style={{color:'#d97706',display:'block',marginTop:'4px'}}>⚠️ Below 15% — MNC banks will reject. Govt/Private banks may process with conditions.</span>}
            {equity>=0.15&&equity<0.20&&<span style={{color:'#d97706',display:'block',marginTop:'4px'}}>ℹ️ Below 20% — Silver profile territory. Full bank range accessible.</span>}
            {equity>=0.20&&<span style={{color:'#16a34a',display:'block',marginTop:'4px'}}>✅ Strong equity position — all bank categories accessible.</span>}
          </div>
        )}

        <div className="input-group"><label>Property Location (NCR)</label>
          <select value={layer2Data.propertyLocation} onChange={e=>setLayer2Data({...layer2Data,propertyLocation:e.target.value,microMarket:''})} className="select-input">
            <option value="">Select location</option>
            {['delhi','gurugram','noida','greater-noida','ghaziabad','faridabad'].map(l=><option key={l} value={l}>{l.charAt(0).toUpperCase()+l.slice(1).replace('-',' ')}</option>)}
          </select>
        </div>

        {layer2Data.propertyLocation && NCR_MICROMARKETS[layer2Data.propertyLocation] && (
          <div className="input-group"><label>Specific Area / Zone</label>
            <select value={layer2Data.microMarket} onChange={e=>setLayer2Data({...layer2Data,microMarket:e.target.value})} className="select-input">
              <option value="">Select your area...</option>
              {NCR_MICROMARKETS[layer2Data.propertyLocation].map(z=><option key={z.id} value={z.id}>{z.name} ({z.sectors})</option>)}
            </select>
          </div>
        )}

        {/* Apartment detailed capture */}
        {layer2Data.propertySubType==='apartment' && layer2Data.propertyCategory && (
          <div className="property-details-section">
            <h3 style={{fontSize:'18px',color:'#1e293b',marginBottom:'16px'}}>📋 Property Details</h3>
            <div className="input-group"><label>Building / Society Name</label>
              <input type="text" placeholder="e.g., Mahagun Moderne, DLF Crest, Godrej Oasis" value={layer2Data.buildingSocietyName} onChange={e=>setLayer2Data({...layer2Data,buildingSocietyName:e.target.value})} className="text-input"/>
            </div>
            <div className="input-group">
              <label>Builder / Developer Name <span style={{fontSize:'12px',color:'#64748b',fontWeight:'400'}}>(used for APF check)</span></label>
              <input type="text" placeholder="e.g., Mahagun, DLF, Godrej, M3M" value={layer2Data.builderName} onChange={e=>setLayer2Data({...layer2Data,builderName:e.target.value})} className="text-input"/>
              {/* Live APF badge */}
              {layer2Data.builderName && (()=>{
                const s = checkAPFStatus(layer2Data.builderName);
                if (s==='approved') return <div style={{marginTop:'6px',background:'#f0fdf4',border:'1px solid #16a34a',borderRadius:'6px',padding:'6px 10px',fontSize:'12px',color:'#166534'}}>✅ <strong>Tier 1 Builder</strong> — likely APF-approved by major banks. Match score boosted.</div>;
                if (s==='flagged') return <div style={{marginTop:'6px',background:'#fef2f2',border:'1px solid #dc2626',borderRadius:'6px',padding:'6px 10px',fontSize:'12px',color:'#991b1b'}}>🚫 <strong>Flagged Builder</strong> — {layer2Data.builderName} has a history of stalled projects. Banks may refuse funding. Verify RERA status immediately.</div>;
                return <div style={{marginTop:'6px',background:'#fef9c3',border:'1px solid #f59e0b',borderRadius:'6px',padding:'6px 10px',fontSize:'12px',color:'#92400e'}}>⚠️ <strong>Unknown Builder</strong> — Confirm APF approval with your bank before booking. Match score conservatively adjusted.</div>;
              })()}
            </div>
            <div className="input-group"><label>Exact Sector / Tower / Wing</label>
              <input type="text" placeholder="e.g., Sector 78, Tower B" value={layer2Data.exactSector} onChange={e=>setLayer2Data({...layer2Data,exactSector:e.target.value})} className="text-input"/>
            </div>
            <div className="input-group"><label>BHK Configuration</label>
              <select value={layer2Data.bhkConfig} onChange={e=>setLayer2Data({...layer2Data,bhkConfig:e.target.value})} className="select-input">
                <option value="">Select BHK</option>
                {['1 BHK','2 BHK','3 BHK','4 BHK','5+ BHK'].map(b=><option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="input-group"><label>Carpet Area (sq ft)</label>
              <input type="number" placeholder="e.g., 1200" value={layer2Data.carpetArea} onChange={e=>setLayer2Data({...layer2Data,carpetArea:e.target.value})} className="text-input"/>
              <span className="hint">As per sale agreement — RERA mandates carpet ≥ 70% of super area</span>
            </div>
            {layer2Data.propertyCategory==='resale' && (
              <div className="input-group"><label>Property Age</label>
                <select value={layer2Data.propertyAge} onChange={e=>setLayer2Data({...layer2Data,propertyAge:e.target.value})} className="select-input">
                  <option value="">Select age</option>
                  {['0-5 years','5-10 years','10-20 years','20+ years'].map(a=><option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        <div className="nav-buttons">
          <button className="btn-back" onClick={()=>setCurrentLayer('layer1')}>← Back</button>
          <button className="btn-next" onClick={handleLayer2Submit}>See Bank Matches <ArrowRight size={20}/></button>
        </div>
      </div></div>
    );
  };

  // ── RENDER PROPERTY INSIGHTS ─────────────────────────────────────────────────
  const renderPropertyInsights = () => {
    if (!layer2Data.microMarket) { const r=matchBanks(layer1Data,layer2Data); setResults(r); setCurrentLayer('results'); return null; }
    const zoneData = NCR_MICROMARKETS[layer2Data.propertyLocation]?.find(z=>z.id===layer2Data.microMarket);
    if (!zoneData) { const r=matchBanks(layer1Data,layer2Data); setResults(r); setCurrentLayer('results'); return null; }

    const propertyVal=parseInt(layer2Data.propertyValue);
    const isApt=layer2Data.propertySubType==='apartment';
    const isUC=layer2Data.propertyCategory==='builder-new';
    const sqft=layer2Data.carpetArea&&parseInt(layer2Data.carpetArea)>0?parseInt(layer2Data.carpetArea):Math.round(propertyVal/zoneData.avgPrice);
    const gst=isUC?Math.round(propertyVal*0.05):0;
    const tds=propertyVal>5000000?Math.round(propertyVal*0.01):0;
    const stamp=Math.round(propertyVal*0.06);
    const reg=Math.round(propertyVal*0.01);
    const edc=layer2Data.propertyLocation==='gurugram'?Math.round(propertyVal*0.015):0;
    const total=gst+tds+stamp+reg+edc;

    const priceDiff=((propertyVal/sqft)-zoneData.avgPrice)/zoneData.avgPrice*100;
    const scores={
      price:priceDiff<-10?95:priceDiff>15?50:priceDiff>10?60:priceDiff>5?72:78,
      market:zoneData.temp==='hot'?90:zoneData.temp==='warm'?72:55,
      legal:isUC?(propertyVal>=50000000?85:propertyVal>=20000000?75:65):90,
      rental:(()=>{const y=zoneData.rentalYield||2.8;return y>=3.5?90:y>=3.0?78:y>=2.5?65:y>=2.0?52:40;})(),
    };
    const overall=Math.round((scores.price+scores.market+scores.legal+scores.rental)/4);
    const scoreLabel=overall>=80?'Excellent Buy':overall>=65?'Good Buy':'Proceed with Caution';
    const scoreColor=overall>=80?'#16a34a':overall>=65?'#d97706':'#dc2626';

    const PBar=({label,score,color})=>(
      <div className="progress-item">
        <div className="progress-label"><span>{label}</span><strong style={{color}}>{score}/100</strong></div>
        <div className="progress-track"><div className="progress-fill" style={{width:`${score}%`,background:color}}/></div>
      </div>
    );

    return (
      <div className="layer-container insights-v2" style={{maxWidth:'960px'}}>
        <div className="layer-header">
          <div className="layer-badge">Property Intelligence</div>
          <h2>📍 {zoneData.name} — Full Analysis</h2>
          <p>PropIndex Q4 2025 · Cushman & Wakefield · Savills H1 2025</p>
        </div>
        <div className="confidence-banner">
          <div className="confidence-main">
            <div className="confidence-dial" style={{borderColor:scoreColor}}><span className="dial-number" style={{color:scoreColor}}>{overall}</span><span className="dial-label">/ 100</span></div>
            <div className="confidence-text"><h3 style={{color:scoreColor}}>{scoreLabel}</h3><p>PrimePath Property Confidence Score</p><span className="confidence-sub">Price · Market momentum · Legal readiness · Rental potential</span></div>
          </div>
          <div className="progress-bars">
            <PBar label="💰 Price vs Market" score={scores.price} color="#2563eb"/>
            <PBar label="🔥 Market Momentum" score={scores.market} color="#d97706"/>
            <PBar label="⚖️ Legal Readiness" score={scores.legal} color="#7c3aed"/>
            <PBar label="🏠 Rental Potential" score={scores.rental} color="#16a34a"/>
          </div>
        </div>
        <div className="insights-grid-v2">
          <div className="insight-card-v2">
            <h3>💰 Price Analysis</h3>
            <div className="price-comparison">
              <div className="price-row"><span>Your Property:</span><strong>₹{propertyVal>=10000000?`${(propertyVal/10000000).toFixed(2)} Cr`:`${(propertyVal/100000).toFixed(0)}L`}</strong></div>
              <div className="price-row"><span>Area Avg PSF:</span><strong>₹{zoneData.avgPrice.toLocaleString()}/sqft</strong></div>
              <div className="price-row"><span>Est. Size:</span><strong>~{sqft} sqft</strong></div>
            </div>
            {priceDiff<-10?<div className="alert-box good-deal">✅ <strong>Good Deal!</strong> {Math.abs(priceDiff).toFixed(0)}% below market average</div>:priceDiff>10?<div className="alert-box verify-alert">⚠️ <strong>Above Market</strong> — {priceDiff.toFixed(0)}% premium. Verify amenities justify it.</div>:<div className="alert-box neutral">✓ <strong>Fair Price</strong> — within {Math.abs(priceDiff).toFixed(0)}% of market average</div>}
          </div>
          <div className="insight-card-v2">
            <h3>🌡️ Market Momentum</h3>
            <div className={`temp-badge ${zoneData.temp}`}>{zoneData.temp==='hot'?'🔥 HOT MARKET':zoneData.temp==='warm'?'📈 WARM MARKET':'📊 STABLE'}</div>
            <div className="temp-details">
              <div className="temp-row"><span>Price Growth:</span><strong>{zoneData.growth}</strong></div>
              <div className="temp-row"><span>Zone:</span><strong>{zoneData.sectors}</strong></div>
              <div className="temp-row"><span>Outlook:</span><strong>{zoneData.temp==='hot'?'⬆️ Bullish':'→ Steady'}</strong></div>
            </div>
          </div>
        </div>
        <div className="insight-full-card"><h3>📍 Area Highlights</h3><ul className="highlights-list-v2">{zoneData.highlights.map((h,i)=><li key={i}>✓ {h}</li>)}</ul></div>
        {isApt&&(
          <div className="insight-full-card cost-card">
            <h3>🧾 True Cost of Buying</h3><p className="cost-subtitle">What you'll actually pay beyond the base price:</p>
            <div className="cost-table">
              <div className="cost-row header-row"><span>Cost Head</span><span>Rate</span><span>Amount</span><span>Who Pays</span></div>
              <div className="cost-row"><span>🏠 Base Price</span><span>—</span><span>₹{propertyVal>=10000000?`${(propertyVal/10000000).toFixed(2)} Cr`:`${(propertyVal/100000).toFixed(0)}L`}</span><span>Buyer → Builder/Seller</span></div>
              {isUC?<div className="cost-row highlight-row"><span>📊 GST <span className="badge-pill">Under-Construction</span></span><span>5%</span><span>₹{(gst/100000).toFixed(1)}L</span><span>Buyer → Govt via Builder</span></div>:<div className="cost-row good-row"><span>📊 GST <span className="badge-pill green">Ready-to-Move</span></span><span>NIL ✅</span><span>₹0</span><span>Key RTM advantage!</span></div>}
              {propertyVal>5000000&&<div className="cost-row"><span>💼 TDS Sec 194-IA</span><span>1%</span><span>₹{(tds/100000).toFixed(1)}L</span><span>Buyer files Form 26QB</span></div>}
              <div className="cost-row"><span>🏛️ Stamp Duty</span><span>{layer2Data.propertyLocation==='delhi'?'6%':layer2Data.propertyLocation==='gurugram'?'5% (Women: 3%)':'5%'}</span><span>₹{(stamp/100000).toFixed(1)}L</span><span>Buyer → State Govt</span></div>
              <div className="cost-row"><span>📝 Registration</span><span>1%</span><span>₹{(reg/100000).toFixed(1)}L</span><span>Buyer → Sub-Registrar</span></div>
              {layer2Data.propertyLocation==='gurugram'&&<div className="cost-row highlight-row"><span>🏗️ EDC/IDC <span className="badge-pill">Haryana +20% Jan 2025</span></span><span>~1.5%</span><span>₹{(edc/100000).toFixed(1)}L</span><span>Buyer → HRERA/Developer</span></div>}
              <div className="cost-row total-row"><span><strong>💰 Total Additional</strong></span><span></span><span><strong>₹{(total/100000).toFixed(1)}L</strong></span><span><strong>{((total/propertyVal)*100).toFixed(1)}% of value</strong></span></div>
            </div>
            <div className="cost-note">💡 <strong>Bank loan covers base price only.</strong> These additional costs must come from your own funds — plan ahead.</div>
          </div>
        )}
        <div className="insights-grid-v2">
          <div className="insight-card-v2"><h3>🏠 Rental Potential</h3>
            <div className="rental-data">
              <div className="rental-row"><span>Monthly Rental</span><strong>₹{zoneData.rentalMin?.toLocaleString()} – ₹{zoneData.rentalMax?.toLocaleString()}</strong></div>
              <div className="rental-row"><span>Rental Growth</span><strong style={{color:'#16a34a'}}>{zoneData.rentalGrowth||'3-6%'}</strong></div>
              <div className="rental-row"><span>Gross Yield</span><strong>{zoneData.rentalYield?`${zoneData.rentalYield}%`:'2.5–3.5%'}</strong></div>
            </div>
          </div>
          <div className="insight-card-v2"><h3>📈 Capital Outlook</h3>
            <div className="rental-data">
              <div className="rental-row"><span>2024 NCR Growth</span><strong style={{color:'#16a34a'}}>+30% YoY</strong></div>
              <div className="rental-row"><span>{zoneData.name}</span><strong style={{color:'#16a34a'}}>{zoneData.growth}</strong></div>
              <div className="rental-row"><span>5-Year Projection</span><strong>{zoneData.temp==='hot'?'35-45% (Bullish)':'20-30% (Moderate)'}</strong></div>
              <div className="rental-row"><span>Entry Timing</span><strong style={{color:zoneData.temp==='hot'?'#d97706':'#16a34a'}}>{zoneData.temp==='hot'?'⚠️ Peaking':'✅ Good entry'}</strong></div>
            </div>
          </div>
        </div>
        <div className="insight-full-card empathy-card">
          <div className="empathy-header"><span className="empathy-icon">🛡️</span>
            <div><h3>Protection Checklist</h3><p className="empathy-message">Biggest financial decision of your life — please verify these before signing.</p></div>
          </div>
          <div className="risk-grid">
            {isApt&&isUC&&<div className="risk-item red"><span className="risk-icon">⚠️</span><div><strong>RERA Registration</strong><p>Every UC project MUST be RERA registered. Check before booking.</p><a className="check-link" href={layer2Data.propertyLocation==='gurugram'?'https://rera.haryana.gov.in':layer2Data.propertyLocation==='noida'||layer2Data.propertyLocation==='greater-noida'?'https://up-rera.in':'#'} target="_blank" rel="noopener noreferrer">→ Verify on State RERA portal</a></div></div>}
            <div className="risk-item amber"><span className="risk-icon">📄</span><div><strong>Title Verification</strong><p>Clear marketable title — verify sale chain 30 years back for resale. Builder land title for new.</p></div></div>
            <div className="risk-item green"><span className="risk-icon">✅</span><div><strong>Encumbrance Certificate</strong><p>Confirms no existing loans/dues on property. Get from Sub-Registrar before disbursal.</p></div></div>
            {(layer2Data.propertyLocation==='noida'||layer2Data.propertyLocation==='greater-noida')&&<div className="risk-item red"><span className="risk-icon">⚠️</span><div><strong>Noida/Greater Noida Alert</strong><p>Many 2005-2011 projects stalled (Unitech, Amrapali, Jaypee). Verify RERA & construction status independently.</p></div></div>}
            {layer2Data.propertySubType==='plot'&&<div className="risk-item red"><span className="risk-icon">🚫</span><div><strong>Plot/Land Risk</strong><p>Verify Khasra, Khatauni, mutation records. Home loans NOT available for unapproved colonies or agricultural land.</p></div></div>}
          </div>
        </div>
        <div className="nav-buttons">
          <button className="btn-back" onClick={()=>setCurrentLayer('layer2')}>← Back</button>
          <button className="btn-next" onClick={()=>setShowKycGate(true)}>See My Bank Matches <ArrowRight size={20}/></button>
        </div>
      </div>
    );
  };

  // ── KYC GATE ─────────────────────────────────────────────────────────────────
  const renderKycGate = () => (
    <div className="kyc-gate-overlay"><div className="kyc-gate-modal">
      <h2>🔐 Almost There!</h2><p className="kyc-subtitle">Get your personalized bank matches instantly</p>
      <div className="kyc-form">
        {[{label:'👤 Full Name',type:'text',key:'name',ph:'As per PAN card'},{label:'📱 Mobile',type:'tel',key:'phone',ph:'10-digit mobile',max:'10'},{label:'📧 Email',type:'email',key:'email',ph:'your@email.com'}].map(f=>(
          <div key={f.key} className="kyc-input-group"><label>{f.label}</label><input type={f.type} placeholder={f.ph} maxLength={f.max} value={kycData[f.key]} onChange={e=>setKycData({...kycData,[f.key]:e.target.value})}/></div>
        ))}
        <div className="kyc-terms">
          <label className="terms-checkbox"><input type="checkbox" checked={kycData.agreedToTerms} onChange={e=>setKycData({...kycData,agreedToTerms:e.target.checked})}/><span>I agree to <a href="#" onClick={e=>{e.preventDefault();alert('Data used only for loan matching. Not sold to third parties.');}}>Terms of Service</a>. This is indicative eligibility — not financial advice.</span></label>
          <label className="terms-checkbox" style={{marginTop:'12px'}}><input type="checkbox" checked={kycData.consentToContact} onChange={e=>setKycData({...kycData,consentToContact:e.target.checked})}/><span><strong>I consent to be contacted</strong> by PrimePath Mortgages via phone/email/WhatsApp for loan assistance</span></label>
        </div>
        <div className="kyc-actions">
          <button className="btn-back" onClick={()=>setShowKycGate(false)}>← Back</button>
          <button className="btn-kyc-submit" onClick={handleKycSubmit}>Show My Matches 🎯</button>
        </div>
      </div>
      <div className="kyc-disclaimer">
        <p>🔒 <strong>Data security:</strong> Stored on Indian servers per RBI Digital Lending Directions 2025. Never sold to third parties.</p>
        <p>⚖️ <strong>Regulatory note:</strong> Results are indicative. As per RBI guidelines, final loan terms are subject to bank's credit assessment and KFS.</p>
      </div>
    </div></div>
  );

  // ── RENDER RESULTS ────────────────────────────────────────────────────────────
  const renderResults = () => {
    if (!results) return null;
    const { customerCapacity, propertyCeiling, finalEligibleAmount, limitingFactor,
            profileTier, currentDBR, selfEquityPct, isAPFApproved, apfStatus,
            isLowCIBIL, matches, eliminated } = results;

    const tierConfig = {
      Gold:     { color:'#d97706', bg:'#fef3c7', border:'#fbbf24', icon:'🥇', desc:'Best rates, fastest approvals — all bank tiers accessible' },
      Silver:   { color:'#64748b', bg:'#f1f5f9', border:'#94a3b8', icon:'🥈', desc:'Strong profile — Govt & Private banks fully accessible' },
      Standard: { color:'#dc2626', bg:'#fef2f2', border:'#fca5a5', icon:'⚠️',  desc:'Some deviations present — bank options are limited, consider improving before applying' },
    };
    const tier = tierConfig[profileTier];

    // ── Amortization ──────────────────────────────────────────────────────────
    const renderAmort = () => {
      const best = matches[0];
      const rate = best ? best.interestRate : 8.5;
      const tenure = parseInt(layer1Data.loanTenure || 20);
      const principal = finalEligibleAmount;
      const mr = rate / 12 / 100;
      const tn = tenure * 12;
      const emi = principal * (mr * Math.pow(1+mr,tn)) / (Math.pow(1+mr,tn)-1);

      let bal = principal;
      const yearly = [];
      for (let y=1; y<=tenure; y++) {
        let yP=0, yI=0;
        for (let m=0; m<12; m++) { const i=bal*mr; const p=emi-i; yI+=i; yP+=p; bal-=p; }
        yearly.push({ year:y, principal:Math.round(yP), interest:Math.round(yI), balance:Math.max(0,Math.round(bal)) });
      }
      const totalInt = yearly.reduce((s,d)=>s+d.interest,0);
      const totalPay = principal + totalInt;
      const maxBar = Math.max(...yearly.map(d=>d.principal+d.interest));
      const step = Math.ceil(tenure/15);
      const display = yearly.filter((_,i)=>i%step===0||i===tenure-1);
      const H = 160;
      const int5pct = Math.round(yearly.slice(0,5).reduce((s,d)=>s+d.interest,0)/yearly.slice(0,5).reduce((s,d)=>s+d.principal+d.interest,0)*100);

      return (
        <div className="amort-section">
          <h2 style={{fontSize:'22px',fontWeight:'700',color:'#1e293b',marginBottom:'4px'}}>📊 Free Amortization Schedule</h2>
          <p style={{color:'#64748b',marginBottom:'20px',fontSize:'14px'}}>Based on {rate}% p.a. over {tenure} years using {best?.shortName||'best matched'} rate</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'24px'}}>
            {[{l:'Loan Amount',v:`₹${(principal/100000).toFixed(1)}L`,c:'#1e293b'},{l:'Monthly EMI',v:`₹${Math.round(emi).toLocaleString()}`,c:'#2563eb'},{l:'Total Interest',v:`₹${(totalInt/100000).toFixed(1)}L`,c:'#ef4444'},{l:'Total Payment',v:`₹${(totalPay/100000).toFixed(1)}L`,c:'#1e293b'}].map(s=>(
              <div key={s.l} style={{background:'#f8fafc',borderRadius:'12px',padding:'16px',textAlign:'center',border:'1px solid #e2e8f0'}}>
                <div style={{fontSize:'12px',color:'#64748b',marginBottom:'4px'}}>{s.l}</div>
                <div style={{fontSize:'20px',fontWeight:'700',color:s.c}}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:'20px',marginBottom:'12px',fontSize:'13px'}}>
            <span style={{display:'flex',alignItems:'center',gap:'6px'}}><span style={{width:'14px',height:'14px',borderRadius:'3px',background:'#1e3a5f',display:'inline-block'}}/>Principal</span>
            <span style={{display:'flex',alignItems:'center',gap:'6px'}}><span style={{width:'14px',height:'14px',borderRadius:'3px',background:'#ef4444',display:'inline-block'}}/>Interest</span>
          </div>
          <div style={{display:'flex',alignItems:'flex-end',gap:'6px',height:`${H+30}px`,padding:'0 4px',overflowX:'auto',borderBottom:'2px solid #e2e8f0',marginBottom:'16px'}}>
            {display.map(d=>{
              const iH=Math.round((d.interest/maxBar)*H);
              const pH=Math.round((d.principal/maxBar)*H);
              return (
                <div key={d.year} style={{display:'flex',flexDirection:'column',alignItems:'center',flex:'1',minWidth:'28px',maxWidth:'60px'}}>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'stretch',width:'100%',cursor:'default'}}
                       title={`Yr${d.year} — Principal:₹${(d.principal/1000).toFixed(0)}K | Interest:₹${(d.interest/1000).toFixed(0)}K`}>
                    <div style={{height:`${iH}px`,background:'#ef4444',borderRadius:'4px 4px 0 0',minHeight:iH>0?'4px':'0'}}/>
                    <div style={{height:`${pH}px`,background:'#1e3a5f',borderRadius:iH>0?'0 0 4px 4px':'4px',minHeight:pH>0?'4px':'0'}}/>
                  </div>
                  <span style={{fontSize:'10px',color:'#94a3b8',marginTop:'4px',fontWeight:'500'}}>Yr{d.year}</span>
                </div>
              );
            })}
          </div>
          <div style={{background:'#fef3c7',border:'1px solid #f59e0b',borderRadius:'10px',padding:'14px 16px',marginBottom:'20px',fontSize:'14px'}}>
            💡 <strong>Key Insight:</strong> In the first 5 years, ~{int5pct}% of your EMI goes to interest. <strong>Prepaying early saves the most!</strong>
          </div>
          <details style={{marginTop:'8px'}}>
            <summary style={{cursor:'pointer',fontWeight:'600',color:'#2563eb',fontSize:'14px',padding:'8px 0'}}>▶ View Full Year-by-Year Schedule</summary>
            <div style={{overflowX:'auto',marginTop:'12px'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
                <thead><tr style={{background:'#f1f5f9'}}>{['Year','Principal','Interest','Balance'].map(h=><th key={h} style={{padding:'10px 12px',textAlign:'left',fontWeight:'600',color:'#475569',borderBottom:'1px solid #e2e8f0'}}>{h}</th>)}</tr></thead>
                <tbody>{yearly.map((d,i)=>(
                  <tr key={d.year} style={{background:i%2===0?'#fff':'#f8fafc'}}>
                    <td style={{padding:'8px 12px',borderBottom:'1px solid #f1f5f9'}}>{d.year}</td>
                    <td style={{padding:'8px 12px',borderBottom:'1px solid #f1f5f9',color:'#1e3a5f',fontWeight:'500'}}>₹{(d.principal/1000).toFixed(1)}K</td>
                    <td style={{padding:'8px 12px',borderBottom:'1px solid #f1f5f9',color:'#ef4444',fontWeight:'500'}}>₹{(d.interest/1000).toFixed(1)}K</td>
                    <td style={{padding:'8px 12px',borderBottom:'1px solid #f1f5f9',color:'#64748b'}}>₹{(d.balance/100000).toFixed(2)}L</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </details>
        </div>
      );
    };

    // ── RBI Section ───────────────────────────────────────────────────────────
    const renderRBI = () => {
      const cards = [
        {icon:'🔒',title:'LTV Ratios',body:'RBI mandates maximum LTV:',items:['Up to ₹30L: Max 90% LTV','₹30L–₹75L: Max 80% LTV','Above ₹75L: Max 75% LTV','LAP: Max 60-70% LTV'],note:'Protects you from over-borrowing'},
        {icon:'💳',title:'Key Fact Statement (KFS)',body:'Every bank MUST give you KFS before disbursal with:',items:['✓ Annual Percentage Rate (APR)','✓ All fees & charges upfront','✓ Total cost of loan','✓ No hidden surprises'],note:"RBI Digital Lending Directions 2025 — demand this, it's your right"},
        {icon:'💰',title:'Prepayment Rules',body:'As per RBI Fair Practice Code:',items:['✓ Floating rate: ZERO prepayment penalty','✓ Fixed rate: Max 2% penalty','✓ Banks CANNOT refuse part-prepayment','✓ Balance transfer allowed anytime'],note:'Paying extra EMIs early saves lakhs!'},
        {icon:'📊',title:'Rate Transparency',body:'Banks must disclose:',items:['✓ MCLR/RLLR-linked or fixed','✓ Reset frequency (quarterly/annually)','✓ Spread over benchmark','✓ When RBI cuts, your EMI must reduce'],note:'Ask: "Is this floating or fixed?" before signing'},
        {icon:'⚖️',title:'Fair Practice Code',body:'RBI mandates banks MUST:',items:['✓ Give written rejection reason','✓ No penal interest without policy','✓ Provide statement anytime','✓ Return original docs within 30 days of closure'],note:'Violators: Complain at RBI Ombudsman'},
        {icon:'🏗️',title:'Property Safeguards',body:'RBI directs banks to ensure:',items:['✓ Loan only for RERA-approved projects','✓ Sanctioned plan mandatory','✓ No loan for unauthorized constructions','✓ Architect certifies construction stages'],note:'Always verify RERA registration number'},
      ];
      return (
        <div style={{background:'#f8fafc',borderRadius:'16px',padding:'32px',marginBottom:'24px',border:'1px solid #e2e8f0'}}>
          <h2 style={{fontSize:'22px',fontWeight:'700',color:'#1e293b',marginBottom:'6px'}}>📜 Know Your Rights — RBI Guidelines</h2>
          <p style={{color:'#64748b',marginBottom:'8px',fontSize:'14px'}}>What every home buyer must know before signing</p>
          <div style={{background:'#fef9c3',border:'1px solid #f59e0b',borderRadius:'8px',padding:'10px 14px',marginBottom:'24px',fontSize:'12px',color:'#92400e'}}>
            ℹ️ Reference: <strong>RBI Digital Lending Directions 2025</strong> (May 8, 2025) — supersedes the 2022 circular. Core borrower protections remain in force.
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'16px'}}>
            {cards.map((c,i)=>(
              <div key={i} style={{background:'#fff',borderRadius:'12px',padding:'20px',border:'1px solid #e2e8f0',boxShadow:'0 1px 3px rgba(0,0,0,0.04)'}}>
                <div style={{fontSize:'28px',marginBottom:'8px'}}>{c.icon}</div>
                <h4 style={{fontSize:'15px',fontWeight:'700',color:'#1e293b',marginBottom:'6px'}}>{c.title}</h4>
                <p style={{fontSize:'13px',color:'#64748b',marginBottom:'10px'}}>{c.body}</p>
                <ul style={{margin:0,padding:'0 0 0 4px',listStyle:'none'}}>
                  {c.items.map((item,j)=><li key={j} style={{fontSize:'13px',color:'#374151',padding:'3px 0',borderBottom:j<c.items.length-1?'1px solid #f1f5f9':'none'}}>{item}</li>)}
                </ul>
                <div style={{marginTop:'12px',background:'#f0fdf4',borderRadius:'8px',padding:'8px 10px',fontSize:'12px',color:'#166534',fontWeight:'500'}}>{c.note}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:'24px',padding:'16px',background:'#eff6ff',borderRadius:'10px',fontSize:'13px',color:'#1e40af'}}>
            <p style={{margin:'0 0 4px'}}>📌 Source: RBI Digital Lending Directions 2025 · RBI Master Circular on Housing Finance</p>
            <p style={{margin:0}}>Grievances: <strong>RBI Banking Ombudsman — bankingombudsman.rbi.org.in</strong></p>
          </div>
        </div>
      );
    };

    // ── Bank card renderer ───────────────────────────────────────────────────
    const BankCard = ({ match }) => {
      const scoreColor = match.matchScore>=70?'#16a34a':match.matchScore>=50?'#d97706':'#dc2626';
      return (
        <div style={{background:'#fff',borderRadius:'16px',padding:'20px',border:'1px solid #e2e8f0',boxShadow:'0 2px 8px rgba(0,0,0,0.06)',display:'flex',flexDirection:'column',gap:'12px'}}>
          {/* Header */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              <h4 style={{fontSize:'18px',fontWeight:'700',color:'#1e293b',margin:0}}>{match.shortName}</h4>
              <p style={{fontSize:'13px',color:'#64748b',margin:'2px 0 0'}}>{match.name}</p>
              <span style={{fontSize:'11px',background:'#f1f5f9',color:'#475569',padding:'2px 8px',borderRadius:'20px',display:'inline-block',marginTop:'4px'}}>{match.category}</span>
            </div>
            {/* Score dial */}
            <div style={{position:'relative',width:'64px',height:'64px'}}>
              <svg viewBox="0 0 100 100" style={{width:'64px',height:'64px'}}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e0e0e0" strokeWidth="10"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke={scoreColor} strokeWidth="10"
                  strokeDasharray={`${match.matchScore*2.51} 251`} transform="rotate(-90 50 50)"/>
              </svg>
              <span style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:'14px',fontWeight:'700',color:scoreColor}}>{match.matchScore}</span>
            </div>
          </div>

          {/* Match reason — the "why" */}
          <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:'10px',padding:'10px 12px',fontSize:'13px',color:'#166534'}}>
            🎯 {match.matchReason}
          </div>

          {/* Loan details */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
            {[{l:'Loan Amount',v:`₹${(match.loanAmount/100000).toFixed(1)}L`},{l:'Monthly EMI',v:`₹${(match.emi/1000).toFixed(1)}K`},{l:'Interest Rate',v:`${match.interestRate}%`},{l:'LTV (with 5% buffer)',v:`${match.ltv}%`}].map(d=>(
              <div key={d.l} style={{background:'#f8fafc',borderRadius:'8px',padding:'10px'}}>
                <div style={{fontSize:'11px',color:'#64748b'}}>{d.l}</div>
                <div style={{fontSize:'16px',fontWeight:'700',color:'#1e293b'}}>{d.v}</div>
              </div>
            ))}
          </div>

          {/* Upfront cost breakdown */}
          <div style={{background:'#fff7ed',border:'1px solid #fed7aa',borderRadius:'10px',padding:'12px'}}>
            <div style={{fontSize:'12px',fontWeight:'700',color:'#c2410c',marginBottom:'8px'}}>💸 Total Upfront Cost: ₹{(match.costs.total/1000).toFixed(0)}K</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px',fontSize:'12px',color:'#7c2d12'}}>
              <span>Processing ({match.processingFee?.toFixed(2)||'—'}%):</span><span>₹{(match.costs.processingFee/1000).toFixed(1)}K</span>
              <span>GST on proc. fee (18%):</span><span>₹{(match.costs.gstOnFee/1000).toFixed(1)}K</span>
              <span>Legal/Title fee:</span><span>₹{(match.costs.legalFee/1000).toFixed(1)}K</span>
              <span>Technical/Valuation:</span><span>₹{(match.costs.technicalFee/1000).toFixed(1)}K</span>
            </div>
          </div>

          {/* Processing speed */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:'13px'}}>
            <span style={{color:'#64748b'}}>⏱️ Processing time:</span>
            <strong style={{color:'#1e293b'}}>{match.speedDays} days</strong>
          </div>

          {/* APF status (if new builder loan) */}
          {match.apfStatus && match.apfStatus!=='n/a' && (
            <div style={{fontSize:'12px',padding:'6px 10px',borderRadius:'6px',
              background:match.apfStatus==='approved'?'#f0fdf4':match.apfStatus==='flagged'?'#fef2f2':'#fef9c3',
              color:match.apfStatus==='approved'?'#166534':match.apfStatus==='flagged'?'#991b1b':'#92400e',
              border:`1px solid ${match.apfStatus==='approved'?'#bbf7d0':match.apfStatus==='flagged'?'#fecaca':'#fde68a'}`}}>
              {match.apfStatus==='approved'?'✅ APF Approved builder — pre-vetted, faster legal due-diligence':
               match.apfStatus==='flagged'?'🚫 Flagged builder — verify RERA & construction status before proceeding':
               '⚠️ Builder APF status unknown — verify with bank before booking'}
            </div>
          )}

          {/* Bank strengths */}
          <div>
            <div style={{fontSize:'12px',fontWeight:'700',color:'#475569',marginBottom:'6px'}}>Why {match.shortName}?</div>
            <ul style={{margin:0,padding:'0 0 0 16px',fontSize:'12px',color:'#64748b'}}>
              {match.strengths.slice(0,3).map((s,i)=><li key={i} style={{marginBottom:'2px'}}>{s}</li>)}
            </ul>
          </div>

          {/* Approval probability */}
          <div style={{display:'flex',alignItems:'center',gap:'8px',background:'#f8fafc',borderRadius:'8px',padding:'10px'}}>
            <div style={{flex:1,height:'6px',background:'#e2e8f0',borderRadius:'3px',overflow:'hidden'}}>
              <div style={{height:'100%',width:`${match.approvalProbability}%`,background:match.approvalProbability>=70?'#16a34a':match.approvalProbability>=50?'#d97706':'#dc2626',borderRadius:'3px'}}/>
            </div>
            <span style={{fontSize:'13px',fontWeight:'700',color:'#1e293b',whiteSpace:'nowrap'}}>{match.approvalProbability}% approval</span>
          </div>
        </div>
      );
    };

    // Group matches by category
    const govt = matches.filter(m=>m.category==='Government');
    const pvt  = matches.filter(m=>m.category==='Private');
    const mnc  = matches.filter(m=>m.category==='Multinational');
    const nbfc = matches.filter(m=>m.category==='NBFC-HFC');

    return (
      <div className="results-container">
        <div className="results-header"><h1>Your Loan Assessment Results</h1><p>3-layer engine: Hard Filters → Suitability → Weighted Match Score</p></div>

        {/* Rate disclaimer */}
        <div className="rate-disclaimer">ⓘ <strong>Rates as of February 2026.</strong> Verify current rates on each bank's official website. Processing fees and timelines are indicative.</div>

        {/* Profile Tier Badge */}
        <div style={{background:tier.bg,border:`2px solid ${tier.border}`,borderRadius:'16px',padding:'20px 24px',marginBottom:'20px',display:'flex',alignItems:'center',gap:'16px'}}>
          <div style={{fontSize:'40px'}}>{tier.icon}</div>
          <div>
            <div style={{fontSize:'12px',fontWeight:'700',textTransform:'uppercase',color:tier.color,letterSpacing:'1px'}}>Your Profile Tier</div>
            <div style={{fontSize:'24px',fontWeight:'800',color:tier.color}}>{profileTier} Profile</div>
            <div style={{fontSize:'13px',color:'#64748b',marginTop:'2px'}}>{tier.desc}</div>
          </div>
          <div style={{marginLeft:'auto',display:'flex',gap:'20px',fontSize:'13px'}}>
            <div style={{textAlign:'center'}}><div style={{fontSize:'11px',color:'#64748b'}}>Current DBR</div><div style={{fontWeight:'700',color:currentDBR>0.50?'#dc2626':currentDBR>0.40?'#d97706':'#16a34a'}}>{(currentDBR*100).toFixed(0)}%</div></div>
            <div style={{textAlign:'center'}}><div style={{fontSize:'11px',color:'#64748b'}}>Self-Equity</div><div style={{fontWeight:'700',color:selfEquityPct<0.15?'#dc2626':selfEquityPct<0.20?'#d97706':'#16a34a'}}>{(selfEquityPct*100).toFixed(0)}%</div></div>
            <div style={{textAlign:'center'}}><div style={{fontSize:'11px',color:'#64748b'}}>APF Status</div><div style={{fontWeight:'700',color:apfStatus==='approved'?'#16a34a':apfStatus==='flagged'?'#dc2626':'#d97706'}}>{apfStatus==='approved'?'✅ APF':apfStatus==='flagged'?'🚫 Flagged':apfStatus==='n/a'?'N/A':'⚠️ Unknown'}</div></div>
          </div>
        </div>

        {/* Eligibility summary */}
        <div className="key-finding-card">
          <h2>Your Maximum Loan Amount</h2>
          <div className="final-amount">₹{(finalEligibleAmount/100000).toFixed(1)}L</div>
          <div className="comparison-grid">
            <div className="comparison-item"><span className="label">Your Capacity (A)</span><span className="value">₹{(customerCapacity/100000).toFixed(1)}L</span><span className="sublabel">Income × DBR cap − existing EMIs</span></div>
            <div className="vs">vs</div>
            <div className="comparison-item"><span className="label">Property Ceiling (B)</span><span className="value">₹{(propertyCeiling/100000).toFixed(1)}L</span><span className="sublabel">{layer2Data.loanType==='HL'?'75%':'65%'} LTV incl. 5% safety buffer</span></div>
          </div>
          <div className={`limiting-factor ${limitingFactor}`}>
            <strong>Limiting Factor: {limitingFactor==='income'?'Your Income Capacity':'Property Value (LTV Cap)'}</strong>
            {limitingFactor==='income'&&<p>💡 Even though the property supports more, your income limits the maximum EMI you can afford. To increase eligibility: add a co-applicant or reduce existing EMIs.</p>}
            {limitingFactor==='property'&&<p>💡 Your income can support a higher loan, but banks can only lend up to {layer2Data.loanType==='HL'?'75%':'65%'} of property value (incl. 5% safety buffer). To increase: negotiate a higher property valuation or increase down payment.</p>}
          </div>
        </div>

        {/* MATCHED BANKS */}
        <div className="bank-categories">
          <h2>Bank Matches</h2>
          <p style={{color:'#64748b',fontSize:'14px',marginBottom:'20px'}}>Ranked by weighted score: Rate (40%) + Eligibility (30%) + Cost (20%) + Speed (10%)</p>

          {nbfc.length>0&&<div className="category-section">
            <h3 className="category-title" style={{color:'#7c3aed'}}>🏦 NBFCs / Housing Finance Companies <span style={{fontSize:'13px',fontWeight:'400',color:'#64748b',marginLeft:'8px'}}>(CIBIL below 650 — flexible underwriting)</span></h3>
            <div className="banks-grid">{nbfc.map((m,i)=><BankCard key={i} match={m}/>)}</div>
          </div>}

          {govt.length>0&&<div className="category-section">
            <h3 className="category-title govt">🏛️ Government Banks</h3>
            <div className="banks-grid">{govt.map((m,i)=><BankCard key={i} match={m}/>)}</div>
          </div>}

          {pvt.length>0&&<div className="category-section">
            <h3 className="category-title pvt">🏢 Private Banks</h3>
            <div className="banks-grid">{pvt.map((m,i)=><BankCard key={i} match={m}/>)}</div>
          </div>}

          {mnc.length>0&&<div className="category-section">
            <h3 className="category-title mnc">🌍 Multinational Banks</h3>
            <div className="banks-grid">{mnc.map((m,i)=><BankCard key={i} match={m}/>)}</div>
          </div>}

          {/* Hard-filtered banks — shown transparently */}
          {eliminated.length>0&&(
            <div className="category-section" style={{opacity:'0.85'}}>
              <h3 style={{fontSize:'16px',fontWeight:'700',color:'#dc2626',marginBottom:'12px'}}>🚫 Not Eligible — Hard Filtered</h3>
              <p style={{fontSize:'13px',color:'#64748b',marginBottom:'12px'}}>These banks were removed because your profile doesn't meet their mandatory criteria. This is shown for full transparency.</p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'12px'}}>
                {eliminated.map((b,i)=>(
                  <div key={i} style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'12px',padding:'16px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                      <div><strong style={{color:'#991b1b'}}>{b.shortName}</strong><span style={{fontSize:'12px',color:'#dc2626',display:'block'}}>{b.name}</span></div>
                      <span style={{fontSize:'24px'}}>🚫</span>
                    </div>
                    <div style={{fontSize:'13px',color:'#7f1d1d',background:'#fff',borderRadius:'8px',padding:'8px 10px'}}>{b.eliminationReason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cost comparison side-by-side */}
        {matches.length>0&&(
          <div style={{background:'#f8fafc',borderRadius:'16px',padding:'24px',marginBottom:'24px',border:'1px solid #e2e8f0'}}>
            <h2 style={{fontSize:'20px',fontWeight:'700',color:'#1e293b',marginBottom:'16px'}}>💸 Upfront Cost Comparison</h2>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
                <thead><tr style={{background:'#1e293b',color:'#fff'}}>
                  {['Bank','Rate','Processing Fee','GST on Fee','Legal Fee','Valuation Fee','Total Upfront','Speed'].map(h=><th key={h} style={{padding:'10px 12px',textAlign:'left',fontWeight:'600'}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {matches.map((m,i)=>(
                    <tr key={i} style={{background:i%2===0?'#fff':'#f8fafc',borderBottom:'1px solid #e2e8f0'}}>
                      <td style={{padding:'10px 12px',fontWeight:'700',color:'#1e293b'}}>{m.shortName}</td>
                      <td style={{padding:'10px 12px',color:'#16a34a',fontWeight:'600'}}>{m.interestRate}%</td>
                      <td style={{padding:'10px 12px'}}>₹{(m.costs.processingFee/1000).toFixed(1)}K</td>
                      <td style={{padding:'10px 12px'}}>₹{(m.costs.gstOnFee/1000).toFixed(1)}K</td>
                      <td style={{padding:'10px 12px'}}>₹{(m.costs.legalFee/1000).toFixed(1)}K</td>
                      <td style={{padding:'10px 12px'}}>₹{(m.costs.technicalFee/1000).toFixed(1)}K</td>
                      <td style={{padding:'10px 12px',fontWeight:'700',color:'#dc2626'}}>₹{(m.costs.total/1000).toFixed(1)}K</td>
                      <td style={{padding:'10px 12px',color:'#2563eb'}}>{m.speedDays}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{fontSize:'12px',color:'#94a3b8',marginTop:'8px'}}>* Amounts indicative — final charges as per bank's sanction letter. Processing fee + legal/technical are real upfront cash required before disbursal.</p>
          </div>
        )}

        {renderAmort()}
        {renderRBI()}

        <div className="cta-section">
          <h3>Ready to Proceed?</h3>
          <p>Connect with our loan expert for document verification and bank submission</p>
          href="https://wa.me/919999829407?text=Hi%2C%20I%20completed%20my%20PrimePath%20assessment%20and%20want%20to%20discuss%20next%20steps"
  target="_blank"
  rel="noopener noreferrer"
  className="cta-button"
  style={{display:'inline-flex',alignItems:'center',gap:'8px',textDecoration:'none'}}
>
  💬 Book Free Consultation on WhatsApp
</a>
</div>
      </div>
    );
  };

  return (
    <div className="app">
      {showKycGate && renderKycGate()}
      {currentLayer==='intro' && renderIntro()}
      {currentLayer==='layer1' && renderLayer1()}
      {currentLayer==='layer2' && renderLayer2()}
      {currentLayer==='propertyInsights' && renderPropertyInsights()}
      {currentLayer==='results' && renderResults()}
    </div>
  );
};

export default PrimePathMortgages;
