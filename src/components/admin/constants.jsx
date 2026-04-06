import { TrendingUp, TrendingDown, Clock, RefreshCw, CheckCircle2, XCircle } from "lucide-react";

export const CATEGORIES = ["Roads", "Water", "Hygiene", "Electricity", "Parks", "Other"];
export const STATUSES = ["Pending", "In Progress", "Resolved", "Rejected"];

export const STATUS_META = {
  Pending: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-400", icon: Clock },
  "In Progress": { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500", icon: RefreshCw },
  Resolved: { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", icon: CheckCircle2 },
  Rejected: { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", dot: "bg-red-400", icon: XCircle },
};

export const CAT_COLORS = {
  Roads: "#2563eb", Water: "#0891b2", Hygiene: "#d97706",
  Electricity: "#7c3aed", Parks: "#16a34a", Other: "#94a3b8"
};

// Matches the MahaNagarSarthi deep-green brand
export const PIE_COLORS = ["#f59e0b", "#2563eb", "#1D9E75", "#ef4444"];
export const GREEN = "#1D9E75";
export const GREEN_DARK = "#085041";

export const MONTHLY = [
  { month: "Oct", complaints: 28, resolved: 18 },
  { month: "Nov", complaints: 35, resolved: 22 },
  { month: "Dec", complaints: 30, resolved: 25 },
  { month: "Jan", complaints: 42, resolved: 30 },
  { month: "Feb", complaints: 38, resolved: 28 },
  { month: "Mar", complaints: 12, resolved: 7 },
];

export const NOTIFICATIONS = [
  { id: 1, text: 'GR-002 status updated to "In Progress"', time: "2 hrs ago", type: "update" },
  { id: 2, text: "New complaint GR-012 submitted by Pooja K.", time: "5 hrs ago", type: "new" },
  { id: 3, text: 'GR-003 marked as "Resolved"', time: "Yesterday", type: "resolved" },
  { id: 4, text: 'GR-004 complaint "Rejected"', time: "2 days ago", type: "rejected" },
  { id: 5, text: "GR-011 status updated to Resolved", time: "3 days ago", type: "resolved" },
  { id: 6, text: "New complaint GR-009 submitted", time: "4 days ago", type: "new" },
  { id: 7, text: 'GR-006 status updated to "In Progress"', time: "5 days ago", type: "update" },
  { id: 8, text: 'GR-007 marked as "Resolved"', time: "6 days ago", type: "resolved" },
];

const STATUS_STYLE = {
  Pending: { bg: "rgba(245,158,11,0.1)", color: "#d97706", border: "rgba(245,158,11,0.3)", dot: "#f59e0b" },
  "In Progress": { bg: "rgba(37,99,235,0.1)", color: "#2563eb", border: "rgba(37,99,235,0.3)", dot: "#2563eb" },
  Resolved: { bg: "rgba(29,158,117,0.1)", color: "#1D9E75", border: "rgba(29,158,117,0.3)", dot: "#1D9E75" },
  Rejected: { bg: "rgba(239,68,68,0.1)", color: "#dc2626", border: "rgba(239,68,68,0.3)", dot: "#ef4444" },
};

export function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || { bg: "#f5f5f7", color: "#8E8E93", border: "#e5e5ea", dot: "#8E8E93" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      fontFamily: "'Outfit', sans-serif",
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

export function StatCard({ icon: Icon, label, value, delta, color, bg, accent }) {
  const up = delta >= 0;
  return (
    <div style={{
      background: "white", borderRadius: 20, padding: "20px 22px",
      border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      transition: "transform 0.15s, box-shadow 0.15s", cursor: "default",
      fontFamily: "'Outfit', sans-serif", position: "relative", overflow: "hidden",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.1)`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; }}
    >
      {/* Decorative corner accent */}
      <div style={{
        position: "absolute", top: -20, right: -20, width: 80, height: 80,
        borderRadius: "50%", background: accent || "rgba(29,158,117,0.06)",
      }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 14, background: bg || "#E1F5EE",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={20} style={{ color: color || GREEN }} />
        </div>
        <span style={{
          display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700,
          color: up ? "#16a34a" : "#dc2626",
          background: up ? "rgba(22,163,74,0.1)" : "rgba(220,38,38,0.1)",
          padding: "3px 8px", borderRadius: 100,
        }}>
          {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(delta)}%
        </span>
      </div>
      <p style={{ fontSize: 28, fontWeight: 800, color: "#1C1C1E", lineHeight: 1, marginBottom: 4 }}>{value}</p>
      <p style={{ fontSize: 12, color: "#8E8E93", fontWeight: 600 }}>{label}</p>
    </div>
  );
}
