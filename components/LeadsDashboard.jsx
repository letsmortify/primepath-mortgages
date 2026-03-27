import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://rbbktlpaijkozfenyrsf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiYmt0bHBhaWprb3pmZW55cnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNzYxNDAsImV4cCI6MjA4Nzg1MjE0MH0.vB2LOysAyOO3u6iUg5w6pa7dmXGq0G2fwCicpWKv5w8'
);

// ─── CONFIG — change these ────────────────────────────────────────────────────
const YOUR_WHATSAPP = '919999829407'; // replace with your number
const YOUR_NAME     = 'Abhinav';

// ─── TIER COLOURS ─────────────────────────────────────────────────────────────
const TIER = {
  Gold:     { bg:'#fef3c7', border:'#f59e0b', text:'#92400e', icon:'🥇' },
  Silver:   { bg:'#f1f5f9', border:'#94a3b8', text:'#334155', icon:'🥈' },
  Standard: { bg:'#fef2f2', border:'#fca5a5', text:'#991b1b', icon:'⚠️'  },
};

// ─── STATUS PIPELINE ──────────────────────────────────────────────────────────
const PIPELINE = ['new','contacted','docs_requested','submitted','disbursed','lost'];
const PIPELINE_LABELS = {
  new:'New Lead', contacted:'Contacted', docs_requested:'Docs Requested',
  submitted:'Submitted to Bank', disbursed:'Disbursed 🎉', lost:'Lost'
};
const PIPELINE_COLORS = {
  new:'#3b82f6', contacted:'#f59e0b', docs_requested:'#8b5cf6',
  submitted:'#06b6d4', disbursed:'#16a34a', lost:'#dc2626'
};

const LeadsDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setLeads(data);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const updateStatus = async (id, status) => {
    setSaving(true);
    await supabase.from('leads').update({ status }).eq('id', id);
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
    if (selected?.id === id) setSelected({ ...selected, status });
    setSaving(false);
  };

  const saveNote = async () => {
    if (!selected || !note.trim()) return;
    setSaving(true);
    const updated = (selected.notes || '') + `\n[${new Date().toLocaleDateString('en-IN')}] ${note}`;
    await supabase.from('leads').update({ notes: updated }).eq('id', selected.id);
    setLeads(leads.map(l => l.id === selected.id ? { ...l, notes: updated } : l));
    setSelected({ ...selected, notes: updated });
    setNote('');
    setSaving(false);
  };

  // WhatsApp deep link with pre-filled context
  const waLink = (lead) => {
    const msg = encodeURIComponent(
      `Hi ${lead.name}, this is ${YOUR_NAME} from PrimePath Mortgages.\n\n` +
      `I can see you checked your home loan eligibility for ₹${(lead.loan_amount_needed/100000).toFixed(0)}L ` +
      `against a ₹${lead.property_value?(lead.property_value/10000000).toFixed(2)+'Cr':'—'} property in ${lead.city||'NCR'}.\n\n` +
      `Your top match was ${lead.matched_bank||'a Govt bank'} with max eligibility of ` +
      `₹${(lead.max_loan_amount/100000).toFixed(1)}L.\n\n` +
      `I'd love to take this forward — are you free for a 15-min call today?`
    );
    return `https://wa.me/${YOUR_WHATSAPP.replace(/\D/g,'')}?text=${msg}`;
  };

  const callLink  = (lead) => `tel:+91${lead.phone}`;
  const emailLink = (lead) => {
    const sub = encodeURIComponent(`Your PrimePath Loan Assessment — ₹${(lead.loan_amount_needed/100000).toFixed(0)}L`);
    const body = encodeURIComponent(`Hi ${lead.name},\n\nThank you for using PrimePath Mortgages.\n\nYour eligibility summary:\n• Max loan: ₹${(lead.max_loan_amount/100000).toFixed(1)}L\n• Best match: ${lead.matched_bank||'—'}\n• Profile tier: ${lead.tier||'—'}\n\nI'd be happy to help you with the next steps.\n\nBest,\n${YOUR_NAME}\nPrimePath Mortgages`);
    return `mailto:${lead.email}?subject=${sub}&body=${body}`;
  };

  // Summary stats
  const totalLeads   = leads.length;
  const goldLeads    = leads.filter(l => l.tier === 'Gold').length;
  const silverLeads  = leads.filter(l => l.tier === 'Silver').length;
  const newLeads     = leads.filter(l => l.status === 'new').length;
  const disbursed    = leads.filter(l => l.status === 'disbursed').length;
  const pipeline     = leads.filter(l => !['new','lost','disbursed'].includes(l.status)).length;
  const totalValue   = leads.reduce((s, l) => s + (l.max_loan_amount||0), 0);

  const filtered = leads.filter(l => {
    if (filter !== 'all' && l.status !== filter) return false;
    if (tierFilter !== 'all' && l.tier !== tierFilter) return false;
    return true;
  });

  // ── Inline styles ────────────────────────────────────────────────────────────
  const s = {
    app:      { fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', background:'#f8fafc', minHeight:'100vh', padding:'24px' },
    header:   { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' },
    title:    { fontSize:'24px', fontWeight:'800', color:'#1e293b', margin:0 },
    subtitle: { fontSize:'14px', color:'#64748b', margin:'2px 0 0' },
    statsRow: { display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'12px', marginBottom:'24px' },
    statCard: (color) => ({ background:'#fff', border:`2px solid ${color}20`, borderRadius:'12px', padding:'16px', textAlign:'center' }),
    statNum:  (color) => ({ fontSize:'28px', fontWeight:'800', color, margin:0 }),
    statLbl:  { fontSize:'11px', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.5px', marginTop:'2px' },
    filters:  { display:'flex', gap:'8px', marginBottom:'16px', flexWrap:'wrap' },
    filterBtn:(active) => ({ padding:'6px 14px', borderRadius:'20px', border:`1px solid ${active?'#2563eb':'#e2e8f0'}`, background:active?'#2563eb':'#fff', color:active?'#fff':'#64748b', cursor:'pointer', fontSize:'13px', fontWeight:active?'600':'400' }),
    table:    { width:'100%', background:'#fff', borderRadius:'12px', overflow:'hidden', border:'1px solid #e2e8f0' },
    th:       { padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:'700', color:'#64748b', textTransform:'uppercase', background:'#f8fafc', borderBottom:'1px solid #e2e8f0' },
    td:       { padding:'12px 16px', fontSize:'13px', color:'#374151', borderBottom:'1px solid #f1f5f9', verticalAlign:'middle' },
    tierBadge:(tier) => ({ display:'inline-block', padding:'2px 8px', borderRadius:'12px', fontSize:'11px', fontWeight:'700', background:TIER[tier]?.bg||'#f1f5f9', color:TIER[tier]?.text||'#64748b', border:`1px solid ${TIER[tier]?.border||'#e2e8f0'}` }),
    statusBadge:(s) => ({ display:'inline-block', padding:'2px 8px', borderRadius:'12px', fontSize:'11px', fontWeight:'600', background:`${PIPELINE_COLORS[s]}15`, color:PIPELINE_COLORS[s]||'#64748b' }),
    actionBtn:(color,bg) => ({ padding:'5px 10px', borderRadius:'6px', border:'none', background:bg, color, cursor:'pointer', fontSize:'12px', fontWeight:'600', marginRight:'4px', display:'inline-flex', alignItems:'center', gap:'4px' }),
    modal:    { position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'flex-start', justifyContent:'center', zIndex:1000, padding:'40px 20px', overflowY:'auto' },
    modalBox: { background:'#fff', borderRadius:'16px', padding:'28px', width:'100%', maxWidth:'560px', position:'relative' },
    close:    { position:'absolute', top:'16px', right:'16px', background:'none', border:'none', fontSize:'20px', cursor:'pointer', color:'#64748b' },
    section:  { marginBottom:'20px' },
    sLabel:   { fontSize:'11px', fontWeight:'700', color:'#94a3b8', textTransform:'uppercase', marginBottom:'6px' },
    sValue:   { fontSize:'15px', color:'#1e293b', fontWeight:'600' },
    grid2:    { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' },
    infoBox:  (bg,border) => ({ background:bg, border:`1px solid ${border}`, borderRadius:'8px', padding:'12px 14px', fontSize:'13px' }),
    textarea: { width:'100%', padding:'10px 12px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'13px', resize:'vertical', minHeight:'72px', boxSizing:'border-box' },
    saveBtn:  { padding:'8px 16px', background:'#2563eb', color:'#fff', border:'none', borderRadius:'8px', fontSize:'13px', fontWeight:'600', cursor:'pointer', marginTop:'8px' },
    pipeRow:  { display:'flex', gap:'4px', flexWrap:'wrap', marginTop:'8px' },
    pipeBtn:  (active, color) => ({ padding:'4px 10px', borderRadius:'6px', border:`1px solid ${active?color:color+'40'}`, background:active?color:'transparent', color:active?'#fff':color, cursor:'pointer', fontSize:'11px', fontWeight:'600' }),
  };

  const fmt = (n) => n >= 10000000 ? `₹${(n/10000000).toFixed(2)}Cr` : n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${n?.toLocaleString()}`;

  return (
    <div style={s.app}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>PrimePath — Lead Pipeline</h1>
          <p style={s.subtitle}>Real-time dashboard • Supabase connected</p>
        </div>
        <button onClick={fetchLeads} style={{...s.actionBtn('#fff','#2563eb'), padding:'10px 18px', fontSize:'14px'}}>↻ Refresh</button>
      </div>

      {/* Stats */}
      <div style={s.statsRow}>
        {[
          {n:totalLeads,  l:'Total Leads',    c:'#2563eb'},
          {n:newLeads,    l:'New (unread)',    c:'#f59e0b'},
          {n:goldLeads,   l:'Gold Profiles',  c:'#d97706'},
          {n:silverLeads, l:'Silver Profiles',c:'#64748b'},
          {n:pipeline,    l:'In Pipeline',    c:'#8b5cf6'},
          {n:disbursed,   l:'Disbursed',      c:'#16a34a'},
        ].map(({n,l,c}) => (
          <div key={l} style={s.statCard(c)}>
            <p style={s.statNum(c)}>{n}</p>
            <p style={s.statLbl}>{l}</p>
          </div>
        ))}
      </div>

      {/* Pipeline value */}
      <div style={{background:'linear-gradient(135deg,#1e3a5f,#2563eb)',borderRadius:'12px',padding:'16px 24px',marginBottom:'20px',color:'#fff',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><div style={{fontSize:'12px',opacity:0.8,marginBottom:'4px'}}>TOTAL PIPELINE VALUE</div><div style={{fontSize:'28px',fontWeight:'800'}}>{fmt(totalValue)}</div></div>
        <div style={{textAlign:'right'}}><div style={{fontSize:'12px',opacity:0.8,marginBottom:'4px'}}>AVG TICKET SIZE</div><div style={{fontSize:'22px',fontWeight:'700'}}>{totalLeads>0?fmt(Math.round(totalValue/totalLeads)):'—'}</div></div>
        <div style={{textAlign:'right'}}><div style={{fontSize:'12px',opacity:0.8,marginBottom:'4px'}}>EST. COMMISSION (1%)</div><div style={{fontSize:'22px',fontWeight:'700',color:'#86efac'}}>{fmt(Math.round(totalValue*0.01))}</div></div>
      </div>

      {/* Filters */}
      <div style={s.filters}>
        {['all',...PIPELINE].map(f => (
          <button key={f} style={s.filterBtn(filter===f)} onClick={()=>setFilter(f)}>
            {f==='all'?'All Leads':PIPELINE_LABELS[f]}
          </button>
        ))}
        <span style={{margin:'0 8px',color:'#e2e8f0'}}>|</span>
        {['all','Gold','Silver','Standard'].map(t => (
          <button key={t} style={s.filterBtn(tierFilter===t)} onClick={()=>setTierFilter(t)}>{t==='all'?'All Tiers':t}</button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{textAlign:'center',padding:'60px',color:'#94a3b8'}}>Loading leads...</div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign:'center',padding:'60px',color:'#94a3b8',background:'#fff',borderRadius:'12px',border:'1px solid #e2e8f0'}}>
          <div style={{fontSize:'48px',marginBottom:'12px'}}>📭</div>
          <p style={{fontSize:'18px',fontWeight:'600',color:'#64748b'}}>No leads yet</p>
          <p style={{fontSize:'14px',color:'#94a3b8'}}>Share the PrimePath link to start collecting</p>
        </div>
      ) : (
        <div style={{overflowX:'auto'}}>
          <table style={s.table}>
            <thead>
              <tr>
                {['Name','Contact','Loan Ask','City','Tier','Top Bank','Score','Status','Actions'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <tr key={lead.id} style={{background: i%2===0?'#fff':'#fafafa', cursor:'pointer'}} onClick={()=>setSelected(lead)}>
                  <td style={s.td}>
                    <div style={{fontWeight:'700',color:'#1e293b'}}>{lead.name}</div>
                    <div style={{fontSize:'11px',color:'#94a3b8'}}>{new Date(lead.created_at).toLocaleDateString('en-IN')}</div>
                  </td>
                  <td style={s.td}>
                    <div>{lead.phone}</div>
                    <div style={{fontSize:'11px',color:'#94a3b8'}}>{lead.email?.substring(0,20)}{lead.email?.length>20?'...':''}</div>
                  </td>
                  <td style={s.td}>
                    <div style={{fontWeight:'700'}}>{fmt(lead.loan_amount_needed)}</div>
                    <div style={{fontSize:'11px',color:'#94a3b8'}}>Max: {fmt(lead.max_loan_amount)}</div>
                  </td>
                  <td style={s.td}>{lead.city||'—'}</td>
                  <td style={s.td}>
                    {lead.tier && <span style={s.tierBadge(lead.tier)}>{TIER[lead.tier]?.icon} {lead.tier}</span>}
                  </td>
                  <td style={s.td}>
                    <div style={{fontWeight:'600',color:'#1e293b',fontSize:'12px'}}>{lead.matched_bank||'—'}</div>
                    <div style={{fontSize:'11px',color:'#94a3b8'}}>Score: {lead.eligibility_score||'—'}</div>
                  </td>
                  <td style={s.td}>{lead.eligibility_score||'—'}</td>
                  <td style={s.td} onClick={e=>e.stopPropagation()}>
                    <select
                      value={lead.status||'new'}
                      onChange={e=>updateStatus(lead.id, e.target.value)}
                      style={{padding:'4px 8px',borderRadius:'6px',border:`1px solid ${PIPELINE_COLORS[lead.status||'new']}`,background:`${PIPELINE_COLORS[lead.status||'new']}15`,color:PIPELINE_COLORS[lead.status||'new'],fontSize:'12px',fontWeight:'600',cursor:'pointer'}}
                    >
                      {PIPELINE.map(p=><option key={p} value={p}>{PIPELINE_LABELS[p]}</option>)}
                    </select>
                  </td>
                  <td style={s.td} onClick={e=>e.stopPropagation()}>
                    <a href={waLink(lead)} target="_blank" rel="noopener noreferrer" style={s.actionBtn('#fff','#25d366')}>💬 WA</a>
                    <a href={callLink(lead)} style={s.actionBtn('#fff','#2563eb')}>📞</a>
                    <a href={emailLink(lead)} style={s.actionBtn('#fff','#6366f1')}>✉️</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lead Detail Modal */}
      {selected && (
        <div style={s.modal} onClick={()=>setSelected(null)}>
          <div style={s.modalBox} onClick={e=>e.stopPropagation()}>
            <button style={s.close} onClick={()=>setSelected(null)}>✕</button>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'20px'}}>
              <div style={{width:'48px',height:'48px',borderRadius:'50%',background:'#2563eb',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:'800',fontSize:'18px'}}>{selected.name?.[0]||'?'}</div>
              <div>
                <h2 style={{margin:0,fontSize:'20px',color:'#1e293b'}}>{selected.name}</h2>
                <div style={{fontSize:'13px',color:'#64748b'}}>{selected.phone} • {selected.email}</div>
              </div>
              {selected.tier && <span style={{...s.tierBadge(selected.tier),marginLeft:'auto',fontSize:'14px',padding:'4px 12px'}}>{TIER[selected.tier]?.icon} {selected.tier} Profile</span>}
            </div>

            {/* Quick actions */}
            <div style={{display:'flex',gap:'8px',marginBottom:'20px',flexWrap:'wrap'}}>
              <a href={waLink(selected)} target="_blank" rel="noopener noreferrer" style={{...s.actionBtn('#fff','#25d366'),padding:'10px 16px',fontSize:'14px',textDecoration:'none'}}>💬 WhatsApp</a>
              <a href={callLink(selected)} style={{...s.actionBtn('#fff','#2563eb'),padding:'10px 16px',fontSize:'14px',textDecoration:'none'}}>📞 Call</a>
              <a href={emailLink(selected)} style={{...s.actionBtn('#fff','#6366f1'),padding:'10px 16px',fontSize:'14px',textDecoration:'none'}}>✉️ Email</a>
            </div>

            <div style={s.grid2}>
              <div style={s.infoBox('#f0fdf4','#86efac')}>
                <div style={s.sLabel}>Max Eligible Loan</div>
                <div style={{...s.sValue,color:'#16a34a',fontSize:'22px'}}>{fmt(selected.max_loan_amount)}</div>
                <div style={{fontSize:'12px',color:'#64748b',marginTop:'2px'}}>Asked: {fmt(selected.loan_amount_needed)}</div>
              </div>
              <div style={s.infoBox('#eff6ff','#93c5fd')}>
                <div style={s.sLabel}>Top Bank Match</div>
                <div style={{...s.sValue,color:'#2563eb'}}>{selected.matched_bank||'—'}</div>
                <div style={{fontSize:'12px',color:'#64748b',marginTop:'2px'}}>Score: {selected.eligibility_score||'—'}/100</div>
              </div>
            </div>

            <div style={{...s.grid2,marginTop:'12px'}}>
              {[
                {l:'Monthly Income',v:fmt(selected.monthly_salary)},
                {l:'Existing EMIs',v:fmt(selected.current_emis||0)},
                {l:'Employment',v:selected.employment_type?.replace('-',' ')||'—'},
                {l:'CIBIL Range',v:selected.cibil_range||'—'},
                {l:'City',v:selected.city||'—'},
                {l:'Property Type',v:selected.property_type||'—'},
                {l:'Tenure',v:`${selected.loan_tenure||'—'} years`},
                {l:'Applied On',v:new Date(selected.created_at).toLocaleDateString('en-IN')},
              ].map(({l,v})=>(
                <div key={l} style={{padding:'10px',background:'#f8fafc',borderRadius:'8px'}}>
                  <div style={s.sLabel}>{l}</div>
                  <div style={{...s.sValue,fontSize:'14px'}}>{v}</div>
                </div>
              ))}
            </div>

            {/* Pipeline status */}
            <div style={{marginTop:'16px'}}>
              <div style={s.sLabel}>Pipeline Status</div>
              <div style={s.pipeRow}>
                {PIPELINE.map(p=>(
                  <button key={p} style={s.pipeBtn(selected.status===p, PIPELINE_COLORS[p])}
                    onClick={()=>updateStatus(selected.id,p)} disabled={saving}>
                    {PIPELINE_LABELS[p]}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div style={{marginTop:'16px'}}>
              <div style={s.sLabel}>Notes & Follow-up Log</div>
              {selected.notes && (
                <div style={{...s.infoBox('#f8fafc','#e2e8f0'),marginBottom:'8px',whiteSpace:'pre-line',fontSize:'12px',color:'#64748b',maxHeight:'120px',overflowY:'auto'}}>{selected.notes}</div>
              )}
              <textarea style={s.textarea} value={note} onChange={e=>setNote(e.target.value)} placeholder="Add a note (e.g., Called, will follow up Friday. Interested in HDFC APF project.)"/>
              <button style={s.saveBtn} onClick={saveNote} disabled={saving}>{saving?'Saving...':'Save Note'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsDashboard;
