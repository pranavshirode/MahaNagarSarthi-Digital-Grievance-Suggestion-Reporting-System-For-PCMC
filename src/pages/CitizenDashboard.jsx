import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyComplaints } from '../services/complaintService';
import './CitizenDashboard.css';

const STATUS_CONFIG = {
  submitted: { label: "Submitted", cls: "badge-submitted", dot: "#888780" },
  acknowledged: { label: "Acknowledged", cls: "badge-acknowledged", dot: "#378ADD" },
  assigned: { label: "Assigned", cls: "badge-assigned", dot: "#534AB7" },
  in_progress: { label: "In Progress", cls: "badge-progress", dot: "#BA7517" },
  resolved: { label: "Resolved", cls: "badge-resolved", dot: "#1D9E75" },
  closed: { label: "Closed", cls: "badge-resolved", dot: "#1D9E75" },
  rejected: { label: "Rejected", cls: "badge-rejected", dot: "#E24B4A" },
};

const CAT_ICONS = { water: "💧", electricity: "⚡", tax: "🏛️", hospital: "🏥", hygiene: "🧹", public_transport: "🚌", roads: "🛣️", drainage: "🌊", street_lights: "💡", parks: "🌳", other: "📋" };
const PENDING = ["submitted", "acknowledged", "assigned"];

