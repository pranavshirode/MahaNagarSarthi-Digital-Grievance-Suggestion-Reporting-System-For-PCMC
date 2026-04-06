import { FileText, Clock, RefreshCw, CheckCircle2, ChevronRight } from "lucide-react";
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { StatusBadge, StatCard, CATEGORIES, CAT_COLORS, PIE_COLORS, MONTHLY } from "./constants";

const G = "#1D9E75";

export default function DashboardPage({ complaints, setPage, setSelected }) {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const rejected = complaints.filter(c => c.status === "Rejected").length;

  const catData = CATEGORIES.map(cat => ({
    name: cat, count: complaints.filter(c => c.category === cat).length
  })).filter(d => d.count > 0);

  const pieData = [
    { name: "Pending", value: pending },
    { name: "In Progress", value: inProgress },
    { name: "Resolved", value: resolved },
    { name: "Rejected", value: rejected },
  ];

  const recent = [...complaints].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const statCards = [
    { icon: FileText, label: "Total Complaints", value: total, delta: 12, color: "#073d2c", bg: "#E1F5EE", accent: "rgba(29,158,117,0.06)" },
    { icon: Clock, label: "Pending", value: pending, delta: -5, color: "#d97706", bg: "rgba(245,158,11,0.12)", accent: "rgba(245,158,11,0.06)" },
    { icon: RefreshCw, label: "In Progress", value: inProgress, delta: 8, color: "#2563eb", bg: "rgba(37,99,235,0.1)", accent: "rgba(37,99,235,0.05)" },
    { icon: CheckCircle2, label: "Resolved", value: resolved, delta: 20, color: "#1D9E75", bg: "rgba(29,158,117,0.12)", accent: "rgba(29,158,117,0.06)" },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg, #05281e 0%, #073d2c 50%, #0a5c42 100%)",
        borderRadius: 20, padding: "22px 28px", marginBottom: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(29,158,117,0.1)", top: -100, right: -80, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", background: "rgba(29,158,117,0.07)", bottom: -60, left: -40, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 22 }}>👋</span>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 600 }}>Welcome back,</p>
          </div>
          <h2 style={{ color: "white", fontWeight: 800, fontSize: 20, margin: 0 }}>PCMC Administrator</h2>
          <p style={{ color: "rgba(93,202,165,0.75)", fontSize: 12, marginTop: 4 }}>
            {total} total complaints · {pending} awaiting action
          </p>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.1)", borderRadius: 14,
          border: "1px solid rgba(93,202,165,0.3)", padding: "10px 20px",
          color: "#5DCAA5", fontSize: 13, fontWeight: 700,
          backdropFilter: "blur(8px)", position: "relative", zIndex: 1,
        }}>
          🏙 PCMC Smart City Initiative
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 }}>
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, marginBottom: 16 }}
        className="admin-chart-grid">
        {/* Line chart */}
        <div style={{
          background: "white", borderRadius: 20, padding: "20px 22px",
          border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          minWidth: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontWeight: 700, color: "#1C1C1E", fontSize: 14, margin: 0 }}>Monthly Complaint Trend</h2>
              <p style={{ color: "#8E8E93", fontSize: 11, marginTop: 2 }}>Submitted vs Resolved</p>
            </div>
            <span style={{
              fontSize: 11, color: "#1D9E75", background: "#E1F5EE",
              padding: "4px 10px", borderRadius: 100, fontWeight: 700,
              border: "1px solid rgba(29,158,117,0.2)",
            }}>Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MONTHLY} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E5EA", fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="complaints" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "white" }} name="Submitted" />
              <Line type="monotone" dataKey="resolved" stroke={G} strokeWidth={2.5} dot={{ r: 4, fill: G, strokeWidth: 2, stroke: "white" }} name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div style={{
          background: "white", borderRadius: 20, padding: "20px 22px",
          border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <h2 style={{ fontWeight: 700, color: "#1C1C1E", fontSize: 14, margin: "0 0 4px" }}>Status Distribution</h2>
          <p style={{ color: "#8E8E93", fontSize: 11, marginBottom: 8 }}>Current breakdown</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E5E5EA", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", marginTop: 8 }}>
            {pieData.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: PIE_COLORS[i], flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#555", fontWeight: 600 }}>{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16 }}
        className="admin-bottom-grid">
        {/* By Category */}
        <div style={{
          background: "white", borderRadius: 20, padding: "20px 22px",
          border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <h2 style={{ fontWeight: 700, color: "#1C1C1E", fontSize: 14, margin: "0 0 16px" }}>By Category</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {catData.length === 0 ? (
              <p style={{ color: "#8E8E93", fontSize: 12, textAlign: "center", padding: "20px 0" }}>No data yet</p>
            ) : catData.map(d => (
              <div key={d.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#1C1C1E" }}>{d.name}</span>
                  <span style={{ fontSize: 12, color: "#8E8E93", fontWeight: 700 }}>{d.count}</span>
                </div>
                <div style={{ height: 6, background: "#F5F5F7", borderRadius: 100, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: 100,
                    width: `${total ? (d.count / total) * 100 : 0}%`,
                    background: CAT_COLORS[d.name] || G,
                    transition: "width 0.7s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent complaints */}
        <div style={{
          background: "white", borderRadius: 20, padding: "20px 22px",
          border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          minWidth: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <h2 style={{ fontWeight: 700, color: "#1C1C1E", fontSize: 14, margin: 0 }}>Recent Complaints</h2>
              <p style={{ color: "#8E8E93", fontSize: 11, marginTop: 2 }}>Latest submissions</p>
            </div>
            <button
              onClick={() => setPage("complaints")}
              style={{
                fontSize: 12, color: G, fontWeight: 700, background: "#E1F5EE",
                border: "none", cursor: "pointer", padding: "6px 12px", borderRadius: 100,
                display: "flex", alignItems: "center", gap: 4,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(29,158,117,0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "#E1F5EE"}
            >
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {recent.length === 0 ? (
              <p style={{ color: "#8E8E93", fontSize: 13, textAlign: "center", padding: "24px 0" }}>No complaints yet.</p>
            ) : recent.map(c => (
              <div key={c.id}
                onClick={() => { setSelected(c); setPage("detail"); }}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                  borderRadius: 14, cursor: "pointer", transition: "background 0.15s",
                  border: "1px solid transparent",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#F5F5F7"; e.currentTarget.style.borderColor = "#E5E5EA"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 12, background: "#E1F5EE",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <FileText size={15} style={{ color: G }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1C1C1E", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title || "No title"}</p>
                  <p style={{ fontSize: 11, color: "#8E8E93" }}>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: G }}>{c.id}</span>
                    {" · "}{c.user}{" · "}{c.date}
                  </p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        @media (max-width: 900px) {
          .admin-chart-grid { grid-template-columns: 1fr !important; }
          .admin-bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
