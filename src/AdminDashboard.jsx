import { useState, useEffect } from "react";
import { Sidebar, AdminNavbar } from "./components/admin/AdminLayout";
import DashboardPage from "./components/admin/DashboardPage";
import ComplaintsPage from "./components/admin/ComplaintsPage";
import DetailPage from "./components/admin/DetailPage";
import AnalyticsPage from "./components/admin/AnalyticsPage";
import { NotificationsPage, SettingsPage } from "./components/admin/SettingsPages";
import { api } from "./services/api";

const DUMMY_COMPLAINTS = [
  { id: "GR-001", user: "Ravi Kumar", category: "Roads", location: "Sector 12, Pune", status: "Pending", date: "2025-03-01", title: "Large pothole near school", description: "Dangerous pothole near school.", remarks: "" },
  { id: "GR-002", user: "Priya Sharma", category: "Water", location: "Kothrud, Pune", status: "In Progress", date: "2025-03-03", title: "No water supply", description: "Zero water supply since Monday.", remarks: "PMC notified." },
];

const SIDEBAR_W = 256;

export default function AdminDashboard() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);   // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [selected, setSelected] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track desktop breakpoint
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    api.getGrievances()
      .then(data => {
        const mapStatusUI = (dbStatus) => {
          if (["submitted", "acknowledged", "assigned"].includes(dbStatus)) return "Pending";
          if (dbStatus === "in_progress") return "In Progress";
          if (dbStatus === "resolved" || dbStatus === "closed") return "Resolved";
          if (dbStatus === "rejected") return "Rejected";
          return "Pending";
        };
        const formatted = data.map(c => ({
          ...c,
          db_id: c.id,
          id: c.complaint_no || `NS-00${c.id}`,
          user: c.user_name || "Unknown User",
          category: c.category ? (c.category.charAt(0).toUpperCase() + c.category.slice(1)) : "Other",
          location: c.address_text || "Unknown Location",
          status: mapStatusUI(c.status),
          date: new Date(c.created_at).toISOString().split('T')[0],
        }));
        setComplaints(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch complaints", err);
        setComplaints(DUMMY_COMPLAINTS);
        setLoading(false);
      });
  }, []);

  const handleSetPage = (p) => { setPage(p); setMobileOpen(false); };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #05281e 0%, #073d2c 50%, #0a5c42 100%)",
        fontFamily: "'Outfit', sans-serif",
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🏙</div>
        <div style={{
          width: 48, height: 48,
          border: "4px solid rgba(93,202,165,0.3)",
          borderTop: "4px solid #5DCAA5",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          marginBottom: 16,
        }} />
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, fontWeight: 600 }}>
          Loading admin dashboard…
        </p>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F7", fontFamily: "'Outfit', sans-serif" }}>

      <Sidebar
        page={page}
        setPage={handleSetPage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isDesktop={isDesktop}
      />

      {/* Main content — shifts right on desktop based on collapsed state */}
      <div
        style={{
          transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
          marginLeft: isDesktop ? (collapsed ? 0 : SIDEBAR_W) : 0,
        }}
      >
        <AdminNavbar
          page={page}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          setMobileOpen={setMobileOpen}
        />

        <main style={{ padding: "20px 24px", minHeight: "calc(100vh - 64px)" }}>
          {page === "dashboard"     && <DashboardPage  complaints={complaints} setPage={handleSetPage} setSelected={setSelected} />}
          {page === "complaints"    && <ComplaintsPage  complaints={complaints} setSelected={setSelected} setPage={handleSetPage} />}
          {page === "detail" && selected && <DetailPage complaint={selected} setComplaints={setComplaints} setPage={handleSetPage} />}
          {page === "analytics"     && <AnalyticsPage  complaints={complaints} />}
          {page === "notifications" && <NotificationsPage />}
          {page === "settings"      && <SettingsPage />}
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
      `}</style>
    </div>
  );
}