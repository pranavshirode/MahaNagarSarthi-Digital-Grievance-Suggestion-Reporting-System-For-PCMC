import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/* ── Animated counter hook ── */
function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let start = 0;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { setCount(target); clearInterval(timer); }
        else setCount(Math.floor(start));
      }, 16);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return [count, ref];
}

/* ── Stat number ── */
function StatNum({ value, suffix = '', decimals = 0 }) {
  const numericTarget = parseFloat(value.replace(/[^0-9.]/g, ''));
  const [count, ref] = useCounter(numericTarget, 1600);
  return (
    <span ref={ref}>{decimals ? count.toFixed(decimals) : count.toLocaleString('en-IN')}{suffix}</span>
  );
}

const CATEGORIES = [
  { emoji: '🛣', label: 'Roads', color: '#2563eb', bg: 'rgba(37,99,235,.08)', pocName: 'Rajesh Patil', pocDesig: 'Executive Engineer (Roads)', pocPhone: '+91 98765 43210', pocEmail: 'roads@pcmcindia.gov.in', desc: 'Report issues related to potholes, broken dividers, road construction, and traffic signals.' },
  { emoji: '💧', label: 'Water', color: '#0891b2', bg: 'rgba(8,145,178,.08)', pocName: 'Sunita Jadhav', pocDesig: 'Head, Water Supply Dept', pocPhone: '+91 98765 43211', pocEmail: 'water@pcmcindia.gov.in', desc: 'Report issues like pipe leakages, contaminated water, or supply cuts.' },
  { emoji: '🧹', label: 'Hygiene', color: '#d97706', bg: 'rgba(217,119,6,.08)', pocName: 'Dr. Amit Sharma', pocDesig: 'Chief Sanitary Inspector', pocPhone: '+91 98765 43212', pocEmail: 'swm@pcmcindia.gov.in', desc: 'Complaints about solid waste management, garbage collection, and public hygiene.' },
  { emoji: '⚡', label: 'Electricity', color: '#7c3aed', bg: 'rgba(124,58,237,.08)', pocName: 'Vikram Singh', pocDesig: 'Electrical Engineer', pocPhone: '+91 98765 43213', pocEmail: 'power@pcmcindia.gov.in', desc: 'Report power outages, unsafe wiring, and transformer issues.' },
  { emoji: '🏥', label: 'Hospital', color: '#dc2626', bg: 'rgba(220,38,38,.08)', pocName: 'Dr. Neha Kulkarni', pocDesig: 'Chief Medical Officer', pocPhone: '+91 98765 43214', pocEmail: 'health@pcmcindia.gov.in', desc: 'Feedback and grievances regarding municipal hospitals and health centers.' },
  { emoji: '🚌', label: 'Transport', color: '#16a34a', bg: 'rgba(22,163,74,.08)', pocName: 'Sanjay Deshmukh', pocDesig: 'Transport Controller', pocPhone: '+91 98765 43215', pocEmail: 'transport@pcmcindia.gov.in', desc: 'Report irregular bus schedules, bus stop maintenance, and transport issues.' },
  { emoji: '🏛️', label: 'Tax', color: '#92400e', bg: 'rgba(146,64,14,.08)', pocName: 'Manoj Bhosale', pocDesig: 'Revenue Officer', pocPhone: '+91 98765 43216', pocEmail: 'tax@pcmcindia.gov.in', desc: 'Property tax queries, disputes, and payment reporting issues.' },
  { emoji: '🌊', label: 'Drainage', color: '#0369a1', bg: 'rgba(3,105,161,.08)', pocName: 'Priya Shinde', pocDesig: 'Drainage & Sewage Head', pocPhone: '+91 98765 43217', pocEmail: 'drainage@pcmcindia.gov.in', desc: 'Report overflowing drains, open manholes, and sewage blockages.' },
  { emoji: '💡', label: 'Street Lights', color: '#b45309', bg: 'rgba(180,83,9,.08)', pocName: 'Vikram Singh', pocDesig: 'Electrical Engineer', pocPhone: '+91 98765 43213', pocEmail: 'power@pcmcindia.gov.in', desc: 'Report broken street lights, dark streets, and timer issues.' },
  { emoji: '🌳', label: 'Parks', color: '#15803d', bg: 'rgba(21,128,61,.08)', pocName: 'Kiran Desai', pocDesig: 'Director of Parks & Gardens', pocPhone: '+91 98765 43218', pocEmail: 'parks@pcmcindia.gov.in', desc: 'Issues with park maintenance, broken play equipment, or tree trimming.' },
];

