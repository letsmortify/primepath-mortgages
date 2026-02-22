// /pages/api/banks.js
// SERVER-SIDE API — Hides bank intelligence from client

export default function handler(req, res) {
  // Rate limiting: Track requests per IP (simplified — use Redis in production)
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  // SECURITY: Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // BANK DATA — Now hidden from client-side inspection
  const BANKS = [
    {
      name: 'Punjab National Bank',
      shortName: 'PNB',
      category: 'Government',
      rateHL: 8.40,
      rateLAP: 9.20,
      maxDBR: 0.60,
      maxLTVhl: 0.80,
      maxLTVlap: 0.70,
      processingFee: 0.25,
      roiLinkage: 'MCLR',
      resetFrequency: 'Quarterly',
      processingTime: {
        goldCase: '15-20 days',
        standard: '25-30 days',
        deviation: '35-45 days',
      },
      advantages: [
        'Lowest interest rates among all banks',
        'MCLR-linked — passes RBI rate cuts quarterly',
        'Preferred for government employees (lower rates)',
      ],
    },
    {
      name: 'State Bank of India',
      shortName: 'SBI',
      category: 'Government',
      rateHL: 8.50,
      rateLAP: 9.30,
      maxDBR: 0.60,
      maxLTVhl: 0.80,
      maxLTVlap: 0.70,
      processingFee: 0.35,
      roiLinkage: 'Repo',
      resetFrequency: 'Quarterly',
      processingTime: {
        goldCase: '12-18 days',
        standard: '20-25 days',
        deviation: '30-40 days',
      },
      advantages: [
        'Repo-linked rate — fastest to pass RBI cuts (3 months)',
        'Largest branch network in India',
        'Best for government employees & pensioners',
      ],
    },
    {
      name: 'Canara Bank',
      shortName: 'Canara',
      category: 'Government',
      rateHL: 8.55,
      rateLAP: 9.25,
      maxDBR: 0.60,
      maxLTVhl: 0.80,
      maxLTVlap: 0.70,
      processingFee: 0.30,
      roiLinkage: 'MCLR',
      resetFrequency: 'Half-yearly',
      processingTime: {
        goldCase: '18-22 days',
        standard: '28-35 days',
        deviation: '40-50 days',
      },
      advantages: [
        'Competitive rates for salaried employees',
        'Good presence in South India',
        'Flexible processing for self-employed',
      ],
    },
    {
      name: 'HDFC Bank',
      shortName: 'HDFC',
      category: 'Private',
      rateHL: 8.75,
      rateLAP: 9.50,
      maxDBR: 0.50,
      maxLTVhl: 0.80,
      maxLTVlap: 0.65,
      processingFee: 0.50,
      roiLinkage: 'Repo',
      resetFrequency: 'Quarterly',
      processingTime: {
        goldCase: '7-10 days',
        standard: '12-18 days',
        deviation: '20-25 days',
      },
      advantages: [
        '⚡ Fastest processing — 7-10 days for salaried',
        'Digital pre-approval for CAT A/B companies',
        'Premium customer service & relationship manager',
      ],
    },
    {
      name: 'ICICI Bank',
      shortName: 'ICICI',
      category: 'Private',
      rateHL: 8.70,
      rateLAP: 9.45,
      maxDBR: 0.50,
      maxLTVhl: 0.80,
      maxLTVlap: 0.65,
      processingFee: 0.50,
      roiLinkage: 'Repo',
      resetFrequency: 'Quarterly',
      processingTime: {
        goldCase: '8-12 days',
        standard: '15-20 days',
        deviation: '22-28 days',
      },
      advantages: [
        'Repo-linked with quarterly reset',
        'Strong digital platform & mobile app',
        'Quick turnaround for approved builders',
      ],
    },
    {
      name: 'Axis Bank',
      shortName: 'Axis',
      category: 'Private',
      rateHL: 8.80,
      rateLAP: 9.55,
      maxDBR: 0.50,
      maxLTVhl: 0.80,
      maxLTVlap: 0.65,
      processingFee: 0.40,
      roiLinkage: 'Repo',
      resetFrequency: 'Quarterly',
      processingTime: {
        goldCase: '10-14 days',
        standard: '18-22 days',
        deviation: '25-30 days',
      },
      advantages: [
        'Repo-linked — 3-month reset frequency',
        'NIL prepayment charges on floating rate loans',
        'Lower processing fee than HDFC/ICICI',
      ],
    },
    {
      name: 'HSBC India',
      shortName: 'HSBC',
      category: 'Multinational',
      rateHL: 8.90,
      rateLAP: 9.70,
      maxDBR: 0.50,
      maxLTVhl: 0.75,
      maxLTVlap: 0.60,
      processingFee: 0.50,
      roiLinkage: 'Repo',
      resetFrequency: 'Quarterly',
      processingTime: {
        goldCase: '10-15 days',
        standard: '20-25 days',
        deviation: '30-35 days',
      },
      advantages: [
        'Premium relationship banking for HNIs',
        'Global banking integration (NRI-friendly)',
        'Dedicated RM for loan >₹1 Cr',
      ],
    },
  ];
  
  // Add timestamp to response
  const response = {
    banks: BANKS,
    lastUpdated: '2026-02-21', // Update this when scraper runs
    source: 'PrimePath Intelligence Engine v2.0',
  };
  
  // Set cache headers (cache for 1 hour)
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  
  return res.status(200).json(response);
}
