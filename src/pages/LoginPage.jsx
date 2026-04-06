import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function LoginPage({ setIsLoggedIn, setIsAdmin, setLoggedInName, onLoginSuccess, onBack }) {
  const [mode, setMode] = useState('password');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [otpData, setOtpData] = useState({ mobile: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = {};
    if (!loginData.username.trim()) errs.username = 'Username or mobile number is required';
    if (loginData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    setLoginErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      const user = await api.login({ username: loginData.username, password: loginData.password });
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));
      setIsLoggedIn(true);
      setLoggedInName(user.name);
      if (user.role === 'admin') { setIsAdmin(true); } else { setIsAdmin(false); }
      if (onLoginSuccess) { onLoginSuccess(user); }
      else if (user.role === 'admin') { navigate('/admin'); }
      else { navigate('/dashboard'); }
    } catch (err) { setServerError(err.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  const handleSendOtp = async () => {
    setServerError('');
    if (!/^[6-9]\d{9}$/.test(otpData.mobile)) { setLoginErrors({ mobile: 'Enter a valid 10-digit Indian mobile number' }); return; }
    setSending(true);
    try {
      const res = await fetch(`${BASE}/send-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mobile: otpData.mobile }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOtpSent(true); setLoginErrors({});
    } catch (err) { setServerError(err.message); }
    finally { setSending(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setServerError('');
    if (otpData.otp.length !== 4) { setLoginErrors({ otp: 'Enter the 4-digit OTP' }); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/verify-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mobile: otpData.mobile, otp: otpData.otp }) });
      const user = await res.json();
      if (!res.ok) throw new Error(user.error);
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));
      setIsLoggedIn(true); setLoggedInName(user.name); setIsAdmin(false); 
      if (onLoginSuccess) { onLoginSuccess(user); }
      else { navigate('/dashboard'); }
    } catch (err) { setServerError(err.message); }
    finally { setLoading(false); }
  };

  const inputStyle = (err) => ({
    width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 14,
    border: `1.5px solid ${err ? '#ef4444' : '#e5e7eb'}`,
    background: '#f9fafb', color: '#1f2937', outline: 'none',
    fontFamily: "'Outfit', sans-serif", boxSizing: 'border-box',
    transition: 'border .15s',
  });

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', fontFamily: "'Outfit', sans-serif",
      background: 'linear-gradient(135deg, #e8f5ed 0%, #f7fbf9 50%, #dff0e6 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Blobs */}
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'rgba(22,163,74,.06)', top: -200, right: -150, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(22,163,74,.04)', bottom: -100, left: -80, pointerEvents: 'none' }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(0,0,0,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div style={{ margin: 'auto', padding: '40px 16px', width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(24px)', borderRadius: 24, border: '1px solid rgba(0,0,0,.05)', padding: '36px 32px', boxShadow: '0 24px 60px rgba(0,0,0,.08)' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', boxShadow: '0 8px 24px rgba(22,163,74,.2)' }}>
              <img src="https://www.pcmcindia.gov.in/images/logo.png" alt="PCMC" style={{ width: '130%', height: '130%', objectFit: 'cover', objectPosition: 'left center' }} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#064e3b', marginBottom: 4 }}>Welcome Back</h1>
            <p style={{ fontSize: 13, color: '#4b5563' }}>Login to MahaNagarSarthi</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', background: '#F5F5F7', borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {[['password', '🔑 Password'], ['otp', '📱 OTP Login']].map(([m, label]) => (
              <button key={m} onClick={() => { setMode(m); setServerError(''); }} style={{
                flex: 1, padding: '9px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 700, transition: 'all .15s',
                background: mode === m ? '#16a34a' : 'transparent',
                color: mode === m ? 'white' : '#6b7280',
                boxShadow: mode === m ? '0 4px 12px rgba(22,163,74,.3)' : 'none',
              }}>{label}</button>
            ))}
          </div>

          {serverError && (
            <div style={{ background: 'rgba(252,129,129,.15)', border: '1px solid rgba(252,129,129,.3)', borderRadius: 10, padding: '10px 14px', color: '#fc8181', fontSize: 13, marginBottom: 16 }}>
              {serverError}
            </div>
          )}

          {mode === 'password' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 10, padding: '8px 14px', color: '#16a34a', fontSize: 12, textAlign: 'center' }}>
                🛡 Admin? Use your admin username & password
              </div>
              {[
                { key: 'username', label: 'Username or Mobile Number', type: 'text', placeholder: 'e.g. 9876543210' },
                { key: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={loginData[f.key]}
                    onChange={e => { setLoginData({ ...loginData, [f.key]: e.target.value }); if (loginErrors[f.key]) setLoginErrors({ ...loginErrors, [f.key]: null }); }}
                    style={inputStyle(loginErrors[f.key])}
                    onFocus={e => e.currentTarget.style.borderColor = '#16a34a'}
                    onBlur={e => e.currentTarget.style.borderColor = loginErrors[f.key] ? '#ef4444' : '#e5e7eb'}
                  />
                  {loginErrors[f.key] && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4, fontWeight: 600 }}>{loginErrors[f.key]}</p>}
                </div>
              ))}
              <div style={{ textAlign: 'right' }}><a href="#" style={{ fontSize: 12, color: '#16a34a', textDecoration: 'none', fontWeight: 600 }}>Forgot Password?</a></div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white',
                fontSize: 14, fontWeight: 800, letterSpacing: '.04em',
                boxShadow: '0 8px 24px rgba(22,163,74,.4)', transition: 'all .15s',
                opacity: loading ? .7 : 1,
              }}>
                {loading ? 'Signing in…' : 'SIGN IN'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 10, padding: '8px 14px', color: '#16a34a', fontSize: 12, textAlign: 'center' }}>
                📱 Login with your Aadhaar-linked mobile number
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 6 }}>Mobile Number</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="tel" placeholder="10-digit mobile" value={otpData.mobile} disabled={otpSent}
                    onChange={e => { setOtpData({ ...otpData, mobile: e.target.value }); if (loginErrors.mobile) setLoginErrors({}); }}
                    style={{ ...inputStyle(loginErrors.mobile), flex: 1, opacity: otpSent ? .6 : 1 }}
                    onFocus={e => e.currentTarget.style.borderColor = '#16a34a'}
                    onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                  />
                  <button type="button" onClick={handleSendOtp} disabled={sending || otpSent} style={{
                    padding: '0 16px', borderRadius: 12, border: 'none', cursor: otpSent ? 'default' : 'pointer',
                    background: otpSent ? '#dcfce7' : 'linear-gradient(135deg,#16a34a,#15803d)',
                    color: otpSent ? '#16a34a' : 'white', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
                  }}>
                    {sending ? '…' : otpSent ? '✓ Sent' : 'Send OTP'}
                  </button>
                </div>
                {loginErrors.mobile && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4, fontWeight: 600 }}>{loginErrors.mobile}</p>}
              </div>

              {otpSent && (
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 6 }}>Enter OTP</label>
                  <input type="text" maxLength="4" placeholder="8877" value={otpData.otp} autoFocus
                    onChange={e => setOtpData({ ...otpData, otp: e.target.value.replace(/\D/g, '') })}
                    style={{ ...inputStyle(loginErrors.otp), textAlign: 'center', fontSize: 28, letterSpacing: '0.5em', fontFamily: 'monospace' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#16a34a'}
                    onBlur={e => e.currentTarget.style.borderColor = loginErrors.otp ? '#ef4444' : '#e5e7eb'}
                  />
                  {loginErrors.otp && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4, fontWeight: 600 }}>{loginErrors.otp}</p>}
                  <button type="button" onClick={() => { setOtpSent(false); setOtpData({ ...otpData, otp: '' }); }}
                    style={{ background: 'none', border: 'none', color: '#16a34a', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginTop: 6, padding: 0 }}>Resend OTP</button>
                </div>
              )}

              {otpSent && (
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white',
                  fontSize: 14, fontWeight: 800, letterSpacing: '.04em',
                  boxShadow: '0 8px 24px rgba(22,163,74,.4)', opacity: loading ? .7 : 1,
                }}>{loading ? 'Verifying…' : 'VERIFY & LOGIN'}</button>
              )}
            </form>
          )}

          <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 20 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#16a34a', fontWeight: 700, textDecoration: 'none' }}>Sign Up</Link>
          </p>
        </div>

        {onBack ? (
          <button onClick={onBack} style={{ display: 'block', background: 'none', border: 'none', margin: '20px auto 0', color: '#4b5563', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>← Back to Form</button>
        ) : (
          <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: 20, color: '#4b5563', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>← Back to Home</Link>
        )}
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap'); ::placeholder{color:#9ca3af!important;}`}</style>
    </div>
  );
}
