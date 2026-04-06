import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const colHead = { fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 14, display: 'block' };
  const linkStyle = { color: 'rgba(255,255,255,.45)', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 8, transition: 'color .15s' };

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #05281e 0%, #031a13 100%)',
      borderTop: '1px solid rgba(29,158,117,.15)',
      fontFamily: "'Outfit', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(29,158,117,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(29,158,117,.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px 32px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,.07)' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg,#1D9E75,#085041)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'white', boxShadow: '0 4px 12px rgba(29,158,117,.3)' }}>M</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: 'white', lineHeight: 1 }}>MahaNagarSarthi</p>
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 2 }}>PCMC Smart City</p>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', lineHeight: 1.7, maxWidth: 220 }}>
              Bridging citizens and municipal authorities for faster, transparent civic issue resolution in Pimpri Chinchwad.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {['𝕏', 'in', 'f'].map(icon => (
                <div key={icon} style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.45)', fontSize: 13, cursor: 'pointer' }}>{icon}</div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <span style={colHead}>Quick Links</span>
            {[
              { label: 'Submit Grievance', to: '/register-complaint' },
              { label: 'Track My Complaint', to: '/dashboard' },
              { label: 'How It Works', to: '/#how-it-works' },
              { label: 'Departments', to: '/#services' },
              { label: 'About PCMC', to: '#' },
            ].map(l => (
              <a key={l.label} href={l.to} style={linkStyle}
                onMouseEnter={e => e.currentTarget.style.color = '#5DCAA5'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.45)'}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Departments */}
          <div>
            <span style={colHead}>Departments</span>
            {['Roads & Infrastructure', 'Water Supply', 'Waste Management', 'Electricity Board', 'Public Transport', 'Hospitals & Health'].map(d => (
              <a key={d} href="#" style={linkStyle}
                onMouseEnter={e => e.currentTarget.style.color = '#5DCAA5'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.45)'}>
                {d}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <span style={colHead}>Contact</span>
            {[
              { icon: '📞', text: '020-2742-5600' },
              { icon: '📧', text: 'grievance@pcmcindia.gov.in' },
              { icon: '📍', text: 'PCMC Building, Pimpri, Pune – 411018' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
            <div style={{ marginTop: 12, background: 'rgba(29,158,117,.15)', border: '1px solid rgba(29,158,117,.25)', borderRadius: 10, padding: '10px 14px' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#5DCAA5' }}>Helpline: 1800-200-0000</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>Mon–Sat, 9am–6pm</p>
            </div>
          </div>
        </div>

        {/* Developers Section */}
        <div style={{ padding: '32px 0 24px', borderBottom: '1px solid rgba(255,255,255,.07)', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 12 }}>
            Developed By
          </p>
          <p style={{ fontSize: 14, color: 'white', fontWeight: 600, marginBottom: 12 }}>
            IIT Department, PCCOE College
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <a href="https://www.linkedin.com/in/pranav-shirode-8b91252b2" target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#5DCAA5', textDecoration: 'none', fontWeight: 500 }}>Pranav Shirode</a>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,.2)' }}>|</span>
            <span style={{ fontSize: 13, color: '#5DCAA5', fontWeight: 500 }}>Vijay Jathare</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,.2)' }}>|</span>
            <span style={{ fontSize: 13, color: '#5DCAA5', fontWeight: 500 }}>Sarvadnya Chaudhari</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,.2)' }}>|</span>
            <span style={{ fontSize: 13, color: '#5DCAA5', fontWeight: 500 }}>Omreaje Shelkhe</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ paddingTop: 24, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>© 2026 Pimpri Chinchwad Municipal Corporation. All Rights Reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Use', 'RTI'].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,.3)', textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#5DCAA5'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.3)'}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
