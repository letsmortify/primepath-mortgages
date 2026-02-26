import React, { useState } from 'react';
import { Home, Briefcase, Calculator, FileText, TrendingUp, Info, CheckCircle, ArrowRight, Building2, DollarSign } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// SUPABASE CONNECTION
const supabaseUrl = 'https://maqbmrdxnxeuhrtcguqa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcWJtcmR4bnhldWhydGNndXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMjE2MDMsImV4cCI6MjA4NDY5NzYwM30.akvny8A5QGrZSgAtXhh44IXrk-mMGTOGt7lRfb7r8D0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);


// BANK DATA - Real PSU + Private + MNC banks for NCR
const BANK_POLICIES = {
  // Government Banks
  sbi: {
    name: "State Bank of India",
    shortName: "SBI",
    category: "Government",
    ltvHL: 0.80, // 80% for Home Loan
    ltvLAP: 0.70, // 70% for LAP
    maxDBR: 0.50,
    processingFee: 0.35,
    rateHL: 8.50,
    rateLAP: 9.25,
    strengths: ["MCLR-linked rate cuts", "Lowest processing fees", "Government backing"]
  },
  pnb: {
    name: "Punjab National Bank",
    shortName: "PNB",
    category: "Government",
    ltvHL: 0.80,
    ltvLAP: 0.65,
    maxDBR: 0.60,
    processingFee: 0.25,
    rateHL: 8.40,
    rateLAP: 9.15,
    strengths: ["Highest DBR acceptance (60%)", "Very low processing fees", "Fast for govt employees"]
  },
  canara: {
    name: "Canara Bank",
    shortName: "Canara",
    category: "Government",
    ltvHL: 0.85,
    ltvLAP: 0.70,
    maxDBR: 0.50,
    processingFee: 0.30,
    rateHL: 8.55,
    rateLAP: 9.30,
    strengths: ["Fastest rate cut pass-through", "Women borrower discounts", "Green home benefits"]
  },
  
  // Private Banks
  hdfc: {
    name: "HDFC Bank",
    shortName: "HDFC",
    category: "Private",
    ltvHL: 0.90,
    ltvLAP: 0.70,
    maxDBR: 0.75,
    processingFee: 0.50,
    rateHL: 8.75,
    rateLAP: 9.50,
    strengths: ["Fastest processing (10-18 days)", "Highest LTV for HL", "Digital journey"]
  },
  icici: {
    name: "ICICI Bank",
    shortName: "ICICI",
    category: "Private",
    ltvHL: 0.90,
    ltvLAP: 0.65,
    maxDBR: 0.75,
    processingFee: 0.50,
    rateHL: 8.70,
    rateLAP: 9.45,
    strengths: ["Quick disbursement", "Good for salaried", "Pre-approved offers"]
  },
  
  // Multinational Banks
  hsbc: {
    name: "HSBC",
    shortName: "HSBC",
    category: "Multinational",
    ltvHL: 0.80,
    ltvLAP: 0.60,
    maxDBR: 0.60,
    processingFee: 0.50,
    rateHL: 8.85,
    rateLAP: 9.60,
    strengths: ["Premium service", "Global network", "NRI friendly"]
  },
  standard: {
    name: "Standard Chartered",
    shortName: "StanChart",
    category: "Multinational",
    ltvHL: 0.80,
    ltvLAP: 0.60,
    maxDBR: 0.60,
    processingFee: 0.50,
    rateHL: 8.90,
    rateLAP: 9.65,
    strengths: ["Personalized banking", "Premium customers", "Fast processing"]
  }
};
// NCR MICRO-MARKET DATA — Option B: Fully Data-Driven (PropIndex/Savills/C&W Q4 2025)
const NCR_MICROMARKETS = {
  gurugram: [
    { id: 'new-gurugram', name: 'New Gurugram', sectors: 'Sectors 70-115', avgPrice: 10350, luxuryAvg: 16624, growth: '+34% YoY', temp: 'hot', rentalMin: 35000, rentalMax: 75000, rentalGrowth: '+4% YoY', rentalYield: 3.2,
      highlights: ['11,300+ units launched in 2024 — highest in NCR','Proposed Gurugram Metro Phase 5 alignment','Strong IT/corporate employment belt','50% of NCR 2025 launches were in Gurugram','Well-planned sector roads & green spaces'] },
    { id: 'dwarka-exp', name: 'Dwarka Expressway', sectors: 'Sectors 99-113', avgPrice: 11000, luxuryAvg: 16693, growth: '+100% since 2019', temp: 'hot', rentalMin: 40000, rentalMax: 90000, rentalGrowth: '+12% YoY', rentalYield: 3.5,
      highlights: ['Operational 8-lane Dwarka Expressway (2024)','15–20 min drive to IGI Airport','Upcoming metro connectivity (Dwarka-Gurgaon link)','89% ultra-luxury launches in corridor','37% share of Gurugram H1 2025 new launches'] },
    { id: 'golf-ext', name: 'Golf Course Extension', sectors: 'Sectors 58-68', avgPrice: 19500, luxuryAvg: 26000, growth: '+21% YoY', temp: 'warm', rentalMin: 80000, rentalMax: 200000, rentalGrowth: '+8% YoY', rentalYield: 2.8,
      highlights: ['Premium corridor — Golf Course Road to SPR','53% of Gurugram H1 2025 luxury launches','Rising HNI & NRI demand','Capital values: ₹26,000–₹60,000 psf (luxury)','Record transactions pushing benchmarks higher'] },
    { id: 'sohna-road', name: 'Sohna Road', sectors: 'Sectors 47-49, 88', avgPrice: 17400, growth: '+30% YoY', temp: 'hot', rentalMin: 45000, rentalMax: 120000, rentalGrowth: '+6% YoY', rentalYield: 3.0,
      highlights: ['SPR corridor — connects Golf Course Ext to NH-48','Mixed-use development with commercial hubs','Good connectivity to Cyber Hub','Popular with mid-to-premium segment buyers','Active builder activity from DLF, M3M, Signature'] },
    { id: 'old-gurugram', name: 'Old Gurugram / DLF Phases', sectors: 'DLF Phase 1-4, Sushant Lok', avgPrice: 19000, luxuryAvg: 28900, growth: '+9% YoY', temp: 'warm', rentalMin: 60000, rentalMax: 180000, rentalGrowth: '+6% YoY', rentalYield: 2.5,
      highlights: ['Most mature & established Gurugram market','DLF flagship projects with strong brand value','Best social infrastructure in Gurugram','Premium villas avg ₹28,900 psf','High occupancy — preferred by expats & HNIs'] },
    { id: 'sohna', name: 'Sohna (South Gurugram)', sectors: 'Sohna town & vicinity', avgPrice: 6000, growth: '+193% new launches', temp: 'hot', rentalMin: 15000, rentalMax: 35000, rentalGrowth: '+5% YoY', rentalYield: 3.8,
      highlights: ['Upcoming affordable-mid segment hub','Haryana RERA approved projects increasing','Proximity to KMP Expressway','193% surge in new launches — high future supply','Best value entry point in Gurugram region'] }
  ],
  noida: [
    { id: 'central-noida', name: 'Central Noida', sectors: 'Sectors 15-50', avgPrice: 16000, growth: '+9% YoY', temp: 'warm', rentalMin: 30000, rentalMax: 70000, rentalGrowth: '+3% YoY', rentalYield: 2.8,
      highlights: ['Established city centre — best connectivity','Noida Metro (Blue Line) covers entire belt','Top schools, hospitals & commercial centres','Sector 18 shopping district proximity','Stable demand from both end-users & investors'] },
    { id: 'noida-sectors-51-100', name: 'Mid Noida', sectors: 'Sectors 51-100', avgPrice: 14000, growth: '+10% YoY', temp: 'warm', rentalMin: 25000, rentalMax: 60000, rentalGrowth: '+3% YoY', rentalYield: 2.9,
      highlights: ['Metro connectivity via Aqua Line (Sec 51, 76, 101)','Growing IT park presence (Sec 62, 63)','Mid-segment sweet spot for value buyers','Close to Botanical Garden metro hub','Active resale market with good liquidity'] },
    { id: 'noida-exp', name: 'Noida Expressway', sectors: 'Sectors 74-137', avgPrice: 13400, growth: '+10% YoY', temp: 'warm', rentalMin: 38500, rentalMax: 69500, rentalGrowth: '+3% YoY', rentalYield: 3.1,
      highlights: ['Commercial hub — IT parks, MNC offices','Aqua Line metro serves Sectors 101-137','Close to Greater Noida & Yamuna Exp junction','Cushman & Wakefield avg rent ₹38,500–₹69,500/mo','Strong demand from IT professionals'] },
    { id: 'sector-150', name: 'Sector 150 Zone', sectors: 'Sectors 100-149', avgPrice: 10000, growth: '+24% YoY', temp: 'hot', rentalMin: 28000, rentalMax: 55000, rentalGrowth: '+3% YoY', rentalYield: 3.4,
      highlights: ['Greenest planned sector in Noida — 60% open space','Close to DND Flyway & Noida-Greater Noida Exp','Luxury projects by ATS, Godrej, Tata, Prateek','Savills: capital values rising 7% in Sec 150','Airport metro line to pass through corridor'] },
    { id: 'new-noida', name: 'New Noida / South', sectors: 'Sectors 150-168', avgPrice: 8450, growth: '+24% YoY', temp: 'hot', rentalMin: 20000, rentalMax: 45000, rentalGrowth: '+5% YoY', rentalYield: 3.6,
      highlights: ['Noida Authority planning 20,000 acre new township','Upcoming Jewar Airport metro connectivity','Most affordable entry in premium Noida zone','NOIDA-Greater NOIDA Exp: +26% capital appreciation','High growth potential — ideal for 5–7 year horizon'] },
    { id: 'gr-noida-west', name: 'Greater Noida West', sectors: 'Tech Zone IV, KP V', avgPrice: 8450, growth: '+150% new launches', temp: 'hot', rentalMin: 18000, rentalMax: 38000, rentalGrowth: '+5% YoY', rentalYield: 3.7,
      highlights: ['Highest new launch volume in NCR in 2024','Affordable to mid-segment housing dominates','Proposed metro connectivity (Aqua Line extension)','Growing social infra — malls, hospitals, schools','Preferred by first-time buyers & investors'] }
  ],
  'greater-noida': [
    { id: 'gnw-main', name: 'Greater Noida West', sectors: 'Tech Zone IV, Knowledge Park', avgPrice: 8450, growth: '+24% YoY', temp: 'hot', rentalMin: 18000, rentalMax: 40000, rentalGrowth: '+5% YoY', rentalYield: 3.6,
      highlights: ['Most affordable new-launch hub in NCR 2024','Aqua Metro Line extension planned','Knowledge Park & Tech Zone proximity','Strong RERA compliance post-2017 reforms','75% new launches in 2025 were in this micro-market'] },
    { id: 'yamuna-exp', name: 'Yamuna Expressway', sectors: 'Sectors near Jewar Airport', avgPrice: 4500, growth: 'Airport impact zone', temp: 'hot', rentalMin: 12000, rentalMax: 28000, rentalGrowth: '+8% YoY', rentalYield: 4.0,
      highlights: ['Noida International Airport (Jewar) — operational by 2026','8% of NCR 2025 launches were on Yamuna Exp','Land prices appreciating on airport announcement','Formula 1 circuit, film city, medical device park nearby','Highest long-term growth potential in entire NCR'] },
    { id: 'gnida-sectors', name: 'Greater Noida Central', sectors: 'Alpha, Beta, Gamma sectors', avgPrice: 7000, growth: '+8% YoY', temp: 'warm', rentalMin: 15000, rentalMax: 35000, rentalGrowth: '+4% YoY', rentalYield: 3.2,
      highlights: ['Established GNIDA authority planned sectors','Wide roads & green belts — planned urban design','Pari Chowk & Knowledge Park commercial hubs','Good connectivity via NH-44 to Delhi','Stable market — preferred by end-users'] }
  ],
  delhi: [
    { id: 'south-delhi', name: 'South Delhi', sectors: 'Saket, GK 1&2, Defence Colony, Lajpat Nagar', avgPrice: 22000, luxuryAvg: 52500, growth: '+8% YoY', temp: 'warm', rentalMin: 159500, rentalMax: 253000, rentalGrowth: '+4% YoY', rentalYield: 2.2,
      highlights: ['Most prestigious belt — limited supply drives value','Capital values: ₹40,250–₹65,500 psf (luxury)','C&W: South-East +4%, South-West +5% YoY','HNI demand from business families & NRIs','Luxury floors & bungalows dominate supply'] },
    { id: 'west-delhi', name: 'West Delhi', sectors: 'Dwarka, Janakpuri, Rajouri Garden, Uttam Nagar', avgPrice: 14800, growth: '+11% YoY', temp: 'warm', rentalMin: 25000, rentalMax: 60000, rentalGrowth: '+4% YoY', rentalYield: 2.8,
      highlights: ['Dwarka — Delhi Metro connectivity (Blue & Magenta)','15 min to IGI Airport from Dwarka','One of Delhi largest planned sectors','Strong middle-class demand','Growing social infrastructure in Dwarka sectors'] },
    { id: 'north-delhi', name: 'North Delhi', sectors: 'Rohini, Pitampura, Model Town, Shakurpur', avgPrice: 13500, growth: '+10% YoY', temp: 'warm', rentalMin: 20000, rentalMax: 50000, rentalGrowth: '+3% YoY', rentalYield: 2.6,
      highlights: ['Rohini — Delhi largest planned sub-city','Red Line Metro connects entire belt','Model Town & Civil Lines — old Delhi premium','Affordable relative to South & West Delhi','Good schools & hospitals belt'] },
    { id: 'east-delhi', name: 'East Delhi', sectors: 'Laxmi Nagar, Mayur Vihar, Preet Vihar, IP Ext', avgPrice: 12000, growth: '+9% YoY', temp: 'warm', rentalMin: 18000, rentalMax: 45000, rentalGrowth: '+3% YoY', rentalYield: 2.9,
      highlights: ['Most affordable Delhi zone — best value','Blue Line Metro covers Laxmi Nagar to Noida border','Close to Noida IT parks — popular with IT workers','IP Extension — growing luxury segment','Preet Vihar & Mayur Vihar Phase 1: established'] },
    { id: 'north-west-delhi', name: 'North-West Delhi', sectors: 'Paschim Vihar, Shalimar Bagh, Ashok Vihar', avgPrice: 15000, growth: '+9% YoY', temp: 'warm', rentalMin: 22000, rentalMax: 55000, rentalGrowth: '+3% YoY', rentalYield: 2.7,
      highlights: ['Paschim Vihar — well-planned colony with good roads','Pink Line Metro covers Shalimar Bagh','Ashok Vihar — popular with government employees','Close to Netaji Subhash Place commercial hub','Strong owner-occupier base — low vacancy'] },
    { id: 'central-delhi', name: 'Central Delhi', sectors: 'Karol Bagh, Paharganj, Civil Lines', avgPrice: 18000, luxuryAvg: 82750, growth: '+7% YoY', temp: 'warm', rentalMin: 348500, rentalMax: 585500, rentalGrowth: '+3% YoY', rentalYield: 2.0,
      highlights: ['Jorbagh, Golf Links — Lutyens Delhi premium','Capital values ₹82,750–₹1,33,500 psf (Lutyens)','Strictest building bye-laws — very limited supply','Ultra-HNI & diplomatic zone demand','One of the most value-stable markets in India'] }
  ],
  ghaziabad: [
    { id: 'indirapuram', name: 'Indirapuram', sectors: 'Shakti Khand, Niti Khand, Ahinsa Khand', avgPrice: 7500, growth: '+8% YoY', temp: 'warm', rentalMin: 18000, rentalMax: 40000, rentalGrowth: '+4% YoY', rentalYield: 3.1,
      highlights: ['Most established Ghaziabad residential hub','Blue Line Metro (Vaishali–Noida) nearby','NH-24 Bypass connectivity to Delhi & Noida','High-density township with all amenities','Active resale market with good liquidity'] },
    { id: 'vaishali', name: 'Vaishali / Vasundhara', sectors: 'Sectors 1-6', avgPrice: 6800, growth: '+9% YoY', temp: 'warm', rentalMin: 15000, rentalMax: 35000, rentalGrowth: '+3% YoY', rentalYield: 3.0,
      highlights: ['Vaishali Metro Station (Blue Line) — direct to Delhi','Vasundhara — planned sectors with good infra','Close to Delhi border — great for Delhi commuters','Affordable first-home market','Growing commercial & retail presence'] },
    { id: 'raj-nagar-ext', name: 'Raj Nagar Extension', sectors: 'NH-58 corridor', avgPrice: 4500, growth: '+12% YoY', temp: 'hot', rentalMin: 10000, rentalMax: 25000, rentalGrowth: '+5% YoY', rentalYield: 3.8,
      highlights: ['Fastest growing affordable segment in Ghaziabad','Large township projects by Gaurs, Mahagun, ATS','Proposed metro connectivity boost expected','Best price-to-space ratio in NCR','Rapidly improving social infrastructure'] },
    { id: 'crossings-rep', name: 'Crossings Republik', sectors: 'NH-24 Belt', avgPrice: 5500, growth: '+14% YoY', temp: 'hot', rentalMin: 12000, rentalMax: 28000, rentalGrowth: '+5% YoY', rentalYield: 3.5,
      highlights: ['Integrated township — self-sufficient living','NH-24 corridor — direct to Delhi in 40 min','Large project sizes — good amenities','Growing IT/corporate presence nearby','Affordable end-user driven market'] },
    { id: 'siddharth-vihar', name: 'Siddharth Vihar / Tronica City', sectors: 'Upcoming zone', avgPrice: 4000, growth: '+18% YoY', temp: 'hot', rentalMin: 8000, rentalMax: 20000, rentalGrowth: '+6% YoY', rentalYield: 4.0,
      highlights: ['Emerging zone — early entry opportunity','Industrial & logistics hub growing nearby','Land acquisition active — future infra planned','Ideal for 5–7 year investment horizon','Lowest price per sqft in NCR'] }
  ],
  faridabad: [
    { id: 'nhpc-nit', name: 'NIT / NHPC Area', sectors: 'Central Faridabad', avgPrice: 6800, growth: '+7% YoY', temp: 'warm', rentalMin: 15000, rentalMax: 35000, rentalGrowth: '+3% YoY', rentalYield: 3.0,
      highlights: ['Oldest established belt of Faridabad','Violet Line Metro (Faridabad stations) connectivity','Close to AIIMS Faridabad (under development)','Government employees hub — stable demand','Sector 12, 14, 16 — mature resale market'] },
    { id: 'sector-15-21', name: 'Sectors 15-21', sectors: 'Old Faridabad', avgPrice: 7200, growth: '+6% YoY', temp: 'warm', rentalMin: 16000, rentalMax: 38000, rentalGrowth: '+3% YoY', rentalYield: 2.8,
      highlights: ['Well-established residential sectors','Good connectivity via KMP Expressway','Close to Crown Mall & commercial hubs','Popular with local business families','Metro Violet Line serves this corridor'] },
    { id: 'greater-faridabad', name: 'Greater Faridabad', sectors: 'Sectors 75-89', avgPrice: 5500, growth: '+10% YoY', temp: 'warm', rentalMin: 12000, rentalMax: 28000, rentalGrowth: '+4% YoY', rentalYield: 3.3,
      highlights: ['New planned zone — modern infrastructure','Affordable relative to Gurgaon & Noida','Easy access to KMP Expressway (orbital)','Active new launches by mid-segment developers','Proximity to Gurgaon via Faridabad-Gurgaon Road'] },
    { id: 'neharpar', name: 'Neharpar / Greenfield', sectors: 'Sectors 88-96, Faridabad-Gurgaon Road', avgPrice: 4500, growth: '+12% YoY', temp: 'hot', rentalMin: 10000, rentalMax: 24000, rentalGrowth: '+5% YoY', rentalYield: 3.8,
      highlights: ['Fastest growing zone in Faridabad','Faridabad-Gurgaon Road — direct access to Gurugram','New township development — modern amenities','Entry-level investment zone with high growth','Low prices attracting first-home buyers'] }
  ]
};

