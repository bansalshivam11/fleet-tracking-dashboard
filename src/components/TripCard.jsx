import { Truck, MapPin, AlertTriangle } from 'lucide-react';

const TripCard = ({ trip }) => {
    const statusConfig = {
        active: { bg: 'bg-blue-100', text: 'text-blue-800', progressBg: 'bg-blue-600' },
        completed: { bg: 'bg-green-100', text: 'text-green-800', progressBg: 'bg-green-600' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-800', progressBg: 'bg-red-600' },
        pending: { bg: 'bg-gray-100', text: 'text-gray-800', progressBg: 'bg-gray-600' }
    };

    const config = statusConfig[trip.status] || statusConfig.pending;

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-5 border-l-4 border-blue-500">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <Truck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">{trip.driver_name}</h3>
                        <p className="text-sm text-gray-500">{trip.vehicle_id}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
          {trip.status.toUpperCase()}
        </span>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">{trip.route_name}</span>
            </div>

            <div className="mb-4">
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">Progress</span>
                    <span className="text-sm font-bold">{trip.progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className={`${config.progressBg} h-3 rounded-full transition-all duration-500`}
                         style={{ width: `${trip.progress}%` }} />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600">Speed</p>
                    <p className="text-sm font-bold text-blue-600">{trip.speed} mph</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600">Fuel</p>
                    <p className="text-sm font-bold text-green-600">{trip.fuelLevel}%</p>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600">Events</p>
                    <p className="text-sm font-bold text-purple-600">{trip.processedEvents.length}</p>
                </div>
            </div>

            {trip.alerts.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-semibold text-orange-800">
            {trip.alerts.length} Alert{trip.alerts.length !== 1 ? 's' : ''}
          </span>
                </div>
            )}
        </div>
    );
};

export default TripCard;
