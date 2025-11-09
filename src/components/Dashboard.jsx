import { useState, useMemo } from 'react';
import FleetMap from './FleetMap';
import MetricsPanel from './MetricsPanel';
import TripCard from './TripCard';
import PlaybackControls from './PlaybackControls';
import { useFleetSimulation } from '../hooks/useFleetSimulation';

// Import your generated data files - place them in src/data/
import trip1 from '../data/trip_1_cross_country.json';
import trip2 from '../data/trip_2_urban_dense.json';
import trip3 from '../data/trip_3_mountain_cancelled.json';
import trip4 from '../data/trip_4_southern_technical.json';
import trip5 from '../data/trip_5_regional_logistics.json';

const Dashboard = () => {
    const [playbackSpeed, setPlaybackSpeed] = useState(1);

    // Clean / normalize imported JSON arrays so malformed trailing objects don't break the simulation.
    const cleanTripEvents = (rawEvents = []) =>
        Array.isArray(rawEvents)
            ? rawEvents.filter(e => e && typeof e === 'object' && (e.event_id || e.event_type || e.timestamp || e.trip_id))
            : [];

    // Memoize tripData so identity is stable across renders and doesn't cause hook effects to re-run endlessly.
    const tripData = useMemo(() => [
        cleanTripEvents(trip1),
        cleanTripEvents(trip2),
        cleanTripEvents(trip3),
        cleanTripEvents(trip4),
        cleanTripEvents(trip5)
    ], [trip1, trip2, trip3, trip4, trip5]);

    const { trips, metrics, isPlaying, togglePlayback, resetSimulation } =
        useFleetSimulation(tripData, playbackSpeed);

    // Diagnostic wrapper to confirm UI calls the hook and to avoid undefined
    const handleTogglePlay = () => {
        console.log('[Dashboard] handleTogglePlay called. isPlaying:', isPlaying, 'togglePlayback:', typeof togglePlayback);
        if (typeof togglePlayback === 'function') {
            togglePlayback();
        } else {
            console.warn('[Dashboard] togglePlayback is not a function');
        }
    };

    const handleReset = () => {
        console.log('[Dashboard] handleReset called');
        if (typeof resetSimulation === 'function') resetSimulation();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-xl">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">🚛 Fleet Tracking Dashboard</h1>
                    <p className="text-blue-100 text-lg">Real-time monitoring of 5 concurrent trips</p>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
                <PlaybackControls
                    isPlaying={isPlaying}
                    speed={playbackSpeed}
                    onTogglePlay={handleTogglePlay}
                    onReset={handleReset}
                    onSpeedChange={setPlaybackSpeed}
                />

                <MetricsPanel metrics={metrics} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <FleetMap trips={trips} />
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white rounded-xl shadow-md p-4">
                            <h2 className="text-xl font-bold text-gray-800">Live Trip Status</h2>
                        </div>
                        {Array.isArray(trips) && trips.map(trip => <TripCard key={trip.trip_id || trip.vehicle_id} trip={trip} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