const PrimePathMortgages = () => {
  // VALIDATION CONSTANTS
  const LIMITS = {
    minLoan: 3000000,      // ₹30L
    maxLoan: 150000000,    // ₹15 Cr
    minIncome: 15000,      // ₹15K/month
    maxIncome: 10000000,   // ₹1 Cr/month (catches data entry errors)
    minPropertyValue: 1000000,   // ₹10L
    maxPropertyValue: 500000000, // ₹50 Cr
    minEMI: 0,
    maxEMI: 5000000,       // ₹50L/month (catches errors)
  };

  const [currentLayer, setCurrentLayer] = useState('intro'); // intro, layer1, layer2, results
  const [layer1Data, setLayer1Data] = useState({
    employmentType: '', // govt-salaried, private-salaried, professional, employer
    customerPreference: '', // speed, rate, cost, service
    loanAmountNeeded: '',
    monthlyIncome: '',
    loanTenure: '20', // years - default 20
    existingEMIs: '',
    borrowerType: '', // first-time or repeat
    missedPayments12m: '', // yes/no
    missedPayments5y: '', // yes/no
    cibilRange: ''
  });
  
  const [layer2Data, setLayer2Data] = useState({
    loanType: '', // HL or LAP
    propertySubType: '', // apartment, plot, house, office
    propertyUsage: '', // residential, commercial, vacant
    propertyCategory: '', // builder-new, resale
    decidingDocument: '', // agreement-to-sell, booking-form, property-papers
    propertyValue: '', // from deciding document
    propertyLocation: '',
    microMarket: '', // NEW - Specific area/zone
    
    // DETAILED PROPERTY CAPTURE (Path A):
    buildingSocietyName: '', // "Mahagun Moderne"
    exactSector: '', // "Sector 78"
    builderName: '', // "Mahagun"
    bhkConfig: '', // "2 BHK", "3 BHK"
    propertyAge: '', // for resale
    carpetArea: '', // sq ft
  });

  const [results, setResults] = useState(null);
  const [kycData, setKycData] = useState({ name: '', phone: '', email: '', agreedToTerms: false, consentToContact: false });
  const [showKycGate, setShowKycGate] = useState(false);

  // Calculate customer capacity (A) from Layer 1
  const calculateCustomerCapacity = () => {
    const income = parseInt(layer1Data.monthlyIncome);
    const existingEMI = parseInt(layer1Data.existingEMIs) || 0;
    
    // DBR calculation - max 50-60% of income can go to EMIs
    const maxDBR = layer1Data.borrowerType === 'psu' ? 0.60 : 0.50;
    const maxTotalEMI = income * maxDBR;
    const availableForNewLoan = maxTotalEMI - existingEMI;
    
    // Calculate loan amount using customer-selected tenure
    const monthlyRate = 8.5 / 12 / 100;
    const tenureMonths = parseInt(layer1Data.loanTenure || 20) * 12;
    const loanCapacity = availableForNewLoan * ((Math.pow(1 + monthlyRate, tenureMonths) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)));
    
    return Math.round(loanCapacity);
  };

  // Calculate property ceiling (B) from Layer 2
  const calculatePropertyCeiling = () => {
    const propertyVal = parseInt(layer2Data.propertyValue);
    const loanType = layer2Data.loanType;
    
    // For Home Loan: 80-90% LTV depending on bank
    // For LAP: 60-70% LTV
    const avgLTV = loanType === 'HL' ? 0.80 : 0.70;
    
    return Math.round(propertyVal * avgLTV);
  };

  // Match with banks
  const matchBanks = () => {
    const customerCapacity = calculateCustomerCapacity(); // A
    const propertyCeiling = calculatePropertyCeiling(); // B
    const finalEligibleAmount = Math.min(customerCapacity, propertyCeiling); // Lower of A or B
    
    const income = parseInt(layer1Data.monthlyIncome);
    const existingEMI = parseInt(layer1Data.existingEMIs) || 0;
    const currentDBR = existingEMI / income;
    
    const matches = [];
    
    Object.entries(BANK_POLICIES).forEach(([key, bank]) => {
      let matchScore = 0;
      let reasons = [];
      let disqualifiers = [];
      
      // 1. DBR check (30 points)
      if (currentDBR <= bank.maxDBR - 0.20) {
        matchScore += 30;
        reasons.push(`Your current DBR (${(currentDBR * 100).toFixed(0)}%) is well within limit`);
      } else if (currentDBR <= bank.maxDBR) {
        matchScore += 20;
      } else {
        disqualifiers.push(`Your DBR exceeds ${bank.shortName}'s ${(bank.maxDBR * 100)}% limit`);
      }
      
      // 2. LTV fit (25 points)
      const bankLTV = layer2Data.loanType === 'HL' ? bank.ltvHL : bank.ltvLAP;
      const propertyVal = parseInt(layer2Data.propertyValue);
      const bankMaxLoan = propertyVal * bankLTV;
      
      if (finalEligibleAmount <= bankMaxLoan) {
        matchScore += 25;
        reasons.push(`${bank.shortName} offers ${(bankLTV * 100)}% LTV for this property type`);
      } else {
        matchScore += 10;
      }
      
      // 3. CIBIL fit (20 points)
      if (layer1Data.cibilRange === '750+') {
        matchScore += 20;
        reasons.push("Excellent CIBIL score");
      } else if (layer1Data.cibilRange === '700-749') {
        matchScore += 15;
      } else if (layer1Data.cibilRange === '650-699') {
        matchScore += 8;
      }
      
      // 4. Missed payments (15 points penalty)
      if (layer1Data.missedPayments12m === 'no' && layer1Data.missedPayments5y === 'no') {
        matchScore += 15;
        reasons.push("Clean repayment history");
      } else if (layer1Data.missedPayments12m === 'yes') {
        disqualifiers.push("Recent missed payments in last 12 months");
        matchScore -= 20;
      }
      
      // 5. Property type bonus (10 points) - balanced
      if (layer2Data.propertyCategory === 'builder-new' && bank.category === 'Private') {
        matchScore += 10;
        reasons.push("Private banks have fastest processing for builder properties");
      } else if (layer2Data.propertyCategory === 'builder-new' && bank.category === 'Government') {
        matchScore += 5;
        reasons.push("Government banks offer competitive rates for new properties");
      } else if (layer2Data.propertyCategory === 'resale' && bank.category === 'Government') {
        matchScore += 10;
        reasons.push("Government banks prefer resale properties with clear titles");
      } else if (layer2Data.propertyCategory === 'resale' && bank.category === 'Private') {
        matchScore += 5;
        reasons.push("Private banks accept resale with verified documentation");
      }

      // 6. Customer Preference Bonus (15 points)
      const pref = layer1Data.customerPreference;
      if (pref === 'rate') {
        // Prefer lowest rate
        if (bank.category === 'Government') { matchScore += 15; reasons.push("Best interest rates — saves ₹2-5L over loan tenure"); }
        else if (bank.category === 'Private') { matchScore += 8; }
        else { matchScore += 5; }
      } else if (pref === 'speed') {
        // Prefer fastest processing
        if (bank.category === 'Private') { matchScore += 15; reasons.push("Fastest disbursement: 10-18 days vs 30-45 for PSU banks"); }
        else if (bank.category === 'Multinational') { matchScore += 12; reasons.push("Premium fast-track service available"); }
        else { matchScore += 5; }
      } else if (pref === 'cost') {
        // Prefer lowest upfront cost
        if (bank.processingFee <= 0.30) { matchScore += 15; reasons.push("Lowest processing fees — minimal upfront costs"); }
        else if (bank.processingFee <= 0.40) { matchScore += 10; }
        else { matchScore += 5; }
      } else if (pref === 'service') {
        // Prefer premium service
        if (bank.category === 'Multinational') { matchScore += 15; reasons.push("Premium relationship banking with dedicated RM"); }
        else if (bank.category === 'Private') { matchScore += 10; reasons.push("Digital-first experience with dedicated support"); }
        else { matchScore += 5; }
      }
      
      // Calculate EMI using customer-selected tenure
      const rate = layer2Data.loanType === 'HL' ? bank.rateHL : bank.rateLAP;
      const monthlyRate = rate / 12 / 100;
      const tenureMonths = parseInt(layer1Data.loanTenure || 20) * 12;
      const emi = finalEligibleAmount * (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
      
      // Calculate costs - indicative only, as per bank's portal
      const processingFeeIndicative = `~${bank.processingFee}% of loan amount`;
      const processingFee = Math.round(finalEligibleAmount * bank.processingFee / 100);
      
      const approvalProbability = disqualifiers.length === 0 ? Math.min(matchScore, 95) : Math.min(matchScore * 0.5, 40);
      
      matches.push({
        bank: bank.name,
        shortName: bank.shortName,
        category: bank.category,
        matchScore: Math.max(0, matchScore),
        approvalProbability: Math.round(approvalProbability),
        reasons,
        disqualifiers,
        strengths: bank.strengths,
        loanAmount: finalEligibleAmount,
        emi: Math.round(emi),
        interestRate: rate,
        processingFee,
        processingFeeIndicative: `~${bank.processingFee}% of loan amount (check bank's website)`,
        totalUpfront: `As per ${bank.shortName}'s portal/app`,
        ltv: (bankLTV * 100).toFixed(0)
      });
    });
    
    // Sort by approval probability
    const sorted = matches.sort((a, b) => b.approvalProbability - a.approvalProbability);
    
    return {
      customerCapacity,
      propertyCeiling,
      finalEligibleAmount,
      limitingFactor: customerCapacity < propertyCeiling ? 'income' : 'property',
      matches: sorted
    };
  };

  const handleLayer1Submit = () => {
    const requiredLayer1 = ['employmentType', 'customerPreference', 'loanAmountNeeded', 'monthlyIncome', 'loanTenure', 'existingEMIs', 'borrowerType', 'missedPayments12m', 'missedPayments5y', 'cibilRange'];
    const allFilled = requiredLayer1.every(f => layer1Data[f] !== '');
    if (!allFilled) {
      alert('❌ Please fill all fields to continue');
      return;
    }
    
    // RANGE VALIDATION
    const loan = parseInt(layer1Data.loanAmountNeeded);
    const income = parseInt(layer1Data.monthlyIncome);
    const emi = parseInt(layer1Data.existingEMIs);
    
    if (loan < LIMITS.minLoan || loan > LIMITS.maxLoan) {
      alert(`❌ Loan amount must be between ₹${(LIMITS.minLoan/100000).toFixed(0)}L and ₹${(LIMITS.maxLoan/10000000).toFixed(0)} Cr`);
      return;
    }
    if (income < LIMITS.minIncome || income > LIMITS.maxIncome) {
      alert(`❌ Monthly income must be between ₹${(LIMITS.minIncome/1000).toFixed(0)}K and ₹${(LIMITS.maxIncome/100000).toFixed(0)}L`);
      return;
    }
    if (emi > LIMITS.maxEMI) {
      alert(`❌ Existing EMI seems too high (>₹${(LIMITS.maxEMI/100000).toFixed(0)}L/month). Please verify.`);
      return;
    }
    
    // RISKY PROFILE WARNINGS
    const warnings = [];
    if (parseInt(layer1Data.cibilRange) < 650) {
      warnings.push('⚠️ CIBIL score below 650 may result in higher interest rates or rejection');
    }
    if ((emi / income) > 0.4) {
      warnings.push('⚠️ Your existing EMIs are >40% of income — this reduces eligibility significantly');
    }
    if (layer1Data.missedPayments12m === 'yes' || layer1Data.missedPayments5y === 'yes') {
      warnings.push('⚠️ Missed payments in credit history may affect approval chances');
    }
    
    if (warnings.length > 0) {
      const proceed = confirm(`${warnings.join('\n\n')}\n\nDo you want to continue?`);
      if (!proceed) return;
    }
    
    setCurrentLayer('layer2');
  };

const handleLayer2Submit = () => {
  const requiredFields = ['loanType', 'propertySubType', 'propertyCategory', 'decidingDocument', 'propertyValue', 'propertyLocation'];
  const allRequiredFilled = requiredFields.every(field => layer2Data[field] !== '');
  if (!allRequiredFilled) {
    alert('❌ Please fill all required fields including property type');
    return;
  }
  
  // Check usage for resale properties
  if (layer2Data.propertyCategory === 'resale' && !layer2Data.propertyUsage) {
    alert('❌ Please specify current property usage');
    return;
  }
  
  // PROPERTY VALUE VALIDATION
  const propValue = parseInt(layer2Data.propertyValue);
  if (propValue < LIMITS.minPropertyValue || propValue > LIMITS.maxPropertyValue) {
    alert(`❌ Property value must be between ₹${(LIMITS.minPropertyValue/100000).toFixed(0)}L and ₹${(LIMITS.maxPropertyValue/10000000).toFixed(0)} Cr`);
    return;
  }
  
  // SANITY CHECK: Loan vs Property
  const loanAmt = parseInt(layer1Data.loanAmountNeeded);
  if (loanAmt > propValue) {
    alert('❌ Loan amount cannot exceed property value. Please adjust.');
    return;
  }
  
  // DEVIATION CASE WARNING
  if (layer2Data.propertyUsage === 'commercial') {
    const proceed = confirm('⚠️ DEVIATION CASE DETECTED\n\nProperty is being used for commercial purposes (office/business/tuition).\n\nThis requires special approval from the bank:\n• Processing time may increase by 10-15 days\n• Additional documentation may be required\n• Interest rate may be slightly higher\n\nDo you want to continue?');
    if (!proceed) return;
  }
  
  if (layer2Data.microMarket) {
    setCurrentLayer('propertyInsights');
  } else {
    // Show KYC gate before results
    setShowKycGate(true);
  }
};
  const renderIntro = () => (
    <div className="intro-container">
      <div className="intro-content">
        <h1>Stop Trusting. Start Knowing.</h1>
        <p className="intro-subtitle">The only loan platform that shows you what banks WON'T tell you.</p>
        
        <div className="problem-cards">
          <div className="problem-card">
            <div className="problem-icon bad">🏦</div>
            <h3>Your Bank</h3>
            <p>Long process. Rigid criteria. No transparency on why you were rejected.</p>
          </div>
          
          <div className="problem-card">
            <div className="problem-icon bad">🤝</div>
            <h3>Agents</h3>
            <p>Manipulative. Hidden fees. Push you to banks that pay them highest commission.</p>
          </div>
          
          <div className="problem-card">
            <div className="problem-icon bad">🔍</div>
            <h3>Internet Search</h3>
            <p>Confusing. Outdated info. Can't tell you YOUR exact eligibility.</p>
          </div>
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

        <button className="cta-button" onClick={() => setCurrentLayer('layer1')}>
          Start Your Assessment <ArrowRight size={20} />
        </button>
        
        <p className="trust-line">Used by 2,000+ NCR borrowers. Zero spam. No agents involved.</p>
      </div>
    </div>
  );

  const renderLayer1 = () => (
    <div className="layer-container">
      <div className="layer-header">
        <div className="layer-badge">Layer 1 of 2</div>
        <h2>Your Financial Profile</h2>
        <p>We need to understand your repayment capacity first</p>
      </div>

      <div className="form-section">

        {/* Q1: EMPLOYMENT TYPE */}
        <div className="input-group">
          <label>👤 What best describes your employment?</label>
          <span className="hint">This helps us match the right bank policies for your profile</span>
          <div className="radio-group vertical" style={{marginTop:'8px'}}>
            {[
              { val: 'govt-salaried', emoji: '🏛️', title: 'Salaried — Government / PSU', desc: 'Central/State Govt, PSU, Defence, Railways' },
              { val: 'private-salaried', emoji: '🏢', title: 'Salaried — Private Company', desc: 'MNC, Indian corporate, startup employee' },
              { val: 'professional', emoji: '🩺', title: 'Self-Employed Professional', desc: 'Doctor, Lawyer, CA, Consultant, Architect' },
              { val: 'employer', emoji: '🏭', title: 'Self-Employed Business Owner', desc: 'Manufacturer, Trader, Own account worker' },
            ].map(opt => (
              <label key={opt.val} className="radio-card" style={{borderColor: layer1Data.employmentType === opt.val ? '#2563eb' : '#e2e8f0', background: layer1Data.employmentType === opt.val ? '#eff6ff' : 'white'}}>
                <input type="radio" name="employmentType" value={opt.val}
                  checked={layer1Data.employmentType === opt.val}
                  onChange={(e) => setLayer1Data({...layer1Data, employmentType: e.target.value})} />
                <div>
                  <strong>{opt.emoji} {opt.title}</strong>
                  <p>{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Q2: CUSTOMER PREFERENCE - What matters most */}
        <div className="input-group">
          <label>🎯 What matters most to you in a home loan?</label>
          <span className="hint">This helps us rank banks based on YOUR priority</span>
          <div className="radio-group vertical" style={{marginTop: '8px'}}>
            {[
              { val: 'rate', emoji: '💰', title: 'Lowest Interest Rate', desc: 'Save ₹2-5L over loan tenure' },
              { val: 'speed', emoji: '⚡', title: 'Fastest Processing', desc: 'Disbursement in 10-18 days' },
              { val: 'cost', emoji: '🏷️', title: 'Lowest Upfront Costs', desc: 'Minimal processing fees' },
              { val: 'service', emoji: '🤝', title: 'Premium Service', desc: 'Dedicated RM & support' },
            ].map(opt => (
              <label key={opt.val} className="radio-card" style={{borderColor: layer1Data.customerPreference === opt.val ? '#2563eb' : '#e2e8f0', background: layer1Data.customerPreference === opt.val ? '#eff6ff' : 'white'}}>
                <input type="radio" name="customerPreference" value={opt.val}
                  checked={layer1Data.customerPreference === opt.val}
                  onChange={(e) => setLayer1Data({...layer1Data, customerPreference: e.target.value})} />
                <div>
                  <strong>{opt.emoji} {opt.title}</strong>
                  <p>{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label>How much loan do you need?</label>
          <div className="currency-input">
            <span className="currency">₹</span>
            <input
              type="number"
              placeholder="40,00,000"
              min={LIMITS.minLoan}
              max={LIMITS.maxLoan}
              value={layer1Data.loanAmountNeeded}
              onChange={(e) => setLayer1Data({...layer1Data, loanAmountNeeded: e.target.value})}
            />
          </div>
          <span className="hint">Min: ₹30L | Max: ₹15 Cr</span>
          {layer1Data.loanAmountNeeded && (parseInt(layer1Data.loanAmountNeeded) < LIMITS.minLoan || parseInt(layer1Data.loanAmountNeeded) > LIMITS.maxLoan) && (
            <span className="error-hint">⚠️ Loan amount must be between ₹30L and ₹15 Cr</span>
          )}
        </div>

        <div className="input-group">
          <label>Monthly Net Salary (In-hand)</label>
          <div className="currency-input">
            <span className="currency">₹</span>
            <input
              type="number"
              placeholder="80,000"
              min={LIMITS.minIncome}
              max={LIMITS.maxIncome}
              value={layer1Data.monthlyIncome}
              onChange={(e) => setLayer1Data({...layer1Data, monthlyIncome: e.target.value})}
            />
          </div>
          <span className="hint">After all deductions (PF, tax, etc.) | Min: ₹15K/month</span>
          {layer1Data.monthlyIncome && (parseInt(layer1Data.monthlyIncome) < LIMITS.minIncome || parseInt(layer1Data.monthlyIncome) > LIMITS.maxIncome) && (
            <span className="error-hint">⚠️ Income must be between ₹15K and ₹1 Cr/month</span>
          )}
        </div>

        {/* LOAN TENURE */}
        <div className="input-group">
          <label>Preferred Loan Tenure</label>
          <select
            value={layer1Data.loanTenure}
            onChange={(e) => setLayer1Data({...layer1Data, loanTenure: e.target.value})}
            className="select-input"
          >
            <option value="5">5 Years</option>
            <option value="10">10 Years</option>
            <option value="15">15 Years</option>
            <option value="20">20 Years (Recommended)</option>
            <option value="25">25 Years</option>
            <option value="30">30 Years</option>
          </select>
          <span className="hint">Longer tenure = lower EMI but higher total interest paid</span>
        </div>

        <div className="input-group">
          <label>Current Total Monthly EMIs</label>
          <div className="currency-input">
            <span className="currency">₹</span>
            <input
              type="number"
              placeholder="0"
              min={LIMITS.minEMI}
              max={LIMITS.maxEMI}
              value={layer1Data.existingEMIs}
              onChange={(e) => setLayer1Data({...layer1Data, existingEMIs: e.target.value})}
            />
          </div>
          <span className="hint">Car loan, personal loan, credit cards - all combined</span>
          {layer1Data.existingEMIs && parseInt(layer1Data.existingEMIs) > LIMITS.maxEMI && (
            <span className="error-hint">⚠️ EMI amount seems too high — please verify</span>
          )}
        </div>

        <div className="input-group">
          <label>Are you a first-time borrower?</label>
          <div className="radio-group">
            <label className="radio-option">
              <input type="radio" name="borrowerType" value="first-time"
                checked={layer1Data.borrowerType === 'first-time'}
                onChange={(e) => setLayer1Data({...layer1Data, borrowerType: e.target.value})} />
              <span>Yes, first home loan</span>
            </label>
            <label className="radio-option">
              <input type="radio" name="borrowerType" value="repeat"
                checked={layer1Data.borrowerType === 'repeat'}
                onChange={(e) => setLayer1Data({...layer1Data, borrowerType: e.target.value})} />
              <span>No, I've taken loans before</span>
            </label>
          </div>
        </div>

        <div className="input-group">
          <label>Any missed EMI payments in last 12 months?</label>
          <div className="radio-group">
            <label className="radio-option">
              <input type="radio" name="missed12m" value="no"
                checked={layer1Data.missedPayments12m === 'no'}
                onChange={(e) => setLayer1Data({...layer1Data, missedPayments12m: e.target.value})} />
              <span>No</span>
            </label>
            <label className="radio-option">
              <input type="radio" name="missed12m" value="yes"
                checked={layer1Data.missedPayments12m === 'yes'}
                onChange={(e) => setLayer1Data({...layer1Data, missedPayments12m: e.target.value})} />
              <span>Yes</span>
            </label>
          </div>
        </div>

        <div className="input-group">
          <label>Any missed EMI payments in last 5 years?</label>
          <div className="radio-group">
            <label className="radio-option">
              <input type="radio" name="missed5y" value="no"
                checked={layer1Data.missedPayments5y === 'no'}
                onChange={(e) => setLayer1Data({...layer1Data, missedPayments5y: e.target.value})} />
              <span>No</span>
            </label>
            <label className="radio-option">
              <input type="radio" name="missed5y" value="yes"
                checked={layer1Data.missedPayments5y === 'yes'}
                onChange={(e) => setLayer1Data({...layer1Data, missedPayments5y: e.target.value})} />
              <span>Yes</span>
            </label>
          </div>
        </div>

        <div className="input-group">
          <label>Approximate CIBIL Score</label>
          <select value={layer1Data.cibilRange}
            onChange={(e) => setLayer1Data({...layer1Data, cibilRange: e.target.value})}
            className="select-input">
            <option value="">Select range</option>
            <option value="750+">750+ (Excellent)</option>
            <option value="700-749">700-749 (Good)</option>
            <option value="650-699">650-699 (Fair)</option>
            <option value="below-650">Below 650 (Needs improvement)</option>
          </select>
        </div>

        <button className="btn-next" onClick={handleLayer1Submit}>
          Continue to Property Details <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );

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
            <label className="radio-card">
              <input
                type="radio"
                name="loanType"
                value="HL"
                checked={layer2Data.loanType === 'HL'}
                onChange={(e) => setLayer2Data({...layer2Data, loanType: e.target.value, propertyCategory: '', decidingDocument: ''})}
              />
              <div>
                <strong>Home Loan (HL)</strong>
                <p>Buying a new property or under-construction</p>
              </div>
            </label>
            <label className="radio-card">
              <input
                type="radio"
                name="loanType"
                value="LAP"
                checked={layer2Data.loanType === 'LAP'}
                onChange={(e) => setLayer2Data({...layer2Data, loanType: e.target.value, propertyCategory: 'existing', decidingDocument: 'property-papers'})}
              />
              <div>
                <strong>Loan Against Property (LAP)</strong>
                <p>Borrowing against your existing property</p>
              </div>
            </label>
          </div>
        </div>

        {/* PROPERTY SUB-TYPE - Show after loan type selected */}
        {layer2Data.loanType && (() => {
          const hlOptions = [
            { val: 'apartment', emoji: '🏢', title: 'Apartment / Flat', desc: 'Multi-storey builder floor or society flat' },
            { val: 'plot', emoji: '🌳', title: 'Residential Plot / Land', desc: 'Open plot for construction' },
            { val: 'house', emoji: '🏡', title: 'Independent House / Villa', desc: 'Row house, bungalow, builder floor' },
          ];
          const lapOptions = [
            { val: 'office', emoji: '🏛️', title: 'Office / Commercial Space', desc: 'Loan Against Property — commercial use' },
            { val: 'apartment', emoji: '🏢', title: 'Residential Apartment', desc: 'Loan against existing flat / house' },
            { val: 'plot', emoji: '🌳', title: 'Residential Plot', desc: 'Loan against owned plot' },
          ];
          const options = layer2Data.loanType === 'HL' ? hlOptions : lapOptions;
          return (
            <div className="input-group">
              <label>🏠 What type of property?</label>
              <div className="radio-group vertical" style={{marginTop:'8px'}}>
                {options.map(opt => (
                  <label key={opt.val} className="radio-card" style={{borderColor: layer2Data.propertySubType === opt.val ? '#2563eb' : '#e2e8f0', background: layer2Data.propertySubType === opt.val ? '#eff6ff' : 'white'}}>
                    <input type="radio" name="propertySubType" value={opt.val}
                      checked={layer2Data.propertySubType === opt.val}
                      onChange={(e) => setLayer2Data({...layer2Data, propertySubType: e.target.value})} />
                    <div>
                      <strong>{opt.emoji} {opt.title}</strong>
                      <p>{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })()}

        {layer2Data.loanType === 'HL' && (
          <div className="input-group">
            <label>Property Category</label>
            <div className="radio-group vertical">
              <label className="radio-card">
                <input
                  type="radio"
                  name="propertyCategory"
                  value="builder-new"
                  checked={layer2Data.propertyCategory === 'builder-new'}
                  onChange={(e) => setLayer2Data({...layer2Data, propertyCategory: e.target.value, decidingDocument: 'booking-form'})}
                />
                <div>
                  <strong>Builder - New/Under Construction</strong>
                  <p>Buying directly from developer</p>
                </div>
              </label>
              <label className="radio-card">
                <input
                  type="radio"
                  name="propertyCategory"
                  value="resale"
                  checked={layer2Data.propertyCategory === 'resale'}
                  onChange={(e) => setLayer2Data({...layer2Data, propertyCategory: e.target.value, decidingDocument: 'agreement-to-sell'})}
                />
                <div>
                  <strong>Resale Property</strong>
                  <p>Buying from current owner</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* PROPERTY USAGE — Fraud Detection */}
        {layer2Data.propertyCategory && layer2Data.propertyCategory === 'resale' && (
          <div className="input-group">
            <label>🏠 Current usage of the property?</label>
            <span className="hint">Banks verify property usage — commercial use on residential loan is a red flag</span>
            <div className="radio-group vertical" style={{marginTop:'8px'}}>
              <label className="radio-card" style={{borderColor: layer2Data.propertyUsage === 'residential' ? '#2563eb' : '#e2e8f0', background: layer2Data.propertyUsage === 'residential' ? '#eff6ff' : 'white'}}>
                <input type="radio" name="propertyUsage" value="residential"
                  checked={layer2Data.propertyUsage === 'residential'}
                  onChange={(e) => setLayer2Data({...layer2Data, propertyUsage: e.target.value})} />
                <div>
                  <strong>✅ Residential Use</strong>
                  <p>Self-occupied or rented to a family (standard case)</p>
                </div>
              </label>
              <label className="radio-card" style={{borderColor: layer2Data.propertyUsage === 'commercial' ? '#dc2626' : '#e2e8f0', background: layer2Data.propertyUsage === 'commercial' ? '#fef2f2' : 'white'}}>
                <input type="radio" name="propertyUsage" value="commercial"
                  checked={layer2Data.propertyUsage === 'commercial'}
                  onChange={(e) => setLayer2Data({...layer2Data, propertyUsage: e.target.value})} />
                <div>
                  <strong>⚠️ Business / Office / Tuition Use</strong>
                  <p>Requires special approval — processing time increases</p>
                </div>
              </label>
              <label className="radio-card" style={{borderColor: layer2Data.propertyUsage === 'vacant' ? '#2563eb' : '#e2e8f0', background: layer2Data.propertyUsage === 'vacant' ? '#eff6ff' : 'white'}}>
                <input type="radio" name="propertyUsage" value="vacant"
                  checked={layer2Data.propertyUsage === 'vacant'}
                  onChange={(e) => setLayer2Data({...layer2Data, propertyUsage: e.target.value})} />
                <div>
                  <strong>✅ Vacant / Ready for Possession</strong>
                  <p>Not currently occupied (clean case)</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {layer2Data.decidingDocument && (
          <div className="deciding-doc-card">
            <h4>📄 Deciding Document Required:</h4>
            <p>
              {layer2Data.decidingDocument === 'booking-form' && 'Builder Booking Form / Agreement'}
              {layer2Data.decidingDocument === 'agreement-to-sell' && 'Agreement to Sell'}
              {layer2Data.decidingDocument === 'property-papers' && 'Property Ownership Papers / Valuation Report'}
            </p>
            <span className="doc-note">
              This document shows the property value that banks will use for LTV calculation
            </span>
          </div>
        )}

        <div className="input-group">
          <label>Property Value (As per {layer2Data.decidingDocument === 'booking-form' ? 'booking form' : layer2Data.decidingDocument === 'agreement-to-sell' ? 'agreement' : 'valuation'})</label>
          <div className="currency-input">
            <span className="currency">₹</span>
            <input
              type="number"
              placeholder="50,00,000"
              min={LIMITS.minPropertyValue}
              max={LIMITS.maxPropertyValue}
              value={layer2Data.propertyValue}
              onChange={(e) => setLayer2Data({...layer2Data, propertyValue: e.target.value})}
            />
          </div>
          <span className="hint">Enter the exact amount mentioned in the document | Min: ₹10L | Max: ₹50 Cr</span>
          {layer2Data.propertyValue && (parseInt(layer2Data.propertyValue) < LIMITS.minPropertyValue || parseInt(layer2Data.propertyValue) > LIMITS.maxPropertyValue) && (
            <span className="error-hint">⚠️ Property value must be between ₹10L and ₹50 Cr</span>
          )}
        </div>

        <div className="input-group">
          <label>Property Location (NCR)</label>
          <select
            value={layer2Data.propertyLocation}
            onChange={(e) => setLayer2Data({...layer2Data, propertyLocation: e.target.value})}
            className="select-input"
          >
            <option value="">Select location</option>
            <option value="delhi">Delhi</option>
            <option value="gurugram">Gurugram</option>
            <option value="noida">Noida</option>
            <option value="greater-noida">Greater Noida</option>
            <option value="ghaziabad">Ghaziabad</option>
            <option value="faridabad">Faridabad</option>
          </select>
        </div>

        {/* Micro-Market Selection - Only show after city is selected */}
{layer2Data.propertyLocation && NCR_MICROMARKETS[layer2Data.propertyLocation] && (
  <div className="input-group">
    <label>Specific Area / Zone</label>
    <select
      value={layer2Data.microMarket}
      onChange={(e) => setLayer2Data({...layer2Data, microMarket: e.target.value})}
      className="select-input"
    >
      <option value="">Select your area...</option>
      {NCR_MICROMARKETS[layer2Data.propertyLocation].map(zone => (
        <option key={zone.id} value={zone.id}>
          {zone.name} ({zone.sectors}) • ₹{zone.avgPrice.toLocaleString()}/sq ft • {zone.growth}
        </option>
      ))}
    </select>
    <span className="hint">This helps us give you accurate market insights</span>
  </div>
)}

        {/* DETAILED PROPERTY CAPTURE - Path A (for ALL apartments) */}
        {layer2Data.propertyLocation && layer2Data.propertySubType === 'apartment' && layer2Data.propertyCategory && (
          <div className="property-details-section">
            <h3 style={{fontSize:'18px', color:'#1e293b', marginBottom:'16px'}}>📋 Property Details (for personalized matching)</h3>
            
            <div className="input-group">
              <label>Building / Society Name</label>
              <input
                type="text"
                placeholder="e.g., Mahagun Moderne, DLF Crest, Godrej Oasis"
                value={layer2Data.buildingSocietyName}
                onChange={(e) => setLayer2Data({...layer2Data, buildingSocietyName: e.target.value})}
                className="text-input"
              />
              <span className="hint">Exact name as per booking/agreement</span>
            </div>

            <div className="input-group">
              <label>Builder / Developer Name</label>
              <input
                type="text"
                placeholder="e.g., Mahagun, DLF, Godrej, M3M"
                value={layer2Data.builderName}
                onChange={(e) => setLayer2Data({...layer2Data, builderName: e.target.value})}
                className="text-input"
              />
            </div>

            <div className="input-group">
              <label>Exact Sector / Tower / Wing</label>
              <input
                type="text"
                placeholder="e.g., Sector 78, Tower B, Wing C"
                value={layer2Data.exactSector}
                onChange={(e) => setLayer2Data({...layer2Data, exactSector: e.target.value})}
                className="text-input"
              />
            </div>

            <div className="input-group">
              <label>BHK Configuration</label>
              <select
                value={layer2Data.bhkConfig}
                onChange={(e) => setLayer2Data({...layer2Data, bhkConfig: e.target.value})}
                className="select-input"
              >
                <option value="">Select BHK</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4 BHK">4 BHK</option>
                <option value="5+ BHK">5+ BHK (Villa/Penthouse)</option>
              </select>
            </div>

            <div className="input-group">
              <label>Carpet Area (in sq ft)</label>
              <input
                type="number"
                placeholder="e.g., 1200"
                value={layer2Data.carpetArea}
                onChange={(e) => setLayer2Data({...layer2Data, carpetArea: e.target.value})}
                className="text-input"
              />
              <span className="hint">As per sale agreement / possession letter</span>
            </div>

            {layer2Data.propertyCategory === 'resale' && (
              <div className="input-group">
                <label>Property Age (if resale)</label>
                <select
                  value={layer2Data.propertyAge}
                  onChange={(e) => setLayer2Data({...layer2Data, propertyAge: e.target.value})}
                  className="select-input"
                >
                  <option value="">Select age</option>
                  <option value="0-5 years">0-5 years</option>
                  <option value="5-10 years">5-10 years</option>
                  <option value="10-20 years">10-20 years</option>
                  <option value="20+ years">20+ years</option>
                </select>
              </div>
            )}
          </div>
        )}

        <div className="nav-buttons">
          <button className="btn-back" onClick={() => setCurrentLayer('layer1')}>
            ← Back
          </button>
          <button className="btn-next" onClick={handleLayer2Submit}>
            See Bank Matches <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
const renderPropertyInsights = () => {
  if (!layer2Data.microMarket) {
    const r = matchBanks(); setResults(r); setCurrentLayer('results'); return null;
  }
  const cityData = NCR_MICROMARKETS[layer2Data.propertyLocation];
  const zoneData = cityData?.find(z => z.id === layer2Data.microMarket);
  if (!zoneData) { const r = matchBanks(); setResults(r); setCurrentLayer('results'); return null; }

  const propertyVal = parseInt(layer2Data.propertyValue);
  const isApartment = layer2Data.propertySubType === 'apartment';
  const isUnderConstruction = layer2Data.propertyCategory === 'builder-new';
  const estimatedSqFt = Math.round(propertyVal / zoneData.avgPrice);
  // Price difference now calculated inside confidence score logic
  
  // GST/TDS cost calculations (apartments only)
  const gstAmt = isUnderConstruction ? Math.round(propertyVal * 0.05) : 0;
  const tdsAmt = propertyVal > 5000000 ? Math.round(propertyVal * 0.01) : 0;
  const stampDuty = Math.round(propertyVal * 0.06); // avg NCR 6%
  const regFee = Math.round(propertyVal * 0.01);
  const edcHaryana = layer2Data.propertyLocation === 'gurugram' ? Math.round(propertyVal * 0.015) : 0;
  const totalAdditional = gstAmt + tdsAmt + stampDuty + regFee + edcHaryana;

  // Confidence score gamification - FIXED LOGIC
  const scores = {
    // 1. Price Score (0-100)
    priceScore: (() => {
      const priceDiff = ((propertyVal / estimatedSqFt) - zoneData.avgPrice) / zoneData.avgPrice * 100;
      if (priceDiff < -10) return 95; // Great deal
      if (priceDiff > 15) return 50;  // Overpriced
      if (priceDiff > 10) return 60;  // Above market
      if (priceDiff > 5) return 72;   // Slightly high
      return 78; // Fair price
    })(),
    
    // 2. Market Score (0-100)
    marketScore: zoneData.temp === 'hot' ? 90 : zoneData.temp === 'warm' ? 72 : 55,
    
    // 3. Legal Readiness Score (0-100) - CORRECTED
    legalScore: (() => {
      if (isUnderConstruction) {
        // Under-construction — check if it's premium location (implies Tier 1 builder)
        if (propertyVal >= 50000000) return 85; // ₹5 Cr+ = likely DLF/M3M/Godrej
        if (propertyVal >= 20000000) return 75; // ₹2-5 Cr = likely Tier 2 builder
        return 65; // <₹2 Cr UC = needs more diligence
      } else {
        return 90; // Ready-to-move with clear title = safest
      }
    })(),
    
    // 4. Rental Score (0-100) - CORRECTED MATH
    rentalScore: (() => {
      const yield_pct = zoneData.rentalYield || 2.8;
      if (yield_pct >= 3.5) return 90; // Excellent for NCR
      if (yield_pct >= 3.0) return 78; // Good
      if (yield_pct >= 2.5) return 65; // Average
      if (yield_pct >= 2.0) return 52; // Below average
      return 40; // Poor
    })(),
  };
  const overallScore = Math.round((scores.priceScore + scores.marketScore + scores.legalScore + scores.rentalScore) / 4);
  const scoreLabel = overallScore >= 80 ? 'Excellent Buy' : overallScore >= 65 ? 'Good Buy' : 'Proceed with Caution';
  const scoreColor = overallScore >= 80 ? '#16a34a' : overallScore >= 65 ? '#d97706' : '#dc2626';

  // Comparable market data (from PropIndex/Savills/C&W docs)
  const comparables = zoneData.comparables || [
    { project: 'Market Benchmark', size: estimatedSqFt, price: Math.round(zoneData.avgPrice * estimatedSqFt / 100000), psf: zoneData.avgPrice, status: 'Area Average' },
    { project: 'Your Property', size: estimatedSqFt, price: Math.round(propertyVal / 100000), psf: Math.round(propertyVal / estimatedSqFt), status: 'Your Selection' },
  ];

  const ProgressBar = ({ label, score, color }) => (
    <div className="progress-item">
      <div className="progress-label">
        <span>{label}</span>
        <strong style={{color}}>{score}/100</strong>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{width: `${score}%`, background: color}}></div>
      </div>
    </div>
  );

  return (
    <div className="layer-container insights-v2" style={{maxWidth:'960px'}}>
      <div className="layer-header">
        <div className="layer-badge">Property Intelligence</div>
        <h2>📍 {zoneData.name} — Full Analysis</h2>
        <p>Based on PropIndex Q4 2025 · Cushman & Wakefield · Savills H1 2025</p>
      </div>

      {/* CONFIDENCE SCORE - Gamified */}
      <div className="confidence-banner">
        <div className="confidence-main">
          <div className="confidence-dial" style={{borderColor: scoreColor}}>
            <span className="dial-number" style={{color: scoreColor}}>{overallScore}</span>
            <span className="dial-label">/ 100</span>
          </div>
          <div className="confidence-text">
            <h3 style={{color: scoreColor}}>{scoreLabel}</h3>
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

      {/* SECTION 1: PRICE + MARKET */}
      <div className="insights-grid-v2">
        <div className="insight-card-v2">
          <h3>💰 Price Analysis</h3>
          <div className="price-comparison">
            <div className="price-row"><span>Your Property Value:</span>
              <strong>₹{propertyVal >= 10000000 ? `${(propertyVal/10000000).toFixed(2)} Cr` : `${(propertyVal/100000).toFixed(0)}L`}</strong>
            </div>
            <div className="price-row"><span>Area Avg (PSF):</span><strong>₹{zoneData.avgPrice.toLocaleString()}/sq ft</strong></div>
            <div className="price-row"><span>Estimated Size:</span><strong>~{estimatedSqFt} sq ft</strong></div>
          </div>
          {(() => {
            const priceDiff = ((propertyVal / estimatedSqFt) - zoneData.avgPrice) / zoneData.avgPrice * 100;
            if (priceDiff < -10) return <div className="alert-box good-deal">✅ <strong>Good Deal!</strong> {Math.abs(priceDiff).toFixed(0)}% below market average</div>;
            if (priceDiff > 10) return <div className="alert-box verify-alert">⚠️ <strong>Above Market.</strong> {priceDiff.toFixed(0)}% higher — verify amenities justify premium.</div>;
            return <div className="alert-box neutral">✓ <strong>Fair Price</strong> — within {Math.abs(priceDiff).toFixed(0)}% of market average</div>;
          })()}
        </div>

        <div className="insight-card-v2">
          <h3>🌡️ Market Momentum</h3>
          <div className={`temp-badge ${zoneData.temp}`}>
            {zoneData.temp === 'hot' ? '🔥 HOT MARKET' : zoneData.temp === 'warm' ? '📈 WARM MARKET' : '📊 STABLE'}
          </div>
          <div className="temp-details">
            <div className="temp-row"><span>Price Growth:</span><strong>{zoneData.growth}</strong></div>
            <div className="temp-row"><span>Micro-zone:</span><strong>{zoneData.sectors}</strong></div>
            <div className="temp-row"><span>Outlook:</span><strong>{zoneData.temp === 'hot' ? '⬆️ Bullish' : '→ Steady'}</strong></div>
          </div>
        </div>
      </div>

      {/* SECTION 2: AREA HIGHLIGHTS - Option B: Data-Driven */}
      <div className="insight-full-card">
        <h3>📍 Area Highlights</h3>
        <ul className="highlights-list-v2">
          {(zoneData.highlights || ['Established residential area', 'Good social infrastructure', 'Active property market']).map((h, i) => (
            <li key={i}>✓ {h}</li>
          ))}
        </ul>
      </div>

      {/* SECTION 3: APARTMENT COST BREAKDOWN — only for apartments */}
      {isApartment && (
        <div className="insight-full-card cost-card">
          <h3>🧾 True Cost of Buying — What No One Tells You</h3>
          <p className="cost-subtitle">Beyond the base price, here is what you will actually pay:</p>

          <div className="cost-table">
            <div className="cost-row header-row">
              <span>Cost Head</span><span>Rate</span><span>Indicative Amount</span><span>Who Pays</span>
            </div>
            <div className="cost-row">
              <span>🏠 Base Property Price</span><span>—</span>
              <span>₹{propertyVal >= 10000000 ? `${(propertyVal/10000000).toFixed(2)} Cr` : `${(propertyVal/100000).toFixed(0)}L`}</span>
              <span>Buyer → Builder/Seller</span>
            </div>
            {isUnderConstruction && (
              <div className="cost-row highlight-row">
                <span>📊 GST <span className="badge-pill">Under-Construction Only</span></span>
                <span>5%</span>
                <span>₹{(gstAmt/100000).toFixed(1)}L</span>
                <span>Buyer → Govt (via Builder)</span>
              </div>
            )}
            {!isUnderConstruction && (
              <div className="cost-row good-row">
                <span>📊 GST <span className="badge-pill green">Ready-to-Move</span></span>
                <span>NIL ✅</span>
                <span>₹0</span>
                <span>Key advantage of RTM!</span>
              </div>
            )}
            {propertyVal > 5000000 && (
              <div className="cost-row">
                <span>💼 TDS (Sec 194-IA) <span className="badge-pill">If property &gt; ₹50L</span></span>
                <span>1%</span>
                <span>₹{(tdsAmt/100000).toFixed(1)}L</span>
                <span>Buyer deducts, files Form 26QB</span>
              </div>
            )}
            <div className="cost-row">
              <span>🏛️ Stamp Duty</span>
              <span>{layer2Data.propertyLocation === 'delhi' ? '6%' : layer2Data.propertyLocation === 'gurugram' ? '5% (Women: 3%)' : '5%'}</span>
              <span>₹{(stampDuty/100000).toFixed(1)}L</span>
              <span>Buyer → State Govt</span>
            </div>
            <div className="cost-row">
              <span>📝 Registration Fee</span><span>1%</span>
              <span>₹{(regFee/100000).toFixed(1)}L</span>
              <span>Buyer → Sub-Registrar</span>
            </div>
            {layer2Data.propertyLocation === 'gurugram' && (
              <div className="cost-row highlight-row">
                <span>🏗️ EDC/IDC Charges <span className="badge-pill">Haryana: +20% from Jan 2025</span></span>
                <span>~1.5%</span>
                <span>₹{(edcHaryana/100000).toFixed(1)}L</span>
                <span>Buyer → HRERA/Developer</span>
              </div>
            )}
            <div className="cost-row total-row">
              <span><strong>💰 Total Additional Cost</strong></span><span></span>
              <span><strong>₹{(totalAdditional/100000).toFixed(1)}L</strong></span>
              <span><strong>{((totalAdditional/propertyVal)*100).toFixed(1)}% of property value</strong></span>
            </div>
          </div>

          <div className="cost-note">
            💡 <strong>Loan covers base price only.</strong> Additional costs above must be paid from your own funds. Plan accordingly.
          </div>
        </div>
      )}

      {/* SECTION 4: COMPARABLE SALES */}
      <div className="insight-full-card">
        <h3>📊 Market Comparison</h3>
        <p style={{color:'#64748b', fontSize:'13px', marginBottom:'16px'}}>Source: PropIndex Q4 2025 · Cushman & Wakefield NCR Report</p>
        <div className="compare-table">
          <div className="compare-row compare-header">
            <span>Segment</span><span>Avg PSF</span><span>Est. for ~{estimatedSqFt} sq ft</span><span>YoY Growth</span>
          </div>
          <div className="compare-row your-row">
            <span>⭐ Your Property</span>
            <span>₹{Math.round(propertyVal/estimatedSqFt).toLocaleString()}</span>
            <span>₹{propertyVal >= 10000000 ? `${(propertyVal/10000000).toFixed(2)} Cr` : `${(propertyVal/100000).toFixed(0)}L`}</span>
            <span>—</span>
          </div>
          <div className="compare-row">
            <span>📍 {zoneData.name} Average</span>
            <span>₹{zoneData.avgPrice.toLocaleString()}</span>
            <span>₹{((zoneData.avgPrice * estimatedSqFt)/100000).toFixed(0)}L</span>
            <span style={{color:'#16a34a'}}>{zoneData.growth}</span>
          </div>
          {zoneData.luxuryAvg && (
            <div className="compare-row">
              <span>🏆 Luxury Segment</span>
              <span>₹{zoneData.luxuryAvg.toLocaleString()}</span>
              <span>₹{((zoneData.luxuryAvg * estimatedSqFt)/100000).toFixed(0)}L</span>
              <span style={{color:'#16a34a'}}>Premium</span>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 5: RENTAL YIELD + CAPITAL APPRECIATION */}
      <div className="insights-grid-v2">
        <div className="insight-card-v2">
          <h3>🏠 Rental Potential</h3>
          <p style={{color:'#64748b', fontSize:'12px'}}>Source: Cushman & Wakefield Q4 2025 / Savills H1 2025</p>
          <div className="rental-data">
            <div className="rental-row">
              <span>Monthly Rental (Est.)</span>
              <strong>₹{zoneData.rentalMin?.toLocaleString() || 'N/A'} – ₹{zoneData.rentalMax?.toLocaleString() || 'N/A'}</strong>
            </div>
            <div className="rental-row">
              <span>Rental Growth YoY</span>
              <strong style={{color:'#16a34a'}}>{zoneData.rentalGrowth || '3-6%'}</strong>
            </div>
            <div className="rental-row">
              <span>Gross Rental Yield</span>
              <strong>{zoneData.rentalYield ? `${zoneData.rentalYield}%` : '2.5–3.5%'}</strong>
            </div>
          </div>
          <div className="alert-box neutral" style={{marginTop:'12px'}}>
            💡 NCR rental values improved 3-4% YoY in 2025 (Cushman & Wakefield)
          </div>
        </div>

        <div className="insight-card-v2">
          <h3>📈 Capital Appreciation Outlook</h3>
          <p style={{color:'#64748b', fontSize:'12px'}}>Source: NCR Real Estate Report 2025</p>
          <div className="rental-data">
            <div className="rental-row">
              <span>2024 Price Growth (NCR)</span><strong style={{color:'#16a34a'}}>+30% YoY</strong>
            </div>
            <div className="rental-row">
              <span>{zoneData.name} Specific</span><strong style={{color:'#16a34a'}}>{zoneData.growth}</strong>
            </div>
            <div className="rental-row">
              <span>5-Year Projection</span>
              <strong>{zoneData.temp === 'hot' ? '35-45% (High confidence)' : '20-30% (Moderate)'}</strong>
            </div>
            <div className="rental-row">
              <span>Best Time to Buy?</span>
              <strong style={{color: zoneData.temp === 'hot' ? '#d97706' : '#16a34a'}}>
                {zoneData.temp === 'hot' ? '⚠️ Market is peaking' : '✅ Good entry point'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: RISK FLAGS — RERA / LEGAL with empathy */}
      <div className="insight-full-card empathy-card">
        <div className="empathy-header">
          <span className="empathy-icon">🛡️</span>
          <div>
            <h3>Your Protection Checklist</h3>
            <p className="empathy-message">We understand this is your hard-earned money and possibly the biggest financial decision of your life. We are not here to scare you — we are here to make sure you walk in with your eyes open. Please verify these before you sign anything.</p>
          </div>
        </div>

        <div className="risk-grid">
          {isApartment && isUnderConstruction && (
            <div className="risk-item red">
              <span className="risk-icon">⚠️</span>
              <div>
                <strong>RERA Registration</strong>
                <p>Every under-construction project MUST be RERA registered. Non-registered projects offer zero legal protection.</p>
                <a className="check-link" href="https://rera.haryana.gov.in" target="_blank" rel="noopener noreferrer">
                  {layer2Data.propertyLocation === 'gurugram' ? '→ Check Haryana RERA' :
                   layer2Data.propertyLocation === 'noida' || layer2Data.propertyLocation === 'greater-noida' ? '→ Check UP RERA (uprera.in)' :
                   layer2Data.propertyLocation === 'delhi' ? '→ Check Delhi RERA (rera.delhi.gov.in)' :
                   '→ Check State RERA website'}
                </a>
              </div>
            </div>
          )}
          <div className="risk-item amber">
            <span className="risk-icon">📄</span>
            <div>
              <strong>Title Verification</strong>
              <p>Ensure the seller has clear, marketable title. For resale: verify sale chain back 30 years. For builder: verify land title & no encumbrance.</p>
              <span className="risk-note">Your bank will do this — but knowing upfront avoids last-minute surprises.</span>
            </div>
          </div>
          {isApartment && isUnderConstruction && (
            <div className="risk-item amber">
              <span className="risk-icon">📋</span>
              <div>
                <strong>Builder-Buyer Agreement</strong>
                <p>Read the BBA carefully before signing. Look for: possession date, penalty clauses, super area vs carpet area ratio, and force majeure conditions.</p>
                <span className="risk-note">Carpet area should be at least 70% of super area (RERA mandate).</span>
              </div>
            </div>
          )}
          <div className="risk-item green">
            <span className="risk-icon">✅</span>
            <div>
              <strong>Encumbrance Certificate</strong>
              <p>Confirms no existing loans or legal dues on the property. Available at Sub-Registrar office or state portal.</p>
              <span className="risk-note">This is mandatory before loan disbursal — get it early.</span>
            </div>
          </div>
          {layer2Data.propertyLocation === 'noida' || layer2Data.propertyLocation === 'greater-noida' ? (
            <div className="risk-item red">
              <span className="risk-icon">⚠️</span>
              <div>
                <strong>Noida/Greater Noida Specific Alert</strong>
                <p>Many projects launched 2005-2011 had stalled delivery (Unitech, Amrapali, Jaypee). Always verify current construction status & RERA compliance independently.</p>
                <span className="risk-note">Source: NCR Real Estate Report 2025</span>
              </div>
            </div>
          ) : null}
          {layer2Data.propertySubType === 'plot' && (
            <div className="risk-item red">
              <span className="risk-icon">🚫</span>
              <div>
                <strong>Plot/Land — Unregistered Land Risk</strong>
                <p>Verify the land is not agricultural/forest/notified land. Check: Khasra number, Khatauni, mutation records. Unregistered plots are not eligible for bank loans.</p>
                <span className="risk-note">Home loans are NOT available for plots in unapproved colonies.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="nav-buttons">
        <button className="btn-back" onClick={() => setCurrentLayer('layer2')}>← Back to Property Details</button>
        <button className="btn-next" onClick={() => setShowKycGate(true)}>
          See My Bank Matches <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

  const renderKycGate = () => {
    const handleKycSubmit = async () => {
      if (!kycData.name || !kycData.phone || !kycData.email) {
        alert('❌ Please provide your name, phone, and email to continue');
        return;
      }
      if (!kycData.agreedToTerms) {
        alert('❌ Please agree to Terms of Service to continue');
        return;
      }
      if (!kycData.consentToContact) {
        alert('❌ Please provide consent to be contacted for loan assistance');
        return;
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(kycData.email)) {
        alert('❌ Please enter a valid email address');
        return;
      }
      
      // Basic phone validation (10 digits)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(kycData.phone)) {
        alert('❌ Please enter a valid 10-digit mobile number');
        return;
      }
      
      // Generate results
      const matchResults = matchBanks();
      
      // SAVE LEAD TO SUPABASE
      try {
        const leadData = {
          // Contact Info
          email: kycData.email,
          phone: kycData.phone,
          name: kycData.name,
          consent_given: kycData.consentToContact,
          
          // Financial Profile (Layer 1)
          employment_type: layer1Data.employmentType,
          monthly_salary: parseInt(layer1Data.monthlyIncome),
          loan_amount_needed: parseInt(layer1Data.loanAmountNeeded),
          loan_tenure: parseInt(layer1Data.loanTenure),
          current_emis: parseInt(layer1Data.existingEMIs) || 0,
          cibil_range: layer1Data.cibilRange,
          customer_preference: layer1Data.customerPreference,
          
          // Property Details (Layer 2)
          city: layer2Data.propertyLocation,
          property_type: layer2Data.propertySubType,
          property_category: layer2Data.propertyCategory,
          property_value: parseInt(layer2Data.propertyValue),
          micro_market: layer2Data.microMarket || null,
          
          // Detailed Property (Path A)
          building_name: layer2Data.buildingSocietyName || null,
          builder_name: layer2Data.builderName || null,
          exact_sector: layer2Data.exactSector || null,
          bhk_config: layer2Data.bhkConfig || null,
          carpet_area: layer2Data.carpetArea ? parseInt(layer2Data.carpetArea) : null,
          property_age: layer2Data.propertyAge || null,
          
          // Match Results
          eligibility_score: matchResults.matches[0]?.matchScore || 0,
          max_loan_amount: matchResults.finalEligibleAmount,
          matched_bank: matchResults.matches[0]?.name || null,
          matched_bank_rate: matchResults.matches[0]?.rateHL || null,
          
          // System
          status: 'new',
          notes: `Top banks: ${matchResults.matches.slice(0,3).map(m => `${m.shortName}(${m.matchScore})`).join(', ')}`
        };
        
        const { data, error } = await supabase
          .from('leads')
          .insert([leadData])
          .select();
        
        if (error) {
          console.error('Supabase error:', error);
          alert('⚠️ Lead saved locally but may not sync to database. Results will still show.');
        } else {
          console.log('✅ Lead saved:', data[0].id);
        }
      } catch (err) {
        console.error('Error saving lead:', err);
      }
      
      // Show results regardless of database status
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
            <div className="kyc-input-group">
              <label>👤 Full Name</label>
              <input
                type="text"
                placeholder="As per PAN card"
                value={kycData.name}
                onChange={(e) => setKycData({...kycData, name: e.target.value})}
              />
            </div>
            
            <div className="kyc-input-group">
              <label>📱 Mobile Number</label>
              <input
                type="tel"
                placeholder="10-digit mobile"
                maxLength="10"
                value={kycData.phone}
                onChange={(e) => setKycData({...kycData, phone: e.target.value})}
              />
            </div>
            
            <div className="kyc-input-group">
              <label>📧 Email Address</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={kycData.email}
                onChange={(e) => setKycData({...kycData, email: e.target.value})}
              />
            </div>
            
            <div className="kyc-terms">
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  checked={kycData.agreedToTerms}
                  onChange={(e) => setKycData({...kycData, agreedToTerms: e.target.checked})}
                />
                <span>
                  I agree to <a href="#" onClick={(e) => { e.preventDefault(); alert('Terms: Data used only for loan matching. Not shared with third parties without consent.'); }}>Terms of Service</a> and acknowledge this is for informational purposes only (not financial advice)
                </span>
              </label>
              
              <label className="terms-checkbox" style={{marginTop:'12px'}}>
                <input
                  type="checkbox"
                  checked={kycData.consentToContact}
                  onChange={(e) => setKycData({...kycData, consentToContact: e.target.checked})}
                />
                <span>
                  <strong>I hereby consent to be contacted by PrimePath Mortgages</strong> via phone/email/WhatsApp for loan assistance, document collection, and bank coordination
                </span>
              </label>
            </div>
            
            <div className="kyc-actions">
              <button className="btn-back" onClick={() => setShowKycGate(false)}>← Back</button>
              <button className="btn-kyc-submit" onClick={handleKycSubmit}>
                Show My Matches 🎯
              </button>
            </div>
          </div>
          
          <div className="kyc-disclaimer">
            <p>🔒 <strong>Your data is safe.</strong> We use bank-grade encryption. Your information is used solely for loan matching and will never be sold to third parties without your explicit consent.</p>
            <p>⚖️ <strong>Not financial advice.</strong> This tool provides indicative eligibility based on standard bank policies. Final approval depends on bank's discretion, document verification, and credit assessment.</p>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!results) return null;

    const { customerCapacity, propertyCeiling, finalEligibleAmount, limitingFactor, matches } = results;

    // Group by category
    const govt = matches.filter(m => m.category === 'Government');
    const pvt = matches.filter(m => m.category === 'Private');
    const mnc = matches.filter(m => m.category === 'Multinational');

    return (
      <div className="results-container">
        <div className="results-header">
          <h1>Your Loan Assessment Results</h1>
          <p>Based on your profile and property value</p>
        </div>

        {/* Rate Freshness Disclaimer */}
        <div className="rate-disclaimer">
          ⓘ <strong>Interest rates as of February 2026.</strong> Bank rates change monthly. Always verify current rates on the bank's official website before applying. Processing times and fees are indicative — actual may vary by case complexity.
        </div>

        {/* Key Finding */}
        <div className="key-finding-card">
          <h2>Your Maximum Loan Amount</h2>
          <div className="final-amount">₹{(finalEligibleAmount / 100000).toFixed(1)}L</div>
          
          <div className="comparison-grid">
            <div className="comparison-item">
              <span className="label">Your Capacity (A)</span>
              <span className="value">₹{(customerCapacity / 100000).toFixed(1)}L</span>
              <span className="sublabel">Based on income & DBR</span>
            </div>
            <div className="vs">vs</div>
            <div className="comparison-item">
              <span className="label">Property Ceiling (B)</span>
              <span className="value">₹{(propertyCeiling / 100000).toFixed(1)}L</span>
              <span className="sublabel">Based on {layer2Data.loanType === 'HL' ? '80%' : '70%'} LTV</span>
            </div>
          </div>

          <div className={`limiting-factor ${limitingFactor}`}>
            <strong>Limiting Factor:</strong> {limitingFactor === 'income' ? 'Your Income Capacity' : 'Property Value'}
            {limitingFactor === 'income' && (
              <p>💡 Even though property supports higher loan, your income limits maximum EMI you can afford</p>
            )}
            {limitingFactor === 'property' && (
              <p>💡 Even though you can afford higher EMI, banks only lend up to {layer2Data.loanType === 'HL' ? '80%' : '70%'} of property value</p>
            )}
          </div>
        </div>

        {/* Bank Matches by Category */}
        <div className="bank-categories">
          <h2>Bank Matches</h2>
          
          {/* Government Banks */}
          {govt.length > 0 && (
            <div className="category-section">
              <h3 className="category-title govt">🏛️ Government Banks</h3>
              <div className="banks-grid">
                {govt.map((match, idx) => (
                  <div key={idx} className="bank-card">
                    <div className="bank-header">
                      <div>
                        <h4>{match.shortName}</h4>
                        <p className="bank-full">{match.bank}</p>
                      </div>
                      <div className="score-circle">
                        <svg viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                          <circle 
                            cx="50" cy="50" r="40" fill="none" 
                            stroke={match.approvalProbability >= 70 ? '#10b981' : match.approvalProbability >= 50 ? '#f59e0b' : '#ef4444'}
                            strokeWidth="8"
                            strokeDasharray={`${match.approvalProbability * 2.51} 251`}
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <span className="score-num">{match.approvalProbability}%</span>
                      </div>
                    </div>

                    {match.disqualifiers.length > 0 && (
                      <div className="disqualifiers">
                        {match.disqualifiers.map((d, i) => <div key={i}>⚠️ {d}</div>)}
                      </div>
                    )}

                    <div className="loan-details">
                      <div className="detail-row">
                        <span>Loan Amount</span>
                        <strong>₹{(match.loanAmount / 100000).toFixed(1)}L</strong>
                      </div>
                      <div className="detail-row">
                        <span>Monthly EMI</span>
                        <strong>₹{(match.emi / 1000).toFixed(1)}K</strong>
                      </div>
                      <div className="detail-row">
                        <span>Interest Rate</span>
                        <strong>{match.interestRate}%</strong>
                      </div>
                      <div className="detail-row">
                        <span>Upfront Costs</span>
                        <strong style={{fontSize:"12px", color:"#64748b"}}>{match.totalUpfront}</strong>
                      </div>
                    </div>

                    <div className="strengths">
                      <strong>Why {match.shortName}?</strong>
                      <ul>
                        {match.reasons.slice(0, 2).map((r, i) => <li key={i}>{r}</li>)}
                        {match.strengths.slice(0, 2).map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Private Banks */}
          {pvt.length > 0 && (
            <div className="category-section">
              <h3 className="category-title pvt">🏢 Private Banks</h3>
              <div className="banks-grid">
                {pvt.map((match, idx) => (
                  <div key={idx} className="bank-card">
                    <div className="bank-header">
                      <div>
                        <h4>{match.shortName}</h4>
                        <p className="bank-full">{match.bank}</p>
                      </div>
                      <div className="score-circle">
                        <svg viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                          <circle 
                            cx="50" cy="50" r="40" fill="none" 
                            stroke={match.approvalProbability >= 70 ? '#10b981' : match.approvalProbability >= 50 ? '#f59e0b' : '#ef4444'}
                            strokeWidth="8"
                            strokeDasharray={`${match.approvalProbability * 2.51} 251`}
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <span className="score-num">{match.approvalProbability}%</span>
                      </div>
                    </div>

                    {match.disqualifiers.length > 0 && (
                      <div className="disqualifiers">
                        {match.disqualifiers.map((d, i) => <div key={i}>⚠️ {d}</div>)}
                      </div>
                    )}

                    <div className="loan-details">
                      <div className="detail-row">
                        <span>Loan Amount</span>
                        <strong>₹{(match.loanAmount / 100000).toFixed(1)}L</strong>
                      </div>
                      <div className="detail-row">
                        <span>Monthly EMI</span>
                        <strong>₹{(match.emi / 1000).toFixed(1)}K</strong>
                      </div>
                      <div className="detail-row">
                        <span>Interest Rate</span>
                        <strong>{match.interestRate}%</strong>
                      </div>
                      <div className="detail-row">
                        <span>Upfront Costs</span>
                        <strong style={{fontSize:"12px", color:"#64748b"}}>{match.totalUpfront}</strong>
                      </div>
                    </div>

                    <div className="strengths">
                      <strong>Why {match.shortName}?</strong>
                      <ul>
                        {match.reasons.slice(0, 2).map((r, i) => <li key={i}>{r}</li>)}
                        {match.strengths.slice(0, 2).map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MNC Banks */}
          {mnc.length > 0 && (
            <div className="category-section">
              <h3 className="category-title mnc">🌍 Multinational Banks</h3>
              <div className="banks-grid">
                {mnc.map((match, idx) => (
                  <div key={idx} className="bank-card">
                    <div className="bank-header">
                      <div>
                        <h4>{match.shortName}</h4>
                        <p className="bank-full">{match.bank}</p>
                      </div>
                      <div className="score-circle">
                        <svg viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                          <circle 
                            cx="50" cy="50" r="40" fill="none" 
                            stroke={match.approvalProbability >= 70 ? '#10b981' : match.approvalProbability >= 50 ? '#f59e0b' : '#ef4444'}
                            strokeWidth="8"
                            strokeDasharray={`${match.approvalProbability * 2.51} 251`}
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <span className="score-num">{match.approvalProbability}%</span>
                      </div>
                    </div>

                    {match.disqualifiers.length > 0 && (
                      <div className="disqualifiers">
                        {match.disqualifiers.map((d, i) => <div key={i}>⚠️ {d}</div>)}
                      </div>
                    )}

                    <div className="loan-details">
                      <div className="detail-row">
                        <span>Loan Amount</span>
                        <strong>₹{(match.loanAmount / 100000).toFixed(1)}L</strong>
                      </div>
                      <div className="detail-row">
                        <span>Monthly EMI</span>
                        <strong>₹{(match.emi / 1000).toFixed(1)}K</strong>
                      </div>
                      <div className="detail-row">
                        <span>Interest Rate</span>
                        <strong>{match.interestRate}%</strong>
                      </div>
                      <div className="detail-row">
                        <span>Upfront Costs</span>
                        <strong style={{fontSize:"12px", color:"#64748b"}}>{match.totalUpfront}</strong>
                      </div>
                    </div>

                    <div className="strengths">
                      <strong>Why {match.shortName}?</strong>
                      <ul>
                        {match.reasons.slice(0, 2).map((r, i) => <li key={i}>{r}</li>)}
                        {match.strengths.slice(0, 2).map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AMORTIZATION CHART */}
        {results && results.finalEligibleAmount > 0 && (() => {
          const bestMatch = results.matches[0];
          const rate = bestMatch ? bestMatch.interestRate : 8.5;
          const tenure = parseInt(layer1Data.loanTenure || 20);
          const principal = results.finalEligibleAmount;
          const monthlyRate = rate / 12 / 100;
          const tenureMonths = tenure * 12;
          const emi = principal * (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);

          // Build yearly amortization data
          let balance = principal;
          const yearlyData = [];
          for (let year = 1; year <= tenure; year++) {
            let yearPrincipal = 0, yearInterest = 0;
            for (let m = 0; m < 12; m++) {
              const interest = balance * monthlyRate;
              const princ = emi - interest;
              yearInterest += interest;
              yearPrincipal += princ;
              balance -= princ;
            }
            yearlyData.push({ year, principal: Math.round(yearPrincipal), interest: Math.round(yearInterest), balance: Math.max(0, Math.round(balance)) });
          }
          const totalInterest = yearlyData.reduce((s, d) => s + d.interest, 0);
          const totalPayment = principal + totalInterest;
          const maxBar = Math.max(...yearlyData.map(d => d.principal + d.interest));

          return (
            <div className="amort-section">
              <h2>📊 Free Amortization Schedule</h2>
              <p className="amort-subtitle">Based on {rate}% p.a. over {tenure} years (using {bestMatch?.shortName || 'best matched'} rate)</p>

              <div className="amort-summary">
                <div className="amort-stat">
                  <span>Loan Amount</span>
                  <strong>₹{(principal/100000).toFixed(1)}L</strong>
                </div>
                <div className="amort-stat">
                  <span>Monthly EMI</span>
                  <strong>₹{Math.round(emi).toLocaleString()}</strong>
                </div>
                <div className="amort-stat">
                  <span>Total Interest</span>
                  <strong style={{color:'#ef4444'}}>₹{(totalInterest/100000).toFixed(1)}L</strong>
                </div>
                <div className="amort-stat">
                  <span>Total Payment</span>
                  <strong>₹{(totalPayment/100000).toFixed(1)}L</strong>
                </div>
              </div>

              <div className="amort-chart">
                <div className="chart-labels">
                  <span className="label-principal">■ Principal</span>
                  <span className="label-interest">■ Interest</span>
                </div>
                <div className="chart-bars">
                  {yearlyData.filter((_, i) => i % Math.ceil(tenure/15) === 0 || i === tenure - 1).map(d => (
                    <div key={d.year} className="bar-group">
                      <div className="bar-stack">
                        <div className="bar-interest" style={{height: `${(d.interest/maxBar)*140}px`}} title={`Interest: ₹${(d.interest/1000).toFixed(0)}K`}></div>
                        <div className="bar-principal" style={{height: `${(d.principal/maxBar)*140}px`}} title={`Principal: ₹${(d.principal/1000).toFixed(0)}K`}></div>
                      </div>
                      <span className="bar-year">Yr{d.year}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="amort-insight">
                💡 <strong>Key Insight:</strong> In the first 5 years, ~{Math.round((yearlyData.slice(0,5).reduce((s,d)=>s+d.interest,0) / yearlyData.slice(0,5).reduce((s,d)=>s+d.principal+d.interest,0))*100)}% of your EMI goes to interest. <strong>Prepaying early saves the most!</strong>
              </div>

              <details className="amort-table-details">
                <summary>View Full Year-by-Year Schedule</summary>
                <div className="amort-table-wrap">
                  <table className="amort-table">
                    <thead>
                      <tr><th>Year</th><th>Principal Paid</th><th>Interest Paid</th><th>Balance</th></tr>
                    </thead>
                    <tbody>
                      {yearlyData.map(d => (
                        <tr key={d.year}>
                          <td>{d.year}</td>
                          <td>₹{(d.principal/1000).toFixed(1)}K</td>
                          <td>₹{(d.interest/1000).toFixed(1)}K</td>
                          <td>₹{(d.balance/100000).toFixed(2)}L</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>
          );
        })()}

        {/* RBI GUIDELINES EDUCATION */}
        <div className="rbi-section">
          <h2>📜 Know Your Rights — RBI Guidelines</h2>
          <p className="rbi-subtitle">What every home buyer must know before signing</p>

          <div className="rbi-grid">
            <div className="rbi-card">
              <div className="rbi-icon">🔒</div>
              <h4>LTV Ratios (Your Protection)</h4>
              <p>RBI mandates banks cannot lend beyond:</p>
              <ul className="rbi-list">
                <li><strong>Up to ₹30L property:</strong> Max 90% LTV</li>
                <li><strong>₹30L–₹75L property:</strong> Max 80% LTV</li>
                <li><strong>Above ₹75L property:</strong> Max 75% LTV</li>
                <li><strong>LAP:</strong> Max 60-70% LTV</li>
              </ul>
              <span className="rbi-note">This protects you from over-borrowing</span>
            </div>

            <div className="rbi-card">
              <div className="rbi-icon">💳</div>
              <h4>Key Fact Statement (KFS)</h4>
              <p>RBI mandates ALL banks must provide you a KFS before loan disbursal showing:</p>
              <ul className="rbi-list">
                <li>✓ Annual Percentage Rate (APR)</li>
                <li>✓ All fees & charges upfront</li>
                <li>✓ Total cost of the loan</li>
                <li>✓ No hidden surprises</li>
              </ul>
              <span className="rbi-note">Demand this document — it's your RIGHT</span>
            </div>

            <div className="rbi-card">
              <div className="rbi-icon">💰</div>
              <h4>Prepayment Rules</h4>
              <p>As per RBI Fair Practice Code:</p>
              <ul className="rbi-list">
                <li>✓ <strong>Floating rate loans:</strong> Zero prepayment penalty (RBI circular)</li>
                <li>✓ Fixed rate loans: Max 2% penalty</li>
                <li>✓ Banks CANNOT refuse part-prepayment</li>
                <li>✓ You can switch bank (balance transfer) anytime</li>
              </ul>
              <span className="rbi-note">Pay extra EMIs whenever you can — saves lakhs!</span>
            </div>

            <div className="rbi-card">
              <div className="rbi-icon">📊</div>
              <h4>Interest Rate Transparency</h4>
              <p>What banks must tell you:</p>
              <ul className="rbi-list">
                <li>✓ Whether rate is MCLR/RLLR-linked or fixed</li>
                <li>✓ Reset frequency (quarterly/annually)</li>
                <li>✓ Spread over benchmark rate</li>
                <li>✓ When RBI cuts rates, your EMI should reduce</li>
              </ul>
              <span className="rbi-note">Ask: "Is this floating or fixed?" before signing</span>
            </div>

            <div className="rbi-card">
              <div className="rbi-icon">⚖️</div>
              <h4>Fair Practice Code</h4>
              <p>RBI mandates banks MUST:</p>
              <ul className="rbi-list">
                <li>✓ Give you a written rejection reason</li>
                <li>✓ Not charge penal interest without policy</li>
                <li>✓ Provide a loan account statement anytime</li>
                <li>✓ Return original documents within 30 days of closure</li>
              </ul>
              <span className="rbi-note">If violated, complain at RBI Ombudsman</span>
            </div>

            <div className="rbi-card">
              <div className="rbi-icon">🏗️</div>
              <h4>Property & Legal Safeguards</h4>
              <p>RBI directs banks to ensure:</p>
              <ul className="rbi-list">
                <li>✓ Loan only for RERA-approved projects</li>
                <li>✓ Sanctioned plan copy mandatory</li>
                <li>✓ No loan for unauthorized constructions</li>
                <li>✓ Architect must certify construction stages</li>
              </ul>
              <span className="rbi-note">Always ask for RERA registration number</span>
            </div>
          </div>

          <div className="rbi-footer">
            <p>📌 Source: RBI Master Circular on Finance for Housing Schemes</p>
            <p>For grievances: <strong>RBI Banking Ombudsman — bankingombudsman.rbi.org.in</strong></p>
          </div>
        </div>

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
    {currentLayer === 'intro' && renderIntro()}
    {currentLayer === 'layer1' && renderLayer1()}
    {currentLayer === 'layer2' && renderLayer2()}
    {currentLayer === 'propertyInsights' && renderPropertyInsights()}
    {currentLayer === 'results' && renderResults()}
  </div>
  );
};

export default PrimePathMortgages;
