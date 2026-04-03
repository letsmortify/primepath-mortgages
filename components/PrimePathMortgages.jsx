import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { BANK_POLICIES, NBFC_POLICIES } from './banks';

// ─── SUPABASE (fire-and-forget) ──────────────────────────────────────────────
const supabaseUrl = 'https://rbbktlpaijkozfenyrsf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiYmt0bHBhaWprb3pmZW55cnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNzYxNDAsImV4cCI6MjA4Nzg1MjE0MH0.vB2LOysAyOO3u6iUg5w6pa7dmXGq0G2fwCicpWKv5w8';
let supabase = null;
try { supabase = createClient(supabaseUrl, supabaseKey); } catch (e) { console.warn('Supabase:', e); }

const saveLeadAsync = (payload) => {
  if (!supabase) return;
  supabase.from('leads').insert([payload])
    .then(({ error }) => { if (error) console.warn('Lead (non-critical):', error.message); })
    .catch(e => console.warn('Lead error:', e.message));
};

// ─── APF BUILDER CHECK ───────────────────────────────────────────────────────
const APF_APPROVED = ['dlf','godrej','tata','m3m','sobha','lodha','prestige','brigade','shapoorji','puravankara','mahindra','birla','embassy','oberoi','ats','gaurs','gaur','mahagun','supertech','ace','panchsheel','nirala','ajnara','wave','gulshan','paras','antriksh','eldeco','ansal','vatika','emaar','raheja','signature global','signature','whiteland','elan','conscient','bestech'];
const APF_FLAGGED  = ['unitech','amrapali','jaypee','jp infra','jp infratech'];

const checkAPF = (name) => {
  if (!name) return 'unknown';
  const l = name.toLowerCase();
  if (APF_FLAGGED.some(f => l.includes(f))) return 'flagged';
  if (APF_APPROVED.some(b => l.includes(b))) return 'approved';
  return 'unknown';
};

// ─── NCR MICRO-MARKETS ────────────────────────────────────────────────────────
const NCR = {
  gurugram: [
    { id:'new-gurugram',   name:'New Gurugram',          sectors:'Sectors 70-115',        avgPrice:10350, growth:'+34% YoY',          temp:'hot',  rentalMin:35000,  rentalMax:75000,  rentalYield:3.2, highlights:['11,300+ units launched 2024 — highest in NCR','Strong IT/corporate employment belt','Gurugram Metro Phase 5 proposed alignment','50% of NCR 2025 launches in Gurugram cluster'] },
    { id:'dwarka-exp',     name:'Dwarka Expressway',     sectors:'Sectors 99-113',        avgPrice:11000, growth:'+100% since 2019',   temp:'hot',  rentalMin:40000,  rentalMax:90000,  rentalYield:3.5, highlights:['Operational 8-lane expressway (2024)','15-20 min to IGI Airport','91% ultra-luxury launches in corridor','37% of Gurugram H1 2025 new launches'] },
    { id:'golf-ext',       name:'Golf Course Extension', sectors:'Sectors 58-68',         avgPrice:19500, growth:'+21% YoY',          temp:'warm', rentalMin:80000,  rentalMax:200000, rentalYield:2.8, highlights:['53% of Gurugram H1 2025 luxury launches','Capital values ₹26,000–₹60,000 psf','Rising HNI and NRI demand'] },
    { id:'sohna-road',     name:'Sohna Road',            sectors:'Sectors 47-49, 88',     avgPrice:17400, growth:'+30% YoY',          temp:'hot',  rentalMin:45000,  rentalMax:120000, rentalYield:3.0, highlights:['SPR corridor connects Golf Course Ext to NH-48','Mid-to-premium segment best value'] },
    { id:'old-gurugram',   name:'Old Gurugram / DLF',    sectors:'DLF Phase 1-4',         avgPrice:19000, growth:'+9% YoY',           temp:'warm', rentalMin:60000,  rentalMax:180000, rentalYield:2.5, highlights:['Most mature Gurugram market','DLF flagship projects with premium build quality'] },
    { id:'sohna',          name:'Sohna (South Gurugram)',sectors:'Sohna town',            avgPrice:6000,  growth:'+193% new launches', temp:'hot',  rentalMin:15000,  rentalMax:35000,  rentalYield:3.8, highlights:['Fastest growing affordable hub in Gurugram','Best price-per-sqft entry in Gurugram belt'] },
  ],
  noida: [
    { id:'central-noida',  name:'Central Noida',         sectors:'Sectors 15-50',         avgPrice:16000, growth:'+9% YoY',           temp:'warm', rentalMin:30000,  rentalMax:70000,  rentalYield:2.8, highlights:['Established city centre — proven demand','Noida Metro Blue Line complete coverage'] },
    { id:'noida-exp',      name:'Noida Expressway',      sectors:'Sectors 74-137',        avgPrice:13400, growth:'+10% YoY',          temp:'warm', rentalMin:38500,  rentalMax:69500,  rentalYield:3.1, highlights:['IT parks and MNC offices corridor','Aqua Line metro coverage'] },
    { id:'sector-150',     name:'Sector 150 Zone',       sectors:'Sectors 100-149',       avgPrice:10000, growth:'+24% YoY',          temp:'hot',  rentalMin:28000,  rentalMax:55000,  rentalYield:3.4, highlights:['60% open space — greenest planned sector','Luxury projects: ATS Godrej Tata Prateek'] },
    { id:'gr-noida-west',  name:'Greater Noida West',    sectors:'Tech Zone IV, KP V',    avgPrice:8450,  growth:'+150% new launches', temp:'hot',  rentalMin:18000,  rentalMax:38000,  rentalYield:3.7, highlights:['Highest new launch volume NCR 2024','First-time buyer and investor favourite'] },
  ],
  'greater-noida': [
    { id:'yamuna-exp',     name:'Yamuna Expressway',     sectors:'Sectors near Jewar',    avgPrice:4500,  growth:'Airport impact zone', temp:'hot', rentalMin:12000,  rentalMax:28000,  rentalYield:4.0, highlights:['Noida International Airport by 2026','Highest long-term appreciation potential NCR'] },
    { id:'gnida-sectors',  name:'Greater Noida Central', sectors:'Alpha Beta Gamma',      avgPrice:7000,  growth:'+8% YoY',           temp:'warm', rentalMin:15000,  rentalMax:35000,  rentalYield:3.2, highlights:['Established GNIDA planned sectors','Wide roads and green belts'] },
  ],
  delhi: [
    { id:'south-delhi',    name:'South Delhi',           sectors:'Saket GK1 GK2 Def Col', avgPrice:22000, growth:'+8% YoY',           temp:'warm', rentalMin:159500, rentalMax:253000, rentalYield:2.2, highlights:['Most prestigious belt — very limited supply','Capital values ₹40,250–₹65,500 psf'] },
    { id:'west-delhi',     name:'West Delhi',            sectors:'Dwarka Janakpuri',      avgPrice:14800, growth:'+11% YoY',          temp:'warm', rentalMin:25000,  rentalMax:60000,  rentalYield:2.8, highlights:['Dwarka — Blue and Magenta metro lines','15 min to IGI Airport'] },
    { id:'north-delhi',    name:'North Delhi',           sectors:'Rohini Pitampura',      avgPrice:13500, growth:'+10% YoY',          temp:'warm', rentalMin:20000,  rentalMax:50000,  rentalYield:2.6, highlights:["Rohini — Delhi's largest planned sub-city",'Red Line Metro entire belt'] },
    { id:'east-delhi',     name:'East Delhi',            sectors:'Laxmi Nagar Mayur Vihar',avgPrice:12000,growth:'+9% YoY',           temp:'warm', rentalMin:18000,  rentalMax:45000,  rentalYield:2.9, highlights:['Most affordable Delhi zone','Blue Line Metro border-to-border'] },
  ],
  ghaziabad: [
    { id:'indirapuram',    name:'Indirapuram',           sectors:'Shakti Khand Niti Khand',avgPrice:7500, growth:'+8% YoY',           temp:'warm', rentalMin:18000,  rentalMax:40000,  rentalYield:3.1, highlights:['Most established Ghaziabad hub','NH-24 bypass to Delhi and Noida'] },
    { id:'raj-nagar-ext',  name:'Raj Nagar Extension',   sectors:'NH-58 corridor',        avgPrice:4500,  growth:'+12% YoY',          temp:'hot',  rentalMin:10000,  rentalMax:25000,  rentalYield:3.8, highlights:['Fastest growing affordable segment','Best price-to-space ratio in NCR'] },
    { id:'crossings-rep',  name:'Crossings Republik',    sectors:'NH-24 Belt',            avgPrice:5500,  growth:'+14% YoY',          temp:'hot',  rentalMin:12000,  rentalMax:28000,  rentalYield:3.5, highlights:['Integrated township — self-sufficient living','NH-24 direct Delhi in 40 min'] },
  ],
  faridabad: [
    { id:'nhpc-nit',       name:'NIT / NHPC Area',       sectors:'Central Faridabad',     avgPrice:6800,  growth:'+7% YoY',           temp:'warm', rentalMin:15000,  rentalMax:35000,  rentalYield:3.0, highlights:['Oldest established belt','Violet Line Metro connectivity'] },
    { id:'neharpar',       name:'Neharpar / Greenfield',  sectors:'Sectors 88-96',         avgPrice:4500,  growth:'+12% YoY',          temp:'hot',  rentalMin:10000,  rentalMax:24000,  rentalYield:3.8, highlights:['Fastest growing zone Faridabad','Entry-level investment zone'] },
  ],
};

// ─── LIMITS ───────────────────────────────────────────────────────────────────
const LIMITS = { minLoan:3000000, maxLoan:150000000, minIncome:15000, maxIncome:10000000, minProp:1000000, maxProp:500000000 };

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

const getDBRCap  = (emp) => emp === 'govt-salaried' ? 0.60 : emp === 'private-salaried' ? 0.55 : 0.50;
const cibilToNum = (r)   => r === '750+' ? 780 : r === '700-749' ? 725 : r === '650-699' ? 675 : 580;

const getBankRate = (bank, cibilRange, loanType) => {
  if (loanType === 'LAP') return bank.rateLAP;
  const tier = cibilRange === '750+' ? 'excellent' : cibilRange === '700-749' ? 'good' : 'fair';
  return bank.rateByClBIL?.[tier] || bank.rateHL;
};

