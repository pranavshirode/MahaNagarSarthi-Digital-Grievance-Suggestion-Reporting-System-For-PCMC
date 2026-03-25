import React, { useState } from 'react';

// ─── PASTE YOUR ADMIN DASHBOARD COMPONENT HERE ───────────────────────────────
// Import your AdminDashboard component like this:
import AdminDashboard from './AdminDashboard';
// For now we use a placeholder — replace with your real admin dashboard import.
/*const AdminDashboard = () => (
  <div style={{ fontFamily: 'sans-serif', padding: 32, color: '#1e293b' }}>
    <h1 style={{ color: '#2563eb' }}>🛡 Admin Dashboard</h1>
    <p>Replace this with your actual AdminDashboard component.</p>
    <p style={{ color: '#64748b', fontSize: 13 }}>
      Import and use: <code>import AdminDashboard from './AdminDashboard'</code>
    </p>
  </div>
);*/
// ─────────────────────────────────────────────────────────────────────────────

// ── ADMIN CREDENTIALS (change these to update credentials) ──
const ADMIN_USERNAME = 'admin1112';
const ADMIN_PASSWORD = 'admin$1112';

const App = () => {
  // ── Auth State ──
  const [isLoginOpen,  setIsLoginOpen]  = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoggedIn,   setIsLoggedIn]   = useState(false);
  const [isAdmin,      setIsAdmin]      = useState(false);
  const [loggedInName, setLoggedInName] = useState('');

  // ── Mobile menu ──
  const [menuOpen, setMenuOpen] = useState(false);

  // ── Form state ──
  const [loginData,  setLoginData]  = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', mobile: '', password: '', confirm: '' });
  const [loginErrors,  setLoginErrors]  = useState({});
  const [signupErrors, setSignupErrors] = useState({});
  const [loginSuccess, setLoginSuccess] = useState('');

  // ── Regex ──
  const mobileRegex = /^[6-9]\d{9}$/;
  const nameRegex   = /^[a-zA-Z\s]{3,30}$/;

  // ── Validate login ──
  const validateLogin = () => {
    const errs = {};
    if (!loginData.username.trim())        errs.username = 'Username or mobile number is required';
    if (loginData.password.length < 6)     errs.password = 'Password must be at least 6 characters';
    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Validate signup ──
  const validateSignup = () => {
    const errs = {};
    if (!nameRegex.test(signupData.name))          errs.name    = 'Enter a valid name (min 3 letters, letters only)';
    if (!mobileRegex.test(signupData.mobile))      errs.mobile  = 'Enter a valid 10-digit Indian mobile number';
    if (signupData.password.length < 6)            errs.password = 'Password must be at least 6 characters';
    if (signupData.confirm !== signupData.password) errs.confirm = 'Passwords do not match';
    setSignupErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Handle Login ──
  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    // ── ADMIN CHECK ──
    if (
      loginData.username === ADMIN_USERNAME &&
      loginData.password === ADMIN_PASSWORD
    ) {
      setIsAdmin(true);
      setIsLoggedIn(true);
      setIsLoginOpen(false);
      setLoginData({ username: '', password: '' });
      setLoginErrors({});
      return;
    }

    // ── CITIZEN LOGIN (accepts mobile as username) ──
    setIsLoggedIn(true);
    setIsAdmin(false);
    setLoggedInName('Citizen');
    setIsLoginOpen(false);
    setLoginData({ username: '', password: '' });
    setLoginErrors({});
  };

  // ── Handle Signup ──
  const handleSignup = (e) => {
    e.preventDefault();
    if (!validateSignup()) return;
    setIsLoggedIn(true);
    setIsAdmin(false);
    setLoggedInName(signupData.name.split(' ')[0]);
    setIsSignUpOpen(false);
    setSignupData({ name: '', mobile: '', password: '', confirm: '' });
    setSignupErrors({});
  };

  // ── Logout ──
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setLoggedInName('');
    setMenuOpen(false);
  };

  // ── If admin is logged in, render Admin Dashboard ──
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Thin admin top bar with logout */}
        <div className="bg-slate-900 text-white text-xs flex items-center justify-between px-6 py-2">
          <span className="text-slate-400">
            Logged in as <span className="text-blue-400 font-bold">Administrator</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 font-semibold transition-colors"
          >
            ⏻ Logout
          </button>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CITIZEN / PUBLIC LANDING PAGE
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen bg-slate-50 font-sans text-slate-900 ${(isLoginOpen || isSignUpOpen) ? 'overflow-hidden' : ''}`}>

      {/* ── 1. LOGIN MODAL ── */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
            <button
              onClick={() => { setIsLoginOpen(false); setLoginErrors({}); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl z-10"
            >
              &times;
            </button>

            {/* Modal header */}
            <div className="bg-[#0ea5e9] p-8 text-center text-white">
              <div className="bg-[#f39200] w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg text-2xl font-black text-white">M</div>
              <h3 className="text-2xl font-bold">Welcome Back</h3>
              <p className="text-white/70 text-sm mt-1">Login to MahaNagarSarthi</p>
            </div>

            {/* Admin hint */}
            <div className="mx-8 mt-5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-xs text-blue-700 font-medium text-center">
              🛡 Admin? Use your admin username &amp; password to access the Admin Panel.
            </div>

            <form onSubmit={handleLogin} className="p-8 space-y-4">
              {/* Username / Mobile */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                  Username or Mobile Number
                </label>
                <input
                  name="username"
                  type="text"
                  placeholder="e.g. 9876543210 or vijay_patil_18"
                  value={loginData.username}
                  onChange={e => {
                    setLoginData({ ...loginData, username: e.target.value });
                    if (loginErrors.username) setLoginErrors({ ...loginErrors, username: null });
                  }}
                  className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-colors
                    ${loginErrors.username ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-[#0ea5e9] bg-slate-50'}`}
                />
                {loginErrors.username && <p className="text-red-500 text-xs mt-1 font-semibold">{loginErrors.username}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={e => {
                    setLoginData({ ...loginData, password: e.target.value });
                    if (loginErrors.password) setLoginErrors({ ...loginErrors, password: null });
                  }}
                  className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-colors
                    ${loginErrors.password ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-[#0ea5e9] bg-slate-50'}`}
                />
                {loginErrors.password && <p className="text-red-500 text-xs mt-1 font-semibold">{loginErrors.password}</p>}
              </div>

              <div className="text-right">
                <a href="#" className="text-xs text-[#0ea5e9] hover:underline font-semibold">Forgot Password?</a>
              </div>

              <button
                type="submit"
                className="w-full bg-[#f39200] text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-all text-sm tracking-wider"
              >
                SIGN IN
              </button>

              <p className="text-center text-xs text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsLoginOpen(false); setIsSignUpOpen(true); setLoginErrors({}); }}
                  className="text-[#0ea5e9] font-bold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* ── 2. SIGN UP MODAL ── */}
      {isSignUpOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative my-4">
            <button
              onClick={() => { setIsSignUpOpen(false); setSignupErrors({}); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl z-10"
            >
              &times;
            </button>

            <div className="bg-[#f39200] p-8 text-center text-white">
              <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg text-[#f39200] font-black text-2xl">M</div>
              <h3 className="text-2xl font-bold">Create Account</h3>
              <p className="text-white/80 text-sm mt-1">Join MahaNagarSarthi today</p>
            </div>

            <form onSubmit={handleSignup} className="p-8 space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={signupData.name}
                  onChange={e => {
                    setSignupData({ ...signupData, name: e.target.value });
                    if (signupErrors.name) setSignupErrors({ ...signupErrors, name: null });
                  }}
                  className={`w-full px-4 py-3 rounded-xl border outline-none text-sm
                    ${signupErrors.name ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-[#f39200] bg-slate-50'}`}
                />
                {signupErrors.name && <p className="text-red-500 text-xs mt-1 font-semibold">{signupErrors.name}</p>}
              </div>

              {/* Mobile */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={signupData.mobile}
                  onChange={e => {
                    setSignupData({ ...signupData, mobile: e.target.value });
                    if (signupErrors.mobile) setSignupErrors({ ...signupErrors, mobile: null });
                  }}
                  className={`w-full px-4 py-3 rounded-xl border outline-none text-sm
                    ${signupErrors.mobile ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-[#f39200] bg-slate-50'}`}
                />
                {signupErrors.mobile && <p className="text-red-500 text-xs mt-1 font-semibold">{signupErrors.mobile}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Password</label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={signupData.password}
                  onChange={e => {
                    setSignupData({ ...signupData, password: e.target.value });
                    if (signupErrors.password) setSignupErrors({ ...signupErrors, password: null });
                  }}
                  className={`w-full px-4 py-3 rounded-xl border outline-none text-sm
                    ${signupErrors.password ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-[#f39200] bg-slate-50'}`}
                />
                {signupErrors.password && <p className="text-red-500 text-xs mt-1 font-semibold">{signupErrors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={signupData.confirm}
                  onChange={e => {
                    setSignupData({ ...signupData, confirm: e.target.value });
                    if (signupErrors.confirm) setSignupErrors({ ...signupErrors, confirm: null });
                  }}
                  className={`w-full px-4 py-3 rounded-xl border outline-none text-sm
                    ${signupErrors.confirm ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-[#f39200] bg-slate-50'}`}
                />
                {signupErrors.confirm && <p className="text-red-500 text-xs mt-1 font-semibold">{signupErrors.confirm}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-[#0ea5e9] text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-sky-600 transition-all text-sm tracking-wider"
              >
                CREATE ACCOUNT
              </button>

              <p className="text-center text-xs text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUpOpen(false); setIsLoginOpen(true); setSignupErrors({}); }}
                  className="text-[#f39200] font-bold hover:underline"
                >
                  Login
                </button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* ── 3. NAVBAR ── */}
      <nav className="bg-[#0ea5e9] text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-[#f39200] p-1 rounded shadow-md">
              <div className="w-9 h-9 flex items-center justify-center text-white font-black text-xl">M</div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-none">MahaNagarSarthi</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-semibold">PCMC Smart City Initiative</p>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-bold">
            <a href="#home"       className="hover:text-[#f39200] transition-colors">HOME</a>
            <a href="#how-it-works" className="hover:text-[#f39200] transition-colors">HOW IT WORKS</a>
            <a href="#services"   className="hover:text-[#f39200] transition-colors">SERVICES</a>
            <a href="#stats"      className="hover:text-[#f39200] transition-colors">STATS</a>

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="bg-white/20 px-3 py-1 rounded text-xs uppercase tracking-widest">
                  👤 {loggedInName || 'Citizen'}
                </span>
                <button onClick={handleLogout} className="hover:text-orange-300 transition-colors uppercase">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => setIsSignUpOpen(true)} className="hover:text-[#f39200] transition-colors uppercase">
                  Sign Up
                </button>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-[#f39200] text-white px-6 py-2 rounded shadow-md hover:bg-orange-600 transition-all uppercase font-bold tracking-wider"
                >
                  Login
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white text-2xl focus:outline-none"
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-[#0284c7] border-t border-white/10 px-6 py-4 space-y-3 text-sm font-bold">
            {['HOME','HOW IT WORKS','SERVICES','STATS'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g,'-')}`}
                onClick={() => setMenuOpen(false)}
                className="block hover:text-[#f39200] transition-colors py-1"
              >
                {item}
              </a>
            ))}
            <div className="border-t border-white/20 pt-3 space-y-2">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="block w-full text-left hover:text-orange-300">Logout</button>
              ) : (
                <>
                  <button onClick={() => { setIsSignUpOpen(true); setMenuOpen(false); }} className="block w-full text-left hover:text-[#f39200]">Sign Up</button>
                  <button onClick={() => { setIsLoginOpen(true); setMenuOpen(false); }} className="block w-full bg-[#f39200] text-white px-4 py-2 rounded text-center">Login</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ── 4. HERO SECTION ── */}
      <header id="home" className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-[#0ea5e9]/10 text-[#0ea5e9] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-[#0ea5e9]/20">
              🏙 PCMC Smart City Initiative
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-5 leading-tight">
              Building a Better{' '}
              <span className="text-[#0ea5e9]">Pimpri Chinchwad</span>{' '}
              <span className="text-[#f39200]">Together.</span>
            </h2>
            <p className="text-base text-slate-500 mb-8 max-w-xl leading-relaxed">
              Report civic issues, suggest improvements, and track real-time progress.
              Your voice directly reaches the municipal authority.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button
                onClick={() => isLoggedIn ? null : setIsLoginOpen(true)}
                className="bg-[#0ea5e9] text-white px-8 py-3.5 rounded-lg font-bold shadow-lg hover:bg-sky-600 transition-all transform hover:-translate-y-0.5 text-sm tracking-wide"
              >
                📝 Submit Grievance
              </button>
              <button
                onClick={() => isLoggedIn ? null : setIsLoginOpen(true)}
                className="bg-white border-2 border-[#0ea5e9] text-[#0ea5e9] px-8 py-3.5 rounded-lg font-bold hover:bg-sky-50 transition-all text-sm tracking-wide"
              >
                🔍 Track My Complaint
              </button>
            </div>
          </div>

          {/* Hero illustration (SVG) */}
          <div className="flex-1 flex justify-center">
            <svg viewBox="0 0 360 280" className="w-full max-w-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Sky */}
              <rect width="360" height="280" rx="16" fill="#f0f9ff"/>
              {/* Buildings */}
              <rect x="20"  y="100" width="50" height="130" rx="4" fill="#bae6fd"/>
              <rect x="30"  y="90"  width="30" height="15"  rx="2" fill="#0ea5e9"/>
              <rect x="25"  y="115" width="10" height="12"  rx="1" fill="#0284c7" opacity=".6"/>
              <rect x="40"  y="115" width="10" height="12"  rx="1" fill="#0284c7" opacity=".6"/>
              <rect x="25"  y="135" width="10" height="12"  rx="1" fill="#0284c7" opacity=".6"/>
              <rect x="40"  y="135" width="10" height="12"  rx="1" fill="#0284c7" opacity=".6"/>
              <rect x="25"  y="155" width="10" height="12"  rx="1" fill="#0284c7" opacity=".6"/>
              <rect x="40"  y="155" width="10" height="12"  rx="1" fill="#0284c7" opacity=".6"/>

              <rect x="80"  y="70"  width="70" height="160" rx="4" fill="#7dd3fc"/>
              <rect x="90"  y="58"  width="50" height="16"  rx="2" fill="#0ea5e9"/>
              <rect x="86"  y="88"  width="14" height="14"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="106" y="88"  width="14" height="14"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="126" y="88"  width="14" height="14"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="86"  y="110" width="14" height="14"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="106" y="110" width="14" height="14"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="126" y="110" width="14" height="14"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="86"  y="132" width="14" height="14"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="106" y="132" width="14" height="14"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="126" y="132" width="14" height="14"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="100" y="195" width="20" height="35"  rx="2" fill="#0369a1"/>

              <rect x="165" y="90"  width="55" height="140" rx="4" fill="#bae6fd"/>
              <rect x="174" y="78"  width="37" height="16"  rx="2" fill="#f59e0b"/>
              <rect x="170" y="105" width="12" height="12"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="188" y="105" width="12" height="12"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="206" y="105" width="12" height="12"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="170" y="124" width="12" height="12"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="188" y="124" width="12" height="12"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="206" y="124" width="12" height="12"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="183" y="195" width="16" height="35"  rx="2" fill="#0369a1"/>

              <rect x="235" y="80"  width="65" height="150" rx="4" fill="#7dd3fc"/>
              <rect x="245" y="68"  width="45" height="16"  rx="2" fill="#0ea5e9"/>
              <rect x="240" y="96"  width="13" height="13"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="260" y="96"  width="13" height="13"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="280" y="96"  width="13" height="13"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="240" y="116" width="13" height="13"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="260" y="116" width="13" height="13"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="280" y="116" width="13" height="13"  rx="1" fill="#0284c7" opacity=".5"/>
              <rect x="255" y="195" width="18" height="35"  rx="2" fill="#0369a1"/>

              {/* Road */}
              <rect x="0" y="228" width="360" height="52" rx="0" fill="#cbd5e1"/>
              <rect x="0" y="234" width="360" height="3"  fill="#94a3b8" opacity=".4"/>
              {/* Road dashes */}
              <rect x="40"  y="251" width="30" height="4" rx="2" fill="white" opacity=".6"/>
              <rect x="100" y="251" width="30" height="4" rx="2" fill="white" opacity=".6"/>
              <rect x="160" y="251" width="30" height="4" rx="2" fill="white" opacity=".6"/>
              <rect x="220" y="251" width="30" height="4" rx="2" fill="white" opacity=".6"/>
              <rect x="290" y="251" width="30" height="4" rx="2" fill="white" opacity=".6"/>

              {/* Complaint pin */}
              <g transform="translate(192,38)">
                <circle cx="0" cy="0" r="18" fill="#f59e0b" opacity=".2"/>
                <circle cx="0" cy="0" r="13" fill="#f59e0b"/>
                <text x="0" y="5" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">!</text>
              </g>

              {/* Check badge */}
              <g transform="translate(310,150)">
                <circle cx="0" cy="0" r="18" fill="#22c55e" opacity=".15"/>
                <circle cx="0" cy="0" r="13" fill="#22c55e"/>
                <text x="0" y="5" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">✓</text>
              </g>

              {/* Tree */}
              <ellipse cx="340" cy="210" rx="14" ry="18" fill="#86efac"/>
              <rect   x="337"  cy="226" width="6" height="14" rx="1" fill="#166534" y="226"/>
            </svg>
          </div>
        </div>
      </header>

      {/* ── 5. STATS SECTION ── */}
      <section id="stats" className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Complaints Resolved', value: '12,450+', color: 'text-green-600',  icon: '✅', bg: 'bg-green-50' },
            { label: 'Active Issues',       value: '1,120',   color: 'text-orange-500', icon: '⏳', bg: 'bg-orange-50' },
            { label: 'Avg. Response Time',  value: '24 Hrs',  color: 'text-sky-600',    icon: '⚡', bg: 'bg-sky-50' },
            { label: 'Citizen Rating',      value: '4.8 / 5', color: 'text-yellow-500', icon: '⭐', bg: 'bg-yellow-50' },
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} p-6 rounded-2xl border border-slate-100 text-center hover:shadow-md transition-all hover:-translate-y-1`}>
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs uppercase tracking-widest text-slate-400 mt-1 font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-white border-y border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#0ea5e9]/10 text-[#0ea5e9] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">Simple Process</span>
            <h2 className="text-3xl font-black text-slate-900">How It Works</h2>
            <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">Three easy steps to report and track your civic complaint</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-[#0ea5e9]/20 z-0" />
            {[
              { step: '01', icon: '📝', title: 'Register & Login',       desc: 'Create your free account using your mobile number and verify your identity.' },
              { step: '02', icon: '📤', title: 'Submit Your Grievance',  desc: 'Describe your issue, select a category, attach a photo and pin the location.' },
              { step: '03', icon: '🔔', title: 'Track & Get Resolved',   desc: 'Receive real-time status updates as authorities review and resolve your complaint.' },
            ].map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
                <div className="w-16 h-16 bg-[#0ea5e9] text-white rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg shadow-sky-200">
                  {s.icon}
                </div>
                <span className="text-xs font-black text-[#f39200] tracking-widest mb-1">STEP {s.step}</span>
                <h3 className="text-base font-bold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. SERVICES / CATEGORIES ── */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="inline-block bg-[#f39200]/10 text-[#f39200] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">Departments</span>
          <h2 className="text-3xl font-black text-slate-900">What Can You Report?</h2>
          <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">We handle civic complaints across all municipal departments</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { icon: '🛣', label: 'Roads',       color: 'bg-blue-50   border-blue-100  text-blue-700'  },
            { icon: '💧', label: 'Water',        color: 'bg-cyan-50   border-cyan-100  text-cyan-700'  },
            { icon: '🗑', label: 'Sanitation',   color: 'bg-amber-50  border-amber-100 text-amber-700' },
            { icon: '⚡', label: 'Electricity',  color: 'bg-purple-50 border-purple-100 text-purple-700'},
            { icon: '🌳', label: 'Parks',        color: 'bg-green-50  border-green-100 text-green-700' },
            { icon: '📋', label: 'Other',        color: 'bg-slate-50  border-slate-200 text-slate-700' },
          ].map((s, i) => (
            <div key={i} className={`${s.color} border rounded-2xl p-5 flex flex-col items-center gap-2 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer`}>
              <span className="text-3xl">{s.icon}</span>
              <span className="text-xs font-bold tracking-wide">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. RECENT ACTIVITY ── */}
      <section className="bg-white border-y border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">Live Updates</span>
            <h2 className="text-2xl font-black text-slate-900">Recently Resolved</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'GR-011', title: 'Missing road dividers on NH', location: 'Viman Nagar', cat: 'Roads', time: '2 days ago' },
              { id: 'GR-007', title: 'Water pipe leakage at MG Rd', location: 'Katraj',      cat: 'Water', time: '4 days ago' },
              { id: 'GR-003', title: 'Streetlights not working',    location: 'Baner',        cat: 'Electricity', time: '5 days ago' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">✓</div>
                <div>
                  <p className="text-xs font-bold text-green-700">{item.id} · {item.cat}</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">📍 {item.location} · {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. CTA BANNER ── */}
      <section className="bg-[#0ea5e9] py-14">
        <div className="max-w-2xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-black mb-3">Your City Needs Your Voice</h2>
          <p className="text-white/80 text-sm mb-7 leading-relaxed">
            Join over 50,000 citizens actively improving Pimpri Chinchwad. Every complaint filed makes the city better.
          </p>
          {isLoggedIn ? (
            <button className="bg-[#f39200] text-white px-10 py-3.5 rounded-lg font-bold shadow-xl hover:bg-orange-600 transition-all text-sm">
              📝 Submit a Complaint Now
            </button>
          ) : (
            <button
              onClick={() => setIsSignUpOpen(true)}
              className="bg-[#f39200] text-white px-10 py-3.5 rounded-lg font-bold shadow-xl hover:bg-orange-600 transition-all text-sm"
            >
              🚀 Register for Free
            </button>
          )}
        </div>
      </section>

      {/* ── 10. FOOTER ── */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-[#f39200] w-8 h-8 rounded flex items-center justify-center font-black text-white">M</div>
                <span className="font-bold text-base">MahaNagarSarthi</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                A PCMC Smart City initiative to bridge citizens and municipal authorities for faster civic issue resolution.
              </p>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-sm mb-3 text-white/80 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                {['Submit Grievance','Track Status','How It Works','Services','About PCMC'].map(l => (
                  <li key={l}><a href="#" className="hover:text-[#f39200] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            {/* Departments */}
            <div>
              <h4 className="font-bold text-sm mb-3 text-white/80 uppercase tracking-wider">Departments</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                {['Roads & Infrastructure','Water Supply','Sanitation','Electricity','Parks & Gardens','General'].map(d => (
                  <li key={d}><a href="#" className="hover:text-[#f39200] transition-colors">{d}</a></li>
                ))}
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="font-bold text-sm mb-3 text-white/80 uppercase tracking-wider">Contact</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>📞 020-2742-5600</li>
                <li>📧 grievance@pcmcindia.gov.in</li>
                <li>📍 PCMC Main Building, Pimpri, Pune – 411018</li>
                <li className="pt-1">
                  <span className="text-[#f39200] font-bold">Helpline: 1800-XXX-XXXX</span><br/>
                  <span className="text-[10px]">Mon–Sat, 9am–6pm</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>© 2026 Pimpri Chinchwad Municipal Corporation. All Rights Reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-white transition-colors">RTI</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;