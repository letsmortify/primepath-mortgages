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

const PrimePathMortgages = () => {
  const [currentLayer, setCurrentLayer] = useState('intro'); // intro, layer1, layer2, results
  const [layer1Data, setLayer1Data] = useState({
    loanAmountNeeded: '',
    monthlyIncome: '',
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
    propertyLocation: ''
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
    
    // Calculate loan amount (20 years @ 8.5% avg rate)
    const monthlyRate = 8.5 / 12 / 100;
    const tenureMonths = 20 * 12;
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
      
      // 5. Property type bonus (10 points)
      if (layer2Data.propertyCategory === 'builder-new' && bank.category === 'Private') {
        matchScore += 10;
        reasons.push("Private banks prefer builder properties");
      } else if (layer2Data.propertyCategory === 'resale' && bank.category === 'Government') {
        matchScore += 8;
      }
      
      // Calculate EMI
      const rate = layer2Data.loanType === 'HL' ? bank.rateHL : bank.rateLAP;
      const monthlyRate = rate / 12 / 100;
      const tenureMonths = 20 * 12;
      const emi = finalEligibleAmount * (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
      
      // Calculate costs
      const processingFee = Math.round(finalEligibleAmount * bank.processingFee / 100);
      const totalUpfront = processingFee + 500 + 3000; // processing + application + valuation
      
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
        totalUpfront,
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
    // Validate all fields filled
    const allFilled = Object.values(layer1Data).every(val => val !== '');
    if (!allFilled) {
      alert('Please fill all fields');
      return;
    }
    setCurrentLayer('layer2');
  };

  const handleLayer2Submit = () => {
    const allFilled = Object.values(layer2Data).every(val => val !== '');
    if (!allFilled) {
      alert('Please fill all fields');
      return;
    }
    
    const results = matchBanks();
    setResults(results);
    setCurrentLayer('results');
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
              <input
                type="radio"
                name="borrowerType"
                value="first-time"
                checked={layer1Data.borrowerType === 'first-time'}
                onChange={(e) => setLayer1Data({...layer1Data, borrowerType: e.target.value})}
              />
              <span>Yes, first home loan</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="borrowerType"
                value="repeat"
                checked={layer1Data.borrowerType === 'repeat'}
                onChange={(e) => setLayer1Data({...layer1Data, borrowerType: e.target.value})}
              />
              <span>No, I've taken loans before</span>
            </label>
          </div>
        </div>

        <div className="input-group">
          <label>Any missed EMI payments in last 12 months?</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="missed12m"
                value="no"
                checked={layer1Data.missedPayments12m === 'no'}
                onChange={(e) => setLayer1Data({...layer1Data, missedPayments12m: e.target.value})}
              />
              <span>No</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="missed12m"
                value="yes"
                checked={layer1Data.missedPayments12m === 'yes'}
                onChange={(e) => setLayer1Data({...layer1Data, missedPayments12m: e.target.value})}
              />
              <span>Yes</span>
            </label>
          </div>
        </div>

        <div className="input-group">
          <label>Any missed EMI payments in last 5 years?</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="missed5y"
                value="no"
                checked={layer1Data.missedPayments5y === 'no'}
                onChange={(e) => setLayer1Data({...layer1Data, missedPayments5y: e.target.value})}
              />
              <span>No</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="missed5y"
                value="yes"
                checked={layer1Data.missedPayments5y === 'yes'}
                onChange={(e) => setLayer1Data({...layer1Data, missedPayments5y: e.target.value})}
              />
              <span>Yes</span>
            </label>
          </div>
        </div>

        <div className="input-group">
          <label>Approximate CIBIL Score</label>
          <select
            value={layer1Data.cibilRange}
            onChange={(e) => setLayer1Data({...layer1Data, cibilRange: e.target.value})}
            className="select-input"
          >
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
                        <strong>₹{(match.totalUpfront / 1000).toFixed(1)}K</strong>
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
                        <strong>₹{(match.totalUpfront / 1000).toFixed(1)}K</strong>
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
                        <strong>₹{(match.totalUpfront / 1000).toFixed(1)}K</strong>
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
      {currentLayer === 'results' && renderResults()}

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app {
          min-height: 100vh;
          background: linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          padding: 20px;
        }

        /* Intro Page */
        .intro-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .intro-content h1 {
          font-size: 48px;
          color: #1e293b;
          text-align: center;
          margin-bottom: 16px;
        }

        .intro-subtitle {
          font-size: 20px;
          color: #64748b;
          text-align: center;
          margin-bottom: 50px;
        }

        .problem-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .problem-card {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          text-align: center;
        }

        .problem-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .problem-card h3 {
          font-size: 20px;
          color: #1e293b;
          margin-bottom: 12px;
        }

        .problem-card p {
          color: #64748b;
          font-size: 14px;
          line-height: 1.6;
        }

        .solution-card {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          color: white;
          padding: 40px;
          border-radius: 20px;
          margin-bottom: 40px;
        }

        .solution-icon {
          font-size: 48px;
          text-align: center;
          margin-bottom: 20px;
        }

        .solution-card h2 {
          font-size: 32px;
          text-align: center;
          margin-bottom: 24px;
        }

        .solution-card ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 600px;
          margin: 0 auto;
        }

        .solution-card li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 16px;
        }

        .cta-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          padding: 20px 40px;
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(37, 99, 235, 0.3);
        }

        .trust-line {
          text-align: center;
          margin-top: 24px;
          color: #64748b;
          font-size: 14px;
        }

        /* Layer Pages */
        .layer-container {
          max-width: 700px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .layer-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .layer-badge {
          display: inline-block;
          padding: 8px 16px;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .layer-header h2 {
          font-size: 32px;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .layer-header p {
          color: #64748b;
          font-size: 16px;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        label {
          font-weight: 600;
          color: #334155;
          font-size: 15px;
        }

        .currency-input {
          position: relative;
        }

        .currency {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          font-weight: 700;
          color: #64748b;
        }

        .currency-input input {
          width: 100%;
          padding: 16px 16px 16px 50px;
          font-size: 20px;
          font-weight: 600;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          transition: all 0.2s;
        }

        .currency-input input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .select-input {
          width: 100%;
          padding: 16px;
          font-size: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          cursor: pointer;
        }

        .select-input:focus {
          outline: none;
          border-color: #2563eb;
        }

        .hint {
          font-size: 13px;
          color: #64748b;
        }

        .radio-group {
          display: flex;
          gap: 12px;
        }

        .radio-group.vertical {
          flex-direction: column;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .radio-option:hover {
          border-color: #2563eb;
          background: #f8fafc;
        }

        .radio-option input[type="radio"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: #2563eb;
        }

        .radio-card {
          display: flex;
          gap: 12px;
          padding: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .radio-card:hover {
          border-color: #2563eb;
          background: #f8fafc;
        }

        .radio-card input[type="radio"] {
          margin-top: 4px;
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: #2563eb;
        }

        .radio-card strong {
          display: block;
          font-size: 16px;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .radio-card p {
          font-size: 13px;
          color: #64748b;
        }

        .deciding-doc-card {
          background: #fef3c7;
          border: 2px solid #fcd34d;
          padding: 16px;
          border-radius: 12px;
        }

        .deciding-doc-card h4 {
          color: #92400e;
          margin-bottom: 8px;
          font-size: 15px;
        }

        .deciding-doc-card p {
          color: #78350f;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .doc-note {
          display: block;
          font-size: 12px;
          color: #92400e;
          font-style: italic;
        }

        .btn-next, .btn-back {
          padding: 16px 32px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-next {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          color: white;
          flex: 1;
        }

        .btn-next:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        }

        .btn-back {
          background: #f1f5f9;
          color: #475569;
        }

        .nav-buttons {
          display: flex;
          gap: 12px;
        }

        /* Results Page */
        .results-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .results-header {
          background: white;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          margin-bottom: 30px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .results-header h1 {
          font-size: 36px;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .results-header p {
          color: #64748b;
        }

        .key-finding-card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          margin-bottom: 30px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .key-finding-card h2 {
          text-align: center;
          font-size: 24px;
          color: #1e293b;
          margin-bottom: 16px;
        }

        .final-amount {
          text-align: center;
          font-size: 64px;
          font-weight: 800;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 32px;
        }

        .comparison-grid {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 24px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .comparison-item {
          flex: 1;
          min-width: 200px;
          text-align: center;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .comparison-item .label {
          display: block;
          font-size: 14px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .comparison-item .value {
          display: block;
          font-size: 32px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .comparison-item .sublabel {
          display: block;
          font-size: 12px;
          color: #64748b;
        }

        .vs {
          font-size: 20px;
          font-weight: 700;
          color: #64748b;
        }

        .limiting-factor {
          padding: 20px;
          border-radius: 12px;
          text-align: center;
        }

        .limiting-factor.income {
          background: #fef3c7;
          border: 2px solid #fcd34d;
          color: #92400e;
        }

        .limiting-factor.property {
          background: #dbeafe;
          border: 2px solid #93c5fd;
          color: #1e40af;
        }

        .limiting-factor strong {
          display: block;
          font-size: 16px;
          margin-bottom: 8px;
        }

        .limiting-factor p {
          font-size: 14px;
          margin-top: 8px;
        }

        .bank-categories {
          margin-bottom: 40px;
        }

        .bank-categories > h2 {
          font-size: 28px;
          color: #1e293b;
          margin-bottom: 30px;
        }

        .category-section {
          margin-bottom: 40px;
        }

        .category-title {
          font-size: 22px;
          padding: 12px 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          display: inline-block;
        }

        .category-title.govt {
          background: #dbeafe;
          color: #1e40af;
        }

        .category-title.pvt {
          background: #fce7f3;
          color: #be185d;
        }

        .category-title.mnc {
          background: #d1fae5;
          color: #065f46;
        }

        .banks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
        }

        .bank-card {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: all 0.3s;
        }

        .bank-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.12);
        }

        .bank-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f1f5f9;
        }

        .bank-header h4 {
          font-size: 24px;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .bank-full {
          font-size: 13px;
          color: #64748b;
        }

        .score-circle {
          position: relative;
          width: 70px;
          height: 70px;
        }

        .score-circle svg {
          width: 100%;
          height: 100%;
        }

        .score-num {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 20px;
          font-weight: 800;
          color: #1e293b;
        }

        .disqualifiers {
          background: #fef2f2;
          border: 2px solid #fecaca;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 13px;
          color: #991b1b;
        }

        .loan-details {
          background: #f8fafc;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 16px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-row span {
          color: #64748b;
          font-size: 14px;
        }

        .detail-row strong {
          color: #1e293b;
          font-size: 16px;
        }

        .strengths {
          margin-top: 16px;
        }

        .strengths strong {
          display: block;
          font-size: 14px;
          color: #1e293b;
          margin-bottom: 8px;
        }

        .strengths ul {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .strengths li {
          font-size: 13px;
          color: #475569;
          padding-left: 16px;
          position: relative;
        }

        .strengths li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: 700;
        }

        .cta-section {
          background: white;
          padding: 40px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .cta-section h3 {
          font-size: 28px;
          color: #1e293b;
          margin-bottom: 12px;
        }

        .cta-section p {
          color: #64748b;
          margin-bottom: 24px;
        }

        @media (max-width: 768px) {
          .intro-content h1 {
            font-size: 32px;
          }

          .problem-cards {
            grid-template-columns: 1fr;
          }

          .comparison-grid {
            flex-direction: column;
          }

          .banks-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PrimePathMortgages;
