import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const FleetMap = ({ trips }) => {
    const center = [39.8283, -98.5795];

    const getColor = (status) => {
        const colors = {
            completed: '#10b981',
            cancelled: '#ef4444',
            active: '#3b82f6',
            pending: '#6b7280'
        };
        return colors[status] || colors.pending;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-800">
                <h2 className="text-xl font-bold text-white">Live Fleet Map</h2>
                <p className="text-blue-100 text-sm">Real-time vehicle tracking</p>
            </div>

            <MapContainer center={center} zoom={4} style={{ height: '600px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {trips.map(trip => {
                    if (!trip.currentLocation) return null;

                    const route = trip.processedEvents
                        .filter(e => e.latitude && e.longitude)
                        .map(e => [e.latitude, e.longitude]);

                    return (
                        <div key={trip.trip_id}>
                            {route.length > 1 && (
                                <Polyline positions={route} color={getColor(trip.status)} weight={4} opacity={0.7} />
                            )}
                            <Marker position={trip.currentLocation}>
                                <Popup>
                                    <div className="p-2">
                                        <h3 className="font-bold text-lg">{trip.driver_name}</h3>
                                        <p><strong>Vehicle:</strong> {trip.vehicle_id}</p>
                                        <p><strong>Progress:</strong> {trip.progress.toFixed(1)}%</p>
                                        <p><strong>Status:</strong> {trip.status}</p>
                                        <p><strong>Speed:</strong> {trip.speed} mph</p>
                                        <p><strong>Fuel:</strong> {trip.fuelLevel}%</p>
                                    </div>
                                </Popup>
                            </Marker>
                        </div>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default FleetMap;
