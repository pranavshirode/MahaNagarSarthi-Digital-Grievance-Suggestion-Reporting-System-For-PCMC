const SEVERITY_LABELS = ["", "Low", "Moderate", "High", "Urgent", "Critical"];
const SEVERITY_COLORS = ["", "#639922", "#BA7517", "#D85A30", "#E24B4A", "#A32D2D"];

export default function ComplaintForm({ data, onChange }) {
    const { title, description, severity } = data;
    const titleLen = title.length;
    const descLen = description.length;

    return (
        <div className="complaint-form">
            {/* Title */}
            <div className="field-group">
                <label className="field-label" htmlFor="c-title">
                    Title <span className="required">*</span>
                    <span className="field-hint">{titleLen}/100</span>
                </label>
                <input
                    id="c-title"
                    type="text"
                    className={`field-input ${titleLen >= 5 ? "valid" : ""}`}
                    placeholder="Brief title of the issue (e.g. 'Broken water pipe on MG Road')"
                    value={title}
                    maxLength={100}
                    onChange={(e) => onChange({ title: e.target.value })}
                />
                {titleLen > 0 && titleLen < 5 && (
                    <span className="field-error">Title must be at least 5 characters</span>
                )}
            </div>

            {/* Description */}
            <div className="field-group">
                <label className="field-label" htmlFor="c-desc">
                    Description <span className="required">*</span>
                    <span className="field-hint">{descLen}/1000</span>
                </label>
                <textarea
                    id="c-desc"
                    className={`field-textarea ${descLen >= 10 ? "valid" : ""}`}
                    placeholder="Describe the problem in detail. When did it start? How is it affecting daily life? Any previous complaints filed?"
                    value={description}
                    maxLength={1000}
                    rows={5}
                    onChange={(e) => onChange({ description: e.target.value })}
                />
                {descLen > 0 && descLen < 10 && (
                    <span className="field-error">Please describe the issue in more detail</span>
                )}
            </div>

            {/* Severity */}
            <div className="field-group">
                <label className="field-label">Severity</label>
                <div className="severity-row">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <button
                            key={s}
                            type="button"
                            className={`severity-btn ${severity === s ? "active" : ""}`}
                            style={severity === s ? { background: SEVERITY_COLORS[s], borderColor: SEVERITY_COLORS[s], color: "#fff" } : {}}
                            onClick={() => onChange({ severity: s })}
                        >
                            {SEVERITY_LABELS[s]}
                        </button>
                    ))}
                </div>
                <p className="severity-hint">
                    {severity === 1 && "Minor inconvenience, can wait."}
                    {severity === 2 && "Noticeable issue, needs attention soon."}
                    {severity === 3 && "Significant impact on daily life."}
                    {severity === 4 && "Urgent — health or safety risk."}
                    {severity === 5 && "Critical — immediate action required."}
                </p>
            </div>
        </div>
    );
}