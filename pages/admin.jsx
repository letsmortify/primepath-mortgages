import React, { useState, useEffect } from 'react';
import LeadsDashboard from '../components/leadsdashboard';

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pass = params.get('leads');
    
    if (pass === 'primepath2026') {
      setIsAuthorized(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) return null; // Prevents flashing the wrong content

  if (!isAuthorized) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#dc2626', fontFamily: 'sans-serif' }}>
        <h2>Access denied</h2>
      </div>
    );
  }

  return <LeadsDashboard />;
}
