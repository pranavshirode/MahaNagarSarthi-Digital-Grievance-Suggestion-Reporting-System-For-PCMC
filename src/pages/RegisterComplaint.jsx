import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MapSelector from "../components/complaint/MapSelector";
import CategoryPicker from "../components/complaint/CategoryPicker";
import PhotoUpload from "../components/complaint/PhotoUpload";
import ComplaintForm from "../components/complaint/ComplaintForm";
import SubmitSuccess from "../components/complaint/SubmitSuccess";
import { submitComplaint } from "../services/complaintService";
import LoginPage from "./LoginPage";
import "../components/complaint/complaint.css";

const STEPS = [
    { id: 1, label: "Category" },
    { id: 2, label: "Location" },
    { id: 3, label: "Details" },
    { id: 4, label: "Submit" },
];

const INITIAL_STATE = {
    category: null,
    location: null,       // { lat, lng, address }
    photos: [],           // File[]
    title: "",
    description: "",
    severity: 2,
};

export default function RegisterComplaint({ isLoggedIn, setIsLoggedIn, setIsAdmin, setLoggedInName }) {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showLogin, setShowLogin] = useState(false);
    const [data, setData] = useState(INITIAL_STATE);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(null); // complaint response
    const [error, setError] = useState(null);

    const update = useCallback((patch) => setData((d) => ({ ...d, ...patch })), []);

    const canNext = () => {
        if (step === 1) return !!data.category;
        if (step === 2) return !!data.location;
        if (step === 3) return data.title.trim().length >= 5 && data.description.trim().length >= 10;
        return true;
    };

    const handleNext = () => {
        if (step < 4) setStep((s) => s + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep((s) => s - 1);
    };

    const handleSubmit = async () => {
        if (!isLoggedIn) {
            setShowLogin(true);
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("category", data.category.slug);
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("severity", data.severity);
            formData.append("latitude", data.location.lat);
            formData.append("longitude", data.location.lng);
            formData.append("address_text", data.location.address || "");
            data.photos.forEach((f) => formData.append("photos", f));

            const result = await submitComplaint(formData);
            setSubmitted(result);
        } catch (err) {
            setError(err.message || "Submission failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return <SubmitSuccess complaint={submitted} onTrack={() => navigate(`/track/${submitted.id}`)} onNew={() => { setData(INITIAL_STATE); setStep(1); setSubmitted(null); }} />;
    }

    return (
        <div className="register-page">
            {showLogin && !isLoggedIn && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#fff', overflowY: 'auto' }}>
                    <LoginPage setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} setLoggedInName={setLoggedInName} onLoginSuccess={() => setShowLogin(false)} onBack={() => setShowLogin(false)} />
                </div>
            )}
            <header className="reg-header">
                <button className="back-btn" onClick={() => step === 1 ? navigate("/") : handleBack()}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <h1 className="reg-title">Register Complaint</h1>
                <div className="step-badge">{step}/4</div>
            </header>

            {/* Stepper */}
            <div className="stepper">
                {STEPS.map((s) => (
                    <div key={s.id} className={`step-item ${step === s.id ? "active" : ""} ${step > s.id ? "done" : ""}`}>
                        <div className="step-dot">
                            {step > s.id ? (
                                <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                            ) : s.id}
                        </div>
                        <span className="step-label">{s.label}</span>
                    </div>
                ))}
                <div className="step-track">
                    <div className="step-fill" style={{ width: `${((step - 1) / 3) * 100}%` }} />
                </div>
            </div>

            {/* Step Content */}
            <main className="reg-content">
                {step === 1 && <CategoryPicker selected={data.category} onSelect={(cat) => update({ category: cat })} />}
                {step === 2 && <MapSelector location={data.location} onSelect={(loc) => update({ location: loc })} />}
                {step === 3 && (
                    <>
                        <PhotoUpload photos={data.photos} onChange={(photos) => update({ photos })} />
                        <ComplaintForm data={data} onChange={update} />
                    </>
                )}
                {step === 4 && <ReviewStep data={data} />}
            </main>

            {error && <div className="submit-error">{error}</div>}

            {/* Nav buttons */}
            <footer className="reg-footer">
                {step > 1 && (
                    <button className="btn-secondary" onClick={handleBack}>Back</button>
                )}
                {step < 4 ? (
                    <button className="btn-primary" onClick={handleNext} disabled={!canNext()}>
                        Continue
                    </button>
                ) : (
                    <button className="btn-submit" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? <span className="spinner" /> : null}
                        {!isLoggedIn ? "Login to Submit" : (submitting ? "Submitting…" : "Submit Complaint")}
                    </button>
                )}
            </footer>
        </div>
    );
}

function ReviewStep({ data }) {
    return (
        <div className="review-step">
            <h2 className="review-heading">Review & submit</h2>
            <div className="review-card">
                <ReviewRow label="Category" value={data.category?.name} />
                <ReviewRow label="Location" value={data.location?.address || `${data.location?.lat?.toFixed(5)}, ${data.location?.lng?.toFixed(5)}`} />
                <ReviewRow label="Title" value={data.title} />
                <ReviewRow label="Description" value={data.description} />
                <ReviewRow label="Severity" value={["", "Low", "Moderate", "High", "Urgent", "Critical"][data.severity]} />
                <ReviewRow label="Photos" value={data.photos.length ? `${data.photos.length} attached` : "None"} />
            </div>
            <p className="review-note">Once submitted, your complaint will be assigned to the concerned department and you'll receive an SMS confirmation.</p>
        </div>
    );
}

function ReviewRow({ label, value }) {
    return (
        <div className="review-row">
            <span className="review-label">{label}</span>
            <span className="review-value">{value}</span>
        </div>
    );
}