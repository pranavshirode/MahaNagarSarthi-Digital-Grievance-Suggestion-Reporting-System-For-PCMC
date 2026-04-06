import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function SignupPage({ setIsLoggedIn, setIsAdmin, setLoggedInName }) {
  const [signupData, setSignupData] = useState({ name: '', mobile: '', password: '', confirm: '' });
  const [signupErrors, setSignupErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const mobileRegex = /^[6-9]\d{9}$/;
  const nameRegex = /^[a-zA-Z\s]{3,30}$/;

  const validateSignup = () => {
    const errs = {};
    if (!nameRegex.test(signupData.name)) errs.name = 'Enter a valid name (min 3 letters, letters only)';
    if (!mobileRegex.test(signupData.mobile)) errs.mobile = 'Enter a valid 10-digit Indian mobile number';
    if (signupData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (signupData.confirm !== signupData.password) errs.confirm = 'Passwords do not match';
    setSignupErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validateSignup()) return;
    setLoading(true);
    try {
      const user = await api.signup({ name: signupData.name, mobile: signupData.mobile, password: signupData.password });
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));
      setIsLoggedIn(true);
      setIsAdmin(false);
      setLoggedInName(user.name.split(' ')[0]);
      navigate('/dashboard');
    } catch (err) { setServerError(err.message || 'Signup failed'); }
    finally { setLoading(false); }
  };

  const inputStyle = (err) => ({
    width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 14,
    border: `1.5px solid ${err ? '#fc8181' : 'rgba(255,255,255,.15)'}`,
    background: 'rgba(255,255,255,.07)', color: 'white', outline: 'none',
    fontFamily: "'Outfit', sans-serif", boxSizing: 'border-box', transition: 'border .15s',
  });

  const FIELDS = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Priya Sharma' },
    { key: 'mobile', label: 'Mobile Number', type: 'tel', placeholder: '10-digit mobile number' },
    { key: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters' },
    { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: 'Re-enter your password' },
  ];

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', fontFamily: "'Outfit', sans-serif",
      background: 'linear-gradient(135deg, #05281e 0%, #073d2c 50%, #0a5c42 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Blobs */}
      <div style={{ position: 'absolute', width: 450, height: 450, borderRadius: '50%', background: 'rgba(29,158,117,.1)', top: -150, right: -100, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'rgba(29,158,117,.07)', bottom: -80, left: -80, pointerEvents: 'none' }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div style={{ margin: 'auto', padding: '40px 16px', width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        <div style={{ background: 'rgba(255,255,255,.06)', backdropFilter: 'blur(24px)', borderRadius: 24, border: '1px solid rgba(255,255,255,.12)', padding: '36px 32px', boxShadow: '0 32px 80px rgba(0,0,0,.5)' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: 'linear-gradient(135deg,#1D9E75,#085041)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: 'white', margin: '0 auto 12px', boxShadow: '0 8px 24px rgba(29,158,117,.4)' }}>M</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 4 }}>Create Account</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>Join MahaNagarSarthi today</p>
          </div>

          {serverError && (
            <div style={{ background: 'rgba(252,129,129,.15)', border: '1px solid rgba(252,129,129,.3)', borderRadius: 10, padding: '10px 14px', color: '#fc8181', fontSize: 13, marginBottom: 16 }}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FIELDS.map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input
                  type={f.type} placeholder={f.placeholder} value={signupData[f.key]}
                  onChange={e => { setSignupData({ ...signupData, [f.key]: e.target.value }); if (signupErrors[f.key]) setSignupErrors({ ...signupErrors, [f.key]: null }); }}
                  style={inputStyle(signupErrors[f.key])}
                  onFocus={e => e.currentTarget.style.borderColor = '#1D9E75'}
                  onBlur={e => e.currentTarget.style.borderColor = signupErrors[f.key] ? '#fc8181' : 'rgba(255,255,255,.15)'}
                />
                {signupErrors[f.key] && <p style={{ color: '#fc8181', fontSize: 11, marginTop: 4, fontWeight: 600 }}>{signupErrors[f.key]}</p>}
              </div>
            ))}

            {/* Terms note */}
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', textAlign: 'center', lineHeight: 1.5 }}>
              By creating an account you agree to our terms of service and civic data usage policy.
            </p>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #1D9E75, #085041)', color: 'white',
              fontSize: 14, fontWeight: 800, letterSpacing: '.04em',
              boxShadow: '0 8px 24px rgba(29,158,117,.4)', transition: 'all .15s',
              opacity: loading ? .7 : 1,
            }}>
              {loading ? 'Creating Account…' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,.4)', marginTop: 20 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#5DCAA5', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>

        <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,.35)', fontSize: 12, textDecoration: 'none' }}>← Back to Home</Link>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap'); ::placeholder{color:rgba(255,255,255,.3)!important;}`}</style>
    </div>
  );
}
