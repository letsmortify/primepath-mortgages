import LeadsDashboard from '../components/LeadsDashboard';

export default function AdminPage() {
  if (typeof window !== 'undefined') {
    const pass = new URLSearchParams(window.location.search).get('leads');
    if (pass !== 'primepath2026') {
      return <div style={{padding:'40px',textAlign:'center',color:'#dc2626',fontFamily:'sans-serif'}}>
        <h2>Access denied</h2>
      </div>;
    }
  }
  return <LeadsDashboard />;
}
```
