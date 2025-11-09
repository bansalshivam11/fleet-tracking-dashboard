import { useState, useEffect, useCallback } from 'react';

export const useFleetSimulation = (tripDataFiles, playbackSpeed = 1) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [trips, setTrips] = useState([]);
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        const loadedTrips = tripDataFiles.map((events, index) => {
            const sortedEvents = [...events].sort((a, b) =>
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );

            return {
                trip_id: events[0]?.trip_id || `trip_${index + 1}`,
                driver_name: events[0]?.driver_id || `Driver ${index + 1}`,
                vehicle_id: events[0]?.vehicle_id || `Vehicle ${index + 1}`,
                route_name: events[0]?.route_name || `Route ${index + 1}`,
                status: 'pending',
                progress: 0,
                currentLocation: null,
                speed: 0,
                fuelLevel: 100,
                events: sortedEvents,
                processedEvents: [],
                alerts: []
            };
        });

        setTrips(loadedTrips);

        const flatEvents = loadedTrips.flatMap(trip => trip.events);
        if (flatEvents.length > 0) {
            setStartTime(new Date(flatEvents[0].timestamp).getTime());
        }
    }, [tripDataFiles]);

    useEffect(() => {
        if (!isPlaying || !startTime) return;

        const interval = setInterval(() => {
            setCurrentTime(prev => prev + (1000 * playbackSpeed));
        }, 100);

        return () => clearInterval(interval);
    }, [isPlaying, playbackSpeed, startTime]);

    useEffect(() => {
        if (!startTime) return;

        const simulationTime = startTime + currentTime;

        setTrips(prevTrips => {
            return prevTrips.map(trip => {
                const relevantEvents = trip.events.filter(event =>
                    new Date(event.timestamp).getTime() <= simulationTime
                );

                if (relevantEvents.length === 0) return trip;

                const lastEvent = relevantEvents[relevantEvents.length - 1];
                const progress = (relevantEvents.length / trip.events.length) * 100;

                let status = 'active';
                if (progress >= 100) status = 'completed';
                else if (lastEvent.event_type === 'trip_cancelled') status = 'cancelled';
                else if (progress === 0) status = 'pending';

                const alertTypes = ['harsh_braking', 'speeding_violation', 'fuel_alert',
                    'maintenance_alert', 'geofence_violation', 'engine_fault'];
                const alerts = relevantEvents.filter(e => alertTypes.includes(e.event_type));

                return {
                    ...trip,
                    progress,
                    status,
                    currentLocation: lastEvent.latitude && lastEvent.longitude
                        ? [lastEvent.latitude, lastEvent.longitude]
                        : trip.currentLocation,
                    speed: lastEvent.speed || trip.speed,
                    fuelLevel: lastEvent.fuel_level || trip.fuelLevel,
                    processedEvents: relevantEvents,
                    alerts
                };
            });
        });
    }, [currentTime, startTime]);

    const metrics = {
        totalTrips: trips.length,
        activeTrips: trips.filter(t => t.status === 'active').length,
        completedTrips: trips.filter(t => t.status === 'completed').length,
        cancelledTrips: trips.filter(t => t.status === 'cancelled').length,
        averageProgress: trips.reduce((acc, t) => acc + t.progress, 0) / (trips.length || 1),
        totalAlerts: trips.reduce((acc, t) => acc + t.alerts.length, 0),
        tripsAbove50: trips.filter(t => t.progress >= 50).length,
        tripsAbove80: trips.filter(t => t.progress >= 80).length,
    };

    const togglePlayback = useCallback(() => setIsPlaying(prev => !prev), []);
    const resetSimulation = useCallback(() => {
        setCurrentTime(0);
        setIsPlaying(false);
    }, []);

    return { trips, metrics, isPlaying, togglePlayback, resetSimulation };
};
