import { useState, useMemo } from "react";
import { Search, Eye, Edit2, Filter } from "lucide-react";
import { StatusBadge, CATEGORIES, STATUSES, CAT_COLORS } from "./constants";

const G = "#1D9E75";

export default function ComplaintsPage({ complaints, setSelected, setPage }) {
  const [search, setSearch] = useState("");
  const [statF, setStatF] = useState("All");
  const [catF, setCatF] = useState("All");

  const filtered = useMemo(() => complaints.filter(c => {
    const q = search.toLowerCase();
    return (statF === "All" || c.status === statF) &&
      (catF === "All" || c.category === catF) &&
      (!q || c.id.toLowerCase().includes(q) || c.user.toLowerCase().includes(q) ||
        (c.title || "").toLowerCase().includes(q) || (c.location || "").toLowerCase().includes(q));
  }), [complaints, search, statF, catF]);

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Page header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 10,
        }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#073d2c", margin: 0 }}>All Complaints</h2>
            <p style={{ fontSize: 12, color: "#8E8E93", marginTop: 3 }}>
              Showing <strong style={{ color: G }}>{filtered.length}</strong> of {complaints.length} total complaints
            </p>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12, color: G, fontWeight: 700,
            background: "#E1F5EE", border: "1px solid rgba(29,158,117,0.25)",
            borderRadius: 100, padding: "6px 14px",
          }}>
            <Filter size={12} /> Filter Active
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{
        background: "white", borderRadius: 18, padding: "16px 18px",
        border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        marginBottom: 14,
      }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#8E8E93" }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID, user, title, location…"
              style={{
                width: "100%", paddingLeft: 36, paddingRight: 14,
                paddingTop: 9, paddingBottom: 9,
                fontSize: 13, border: "1px solid #E5E5EA", borderRadius: 12,
                outline: "none", background: "#F9F9F9", color: "#1C1C1E",
                fontFamily: "'Outfit', sans-serif", boxSizing: "border-box",
              }}
              onFocus={e => { e.target.style.borderColor = G; e.target.style.boxShadow = `0 0 0 3px rgba(29,158,117,0.12)`; }}
              onBlur={e => { e.target.style.borderColor = "#E5E5EA"; e.target.style.boxShadow = "none"; }}
            />
          </div>
          {/* Status filter */}
          <select value={statF} onChange={e => setStatF(e.target.value)}
            style={{
              fontSize: 13, border: "1px solid #E5E5EA", borderRadius: 12,
              padding: "9px 14px", background: "#F9F9F9", color: "#1C1C1E",
              fontFamily: "'Outfit', sans-serif", outline: "none", cursor: "pointer",
            }}
            onFocus={e => e.target.style.borderColor = G}
            onBlur={e => e.target.style.borderColor = "#E5E5EA"}
          >
            <option value="All">All Statuses</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          {/* Category filter */}
          <select value={catF} onChange={e => setCatF(e.target.value)}
            style={{
              fontSize: 13, border: "1px solid #E5E5EA", borderRadius: 12,
              padding: "9px 14px", background: "#F9F9F9", color: "#1C1C1E",
              fontFamily: "'Outfit', sans-serif", outline: "none", cursor: "pointer",
            }}
            onFocus={e => e.target.style.borderColor = G}
            onBlur={e => e.target.style.borderColor = "#E5E5EA"}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: "white", borderRadius: 18,
        border: "1px solid #E5E5EA", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'Outfit', sans-serif" }}>
            <thead>
              <tr style={{ background: "#F5F5F7", borderBottom: "1px solid #E5E5EA" }}>
                {["Complaint ID", "Citizen", "Category", "Location", "Status", "Date Filed", "Actions"].map(h => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left", fontSize: 11,
                    fontWeight: 700, color: "#073d2c", textTransform: "uppercase",
                    letterSpacing: "0.06em", whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "48px 20px", textAlign: "center" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                    <p style={{ color: "#8E8E93", fontSize: 13, fontWeight: 600 }}>No complaints match your filters.</p>
                    <p style={{ color: "#C7C7CC", fontSize: 12 }}>Try adjusting your search or filter criteria.</p>
                  </td>
                </tr>
              ) : filtered.map((c, idx) => (
                <tr key={c.id}
                  style={{
                    borderBottom: idx < filtered.length - 1 ? "1px solid #F5F5F7" : "none",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F9FDF9"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      fontFamily: "monospace", fontSize: 11, fontWeight: 800,
                      color: G, background: "#E1F5EE", padding: "3px 8px", borderRadius: 6,
                    }}>{c.id}</span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: "linear-gradient(135deg, #073d2c, #1D9E75)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", fontSize: 12, fontWeight: 800, flexShrink: 0,
                      }}>{(c.user || "U")[0].toUpperCase()}</div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#1C1C1E", whiteSpace: "nowrap" }}>{c.user}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100,
                      background: (CAT_COLORS[c.category] || "#94a3b8") + "18",
                      color: CAT_COLORS[c.category] || "#94a3b8",
                    }}>{c.category}</span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#8E8E93", fontSize: 12, maxWidth: 160 }}>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                      📍 {c.location || "—"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}><StatusBadge status={c.status} /></td>
                  <td style={{ padding: "12px 16px", color: "#8E8E93", fontSize: 12, whiteSpace: "nowrap" }}>{c.date}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => { setSelected(c); setPage("detail"); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 4,
                          fontSize: 11, fontWeight: 700, padding: "6px 10px", borderRadius: 8,
                          background: "#E1F5EE", color: G, border: "none", cursor: "pointer",
                          transition: "background 0.12s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(29,158,117,0.2)"}
                        onMouseLeave={e => e.currentTarget.style.background = "#E1F5EE"}
                      >
                        <Eye size={12} /> View
                      </button>
                      <button
                        onClick={() => { setSelected(c); setPage("detail"); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 4,
                          fontSize: 11, fontWeight: 700, padding: "6px 10px", borderRadius: 8,
                          background: "#F5F5F7", color: "#073d2c", border: "none", cursor: "pointer",
                          transition: "background 0.12s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#E5E5EA"}
                        onMouseLeave={e => e.currentTarget.style.background = "#F5F5F7"}
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');`}</style>
    </div>
  );
}
