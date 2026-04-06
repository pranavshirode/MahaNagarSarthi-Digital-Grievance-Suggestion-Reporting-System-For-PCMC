import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './AdminDashboard';
import CitizenDashboard from './pages/CitizenDashboard';
import RegisterComplaint from './pages/RegisterComplaint';
import TrackComplaint from './pages/TrackComplaint';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedInName, setLoggedInName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsLoggedIn(true);
        setLoggedInName(user.name);
        setIsAdmin(user.role === 'admin');
      } catch (e) {
        console.error("Invalid user data in local storage");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setLoggedInName('');
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
        {!isAdmin && <Navbar isLoggedIn={isLoggedIn} loggedInName={loggedInName} handleLogout={handleLogout} />}

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn} />} />

            <Route path="/login" element={
              isLoggedIn ? <Navigate to={isAdmin ? "/admin" : "/dashboard"} /> :
                <LoginPage setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} setLoggedInName={setLoggedInName} />
            } />

            <Route path="/signup" element={
              isLoggedIn ? <Navigate to="/dashboard" /> :
                <SignupPage setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} setLoggedInName={setLoggedInName} />
            } />

            {/* Admin Route */}
            <Route path="/admin" element={
              isAdmin ? (
                <div className="min-h-screen bg-slate-50 w-full flex flex-col">
                  <div className="flex-grow">
                    <AdminDashboard />
                  </div>
                </div>
              ) : <Navigate to="/login" />
            } />

            {/* Citizen Feature Routes */}
            <Route path="/dashboard" element={
              isLoggedIn && !isAdmin ? <CitizenDashboard /> : <Navigate to="/login" />
            } />
            <Route path="/register-complaint" element={
              !isAdmin ? <RegisterComplaint isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} setLoggedInName={setLoggedInName} /> : <Navigate to="/admin" />
            } />
            <Route path="/track/:id" element={
              isLoggedIn && !isAdmin ? <TrackComplaint /> : <Navigate to="/login" />
            } />
          </Routes>
        </main>

        {!isAdmin && <Footer />}
      </div>
    </Router>
  );
}