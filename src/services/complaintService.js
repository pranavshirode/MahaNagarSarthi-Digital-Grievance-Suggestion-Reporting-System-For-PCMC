const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function authHeaders() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Submit a new complaint.
 * @param {FormData} formData - includes category, title, description, severity, lat, lng, address_text, photos[]
 * @returns {Promise<Object>} complaint object with id, complaint_no, department_name, sla_days
 */
export async function submitComplaint(formData) {
    const res = await fetch(`${BASE}/complaints`, {
        method: "POST",
        headers: authHeaders(), // Content-Type intentionally omitted for FormData
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Server error ${res.status}`);
    }

    return res.json();
}

/**
 * Fetch a single complaint with its timeline.
 */
export async function getComplaint(id) {
    const res = await fetch(`${BASE}/complaints/${id}`, {
        headers: { ...authHeaders(), "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`Failed to load complaint`);
    return res.json();
}

/**
 * Fetch all complaints for the logged-in user.
 */
export async function getMyComplaints() {
    const res = await fetch(`${BASE}/complaints/mine`, {
        headers: { ...authHeaders(), "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`Failed to load complaints`);
    return res.json();
}