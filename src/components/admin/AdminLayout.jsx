import {
  LayoutDashboard, FileText, BarChart2, Bell, Settings,
  LogOut, Circle, ChevronLeft, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "complaints", label: "Complaints", icon: FileText },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

const SIDEBAR_W = 256;

export function Sidebar({ page, setPage, collapsed, setCollapsed, mobileOpen, setMobileOpen, isDesktop }) {
  const navigate = useNavigate();

  // On mobile: slide via mobileOpen. On desktop: slide via collapsed.
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
            zIndex: 20, display: "block",
          }}
          className="lg:hidden"
        />
      )}

      {/* Sidebar panel */}
      <aside
        style={{
          position: "fixed", top: 0, left: 0, height: "100vh",
          width: SIDEBAR_W,
          background: "linear-gradient(180deg, #05281e 0%, #073d2c 60%, #0a5c42 100%)",
          zIndex: 30, display: "flex", flexDirection: "column",
          borderRight: "1px solid rgba(29,158,117,0.2)",
          boxShadow: "4px 0 24px rgba(0,0,0,0.3)",
          fontFamily: "'Outfit', sans-serif",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          transform: isDesktop
            ? (collapsed ? `translateX(-${SIDEBAR_W}px)` : "translateX(0)")
            : (mobileOpen ? "translateX(0)" : `translateX(-${SIDEBAR_W}px)`),
        }}
      >
        {/* Logo + collapse button */}
        <div style={{
          padding: "18px 16px 14px",
          borderBottom: "1px solid rgba(29,158,117,0.2)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 14, flexShrink: 0,
            background: "linear-gradient(135deg, #1D9E75, #0a5c42)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(29,158,117,0.4)", fontSize: 18,
          }}>🏙</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: "white", fontWeight: 800, fontSize: 13, lineHeight: 1.2 }}>MahaNagarSarthi</p>
            <p style={{ color: "rgba(93,202,165,0.7)", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Admin Control Panel</p>
          </div>
          {/* Single toggle button — collapses on desktop, closes on mobile */}
          <button
            onClick={() => {
              if (window.innerWidth >= 1024) setCollapsed(true);
              else setMobileOpen(false);
            }}
            title="Close sidebar"
            style={{
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(29,158,117,0.2)",
              borderRadius: 8, width: 28, height: 28, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(29,158,117,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
          >
            <ChevronLeft size={14} style={{ color: "rgba(255,255,255,0.6)" }} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          <p style={{
            color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "8px 10px 6px", marginBottom: 4,
          }}>Navigation</p>
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = page === id;
            return (
              <button key={id}
                onClick={() => { setPage(id); setMobileOpen(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 12, fontSize: 13, fontWeight: 600,
                  border: "none", cursor: "pointer", marginBottom: 2, textAlign: "left",
                  background: active
                    ? "linear-gradient(135deg, rgba(29,158,117,0.25), rgba(29,158,117,0.15))"
                    : "transparent",
                  color: active ? "#5DCAA5" : "rgba(255,255,255,0.55)",
                  borderLeft: active ? "3px solid #1D9E75" : "3px solid transparent",
                  boxShadow: active ? "inset 0 0 0 1px rgba(29,158,117,0.2)" : "none",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.55)"; } }}
              >
                <Icon size={17} />
                {label}
                {id === "notifications" && (
                  <span style={{
                    marginLeft: "auto", background: "#ef4444", color: "white",
                    fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>3</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User profile */}
        <div style={{ padding: "12px 10px 16px", borderTop: "1px solid rgba(29,158,117,0.15)" }}>
          <div style={{
            background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "10px 12px",
            display: "flex", alignItems: "center", gap: 10,
            border: "1px solid rgba(29,158,117,0.15)",
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #1D9E75, #085041)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 14, fontWeight: 800,
            }}>A</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "white", fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>PCMC Administrator</p>
              <p style={{ color: "rgba(93,202,165,0.6)", fontSize: 10 }}>admin@pcmc.gov.in</p>
            </div>
            <button
              onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/"); }}
              title="Logout"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
            >
              <LogOut size={15} style={{ color: "rgba(255,255,255,0.35)" }} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export function AdminNavbar({ page, setMobileOpen, collapsed, setCollapsed }) {
  const labels = {
    dashboard: "Dashboard Overview",
    complaints: "Complaints Management",
    analytics: "Analytics & Reports",
    notifications: "Notifications",
    settings: "Settings",
  };
  const subtitles = {
    dashboard: "Monitor and manage civic grievances",
    complaints: "Browse, filter and update complaints",
    analytics: "Visualize trends and performance metrics",
    notifications: "System alerts and updates",
    settings: "Account and system configuration",
  };

  return (
    <header style={{
      height: 64, background: "white",
      borderBottom: "1px solid #E5E5EA",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 20px 0 20px", position: "sticky", top: 0, zIndex: 10,
      boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
      fontFamily: "'Outfit', sans-serif",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Desktop expand button (shown only when collapsed) */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
            style={{
              background: "#E1F5EE", border: "1px solid rgba(29,158,117,0.3)",
              borderRadius: 10, width: 36, height: 36, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s",
            }}
            className="hidden lg:flex"
            onMouseEnter={e => e.currentTarget.style.background = "rgba(29,158,117,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "#E1F5EE"}
          >
            <ChevronRight size={16} style={{ color: "#073d2c" }} />
          </button>
        )}
        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          style={{
            background: "#E1F5EE", border: "1px solid rgba(29,158,117,0.3)",
            borderRadius: 10, width: 36, height: 36, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          className="lg:hidden"
        >
          <ChevronRight size={16} style={{ color: "#073d2c" }} />
        </button>

        <div>
          <h1 style={{ fontWeight: 800, color: "#073d2c", fontSize: 16, lineHeight: 1.2, margin: 0 }}>{labels[page]}</h1>
          <p style={{ color: "#8E8E93", fontSize: 11, margin: 0 }} className="hidden sm:block">{subtitles[page]}</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span className="hidden sm:flex" style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 12, color: "#1D9E75", fontWeight: 600,
          background: "#E1F5EE", border: "1px solid rgba(29,158,117,0.3)",
          borderRadius: 100, padding: "5px 12px",
        }}>
          <Circle size={6} style={{ fill: "#1D9E75", color: "#1D9E75" }} />
          System Online
        </span>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg, #1D9E75, #085041)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 800, fontSize: 15, cursor: "pointer",
          boxShadow: "0 2px 8px rgba(29,158,117,0.3)",
        }}>A</div>
      </div>
    </header>
  );
}
