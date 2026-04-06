const CATEGORIES = [
    { slug: "water", name: "Water", icon: "💧", desc: "Supply, leakage, quality" },
    { slug: "electricity", name: "Electricity", icon: "⚡", desc: "Outage, streetlights, meter" },
    { slug: "tax", name: "Property Tax", icon: "🏛️", desc: "Assessment, receipts" },
    { slug: "hospital", name: "Healthcare", icon: "🏥", desc: "PHC, dispensary, staff" },
    { slug: "hygiene", name: "Hygiene", icon: "🧹", desc: "Garbage, drains, stench" },
    { slug: "public_transport", name: "Transport", icon: "🚌", desc: "Bus, routes, stops" },
    { slug: "roads", name: "Roads", icon: "🛣️", desc: "Potholes, footpaths" },
    { slug: "drainage", name: "Drainage", icon: "🌊", desc: "Flooding, blocked drains" },
    { slug: "street_lights", name: "Street Lights", icon: "💡", desc: "Broken, missing lights" },
    { slug: "parks", name: "Parks", icon: "🌳", desc: "Maintenance, encroachment" },
    { slug: "other", name: "Other", icon: "📋", desc: "Any other civic issue" },
];

export default function CategoryPicker({ selected, onSelect }) {
    return (
        <div className="category-picker">
            <div className="picker-header">
                <h2 className="picker-title">What is the issue about?</h2>
                <p className="picker-sub">Select the department most relevant to your complaint</p>
            </div>
            <div className="category-grid">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.slug}
                        className={`category-card ${selected?.slug === cat.slug ? "selected" : ""}`}
                        onClick={() => onSelect(cat)}
                        type="button"
                    >
                        <span className="cat-icon">{cat.icon}</span>
                        <span className="cat-name">{cat.name}</span>
                        <span className="cat-desc">{cat.desc}</span>
                        {selected?.slug === cat.slug && (
                            <span className="cat-check">
                                <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7L5.5 10.5L12 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}