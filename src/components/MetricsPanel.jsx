import { Truck, Clock, CheckCircle, XCircle, BarChart3, AlertTriangle } from 'lucide-react';

const MetricCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
            <div className={`${bgColor} p-4 rounded-full`}>
                <Icon className={`w-8 h-8 ${color}`} />
            </div>
        </div>
    </div>
);

const MetricsPanel = ({ metrics }) => {
    const metricsData = [
        { label: 'Total Trips', value: metrics.totalTrips, icon: Truck, color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { label: 'Active Trips', value: metrics.activeTrips, icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
        { label: 'Completed', value: metrics.completedTrips, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
        { label: 'Cancelled', value: metrics.cancelledTrips, icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
        { label: 'Avg Progress', value: `${metrics.averageProgress.toFixed(1)}%`, icon: BarChart3, color: 'text-purple-600', bgColor: 'bg-purple-100' },
        { label: 'Total Alerts', value: metrics.totalAlerts, icon: AlertTriangle, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {metricsData.map((metric, index) => (
                <MetricCard key={index} {...metric} />
            ))}
        </div>
    );
};

export default MetricsPanel;
