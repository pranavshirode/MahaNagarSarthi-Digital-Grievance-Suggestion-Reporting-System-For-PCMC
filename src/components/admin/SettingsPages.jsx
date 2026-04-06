import { useState, useMemo } from "react";
import { User, Lock, Globe, Save, CheckCircle2, Bell } from "lucide-react";

const G = "#1D9E75";
const GD = "#073d2c";

export function NotificationsPage({ complaints = [], setPage, setSelected }) {
  const typeStyle = {
    new: { bg: "rgba(37,99,235,0.08)", dot: "#2563eb", color: "#1d4ed8", label: "New" },
    update: { bg: "rgba(245,158,11,0.08)", dot: "#f59e0b", color: "#d97706", label: "Update" },
    resolved: { bg: "rgba(29,158,117,0.08)", dot: G, color: GD, label: "Resolved" },
    rejected: { bg: "rgba(239,68,68,0.08)", dot: "#ef4444", color: "#dc2626", label: "Rejected" },
  };

  const dynamicNotifications = useMemo(() => {
    let notifs = [];
    complaints.forEach((c) => {
      // Creation notification
      notifs.push({
        id: c.db_id + "_new",
        type: "new",
        text: `New complaint filed under ${c.category}: "${c.title}"`,
        timeObj: new Date(c.created_at || c.date),
        complaint: c
      });
      // Update notification
      if (c.status === "In Progress" || c.status === "Assigned" || c.status === "Acknowledged") {
        notifs.push({
          id: c.db_id + "_update",
          type: "update",
          text: `Complaint ${c.id} status updated to ${c.status}.`,
          timeObj: new Date(c.created_at || c.date), // Approximate
          complaint: c
        });
      }
      // Resolved notification
      if (c.status === "Resolved" || c.status === "Closed") {
        notifs.push({
          id: c.db_id + "_resolved",
          type: "resolved",
          text: `Complaint ${c.id} has been fully resolved.`,
          timeObj: new Date(c.resolved_at || c.created_at || c.date),
          complaint: c
        });
      }
    });
    
    // Sort by most recent
    notifs.sort((a, b) => b.timeObj - a.timeObj);
    return notifs.slice(0, 30); // Show max 30 recent things
  }, [complaints]);

  const getTimeAgo = (dateObj) => {
    const diff = Math.floor((new Date() - dateObj) / 60000); // in mins
    if (diff < 60) return `${diff || 1} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", maxWidth: 700 }}>
      <div style={{
        background: "white", borderRadius: 20, padding: "22px 24px",
        border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 18,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12, background: "#E1F5EE",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Bell size={17} style={{ color: G }} />
            </div>
            <div>
              <h2 style={{ fontWeight: 800, color: "#1C1C1E", fontSize: 16, margin: 0 }}>Recent Notifications</h2>
              <p style={{ color: "#8E8E93", fontSize: 11, marginTop: 2 }}>{dynamicNotifications.length} notifications</p>
            </div>
          </div>
          <button
            style={{
              fontSize: 12, fontWeight: 700, color: G, background: "#E1F5EE",
              border: "none", cursor: "pointer", padding: "7px 14px", borderRadius: 100,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(29,158,117,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "#E1F5EE"}
          >Mark all read</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {dynamicNotifications.length === 0 && (
            <p style={{ fontSize: 13, color: "#8E8E93", textAlign: "center", padding: "20px 0" }}>No recent notifications.</p>
          )}
          {dynamicNotifications.map(n => {
            const s = typeStyle[n.type] || typeStyle.new;
            return (
              <div key={n.id} onClick={() => {
                if (setSelected && setPage) {
                  setSelected(n.complaint);
                  setPage("detail");
                }
              }} style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "12px 14px", borderRadius: 14,
                background: s.bg, cursor: "pointer",
                transition: "opacity 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: s.dot, flexShrink: 0, marginTop: 5,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 800, color: s.color,
                      textTransform: "uppercase", letterSpacing: "0.06em",
                    }}>{s.label}</span>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1C1C1E", margin: 0 }}>{n.text}</p>
                  <p style={{ fontSize: 11, color: "#8E8E93", marginTop: 3 }}>{getTimeAgo(n.timeObj)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const [name, setName] = useState("PCMC Administrator");
  const [email, setEmail] = useState("admin@pcmc.gov.in");
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({ emailNotif: true, autoAssign: false, publicDashboard: true });
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const inputStyle = {
    width: "100%", fontSize: 13, border: "1px solid #E5E5EA", borderRadius: 12,
    padding: "10px 14px", outline: "none", background: "#F9F9F9", color: "#1C1C1E",
    fontFamily: "'Outfit', sans-serif", boxSizing: "border-box",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", maxWidth: 680 }}>
      {/* Profile */}
      <div style={{
        background: "white", borderRadius: 20, padding: "22px 24px",
        border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", marginBottom: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 11, background: "#E1F5EE",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <User size={15} style={{ color: G }} />
          </div>
          <h2 style={{ fontWeight: 800, color: "#1C1C1E", fontSize: 15, margin: 0 }}>Admin Profile</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18, flexShrink: 0,
            background: "linear-gradient(135deg, #1D9E75, #073d2c)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 800, fontSize: 24,
            boxShadow: "0 4px 16px rgba(29,158,117,0.3)",
          }}>A</div>
          <div>
            <p style={{ fontWeight: 800, color: "#1C1C1E", fontSize: 16, margin: 0 }}>{name}</p>
            <p style={{ color: "#8E8E93", fontSize: 12, marginTop: 3 }}>{email}</p>
            <span style={{
              fontSize: 10, fontWeight: 700, color: G, background: "#E1F5EE",
              border: "1px solid rgba(29,158,117,0.25)", padding: "2px 10px",
              borderRadius: 100, marginTop: 5, display: "inline-block",
              letterSpacing: "0.05em", textTransform: "uppercase",
            }}>Super Admin · PCMC</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Full Name", value: name, onChange: setName, type: "text" },
            { label: "Email Address", value: email, onChange: setEmail, type: "email" },
          ].map(f => (
            <div key={f.label}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#073d2c", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</label>
              <input type={f.type} value={f.value} onChange={e => f.onChange(e.target.value)}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = G; e.target.style.boxShadow = `0 0 0 3px rgba(29,158,117,0.12)`; }}
                onBlur={e => { e.target.style.borderColor = "#E5E5EA"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          ))}
        </div>
        <button onClick={handleSave} style={{
          marginTop: 16, display: "flex", alignItems: "center", gap: 8,
          padding: "10px 22px", borderRadius: 12, fontSize: 13, fontWeight: 800,
          border: "none", cursor: "pointer",
          background: saved
            ? "linear-gradient(135deg, #16a34a, #15803d)"
            : "linear-gradient(135deg, #1D9E75, #073d2c)",
          color: "white",
          boxShadow: saved ? "0 4px 14px rgba(22,163,74,0.3)" : "0 4px 14px rgba(29,158,117,0.3)",
          transition: "all 0.2s",
        }}>
          {saved ? <><CheckCircle2 size={14} /> Saved!</> : <><Save size={14} /> Save Profile</>}
        </button>
      </div>

      {/* Change Password */}
      <div style={{
        background: "white", borderRadius: 20, padding: "22px 24px",
        border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", marginBottom: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 11, background: "#E1F5EE",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Lock size={15} style={{ color: G }} />
          </div>
          <h2 style={{ fontWeight: 800, color: "#1C1C1E", fontSize: 15, margin: 0 }}>Change Password</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {["Current Password", "New Password", "Confirm New Password"].map(lbl => (
            <div key={lbl}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#073d2c", marginBottom: 5, display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>{lbl}</label>
              <input type="password" placeholder="••••••••" style={inputStyle}
                onFocus={e => { e.target.style.borderColor = G; e.target.style.boxShadow = `0 0 0 3px rgba(29,158,117,0.12)`; }}
                onBlur={e => { e.target.style.borderColor = "#E5E5EA"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          ))}
        </div>
        <button style={{
          marginTop: 14, padding: "10px 22px", borderRadius: 12, fontSize: 13, fontWeight: 800,
          border: "none", cursor: "pointer", background: "#073d2c", color: "white",
          transition: "background 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#05281e"}
          onMouseLeave={e => e.currentTarget.style.background = "#073d2c"}
        >Update Password</button>
      </div>

      {/* Preferences */}
      <div style={{
        background: "white", borderRadius: 20, padding: "22px 24px",
        border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 11, background: "#E1F5EE",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Globe size={15} style={{ color: G }} />
          </div>
          <h2 style={{ fontWeight: 800, color: "#1C1C1E", fontSize: 15, margin: 0 }}>System Preferences</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {[
            { key: "emailNotif", label: "Email Notifications", sub: "Receive complaint updates via email" },
            { key: "autoAssign", label: "Auto-assign Complaints", sub: "Automatically route to relevant departments" },
            { key: "publicDashboard", label: "Public Dashboard", sub: "Allow citizens to see city-wide statistics" },
          ].map(({ key, label, sub }, i, arr) => (
            <div key={key} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 0", borderBottom: i < arr.length - 1 ? "1px solid #F5F5F7" : "none",
            }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1E", margin: 0 }}>{label}</p>
                <p style={{ fontSize: 12, color: "#8E8E93", marginTop: 3 }}>{sub}</p>
              </div>
              <button
                onClick={() => setPrefs(p => ({ ...p, [key]: !p[key] }))}
                style={{
                  position: "relative", width: 44, height: 24, borderRadius: 100,
                  border: "none", cursor: "pointer",
                  background: prefs[key] ? G : "#E5E5EA",
                  transition: "background 0.2s", flexShrink: 0,
                }}
              >
                <span style={{
                  position: "absolute", top: 3, width: 18, height: 18,
                  background: "white", borderRadius: "50%",
                  left: prefs[key] ? 23 : 3,
                  transition: "left 0.2s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
