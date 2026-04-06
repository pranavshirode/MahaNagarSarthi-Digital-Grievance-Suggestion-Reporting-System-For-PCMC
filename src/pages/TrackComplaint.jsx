import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaint } from '../services/complaintService';
import './TrackComplaint.css';

const STATUS_ORDER = ['submitted', 'acknowledged', 'assigned', 'in_progress', 'resolved', 'closed'];
const STATUS_LABELS = {
  submitted: { label: 'Complaint Submitted', icon: '📋', desc: 'Your complaint has been registered in the system.' },
  acknowledged: { label: 'Acknowledged', icon: '👁️', desc: 'The municipal office has seen and acknowledged your complaint.' },
  assigned: { label: 'Assigned to Officer', icon: '👤', desc: 'An officer has been assigned to investigate this issue.' },
  in_progress: { label: 'Work In Progress', icon: '🔧', desc: 'The assigned team is actively working on resolving this.' },
  resolved: { label: 'Resolved', icon: '✅', desc: 'The issue has been resolved. Please verify at your end.' },
  closed: { label: 'Closed', icon: '🏁', desc: 'This complaint has been closed after resolution.' },
};

const CAT_ICONS = { water: '💧', electricity: '⚡', tax: '🏛️', hospital: '🏥', hygiene: '🧹', public_transport: '🚌', roads: '🛣️', drainage: '🌊', street_lights: '💡', parks: '🌳', other: '📋' };

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' · ' +
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function TrackComplaint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    getComplaint(id)
      .then(data => {
        setComplaint(data.complaint || data);
        setTimeline(data.timeline || []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="track-loading"><div className="track-spinner" /><p>Loading complaint...</p></div>;
  if (error) return <div className="track-error"><p>⚠️ {error}</p><button onClick={() => navigate('/dashboard')}>Back to Dashboard</button></div>;
  if (!complaint) return null;

  const currentIdx = STATUS_ORDER.indexOf(complaint.status);
  const isRejected = complaint.status === 'rejected';

  // Build timeline steps from DB timeline_events or synthesize from complaint timestamps
  const timelineSteps = STATUS_ORDER.map((status, i) => {
    const event = timeline.find(t => t.status === status);
    const ts = event?.created_at || complaint[`${status === 'submitted' ? 'created' : status}_at`] || complaint.created_at;
    const reached = i <= currentIdx && !isRejected;
    const isCurrent = i === currentIdx && !isRejected;
    return { status, reached, isCurrent, time: reached ? ts : null, note: event?.note || null };
  });

  return (
    <div className="track-wrapper">
      <div className="track-container">
        {/* Header */}
        <header className="track-header">
          <button className="track-back" onClick={() => navigate('/dashboard')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="track-header-info">
            <h1 className="track-complaint-no">{complaint.complaint_no}</h1>
            <p className="track-subtitle">Track your complaint status</p>
          </div>
          <span className={`track-status-pill ${complaint.status}`}>
            {isRejected ? '❌ Rejected' : STATUS_LABELS[complaint.status]?.label}
          </span>
        </header>

        {/* Complaint Summary Card */}
        <div className="track-summary">
          <div className="track-summary-icon">{CAT_ICONS[complaint.category] || '📋'}</div>
          <div className="track-summary-body">
            <h2 className="track-summary-title">{complaint.title}</h2>
            <p className="track-summary-desc">{complaint.description}</p>
            <div className="track-summary-meta">
              <span className="track-meta-tag">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1C3.34 1 2 2.34 2 4c0 2.44 3 5 3 5s3-2.56 3-5c0-1.66-1.34-3-3-3z" fill="currentColor" /></svg>
                {complaint.address_text || 'Location not specified'}
              </span>
              <span className="track-meta-tag">📅 {formatDate(complaint.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Rejected Banner */}
        {isRejected && (
          <div className="track-rejected-banner">
            <span className="track-rejected-icon">❌</span>
            <div>
              <p className="track-rejected-title">Complaint Rejected</p>
              <p className="track-rejected-note">{complaint.resolution_note || 'This complaint was rejected by the reviewing officer.'}</p>
            </div>
          </div>
        )}

        {/* Flipkart-style Timeline */}
        {!isRejected && (
          <div className="track-timeline-section">
            <h3 className="track-section-title">📦 Delivery Timeline</h3>
            <div className="track-timeline">
              {timelineSteps.map((step, i) => {
                const meta = STATUS_LABELS[step.status];
                return (
                  <div key={step.status} className={`tl-step ${step.reached ? 'reached' : ''} ${step.isCurrent ? 'current' : ''}`}>
                    <div className="tl-rail">
                      <div className="tl-dot">
                        {step.reached ? (step.isCurrent ? <span className="tl-pulse" /> : '✓') : (i + 1)}
                      </div>
                      {i < timelineSteps.length - 1 && <div className="tl-line" />}
                    </div>
                    <div className="tl-content">
                      <div className="tl-header">
                        <span className="tl-icon">{meta.icon}</span>
                        <span className="tl-label">{meta.label}</span>
                      </div>
                      <p className="tl-desc">{meta.desc}</p>
                      {step.note && <p className="tl-note">💬 {step.note}</p>}
                      {step.time && <p className="tl-time">{formatDate(step.time)}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Officer Info + Actions */}
        <div className="track-actions-section">
          <h3 className="track-section-title">🎧 Need Help?</h3>
          <div className="track-actions-grid">
            <button className="track-action-btn chat-btn" onClick={() => setShowChat(true)}>
              <span className="action-icon">💬</span>
              <span className="action-label">Chat with Assistant</span>
              <span className="action-sub">Get instant answers</span>
            </button>
            <a href={`tel:${complaint.officer_phone || '1800-200-0000'}`} className="track-action-btn call-btn">
              <span className="action-icon">📞</span>
              <span className="action-label">Call Officer</span>
              <span className="action-sub">{complaint.officer_name || 'Municipal Helpline'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      {showChat && <ChatWidget complaint={complaint} onClose={() => setShowChat(false)} />}
    </div>
  );
}

// ── Rule-based Chatbot Widget ──
const FAQ = [
  { q: 'What is the current status?', key: 'status' },
  { q: 'When will it be resolved?', key: 'eta' },
  { q: 'Who is handling my complaint?', key: 'officer' },
  { q: 'How do I escalate?', key: 'escalate' },
  { q: 'Can I add more details?', key: 'update' },
];

function ChatWidget({ complaint, onClose }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: `Hi! I'm your MahaNagarSarthi assistant. Ask me about complaint ${complaint.complaint_no}.` }
  ]);
  const [input, setInput] = useState('');

  const getReply = (key) => {
    const status = STATUS_LABELS[complaint.status]?.label || complaint.status;
    switch (key) {
      case 'status': return `Your complaint is currently: **${status}**. ${STATUS_LABELS[complaint.status]?.desc || ''}`;
      case 'eta': return complaint.status === 'resolved' ? 'Great news — your complaint has already been resolved!' : 'Based on the current status, the estimated resolution time is 3–7 working days. You will receive an SMS update.';
      case 'officer': return complaint.officer_name ? `Your complaint is assigned to **${complaint.officer_name}**. You can reach them at ${complaint.officer_phone || 'the helpline'}.` : 'An officer has not been assigned yet. It will happen shortly.';
      case 'escalate': return 'To escalate, you can call the Municipal Commissioner helpline at **1800-200-0000** or visit the ward office with your complaint number.';
      case 'update': return 'Currently, additional details can be communicated by calling the assigned officer directly. We are working on an in-app update feature.';
      default: return "I'm sorry, I don't have information on that. Please call the helpline for further assistance.";
    }
  };

  const handleSend = (key, text) => {
    const userMsg = text || input;
    if (!userMsg.trim() && !key) return;
    setMessages(m => [...m, { from: 'user', text: userMsg }]);
    setInput('');
    const matchedKey = key || FAQ.find(f => userMsg.toLowerCase().includes(f.q.toLowerCase().split(' ')[3]))?.key || 'unknown';
    setTimeout(() => {
      setMessages(m => [...m, { from: 'bot', text: getReply(matchedKey) }]);
    }, 500);
  };

  return (
    <div className="chat-overlay">
      <div className="chat-panel">
        <div className="chat-header">
          <span>💬 MahaNagarSarthi Assistant</span>
          <button className="chat-close" onClick={onClose}>✕</button>
        </div>
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.from}`}>
              {m.from === 'bot' && <span className="chat-avatar">🤖</span>}
              <div className="chat-bubble" dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>
          ))}
        </div>
        <div className="chat-quick">
          {FAQ.map(f => (
            <button key={f.key} className="chat-quick-btn" onClick={() => handleSend(f.key, f.q)}>{f.q}</button>
          ))}
        </div>
        <div className="chat-input-bar">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message…"
            onKeyDown={e => e.key === 'Enter' && handleSend(null)} />
          <button onClick={() => handleSend(null)}>➤</button>
        </div>
      </div>
    </div>
  );
}
