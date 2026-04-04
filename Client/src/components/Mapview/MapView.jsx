import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix Leaflet's default icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapBoundsUpdater = ({ start, end }) => {
    const map = useMap();
    useEffect(() => {
        if (start && end) {
            const bounds = L.latLngBounds(start, end);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, start, end]);
    return null;
};

const MapView = ({ originLat, originLng, destLat, destLng, originName, destName }) => {
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);

    useEffect(() => {
        const fetchCoordinates = async (query, fallback) => {
            try {
                // Basic cleanup of comma separated query (e.g. "Main Road Delhi, Delhi" -> "Delhi")
                let safeQuery = query;
                if (safeQuery.includes(",")) {
                    safeQuery = safeQuery.split(",").pop().trim();
                }

                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(safeQuery)}`);
                const data = await res.json();
                if (data && data.length > 0) {
                    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                } else if (query !== safeQuery) {
                    // Try full query if short one didn't work just in case
                    const res2 = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
                    const data2 = await res2.json();
                    if (data2 && data2.length > 0) {
                        return [parseFloat(data2[0].lat), parseFloat(data2[0].lon)];
                    }
                }
            } catch (err) {
                console.error("Geocoding failed", err);
            }
            return fallback;
        };

        const updateCoords = async () => {
            let startCoord = (originLat && originLng) ? [originLat, originLng] : null;
            let endCoord = (destLat && destLng) ? [destLat, destLng] : null;

            if (!startCoord && originName) {
                startCoord = await fetchCoordinates(originName, [18.5204, 73.8567]);
            } else if (!startCoord) {
                startCoord = [18.5204, 73.8567]; // default Pune
            }

            if (!endCoord && destName) {
                endCoord = await fetchCoordinates(destName, [19.0760, 72.8777]);
            } else if (!endCoord) {
                endCoord = [19.0760, 72.8777]; // default Mumbai
            }

            setStart(startCoord);
            setEnd(endCoord);
        };

        updateCoords();
    }, [originLat, originLng, destLat, destLng, originName, destName]);

    if (!start || !end) {
        return (
            <div className="w-full h-full min-h-[400px] bg-slate-50 dark:bg-slate-800 animate-pulse flex items-center justify-center rounded-xl">
                <p className="text-slate-500 font-medium">Loading Map Coordinates...</p>
            </div>
        );
    }

    const bounds = L.latLngBounds(start, end);

    return (
        <MapContainer bounds={bounds} style={{ height: "400px", width: "100%", zIndex: 1 }}>
            <TileLayer
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={start}>
                <Popup>{originName || "Pickup Location"}</Popup>
            </Marker>
            <Marker position={end}>
                <Popup>{destName || "Drop Location"}</Popup>
            </Marker>
            <Polyline positions={[start, end]} pathOptions={{ color: '#10B981', weight: 4, dashArray: '10, 10' }} />
            <MapBoundsUpdater start={start} end={end} />
        </MapContainer>
    );
};

export default MapView;