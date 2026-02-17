import React, { useState } from 'react';
import { Home, Briefcase, Calculator, FileText, TrendingUp, Info, CheckCircle, ArrowRight, Building2, DollarSign } from 'lucide-react';

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
    maxDBR: 0.50,
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
    maxDBR: 0.50,
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
    maxDBR: 0.45,
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
    maxDBR: 0.45,
    processingFee: 0.50,
    rateHL: 8.90,
    rateLAP: 9.65,
    strengths: ["Personalized banking", "Premium customers", "Fast processing"]
  }
};
// NCR MICRO-MARKET DATA (From PropIndex Q4 2025)
const NCR_MICROMARKETS = {
  gurugram: [
    { id: 'new-gurugram', name: 'New Gurugram', sectors: 'Sectors 70-115', avgPrice: 10350, growth: '+34% YoY', temp: 'hot' },
    { id: 'dwarka-exp', name: 'Dwarka Expressway', sectors: 'Sectors 99-113', avgPrice: 11000, growth: '+100% since 2019', temp: 'hot' },
    { id: 'golf-ext', name: 'Golf Course Extension', sectors: 'Sectors 58-68', avgPrice: 19500, growth: '+21% YoY', temp: 'warm' },
    { id: 'sohna-road', name: 'Sohna Road', sectors: 'Sectors 47-49, 88', avgPrice: 17400, growth: '+30% YoY', temp: 'hot' },
    { id: 'old-gurugram', name: 'Old Gurugram / DLF Phases', sectors: 'DLF Phase 1-4, Sushant Lok', avgPrice: 19000, growth: '+9% YoY', temp: 'warm' },
    { id: 'sohna', name: 'Sohna (South Gurugram)', sectors: 'Sohna town & vicinity', avgPrice: 6000, growth: '+193% launches', temp: 'hot' }
  ],
  noida: [
    { id: 'central-noida', name: 'Central Noida', sectors: 'Sectors 15-50', avgPrice: 16000, growth: '+9% YoY', temp: 'warm' },
    { id: 'noida-sectors-51-100', name: 'Mid Noida', sectors: 'Sectors 51-100', avgPrice: 14000, growth: '+10% YoY', temp: 'warm' },
    { id: 'noida-exp', name: 'Noida Expressway', sectors: 'Sectors 74-137', avgPrice: 13400, growth: '+10% YoY', temp: 'warm' },
    { id: 'sector-150', name: 'Sector 150 Zone', sectors: 'Sectors 100-149', avgPrice: 10000, growth: '+15% YoY', temp: 'hot' },
    { id: 'new-noida', name: 'New Noida / South', sectors: 'Sectors 150-168', avgPrice: 8450, growth: '+24% YoY', temp: 'hot' },
    { id: 'gr-noida-west', name: 'Greater Noida West', sectors: 'Tech Zone IV, KP V', avgPrice: 8450, growth: '+150% launches', temp: 'hot' }
  ],
  'greater-noida': [
    { id: 'gnw-main', name: 'Greater Noida West', sectors: 'Tech Zone IV, Knowledge Park', avgPrice: 8450, growth: '+24% YoY', temp: 'hot' },
    { id: 'yamuna-exp', name: 'Yamuna Expressway', sectors: 'Sectors near Jewar Airport', avgPrice: 4500, growth: 'Airport impact zone', temp: 'hot' },
    { id: 'gnida-sectors', name: 'Greater Noida Central', sectors: 'Alpha, Beta, Gamma sectors', avgPrice: 7000, growth: '+8% YoY', temp: 'warm' }
  ],
  delhi: [
    { id: 'south-delhi', name: 'South Delhi', sectors: 'Saket, GK 1&2, Defence Colony, Lajpat Nagar', avgPrice: 22000, growth: '+8% YoY', temp: 'warm' },
    { id: 'west-delhi', name: 'West Delhi', sectors: 'Dwarka, Janakpuri, Rajouri Garden, Uttam Nagar', avgPrice: 14800, growth: '+11% YoY', temp: 'warm' },
    { id: 'north-delhi', name: 'North Delhi', sectors: 'Rohini, Pitampura, Model Town, Shakurpur', avgPrice: 13500, growth: '+10% YoY', temp: 'warm' },
    { id: 'east-delhi', name: 'East Delhi', sectors: 'Laxmi Nagar, Mayur Vihar, Preet Vihar, IP Ext', avgPrice: 12000, growth: '+9% YoY', temp: 'warm' },
    { id: 'north-west-delhi', name: 'North-West Delhi', sectors: 'Paschim Vihar, Shalimar Bagh, Ashok Vihar', avgPrice: 15000, growth: '+9% YoY', temp: 'warm' },
    { id: 'central-delhi', name: 'Central Delhi', sectors: 'Karol Bagh, Paharganj, Civil Lines', avgPrice: 18000, growth: '+7% YoY', temp: 'warm' }
  ],
  ghaziabad: [
    { id: 'indirapuram', name: 'Indirapuram', sectors: 'Shakti Khand, Niti Khand, Ahinsa Khand', avgPrice: 7500, growth: '+8% YoY', temp: 'warm' },
    { id: 'vaishali', name: 'Vaishali / Vasundhara', sectors: 'Sectors 1-6', avgPrice: 6800, growth: '+9% YoY', temp: 'warm' },
    { id: 'raj-nagar-ext', name: 'Raj Nagar Extension', sectors: 'NH-58 corridor', avgPrice: 4500, growth: '+12% YoY', temp: 'hot' },
    { id: 'crossings-rep', name: 'Crossings Republik', sectors: 'NH-24 Belt', avgPrice: 5500, growth: '+14% YoY', temp: 'hot' },
    { id: 'siddharth-vihar', name: 'Siddharth Vihar / Tronica City', sectors: 'Upcoming zone', avgPrice: 4000, growth: '+18% YoY', temp: 'hot' }
  ],
  faridabad: [
    { id: 'nhpc-nit', name: 'NIT / NHPC Area', sectors: 'Central Faridabad', avgPrice: 6800, growth: '+7% YoY', temp: 'warm' },
    { id: 'sector-15-21', name: 'Sectors 15-21', sectors: 'Old Faridabad', avgPrice: 7200, growth: '+6% YoY', temp: 'warm' },
    { id: 'greater-faridabad', name: 'Greater Faridabad', sectors: 'Sectors 75-89', avgPrice: 5500, growth: '+10% YoY', temp: 'warm' },
    { id: 'neharpar', name: 'Neharpar / Greenfield', sectors: 'Sectors 88-96, Faridabad-Gurgaon Road', avgPrice: 4500, growth: '+12% YoY', temp: 'hot' }
  ]
};

