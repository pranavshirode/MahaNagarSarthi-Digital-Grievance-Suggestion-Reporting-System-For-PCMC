import { useEffect, useRef, useState } from "react";

const GOOGLE_MAPS_KEY = import.meta.env.VITE_MAP_API;

// Dynamically load Google Maps script once
function loadGoogleMaps() {
    if (window.google?.maps) return Promise.resolve();
    return new Promise((resolve, reject) => {
        if (document.getElementById("gm-script")) {
            // Script already injected — wait for it
            const poll = setInterval(() => {
                if (window.google?.maps) { clearInterval(poll); resolve(); }
            }, 100);
            return;
        }
        const s = document.createElement("script");
        s.id = "gm-script";
        s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places`;
        s.async = true;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

async function reverseGeocode(lat, lng) {
    try {
        const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_KEY}`
        );
        const json = await res.json();
        if (json.results?.[0]) return json.results[0].formatted_address;
    } catch (_) { }
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

export default function MapSelector({ location, onSelect }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [gpsLoading, setGpsLoading] = useState(false);
    const [address, setAddress] = useState(location?.address || "");
    const [error, setError] = useState(null);

    const placeMarker = async (lat, lng) => {
        const pos = { lat, lng };
        if (markerRef.current) {
            markerRef.current.setPosition(pos);
        } else {
            markerRef.current = new window.google.maps.Marker({
                position: pos,
                map: mapInstance.current,
                draggable: true,
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#1D9E75",
                    fillOpacity: 1,
                    strokeColor: "#fff",
                    strokeWeight: 2.5,
                },
            });
            markerRef.current.addListener("dragend", async (e) => {
                const newLat = e.latLng.lat();
                const newLng = e.latLng.lng();
                const addr = await reverseGeocode(newLat, newLng);
                setAddress(addr);
                onSelect({ lat: newLat, lng: newLng, address: addr });
            });
        }
        mapInstance.current.panTo(pos);
        const addr = await reverseGeocode(lat, lng);
        setAddress(addr);
        onSelect({ lat, lng, address: addr });
    };

    const useGPS = () => {
        setGpsLoading(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                await placeMarker(coords.latitude, coords.longitude);
                setGpsLoading(false);
            },
            () => {
                setError("Location access denied. Please pin manually on the map.");
                setGpsLoading(false);
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    useEffect(() => {
        loadGoogleMaps().then(() => {
            const defaultCenter = location
                ? { lat: location.lat, lng: location.lng }
                : { lat: 18.5204, lng: 73.8567 }; // Pune fallback

            mapInstance.current = new window.google.maps.Map(mapRef.current, {
                center: defaultCenter,
                zoom: 15,
                disableDefaultUI: true,
                zoomControl: true,
                styles: [
                    { featureType: "poi", stylers: [{ visibility: "off" }] },
                    { featureType: "transit", stylers: [{ visibility: "off" }] },
                ],
            });

            mapInstance.current.addListener("click", async (e) => {
                const lat = e.latLng.lat();
                const lng = e.latLng.lng();
                await placeMarker(lat, lng);
            });

            if (location) {
                placeMarker(location.lat, location.lng);
            } else {
                useGPS();
            }
            setLoading(false);
        }).catch(() => {
            setError("Failed to load map. Check your API key.");
            setLoading(false);
        });
    }, []);



    return (
        <div className="map-selector">
            <div className="map-header">
                <h2 className="picker-title">Where is the problem?</h2>
                <p className="picker-sub">Tap on the map to pin the location, or use GPS</p>
            </div>

            <div className="map-container">
                {loading && <div className="map-loader"><span className="spinner" /></div>}
                <div ref={mapRef} className="map-canvas" />
                <button
                    className="gps-btn"
                    onClick={useGPS}
                    disabled={gpsLoading}
                    title="Use my location"
                    type="button"
                >
                    {gpsLoading ? (
                        <span className="spinner spinner-sm" />
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.8" />
                            <path d="M9 1v2M9 15v2M1 9h2M15 9h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    )}
                </button>
            </div>

            {address && (
                <div className="address-pill">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1C4.79 1 3 2.79 3 5c0 3.25 4 8 4 8s4-4.75 4-8c0-2.21-1.79-4-4-4z" fill="#1D9E75" />
                        <circle cx="7" cy="5" r="1.5" fill="white" />
                    </svg>
                    {address}
                </div>
            )}

            {error && <p className="field-error">{error}</p>}
        </div>
    );
}