import { useState, useMemo } from "react";
import {
  LayoutDashboard, FileText, BarChart2, Bell, Settings,
  LogOut, Search, Filter, Eye, Edit2, ChevronDown,
  TrendingUp, TrendingDown, Users, CheckCircle2, Clock,
  AlertCircle, XCircle, Menu, X, Download, RefreshCw,
  MapPin, Tag, Calendar, User, MessageSquare, Image,
  Shield, Lock, Moon, Globe, Save, ChevronRight,
  ArrowUpRight, Inbox, Circle
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// ─── DUMMY DATA ───────────────────────────────────────────────────────────────

const COMPLAINTS = [
  { id: "GR-001", user: "Ravi Kumar",    category: "Roads",      location: "Sector 12, Pune",   status: "Pending",     date: "2025-03-01", title: "Large pothole near school", description: "There is a very large and dangerous pothole near the city school entrance that has been causing accidents for 2 weeks.", image: null, remarks: "" },
  { id: "GR-002", user: "Priya Sharma",  category: "Water",      location: "Kothrud, Pune",     status: "In Progress", date: "2025-03-03", title: "No water supply for 3 days", description: "Our entire colony has had zero water supply since Monday. We are forced to buy water cans.", image: null, remarks: "PMC water dept notified." },
  { id: "GR-003", user: "Amit Joshi",    category: "Electricity",location: "Baner, Pune",       status: "Resolved",    date: "2025-03-05", title: "Streetlight not working", description: "Three consecutive streetlights on Main Road are not working, making it unsafe at night.", image: null, remarks: "Lights replaced on 07-Mar." },
  { id: "GR-004", user: "Sonal Patil",   category: "Sanitation", location: "Hadapsar, Pune",    status: "Rejected",    date: "2025-03-07", title: "Garbage not collected", description: "Garbage has not been collected from our ward for the past 5 days causing health hazard.", image: null, remarks: "Duplicate complaint." },
  { id: "GR-005", user: "Nikhil Desai",  category: "Parks",      location: "Wakad, Pune",       status: "Pending",     date: "2025-03-09", title: "Broken benches in park", description: "Several benches in the public park are broken and are a safety risk for children playing there.", image: null, remarks: "" },
  { id: "GR-006", user: "Meera Naik",    category: "Roads",      location: "Shivajinagar, Pune",status: "In Progress", date: "2025-03-10", title: "Encroachment on footpath", description: "Hawkers have permanently occupied the footpath forcing pedestrians onto the busy road.", image: null, remarks: "Encroachment team dispatched." },
  { id: "GR-007", user: "Suresh Rane",   category: "Water",      location: "Katraj, Pune",      status: "Resolved",    date: "2025-03-11", title: "Water pipe leakage", description: "A major water pipe is leaking at the intersection of MG Road and SB Road causing massive wastage.", image: null, remarks: "Pipe repaired on 12-Mar." },
  { id: "GR-008", user: "Anjali More",   category: "Sanitation", location: "Pimpri, Pune",      status: "Pending",     date: "2025-03-13", title: "Open drain causing smell", description: "The open drain near our society has not been cleaned for months and is emitting foul smell.", image: null, remarks: "" },
  { id: "GR-009", user: "Deepak Wagh",   category: "Electricity",location: "Chinchwad, Pune",   status: "Pending",     date: "2025-03-14", title: "Power cuts daily 3+ hours", description: "We are experiencing unscheduled power cuts of more than 3 hours every day for the past week.", image: null, remarks: "" },
  { id: "GR-010", user: "Kavya Bhosale", category: "Parks",      location: "Aundh, Pune",       status: "In Progress", date: "2025-03-15", title: "No playground equipment", description: "The children's play area has no equipment and the existing space is being used for illegal parking.", image: null, remarks: "Parks dept informed." },
  { id: "GR-011", user: "Rahul Salvi",   category: "Roads",      location: "Viman Nagar, Pune", status: "Resolved",    date: "2025-03-16", title: "Missing road dividers", description: "Road dividers are missing on the highway stretch near airport causing accidents.", image: null, remarks: "Dividers installed on 18-Mar." },
  { id: "GR-012", user: "Pooja Kulkarni",category: "Other",      location: "Magarpatta, Pune",  status: "Pending",     date: "2025-03-18", title: "Illegal banner installation", description: "Unauthorised political banners have been installed on public utility poles blocking visibility.", image: null, remarks: "" },
];

const NOTIFICATIONS = [
  { id: 1, text: 'GR-002 status updated to "In Progress"', time: "2 hrs ago",  type: "update" },
  { id: 2, text: "New complaint GR-012 submitted by Pooja K.", time: "5 hrs ago",  type: "new" },
  { id: 3, text: 'GR-003 marked as "Resolved"',             time: "Yesterday",  type: "resolved" },
  { id: 4, text: 'GR-004 complaint "Rejected"',             time: "2 days ago", type: "rejected" },
  { id: 5, text: "GR-011 status updated to Resolved",       time: "3 days ago", type: "resolved" },
  { id: 6, text: "New complaint GR-009 submitted",          time: "4 days ago", type: "new" },
  { id: 7, text: 'GR-006 status updated to "In Progress"',  time: "5 days ago", type: "update" },
  { id: 8, text: 'GR-007 marked as "Resolved"',             time: "6 days ago", type: "resolved" },
];

const MONTHLY = [
  { month: "Oct", complaints: 28, resolved: 18 },
  { month: "Nov", complaints: 35, resolved: 22 },
  { month: "Dec", complaints: 30, resolved: 25 },
  { month: "Jan", complaints: 42, resolved: 30 },
  { month: "Feb", complaints: 38, resolved: 28 },
  { month: "Mar", complaints: 12, resolved:  7 },
];

const CATEGORIES = ["Roads", "Water", "Sanitation", "Electricity", "Parks", "Other"];
const STATUSES    = ["Pending", "In Progress", "Resolved", "Rejected"];

const STATUS_META = {
  Pending:     { color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200",  dot: "bg-amber-400",   icon: Clock },
  "In Progress":{ color: "text-blue-600",   bg: "bg-blue-50",    border: "border-blue-200",   dot: "bg-blue-500",    icon: RefreshCw },
  Resolved:    { color: "text-green-600",   bg: "bg-green-50",   border: "border-green-200",  dot: "bg-green-500",   icon: CheckCircle2 },
  Rejected:    { color: "text-red-600",     bg: "bg-red-50",     border: "border-red-200",    dot: "bg-red-400",     icon: XCircle },
};

const CAT_COLORS  = { Roads:"#2563eb", Water:"#06b6d4", Sanitation:"#f59e0b", Electricity:"#8b5cf6", Parks:"#22c55e", Other:"#94a3b8" };
const PIE_COLORS  = ["#f59e0b","#2563eb","#22c55e","#ef4444"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const m = STATUS_META[status] || {};
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${m.bg} ${m.color} ${m.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, delta, color, bg }) {
  const up = delta >= 0;
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon size={20} className={color} />
        </div>
        <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-green-600" : "text-red-500"}`}>
          {up ? <TrendingUp size={13}/> : <TrendingDown size={13}/>}
          {Math.abs(delta)}%
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-800 mb-0.5 group-hover:text-blue-600 transition-colors">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

const NAV = [
  { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { id: "complaints",   label: "Complaints",   icon: FileText },
  { id: "analytics",    label: "Analytics",    icon: BarChart2 },
  { id: "notifications",label: "Notifications",icon: Bell },
  { id: "settings",     label: "Settings",     icon: Settings },
];

function Sidebar({ page, setPage, open, setOpen }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-slate-900 z-30 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">CivicDesk</p>
              <p className="text-slate-400 text-[11px]">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = page === id;
            return (
              <button key={id} onClick={() => { setPage(id); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
                <Icon size={17} />
                {label}
                {id === "notifications" && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">3</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Admin Card */}
        <div className="px-3 pb-4">
          <div className="bg-slate-800 rounded-xl px-3 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">Admin User</p>
              <p className="text-slate-400 text-[11px] truncate">admin@civicdesk.in</p>
            </div>
            <LogOut size={15} className="text-slate-400 hover:text-red-400 cursor-pointer transition-colors" />
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

function Navbar({ page, setOpen }) {
  const labels = { dashboard: "Dashboard", complaints: "Complaints", analytics: "Analytics", notifications: "Notifications", settings: "Settings" };
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        <button className="lg:hidden text-slate-500" onClick={() => setOpen(v => !v)}><Menu size={20} /></button>
        <div>
          <h1 className="font-bold text-slate-800 text-base leading-tight">{labels[page]}</h1>
          <p className="text-slate-400 text-xs hidden sm:block">Digital Grievance & Suggestion System</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
          <Circle size={7} className="text-green-500 fill-green-500" /> System Online
        </span>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer">A</div>
      </div>
    </header>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────

function DashboardPage({ complaints, setPage, setSelected }) {
  const total      = complaints.length;
  const pending    = complaints.filter(c => c.status === "Pending").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  const resolved   = complaints.filter(c => c.status === "Resolved").length;
  const rejected   = complaints.filter(c => c.status === "Rejected").length;

  const catData = CATEGORIES.map(cat => ({
    name: cat, count: complaints.filter(c => c.category === cat).length
  })).filter(d => d.count > 0);

  const pieData = [
    { name: "Pending",     value: pending },
    { name: "In Progress", value: inProgress },
    { name: "Resolved",    value: resolved },
    { name: "Rejected",    value: rejected },
  ];

  const recent = [...complaints].sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0,5);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={FileText}     label="Total Complaints" value={total}      delta={12}  color="text-blue-600"   bg="bg-blue-50" />
        <StatCard icon={Clock}        label="Pending"          value={pending}    delta={-5}  color="text-amber-600"  bg="bg-amber-50" />
        <StatCard icon={RefreshCw}    label="In Progress"      value={inProgress} delta={8}   color="text-blue-500"   bg="bg-blue-50" />
        <StatCard icon={CheckCircle2} label="Resolved"         value={resolved}   delta={20}  color="text-green-600"  bg="bg-green-50" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-slate-800 text-sm">Monthly Complaint Trend</h2>
              <p className="text-xs text-slate-400">Submitted vs Resolved</p>
            </div>
            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MONTHLY} margin={{top:5,right:10,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{fontSize:11,fill:"#94a3b8"}} />
              <YAxis tick={{fontSize:11,fill:"#94a3b8"}} />
              <Tooltip contentStyle={{borderRadius:8,border:"1px solid #e2e8f0",fontSize:12}} />
              <Legend wrapperStyle={{fontSize:12}} />
              <Line type="monotone" dataKey="complaints" stroke="#2563eb" strokeWidth={2} dot={{r:4,fill:"#2563eb"}} name="Submitted" />
              <Line type="monotone" dataKey="resolved"   stroke="#22c55e" strokeWidth={2} dot={{r:4,fill:"#22c55e"}} name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="font-semibold text-slate-800 text-sm mb-1">Status Distribution</h2>
          <p className="text-xs text-slate-400 mb-2">Current breakdown</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{borderRadius:8,border:"1px solid #e2e8f0",fontSize:12}} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-1">
            {pieData.map((d,i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{background:PIE_COLORS[i]}} />
                <span className="text-[11px] text-slate-500 truncate">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category bar + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="font-semibold text-slate-800 text-sm mb-4">By Category</h2>
          <div className="space-y-3">
            {catData.map(d => (
              <div key={d.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{d.name}</span>
                  <span className="text-slate-400">{d.count}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{width:`${(d.count/total)*100}%`, background: CAT_COLORS[d.name]}} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800 text-sm">Recent Complaints</h2>
            <button onClick={() => setPage("complaints")} className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">View all <ChevronRight size={12} /></button>
          </div>
          <div className="space-y-2">
            {recent.map(c => (
              <div key={c.id} onClick={() => { setSelected(c); setPage("detail"); }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100 group">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{c.title}</p>
                  <p className="text-[11px] text-slate-400">{c.id} · {c.user} · {c.date}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── COMPLAINTS PAGE ──────────────────────────────────────────────────────────

function ComplaintsPage({ complaints, setComplaints, setSelected, setPage }) {
  const [search, setSearch]   = useState("");
  const [statF,  setStatF]    = useState("All");
  const [catF,   setCatF]     = useState("All");

  const filtered = useMemo(() => complaints.filter(c => {
    const q = search.toLowerCase();
    return (statF === "All" || c.status   === statF) &&
           (catF  === "All" || c.category === catF)  &&
           (!q || c.id.toLowerCase().includes(q) || c.user.toLowerCase().includes(q) ||
                  c.title.toLowerCase().includes(q) || c.location.toLowerCase().includes(q));
  }), [complaints, search, statF, catF]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID, user, title, location…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-slate-50" />
          </div>
          <select value={statF} onChange={e => setStatF(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-slate-600">
            <option value="All">All Statuses</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={catF} onChange={e => setCatF(e.target.value)}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-slate-600">
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <p className="text-xs text-slate-400 mt-2">{filtered.length} complaint{filtered.length !== 1 ? "s" : ""} found</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["ID","User","Category","Location","Status","Date","Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-400 text-sm">No complaints match your filters.</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">{c.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-[11px] font-bold flex-shrink-0">{c.user[0]}</div>
                      <span className="text-slate-700 whitespace-nowrap text-xs font-medium">{c.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{background: CAT_COLORS[c.category]+"15", color: CAT_COLORS[c.category]}}>{c.category}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap max-w-[140px] truncate">{c.location}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{c.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => { setSelected(c); setPage("detail"); }}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition-colors">
                        <Eye size={12} /> View
                      </button>
                      <button onClick={() => { setSelected(c); setPage("detail"); }}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium transition-colors">
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
    </div>
  );
}

// ─── DETAIL PAGE ──────────────────────────────────────────────────────────────

function DetailPage({ complaint, complaints, setComplaints, setPage }) {
  const [status,  setStatus]  = useState(complaint.status);
  const [remarks, setRemarks] = useState(complaint.remarks || "");
  const [saved,   setSaved]   = useState(false);

  const handleSave = () => {
    setComplaints(prev => prev.map(c => c.id === complaint.id ? { ...c, status, remarks } : c));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const m = STATUS_META[status];

  return (
    <div className="space-y-4">
      <button onClick={() => setPage("complaints")} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors">
        ← Back to Complaints
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Complaint Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{complaint.id}</span>
                  <StatusBadge status={complaint.status} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">{complaint.title}</h2>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{complaint.description}</p>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: User,     label: "Submitted by", value: complaint.user },
              { icon: Tag,      label: "Category",     value: complaint.category },
              { icon: MapPin,   label: "Location",     value: complaint.location },
              { icon: Calendar, label: "Date Filed",   value: complaint.date },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wide font-medium">{label}</p>
                  <p className="text-sm text-slate-700 font-semibold mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Image placeholder */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Image size={15} className="text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-700">Attached Evidence</h3>
            </div>
            <div className="h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2">
              <Image size={28} className="text-slate-300" />
              <p className="text-xs text-slate-400">No image uploaded for this complaint</p>
            </div>
          </div>
        </div>

        {/* Right: Admin Actions */}
        <div className="space-y-4">
          {/* Status Update */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Edit2 size={14} /> Update Status
            </h3>
            <div className="space-y-2 mb-4">
              {STATUSES.map(s => {
                const meta = STATUS_META[s];
                const active = status === s;
                return (
                  <button key={s} onClick={() => setStatus(s)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150
                      ${active ? `${meta.bg} ${meta.color} ${meta.border}` : "border-slate-100 text-slate-500 hover:bg-slate-50"}`}>
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${active ? meta.dot : "bg-slate-200"}`} />
                    {s}
                    {active && <CheckCircle2 size={14} className="ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Remarks */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <MessageSquare size={14} /> Admin Remarks
            </h3>
            <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={4} placeholder="Add official remarks or notes about this complaint…"
              className="w-full text-sm border border-slate-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-slate-50 text-slate-700 placeholder:text-slate-300" />
            <button onClick={handleSave}
              className={`w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${saved ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"}`}>
              {saved ? <><CheckCircle2 size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
            </button>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Status Timeline</h3>
            <div className="space-y-3">
              {["Pending","In Progress","Resolved"].map((s, i) => {
                const done = STATUSES.indexOf(status) > i || (s === "Pending");
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold
                      ${done ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                      {done ? "✓" : i+1}
                    </div>
                    <span className={`text-xs font-medium ${done ? "text-slate-700" : "text-slate-400"}`}>{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ANALYTICS PAGE ───────────────────────────────────────────────────────────

function AnalyticsPage({ complaints }) {
  const catData = CATEGORIES.map(cat => ({
    name: cat, value: complaints.filter(c => c.category === cat).length
  }));
  const statData = STATUSES.map(s => ({
    name: s, value: complaints.filter(c => c.status === s).length
  }));
  const total = complaints.length;

  return (
    <div className="space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Resolution Rate", value: `${Math.round((complaints.filter(c=>c.status==="Resolved").length/total)*100)}%`, color: "text-green-600" },
          { label: "Avg. Categories", value: CATEGORIES.length, color: "text-blue-600" },
          { label: "Rejection Rate", value: `${Math.round((complaints.filter(c=>c.status==="Rejected").length/total)*100)}%`, color: "text-red-500" },
          { label: "Active Cases", value: complaints.filter(c=>["Pending","In Progress"].includes(c.status)).length, color: "text-amber-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
            <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
            <p className="text-xs text-slate-500 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Bar charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="font-semibold text-slate-800 text-sm mb-1">Complaints by Category</h2>
          <p className="text-xs text-slate-400 mb-4">Total filed per department</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={catData} margin={{top:0,right:10,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{fontSize:11,fill:"#94a3b8"}} />
              <YAxis tick={{fontSize:11,fill:"#94a3b8"}} />
              <Tooltip contentStyle={{borderRadius:8,border:"1px solid #e2e8f0",fontSize:12}} />
              <Bar dataKey="value" name="Count" radius={[6,6,0,0]}>
                {catData.map((d,i) => <Cell key={i} fill={CAT_COLORS[d.name] || "#94a3b8"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="font-semibold text-slate-800 text-sm mb-1">Complaints by Status</h2>
          <p className="text-xs text-slate-400 mb-4">Current resolution pipeline</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statData} margin={{top:0,right:10,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{fontSize:10,fill:"#94a3b8"}} />
              <YAxis tick={{fontSize:11,fill:"#94a3b8"}} />
              <Tooltip contentStyle={{borderRadius:8,border:"1px solid #e2e8f0",fontSize:12}} />
              <Bar dataKey="value" name="Count" radius={[6,6,0,0]}>
                {statData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly trend */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h2 className="font-semibold text-slate-800 text-sm mb-1">6-Month Trend Analysis</h2>
        <p className="text-xs text-slate-400 mb-4">Submitted vs Resolved complaints per month</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MONTHLY} margin={{top:0,right:10,left:-20,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{fontSize:11,fill:"#94a3b8"}} />
            <YAxis tick={{fontSize:11,fill:"#94a3b8"}} />
            <Tooltip contentStyle={{borderRadius:8,border:"1px solid #e2e8f0",fontSize:12}} />
            <Legend wrapperStyle={{fontSize:12}} />
            <Bar dataKey="complaints" name="Submitted" fill="#2563eb" radius={[4,4,0,0]} />
            <Bar dataKey="resolved"   name="Resolved"  fill="#22c55e" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────

function NotificationsPage() {
  const typeStyle = {
    new:      { bg:"bg-blue-50",   dot:"bg-blue-500",   text:"text-blue-700" },
    update:   { bg:"bg-amber-50",  dot:"bg-amber-500",  text:"text-amber-700" },
    resolved: { bg:"bg-green-50",  dot:"bg-green-500",  text:"text-green-700" },
    rejected: { bg:"bg-red-50",    dot:"bg-red-400",    text:"text-red-700" },
  };
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">Recent Notifications</h2>
          <button className="text-xs text-blue-600 hover:underline">Mark all read</button>
        </div>
        <div className="space-y-2">
          {NOTIFICATIONS.map(n => {
            const s = typeStyle[n.type];
            return (
              <div key={n.id} className={`flex items-start gap-3 p-3.5 rounded-xl ${s.bg} border border-transparent`}>
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${s.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${s.text}`}>{n.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────

function SettingsPage() {
  const [name,  setName]  = useState("Admin User");
  const [email, setEmail] = useState("admin@civicdesk.in");
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({ darkMode: false, emailNotif: true, autoAssign: false });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Profile */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h2 className="font-semibold text-slate-800 text-sm mb-4 flex items-center gap-2"><User size={14}/> Admin Profile</h2>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">A</div>
          <div>
            <p className="font-semibold text-slate-800">{name}</p>
            <p className="text-sm text-slate-400">{email}</p>
            <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-medium mt-1 inline-block">Super Admin</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-slate-50" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Email Address</label>
            <input value={email} onChange={e => setEmail(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-slate-50" />
          </div>
        </div>
        <button onClick={handleSave}
          className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
            ${saved ? "bg-green-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"}`}>
          {saved ? <><CheckCircle2 size={14}/> Saved!</> : <><Save size={14}/> Save Profile</>}
        </button>
      </div>

      {/* Password */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h2 className="font-semibold text-slate-800 text-sm mb-4 flex items-center gap-2"><Lock size={14}/> Change Password</h2>
        <div className="space-y-3">
          {["Current Password","New Password","Confirm New Password"].map(lbl => (
            <div key={lbl}>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{lbl}</label>
              <input type="password" placeholder="••••••••"
                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-slate-50" />
            </div>
          ))}
        </div>
        <button className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800 text-white hover:bg-slate-900 transition-colors">
          Update Password
        </button>
      </div>

      {/* System Prefs */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h2 className="font-semibold text-slate-800 text-sm mb-4 flex items-center gap-2"><Globe size={14}/> System Preferences</h2>
        <div className="space-y-3">
          {[
            { key: "darkMode",    label: "Dark Mode",             sub: "Switch to dark interface theme" },
            { key: "emailNotif",  label: "Email Notifications",   sub: "Receive updates via email" },
            { key: "autoAssign",  label: "Auto-assign Complaints", sub: "Automatically assign to departments" },
          ].map(({ key, label, sub }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-700">{label}</p>
                <p className="text-xs text-slate-400">{sub}</p>
              </div>
              <button onClick={() => setPrefs(p => ({ ...p, [key]: !p[key] }))}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${prefs[key] ? "bg-blue-600" : "bg-slate-200"}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${prefs[key] ? "left-5.5 translate-x-0.5" : "left-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page,       setPage]       = useState("dashboard");
  const [sideOpen,   setSideOpen]   = useState(false);
  const [selected,   setSelected]   = useState(null);
  const [complaints, setComplaints] = useState(COMPLAINTS);

  const handleSetPage = (p) => { setPage(p); setSideOpen(false); };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar page={page} setPage={handleSetPage} open={sideOpen} setOpen={setSideOpen} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Navbar page={page} setOpen={setSideOpen} />
        <main className="flex-1 p-4 lg:p-6">
          {page === "dashboard"     && <DashboardPage     complaints={complaints} setPage={handleSetPage} setSelected={setSelected} />}
          {page === "complaints"    && <ComplaintsPage    complaints={complaints} setComplaints={setComplaints} setSelected={setSelected} setPage={handleSetPage} />}
          {page === "detail"        && selected && <DetailPage complaint={selected} complaints={complaints} setComplaints={setComplaints} setPage={handleSetPage} />}
          {page === "analytics"     && <AnalyticsPage     complaints={complaints} />}
          {page === "notifications" && <NotificationsPage />}
          {page === "settings"      && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}