const calcApprovalProbability = (bank, profile) => {
  const cibil = cibilToNum(profile.cibilRange);
  if (cibil < (bank.minCIBIL || 650)) return 0;
  if (profile.currentDBR > bank.maxDBR) return 0;
  const cibilScore = cibil >= 780 ? 96 : cibil >= 750 ? 90 : cibil >= 725 ? 83 : cibil >= 700 ? 74 : cibil >= 675 ? 62 : 48;
  const headroom   = bank.maxDBR - profile.currentDBR;
  const hrScore    = headroom > 0.40 ? 98 : headroom > 0.25 ? 90 : headroom > 0.15 ? 78 : headroom > 0.05 ? 60 : 35;
  const histScore  = profile.missedPayments12m === 'yes' ? 25 : profile.missedPayments5y === 'yes' ? 65 : 100;
  const propScore  = profile.apfStatus === 'approved' ? 95 : profile.apfStatus === 'flagged' ? 20 : profile.propertyCategory === 'resale' ? 82 : 72;
  return Math.min(Math.round(cibilScore * 0.40 + hrScore * 0.30 + histScore * 0.20 + propScore * 0.10), 95);
};

const calcProfileTier = ({ currentDBR, cibilRange, employmentType, missedPayments12m, missedPayments5y, selfEquityPct }) => {
  const cibil    = cibilToNum(cibilRange);
  const steady   = employmentType === 'govt-salaried' || employmentType === 'private-salaried';
  const missed   = missedPayments12m === 'yes' || missedPayments5y === 'yes';
  const lowEquity = selfEquityPct < 0.15;
  if (currentDBR > 0.55 || missed || (lowEquity) || cibil < 650) return 'Standard';
  if (currentDBR < 0.40 && cibil >= 700 && steady && !missed) return 'Gold';
  if (currentDBR < 0.40 && cibil >= 750 && !missed) return 'Gold';
  return 'Silver';
};

const hardFilter = (bank, { currentDBR, cibilRange, selfEquityPct, employmentType, customerAge, loanTenure }) => {
  const age      = parseInt(customerAge) || 30;
  const tenure   = parseInt(loanTenure) || 20;
  const salaried = employmentType === 'govt-salaried' || employmentType === 'private-salaried';
  const maxAge   = salaried ? 60 : 70;
  const cibil    = cibilToNum(cibilRange);
  if (age + tenure > maxAge)                           return { pass: false, reason: `Age (${age}) + tenure (${tenure}yr) exceeds maximum end age of ${maxAge} for your employment type` };
  if (bank.category === 'Multinational' && currentDBR > 0.40) return { pass: false, reason: `Your monthly obligations are ${(currentDBR*100).toFixed(0)}% of income — MNC banks cap at 40%` };
  if (bank.category === 'Multinational' && selfEquityPct < 0.15) return { pass: false, reason: `Down payment ${(selfEquityPct*100).toFixed(0)}% is below 15% — MNC banks do not process this case` };
  if (cibil < (bank.minCIBIL || 650) && (bank.category === 'Private' || bank.category === 'Multinational')) return { pass: false, reason: `Credit score below ${bank.minCIBIL} — not eligible for ${bank.category} banks` };
  if (currentDBR > bank.maxDBR)                       return { pass: false, reason: `Monthly obligations at ${(currentDBR*100).toFixed(0)}% — exceeds ${bank.shortName}'s limit of ${(bank.maxDBR*100).toFixed(0)}%` };
  return { pass: true, reason: '' };
};

const calcMatchScore = (bank, profile, allBanks, loanType) => {
  const rates  = allBanks.map(b => loanType === 'HL' ? b.rateHL : b.rateLAP);
  const fees   = allBanks.map(b => b.processingFee);
  const speeds = allBanks.map(b => parseInt(b.speedDays));
  const minR = Math.min(...rates), maxR = Math.max(...rates);
  const minF = Math.min(...fees),  maxF = Math.max(...fees);
  const minS = Math.min(...speeds),maxS = Math.max(...speeds);
  const bankR = getBankRate(bank, profile.cibilRange, loanType);
  const rateScore  = maxR === minR ? 100 : ((maxR - bankR) / (maxR - minR)) * 100;
  const headroom   = bank.maxDBR - profile.currentDBR;
  let eligScore    = headroom > 0.25 ? 55 : headroom > 0.15 ? 40 : headroom > 0.05 ? 25 : 10;
  const c          = cibilToNum(profile.cibilRange);
  eligScore       += c >= 780 ? 45 : c >= 750 ? 35 : c >= 700 ? 22 : c >= 650 ? 10 : 0;
  eligScore        = Math.min(eligScore, 100);
  const costScore  = maxF === minF ? 100 : ((maxF - bank.processingFee) / (maxF - minF)) * 100;
  const speedScore = maxS === minS ? 100 : ((maxS - parseInt(bank.speedDays)) / (maxS - minS)) * 100;
  const p = profile.customerPreference;
  let [rW,eW,cW,sW] = [0.40, 0.30, 0.20, 0.10];
  if (p === 'rate')    [rW,eW,cW,sW] = [0.55, 0.25, 0.15, 0.05];
  if (p === 'speed')   [rW,eW,cW,sW] = [0.30, 0.25, 0.15, 0.30];
  if (p === 'cost')    [rW,eW,cW,sW] = [0.35, 0.20, 0.35, 0.10];
  if (p === 'service') [rW,eW,cW,sW] = [0.35, 0.30, 0.15, 0.20];
  return Math.round(rateScore*rW + eligScore*eW + costScore*cW + speedScore*sW);
};

const matchReason = (bank, profile, tier) => {
  const c = cibilToNum(profile.cibilRange);
  const { employmentType, customerPreference, currentDBR, isAPFApproved } = profile;
  if (bank.key === 'pnb') {
    if (employmentType === 'govt-salaried') return 'Matched because Govt employees are PNB\'s priority segment — fastest approval + lowest overall rate (7.20%)';
    if (currentDBR > 0.35) return 'Matched because PNB has the highest repayment flexibility at 60% — other banks would cap your eligibility lower';
    return 'Matched because PNB delivers the lowest rate (7.20%) and lowest processing fee (0.35%) — best total value of all banks';
  }
  if (bank.key === 'sbi') {
    if (employmentType === 'govt-salaried') return 'Matched because Govt employees get SBI\'s preferred rate tier — every RBI cut reflects in your EMI within 3 months (EBLR-linked)';
    return 'Matched because SBI\'s rate (7.25%) is among the lowest and processing is capped at ₹10,000 regardless of loan size';
  }
  if (bank.key === 'canara') {
    return 'Matched because Canara has the absolute lowest rate (7.15%) and highest LTV (85%) — borrow more at the lowest cost';
  }
  if (bank.key === 'hdfc') {
    if (isAPFApproved) return 'Matched because your builder is HDFC APF-approved — pre-vetted legal due diligence cuts disbursal to 10-18 days';
    if (customerPreference === 'speed') return 'Matched because HDFC has the fastest disbursal in India at 10-18 days — best for your speed priority';
    return 'Matched because HDFC\'s 90% LTV is the highest available — your down payment requirement is minimised';
  }
  if (bank.key === 'icici') {
    if (c >= 750) return 'Matched because your strong credit score unlocks ICICI\'s best rate tier (7.45%) — lowest among private banks';
    if (employmentType === 'professional' || employmentType === 'employer') return 'Matched because ICICI\'s self-employed underwriting is market-leading — ITR averaged over 2 years';
    return 'Matched because ICICI\'s step-up EMI lets you pay lower amounts in early years as your income grows';
  }
  if (bank.key === 'hsbc') return 'Matched because your Gold profile meets HSBC\'s premium criteria — dedicated RM and relationship banking access';
  if (bank.key === 'standard') return 'Matched because your Gold profile qualifies for StanChart\'s Premium Home Loan — fastest track for existing StanChart customers';
  if (bank.category === 'NBFC-HFC') return `Matched because ${bank.shortName} has flexible underwriting standards — structured path to bank eligibility in 12-18 months`;
  return `Matched because your repayment capacity and credit quality align with ${bank.shortName}'s criteria`;
};

const calcUpfrontCosts = (bank, loanAmount) => {
  let fee = Math.round(loanAmount * bank.processingFee / 100);
  if (bank.processingFeeCap) fee = Math.min(fee, bank.processingFeeCap);
  if (bank.processingFeeMin) fee = Math.max(fee, bank.processingFeeMin);
  const gst   = Math.round(fee * 0.18);
  const legal = bank.legalFee || 7500;
  const tech  = 3500;
  return { processingFee: fee, gstOnFee: gst, legalFee: legal, technicalFee: tech, total: fee + gst + legal + tech };
};

const calcLoan = (monthlyEMI, yr, rate = 8.0) => {
  const r = rate / 12 / 100, n = yr * 12;
  if (r === 0) return monthlyEMI * n;
  return Math.max(0, Math.round(monthlyEMI * ((Math.pow(1+r,n)-1) / (r * Math.pow(1+r,n)))));
};

