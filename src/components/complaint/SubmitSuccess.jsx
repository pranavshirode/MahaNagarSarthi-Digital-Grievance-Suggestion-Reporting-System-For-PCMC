export default function SubmitSuccess({ complaint, onTrack, onNew }) {
    return (
        <div className="success-page">
            <div className="success-anim">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="36" fill="#E1F5EE" stroke="#1D9E75" strokeWidth="2" />
                    <path d="M24 40L35 51L56 30" stroke="#1D9E75" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" className="check-path" />
                </svg>
            </div>
            <h2 className="success-title">Complaint Registered!</h2>
            <p className="success-sub">Your complaint has been submitted successfully.</p>

            <div className="complaint-no-card">
                <span className="complaint-no-label">Complaint Number</span>
                <span className="complaint-no">{complaint.complaint_no}</span>
                <span className="complaint-no-hint">Save this for future reference</span>
            </div>

            <div className="success-info">
                <div className="info-row">
                    <span className="info-dot dot-teal" />
                    <span>SMS confirmation sent to your mobile</span>
                </div>
                <div className="info-row">
                    <span className="info-dot dot-teal" />
                    <span>Assigned to {complaint.department_name || "concerned department"}</span>
                </div>
                <div className="info-row">
                    <span className="info-dot dot-teal" />
                    <span>Expected resolution within {complaint.sla_days || 7} working days</span>
                </div>
            </div>

            <div className="success-actions">
                <button className="btn-primary full-width" onClick={onTrack}>
                    Track Your Complaint
                </button>
                <button className="btn-secondary full-width" onClick={onNew}>
                    Register Another
                </button>
            </div>
        </div>
    );
}