const PrimePathMortgages = () => {
  const [currentLayer, setCurrentLayer] = useState('intro'); // intro, layer1, layer2, results
  const [layer1Data, setLayer1Data] = useState({
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
    propertyCategory: '', // For HL: builder-new, resale. For LAP: residential, commercial
    decidingDocument: '', // agreement-to-sell, booking-form, property-papers
    propertyValue: '', // from deciding document
    propertyLocation: '',
    microMarket: '' // NEW - Specific area/zone
});

  const [results, setResults] = useState(null);

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
    const requiredLayer1 = ['customerPreference', 'loanAmountNeeded', 'monthlyIncome', 'loanTenure', 'existingEMIs', 'borrowerType', 'missedPayments12m', 'missedPayments5y', 'cibilRange'];
    const allFilled = requiredLayer1.every(f => layer1Data[f] !== '');
    if (!allFilled) {
      alert('Please fill all fields to continue');
      return;
    }
    setCurrentLayer('layer2');
  };

const handleLayer2Submit = () => {
  // Check required fields (microMarket is optional)
  const requiredFields = ['loanType', 'propertyCategory', 'decidingDocument', 'propertyValue', 'propertyLocation'];
  const allRequiredFilled = requiredFields.every(field => layer2Data[field] !== '');
  
  if (!allRequiredFilled) {
    alert('Please fill all required fields');
    return;
  }  
  // Go to property insights first (if micro-market selected)
  if (layer2Data.microMarket) {
    setCurrentLayer('propertyInsights');
  } else {
    // Skip insights if no micro-market
    const results = matchBanks();
    setResults(results);
    setCurrentLayer('results');
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

        {/* CUSTOMER PREFERENCE - First question */}
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
              value={layer1Data.loanAmountNeeded}
              onChange={(e) => setLayer1Data({...layer1Data, loanAmountNeeded: e.target.value})}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Monthly Net Salary (In-hand)</label>
          <div className="currency-input">
            <span className="currency">₹</span>
            <input
              type="number"
              placeholder="80,000"
              value={layer1Data.monthlyIncome}
              onChange={(e) => setLayer1Data({...layer1Data, monthlyIncome: e.target.value})}
            />
          </div>
          <span className="hint">After all deductions (PF, tax, etc.)</span>
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
              value={layer1Data.existingEMIs}
              onChange={(e) => setLayer1Data({...layer1Data, existingEMIs: e.target.value})}
            />
          </div>
          <span className="hint">Car loan, personal loan, credit cards - all combined</span>
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
              value={layer2Data.propertyValue}
              onChange={(e) => setLayer2Data({...layer2Data, propertyValue: e.target.value})}
            />
          </div>
          <span className="hint">Enter the exact amount mentioned in the document</span>
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
    // Skip if no micro-market selected
    setCurrentLayer('results');
    return null;
  }

  // Get market data
  const cityData = NCR_MICROMARKETS[layer2Data.propertyLocation];
  const zoneData = cityData?.find(z => z.id === layer2Data.microMarket);
  
  if (!zoneData) {
    setCurrentLayer('results');
    return null;
  }

  // Calculate property metrics
  const propertyVal = parseInt(layer2Data.propertyValue);
  const estimatedSqFt = propertyVal / zoneData.avgPrice;
  const priceDiff = ((propertyVal / estimatedSqFt) - zoneData.avgPrice) / zoneData.avgPrice * 100;
  const isGoodDeal = priceDiff < -10;
  const isExpensive = priceDiff > 10;

  return (
    <div className="layer-container" style={{ maxWidth: '900px' }}>
      <div className="layer-header">
        <div className="layer-badge">Property Intelligence</div>
        <h2>📍 Market Insights: {zoneData.name}</h2>
        <p>Real data from PropIndex Q4 2025</p>
      </div>

      <div className="insights-grid">
        {/* Price Comparison */}
        <div className="insight-card price-card">
          <h3>💰 Price Analysis</h3>
          <div className="price-comparison">
            <div className="price-row">
              <span>Your Property Value:</span>
              <strong>₹{(propertyVal / 100000).toFixed(1)}L</strong>
            </div>
            <div className="price-row">
              <span>Area Average:</span>
              <strong>₹{zoneData.avgPrice.toLocaleString()}/sq ft</strong>
            </div>
            <div className="price-row">
              <span>Estimated Size:</span>
              <strong>~{Math.round(estimatedSqFt)} sq ft</strong>
            </div>
          </div>
          
          {isGoodDeal && (
            <div className="alert-box good-deal">
              ✅ <strong>Good Deal!</strong> Your price is {Math.abs(priceDiff).toFixed(0)}% below market average
            </div>
          )}
          {isExpensive && (
            <div className="alert-box verify-alert">
              ⚠️ <strong>Above Market:</strong> {priceDiff.toFixed(0)}% higher than average. Verify builder reputation & amenities.
            </div>
          )}
          {!isGoodDeal && !isExpensive && (
            <div className="alert-box neutral">
              ✓ <strong>Fair Price:</strong> Within {Math.abs(priceDiff).toFixed(0)}% of market average
            </div>
          )}
        </div>

        {/* Market Temperature */}
        <div className="insight-card temp-card">
          <h3>🌡️ Investment Temperature</h3>
          <div className={`temp-badge ${zoneData.temp}`}>
            {zoneData.temp === 'hot' && '🔥 HOT ZONE'}
            {zoneData.temp === 'warm' && '📈 WARM'}
            {zoneData.temp === 'cool' && '📊 STABLE'}
          </div>
          <div className="temp-details">
            <div className="temp-row">
              <span>Price Growth:</span>
              <strong>{zoneData.growth}</strong>
            </div>
            <div className="temp-row">
              <span>Coverage:</span>
              <strong>{zoneData.sectors}</strong>
            </div>
          </div>
          
          {zoneData.temp === 'hot' && (
            <p className="temp-note">
              High developer activity & strong price appreciation. Good for investment.
            </p>
          )}
        </div>

        {/* Location Highlights */}
        <div className="insight-card location-card">
          <h3>📍 Area Highlights</h3>
          <ul className="highlights-list">
            {layer2Data.propertyLocation === 'gurugram' && layer2Data.microMarket === 'dwarka-exp' && (
              <>
                <li>✓ Operational Dwarka Expressway (2024)</li>
                <li>✓ 15 min to IGI Airport</li>
                <li>✓ Proposed Metro connectivity</li>
                <li>✓ 89% ultra-luxury launches</li>
              </>
            )}
            {layer2Data.propertyLocation === 'gurugram' && layer2Data.microMarket === 'new-gurugram' && (
              <>
                <li>✓ Cyber City 3.0 development nearby</li>
                <li>✓ Proposed Metro Phase 5</li>
                <li>✓ Strong employment hub</li>
                <li>✓ 11,300 units launched in 2024</li>
              </>
            )}
            {layer2Data.propertyLocation === 'noida' && layer2Data.microMarket === 'sector-150' && (
              <>
                <li>✓ Well-planned green layout</li>
                <li>✓ Metro connectivity</li>
                <li>✓ Close to Film City</li>
                <li>✓ 24% YoY price growth</li>
              </>
            )}
            {layer2Data.propertyLocation === 'greater-noida' && layer2Data.microMarket === 'yamuna-exp' && (
              <>
                <li>✓ Near Noida International Airport (Jewar)</li>
                <li>✓ Airport operational by 2026</li>
                <li>✓ Most affordable NCR zone</li>
                <li>✓ High growth potential</li>
              </>
            )}
            {/* Default if no specific highlights */}
            {(!layer2Data.microMarket || 
              (layer2Data.propertyLocation === 'gurugram' && !['dwarka-exp', 'new-gurugram'].includes(layer2Data.microMarket)) &&
              (layer2Data.propertyLocation === 'noida' && layer2Data.microMarket !== 'sector-150') &&
              (layer2Data.propertyLocation === 'greater-noida' && layer2Data.microMarket !== 'yamuna-exp')
            ) && (
              <>
                <li>✓ Established residential area</li>
                <li>✓ Good social infrastructure</li>
                <li>✓ Active property market</li>
                <li>✓ Steady appreciation trend</li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="nav-buttons">
        <button className="btn-back" onClick={() => setCurrentLayer('layer2')}>
          ← Back to Property Details
        </button>
        <button className="btn-next" onClick={() => {
          const results = matchBanks();
          setResults(results);
          setCurrentLayer('results');
        }}>
          See My Bank Matches <ArrowRight size={20} />
        </button>
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
    {currentLayer === 'intro' && renderIntro()}
    {currentLayer === 'layer1' && renderLayer1()}
    {currentLayer === 'layer2' && renderLayer2()}
    {currentLayer === 'propertyInsights' && renderPropertyInsights()}
    {currentLayer === 'results' && renderResults()}
  </div>
  );
};

export default PrimePathMortgages;
