import { useState } from "react";
import { User, Tag, MapPin, Calendar, Image, MessageSquare, Edit2, Save, CheckCircle2, ArrowLeft } from "lucide-react";
import { StatusBadge, STATUS_META, STATUSES } from "./constants";
import { api } from "../../services/api";

const G = "#1D9E75";
const GD = "#073d2c";

export default function DetailPage({ complaint, setComplaints, setPage }) {
  const [status, setStatus] = useState(complaint.status);
  const [remarks, setRemarks] = useState(complaint.remarks || "");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const mapStatusDB = (uiStatus) => {
        if (uiStatus === "In Progress") return "in_progress";
        if (uiStatus === "Resolved") return "resolved";
        if (uiStatus === "Rejected") return "rejected";
        if (uiStatus === "Pending") return "acknowledged";
        return "in_progress";
      };
      await api.updateGrievanceStatus(complaint.db_id, mapStatusDB(status), remarks);
      setComplaints(prev => prev.map(c => c.db_id === complaint.db_id ? { ...c, status, remarks } : c));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const timelineSteps = [
    { label: "Submitted", key: "Pending" },
    { label: "In Progress", key: "In Progress" },
    { label: "Resolved", key: "Resolved" },
  ];
  const currentIdx = timelineSteps.findIndex(s => s.key === status);

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Back button */}
      <button
        onClick={() => setPage("complaints")}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16,
          fontSize: 13, fontWeight: 700, color: GD, background: "#E1F5EE",
          border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: 100,
          transition: "background 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(29,158,117,0.2)"}
        onMouseLeave={e => e.currentTarget.style.background = "#E1F5EE"}
      >
        <ArrowLeft size={14} /> Back to Complaints
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}
        className="detail-grid">
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Title card */}
          <div style={{
            background: "white", borderRadius: 20, padding: "22px 24px",
            border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{
                    fontFamily: "monospace", fontSize: 11, fontWeight: 800,
                    color: G, background: "#E1F5EE", padding: "3px 10px", borderRadius: 6,
                  }}>{complaint.id}</span>
                  <StatusBadge status={complaint.status} />
                </div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1C1C1E", margin: 0 }}>
                  {complaint.title || "Untitled Complaint"}
                </h2>
              </div>
            </div>
            <p style={{
              fontSize: 14, color: "#555", lineHeight: 1.7,
              background: "#F9F9F9", borderRadius: 12, padding: "12px 16px",
              border: "1px solid #E5E5EA",
            }}>{complaint.description || "No description provided."}</p>
          </div>

          {/* Info grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: User, label: "Submitted by", value: complaint.user },
              { icon: Tag, label: "Category", value: complaint.category },
              { icon: MapPin, label: "Location", value: complaint.location || "Unknown" },
              { icon: Calendar, label: "Date Filed", value: complaint.date },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{
                background: "white", borderRadius: 16, padding: "14px 16px",
                border: "1px solid #E5E5EA", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                display: "flex", alignItems: "flex-start", gap: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 12, background: "#E1F5EE",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon size={15} style={{ color: G }} />
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "#8E8E93", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700, marginBottom: 3 }}>{label}</p>
                  <p style={{ fontSize: 13, color: "#1C1C1E", fontWeight: 700 }}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Evidence */}
          <div style={{
            background: "white", borderRadius: 20, padding: "20px 22px",
            border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, background: "#E1F5EE",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Image size={14} style={{ color: G }} />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", margin: 0 }}>Attached Evidence</h3>
            </div>
            <div style={{
              height: 120, background: "#F5F5F7",
              border: "2px dashed #E5E5EA", borderRadius: 16,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <Image size={28} style={{ color: "#C7C7CC" }} />
              <p style={{ fontSize: 12, color: "#8E8E93", fontWeight: 600 }}>No images uploaded for this complaint</p>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Update Status */}
          <div style={{
            background: "white", borderRadius: 20, padding: "20px 20px",
            border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, background: "#E1F5EE",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Edit2 size={14} style={{ color: G }} />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", margin: 0 }}>Update Status</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {STATUSES.map(s => {
                const active = status === s;
                const statusColors = {
                  Pending: { bg: "rgba(245,158,11,0.12)", color: "#d97706", border: "rgba(245,158,11,0.4)", dot: "#f59e0b" },
                  "In Progress": { bg: "rgba(37,99,235,0.1)", color: "#2563eb", border: "rgba(37,99,235,0.4)", dot: "#2563eb" },
                  Resolved: { bg: "rgba(29,158,117,0.12)", color: G, border: "rgba(29,158,117,0.4)", dot: G },
                  Rejected: { bg: "rgba(239,68,68,0.1)", color: "#dc2626", border: "rgba(239,68,68,0.4)", dot: "#ef4444" },
                };
                const sc = statusColors[s] || {};
                return (
                  <button key={s} onClick={() => setStatus(s)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 12px", borderRadius: 12, fontSize: 13, fontWeight: 600,
                      border: `1.5px solid ${active ? sc.border : "#E5E5EA"}`,
                      background: active ? sc.bg : "transparent",
                      color: active ? sc.color : "#8E8E93",
                      cursor: "pointer", transition: "all 0.15s", textAlign: "left",
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "#F5F5F7"; e.currentTarget.style.color = "#1C1C1E"; } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8E8E93"; } }}
                  >
                    <span style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: active ? sc.dot : "#D1D1D6" }} />
                    {s}
                    {active && <CheckCircle2 size={14} style={{ marginLeft: "auto", color: sc.color }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Remarks */}
          <div style={{
            background: "white", borderRadius: 20, padding: "20px 20px",
            border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, background: "#E1F5EE",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <MessageSquare size={14} style={{ color: G }} />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", margin: 0 }}>Admin Remarks</h3>
            </div>
            <textarea
              value={remarks} onChange={e => setRemarks(e.target.value)} rows={4}
              placeholder="Add official remarks or resolution notes…"
              style={{
                width: "100%", fontSize: 13, border: "1px solid #E5E5EA",
                borderRadius: 12, padding: "10px 12px", resize: "none",
                outline: "none", background: "#F9F9F9", color: "#1C1C1E",
                fontFamily: "'Outfit', sans-serif", boxSizing: "border-box",
                lineHeight: 1.6,
              }}
              onFocus={e => { e.target.style.borderColor = G; e.target.style.boxShadow = `0 0 0 3px rgba(29,158,117,0.12)`; }}
              onBlur={e => { e.target.style.borderColor = "#E5E5EA"; e.target.style.boxShadow = "none"; }}
            />
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                width: "100%", marginTop: 10,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "12px", borderRadius: 14, fontSize: 14, fontWeight: 800,
                border: "none", cursor: saving ? "not-allowed" : "pointer",
                background: saved
                  ? "linear-gradient(135deg, #16a34a, #15803d)"
                  : "linear-gradient(135deg, #1D9E75, #073d2c)",
                color: "white",
                boxShadow: saved ? "0 4px 16px rgba(22,163,74,0.3)" : "0 4px 16px rgba(29,158,117,0.35)",
                transition: "all 0.2s", opacity: saving ? 0.7 : 1,
              }}
            >
              {saved ? <><CheckCircle2 size={16} /> Saved Successfully!</> : saving ? "Saving…" : <><Save size={15} /> Save Changes</>}
            </button>
          </div>

          {/* Timeline */}
          <div style={{
            background: "white", borderRadius: 20, padding: "20px 20px",
            border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", margin: "0 0 16px" }}>Status Timeline</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {timelineSteps.map((step, i) => {
                const done = i <= currentIdx;
                const isActive = i === currentIdx;
                return (
                  <div key={step.label} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 800,
                        background: done ? (isActive ? G : "#E1F5EE") : "#F5F5F7",
                        color: done ? (isActive ? "white" : GD) : "#8E8E93",
                        boxShadow: isActive ? `0 0 0 4px rgba(29,158,117,0.2)` : "none",
                        zIndex: 1,
                      }}>
                        {done && !isActive ? "✓" : i + 1}
                      </div>
                      {i < timelineSteps.length - 1 && (
                        <div style={{ width: 2, height: 24, background: done ? "rgba(29,158,117,0.3)" : "#E5E5EA", margin: "2px 0" }} />
                      )}
                    </div>
                    <div style={{ paddingTop: 4, paddingBottom: i < timelineSteps.length - 1 ? 0 : 0 }}>
                      <p style={{
                        fontSize: 13, fontWeight: isActive ? 800 : 600,
                        color: done ? "#1C1C1E" : "#8E8E93",
                        margin: 0, lineHeight: 1.4,
                      }}>{step.label}</p>
                      {isActive && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: G,
                          background: "#E1F5EE", padding: "1px 7px", borderRadius: 100,
                          marginTop: 3, display: "inline-block",
                        }}>CURRENT</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        @media (max-width: 860px) { .detail-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
