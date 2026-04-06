import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ isLoggedIn, loggedInName, handleLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const NAV_LINKS = [
    { label: 'Home', href: isLoggedIn ? '/dashboard' : '/#home' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Departments', href: '/#services' },
    { label: 'Stats', href: '/#stats' },
  ];

  const baseStyle = {
    position: 'sticky', top: 0, zIndex: 50,
    fontFamily: "'Outfit', sans-serif",
    transition: 'all .25s ease',
    background: scrolled
      ? 'rgba(5,40,30,.95)'
      : 'linear-gradient(180deg, rgba(5,40,30,.92) 0%, rgba(5,40,30,.75) 100%)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: scrolled ? '1px solid rgba(29,158,117,.2)' : '1px solid transparent',
    boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,.3)' : 'none',
  };

  return (
    <nav style={baseStyle}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(29,158,117,.4)', background: 'white',
          }}>
            <img src="https://www.pcmcindia.gov.in/images/logo.png" alt="PCMC Logo" style={{ width: '130%', height: '130%', objectFit: 'cover', objectPosition: 'left center' }} />
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: 'white', lineHeight: 1.1, letterSpacing: '-.01em' }}>MahaNagarSarthi</p>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,.5)', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 600 }}>PCMC Smart City</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav-hidden">
          {/* hidden via CSS override below */}
        </div>

        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {NAV_LINKS.map(link => (
            <a key={link.label} href={link.href} style={{
              color: 'rgba(255,255,255,.7)', textDecoration: 'none', fontSize: 13, fontWeight: 600,
              letterSpacing: '.02em', transition: 'color .15s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#5DCAA5'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.7)'}>
              {link.label}
            </a>
          ))}

          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,.15)' }} />

          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link to="/dashboard" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(29,158,117,.2)', border: '1px solid rgba(29,158,117,.35)',
                borderRadius: 10, padding: '7px 14px', textDecoration: 'none',
                color: '#5DCAA5', fontSize: 13, fontWeight: 700,
              }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#1D9E75,#085041)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'white', fontWeight: 800 }}>
                  {(loggedInName || 'C').charAt(0).toUpperCase()}
                </span>
                {loggedInName || 'Dashboard'}
              </Link>
              <button onClick={handleLogout} style={{
                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 10, padding: '7px 14px', color: '#fca5a5',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 6
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,68,68,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#fca5a5'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Link to="/signup" style={{
                color: 'rgba(255,255,255,.7)', textDecoration: 'none', fontSize: 13, fontWeight: 600,
                padding: '7px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,.15)',
                transition: 'all .15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.15)'; }}>
                Sign Up
              </Link>
              <Link to="/login" style={{
                background: 'linear-gradient(135deg, #1D9E75, #0a5c42)',
                color: 'white', textDecoration: 'none', fontSize: 13, fontWeight: 700,
                padding: '7px 20px', borderRadius: 10,
                boxShadow: '0 4px 12px rgba(29,158,117,.35)',
                transition: 'all .15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 18px rgba(29,158,117,.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(29,158,117,.35)'; e.currentTarget.style.transform = ''; }}>
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="nav-mobile-btn"
          style={{
            background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)',
            borderRadius: 10, width: 40, height: 40, cursor: 'pointer',
            display: 'none', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 18,
          }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Secondary Nav for Wards */}
      <div style={{
        background: 'rgba(5,40,30,.98)',
        borderTop: '1px solid rgba(255,255,255,.05)',
        borderBottom: '1px solid rgba(255,255,255,.05)',
        display: 'flex', alignItems: 'center', overflowX: 'auto', whiteSpace: 'nowrap',
        padding: '8px 24px', gap: 24, fontSize: 12, fontWeight: 600,
        color: 'rgba(255,255,255,.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#5DCAA5' }}>
          <span style={{ fontSize: 14 }}>📍</span> Departments:
        </div>
        {['Roads', 'Water', 'Hygiene', 'Electricity', 'Hospital', 'Transport', 'Tax', 'Drainage'].map(ward => (
          <Link key={ward} to={`/register-complaint`} state={{ category: ward }} style={{
            color: 'inherit', textDecoration: 'none', transition: 'color .15s',
          }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'inherit'}>
            {ward}
          </Link>
        ))}
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          background: 'rgba(5,40,30,.98)', borderTop: '1px solid rgba(29,158,117,.15)',
          padding: '16px 24px 20px',
        }}>
          {NAV_LINKS.map(link => (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} style={{
              display: 'block', color: 'rgba(255,255,255,.7)', textDecoration: 'none',
              fontSize: 14, fontWeight: 600, padding: '10px 0',
              borderBottom: '1px solid rgba(255,255,255,.06)',
            }}>{link.label}</a>
          ))}
          <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {isLoggedIn ? (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={{
                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5', borderRadius: 12, padding: '12px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/signup" onClick={() => setMenuOpen(false)} style={{
                  display: 'block', textAlign: 'center', color: 'rgba(255,255,255,.7)',
                  border: '1px solid rgba(255,255,255,.2)', borderRadius: 12, padding: '12px',
                  textDecoration: 'none', fontWeight: 700, fontSize: 14,
                }}>Sign Up</Link>
                <Link to="/login" onClick={() => setMenuOpen(false)} style={{
                  display: 'block', textAlign: 'center',
                  background: 'linear-gradient(135deg, #1D9E75, #085041)',
                  color: 'white', borderRadius: 12, padding: '12px',
                  textDecoration: 'none', fontWeight: 700, fontSize: 14,
                }}>Login</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        @media(min-width:768px){ .nav-mobile-btn{display:none!important} }
        @media(max-width:767px){ .nav-desktop{display:none!important} .nav-mobile-btn{display:flex!important} }
      `}</style>
    </nav>
  );
}