const RECENT = [
  { id: 'NS-2025-000011', title: 'Missing road dividers near school', location: 'Viman Nagar', cat: 'Roads', days: 2 },
  { id: 'NS-2025-000007', title: 'Water pipe leakage on MG Road', location: 'Katraj', cat: 'Water', days: 4 },
  { id: 'NS-2025-000003', title: 'Street lights not working for 2 weeks', location: 'Baner', cat: 'Electricity', days: 5 },
];

export default function LandingPage({ isLoggedIn }) {
  const [selectedWard, setSelectedWard] = useState(null);
  const navigate = useNavigate();

  const handleStartGrievance = () => {
    navigate('/register-complaint', { state: { category: selectedWard?.label } });
  };
  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: '#1C1C1E', background: '#F5F5F7' }}>

      {/* ── HERO ── */}
      <section id="home" style={{
        background: 'linear-gradient(135deg, #e8f5ed 0%, #f7fbf9 50%, #dff0e6 100%)',
        position: 'relative', overflow: 'hidden', minHeight: '92vh',
        display: 'flex', alignItems: 'center',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'rgba(22,163,74,.06)', top: -200, right: -150, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(22,163,74,.04)', bottom: -100, left: -100, pointerEvents: 'none' }} />
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(0,0,0,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.03) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
            {/* Left text */}
            <div style={{ flex: '1 1 480px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px',
                background: '#dcfce7', border: '1px solid #bbf7d0',
                borderRadius: 100, color: '#16a34a', fontSize: 12, fontWeight: 700,
                letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 24,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', animation: 'lp-pulse 2s ease infinite', display: 'inline-block' }} />
                🏙 PCMC Smart City Initiative
              </div>

              <h1 style={{ fontSize: 'clamp(44px, 5.5vw, 68px)', fontWeight: 900, color: '#064e3b', marginBottom: 12, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Mahanagar Sarthi
              </h1>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, lineHeight: 1.2, color: '#115e59', marginBottom: 20 }}>
                Your Voice.<br />
                <span style={{ color: '#16a34a' }}>A Better City.</span>
              </h2>

              <p style={{ fontSize: 16, color: '#4b5563', lineHeight: 1.7, maxWidth: 460, marginBottom: 36 }}>
                Report civic issues, track resolutions in real-time, and drive change in Pimpri Chinchwad's municipal services — all from one platform.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to={isLoggedIn ? '/register-complaint' : '/login'} style={{
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  color: 'white', padding: '14px 32px', borderRadius: 14, fontWeight: 700,
                  fontSize: 14, textDecoration: 'none', boxShadow: '0 8px 24px rgba(22,163,74,.3)',
                  letterSpacing: '.02em', display: 'inline-flex', alignItems: 'center', gap: 8,
                  transition: 'transform .15s, box-shadow .15s',
                }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(22,163,74,.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 24px rgba(22,163,74,.3)'; }}>
                  📝 Submit Grievance
                </Link>
                <Link to={isLoggedIn ? '/dashboard' : '/login'} style={{
                  background: 'white',
                  color: '#064e3b', padding: '14px 28px', borderRadius: 14, fontWeight: 600,
                  fontSize: 14, textDecoration: 'none', border: '1px solid #d1d5db',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}>
                  🔍 Track Complaint
                </Link>
              </div>

              {/* Trust bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 36, flexWrap: 'wrap' }}>
                {['50K+ Citizens', '12K+ Resolved', '4.8★ Rating'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4b5563', fontSize: 13, fontWeight: 600 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right card stack */}
            <div style={{ flex: '0 1 400px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: 340 }}>
                {/* Background card */}
                <div style={{
                  position: 'absolute', top: 20, left: 20, right: -20,
                  background: 'rgba(255,255,255,.05)', borderRadius: 24, height: '100%',
                  border: '1px solid rgba(255,255,255,.08)',
                }} />
                {/* Main card */}
                <div style={{
                  background: 'rgba(255,255,255,.95)', borderRadius: 24, padding: 28,
                  backdropFilter: 'blur(20px)', position: 'relative', zIndex: 2,
                  boxShadow: '0 24px 80px rgba(0,0,0,.35)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#085041,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏙</div>
                    <div>
                      <p style={{ fontWeight: 700, color: '#1C1C1E', fontSize: 14 }}>MahaNagarSarthi</p>
                      <p style={{ fontSize: 11, color: '#8E8E93' }}>PCMC Grievance Portal</p>
                    </div>
                    <span style={{ marginLeft: 'auto', background: '#E1F5EE', color: '#085041', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100 }}>LIVE</span>
                  </div>

                  <div style={{ background: '#F5F5F7', borderRadius: 14, padding: '12px 16px', marginBottom: 12 }}>
                    <p style={{ fontSize: 10, color: '#8E8E93', fontWeight: 600, marginBottom: 4 }}>COMPLAINT SUBMITTED</p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#1C1C1E' }}>Water pipe leakage on main road</p>
                    <p style={{ fontSize: 11, color: '#8E8E93', marginTop: 2 }}>📍 Sector 12, Pimpri · Just now</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { label: 'Submitted', done: true },
                      { label: 'Assigned to Water Dept.', done: true },
                      { label: 'In Progress', done: true, active: true },
                      { label: 'Resolved', done: false },
                    ].map((step, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, animation: `slideInUpFade 0.6s ease ${0.2 + i * 0.15}s both` }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 700,
                          background: step.done ? (step.active ? '#1D9E75' : '#E1F5EE') : '#EBEBED',
                          color: step.done ? (step.active ? 'white' : '#085041') : '#8E8E93',
                          boxShadow: step.active ? '0 0 0 4px rgba(29,158,117,.2)' : 'none',
                        }}>
                          {step.done && !step.active ? '✓' : i + 1}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: step.active ? 700 : 500, color: step.done ? '#1C1C1E' : '#8E8E93' }}>{step.label}</span>
                        {step.active && <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: '#1D9E75', background: '#E1F5EE', padding: '2px 8px', borderRadius: 100 }}>NOW</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating badge */}
                <div style={{
                  position: 'absolute', bottom: -18, right: -14, zIndex: 3,
                  background: 'white', borderRadius: 14, padding: '10px 14px',
                  boxShadow: '0 8px 24px rgba(0,0,0,.15)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 18 }}>✅</span>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#1C1C1E' }}>Resolved in 18 hrs</p>
                    <p style={{ fontSize: 10, color: '#8E8E93' }}>GR-0042 · Roads</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" style={{ background: 'white', borderBottom: '1px solid #E5E5EA' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ background: '#E1F5EE', color: '#085041', fontSize: 11, fontWeight: 700, padding: '5px 16px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '.07em' }}>City Performance Metrics</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginTop: 14, color: '#1C1C1E' }}>PCMC At a Glance</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
            {[
              { value: '12450', suffix: '+', label: 'Complaints Resolved', icon: '✅', color: '#1D9E75' },
              { value: '1120', suffix: '', label: 'Active Issues', icon: '⏳', color: '#d97706' },
              { value: '24', suffix: ' Hrs', label: 'Avg. Response Time', icon: '⚡', color: '#2563eb' },
              { value: '4.8', suffix: '/5', label: 'Citizen Rating', icon: '⭐', color: '#b45309', decimals: 1 },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <p style={{ fontSize: 36, fontWeight: 800, color: s.color, lineHeight: 1, letterSpacing: '-0.02em' }}>
                  <StatNum value={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
                </p>
                <p style={{ fontSize: 13, color: '#8E8E93', fontWeight: 600, marginTop: 6, textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ background: '#E1F5EE', color: '#085041', fontSize: 11, fontWeight: 700, padding: '5px 16px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '.07em' }}>Simple Process</span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginTop: 14, color: '#1C1C1E' }}>How It Works</h2>
          <p style={{ color: '#8E8E93', marginTop: 8, maxWidth: 440, margin: '10px auto 0', fontSize: 15 }}>Three easy steps from complaint to resolution</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {[
            { step: '01', icon: '📱', title: 'Register & Login', desc: 'Create your account using your Aadhaar-linked mobile number with a simple OTP verification.', color: '#2563eb' },
            { step: '02', icon: '📤', title: 'Submit Your Grievance', desc: 'Select a category, pin your location on the map, attach a photo, and describe the issue.', color: '#1D9E75' },
            { step: '03', icon: '🔔', title: 'Track & Get Resolved', desc: 'Watch a Flipkart-style delivery timeline as authorities acknowledge, assign, and resolve your complaint.', color: '#d97706' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: 20, padding: 28,
              border: '1px solid #E5E5EA', boxShadow: '0 1px 3px rgba(0,0,0,.04)',
              transition: 'transform .15s, box-shadow .15s', cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,.04)'; }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{s.icon}</div>
                <span style={{ fontSize: 40, fontWeight: 800, color: s.color + '25', lineHeight: 1 }}>{s.step}</span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1C1C1E', marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: '#8E8E93', lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEPARTMENTS ── */}
      <section id="services" style={{ background: 'white', borderTop: '1px solid #E5E5EA', borderBottom: '1px solid #E5E5EA', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ background: '#FAEEDA', color: '#92400e', fontSize: 11, fontWeight: 700, padding: '5px 16px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '.07em' }}>All Departments</span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginTop: 14, color: '#1C1C1E' }}>What Can You Report?</h2>
            <p style={{ color: '#8E8E93', marginTop: 8, maxWidth: 400, margin: '10px auto 0', fontSize: 15 }}>All 10 municipal departments — fully covered</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
            {CATEGORIES.map((c, i) => (
              <div key={i} style={{
                background: c.bg, border: `1.5px solid ${c.color}20`, borderRadius: 18,
                padding: '22px 16px', textAlign: 'center',
                transition: 'transform .15s, box-shadow .15s', cursor: 'pointer',
              }}
                onClick={() => setSelectedWard(c)}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${c.color}25`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{c.emoji}</div>
                <p style={{ fontSize: 13, fontWeight: 700, color: c.color }}>{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENTLY RESOLVED ── */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span style={{ background: '#E1F5EE', color: '#085041', fontSize: 11, fontWeight: 700, padding: '5px 16px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '.07em', display: 'inline-block', marginBottom: 12 }}>Live Updates</span>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: '#1C1C1E' }}>Recently Resolved</h2>
          </div>
          <Link to={isLoggedIn ? '/dashboard' : '/login'} style={{ color: '#1D9E75', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>View all →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {RECENT.map((item, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: 18, padding: 20,
              border: '1px solid #E5E5EA', display: 'flex', alignItems: 'flex-start', gap: 14,
              boxShadow: '0 1px 3px rgba(0,0,0,.04)',
              transition: 'transform .15s', cursor: 'default',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}>
              <div style={{ width: 40, height: 40, borderRadius: 14, background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>✅</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: '#1D9E75', background: '#E1F5EE', padding: '2px 8px', borderRadius: 6 }}>{item.id}</span>
                  <span style={{ fontSize: 11, color: '#8E8E93' }}>{item.cat}</span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#1C1C1E', marginBottom: 4 }}>{item.title}</p>
                <p style={{ fontSize: 12, color: '#8E8E93' }}>📍 {item.location} · {item.days} days ago</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        background: 'linear-gradient(135deg, #05281e 0%, #085041 50%, #0d6e4f 100%)',
        padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'rgba(29,158,117,.1)', top: -200, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: 'white', marginBottom: 16 }}>
            Your City Needs Your Voice
          </h2>
          <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 16, lineHeight: 1.7, marginBottom: 36 }}>
            Join over 50,000 citizens actively improving Pimpri Chinchwad. Every complaint filed makes the city a little better.
          </p>
          {isLoggedIn ? (
            <Link to="/register-complaint" style={{
              display: 'inline-block', background: 'linear-gradient(135deg, #f39200, #e67e00)',
              color: 'white', padding: '16px 40px', borderRadius: 16,
              fontWeight: 800, fontSize: 15, textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(243,146,0,.4)', letterSpacing: '.02em',
            }}>📝 Submit a Complaint Now</Link>
          ) : (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" style={{
                display: 'inline-block', background: 'linear-gradient(135deg, #f39200, #e67e00)',
                color: 'white', padding: '16px 36px', borderRadius: 16,
                fontWeight: 800, fontSize: 15, textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(243,146,0,.4)',
              }}>🚀 Register for Free</Link>
              <Link to="/login" style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(10px)',
                color: 'white', padding: '16px 36px', borderRadius: 16,
                fontWeight: 700, fontSize: 15, textDecoration: 'none',
                border: '1px solid rgba(255,255,255,.2)',
              }}>Sign In →</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── WARD DETAILS MODAL ── */}
      {selectedWard && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: 24, paddingBottom: '10vh'
        }} onClick={() => setSelectedWard(null)}>
          <div style={{
            background: 'white', borderRadius: 24, width: '100%', maxWidth: 440,
            boxShadow: '0 24px 80px rgba(0,0,0,.2)', overflow: 'hidden', animation: 'slideInUpFade 0.3s ease both'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ background: selectedWard.bg, padding: '32px 24px', textAlign: 'center', position: 'relative' }}>
              <button onClick={() => setSelectedWard(null)} style={{
                position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%',
                background: 'white', border: 'none', fontSize: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8E8E93'
              }}>✕</button>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{selectedWard.emoji}</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: selectedWard.color }}>{selectedWard.label} Department</h3>
              <p style={{ color: '#4b5563', fontSize: 14, marginTop: 8, lineHeight: 1.5, maxWidth: 300, margin: '8px auto 0' }}>
                {selectedWard.desc}
              </p>
            </div>
            
            <div style={{ padding: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 12 }}>
                Point of Contact
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F5F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  👤
                </div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#1C1C1E' }}>{selectedWard.pocName}</p>
                  <p style={{ fontSize: 13, color: '#4b5563', marginBottom: 2 }}>{selectedWard.pocDesig}</p>
                  <p style={{ fontSize: 12, color: '#8E8E93' }}>{selectedWard.pocPhone} &nbsp;·&nbsp; {selectedWard.pocEmail}</p>
                </div>
              </div>

              <button onClick={handleStartGrievance} style={{
                width: '100%', padding: '16px', borderRadius: 14, background: selectedWard.color,
                color: 'white', border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                transition: 'opacity 0.2s', boxShadow: `0 8px 24px ${selectedWard.color}40`
              }} onMouseEnter={e => e.target.style.opacity = 0.9} onMouseLeave={e => e.target.style.opacity = 1}>
                Register Grievance for this Ward →
              </button>
              
              {!isLoggedIn && (
                <p style={{ textAlign: 'center', fontSize: 12, color: '#8E8E93', marginTop: 12 }}>
                  Note: You will be asked to log in before final submission.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        @keyframes lp-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
        @keyframes slideInUpFade { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
