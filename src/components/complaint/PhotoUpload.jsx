import { useRef, useState } from "react";

const MAX_PHOTOS = 3;
const MAX_SIZE_MB = 5;

export default function PhotoUpload({ photos, onChange }) {
    const inputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);

    const addFiles = (files) => {
        const valid = Array.from(files).filter((f) => {
            if (!f.type.startsWith("image/")) return false;
            if (f.size > MAX_SIZE_MB * 1024 * 1024) return false;
            return true;
        });
        const next = [...photos, ...valid].slice(0, MAX_PHOTOS);
        onChange(next);
    };

    const remove = (idx) => {
        onChange(photos.filter((_, i) => i !== idx));
    };

    return (
        <div className="photo-upload">
            <div className="field-label">
                Photos
                <span className="field-hint">Optional · max {MAX_PHOTOS} · {MAX_SIZE_MB}MB each</span>
            </div>

            <div
                className={`drop-zone ${dragOver ? "drag-active" : ""} ${photos.length >= MAX_PHOTOS ? "drop-disabled" : ""}`}
                onClick={() => photos.length < MAX_PHOTOS && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    capture="environment"
                    style={{ display: "none" }}
                    onChange={(e) => addFiles(e.target.files)}
                />
                <div className="drop-icon">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="3" y="7" width="26" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="16" cy="17" r="5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M11 7l2-4h6l2 4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                </div>
                <span className="drop-label">
                    {photos.length >= MAX_PHOTOS
                        ? "Maximum photos added"
                        : "Tap to take photo or upload"}
                </span>
                <span className="drop-sub">{photos.length}/{MAX_PHOTOS} photos</span>
            </div>

            {photos.length > 0 && (
                <div className="photo-preview-row">
                    {photos.map((file, idx) => {
                        const url = URL.createObjectURL(file);
                        return (
                            <div key={idx} className="photo-thumb">
                                <img src={url} alt={`Photo ${idx + 1}`} onLoad={() => URL.revokeObjectURL(url)} />
                                <button
                                    className="photo-remove"
                                    onClick={() => remove(idx)}
                                    type="button"
                                    aria-label="Remove photo"
                                >
                                    <svg width="10" height="10" viewBox="0 0 10 10">
                                        <path d="M1 1l8 8M9 1L1 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}