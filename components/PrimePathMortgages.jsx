import React, { useState } from 'react';
import { Home, Briefcase, Calculator, FileText, TrendingUp, Info, CheckCircle, ArrowRight, Building2, DollarSign } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// SUPABASE CONNECTION
const supabaseUrl = 'https://rbbktlpaijkozfenyrsf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiYmt0bHBhaWprb3pmZW55cnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNzYxNDAsImV4cCI6MjA4Nzg1MjE0MH0.vB2LOysAyOO3u6iUg5w6pa7dmXGq0G2fwCicpWKv5w8';
let supabase = null;
try {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (err) {
  console.warn('Supabase connection failed (non-critical):', err);
}

const BANK_POLICIES = {
  sbi: { name: "State Bank of India", shortName: "SBI", category: "Government", ltvHL: 0.80, ltvLAP: 0.70, maxDBR: 0.50, processingFee: 0.35, rateHL: 8.50, rateLAP: 9.25, strengths: ["MCLR-linked rate cuts", "Lowest processing fees", "Government backing"] },
  pnb: { name: "Punjab National Bank", shortName: "PNB", category: "Government", ltvHL: 0.80, ltvLAP: 0.65, maxDBR: 0.60, processingFee: 0.25, rateHL: 8.40, rateLAP: 9.15, strengths: ["Highest DBR acceptance (60%)", "Very low processing fees", "Fast for govt employees"] },
  canara: { name: "Canara Bank", shortName: "Canara", category: "Government", ltvHL: 0.85, ltvLAP: 0.70, maxDBR: 0.50, processingFee: 0.30, rateHL: 8.55, rateLAP: 9.30, strengths: ["Fastest rate cut pass-through", "Women borrower discounts", "Green home benefits"] },
  hdfc: { name: "HDFC Bank", shortName: "HDFC", category: "Private", ltvHL: 0.90, ltvLAP: 0.70, maxDBR: 0.75, processingFee: 0.50, rateHL: 8.75, rateLAP: 9.50, strengths: ["Fastest processing (10-18 days)", "Highest LTV for HL", "Digital journey"] },
  icici: { name: "ICICI Bank", shortName: "ICICI", category: "Private", ltvHL: 0.90, ltvLAP: 0.65, maxDBR: 0.75, processingFee: 0.50, rateHL: 8.70, rateLAP: 9.45, strengths: ["Quick disbursement", "Good for salaried", "Pre-approved offers"] },
  hsbc: { name: "HSBC", shortName: "HSBC", category: "Multinational", ltvHL: 0.80, ltvLAP: 0.60, maxDBR: 0.60, processingFee: 0.50, rateHL: 8.85, rateLAP: 9.60, strengths: ["Premium service", "Global network", "NRI friendly"] },
  standard: { name: "Standard Chartered", shortName: "StanChart", category: "Multinational", ltvHL: 0.80, ltvLAP: 0.60, maxDBR: 0.60, processingFee: 0.50, rateHL: 8.90, rateLAP: 9.65, strengths: ["Personalized banking", "Premium customers", "Fast processing"] }
};

const NCR_MICROMARKETS = {
  gurugram: [
    { id: 'new-gurugram', name: 'New Gurugram', sectors: 'Sectors 70-115', avgPrice: 10350, luxuryAvg: 16624, growth: '+34% YoY', temp: 'hot', rentalMin: 35000, rentalMax: 75000, rentalGrowth: '+4% YoY', rentalYield: 3.2, highlights: ['11,300+ units launched in 2024 — highest in NCR','Proposed Gurugram Metro Phase 5 alignment','Strong IT/corporate employment belt','50% of NCR 2025 launches were in Gurugram','Well-planned sector roads & green spaces'] },
    { id: 'dwarka-exp', name: 'Dwarka Expressway', sectors: 'Sectors 99-113', avgPrice: 11000, luxuryAvg: 16693, growth: '+100% since 2019', temp: 'hot', rentalMin: 40000, rentalMax: 90000, rentalGrowth: '+12% YoY', rentalYield: 3.5, highlights: ['Operational 8-lane Dwarka Expressway (2024)','15–20 min drive to IGI Airport','Upcoming metro connectivity (Dwarka-Gurgaon link)','89% ultra-luxury launches in corridor','37% share of Gurugram H1 2025 new launches'] },
    { id: 'golf-ext', name: 'Golf Course Extension', sectors: 'Sectors 58-68', avgPrice: 19500, luxuryAvg: 26000, growth: '+21% YoY', temp: 'warm', rentalMin: 80000, rentalMax: 200000, rentalGrowth: '+8% YoY', rentalYield: 2.8, highlights: ['Premium corridor — Golf Course Road to SPR','53% of Gurugram H1 2025 luxury launches','Rising HNI & NRI demand','Capital values: ₹26,000–₹60,000 psf (luxury)','Record transactions pushing benchmarks higher'] },
    { id: 'sohna-road', name: 'Sohna Road', sectors: 'Sectors 47-49, 88', avgPrice: 17400, growth: '+30% YoY', temp: 'hot', rentalMin: 45000, rentalMax: 120000, rentalGrowth: '+6% YoY', rentalYield: 3.0, highlights: ['SPR corridor — connects Golf Course Ext to NH-48','Mixed-use development with commercial hubs','Good connectivity to Cyber Hub','Popular with mid-to-premium segment buyers','Active builder activity from DLF, M3M, Signature'] },
    { id: 'old-gurugram', name: 'Old Gurugram / DLF Phases', sectors: 'DLF Phase 1-4, Sushant Lok', avgPrice: 19000, luxuryAvg: 28900, growth: '+9% YoY', temp: 'warm', rentalMin: 60000, rentalMax: 180000, rentalGrowth: '+6% YoY', rentalYield: 2.5, highlights: ['Most mature & established Gurugram market','DLF flagship projects with strong brand value','Best social infrastructure in Gurugram','Premium villas avg ₹28,900 psf','High occupancy — preferred by expats & HNIs'] },
    { id: 'sohna', name: 'Sohna (South Gurugram)', sectors: 'Sohna town & vicinity', avgPrice: 6000, growth: '+193% new launches', temp: 'hot', rentalMin: 15000, rentalMax: 35000, rentalGrowth: '+5% YoY', rentalYield: 3.8, highlights: ['Upcoming affordable-mid segment hub','Haryana RERA approved projects increasing','Proximity to KMP Expressway','193% surge in new launches — high future supply','Best value entry point in Gurugram region'] }
  ],
  noida: [
    { id: 'central-noida', name: 'Central Noida', sectors: 'Sectors 15-50', avgPrice: 16000, growth: '+9% YoY', temp: 'warm', rentalMin: 30000, rentalMax: 70000, rentalGrowth: '+3% YoY', rentalYield: 2.8, highlights: ['Established city centre — best connectivity','Noida Metro (Blue Line) covers entire belt','Top schools, hospitals & commercial centres','Sector 18 shopping district proximity','Stable demand from both end-users & investors'] },
    { id: 'noida-sectors-51-100', name: 'Mid Noida', sectors: 'Sectors 51-100', avgPrice: 14000, growth: '+10% YoY', temp: 'warm', rentalMin: 25000, rentalMax: 60000, rentalGrowth: '+3% YoY', rentalYield: 2.9, highlights: ['Metro connectivity via Aqua Line (Sec 51, 76, 101)','Growing IT park presence (Sec 62, 63)','Mid-segment sweet spot for value buyers','Close to Botanical Garden metro hub','Active resale market with good liquidity'] },
    { id: 'noida-exp', name: 'Noida Expressway', sectors: 'Sectors 74-137', avgPrice: 13400, growth: '+10% YoY', temp: 'warm', rentalMin: 38500, rentalMax: 69500, rentalGrowth: '+3% YoY', rentalYield: 3.1, highlights: ['Commercial hub — IT parks, MNC offices','Aqua Line metro serves Sectors 101-137','Close to Greater Noida & Yamuna Exp junction','Cushman & Wakefield avg rent ₹38,500–₹69,500/mo','Strong demand from IT professionals'] },
    { id: 'sector-150', name: 'Sector 150 Zone', sectors: 'Sectors 100-149', avgPrice: 10000, growth: '+24% YoY', temp: 'hot', rentalMin: 28000, rentalMax: 55000, rentalGrowth: '+3% YoY', rentalYield: 3.4, highlights: ['Greenest planned sector in Noida — 60% open space','Close to DND Flyway & Noida-Greater Noida Exp','Luxury projects by ATS, Godrej, Tata, Prateek','Savills: capital values rising 7% in Sec 150','Airport metro line to pass through corridor'] },
    { id: 'new-noida', name: 'New Noida / South', sectors: 'Sectors 150-168', avgPrice: 8450, growth: '+24% YoY', temp: 'hot', rentalMin: 20000, rentalMax: 45000, rentalGrowth: '+5% YoY', rentalYield: 3.6, highlights: ['Noida Authority planning 20,000 acre new township','Upcoming Jewar Airport metro connectivity','Most affordable entry in premium Noida zone','NOIDA-Greater NOIDA Exp: +26% capital appreciation','High growth potential — ideal for 5–7 year horizon'] },
    { id: 'gr-noida-west', name: 'Greater Noida West', sectors: 'Tech Zone IV, KP V', avgPrice: 8450, growth: '+150% new launches', temp: 'hot', rentalMin: 18000, rentalMax: 38000, rentalGrowth: '+5% YoY', rentalYield: 3.7, highlights: ['Highest new launch volume in NCR in 2024','Affordable to mid-segment housing dominates','Proposed metro connectivity (Aqua Line extension)','Growing social infra — malls, hospitals, schools','Preferred by first-time buyers & investors'] }
  ],
  'greater-noida': [
    { id: 'gnw-main', name: 'Greater Noida West', sectors: 'Tech Zone IV, Knowledge Park', avgPrice: 8450, growth: '+24% YoY', temp: 'hot', rentalMin: 18000, rentalMax: 40000, rentalGrowth: '+5% YoY', rentalYield: 3.6, highlights: ['Most affordable new-launch hub in NCR 2024','Aqua Metro Line extension planned','Knowledge Park & Tech Zone proximity','Strong RERA compliance post-2017 reforms','75% new launches in 2025 were in this micro-market'] },
    { id: 'yamuna-exp', name: 'Yamuna Expressway', sectors: 'Sectors near Jewar Airport', avgPrice: 4500, growth: 'Airport impact zone', temp: 'hot', rentalMin: 12000, rentalMax: 28000, rentalGrowth: '+8% YoY', rentalYield: 4.0, highlights: ['Noida International Airport (Jewar) — operational by 2026','8% of NCR 2025 launches were on Yamuna Exp','Land prices appreciating on airport announcement','Formula 1 circuit, film city, medical device park nearby','Highest long-term growth potential in entire NCR'] },
    { id: 'gnida-sectors', name: 'Greater Noida Central', sectors: 'Alpha, Beta, Gamma sectors', avgPrice: 7000, growth: '+8% YoY', temp: 'warm', rentalMin: 15000, rentalMax: 35000, rentalGrowth: '+4% YoY', rentalYield: 3.2, highlights: ['Established GNIDA authority planned sectors','Wide roads & green belts — planned urban design','Pari Chowk & Knowledge Park commercial hubs','Good connectivity via NH-44 to Delhi','Stable market — preferred by end-users'] }
  ],
  delhi: [
    { id: 'south-delhi', name: 'South Delhi', sectors: 'Saket, GK 1&2, Defence Colony, Lajpat Nagar', avgPrice: 22000, luxuryAvg: 52500, growth: '+8% YoY', temp: 'warm', rentalMin: 159500, rentalMax: 253000, rentalGrowth: '+4% YoY', rentalYield: 2.2, highlights: ['Most prestigious belt — limited supply drives value','Capital values: ₹40,250–₹65,500 psf (luxury)','C&W: South-East +4%, South-West +5% YoY','HNI demand from business families & NRIs','Luxury floors & bungalows dominate supply'] },
    { id: 'west-delhi', name: 'West Delhi', sectors: 'Dwarka, Janakpuri, Rajouri Garden, Uttam Nagar', avgPrice: 14800, growth: '+11% YoY', temp: 'warm', rentalMin: 25000, rentalMax: 60000, rentalGrowth: '+4% YoY', rentalYield: 2.8, highlights: ['Dwarka — Delhi Metro connectivity (Blue & Magenta)','15 min to IGI Airport from Dwarka','One of Delhi largest planned sectors','Strong middle-class demand','Growing social infrastructure in Dwarka sectors'] },
    { id: 'north-delhi', name: 'North Delhi', sectors: 'Rohini, Pitampura, Model Town, Shakurpur', avgPrice: 13500, growth: '+10% YoY', temp: 'warm', rentalMin: 20000, rentalMax: 50000, rentalGrowth: '+3% YoY', rentalYield: 2.6, highlights: ['Rohini — Delhi largest planned sub-city','Red Line Metro connects entire belt','Model Town & Civil Lines — old Delhi premium','Affordable relative to South & West Delhi','Good schools & hospitals belt'] },
    { id: 'east-delhi', name: 'East Delhi', sectors: 'Laxmi Nagar, Mayur Vihar, Preet Vihar, IP Ext', avgPrice: 12000, growth: '+9% YoY', temp: 'warm', rentalMin: 18000, rentalMax: 45000, rentalGrowth: '+3% YoY', rentalYield: 2.9, highlights: ['Most affordable Delhi zone — best value','Blue Line Metro covers Laxmi Nagar to Noida border','Close to Noida IT parks — popular with IT workers','IP Extension — growing luxury segment','Preet Vihar & Mayur Vihar Phase 1: established'] },
    { id: 'north-west-delhi', name: 'North-West Delhi', sectors: 'Paschim Vihar, Shalimar Bagh, Ashok Vihar', avgPrice: 15000, growth: '+9% YoY', temp: 'warm', rentalMin: 22000, rentalMax: 55000, rentalGrowth: '+3% YoY', rentalYield: 2.7, highlights: ['Paschim Vihar — well-planned colony with good roads','Pink Line Metro covers Shalimar Bagh','Ashok Vihar — popular with government employees','Close to Netaji Subhash Place commercial hub','Strong owner-occupier base — low vacancy'] },
    { id: 'central-delhi', name: 'Central Delhi', sectors: 'Karol Bagh, Paharganj, Civil Lines', avgPrice: 18000, luxuryAvg: 82750, growth: '+7% YoY', temp: 'warm', rentalMin: 348500, rentalMax: 585500, rentalGrowth: '+3% YoY', rentalYield: 2.0, highlights: ['Jorbagh, Golf Links — Lutyens Delhi premium','Capital values ₹82,750–₹1,33,500 psf (Lutyens)','Strictest building bye-laws — very limited supply','Ultra-HNI & diplomatic zone demand','One of the most value-stable markets in India'] }
  ],
  ghaziabad: [
    { id: 'indirapuram', name: 'Indirapuram', sectors: 'Shakti Khand, Niti Khand, Ahinsa Khand', avgPrice: 7500, growth: '+8% YoY', temp: 'warm', rentalMin: 18000, rentalMax: 40000, rentalGrowth: '+4% YoY', rentalYield: 3.1, highlights: ['Most established Ghaziabad residential hub','Blue Line Metro (Vaishali–Noida) nearby','NH-24 Bypass connectivity to Delhi & Noida','High-density township with all amenities','Active resale market with good liquidity'] },
    { id: 'vaishali', name: 'Vaishali / Vasundhara', sectors: 'Sectors 1-6', avgPrice: 6800, growth: '+9% YoY', temp: 'warm', rentalMin: 15000, rentalMax: 35000, rentalGrowth: '+3% YoY', rentalYield: 3.0, highlights: ['Vaishali Metro Station (Blue Line) — direct to Delhi','Vasundhara — planned sectors with good infra','Close to Delhi border — great for Delhi commuters','Affordable first-home market','Growing commercial & retail presence'] },
    { id: 'raj-nagar-ext', name: 'Raj Nagar Extension', sectors: 'NH-58 corridor', avgPrice: 4500, growth: '+12% YoY', temp: 'hot', rentalMin: 10000, rentalMax: 25000, rentalGrowth: '+5% YoY', rentalYield: 3.8, highlights: ['Fastest growing affordable segment in Ghaziabad','Large township projects by Gaurs, Mahagun, ATS','Proposed metro connectivity boost expected','Best price-to-space ratio in NCR','Rapidly improving social infrastructure'] },
    { id: 'crossings-rep', name: 'Crossings Republik', sectors: 'NH-24 Belt', avgPrice: 5500, growth: '+14% YoY', temp: 'hot', rentalMin: 12000, rentalMax: 28000, rentalGrowth: '+5% YoY', rentalYield: 3.5, highlights: ['Integrated township — self-sufficient living','NH-24 corridor — direct to Delhi in 40 min','Large project sizes — good amenities','Growing IT/corporate presence nearby','Affordable end-user driven market'] },
    { id: 'siddharth-vihar', name: 'Siddharth Vihar / Tronica City', sectors: 'Upcoming zone', avgPrice: 4000, growth: '+18% YoY', temp: 'hot', rentalMin: 8000, rentalMax: 20000, rentalGrowth: '+6% YoY', rentalYield: 4.0, highlights: ['Emerging zone — early entry opportunity','Industrial & logistics hub growing nearby','Land acquisition active — future infra planned','Ideal for 5–7 year investment horizon','Lowest price per sqft in NCR'] }
  ],
  faridabad: [
    { id: 'nhpc-nit', name: 'NIT / NHPC Area', sectors: 'Central Faridabad', avgPrice: 6800, growth: '+7% YoY', temp: 'warm', rentalMin: 15000, rentalMax: 35000, rentalGrowth: '+3% YoY', rentalYield: 3.0, highlights: ['Oldest established belt of Faridabad','Violet Line Metro (Faridabad stations) connectivity','Close to AIIMS Faridabad (under development)','Government employees hub — stable demand','Sector 12, 14, 16 — mature resale market'] },
    { id: 'sector-15-21', name: 'Sectors 15-21', sectors: 'Old Faridabad', avgPrice: 7200, growth: '+6% YoY', temp: 'warm', rentalMin: 16000, rentalMax: 38000, rentalGrowth: '+3% YoY', rentalYield: 2.8, highlights: ['Well-established residential sectors','Good connectivity via KMP Expressway','Close to Crown Mall & commercial hubs','Popular with local business families','Metro Violet Line serves this corridor'] },
    { id: 'greater-faridabad', name: 'Greater Faridabad', sectors: 'Sectors 75-89', avgPrice: 5500, growth: '+10% YoY', temp: 'warm', rentalMin: 12000, rentalMax: 28000, rentalGrowth: '+4% YoY', rentalYield: 3.3, highlights: ['New planned zone — modern infrastructure','Affordable relative to Gurgaon & Noida','Easy access to KMP Expressway (orbital)','Active new launches by mid-segment developers','Proximity to Gurgaon via Faridabad-Gurgaon Road'] },
    { id: 'neharpar', name: 'Neharpar / Greenfield', sectors: 'Sectors 88-96, Faridabad-Gurgaon Road', avgPrice: 4500, growth: '+12% YoY', temp: 'hot', rentalMin: 10000, rentalMax: 24000, rentalGrowth: '+5% YoY', rentalYield: 3.8, highlights: ['Fastest growing zone in Faridabad','Faridabad-Gurgaon Road — direct access to Gurugram','New township development — modern amenities','Entry-level investment zone with high growth','Low prices attracting first-home buyers'] }
  ]
};

const PrimePathMortgages = () => {
  const LIMITS = {
    minLoan: 3000000, maxLoan: 150000000, minIncome: 15000, maxIncome: 10000000,
    minPropertyValue: 1000000, maxPropertyValue: 500000000, minEMI: 0, maxEMI: 5000000,
  };

  const [currentLayer, setCurrentLayer] = useState('intro');
  const [layer1Data, setLayer1Data] = useState({
    employmentType: '', customerPreference: '', customerAge: '', loanAmountNeeded: '',
    monthlyIncome: '', loanTenure: '20', existingEMIs: '', borrowerType: '',
    missedPayments12m: '', missedPayments5y: '', cibilRange: ''
  });
  const [layer2Data, setLayer2Data] = useState({
    loanType: '', propertySubType: '', propertyUsage: '', propertyCategory: '',
    decidingDocument: '', propertyValue: '', propertyLocation: '', microMarket: '',
    buildingSocietyName: '', exactSector: '', builderName: '', bhkConfig: '', propertyAge: '', carpetArea: '',
  });
  const [results, setResults] = useState(null);
  const [kycData, setKycData] = useState({ name: '', phone: '', email: '', agreedToTerms: false, consentToContact: false });
  const [showKycGate, setShowKycGate] = useState(false);

  const calculateCustomerCapacity = () => {
    const income = parseInt(layer1Data.monthlyIncome);
    const existingEMI = parseInt(layer1Data.existingEMIs) || 0;
    const maxDBR = layer1Data.employmentType === 'govt-salaried' ? 0.60 : 0.50;
    const maxTotalEMI = income * maxDBR;
    const availableForNewLoan = maxTotalEMI - existingEMI;
    const monthlyRate = 8.5 / 12 / 100;
    const tenureMonths = parseInt(layer1Data.loanTenure || 20) * 12;
    const loanCapacity = availableForNewLoan * ((Math.pow(1 + monthlyRate, tenureMonths) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)));
    return Math.round(loanCapacity);
  };

  const calculatePropertyCeiling = () => {
    const propertyVal = parseInt(layer2Data.propertyValue);
    const avgLTV = layer2Data.loanType === 'HL' ? 0.80 : 0.70;
    return Math.round(propertyVal * avgLTV);
  };

  const matchBanks = () => {
    const customerCapacity = calculateCustomerCapacity();
    const propertyCeiling = calculatePropertyCeiling();
    const finalEligibleAmount = Math.min(customerCapacity, propertyCeiling);
    const income = parseInt(layer1Data.monthlyIncome);
    const existingEMI = parseInt(layer1Data.existingEMIs) || 0;
    const currentDBR = existingEMI / income;
    const matches = [];

    Object.entries(BANK_POLICIES).forEach(([key, bank]) => {
      let matchScore = 0;
      let reasons = [];
      let disqualifiers = [];

      if (currentDBR <= bank.maxDBR - 0.20) { matchScore += 30; reasons.push(`Your current DBR (${(currentDBR * 100).toFixed(0)}%) is well within limit`); }
      else if (currentDBR <= bank.maxDBR) { matchScore += 20; }
      else { disqualifiers.push(`Your DBR exceeds ${bank.shortName}'s ${(bank.maxDBR * 100)}% limit`); }

      const bankLTV = layer2Data.loanType === 'HL' ? bank.ltvHL : bank.ltvLAP;
      const propertyVal = parseInt(layer2Data.propertyValue);
      const bankMaxLoan = propertyVal * bankLTV;
      if (finalEligibleAmount <= bankMaxLoan) { matchScore += 25; reasons.push(`${bank.shortName} offers ${(bankLTV * 100)}% LTV for this property type`); }
      else { matchScore += 10; }

      if (layer1Data.cibilRange === '750+') { matchScore += 20; reasons.push("Excellent CIBIL score"); }
      else if (layer1Data.cibilRange === '700-749') { matchScore += 15; }
      else if (layer1Data.cibilRange === '650-699') { matchScore += 8; }

      if (layer1Data.missedPayments12m === 'no' && layer1Data.missedPayments5y === 'no') { matchScore += 15; reasons.push("Clean repayment history"); }
      else if (layer1Data.missedPayments12m === 'yes') { disqualifiers.push("Recent missed payments in last 12 months"); matchScore -= 20; }

      if (layer2Data.propertyCategory === 'builder-new' && bank.category === 'Private') { matchScore += 10; reasons.push("Private banks have fastest processing for builder properties"); }
      else if (layer2Data.propertyCategory === 'builder-new' && bank.category === 'Government') { matchScore += 5; reasons.push("Government banks offer competitive rates for new properties"); }
      else if (layer2Data.propertyCategory === 'resale' && bank.category === 'Government') { matchScore += 10; reasons.push("Government banks prefer resale properties with clear titles"); }
      else if (layer2Data.propertyCategory === 'resale' && bank.category === 'Private') { matchScore += 5; reasons.push("Private banks accept resale with verified documentation"); }

      const pref = layer1Data.customerPreference;
      if (pref === 'rate') {
        if (bank.category === 'Government') { matchScore += 15; reasons.push("Best interest rates — saves ₹2-5L over loan tenure"); }
        else if (bank.category === 'Private') { matchScore += 8; }
        else { matchScore += 5; }
      } else if (pref === 'speed') {
        if (bank.category === 'Private') { matchScore += 15; reasons.push("Fastest disbursement: 10-18 days vs 30-45 for PSU banks"); }
        else if (bank.category === 'Multinational') { matchScore += 12; reasons.push("Premium fast-track service available"); }
        else { matchScore += 5; }
      } else if (pref === 'cost') {
        if (bank.processingFee <= 0.30) { matchScore += 15; reasons.push("Lowest processing fees — minimal upfront costs"); }
        else if (bank.processingFee <= 0.40) { matchScore += 10; }
        else { matchScore += 5; }
      } else if (pref === 'service') {
        if (bank.category === 'Multinational') { matchScore += 15; reasons.push("Premium relationship banking with dedicated RM"); }
        else if (bank.category === 'Private') { matchScore += 10; reasons.push("Digital-first experience with dedicated support"); }
        else { matchScore += 5; }
      }

      const rate = layer2Data.loanType === 'HL' ? bank.rateHL : bank.rateLAP;
      const monthlyRate = rate / 12 / 100;
      const tenureMonths = parseInt(layer1Data.loanTenure || 20) * 12;
      const emi = finalEligibleAmount * (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
      const processingFee = Math.round(finalEligibleAmount * bank.processingFee / 100);
      const approvalProbability = disqualifiers.length === 0 ? Math.min(matchScore, 95) : Math.min(matchScore * 0.5, 40);

      matches.push({
        bank: bank.name, shortName: bank.shortName, category: bank.category,
        matchScore: Math.max(0, matchScore), approvalProbability: Math.round(approvalProbability),
        reasons, disqualifiers, strengths: bank.strengths,
        loanAmount: finalEligibleAmount, emi: Math.round(emi), interestRate: rate,
        processingFee, processingFeeIndicative: `~${bank.processingFee}% of loan amount`,
        totalUpfront: `As per ${bank.shortName}'s portal/app`,
        ltv: (bankLTV * 100).toFixed(0)
      });
    });

    return {
      customerCapacity, propertyCeiling, finalEligibleAmount,
      limitingFactor: customerCapacity < propertyCeiling ? 'income' : 'property',
      matches: matches.sort((a, b) => b.approvalProbability - a.approvalProbability)
    };
  };

  const handleLayer1Submit = () => {
    const requiredLayer1 = ['employmentType', 'customerPreference', 'customerAge', 'loanAmountNeeded', 'monthlyIncome', 'loanTenure', 'existingEMIs', 'borrowerType', 'missedPayments12m', 'missedPayments5y', 'cibilRange'];
    if (!requiredLayer1.every(f => layer1Data[f] !== '')) { alert('❌ Please fill all fields to continue'); return; }
    const loan = parseInt(layer1Data.loanAmountNeeded);
    const income = parseInt(layer1Data.monthlyIncome);
    const emi = parseInt(layer1Data.existingEMIs);
    if (loan < LIMITS.minLoan || loan > LIMITS.maxLoan) { alert(`❌ Loan amount must be between ₹30L and ₹15 Cr`); return; }
    if (income < LIMITS.minIncome || income > LIMITS.maxIncome) { alert(`❌ Monthly income must be between ₹15K and ₹1 Cr/month`); return; }
    if (emi > LIMITS.maxEMI) { alert(`❌ Existing EMI seems too high. Please verify.`); return; }
    const warnings = [];
    if ((emi / income) > 0.4) warnings.push('⚠️ Your existing EMIs are >40% of income — this reduces eligibility significantly');
    if (layer1Data.missedPayments12m === 'yes' || layer1Data.missedPayments5y === 'yes') warnings.push('⚠️ Missed payments in credit history may affect approval chances');
    if (warnings.length > 0) { const proceed = confirm(`${warnings.join('\n\n')}\n\nDo you want to continue?`); if (!proceed) return; }
    setCurrentLayer('layer2');
  };

  const handleLayer2Submit = () => {
    const requiredFields = ['loanType', 'propertySubType', 'propertyCategory', 'decidingDocument', 'propertyValue', 'propertyLocation'];
    if (!requiredFields.every(field => layer2Data[field] !== '')) { alert('❌ Please fill all required fields'); return; }
    if (layer2Data.propertyCategory === 'resale' && !layer2Data.propertyUsage) { alert('❌ Please specify current property usage'); return; }
    const propValue = parseInt(layer2Data.propertyValue);
    if (propValue < LIMITS.minPropertyValue || propValue > LIMITS.maxPropertyValue) { alert(`❌ Property value must be between ₹10L and ₹50 Cr`); return; }
    if (parseInt(layer1Data.loanAmountNeeded) > propValue) { alert('❌ Loan amount cannot exceed property value. Please adjust.'); return; }
    if (layer2Data.propertyUsage === 'commercial') {
      const proceed = confirm('⚠️ DEVIATION CASE DETECTED\n\nCommercial use on residential property requires special approval.\n• Processing time may increase 10-15 days\n• Additional documentation required\n\nContinue?');
      if (!proceed) return;
    }
    if (layer2Data.loanType === 'LAP') { setShowKycGate(true); }
    else if (layer2Data.microMarket) { setCurrentLayer('propertyInsights'); }
    else { setShowKycGate(true); }
  };

  // ─── RENDER INTRO ─────────────────────────────────────────────────────────
  const renderIntro = () => (
    <div className="intro-container">
      <div className="intro-content">
        <h1>Stop Trusting. Start Knowing.</h1>
        <p className="intro-subtitle">The only loan platform that shows you what banks WON'T tell you.</p>
        <div className="problem-cards">
          {[{icon:'🏦',title:'Your Bank',desc:'Long process. Rigid criteria. No transparency on why you were rejected.'},{icon:'🤝',title:'Agents',desc:'Manipulative. Hidden fees. Push you to banks that pay them highest commission.'},{icon:'🔍',title:'Internet Search',desc:'Confusing. Outdated info. Can\'t tell you YOUR exact eligibility.'}].map((c,i) => (
            <div key={i} className="problem-card"><div className="problem-icon bad">{c.icon}</div><h3>{c.title}</h3><p>{c.desc}</p></div>
          ))}
        </div>
        <div className="solution-card">
          <div className="solution-icon">✨</div>
          <h2>We Built the 4th Path</h2>
          <ul>
            <li><CheckCircle size={20} /> Know EXACT loan amount (not estimates)</li>
            <li><CheckCircle size={20} /> See which factor limits you: Income OR Property</li>
            <li><CheckCircle size={20} /> Match with 7 banks across Govt/Private/MNC</li>
            <li><CheckCircle size={20} /> Total transparency. Zero agent tricks.</li>
          </ul>
        </div>
        <button className="cta-button" onClick={() => setCurrentLayer('layer1')}>Start Your Assessment <ArrowRight size={20} /></button>
        <p className="trust-line">Used by 2,000+ NCR borrowers. Zero spam. No agents involved.</p>
      </div>
    </div>
  );

  // ─── RENDER LAYER 1 ───────────────────────────────────────────────────────
  const renderLayer1 = () => (
    <div className="layer-container">
      <div className="layer-header">
        <div className="layer-badge">Layer 1 of 2</div>
        <h2>Your Financial Profile</h2>
        <p>We need to understand your repayment capacity first</p>
      </div>
      <div className="form-section">
        <div className="input-group">
          <label>👤 What best describes your employment?</label>
          <span className="hint">This helps us match the right bank policies for your profile</span>
          <div className="radio-group vertical" style={{marginTop:'8px'}}>
            {[{val:'govt-salaried',emoji:'🏛️',title:'Salaried — Government / PSU',desc:'Central/State Govt, PSU, Defence, Railways'},{val:'private-salaried',emoji:'🏢',title:'Salaried — Private Company',desc:'MNC, Indian corporate, startup employee'},{val:'professional',emoji:'🩺',title:'Self-Employed Professional',desc:'Doctor, Lawyer, CA, Consultant, Architect'},{val:'employer',emoji:'🏭',title:'Self-Employed Business Owner',desc:'Manufacturer, Trader, Own account worker'}].map(opt => (
              <label key={opt.val} className="radio-card" style={{borderColor:layer1Data.employmentType===opt.val?'#2563eb':'#e2e8f0',background:layer1Data.employmentType===opt.val?'#eff6ff':'white'}}>
                <input type="radio" name="employmentType" value={opt.val} checked={layer1Data.employmentType===opt.val} onChange={e=>setLayer1Data({...layer1Data,employmentType:e.target.value})} />
                <div><strong>{opt.emoji} {opt.title}</strong><p>{opt.desc}</p></div>
              </label>
            ))}
          </div>
        </div>
        <div className="input-group">
          <label>🎯 What matters most to you in a home loan?</label>
          <span className="hint">This helps us rank banks based on YOUR priority</span>
          <div className="radio-group vertical" style={{marginTop:'8px'}}>
            {[{val:'rate',emoji:'💰',title:'Lowest Interest Rate',desc:'Save ₹2-5L over loan tenure'},{val:'speed',emoji:'⚡',title:'Fastest Processing',desc:'Disbursement in 10-18 days'},{val:'cost',emoji:'🏷️',title:'Lowest Upfront Costs',desc:'Minimal processing fees'},{val:'service',emoji:'🤝',title:'Premium Service',desc:'Dedicated RM & support'}].map(opt => (
              <label key={opt.val} className="radio-card" style={{borderColor:layer1Data.customerPreference===opt.val?'#2563eb':'#e2e8f0',background:layer1Data.customerPreference===opt.val?'#eff6ff':'white'}}>
                <input type="radio" name="customerPreference" value={opt.val} checked={layer1Data.customerPreference===opt.val} onChange={e=>setLayer1Data({...layer1Data,customerPreference:e.target.value})} />
                <div><strong>{opt.emoji} {opt.title}</strong><p>{opt.desc}</p></div>
              </label>
            ))}
          </div>
        </div>
        <div className="input-group">
          <label>👤 Your Current Age</label>
          <input type="number" placeholder="e.g., 35" min="21" max="70" value={layer1Data.customerAge} onChange={e=>setLayer1Data({...layer1Data,customerAge:e.target.value})} className="text-input" style={{padding:'12px 16px',width:'100%',border:'2px solid #e2e8f0',borderRadius:'10px'}} />
          <span className="hint">Used to calculate maximum loan tenure (retirement age: 65 years)</span>
        </div>
        <div className="input-group">
          <label>How much loan do you need?</label>
          <div className="currency-input"><span className="currency">₹</span><input type="number" placeholder="40,00,000" value={layer1Data.loanAmountNeeded} onChange={e=>setLayer1Data({...layer1Data,loanAmountNeeded:e.target.value})} /></div>
          <span className="hint">Min: ₹30L | Max: ₹15 Cr</span>
        </div>
        <div className="input-group">
          <label>Monthly Net Salary (In-hand)</label>
          <div className="currency-input"><span className="currency">₹</span><input type="number" placeholder="80,000" value={layer1Data.monthlyIncome} onChange={e=>setLayer1Data({...layer1Data,monthlyIncome:e.target.value})} /></div>
          <span className="hint">After all deductions (PF, tax, etc.) | Min: ₹15K/month</span>
        </div>
        <div className="input-group">
          <label>Preferred Loan Tenure</label>
          <select value={layer1Data.loanTenure} onChange={e=>setLayer1Data({...layer1Data,loanTenure:e.target.value})} className="select-input">
            {(() => { const age=parseInt(layer1Data.customerAge)||30; const maxT=Math.min(30,Math.max(5,65-age)); return [5,10,15,20,25,30].filter(t=>t<=maxT).map(y=><option key={y} value={y}>{y} Years {y===20&&maxT>=20?'(Recommended)':''}</option>); })()}
          </select>
          <span className="hint">{layer1Data.customerAge&&parseInt(layer1Data.customerAge)>35?`Max ${Math.min(30,65-parseInt(layer1Data.customerAge))} years based on retirement age`:'Longer tenure = lower EMI but higher total interest'}</span>
        </div>
        <div className="input-group">
          <label>Current Total Monthly EMIs</label>
          <div className="currency-input"><span className="currency">₹</span><input type="number" placeholder="0" value={layer1Data.existingEMIs} onChange={e=>setLayer1Data({...layer1Data,existingEMIs:e.target.value})} /></div>
          <span className="hint">Car loan, personal loan, credit cards - all combined</span>
        </div>
        <div className="input-group">
          <label>Are you a first-time borrower?</label>
          <div className="radio-group">
            {[{val:'first-time',label:'Yes, first home loan'},{val:'repeat',label:"No, I've taken loans before"}].map(o=>(
              <label key={o.val} className="radio-option"><input type="radio" name="borrowerType" value={o.val} checked={layer1Data.borrowerType===o.val} onChange={e=>setLayer1Data({...layer1Data,borrowerType:e.target.value})} /><span>{o.label}</span></label>
            ))}
          </div>
        </div>
        <div className="input-group">
          <label>Any missed EMI payments in last 12 months?</label>
          <div className="radio-group">
            {[{val:'no',label:'No'},{val:'yes',label:'Yes'}].map(o=>(
              <label key={o.val} className="radio-option"><input type="radio" name="missed12m" value={o.val} checked={layer1Data.missedPayments12m===o.val} onChange={e=>setLayer1Data({...layer1Data,missedPayments12m:e.target.value})} /><span>{o.label}</span></label>
            ))}
          </div>
        </div>
        <div className="input-group">
          <label>Any missed EMI payments in last 5 years?</label>
          <div className="radio-group">
            {[{val:'no',label:'No'},{val:'yes',label:'Yes'}].map(o=>(
              <label key={o.val} className="radio-option"><input type="radio" name="missed5y" value={o.val} checked={layer1Data.missedPayments5y===o.val} onChange={e=>setLayer1Data({...layer1Data,missedPayments5y:e.target.value})} /><span>{o.label}</span></label>
            ))}
          </div>
        </div>
        <div className="input-group">
          <label>Approximate CIBIL Score</label>
          <select value={layer1Data.cibilRange} onChange={e=>setLayer1Data({...layer1Data,cibilRange:e.target.value})} className="select-input">
            <option value="">Select range</option>
            <option value="750+">750+ (Excellent)</option>
            <option value="700-749">700-749 (Good)</option>
            <option value="650-699">650-699 (Fair)</option>
            <option value="below-650">Below 650 (Needs improvement)</option>
          </select>
        </div>
        <button className="btn-next" onClick={handleLayer1Submit}>Continue to Property Details <ArrowRight size={20} /></button>
      </div>
    </div>
  );

  // ─── RENDER LAYER 2 ───────────────────────────────────────────────────────
  const renderLayer2 = () => (
    <div className="layer-container">
      <div className="layer-header">
        <div className="layer-badge">Layer 2 of 2</div>
        <h2>Property Assessment</h2>
        <p>Now let's understand the property value ceiling</p>
      </div>
      <div className="form-section">
        <div className="input-group">
          <label>What type of loan do you need?</label>
          <div className="radio-group vertical">
            <label className="radio-card"><input type="radio" name="loanType" value="HL" checked={layer2Data.loanType==='HL'} onChange={e=>setLayer2Data({...layer2Data,loanType:e.target.value,propertyCategory:'',decidingDocument:''})} /><div><strong>Home Loan (HL)</strong><p>Buying a new property or under-construction</p></div></label>
            <label className="radio-card"><input type="radio" name="loanType" value="LAP" checked={layer2Data.loanType==='LAP'} onChange={e=>setLayer2Data({...layer2Data,loanType:e.target.value,propertyCategory:'existing',decidingDocument:'property-papers'})} /><div><strong>Loan Against Property (LAP)</strong><p>Borrowing against your existing property</p></div></label>
          </div>
        </div>
        {layer2Data.loanType && (() => {
          const opts = layer2Data.loanType==='HL'
            ? [{val:'apartment',emoji:'🏢',title:'Apartment / Flat',desc:'Multi-storey builder floor or society flat'},{val:'plot',emoji:'🌳',title:'Residential Plot / Land',desc:'Open plot for construction'},{val:'house',emoji:'🏡',title:'Independent House / Villa',desc:'Row house, bungalow, builder floor'}]
            : [{val:'office',emoji:'🏛️',title:'Office / Commercial Space',desc:'Loan Against Property — commercial use'},{val:'apartment',emoji:'🏢',title:'Residential Apartment',desc:'Loan against existing flat / house'},{val:'plot',emoji:'🌳',title:'Residential Plot',desc:'Loan against owned plot'}];
          return (
            <div className="input-group">
              <label>🏠 What type of property?</label>
              <div className="radio-group vertical" style={{marginTop:'8px'}}>
                {opts.map(opt=>(
                  <label key={opt.val} className="radio-card" style={{borderColor:layer2Data.propertySubType===opt.val?'#2563eb':'#e2e8f0',background:layer2Data.propertySubType===opt.val?'#eff6ff':'white'}}>
                    <input type="radio" name="propertySubType" value={opt.val} checked={layer2Data.propertySubType===opt.val} onChange={e=>setLayer2Data({...layer2Data,propertySubType:e.target.value})} />
                    <div><strong>{opt.emoji} {opt.title}</strong><p>{opt.desc}</p></div>
                  </label>
                ))}
              </div>
            </div>
          );
        })()}
        {layer2Data.loanType==='HL' && (
          <div className="input-group">
            <label>Property Category</label>
            <div className="radio-group vertical">
              <label className="radio-card"><input type="radio" name="propertyCategory" value="builder-new" checked={layer2Data.propertyCategory==='builder-new'} onChange={e=>setLayer2Data({...layer2Data,propertyCategory:e.target.value,decidingDocument:'booking-form'})} /><div><strong>Builder - New/Under Construction</strong><p>Buying directly from developer</p></div></label>
              <label className="radio-card"><input type="radio" name="propertyCategory" value="resale" checked={layer2Data.propertyCategory==='resale'} onChange={e=>setLayer2Data({...layer2Data,propertyCategory:e.target.value,decidingDocument:'agreement-to-sell'})} /><div><strong>Resale Property</strong><p>Buying from current owner</p></div></label>
            </div>
          </div>
        )}
        {layer2Data.propertyCategory==='resale' && (
          <div className="input-group">
            <label>🏠 Current usage of the property?</label>
            <span className="hint">Banks verify property usage — commercial use on residential loan is a red flag</span>
            <div className="radio-group vertical" style={{marginTop:'8px'}}>
              {[{val:'residential',icon:'✅',title:'Residential Use',desc:'Self-occupied or rented to a family (standard case)'},{val:'commercial',icon:'⚠️',title:'Business / Office / Tuition Use',desc:'Requires special approval — processing time increases'},{val:'vacant',icon:'✅',title:'Vacant / Ready for Possession',desc:'Not currently occupied (clean case)'}].map(opt=>(
                <label key={opt.val} className="radio-card" style={{borderColor:layer2Data.propertyUsage===opt.val?(opt.val==='commercial'?'#dc2626':'#2563eb'):'#e2e8f0',background:layer2Data.propertyUsage===opt.val?(opt.val==='commercial'?'#fef2f2':'#eff6ff'):'white'}}>
                  <input type="radio" name="propertyUsage" value={opt.val} checked={layer2Data.propertyUsage===opt.val} onChange={e=>setLayer2Data({...layer2Data,propertyUsage:e.target.value})} />
                  <div><strong>{opt.icon} {opt.title}</strong><p>{opt.desc}</p></div>
                </label>
              ))}
            </div>
          </div>
        )}
        {layer2Data.decidingDocument && (
          <div className="deciding-doc-card">
            <h4>📄 Deciding Document Required:</h4>
            <p>{layer2Data.decidingDocument==='booking-form'?'Builder Booking Form / Agreement':layer2Data.decidingDocument==='agreement-to-sell'?'Agreement to Sell':'Property Ownership Papers / Valuation Report'}</p>
            <span className="doc-note">This document shows the property value that banks will use for LTV calculation</span>
          </div>
        )}
        <div className="input-group">
          <label>Property Value</label>
          <div className="currency-input"><span className="currency">₹</span><input type="number" placeholder="50,00,000" value={layer2Data.propertyValue} onChange={e=>setLayer2Data({...layer2Data,propertyValue:e.target.value})} /></div>
          <span className="hint">Enter the exact amount mentioned in the document | Min: ₹10L | Max: ₹50 Cr</span>
        </div>
        <div className="input-group">
          <label>Property Location (NCR)</label>
          <select value={layer2Data.propertyLocation} onChange={e=>setLayer2Data({...layer2Data,propertyLocation:e.target.value})} className="select-input">
            <option value="">Select location</option>
            {['delhi','gurugram','noida','greater-noida','ghaziabad','faridabad'].map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1).replace(/-/g,' ')}</option>)}
          </select>
        </div>
        {layer2Data.propertyLocation && NCR_MICROMARKETS[layer2Data.propertyLocation] && (
          <div className="input-group">
            <label>Specific Area / Zone</label>
            <select value={layer2Data.microMarket} onChange={e=>setLayer2Data({...layer2Data,microMarket:e.target.value})} className="select-input">
              <option value="">Select your area...</option>
              {NCR_MICROMARKETS[layer2Data.propertyLocation].map(z=><option key={z.id} value={z.id}>{z.name} ({z.sectors})</option>)}
            </select>
            <span className="hint">This helps us give you accurate market insights</span>
          </div>
        )}
        {layer2Data.propertyLocation && layer2Data.propertySubType==='apartment' && layer2Data.propertyCategory && (
          <div className="property-details-section">
            <h3 style={{fontSize:'18px',color:'#1e293b',marginBottom:'16px'}}>📋 Property Details (for personalized matching)</h3>
            <div className="input-group">
              <label>Building / Society Name</label>
              <input type="text" placeholder="e.g., Mahagun Moderne, DLF Crest" value={layer2Data.buildingSocietyName} onChange={e=>setLayer2Data({...layer2Data,buildingSocietyName:e.target.value})} className="text-input" />
            </div>
            <div className="input-group">
              <label>Builder / Developer Name</label>
              <input type="text" placeholder="e.g., Mahagun, DLF, Godrej, M3M" value={layer2Data.builderName} onChange={e=>setLayer2Data({...layer2Data,builderName:e.target.value})} className="text-input" />
            </div>
            <div className="input-group">
              <label>Exact Sector / Tower / Wing</label>
              <input type="text" placeholder="e.g., Sector 78, Tower B" value={layer2Data.exactSector} onChange={e=>setLayer2Data({...layer2Data,exactSector:e.target.value})} className="text-input" />
            </div>
            <div className="input-group">
              <label>BHK Configuration</label>
              <select value={layer2Data.bhkConfig} onChange={e=>setLayer2Data({...layer2Data,bhkConfig:e.target.value})} className="select-input">
                <option value="">Select BHK</option>
                {['1 BHK','2 BHK','3 BHK','4 BHK','5+ BHK'].map(b=><option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Carpet Area (in sq ft)</label>
              <input type="number" placeholder="e.g., 1200" value={layer2Data.carpetArea} onChange={e=>setLayer2Data({...layer2Data,carpetArea:e.target.value})} className="text-input" />
              <span className="hint">As per sale agreement / possession letter</span>
            </div>
            {layer2Data.propertyCategory==='resale' && (
              <div className="input-group">
                <label>Property Age</label>
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
          <button className="btn-next" onClick={handleLayer2Submit}>See Bank Matches <ArrowRight size={20} /></button>
        </div>
      </div>
    </div>
  );

  // ─── RENDER PROPERTY INSIGHTS ─────────────────────────────────────────────
  const renderPropertyInsights = () => {
    if (!layer2Data.microMarket) { const r=matchBanks(); setResults(r); setCurrentLayer('results'); return null; }
    const cityData = NCR_MICROMARKETS[layer2Data.propertyLocation];
    const zoneData = cityData?.find(z=>z.id===layer2Data.microMarket);
    if (!zoneData) { const r=matchBanks(); setResults(r); setCurrentLayer('results'); return null; }

    const propertyVal = parseInt(layer2Data.propertyValue);
    const isApartment = layer2Data.propertySubType==='apartment';
    const isUnderConstruction = layer2Data.propertyCategory==='builder-new';
    const estimatedSqFt = layer2Data.carpetArea && parseInt(layer2Data.carpetArea)>0 ? parseInt(layer2Data.carpetArea) : Math.round(propertyVal/zoneData.avgPrice);
    const gstAmt = isUnderConstruction ? Math.round(propertyVal*0.05) : 0;
    const tdsAmt = propertyVal>5000000 ? Math.round(propertyVal*0.01) : 0;
    const stampDuty = Math.round(propertyVal*0.06);
    const regFee = Math.round(propertyVal*0.01);
    const edcHaryana = layer2Data.propertyLocation==='gurugram' ? Math.round(propertyVal*0.015) : 0;
    const totalAdditional = gstAmt+tdsAmt+stampDuty+regFee+edcHaryana;

    const scores = {
      priceScore: (() => { const d=((propertyVal/estimatedSqFt)-zoneData.avgPrice)/zoneData.avgPrice*100; if(d<-10)return 95; if(d>15)return 50; if(d>10)return 60; if(d>5)return 72; return 78; })(),
      marketScore: zoneData.temp==='hot'?90:zoneData.temp==='warm'?72:55,
      legalScore: isUnderConstruction?(propertyVal>=50000000?85:propertyVal>=20000000?75:65):90,
      rentalScore: (() => { const y=zoneData.rentalYield||2.8; if(y>=3.5)return 90; if(y>=3.0)return 78; if(y>=2.5)return 65; if(y>=2.0)return 52; return 40; })(),
    };
    const overallScore = Math.round((scores.priceScore+scores.marketScore+scores.legalScore+scores.rentalScore)/4);
    const scoreLabel = overallScore>=80?'Excellent Buy':overallScore>=65?'Good Buy':'Proceed with Caution';
    const scoreColor = overallScore>=80?'#16a34a':overallScore>=65?'#d97706':'#dc2626';

    const ProgressBar = ({label,score,color}) => (
      <div className="progress-item">
        <div className="progress-label"><span>{label}</span><strong style={{color}}>{score}/100</strong></div>
        <div className="progress-track"><div className="progress-fill" style={{width:`${score}%`,background:color}}></div></div>
      </div>
    );

    return (
      <div className="layer-container insights-v2" style={{maxWidth:'960px'}}>
        <div className="layer-header">
          <div className="layer-badge">Property Intelligence</div>
          <h2>📍 {zoneData.name} — Full Analysis</h2>
          <p>Based on PropIndex Q4 2025 · Cushman & Wakefield · Savills H1 2025</p>
        </div>
        <div className="confidence-banner">
          <div className="confidence-main">
            <div className="confidence-dial" style={{borderColor:scoreColor}}>
              <span className="dial-number" style={{color:scoreColor}}>{overallScore}</span>
              <span className="dial-label">/ 100</span>
            </div>
            <div className="confidence-text">
              <h3 style={{color:scoreColor}}>{scoreLabel}</h3>
              <p>PrimePath Property Confidence Score</p>
              <span className="confidence-sub">Based on price, market momentum, legal status & rental potential</span>
            </div>
          </div>
          <div className="progress-bars">
            <ProgressBar label="💰 Price vs Market" score={scores.priceScore} color="#2563eb" />
            <ProgressBar label="🔥 Market Momentum" score={scores.marketScore} color="#d97706" />
            <ProgressBar label="⚖️ Legal Readiness" score={scores.legalScore} color="#7c3aed" />
            <ProgressBar label="🏠 Rental Potential" score={scores.rentalScore} color="#16a34a" />
          </div>
        </div>
        <div className="insights-grid-v2">
          <div className="insight-card-v2">
            <h3>💰 Price Analysis</h3>
            <div className="price-comparison">
              <div className="price-row"><span>Your Property Value:</span><strong>₹{propertyVal>=10000000?`${(propertyVal/10000000).toFixed(2)} Cr`:`${(propertyVal/100000).toFixed(0)}L`}</strong></div>
              <div className="price-row"><span>Area Avg (PSF):</span><strong>₹{zoneData.avgPrice.toLocaleString()}/sq ft</strong></div>
              <div className="price-row"><span>Estimated Size:</span><strong>~{estimatedSqFt} sq ft</strong></div>
            </div>
            {(() => { const d=((propertyVal/estimatedSqFt)-zoneData.avgPrice)/zoneData.avgPrice*100; if(d<-10)return <div className="alert-box good-deal">✅ <strong>Good Deal!</strong> {Math.abs(d).toFixed(0)}% below market average</div>; if(d>10)return <div className="alert-box verify-alert">⚠️ <strong>Above Market.</strong> {d.toFixed(0)}% higher — verify amenities justify premium.</div>; return <div className="alert-box neutral">✓ <strong>Fair Price</strong> — within {Math.abs(d).toFixed(0)}% of market average</div>; })()}
          </div>
          <div className="insight-card-v2">
            <h3>🌡️ Market Momentum</h3>
            <div className={`temp-badge ${zoneData.temp}`}>{zoneData.temp==='hot'?'🔥 HOT MARKET':zoneData.temp==='warm'?'📈 WARM MARKET':'📊 STABLE'}</div>
            <div className="temp-details">
              <div className="temp-row"><span>Price Growth:</span><strong>{zoneData.growth}</strong></div>
              <div className="temp-row"><span>Micro-zone:</span><strong>{zoneData.sectors}</strong></div>
              <div className="temp-row"><span>Outlook:</span><strong>{zoneData.temp==='hot'?'⬆️ Bullish':'→ Steady'}</strong></div>
            </div>
          </div>
        </div>
        <div className="insight-full-card">
          <h3>📍 Area Highlights</h3>
          <ul className="highlights-list-v2">
            {(zoneData.highlights||['Established residential area','Good social infrastructure','Active property market']).map((h,i)=><li key={i}>✓ {h}</li>)}
          </ul>
        </div>
        {isApartment && (
          <div className="insight-full-card cost-card">
            <h3>🧾 True Cost of Buying — What No One Tells You</h3>
            <p className="cost-subtitle">Beyond the base price, here is what you will actually pay:</p>
            <div className="cost-table">
              <div className="cost-row header-row"><span>Cost Head</span><span>Rate</span><span>Indicative Amount</span><span>Who Pays</span></div>
              <div className="cost-row"><span>🏠 Base Property Price</span><span>—</span><span>₹{propertyVal>=10000000?`${(propertyVal/10000000).toFixed(2)} Cr`:`${(propertyVal/100000).toFixed(0)}L`}</span><span>Buyer → Builder/Seller</span></div>
              {isUnderConstruction?<div className="cost-row highlight-row"><span>📊 GST <span className="badge-pill">Under-Construction Only</span></span><span>5%</span><span>₹{(gstAmt/100000).toFixed(1)}L</span><span>Buyer → Govt (via Builder)</span></div>:<div className="cost-row good-row"><span>📊 GST <span className="badge-pill green">Ready-to-Move</span></span><span>NIL ✅</span><span>₹0</span><span>Key advantage of RTM!</span></div>}
              {propertyVal>5000000&&<div className="cost-row"><span>💼 TDS (Sec 194-IA)</span><span>1%</span><span>₹{(tdsAmt/100000).toFixed(1)}L</span><span>Buyer deducts, files Form 26QB</span></div>}
              <div className="cost-row"><span>🏛️ Stamp Duty</span><span>{layer2Data.propertyLocation==='delhi'?'6%':layer2Data.propertyLocation==='gurugram'?'5% (Women: 3%)':'5%'}</span><span>₹{(stampDuty/100000).toFixed(1)}L</span><span>Buyer → State Govt</span></div>
              <div className="cost-row"><span>📝 Registration Fee</span><span>1%</span><span>₹{(regFee/100000).toFixed(1)}L</span><span>Buyer → Sub-Registrar</span></div>
              {layer2Data.propertyLocation==='gurugram'&&<div className="cost-row highlight-row"><span>🏗️ EDC/IDC Charges <span className="badge-pill">Haryana: +20% from Jan 2025</span></span><span>~1.5%</span><span>₹{(edcHaryana/100000).toFixed(1)}L</span><span>Buyer → HRERA/Developer</span></div>}
              <div className="cost-row total-row"><span><strong>💰 Total Additional Cost</strong></span><span></span><span><strong>₹{(totalAdditional/100000).toFixed(1)}L</strong></span><span><strong>{((totalAdditional/propertyVal)*100).toFixed(1)}% of property value</strong></span></div>
            </div>
            <div className="cost-note">💡 <strong>Loan covers base price only.</strong> Additional costs above must be paid from your own funds. Plan accordingly.</div>
          </div>
        )}
        <div className="insight-full-card">
          <h3>📊 Market Comparison</h3>
          <p style={{color:'#64748b',fontSize:'13px',marginBottom:'16px'}}>Source: PropIndex Q4 2025 · Cushman & Wakefield NCR Report</p>
          <div className="compare-table">
            <div className="compare-row compare-header"><span>Segment</span><span>Avg PSF</span><span>Est. for ~{estimatedSqFt} sq ft</span><span>YoY Growth</span></div>
            <div className="compare-row your-row"><span>⭐ Your Property</span><span>₹{Math.round(propertyVal/estimatedSqFt).toLocaleString()}</span><span>₹{propertyVal>=10000000?`${(propertyVal/10000000).toFixed(2)} Cr`:`${(propertyVal/100000).toFixed(0)}L`}</span><span>—</span></div>
            <div className="compare-row"><span>📍 {zoneData.name} Average</span><span>₹{zoneData.avgPrice.toLocaleString()}</span><span>₹{((zoneData.avgPrice*estimatedSqFt)/100000).toFixed(0)}L</span><span style={{color:'#16a34a'}}>{zoneData.growth}</span></div>
            {zoneData.luxuryAvg&&<div className="compare-row"><span>🏆 Luxury Segment</span><span>₹{zoneData.luxuryAvg.toLocaleString()}</span><span>₹{((zoneData.luxuryAvg*estimatedSqFt)/100000).toFixed(0)}L</span><span style={{color:'#16a34a'}}>Premium</span></div>}
          </div>
        </div>
        <div className="insights-grid-v2">
          <div className="insight-card-v2">
            <h3>🏠 Rental Potential</h3>
            <p style={{color:'#64748b',fontSize:'12px'}}>Source: Cushman & Wakefield Q4 2025 / Savills H1 2025</p>
            <div className="rental-data">
              <div className="rental-row"><span>Monthly Rental (Est.)</span><strong>₹{zoneData.rentalMin?.toLocaleString()||'N/A'} – ₹{zoneData.rentalMax?.toLocaleString()||'N/A'}</strong></div>
              <div className="rental-row"><span>Rental Growth YoY</span><strong style={{color:'#16a34a'}}>{zoneData.rentalGrowth||'3-6%'}</strong></div>
              <div className="rental-row"><span>Gross Rental Yield</span><strong>{zoneData.rentalYield?`${zoneData.rentalYield}%`:'2.5–3.5%'}</strong></div>
            </div>
            <div className="alert-box neutral" style={{marginTop:'12px'}}>💡 NCR rental values improved 3-4% YoY in 2025 (Cushman & Wakefield)</div>
          </div>
          <div className="insight-card-v2">
            <h3>📈 Capital Appreciation Outlook</h3>
            <p style={{color:'#64748b',fontSize:'12px'}}>Source: NCR Real Estate Report 2025</p>
            <div className="rental-data">
              <div className="rental-row"><span>2024 Price Growth (NCR)</span><strong style={{color:'#16a34a'}}>+30% YoY</strong></div>
              <div className="rental-row"><span>{zoneData.name} Specific</span><strong style={{color:'#16a34a'}}>{zoneData.growth}</strong></div>
              <div className="rental-row"><span>5-Year Projection</span><strong>{zoneData.temp==='hot'?'35-45% (High confidence)':'20-30% (Moderate)'}</strong></div>
              <div className="rental-row"><span>Best Time to Buy?</span><strong style={{color:zoneData.temp==='hot'?'#d97706':'#16a34a'}}>{zoneData.temp==='hot'?'⚠️ Market is peaking':'✅ Good entry point'}</strong></div>
            </div>
          </div>
        </div>
        <div className="insight-full-card empathy-card">
          <div className="empathy-header">
            <span className="empathy-icon">🛡️</span>
            <div>
              <h3>Your Protection Checklist</h3>
              <p className="empathy-message">We understand this is your hard-earned money and possibly the biggest financial decision of your life. We are not here to scare you — we are here to make sure you walk in with your eyes open.</p>
            </div>
          </div>
          <div className="risk-grid">
            {isApartment&&isUnderConstruction&&<div className="risk-item red"><span className="risk-icon">⚠️</span><div><strong>RERA Registration</strong><p>Every under-construction project MUST be RERA registered.</p><a className="check-link" href={layer2Data.propertyLocation==='gurugram'?'https://rera.haryana.gov.in':layer2Data.propertyLocation==='noida'||layer2Data.propertyLocation==='greater-noida'?'https://uprera.in':'https://rera.delhi.gov.in'} target="_blank" rel="noopener noreferrer">→ Check State RERA</a></div></div>}
            <div className="risk-item amber"><span className="risk-icon">📄</span><div><strong>Title Verification</strong><p>Ensure the seller has clear, marketable title. For resale: verify sale chain back 30 years.</p><span className="risk-note">Your bank will do this — but knowing upfront avoids last-minute surprises.</span></div></div>
            {isApartment&&isUnderConstruction&&<div className="risk-item amber"><span className="risk-icon">📋</span><div><strong>Builder-Buyer Agreement</strong><p>Read the BBA carefully before signing. Carpet area should be at least 70% of super area (RERA mandate).</p></div></div>}
            <div className="risk-item green"><span className="risk-icon">✅</span><div><strong>Encumbrance Certificate</strong><p>Confirms no existing loans or legal dues on the property.</p><span className="risk-note">Mandatory before loan disbursal — get it early.</span></div></div>
            {(layer2Data.propertyLocation==='noida'||layer2Data.propertyLocation==='greater-noida')&&<div className="risk-item red"><span className="risk-icon">⚠️</span><div><strong>Noida/Greater Noida Specific Alert</strong><p>Many projects launched 2005-2011 had stalled delivery. Always verify current construction status & RERA compliance independently.</p></div></div>}
            {layer2Data.propertySubType==='plot'&&<div className="risk-item red"><span className="risk-icon">🚫</span><div><strong>Plot/Land — Unregistered Land Risk</strong><p>Verify the land is not agricultural/forest/notified. Home loans NOT available for plots in unapproved colonies.</p></div></div>}
          </div>
        </div>
        <div className="nav-buttons">
          <button className="btn-back" onClick={()=>setCurrentLayer('layer2')}>← Back to Property Details</button>
          <button className="btn-next" onClick={()=>setShowKycGate(true)}>See My Bank Matches <ArrowRight size={20} /></button>
        </div>
      </div>
    );
  };

  // ─── RENDER KYC GATE ──────────────────────────────────────────────────────
  const renderKycGate = () => {
    const handleKycSubmit = async () => {
      if (!kycData.name||!kycData.phone||!kycData.email) { alert('❌ Please provide your name, phone, and email'); return; }
      if (!kycData.agreedToTerms) { alert('❌ Please agree to Terms of Service'); return; }
      if (!kycData.consentToContact) { alert('❌ Please provide consent to be contacted'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(kycData.email)) { alert('❌ Please enter a valid email address'); return; }
      if (!/^[6-9]\d{9}$/.test(kycData.phone)) { alert('❌ Please enter a valid 10-digit mobile number'); return; }

      const matchResults = matchBanks();

      if (supabase) {
        try {
          const { error } = await supabase.from('leads').insert([{
            email:kycData.email, phone:kycData.phone, name:kycData.name, consent_given:kycData.consentToContact,
            employment_type:layer1Data.employmentType, customer_age:parseInt(layer1Data.customerAge),
            monthly_salary:parseInt(layer1Data.monthlyIncome), loan_amount_needed:parseInt(layer1Data.loanAmountNeeded),
            loan_tenure:parseInt(layer1Data.loanTenure), current_emis:parseInt(layer1Data.existingEMIs)||0,
            cibil_range:layer1Data.cibilRange, customer_preference:layer1Data.customerPreference,
            city:layer2Data.propertyLocation, property_type:layer2Data.propertySubType,
            property_category:layer2Data.propertyCategory, property_value:parseInt(layer2Data.propertyValue),
            micro_market:layer2Data.microMarket||null, building_name:layer2Data.buildingSocietyName||null,
            builder_name:layer2Data.builderName||null, exact_sector:layer2Data.exactSector||null,
            bhk_config:layer2Data.bhkConfig||null, carpet_area:layer2Data.carpetArea?parseInt(layer2Data.carpetArea):null,
            property_age:layer2Data.propertyAge||null,
            eligibility_score:matchResults.matches[0]?.matchScore||0,
            max_loan_amount:matchResults.finalEligibleAmount,
            matched_bank:matchResults.matches[0]?.bank||null,
            status:'new',
            notes:`Top banks: ${matchResults.matches.slice(0,3).map(m=>`${m.shortName}(${m.matchScore})`).join(', ')}`
          }]);
          if (error) console.error('Supabase error:', error);
          else console.log('✅ Lead saved');
        } catch(err) { console.error('Error saving lead:', err); }
      }

      setResults(matchResults);
      setShowKycGate(false);
      setCurrentLayer('results');
    };

    return (
      <div className="kyc-gate-overlay">
        <div className="kyc-gate-modal">
          <h2>🔐 Almost There!</h2>
          <p className="kyc-subtitle">Get your personalized bank matches in 30 seconds</p>
          <div className="kyc-form">
            {[{label:'👤 Full Name',type:'text',placeholder:'As per PAN card',key:'name'},{label:'📱 Mobile Number',type:'tel',placeholder:'10-digit mobile',key:'phone',maxLen:10},{label:'📧 Email Address',type:'email',placeholder:'your.email@example.com',key:'email'}].map(f=>(
              <div key={f.key} className="kyc-input-group">
                <label>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} maxLength={f.maxLen} value={kycData[f.key]} onChange={e=>setKycData({...kycData,[f.key]:e.target.value})} />
              </div>
            ))}
            <div className="kyc-terms">
              <label className="terms-checkbox">
                <input type="checkbox" checked={kycData.agreedToTerms} onChange={e=>setKycData({...kycData,agreedToTerms:e.target.checked})} />
                <span>I agree to <a href="#" onClick={e=>{e.preventDefault();alert('Terms: Data used only for loan matching. Not shared without consent.');}}>Terms of Service</a> and acknowledge this is for informational purposes only (not financial advice)</span>
              </label>
              <label className="terms-checkbox" style={{marginTop:'12px'}}>
                <input type="checkbox" checked={kycData.consentToContact} onChange={e=>setKycData({...kycData,consentToContact:e.target.checked})} />
                <span><strong>I consent to be contacted by PrimePath Mortgages</strong> via phone/email/WhatsApp for loan assistance</span>
              </label>
            </div>
            <div className="kyc-actions">
              <button className="btn-back" onClick={()=>setShowKycGate(false)}>← Back</button>
              <button className="btn-kyc-submit" onClick={handleKycSubmit}>Show My Matches 🎯</button>
            </div>
          </div>
          <div className="kyc-disclaimer">
            <p>🔒 <strong>Your data is safe.</strong> Bank-grade encryption. Never sold to third parties without explicit consent.</p>
            <p>⚖️ <strong>Not financial advice.</strong> Indicative eligibility based on standard bank policies. Final approval depends on bank's discretion.</p>
          </div>
        </div>
      </div>
    );
  };

  // ─── RENDER RESULTS ───────────────────────────────────────────────────────
  const renderResults = () => {
    if (!results) return null;
    const { customerCapacity, propertyCeiling, finalEligibleAmount, limitingFactor, matches } = results;
    const govt = matches.filter(m=>m.category==='Government');
    const pvt = matches.filter(m=>m.category==='Private');
    const mnc = matches.filter(m=>m.category==='Multinational');

    const BankCard = ({match}) => (
      <div className="bank-card">
        <div className="bank-header">
          <div><h4>{match.shortName}</h4><p className="bank-full">{match.bank}</p></div>
          <div className="score-circle">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e0e0e0" strokeWidth="8"/>
              <circle cx="50" cy="50" r="40" fill="none" stroke={match.approvalProbability>=70?'#10b981':match.approvalProbability>=50?'#f59e0b':'#ef4444'} strokeWidth="8" strokeDasharray={`${match.approvalProbability*2.51} 251`} transform="rotate(-90 50 50)"/>
            </svg>
            <span className="score-num">{match.approvalProbability}%</span>
          </div>
        </div>
        {match.disqualifiers.length>0&&<div className="disqualifiers">{match.disqualifiers.map((d,i)=><div key={i}>⚠️ {d}</div>)}</div>}
        <div className="loan-details">
          {[['Loan Amount',`₹${(match.loanAmount/100000).toFixed(1)}L`],['Monthly EMI',`₹${(match.emi/1000).toFixed(1)}K`],['Interest Rate',`${match.interestRate}%`],['Upfront Costs',match.totalUpfront]].map(([l,v])=>(
            <div key={l} className="detail-row"><span>{l}</span><strong style={l==='Upfront Costs'?{fontSize:'12px',color:'#64748b'}:{}}>{v}</strong></div>
          ))}
        </div>
        <div className="strengths">
          <strong>Why {match.shortName}?</strong>
          <ul>{[...match.reasons.slice(0,2),...match.strengths.slice(0,2)].map((r,i)=><li key={i}>{r}</li>)}</ul>
        </div>
      </div>
    );

    // ── AMORTIZATION — fully inline styled, no CSS class dependency ──────────
    const AmortSection = () => {
      const bestMatch = results.matches[0];
      const rate = bestMatch ? bestMatch.interestRate : 8.5;
      const tenure = parseInt(layer1Data.loanTenure || 20);
      const principal = results.finalEligibleAmount;
      const monthlyRate = rate / 12 / 100;
      const tenureMonths = tenure * 12;
      const emi = principal * (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);

      let balance = principal;
      const yearlyData = [];
      for (let year = 1; year <= tenure; year++) {
        let yp = 0, yi = 0;
        for (let m = 0; m < 12; m++) {
          const interest = balance * monthlyRate;
          const princ = emi - interest;
          yi += interest; yp += princ; balance -= princ;
        }
        yearlyData.push({ year, principal: Math.round(yp), interest: Math.round(yi), balance: Math.max(0, Math.round(balance)) });
      }
      const totalInterest = yearlyData.reduce((s, d) => s + d.interest, 0);
      const totalPayment = principal + totalInterest;
      const maxBar = Math.max(...yearlyData.map(d => d.principal + d.interest));

      // Show every nth year so we get max ~15 bars
      const step = Math.ceil(tenure / 15);
      const displayData = yearlyData.filter((_, i) => i % step === 0 || i === tenure - 1);

      const chartHeight = 160;

      const firstFiveInterestPct = Math.round(
        (yearlyData.slice(0, 5).reduce((s, d) => s + d.interest, 0) /
          yearlyData.slice(0, 5).reduce((s, d) => s + d.principal + d.interest, 0)) * 100
      );

      return (
        <div style={{background:'#fff',borderRadius:'16px',padding:'32px',marginBottom:'24px',boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>
          <h2 style={{fontSize:'22px',fontWeight:'700',color:'#1e293b',marginBottom:'4px'}}>📊 Free Amortization Schedule</h2>
          <p style={{color:'#64748b',fontSize:'14px',marginBottom:'24px'}}>Based on {rate}% p.a. over {tenure} years (using {bestMatch?.shortName || 'best matched'} rate)</p>

          {/* Summary Stats */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'28px',background:'#f8fafc',borderRadius:'12px',padding:'20px'}}>
            {[
              {label:'Loan Amount',value:`₹${(principal/100000).toFixed(1)}L`,color:'#1e3a5f'},
              {label:'Monthly EMI',value:`₹${Math.round(emi).toLocaleString()}`,color:'#2563eb'},
              {label:'Total Interest',value:`₹${(totalInterest/100000).toFixed(1)}L`,color:'#ef4444'},
              {label:'Total Payment',value:`₹${(totalPayment/100000).toFixed(1)}L`,color:'#1e293b'},
            ].map(s=>(
              <div key={s.label} style={{textAlign:'center'}}>
                <div style={{fontSize:'13px',color:'#64748b',marginBottom:'6px'}}>{s.label}</div>
                <div style={{fontSize:'20px',fontWeight:'700',color:s.color}}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{display:'flex',gap:'20px',marginBottom:'12px'}}>
            <span style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'13px',color:'#64748b'}}>
              <span style={{width:'12px',height:'12px',background:'#1e3a5f',borderRadius:'2px',display:'inline-block'}}></span> Principal
            </span>
            <span style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'13px',color:'#64748b'}}>
              <span style={{width:'12px',height:'12px',background:'#ef4444',borderRadius:'2px',display:'inline-block'}}></span> Interest
            </span>
          </div>

          {/* ── BAR CHART — fully inline, no CSS dependencies ── */}
          <div style={{
            width:'100%',
            overflowX:'auto',
            paddingBottom:'8px',
          }}>
            <div style={{
              display:'flex',
              alignItems:'flex-end',
              gap:'6px',
              height:`${chartHeight + 30}px`,
              minWidth:`${displayData.length * 44}px`,
              paddingTop:'8px',
            }}>
              {displayData.map(d => {
                const iH = Math.round((d.interest / maxBar) * chartHeight);
                const pH = Math.round((d.principal / maxBar) * chartHeight);
                return (
                  <div key={d.year} style={{display:'flex',flexDirection:'column',alignItems:'center',flex:'1',minWidth:'36px'}}>
                    {/* Interest bar on top, principal on bottom — stacked */}
                    <div style={{display:'flex',flexDirection:'column',justifyContent:'flex-end',width:'28px',height:`${chartHeight}px`}}>
                      <div
                        style={{width:'100%',height:`${iH}px`,background:'#ef4444',borderRadius:'3px 3px 0 0'}}
                        title={`Yr${d.year} Interest: ₹${(d.interest/1000).toFixed(0)}K`}
                      />
                      <div
                        style={{width:'100%',height:`${pH}px`,background:'#1e3a5f'}}
                        title={`Yr${d.year} Principal: ₹${(d.principal/1000).toFixed(0)}K`}
                      />
                    </div>
                    <span style={{fontSize:'10px',color:'#64748b',marginTop:'6px',whiteSpace:'nowrap'}}>Yr{d.year}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insight */}
          <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:'10px',padding:'14px 16px',marginTop:'20px',fontSize:'14px',color:'#1e40af'}}>
            💡 <strong>Key Insight:</strong> In the first 5 years, ~{firstFiveInterestPct}% of your EMI goes to interest. <strong>Prepaying early saves the most!</strong>
          </div>

          {/* Full table toggle */}
          <details style={{marginTop:'20px'}}>
            <summary style={{cursor:'pointer',fontWeight:'600',color:'#2563eb',fontSize:'14px',padding:'8px 0'}}>▶ View Full Year-by-Year Schedule</summary>
            <div style={{overflowX:'auto',marginTop:'12px'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
                <thead>
                  <tr style={{background:'#f1f5f9'}}>
                    {['Year','Principal Paid','Interest Paid','Balance'].map(h=><th key={h} style={{padding:'10px 12px',textAlign:'left',fontWeight:'600',color:'#475569',borderBottom:'2px solid #e2e8f0'}}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {yearlyData.map((d,i)=>(
                    <tr key={d.year} style={{background:i%2===0?'#fff':'#f8fafc'}}>
                      <td style={{padding:'8px 12px',color:'#1e293b'}}>{d.year}</td>
                      <td style={{padding:'8px 12px',color:'#1e3a5f',fontWeight:'500'}}>₹{(d.principal/1000).toFixed(1)}K</td>
                      <td style={{padding:'8px 12px',color:'#ef4444',fontWeight:'500'}}>₹{(d.interest/1000).toFixed(1)}K</td>
                      <td style={{padding:'8px 12px',color:'#64748b'}}>₹{(d.balance/100000).toFixed(2)}L</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      );
    };

    // ── RBI GUIDELINES — fully inline styled ──────────────────────────────
    const RbiSection = () => {
      const cards = [
        { icon:'🔒', title:'LTV Ratios (Your Protection)', body:'RBI mandates banks cannot lend beyond:', points:['Up to ₹30L property: Max 90% LTV','₹30L–₹75L property: Max 80% LTV','Above ₹75L property: Max 75% LTV','LAP: Max 60-70% LTV'], note:'This protects you from over-borrowing' },
        { icon:'💳', title:'Key Fact Statement (KFS)', body:'RBI mandates ALL banks must provide you a KFS before loan disbursal showing:', points:['✓ Annual Percentage Rate (APR)','✓ All fees & charges upfront','✓ Total cost of the loan','✓ No hidden surprises'], note:"Demand this document — it's your RIGHT" },
        { icon:'💰', title:'Prepayment Rules', body:'As per RBI Fair Practice Code:', points:['✓ Floating rate loans: Zero prepayment penalty (RBI circular)','✓ Fixed rate loans: Max 2% penalty','✓ Banks CANNOT refuse part-prepayment','✓ You can switch bank (balance transfer) anytime'], note:'Pay extra EMIs whenever you can — saves lakhs!' },
        { icon:'📊', title:'Interest Rate Transparency', body:'What banks must tell you:', points:['✓ Whether rate is MCLR/RLLR-linked or fixed','✓ Reset frequency (quarterly/annually)','✓ Spread over benchmark rate','✓ When RBI cuts rates, your EMI should reduce'], note:'Ask: "Is this floating or fixed?" before signing' },
        { icon:'⚖️', title:'Fair Practice Code', body:'RBI mandates banks MUST:', points:['✓ Give you a written rejection reason','✓ Not charge penal interest without policy','✓ Provide a loan account statement anytime','✓ Return original documents within 30 days of closure'], note:'If violated, complain at RBI Ombudsman' },
        { icon:'🏗️', title:'Property & Legal Safeguards', body:'RBI directs banks to ensure:', points:['✓ Loan only for RERA-approved projects','✓ Sanctioned plan copy mandatory','✓ No loan for unauthorized constructions','✓ Architect must certify construction stages'], note:'Always ask for RERA registration number' },
      ];

      return (
        <div style={{background:'#fff',borderRadius:'16px',padding:'32px',marginBottom:'24px',boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>
          <h2 style={{fontSize:'22px',fontWeight:'700',color:'#1e293b',marginBottom:'4px'}}>📜 Know Your Rights — RBI Guidelines</h2>
          <p style={{color:'#64748b',fontSize:'14px',marginBottom:'28px'}}>What every home buyer must know before signing</p>

          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',
            gap:'20px',
            marginBottom:'24px',
          }}>
            {cards.map((c,i)=>(
              <div key={i} style={{background:'#f8fafc',borderRadius:'12px',padding:'20px',border:'1px solid #e2e8f0'}}>
                <div style={{fontSize:'28px',marginBottom:'10px'}}>{c.icon}</div>
                <h4 style={{fontSize:'15px',fontWeight:'700',color:'#1e293b',marginBottom:'8px'}}>{c.title}</h4>
                <p style={{fontSize:'13px',color:'#475569',marginBottom:'10px'}}>{c.body}</p>
                <ul style={{listStyle:'none',padding:0,margin:'0 0 12px 0'}}>
                  {c.points.map((p,pi)=><li key={pi} style={{fontSize:'13px',color:'#374151',padding:'3px 0',borderBottom:'1px solid #f1f5f9'}}>{p}</li>)}
                </ul>
                <div style={{background:'#eff6ff',borderRadius:'6px',padding:'8px 10px',fontSize:'12px',color:'#1d4ed8',fontWeight:'500'}}>{c.note}</div>
              </div>
            ))}
          </div>

          <div style={{background:'#f1f5f9',borderRadius:'10px',padding:'16px 20px',borderLeft:'4px solid #2563eb'}}>
            <p style={{fontSize:'13px',color:'#475569',margin:'0 0 4px'}}>📌 Source: RBI Master Circular on Finance for Housing Schemes</p>
            <p style={{fontSize:'13px',color:'#475569',margin:0}}>For grievances: <strong>RBI Banking Ombudsman — bankingombudsman.rbi.org.in</strong></p>
          </div>
        </div>
      );
    };

    return (
      <div className="results-container">
        <div className="results-header">
          <h1>Your Loan Assessment Results</h1>
          <p>Based on your profile and property value</p>
        </div>

        <div className="rate-disclaimer">
          ⓘ <strong>Interest rates as of February 2026.</strong> Bank rates change monthly. Always verify current rates on the bank's official website before applying.
        </div>

        <div className="key-finding-card">
          <h2>Your Maximum Loan Amount</h2>
          <div className="final-amount">₹{(finalEligibleAmount/100000).toFixed(1)}L</div>
          <div className="comparison-grid">
            <div className="comparison-item">
              <span className="label">Your Capacity (A)</span>
              <span className="value">₹{(customerCapacity/100000).toFixed(1)}L</span>
              <span className="sublabel">Based on income & DBR</span>
            </div>
            <div className="vs">vs</div>
            <div className="comparison-item">
              <span className="label">Property Ceiling (B)</span>
              <span className="value">₹{(propertyCeiling/100000).toFixed(1)}L</span>
              <span className="sublabel">Based on {layer2Data.loanType==='HL'?'80%':'70%'} LTV</span>
            </div>
          </div>
          <div className={`limiting-factor ${limitingFactor}`}>
            <strong>Limiting Factor:</strong> {limitingFactor==='income'?'Your Income Capacity':'Property Value'}
            {limitingFactor==='income'&&<p>💡 Even though property supports higher loan, your income limits maximum EMI you can afford</p>}
            {limitingFactor==='property'&&<p>💡 Even though you can afford higher EMI, banks only lend up to {layer2Data.loanType==='HL'?'80%':'70%'} of property value</p>}
          </div>
        </div>

        <div className="bank-categories">
          <h2>Bank Matches</h2>
          {govt.length>0&&<div className="category-section"><h3 className="category-title govt">🏛️ Government Banks</h3><div className="banks-grid">{govt.map((m,i)=><BankCard key={i} match={m}/>)}</div></div>}
          {pvt.length>0&&<div className="category-section"><h3 className="category-title pvt">🏢 Private Banks</h3><div className="banks-grid">{pvt.map((m,i)=><BankCard key={i} match={m}/>)}</div></div>}
          {mnc.length>0&&<div className="category-section"><h3 className="category-title mnc">🌍 Multinational Banks</h3><div className="banks-grid">{mnc.map((m,i)=><BankCard key={i} match={m}/>)}</div></div>}
        </div>

        {/* ── AMORTIZATION (fully inline) ── */}
        {results.finalEligibleAmount > 0 && <AmortSection />}

        {/* ── RBI SECTION (fully inline) ── */}
        <RbiSection />

        <div className="cta-section">
          <h3>Ready to Proceed?</h3>
          <p>Connect with our loan expert for document verification and bank submission</p>
          <button className="cta-button">Schedule Free Consultation</button>
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
