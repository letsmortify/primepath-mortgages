import LeadsDashboard from '../components/LeadsDashboard';

export default function AdminPage() {
  if (typeof window !== 'undefined') {
    const pass = new URLSearchParams(window.location.search).get('leads');
    if (pass !== 'primepath2026') {
      return (
        <div style={{ padding:'40px', textAlign:'center', fontFamily:'sans-serif' }}>
          <h2 style={{ color:'#dc2626' }}>Access Denied</h2>
        </div>
      );
    }
  }
  return <LeadsDashboard />;
}
