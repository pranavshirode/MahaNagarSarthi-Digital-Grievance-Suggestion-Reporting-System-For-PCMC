import { useMemo } from "react";
import {
  BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { CATEGORIES, STATUSES, CAT_COLORS, PIE_COLORS } from "./constants";

const G = "#1D9E75";
const GD = "#073d2c";

export default function AnalyticsPage({ complaints }) {
  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const rejected = complaints.filter(c => c.status === "Rejected").length;
  const active = complaints.filter(c => ["Pending", "In Progress"].includes(c.status)).length;

  const catData = CATEGORIES.map(cat => ({
    name: cat, value: complaints.filter(c => c.category === cat).length
  }));
  const statData = STATUSES.map(s => ({
    name: s, value: complaints.filter(c => c.status === s).length
  }));

  const monthlyTrend = useMemo(() => {
    const months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({ 
        month: d.toLocaleString('en-US', { month: 'short' }), 
        year: d.getFullYear(), numMonth: d.getMonth(), 
        complaints: 0, resolved: 0 
      });
    }
    
    complaints.forEach(c => {
      const d = new Date(c.created_at || c.date);
      const mIdx = months.findIndex(m => m.numMonth === d.getMonth() && m.year === d.getFullYear());
      if (mIdx !== -1) {
        months[mIdx].complaints += 1;
        if (c.status === "Resolved" || c.status === "Closed" || c.status === "Resolved") {
          months[mIdx].resolved += 1;
        }
      }
    });
    return months;
  }, [complaints]);

  const kpis = [
    { label: "Resolution Rate", value: `${total ? Math.round((resolved / total) * 100) : 0}%`, sub: "complaints resolved", color: G, bg: "#E1F5EE" },
    { label: "Active Cases", value: active, sub: "pending or in-progress", color: "#d97706", bg: "rgba(245,158,11,0.1)" },
    { label: "Rejection Rate", value: `${total ? Math.round((rejected / total) * 100) : 0}%`, sub: "complaints rejected", color: "#dc2626", bg: "rgba(239,68,68,0.1)" },
    { label: "Departments", value: CATEGORIES.length, sub: "active categories", color: "#2563eb", bg: "rgba(37,99,235,0.1)" },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 18 }}>
        {kpis.map(k => (
          <div key={k.label} style={{
            background: "white", borderRadius: 18, padding: "18px 20px",
            border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, background: k.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 10,
            }}>
              <span style={{ fontSize: 18 }}>
                {k.label === "Resolution Rate" ? "✅" :
                 k.label === "Active Cases" ? "⏳" :
                 k.label === "Rejection Rate" ? "❌" : "🏢"}
              </span>
            </div>
            <p style={{ fontSize: 26, fontWeight: 800, color: k.color, lineHeight: 1, marginBottom: 4 }}>{k.value}</p>
            <p style={{ fontSize: 11, color: "#8E8E93", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{k.label}</p>
            <p style={{ fontSize: 11, color: "#C7C7CC", marginTop: 2 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart pair */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}
        className="analytics-grid">
        <div style={{
          background: "white", borderRadius: 18, padding: "20px 22px",
          border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <h2 style={{ fontWeight: 700, color: "#1C1C1E", fontSize: 14, margin: "0 0 4px" }}>Complaints by Category</h2>
          <p style={{ color: "#8E8E93", fontSize: 11, marginBottom: 14 }}>Total filed per department</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={catData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E5EA", fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="value" name="Complaints" radius={[8, 8, 0, 0]}>
                {catData.map((d, i) => <Cell key={i} fill={CAT_COLORS[d.name] || "#94a3b8"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{
          background: "white", borderRadius: 18, padding: "20px 22px",
          border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <h2 style={{ fontWeight: 700, color: "#1C1C1E", fontSize: 14, margin: "0 0 4px" }}>Complaints by Status</h2>
          <p style={{ color: "#8E8E93", fontSize: 11, marginBottom: 14 }}>Current resolution pipeline</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E5EA", fontSize: 12 }} />
              <Bar dataKey="value" name="Count" radius={[8, 8, 0, 0]}>
                {statData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6-month trend */}
      <div style={{
        background: "white", borderRadius: 18, padding: "20px 22px",
        border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <h2 style={{ fontWeight: 700, color: "#1C1C1E", fontSize: 14, margin: 0 }}>6-Month Trend Analysis</h2>
            <p style={{ color: "#8E8E93", fontSize: 11, marginTop: 3 }}>Submitted vs Resolved complaints per month</p>
          </div>
          <span style={{
            fontSize: 11, color: G, fontWeight: 700,
            background: "#E1F5EE", border: "1px solid rgba(29,158,117,0.25)",
            padding: "5px 12px", borderRadius: 100,
          }}>Last 6 months</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyTrend} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E5EA", fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="complaints" name="Submitted" fill="#2563eb" radius={[6, 6, 0, 0]} />
            <Bar dataKey="resolved" name="Resolved" fill={G} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        @media (max-width: 760px) { .analytics-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