const runEngine = (l1, l2) => {
  const income    = parseInt(l1.monthlyIncome);
  const existing  = parseInt(l1.existingEMIs) || 0;
  const propValue = parseInt(l2.propertyValue);
  const loanAsk   = parseInt(l1.loanAmountNeeded);
  const tenure    = parseInt(l1.loanTenure || 20);
  const loanType  = l2.loanType;
  const currentDBR    = existing / income;
  const selfEquityPct = (propValue - loanAsk) / propValue;
  const apfStatus     = l2.propertyCategory === 'builder-new' ? checkAPF(l2.builderName) : 'n/a';
  const isLowCIBIL    = cibilToNum(l1.cibilRange) < 650;
  const profile = {
    currentDBR, selfEquityPct, apfStatus,
    isAPFApproved: apfStatus === 'approved',
    cibilRange: l1.cibilRange, employmentType: l1.employmentType,
    customerPreference: l1.customerPreference, customerAge: l1.customerAge,
    loanTenure: tenure, missedPayments12m: l1.missedPayments12m,
    missedPayments5y: l1.missedPayments5y, borrowerType: l1.borrowerType,
    propertyCategory: l2.propertyCategory, loanType,
  };
  const profileTier   = calcProfileTier(profile);
  const dbrCap        = getDBRCap(l1.employmentType);
  const avail         = income * dbrCap - existing;
  const capacityNow   = calcLoan(avail, tenure);
  const capacity20yr  = calcLoan(avail, 20);
  const avgLTV        = (loanType === 'HL' ? 0.80 : 0.70) - 0.05;
  const propCeiling   = Math.round(propValue * avgLTV);
  const theoreticalMax = Math.min(capacityNow, propCeiling);
  const finalEligible  = Math.min(theoreticalMax, loanAsk);
  const limitingFactor = capacityNow < propCeiling ? 'income' : 'property';
  const bankPool = isLowCIBIL ? Object.entries(NBFC_POLICIES) : Object.entries(BANK_POLICIES);
  const allVals  = bankPool.map(([,b]) => b);
  const matched = [], eliminated = [];
  bankPool.forEach(([key, bank]) => {
    const f = hardFilter(bank, profile);
    if (!f.pass) { eliminated.push({ ...bank, key, eliminationReason: f.reason }); return; }
    let score = calcMatchScore(bank, profile, allVals, loanType);
    if (loanType === 'HL' && l2.propertyCategory === 'builder-new') {
      if (apfStatus === 'unknown') score = Math.max(0, score - 20);
      if (apfStatus === 'flagged') score = Math.max(0, score - 30);
    }
    const bankRate  = getBankRate(bank, l1.cibilRange, loanType);
    const bankLTV   = (loanType === 'HL' ? bank.ltvHL : bank.ltvLAP) - 0.05;
    const bankMax   = Math.min(propValue * bankLTV, finalEligible);
    const mr        = bankRate / 12 / 100;
    const tn        = tenure * 12;
    const emi       = bankMax * (mr * Math.pow(1+mr,tn)) / (Math.pow(1+mr,tn)-1);
    const costs     = calcUpfrontCosts(bank, bankMax);
    const approval  = calcApprovalProbability(bank, profile);
    const reason    = matchReason({ ...bank, key }, profile, profileTier);
    matched.push({ ...bank, key, loanAmount: Math.round(bankMax), emi: Math.round(emi), interestRate: bankRate, matchScore: score, approvalProbability: approval, costs, matchReason: reason, apfStatus, ltv: (bankLTV*100).toFixed(0) });
  });
  matched.sort((a,b) => b.matchScore - a.matchScore);
  return { profileTier, currentDBR, selfEquityPct, apfStatus, isLowCIBIL, matches: matched, eliminated, capacityNow, capacity20yr, propCeiling, finalEligible, theoreticalMax, limitingFactor, dbrCap, avail, tenure };
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const PrimePathMortgages = () => {
  // sessionStorage helpers — SSR-safe (Next.js compatible)
  const save = (key, val) => { if (typeof window !== 'undefined') { try { sessionStorage.setItem(key, JSON.stringify(val)); } catch {} } };
  const load = (key, fallback) => { if (typeof window === 'undefined') return fallback; try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };

  const L1_DEFAULT = { employmentType:'', customerPreference:'', customerAge:'', loanAmountNeeded:'', monthlyIncome:'', loanTenure:'20', existingEMIs:'', borrowerType:'', missedPayments12m:'', missedPayments5y:'', cibilRange:'' };
  const L2_DEFAULT = { loanType:'', propertySubType:'', propertyUsage:'', propertyCategory:'', decidingDocument:'', propertyValue:'', propertyLocation:'', microMarket:'', buildingSocietyName:'', builderName:'', bhkConfig:'', propertyAge:'' };

  const [step, setStepRaw]       = useState('intro');
  const [l1, setL1Raw]           = useState(L1_DEFAULT);
  const [l2, setL2Raw]           = useState(L2_DEFAULT);
  const [results, setResultsRaw] = useState(null);
  const [kyc, setKyc]            = useState({ name:'', phone:'', email:'', terms:false, consent:false });
  const [showKyc, setShowKyc]    = useState(false);

  // Hydrate from sessionStorage after mount (client-only)
  useEffect(() => {
    setStepRaw(load('pp_step', 'intro'));
    setL1Raw(load('pp_l1', L1_DEFAULT));
    setL2Raw(load('pp_l2', L2_DEFAULT));
    setResultsRaw(load('pp_results', null));
  }, []);

  const setStep    = (v) => { setStepRaw(v);    save('pp_step', v); };
  const setL1      = (v) => { setL1Raw(v);      save('pp_l1', v); };
  const setL2      = (v) => { setL2Raw(v);      save('pp_l2', v); };
  const setResults = (v) => { setResultsRaw(v); save('pp_results', v); };

  const maxTenure = () => {
    const age = parseInt(l1.customerAge) || 30;
    const se  = l1.employmentType === 'employer' || l1.employmentType === 'professional';
    return Math.min(30, Math.max(5, (se ? 70 : 60) - age));
  };

  const submitL1 = () => {
    const req = ['employmentType','customerPreference','customerAge','loanAmountNeeded','monthlyIncome','loanTenure','existingEMIs','borrowerType','missedPayments12m','missedPayments5y','cibilRange'];
    if (!req.every(f => l1[f] !== '')) { alert('Please fill all fields'); return; }
    const loan = parseInt(l1.loanAmountNeeded), inc = parseInt(l1.monthlyIncome);
    if (loan < LIMITS.minLoan || loan > LIMITS.maxLoan) { alert('Loan must be ₹30L–₹15Cr'); return; }
    if (inc < LIMITS.minIncome) { alert('Minimum income ₹15,000/month'); return; }
    setStep('l2');
  };

  const submitL2 = () => {
    const req = ['loanType','propertySubType','propertyCategory','decidingDocument','propertyValue','propertyLocation'];
    if (!req.every(f => l2[f] !== '')) { alert('Please fill all required fields'); return; }
    if (l2.propertyCategory === 'resale' && !l2.propertyUsage) { alert('Please specify property usage'); return; }
    const pv  = parseInt(l2.propertyValue), ln = parseInt(l1.loanAmountNeeded);
    if (pv < LIMITS.minProp || pv > LIMITS.maxProp) { alert('Property value must be ₹10L–₹50Cr'); return; }
    if (ln > pv) { alert('Loan cannot exceed property value'); return; }
    const eq = (pv - ln) / pv;
    if (eq < 0.10) { alert('Down payment below 10% — no bank can fund this. Please increase your down payment.'); return; }
    if (eq < 0.15 && !confirm(`Your down payment is ${(eq*100).toFixed(0)}%. MNC banks need minimum 15%. Continue?`)) return;
    if (l2.microMarket) setStep('insights');
    else setShowKyc(true);
  };

  const submitKyc = () => {
    if (!kyc.name || !kyc.phone || !kyc.email) { alert('Please provide name, phone and email'); return; }
    if (!kyc.terms) { alert('Please agree to Terms of Service'); return; }
    if (!kyc.consent) { alert('Please give consent to be contacted'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(kyc.email)) { alert('Invalid email'); return; }
    if (!/^[6-9]\d{9}$/.test(kyc.phone)) { alert('Invalid 10-digit mobile number'); return; }
    const r = runEngine(l1, l2);
    setResults(r);
    setShowKyc(false);
    setStep('results');
    saveLeadAsync({
      name: kyc.name, phone: kyc.phone, email: kyc.email,
      consent_given: kyc.consent, employment_type: l1.employmentType,
      customer_age: parseInt(l1.customerAge), monthly_salary: parseInt(l1.monthlyIncome),
      loan_amount_needed: parseInt(l1.loanAmountNeeded), loan_tenure: parseInt(l1.loanTenure),
      current_emis: parseInt(l1.existingEMIs) || 0, cibil_range: l1.cibilRange,
      customer_preference: l1.customerPreference, city: l2.propertyLocation,
      property_type: l2.propertySubType, property_category: l2.propertyCategory,
      property_value: parseInt(l2.propertyValue), micro_market: l2.microMarket || null,
      builder_name: l2.builderName || null, building_name: l2.buildingSocietyName || null,
      eligibility_score: r.matches[0]?.matchScore || 0, max_loan_amount: r.finalEligible,
      matched_bank: r.matches[0]?.name || null, tier: r.profileTier, status: 'new',
      notes: `Tier:${r.profileTier}|DBR:${(r.currentDBR*100).toFixed(0)}%|APF:${r.apfStatus}`,
    });
  };

  // ── SHARED STYLES ────────────────────────────────────────────────────────────
  const radioCard = (name, val, emoji, title, desc, key, state, setState) => (
    <label key={val} className="radio-card" style={{ borderColor: state[key]===val ? '#2563eb' : '#e2e8f0', background: state[key]===val ? '#eff6ff' : 'white' }}>
      <input type="radio" name={name} value={val} checked={state[key]===val} onChange={e => setState({ ...state, [key]: e.target.value })} />
      <div><strong>{emoji} {title}</strong>{desc && <p>{desc}</p>}</div>
    </label>
  );

  // ── KYC GATE (defined first so all steps can reference it) ────────────────
  const KycGate = () => (
    <div className="kyc-gate-overlay">
      <div className="kyc-gate-modal">
        <h2>🔐 Almost There!</h2>
        <p className="kyc-subtitle">Your matches are ready — just confirm your details</p>
        <div className="kyc-form">
          {[{ label:'Full Name', type:'text', key:'name', ph:'As per PAN card' },
            { label:'Mobile Number', type:'tel', key:'phone', ph:'10-digit mobile' },
            { label:'Email Address', type:'email', key:'email', ph:'your@email.com' },
          ].map(f => (
            <div key={f.key} className="kyc-input-group">
              <label>{f.label}</label>
              <input type={f.type} placeholder={f.ph} value={kyc[f.key]}
                onChange={e => setKyc({ ...kyc, [f.key]: e.target.value })} />
            </div>
          ))}
          <div className="kyc-terms">
            <label className="terms-checkbox">
              <input type="checkbox" checked={kyc.terms} onChange={e => setKyc({ ...kyc, terms: e.target.checked })} />
              <span>I agree to Terms of Service. Results are indicative — not financial advice.</span>
            </label>
            <label className="terms-checkbox" style={{ marginTop:'12px' }}>
              <input type="checkbox" checked={kyc.consent} onChange={e => setKyc({ ...kyc, consent: e.target.checked })} />
              <span>I consent to be contacted by PrimePath via phone / email / WhatsApp</span>
            </label>
          </div>
          <div className="kyc-actions">
            <button className="btn-back" onClick={() => setShowKyc(false)}>← Back</button>
            <button className="btn-kyc-submit" onClick={submitKyc}>Show My Matches 🎯</button>
          </div>
        </div>
        <p style={{ fontSize:'12px', color:'#94a3b8', textAlign:'center', marginTop:'16px' }}>🔒 Stored on Indian servers per RBI Digital Lending Directions 2025. Never sold.</p>
      </div>
    </div>
  );


  // ── INTRO ────────────────────────────────────────────────────────────────────
  if (step === 'intro') return (
    <div className="intro-container">
      <div className="intro-content">
        <h1>Stop Trusting. Start Knowing.</h1>
        <p className="intro-subtitle">The only platform that tells you exactly which bank will approve your home loan — and why.</p>
        <div className="problem-cards">
          {[{ icon:'🏦', t:'Banks', d:'Long process. Rigid criteria. Never tell you why they said no.' },
            { icon:'🤝', t:'Agents', d:'Push you to banks that pay them commission — not the best bank for you.' },
            { icon:'🔍', t:'Internet', d:"Shows generic calculators. Can't tell you YOUR exact eligibility." }
          ].map(c => (
            <div key={c.t} className="problem-card">
              <div className="problem-icon bad">{c.icon}</div>
              <h3>{c.t}</h3>
              <p>{c.d}</p>
            </div>
          ))}
        </div>
        <div className="solution-card">
          <div className="solution-icon">✨</div>
          <h2>PrimePath: The 4th Path</h2>
          <ul>
            <li><CheckCircle size={20} /> 3-layer matching: Hard Filters → Suitability → Ranked Matches</li>
            <li><CheckCircle size={20} /> Real approval probability — based on your credit quality</li>
            <li><CheckCircle size={20} /> Bank-specific reason for every result</li>
            <li><CheckCircle size={20} /> Total cost of ownership including all fees and taxes</li>
          </ul>
        </div>
        <button className="cta-button" onClick={() => setStep('l1')}>Start Free Assessment <ArrowRight size={20} /></button>
        <p className="trust-line">2,000+ NCR borrowers assessed. Zero spam. No agents involved.</p>
      </div>
    </div>
  );

  // ── LAYER 1 ──────────────────────────────────────────────────────────────────
  if (step === 'l1') {
    const dbrCap  = getDBRCap(l1.employmentType);
    const avail   = l1.monthlyIncome && l1.existingEMIs !== '' ? parseInt(l1.monthlyIncome) * dbrCap - (parseInt(l1.existingEMIs)||0) : null;
    const dbrPct  = l1.monthlyIncome && l1.existingEMIs ? ((parseInt(l1.existingEMIs)||0)/parseInt(l1.monthlyIncome)*100).toFixed(0) : null;
    return (
      <div className="layer-container">
        <div className="layer-header">
          <div className="layer-badge">Step 1 of 2</div>
          <h2>Your Financial Snapshot</h2>
          <p>5 minutes to know your exact eligibility</p>
        </div>
        <div className="form-section">
          <div className="input-group">
            <label>What best describes you?</label>
            <div className="radio-group vertical" style={{ marginTop:'8px' }}>
              {[{ val:'govt-salaried', e:'🏛️', t:'Salaried — Government / PSU / Defence', d:'Central/State Govt, PSU, Railways, Defence' },
                { val:'private-salaried', e:'🏢', t:'Salaried — Private Company', d:'MNC, Indian corporate, startup employee' },
                { val:'professional', e:'🩺', t:'Self-Employed Professional', d:'Doctor, Lawyer, CA, Consultant' },
                { val:'employer', e:'🏭', t:'Business Owner', d:'Manufacturer, Trader, Own account worker' },
              ].map(o => radioCard('emp', o.val, o.e, o.t, o.d, 'employmentType', l1, setL1))}
            </div>
          </div>

          <div className="input-group">
            <label>What matters most in your bank choice?</label>
            <div className="radio-group vertical" style={{ marginTop:'8px' }}>
              {[{ val:'rate', e:'💰', t:'Lowest Interest Rate', d:'Save lakhs over the loan tenure' },
                { val:'speed', e:'⚡', t:'Fastest Disbursal', d:'Need the money in 10-18 days' },
                { val:'cost', e:'🏷️', t:'Lowest Upfront Fees', d:'Minimum processing and legal charges' },
                { val:'service', e:'🤝', t:'Relationship Banking', d:'Dedicated RM and premium experience' },
              ].map(o => radioCard('pref', o.val, o.e, o.t, o.d, 'customerPreference', l1, setL1))}
            </div>
          </div>

          <div className="input-group">
            <label>Your age</label>
            <input type="number" placeholder="e.g. 35" min="21" max="70" value={l1.customerAge}
              onChange={e => setL1({ ...l1, customerAge: e.target.value })}
              style={{ padding:'12px 16px', width:'100%', border:'2px solid #e2e8f0', borderRadius:'10px', fontSize:'16px', boxSizing:'border-box' }} />
            {l1.customerAge && l1.employmentType && (
              <span className="hint">Maximum loan tenure for you: {maxTenure()} years</span>
            )}
          </div>

          <div className="input-group">
            <label>Loan amount you need</label>
            <div className="currency-input">
              <span className="currency">₹</span>
              <input type="number" placeholder="75,00,000" value={l1.loanAmountNeeded}
                onChange={e => setL1({ ...l1, loanAmountNeeded: e.target.value })} />
            </div>
            <span className="hint">Min: ₹30L | Max: ₹15Cr</span>
          </div>

          <div className="input-group">
            <label>Monthly take-home salary (after all deductions)</label>
            <div className="currency-input">
              <span className="currency">₹</span>
              <input type="number" placeholder="1,25,000" value={l1.monthlyIncome}
                onChange={e => setL1({ ...l1, monthlyIncome: e.target.value })} />
            </div>
            {avail !== null && avail > 0 && (
              <div style={{ marginTop:'8px', background:'#f0fdf4', border:'1px solid #86efac', borderRadius:'8px', padding:'10px 12px', fontSize:'13px', color:'#166534' }}>
                ✅ Up to <strong>₹{Math.round(avail).toLocaleString()}/month</strong> is available for your home loan EMI
              </div>
            )}
          </div>

          <div className="input-group">
            <label>Preferred loan tenure</label>
            <select value={l1.loanTenure} onChange={e => setL1({ ...l1, loanTenure: e.target.value })} className="select-input">
              {[5,10,15,20,25,30].filter(t => t <= maxTenure()).map(y => (
                <option key={y} value={y}>{y} Years {y===20 ? '(Most common)' : ''}{y===maxTenure() && parseInt(l1.customerAge||0)>40 ? ' (Max for your age)' : ''}</option>
              ))}
            </select>
            <span className="hint">Longer tenure = lower monthly payment, more total interest paid</span>
          </div>

          <div className="input-group">
            <label>Total monthly EMIs you currently pay</label>
            <div className="currency-input">
              <span className="currency">₹</span>
              <input type="number" placeholder="0" min="0" value={l1.existingEMIs}
                onChange={e => setL1({ ...l1, existingEMIs: e.target.value })} />
            </div>
            <span className="hint">Car loan + personal loan + credit cards combined | Enter 0 if none</span>
            {dbrPct && parseInt(dbrPct) > 0 && (
              <div style={{ marginTop:'6px', background: parseInt(dbrPct)>50 ? '#fef2f2' : '#fef9c3', border:`1px solid ${parseInt(dbrPct)>50 ? '#fca5a5' : '#fde68a'}`, borderRadius:'8px', padding:'8px 12px', fontSize:'13px', color: parseInt(dbrPct)>50 ? '#991b1b' : '#92400e' }}>
                {parseInt(dbrPct) > 50
                  ? '⚠️ Existing EMIs are high — this will significantly reduce your home loan eligibility'
                  : `ℹ️ Existing EMIs use ${dbrPct}% of your income — manageable`}
              </div>
            )}
          </div>

          <div className="input-group">
            <label>Is this your first home loan?</label>
            <div className="radio-group">
              {[{ val:'first-time', l:'Yes, first home loan' }, { val:'repeat', l:"No, I've taken loans before" }].map(o => (
                <label key={o.val} className="radio-option">
                  <input type="radio" name="borrowerType" value={o.val} checked={l1.borrowerType===o.val} onChange={e => setL1({ ...l1, borrowerType: e.target.value })} />
                  <span>{o.l}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label>Any missed loan or credit card payments in the last 12 months?</label>
            <div className="radio-group">
              {[{ val:'no', l:'No — clean record' }, { val:'yes', l:'Yes, there were some' }].map(o => (
                <label key={o.val} className="radio-option">
                  <input type="radio" name="missed12m" value={o.val} checked={l1.missedPayments12m===o.val} onChange={e => setL1({ ...l1, missedPayments12m: e.target.value })} />
                  <span>{o.l}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label>Any missed payments in the last 5 years?</label>
            <div className="radio-group">
              {[{ val:'no', l:'No — clean record' }, { val:'yes', l:'Yes, in the past' }].map(o => (
                <label key={o.val} className="radio-option">
                  <input type="radio" name="missed5y" value={o.val} checked={l1.missedPayments5y===o.val} onChange={e => setL1({ ...l1, missedPayments5y: e.target.value })} />
                  <span>{o.l}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label>Approximate credit score range</label>
            <select value={l1.cibilRange} onChange={e => setL1({ ...l1, cibilRange: e.target.value })} className="select-input">
              <option value="">Select range</option>
              <option value="750+">750+ — Excellent (Best rates unlocked)</option>
              <option value="700-749">700-749 — Good (Most banks eligible)</option>
              <option value="650-699">650-699 — Fair (Government banks preferred)</option>
              <option value="below-650">Below 650 — Needs improvement (NBFC route)</option>
            </select>
            {l1.cibilRange === 'below-650' && (
              <div style={{ marginTop:'8px', background:'#fef9c3', border:'1px solid #f59e0b', borderRadius:'8px', padding:'10px 12px', fontSize:'13px', color:'#92400e' }}>
                ℹ️ We will match you with LIC HFL, PNB Housing and Bajaj HFL — more flexible standards with a structured path to improvement.
              </div>
            )}
          </div>

          <button className="btn-next" onClick={submitL1}>
            Continue to Property Details <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // ── LAYER 2 ──────────────────────────────────────────────────────────────────
  if (step === 'l2') {
    const pv   = l2.propertyValue && parseInt(l2.propertyValue);
    const ln   = parseInt(l1.loanAmountNeeded);
    const eq   = pv && ln ? (pv - ln) / pv : null;
    const apfS = l2.builderName ? checkAPF(l2.builderName) : null;
    return (
      <div className="layer-container">
        <div className="layer-header">
          <div className="layer-badge">Step 2 of 2</div>
          <h2>Property Details</h2>
          <p>This determines the property value ceiling on your loan</p>
        </div>
        <div className="form-section">
          <div className="input-group">
            <label>Loan type</label>
            <div className="radio-group vertical">
              {[{ val:'HL', t:'Home Loan', d:'Buying a new or resale property' },
                { val:'LAP', t:'Loan Against Property', d:'Borrowing against your existing property' },
              ].map(o => (
                <label key={o.val} className="radio-card">
                  <input type="radio" name="loanType" value={o.val} checked={l2.loanType===o.val}
                    onChange={e => setL2({ ...l2, loanType: e.target.value, propertyCategory: o.val==='LAP'?'existing':'', decidingDocument: o.val==='LAP'?'property-papers':'' })} />
                  <div><strong>{o.t}</strong><p>{o.d}</p></div>
                </label>
              ))}
            </div>
          </div>

          {l2.loanType && (
            <div className="input-group">
              <label>Property type</label>
              <div className="radio-group vertical" style={{ marginTop:'8px' }}>
                {(l2.loanType === 'HL'
                  ? [{ val:'apartment', e:'🏢', t:'Apartment / Flat' }, { val:'plot', e:'🌳', t:'Plot / Land' }, { val:'house', e:'🏡', t:'Independent House / Villa' }]
                  : [{ val:'office', e:'🏛️', t:'Commercial Space' }, { val:'apartment', e:'🏢', t:'Residential Apartment' }, { val:'plot', e:'🌳', t:'Plot' }]
                ).map(o => (
                  <label key={o.val} className="radio-card" style={{ borderColor: l2.propertySubType===o.val ? '#2563eb' : '#e2e8f0', background: l2.propertySubType===o.val ? '#eff6ff' : 'white' }}>
                    <input type="radio" name="propSubType" value={o.val} checked={l2.propertySubType===o.val}
                      onChange={e => setL2({ ...l2, propertySubType: e.target.value })} />
                    <div><strong>{o.e} {o.t}</strong></div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {l2.loanType === 'HL' && (
            <div className="input-group">
              <label>Buying from</label>
              <div className="radio-group vertical">
                {[{ val:'builder-new', t:'Builder — New or Under Construction', d:'Buying directly from developer' },
                  { val:'resale', t:'Resale — From existing owner', d:'Buying from current property owner' },
                ].map(o => (
                  <label key={o.val} className="radio-card">
                    <input type="radio" name="propCat" value={o.val} checked={l2.propertyCategory===o.val}
                      onChange={e => setL2({ ...l2, propertyCategory: e.target.value, decidingDocument: o.val==='builder-new'?'booking-form':'agreement-to-sell', propertyUsage:'' })} />
                    <div><strong>{o.t}</strong><p>{o.d}</p></div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {l2.propertyCategory === 'resale' && (
            <div className="input-group">
              <label>Current property usage</label>
              <div className="radio-group vertical" style={{ marginTop:'8px' }}>
                {[{ val:'residential', i:'✅', t:'Residential / Vacant', d:'Standard — no special approval needed' },
                  { val:'commercial', i:'⚠️', t:'Commercial / Office / Business', d:'Requires special bank approval — longer processing' },
                ].map(o => (
                  <label key={o.val} className="radio-card">
                    <input type="radio" name="propUsage" value={o.val} checked={l2.propertyUsage===o.val}
                      onChange={e => setL2({ ...l2, propertyUsage: e.target.value })} />
                    <div><strong>{o.i} {o.t}</strong><p>{o.d}</p></div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {l2.decidingDocument && (
            <div style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:'10px', padding:'14px 16px', marginBottom:'16px' }}>
              <strong style={{ fontSize:'13px', color:'#1e40af' }}>📄 Key Document:</strong>
              <p style={{ margin:'4px 0 0', fontSize:'14px', color:'#1e3a8a' }}>
                {l2.decidingDocument === 'booking-form' ? 'Builder Booking Form / BBA Agreement' : l2.decidingDocument === 'agreement-to-sell' ? 'Agreement to Sell (ATS)' : 'Property Papers / Valuation Report'}
              </p>
              <span style={{ fontSize:'12px', color:'#64748b' }}>The value in this document is what banks use for their loan calculation</span>
            </div>
          )}

          <div className="input-group">
            <label>Property value (as per your document)</label>
            <div className="currency-input">
              <span className="currency">₹</span>
              <input type="number" placeholder="1,00,00,000" value={l2.propertyValue}
                onChange={e => setL2({ ...l2, propertyValue: e.target.value })} />
            </div>
            <span className="hint">Enter exact value from your agreement / booking form / valuation</span>
          </div>

          {eq !== null && (
            <div style={{ background: eq<0.10?'#fef2f2':eq<0.15?'#fef9c3':'#f0fdf4', border:`1px solid ${eq<0.10?'#dc2626':eq<0.15?'#f59e0b':'#16a34a'}`, borderRadius:'10px', padding:'12px 16px', marginBottom:'16px', fontSize:'13px' }}>
              <strong>Your down payment: {(eq*100).toFixed(0)}%</strong> (₹{((pv-ln)/100000).toFixed(1)}L from your own funds)
              {eq < 0.10 && <span style={{ color:'#dc2626', display:'block', marginTop:'4px' }}>❌ Below 10% — no bank can approve this. Please increase your down payment.</span>}
              {eq >= 0.10 && eq < 0.15 && <span style={{ color:'#d97706', display:'block', marginTop:'4px' }}>⚠️ MNC banks require minimum 15% down payment. Govt and Private banks will still process this.</span>}
              {eq >= 0.15 && eq < 0.20 && <span style={{ color:'#d97706', display:'block', marginTop:'4px' }}>ℹ️ All bank categories accessible. Increasing to 20%+ improves your profile tier.</span>}
              {eq >= 0.20 && <span style={{ color:'#16a34a', display:'block', marginTop:'4px' }}>✅ Strong down payment — all bank categories accessible.</span>}
            </div>
          )}

          <div className="input-group">
            <label>Property location</label>
            <select value={l2.propertyLocation} onChange={e => setL2({ ...l2, propertyLocation: e.target.value, microMarket:'' })} className="select-input">
              <option value="">Select city</option>
              {['delhi','gurugram','noida','greater-noida','ghaziabad','faridabad'].map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1).replace('-',' ')}</option>
              ))}
            </select>
          </div>

          {l2.propertyLocation && NCR[l2.propertyLocation] && (
            <div className="input-group">
              <label>Specific area / zone (optional — unlocks market intelligence)</label>
              <select value={l2.microMarket} onChange={e => setL2({ ...l2, microMarket: e.target.value })} className="select-input">
                <option value="">Select area</option>
                {NCR[l2.propertyLocation].map(z => (
                  <option key={z.id} value={z.id}>{z.name} — {z.sectors}</option>
                ))}
              </select>
            </div>
          )}

          {l2.propertySubType === 'apartment' && l2.propertyCategory && (
            <div>
              <h3 style={{ fontSize:'16px', fontWeight:'700', color:'#1e293b', margin:'16px 0 12px' }}>Additional Details</h3>
              <div className="input-group">
                <label>Building / Society name</label>
                <input type="text" placeholder="e.g. Mahagun Moderne, DLF Crest" value={l2.buildingSocietyName}
                  onChange={e => setL2({ ...l2, buildingSocietyName: e.target.value })} className="text-input" />
              </div>
              {l2.propertyCategory === 'builder-new' && (
                <div className="input-group">
                  <label>Builder / Developer name <span style={{ fontSize:'12px', color:'#64748b', fontWeight:'400' }}>(used for APF check)</span></label>
                  <input type="text" placeholder="e.g. DLF, Godrej, M3M, Mahagun" value={l2.builderName}
                    onChange={e => setL2({ ...l2, builderName: e.target.value })} className="text-input" />
                  {apfS && (
                    <div style={{ marginTop:'6px', background: apfS==='approved'?'#f0fdf4':apfS==='flagged'?'#fef2f2':'#fef9c3', border:`1px solid ${apfS==='approved'?'#16a34a':apfS==='flagged'?'#dc2626':'#f59e0b'}`, borderRadius:'6px', padding:'6px 10px', fontSize:'12px', color: apfS==='approved'?'#166534':apfS==='flagged'?'#991b1b':'#92400e' }}>
                      {apfS==='approved' ? '✅ Tier 1 builder — likely pre-approved by major banks. Faster processing.' : apfS==='flagged' ? '🚫 This builder has a history of stalled projects. Verify RERA status before booking.' : '⚠️ Builder not in our approved list. Confirm APF status with bank before signing.'}
                    </div>
                  )}
                </div>
              )}
              <div className="input-group">
                <label>BHK configuration</label>
                <select value={l2.bhkConfig} onChange={e => setL2({ ...l2, bhkConfig: e.target.value })} className="select-input">
                  <option value="">Select</option>
                  {['1 BHK','2 BHK','3 BHK','4 BHK','5+ BHK'].map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              {l2.propertyCategory === 'resale' && (
                <div className="input-group">
                  <label>Property age</label>
                  <select value={l2.propertyAge} onChange={e => setL2({ ...l2, propertyAge: e.target.value })} className="select-input">
                    <option value="">Select</option>
                    {['0-5 years','5-10 years','10-20 years','20+ years'].map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="nav-buttons">
            <button className="btn-back" onClick={() => setStep('l1')}>← Back</button>
            <button className="btn-next" onClick={submitL2}>See Bank Matches <ArrowRight size={20} /></button>
          </div>
        </div>
      </div>
    );
  }

  // ── PROPERTY INSIGHTS ────────────────────────────────────────────────────────
  if (step === 'insights') {
    const zone = NCR[l2.propertyLocation]?.find(z => z.id === l2.microMarket);
    if (!zone) { setShowKyc(true); return null; }
    const pv   = parseInt(l2.propertyValue);
    const isUC = l2.propertyCategory === 'builder-new';
    const gst  = isUC ? Math.round(pv * 0.05) : 0;
    // Verified stamp duty rates 2026 (gender-neutral average shown)
    // Delhi: 6% male / 4% female | UP (Noida/GN/Ghz): 7% male / 6% female
    // Haryana (Gurugram/Faridabad): 7% male / 5% female
    const STAMP_RATES = {
      delhi:         { male: 0.06, female: 0.04, label: '6% (male) / 4% (female)' },
      gurugram:      { male: 0.07, female: 0.05, label: '7% (male) / 5% (female)' },
      noida:         { male: 0.07, female: 0.06, label: '7% (male) / 6% (female)' },
      'greater-noida':{ male: 0.07, female: 0.06, label: '7% (male) / 6% (female)' },
      ghaziabad:     { male: 0.07, female: 0.06, label: '7% (male) / 6% (female)' },
      faridabad:     { male: 0.07, female: 0.05, label: '7% (male) / 5% (female)' },
    };
    const stampRates = STAMP_RATES[l2.propertyLocation] || { male: 0.07, female: 0.06, label: '7% (male) / 6% (female)' };
    const stampMale   = Math.round(pv * stampRates.male);
    const stampFemale = Math.round(pv * stampRates.female);
    const stamp = stampMale; // show male rate as default; female shown in table
    // Registration: Delhi/UP = 1% | Haryana (Gurugram/Faridabad) = capped at ₹50,000
    const isHaryana = l2.propertyLocation === 'gurugram' || l2.propertyLocation === 'faridabad';
    const reg = isHaryana
      ? Math.min(Math.round(pv * 0.01), 50000)
      : Math.round(pv * 0.01);
    const total = gst + stampMale + reg; // total shown for male buyer (conservative)
    const sqft  = Math.round(pv / zone.avgPrice);
    const diff  = ((pv/sqft) - zone.avgPrice) / zone.avgPrice * 100;
    const scores = {
      price: diff < -10 ? 95 : diff > 15 ? 50 : diff > 10 ? 60 : 78,
      market: zone.temp === 'hot' ? 90 : zone.temp === 'warm' ? 72 : 55,
      legal: isUC ? 75 : 90,
      rental: zone.rentalYield >= 3.5 ? 90 : zone.rentalYield >= 3.0 ? 78 : 65,
    };
    const overall    = Math.round((scores.price + scores.market + scores.legal + scores.rental) / 4);
    const scoreColor = overall >= 80 ? '#16a34a' : overall >= 65 ? '#d97706' : '#dc2626';
    return (
      <>
      {showKyc && <KycGate />}
      <div className="layer-container insights-v2" style={{ maxWidth:'960px' }}>
        <div className="layer-header">
          <div className="layer-badge">Property Intelligence</div>
          <h2>📍 {zone.name}</h2>
          <p>PropIndex Q4 2025 · Cushman and Wakefield · Savills H1 2025</p>
        </div>
        <div className="confidence-banner">
          <div className="confidence-main">
            <div className="confidence-dial" style={{ borderColor: scoreColor }}>
              <span className="dial-number" style={{ color: scoreColor }}>{overall}</span>
              <span className="dial-label">/100</span>
            </div>
            <div className="confidence-text">
              <h3 style={{ color: scoreColor }}>{overall >= 80 ? 'Excellent Buy' : overall >= 65 ? 'Good Buy' : 'Proceed with Caution'}</h3>
              <p>PrimePath Property Score</p>
            </div>
          </div>
          <div className="progress-bars">
            {[{ l:'Price vs Market', s:scores.price, c:'#2563eb' }, { l:'Market Momentum', s:scores.market, c:'#d97706' }, { l:'Legal Readiness', s:scores.legal, c:'#7c3aed' }, { l:'Rental Potential', s:scores.rental, c:'#16a34a' }].map(b => (
              <div key={b.l} className="progress-item">
                <div className="progress-label"><span>{b.l}</span><strong style={{ color: b.c }}>{b.s}/100</strong></div>
                <div className="progress-track"><div className="progress-fill" style={{ width:`${b.s}%`, background: b.c }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="insights-grid-v2">
          <div className="insight-card-v2">
            <h3>💰 Price Analysis</h3>
            {[{ l:'Your Property', v:`₹${(pv/10000000).toFixed(2)} Cr` }, { l:'Market Avg PSF', v:`₹${zone.avgPrice.toLocaleString()}` }, { l:'Est. Size', v:`~${sqft} sqft` }].map(r => (
              <div key={r.l} className="price-row"><span>{r.l}:</span><strong>{r.v}</strong></div>
            ))}
            {diff < -10
              ? <div className="alert-box good-deal">✅ Good deal — {Math.abs(diff).toFixed(0)}% below market</div>
              : diff > 10
              ? <div className="alert-box verify-alert">⚠️ {diff.toFixed(0)}% above market average — verify what justifies the premium</div>
              : <div className="alert-box neutral">✓ Fair price — within market range</div>}
          </div>
          <div className="insight-card-v2">
            <h3>🌡️ Market Momentum</h3>
            <div className={`temp-badge ${zone.temp}`}>{zone.temp === 'hot' ? '🔥 HOT MARKET' : '📈 WARM MARKET'}</div>
            {[{ l:'Price Growth', v:zone.growth }, { l:'Area', v:zone.sectors }, { l:'Outlook', v:zone.temp === 'hot' ? '⬆️ Bullish' : '→ Steady' }].map(r => (
              <div key={r.l} className="temp-row"><span>{r.l}:</span><strong>{r.v}</strong></div>
            ))}
          </div>
        </div>
        <div className="insight-full-card">
          <h3>📍 Area Highlights</h3>
          <ul className="highlights-list-v2">{zone.highlights.map((h,i) => <li key={i}>✓ {h}</li>)}</ul>
        </div>
        <div className="insight-full-card cost-card">
          <h3>🧾 True Cost of Buying</h3>
          <div className="cost-table">
            <div className="cost-row header-row"><span>Cost</span><span>Rate</span><span>Amount</span></div>
            <div className="cost-row"><span>Base Price</span><span>—</span><span>₹{(pv/10000000).toFixed(2)} Cr</span></div>
            {isUC
              ? <div className="cost-row highlight-row"><span>GST (Under-Construction)</span><span>5%</span><span>₹{(gst/100000).toFixed(1)}L</span></div>
              : <div className="cost-row good-row"><span>GST (Ready-to-Move)</span><span>NIL ✅</span><span>₹0</span></div>}
            <div className="cost-row highlight-row">
              <span>Stamp Duty <span style={{fontSize:'11px',color:'#64748b'}}>(male buyer)</span></span>
              <span>{stampRates.label.split('/')[0].trim()}</span>
              <span>₹{(stampMale/100000).toFixed(1)}L</span>
            </div>
            <div className="cost-row good-row">
              <span>Stamp Duty <span style={{fontSize:'11px',color:'#16a34a'}}>(female buyer saves)</span></span>
              <span>{stampRates.label.split('/')[1].trim()}</span>
              <span>₹{(stampFemale/100000).toFixed(1)}L ✅</span>
            </div>
            <div className="cost-row"><span>Registration</span><span>{isHaryana ? 'Capped ₹50K' : '1%'}</span><span>₹{(reg/1000).toFixed(0)}K</span></div>
            <div className="cost-row total-row"><span><strong>Total Additional</strong></span><span></span><span><strong>₹{(total/100000).toFixed(1)}L ({((total/pv)*100).toFixed(1)}%)</strong></span></div>
          </div>
          <div className="cost-note">💡 Banks fund only the base price. Stamp duty, registration and GST must come from your own pocket.</div>
        </div>
        <div className="nav-buttons">
          <button className="btn-back" onClick={() => setStep('l2')}>← Back</button>
          <button className="btn-next" onClick={() => setShowKyc(true)}>See My Bank Matches <ArrowRight size={20} /></button>
        </div>
      </div>
      </>
    );
  }

  // ── KYC GATE ─────────────────────────────────────────────────────────────────
  // ── RESULTS ──────────────────────────────────────────────────────────────────
  if (step === 'results' && results) {
    const { profileTier, currentDBR, selfEquityPct, apfStatus, isLowCIBIL, matches, eliminated, capacityNow, capacity20yr, propCeiling, finalEligible, theoreticalMax, limitingFactor, dbrCap, tenure } = results;
    const loanAsk = parseInt(l1.loanAmountNeeded);
    const shortfall = loanAsk - theoreticalMax;
    const TIER = {
      Gold:     { color:'#d97706', bg:'#fef3c7', border:'#fbbf24', icon:'🥇', desc:"Top tier — best rates and fastest approvals from all bank categories" },
      Silver:   { color:'#64748b', bg:'#f1f5f9', border:'#94a3b8', icon:'🥈', desc:'Strong profile — Government and Private banks fully accessible' },
      Standard: { color:'#dc2626', bg:'#fef2f2', border:'#fca5a5', icon:'⚠️',  desc:'Some factors limit your options — focus on the recommended banks' },
    };
    const tier = TIER[profileTier];
    const fmt  = (n) => n >= 10000000 ? `₹${(n/10000000).toFixed(2)}Cr` : `₹${(n/100000).toFixed(1)}L`;

    // Amortization
    const AmortSection = () => {
      const best  = matches[0];
      const rate  = best ? best.interestRate : 8.0;
      const P     = finalEligible;
      const mr    = rate / 12 / 100;
      const tn    = tenure * 12;
      const emi   = P * (mr * Math.pow(1+mr,tn)) / (Math.pow(1+mr,tn)-1);
      let bal     = P;
      const rows  = [];
      for (let y = 1; y <= tenure; y++) {
        let yP = 0, yI = 0;
        for (let m = 0; m < 12; m++) { const i = bal*mr; const p = emi-i; yI+=i; yP+=p; bal-=p; }
        rows.push({ year:y, principal:Math.round(yP), interest:Math.round(yI), balance:Math.max(0,Math.round(bal)) });
      }
      const totalInt = rows.reduce((s,r) => s + r.interest, 0);
      const maxBar   = Math.max(...rows.map(r => r.principal + r.interest));
      const step     = Math.ceil(tenure / 15);
      const display  = rows.filter((_,i) => i % step === 0 || i === tenure - 1);
      const H        = 160;
      return (
        <div className="amort-section">
          <h2 style={{ fontSize:'22px', fontWeight:'700', color:'#1e293b', marginBottom:'4px' }}>📊 Amortization Schedule</h2>
          <p style={{ color:'#64748b', marginBottom:'20px', fontSize:'14px' }}>At {rate}% over {tenure} years — {best?.shortName || 'best matched bank'}</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'24px' }}>
            {[{ l:'Loan Amount', v:fmt(P), c:'#1e293b' }, { l:'Monthly EMI', v:`₹${Math.round(emi).toLocaleString()}`, c:'#2563eb' }, { l:'Total Interest', v:fmt(totalInt), c:'#ef4444' }, { l:'Total Cost', v:fmt(P+totalInt), c:'#1e293b' }].map(s => (
              <div key={s.l} style={{ background:'#f8fafc', borderRadius:'12px', padding:'16px', textAlign:'center', border:'1px solid #e2e8f0' }}>
                <div style={{ fontSize:'12px', color:'#64748b', marginBottom:'4px' }}>{s.l}</div>
                <div style={{ fontSize:'20px', fontWeight:'700', color: s.c }}>{s.v}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'16px', marginBottom:'8px', fontSize:'13px' }}>
            <span style={{ display:'flex', alignItems:'center', gap:'6px' }}><span style={{ width:'14px', height:'14px', background:'#1e3a5f', display:'inline-block', borderRadius:'3px' }} />Principal</span>
            <span style={{ display:'flex', alignItems:'center', gap:'6px' }}><span style={{ width:'14px', height:'14px', background:'#ef4444', display:'inline-block', borderRadius:'3px' }} />Interest</span>
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:'6px', height:`${H+30}px`, borderBottom:'2px solid #e2e8f0', marginBottom:'16px', overflowX:'auto' }}>
            {display.map(d => {
              const iH = Math.round((d.interest / maxBar) * H);
              const pH = Math.round((d.principal / maxBar) * H);
              return (
                <div key={d.year} style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:'1', minWidth:'28px' }}
                  title={`Year ${d.year} — Principal: ₹${(d.principal/1000).toFixed(0)}K | Interest: ₹${(d.interest/1000).toFixed(0)}K`}>
                  <div style={{ display:'flex', flexDirection:'column', width:'100%' }}>
                    <div style={{ height:`${iH}px`, background:'#ef4444', borderRadius:'4px 4px 0 0', minHeight: iH > 0 ? '4px' : '0' }} />
                    <div style={{ height:`${pH}px`, background:'#1e3a5f', minHeight: pH > 0 ? '4px' : '0', borderRadius: iH === 0 ? '4px' : '0 0 4px 4px' }} />
                  </div>
                  <span style={{ fontSize:'10px', color:'#94a3b8', marginTop:'4px' }}>Yr{d.year}</span>
                </div>
              );
            })}
          </div>
          <div style={{ background:'#fef9c3', border:'1px solid #f59e0b', borderRadius:'10px', padding:'14px 16px', marginBottom:'20px', fontSize:'14px' }}>
            💡 In early years most of each payment is interest. <strong>Every extra payment you make saves double in the long run.</strong>
          </div>
          <details>
            <summary style={{ cursor:'pointer', fontWeight:'600', color:'#2563eb', fontSize:'14px', padding:'8px 0' }}>▶ View Full Year-by-Year Schedule</summary>
            <div style={{ overflowX:'auto', marginTop:'12px' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
                <thead>
                  <tr style={{ background:'#f1f5f9' }}>
                    {['Year','Principal Paid','Interest Paid','Balance'].map(h => (
                      <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontWeight:'600', color:'#475569' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r,i) => (
                    <tr key={r.year} style={{ background: i%2===0 ? '#fff' : '#f8fafc' }}>
                      <td style={{ padding:'8px 12px' }}>{r.year}</td>
                      <td style={{ padding:'8px 12px', color:'#1e3a5f', fontWeight:'500' }}>₹{(r.principal/1000).toFixed(1)}K</td>
                      <td style={{ padding:'8px 12px', color:'#ef4444', fontWeight:'500' }}>₹{(r.interest/1000).toFixed(1)}K</td>
                      <td style={{ padding:'8px 12px', color:'#64748b' }}>{fmt(r.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      );
    };

    // Bank card
    const BankCard = ({ m }) => {
      const sc = m.matchScore >= 70 ? '#16a34a' : m.matchScore >= 50 ? '#d97706' : '#dc2626';
      const pc = m.approvalProbability >= 80 ? '#16a34a' : m.approvalProbability >= 65 ? '#d97706' : '#dc2626';
      return (
        <div style={{ background:'#fff', borderRadius:'16px', padding:'20px', border:'1px solid #e2e8f0', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', display:'flex', flexDirection:'column', gap:'12px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <h4 style={{ fontSize:'18px', fontWeight:'700', color:'#1e293b', margin:0 }}>{m.shortName}</h4>
              <p style={{ fontSize:'13px', color:'#64748b', margin:'2px 0 0' }}>{m.name}</p>
              <span style={{ fontSize:'11px', background:'#f1f5f9', color:'#475569', padding:'2px 8px', borderRadius:'20px', display:'inline-block', marginTop:'4px' }}>{m.category}</span>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'11px', color:'#64748b', marginBottom:'2px' }}>Match Score</div>
              <div style={{ position:'relative', width:'56px', height:'56px' }}>
                <svg viewBox="0 0 100 100" style={{ width:'56px', height:'56px' }}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e0e0e0" strokeWidth="12" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={sc} strokeWidth="12"
                    strokeDasharray={`${m.matchScore*2.51} 251`} transform="rotate(-90 50 50)" />
                </svg>
                <span style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', fontSize:'13px', fontWeight:'700', color: sc }}>{m.matchScore}</span>
              </div>
            </div>
          </div>
          <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'10px', padding:'10px 12px', fontSize:'13px', color:'#166534' }}>
            🎯 {m.matchReason}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            {[{ l:'Loan Amount', v:fmt(m.loanAmount) }, { l:'Monthly EMI', v:`₹${(m.emi/1000).toFixed(1)}K` }, { l:'Interest Rate', v:`${m.interestRate}% p.a.` }, { l:'LTV (5% buffer)', v:`${m.ltv}%` }].map(d => (
              <div key={d.l} style={{ background:'#f8fafc', borderRadius:'8px', padding:'10px' }}>
                <div style={{ fontSize:'11px', color:'#64748b' }}>{d.l}</div>
                <div style={{ fontSize:'16px', fontWeight:'700', color:'#1e293b' }}>{d.v}</div>
              </div>
            ))}
          </div>
          <div style={{ background:'#fff7ed', border:'1px solid #fed7aa', borderRadius:'10px', padding:'12px' }}>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#c2410c', marginBottom:'8px' }}>💸 Upfront Cost: ₹{(m.costs.total/1000).toFixed(0)}K</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px', fontSize:'12px', color:'#7c2d12' }}>
              <span>Processing fee:</span><span>₹{(m.costs.processingFee/1000).toFixed(1)}K</span>
              <span>GST on fee (18%):</span><span>₹{(m.costs.gstOnFee/1000).toFixed(1)}K</span>
              <span>Legal/Title fee:</span><span>₹{(m.costs.legalFee/1000).toFixed(1)}K</span>
              <span>Valuation fee:</span><span>₹{(m.costs.technicalFee/1000).toFixed(1)}K</span>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'13px' }}>
            <span style={{ color:'#64748b' }}>⏱ Processing time:</span>
            <strong>{m.speedDays} days</strong>
          </div>
          {m.apfStatus && m.apfStatus !== 'n/a' && (
            <div style={{ fontSize:'12px', padding:'6px 10px', borderRadius:'6px', background: m.apfStatus==='approved'?'#f0fdf4':m.apfStatus==='flagged'?'#fef2f2':'#fef9c3', color: m.apfStatus==='approved'?'#166534':m.apfStatus==='flagged'?'#991b1b':'#92400e', border:`1px solid ${m.apfStatus==='approved'?'#bbf7d0':m.apfStatus==='flagged'?'#fecaca':'#fde68a'}` }}>
              {m.apfStatus==='approved' ? '✅ APF-approved builder — pre-vetted, faster legal processing' : m.apfStatus==='flagged' ? '🚫 Flagged builder — verify RERA before proceeding' : '⚠️ Builder APF status unknown — verify with bank before signing'}
            </div>
          )}
          <div>
            <div style={{ fontSize:'12px', fontWeight:'700', color:'#475569', marginBottom:'6px' }}>Why {m.shortName}:</div>
            <ul style={{ margin:0, padding:'0 0 0 16px', fontSize:'12px', color:'#64748b' }}>
              {m.strengths.slice(0,3).map((s,i) => <li key={i} style={{ marginBottom:'2px' }}>{s}</li>)}
            </ul>
          </div>
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'13px', marginBottom:'6px' }}>
              <span style={{ color:'#64748b' }}>Approval probability:</span>
              <strong style={{ color: pc }}>{m.approvalProbability > 0 ? `${m.approvalProbability}%` : 'Not eligible'}</strong>
            </div>
            <div style={{ height:'6px', background:'#e2e8f0', borderRadius:'3px', overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${m.approvalProbability}%`, background: pc, borderRadius:'3px' }} />
            </div>
            {m.approvalProbability >= 80 && <div style={{ fontSize:'11px', color:'#16a34a', marginTop:'4px' }}>Strong candidate — your credit profile meets this bank's preferred criteria</div>}
            {m.approvalProbability >= 65 && m.approvalProbability < 80 && <div style={{ fontSize:'11px', color:'#d97706', marginTop:'4px' }}>Good chance — minor aspects may need clarification during processing</div>}
            {m.approvalProbability > 0 && m.approvalProbability < 65 && <div style={{ fontSize:'11px', color:'#dc2626', marginTop:'4px' }}>Some risk — improve credit score or reduce existing obligations before applying</div>}
          </div>
        </div>
      );
    };

    const govt = matches.filter(m => m.category === 'Government');
    const pvt  = matches.filter(m => m.category === 'Private');
    const mnc  = matches.filter(m => m.category === 'Multinational');
    const nbfc = matches.filter(m => m.category === 'NBFC-HFC');

    return (
      <div className="results-container">
        {showKyc && <KycGate />}
        <div className="results-header">
          <h1>Your Loan Assessment</h1>
          <p>Rate (40%) + Eligibility (30%) + Cost (20%) + Speed (10%)</p>
        </div>
        <div className="rate-disclaimer">ⓘ Rates as of March 2026. Verify on each bank's website before applying. Source: LiveMint, Goodreturns.</div>

        <div style={{ background: tier.bg, border:`2px solid ${tier.border}`, borderRadius:'16px', padding:'20px 24px', marginBottom:'20px', display:'flex', alignItems:'center', gap:'16px', flexWrap:'wrap' }}>
          <div style={{ fontSize:'40px' }}>{tier.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:'12px', fontWeight:'700', textTransform:'uppercase', color: tier.color, letterSpacing:'1px' }}>Profile Assessment</div>
            <div style={{ fontSize:'24px', fontWeight:'800', color: tier.color }}>{profileTier} Profile</div>
            <div style={{ fontSize:'13px', color:'#64748b', marginTop:'2px' }}>{tier.desc}</div>
          </div>
          <div style={{ display:'flex', gap:'20px', fontSize:'13px', flexWrap:'wrap' }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'11px', color:'#64748b' }}>Monthly capacity used</div>
              <div style={{ fontWeight:'700', color: currentDBR > 0.50 ? '#dc2626' : currentDBR > 0.35 ? '#d97706' : '#16a34a' }}>{(currentDBR*100).toFixed(0)}% of income</div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'11px', color:'#64748b' }}>Down payment</div>
              <div style={{ fontWeight:'700', color: selfEquityPct < 0.15 ? '#dc2626' : selfEquityPct < 0.20 ? '#d97706' : '#16a34a' }}>{(selfEquityPct*100).toFixed(0)}%</div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'11px', color:'#64748b' }}>Builder status</div>
              <div style={{ fontWeight:'700', color: apfStatus==='approved'?'#16a34a':apfStatus==='flagged'?'#dc2626':'#d97706' }}>
                {apfStatus==='approved'?'✅ Pre-vetted':apfStatus==='flagged'?'🚫 Flagged':apfStatus==='n/a'?'N/A':'⚠️ Unverified'}
              </div>
            </div>
          </div>
        </div>

        <div className="key-finding-card">
          <h2>Your Maximum Loan Eligibility</h2>
          <div className="final-amount">{fmt(finalEligible)}</div>
          <div className="comparison-grid">
            <div className="comparison-item">
              <span className="label">Income capacity ({tenure}yr tenure)</span>
              <span className="value">{fmt(capacityNow)}</span>
              <span className="sublabel">Based on {(dbrCap*100).toFixed(0)}% max monthly commitment</span>
            </div>
            <div className="vs">vs</div>
            <div className="comparison-item">
              <span className="label">Property ceiling (LTV)</span>
              <span className="value">{fmt(propCeiling)}</span>
              <span className="sublabel">75% of {fmt(parseInt(l2.propertyValue))} with 5% safety buffer</span>
            </div>
          </div>

          {shortfall > 0 && (
            <div style={{ marginTop:'16px', background:'#eff6ff', border:'1px solid #93c5fd', borderRadius:'12px', padding:'16px 20px' }}>
              <div style={{ fontSize:'14px', fontWeight:'700', color:'#1e40af', marginBottom:'12px' }}>
                📊 You need {fmt(loanAsk)} — here is how to get closer:
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px', fontSize:'13px' }}>
                <div style={{ background:'#fff', borderRadius:'8px', padding:'12px', textAlign:'center' }}>
                  <div style={{ fontSize:'11px', color:'#64748b', marginBottom:'4px' }}>At {tenure}yr (current)</div>
                  <div style={{ fontSize:'18px', fontWeight:'700', color:'#2563eb' }}>{fmt(theoreticalMax)}</div>
                  {shortfall > 0 && <div style={{ fontSize:'11px', color:'#dc2626' }}>{fmt(shortfall)} short</div>}
                </div>
                {tenure < 20 && (
                  <div style={{ background:'#f0fdf4', border:'1px solid #86efac', borderRadius:'8px', padding:'12px', textAlign:'center' }}>
                    <div style={{ fontSize:'11px', color:'#64748b', marginBottom:'4px' }}>At 20yr tenure</div>
                    <div style={{ fontSize:'18px', fontWeight:'700', color:'#16a34a' }}>{fmt(Math.min(capacity20yr, propCeiling, loanAsk))}</div>
                    <div style={{ fontSize:'11px', color:'#16a34a' }}>Extend tenure to unlock more</div>
                  </div>
                )}
                <div style={{ background:'#fff', borderRadius:'8px', padding:'12px', textAlign:'center' }}>
                  <div style={{ fontSize:'11px', color:'#64748b', marginBottom:'4px' }}>Add co-applicant</div>
                  <div style={{ fontSize:'18px', fontWeight:'700', color:'#7c3aed' }}>↑ ~30%</div>
                  <div style={{ fontSize:'11px', color:'#7c3aed' }}>Eligibility boost</div>
                </div>
              </div>
              {tenure < 20 && (
                <div style={{ marginTop:'12px', fontSize:'13px', color:'#1e40af', background:'#dbeafe', borderRadius:'8px', padding:'10px 12px' }}>
                  💡 <strong>Quick fix:</strong> Extending from {tenure} to 20 years gives you {fmt(Math.min(capacity20yr,propCeiling)-theoreticalMax)} more — closest to your target of {fmt(loanAsk)}.
                </div>
              )}
            </div>
          )}

          {shortfall <= 0 && (
            <div style={{ marginTop:'12px', background:'#f0fdf4', border:'1px solid #86efac', borderRadius:'10px', padding:'12px 16px', fontSize:'14px', color:'#166534' }}>
              ✅ <strong>Your requested loan amount is within your eligibility.</strong> {limitingFactor === 'property' ? 'Your income can support more, but banks cap at 75% of property value.' : 'Your income and property value both support this loan.'}
            </div>
          )}
        </div>

        <div className="bank-categories">
          <h2>Your Bank Matches</h2>
          {nbfc.length > 0 && (
            <div className="category-section">
              <h3 className="category-title" style={{ color:'#7c3aed' }}>🏦 NBFC / Housing Finance Companies</h3>
              <div className="banks-grid">{nbfc.map((m,i) => <BankCard key={i} m={m} />)}</div>
            </div>
          )}
          {govt.length > 0 && (
            <div className="category-section">
              <h3 className="category-title govt">🏛️ Government Banks</h3>
              <div className="banks-grid">{govt.map((m,i) => <BankCard key={i} m={m} />)}</div>
            </div>
          )}
          {pvt.length > 0 && (
            <div className="category-section">
              <h3 className="category-title pvt">🏢 Private Banks</h3>
              <div className="banks-grid">{pvt.map((m,i) => <BankCard key={i} m={m} />)}</div>
            </div>
          )}
          {mnc.length > 0 && (
            <div className="category-section">
              <h3 className="category-title mnc">🌍 Multinational Banks</h3>
              <div className="banks-grid">{mnc.map((m,i) => <BankCard key={i} m={m} />)}</div>
            </div>
          )}
          {eliminated.length > 0 && (
            <div className="category-section">
              <h3 style={{ fontSize:'16px', fontWeight:'700', color:'#dc2626', marginBottom:'8px' }}>🚫 Hard Filtered — Not Eligible</h3>
              <p style={{ fontSize:'13px', color:'#64748b', marginBottom:'12px' }}>Removed before scoring because your profile does not meet their mandatory thresholds.</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'12px' }}>
                {eliminated.map((b,i) => (
                  <div key={i} style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'12px', padding:'16px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
                      <strong style={{ color:'#991b1b' }}>{b.shortName}</strong>
                      <span style={{ fontSize:'20px' }}>🚫</span>
                    </div>
                    <div style={{ fontSize:'13px', color:'#7f1d1d', background:'#fff', borderRadius:'8px', padding:'8px 10px' }}>{b.eliminationReason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {matches.length > 0 && (
          <div style={{ background:'#f8fafc', borderRadius:'16px', padding:'24px', marginBottom:'24px', border:'1px solid #e2e8f0' }}>
            <h2 style={{ fontSize:'20px', fontWeight:'700', color:'#1e293b', marginBottom:'16px' }}>💸 Side-by-Side Cost Comparison</h2>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
                <thead>
                  <tr style={{ background:'#1e293b', color:'#fff' }}>
                    {['Bank','Rate','Proc. Fee','GST','Legal','Valuation','Total Upfront','Speed'].map(h => (
                      <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontWeight:'600' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matches.map((m,i) => (
                    <tr key={i} style={{ background: i%2===0?'#fff':'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
                      <td style={{ padding:'10px 12px', fontWeight:'700' }}>{m.shortName}</td>
                      <td style={{ padding:'10px 12px', color:'#16a34a', fontWeight:'600' }}>{m.interestRate}%</td>
                      <td style={{ padding:'10px 12px' }}>₹{(m.costs.processingFee/1000).toFixed(1)}K</td>
                      <td style={{ padding:'10px 12px' }}>₹{(m.costs.gstOnFee/1000).toFixed(1)}K</td>
                      <td style={{ padding:'10px 12px' }}>₹{(m.costs.legalFee/1000).toFixed(1)}K</td>
                      <td style={{ padding:'10px 12px' }}>₹{(m.costs.technicalFee/1000).toFixed(1)}K</td>
                      <td style={{ padding:'10px 12px', fontWeight:'700', color:'#dc2626' }}>₹{(m.costs.total/1000).toFixed(1)}K</td>
                      <td style={{ padding:'10px 12px', color:'#2563eb' }}>{m.speedDays}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <AmortSection />

        {/* ── RBI RIGHTS SECTION ──────────────────────────────────────────── */}
        <div style={{ background:'#f8fafc', borderRadius:'16px', padding:'32px', marginBottom:'24px', border:'1px solid #e2e8f0' }}>
          <h2 style={{ fontSize:'22px', fontWeight:'700', color:'#1e293b', marginBottom:'6px' }}>📜 Know Your Rights as a Borrower</h2>
          <p style={{ color:'#64748b', marginBottom:'16px', fontSize:'14px' }}>RBI Digital Lending Directions 2025 — what every home buyer must know before signing</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'16px' }}>
            {[
              { icon:'💳', title:'Key Fact Statement (KFS)', body:'Every bank MUST give you a KFS before disbursal showing the exact APR, all fees, and total loan cost. If they skip this, do not sign anything.' },
              { icon:'💰', title:'Zero Prepayment Penalty', body:'On floating rate home loans, banks cannot charge any prepayment penalty. You can pay off your loan early at any time — no cost.' },
              { icon:'📊', title:'Rate Transparency', body:'Ask if your rate is repo-linked (EBLR) or MCLR-linked. Repo-linked means every RBI rate cut automatically reduces your EMI.' },
              { icon:'⚖️', title:'Written Rejection Reason', body:'If rejected, the bank must give you the reason in writing. Use this to fix your profile and reapply — it is your legal right.' },
              { icon:'🏗️', title:'RERA Protection', body:'Banks can only fund RERA-registered projects. Any under-construction property without RERA registration cannot legally be funded.' },
              { icon:'📞', title:'Grievance Redressal', body:'Complaints unresolved within 30 days can be escalated to the RBI Banking Ombudsman — bankingombudsman.rbi.org.in — completely free.' },
            ].map((c, i) => (
              <div key={i} style={{ background:'#fff', borderRadius:'12px', padding:'20px', border:'1px solid #e2e8f0', boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize:'28px', marginBottom:'8px' }}>{c.icon}</div>
                <h4 style={{ fontSize:'15px', fontWeight:'700', color:'#1e293b', marginBottom:'8px' }}>{c.title}</h4>
                <p style={{ fontSize:'13px', color:'#64748b', margin:0, lineHeight:'1.5' }}>{c.body}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop:'20px', padding:'14px 16px', background:'#eff6ff', borderRadius:'10px', fontSize:'13px', color:'#1e40af' }}>
            📌 Reference: RBI Digital Lending Directions 2025 (May 8, 2025) · Grievances: <strong>bankingombudsman.rbi.org.in</strong>
          </div>
        </div>

        <div className="cta-section">
          <h3>Ready to Apply?</h3>
          <p>Our advisor will verify your documents and submit to the right bank — no agent fees</p>
          <a
            href="https://wa.me/919999829407?text=Hi%2C%20I%20completed%20my%20PrimePath%20assessment%20and%20want%20to%20discuss%20next%20steps"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button"
            style={{ display:'inline-flex', alignItems:'center', gap:'8px', textDecoration:'none' }}
          >
            💬 Book Free Consultation on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      {showKyc && <KycGate />}
    </div>
  );
};

export default PrimePathMortgages;