function timeAgo(iso) {
  if (!iso) return "";
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return d + "d ago";
  return Math.floor(d / 30) + "mo ago";
}

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Citizen' };

  useEffect(() => {
    getMyComplaints()
      .then(data => setComplaints(data))
      .catch(err => console.error("Error fetching complaints:", err))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: complaints.length,
    resolved: complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length,
    pending: complaints.filter(c => PENDING.includes(c.status)).length,
    active: complaints.filter(c => c.status === 'in_progress').length,
  };
  const resolveRate = stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0;

  const catCounts = {};
  complaints.forEach(c => { catCounts[c.category] = (catCounts[c.category] || 0) + 1; });
  const sortedCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const filteredComplaints = complaints.filter(c => {
    if (filter === "all") return true;
    if (filter === "pending") return PENDING.includes(c.status);
    if (filter === "in_progress") return c.status === "in_progress";
    if (filter === "resolved") return c.status === "resolved" || c.status === "closed";
    return true;
  });

  return (
    <div className="dashboard-wrapper">
      <div className="home-page">
        <header className="home-header">
          <div className="header-top">
            <div>
              <p className="greeting-text">Good morning,</p>
              <h1 className="user-name">{user.name}</h1>
            </div>
            <button className="avatar-btn" onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/');
            }}>{user.name.charAt(0).toUpperCase()}</button>
          </div>
          <div className="ward-pill">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 1C3.34 1 2 2.34 2 4c0 2.44 3 5 3 5s3-2.56 3-5c0-1.66-1.34-3-3-3z" fill="currentColor" />
            </svg>
            My Dashboard
          </div>
        </header>

        <div className="stat-bar">
          <div className="stat-grid">
            <div className="stat-card stat-total"><div className="stat-icon-wrap"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7"/></svg></div><span className="stat-value">{stats.total}</span><span className="stat-label">Total</span></div>
            <div className="stat-card stat-resolved"><div className="stat-icon-wrap"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M5 8l2.5 2.5L11 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></div><span className="stat-value">{stats.resolved}</span><span className="stat-label">Resolved</span></div>
            <div className="stat-card stat-pending"><div className="stat-icon-wrap"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div><span className="stat-value">{stats.pending}</span><span className="stat-label">Pending</span></div>
            <div className="stat-card stat-progress"><div className="stat-icon-wrap"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.5 2a3 3 0 0 1 .5 5.5L5 13.5a1.5 1.5 0 0 1-2.5-1.5L8 6a3 3 0 0 1 2.5-4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg></div><span className="stat-value">{stats.active}</span><span className="stat-label">Active</span></div>
          </div>
          <div className="resolve-bar">
            <div className="resolve-bar-header">
              <span className="resolve-bar-label">Resolution rate</span>
              <span className="resolve-bar-pct">{resolveRate}%</span>
            </div>
            <div className="resolve-track">
              <div className="resolve-fill" style={{ width: `${resolveRate}%` }}></div>
            </div>
          </div>
        </div>

        {sortedCats.length > 0 && (
          <div className="cat-breakdown">
            <div className="section-title">By category</div>
            <div className="cat-bars">
              {sortedCats.map(([cat, count], i) => {
                const pct = Math.round((count / stats.total) * 100);
                return (
                  <div key={cat} className="cat-bar-row">
                    <span className="cat-bar-icon">{CAT_ICONS[cat] || "📋"}</span>
                    <div className="cat-bar-content">
                      <div className="cat-bar-top"><span className="cat-bar-label" style={{ textTransform: 'capitalize' }}>{cat.replace('_', ' ')}</span><span className="cat-bar-count">{count}</span></div>
                      <div className="cat-track"><div className="cat-fill" style={{ width: `${pct}%`, background: ['#378ADD', '#0F6E56', '#BA7517', '#854F0B'][i % 4] }}></div></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="complaints-section">
          <div className="section-header">
            <div className="section-title">My Complaints</div>
            <span className="complaints-count">{stats.total}</span>
          </div>
          <div className="filter-tabs">
            <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`filter-tab ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Pending <span className="tab-count">{stats.pending}</span></button>
            <button className={`filter-tab ${filter === 'in_progress' ? 'active' : ''}`} onClick={() => setFilter('in_progress')}>In Progress <span className="tab-count">{stats.active}</span></button>
            <button className={`filter-tab ${filter === 'resolved' ? 'active' : ''}`} onClick={() => setFilter('resolved')}>Resolved <span className="tab-count">{stats.resolved}</span></button>
          </div>
          <div className="complaint-list">
            {loading && <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>}
            {!loading && filteredComplaints.length === 0 && <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--ink-3)', fontSize: '13px' }}>No {filter.replace("_", " ")} complaints</div>}
            {!loading && filteredComplaints.map((c, i) => {
              const sc = STATUS_CONFIG[c.status] || STATUS_CONFIG.submitted;
              return (
                <div key={c.id} className="complaint-card" onClick={() => navigate(`/track/${c.id}`)}>
                  <div className="card-cat-icon">{CAT_ICONS[c.category] || "📋"}</div>
                  <div className="card-body">
                    <div className="card-top">
                      <span className="card-title">{c.title}</span>
                      <span className={`status-badge ${sc.cls}`}><span className="status-dot" style={{ background: sc.dot }}></span>{sc.label}</span>
                    </div>
                    <div className="card-meta">
                      <span className="card-no">{c.complaint_no}</span>
                      <span className="card-sep">·</span>
                      <span>{timeAgo(c.created_at)}</span>
                      <span className="card-sep">·</span>
                      <span className="card-dept">{c.department_name}</span>
                    </div>
                    <span className="card-address">
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}><path d="M5 1C3.34 1 2 2.34 2 4c0 2.44 3 5 3 5s3-2.56 3-5c0-1.66-1.34-3-3-3z" fill="currentColor" /></svg>
                      {c.address_text || 'No address'}
                    </span>
                  </div>
                  <div className="card-arrow"><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button className="fab" onClick={() => navigate('/register-complaint')}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 5v12M5 11h12" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </button>

      <nav className="bottom-nav">
        <button className="nav-item nav-active"><span className="nav-icon"><svg width="20" height="20" viewBox="0 0 22 22" fill="none"><path d="M3 10L11 3l8 7v9a1 1 0 0 1-1 1H14v-5H8v5H4a1 1 0 0 1-1-1z" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg></span><span className="nav-label">Home</span></button>
        <button className="nav-item" onClick={() => navigate('/register-complaint')}><span className="nav-icon"><svg width="20" height="20" viewBox="0 0 22 22" fill="none"><rect x="3" y="3" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.6" /><path d="M11 8v6M8 11h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span><span className="nav-label">Register</span></button>
        <button className="nav-item"><span className="nav-icon"><svg width="20" height="20" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.6" /><path d="M11 7v4.5l3 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span><span className="nav-label">Track</span></button>
        <button className="nav-item"><span className="nav-icon"><svg width="20" height="20" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" /><path d="M4 19c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></span><span className="nav-label">Profile</span></button>
      </nav>
    </div>
  );
}
